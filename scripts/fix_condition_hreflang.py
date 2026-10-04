#!/usr/bin/env python3
"""Publica hreflang para las parejas ES/EN de Condiciones declaradas en buscador.json.

No deduce traducciones por título ni por slug. La única fuente de pairing es el
inventario bilingüe explícito ya usado por la búsqueda pública.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://irisgreen.eu"
EXPECTED_PAIRS = 185
ALT = re.compile(
    r"\s*<link\b(?=[^>]*\brel=[\"'][^\"']*\balternate\b[^\"']*[\"'])(?=[^>]*\bhreflang=[\"'](?:es(?:-ES)?|en(?:-GB)?|x-default)[\"'])[^>]*>\s*",
    re.I,
)


def file_for(root: Path, url: str) -> Path:
    path = urlsplit(url).path
    rel = path.lstrip("/")
    if path.endswith("/"):
        rel += "index.html"
    elif not Path(rel).suffix:
        rel += "/index.html"
    return root / rel


def block(es_url: str, en_url: str) -> str:
    es = SITE + urlsplit(es_url).path
    en = SITE + urlsplit(en_url).path
    return (
        f'<link rel="alternate" hreflang="es" href="{es}">\n'
        f'<link rel="alternate" hreflang="en" href="{en}">\n'
        f'<link rel="alternate" hreflang="x-default" href="{es}">\n'
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
    ap.add_argument("--root", type=Path, default=ROOT / "dist")
    args = ap.parse_args()
    root = args.root.resolve()

    data = json.loads((ROOT / "buscador.json").read_text(encoding="utf-8"))
    pairs = []
    for row in data:
        if row.get("s") != "Condición":
            continue
        en = row.get("en") or {}
        es_url, en_url = row.get("u"), en.get("u")
        if not es_url or not en_url:
            raise ValueError("Condición sin pareja ES/EN explícita: " + repr(row.get("t")))
        es_file, en_file = file_for(root, es_url), file_for(root, en_url)
        if not es_file.is_file() or not en_file.is_file():
            raise FileNotFoundError(f"Pareja incompleta: {es_url} / {en_url}")
        pairs.append((es_url, en_url, es_file, en_file))

    if len(pairs) != EXPECTED_PAIRS:
        raise ValueError(f"Inventario de Condiciones cambiado: {len(pairs)} != {EXPECTED_PAIRS}")

    # Pairing must remain one-to-one: no ES or EN route may be assigned twice.
    es_urls = [p[0] for p in pairs]
    en_urls = [p[1] for p in pairs]
    if len(set(es_urls)) != len(es_urls) or len(set(en_urls)) != len(en_urls):
        raise ValueError("Parejas de Condiciones no son uno-a-uno en buscador.json")

    changed = 0
    for es_url, en_url, es_file, en_file in pairs:
        tags = block(es_url, en_url)
        changed += int(patch(es_file, tags))
        changed += int(patch(en_file, tags))

    for es_url, en_url, es_file, en_file in pairs:
        expected = {
            "es": SITE + urlsplit(es_url).path,
            "en": SITE + urlsplit(en_url).path,
            "x-default": SITE + urlsplit(es_url).path,
        }
        for path in (es_file, en_file):
            text = path.read_text(encoding="utf-8", errors="strict")
            got = {}
            for lang, href in re.findall(
                r'<link\b[^>]*\bhreflang=[\"\']([^\"\']+)[\"\'][^>]*\bhref=[\"\']([^\"\']+)[\"\'][^>]*>',
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
        "condiciones_parejas": len(pairs),
        "paginas": len(pairs) * 2,
        "html_actualizados": changed,
        "pair_source": "buscador.json",
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
