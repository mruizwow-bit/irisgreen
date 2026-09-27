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
evidence = {"samples": {}, "responsive": {}}

def seconds(value: str) -> float:
    first = value.split(",")[0].strip()
    if first.endswith("ms"):
        return float(first[:-2]) / 1000.0
    if first.endswith("s"):
        return float(first[:-1])
    return 0.0

try:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.goto(url, wait_until="networkidle")
        page.wait_for_function("window.SabikWebPresentation && document.querySelector('#sabik-hologram')?.dataset.motionLevel")

        def ring_style():
            return page.eval_on_selector("#rings-back", """el => {
              const s=getComputedStyle(el); return {
                transform:s.transform, animationName:s.animationName,
                animationDuration:s.animationDuration, animationPlayState:s.animationPlayState
              };
            }""")

        normal0 = ring_style()
        time.sleep(0.45)
        normal1 = ring_style()
        assert "sabikMeasuredPrecession" in normal0["animationName"], normal0
        assert normal0["animationPlayState"] == "running", normal0
        assert normal0["transform"] != normal1["transform"], (normal0, normal1)
        evidence["samples"]["normal"] = {"t0":normal0, "t450ms":normal1}

        page.eval_on_selector("#sabik-results", "el => el.setAttribute('aria-busy','true')")
        page.wait_for_function("document.querySelector('#sabik-hologram').dataset.operation === 'processing'")
        processing = ring_style()
        assert seconds(processing["animationDuration"]) < seconds(normal0["animationDuration"])
        evidence["samples"]["processing"] = processing
        page.eval_on_selector("#sabik-results", "el => el.setAttribute('aria-busy','false')")

        page.evaluate("window.SabikWebPresentation.handleVoiceEvent('voice-start')")
        page.wait_for_function("document.querySelector('#sabik-hologram').dataset.voiceActive === 'true'")
        voice_start = page.eval_on_selector("#sabik-hologram", """el => {
          const s=getComputedStyle(el,'::before'); return {
            animationName:s.animationName, animationDuration:s.animationDuration,
            animationPlayState:s.animationPlayState, opacity:s.opacity
          };
        }""")
        assert "sabikVoiceRipple" in voice_start["animationName"], voice_start
        page.evaluate("window.SabikWebPresentation.handleVoiceEvent('voice-end')")
        page.wait_for_function("document.querySelector('#sabik-hologram').dataset.voiceActive === 'false'")
        voice_end = page.eval_on_selector("#sabik-hologram", "el => ({duration:getComputedStyle(el,'::before').animationDuration})")
        assert seconds(voice_start["animationDuration"]) < seconds(voice_end["duration"])
        evidence["samples"]["voice"] = {"start":voice_start, "end":voice_end}

        page.select_option("#sabik-motion-level", "REDUCIDO")
        page.dispatch_event("#sabik-motion-level", "change")
        page.wait_for_function("document.querySelector('#sabik-hologram').dataset.motionLevel === 'REDUCIDO'")
        reduced = ring_style()
        assert seconds(reduced["animationDuration"]) > seconds(normal0["animationDuration"])
        evidence["samples"]["reduced"] = reduced

        page.select_option("#sabik-motion-level", "SIN_MOVIMIENTO")
        page.dispatch_event("#sabik-motion-level", "change")
        page.wait_for_function("document.querySelector('#sabik-hologram').dataset.motionLevel === 'SIN_MOVIMIENTO'")
        stopped_ring = ring_style()
        stopped_base = page.eval_on_selector(".sabik-avatar-base", "el => getComputedStyle(el).animationPlayState")
        assert stopped_ring["animationPlayState"] == "paused", stopped_ring
        assert stopped_base == "paused", stopped_base
        evidence["samples"]["no_motion"] = {"ring":stopped_ring, "basePlayState":stopped_base}

        page.select_option("#sabik-motion-level", "NORMAL")
        page.dispatch_event("#sabik-motion-level", "change")
        page.wait_for_function("document.querySelector('#sabik-hologram').dataset.motionLevel === 'NORMAL'")
        page.eval_on_selector("#sabik-widget-body", "el => el.hidden=true")
        page.wait_for_function("document.querySelector('#sabik-hologram').dataset.renderActive === 'false'")
        hidden = ring_style()
        assert hidden["animationPlayState"] == "paused", hidden
        page.eval_on_selector("#sabik-widget-body", "el => el.hidden=false")
        page.wait_for_function("document.querySelector('#sabik-hologram').dataset.renderActive === 'true'")
        visible = ring_style()
        assert visible["animationPlayState"] == "running", visible
        evidence["samples"]["panel_visibility"] = {"hidden":hidden, "visible":visible}

        page.emulate_media(reduced_motion="reduce")
        page.wait_for_function("document.querySelector('#sabik-hologram').dataset.motionLevel === 'REDUCIDO'")
        system_reduced = ring_style()
        assert seconds(system_reduced["animationDuration"]) >= seconds(reduced["animationDuration"])
        evidence["samples"]["prefers_reduced_motion"] = system_reduced
        page.emulate_media(reduced_motion="no-preference")
        page.wait_for_function("document.querySelector('#sabik-hologram').dataset.motionLevel === 'NORMAL'")

        frame_metrics = page.evaluate("""async () => {
          const stamps=[]; const start=performance.now();
          await new Promise(resolve => {
            function tick(t){ stamps.push(t); if(t-start>=700) resolve(); else requestAnimationFrame(tick); }
            requestAnimationFrame(tick);
          });
          const d=stamps.slice(1).map((v,i)=>v-stamps[i]);
          return {frames:stamps.length, meanMs:d.reduce((a,b)=>a+b,0)/Math.max(1,d.length),
                  maxMs:Math.max(0,...d), over50ms:d.filter(v=>v>50).length};
        }""")
        assert frame_metrics["frames"] >= 8, frame_metrics
        evidence["samples"]["frame_pacing_700ms"] = frame_metrics

        for width,height in ((1920,1080),(1440,900),(390,844),(320,800)):
            page.set_viewport_size({"width":width,"height":height})
            time.sleep(0.08)
            metrics = page.evaluate("""() => {
              const r=document.querySelector('#sabik-hologram').getBoundingClientRect();
              return {innerWidth, scrollWidth:document.documentElement.scrollWidth,
                      visualWidth:r.width, visualRight:r.right};
            }""")
            assert metrics["scrollWidth"] <= width + 1, (width,metrics)
            assert metrics["visualRight"] <= width + 1, (width,metrics)
            evidence["responsive"][f"{width}x{height}"] = metrics
        browser.close()
finally:
    server.shutdown()
    server.server_close()

(REPORT / "temporal-evidence.json").write_text(
    json.dumps(evidence, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)
print("R52_A3_SABIK_PRESENCE_TEMPORAL_EVIDENCE_PASS")
