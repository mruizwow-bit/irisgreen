#!/usr/bin/env python3
"""Merge the audited R02 studies 121–132 into the current published research data.

The delta is stored as deterministic gzip+base64 parts. The decoded JSON must match
the SHA-256 audited from NORMALIZED/estudios-textos.json before it is used.
"""
from __future__ import annotations
import argparse,base64,gzip,hashlib,json
from pathlib import Path

EXPECTED_SHA256="e6abece786cdb35aa495ba9c81a5c3c56ef245a4dc25cc3615c0b50539f7909d"
PARTS=(
 "scripts/data/content-r02-research-121-132.01.b64",
 "scripts/data/content-r02-research-121-132.02.b64",
)
EXPECTED_NUMBERS=list(range(121,133))

def load_delta(repo_root:Path):
 encoded=''.join((repo_root/p).read_text(encoding='utf-8').strip() for p in PARTS)
 raw=gzip.decompress(base64.b64decode(encoded))
 digest=hashlib.sha256(raw).hexdigest()
 assert digest==EXPECTED_SHA256,(digest,EXPECTED_SHA256)
 rows=json.loads(raw.decode('utf-8'))
 assert isinstance(rows,list) and len(rows)==12,len(rows)
 assert [int(r['n']) for r in rows]==EXPECTED_NUMBERS
 for row in rows:
  assert str(row.get('sample_en','')).strip(),row['n']
  assert str(row.get('heading_en','')).strip(),row['n']
 return rows

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True);a=ap.parse_args()
 repo=Path(__file__).resolve().parents[1]
 root=a.root.resolve()
 delta=load_delta(repo)
 p=root/'es/investigacion/estudios-textos.json'
 if not p.is_file():raise FileNotFoundError(p)
 current=json.loads(p.read_text(encoding='utf-8'))
 assert isinstance(current,list) and current,current
 by={int(r['n']):r for r in current}
 before=len(by)
 for row in delta:
  by[int(row['n'])]=row
 merged=[by[n] for n in sorted(by)]
 assert len(merged)==len(by)
 assert all(n in by for n in EXPECTED_NUMBERS)
 p.write_text(json.dumps(merged,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
 print({'status':'PASS','before':before,'after':len(merged),'delta':12,'sha256':EXPECTED_SHA256})
if __name__=='__main__':main()
