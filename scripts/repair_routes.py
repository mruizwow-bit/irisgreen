#!/usr/bin/env python3
"""Rutas/SEO técnico, sin cambiar fichas, reglas, ilustraciones o decisiones noindex.
La correspondencia portuguesa procede exclusivamente de los enlaces ES existentes.
"""
from __future__ import annotations
import argparse
import hashlib
import html
import json
import re
import tomllib
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

SITE='https://irisgreen.eu'
SITEMAP_NS='http://www.sitemaps.org/schemas/sitemap/0.9'
ROOT=Path(__file__).resolve().parents[1]
PUBLIC_DIRS=('assets','audio','img','es','en')
PUBLIC_ROOT=('index.html','404.html','buscador.json','videoteca-listado.json','support.js','sitemap.xml','sitemap-1.xml','robots.txt','llms.txt','_headers','_redirects')

class Page(HTMLParser):
    def __init__(self,text):
        super().__init__(convert_charrefs=True)
        self.canonical=[];self.alternates=[];self.es_links=[];self.robots=[];self.meta=[];self.anchors=[];self.ids=set();self.lang='';self.feed(text)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.add(a['id'])
        if tag=='html':self.lang=a.get('lang','')
        if tag=='meta':
            self.meta.append(a)
            if a.get('name','').lower()=='robots':self.robots.append(a.get('content',''))
        if tag=='link':
            if 'canonical' in a.get('rel','').split():self.canonical.append(a.get('href',''))
            if 'hreflang' in a:self.alternates.append((a['hreflang'],a.get('href','')))
        if tag=='a' and a.get('href'):
            self.anchors.append(a)
            if a.get('lang','').lower()=='es':self.es_links.append(a['href'])
    @property
    def noindex(self):return any('noindex' in re.split(r'[,\s]+',s.lower()) for s in self.robots)

def route(rel):
    return '/'+(rel[:-10] if rel.endswith('index.html') else rel)

def web_pages(root=ROOT,portuguese=True):
    files=[root/'index.html']
    for lang in ('es','en','pt-br') if portuguese else ('es','en'):
        files.extend(sorted((root/lang).rglob('*.html')))
    return [p for p in files if p.is_file()]

def resolve(root,path):
    rel=unquote(urlsplit(path).path).lstrip('/')
    if '..' in Path(rel).parts:return None
    for name in [rel,rel.rstrip('/')+'/index.html' if rel else 'index.html',rel+'.html']:
        p=root/name
        if p.is_file():return p
    return None

def compact(value):return json.dumps(value,ensure_ascii=False,separators=(',',':'))

ERROR_PAGE='''<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Página no encontrada · Iris Green</title><meta name="robots" content="noindex,follow">
<link rel="stylesheet" href="/assets/site-v23.css"><link rel="stylesheet" href="/assets/ajustes-interfaz.css">
</head><body style="min-height:100vh;background-repeat:no-repeat;"><main id="main" style="max-width:48rem;margin:auto;padding:clamp(2rem,8vw,6rem) 1.5rem;">
<a href="/" style="font:inherit">Iris Green</a>
<h1>No encontramos esa página</h1><p>La dirección puede haber cambiado. Puedes volver al inicio o consultar el mapa de la web.</p>
<nav aria-label="Dónde continuar" style="display:flex;flex-wrap:wrap;gap:1rem"><a href="/" style="display:inline-flex;align-items:center;min-height:44px">Volver al inicio</a><a href="/es/neurodiversidad/mapa/" style="display:inline-flex;align-items:center;min-height:44px">Ver el mapa de la web</a></nav>
</main></body></html>
'''

def render_config(old):
    data=tomllib.loads(old);rules=data.get('redirects',[])
    removed=[];kept=[]
    for r in rules:
        if r.get('from','').rstrip('/')==r.get('to','').rstrip('/') or r.get('from')=='/pt-br/*':removed.append(r)
        else:kept.append(r)
    assert set(data)<= {'build','redirects','headers'},'Revisar nuevas opciones de Netlify antes de migrar'
    assert set(data['build'])<= {'publish','command','processing','environment'},'Opciones de build no previstas'
    out=['# Iris Green · publicación de archivos públicos, no de la carpeta de trabajo.','[build]','  publish = "dist"','  command = "python3 scripts/build_site.py"','','# Netlify normaliza las barras: no usar redirecciones hacia la misma ruta.','[build.processing.html]','  pretty_urls = true','']
    # Preserve explicit build environment settings, including PYTHON_VERSION.
    environment=data['build'].get('environment',{})
    assert isinstance(environment,dict) and all(isinstance(k,str) and isinstance(v,str) for k,v in environment.items()),'Entorno de build no válido'
    if environment:
        out+=['[build.environment]']
        out.extend('  '+json.dumps(k)+' = '+json.dumps(v) for k,v in sorted(environment.items()))
        out+=['']
    for r in kept:
        assert set(r)<= {'from','to','status','force'},'Regla condicional no prevista'
        out+=['[[redirects]]']
        out.extend('  '+k+' = '+(str(v).lower() if isinstance(v,bool) else str(v) if isinstance(v,int) else json.dumps(v,ensure_ascii=False)) for k,v in r.items());out+=['']
    for h in data.get('headers',[]):
        out+=['[[headers]]','  for = '+json.dumps(h['for']),'  [headers.values]']
        out.extend('    '+json.dumps(k)+' = '+json.dumps(v) for k,v in h['values'].items());out+=['']
    return '\n'.join(out),removed

