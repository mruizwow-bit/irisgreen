#!/usr/bin/env python3
"""Revisa el directorio público real, no el árbol de desarrollo.
El servidor de prueba implementa el subconjunto de reglas utilizado por este sitio;
no sustituye la comprobación del CDN de Netlify después de publicar.
"""
from __future__ import annotations
import argparse, concurrent.futures, functools, hashlib, json, re, threading, tomllib
import xml.etree.ElementTree as ET
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from urllib.parse import urljoin,urlsplit,unquote
from urllib.request import urlopen
from urllib.error import HTTPError
from bs4 import BeautifulSoup

ROOT=Path.cwd();DIST=ROOT/'dist';OUT=ROOT/'reports/routes';OUT.mkdir(parents=True,exist_ok=True)
SITE='https://irisgreen.eu';NS={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
parser=argparse.ArgumentParser();parser.add_argument('--baseline',required=True);args=parser.parse_args();BASELINE=Path(args.baseline)
REPORT={'static':{},'redirects':{},'browser':[],'failures':[],'notes':['Se comprueban los archivos de dist, que es el directorio configurado para publicar.','El servidor local emula las reglas concretas del proyecto; no es el CDN de Netlify.','No se afirma inclusión en Google, revisión documental ni reproducción de vídeos externos.','Las dos portadas ausentes de Libros siguen siendo un pendiente aparte.']}

def path_of(rel):return '/'+(rel[:-10] if rel.endswith('index.html') else rel)
def lookup(path):
    rel=unquote(urlsplit(path).path).lstrip('/')
    if '..' in Path(rel).parts:return None
    for name in [rel,rel.rstrip('/')+'/index.html' if rel else 'index.html',rel+'.html']:
        p=DIST/name
        if p.is_file():return p
    return None

def parse_rules():
    rules=[]
    for line in (DIST/'_redirects').read_text().splitlines():
        if not line or line.startswith('#'):continue
        fields=line.split();assert len(fields)==3,line
        rules.append({'from':fields[0],'to':fields[1],'status':int(fields[2].rstrip('!')),'force':fields[2].endswith('!')})
    rules+=tomllib.loads((ROOT/'netlify.toml').read_text()).get('redirects',[])
    for r in rules:assert r['from'].rstrip('/')!=r['to'].rstrip('/'),r
    return rules
RULES=parse_rules()

def redirected(path):
    parsed=urlsplit(path);key=parsed.path.rstrip('/') or '/'
    for r in RULES:
        pattern=r['from'].rstrip('/') or '/'
        matched=key.startswith(pattern[:-1]) if pattern.endswith('*') else key==pattern
        if matched and (r.get('force') or lookup(parsed.path) is None):
            to=r['to'].replace(':splat',key[len(pattern)-1:] if pattern.endswith('*') else '')
            return r['status'],to+('?'+parsed.query if parsed.query and '?' not in to else '')
    return None

class Handler(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
    def do_GET(self):
        red=redirected(self.path)
        if red:
            self.send_response(red[0]);self.send_header('Location',red[1]);self.send_header('Content-Length','0');self.end_headers();return
        p=lookup(self.path)
        if p is not None and not p.suffix=='.html':return super().do_GET()
        if p is not None:
            blob=p.read_bytes();self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(blob)));self.end_headers();self.wfile.write(blob);return
        self.send_error(404)
    def send_error(self,code,message=None,explain=None):
        if code==404:
            blob=(DIST/'404.html').read_bytes();self.send_response(404);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(blob)));self.end_headers();self.wfile.write(blob)
        else:super().send_error(code,message,explain)
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Handler,directory=str(DIST)))
threading.Thread(target=server.serve_forever,daemon=True).start();BASE=f'http://127.0.0.1:{server.server_port}'


