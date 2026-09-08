#!/usr/bin/env python3
"""Genera las versiones inglesas de Vida diaria y Datos sin modificar el contenido español.

Las traducciones viven en fuentes JSON paralelas bajo en/. La estructura española es la
referencia de contenido; este script solo materializa páginas inglesas y añade los enlaces
ES↔EN a las páginas españolas de estas dos colecciones.
"""
from __future__ import annotations
import html
import json
import re
import shutil
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ES_VIDA = ROOT / 'es/biblioteca/vida-diaria.json'
EN_VIDA = ROOT / 'en/everyday-life/everyday-life.json'
ES_DATA = ROOT / 'es/datos/datos.json'
EN_DATA = ROOT / 'en/data/data.json'


def esc(s): return html.escape(str(s), quote=True)
def load(p): return json.loads(p.read_text(encoding='utf-8'))
def slugify(s):
    s=unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower()
    s=re.sub(r'[^a-z0-9]+','-',s).strip('-')
    return s or 'entry'

def short(s,n=170):
    s=' '.join(str(s).split())
    return s if len(s)<=n else s[:n-1].rstrip()+'…'

def ensure_parallel(es,en,key):
    if len(es)!=len(en): raise ValueError(f'{key}: ES={len(es)} EN={len(en)}')

def common_head(title, desc, canonical, locale='en_GB'):
    return f'''<meta charset="utf-8"/><meta content="width=device-width,initial-scale=1" name="viewport"/>
<title>{esc(title)}</title><meta name="description" content="{esc(short(desc,160))}"/><meta name="theme-color" content="#f6f8fb"/>
<link rel="canonical" href="https://irisgreen.eu{canonical}"/><meta name="author" content="Iris Green"/>
<meta property="og:type" content="website"/><meta property="og:locale" content="{locale}"/><meta property="og:site_name" content="Iris Green"/><meta property="og:title" content="{esc(title)}"/><meta property="og:description" content="{esc(short(desc,160))}"/><meta property="og:url" content="https://irisgreen.eu{canonical}"/><meta property="og:image" content="https://irisgreen.eu/img/og-condiciones.png"/><meta name="twitter:card" content="summary_large_image"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/><link crossorigin href="https://fonts.gstatic.com"/><link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400&amp;family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&amp;display=swap" rel="stylesheet"/>
<link href="/assets/site-v23.css" rel="stylesheet"/><link rel="stylesheet" href="/assets/ajustes-interfaz.css"/><link rel="stylesheet" href="/assets/controles-comunes.css"/><link rel="stylesheet" href="/assets/preferencias-lectura.css">'''

