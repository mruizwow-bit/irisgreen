#!/usr/bin/env python3
from pathlib import Path
import argparse,html,re

FORBIDDEN={
  'cada ficha dice',
  'aquí puedes ver',
  'esta página describe',
  'sin rankings',
  'lo guardas tú',
  'each entry says',
  'here you can see',
  'this page describes',
  'without rankings',
  'you keep it',
}
SCRIPT_STYLE=re.compile(r'<(?:script|style)\b[^>]*>.*?</(?:script|style)>',re.I|re.S)
TAGS=re.compile(r'<[^>]+>')
SPACE=re.compile(r'\s+')

def visible_text(raw):
    raw=SCRIPT_STYLE.sub(' ',raw)
    raw=TAGS.sub(' ',raw)
    return SPACE.sub(' ',html.unescape(raw)).strip().lower()

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True)
    root=ap.parse_args().root.resolve()
    bad=[]
    checked=0
    for base in (root/'es',root/'en'):
        if not base.is_dir(): continue
        for p in base.rglob('*.html'):
            checked+=1
            txt=visible_text(p.read_text(encoding='utf-8'))
            hits=sorted(x for x in FORBIDDEN if x in txt)
            if hits: bad.append((p.relative_to(root).as_posix(),hits))
    for p in (root/'index.html',root/'en'/'index.html'):
        if p.is_file():
            checked+=1
            txt=visible_text(p.read_text(encoding='utf-8'))
            hits=sorted(x for x in FORBIDDEN if x in txt)
            if hits: bad.append((p.relative_to(root).as_posix(),hits))
    if bad:
        raise AssertionError('Redundant explanatory copy remains: '+repr(bad[:30]))
    print({'gate':'ISSUE_369_P45_REDUNDANT_EXPLANATORY_COPY_PASS','html_checked':checked,'hits':0})

if __name__=='__main__':main()
