#!/usr/bin/env python3
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from urllib.parse import urlsplit
import functools,threading,json,re
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports'/'prisma-369-theme-p48';OUT.mkdir(parents=True,exist_ok=True)

ROUTES=[
 ('home','/'),
 ('resources','/es/recursos/'),
 ('games','/es/recursos/juegos/'),
 ('research','/es/investigacion/'),
 ('support','/es/tramites/directorio/'),
 ('living_abroad','/es/vivir-fuera/'),
 ('workshop','/es/taller/')
]

SELECTORS=[
 '.lede','.muted','.note','[class*="note"]','[class*="muted"]','[class*="meta"]','[class*="desc"]',
 'label','small','main article p','.ig-home-v4-card p','.ig-activity-card p','.ri-card p',
 '.jg-card-d','.jg-card-type','.jg-small','.igk-p-desc','.igk-p-n','.ig42-area-card p',
 'input[type="search"]','input:not([type])','select','textarea'
]

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def parse_rgb(value):
    m=re.match(r'rgba?\((\d+)[, ]+(\d+)[, ]+(\d+)',value or '')
    return tuple(map(int,m.groups())) if m else None

def lin(v):
    v=v/255.0
    return v/12.92 if v<=0.04045 else ((v+0.055)/1.055)**2.4

def lum(rgb):
    r,g,b=rgb
    return 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b)

def ratio(fg,bg):
    a,b=lum(fg),lum(bg)
    return round((max(a,b)+0.05)/(min(a,b)+0.05),2)

def main():
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    rows=[]
    try:
      with sync_playwright() as pw:
        browser=pw.chromium.launch()
        for name,route in ROUTES:
          for theme in ('light','dark'):
            ctx=browser.new_context(viewport={'width':1440,'height':1000})
            page=ctx.new_page(); bad=[]; errors=[]
            page.on('response',lambda r:bad.append((r.status,urlsplit(r.url).path)) if r.status>=400 else None)
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
            resp=page.goto(base+route,wait_until='networkidle')
            assert resp is not None and resp.status==200,(name,theme,'route')
            page.evaluate("(t)=>document.documentElement.setAttribute('data-ig-theme',t)",theme)
            page.wait_for_timeout(80)
            data=page.evaluate("""sels=>{
              function shown(e){const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)!==0}
              function bg(el){
                for(let n=el;n;n=n.parentElement){
                  const s=getComputedStyle(n),v=s.backgroundColor;
                  if(v && v!=='transparent' && !/rgba\([^)]*,\s*0(?:\.0+)?\)$/.test(v)) return v;
                }
                return getComputedStyle(document.body).backgroundColor;
              }
              const nodes=[],seen=new Set();
              for(const sel of sels){
                for(const e of document.querySelectorAll(sel)){
                  if(!shown(e)||seen.has(e))continue;seen.add(e);
                  const s=getComputedStyle(e),r=e.getBoundingClientRect(),txt=(e.textContent||'').trim();
                  nodes.push({sel,tag:e.tagName,cls:e.className||'',text:txt.slice(0,140),
                    color:s.color,bg:bg(e),fontSize:s.fontSize,fontWeight:s.fontWeight,
                    x:r.x,y:r.y,w:r.width,h:r.height});
                  if(nodes.length>=180)break;
                }
                if(nodes.length>=180)break;
              }
              const placeholders=[];
              for(const e of document.querySelectorAll('input[placeholder],textarea[placeholder]')){
                if(!shown(e))continue;
                const p=getComputedStyle(e,'::placeholder'),s=getComputedStyle(e);
                placeholders.push({tag:e.tagName,cls:e.className||'',text:e.getAttribute('placeholder')||'',
                  color:p.color,bg:bg(e),fontSize:p.fontSize||s.fontSize,fontWeight:p.fontWeight||s.fontWeight});
              }
              return {nodes,placeholders};
            }""",SELECTORS)
            failures=[]
            samples=[]
            for kind,arr in [('text',data['nodes']),('placeholder',data['placeholders'])]:
              for x in arr:
                fg=parse_rgb(x['color']); bg=parse_rgb(x['bg'])
                if not fg or not bg: continue
                cr=ratio(fg,bg)
                fs=float(str(x.get('fontSize','16px')).replace('px','') or 16)
                fw=int(x.get('fontWeight','400')) if str(x.get('fontWeight','400')).isdigit() else 400
                threshold=3.0 if (fs>=24 or (fs>=18.66 and fw>=700)) else 4.5
                row={'kind':kind,'selector':x.get('sel','::placeholder'),'tag':x['tag'],'class':x.get('cls',''),
                     'text':x.get('text',''),'color':x['color'],'bg':x['bg'],'ratio':cr,'threshold':threshold}
                samples.append(row)
                if cr<threshold: failures.append(row)
            rows.append({'surface':name,'route':route,'theme':theme,'sample_count':len(samples),
                         'failure_count':len(failures),'failures':failures[:30],'http_errors':bad,'js_errors':errors})
            assert not bad,(name,theme,'http',bad)
            assert not errors,(name,theme,'js',errors)
            if name in ('home','research','living_abroad') and theme=='dark':
              page.screenshot(path=str(OUT/f'{name}-dark.png'),full_page=False)
            ctx.close()
        browser.close()
    finally:
      server.shutdown()
    total_failures=sum(r['failure_count'] for r in rows)
    report={
      'gate':'ISSUE_369_P48_DARK_LIGHT_CONTRAST_PASS',
      'surfaces':len(ROUTES),
      'cases':len(rows),
      'total_samples':sum(r['sample_count'] for r in rows),
      'total_failures':total_failures,
      'failures_by_surface_theme':{f"{r['surface']}:{r['theme']}":r['failure_count'] for r in rows},
      'rows':rows,
      'note':'Presentation audit only. Axioma retains accessibility/conformance authority.',
      'passed':total_failures==0
    }
    (OUT/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))
    failures=[{'surface':r['surface'],'theme':r['theme'],'failures':r['failures']} for r in rows if r['failure_count']]
    assert total_failures==0,('contrast failures remain',total_failures,failures)

if __name__=='__main__':main()