NAV='''<header class="hd"><a class="brand" href="/"><img alt="" height="28" onerror="this.remove()" src="/img/v40-brand-symbol.webp" width="28"/><span>Iris Green</span></a><button aria-controls="nav" aria-expanded="false" class="ico menu" id="mBtn"><svg aria-hidden="true" viewbox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"></path></svg><span>Menu</span></button><button type="button" class="ig-menu-button" aria-label="Open menu" aria-controls="ig-main-nav" aria-expanded="false">Menu</button><nav aria-label="Explore" class="nav" id="ig-main-nav"><a href="/">Home</a><a href="/en/neurodiversity/conditions/">Conditions</a><a href="/en/situations/">Situations</a><a href="/en/everyday-life/">Everyday life</a><a href="/es/videos/">Videos</a><a href="/es/investigacion/">Research</a><a href="/en/data/">Data</a><a href="/es/tramites/directorio/">Support</a><a href="/es/libros/">Books</a><a href="/es/recursos/juegos/">Play</a><span aria-hidden="true" class="sep"></span><a class="calma ig-calma" href="/en/interests/">Your interests</a><a class="calma ig-calma" href="/es/taller/">The workshop</a><a class="calma ig-calma" href="/en/quiet-space/">Quiet space</a></nav><div class="tools"><button aria-controls="a11y" aria-expanded="false" class="ico" id="a11yBtn" aria-label="Accessible reading"><svg aria-hidden="true" viewbox="0 0 24 24"><circle cx="12" cy="4.5" r="2"></circle><path d="M4 8.5h16M12 10.5v11M12 15h-4l-2 6M12 15h4l2 6"></path></svg><span>Reading</span></button><button aria-controls="pl" aria-expanded="false" class="ico" id="plBtn" aria-label="Music"><svg aria-hidden="true" viewbox="0 0 24 24"><path d="M9 18V6l11-2v12"></path><circle cx="6" cy="18" r="3"></circle><circle cx="17" cy="16" r="3"></circle></svg><span>Music</span></button></div>'''
PANELS='''<div class="panel" hidden id="pl"></div><div class="panel a11yp" hidden id="a11y"><h2>Accessible reading</h2><div class="ctrls"><div class="grp"><span>Text size</span><button aria-label="Text size −" data-a="fs-">A−</button><button aria-label="Text size +" data-a="fs+">A+</button></div><button data-a="ls">Wider letter spacing</button><button data-a="big">Bigger buttons</button><button data-a="hc">More contrast</button><button data-a="guide">Reading guide</button><button data-a="tts">Read aloud</button><button data-a="rm">Reduce motion</button><button class="reset" data-a="reset">Reset</button></div></div>'''
FOOT='''<footer class="ft"><p><strong>Iris Green</strong> · Knowledge base on neurodiversity</p><nav aria-label="Explore" class="ftnav"><a href="/es/sobre-iris-green/">About Iris Green</a><a href="/es/sobre-iris-green/#criterios-editoriales">Methodology</a><a href="/es/lectura-accesible/">Accessibility</a><a href="/en/privacy/">Privacy</a><a href="mailto:informacion@irisgreen.eu?subject=Error%20on%20an%20Iris%20Green%20page">Report an error</a></nav></footer><div hidden id="rguide"></div><script src="/assets/lectura-accesible.js"></script><script defer src="/assets/interfaz-comun.js"></script><script defer src="/assets/musica.js"></script>'''

VIDA_CSS='''<style>.filter-tools{margin:1.25rem 0 1.5rem;display:grid;gap:.8rem}.searchrow{display:flex;gap:.75rem;align-items:center;flex-wrap:wrap}.searchrow input{min-height:46px;border:1px solid var(--line,#dfe5ee);border-radius:999px;padding:.7rem 1rem;min-width:min(100%,380px);font:inherit;background:#fff;color:inherit}.catbuttons{display:flex;gap:.5rem;flex-wrap:wrap}.catbuttons button{border:1px solid var(--line,#dfe5ee);background:#fff;color:inherit;border-radius:999px;padding:.55rem .9rem;font:inherit;cursor:pointer;min-height:42px}.catbuttons button[aria-pressed="true"]{background:#1f5f8b;color:#fff;border-color:#1f5f8b}.group-title{margin-top:2rem}.card .meta{font-size:.88rem;color:#667085}.concepts-box{margin-top:2.5rem;padding:1.2rem;border:1px solid var(--line,#e1e6ee);border-radius:20px;background:rgba(255,255,255,.72)}.concept-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:.55rem 1rem;max-height:520px;overflow:auto;padding:.25rem}.concept-row{padding:.55rem .65rem;border-radius:10px;background:rgba(23,57,92,.04)}.concept-row strong{display:block;font-size:.96rem;margin-bottom:.2rem}.concept-row .routes{font-size:.88rem;line-height:1.45}.concept-row .routes a{display:inline}.deadline{margin:1rem 0;padding:1rem;border-radius:14px;background:rgba(168,51,111,.08);border:1px solid rgba(168,51,111,.28)}.source-note{margin:.8rem 0;padding:.8rem 1rem;border-radius:12px;background:rgba(212,151,63,.13);color:#6e491e}.related{display:flex;flex-wrap:wrap;gap:.45rem;margin:.5rem 0 0}.related a{display:inline-block;border-radius:999px;padding:.35rem .65rem;background:rgba(90,73,168,.09);text-decoration:none}@media(max-width:700px){.concept-list{grid-template-columns:1fr}.searchrow input{width:100%}}</style>'''
DATA_CSS='''<style>.tabla{overflow-x:auto;margin:1rem 0}.tabla table{border-collapse:collapse;width:100%;font-size:.94rem}.tabla th,.tabla td{border:1px solid var(--line,#dfe5ee);padding:.5rem .65rem;text-align:left;vertical-align:top}.tabla th{background:#f1f5fa;font-weight:600}.cifra-b{margin:1.25rem 0}.cifra-b .n{display:block;font-size:1.45rem;font-weight:600;line-height:1.2}.cifra-b .pie{display:block;color:#5a6577;font-size:.95rem;margin-bottom:.4rem}.tecnica{list-style:none;padding:0;margin:.5rem 0 0}.tecnica li{padding:.3rem 0;border-bottom:1px solid var(--line,#e6eaf1)}.tecnica li:last-child{border-bottom:0}.fuentes{margin:.25rem 0 0;padding-left:1.1rem}.fuentes li{margin:.3rem 0}</style>'''


