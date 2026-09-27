#!/usr/bin/env python3
"""Gate específico de la Home R42. No certifica la web completa."""
from __future__ import annotations
import argparse, json, threading
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def static(root:Path):
    p=root/"index.html"
    assert p.is_file(),p
    text=p.read_text(encoding="utf-8")
    s=BeautifulSoup(text,"html.parser")
    assert s.body and s.body.get("data-ig-home-r42")=="true"
    assert s.body.get("data-ig-materials")=="r42"
    assert len(s.select("#ig-home-search-form"))==1
    assert len(s.select("#ig-page-finder"))==0
    assert len(s.select("[data-audience]"))==4
    assert len(s.select("[data-section]"))==12
    assert len(s.select('link[href^="/assets/ig-home-r42.css"]'))==1
    assert len(s.select('script[src^="/assets/ig-home-r42.js"]'))==1
    assert len(s.select('script[src^="/assets/ig-child-safety.js"]'))==1
    assert len(s.select('script[src^="/assets/buscador-comun.js"]'))==1
    assert not s.select('link[href^="/assets/iris-brief-r08.css"]')
    assert "Busca en esta página" not in text and "Find a section on this page" not in text
    assert text.index("/assets/ig-child-safety.js") < text.index("/assets/buscador-comun.js")
    return {"sections":12,"audiences":4,"search_forms":1,"page_finder":0}

def browser(root:Path,out:Path):
    server=ThreadingHTTPServer(("127.0.0.1",0),partial(Quiet,directory=str(root)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f"http://127.0.0.1:{server.server_port}"
    rows=[]
    try:
      with sync_playwright() as pw:
        b=pw.chromium.launch(headless=True)
        for width,height in ((1440,900),(390,844),(320,800)):
          for suffix,lang in (("/","es"),("/?lang=en","en")):
            ctx=b.new_context(viewport={"width":width,"height":height},reduced_motion="reduce")
            page=ctx.new_page();errors=[];requests=[]
            page.on("pageerror",lambda e:errors.append(str(e)))
            page.on("request",lambda r:requests.append(r.url))
            page.goto(base+suffix,wait_until="networkidle")
            assert page.locator("html").get_attribute("lang")==lang
            assert page.locator("header").count()==1
            assert page.locator("#ig-page-finder").count()==0
            assert page.locator("#ig-home-search-form").count()==1
            assert page.locator('input[type="search"]').count()==1
            assert page.locator("[data-section]").count()==12
            assert page.locator("[data-audience]").count()==4
            assert page.evaluate("document.documentElement.scrollWidth<=innerWidth+1"),(width,lang,"overflow")
            assert page.locator('[data-audience="all"]').get_attribute("aria-pressed")=="true"
            page.locator('[data-audience="child"]').click()
            assert page.locator("html").get_attribute("data-ig-audience")=="child"
            page.locator('[data-audience="adult"]').click()
            assert page.locator("html").get_attribute("data-ig-audience")=="adult"
            page.locator('[data-audience="all"]').click()
            assert page.locator("html").get_attribute("data-ig-audience")=="all"
            page.locator("#ig-home-reading-open").click()
            assert page.locator("#ig-home-reading").is_visible()
            assert page.locator("[data-ig-transparency-settings]").count()==1
            page.locator("#ig-home-reading-close").click()
            assert page.locator("#ig-home-reading").is_hidden()
            page.locator("#ig-home-menu summary").click()
            assert page.locator("#ig-home-menu").get_attribute("open") is not None
            page.keyboard.press("Escape")
            assert page.locator("#ig-home-menu").get_attribute("open") is None
            q="noise" if lang=="en" else "ruido"
            page.locator("#ig-home-q").fill(q)
            page.locator("#ig-home-search-form button[type=submit]").click()
            page.locator("#ig-home-results").wait_for(state="visible")
            assert any("/assets/content-safety/search-safe-default.json" in u for u in requests)
            assert not errors,(width,lang,errors)
            rows.append({"width":width,"lang":lang,"passed":True})
            ctx.close()
        b.close()
    finally:
      server.shutdown()
    out.mkdir(parents=True,exist_ok=True)
    (out/"browser.json").write_text(json.dumps(rows,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    return rows

def main():
    ap=argparse.ArgumentParser();ap.add_argument("--root",type=Path,default=Path("dist"));ap.add_argument("--out",type=Path,default=Path("reports/r42-home"));a=ap.parse_args()
    root=a.root.resolve();result={"static":static(root),"browser":browser(root,a.out)}
    print("R42_HOME_PASS",json.dumps(result,ensure_ascii=False))

if __name__=="__main__":main()
