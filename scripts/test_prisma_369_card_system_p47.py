#!/usr/bin/env python3
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from urllib.parse import urlsplit
import functools,threading,json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports'/'prisma-369-card-system-p47';OUT.mkdir(parents=True,exist_ok=True)

# variant:
# - media: illustration + content body + bottom CTA
# - catalog: text catalogue/navigation card
# - result: larger editorial/result typography, shared shell metrics
# - disclosure: result card with a top disclosure control, not a bottom CTA
SURFACES=[
 ('home','/',['.ig-home-v4-discover-grid .ig-home-v4-card'],'media'),
 ('resources','/es/recursos/',['.ig-activity-card'],'catalog'),
 ('games','/es/recursos/juegos/',['.ig-activity-card'],'catalog'),
 ('workshop','/es/taller/',['.igk-tile'],'media'),
 ('research','/es/investigacion/',['main article'],'result'),
 ('living_abroad','/es/vivir-fuera/',['main article'],'result'),
 ('conditions','/es/neurodiversidad/condiciones/',['.cards .card'],'catalog'),
 ('situations','/es/situaciones/',['.cards .card'],'catalog'),
 ('support','/es/tramites/directorio/',['main article'],'disclosure'),
]
VIEWS=[(1440,1000),(390,844)]

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def px(v):
    try:return float(str(v).replace('px',''))
    except:return None

def near(v,target,tol=1.1):
    return v is not None and abs(v-target)<=tol

