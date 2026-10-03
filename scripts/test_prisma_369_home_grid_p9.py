#!/usr/bin/env python3
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import functools, threading, json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports'/'prisma-369-home-grid-p9'
OUT.mkdir(parents=True,exist_ok=True)

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def edge(box):
    return {'left':round(box['x'],2),'right':round(box['x']+box['width'],2),'width':round(box['width'],2)}

def close(a,b,tol=2.0):
    return abs(a-b)<=tol

def main():
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    cases=[]
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch()
            for width,height in [(390,844),(1440,1000)]:
                ctx=browser.new_context(viewport={'width':width,'height':height})
                page=ctx.new_page()
                errors=[]; bad=[]
                page.on('pageerror',lambda e:errors.append(str(e)))
                page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
                page.on('response',lambda r:bad.append((r.status,r.url)) if r.status>=400 else None)
                page.goto(base+'/',wait_until='networkidle')
                wrap=page.locator('.ig-home-v4-wrap').bounding_box()
                hero=page.locator('.ig-home-v4-hero').bounding_box()
                sections=page.locator('.ig-home-v4-section')
                assert sections.count()==2,sections.count()
                use=sections.nth(0).bounding_box()
                discover=sections.nth(1).bounding_box()
                sabik=page.locator('.ig-home-v4-sabik').bounding_box()
                grid=page.locator('.ig-home-v4-discover-grid').bounding_box()
                footer=page.locator('.ig-home-v4-footer').bounding_box()
                h1=page.locator('.ig-home-v4-hero h1').bounding_box()
                search=page.locator('.ig-home-v4-search').bounding_box()
                use_h2=sections.nth(0).locator('h2').bounding_box()
                discover_h2=sections.nth(1).locator('h2').bounding_box()
                assert all([wrap,hero,use,discover,sabik,grid,footer,h1,search,use_h2,discover_h2])

                wrap_pad=page.locator('.ig-home-v4-wrap').evaluate("e=>{const s=getComputedStyle(e);return {left:parseFloat(s.paddingLeft)||0,right:parseFloat(s.paddingRight)||0}}")
                usable_left=wrap['x']+wrap_pad['left']
                usable_right=wrap['x']+wrap['width']-wrap_pad['right']
                outer=[('hero',hero),('use',use),('sabik',sabik),('discover',discover),('footer',footer)]
                for name,box in outer:
                    assert close(box['x'],usable_left),(width,name,'left',edge(box),{'left':usable_left,'right':usable_right})
                    assert close(box['x']+box['width'],usable_right),(width,name,'right',edge(box),{'left':usable_left,'right':usable_right})

                assert close(use_h2['x'],discover_h2['x']),(width,'section title starts differ',use_h2,discover_h2)
                assert close(h1['x'],search['x']),(width,'hero title/search starts differ',h1,search)

                # #369 P9: final information/resources block must use the same usable width.
                assert close(grid['x'],usable_left),(width,'discover grid left differs',edge(grid),{'left':usable_left,'right':usable_right})
                assert close(grid['x']+grid['width'],usable_right),(width,'discover grid right differs',edge(grid),{'left':usable_left,'right':usable_right})

                assert not errors,(width,errors)
                assert not bad,(width,bad)
                cases.append({
                    'width':width,
                    'wrap':edge(wrap),
                    'hero':edge(hero),
                    'use':edge(use),
                    'sabik':edge(sabik),
                    'discover_section':edge(discover),
                    'discover_grid':edge(grid),
                    'footer':edge(footer),
                    'section_titles_same_start':True,
                    'hero_title_search_same_start':True
                })
                if width==1440:
                    page.screenshot(path=str(OUT/'home-p9-1440.png'),full_page=True)
                ctx.close()
            browser.close()
    finally:
        server.shutdown()
    report={'gate':'ISSUE_369_P9_HOME_GLOBAL_GRID_VERIFY','cases':cases,'passed':True}
    (OUT/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':
    main()
