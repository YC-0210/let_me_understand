#!/usr/bin/env python3
"""PROTOTYPE - throwaway. runs.json -> fork.data.json, only what the drawing needs.

The one judgement call made here: a client that never got a reply and a client that
got its reply and then waited forever are DIFFERENT failures, and the capture records
enough to tell them apart. webserver3d produces the second. A backlog too small to
hold a burst produces the first. Collapsing them into one word would have hidden the
whole of the article's section on reference counts.
"""
import json, os, statistics

HERE = os.path.dirname(os.path.abspath(__file__))
d = json.load(open(os.path.join(HERE, 'runs.json')))


def classify(c):
    if c.get('error'):
        return 'refused'
    if c.get('firstByte') is None:
        return 'neverServed'          # never reached the front of the queue
    if c.get('eof') is None:
        return 'neverClosed'          # got the reply; the connection stayed open
    return 'finished'


def cell(runs):
    per = []
    for r in runs:
        cs = r.get('clients_seen', [])
        kinds = [classify(c) for c in cs]
        fds = [f['fds'] for f in r.get('fds', [])]
        per.append({
            'finished': kinds.count('finished'),
            'neverClosed': kinds.count('neverClosed'),
            'neverServed': kinds.count('neverServed'),
            'refused': kinds.count('refused'),
            'zombiesLeft': len(r.get('after', {}).get('zombiesLeft', [])),
            'peakZombies': r.get('peakZombies', 0),
            'forked': r.get('forked', 0),
            'fdsEnd': r.get('after', {}).get('fds'),
            'fdsMax': max(fds) if fds else None,
            'lastMs': round(max([c.get('eof') or c.get('firstByte') or 0
                                 for c in cs] or [0]), 1),
            'alive': r.get('serverAlive'),
            'died': 'Traceback' in r.get('stdout', ''),
        })
    keys = ['finished', 'neverClosed', 'neverServed', 'refused', 'zombiesLeft',
            'peakZombies', 'forked', 'fdsEnd', 'fdsMax', 'lastMs']
    out = {k: [p[k] for p in per] for k in keys}
    out['reps'] = len(per)
    out['died'] = any(p['died'] for p in per)
    out['alive'] = all(p['alive'] for p in per)
    # The representative run is the MEDIAN one by clients finished, so the page never
    # shows the luckiest run. Concurrency is not reproducible (the article's own
    # definition, statement #69), and pretending otherwise would be the lie.
    order = sorted(range(len(per)), key=lambda i: (per[i]['finished'], -per[i]['zombiesLeft']))
    pick = order[len(order) // 2]
    r = runs[pick]
    out['rep'] = pick
    out['events'] = r.get('events', [])[:12]
    out['clientRecords'] = [
        {'i': c['i'], 'connect': c.get('connect'), 'firstByte': c.get('firstByte'),
         'eof': c.get('eof'), 'kind': classify(c)}
        for c in r.get('clients_seen', [])][:8]
    out['body'] = next((c.get('body') for c in r.get('clients_seen', []) if c.get('body')), '')
    out['stdout'] = r.get('stdout', '')[:600]
    return out


cells = {}
for r in d['runs']:
    if r.get('diagnostic'):
        continue
    cells.setdefault('%s|%d' % (r['server'], r['clients']), []).append(r)
cells = {k: cell(v) for k, v in cells.items()}

diag = {}
for r in d.get('diagnostics', []):
    diag.setdefault(r['diagnostic'], []).append(r)
diag = {k: cell(v) for k, v in diag.items()}

limit = [r for r in d['runs'] if r.get('nofile')]
out = {
    'servers': d['servers'],
    'clients': d['clients'],
    'delay': d['delay'],
    'repeats': d.get('repeats', 1),
    'python': d.get('python', '').split()[0],
    'cells': cells,
    'diagnostics': diag,
    'limit': [{'nofile': r['nofile'], 'note': r.get('note'),
               'stdout': r.get('stdout', '')[-1200:],
               'summary': cell([r])} for r in limit],
}
json.dump(out, open(os.path.join(HERE, 'fork.data.json'), 'w'), separators=(',', ':'))
print('%d cells, %d diagnostics -> fork.data.json (%d bytes)' % (
    len(cells), len(diag),
    os.path.getsize(os.path.join(HERE, 'fork.data.json'))))
