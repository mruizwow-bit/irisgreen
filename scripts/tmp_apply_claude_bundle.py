#!/usr/bin/env python3
import base64
import hashlib
import io
import shutil
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUNDLE = ROOT / 'tmp' / 'claude-bundle'
PARTS = ['part00','part01','part02','part03','part04','part05','part06a','part06b','part07','part08']
EXPECTED_SHA256 = '875ea04d90b691e7cd18001b443445aa060454bf0bd1d21b4ee58ece5fa99e68'
TARGETS = [
    'assets/navigation-approved.css',
    'assets/site-v23.css',
    'scripts/connect_tarjetas_iris.py',
    'es/privacidad/index.html',
    'es/lectura-accesible/index.html',
    'es/metodologia/index.html',
    'es/sobre-iris-green/index.html',
    'es/libros/index.html',
    'en/privacy/index.html',
]
KEEP_ATKINSON = '[style*="Atkinson"]{font-family:"IG Zero","Atkinson Hyperlegible",system-ui,sans-serif!important}'

encoded = ''.join((BUNDLE / name).read_text(encoding='utf-8') for name in PARTS)
data = base64.b64decode(encoded, validate=True)
actual = hashlib.sha256(data).hexdigest()
if actual != EXPECTED_SHA256:
    raise SystemExit(f'ZIP reconstruido incorrecto: {actual}')

with zipfile.ZipFile(io.BytesIO(data)) as zf:
    names = set(zf.namelist())
    for rel in TARGETS:
        src = 'web-arreglada/' + rel
        if src not in names:
            raise SystemExit(f'Falta en el paquete: {src}')
        content = zf.read(src).decode('utf-8')
        if rel == 'assets/site-v23.css' and KEEP_ATKINSON not in content:
            anchor = 'html{-webkit-text-size-adjust:100%}'
            if anchor not in content:
                raise SystemExit('No se encontró el ancla de Atkinson en site-v23.css')
            content = content.replace(anchor, anchor + '\n' + KEEP_ATKINSON, 1)
        dst = ROOT / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        dst.write_text(content, encoding='utf-8')

# Comprobaciones de integridad de la tanda.
for rel in TARGETS:
    if not (ROOT / rel).is_file():
        raise SystemExit(f'No se escribió {rel}')
if KEEP_ATKINSON not in (ROOT / 'assets/site-v23.css').read_text(encoding='utf-8'):
    raise SystemExit('Se perdió la corrección de Atkinson del Paso 2')

print('Paquete Claude aplicado:', len(TARGETS), 'archivos')
print('SHA256:', actual)
