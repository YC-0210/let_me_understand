#!/usr/bin/env python3
"""Create portable lesson directories. Never modify the original visualizations."""
import json
import pathlib
import re
import shutil
import sys
from extract_previews import build_previews

ROOT = pathlib.Path(__file__).resolve().parents[2]

def concept(identifier, title, part):
    return dict(id=identifier, title=title, source=f'https://ruslanspivak.com/lsbaws-part{part}/')

REQUEST = concept('http-request-v1', 'An HTTP request identifies what the client is asking for.', 1)
RESPONSE = concept('http-response-v1', 'An HTTP response carries a status and a body back to the client.', 1)
SOCKET = concept('listening-accepted-v1', 'A listening socket accepts connections; an accepted socket serves one connection.', 1)
WSGI = concept('wsgi-contract-v1', 'WSGI lets a server and a Python application work together through a shared interface.', 2)
CONCEPTS = [
    [REQUEST, RESPONSE, SOCKET],
    [REQUEST, RESPONSE, WSGI,
     concept('wsgi-environ-v1', 'The server passes request information to the application in environ.', 2),
     concept('wsgi-response-v1', 'The application supplies status and headers through start_response and returns body data.', 2)],
    [SOCKET, WSGI,
     concept('fork-concurrency-v1', 'A child process can serve a connection while the parent returns to accepting connections.', 3),
     concept('fork-descriptors-v1', 'After fork, parent and child have separate descriptors referring to shared sockets.', 3),
     concept('last-close-v1', 'Closing one descriptor does not close a socket while another reference remains open.', 3),
     concept('reap-child-v1', 'The parent must collect a terminated child’s exit status to release its process-table entry.', 3),
     concept('waitpid-drain-v1', 'Repeated nonblocking waitpid calls collect all currently available child statuses.', 3)]
]

def build(destination):
    destination.mkdir(parents=True, exist_ok=True)
    for number, title in enumerate(['Part 1 · A request and a reply', 'Part 2 · Server meets application', 'Part 3 · Many clients, one server'], 1):
        package = destination / f'part{number}'
        package.mkdir()
        entry = 'index.html'
        if number < 3:
            source = ROOT / ('prototype/part1/ask.html' if number == 1 else 'prototype/part2/mix.html')
            html = re.sub(r'<link\b[^>]*https://fonts\.(?:googleapis|gstatic)\.com[^>]*>', '', source.read_text())
            if number == 1:
                html = '<meta charset="utf-8">\n' + html
            (package / entry).write_text(html)
        else:
            shutil.copytree(ROOT / 'experiment/web', package / 'experiment/web')
            shutil.copytree(ROOT / 'library', package / 'library')
            entry = 'experiment/web/index.html'
        manifest = dict(id=f'part{number}', title=title, version='2026-09-19', entry=entry,
                        route='?guide=course&symbols=phosphor#lessons' if number == 3 else '', concepts=CONCEPTS[number-1])
        (package / 'lesson.json').write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n')
    patterns = [json.loads(p.read_text()) for p in sorted((ROOT / 'library/animation').glob('*.json'))]
    patterns = build_previews(destination, patterns)
    money = ROOT / 'experiment/money-hierarchy'
    shutil.copytree(money, destination / 'money-hierarchy')
    for mode, title in [('hierarchy', 'Move the settlement viewpoint'), ('ledger', 'Trace both sides of a promise'), ('elasticity', 'Trade with an accepted IOU'), ('cycle', 'Separate quantity from moneyness'), ('bridges', 'Connect the monetary layers'), ('policy', 'Trace a liquidity-support loan'), ('dynamics', 'Expand and contract the credit pyramid'), ('overnight', 'Borrow reserves for one night'), ('yield', 'Compare short and long interest rates')]:
        patterns.append(dict(id='M-' + mode, title=title, tags=['economics', mode],
                             communicates='Natural hierarchy of money: ' + title.lower() + '.',
                             preview='money-hierarchy/preview-' + mode + '.html',
                             version='2026-09-20.3', sourceLessonKeys=['money-hierarchy@2026-09-20.3']))
    shutil.copytree(ROOT / 'experiment/money-state', destination / 'money-state')
    for mode, title in [('bank-loan', 'Create a deposit and a debt'), ('reserve-drain', 'Withdraw a correspondent balance'), ('rediscount', 'Exchange a bill for reserves')]:
        patterns.append(dict(id='MS-' + mode, title=title, tags=['economics', 'history', 't-account'],
                             communicates='Money and the state: ' + title.lower() + '.',
                             preview='money-state/preview-' + mode + '.html',
                             version='2026-09-20', sourceLessonKeys=['money-state@2026-09-20']))
    shutil.copytree(ROOT / 'experiment/interest-rate', destination / 'interest-rate')
    patterns.extend(json.loads((ROOT / 'experiment/interest-rate/patterns.json').read_text()))
    (destination / 'patterns.json').write_text(json.dumps(patterns, indent=2) + '\n')

if __name__ == '__main__':
    build(pathlib.Path(sys.argv[1]))
