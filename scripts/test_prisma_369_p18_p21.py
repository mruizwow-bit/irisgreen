#!/usr/bin/env python3
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from urllib.parse import urlsplit
import functools,threading,json,re
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports'/'prisma-369-p18-p21';OUT.mkdir(parents=True,exist_ok=True)
CRUMB=re.compile(r'<p\b[^>]*class=["\'][^"\']*\bcrumb\b',re.I)

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def main():
    htmls=list((PUBLIC/'es').rglob('*.html'))+list((PUBLIC/'en').rglob('*.html'))
    for p in (PUBLIC/'index.html',PUBLIC/'en'/'index.html'):
        if p.is_file(): htmls.append(p)
    crumb_files=[p.relative_to(PUBLIC).as_posix() for p in htmls if CRUMB.search(p.read_text(encoding='utf-8'))]
    assert not crumb_files,('breadcrumbs remain',crumb_files[:20])

    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    rows=[]
    try:
      with sync_playwright() as pw:
        browser=pw.chromium.launch()
        for lang,route in [('es','/es/taller/'),('en','/en/workshop/')]:
          for width,height in [(1440,1000),(390,844)]:
            ctx=browser.new_context(viewport={'width':width,'height':height})
            page=ctx.new_page();bad=[];errors=[]
            page.on('response',lambda r:bad.append((r.status,urlsplit(r.url).path)) if r.status>=400 else None)
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
            resp=page.goto(base+route,wait_until='networkidle')
            assert resp is not None and resp.status==200,(lang,width,'route')
            details=page.locator('.igk-collection')
            assert details.count()==1,(lang,width,'projects details',details.count())
            assert not details.get_attribute('open'),(lang,width,'projects should start collapsed')
            assert page.locator('.igk-note').count()==0,(lang,width,'repetitive workshop note')
            main=page.locator('main#main').bounding_box(); box=details.bounding_box()
            assert main and box
            if width==1440:
              assert box['width']<=770,(lang,width,'projects too wide',box)
              assert box['width']<main['width']*.65,(lang,width,'projects still dominates grid',box,main)
            else:
              assert box['width']<=main['width']+1,(lang,width,'projects mobile width',box,main)
            assert box['height']<=60,(lang,width,'collapsed projects too tall',box)
            details.locator('summary').click()
            opened=details.bounding_box()
            assert opened and opened['height']<=320,(lang,width,'open projects too tall',opened)
            h2=details.locator('.igt-sec h2')
            p=details.locator('.igt-sec p')
            assert h2.count()==1 and p.count()==1,(lang,width,'projects content')
            overflow=page.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth")
            assert overflow<=1,(lang,width,'overflow',overflow)
            assert not bad,(lang,width,'http',bad)
            assert not errors,(lang,width,'js',errors)
            if width==1440: page.screenshot(path=str(OUT/f'workshop-{lang}-1440.png'),full_page=False)
            rows.append({'lang':lang,'width':width,'collapsed_width':round(box['width'],2),'collapsed_height':round(box['height'],2),'open_height':round(opened['height'],2),'overflow_px':overflow})
            ctx.close()

        samples=[
          '/es/neurodiversidad/condiciones/autismo/',
          '/es/situaciones/cambiar-de-una-tarea-a-otra-me-bloquea/',
          '/es/biblioteca/dinero-contratos-formularios-y-tramites/',
          '/en/neurodiversity/conditions/autism/',
          '/en/situations/switching-from-one-task-to-another-blocks-me/',
          '/en/everyday-life/money-contracts-forms-and-paperwork/'
        ]
        for route in samples:
          page=browser.new_page(viewport={'width':1440,'height':900})
          page.goto(base+route,wait_until='networkidle')
          assert page.locator('.crumb').count()==0,(route,'crumb remains')
          page.close()
        browser.close()
    finally:
      server.shutdown()

    report={
      'gate':'ISSUE_369_P18_P19_P20_P21_WORKSHOP_NAV_PASS',
      'html_pages_checked':len(set(htmls)),
      'breadcrumbs_remaining':0,
      'workshop_repeat_note_remaining':0,
      'cases':rows,
      'passed':True
    }
    (OUT/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
