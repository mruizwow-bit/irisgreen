"""Mount the delivered interactive areas without publishing editorial packages."""
import argparse
import hashlib
import json
import re
import zipfile
from apply_home_r42 import card
from apply_r67_global_shell_all import EXPERIENCIAS, apply_one as poner_armazon
from pathlib import Path, PurePosixPath

ROOT = Path(__file__).resolve().parents[1]

# Rutas que este materializador NO reclama. El hub de Juegos lo monta el build
# antes que nosotros; pisarlo aqui dejaba publicado un hub que nadie habia
# escrito -el del paquete editorial, sin los tres juegos nuevos- y ningun test
# lo vigilaba.
NO_RECLAMADAS = frozenset({'es/juegos/index.html'})

# Retirados el 08/10/2026 por decision de Maria: los juegos viejos salen del
# sitio, y el cielo R02 lo sustituye «Cielo y Espacio», publicado una sola vez
# en /es/intereses/cielo-y-espacio/. Sus rutas se redirigen mas abajo; no se
# borran del paquete, que sigue sellado por checksum.
RETIRADOS = (
    'es/juegos/el-taller-de-las-islas.html',
    'es/juegos/para-todos.html',
    'es/juegos/plus.html',
    'es/juegos/construccion/',
    'es/descubrimiento/cielo.html',
    'es/descubrimiento/cielo/',
    # «Para todos» y «Plus» no son temas ni edades: son niveles de acceso, y
    # el area es para todos. Lo que cada persona ve lo decide ya su banda de
    # edad, asi que esta era una segunda puerta que decia otra cosa.
    'es/descubrimiento/para-todos.html',
    'es/descubrimiento/plus.html',
)


# Las paginas que vienen del zip no pasan por el pase global del armazon:
# ese corre antes que este materializador. Publicaban su propia lista de
# doce areas en cabecera y pie, y -peor- no cargaban ig-audience.js, asi que
# no tenian selector de edad, que es justo lo que decide que se le ensena a
# un nino. El armazon se les pone aqui, reutilizando apply_one.
#
# Las EXPERIENCIAS se quedan sin el a proposito: su maquetacion ES el
# producto y ocupa la ventana entera. Si aparece una experiencia nueva bajo
# estas rutas hay que anadirla aqui, o se le metera el armazon encima.
# Las tres experiencias de juego no estan aqui a proposito: viven en el arbol,
# asi que el pase global ya les puso el armazon antes, y les va bien porque
# son paginas normales que hacen scroll, no productos a pantalla completa.
# Quien si se queda fuera es la de vida marina, que llega del zip.
# EXPERIENCIAS se importa de apply_r67_global_shell_all: una sola lista.


def retirado(nombre):
    return any(nombre == r or nombre.startswith(r) for r in RETIRADOS)


def quitar_seccion(texto, etiqueta, donde):
    """Quita una seccion entera del paquete, comprobando que hay exactamente una."""
    patron = re.compile(r'\s*<section aria-labelledby="' + etiqueta + r'".*?</section>', re.S)
    encontradas = len(patron.findall(texto))
    if encontradas != 1:
        raise ValueError('%s: esperaba 1 seccion %r y hay %d' % (donde, etiqueta, encontradas))
    return patron.sub('', texto, count=1)


def sustituir(texto, viejo, nuevo, veces, donde):
    """Un reemplazo que no se aplica en silencio.

    Si manana el paquete cambia el texto de origen, el build se entera aqui y no
    al ver la pagina apuntando a donde no debe, con CI en verde.
    """
    encontradas = texto.count(viejo)
    if encontradas != veces:
        raise ValueError('%s: esperaba %d veces %r y hay %d' % (donde, veces, viejo, encontradas))
    return texto.replace(viejo, nuevo)