def render_nodes(nodes):
    out=[]
    for n in nodes or []:
        if isinstance(n,str): out.append(f'<p>{esc(n)}</p>'); continue
        t=n.get('t','p')
        if t=='p': out.append(f'<p>{esc(n.get("text",""))}</p>')
        elif t=='ul': out.append('<ul>'+''.join(f'<li>{esc(x)}</li>' for x in n.get('items',[]))+'</ul>')
        elif t=='ol': out.append('<ol>'+''.join(f'<li>{esc(x)}</li>' for x in n.get('items',[]))+'</ol>')
        elif t=='table':
            rows=n.get('rows',[]); heads=n.get('headers',[])
            out.append('<div class="tabla"><table>'+(('<thead><tr>'+''.join(f'<th>{esc(x)}</th>' for x in heads)+'</tr></thead>') if heads else '')+'<tbody>'+''.join('<tr>'+''.join(f'<td>{esc(x)}</td>' for x in r)+'</tr>' for r in rows)+'</tbody></table></div>')
        else: out.append(f'<p>{esc(n.get("text",str(n)))}</p>')
    return ''.join(out)


def vida_maps(es,en):
    ensure_parallel(es['fichas'],en['fichas'],'vida fichas')
    title_to=( {a['title']:b['title'] for a,b in zip(es['fichas'],en['fichas'])} )
    es_slug={p.parent.name:p for p in (ROOT/'es/biblioteca').glob('*/index.html')}
    # translation JSON must explicitly provide slug_en for stable URLs
    en_slug={a['title']:b.get('slug_en') or slugify(b['title']) for a,b in zip(es['fichas'],en['fichas'])}
    return title_to,en_slug