def main():
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    rows=[]
    try:
      with sync_playwright() as pw:
        browser=pw.chromium.launch()
        for width,height in VIEWS:
          for name,route,candidates,variant in SURFACES:
            ctx=browser.new_context(viewport={'width':width,'height':height})
            page=ctx.new_page(); errors=[]; bad=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
            page.on('response',lambda r:bad.append((r.status,urlsplit(r.url).path)) if r.status>=400 else None)
            resp=page.goto(base+route,wait_until='networkidle')
            assert resp is not None and resp.status==200,(name,width,'route',resp.status if resp else None)

            chosen=None
            for sel in candidates:
              locs=page.locator(sel)
              if any(locs.nth(i).is_visible() for i in range(min(locs.count(),12))):
                chosen=sel;break
            assert chosen is not None,(name,width,'no card',candidates)
            locs=page.locator(chosen)
            loc=None
            visible_boxes=[]
            for i in range(min(locs.count(),8)):
              el=locs.nth(i)
              if not el.is_visible():continue
              if loc is None:loc=el
              b=el.bounding_box()
              if b:visible_boxes.append({'x':round(b['x'],2),'y':round(b['y'],2),'w':round(b['width'],2),'h':round(b['height'],2)})
            assert loc is not None

            data=loc.evaluate("""([surface,variant])=>{
              const e=eventTargetFallback=arguments[0];
            }""") if False else loc.evaluate("""e=>{
              const s=getComputedStyle(e),r=e.getBoundingClientRect();
              const cls=e.classList;
              let body=e,title=null,desc=null,cta=null,control=null;
              if(cls.contains('ig-home-v4-card')){
                body=e.querySelector(':scope>span:not(.ig-home-v4-media)');
                title=e.querySelector('strong');desc=e.querySelector('.ig-home-v4-card-copy');cta=e.querySelector('.ig-home-v4-card-cta');
              }else if(cls.contains('igk-tile')){
                body=e.querySelector('.igk-text');title=e.querySelector('.igk-name');desc=e.querySelector('.igk-desc');cta=e.querySelector('.igk-cta');
              }else if(cls.contains('ig-activity-card')){
                title=e.querySelector('h2');desc=e.querySelector('p');cta=e.querySelector(':scope>span:last-child');
              }else if(cls.contains('card')){
                title=e.querySelector('strong');desc=e.querySelector(':scope>span:last-child');
              }else{
                title=e.querySelector('h2,h3,strong');desc=e.querySelector('p');control=e.querySelector('button');
              }
              body=body||e;
              const bs=getComputedStyle(body);
              const art=e.querySelectorAll('img,svg,canvas,.ig-home-v4-media,.igk-art,.jg-card-img,.ri-card-art,[class*="media"]').length;
              const box=x=>{if(!x)return null;const q=getComputedStyle(x),b=x.getBoundingClientRect();return {fontFamily:q.fontFamily,fontSize:q.fontSize,lineHeight:q.lineHeight,fontWeight:q.fontWeight,x:b.x,y:b.y,w:b.width,h:b.height,color:q.color};};
              const cb=cta?cta.getBoundingClientRect():null,xb=control?control.getBoundingClientRect():null;
              return {
                tag:e.tagName,className:e.className||'',
                width:r.width,height:r.height,display:s.display,
                radius:s.borderRadius,border:s.borderTopWidth,
                padding:[bs.paddingTop,bs.paddingRight,bs.paddingBottom,bs.paddingLeft],
                title:box(title),desc:box(desc),cta:box(cta),control:box(control),
                artCount:art,
                ctaBottom:cb?Math.round((r.bottom-cb.bottom)*100)/100:null,
                controlTop:xb?Math.round((xb.top-r.top)*100)/100:null
              };
            }""")

            # Canonical shell.
            assert near(px(data['radius']),20),(name,width,'radius',data['radius'])
            assert data['border']!='0px',(name,width,'border')
            pads=list(map(px,data['padding']))
            assert near(pads[0],20),(name,width,'pad top',data['padding'])
            assert near(pads[1],22),(name,width,'pad right',data['padding'])
            assert near(pads[3],22),(name,width,'pad left',data['padding'])
            if variant!='media' or name=='home':
              assert near(pads[2],20),(name,width,'pad bottom',data['padding'])

            # Canonical typography for catalogue/media cards. Result variants keep
            # their larger editorial title scale but still use Newsreader + Atkinson.
            if data['title']:
              assert 'Newsreader' in data['title']['fontFamily'],(name,width,'title font',data['title'])
              if variant in ('media','catalog'):
                assert 20<=px(data['title']['fontSize'])<=24,(name,width,'title size',data['title'])
            if data['desc']:
              assert ('Atkinson' in data['desc']['fontFamily'] or 'IG Zero' in data['desc']['fontFamily']),(name,width,'desc font',data['desc'])
              if variant in ('media','catalog'):
                assert 15<=px(data['desc']['fontSize'])<=17,(name,width,'desc size',data['desc'])

            # Media is required only for the visual variant; it is never fabricated
            # for text/result cards.
            if variant=='media':
              assert data['artCount']>=1,(name,width,'media missing')

            # True CTA variants finish on the same bottom rhythm. Home cards may
            # intentionally omit CTA; the whole card remains the link.
            if name in ('resources','games','workshop'):
              assert data['cta'] is not None,(name,width,'cta missing')
              assert 18<=data['ctaBottom']<=22,(name,width,'cta bottom',data['ctaBottom'])
            elif name=='home' and data['cta'] is not None:
              assert 18<=data['ctaBottom']<=22,(name,width,'cta bottom',data['ctaBottom'])

            # Support uses a disclosure control at the top; do not misclassify it as
            # the card CTA. Its placement is intentionally distinct but consistent.
            if variant=='disclosure':
              assert data['control'] is not None,(name,width,'disclosure control missing')
              assert data['controlTop']<=24,(name,width,'disclosure control drift',data['controlTop'])

            overflow=page.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth")
            assert overflow<=1,(name,width,'overflow',overflow)
            assert not bad,(name,width,'http',bad)
            assert not errors,(name,width,'js',errors)

            rows.append({'surface':name,'route':route,'variant':variant,'width':width,
                         'selector':chosen,'card':data,'visible_boxes':visible_boxes,'overflow_px':overflow})
            if width==1440 and name in ('home','resources','games','workshop','conditions','support'):
              page.screenshot(path=str(OUT/f'{name}-1440.png'),full_page=False)
            ctx.close()
        browser.close()
    finally:
      server.shutdown()

    desktop=[r for r in rows if r['width']==1440]
    report={
      'gate':'ISSUE_369_P47_CARD_SYSTEM_PASS',
      'surfaces':len(SURFACES),
      'cases':len(rows),
      'variants':sorted(set(r['variant'] for r in rows)),
      'radius':20,
      'body_padding':'20px 22px',
      'desktop_art_presence':{r['surface']:r['card']['artCount'] for r in desktop},
      'desktop_cta_bottom':{r['surface']:r['card']['ctaBottom'] for r in desktop},
      'rows':rows,
      'passed':True
    }
    (OUT/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