def materialize(root):
    escritos = set()
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
                if item.filename in NO_RECLAMADAS or retirado(item.filename):
                    continue
                path = root.joinpath(*PurePosixPath(item.filename).parts)
                # Nadie pisa en silencio lo que el build ya ha producido. Si un
                # paquete empieza a traer un archivo que ya existe, se para aqui.
                if path.exists() and item.filename not in escritos:
                    raise ValueError('El paquete pisa un archivo que el build ya produjo: ' + item.filename)
                escritos.add(item.filename)
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(bundle.read(item))

    for base in (root/'es/juegos', root/'es/descubrimiento'):
        for page in sorted(base.rglob('*.html')):
            if page.relative_to(root).as_posix() in EXPERIENCIAS:
                continue
            poner_armazon(page, root)

    # Keep the site's font and final compatibility stylesheet on every document.
    # Area-specific styles own the delivered layouts; no second application shell is mounted.
    for base in (root/'es/juegos', root/'es/descubrimiento'):
        for page in base.rglob('*.html'):
            text = page.read_text(encoding='utf-8')
            route = '/' + page.relative_to(root).as_posix().removesuffix('index.html')
            # Una página de juego ya versionada en el repo pasa antes por los adaptadores
            # globales, que ya le ponen fuentes y la hoja final. Solo se añade lo que falte.
            if 'rel="canonical"' not in text:
                text = text.replace('<head>', '<head><link rel="canonical" href="https://irisgreen.eu' + route + '">', 1)
            if '/assets/ig-fonts.css' not in text:
                text = text.replace('<head>', '<head><link rel="stylesheet" href="/assets/ig-fonts.css">', 1)
            if '/assets/ig-r69-unified-ui.css' not in text:
                text = text.replace('</head>', '<link rel="stylesheet" href="/assets/ig-r69-unified-ui.css"></head>', 1)
            page.write_text(text, encoding='utf-8')

    # La tarjeta del cielo de Descubrimiento lleva al cielo nuevo. El enlace es
    # relativo dentro del paquete, asi que se reescribe aqui, contando.
    indice = root/'es/descubrimiento/index.html'
    texto_indice = sustituir(indice.read_text(encoding='utf-8'),
                             'href="cielo.html"', 'href="/es/intereses/cielo-y-espacio/"',
                             1, 'es/descubrimiento/index.html')
    texto_indice = quitar_seccion(texto_indice, 'ambitos', 'es/descubrimiento/index.html')
    indice.write_text(texto_indice, encoding='utf-8')

    # These runtimes save only game/exploration state locally. Document their
    # actual persistence and deletion controls in both existing privacy pages.
    notices = {
        'es/privacidad/index.html': '<h2>Guardado de Juegos y Descubrimiento</h2><p>Cielo y Espacio guarda tu cuaderno -lo que has encontrado y como tienes puesta la vista- en este navegador, y puedes borrarlo desde el propio cielo. Vida marina guarda el album, las especies examinadas y el idioma solo cuando activas el guardado; al desactivarlo se borra esa copia. Estos datos no se envian a Iris Green. Tambien puedes eliminarlos borrando los datos de irisgreen.eu en la configuracion del navegador.</p>',
        'en/privacy/index.html': '<h2>Games and Discovery saves</h2><p>Sky and Space saves your notebook -what you have found and how your view is set- in this browser, and you can erase it within the sky experience. Marine life saves the album, examined species and language only when you enable saving; disabling it deletes that copy. These data are not sent to Iris Green. You can also remove them by clearing irisgreen.eu site data in your browser settings.</p>',
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
    # Sin :splat: el cielo nuevo es una sola pagina y sus rutas internas son
    # estado, no direcciones. Un 301 con :splat seria un 301 a un 404.
    alias = ('\n/es/descubrimientos/* /es/descubrimiento/:splat 301\n'
             '/es/descubrimiento/cielo /es/intereses/cielo-y-espacio/ 301!\n'
             '/es/descubrimiento/cielo.html /es/intereses/cielo-y-espacio/ 301!\n'
             '/es/descubrimiento/cielo-explorar/* /es/intereses/cielo-y-espacio/ 301!\n'
             '/es/juegos/el-taller-de-las-islas /es/juegos/ 301!\n'
             '/es/juegos/el-taller-de-las-islas.html /es/juegos/ 301!\n'
             '/es/juegos/para-todos /es/juegos/ 301!\n'
             '/es/juegos/para-todos.html /es/juegos/ 301!\n'
             '/es/juegos/plus /es/juegos/ 301!\n'
             '/es/juegos/plus.html /es/juegos/ 301!\n'
             '/es/juegos/construccion/* /es/juegos/ 301!\n'
             '/es/descubrimiento/para-todos /es/descubrimiento/ 301!\n'
             '/es/descubrimiento/para-todos.html /es/descubrimiento/ 301!\n'
             '/es/descubrimiento/plus /es/descubrimiento/ 301!\n'
             '/es/descubrimiento/plus.html /es/descubrimiento/ 301!\n')
    text = redirects.read_text(encoding='utf-8')
    if '/es/descubrimientos/*' not in text:
        redirects.write_text(text + alias, encoding='utf-8')
    print('Interactive areas: Games, Discovery and Marine life mounted; old games and R02 sky retired.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, required=True)
    materialize(parser.parse_args().root)
