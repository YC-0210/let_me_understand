"""Interest experiment and extracted players must travel as a self-contained package."""
import json
import pathlib
import re
import subprocess
import tempfile
import unittest
ROOT = pathlib.Path(__file__).resolve().parents[2]
class InterestPackagingTests(unittest.TestCase):
    def test_interest_rate_installs_offline_with_four_players(self):
        with tempfile.TemporaryDirectory() as output:
            subprocess.run(['python3', str(ROOT/'mac-app/scripts/package_lessons.py'), output],check=True)
            root=pathlib.Path(output)
            lesson=root/'interest-rate'
            manifest=json.loads((lesson/'lesson.json').read_text())
            self.assertEqual(manifest['title'],'Interest rate')
            self.assertTrue((lesson/manifest['entry']).exists())
            for page in lesson.glob('*.html'):
                for link in re.findall(r'(?:src|href)="([^"#?]+)"',page.read_text()):
                    if not link.startswith(('https:','http:')):
                        self.assertTrue((lesson/link).is_file(),link)
            patterns=json.loads((root/'patterns.json').read_text())
            mine=[p for p in patterns if p['id'].startswith('IR-')]
            self.assertEqual(len(mine),4)
            for pattern in mine:
                page=(root/pattern['preview']).read_text()
                self.assertIn('id="play"',page)
                self.assertNotIn('<iframe',page)
                self.assertEqual(pattern['sourceLessonKeys'],['interest-rate@2026-09-20'])