def render_vida(es,en):
    outdir=ROOT/'en/everyday-life'; outdir.mkdir(parents=True,exist_ok=True)
    title_to,en_slug=vida_maps(es,en)
    # English source keeps conceptos parallel so labels are consistent.
    ensure_parallel(es.get('conceptos',[]),en.get('conceptos',[]),'vida conceptos')
    cats=en['categorias']; groups=[]
    for cat in cats:
        cards=[]
        for e,b in zip(es['fichas'],en['fichas']):
            if b['cat']!=cat: continue
            slug=en_slug[e['title']]
            search=' '.join([b['title'],b['lede'],b['cat']]+b.get('concepts',[])).lower()
            cards.append(f'<a class="card vd-card" data-cat="{esc(cat)}" data-search="{esc(search)}" href="/en/everyday-life/{esc(slug)}/"><span class="chip">{esc(cat)}</span><strong>{esc(b["title"])}</strong><span>{esc(short(b["lede"]))}</span><span class="meta">{len(b.get("sources",[]))} source'+('' if len(b.get('sources',[]))==1 else 's')+' · DRAFT</span></a>')
        if cards: groups.append(f'<section class="vd-group" data-group="{esc(cat)}"><h2 class="group-title">{esc(cat)}</h2><div class="cards">'+''.join(cards)+'</div></section>')
    concepts=[]
    for ec,bc in zip(es.get('conceptos',[]),en.get('conceptos',[])):
        links=[]
        for es_title,en_title in zip(ec.get('fichas',[]),bc.get('fichas',[])):
            slug=en_slug.get(es_title)
            if not slug: continue
            links.append(f'<a href="/en/everyday-life/{esc(slug)}/">{esc(en_title)}</a>')
        search=' '.join([bc.get('concepto','')]+bc.get('fichas',[])).lower()
        concepts.append(f'<div class="concept-row vd-concept" id="concept-{slugify(bc.get("concepto",""))}" data-search="{esc(search)}"><strong>{bc.get("n",ec.get("n",""))}. {esc(bc.get("concepto",""))}</strong><div class="routes">'+ ' · '.join(links) +'</div></div>')
    desc=en.get('description') or 'Practical everyday-life entries on support, rights, health, education, work, home, relationships and safety, with linked sources.'
    body=f'''<p class="crumb"><a href="/">Home</a></p><h1>{esc(en.get('page_title','What exists, how to ask for it and where it is written'))}</h1><p class="lede">{esc(en.get('page_lede','Forty-eight practical entries. Each one addresses a real-life situation, explains what can be requested and links to the official source.'))}</p><p class="notice">{esc(en['aviso'])}</p><details class="sec"><summary><strong>Editorial criteria for this collection</strong></summary><p>{esc(en['criterio'])}</p></details><div class="filter-tools"><div class="searchrow"><label for="vd-search"><strong>Search</strong></label><input id="vd-search" type="search" placeholder="Search a situation or concept" autocomplete="off"/><span id="vd-count">{len(en['fichas'])} entries</span></div><div class="catbuttons" aria-label="Filter by category"><button type="button" data-cat="" aria-pressed="true">All</button>{''.join(f'<button type="button" data-cat="{esc(c)}" aria-pressed="false">{esc(c)}</button>' for c in cats)}</div></div>{''.join(groups)}<section class="concepts-box"><h2>The 185 concepts and their entries</h2><p>Each concept in the A–Z index links to at least one practical entry. The search box above also filters this list.</p><div class="concept-list">{''.join(concepts)}</div></section>'''
    js="""<script>(function(){const input=document.getElementById('vd-search'),buttons=[...document.querySelectorAll('.catbuttons button')],cards=[...document.querySelectorAll('.vd-card')],groups=[...document.querySelectorAll('.vd-group')],concepts=[...document.querySelectorAll('.vd-concept')],count=document.getElementById('vd-count');let cat='';function norm(s){return (s||'').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'')}function run(){const q=norm(input.value).trim();let n=0;cards.forEach(c=>{const okCat=!cat||c.dataset.cat===cat;const okQ=!q||norm(c.dataset.search).includes(q);c.hidden=!(okCat&&okQ);if(!c.hidden)n++});groups.forEach(g=>{g.hidden=![...g.querySelectorAll('.vd-card')].some(c=>!c.hidden)});concepts.forEach(c=>{c.hidden=!!q&&!norm(c.dataset.search).includes(q)});count.textContent=n+(n===1?' entry':' entries')}buttons.forEach(b=>b.addEventListener('click',()=>{cat=b.dataset.cat;buttons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));run()}));input.addEventListener('input',run);})();</script>"""
    head=common_head('Everyday life · Iris Green',desc,'/en/everyday-life/')+VIDA_CSS
    index=f'<!DOCTYPE html><html lang="en"><head><script src="/assets/preferencias-lectura.js"></script>{head}</head><body class="conditions-collection"><a class="skip" href="#main">Skip to content</a>{NAV}<nav aria-label="Language" class="langs"><span aria-current="true" class="lang on">EN</span><a class="lang" href="/es/biblioteca/" lang="es">ES</a></nav></header>{PANELS}<main id="main">{body}</main>{FOOT}{js}</body></html>'
    (outdir/'index.html').write_text(index,encoding='utf-8')

    for e,b in zip(es['fichas'],en['fichas']):
        slug=en_slug[e['title']]; p=outdir/slug; p.mkdir(parents=True,exist_ok=True)
        es_path=None
        for cand in (ROOT/'es/biblioteca').glob('*/index.html'):
            txt=cand.read_text(encoding='utf-8')
            if f'<h1>{html.escape(e["title"])}</h1>' in txt or f'<h1>{e["title"]}</h1>' in txt:
                es_path=cand; break
        if not es_path: raise ValueError('Spanish Vida page not found: '+e['title'])
        intro=f'<section class="sec"><p>{esc(b["lede"])}</p></section>'
        secs=''.join(f'<section class="sec"><h2>{esc(s["h"])}</h2>'+''.join(f'<p>{esc(x)}</p>' for x in s.get('p',[]))+'</section>' for s in b.get('sections',[]))
        sources='<section class="sec"><h2>Sources</h2><ul class="fuentes">'+''.join(f'<li><a href="{esc(x["url"])}" rel="noopener" target="_blank">{esc(x["label"])}</a></li>' for x in b.get('sources',[]))+'</ul></section>'
        related=''
        if b.get('concepts'):
            related='<section class="sec"><h2>Related to</h2><div class="related">'+''.join(f'<a href="/en/everyday-life/#concept-{slugify(x)}">{esc(x)}</a>' for x in b['concepts'])+'</div></section>'
        extras=''
        if b.get('plazo'): extras+=f'<div class="deadline"><strong>Deadline:</strong> {esc(b["plazo"])}</div>'
        if b.get('notaFuente') or b.get('avisoFuente'): extras+=f'<p class="source-note">{esc(b.get("notaFuente") or b.get("avisoFuente"))}</p>'
        tech=f'<section class="sec consult"><h2>Technical information</h2><ul class="tecnica"><li><strong>Category:</strong> {esc(b["cat"])}</li><li><strong>Status:</strong> draft</li><li><strong>Author:</strong> Iris Green</li></ul></section>'
        desc=b['lede']; canonical=f'/en/everyday-life/{slug}/'
        head=common_head(f'{b["title"]} · Everyday life',desc,canonical)+VIDA_CSS
        article=f'<article class="ficha"><p class="crumb"><a href="/">Home</a> › <a href="/en/everyday-life/">Everyday life</a></p><h1>{esc(b["title"])}</h1><p class="chips"><span class="chip">{esc(b["cat"])}</span><span class="chip lil">DRAFT</span></p><p class="notice">Draft page. Sources are named and linked; final checking is still pending.</p>{extras}{intro}{secs}{sources}{related}{tech}</article>'
        page=f'<!DOCTYPE html><html lang="en"><head><script src="/assets/preferencias-lectura.js"></script>{head}</head><body><a class="skip" href="#main">Skip to content</a>{NAV}<nav aria-label="Language" class="langs"><span aria-current="true" class="lang on">EN</span><a class="lang" href="/{es_path.relative_to(ROOT).parent.as_posix()}/" lang="es">ES</a></nav></header>{PANELS}<main id="main">{article}</main>{FOOT}</body></html>'
        (p/'index.html').write_text(page,encoding='utf-8')


