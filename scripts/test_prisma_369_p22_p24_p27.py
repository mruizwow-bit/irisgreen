#!/usr/bin/env python3
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from urllib.parse import urlsplit
import functools,threading,json

from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports'/'prisma-369-p22-p24-p27';OUT.mkdir(parents=True,exist_ok=True)

STATIC=[
 ('es/neurodiversidad/condiciones/index.html','Condiciones','Fichas sobre condiciones, experiencias e identidades.',[
  'Cada una dice qué ayuda, qué no está demostrado y en qué documento se apoya.'
 ]),
 ('en/neurodiversity/conditions/index.html','Conditions','Entries on conditions, experiences and identities.',[
  'Each one says what helps, what is not supported by evidence and which document it relies on.',
  'All 185 entries are mounted'
 ]),
 ('es/situaciones/index.html','Situaciones','Situaciones cotidianas y formas de afrontarlas con información clara.',[
  'Fichas de situaciones del día a día. Cada una dice qué observar',
  'Esta página describe una situación del día a día, no un diagnóstico.'
 ]),
 ('en/situations/index.html','Situations','Everyday situations with clear, practical information.',[
  'Everyday situation entries. Each one says what to look at',
  'This page describes an everyday situation, not a diagnosis.'
 ]),
 ('es/tramites/directorio/index.html','Directorio de ayudas','Busca por país, territorio o tipo de ayuda.',[
  'Todo lo que puedes pedir, con su nombre oficial.',
  'Cada ficha dice cuánto es, quién puede pedirlo, qué papeles hacen falta',
  '{{ metaLine }}'
 ])
]

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def main():
    for rel,title,lede,forbidden in STATIC:
        text=(PUBLIC/rel).read_text(encoding='utf-8')
        assert f'>{title}<' in text,(rel,'title')
        assert lede in text,(rel,'lede')
        for x in forbidden: assert x not in text,(rel,'forbidden',x)

    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    rows=[]
    routes=[
      ('conditions-es','/es/neurodiversidad/condiciones/','h1','.secfind input[type="search"]'),
      ('conditions-en','/en/neurodiversity/conditions/','h1','.secfind input[type="search"]'),
      ('situations-es','/es/situaciones/','h1','#situationsSearch'),
      ('situations-en','/en/situations/','h1','#situationsSearch'),
      ('support','/es/tramites/directorio/','h1','.ig-search-input')
    ]
    try:
      with sync_playwright() as pw:
        browser=pw.chromium.launch()
        for width,height in [(1440,1000),(390,844)]:
          for name,route,hsel,searchsel in routes:
            ctx=browser.new_context(viewport={'width':width,'height':height})
            page=ctx.new_page();bad=[];errors=[]
            page.on('response',lambda r:bad.append((r.status,urlsplit(r.url).path)) if r.status>=400 else None)
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
            resp=page.goto(base+route,wait_until='networkidle')
            assert resp is not None and resp.status==200,(name,width,'route')
            h=page.locator(hsel).first
            search=page.locator(searchsel).first
            assert h.is_visible(),(name,width,'heading')
            assert search.is_visible(),(name,width,'search')
            assert search.bounding_box()['height']>=40,(name,width,'search touch size')
            overflow=page.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth")
            assert overflow<=1,(name,width,'overflow',overflow)
            assert not bad,(name,width,'http',bad)
            assert not errors,(name,width,'js',errors)
            rows.append({'surface':name,'width':width,'heading':h.inner_text().strip(),'overflow_px':overflow})
            ctx.close()
        browser.close()
    finally:
      server.shutdown()
    report={'gate':'ISSUE_369_P22_P24_P27_HEADERS_PASS','cases':len(rows),'rows':rows,'passed':True}
    (OUT/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
