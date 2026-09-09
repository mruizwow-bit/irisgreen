"""Recover reviewed corrections on an isolated branch; never deploy."""
import base64
import hashlib
import io
import json
from pathlib import Path
import re
import subprocess
import tarfile
import tempfile
import zlib

BASE = '7e189bd5012bbbca34dc81bef55b6625b4610437'
UPLOAD = '78cd2c7ddfabe0d95300072bf4976d4234ca5507'
ROOT = Path.cwd()
OUT = Path('/tmp/iris-recuperacion-verificada')
OUT.mkdir(parents=True, exist_ok=True)

def original(ref, path):
    return subprocess.check_output(['git', 'show', ref + ':' + path])

def blob(sha):
    return subprocess.check_output(['git', 'cat-file', 'blob', sha])

def write(path, data):
    dest = ROOT / path
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data.encode('utf-8') if isinstance(data, str) else data)

def once(text, old, new):
    if text.count(old) != 1:
        raise ValueError('Unexpected source anchor: ' + old[:90])
    return text.replace(old, new, 1)

manifest = original(UPLOAD, '.upload-arreglos/expected-sha256.txt').decode()
expected = {line.split(None, 1)[1].strip(): line.split(None, 1)[0] for line in manifest.splitlines() if line.strip()}
assert len(expected) == 34
# Only the first four intact chunks are read. Each member is checked separately.
encoded = ''.join(original(UPLOAD, f'.upload-arreglos/manual-{i:02}.txt').decode().strip() for i in range(1, 5))
partial = zlib.decompressobj(31).decompress(base64.b64decode(encoded, validate=True))
with tarfile.open(fileobj=io.BytesIO(partial), mode='r|') as archive:
    for path in ('VERSION.txt', 'llms.txt', 'index.html'):
        member = archive.next()
        assert member and member.name == path and member.isfile()
        data = archive.extractfile(member).read()
        assert hashlib.sha256(data).hexdigest() == expected[path], path
        write(path, data)
write('es/neurodiversidad/mapa/index.html', original(UPLOAD, 'es/neurodiversidad/mapa/index.html'))
with tempfile.TemporaryDirectory() as temporary:
    for script in ('arreglar-menu-en.js', 'generar-entradas-buscador.js'):
        p = Path(temporary) / script
        p.write_bytes(original(UPLOAD, '.upload-arreglos/' + script))
        subprocess.run(['node', str(p)], check=True, cwd=ROOT)

path = 'en/everyday-life/index.html'
s = original(BASE, path).decode()
s = re.sub(r'<meta\b[^>]*name=["\']robots["\'][^>]*noindex[^>]*>\s*', '', s, flags=re.I)
write(path, s)

for path, counterpart, label, active in (
    ('es/privacidad/index.html', '/en/privacy/', 'Idioma', 'ES'),
    ('en/privacy/index.html', '/es/privacidad/', 'Language', 'EN'),
    ('es/lectura-accesible/index.html', '/en/accessible-reading/', 'Idioma', 'ES'),
):
    s = original(BASE, path).decode()
    if path == 'es/lectura-accesible/index.html':
        anchor = '<link href="https://irisgreen.eu/es/lectura-accesible/" hreflang="es" rel="alternate"/>'
        s = once(s, anchor, anchor + '\n<link href="https://irisgreen.eu/en/accessible-reading/" hreflang="en" rel="alternate"/>')
    other = 'ES' if active == 'EN' else 'EN'
    span = f'<span aria-current="true" class="lang on">{active}</span>'
    link = f'<a class="lang" href="{counterpart}" lang="{other.lower()}">{other}</a>'
    nodes = [link, span] if active == 'EN' else [span, link]
    nav = f'<nav aria-label="{label}" class="langs">\n' + '\n'.join(nodes) + '\n</nav>\n'
    write(path, once(s, '</header>', nav + '</header>'))

