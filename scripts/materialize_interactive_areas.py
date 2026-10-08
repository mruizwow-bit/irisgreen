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
                # Netlify Pretty URLs makes cielo.html and cielo/index.html
                # collide. Give the playable experience its own route.
                destination = item.filename.replace('es/descubrimiento/cielo/', 'es/descubrimiento/cielo-explorar/', 1)
                path = root.joinpath(*PurePosixPath(destination).parts)
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(bundle.read(item))

    # Keep the site's font and final compatibility stylesheet on every document.
    # Area-specific styles own the delivered layouts; no second application shell is mounted.
    for base in (root/'es/juegos', root/'es/descubrimiento'):
        for page in base.rglob('*.html'):
            text = page.read_text(encoding='utf-8')
            text = text.replace('href="cielo/"', 'href="cielo-explorar/"')
            route = '/' + page.relative_to(root).as_posix().removesuffix('index.html')
            # Una pagina ya versionada en el repo pasa antes por los adaptadores
            # globales, que pueden haberle puesto ya estos enlaces.
            if 'rel="canonical"' not in text:
                text = text.replace('<head>', '<head><link rel="canonical" href="https://irisgreen.eu' + route + '">', 1)
            if '/assets/ig-fonts.css' not in text:
                text = text.replace('<head>', '<head><link rel="stylesheet" href="/assets/ig-fonts.css">', 1)
            # Los pases R69 anteriores ya pueden haberla puesto: una sola vez y al final del head.
            text = re.sub(r'\s*<link rel="stylesheet" href="/assets/ig-r69-unified-ui\.css(?:\?[^"]*)?">', '', text)
            text = text.replace('</head>', '<link rel="stylesheet" href="/assets/ig-r69-unified-ui.css"></head>', 1)
            page.write_text(text, encoding='utf-8')

    # Make the delivered fixed storage key visible to the privacy auditor.
    config = (root/'es/descubrimiento/cielo-explorar/js/config.js').read_text(encoding='utf-8')
    key = re.search(r"CLAVE_GUARDADO:\s*'([^']+)'", config).group(1)
    if key != 'iris-green.cielo-nocturno.r01':
        raise ValueError('Review the new sky storage key and privacy notice')
    interface = root/'es/descubrimiento/cielo-explorar/js/interfaz.js'
    interface.write_text(interface.read_text(encoding='utf-8').replace('CFG.CLAVE_GUARDADO', repr(key)), encoding='utf-8')

    # These runtimes save only game/exploration state locally. Document their
    # actual persistence and deletion controls in both existing privacy pages.
    notices = {
        'es/privacidad/index.html': '<h2>Guardado de Juegos y Descubrimiento</h2><p>El taller de las islas guarda automáticamente la partida y sus ajustes en este navegador. Una nueva partida sustituye ese progreso. Cielo nocturno guarda tus hallazgos y la vista de exploración; puedes borrarlos desde el propio cielo. Vida marina guarda el álbum, las especies examinadas y el idioma solo cuando activas el guardado; al desactivarlo se borra esa copia. Estos datos no se envían a Iris Green. También puedes eliminarlos borrando los datos de irisgreen.eu en la configuración del navegador.</p>',
        'en/privacy/index.html': '<h2>Games and Discovery saves</h2><p>The island workshop automatically saves your game and settings in this browser. Starting a new game replaces that progress. Night sky saves discoveries and the exploration view; you can erase them within the sky experience. Marine life saves the album, examined species and language only when you enable saving; disabling it deletes that copy. These data are not sent to Iris Green. You can also remove them by clearing irisgreen.eu site data in your browser settings.</p>',
    }
    for rel, notice in notices.items():
        page = root/rel
        text = page.read_text(encoding='utf-8')
        text = re.sub(r'<section id="interactive-storage-notice">.*?</section>', '', text, flags=re.S)
        page.write_text(text.replace('</main>', '<section id="interactive-storage-notice">' + notice + '</section></main>', 1), encoding='utf-8')

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
