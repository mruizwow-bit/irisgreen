#!/usr/bin/env python3
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
import functools,threading,json,re
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports'/'prisma-369-help-p16';OUT.mkdir(parents=True,exist_ok=True)

CASES=[
 ('es','/es/taller/programacion/','Ayuda'),
 ('en','/en/workshop/coding/','Help')
]

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def srgb(v):
    v=v/255.0
    return v/12.92 if v<=0.04045 else ((v+0.055)/1.055)**2.4

def lum(rgb):
    r,g,b=rgb
    return 0.2126*srgb(r)+0.7152*srgb(g)+0.0722*srgb(b)

def ratio(a,b):
    l1,l2=lum(a),lum(b)
    hi,lo=max(l1,l2),min(l1,l2)
    return round((hi+0.05)/(lo+0.05),2)

def parse_rgb(s):
    m=re.search(r'rgba?\((\d+)[, ]+(\d+)[, ]+(\d+)',s or '')
    if not m: return None
    return tuple(map(int,m.groups()))

def main():
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    results=[]
    try:
      with sync_playwright() as pw:
        browser=pw.chromium.launch()
        for lang,route,help_label in CASES:
          for theme in ('light','dark'):
            ctx=browser.new_context(viewport={'width':390,'height':844})
            page=ctx.new_page(); errors=[]; bad=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
            page.on('response',lambda r:bad.append((r.status,r.url)) if r.status>=400 else None)
            page.goto(base+route,wait_until='domcontentloaded')
            page.wait_for_function("document.querySelector('main#main')?.classList.contains('ig42-active')",timeout=15000)
            page.evaluate("(t)=>document.documentElement.setAttribute('data-ig-theme',t)",theme)
            page.locator(f'button[aria-label="{help_label}"]').wait_for(timeout=10000)
            page.locator(f'button[aria-label="{help_label}"]').click()
            dlg=page.locator('#ig42-help')
            dlg.wait_for(state='visible',timeout=10000)
            styles=page.evaluate("""()=>{
              const d=document.querySelector('#ig42-help');
              const nodes=[
                ['dialog',d],
                ['heading',d.querySelector('.ig42-dialog-head h2')],
                ['body_text',d.querySelector('.ig42-dialog-body p')],
                ['body_link',d.querySelector('.ig42-dialog-body a')],
                ['close_button',d.querySelector('.ig42-dialog-head button')]
              ];
              function effectiveBg(el){
                let n=el;
                while(n){
                  const bg=getComputedStyle(n).backgroundColor;
                  if(bg && !/rgba\([^)]*,\s*0(?:\.0+)?\)$/.test(bg) && bg!=='transparent') return bg;
                  n=n.parentElement;
                }
                return getComputedStyle(document.body).backgroundColor;
              }
              const out={};
              for(const [k,el] of nodes){
                if(!el) continue;
                const s=getComputedStyle(el);
                out[k]={color:s.color,bg:effectiveBg(el),fontSize:s.fontSize,fontWeight:s.fontWeight,text:(el.textContent||'').trim().slice(0,180)};
              }
              return out;
            }""")
            measured={}
            failures=[]
            for name,v in styles.items():
                fg=parse_rgb(v.get('color')); bg=parse_rgb(v.get('bg'))
                cr=ratio(fg,bg) if fg and bg else None
                measured[name]={**v,'contrast_ratio':cr}
                if name!='dialog' and cr is not None:
                    fs=float(v.get('fontSize','16px').replace('px','') or 16)
                    fw=int(v.get('fontWeight','400')) if str(v.get('fontWeight','400')).isdigit() else 400
                    threshold=3.0 if (fs>=24 or (fs>=18.66 and fw>=700)) else 4.5
                    if cr<threshold: failures.append({'element':name,'ratio':cr,'threshold':threshold})
            assert not errors,(lang,theme,errors)
            assert not bad,(lang,theme,bad)
            assert dlg.get_attribute('open') is not None
            page.screenshot(path=str(OUT/f'help-{lang}-{theme}-390.png'),full_page=True)
            results.append({'lang':lang,'theme':theme,'route':route,'styles':measured,'contrast_failures':failures})
            ctx.close()
        browser.close()
    finally:
      server.shutdown()
    report={
      'gate':'ISSUE_369_P16_HELP_MODAL_CONTRAST_DIAGNOSTIC',
      'cases':results,
      'note':'Diagnostic only. Axioma remains authority for accessibility/conformance.',
      'contrast_failure_count':sum(len(x['contrast_failures']) for x in results),
      'diagnostic_complete':True
    }
    (OUT/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