def static_tests():
    config=tomllib.loads((ROOT/'netlify.toml').read_text());assert config['build']['publish']=='dist'
    assert not any((DIST/p).exists() for p in ['reports','scripts','pt-br','.github','netlify.toml','QUE-SUBIR.md','VERSION.txt'])
    docs={};checked=0;baseline_robots=0;entries=0;bad=[];hashes=[]
    for p in sorted(DIST.rglob('*.html')):
        rel=p.relative_to(DIST).as_posix();s=BeautifulSoup(p.read_text(),'lxml');route=path_of(rel)
        robots=[e.get('content','') for e in s.select('meta[name="robots"]')]
        noindex=any('noindex' in x.lower() for x in robots)
        canonical=[x.get('href') for x in s.select('link[rel=canonical]')]
        if not noindex:assert canonical==[SITE+route],(rel,canonical)
        for el in s.select('link[hreflang]'):assert not el['hreflang'].lower().startswith('pt'),(rel,el)
        before=BASELINE/rel
        if before.is_file():
            old=BeautifulSoup(before.read_text(),'lxml')
            assert [x.get('content','') for x in old.select('meta[name="robots"]')]==robots,rel
            baseline_robots+=1
            if re.match(r'(es/neurodiversidad/condiciones|en/neurodiversity/conditions)/[^/]+/index.html$',rel):
                assert str(old.find('main'))==str(s.find('main')),'Se ha modificado el contenido de una ficha: '+rel
                checked+=1
            for selector in ['meta[name=description]','meta[property="article:modified_time"]']:
                assert [str(e) for e in old.select(selector)]==[str(e) for e in s.select(selector)],(rel,selector)
        for x in s.select('script[type="application/ld+json"]'):json.loads(x.get_text())
        docs[rel]={'soup':s,'route':route,'noindex':noindex,'canonical':canonical,'ids':{x['id'] for x in s.select('[id]')}}
    for rel,d in docs.items():
        for a in d['soup'].find_all(['a','link','script','img','iframe','source','audio','video']):
            value=a.get('href') if a.name in ['a','link'] else a.get('src')
            if not value or '{{' in value:continue
            u=urlsplit(urljoin(SITE+d['route'],value))
            if u.scheme not in ['http','https'] or u.netloc not in ['irisgreen.eu','www.irisgreen.eu']:continue
            entries+=1;r=redirected(u.path);dest=lookup(r[1] if r else u.path)
            if dest is None:bad.append({'page':rel,'url':value})
            elif u.fragment and a.name=='a':
                name=dest.relative_to(DIST).as_posix()
                if name not in docs:continue
                frag=unquote(u.fragment)
                if frag not in docs[name]['ids']:
                    if name=='es/recursos/juegos/index.html' and frag.startswith('carta-') and lookup('/es/recursos/juegos/'+frag[6:]+'/'):
                        assert 'openCardFromHash' in dest.read_text();hashes.append(frag)
                    else:bad.append({'page':rel,'url':value,'error':'ancla ausente'})
    assert not bad,bad[:10]
    xml=ET.parse(DIST/'sitemap.xml');urls=[e.text for e in xml.findall('.//s:loc',NS)]
    expected={SITE+d['route'] for d in docs.values() if not d['noindex']}
    assert len(urls)==len(set(urls)) and set(urls)==expected,(len(urls),len(expected))
    assert not xml.findall('.//s:lastmod',NS)
    assert (DIST/'sitemap.xml').read_bytes()==(DIST/'sitemap-1.xml').read_bytes()
    assert SITE+'/es/recursos/juegos/coleccion/sueno/' in urls
    for url in urls:assert not redirected(urlsplit(url).path),url
    for name,d in docs.items():
        for a in d['soup'].select('link[hreflang]'):
            dest=lookup(a['href']);assert dest is not None
            target=docs[dest.relative_to(DIST).as_posix()]
            assert not target['noindex'],(name,a['href'])
            if a['hreflang']!='x-default':
                assert any(x.get('href')==SITE+d['route'] for x in target['soup'].select('link[hreflang]')),(name,a['href'])
    for rel in ['es/neurodiversidad/condiciones/index.html','en/neurodiversity/conditions/index.html']:
        s=docs[rel]['soup'];assert not s.select('.crumb')
        assert not any('BreadcrumbList' in x.get_text() for x in s.select('script[type="application/ld+json"]'))
    sources=['buscador.json','videoteca-listado.json','es/recursos/juegos/juegos-120.json','es/intereses/cromos.json']
    for name in sources:assert hashlib.sha256((BASELINE/name).read_bytes()).digest()==hashlib.sha256((DIST/name).read_bytes()).digest(),name
    assert (BASELINE/'robots.txt').read_bytes()==(DIST/'robots.txt').read_bytes()
    REPORT['static']={'html_scanned':len(docs),'local_references_checked':entries,'missing_local_references':bad,'sitemap_urls':len(urls),'conditions_content_unchanged':checked,'robots_preserved_pages':baseline_robots,'game_fragment_routes_recognized':len(set(hashes)),'sitemap_duplicates':0,'sitemap_noindex_urls':0,'pt_alternates':0,'protected_sources':sources,'sitemap_compatibility_identical':True}
    return docs


