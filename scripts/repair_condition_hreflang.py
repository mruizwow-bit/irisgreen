#!/usr/bin/env python3
"""Repara los pares ES/EN de Condiciones que carecen de hreflang.

Solo añade metadatos alternate; no toca el texto editorial ni las clasificaciones.
"""
from __future__ import annotations
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://irisgreen.eu/'
PAIRS = [
    ('es/neurodiversidad/condiciones/arfid/index.html', 'en/neurodiversity/conditions/arfid/index.html'),
    ('es/neurodiversidad/condiciones/autismo/index.html', 'en/neurodiversity/conditions/autism/index.html'),
    ('es/neurodiversidad/condiciones/dislexia/index.html', 'en/neurodiversity/conditions/dyslexia/index.html'),
    ('es/neurodiversidad/condiciones/trastorno-del-desarrollo-de-la-coordinacion-dcd-dispraxia/index.html', 'en/neurodiversity/conditions/developmental-coordination-disorder-dcd-dyspraxia/index.html'),
    ('es/neurodiversidad/condiciones/evitacion-persistente-de-demandas-perfil-pda/index.html', 'en/neurodiversity/conditions/persistent-demand-avoidance-pda-profile/index.html'),
    ('es/neurodiversidad/condiciones/sueno/index.html', 'en/neurodiversity/conditions/sleep/index.html'),
    ('es/neurodiversidad/condiciones/tdah/index.html', 'en/neurodiversity/conditions/adhd/index.html'),
]


def public_url(rel: str) -> str:
    return BASE + rel.removesuffix('index.html')


def ensure(path: Path, es_url: str, en_url: str) -> bool:
    text = path.read_text(encoding='utf-8')
    before = text
    text = re.sub(r'\n?<link\b[^>]*hreflang="(?:es|en|x-default)"[^>]*/?>', '', text, flags=re.I)
    canonical = re.search(r'<link\s+href="[^"]+"\s+rel="canonical"\s*/?>', text, flags=re.I)
    if not canonical:
        canonical = re.search(r'<link\b[^>]*rel="canonical"[^>]*/?>', text, flags=re.I)
    if not canonical:
        raise AssertionError(f'Canonical no encontrado: {path.relative_to(ROOT)}')
    block = (
        f'\n<link href="{es_url}" hreflang="es" rel="alternate"/>'
        f'\n<link href="{en_url}" hreflang="en" rel="alternate"/>'
        f'\n<link href="{es_url}" hreflang="x-default" rel="alternate"/>'
    )
    text = text[:canonical.end()] + block + text[canonical.end():]
    if text != before:
        path.write_text(text, encoding='utf-8')
        return True
    return False


def main() -> None:
    changed = []
    for es_rel, en_rel in PAIRS:
        es = ROOT / es_rel
        en = ROOT / en_rel
        if not es.is_file() or not en.is_file():
            raise FileNotFoundError((es_rel, en_rel))
        es_url, en_url = public_url(es_rel), public_url(en_rel)
        if ensure(es, es_url, en_url): changed.append(es_rel)
        if ensure(en, es_url, en_url): changed.append(en_rel)
    # Confirmar reciprocidad en los 14 documentos.
    for es_rel, en_rel in PAIRS:
        es_url, en_url = public_url(es_rel), public_url(en_rel)
        for rel in (es_rel, en_rel):
            text = (ROOT/rel).read_text(encoding='utf-8')
            assert f'href="{es_url}" hreflang="es"' in text, rel
            assert f'href="{en_url}" hreflang="en"' in text, rel
            assert f'href="{es_url}" hreflang="x-default"' in text, rel
    print({'pairs': len(PAIRS), 'pages_checked': len(PAIRS)*2, 'changed': changed})


if __name__ == '__main__':
    main()
