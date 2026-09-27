#!/usr/bin/env python3
"""Build the safe-by-default search index before publication.

Source authority for S2 discovery:
assets/content-safety/search-intentional-safe.json
(a projection of the audited R02 Child-Safe package).

The public safe index is built BEFORE the browser sees results. It excludes every
S2 search route from buscador.json rather than downloading the adult catalogue and
hiding results after render.
"""
from __future__ import annotations
import argparse, json
from pathlib import Path

EXPECTED_S2_SEARCH = 8

def clean_url(value: str) -> str:
    value=str(value or "").split("#",1)[0].split("?",1)[0]
    return value.rstrip("/") or "/"

def main() -> None:
    ap=argparse.ArgumentParser()
    ap.add_argument("--root",type=Path,required=True)
    args=ap.parse_args()
    root=args.root.resolve()

    full_path=root/"buscador.json"
    intentional_path=root/"assets/content-safety/search-intentional-safe.json"
    out_path=root/"assets/content-safety/search-safe-default.json"

    full=json.loads(full_path.read_text(encoding="utf-8"))
    intentional=json.loads(intentional_path.read_text(encoding="utf-8"))
    assert isinstance(full,list) and len(full) >= EXPECTED_S2_SEARCH, len(full)
    assert isinstance(intentional,list) and len(intentional)==EXPECTED_S2_SEARCH, len(intentional)

    sensitive=set()
    for row in intentional:
        assert row.get("sensitivity")=="S2_HIGH_SENSITIVITY", row.get("id")
        assert row.get("discovery")=="SAFE_VARIANT_REQUIRED", row.get("id")
        for key in ("url_es","url_en"):
            value=row.get(key)
            assert isinstance(value,str) and value.startswith("/"), (row.get("id"),key)
            sensitive.add(clean_url(value))

    safe=[]
    removed=[]
    for row in full:
        urls={clean_url(row.get("u",""))}
        en=row.get("en") if isinstance(row.get("en"),dict) else {}
        urls.add(clean_url(en.get("u","")))
        if any(u in sensitive for u in urls):
            removed.append(row)
        else:
            safe.append(row)

    assert len(removed)==EXPECTED_S2_SEARCH, {
        "removed": len(removed),
        "full": len(full),
        "message": "Every audited S2 search entity must be removed from the current catalogue."
    }
    assert len(safe)==len(full)-EXPECTED_S2_SEARCH, (len(full),len(safe))
    for row in safe:
        urls={clean_url(row.get("u",""))}
        en=row.get("en") if isinstance(row.get("en"),dict) else {}
        urls.add(clean_url(en.get("u","")))
        assert not (urls & sensitive), row.get("u")

    out_path.parent.mkdir(parents=True,exist_ok=True)
    out_path.write_text(json.dumps(safe,ensure_ascii=False,separators=(",",":"))+"\n",encoding="utf-8")
    print({"status":"PASS","full":len(full),"s2_removed":len(removed),"safe":len(safe),"output":out_path.as_posix()})

if __name__=="__main__":
    main()
