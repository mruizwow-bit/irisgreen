#!/usr/bin/env python3
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import functools,threading,json,re
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports'/'prisma-369-p29-p35';OUT.mkdir(parents=True,exist_ok=True)

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def rgb(s):
    m=re.match(r'rgba?\((\d+)[, ]+(\d+)[, ]+(\d+)',s or '')
    return tuple(map(int,m.groups())) if m else None
def lin(v):
    v=v/255.0
    return v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4
def lum(c):
    return .2126*lin(c[0])+.7152*lin(c[1])+.0722*lin(c[2])
def cr(a,b):
    x,y=lum(a),lum(b)
    return round((max(x,y)+.05)/(min(x,y)+.05),2)

def effective(page,selector):
    return page.locator(selector).evaluate("""e=>{
      function bg(n){
        for(;n;n=n.parentElement){
          const v=getComputedStyle(n).backgroundColor;
          if(v && v!=='transparent' && !/^rgba\([^)]*,\s*0(?:\.0+)?\)$/.test(v))return v;
        }
        return getComputedStyle(document.body).backgroundColor;
      }
      const s=getComputedStyle(e);
      return {color:s.color,bg:bg(e),text:(e.textContent||'').trim()};
    }""")

def main():
    living=(PUBLIC/'es/vivir-fuera/index.html').read_text(encoding='utf-8')
    assert 'Eso es lo que hay aquí' not in living
    assert 'That is what this page sets out' not in living
    assert 'Consulta quién gestiona los apoyos en cada país y por dónde se empieza.' in living
    assert 'See who manages support in each country and where to start.' in living

    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    rows=[]
    try:
      with sync_playwright() as pw:
        browser=pw.chromium.launch()
        for theme in ('light','dark'):
          # P29: Living Abroad introduction.
          page=browser.new_page(viewport={'width':1440,'height':1000})
          page.goto(base+'/es/vivir-fuera/',wait_until='networkidle')
          page.evaluate("(t)=>document.documentElement.setAttribute('data-ig-theme',t)",theme)
          intro=page.get_by_text('Consulta quién gestiona los apoyos en cada país y por dónde se empieza.',exact=True).first
          intro.wait_for(state='visible',timeout=10000)
          d=intro.evaluate("""e=>{
            function bg(n){for(;n;n=n.parentElement){const v=getComputedStyle(n).backgroundColor;if(v&&v!=='transparent'&&!/^rgba\([^)]*,\s*0(?:\.0+)?\)$/.test(v))return v;}return getComputedStyle(document.body).backgroundColor}
            const s=getComputedStyle(e);return {color:s.color,bg:bg(e)}
          }""")
          ratio=cr(rgb(d['color']),rgb(d['bg']))
          assert ratio>=4.5,(theme,'living intro',ratio,d)
          rows.append({'surface':'living_abroad_intro','theme':theme,'ratio':ratio})
          page.close()

          # P35: exact certainty explanation section.
          page=browser.new_page(viewport={'width':1440,'height':1000})
          page.goto(base+'/es/investigacion/',wait_until='networkidle')
          page.evaluate("(t)=>document.documentElement.setAttribute('data-ig-theme',t)",theme)
          h=page.get_by_role('heading',name='Cómo leemos el nivel de certeza').first
          h.wait_for(state='visible',timeout=10000)
          sec=h.locator('xpath=ancestor::section[1]')
          assert sec.count()==1
          for label,loc in [('heading',h),('body',sec.locator('p').nth(0)),('note',sec.locator('p').nth(1))]:
            d=loc.evaluate("""e=>{
              function bg(n){for(;n;n=n.parentElement){const v=getComputedStyle(n).backgroundColor;if(v&&v!=='transparent'&&!/^rgba\([^)]*,\s*0(?:\.0+)?\)$/.test(v))return v;}return getComputedStyle(document.body).backgroundColor}
              const s=getComputedStyle(e);return {color:s.color,bg:bg(e)}
            }""")
            ratio=cr(rgb(d['color']),rgb(d['bg']))
            assert ratio>=4.5,(theme,label,ratio,d)
            rows.append({'surface':'research_certainty_'+label,'theme':theme,'ratio':ratio})
          page.close()
        browser.close()
    finally:
      server.shutdown()
    report={'gate':'ISSUE_369_P29_P35_FOCUSED_PASS','cases':len(rows),'rows':rows,'passed':True,
            'note':'Prisma presentation evidence; Axioma retains accessibility/conformance authority.'}
    (OUT/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
