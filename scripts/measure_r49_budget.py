#!/usr/bin/env python3
"""Measure the incremental public-byte cost of R49 versus the same donor build without R49."""
from __future__ import annotations
import argparse,gzip,json,statistics
from collections import defaultdict
from pathlib import Path

COMMON=[
'assets/ig-r49-transversal.css',
'assets/ig-r49-transversal.js',
'assets/ig-r49-lang-bootstrap.js',
'assets/ig-audience.css',
'assets/ig-audience.js',
'assets/ig-child-safe.js',
]

def need(c,msg):
    if not c: raise AssertionError(msg)

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--baseline',type=Path,required=True);ap.add_argument('--root',type=Path,required=True);ap.add_argument('--out',type=Path,required=True);args=ap.parse_args()
    baseline=args.baseline.resolve();root=args.root.resolve();manifest=json.loads((root/'assets/r49-route-profiles.json').read_text(encoding='utf-8'))
    by=defaultdict(list);missing=[]
    for row in manifest['routes']:
        rel=row['file'];a=baseline/rel;b=root/rel
        if not a.is_file() or not b.is_file():missing.append(rel);continue
        by[row['profile']].append(len(b.read_bytes())-len(a.read_bytes()))
    need(not missing,'baseline/current HTML mismatch: '+','.join(missing[:5]))
    profile={}
    for k,vals in sorted(by.items()):
        profile[k]={'routes':len(vals),'html_delta_bytes':sum(vals),'mean_delta_bytes':round(statistics.mean(vals),1),'median_delta_bytes':round(statistics.median(vals),1),'max_delta_bytes':max(vals),'min_delta_bytes':min(vals)}
    assets={}
    raw_total=gzip_total=0
    for rel in COMMON:
        p=root/rel;need(p.is_file(),'missing common asset '+rel);data=p.read_bytes();gz=len(gzip.compress(data,compresslevel=9));assets[rel]={'raw_bytes':len(data),'gzip_bytes':gz};raw_total+=len(data);gzip_total+=gz
    total_delta=sum(x['html_delta_bytes'] for x in profile.values())
    need(raw_total<100_000,f'common raw JS/CSS budget exceeded: {raw_total}')
    need(gzip_total<35_000,f'common gzip JS/CSS budget exceeded: {gzip_total}')
    need(total_delta<1_500_000,f'R49 HTML delta budget exceeded: {total_delta}')
    out={'version':'R49-1','routes':manifest['total_routes'],'profiles':profile,'html_delta_total_bytes':total_delta,'common_assets':assets,'common_raw_bytes':raw_total,'common_gzip_bytes':gzip_total,'budgets':{'common_raw_lt':100000,'common_gzip_lt':35000,'html_delta_total_lt':1500000},'result':'PASS'}
    args.out.parent.mkdir(parents=True,exist_ok=True);args.out.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(json.dumps(out,ensure_ascii=False))
if __name__=='__main__':main()
