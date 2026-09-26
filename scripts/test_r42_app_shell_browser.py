#!/usr/bin/env python3
"""Browser QA for the R42 A3 app-shell pilot.

This verifies product-level conditions that static contracts cannot:
- the R42 shell actually mounts in Chromium;
- workspace is visible in the first viewport;
- no page-level horizontal overflow at 1440, 390 or 320 CSS px;
- mobile uses the bottom dock model;
- dialogs/actions return focus;
- the Drawing pilot moves challenges/properties out of the canvas path;
- ES/EN pairs mount the same shell model.

It is not HUMAN QA and does not certify WCAG conformance.
"""
from __future__ import annotations

import functools
import json
import threading
import traceback
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path.cwd()
OUT = ROOT / "reports" / "r42-a3-browser"
SHOTS = OUT / "screenshots"
OUT.mkdir(parents=True, exist_ok=True)
SHOTS.mkdir(parents=True, exist_ok=True)

ROUTES = [
    ("workshop-es", "/es/taller/dibujo/", "workshop", "es"),
    ("workshop-en", "/en/workshop/drawing/", "workshop", "en"),
    ("games-es", "/es/recursos/juegos/", "games", "es"),
    ("games-en", "/en/resources/games/", "games", "en"),
    ("interests-es", "/es/intereses/", "interests", "es"),
    ("interests-en", "/en/interests/", "interests", "en"),
    ("quiet-es", "/es/sitio-tranquilo/", "quiet", "es"),
    ("quiet-en", "/en/quiet-space/", "quiet", "en"),
]

VIEWPORTS = [
    ("desktop", 1440, 900),
    ("mobile", 390, 844),
    ("reflow", 320, 800),
]

JS_METRICS = """() => {
  const shell = document.querySelector('.ig-r42-shell');
  const workspace = document.querySelector('.ig-r42-workspace');
  const stage = document.querySelector('.ig-r42-stage');
  const rail = document.querySelector('.ig-r42-rail');
  const inspector = document.querySelector('.ig-r42-inspector');
  const title = document.querySelector('.ig-r42-title');
  const docWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
  function rect(el) {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      x:r.x, y:r.y, width:r.width, height:r.height,
      right:r.right, bottom:r.bottom,
      display:cs.display, visibility:cs.visibility,
      position:cs.position
    };
  }
  return {
    mount:document.body.dataset.igR42Mount,
    family:document.body.dataset.igR42Family,
    pilot:document.body.dataset.igR42Pilot,
    lang:document.documentElement.lang,
    innerWidth,
    innerHeight,
    docWidth,
    overflow:Math.max(0, docWidth-innerWidth),
    shell:rect(shell),
    workspace:rect(workspace),
    stage:rect(stage),
    rail:rect(rail),
    inspector:rect(inspector),
    context:rect(document.querySelector('.ig-r42-context')),
    title:title ? title.textContent.trim() : '',
    h1Count:Array.from(document.querySelectorAll('main h1')).filter(el => {
      const cs=getComputedStyle(el), r=el.getBoundingClientRect();
      return cs.display!=='none' && cs.visibility!=='hidden' && r.width>0 && r.height>0;
    }).length
  };
}"""

JS_WORKSHOP = """() => {
  const app=document.querySelector('#igt-app');
  const retos=document.querySelector('.igt-retos');
  const side=document.querySelector('.igt-side');
  const inspector=document.querySelector('.ig-r42-inspector-body');
  const canvas=app && app.querySelector('canvas.igt-draw');
  const file=document.querySelector('#ig-r42-file-menu');
  const trigger=document.querySelector('.ig-r42-file-trigger');
  const oldTop=app && app.querySelector('.igt-topbar');
  return {
    adapted:app && app.dataset.igR42Adapted,
    retosInInspector:!!(retos && inspector && inspector.contains(retos)),
    sideInInspector:!!(side && inspector && inspector.contains(side)),
    canvas:!!canvas,
    fileButtons:file ? file.querySelectorAll('button').length : 0,
    fileTrigger:!!trigger,
    oldTopHidden:!!(oldTop && (oldTop.hidden || getComputedStyle(oldTop).display==='none')),
    canvasTop:canvas ? canvas.getBoundingClientRect().top : null
  };
}"""

