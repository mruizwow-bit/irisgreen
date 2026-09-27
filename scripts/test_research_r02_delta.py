#!/usr/bin/env python3
from __future__ import annotations
import argparse,json
from pathlib import Path
from apply_research_r02_delta import EXPECTED_NUMBERS,EXPECTED_SHA256,load_delta

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True);a=ap.parse_args()
 repo=Path(__file__).resolve().parents[1]
 delta=load_delta(repo)
 assert len(delta)==12
 assert [r['n'] for r in delta]==EXPECTED_NUMBERS
 # English corrections that were specifically wrong in R01.
 for r in delta:
  assert r['sample_en']!=r['sample'],r['n']
 for n in (123,124,126,130):
  r=next(x for x in delta if x['n']==n)
  assert r.get('authors_en') and r['authors_en']!=r['authors'],n

 root=a.root.resolve();p=root/'es/investigacion/estudios-textos.json';assert p.is_file(),p
 data=json.loads(p.read_text(encoding='utf-8'));by={int(r['n']):r for r in data}
 # After Child Safety split, the total public safe dataset can be 126; all twelve
 # new studies must nevertheless be present because none of 121–132 is S2.
 for row in delta:
  assert by.get(int(row['n']))==row,row['n']
 print('R02_RESEARCH_121_132_PASS',{'records':len(data),'delta_sha256':EXPECTED_SHA256})
if __name__=='__main__':main()
