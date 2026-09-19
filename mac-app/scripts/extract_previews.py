"""Extract drawing code into independent players; never embed a lesson/gallery page."""
import json
import pathlib
import re
import shutil

ROOT = pathlib.Path(__file__).resolve().parents[2]

STYLE = '''html,body{margin:0;background:#0f1011;color:#f7f8f8;font:13px system-ui;height:100%;overflow:hidden}body{display:flex;flex-direction:column;padding:12px;box-sizing:border-box}#stage{flex:1;min-height:0;position:relative;display:flex;align-items:center;justify-content:center}#svg{width:100%;height:100%;max-height:310px}#scene{width:100%}#ig-wink{display:none}footer{display:flex;align-items:center;gap:12px;padding-top:12px;width:100%;max-width:none;margin:0;border:0}button{font:inherit;border:1px solid #34343a;border-radius:6px;background:#18191a;color:#d0d6e0;padding:6px 12px;cursor:pointer}#position{flex:1;min-width:0;width:auto;max-width:none;accent-color:#5e6ad2}#phase{font-size:12px;color:#8a8f98;margin:4px 0;min-height:16px}button:hover{background:#23252a}button:focus-visible,input:focus-visible{outline:2px solid #5e6ad2;outline-offset:2px}.door,.door-g{pointer-events:none}.candidate-strip{grid-template-columns:repeat(8,1fr)}.candidate{min-width:0}.bar-fill{transition:none}'''
PLAYER = '''
let progress=0.25, active=!matchMedia('(prefers-reduced-motion: reduce)').matches, previous=0;
const playButton=document.getElementById('play'), position=document.getElementById('position');
function paint(){renderPreview(progress);position.value=progress*1000;playButton.textContent=active?'Pause':'Play';document.body.dataset.progress=progress.toFixed(3);}
playButton.onclick=()=>{active=!active;if(progress>=1)progress=0;previous=0;paint();};
document.getElementById('replay').onclick=()=>{progress=0;previous=0;active=true;paint();};
position.oninput=()=>{active=false;progress=Number(position.value)/1000;paint();};
document.addEventListener('visibilitychange',()=>{previous=0;});
function frame(now){if(active&&!document.hidden){if(previous)progress=Math.min(1,progress+(now-previous)/duration);if(progress>=1)active=false;paint();}previous=now;requestAnimationFrame(frame);}
paint();requestAnimationFrame(frame);
'''

def page(script, extra='', viewbox='0 0 900 470'):
    return f'''<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="patterns.css"><style>{STYLE}</style></head><body>
<div id="stage"><svg id="svg" viewBox="{viewbox}" role="img" aria-label="Animation preview"></svg><span id="ig-wink"></span><div id="scene"></div></div>
<input id="scrub" hidden><div id="phase"></div><footer><button id="play">Play</button><button id="replay">Replay</button><input id="position" aria-label="Animation progress" type="range" min="0" max="1000" value="0"></footer>
{extra}<script>{script}\n{PLAYER}</script></body></html>'''

def extract_legacy(part):
    path = ROOT / ('prototype/part1/ask.html' if part == 1 else 'prototype/part2/mix.html')
    script = re.search(r'<script>(.*?)</script>', path.read_text(), re.S)[1]
    if part == 1:
        script = script[:script.index('const DWELL =')]
        start = script.index('function door(')
        end = script.index('function slideDoor(', start)
        script = script[:start] + 'function door(g){return g;}\n' + script[end:]
    else:
        script = script[:script.index('/* what turning a knob changed')]
        start = script.index('function cap(')
        end = script.index('function txt(', start)
        script = script[:start] + 'function cap(p,x,y,s,id,o){return txt(p,x,y,s,o);}\n' + script[end:]
        start = script.index("  if (NARRATION[step])")
        script = script[:start] + "  document.getElementById('phase').innerHTML=STEPS[step][0];\n}\n"
    # Drive the extracted drawing with its authored durations; narration/popovers are omitted.
    script += '''
const durations=STEPS.map(s=>s[1]+300), duration=durations.reduce((a,b)=>a+b,0);
function renderPreview(p){let elapsed=p*duration;step=0;while(step<STEPS.length-1&&elapsed>durations[step]){elapsed-=durations[step++];}sub=STEPS[step][1]?Math.min(1,elapsed/STEPS[step][1]):1;draw();}
document.getElementById('scene').remove();
'''
    return page(script, viewbox='0 0 620 202' if part == 1 else '0 0 740 244')

def build_previews(destination, patterns):
    folder = destination / 'previews'
    folder.mkdir()
    shutil.copyfile(ROOT / 'experiment/web/style.css', folder / 'patterns.css')
    shutil.copyfile(ROOT / 'experiment/web/animations.js', folder / 'animations.js')
    shutil.copyfile(ROOT / 'experiment/web/causal-motion.js', folder / 'causal-motion.js')
    data = json.loads((ROOT / 'experiment/web/data.js').read_text().split('=',1)[1].strip().rstrip(';'))
    for part in [1,2]:
        (folder / f'part{part}.html').write_text(extract_legacy(part))
    legacy = [dict(id=f'P{n}', title=t, tags=['exchange'], communicates='Extracted from the experimental lesson.', preview=f'previews/part{n}.html', sourceLessonKeys=[f'part{n}@2026-09-19']) for n,t in [(1,'Part 1 · Request and reply'),(2,'Part 2 · Server and application')]]
    for pattern in patterns:
        id = pattern['id']
        pattern.update(preview=f'previews/{id}.html', sourceLessonKeys=['part3@2026-09-19'])
        if id in ['A04','A05','A06']:
            mode = dict(A04='oneHandle', A05='wholeWork', A06='drain')[id]
            script = f'''const duration=6000;document.getElementById('scene').remove();
function renderPreview(p){{const state=CausalMotion.render(document.getElementById('svg'),{json.dumps(mode)},p,2,{json.dumps(pattern['title'])},'', 'parent');document.getElementById('phase').textContent=state.status;}}'''
            extra='<script src="causal-motion.js"></script>'
        else:
            inputs = dict(pattern.get('demo', {}))
            if id == 'A02':
                inputs.update(events=[dict(who=w,kind=k,time=t) for w,k,t in [('A','request',0),('A','answer',1),('A','close',6),('B','request',2),('B','answer',3),('B','close',8)]])
            if id == 'A03': inputs.update(trace=data['traces']['13']['binary'])
            change = {'A01':'input.values=[8-4*p,3+4*p].map(x=>Math.round(x));', 'A02':'input.time=p*10;', 'A03':'input.index=Math.floor(p*input.trace.length);'}[id]
            script = f'''const duration=6000, input={json.dumps(inputs)};document.getElementById('svg').remove();
function renderPreview(p){{{change}document.getElementById('scene').innerHTML=Animations[{json.dumps(pattern['renderer'])}](input);}}'''
            extra='<script src="animations.js"></script>'
        (folder / f'{id}.html').write_text(page(script, extra))
    return legacy + patterns