def render_data(es,en):
    outdir=ROOT/'en/data'; outdir.mkdir(parents=True,exist_ok=True)
    ensure_parallel(es['paginas'],en['paginas'],'data pages')
    slug_map={a['title']:b.get('slug_en') or slugify(b['title']) for a,b in zip(es['paginas'],en['paginas'])}
    by_territory=[]
    for terr in en.get('territorios',[]):
        cards=[]
        for a,b in zip(es['paginas'],en['paginas']):
            if b.get('territorio')!=terr: continue
            slug=slug_map[a['title']]
            lede=' '.join(x.get('text','') if isinstance(x,dict) else str(x) for x in b.get('lede',[]))
            cards.append(f'<a class="card" href="/en/data/{esc(slug)}/"><span class="chip">{esc(terr)}</span><strong>{esc(b["title"])}</strong><span>{esc(short(lede))}</span></a>')
        if cards: by_territory.append(f'<h2>{esc(terr)}</h2><div class="cards">'+''.join(cards)+'</div>')
    cover=en['cover']; desc=' '.join(cover.get('lede',[]))
    extras=''.join(f'<section class="sec"><h2>{esc(s["h"])}</h2>{render_nodes(s.get("p",[]))}</section>' for s in cover.get('sections',[]))
    body=f'<p class="crumb"><a href="/">Home</a></p><h1>{esc(cover["title"])}</h1>'+''.join(f'<p class="lede">{esc(x)}</p>' for x in cover.get('lede',[]))+f'<p class="notice">All {len(en["paginas"])} pages in this section are currently drafts: sources are named and linked, and final checking is still pending.</p>'+''.join(by_territory)+extras
    head=common_head(cover['title']+' · Iris Green',desc,'/en/data/')+DATA_CSS
    index=f'<!DOCTYPE html><html lang="en"><head><script src="/assets/preferencias-lectura.js"></script>{head}</head><body class="conditions-collection"><a class="skip" href="#main">Skip to content</a>{NAV}<nav aria-label="Language" class="langs"><span aria-current="true" class="lang on">EN</span><a class="lang" href="/es/datos/" lang="es">ES</a></nav></header>{PANELS}<main id="main">{body}</main>{FOOT}</body></html>'
    (outdir/'index.html').write_text(index,encoding='utf-8')

    for a,b in zip(es['paginas'],en['paginas']):
        slug=slug_map[a['title']]; d=outdir/slug; d.mkdir(parents=True,exist_ok=True)
        es_path=None
        for cand in (ROOT/'es/datos').glob('*/index.html'):
            txt=cand.read_text(encoding='utf-8')
            if f'<h1>{html.escape(a["title"])}</h1>' in txt or f'<h1>{a["title"]}</h1>' in txt:
                es_path=cand; break
        if not es_path: raise ValueError('Spanish Data page not found: '+a['title'])
        desc=' '.join(x.get('text','') if isinstance(x,dict) else str(x) for x in b.get('lede',[]))
        intro=render_nodes(b.get('lede',[]))
        figures=[]
        for c in b.get('cifras',[]):
            figures.append('<div class="cifra-b"><span class="n">'+esc(c.get('cifra',''))+'</span>'+ (f'<span class="pie">{esc(c["pie"])}</span>' if c.get('pie') else '') + render_nodes(c.get('b',[]))+'</div>')
        def section(h,key,cls='sec'):
            nodes=b.get(key,[])
            return f'<section class="{cls}"><h2>{esc(h)}</h2>{render_nodes(nodes)}</section>' if nodes else ''
        sources='<section class="sec"><h2>Sources</h2><ul class="fuentes">'+''.join(f'<li><a href="{esc(x["url"])}" rel="noopener" target="_blank">{esc(x["label"])}</a></li>' for x in b.get('sources',[]))+'</ul></section>'
        tech_items=[('Population measured',b.get('poblacion','')),('Data year',b.get('anioDatos','')),('Time reference',b.get('refTemporal','')),('Method',b.get('metodo','')),('Publication',b.get('publicacion','')),('Planned review',b.get('revision',''))]
        tech='<section class="sec consult"><h2>Technical information</h2><ul class="tecnica">'+''.join(f'<li><strong>{esc(k)}:</strong> {esc(v)}</li>' for k,v in tech_items if v)+'</ul></section>'
        article=f'<article class="ficha"><p class="crumb"><a href="/">Home</a> › <a href="/en/data/">Data</a></p><h1>{esc(b["title"])}</h1><p class="chips"><span class="chip">{esc(b.get("territorio",""))}</span>{(f"<span class=\"chip alt\">Data from {esc(b.get('anioDatos',''))}</span>" if b.get("anioDatos") else "")}<span class="chip lil">DRAFT</span></p><p class="notice">Draft page. Sources are named and linked; final checking is still pending.</p><section class="sec">{intro}</section>{(f"<section class=\"sec\"><h2>{esc(b.get('cifrasH','Figures'))}</h2>{render_nodes(b.get('cifrasIntro',[]))}{''.join(figures)}</section>" if figures else '')}{section(b.get('mideH','What it measures'),'mide')}{section(b.get('citarH','How to cite it'),'citar','sec helps')}{section(b.get('evitarH','What to avoid'),'evitar')}{sources}{tech}</article>'
        head=common_head(f'{b["title"]} · Data',desc,f'/en/data/{slug}/')+DATA_CSS
        page=f'<!DOCTYPE html><html lang="en"><head><script src="/assets/preferencias-lectura.js"></script>{head}</head><body><a class="skip" href="#main">Skip to content</a>{NAV}<nav aria-label="Language" class="langs"><span aria-current="true" class="lang on">EN</span><a class="lang" href="/{es_path.relative_to(ROOT).parent.as_posix()}/" lang="es">ES</a></nav></header>{PANELS}<main id="main">{article}</main>{FOOT}</body></html>'
        (d/'index.html').write_text(page,encoding='utf-8')