editorial = original(BASE, 'scripts/apply_language_updates.py').decode()
paragraphs = {key: re.search(r"    " + key + r" = '(.*)'", editorial)[1] for key in ('es_p1','es_p2','en_p1','en_p2')}
path = 'es/metodologia/index.html'
s = original(BASE, path).decode()
anchor = '<link href="https://irisgreen.eu/es/metodologia/" hreflang="es" rel="alternate"/>'
s = once(s, anchor, anchor + '\n<link href="https://irisgreen.eu/en/methodology/" hreflang="en" rel="alternate"/>')
anchor = '<span aria-current="true" class="lang on">ES</span>'
s = once(s, anchor, anchor + '\n<a class="lang" href="/en/methodology/" lang="en">EN</a>')
old = re.search(r'<h2>Quién hace qué</h2>\s*<p>.*?</p>', s, re.S)[0]
s = once(s, old, '<h2>Proceso editorial</h2>\n<p>' + paragraphs['es_p1'] + '</p>\n<p>' + paragraphs['es_p2'] + '</p>')
write(path, s)

# These two files are historical restorations, NOT exact reviewed ZIP recovery.
historical = {
    'en/accessible-reading/index.html': '297fb1d5095d493ba3b9c2634f27fe3a2528eef0',
    'en/methodology/index.html': '5c68c3019d17e20dc3a772f30ca6e66ba6a38560',
}
for path, sha in historical.items():
    s = blob(sha).decode()
    if path == 'en/methodology/index.html':
        old = re.search(r'<h2>Who does what</h2>\s*<p>.*?</p>', s, re.S)[0]
        s = once(s, old, '<h2>Editorial Process</h2>\n<p>' + paragraphs['en_p1'] + '</p>\n<p>' + paragraphs['en_p2'] + '</p>')
    write(path, s)

verified, restored = [], []
for path, wanted in expected.items():
    actual = hashlib.sha256((ROOT / path).read_bytes()).hexdigest()
    if path in historical:
        restored.append({'path': path, 'source_blob': historical[path], 'sha256': actual, 'reviewed_zip_sha256': wanted, 'exact_reviewed_zip': actual == wanted})
    else:
        assert actual == wanted, 'Reviewed file mismatch: ' + path
        verified.append(path)
assert len(verified) == 32
index = json.loads((ROOT / 'buscador.json').read_text())
assert len(index) == 469
urls = [record['u'] for record in index] + [record['en']['u'] for record in index]
assert len(set(urls)) == 938
for url in urls:
    assert (ROOT / url.lstrip('/') / 'index.html').is_file(), url
for path, counterpart in (
    ('es/metodologia/index.html', '/en/methodology/'),
    ('en/methodology/index.html', '/es/metodologia/'),
    ('es/lectura-accesible/index.html', '/en/accessible-reading/'),
    ('en/accessible-reading/index.html', '/es/lectura-accesible/'),
):
    s = (ROOT / path).read_text()
    nav = re.search(r'<nav aria-label="(?:Language|Idioma)" class="langs">.*?</nav>', s, re.S)[0]
    assert 'href="' + counterpart + '"' in nav, path
for folder in ('es/biblioteca', 'es/datos', 'en/everyday-life', 'en/data'):
    for page in (ROOT / folder).glob('*/index.html'):
        rel = page.relative_to(ROOT).as_posix()
        assert page.read_bytes() == original(BASE, rel), 'Individual entry changed: ' + rel
report = {'base': BASE, 'reviewed_upload': UPLOAD, 'exact_reviewed_files': verified, 'historical_restorations_not_exact_zip': restored, 'search_records': 469, 'unique_search_urls': 938, 'language_links': 'checked', 'individual_entries_unchanged': True, 'production_deployed': False, 'full_build': 'not_validated; known corrupt Support translation package', 'needs_original_files': ['reviewed ZIP to compare the two historical English pages', 'complete approved English Support translations']}
(OUT / 'verificacion.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
(OUT / 'targets.txt').write_text('\n'.join(expected) + '\n')
print(json.dumps({'exact_reviewed': len(verified), 'restored_from_history': len(restored), 'search_records': len(index), 'no_deployment': True}))
