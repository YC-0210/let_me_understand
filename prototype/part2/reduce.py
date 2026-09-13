#!/usr/bin/env python3
"""PROTOTYPE - throwaway. runs.json -> mix.data.json, only what the drawing needs."""
import json, re, os
HERE = os.path.dirname(os.path.abspath(__file__))

def dechunk(body):
    """RFC 9112 chunked body -> the bytes the application actually returned."""
    out, rest = '', body
    while True:
        m = re.match(r'([0-9a-fA-F]+)[^\r\n]*\r\n', rest)
        if not m:
            break
        n = int(m.group(1), 16)
        rest = rest[m.end():]
        if n == 0:
            break
        out += rest[:n]
        rest = rest[n:]
        if rest.startswith('\r\n'):
            rest = rest[2:]
    return out

d = json.load(open(os.path.join(HERE, 'runs.json')))
shared = sorted(set.intersection(*[set(r['environ']) for r in d['runs']]))
out = {'servers': d['servers'], 'apps': d['apps'], 'shared': shared, 'runs': {}}
for r in d['runs']:
    head, body = r['response'].split('\r\n\r\n', 1)
    hdrs = [h.split(': ', 1) for h in head.split('\r\n')[1:] if ': ' in h]
    chunked = any(k.lower() == 'transfer-encoding' and 'chunked' in v.lower() for k, v in hdrs)
    out['runs']['%s|%s' % (r['server'], r['app'])] = {
        'ok': r['ok'], 'status': r['status'], 'appHeaders': r['headers'],
        'statusLine': head.split('\r\n')[0], 'respHeaders': hdrs,
        'body': dechunk(body) if chunked else body,
        'wire': body if chunked else None,
        'chunked': chunked,
        'environ': r['environ'],
        'extra': sorted(set(r['environ']) - set(shared)),
    }
json.dump(out, open(os.path.join(HERE, 'mix.data.json'), 'w'), separators=(',', ':'))
print('%d runs, %d shared keys -> mix.data.json' % (len(out['runs']), len(shared)))
