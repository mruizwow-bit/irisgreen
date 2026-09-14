#!/usr/bin/env python3
"""Publica hreflang solo para las siete parejas de Condiciones ya existentes.

Las parejas están declaradas explícitamente y ambas rutas existen en ES y EN.
No deduce traducciones ni crea páginas nuevas.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

SITE = "https://irisgreen.eu"
PAIRS = [
    ("/es/neurodiversidad/condiciones/tdah/", "/en/neurodiversity/conditions/adhd/"),
    ("/es/neurodiversidad/condiciones/autismo/", "/en/neurodiversity/conditions/autism/"),
    ("/es/neurodiversidad/condiciones/dislexia/", "/en/neurodiversity/conditions/dyslexia/"),
    ("/es/neurodiversidad/condiciones/arfid/", "/en/neurodiversity/conditions/arfid/"),
    ("/es/neurodiversidad/condiciones/evitacion-persistente-de-demandas-perfil-pda/", "/en/neurodiversity/conditions/persistent-demand-avoidance-pda-profile/"),
    ("/es/neurodiversidad/condiciones/sueno/", "/en/neurodiversity/conditions/sleep/"),
    ("/es/neurodiversidad/condiciones/trastorno-del-desarrollo-de-la-coordinacion-dcd-dispraxia/", "/en/neurodiversity/conditions/developmental-coordination-disorder-dcd-dyspraxia/"),
]
ALT = re.compile(
    r"\s*<link\b(?=[^>]*\brel=[\"'][^\"']*\balternate\b[^\"']*[\"'])(?=[^>]*\bhreflang=[\"'](?:es(?:-ES)?|en(?:-GB)?|x-default)[\"'])[^>]*>\s*",
    re.I,
)


def file_for(root: Path, url: str) -> Path:
    return root / url.lstrip("/") / "index.html"


def block(es_url: str, en_url: str) -> str:
    return (
        f'<link rel="alternate" hreflang="es" href="{SITE}{es_url}">\n'
        f'<link rel="alternate" hreflang="en" href="{SITE}{en_url}">\n'
        f'<link rel="alternate" hreflang="x-default" href="{SITE}{es_url}">\n'
    )


def patch(path: Path, tags: str) -> bool:
    old = path.read_text(encoding="utf-8", errors="strict")
    text = ALT.sub("\n", old)
    pos = text.lower().rfind("</head>")
    if pos < 0:
        raise ValueError(f"HTML sin </head>: {path}")
    text = text[:pos] + "\n" + tags + text[pos:]
    if text == old:
        return False
    path.write_text(text, encoding="utf-8")
    return True


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path("dist"))
    args = ap.parse_args()
    root = args.root.resolve()

    changed = 0
    for es_url, en_url in PAIRS:
        es_file = file_for(root, es_url)
        en_file = file_for(root, en_url)
        if not es_file.is_file() or not en_file.is_file():
            raise FileNotFoundError(f"Pareja incompleta: {es_url} / {en_url}")
        tags = block(es_url, en_url)
        changed += int(patch(es_file, tags))
        changed += int(patch(en_file, tags))

    for es_url, en_url in PAIRS:
        expected = {
            "es": SITE + es_url,
            "en": SITE + en_url,
            "x-default": SITE + es_url,
        }
        for path in (file_for(root, es_url), file_for(root, en_url)):
            text = path.read_text(encoding="utf-8", errors="strict")
            got = {}
            for lang, href in re.findall(
                r'<link\b[^>]*\bhreflang=["\']([^"\']+)["\'][^>]*\bhref=["\']([^"\']+)["\'][^>]*>',
                text,
                re.I,
            ):
                base = lang.split("-", 1)[0]
                key = "x-default" if lang == "x-default" else base
                if key in expected:
                    if key in got:
                        raise AssertionError(f"hreflang duplicado {key}: {path}")
                    got[key] = href
            if got != expected:
                raise AssertionError(f"hreflang incorrecto en {path}: {got}")

    print(json.dumps({
        "condiciones_parejas": len(PAIRS),
        "paginas": len(PAIRS) * 2,
        "html_actualizados": changed,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
