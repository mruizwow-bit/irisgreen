#!/usr/bin/env python3
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import functools,threading,json,re
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'reports'/'prisma-369-help-p16'; OUT.mkdir(parents=True,exist_ok=True)

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def parse_rgb(value):
    m=re.match(r'rgba?\((\d+)[, ]+(\d+)[, ]+(\d+)',value or '')
    return tuple(map(int,m.groups())) if m else None

def linear(v):
    v=v/255.0
    return v/12.92 if v<=0.04045 else ((v+0.055)/1.055)**2.4

def luminance(rgb):
    r,g,b=rgb
    return 0.2126*linear(r)+0.7152*linear(g)+0.0722*linear(b)

def contrast(fg,bg):
    a,b=luminance(fg),luminance(bg)
    return round((max(a,b)+0.05)/(min(a,b)+0.05),2)

def main():
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    cases=[]
    try:
      with sync_playwright() as pw:
        browser=pw.chromium.launch()
        for theme in ('light','dark'):
          page=browser.new_page(viewport={'width':900,'height':900})
          errors=[]
          page.on('pageerror',lambda e:errors.append(str(e)))
          page.goto(base+'/tools/prisma/help-modal-p16-fixture.html',wait_until='networkidle')
          page.evaluate("(t)=>document.documentElement.setAttribute('data-ig-theme',t)",theme)
          page.wait_for_timeout(50)
          data=page.evaluate("""() => {
            const d=document.querySelector('#ig42-help');
            const pick={
              dialog:d,
              heading:d.querySelector('.ig42-dialog-head h2'),
              lede:d.querySelector('.lede'),
              paragraph:d.querySelector('.ig42-dialog-body .igt-sec p:not(.igt-note)'),
              list:d.querySelector('.igt-src li'),
              link:d.querySelector('.igt-src a'),
              note:d.querySelector('.igt-note'),
              close:d.querySelector('.ig42-dialog-head button'),
              action:d.querySelector('.igt-btn')
            };
            function bg(el){
              for(let n=el;n;n=n.parentElement){
                const v=getComputedStyle(n).backgroundColor;
                if(v && v!=='transparent' && !v.endsWith(', 0)')) return v;
              }
              return getComputedStyle(document.body).backgroundColor;
            }
            const out={};
            for(const [k,e] of Object.entries(pick)){
              const s=getComputedStyle(e);
              out[k]={color:s.color,bg:bg(e),display:s.display};
            }
            out.helpSourceBg=getComputedStyle(d.querySelector('.ig42-help-source')).backgroundColor;
            return out;
          }""")
          ratios={}
          for name in ('heading','lede','paragraph','list','link','note','close','action'):
            fg=parse_rgb(data[name]['color']); bg=parse_rgb(data[name]['bg'])
            assert fg and bg,(theme,name,data[name])
            ratios[name]=contrast(fg,bg)
            assert ratios[name]>=4.5,(theme,name,ratios[name],data[name])
          assert data['helpSourceBg'] in ('rgba(0, 0, 0, 0)','transparent'),(theme,data['helpSourceBg'])
          assert not errors,(theme,errors)
          page.screenshot(path=str(OUT/f'help-{theme}.png'),full_page=True)
          cases.append({'theme':theme,'ratios':ratios,'styles':data})
          page.close()
        browser.close()
    finally:
      server.shutdown()
    report={'gate':'ISSUE_369_P16_HELP_MODAL_THEME_PASS','cases':cases,'passed':True,
            'note':'Presentation contrast evidence; Axioma retains accessibility/conformance authority.'}
    (OUT/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__': main()
