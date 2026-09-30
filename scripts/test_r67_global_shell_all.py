#!/usr/bin/env python3
"""R67 Aura · static contract for transversal global shell."""
from __future__ import annotations
import argparse,re,json
from pathlib import Path

REQ=(
 "/assets/ig-global-ui-tokens-2026.css",
 "/assets/ig-r49-transversal.css",
 "/assets/ig-r49-lang-bootstrap.js",
 "/assets/ig-audience.js",
 "/assets/ig-r49-transversal.js",
)
def main():
 ap=argparse.ArgumentParser();ap.add_argument("--root",type=Path,required=True);root=ap.parse_args().root.resolve()
 pages=[]
 for base in (root/"es",root/"en"):
  if base.is_dir():pages.extend(p for p in base.rglob("*.html") if p.is_file())
 checked=0;missing=[]
 for p in sorted(set(pages)):
  s=p.read_text(encoding="utf-8")
  rel=p.relative_to(root).as_posix()
  if 'data-ig-home-version="v4"' in s:continue
  if re.search(r'<meta\b[^>]*name=["\']robots["\'][^>]*content=["\'][^"\']*noindex',s,re.I) and any(x in rel.lower() for x in ("imprimir","print","sprite","preview","qa/")):continue
  checked+=1
  if 'data-ig-r49="1"' not in s or 'name="ig-r67-global-shell"' not in s:missing.append(rel);continue
  for asset in REQ:
   if s.count(asset)!=1:missing.append(rel+"::"+asset)
 if missing:raise AssertionError("Global shell missing/duplicate: "+", ".join(missing[:12]))
 js=(root/"assets/ig-r49-transversal.js").read_text(encoding="utf-8")
 for token in ("AGE_0_12","AGE_13_17","AGE_18_PLUS","ALL_AGES"):
  if token not in js:raise AssertionError("Canonical age state missing in R49: "+token)
 for old in ("'Infancia'","'Adolescencia'","'Adultez'","'Cualquier edad'","'Children'","'Teenagers'","'Adults'","'Any age'"):
  if old in js:raise AssertionError("Legacy age label remains in R49 picker: "+old)
 print(json.dumps({"global_shell":"PASS","pages":checked,"canonical_age_labels":"PASS"},ensure_ascii=False))
if __name__=="__main__":main()