def run(check=False):
    report={'metadata_alternates_removed':{},'breadcrumbs_removed':[],'redirects':[],'source_edits':[],'existing_noindex_preserved':True}
    before_sitemap=ET.parse(ROOT/'sitemap.xml')
    before_urls=[e.text for e in before_sitemap.findall('.//{'+SITEMAP_NS+'}loc')]
    report['before_sitemap_count']=len(before_urls)
    report['sitemap_lastmods_removed']=len(before_sitemap.findall('.//{'+SITEMAP_NS+'}lastmod'))
    staged={}
    for p in web_pages():
        rel=p.relative_to(ROOT).as_posix();old=p.read_text();doc=Page(old)
        if rel.startswith('pt-br/'):
            refs=[u for lang,u in doc.alternates if lang.lower()=='es'] or doc.es_links
            assert refs,'Falta correspondencia española: '+rel
            target=urljoin(SITE+route(rel),refs[0]);parts=urlsplit(target)
            assert parts.netloc=='irisgreen.eu' and parts.path.startswith('/es/'),(rel,target)
            dest=resolve(ROOT,parts.path);assert dest is not None,(rel,target)
            canonical=Page(dest.read_text()).canonical
            assert canonical==[SITE+parts.path],(rel,canonical,target)
            report['redirects'].append({'from':route(rel),'to':parts.path,'status':301,'source':refs[0]})
            continue
        s,n=re.subn(r'<link\b(?=[^>]*\bhreflang=["\']pt(?:-br)?["\'])[^>]*>\s*','',old,flags=re.I)
        if n:report['metadata_alternates_removed'][rel]=n
        if rel in ('es/neurodiversidad/condiciones/index.html','en/neurodiversity/conditions/index.html'):
            s,n=re.subn(r'<p class="crumb">\s*<a\b[^>]*>\s*(?:Inicio|Home)\s*</a>\s*</p>\s*','',s)
            if n:report['breadcrumbs_removed'].append(rel)
            def ld(m):
                j=json.loads(m[2])
                if isinstance(j,dict) and '@graph' in j:
                    j['@graph']=[x for x in j['@graph'] if x.get('@type')!='BreadcrumbList']
                return m[1]+compact(j)+m[3]
            s=re.sub(r'(<script\b[^>]*type="application/ld\+json"[^>]*>)(.*?)(</script>)',ld,s,flags=re.S)
        if rel=='es/sobre-iris-green/index.html' and 'id="criterios-editoriales"' not in s:
            pattern=r'(<section)(\s+style="margin-bottom: 30px;")(?=\s*>\s*<h2[^>]*>\{\{ tHowTitle \}\})'
            s,n=re.subn(pattern,r'\1 id="criterios-editoriales"\2',s)
            assert n==1,'No se encuentra el apartado editorial existente'
            s=s.replace('id="criterios-editoriales" style="margin-bottom: 30px;"','id="criterios-editoriales" style="margin-bottom: 30px; scroll-margin-top: 10rem;"')
        if rel=='es/sobre-iris-green/index.html' and 'ig-route-editorial' not in s:
            old_mount='  componentDidMount() {'
            new_mount='  componentDidMount() {\n    // ig-route-editorial: navigate after the dynamic target is mounted.\n    requestAnimationFrame(() => {\n      if (window.location.hash === "#criterios-editoriales") {\n        const target = document.getElementById("criterios-editoriales");\n        if (target) target.scrollIntoView({ block: "start", behavior: "instant" });\n      }\n    });'
            assert s.count(old_mount)==1,'No se encuentra el arranque de la página editorial'
            s=s.replace(old_mount,new_mount,1)
        if rel=='index.html':
            s,n=re.subn(r'(href=")/es/tramites/("[^>]*>\{\{ tPedirCta2 \}\})',r'\1/es/tramites/directorio/\2',s)
            if n:report['source_edits'].append('home: enlace del directorio de ayudas')
        assert Page(s).robots==doc.robots,'Cambio no autorizado de robots: '+rel
        if s!=old:staged[p]=s
    assert len(report['redirects'])==375,'El inventario portugués ha cambiado: revisar el mapeo'
    if (ROOT/'_redirects').exists():
        assert (ROOT/'_redirects').read_text().startswith('# Generado desde los enlaces españoles'), 'No sobrescribir reglas manuales no revisadas'
    red=['# Generado desde los enlaces españoles de las 375 páginas existentes.','# PT-BR sigue retirado: se mantiene el destino equivalente, no se publica su contenido.','/es/ / 301!','/pt-br/ / 301!']
    red.extend(r['from']+' '+r['to']+' 301!' for r in sorted(report['redirects'],key=lambda x:x['from']))
    red+=['# Una dirección portuguesa desconocida lleva al inicio, no a /es/ inexistente.','/pt-br/* / 301!','']
    staged[ROOT/'_redirects']='\n'.join(red)
    cfg,removed=render_config((ROOT/'netlify.toml').read_text());staged[ROOT/'netlify.toml']=cfg;report['config_rules_removed']=removed
    staged[ROOT/'404.html']=ERROR_PAGE
    gitignore=ROOT/'.gitignore';ign=gitignore.read_text() if gitignore.exists() else ''
    for line in ['dist/','.baseline/','__pycache__/']:
        if line not in ign.splitlines():ign+=('\n' if ign and not ign.endswith('\n') else '')+line+'\n'
    staged[gitignore]=ign
    llms=(ROOT/'llms.txt').read_text().replace('en español, inglés y portugués de Brasil','en español e inglés').replace('https://irisgreen.eu/es/vida-diaria/','https://irisgreen.eu/es/biblioteca/')
    staged[ROOT/'llms.txt']=llms
    hdr=(ROOT/'_headers').read_text()
    if '/sitemap-1.xml\n' not in hdr:hdr+='/sitemap-1.xml\n  Content-Type: application/xml; charset=UTF-8\n  Cache-Control: public, max-age=0, must-revalidate\n'
    staged[ROOT/'_headers']=hdr
    urls=[]
    for p in web_pages(portuguese=False):
        s=staged.get(p,p.read_text());d=Page(s);rel=p.relative_to(ROOT).as_posix();u=SITE+route(rel)
        if d.noindex:continue
        assert d.canonical==[u],(rel,d.canonical,'Canonical indexable no coincide')
        urls.append(u)
    assert len(urls)==len(set(urls))
    ET.register_namespace('',SITEMAP_NS);xml=ET.Element('{'+SITEMAP_NS+'}urlset')
    for u in sorted(urls):ET.SubElement(ET.SubElement(xml,'{'+SITEMAP_NS+'}url'),'{'+SITEMAP_NS+'}loc').text=u
    ET.indent(xml,space='  ');serialized='<?xml version="1.0" encoding="UTF-8"?>\n'+ET.tostring(xml,encoding='unicode')+'\n'
    staged[ROOT/'sitemap.xml']=serialized;staged[ROOT/'sitemap-1.xml']=serialized
    report['sitemap_count']=len(urls);report['sitemap_added']=sorted(set(urls)-set(before_urls));report['sitemap_removed']=sorted(set(before_urls)-set(urls))
    report['notes']=['No se modifica ningún noindex ni se oculta una ficha por su estado documental.','No se añaden fechas lastmod o fechas de revisión ficticias.','Las fechas uniformes de sitemap se omiten: no se ha establecido una modificación sustancial individual.','La copia sitemap-1.xml se conserva por compatibilidad, idéntica al sitemap principal.','No se certifica indexación ni rastreo por Google; las comprobaciones son técnicas.']
    changed=[p for p,s in staged.items() if not p.exists() or p.read_text()!=s]
    report['changed_files']=[p.relative_to(ROOT).as_posix() for p in changed]
    if check:
        assert not changed,'Hay que regenerar rutas y sitemap: '+str(report['changed_files'])
    else:
        for p in changed:p.write_text(staged[p],encoding='utf-8')
        out=ROOT/'reports/routes';out.mkdir(parents=True,exist_ok=True)
        if not (out/'changes.json').exists():(out/'changes.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(compact({'changed_files':len(changed),'sitemap_urls':len(urls),'portuguese_mappings':len(report['redirects']),'removed_alternates':sum(report['metadata_alternates_removed'].values())}))
    return report

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--check',action='store_true');run(parser.parse_args().check)
