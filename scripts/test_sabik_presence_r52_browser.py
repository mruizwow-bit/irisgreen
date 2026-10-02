#!/usr/bin/env python3
from __future__ import annotations
import json,threading,time
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
REPORT=ROOT/"reports/sabik-r52"
REPORT.mkdir(parents=True,exist_ok=True)
panel=(ROOT/"sabik/iris-panel.html").read_text(encoding="utf-8")
fixture=REPORT/"fixture.html"
fixture.write_text(
 '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
 '<link rel="stylesheet" href="/sabik/iris-mount.css"></head><body>'
 '<main id="home-view"><div class="iris-home-content"></div>'+panel+'</main>'
 '<script src="/sabik/sabik-motion-r37.js"></script><script src="/sabik/sabik-web-r01.js"></script></body></html>',
 encoding="utf-8"
)
class Quiet(SimpleHTTPRequestHandler):
    def __init__(self,*a,**kw): super().__init__(*a,directory=str(ROOT),**kw)
    def log_message(self,format,*args): pass
server=ThreadingHTTPServer(("127.0.0.1",0),Quiet)
threading.Thread(target=server.serve_forever,daemon=True).start()
url=f"http://127.0.0.1:{server.server_address[1]}/reports/sabik-r52/fixture.html"
evidence={"states":{},"responsive":{}}
try:
  with sync_playwright() as p:
    browser=p.chromium.launch()
    page=browser.new_page(viewport={"width":1440,"height":900})
    failed=[]
    page.on("response",lambda r: failed.append((r.status,r.url)) if r.status>=400 else None)
    page.goto(url,wait_until="networkidle")
    page.wait_for_function("window.SabikWebPresentation && window.SabikWebPresentation.snapshot().renderActive === true")
    layers=page.evaluate("""() => {
      const v=document.querySelector('#sabik-hologram'),m=document.querySelector('#sabik-web-master');
      return {semantic:window.SabikWebPresentation.snapshot().semanticState,
       body:m.getAttribute('src'),state:v.dataset.state,motion:v.dataset.motion,
       orbits:!!v.querySelector('.orbits-back'),rings:!!v.querySelector('.core-rings'),
       light:!!v.querySelector('.core-light'),particles:!!v.querySelector('.particles-front'),
       legacy:!!v.querySelector('.sabik-presence-motion'),containerTransform:getComputedStyle(v).transform};
    }""")
    assert layers["semantic"]=="idle" and layers["state"]=="idle",layers
    assert layers["body"].endswith("web_presente.png?v=sabik-definitive-r01"),layers
    assert all(layers[k] for k in ("orbits","rings","light","particles")),layers
    assert not layers["legacy"],layers
    assert layers["containerTransform"]=="none",layers
    evidence["states"]["idle"]=layers

    page.evaluate("window.SabikWebPresentation.setSemanticState('listening')")
    assert page.locator("#sabik-hologram").get_attribute("data-state")=="listening"
    evidence["states"]["listening"]=True

    page.evaluate("window.SabikWebPresentation.setSabikState('transicion',{force:true,semantic:'processing'})")
    page.wait_for_function("document.querySelector('#sabik-hologram').dataset.state === 'processing'")
    proc=page.evaluate("""() => ({state:document.querySelector('#sabik-hologram').dataset.state,
      orbit:getComputedStyle(document.querySelector('.orbits-back')).animationName,
      body:document.querySelector('#sabik-web-master').getAttribute('src')})""")
    assert proc["state"]=="processing" and proc["orbit"]=="sabikDefOrbit",proc
    assert "web_presente.png?v=sabik-definitive-r01" in proc["body"],proc
    evidence["states"]["processing"]=proc

    page.evaluate("window.SabikWebPresentation.setVoiceActive(true)")
    speak=page.evaluate("() => ({state:document.querySelector('#sabik-hologram').dataset.state,voice:window.SabikWebPresentation.snapshot().voiceActive})")
    assert speak=={"state":"speaking","voice":True},speak
    page.evaluate("window.SabikWebPresentation.setVoiceActive(false)")
    assert page.locator("#sabik-hologram").get_attribute("data-state")=="processing"
    evidence["states"]["speaking"]=speak

    page.evaluate("window.SabikWebPresentation.setSemanticState('degraded')")
    assert page.locator("#sabik-hologram").get_attribute("data-state")=="degraded"

    page.select_option("#sabik-motion-level","REDUCIDO");page.dispatch_event("#sabik-motion-level","change")
    page.wait_for_function("document.querySelector('#sabik-hologram').dataset.motion === 'reduced'")
    reduced=page.evaluate("() => getComputedStyle(document.querySelector('.orbits-back')).animationName")
    assert reduced=="none",reduced
    page.select_option("#sabik-motion-level","SIN_MOVIMIENTO");page.dispatch_event("#sabik-motion-level","change")
    page.wait_for_function("document.querySelector('#sabik-hologram').dataset.motion === 'none'")
    stopped=page.evaluate("""() => [...document.querySelectorAll('#sabik-hologram *')].every(e=>getComputedStyle(e).animationName==='none')""")
    assert stopped
    evidence["states"]["motion"]={"reduced":reduced,"none":stopped}

    for width,height in ((1920,1080),(1440,900),(390,844),(320,800)):
      page.set_viewport_size({"width":width,"height":height});time.sleep(.05)
      m=page.evaluate("""() => {const r=document.querySelector('#sabik-hologram').getBoundingClientRect();
        return {innerWidth,scrollWidth:document.documentElement.scrollWidth,left:r.left,right:r.right,width:r.width,height:r.height}}""")
      assert m["scrollWidth"]<=width+1,(width,m)
      assert m["left"]>=-1 and m["right"]<=width+1,(width,m)
      evidence["responsive"][f"{width}x{height}"]=m
    assert not failed,failed
    browser.close()
finally:
  server.shutdown();server.server_close()
(REPORT/"temporal-evidence.json").write_text(json.dumps(evidence,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print("SABIK_DEFINITIVE_LAYERED_BROWSER_PASS")
