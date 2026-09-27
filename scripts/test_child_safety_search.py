#!/usr/bin/env python3
from __future__ import annotations
import argparse, json, subprocess, sys, tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--root",type=Path,default=ROOT)
    a=ap.parse_args()
    root=a.root.resolve()
    intentional=root/"assets/content-safety/search-intentional-safe.json"
    js=root/"assets/buscador-comun.js"
    assert intentional.is_file()
    rows=json.loads(intentional.read_text(encoding="utf-8"))
    assert len(rows)==8
    assert all(r["sensitivity"]=="S2_HIGH_SENSITIVITY" for r in rows)
    code=js.read_text(encoding="utf-8")
    assert "/assets/content-safety/search-safe-default.json" in code
    assert "mode === 'adult'" in code and "? '/buscador.json'" in code
    assert "intentionalMatch" in code
    assert "q === value._title" in code
    assert "search-adult-full-catalog.json" not in code

    safe=root/"assets/content-safety/search-safe-default.json"
    if safe.is_file():
        data=json.loads(safe.read_text(encoding="utf-8"))
        full=json.loads((root/"buscador.json").read_text(encoding="utf-8"))
        def clean(v):
            return str(v or "").split("#",1)[0].split("?",1)[0].rstrip("/") or "/"
        full_urls=set()
        for item in full:
            full_urls.add(clean(item.get("u")))
            en=item.get("en") if isinstance(item.get("en"),dict) else {}
            full_urls.add(clean(en.get("u")))
        present=[r for r in rows if clean(r["url_es"]) in full_urls or clean(r["url_en"]) in full_urls]
        assert len(data)==len(full)-len(present), (len(full),len(data),len(present))
        blob=json.dumps(data,ensure_ascii=False)
        for r in present:
            assert r["url_es"] not in blob and r["url_en"] not in blob

    print("R42_CHILD_SAFE_SEARCH_CONTRACT_PASS")

if __name__=="__main__":
    main()
