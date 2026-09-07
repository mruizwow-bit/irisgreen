#!/usr/bin/env python3
"""Migración acotada e idempotente de la web actual. No modifica textos clínicos.
Ejecutar desde la raíz: python scripts/repair_web.py. Dependencia: beautifulsoup4.
"""
import base64
import gzip
import hashlib
import html
import json
import re
from collections import Counter
from pathlib import Path
from urllib.parse import urljoin, urlsplit
from bs4 import BeautifulSoup

ROOT = Path('.')
EXCLUDE = {'.git', '_audit', 'reports', 'node_modules', '.baseline'}
REPORT = {'unpacked': [], 'nav_pages': 0, 'nav_links_removed': 0, 'conditions': 0, 'types': {}, 'warnings': []}

def pages():
    return sorted(p for p in ROOT.rglob('*.html') if not EXCLUDE.intersection(p.parts))

def island(raw, name):
    m = re.search(r'<script\b[^>]*type=[\"\']__bundler/' + name + r'[\"\'][^>]*>(.*?)</script\s*>', raw, re.S | re.I)
    return json.loads(m[1]) if m else None

def pathof(url, current='index.html'):
    return urlsplit(urljoin('https://irisgreen.eu/' + current, url)).path.rstrip('/') or '/'

def single_replace(text, old, new, *, required=True):
    n=text.count(old)
    if n==0 and not required: return text
    if n!=1: raise ValueError(f'Esperada una coincidencia de {old[:100]!r}; encontradas {n}')
    return text.replace(old,new,1)

def json_source_metadata():
    """Aprovechar indexKey/k existentes, sin buscar manuscritos de otras versiones."""
    found = {}
    inventory=[]
    def walk(obj):
        if isinstance(obj,dict):
            u=obj.get('u') or obj.get('url')
            if isinstance(u,str) and ('indexKey' in obj or 'k' in obj):
                found.setdefault(pathof(u),{}).update({k:obj[k] for k in ('indexKey','k') if k in obj})
            for v in obj.values(): walk(v)
        elif isinstance(obj,list):
            for v in obj: walk(v)
    for p in ROOT.rglob('*.json'):
        if EXCLUDE.intersection(p.parts): continue
        try:
            value=json.loads(p.read_text(encoding='utf-8'))
            inventory.append(str(p));walk(value)
        except (UnicodeDecodeError,json.JSONDecodeError): continue
    REPORT['json_sources']=inventory
    return found

# La home se lee antes de desempaquetar. Las palabras k ya existentes se incorporan al índice único.
home_path=Path('index.html')
home_original=home_path.read_text(encoding='utf-8')
home_template=island(home_original,'template') or home_original
metadata=json_source_metadata()
for match in re.finditer(r'\{\s*name:\s*"[^"\n]+",\s*kind:\s*"Tema",\s*url:\s*T\("([^"]+)"\)[^\n]*?\bk:\s*"([^"]*)"\s*\}',home_template):
    key='/es/neurodiversidad/condiciones/'+match[1]
    metadata.setdefault(key,{}).setdefault('k',match[2])

# Tabla de tipos extraída de las tarjetas vigentes, no escrita a mano.
cp=Path('es/neurodiversidad/condiciones/index.html')
cs=BeautifulSoup(cp.read_text(encoding='utf-8'),'html.parser')
card_info={}
for c in cs.select('.cards > a.card'):
    title=c.find('strong').get_text(' ',strip=True)
    chip=c.select_one('.chip')
    url=pathof(c['href'],str(cp))
    info=metadata.get(url,{})
    # Fallback al nombre sin el prefijo editorial «Síndrome». No se codifica una lista de letras.
    index_key=info.get('indexKey') or c.get('data-index-key') or re.sub(r'^Síndrome\s+(?:de\s+)?','',title,flags=re.I)
    card_info[url]={'tipo':chip.get_text(' ',strip=True) if chip else '', 'indexKey':index_key, 'k':info.get('k','')}
assert len(card_info)==185, 'La colección ha cambiado: revisar antes de migrar.'
idx_path=Path('buscador.json');idx=json.loads(idx_path.read_text(encoding='utf-8'))
assert isinstance(idx,list)
old_index=json.loads(json.dumps(idx))
for entry in idx:
    u=pathof(entry['u'])
    if u in card_info:
        for k,v in card_info[u].items():
            if k=='k' and entry.get(k): continue
            entry[k]=v
assert sum(pathof(e['u']) in card_info for e in idx)==185
assert len({pathof(e['u']) for e in idx})==len(idx), 'Hay URLs duplicadas en el índice.'
for old,new in zip(old_index,idx):
    assert all(new[k]==v for k,v in old.items()), 'La migración no debe alterar ningún campo documental existente.'
