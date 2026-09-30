#!/usr/bin/env python3
from __future__ import annotations
import json
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "reports/sabik-r52"
REPORT.mkdir(parents=True, exist_ok=True)
panel = (ROOT / "sabik/iris-panel.html").read_text(encoding="utf-8")
fixture = REPORT / "fixture.html"
fixture.write_text(
    '<!doctype html><html lang="es"><head><meta charset="utf-8">'
    '<meta name="viewport" content="width=device-width,initial-scale=1">'
    '<link rel="stylesheet" href="/sabik/iris-mount.css"></head><body>'
    '<main id="home-view"><div class="iris-home-content"></div>' + panel + '</main>'
    '<script src="/sabik/sabik-motion-r37.js"></script>'
    '<script src="/sabik/sabik-web-r01.js"></script></body></html>',
    encoding="utf-8",
)

class Quiet(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)
    def log_message(self, format, *args):
        pass

server = ThreadingHTTPServer(("127.0.0.1", 0), Quiet)
threading.Thread(target=server.serve_forever, daemon=True).start()
url = f"http://127.0.0.1:{server.server_address[1]}/reports/sabik-r52/fixture.html"
evidence = {"motion": {}, "responsive": {}}

try:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto(url, wait_until="networkidle")
        page.wait_for_function("window.SabikWebPresentation && document.querySelector('#sabik-hologram')?.dataset.motionLevel")

        # PRESENTE keeps the current Web master, with two independent measured orbit layers.
        src = page.locator("#sabik-web-master").get_attribute("src")
        assert "/sabik/assets/web-r01/web_presente.png?v=r69-20260930-3" in src, src
        page.wait_for_function("document.querySelectorAll('#sabik-hologram .sabik-orbit-layer').length === 2")
        idle = page.evaluate("""() => ({
          state: document.querySelector('#sabik-hologram').dataset.webState,
          active: window.SabikWebPresentation.snapshot().active,
          layers: window.SabikWebPresentation.snapshot().layers,
          renderActive: window.SabikWebPresentation.snapshot().renderActive,
          masterAnimations: document.querySelector('#sabik-web-master').getAnimations().length,
          backTransform: getComputedStyle(document.querySelector('.sabik-back-layer')).transform
        })""")
        assert idle["state"] == "PRESENTE", idle
        assert idle["active"] is False, idle
        assert idle["layers"] == 2 and idle["renderActive"] is True, idle
        painted = page.evaluate("""() => {
          const m=document.querySelector('#sabik-web-master'),b=document.querySelector('.sabik-back-layer'),f=document.querySelector('.sabik-front-layer'),c=getComputedStyle(m),r=m.getBoundingClientRect();
          return {tagBack:b.tagName,tagFront:f.tagName,display:c.display,visibility:c.visibility,opacity:Number(c.opacity),w:r.width,h:r.height,natural:m.naturalWidth,complete:m.complete};
        }""")
        assert painted["tagBack"]=="SPAN" and painted["tagFront"]=="SPAN", painted
        assert painted["display"]!="none" and painted["visibility"]=="visible" and painted["opacity"]>.99, painted
        assert painted["w"]>=220 and painted["h"]>=220 and painted["natural"]>0 and painted["complete"], painted
        before = idle["backTransform"]
        page.wait_for_timeout(300)
        after = page.locator(".sabik-back-layer").evaluate("(e)=>getComputedStyle(e).transform")
        assert before != after, (before, after)
        evidence["motion"]["present_continuous"] = {**idle, "afterTransform": after}

        # NORMAL: R37 finite transition over the current ORIENTAR master.
        page.evaluate("() => { void window.SabikWebPresentation.setSabikState('orientar',{force:true}); }")
        page.wait_for_function("window.SabikWebPresentation.snapshot().active === true")
        normal = page.evaluate("""() => {
          const a=document.querySelector('#sabik-web-master').getAnimations()[0];
          return {
            state: document.querySelector('#sabik-hologram').dataset.webState,
            src: document.querySelector('#sabik-web-master').getAttribute('src'),
            duration: a?.effect?.getTiming().duration,
            iterations: a?.effect?.getTiming().iterations
          };
        }""")
        assert normal["state"] == "ORIENTAR", normal
        assert "/sabik/assets/web-r01/web_orientar.png?v=r69-20260930-3" in normal["src"], normal
        assert normal["duration"] == 380, normal
        assert normal["iterations"] == 1, normal
        page.wait_for_function("window.SabikWebPresentation.snapshot().active === false")
        evidence["motion"]["normal_orientar"] = normal

        # TRANSICION is finite and returns to the requested stable current master.
        page.evaluate("() => { void window.SabikWebPresentation.setSabikState('transicion',{to:'presente',force:true}); }")
        page.wait_for_function("window.SabikWebPresentation.snapshot().active === true")
        transition = page.evaluate("""() => {
          const a=document.querySelector('#sabik-web-master').getAnimations()[0];
          return {duration:a?.effect?.getTiming().duration,iterations:a?.effect?.getTiming().iterations};
        }""")
        assert transition["duration"] == 500, transition
        assert transition["iterations"] == 1, transition
        page.wait_for_function("window.SabikWebPresentation.snapshot().active === false && document.querySelector('#sabik-web-master').getAttribute('src').includes('web_presente.png?v=r69-20260930-3')")
        evidence["motion"]["transition"] = transition

        # REDUCIDO shortens the same R37 movement.
        # This isolated Motion fixture does not mount iris-mount.mjs; Home v4 may
        # place these controls inside the Sabik settings disclosure.
        settings = page.locator("#sabik-settings")
        if settings.count() and settings.get_attribute("hidden") is not None:
            settings.evaluate("(el) => { el.hidden = false; }")
        page.select_option("#sabik-motion-level", "REDUCIDO")
        page.dispatch_event("#sabik-motion-level", "change")
        page.evaluate("() => { void window.SabikWebPresentation.setSabikState('orientar',{force:true}); }")
        page.wait_for_function("window.SabikWebPresentation.snapshot().active === true")
        reduced = page.evaluate("""() => {
          const a=document.querySelector('#sabik-web-master').getAnimations()[0];
          return {duration:a?.effect?.getTiming().duration, level:window.SabikWebPresentation.snapshot().level};
        }""")
        assert reduced["duration"] == 140, reduced
        assert reduced["level"] == "REDUCIDO", reduced
        page.wait_for_function("window.SabikWebPresentation.snapshot().active === false")
        evidence["motion"]["reduced"] = reduced

        # SIN_MOVIMIENTO swaps state master but freezes both the finite B3 transition and living layers.
        page.select_option("#sabik-motion-level", "SIN_MOVIMIENTO")
        page.dispatch_event("#sabik-motion-level", "change")
        page.evaluate("() => { void window.SabikWebPresentation.setSabikState('pausa',{force:true}); }")
        page.wait_for_function("document.querySelector('#sabik-web-master').getAttribute('src').includes('web_pausa.png?v=r69-20260930-3')")
        stopped = page.evaluate("""() => ({
          active: window.SabikWebPresentation.snapshot().active,
          animations: document.querySelector('#sabik-web-master').getAnimations().length,
          level: window.SabikWebPresentation.snapshot().level,
          backTransform: getComputedStyle(document.querySelector('.sabik-back-layer')).transform
        })""")
        assert stopped["active"] is False, stopped
        assert stopped["animations"] == 0, stopped
        assert stopped["level"] == "SIN_MOVIMIENTO", stopped
        page.wait_for_timeout(300)
        stopped_after = page.locator(".sabik-back-layer").evaluate("(e)=>getComputedStyle(e).transform")
        assert stopped["backTransform"] == stopped_after, (stopped, stopped_after)
        evidence["motion"]["no_motion"] = {**stopped, "afterTransform": stopped_after}

        # Voice hook modulates the layered presence without replacing the current Web master.
        page.evaluate("window.SabikWebPresentation.setVoiceActive(true)")
        voice = page.evaluate("""() => ({
          voice: document.querySelector('#sabik-hologram').dataset.voiceActive,
          src: document.querySelector('#sabik-web-master').getAttribute('src'),
          layered: document.querySelector('.sabik-layered-avatar') !== null
        })""")
        assert voice["voice"] == "true", voice
        assert "/sabik/assets/web-r01/web_pausa.png?v=r69-20260930-3" in voice["src"], voice
        assert voice["layered"] is True, voice
        page.evaluate("window.SabikWebPresentation.setVoiceActive(false)")
        evidence["motion"]["voice_hook"] = voice

        for width,height in ((1920,1080),(1440,900),(390,844),(320,800)):
            page.set_viewport_size({"width":width,"height":height})
            time.sleep(0.05)
            metrics = page.evaluate("""() => {
              const r=document.querySelector('#sabik-hologram').getBoundingClientRect();
              return {innerWidth,scrollWidth:document.documentElement.scrollWidth,
                      visualWidth:r.width,visualRight:r.right};
            }""")
            assert metrics["scrollWidth"] <= width + 1, (width, metrics)
            assert metrics["visualRight"] <= width + 1, (width, metrics)
            evidence["responsive"][f"{width}x{height}"] = metrics

        browser.close()
finally:
    server.shutdown()
    server.server_close()

(REPORT / "temporal-evidence.json").write_text(
    json.dumps(evidence, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)
print("R52_A3_NEW_SABIK_LAYERED_MOTION_BROWSER_PASS")
