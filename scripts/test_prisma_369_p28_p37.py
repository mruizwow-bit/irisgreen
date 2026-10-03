#!/usr/bin/env python3
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from urllib.parse import urlsplit
import functools,threading,json,re
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports'/'prisma-369-p28-p37';OUT.mkdir(parents=True,exist_ok=True)

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def main():
    tramites=(PUBLIC/'es/tramites/index.html').read_text(encoding='utf-8')
    # P28 validates that the promo is not rendered. Translation literals may remain
    # in the component dictionary as dead compatibility data.
    assert '{{ tBooksBar }}' not in tramites
    assert '{{ tBooksCta }}' not in tramites

    checks=[
      ('es/biblioteca/index.html',[
        'Criterio editorial de esta colección','BORRADOR'
      ]),
      ('en/everyday-life/index.html',[
        'Editorial criterion for this collection','DRAFT'
      ])
    ]
    for rel,forbidden in checks:
      txt=(PUBLIC/rel).read_text(encoding='utf-8')
      for s in forbidden: assert s not in txt,(rel,s)

    es=(PUBLIC/'es/biblioteca/index.html').read_text(encoding='utf-8')
    en=(PUBLIC/'en/everyday-life/index.html').read_text(encoding='utf-8')
    card_rx=re.compile(r'class=["\'][^"\']*\\bvd-card\\b[^"\']*["\']',re.I)
    meta_rx=re.compile(r'class=["\'][^"\']*\\bmeta\\b[^"\']*["\']',re.I)
    es_cards=len(card_rx.findall(es)); en_cards=len(card_rx.findall(en))
    es_meta=len(meta_rx.findall(es)); en_meta=len(meta_rx.findall(en))
    assert es_cards==48,('ES cards',es_cards)
    assert en_cards==48,('EN cards',en_cards)
    assert es_meta==48,('ES meta',es_meta)
    assert en_meta==48,('EN meta',en_meta)

    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(PUBLIC)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
    rows=[]
    try:
      with sync_playwright() as pw:
        browser=pw.chromium.launch()
        for name,route in [
          ('how-request','/es/tramites/'),
          ('everyday-es','/es/biblioteca/'),
          ('everyday-en','/en/everyday-life/')
        ]:
          for width,height in [(1440,1000),(390,844)]:
            ctx=browser.new_context(viewport={'width':width,'height':height})
            page=ctx.new_page();bad=[];errors=[]
            page.on('response',lambda r:bad.append((r.status,urlsplit(r.url).path)) if r.status>=400 else None)
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
            resp=page.goto(base+route,wait_until='networkidle')
            assert resp is not None and resp.status==200,(name,width,'route')
            body=page.locator('body').inner_text()
            assert 'Todo aquí es gratis gracias a los libros de Iris Green' not in body,(name,width,'promo')
            assert 'Leer las primeras páginas' not in body,(name,width,'promo cta')
            assert 'Criterio editorial de esta colección' not in body,(name,width,'editorial ES')
            assert 'Editorial criterion for this collection' not in body,(name,width,'editorial EN')
            if name.startswith('everyday'):
              metas=page.locator('.vd-card .meta')
              assert metas.count()==48,(name,width,'meta count',metas.count())
              allmeta=' '.join(metas.all_inner_texts())
              assert 'BORRADOR' not in allmeta and 'DRAFT' not in allmeta,(name,width,'state leak')
            overflow=page.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth")
            assert overflow<=1,(name,width,'overflow',overflow)
            assert not bad,(name,width,'http',bad)
            assert not errors,(name,width,'js',errors)
            rows.append({'surface':name,'width':width,'overflow_px':overflow})
            ctx.close()
        browser.close()
    finally:
      server.shutdown()
    report={'gate':'ISSUE_369_P28_P37_PUBLIC_LEAKS_PASS','cases':len(rows),'cards_preserved_es':48,'cards_preserved_en':48,'public_state_labels':0,'passed':True,'rows':rows}
    (OUT/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