JS_MOBILE = """() => {
  const shell=document.querySelector('.ig-r42-shell');
  const rail=document.querySelector('.ig-r42-rail');
  const inspector=document.querySelector('.ig-r42-inspector');
  const sr=shell.getBoundingClientRect(), rr=rail.getBoundingClientRect();
  return {
    railDirection:getComputedStyle(rail).flexDirection,
    railTop:rr.top,
    railBottom:rr.bottom,
    shellBottom:sr.bottom,
    inspectorDisplay:getComputedStyle(inspector).display,
    buttons:rail.querySelectorAll('button').length
  };
}"""


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


server = ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
BASE = f"http://127.0.0.1:{server.server_port}"

report = {
    "head_scope": "R42 A3 pilot",
    "routes": [route for _, route, _, _ in ROUTES],
    "viewports": VIEWPORTS,
    "cases": [],
    "failures": [],
    "limits": [
        "Automated Chromium QA is not HUMAN QA.",
        "No screen-reader, braille, voice-control or physical-device certification.",
        "No claim of complete WCAG/EN/ISO conformance.",
    ],
}


def record(row, fn):
    try:
        fn()
        row["passed"] = True
    except Exception as exc:
        row["passed"] = False
        row["error"] = str(exc)
        row["traceback"] = traceback.format_exc()
        report["failures"].append(dict(row))
    report["cases"].append(row)
    print(json.dumps(row, ensure_ascii=False), flush=True)


