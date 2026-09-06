#!/usr/bin/env python3
"""Correcciones limitadas a los fallos observados; no reescribe contenido editorial."""
import html
import json
import re
import unicodedata
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path.cwd()
SKIP = {'.git', '_audit', 'reports', '.baseline', 'node_modules'}
report = {'adaptive_grids': {}, 'deferred_template_urls': {}, 'missing_cover_assets': []}

for p in sorted(ROOT.rglob('*.html')):
    rel = p.relative_to(ROOT)
    if SKIP.intersection(rel.parts):
        continue
    text = p.read_text(encoding='utf-8')
    if '<x-dc' not in text:
        continue
    # Una plantilla sin resolver no es una URL y no debe generar peticiones.
    deferred = [0]
    def defer_url(match):
        tag = match[0]
        def attr(m):
            if '{{' not in m[2]:
                return m[0]
            deferred[0] += 1
            return ' sc-camel-src=' + m[1] + m[2] + m[1]
        return re.sub(r'\s+src=([\"\'])(.*?)\1', attr, tag, flags=re.S)
    text = re.sub(r'<(?:img|iframe|audio|video|source)\b[^>]*>', defer_url, text, flags=re.S | re.I)
    if deferred[0]:
        report['deferred_template_urls'][str(rel)] = deferred[0]
    # El tamaño mínimo de una columna no puede superar el espacio disponible.
    def fluid_grid(match):
        return 'repeat(' + match[1] + ', minmax(min(100%, ' + match[2] + 'px), 1fr))'
    text, count = re.subn(r'repeat\(\s*(auto-fit|auto-fill)\s*,\s*minmax\(\s*(\d+)px\s*,\s*1fr\s*\)\s*\)', fluid_grid, text)
    if count:
        report['adaptive_grids'][str(rel)] = count
    if str(rel) == 'es/libros/index.html':
        target = r'<article\b(?=[^>]*grid-template-columns:\s*minmax\(160px,\s*210px\)\s*1fr)[^>]*>'
        def book_class(m):
            if 'ig-book-card' in m[0]:
                return m[0]
            assert 'class=' not in m[0], 'Revisar la clase de la tarjeta antes de modificar.'
            return m[0].replace('<article', '<article class="ig-book-card"', 1)
        text, count = re.subn(target, book_class, text)
        assert count == 1, 'La estructura de Libros ya no es la revisada.'
    p.write_text(text, encoding='utf-8')

# Los filtros visibles se generan desde el mismo JSON, antes de la primera pintura.
# El navegador sigue usando buscador.json; no se crea un índice paralelo.
data = json.loads((ROOT / 'buscador.json').read_text())
entries = [x for x in data if urlsplit(x.get('u', '')).path.startswith('/es/neurodiversidad/condiciones/')]
assert len(entries) == 185

def normalized(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if not unicodedata.combining(c))

types = sorted({x['tipo'] for x in entries}, key=normalized)
letters = sorted({normalized(x.get('indexKey') or x['t'])[0].upper() for x in entries})
assert len(types) == 11 and 'X' in letters

def buttons(items, attr, css):
    rows = [f'<button type="button" class="{css}" {attr}="" aria-pressed="true">Todas</button>']
    rows.extend(f'<button type="button" class="{css}" {attr}="{html.escape(v, quote=True)}" aria-pressed="false">{html.escape(v)}</button>' for v in items)
    return ''.join(rows)

p = ROOT / 'es/neurodiversidad/condiciones/index.html'
s = p.read_text()
for tag, ident, markup in [('div', 'filtros', buttons(types, 'data-type', 'chip lnk')), ('nav', 'az', buttons(letters, 'data-letter', 'azl'))]:
    pattern = r'(<'+tag+r'\b[^>]*\bid="'+ident+r'"[^>]*>).*?(</'+tag+r'>)'
    s, n = re.subn(pattern, lambda m:m[1]+markup+m[2], s, flags=re.S)
    assert n == 1
p.write_text(s)
report['initial_filter_types'] = types
report['initial_filter_letters'] = letters

css = ROOT / 'assets/ajustes-interfaz.css'
s = css.read_text()
start = '/* IG: correcciones de anchura verificadas en 320 px */'
if start not in s:
    s += '\n' + start + '''
.sc-host main :where(article,section,div,label){min-width:0}
.sc-host main article{overflow-wrap:anywhere}
.sc-host main select{width:100%;max-width:100%}
.sc-host main article [style*="display: flex"]>*{min-width:0;max-width:100%}
#ig-music-panel .ig-m-controls button{min-width:max-content;white-space:nowrap;font-size:14px;padding:6px 7px}
#ig-music-panel .ig-m-controls .ig-m-play{min-width:72px}
@media(max-width:650px){
 .sc-host main .ig-book-card{grid-template-columns:minmax(0,1fr)!important;padding:20px!important;gap:18px!important}
 .ig-book-card>img{width:min(100%,210px)!important;justify-self:start}
}
@media(max-width:420px){
 .ig-uh-right{max-width:100%;flex-wrap:wrap!important;gap:5px!important}
 .ig-uh-tools{min-width:0;gap:4px!important}
 .ig-uh-music,.ig-uh-reading{padding-inline:8px!important;font-size:13px!important;gap:4px!important}
 .ig-uh-langs button{min-width:44px!important;padding:0 6px!important;font-size:12px!important}
}
'''
css.write_text(s)

# No se inventan portadas. Sus referencias se conservan y se informa de la ausencia.
for name in ('luma-es-512.webp', 'autismo-es-512.webp'):
    path = ROOT / 'assets/books' / name
    if not path.is_file():
        report['missing_cover_assets'].append('/assets/books/' + name)
(ROOT / 'reports').mkdir(exist_ok=True)
(ROOT / 'reports/remaining-layout-changes.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
print(json.dumps(report, ensure_ascii=False))