def add_es_selectors(es_vida,en_vida,es_data,en_data):
    # Only add EN links; never alter Spanish body content.
    title_to_slug_vida={a['title']:b.get('slug_en') or slugify(b['title']) for a,b in zip(es_vida['fichas'],en_vida['fichas'])}
    p=ROOT/'es/biblioteca/index.html'; s=p.read_text(encoding='utf-8')
    if '/en/everyday-life/' not in s:
        s=s.replace('<nav aria-label="Idioma" class="langs"><span aria-current="true" class="lang on">ES</span></nav>','<nav aria-label="Idioma" class="langs"><span aria-current="true" class="lang on">ES</span><a class="lang" href="/en/everyday-life/" lang="en">EN</a></nav>',1)
        p.write_text(s,encoding='utf-8')
    for page in (ROOT/'es/biblioteca').glob('*/index.html'):
        s=page.read_text(encoding='utf-8'); m=re.search(r'<h1>(.*?)</h1>',s,re.S)
        title=html.unescape(re.sub('<[^>]+>','',m.group(1))).strip() if m else ''
        slug=title_to_slug_vida.get(title)
        if slug and '/en/everyday-life/' not in s:
            s=s.replace('<nav aria-label="Idioma" class="langs"><span aria-current="true" class="lang on">ES</span></nav>',f'<nav aria-label="Idioma" class="langs"><span aria-current="true" class="lang on">ES</span><a class="lang" href="/en/everyday-life/{slug}/" lang="en">EN</a></nav>',1)
            page.write_text(s,encoding='utf-8')
    title_to_slug_data={a['title']:b.get('slug_en') or slugify(b['title']) for a,b in zip(es_data['paginas'],en_data['paginas'])}
    p=ROOT/'es/datos/index.html'; s=p.read_text(encoding='utf-8')
    if '/en/data/' not in s:
        s=s.replace('<span aria-current="true" class="lang on">ES</span>\n</nav>','<span aria-current="true" class="lang on">ES</span>\n<a class="lang" href="/en/data/" lang="en">EN</a>\n</nav>',1); p.write_text(s,encoding='utf-8')
    for page in (ROOT/'es/datos').glob('*/index.html'):
        s=page.read_text(encoding='utf-8'); m=re.search(r'<h1>(.*?)</h1>',s,re.S)
        title=html.unescape(re.sub('<[^>]+>','',m.group(1))).strip() if m else ''
        slug=title_to_slug_data.get(title)
        if slug and '/en/data/' not in s:
            s=s.replace('<span aria-current="true" class="lang on">ES</span>\n</nav>',f'<span aria-current="true" class="lang on">ES</span>\n<a class="lang" href="/en/data/{slug}/" lang="en">EN</a>\n</nav>',1); page.write_text(s,encoding='utf-8')


def main():
    for p in (EN_VIDA,EN_DATA):
        if not p.is_file(): raise SystemExit(f'Missing translation source: {p.relative_to(ROOT)}')
    esv,env,esd,end=load(ES_VIDA),load(EN_VIDA),load(ES_DATA),load(EN_DATA)
    render_vida(esv,env); render_data(esd,end); add_es_selectors(esv,env,esd,end)
    print(json.dumps({'everyday_life':len(env['fichas']),'data':len(end['paginas'])},ensure_ascii=False))

if __name__=='__main__': main()
