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
    assert len(pages) >= 12, 'Missing interactive pages'
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
    for path in ('es/juegos/construccion/index.html', 'es/descubrimiento/cielo-explorar/index.html', 'es/descubrimiento/vida-marina/index.html'):
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
