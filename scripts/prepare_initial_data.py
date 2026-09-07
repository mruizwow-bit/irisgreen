#!/usr/bin/env python3
"""Generate the first paint from the existing JSON sources, without editorial changes.
Run after changing JSON or during deployment. Generated content is not edited separately.
"""
from __future__ import annotations
import argparse
import hashlib
import html
import json
import math
import re
import struct
from pathlib import Path
from urllib.parse import quote

ROOT = Path.cwd()
PAGES = {
    'es/taller/index.html': ('es/taller/taller-retos.json', 'retos'),
    'es/investigacion/index.html': ('es/investigacion/estudios-textos.json', 'data'),
    'es/tramites/directorio/index.html': ('es/tramites/directorio/tramites-datos.json', 'data'),
    'es/intereses/index.html': ('es/intereses/cromos.json', None),
}
SEED_RE = re.compile(r'<script id="ig-initial-data" type="application/json"[^>]*>.*?</script>\n?', re.S)


def image_size(path):
    data = path.read_bytes()
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return struct.unpack(">II", data[16:24])
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        pos = 12
        while pos + 8 <= len(data):
            kind = data[pos:pos+4]
            length = int.from_bytes(data[pos+4:pos+8], "little")
            block = data[pos+8:pos+8+length]
            if kind == b"VP8X":
                return int.from_bytes(block[4:7],"little")+1, int.from_bytes(block[7:10],"little")+1
            if kind == b"VP8L":
                bits = int.from_bytes(block[1:5],"little")
                return (bits & 0x3fff)+1, ((bits >> 14) & 0x3fff)+1
            if kind == b"VP8 ":
                width,height = struct.unpack("<HH",block[6:10])
                return width & 0x3fff,height & 0x3fff
            pos += 8 + length + (length % 2)
    raise ValueError("Unsupported image dimensions: " + str(path))


def compact(value):
    return json.dumps(value, ensure_ascii=False, separators=(',', ':'))


def esc(value):
    return html.escape(str(value), quote=True)


def replace_once(text, old, new):
    if new in text:
        return text
    if text.count(old) != 1:
        raise ValueError(f'Expected one occurrence of {old[:100]!r}; found {text.count(old)}')
    return text.replace(old, new, 1)


def replace_contents(text, ident, tag, contents):
    pattern = re.compile(r'(<'+tag+r'\b[^>]*\bid="'+ident+r'"[^>]*>).*?(</'+tag+r'>)', re.S)
    text, n = pattern.subn(lambda m: m[1] + contents + m[2], text)
    if n != 1:
        raise ValueError(f'Cannot locate {ident}')
    return text


def interests_markup(data):
    """Same fields/order/links as the existing pinta() renderer, already in HTML."""
    topics = [t for t in data['temas'] if any(not c.get('pendiente') for c in t.get('cromos', []))]
    count = sum(not c.get('pendiente') for t in data['temas'] for c in t.get('cromos', []))
    counts = f'<span class="pill">{len(topics)} temas</span><span class="pill">{count} cromos</span>'
    filters = '<button class="filter" type="button" aria-pressed="true">Todos los temas</button>'
    filters += ''.join(f'<button class="filter" type="button" aria-pressed="false" data-tema="{esc(t["id"])}">{esc(t["es"])}</button>' for t in topics)
    sections = []
    for t in topics:
        cards = [c for c in t.get('cromos', []) if not c.get('pendiente')]
        label = f'van {len(cards)} de {t["total"]}' if t.get('total') else f'{len(cards)} '+('cromo' if len(cards) == 1 else 'cromos')
        collection = '/es/intereses/imprimir/?tema=' + quote(t['id'], safe='')
        sections.append(f'<section class="album-tema"><h2>{esc(t["es"])}</h2><p class="cuenta">{esc(label)}</p><a class="bajar bajar-todo" href="{esc(collection)}">Descargar la colección entera · {math.ceil(len(cards)/4)+1} hojas A4</a><div class="cromos">')
        for c in cards:
            photo = c.get('foto', '')
            if photo and not photo.startswith(('/', 'http')):
                photo = '../../' + photo
            sections.append(f'<article class="cromo" id="cromo-{esc(t["id"])}-{esc(c.get("n", ""))}" style="scroll-margin-top:5rem"><div class="foto"><img loading="lazy" decoding="async" src="{esc(photo)}" alt="{esc(c.get("nombre", ""))}"><span class="num">{esc(c.get("n", ""))}</span></div><div class="cuerpo"><h3>{esc(c.get("nombre", ""))}</h3>')
            if c.get('latino'):
                sections.append(f'<p class="latino">{esc(c["latino"])}</p>')
            for key, value in c.get('campos', {}).items():
                if not value:
                    continue
                rendered = esc(value)
                if key == 'Con cuál se confunde':
                    for link in c.get('enlaces', []):
                        phrase = link.get('texto')
                        if phrase and phrase.lower() in value.lower():
                            pos = value.lower().find(phrase.lower())
                            rendered = esc(value[:pos]) + '<a href="#cromo-'+esc(t['id'])+'-'+esc(link['n'])+'">'+esc(value[pos:pos+len(phrase)])+'</a>'+esc(value[pos+len(phrase):])
                sections.append(f'<div class="campo"><span class="etiqueta">{esc(key)}</span><p class="valor">{rendered}</p></div>')
            if c.get('credito'):
                sections.append(f'<p class="credito">{esc(c["credito"])}</p>')
            sections.append(f'<a class="bajar" href="{esc(collection + "&n=" + str(c.get("n", "")))}">Descargar este cromo</a></div></article>')
        sections.append('</div></section>')
    return counts, filters, ''.join(sections), count


