#!/usr/bin/env python3
"""R42 Resources A · Iris Card reading-preferences browser gate (ES/EN)."""
from __future__ import annotations
import argparse, functools, json, os, threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
PAIR=[("es","/es/recursos/tarjeta-iris/"),("en","/en/resources/iris-card/")]
PREF="/assets/preferencias-lectura.js"
ADAPTER="/assets/lectura-accesible.js"

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

def static(root:Path):
    rows=[]
    for lang,path in PAIR:
        html=(root/path.strip("/")/"index.html").read_text(encoding="utf-8")
        assert html.count(PREF)==1,(path,"preferences count")
        assert html.count(ADAPTER)==1,(path,"adapter count")
        assert html.index(PREF)<html.index(ADAPTER),(path,"dependency order")
        rows.append({"lang":lang,"path":path,"dependency_order":"PASS"})
    return rows

def browser(root:Path):
    from playwright.sync_api import sync_playwright
    server=ThreadingHTTPServer(("127.0.0.1",0),functools.partial(Quiet,directory=str(root)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f"http://127.0.0.1:{server.server_port}"
    rows=[]
    try:
      with sync_playwright() as pw:
        launch={}
        if os.environ.get("IRIS_AUDIT_BROWSER"): launch["executable_path"]=os.environ["IRIS_AUDIT_BROWSER"]
        browser=pw.chromium.launch(**launch)
        for width in (1440,320):
          for lang,path in PAIR:
            ctx=browser.new_context(viewport={"width":width,"height":900})
            ctx.route("**/*",lambda route: route.continue_() if route.request.url.startswith(base) else route.abort())
            page=ctx.new_page();page.set_default_timeout(15000)
            errors=[];page.on("pageerror",lambda error:errors.append(str(error)))
            row={"lang":lang,"path":path,"width":width}
            try:
              page.goto(base+path,wait_until="domcontentloaded")
              page.locator("main h1").first.wait_for(state="visible")
              assert page.locator("html").get_attribute("lang")==lang
              assert page.evaluate("typeof window.IGPreferences==='object'")
              srcs=page.locator("script[src]").evaluate_all("(els)=>els.map(e=>e.getAttribute('src'))")
              assert srcs.count(PREF)==1,srcs
              assert srcs.count(ADAPTER)==1,srcs
              assert srcs.index(PREF)<srcs.index(ADAPTER),srcs

              trigger=page.locator("#a11yBtn")
              trigger.focus();trigger.press("Enter")
              panel=page.locator("#a11y")
              assert panel.get_attribute("hidden") is None
              assert trigger.get_attribute("aria-expanded")=="true"
              assert page.evaluate("document.activeElement && document.activeElement.closest('#a11y')!==null")

              page.locator('#a11y [data-a="fs+"]').click()
              assert page.evaluate("window.IGPreferences.get().scale>1")
              page.locator('#a11y [data-a="ls"]').click()
              assert page.evaluate("window.IGPreferences.get().spacing===true")
              page.locator('#a11y [data-a="big"]').click()
              assert page.evaluate("window.IGPreferences.get().controls===true && document.body.classList.contains('big')")
              page.locator('#a11y [data-a="hc"]').click()
              assert page.evaluate("window.IGPreferences.get().contrast===true && document.documentElement.dataset.igContrast==='on'")
              page.locator('#a11y [data-a="rm"]').click()
              assert page.evaluate("window.IGPreferences.get().motion===true && document.body.classList.contains('rm')")

              trans=page.locator('#a11y [data-ig-transparency-settings]')
              if trans.count():
                page.locator('#a11y [data-ig-transparency-choice="opaque"]').click()
                assert page.evaluate("window.IGPreferences.getTransparency()==='opaque'")
                row["transparency"]="PASS"
              else:
                row["transparency"]="NOT_APPLICABLE_NO_R42_MATERIAL_ON_CARD"

              page.locator('#a11y [data-a="reset"]').click()
              state=page.evaluate("window.IGPreferences.get()")
              assert state["scale"]==1 and not state["spacing"] and not state["controls"] and not state["contrast"] and not state["motion"],state

              page.keyboard.press("Escape")
              assert panel.get_attribute("hidden") is not None
              page.wait_for_function("document.getElementById('a11yBtn').getAttribute('aria-expanded')==='false'")
              page.wait_for_function("document.activeElement && document.activeElement.id==='a11yBtn'")
              assert trigger.get_attribute("aria-expanded")=="false"
              assert page.evaluate("document.documentElement.scrollWidth<=innerWidth+1")
              assert not errors,(path,width,errors)
              row["passed"]=True
            except Exception as exc:
              row.update(passed=False,error=str(exc),page_errors=errors)
              raise
            finally:
              rows.append(row);ctx.close()
        browser.close()
    finally:
      server.shutdown();server.server_close()
    return rows

def main():
    p=argparse.ArgumentParser();p.add_argument("--root",type=Path,default=ROOT/"dist");args=p.parse_args()
    result={"status":"PASS","static":static(args.root),"browser":browser(args.root)}
    print("R42_RESOURCES_IRIS_CARD_READING_PREFS_PASS")
    print(json.dumps(result,ensure_ascii=False))

if __name__=="__main__": main()
