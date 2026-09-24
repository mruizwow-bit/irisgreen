#!/usr/bin/env python3
"""Check the built replacement workshop, including real project downloads."""
import functools,json,threading
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from bs4 import BeautifulSoup
ROOT=Path(__file__).resolve().parents[1]
PAIRS=[('dibujo','drawing',15),('estructuras','structures',11),('programacion','coding',15),('robotica','robotics',9),('ideas','ideas',8)]
def main():
 from playwright.sync_api import sync_playwright
 out=ROOT/'reports/taller-f1';out.mkdir(parents=True,exist_ok=True)
 sitemap=(ROOT/'dist/sitemap.xml').read_text()
 for es,en,count in PAIRS:
  for lang,slug,prefix in [('es',es,'es/taller'),('en',en,'en/workshop')]:
   path=f'/{prefix}/{slug}/';soup=BeautifulSoup((ROOT/'dist'/path.strip('/')/'index.html').read_text(),'html.parser')
   assert path in sitemap,path
   assert len(soup.select('.igt-list-static ol > li'))==count,(path,'static challenges')
   for code,target in [('es',f'/es/taller/{es}/'),('en',f'/en/workshop/{en}/')]:
    assert soup.select_one(f'link[hreflang="{code}"]')['href'].endswith(target)
 class Quiet(SimpleHTTPRequestHandler):
  def log_message(self,*args):pass
 server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
 threading.Thread(target=server.serve_forever,daemon=True).start();rows=[]
 try:
  with sync_playwright() as pw:
   browser=pw.chromium.launch()
   for width in [1920,320]:
    for es,en,count in PAIRS:
     for lang,slug,prefix in [('es',es,'es/taller'),('en',en,'en/workshop')]:
      path=f'/{prefix}/{slug}/';ctx=browser.new_context(viewport={'width':width,'height':1000},accept_downloads=True,reduced_motion='reduce')
      page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
      page.goto(f'http://127.0.0.1:{server.server_port}'+path,wait_until='networkidle')
      save=page.get_by_role('button',name='Guardar archivo' if lang=='es' else 'Save file',exact=True);save.wait_for()
      assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),path
      assert 'Newsreader' in page.locator('main h1').first.evaluate('(el)=>getComputedStyle(el).fontFamily'),path
      page.keyboard.press('Tab');assert page.evaluate('document.activeElement.tagName')!='BODY'
      with page.expect_download() as download:save.click()
      target=out/f'{slug}-{lang}-{width}.json';download.value.save_as(target)
      data=json.loads(target.read_text());assert data['formato']=='irisgreen-taller' and data['datos'] is not None
      assert not errors,(path,errors)
      page.screenshot(path=str(out/f'{slug}-{lang}-{width}.png'),full_page=True)
      rows.append({'path':path,'width':width,'project':data['estudio'],'passed':True})
      (out/'result.json').write_text(json.dumps(rows,indent=2))
      ctx.close()
   browser.close()
 finally:server.shutdown()
 print(json.dumps({'mounted_cases':len(rows),'passed':True}))
if __name__=='__main__':main()