def check_redirects():
    rows=[r for r in RULES if r['from'].startswith('/pt-br/') and '*' not in r['from'] and r['from']!='/pt-br/']
    assert len(rows)==375
    def check(r):
        red=redirected(r['from']);assert red==(301,r['to']),r
        assert redirected(r['to']) is None,r
        with urlopen(BASE+r['from'],timeout=15) as response:
            assert response.status==200 and urlsplit(response.url).path==r['to'],r
        return {'from':r['from'],'to':r['to'],'status':301,'final_status':200}
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:results=list(pool.map(check,rows))
    guards=[]
    for path,expected in [('/es/',200),('/pt-br/no-existe/',200),('/direccion-que-no-existe/',404),('/reports/routes/changes.json',404),('/scripts/repair_routes.py',404),('/netlify.toml',404),('/QUE-SUBIR.md',404),('/sitemap.xml',200),('/sitemap-1.xml',200),('/robots.txt',200)]:
        try:
            with urlopen(BASE+path,timeout=10) as r:status=r.status;body=r.read();mime=r.headers.get('Content-Type','')
        except HTTPError as e:status=e.code;body=e.read();mime=e.headers.get('Content-Type','')
        assert status==expected,(path,status)
        if path.startswith('/sitemap'):assert 'xml' in mime,mime;ET.fromstring(body)
        if expected==404:assert b'noindex,follow' in body and b'Volver al inicio' in body
        guards.append({'path':path,'status':status,'type':mime})
    REPORT['redirects']={'mappings_tested':len(results),'one_hop':True,'results':results,'guards':guards}


def browser_tests():
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        browser=pw.chromium.launch()
        for width in [1440,320]:
            for path in ['/', '/es/neurodiversidad/condiciones/','/en/neurodiversity/conditions/','/es/recursos/juegos/coleccion/sueno/','/es/sobre-iris-green/#criterios-editoriales','/es/intereses/imprimir/?tema=minerales','/direccion-que-no-existe/']:
                ctx=browser.new_context(viewport={'width':width,'height':900});page=ctx.new_page();page.set_default_timeout(10000)
                errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
                page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) else r.abort())
                row={'path':path,'width':width}
                try:
                    response=page.goto(BASE+path,wait_until='domcontentloaded');row['status']=response.status
                    if '/imprimir/' in path:page.locator('.hoja,.sheet,.cromo').first.wait_for()
                    else:page.locator('main h1').first.wait_for()
                    page.wait_for_timeout(250)
                    if '/#criterios' in path:
                        anchor=page.locator('#criterios-editoriales');assert anchor.count()==1
                        rect=anchor.bounding_box()
                        header=page.locator('header').first.bounding_box()
                        assert page.evaluate('scrollY')>0,'El ancla existe pero no navega al apartado'
                        assert rect['y']>=header['y']+header['height']-2 and rect['y']<260,rect
                        row['editorial_anchor_top_px']=rect['y']
                        row['editorial_anchor']=True
                    if path=='/direccion-que-no-existe/':
                        assert page.locator('body').evaluate('(e)=>e.getBoundingClientRect().height>=innerHeight-1')
                        assert page.locator('body').evaluate('(e)=>getComputedStyle(e).backgroundRepeat')=='no-repeat'
                    if path=='/':
                        msg=page.locator('#ig-books-message');assert msg.count()==1
                        assert msg.bounding_box()['y']<page.locator('#consola').bounding_box()['y']
                        page.get_by_role('button',name='¿Qué puedo pedir?',exact=True).click()
                        assert page.locator('#consola a[href="/es/tramites/directorio/"]').count()>=1
                        row['directory_link']=True
                    if '/imprimir/' not in path:
                        overflow=page.evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)');assert overflow<=2,overflow;row['overflow_px']=overflow
                    assert not errors,errors
                    page.screenshot(path=str(OUT/('browser-'+(path.split('?')[0].split('#')[0].strip('/').replace('/','-') or 'home')+'-'+str(width)+'.png')))
                    row['passed']=True
                except Exception as e:
                    row['passed']=False;row['error']=str(e);REPORT['failures'].append(row.copy())
                row['javascript_errors']=errors;REPORT['browser'].append(row);ctx.close()
        browser.close()

try:
    static_tests();check_redirects();browser_tests()
except Exception as e:
    REPORT['failures'].append({'phase':'static-or-routing','error':str(e)})
finally:
    server.shutdown();REPORT['passed']=not REPORT['failures']
    (OUT/'tests.json').write_text(json.dumps(REPORT,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'static':REPORT['static'],'redirects_tested':REPORT.get('redirects',{}).get('mappings_tested'),'browser_passed':sum(x.get('passed',False) for x in REPORT['browser']),'browser_tested':len(REPORT['browser']),'failures':REPORT['failures']},ensure_ascii=False))
if not REPORT['passed']:raise SystemExit(1)
