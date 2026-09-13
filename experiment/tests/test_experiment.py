import copy,json,sys,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'experiment'))
from capture import search_trace
from pipeline import validate,read,cards
class ExperimentTests(unittest.TestCase):
 def test_all_targets_found_without_discarding_target(self):
  for target in range(1,17):
   for binary in [False,True]:
    trace=search_trace(target,binary)
    self.assertTrue(trace[-1]['found']); self.assertEqual(trace[-1]['value'],target)
    for s in trace:
     self.assertLessEqual(s['before'][0],target-1); self.assertGreaterEqual(s['before'][1],target-1)
     if not s['found']:
      self.assertLessEqual(s['remaining'][0],target-1); self.assertGreaterEqual(s['remaining'][1],target-1)
    self.assertLessEqual(len(trace),5 if binary else 16)
 def test_search_counterexample(self):
  self.assertEqual(len(search_trace(1,False)),1)
  self.assertGreater(len(search_trace(1)),1)
 def test_capture_event_order(self):
  for r in read(ROOT/'experiment/runs/server-traces.json'):
   for who in ['A','B']:
    e={e['kind']:e['time'] for e in r['events'] if e['who']==who}
    self.assertLess(e['request'],e['answer']);self.assertLess(e['answer'],e['close'])
    self.assertGreater(e['close']-e['answer'],.5)
 def test_captured_wait_explanation(self):
  runs=read(ROOT/'experiment/runs/server-traces.json')
  def wait(r):
   e={e['kind']:e['time'] for e in r['events'] if e['who']=='B'}
   return e['answer']-e['request']
  for r in runs:
   if r['mode']=='serial' and r['arrival']<.6:self.assertGreater(wait(r),.15)
   else:self.assertLess(wait(r),.1)
 def test_both_plans_and_visual_capabilities(self):
  capabilities={x for c in cards('animation') for x in c['capabilities']}
  for p in (ROOT/'experiment/plans').glob('*.json'):
   plan=read(p);validate(plan)
   for step in plan['steps']:self.assertTrue(set(step['visual_requirements'])<=capabilities)
 def test_rejects_unintroduced_idea(self):
  p=read(ROOT/'experiment/plans/server.json');p['steps'][0]['requires'].append('reference-count')
  with self.assertRaises(ValueError):validate(p)
 def test_rejects_animation_choice_in_teaching(self):
  p=read(ROOT/'experiment/plans/server.json');p['steps'][0]['renderer']='timeline'
  with self.assertRaises(ValueError):validate(p)
 def test_rejects_unknown_teaching_card(self):
  p=read(ROOT/'experiment/plans/server.json');p['steps'][0]['teaching_card']='nonexistent'
  with self.assertRaises(ValueError):validate(p)
if __name__=='__main__':unittest.main()
