#!/usr/bin/env python3
"""R43 Taller · gate de cobertura material para todas las rutas públicas ES/EN."""
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
LOADER=ROOT/"assets/ig-taller-estudio.js"

def main():
    js=LOADER.read_text(encoding="utf-8")
    required=[
        "data-ig42-materials",
        "/assets/ig-r42-materials.css?v=r42-design-1",
        "document.body.dataset.igMaterials = 'r42'",
        "document.body.dataset.igR42Family = 'workshop'",
    ]
    for token in required:
        assert token in js, token

    rows=[]
    for lang,root in (("es",ROOT/"es/taller"),("en",ROOT/"en/workshop")):
        pages=[root/"index.html"]+sorted(p/"index.html" for p in root.iterdir() if p.is_dir() and (p/"index.html").exists())
        for page in pages:
            text=page.read_text(encoding="utf-8")
            rel=page.relative_to(ROOT).as_posix()
            assert "/assets/ig-taller-estudio.js" in text, f"{rel}: no common Taller runtime"
            rows.append(rel)
        assert len(pages)==27, (lang,len(pages),[p.relative_to(ROOT).as_posix() for p in pages])

    assert len(rows)==54, len(rows)
    print("R43_TALLER_DESIGN_ADAPTATION_COVERAGE_FIXED_READY_FOR_ASTRA")
    print(f"54/54 public Taller routes covered (27 ES + 27 EN), including both hubs.")

if __name__=="__main__":
    main()
