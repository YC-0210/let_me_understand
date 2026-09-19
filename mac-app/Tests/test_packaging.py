"""Public packaging seam: emitted lesson packages work without the source checkout."""
import json
import pathlib
import subprocess
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[2]

class PackagingTests(unittest.TestCase):
    def test_packages_contain_three_offline_lessons_and_unchanged_animation(self):
        with tempfile.TemporaryDirectory() as output:
            subprocess.run(['python3', str(ROOT / 'mac-app/scripts/package_lessons.py'), output], check=True)
            packages = sorted(pathlib.Path(output).glob('part*'))
            self.assertEqual([p.name for p in packages], ['part1', 'part2', 'part3'])
            for package in packages:
                manifest = json.loads((package / 'lesson.json').read_text())
                self.assertTrue((package / manifest['entry']).is_file())
            part1 = (packages[0] / 'index.html').read_text()
            self.assertIn('<meta charset="utf-8">', part1[:1024])
            self.assertNotIn('fonts.googleapis.com', part1)
            self.assertNotIn('fonts.gstatic.com', part1)
            animation = pathlib.Path('experiment/web/causal-motion.js')
            self.assertEqual((packages[2] / animation).read_bytes(), (ROOT / animation).read_bytes())
            self.assertTrue((packages[2] / 'library/teaching-cs/library.js').is_file())
            self.assertGreaterEqual(len(json.loads((pathlib.Path(output) / 'patterns.json').read_text())), 6)

    def test_animation_previews_are_extracted_players_with_lesson_associations(self):
        with tempfile.TemporaryDirectory() as output:
            subprocess.run(['python3', str(ROOT / 'mac-app/scripts/package_lessons.py'), output], check=True)
            root = pathlib.Path(output)
            patterns = json.loads((root / 'patterns.json').read_text())
            self.assertEqual(len(patterns), 8)
            for pattern in patterns:
                player = (root / pattern['preview']).read_text()
                self.assertIn('id="play"', player)
                self.assertNotIn('<iframe', player)
                self.assertNotIn('data-nav=', player)
                self.assertTrue(pattern['sourceLessonKeys'])
            self.assertIn('function draw()', (root / 'previews/part1.html').read_text())
            self.assertIn('function draw()', (root / 'previews/part2.html').read_text())
            self.assertIn('CausalMotion.render', (root / 'previews/A04.html').read_text())

if __name__ == '__main__':
    unittest.main()