def transform(page, data, source_hash):
    text = SEED_RE.sub('', page.read_text(encoding='utf-8'))
    rel = page.relative_to(ROOT).as_posix()
    source_rel, field = PAGES[rel]
    seed = data
    if rel == 'es/tramites/directorio/index.html':
        # Only the original default country is needed for the first screen.
        seed = {'es': data['es'], '_counts': {key: len(value) for key, value in data.items() if isinstance(value, list)}}
    payload = compact(seed).replace('<', '\\u003c').replace('\u2028', '\\u2028').replace('\u2029', '\\u2029')
    seed_tag = f'<script id="ig-initial-data" type="application/json" data-source="/{source_rel}" data-sha256="{source_hash}">{payload}</script>\n'
    if field:
        initializer = 'const IG_INITIAL = JSON.parse(document.getElementById("ig-initial-data").textContent);\n'
        if initializer not in text:
            text = replace_once(text, 'class Component extends DCLogic {', initializer + 'class Component extends DCLogic {')
        text = replace_once(text, field + ': null', field + ': IG_INITIAL')
        if rel == 'es/taller/index.html':
            old = '    fetch("taller-retos.json").then((r) => r.json()).then((retos) => this.setState({ retos })).catch(() => {});'
            text = replace_once(text, old, '    // Initial challenges are generated from taller-retos.json at deployment.')
            asset = ROOT / 'assets/runtime/ef8b07969921a0dc.webp'
            if not asset.is_file():
                asset = ROOT / 'img/taller-portada.webp'
            if asset.is_file():
                width, height = image_size(asset)
                def dimensions(m):
                    tag = m[0]
                    if not re.search(r'\bwidth=', tag):
                        tag = tag[:-1] + f' width="{width}" height="{height}">'
                    return tag
                text = re.sub(r'<img\b[^>]*src="/assets/runtime/ef8b07969921a0dc.webp"[^>]*>', dimensions, text)
        if rel == 'es/investigacion/index.html':
            old = '    fetch("estudios-textos.json").then((r) => r.json()).then((data) => this.setState({ data })).catch(() => this.setState({ data: [] }));'
            text = replace_once(text, old, '    // Initial articles are generated from estudios-textos.json at deployment.')
        if rel == 'es/tramites/directorio/index.html':
            for country in seed['_counts']:
                text = text.replace('(st.data.'+country+' || []).length', '(IG_INITIAL._counts.'+country+')')
            text = text.replace('.catch(() => this.setState({ data: { es: [], uk: [], br: [], us: [], mundo: [] } }));', '.catch(() => { /* Retain the locally available Spain entries on network failure. */ });')
    else:
        counts, filters, album, count = interests_markup(data)
        for ident, contents in [('counts', counts), ('temaFilters', filters), ('album', album)]:
            start, end = f'<!-- ig-initial-{ident}:start -->', f'<!-- ig-initial-{ident}:end -->'
            marked = start+contents+end
            if start in text:
                text = re.sub(re.escape(start)+r'.*?'+re.escape(end), lambda _: marked, text, flags=re.S)
            else:
                text = replace_contents(text, ident, 'div', marked)
        text = replace_once(text, 'var datos={temas:[]}, tema="todos", texto="";', 'var datos=JSON.parse(document.getElementById("ig-initial-data").textContent), tema="todos", texto="";')
        old = 'fetch(DATA).then(function(r){return r.json()}).then(function(d){ datos=d; filtros(); pinta() })\n  .catch(function(){ pinta() });'
        new = '''// The first screen is already rendered from cromos.json. Bind it, do not rebuild it.
Array.prototype.forEach.call($("#temaFilters").children,function(b){
  b.onclick=function(){tema=b.dataset.tema||"todos";marca();pinta();};
});
document.querySelectorAll("#album .foto img").forEach(function(im){
  im.addEventListener("error",function(){
    var f=im.parentNode,n=f.querySelector(".num");
    f.innerHTML='<span class="sinfoto">'+(ES?"Foto pendiente":"Photo pending")+'</span>';
    if(n)f.appendChild(n);
  });
});'''
        text = replace_once(text, old, new)
    # Keep the glass colours without blurring every content surface on scroll.
    style = '<style id="ig-stable-surfaces">main [style*="backdrop-filter"],main .glass{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}</style>\n'
    if style not in text:
        text = text.replace('</head>', style+'</head>', 1)
    text = text.replace('</head>', seed_tag + '</head>', 1)
    return text


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    rows, changes = [], []
    for rel, (source, _) in PAGES.items():
        page, data_path = ROOT/rel, ROOT/source
        raw = data_path.read_bytes()
        data = json.loads(raw)
        digest = hashlib.sha256(raw).hexdigest()
        old = page.read_text(encoding='utf-8')
        new = transform(page, data, digest)
        if new != old:
            changes.append(rel)
            if not args.check:
                page.write_text(new, encoding='utf-8')
        rows.append({'page':rel,'source':source,'sha256':digest,'original_html_bytes':len(old.encode()),'new_html_bytes':len(new.encode()),'records':sum(len(x) for x in data.values() if isinstance(x,list)) if isinstance(data,dict) and 'es' in data else len(data) if isinstance(data,list) else sum(len(t.get('cromos',[])) for t in data['temas'])})
    if args.check and changes:
        raise SystemExit('Snapshots need regeneration: '+', '.join(changes))
    if not args.check:
        (ROOT/'reports').mkdir(exist_ok=True)
        (ROOT/'reports/initial-data-build.json').write_text(json.dumps({'pages':rows,'note':'Generated from the existing JSON; no editorial changes or new review dates.'},ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'pages':rows,'changed':changes},ensure_ascii=False))


if __name__ == '__main__':
    main()
