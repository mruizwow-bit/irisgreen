#!/usr/bin/env python3
from __future__ import annotations
import json
import threading
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
    '<link rel="stylesheet" href="/sabik/iris-mount.css">'
    '<link rel="stylesheet" href="/sabik/definitive-r01/sabik-layered.css"></head><body>'
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

        visual = page.locator("#sabik-hologram")
        master = page.locator("#sabik-web-master")
        src = master.get_attribute("src")
        assert "/sabik/assets/web-r01/web_presente.png?v=sabik-definitive-r01" in src, src

        layers = page.evaluate("""() => ({
          orbits: !!document.querySelector('#sabik-hologram .orbits-back'),
          rings: !!document.querySelector('#sabik-hologram .core-rings'),
          light: !!document.querySelector('#sabik-hologram .core-light'),
          particles: !!document.querySelector('#sabik-hologram .particles-front'),
          semantic: document.querySelector('#sabik-hologram').dataset.state,
          webState: document.querySelector('#sabik-hologram').dataset.webState,
          renderActive: window.SabikWebPresentation.snapshot().renderActive
        })""")
        assert all(layers[k] for k in ("orbits","rings","light","particles")), layers
        assert layers["semantic"] == "idle", layers
        assert layers["webState"] == "PRESENTE", layers
        assert layers["renderActive"] is True, layers
        evidence["motion"]["initial"] = layers

        painted = page.evaluate("""() => {
          const m=document.querySelector('#sabik-web-master'),c=getComputedStyle(m),r=m.getBoundingClientRect();
          return {display:c.display,visibility:c.visibility,opacity:Number(c.opacity),w:r.width,h:r.height,natural:m.naturalWidth,complete:m.complete};
        }""")
        assert painted["display"] != "none" and painted["visibility"] == "visible" and painted["opacity"] > .99, painted
        assert painted["w"] >= 180 and painted["h"] >= 180 and painted["natural"] > 0 and painted["complete"], painted

        # R37 finite interaction transition operates on the approved body without swapping identity.
        page.evaluate("() => { void window.SabikWebPresentation.setSabikState('orientar',{force:true,semantic:'listening'}); }")
        page.wait_for_function("window.SabikWebPresentation.snapshot().active === true")
        normal = page.evaluate("""() => {
          const m=document.querySelector('#sabik-web-master'),a=m.getAnimations()[0],v=document.querySelector('#sabik-hologram');
          return {state:v.dataset.webState,semantic:v.dataset.state,src:m.getAttribute('src'),
                  duration:a?.effect?.getTiming().duration,iterations:a?.effect?.getTiming().iterations};
        }""")
        assert normal["state"] == "ORIENTAR", normal
        assert normal["semantic"] == "listening", normal
        assert "web_presente.png?v=sabik-definitive-r01" in normal["src"], normal
        assert normal["duration"] == 380 and normal["iterations"] == 1, normal
        page.wait_for_function("window.SabikWebPresentation.snapshot().active === false")
        evidence["motion"]["normal_orientar"] = normal

        # Processing and speaking are semantic layered states; identity stays the same.
        page.evaluate("window.SabikWebPresentation.setSemanticState('processing')")
        processing = page.evaluate("""() => ({
          semantic:document.querySelector('#sabik-hologram').dataset.state,
          orbitAnimation:getComputedStyle(document.querySelector('#sabik-hologram .orbits-back')).animationName,
          coreAnimation:getComputedStyle(document.querySelector('#sabik-hologram .core-light')).animationName
        })""")
        assert processing["semantic"] == "processing", processing
        assert "orbit" in processing["orbitAnimation"], processing
        assert "think" in processing["coreAnimation"], processing
        evidence["motion"]["processing"] = processing

        page.evaluate("window.SabikWebPresentation.setSemanticState('degraded')")
        degraded = page.evaluate("""() => ({
          semantic:document.querySelector('#sabik-hologram').dataset.state,
          orbitOpacity:Number(getComputedStyle(document.querySelector('#sabik-hologram .orbits-back')).opacity),
          coreOpacity:Number(getComputedStyle(document.querySelector('#sabik-hologram .core-light')).opacity)
        })""")
        assert degraded["semantic"] == "degraded", degraded
        assert degraded["orbitOpacity"] < 1 and degraded["coreOpacity"] < 1, degraded
        evidence["motion"]["degraded"] = degraded

        page.evaluate("window.SabikWebPresentation.setVoiceActive(true)")
        speaking = page.evaluate("""() => ({
          semantic:document.querySelector('#sabik-hologram').dataset.state,
          voice:document.querySelector('#sabik-hologram').dataset.voiceActive,
          bodyAnimation:getComputedStyle(document.querySelector('#sabik-web-master')).animationName,
          coreAnimation:getComputedStyle(document.querySelector('#sabik-hologram .core-light')).animationName,
          src:document.querySelector('#sabik-web-master').getAttribute('src')
        })""")
        assert speaking["semantic"] == "speaking" and speaking["voice"] == "true", speaking
        assert "speakBody" in speaking["bodyAnimation"], speaking
        assert "speak" in speaking["coreAnimation"], speaking
        assert "web_presente.png?v=sabik-definitive-r01" in speaking["src"], speaking
        page.evaluate("window.SabikWebPresentation.setVoiceActive(false)")
        evidence["motion"]["speaking"] = speaking

        # Reduced keeps functionality while shortening R37 finite motion.
        page.select_option("#sabik-motion-level", "REDUCIDO")
        page.dispatch_event("#sabik-motion-level", "change")
        page.evaluate("window.SabikWebPresentation.setSemanticState('processing')")
        reduced_css = page.evaluate("""() => ({
          motion:document.querySelector('#sabik-hologram').dataset.motion,
          orbitAnimation:getComputedStyle(document.querySelector('#sabik-hologram .orbits-back')).animationName,
          coreAnimation:getComputedStyle(document.querySelector('#sabik-hologram .core-light')).animationName
        })""")
        assert reduced_css["motion"] == "reduced", reduced_css
        assert reduced_css["orbitAnimation"] == "none" and reduced_css["coreAnimation"] == "none", reduced_css
        evidence["motion"]["reduced_css"] = reduced_css
        page.evaluate("() => { void window.SabikWebPresentation.setSabikState('pausa',{force:true,semantic:'idle'}); }")
        page.wait_for_function("window.SabikWebPresentation.snapshot().active === true")
        reduced = page.evaluate("""() => {
          const animations=document.querySelector('#sabik-web-master').getAnimations();
          const a=animations.find(x=>{const t=x.effect?.getTiming?.();return Number(t?.duration)<=1000&&Number(t?.iterations)===1;});
          return {duration:a?.effect?.getTiming().duration,level:window.SabikWebPresentation.snapshot().level,
                  state:document.querySelector('#sabik-hologram').dataset.webState,
                  motion:document.querySelector('#sabik-hologram').dataset.motion};
        }""")
        assert reduced["duration"] == 140 and reduced["level"] == "REDUCIDO", reduced
        assert reduced["state"] == "PAUSA", reduced
        assert reduced["motion"] == "reduced", reduced
        page.wait_for_function("window.SabikWebPresentation.snapshot().active === false")
        evidence["motion"]["reduced"] = reduced

        # No-motion freezes finite R37 movement and all layered CSS animation.
        page.select_option("#sabik-motion-level", "SIN_MOVIMIENTO")
        page.dispatch_event("#sabik-motion-level", "change")
        page.evaluate("() => { void window.SabikWebPresentation.setSabikState('pausa',{force:true,semantic:'idle'}); }")
        page.wait_for_timeout(80)
        stopped = page.evaluate("""() => ({
          active:window.SabikWebPresentation.snapshot().active,
          level:window.SabikWebPresentation.snapshot().level,
          motion:document.querySelector('#sabik-hologram').dataset.motion,
          masterAnimations:document.querySelector('#sabik-web-master').getAnimations().length,
          orbitAnimation:getComputedStyle(document.querySelector('#sabik-hologram .orbits-back')).animationName,
          bodyAnimation:getComputedStyle(document.querySelector('#sabik-web-master')).animationName
        })""")
        assert stopped["active"] is False and stopped["level"] == "SIN_MOVIMIENTO", stopped
        assert stopped["motion"] == "none", stopped
        assert stopped["masterAnimations"] == 0, stopped
        assert stopped["orbitAnimation"] == "none" and stopped["bodyAnimation"] == "none", stopped
        evidence["motion"]["no_motion"] = stopped

        page.evaluate("window.SabikWebPresentation.setVoiceActive(true)")
        no_motion_voice = page.evaluate("""() => ({
          semantic:document.querySelector('#sabik-hologram').dataset.state,
          voice:document.querySelector('#sabik-hologram').dataset.voiceActive,
          motion:document.querySelector('#sabik-hologram').dataset.motion,
          bodyAnimation:getComputedStyle(document.querySelector('#sabik-web-master')).animationName,
          coreAnimation:getComputedStyle(document.querySelector('#sabik-hologram .core-light')).animationName
        })""")
        assert no_motion_voice["semantic"] == "speaking" and no_motion_voice["voice"] == "true", no_motion_voice
        assert no_motion_voice["motion"] == "none", no_motion_voice
        assert no_motion_voice["bodyAnimation"] == "none" and no_motion_voice["coreAnimation"] == "none", no_motion_voice
        page.evaluate("window.SabikWebPresentation.setVoiceActive(false)")
        evidence["motion"]["no_motion_voice"] = no_motion_voice

        page.select_option("#sabik-motion-level", "NORMAL")
        page.dispatch_event("#sabik-motion-level", "change")
        page.emulate_media(reduced_motion="reduce")
        page.wait_for_timeout(80)
        page.evaluate("window.SabikWebPresentation.refresh()")
        prefers = page.evaluate("""() => ({
          motion:document.querySelector('#sabik-hologram').dataset.motion,
          level:window.SabikWebPresentation.snapshot().level,
          orbitAnimation:getComputedStyle(document.querySelector('#sabik-hologram .orbits-back')).animationName
        })""")
        assert prefers["motion"] == "reduced" and prefers["level"] == "REDUCIDO", prefers
        assert prefers["orbitAnimation"] == "none", prefers
        evidence["motion"]["prefers_reduced"] = prefers
        page.emulate_media(reduced_motion="no-preference")

        for width,height in ((1920,1080),(1440,900),(390,844),(320,800)):
            page.set_viewport_size({"width":width,"height":height})
            page.wait_for_timeout(30)
            metrics = page.evaluate("""() => {
              const r=document.querySelector('#sabik-hologram').getBoundingClientRect();
              return {innerWidth,scrollWidth:document.documentElement.scrollWidth,
                      visualWidth:r.width,visualRight:r.right};
            }""")
            # This isolated fixture still carries the historical #home-view wrapper.
            # Whole-page overflow belongs to the real Home browser gate; here we
            # prove the Sabik visual itself never escapes the viewport.
            assert metrics["visualRight"] <= width + 1, (width, metrics)
            assert metrics["visualWidth"] <= width + 1, (width, metrics)
            evidence["responsive"][f"{width}x{height}"] = metrics

        browser.close()
finally:
    server.shutdown()
    server.server_close()

(REPORT / "temporal-evidence.json").write_text(
    json.dumps(evidence, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)
print("R52_A3_DEFINITIVE_LAYERED_SABIK_BROWSER_PASS")
