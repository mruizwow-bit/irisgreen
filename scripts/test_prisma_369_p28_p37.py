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
    source_es=(ROOT/'es/biblioteca/index.html').read_text(encoding='utf-8')
    source_en=(ROOT/'en/everyday-life/index.html').read_text(encoding='utf-8')
    card_rx=re.compile(r'class=["\'][^"\']*\bvd-card\b[^"\']*["\']',re.I)
    meta_rx=re.compile(r'class=["\'][^"\']*\bmeta\b[^"\']*["\']',re.I)

    # Editorial corpus stays complete at 48/48. The public safe-default browse
    # deliberately withholds the two S2_HIGH_SENSITIVITY entries in each locale.
    source_es_cards=len(card_rx.findall(source_es)); source_en_cards=len(card_rx.findall(source_en))
    es_cards=len(card_rx.findall(es)); en_cards=len(card_rx.findall(en))
    es_meta=len(meta_rx.findall(es)); en_meta=len(meta_rx.findall(en))
    assert source_es_cards==48,('ES source cards',source_es_cards)
    assert source_en_cards==48,('EN source cards',source_en_cards)
    assert es_cards==46,('ES safe-default cards',es_cards)
    assert en_cards==46,('EN safe-default cards',en_cards)
    assert es_meta==46,('ES safe-default meta',es_meta)
    assert en_meta==46,('EN safe-default meta',en_meta)

    s2_es=[
      '/es/biblioteca/arfid-tca-y-pica-cuando-el-apoyo-cotidiano-necesita-atencion-clinica/',
      '/es/biblioteca/abuso-explotacion-y-relaciones-seguras/',
    ]
    s2_en=[
      '/en/everyday-life/arfid-eating-disorders-and-pica-when-everyday-support-needs-clinical-care/',
      '/en/everyday-life/abuse-exploitation-and-safe-relationships/',
    ]
    for href in s2_es:
      assert href in source_es,('missing S2 source ES',href)
      assert href not in es,('S2 leaked into safe-default ES browse',href)
    for href in s2_en:
      assert href in source_en,('missing S2 source EN',href)
      assert href not in en,('S2 leaked into safe-default EN browse',href)

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
              assert metas.count()==46,(name,width,'safe-default meta count',metas.count())
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
    report={'gate':'ISSUE_369_P28_P37_PUBLIC_LEAKS_PASS','cases':len(rows),'source_cards_es':48,'source_cards_en':48,'safe_default_cards_es':46,'safe_default_cards_en':46,'s2_hidden_per_locale':2,'public_state_labels':0,'passed':True,'rows':rows}
    (OUT/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
