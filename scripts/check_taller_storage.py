#!/usr/bin/env python3
"""Contrato único de guardado del Taller (R47 §14) y protección infantil (R47 §17).

Comprueba, sobre el código fuente de la suite:
  1. ningún fichero de la suite usa localStorage, sessionStorage, IndexedDB ni cookies;
  2. ninguna página del Taller carga la capa antigua con almacenamiento (ig-taller-local-data.js);
  3. cada página del Taller declara data-ig-storage="tab-memory";
  4. cada página declara audience/sensitivity/discovery;
  5. el inventario child-safe existe y no tiene elementos sin clasificar.

Uso: python3 scripts/check_taller_storage.py
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BANNED = re.compile(r'\b(localStorage|sessionStorage|indexedDB|openDatabase)\b|document\.cookie')
LEGACY = 'ig-taller-local-data.js'
errors: list[str] = []

suite = sorted(ROOT.glob('assets/ig-suite*.js')) + sorted(ROOT.glob('assets/ig-childsafe.js'))
for f in suite:
    for i, line in enumerate(f.read_text(encoding='utf-8').splitlines(), 1):
        if BANNED.search(line) and 'try' not in line and 'catch' not in line:
            errors.append(f'{f.relative_to(ROOT)}:{i}: usa almacenamiento del navegador')

pages = sorted(ROOT.glob('es/taller/*/index.html')) + sorted(ROOT.glob('en/workshop/*/index.html'))
pages += [ROOT / 'es/taller/index.html', ROOT / 'en/workshop/index.html']
for f in pages:
    if not f.exists():
        continue
    text = f.read_text(encoding='utf-8')
    rel = f.relative_to(ROOT)
    if LEGACY in text:
        errors.append(f'{rel}: carga la capa antigua con almacenamiento ({LEGACY})')
    if 'data-ig-storage="tab-memory"' not in text:
        errors.append(f'{rel}: sin contrato de guardado data-ig-storage')
    for attr in ('data-ig-audience', 'data-ig-sensitivity', 'data-ig-discovery'):
        if attr not in text:
            errors.append(f'{rel}: sin {attr}')

reg = ROOT / 'assets/data/taller-childsafe.json'
if not reg.exists():
    errors.append('falta assets/data/taller-childsafe.json')
else:
    doc = json.loads(reg.read_text(encoding='utf-8'))
    if doc['totals']['unclassified']:
        errors.append(f"inventario child-safe con {doc['totals']['unclassified']} elementos sin clasificar")
    print(f"inventario child-safe: {doc['totals']['items']} elementos, 0 sin clasificar, "
          f"S1 {doc['totals']['S1']}, S2 {doc['totals']['S2']}")

print(f'{len(suite)} ficheros de la suite y {len(pages)} páginas comprobados: {len(errors)} errores')
for e in errors[:20]:
    print('  ', e)
sys.exit(1 if errors else 0)
