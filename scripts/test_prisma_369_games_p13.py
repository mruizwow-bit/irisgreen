#!/usr/bin/env python3
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from urllib.parse import urlsplit
import functools,threading,json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports'/'prisma-369-games-p13';OUT.mkdir(parents=True,exist_ok=True)

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

CASES=[
 ('es','/es/recursos/juegos/','/es/recursos/contar-y-pagar/','Contar y pagar','Jugar'),
 ('en','/en/resources/games/','/en/resources/count-and-pay/','Count and pay','Play'),
]

def main():
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    results=[]
    try:
      with sync_playwright() as pw:
        browser=pw.chromium.launch()
        for lang,route,target,title,cta in CASES:
          for width,height in [(390,844),(1440,1000)]:
            ctx=browser.new_context(viewport={'width':width,'height':height})
            page=ctx.new_page();errors=[];bad=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
            page.on('response',lambda r:bad.append((r.status,urlsplit(r.url).path)) if r.status>=400 else None)
            page.goto(base+route,wait_until='networkidle')
            card=page.locator('.jg-count-pay-card')
            card.wait_for()
            assert card.count()==1,(lang,width,card.count())
            assert card.get_attribute('href')==target,(lang,width,card.get_attribute('href'))
            assert card.locator('.jg-card-t').inner_text().strip()==title
            assert card.locator('.jg-card-cta').inner_text().strip()==cta
            assert card.locator('.jg-card-img img').count()==3
            assert page.locator('.jg-hero .jg-cross a[href="'+target+'"]').count()==0
            styles=card.evaluate("""e=>{const s=getComputedStyle(e),img=getComputedStyle(e.querySelector('.jg-card-img')),cta=getComputedStyle(e.querySelector('.jg-card-cta'));return {display:s.display,border:s.borderTopWidth,radius:s.borderRadius,imgDisplay:img.display,ctaDisplay:cta.display,ctaMinHeight:parseFloat(cta.minHeight)||0}}""")
            assert styles['display']=='flex',(lang,width,styles)
            assert styles['border']!='0px',(lang,width,styles)
            assert styles['imgDisplay']=='grid',(lang,width,styles)
            assert styles['ctaDisplay'] in ('inline-flex','flex'),(lang,width,styles)
            assert styles['ctaMinHeight']>=40,(lang,width,styles)
            overflow=page.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth")
            assert overflow<=1,(lang,width,overflow)
            resp=page.request.get(base+target)
            assert resp.status==200,(lang,width,target,resp.status)
            assert not bad,(lang,width,bad)
            assert not errors,(lang,width,errors)
            if lang=='es' and width==1440: page.screenshot(path=str(OUT/'games-p13-es-1440.png'),full_page=True)
            if lang=='es' and width==390: page.screenshot(path=str(OUT/'games-p13-es-390.png'),full_page=True)
            results.append({'lang':lang,'width':width,'card':1,'images':3,'hero_cross_link':0,'route_status':200,'overflow_px':overflow})
            ctx.close()
        browser.close()
    finally:
      server.shutdown()
    report={'gate':'ISSUE_369_P13_COUNT_AND_PAY_CARD_PASS','cases':results,'passed':True}
    (OUT/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