idx_path.write_text(json.dumps(idx,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
REPORT['index_entries']=len(idx)
REPORT['types']=dict(Counter(v['tipo'] for v in card_info.values()))

for p in pages():
    original=p.read_text(encoding='utf-8');text=original
    template=island(original,'template')
    if template:
        manifest=island(original,'manifest') or {}
        assert not island(original,'page_order'), f'Hay páginas anidadas no contempladas: {p}'
        resources={}
        for key,resource in manifest.items():
            data=base64.b64decode(resource['data'])
            if resource.get('compressed'): data=gzip.decompress(data)
            mime=resource['mime']
            ext={'text/javascript':'.js','application/javascript':'.js','text/css':'.css','image/webp':'.webp','image/png':'.png','image/jpeg':'.jpg'}.get(mime)
            if not ext: raise ValueError(f'Recurso no previsto: {mime}')
            digest=hashlib.sha256(data).hexdigest()[:16]
            dest=Path('assets/runtime')/(digest+ext);dest.parent.mkdir(parents=True,exist_ok=True)
            if dest.exists(): assert dest.read_bytes()==data
            else: dest.write_bytes(data)
            resources[key]='/'+str(dest)
        text=template
        for key,url in resources.items():text=text.replace(key,url)
        helmet=re.search(r'<helmet\b[^>]*>(.*?)</helmet>',text,re.S|re.I)
        if helmet:
            contents=helmet[1]
            # Las cabeceras y el CSS se entregan directamente, no después del montaje.
            text=text[:helmet.start()]+text[helmet.end():]
            text=text.replace('</head>',contents+'\n</head>',1)
        # React y ReactDOM ya existen en el paquete. Se cargan antes del runtime, sin CDN ni blobs.
        runtime='/assets/runtime/8fe7df74405f3c55.js'
        react='/assets/runtime/d949f1c3687aedad.js'
        dom='/assets/runtime/35f4f974f4b2bcd4.js'
        assert all(Path(x.lstrip('/')).is_file() for x in (runtime,react,dom))
        text=re.sub(r'<script\b[^>]*src=[\"\']'+re.escape(runtime)+r'[\"\'][^>]*>\s*</script>','',text,flags=re.I)
        for url in (react,dom):
            text=re.sub(r'<script\b[^>]*src=[\"\']'+re.escape(url)+r'[\"\'][^>]*>\s*</script>','',text,flags=re.I)
        boot='<style>x-dc{display:none!important}</style>\n'+''.join(f'<script defer src="{url}"></script>\n' for url in (react,dom,runtime))
        text=text.replace('</head>',boot+'</head>',1)
        text=re.sub(r'<html(?![^>]*\blang=)([^>]*)>',r'<html lang="es"\1>',text,count=1)
        # Los iframes condicionales no deben conectarse antes de que React decida mostrarlos.
        block=re.search(r'<x-dc\b[^>]*>(.*?)</x-dc>',text,re.S)
        assert block
        inner=block[1]
        inner=re.sub(r'<sc-if\b[^>]*value=[\"\']\{\{\s*musicOpen\s*\}\}[\"\'][^>]*>.*?</sc-if>','',inner,flags=re.S)
        inner=re.sub(r'<iframe\b','<sc-raw-iframe',inner,flags=re.I)
        inner=re.sub(r'</iframe\s*>','</sc-raw-iframe>',inner,flags=re.I)
        text=text[:block.start(1)]+inner+text[block.end(1):]
        REPORT['unpacked'].append({'path':str(p),'before_bytes':len(original.encode()),'after_bytes':len(text.encode()),'resource_count':len(resources)})
    # Solo se eliminan enlaces a trámites de la barra principal. Las subtabs de Ayudas quedan intactas.
    def navigation(m):
        raw=m[0]; soup=BeautifulSoup(raw,'html.parser');nav=soup.find('nav')
        classes=nav.get('class',[])
        if not ('ig-uh-nav' in classes or 'nav' in classes):return raw
        REPORT['nav_pages']+=1
        for a in list(nav.find_all('a',recursive=False)):
            if pathof(a.get('href',''),str(p)) in {'/es/tramites','/en/apply','/pt-br/tramites'}:
                a.decompose();REPORT['nav_links_removed']+=1
        nav['id']='ig-main-nav'
        if str(p).startswith(('es/tramites/','es/vivir-fuera/')):
            for a in nav.find_all('a',recursive=False):
                if pathof(a.get('href',''),str(p))=='/es/tramites/directorio':a['aria-current']='page'
        menu='<button type="button" class="ig-menu-button" aria-label="'+('Open menu' if str(p).startswith('en/') else 'Abrir menú')+'" aria-controls="ig-main-nav" aria-expanded="false">'+('Menu' if str(p).startswith('en/') else 'Menú')+'</button>'
        return ('' if 'class="ig-menu-button"' in text else menu)+str(nav)
    text=re.sub(r'<nav\b[^>]*>.*?</nav\s*>',navigation,text,flags=re.S|re.I)
    if 'assets/ajustes-interfaz.css' not in text:
        text=text.replace('</head>','<link rel="stylesheet" href="/assets/ajustes-interfaz.css"/>\n</head>',1)
    if 'assets/interfaz-comun.js' not in text:
        text=text.replace('</body>','<script defer src="/assets/interfaz-comun.js"></script>\n</body>',1)
    # Un único reproductor local delegado, válido aunque el contenido lo monte React.
    text=re.sub(r'<script\b[^>]*src=[\"\'][^\"\']*assets/musica\.js[^\"\']*[\"\'][^>]*>\s*</script>','',text,flags=re.I)
    text=text.replace('</body>','<script defer src="/assets/musica.js"></script>\n</body>',1)
    text=text.replace('background-attachment: fixed','background-attachment: scroll')
    text=text.replace('minmax(330px, 1fr)','minmax(min(100%, 330px), 1fr)')
    if str(p)=='index.html':
        if 'assets/buscador-comun.js' not in text:text=text.replace('</head>','<script defer src="/assets/buscador-comun.js"></script>\n</head>',1)
        # Suprimir la descarga y el mapeo alternativo que descartaban k y la descripción completa.
        old=re.search(r'    fetch\("buscador\.json"\).*?\.catch\(function \(\) \{\}\);',text,re.S)
        if old:
            new='    window.IGSearch.load().then((entries) => this.setState({ idx: entries })).catch(() => this.setState({ searchError: true }));'
            text=text[:old.start()]+new+text[old.end():]
        text=text.replace('var fondo = ITEMS.concat(this.state.idx || []);','var fondo = this.state.idx || [];')
        text=text.replace('var fuente = (this.state.idx && this.state.idx.length) ? this.state.idx : ITEMS;','var fuente = this.state.idx || [];')
        start=text.find('    var todas = q.split(')
        end=text.find('\n  quizTop()',start)
        if start!=-1 and end!=-1:
            text=text[:start]+'    return window.IGSearch.rank(fondo, this.state.q).slice(0, 9);\n  }\n'+text[end:]
        text=text.replace('hint: corto, full: d, k: ""','hint: corto, full: d, k: x.k || ""')
        text=text.replace('const ytThumb = (u) => null;', 'const ytThumb = (u) => { const m = String(u || "").match(/youtube-nocookie\\.com\\/embed\\/([A-Za-z0-9_-]{11})/); return m ? "https://i.ytimg.com/vi/" + m[1] + "/hqdefault.jpg" : null; };')
        text=text.replace('src: u, alt: "", style:', 'src: u, alt: "", loading: "lazy", decoding: "async", width: 480, height: 360, style:')
        text=text.replace('<a href="/es/tramites/" style="font-weight: 700;">{{ tPedirCta2 }}</a>','<a href="/es/tramites/directorio/" style="font-weight: 700;">{{ tPedirCta2 }}</a>')
        text=text.replace('X("Directorio de 2.422 ayudas →")','X("Directorio de ayudas →")')
        text=text.replace('X("Nada con esas palabras. Prueba la pestaña «¿Qué me pasa?». ")','X("No encontramos resultados con esas palabras. Prueba otra búsqueda.")')
        text=text.replace('X("Nada con esas palabras. Prueba la pestaña «¿Qué me pasa?». ".trim())','X("No encontramos resultados con esas palabras. Prueba otra búsqueda.")')
        text=text.replace('tNoRes: X("Nada con esas palabras. Prueba la pestaña «¿Qué me pasa?»."),','tNoRes: st.searchError ? "No se ha podido cargar el buscador. Recarga la página o entra por un tema." : X("No encontramos resultados con esas palabras. Prueba otra búsqueda."),')
        text=text.replace('type="search" value="{{ q }}"','type="search" aria-label="{{ nav0 }}" value="{{ q }}"')
        text=text.replace('<div style="font-weight: 700; margin-top: 10px;">{{ v.name }}</div>','<button type="button" class="ig-video-title" sc-camel-on-click="{{ v.play }}">{{ v.name }}</button>')
        # Vacío enlazado a Situaciones, sin obligar a conocer un diagnóstico.
        text=text.replace('{{ tNoRes }}</p>','{{ tNoRes }} <a href="/es/situaciones/">Ver Situaciones</a></p>')
    if str(p)==str(cp):
        text=text.replace('<body class="conditions-collection">','<body class="conditions-collection" data-ig-conditions="true">')
        text=re.sub(r'<script>\(function\(\)\{\s*"use strict";\s*var GRUPOS=.*?</script>','',text,flags=re.S)
        text=re.sub(r'<div class="ig-section-actions">.*?</div>','',text,count=1,flags=re.S)
        intro=re.search(r'<p class="lede">.*?</p>',text,re.S);assert intro
        actions='<div class="ig-section-actions"><a href="/es/cuestionarios/">Cuestionarios orientativos</a><p>Responde unas preguntas para ordenar lo que observas.</p></div>'
        text=text[:intro.end()]+actions+text[intro.end():]
        text=re.sub(r'<p class="chips" id="filtros"[^>]*>.*?</p>','<div class="chips" id="filtros" role="group" aria-label="Filtrar por tipo"></div>',text,flags=re.S)
        text=text.replace('<label class="sr" for="q">Buscar en las fichas</label>','<label for="q">Buscar en las '+str(len(card_info))+' fichas</label>')
        text=text.replace('<p class="muted" id="cuenta" role="status"></p>','<p class="muted" id="cuenta" role="status" aria-live="polite">'+str(len(card_info))+' fichas</p><button type="button" class="chip lnk" id="ig-search-reset" hidden>Quitar filtros</button>')
        if 'id="ig-search-empty"' not in text:
            empty='<div id="ig-search-empty" class="ig-empty" hidden><p>No encontramos una ficha con esas palabras.</p><p>Prueba otra forma de decirlo o <a href="/es/situaciones/">busca en Situaciones</a>.</p></div>'
            text=text.replace('<div class="cards">',empty+'\n<div class="cards">',1)
        if 'assets/buscador-comun.js' not in text:text=text.replace('</head>','<script defer src="/assets/buscador-comun.js"></script>\n</head>',1)
        REPORT['conditions']=len(card_info)
    elif str(p).startswith('es/neurodiversidad/condiciones/'):
        if 'data-ig-back-conditions' not in text:
            text=text.replace('</main>','<p class="ig-back"><a data-ig-back-conditions href="/es/neurodiversidad/condiciones/">← Volver a Condiciones</a></p>\n</main>',1)
    # No generar alternates que apuntan a traducciones inexistentes.
    if str(p)=='es/neurodiversidad/temas/autismo/index.html':
        text=re.sub(r'<link\b(?=[^>]*href=[\"\']https://irisgreen\.eu/(?:en|pt-br)/neurodiversidad/temas/autismo/)[^>]*>','',text)
    text=text.replace('subject=Error%20en%20una%20ficha%20de%20condiciociones','subject=Error%20en%20una%20ficha%20de%20condiciones')
    if text!=original:p.write_text(text,encoding='utf-8')

# Arreglos defensivos del lector existente (mantener su estado y opciones).
a=Path('assets/lectura-accesible.js');v=a.read_text()
v=v.replace("document.getElementById('rguide').hidden=!S.guide;","var guide=document.getElementById('rguide'); if(guide)guide.hidden=!S.guide;")
v=v.replace('if(!btn)return;', 'if(!btn||!pan)return;')
v=v.replace("toggle(document.getElementById('plBtn'),document.getElementById('pl'));",'// Música la controla exclusivamente assets/musica.js.')
v=v.replace("var g=document.getElementById('rguide'); g.style.top=", "var g=document.getElementById('rguide'); if(g)g.style.top=")
a.write_text(v)
css=Path('assets/ajustes-interfaz.css')
v=css.read_text()
if '#pl{display:none!important}' not in v:v+='\n/* Paneles anteriores: el único reproductor visible usa ig-music-panel. */\n#pl{display:none!important}\n'
css.write_text(v)
# Las reglas de caché largas solo se aplican a recursos que llevan hash en el nombre.
toml=Path('netlify.toml');v=toml.read_text()
if 'for = "/assets/runtime/*"' not in v:v+='\n[[headers]]\n  for = "/assets/runtime/*"\n  [headers.values]\n    Cache-Control = "public, max-age=31536000, immutable"\n'
toml.write_text(v)
# Informe técnico, no una fecha de revisión documental por ficha.
Path('reports').mkdir(exist_ok=True)
Path('reports/technical-changes.json').write_text(json.dumps(REPORT,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(REPORT,ensure_ascii=False,indent=2))
