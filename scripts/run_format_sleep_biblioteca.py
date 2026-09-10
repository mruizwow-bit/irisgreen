#!/usr/bin/env python3
"""Run the Format + Sleep verification on top of the current Biblioteca publication."""
from __future__ import annotations
import argparse, json, re
from pathlib import Path
import work_format_sleep as w

ROOT=Path(__file__).resolve().parents[1]
w.BASE='9b4021e7bce1fdf3f76a2a542483874d7776de1f'
w.BACKUP='backup/20260910-0836-antes-formato-y-sueno-sobre-biblioteca'

EXPECTED_BUILD_LINE='Biblioteca ES publicada: 48 fichas; revisión 10 de septiembre de 2026.'

def verify_biblioteca():
    root=ROOT/'dist/es/biblioteca'
    index=(root/'index.html').read_text()
    details=sorted(p for p in root.glob('*/index.html') if p.is_file())
    assert len(details)==48, len(details)
    assert index.count('REVISADA')==48, index.count('REVISADA')
    forbidden=['BORRADOR','Página en borrador','Estado:</strong> borrador','content="noindex,follow"']
    problems=[]
    for p in details:
        text=p.read_text()
        for token in forbidden:
            if token in text: problems.append((p.relative_to(ROOT/'dist').as_posix(),token))
        if 'content="index,follow"' not in text: problems.append((p.relative_to(ROOT/'dist').as_posix(),'missing index,follow'))
        if 'Estado:</strong> publicada' not in text: problems.append((p.relative_to(ROOT/'dist').as_posix(),'missing published state'))
        if 'Revisión:</strong> 10 de septiembre de 2026' not in text: problems.append((p.relative_to(ROOT/'dist').as_posix(),'missing review date'))
    assert not problems, problems[:10]
    for log in ['baseline-build.log','changed-build.log']:
        content=(w.OUT/log).read_text()
        assert EXPECTED_BUILD_LINE in content, f'{log}: Biblioteca publisher did not run'
    report={'detail_pages':48,'revisada_cards':48,'index_follow':48,'published_state':48,'review_date':48,'forbidden_markers':0,'build_publisher_line_in_both_builds':True}
    (w.OUT/'biblioteca-check.json').write_text(json.dumps(report,indent=2,ensure_ascii=False))
    return report

def prepare():
    w.prepare()
    report=verify_biblioteca()
    # The source build must keep the two safety passes for Biblioteca.
    build=(ROOT/'scripts/build_site.py').read_text()
    assert build.count("scripts/publish_biblioteca.py") == 2
    print(json.dumps({'biblioteca':report},indent=2,ensure_ascii=False))

def commit():
    verify_biblioteca()
    w.commit()

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('mode',choices=['prepare','commit']);args=ap.parse_args()
    {'prepare':prepare,'commit':commit}[args.mode]()
