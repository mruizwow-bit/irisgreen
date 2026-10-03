#!/usr/bin/env python3
from pathlib import Path
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import functools, threading, json
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports'/'prisma-369-home-grid-p8'
OUT.mkdir(parents=True,exist_ok=True)

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def main():
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    result={}
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch()
            ctx=browser.new_context(viewport={'width':1440,'height':1000})
            page=ctx.new_page()
            errors=[]; bad=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
            page.on('response',lambda r:bad.append((r.status,r.url)) if r.status>=400 else None)
            page.goto(base+'/',wait_until='networkidle')
            grid=page.locator('.ig-home-v4-discover-grid')
            grid.wait_for(timeout=10000)
            cards=grid.locator('.ig-home-v4-card')
            assert cards.count()==9,cards.count()
            style=grid.evaluate("e=>getComputedStyle(e)")
            cols=grid.evaluate("e=>getComputedStyle(e).gridTemplateColumns.split(' ').filter(Boolean).length")
            assert cols==3,cols
            boxes=[cards.nth(i).bounding_box() for i in range(cards.count())]
            assert all(boxes),boxes
            widths=[round(b['width'],2) for b in boxes]
            heights=[round(b['height'],2) for b in boxes]
            assert max(widths)-min(widths)<=1.5,widths
            assert max(heights)-min(heights)<=2.0,heights
            pads=[cards.nth(i).locator('span:not(.ig-home-v4-media)').first.evaluate("e=>getComputedStyle(e).padding") for i in range(cards.count())]
            assert len(set(pads))==1,pads
            borders=[cards.nth(i).evaluate("e=>getComputedStyle(e).borderTopWidth") for i in range(cards.count())]
            assert len(set(borders))==1 and borders[0]!='0px',borders
            books=grid.locator('.ig-home-v4-card').filter(has_text='Libros de Iris Green')
            assert books.count()==1,books.count()
            books_box=books.bounding_box(); assert books_box
            assert books_box['x'] < boxes[-1]['x'] + boxes[-1]['width'] + 2
            assert not errors,errors
            assert not bad,bad
            page.screenshot(path=str(OUT/'home-p8-1440.png'),full_page=True)
            result={
              'gate':'ISSUE_369_P8_HOME_9_CARDS_3X3_VERIFY',
              'cards':9,
              'columns':3,
              'equal_widths':True,
              'equal_heights':True,
              'same_padding':True,
              'same_border':True,
              'books_in_grid':True,
              'http_errors':0,
              'js_errors':0,
              'passed':True
            }
            ctx.close();browser.close()
    finally:
        server.shutdown()
    (OUT/'qa.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(result,ensure_ascii=False,indent=2))

if __name__=='__main__':
    main()
