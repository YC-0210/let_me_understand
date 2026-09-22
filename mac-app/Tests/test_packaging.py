"""Public packaging seam: emitted lesson packages work without the source checkout."""
import json
import pathlib
import subprocess
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[2]

class PackagingTests(unittest.TestCase):
    def test_money_state_lesson_and_its_players_travel_offline(self):
        with tempfile.TemporaryDirectory() as output:
            subprocess.run(['python3', str(ROOT / 'mac-app/scripts/package_lessons.py'), output], check=True)
            root = pathlib.Path(output)
            lesson = root / 'money-state'
            manifest = json.loads((lesson / 'lesson.json').read_text())
            self.assertEqual(manifest['id'], 'money-state')
            self.assertTrue((lesson / manifest['entry']).is_file())
            import re
            for page in lesson.glob('*.html'):
                for asset in re.findall(r'(?:src|href)="([^"#?]+)"', page.read_text()):
                    if not asset.startswith(('https:', 'http:')):
                        self.assertTrue((lesson / asset).is_file(), asset)
            patterns = json.loads((root / 'patterns.json').read_text())
            linked = [p for p in patterns if 'money-state@2026-09-20' in p['sourceLessonKeys']]
            self.assertEqual(len(linked), 3)
            for pattern in linked:
                player = (root / pattern['preview']).read_text()
                self.assertIn('id="play"', player)
                self.assertNotIn('<iframe', player)

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

    def test_money_experiment_is_offline_and_has_linked_animation_players(self):
        with tempfile.TemporaryDirectory() as output:
            subprocess.run(['python3', str(ROOT / 'mac-app/scripts/package_lessons.py'), output], check=True)
            root = pathlib.Path(output)
            lesson = root / 'money-hierarchy'
            manifest = json.loads((lesson / 'lesson.json').read_text())
            self.assertTrue((lesson / manifest['entry']).is_file())
            self.assertGreaterEqual(len(manifest['concepts']), 6)
            self.assertEqual(manifest['version'], '2026-09-20.3')
            plan = json.loads((lesson / 'course-plan.js').read_text().split('=', 1)[1].strip().rstrip(';'))
            self.assertEqual(len(plan), 46)
            self.assertEqual([i + 1 for i, step in enumerate(plan) if step.get('recap')], [8, 15, 30, 46])
            # All local HTML dependencies must travel with the package.
            import re
            for page in lesson.glob('*.html'):
                for asset in re.findall(r'(?:src|href)="([^"#?]+)"', page.read_text()):
                    if not asset.startswith(('https:', 'http:')):
                        self.assertTrue((lesson / asset).is_file(), asset)
            patterns = json.loads((root / 'patterns.json').read_text())
            linked = [p for p in patterns if 'money-hierarchy@2026-09-20.3' in p['sourceLessonKeys']]
            self.assertEqual(len(linked), 9)
            for pattern in linked:
                path = root / pattern['preview'].split('?')[0]
                self.assertTrue(path.is_file())
                self.assertNotIn('<iframe', path.read_text())

    def test_animation_previews_are_extracted_players_with_lesson_associations(self):
        with tempfile.TemporaryDirectory() as output:
            subprocess.run(['python3', str(ROOT / 'mac-app/scripts/package_lessons.py'), output], check=True)
            root = pathlib.Path(output)
            patterns = json.loads((root / 'patterns.json').read_text())
            self.assertGreaterEqual(len(patterns), 20)
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
