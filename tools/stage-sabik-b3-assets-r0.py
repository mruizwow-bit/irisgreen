#!/usr/bin/env python3
"""Stage the frozen B3 R0 runtime asset package after verifying every byte.

Usage:
  python tools/stage-sabik-b3-assets-r0.py /path/to/extracted/SABIK_B3_RUNTIME_ASSETS_R0
"""
from __future__ import annotations
import argparse, hashlib, json, shutil
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
MANIFEST=ROOT/'sabik/assets/b3/ASSET_MANIFEST.json'

def sha256(path:Path)->str:
    h=hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda:f.read(1024*1024),b''):h.update(chunk)
    return h.hexdigest()

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('source',type=Path)
    ap.add_argument('--verify-only',action='store_true')
    args=ap.parse_args()
    data=json.loads(MANIFEST.read_text(encoding='utf-8'))
    src=args.source.resolve()
    target=ROOT/data['target_directory']
    checked=[]
    for item in data['files']:
        p=src/item['file']
        if not p.is_file(): raise FileNotFoundError(p)
        if p.stat().st_size!=item['bytes']: raise AssertionError(f"Size mismatch: {item['file']}")
        got=sha256(p)
        if got!=item['sha256']: raise AssertionError(f"SHA-256 mismatch: {item['file']}: {got}")
        checked.append(item['file'])
    if not args.verify_only:
        target.mkdir(parents=True,exist_ok=True)
        for name in checked: shutil.copy2(src/name,target/name)
    print(f"SABIK_B3_RUNTIME_ASSETS_R0_PASS {len(checked)} files"+(" verify-only" if args.verify_only else " staged"))

if __name__=='__main__':main()
