#!/usr/bin/env python3
"""Gate de cobertura material del Taller.

No valida motores ni contenido. Verifica únicamente el HOLD de Design:
- portada + todas las rutas públicas existentes ES/EN quedan cubiertas;
- cada página lleva el sistema material R02 y el puente Taller;
- las rutas enlazadas desde las dos portadas existen y están cubiertas;
- no se reduce accidentalmente el catálogo público actual.
"""
from __future__ import annotations
import argparse
import re
from pathlib import Path

MAT = '/assets/ig-r42-materials.css?v=r42-design-1'
BRIDGE = '/assets/ig-taller-material-r43.css?v=r43-integration-1'


def pages(root: Path, base: str) -> list[Path]:
    folder = root / base
    out = []
    if (folder / 'index.html').is_file():
        out.append(folder / 'index.html')
    out += sorted(folder.glob('*/index.html'))
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', type=Path, default=Path('.'))
    args = ap.parse_args()
    root = args.root.resolve()

    es = pages(root, 'es/taller')
    en = pages(root, 'en/workshop')
    all_pages = es + en

    # Baseline A2 vigente: portada + 26 rutas por idioma = 54 páginas.
    assert len(es) >= 27, f'Cobertura ES incompleta: {len(es)}'
    assert len(en) >= 27, f'Cobertura EN incompleta: {len(en)}'
    assert len(es) == len(en), (len(es), len(en))

    for p in all_pages:
        s = p.read_text(encoding='utf-8')
        assert 'data-ig-materials="r42"' in s, p
        assert MAT in s, p
        assert BRIDGE in s, p

    for lang, base, prefix in (
        ('es', 'es/taller', '/es/taller/'),
        ('en', 'en/workshop', '/en/workshop/'),
    ):
        hub = (root / base / 'index.html').read_text(encoding='utf-8')
        hrefs = sorted(set(re.findall(r'href="(' + re.escape(prefix) + r'[^"?#]+/)"', hub)))
        assert hrefs, f'{lang}: portada sin rutas de estudios'
        for href in hrefs:
            p = root / href.strip('/') / 'index.html'
            assert p.is_file(), (href, 'missing')
            s = p.read_text(encoding='utf-8')
            assert 'data-ig-materials="r42"' in s, (href, 'uncovered')
            assert MAT in s and BRIDGE in s, (href, 'missing material assets')

    print({
        'status': 'PASS',
        'workshop_pages': len(all_pages),
        'es_pages': len(es),
        'en_pages': len(en),
        'visible_routes_checked': True,
        'scope': 'interface/material only',
    })


if __name__ == '__main__':
    main()
