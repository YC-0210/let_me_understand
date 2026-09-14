"""Two-pass library preparation and deterministic lesson assembly. No model API calls."""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
def read(path): return json.loads(path.read_text())
def cards(kind): return [read(p) for p in sorted((ROOT/'library'/kind).glob('*.json'))]
def prepare():
    for path in (ROOT/'experiment/briefs').glob('*.json'):
        brief=read(path)
        ranked=sorted(cards('teaching'),key=lambda c: -len(set(c['tags'])&set(brief['tags'])))
        out={'brief':brief,'instruction':'Author a concrete lesson plan. Introduce prerequisites before using them. Specify visual capabilities, never renderer names. Animation selection happens after this plan.','teaching_examples':ranked}
        (ROOT/'experiment/runs'/f'{brief["id"]}-teaching-context.json').write_text(json.dumps(out,indent=2))
def validate(plan):
    known=set(plan['assumed_knowledge'])
    ids={c['id'] for c in cards('teaching')}
    for step in plan['steps']:
        if 'renderer' in step: raise ValueError('Teaching plans must not choose renderers')
        if step['teaching_card'] not in ids: raise ValueError('Unknown teaching card')
        missing=set(step['requires'])-known
        if missing: raise ValueError(f'Unintroduced prerequisites: {missing}')
        known.update(step['introduces'])
def build():
    plans=[read(p) for p in sorted((ROOT/'experiment/plans').glob('*.json'))]
    for p in plans:
        validate(p)
        p['animation_selections']=[]
        for step in p['steps']:
            for capability in step['visual_requirements']:
                matches=[c for c in cards('animation') if capability in c['capabilities']]
                if not matches: raise ValueError(f'No animation supports {capability}')
                chosen=matches[0]
                p['animation_selections'].append({'step':step['id'],'card':chosen['id'],'renderer':chosen['renderer'],'reason':f'Required capability: {capability}'})
    data={'teaching':cards('teaching'),'animation':cards('animation'),'lessons':plans,'traces':read(ROOT/'experiment/runs/search-traces.json'),'server_traces':read(ROOT/'experiment/runs/server-traces.json'),'part3_evidence':read(ROOT/'experiment/runs/part3-evidence.json'),'server_code':(ROOT/'experiment/complete_server.py').read_text()}
    (ROOT/'experiment/web/data.js').write_text('window.LIBRARY_DATA = '+json.dumps(data)+';\n')
    (ROOT/'experiment/runs/selection-manifest.json').write_text(json.dumps({p['id']:p['animation_selections'] for p in plans},indent=2))
if __name__=='__main__':
    import sys
    if len(sys.argv)>1 and sys.argv[1]=='prepare': prepare()
    else: build()
