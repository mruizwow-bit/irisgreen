"""Check links/assets in the final interactive area artifact, not source intent."""
import argparse
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote


class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ('href', 'src'):
            if attrs.get(key):
                self.refs.append(attrs[key])


def validate(root):
    pages = list((root/'es/juegos').rglob('*.html')) + list((root/'es/descubrimiento').rglob('*.html'))
    # Inventario explicito en vez de un suelo. Un conteo deja que un area tape la
    # desaparicion de otra: con >=12, retirar seis paginas de Juegos y que
    # apareciesen seis en Descubrimiento habria pasado igual. Esto falla diciendo
    # que archivo falta o cual sobra.
    ESPERADAS = {
        'es/juegos/index.html',
        'es/juegos/cada-cerebro-su-camino.html',
        'es/juegos/cada-cerebro-su-camino-jugar/index.html',
        'es/juegos/la-maquina-de-empezar.html',
        'es/juegos/la-maquina-de-empezar-jugar/index.html',
        'es/juegos/donde-se-fue-la-energia.html',
        'es/juegos/donde-se-fue-la-energia-jugar/index.html',
        'es/descubrimiento/index.html',
        'es/descubrimiento/peces.html',
        'es/descubrimiento/vida-marina/index.html',
    }
    encontradas = {p.relative_to(root).as_posix() for p in pages}
    assert encontradas == ESPERADAS, 'faltan: %s | sobran: %s' % (
        sorted(ESPERADAS - encontradas), sorted(encontradas - ESPERADAS))
    errors = []
    for page in pages:
        text = page.read_text(encoding='utf-8')
        assert 'pendiente de conexión' not in text, page
        assert 'href="#inicio"' not in text, page
        parser = References(); parser.feed(text)
        for ref in parser.refs:
            parts = urlsplit(ref)
            if parts.scheme or parts.netloc or not parts.path:
                continue
            path = root / unquote(parts.path).lstrip('/') if parts.path.startswith('/') else page.parent / unquote(parts.path)
            if path.is_dir(): path /= 'index.html'
            if not path.is_file(): errors.append(f'{page.relative_to(root)} -> {ref}')
    assert not errors, '\n'.join(errors)
    home = (root/'index.html').read_text(encoding='utf-8')
    assert 'href="/es/juegos/"' in home and 'href="/es/descubrimiento/"' in home
    # La entrada a Descubrimiento en la portada entra por un dibujo, no por un
    # hueco vacio: el cielo con una figura dibujada y nombrada.
    assert '/img/intereses/descubrimiento/portada-cielo.webp' in home, 'La portada perdio el dibujo de Descubrimiento'
    assert (root/'img/intereses/descubrimiento/portada-cielo.webp').is_file(), 'Falta el archivo del dibujo de portada'
    # Construccion y el cielo R02 se retiraron el 08/10/2026; queda Vida marina.
    for path in ('es/descubrimiento/vida-marina/index.html',):
        assert 'ig-experience-return' in (root/path).read_text(encoding='utf-8'), path
    # Netlify canonicalizes .html and trailing slashes: a file and a directory
    # with the same stem make the exploration link loop back to its detail.
    for page in pages:
        if page.name != 'index.html':
            assert not (page.with_suffix('')/'index.html').exists(), f'Pretty URL collision: {page}'
    assert not (root/'editorial').exists(), 'Editorial sources must never be published'
    print(f'Interactive areas: {len(pages)} pages, links, runtime assets and returns verified.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(); parser.add_argument('--root', type=Path, required=True)
    validate(parser.parse_args().root)
