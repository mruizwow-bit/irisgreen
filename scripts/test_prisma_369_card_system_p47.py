#!/usr/bin/env python3
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from urllib.parse import urlsplit
import functools,threading,json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports'/'prisma-369-card-system-p47';OUT.mkdir(parents=True,exist_ok=True)

SURFACES=[
 ('home','/',['.ig-home-v4-discover-grid .ig-home-v4-card']),
 ('resources','/es/recursos/',['.ig-activity-card','.ri-card']),
 ('games','/es/recursos/juegos/',['.ig-activity-card','.jg-context-card','.jg-card']),
 ('workshop','/es/taller/',['.ig42-area-card','.igk-tile','.ig-activity-card']),
 ('research','/es/investigacion/',['main article','[class*="-card"]']),
 ('living_abroad','/es/vivir-fuera/',['main article','[class*="-card"]']),
 ('data','/es/datos/',['main article','[class*="-card"]']),
 ('support','/es/tramites/directorio/',['main article','[class*="-card"]']),
]
VIEWS=[(1440,1000),(390,844)]

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def main():
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    rows=[]
    try:
      with sync_playwright() as pw:
        browser=pw.chromium.launch()
        for width,height in VIEWS:
          for name,route,candidates in SURFACES:
            ctx=browser.new_context(viewport={'width':width,'height':height})
            page=ctx.new_page(); errors=[]; bad=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
            page.on('response',lambda r:bad.append((r.status,urlsplit(r.url).path)) if r.status>=400 else None)
            resp=page.goto(base+route,wait_until='networkidle')
            assert resp is not None and resp.status==200,(name,width,'route',resp.status if resp else None)
            chosen=None
            for sel in candidates:
              loc=page.locator(sel)
              n=loc.count()
              for i in range(min(n,12)):
                el=loc.nth(i)
                try:
                  if el.is_visible():
                    chosen=sel;break
                except: pass
              if chosen: break
            assert chosen is not None,(name,width,'no card',candidates)
            loc=page.locator(chosen).filter(visible=True).first if False else page.locator(chosen).first
            if not loc.is_visible():
              for i in range(page.locator(chosen).count()):
                if page.locator(chosen).nth(i).is_visible():
                  loc=page.locator(chosen).nth(i);break
            data=loc.evaluate("""e=>{
              const s=getComputedStyle(e),r=e.getBoundingClientRect();
              const title=e.querySelector('h2,h3,.jg-card-t,.ig-home-v4-card-title,strong');
              const desc=e.querySelector('p,.jg-card-d,.ig-home-v4-card-text,[class*="desc"]');
              const cta=e.querySelector('.jg-card-cta,.ig-home-v4-card-go,.ig-activity-card span:last-child,[class*="cta"],a[class*="button"],button');
              const art=e.querySelectorAll('img,svg,canvas,.ig-home-v4-media,.jg-card-img,.ri-card-art,[class*="media"]').length;
              const box=x=>{if(!x)return null;const q=getComputedStyle(x),b=x.getBoundingClientRect();return {fontFamily:q.fontFamily,fontSize:q.fontSize,lineHeight:q.lineHeight,fontWeight:q.fontWeight,x:b.x,y:b.y,w:b.width,h:b.height,color:q.color};};
              return {
                tag:e.tagName,className:e.className||'',
                width:r.width,height:r.height,
                display:s.display,
                padding:[s.paddingTop,s.paddingRight,s.paddingBottom,s.paddingLeft],
                radius:s.borderRadius,
                border:s.borderTopWidth,
                background:s.backgroundColor,
                title:box(title),desc:box(desc),cta:box(cta),
                artCount:art,
                ctaBottom:cta?Math.round((r.bottom-cta.getBoundingClientRect().bottom)*100)/100:null
              };
            }""")
            overflow=page.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth")
            rows.append({'surface':name,'route':route,'width':width,'selector':chosen,'card':data,'overflow_px':overflow,'http_errors':bad,'js_errors':errors})
            assert overflow<=1,(name,width,'overflow',overflow)
            assert not bad,(name,width,'http',bad)
            assert not errors,(name,width,'js',errors)
            if width==1440 and name in ('home','resources','games','workshop'):
              page.screenshot(path=str(OUT/f'{name}-1440.png'),full_page=False)
            ctx.close()
        browser.close()
    finally:
      server.shutdown()
    def cluster(values):
      out={}
      for v in values: out[v]=out.get(v,0)+1
      return [{'value':k,'count':v} for k,v in sorted(out.items(),key=lambda x:(-x[1],str(x[0])))]
    desktop=[r for r in rows if r['width']==1440]
    report={
      'gate':'ISSUE_369_P47_CARD_SYSTEM_AUDIT',
      'surfaces':len(SURFACES),
      'cases':len(rows),
      'desktop_radius_clusters':cluster([r['card']['radius'] for r in desktop]),
      'desktop_padding_clusters':cluster(['|'.join(r['card']['padding']) for r in desktop]),
      'desktop_art_presence':{r['surface']:r['card']['artCount'] for r in desktop},
      'desktop_cta_bottom':{r['surface']:r['card']['ctaBottom'] for r in desktop},
      'rows':rows,
      'diagnostic_complete':True
    }
    (OUT/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
