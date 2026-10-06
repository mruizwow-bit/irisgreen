"""Mount the delivered interactive areas without publishing editorial packages."""
import argparse
import hashlib
import json
import re
import zipfile
from apply_home_r42 import card
from pathlib import Path, PurePosixPath

ROOT = Path(__file__).resolve().parents[1]


def materialize(root):
    manifest = json.loads((ROOT / 'editorial/interactive-areas-manifest.json').read_text(encoding='utf-8'))
    for name, digest in manifest['files'].items():
        archive = ROOT / 'editorial' / name
        if hashlib.sha256(archive.read_bytes()).hexdigest() != digest:
            raise ValueError('Interactive area source checksum mismatch: ' + name)
        with zipfile.ZipFile(archive) as bundle:
            for item in bundle.infolist():
                relative = PurePosixPath(item.filename)
                if relative.is_absolute() or '..' in relative.parts or '\\' in item.filename:
                    raise ValueError('Unsafe archive member')
                if not item.filename.startswith(('es/juegos/', 'es/descubrimiento/')):
                    raise ValueError('Unexpected source route')
                if item.is_dir():
                    continue
                path = root.joinpath(*relative.parts)
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(bundle.read(item))

    # Keep the site's font and final compatibility stylesheet on every document.
    # Area-specific styles own the delivered layouts; no second application shell is mounted.
    for base in (root/'es/juegos', root/'es/descubrimiento'):
        for page in base.rglob('*.html'):
            text = page.read_text(encoding='utf-8')
            text = text.replace('<head>', '<head><link rel="stylesheet" href="/assets/ig-fonts.css">', 1)
            text = text.replace('</head>', '<link rel="stylesheet" href="/assets/ig-r69-unified-ui.css"></head>', 1)
            page.write_text(text, encoding='utf-8')

    # Keep old deep links usable; only the primary Home entry changes destination.
    home = root / 'index.html'
    text = home.read_text(encoding='utf-8')
    text = text.replace('href="/es/recursos/juegos/"', 'href="/es/juegos/"')
    discovery = card('/es/descubrimiento/', 'Descubrimiento', 'Explora el cielo y la vida marina a tu ritmo.', 'Explorar →', True, 'ALL_AGES')
    marker = '<div class="ig-home-v4-use-grid">'
    if marker not in text:
        raise ValueError('Home exploration grid missing')
    if 'href="/es/descubrimiento/"' not in text:
        text = text.replace(marker, marker + discovery, 1)
    home.write_text(text, encoding='utf-8')
    redirects = root / '_redirects'
    alias = '\n/es/descubrimientos/* /es/descubrimiento/:splat 301\n'
    text = redirects.read_text(encoding='utf-8')
    if '/es/descubrimientos/*' not in text:
        redirects.write_text(text + alias, encoding='utf-8')
    print('Interactive areas: Games, Construction, Discovery, Night sky and Marine life mounted.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, required=True)
    materialize(parser.parse_args().root)
