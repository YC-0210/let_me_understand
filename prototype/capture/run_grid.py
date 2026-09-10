#!/usr/bin/env python3
"""PROTOTYPE - throwaway. Runs every switch combination, collects real traces."""
import itertools, json, os, signal, subprocess, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
N_CONN = 40

AXES = {
    'fork':          [True, False],
    'parent_closes': [True, False],
    'reap':          ['none', 'wait', 'waitpid_nohang'],
    'eintr_safe':    [True, False],
}

def run(sw, out):
    srv = subprocess.Popen([sys.executable, os.path.join(HERE, 'server.py'),
                            json.dumps(sw), out],
                           stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    port = int(srv.stdout.readline().strip())
    subprocess.run([sys.executable, os.path.join(HERE, 'client.py'),
                    str(port), str(N_CONN)],
                   capture_output=True, text=True, timeout=120)
    time.sleep(0.4)
    srv.send_signal(signal.SIGTERM)
    try:
        srv.wait(timeout=10)
    except subprocess.TimeoutExpired:
        srv.kill(); srv.wait()
    return json.load(open(out))

def main():
    outdir = os.path.join(HERE, 'traces'); os.makedirs(outdir, exist_ok=True)
    keys = list(AXES)
    combos = [dict(zip(keys, v)) for v in itertools.product(*AXES.values())]
    grid = []
    for i, sw in enumerate(combos):
        cid = 'c%02d' % i
        print('%s %s' % (cid, sw), flush=True)
        tr = run(sw, os.path.join(outdir, cid + '.json'))
        tr['id'] = cid
        grid.append(tr)
    json.dump(grid, open(os.path.join(HERE, 'grid.json'), 'w'))
    print('cells: %d' % len(grid))

main()
