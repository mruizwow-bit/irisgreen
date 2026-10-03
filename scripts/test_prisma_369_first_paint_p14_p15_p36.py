#!/usr/bin/env python3
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from urllib.parse import urlsplit
import argparse,functools,json,re,threading
from playwright.sync_api import sync_playwright

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def need(v,msg):
    if not v: raise AssertionError(msg)

def head_contract(path):
    txt=path.read_text(encoding='utf-8')
    if 'data-ig-r49="1"' not in txt:
        return None
    head=txt.split('</head>',1)[0]
    needles=[
      '<meta charset="utf-8">',
      '<script src="/assets/ig-r49-lang-bootstrap.js"></script>',
      '<script src="/assets/ig-theme.js"></script>',
      '<link rel="stylesheet" href="/assets/ig-first-paint.css">',
    ]
    pos=[head.find(x) for x in needles]
    need(all(x>=0 for x in pos),('missing first-paint contract',path.as_posix(),pos))
    need(pos==sorted(pos),('wrong first-paint order',path.as_posix(),pos))
    first_other_css=min(
      [m.start() for m in re.finditer(r'<link\b[^>]*rel=["\']stylesheet["\'][^>]*>',head,re.I)
       if '/assets/ig-first-paint.css' not in m.group(0)] or [10**9]
    )
    need(pos[-1] < first_other_css,('first-paint CSS is not first stylesheet',path.as_posix()))
    need(head.count('/assets/ig-r49-lang-bootstrap.js')==1,('lang bootstrap duplicate',path.as_posix()))
    need(head.count('/assets/ig-theme.js')==1,('theme bootstrap duplicate',path.as_posix()))
    need(head.count('/assets/ig-first-paint.css')==1,('first-paint CSS duplicate',path.as_posix()))
    return True

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True)
    root=ap.parse_args().root.resolve()
    pages=[]
    for base in (root/'es',root/'en'):
        if base.is_dir(): pages.extend(p for p in base.rglob('*.html') if p.is_file())
    for p in (root/'index.html',root/'en'/'index.html'):
        if p.is_file(): pages.append(p)
    checked=sum(1 for p in sorted(set(pages)) if head_contract(p))

    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(root)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    routes=[
      ('games-es','/es/recursos/juegos/','es'),
      ('games-en','/en/resources/games/','en'),
      ('workshop-es','/es/taller/dibujo/','es'),
      ('workshop-en','/en/workshop/drawing/','en'),
    ]
    rows=[]
    try:
      with sync_playwright() as pw:
        browser=pw.chromium.launch()
        for theme in ('dark','light'):
          for name,route,lang in routes:
            ctx=browser.new_context(viewport={'width':390,'height':844})
            init_script=(
              "try{localStorage.setItem('ig-theme-2026',"+repr(theme)+")}catch(e){};"
              "window.__igCLS=0;"
              "try{new PerformanceObserver(list=>{for(const e of list.getEntries()){if(!e.hadRecentInput)window.__igCLS+=e.value}}).observe({type:'layout-shift',buffered:true})}catch(e){}"
            )
            ctx.add_init_script(init_script)
            page=ctx.new_page(); bad=[]; errors=[]
            page.on('response',lambda r: bad.append((r.status,urlsplit(r.url).path)) if r.status>=400 else None)
            page.on('pageerror',lambda e: errors.append(str(e)))
            resp=page.goto(base+route,wait_until='domcontentloaded')
            need(resp is not None and resp.status==200,(name,theme,'route'))
            state=page.evaluate("""()=>({
              theme:document.documentElement.dataset.igTheme||'',
              lang:document.documentElement.lang,
              bg:getComputedStyle(document.body).backgroundColor
            })""")
            need(state['theme']==theme,(name,theme,'theme bootstrap',state))
            need(state['lang'].lower().startswith(lang),(name,theme,'language first paint',state))
            if theme=='dark':
              need(state['bg']!='rgb(255, 255, 255)',(name,theme,'white first canvas',state))
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(120)
            cls=float(page.evaluate("window.__igCLS||0"))
            need(cls<=0.10,(name,theme,'layout shift',cls))
            need(not bad,(name,theme,'http',bad[:10]))
            need(not errors,(name,theme,'js',errors[:10]))
            rows.append({'surface':name,'theme':theme,'background':state['bg'],'cls':round(cls,4)})
            ctx.close()
        browser.close()
    finally:
      server.shutdown()

    report={'gate':'ISSUE_369_P14_P15_P36_FIRST_PAINT_PASS','static_pages':checked,'cases':len(rows),'rows':rows,'passed':True}
    out=Path('reports/prisma-369-first-paint');out.mkdir(parents=True,exist_ok=True)
    (out/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