with sync_playwright() as pw:
    browser = pw.chromium.launch()

    for vp_name, width, height in VIEWPORTS:
        for route_name, route, family, expected_lang in ROUTES:
            context = browser.new_context(
                viewport={"width": width, "height": height},
                reduced_motion="reduce",
            )
            context.route("**/*", lambda req: req.continue_() if req.request.url.startswith(BASE) else req.abort())
            page = context.new_page()
            errors = []
            page.on("pageerror", lambda err, bucket=errors: bucket.append(str(err)))
            row = {
                "scenario": "shell",
                "viewport": vp_name,
                "width": width,
                "height": height,
                "route": route,
                "family": family,
                "lang": expected_lang,
            }

            def check_shell():
                page.goto(BASE + route, wait_until="domcontentloaded")
                page.locator('.ig-r42-shell').wait_for(state="visible", timeout=20000)
                page.wait_for_function("document.body.dataset.igR42Mount === 'ready'", timeout=20000)
                page.wait_for_timeout(450)

                metrics = page.evaluate(JS_METRICS)
                row["metrics"] = metrics
                assert metrics["mount"] == "ready", metrics
                assert metrics["pilot"] == "true", metrics
                assert metrics["family"] == family, metrics
                assert str(metrics["lang"]).lower().startswith(expected_lang), metrics
                assert metrics["overflow"] <= 2, metrics
                assert metrics["h1Count"] == 1, metrics

                shell = metrics["shell"]
                workspace = metrics["workspace"]
                stage = metrics["stage"]
                assert shell and shell["width"] > 0 and shell["height"] > 0, metrics
                assert workspace and workspace["width"] > 0 and workspace["height"] >= 250, metrics
                assert stage and stage["width"] > 0 and stage["height"] >= 200, metrics

                # R42 gate: workspace is discoverable in the first viewport.
                assert workspace["y"] < height - 120, {
                    "reason": "workspace-buried-below-first-viewport",
                    **metrics,
                }
                assert stage["y"] < height - 90, {
                    "reason": "stage-buried-below-first-viewport",
                    **metrics,
                }

                if vp_name == "desktop":
                    assert workspace["width"] >= min(600, width * 0.48), metrics
                    desktop_ui = page.evaluate(JS_MOBILE)
                    row["desktop"] = desktop_ui
                    assert desktop_ui["railDirection"] == "column", desktop_ui
                    if family == "workshop":
                        assert metrics["inspector"]["display"] != "none", metrics
                    else:
                        assert metrics["inspector"]["display"] == "none", metrics
                    if family == "quiet":
                        assert metrics["context"] and metrics["context"]["height"] <= 90, metrics
                else:
                    mobile = page.evaluate(JS_MOBILE)
                    row["mobile"] = mobile
                    assert mobile["railDirection"] == "row", mobile
                    assert mobile["buttons"] >= 3, mobile
                    assert mobile["inspectorDisplay"] == "none", mobile
                    assert workspace["width"] >= width * 0.72, metrics
                    assert stage["width"] >= width * 0.65, metrics

                if family == "workshop":
                    page.wait_for_function(
                        "document.querySelector('#igt-app') && document.querySelector('#igt-app').dataset.igR42Adapted === 'true'",
                        timeout=20000,
                    )
                    page.wait_for_timeout(120)
                    workshop = page.evaluate(JS_WORKSHOP)
                    row["workshop"] = workshop
                    assert workshop["adapted"] == "true", workshop
                    assert workshop["retosInInspector"], workshop
                    assert workshop["sideInInspector"], workshop
                    assert workshop["canvas"], workshop
                    assert workshop["fileTrigger"], workshop
                    assert workshop["fileButtons"] >= 3, workshop
                    assert workshop["oldTopHidden"], workshop
                    assert workshop["canvasTop"] is not None and workshop["canvasTop"] < height - 60, workshop

                assert not errors, errors

                page.screenshot(
                    path=str(SHOTS / f"{route_name}-{vp_name}.png"),
                    full_page=False,
                )

            record(row, check_shell)
            context.close()

    # Interaction/focus contract once per language.
    for route_name, route, family, expected_lang in [
        ("workshop-es", "/es/taller/dibujo/", "workshop", "es"),
        ("workshop-en", "/en/workshop/drawing/", "workshop", "en"),
    ]:
        context = browser.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
        context.route("**/*", lambda req: req.continue_() if req.request.url.startswith(BASE) else req.abort())
        page = context.new_page()
        row = {"scenario": "focus-actions", "route": route, "lang": expected_lang}

        def check_focus_actions():
            page.goto(BASE + route, wait_until="domcontentloaded")
            page.locator('.ig-r42-shell').wait_for(state="visible", timeout=20000)
            page.wait_for_function("document.querySelector('#igt-app') && document.querySelector('#igt-app').dataset.igR42Adapted === 'true'", timeout=20000)

            action = page.locator('.ig-r42-top-actions .ig-r42-action').first
            action.focus()
            assert page.evaluate("document.activeElement === document.querySelector('.ig-r42-top-actions .ig-r42-action')")

            action.click()
            dialog = page.locator('dialog.ig-r42-dialog').filter(has=page.locator('.ig-r42-command-search'))
            dialog.wait_for(state="visible")
            search = dialog.locator('input[type="search"]')
            search.wait_for(state="visible")
            search.fill("help" if expected_lang == "en" else "ayuda")
            assert dialog.locator('.ig-r42-command-list button').count() >= 1
            page.keyboard.press("Escape")
            page.wait_for_timeout(80)
            assert not dialog.evaluate("el => el.open")

            # Native dialog close restores focus to the trigger.
            active = page.evaluate("""() => ({
              cls:String(document.activeElement.className||''),
              text:(document.activeElement.textContent||'').trim()
            })""")
            row["focusAfterClose"] = active
            assert "ig-r42-action" in active["cls"], active

            # APG toolbar: one tab stop and arrow movement.
            rail = page.locator('.ig-r42-rail')
            buttons = rail.locator('button')
            assert buttons.count() >= 3
            first = buttons.nth(0)
            first.focus()
            page.keyboard.press("ArrowRight")
            assert page.evaluate("document.activeElement === document.querySelectorAll('.ig-r42-rail button')[1]")
            tabs = page.eval_on_selector_all('.ig-r42-rail button', "els => els.map(e => e.tabIndex)")
            row["railTabIndex"] = tabs
            assert tabs.count(0) == 1, tabs

        record(row, check_focus_actions)
        context.close()

    browser.close()

server.shutdown()

report["summary"] = {
    "cases": len(report["cases"]),
    "passed": sum(1 for case in report["cases"] if case.get("passed")),
    "failures": len(report["failures"]),
    "screenshots": len(list(SHOTS.glob("*.png"))),
}
report["passed"] = not report["failures"]
(OUT / "results.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps(report["summary"], ensure_ascii=False))
if report["failures"]:
    raise SystemExit(1)
