#!/usr/bin/env python3
from playwright.sync_api import sync_playwright
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
import threading,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];OUT=Path('/tmp/iris-format-sleep')
server=ThreadingHTTPServer(('127.0.0.1',8765),partial(SimpleHTTPRequestHandler,directory=ROOT/'dist'))
threading.Thread(target=server.serve_forever,daemon=True).start()
manifest=json.loads((ROOT/'editorial/reviews/situaciones-sueno-manifest.json').read_text())
author=(ROOT/'editorial/reviews/situaciones_sueno_ES_EN.md').read_text();rows=[]
for i,title,es,en in re.findall(r'^## (\d+)\. ([^\n]+)\n\n### ES\n([^\n]+)\n\n### EN\n([^\n]+)',author,re.M):rows.append({'n':int(i),'title':title,'es':es,'en':en})
report={'checks':[],'layout':[],'javascript_errors':[]}
with sync_playwright() as p:
    browser=p.chromium.launch();context=browser.new_context(viewport={'width':1600,'height':950});page=context.new_page()
    page.on('pageerror',lambda e:report['javascript_errors'].append(str(e)))
    for src,entry in zip(rows,manifest['entries']):
        for lang,key in [('es','es'),('en','en')]:
            rel=entry[lang+'_path'];page.goto('http://127.0.0.1:8765/'+rel[:-10],wait_until='domcontentloaded')
            assert page.locator('article.ficha .lede').inner_text()==src[key],(src['n'],lang)
            expected_title=src['title'] if lang=='es' else entry['retained_title_en']
            assert page.locator('article.ficha h1').inner_text()==expected_title,(src['n'],lang)
    report['checks'].append('46 Sueño descriptions exact; 23 Spanish titles exact; English titles retained')
    samples=['/es/neurodiversidad/condiciones/autismo/','/en/neurodiversity/conditions/autism/','/es/situaciones/me-despierto-de-madrugada/','/es/datos/autismo/','/es/biblioteca/el-sueno-que-observar-y-por-donde-empezar/','/en/everyday-life/reasonable-adjustments-at-work/']
    for path in samples:
        page.goto('http://127.0.0.1:8765'+path,wait_until='networkidle');page.evaluate('IGPreferences.reset()')
        page.set_viewport_size({'width':1600,'height':950});page.wait_for_timeout(50)
        main=page.locator('main').bounding_box();ficha=page.locator('article.ficha')
        assert main and 1118<=main['width']<=1122,(path,main)
        fs=float(ficha.evaluate("el=>parseFloat(getComputedStyle(el).fontSize)"));assert 17.9<=fs<=18.1,(path,fs)
        h2=float(page.locator('article.ficha h2').first.evaluate("el=>parseFloat(getComputedStyle(el).fontSize)"));assert h2>=22,(path,h2)
        report['layout'].append({'path':path,'desktop_main_width':main['width'],'body_text_px':fs,'h2_px':h2})
        for width in [320,390,768,1600]:
            page.set_viewport_size({'width':width,'height':950})
            for scale in [1,1.5]:
                page.evaluate('(scale)=>IGPreferences.update({scale:scale,text:{width:"original"}})',scale);page.wait_for_timeout(60)
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),(path,width,scale,page.evaluate('document.documentElement.scrollWidth'))
        page.evaluate('IGPreferences.update({scale:1,text:{width:"narrow"}})');page.set_viewport_size({'width':1600,'height':950});page.wait_for_timeout(30)
        assert page.locator('article.ficha').bounding_box()['width']<900
    report['checks'].append('Shared format: 1120px desktop, 18px body, larger headings; 320–1600px and 150%; narrow preference preserved')
    page.goto('http://127.0.0.1:8765/es/situaciones/necesito-que-me-repitan-las-instrucciones/',wait_until='networkidle')
    assert page.locator('article.ficha').count()==0 and page.locator('#request-text').count()==1
    report['checks'].append('Approved instructions page remains on its separate design')
    assert not report['javascript_errors'],report['javascript_errors'];browser.close()
server.shutdown();OUT.mkdir(parents=True,exist_ok=True);(OUT/'browser-tests.json').write_text(json.dumps(report,indent=2,ensure_ascii=False));print(json.dumps(report,indent=2,ensure_ascii=False))
