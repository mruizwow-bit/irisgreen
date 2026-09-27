#!/usr/bin/env python3
"""R42-Design · prueba en navegador del sistema material sobre el build real (dist).

Recorre las 8 rutas piloto (ES/EN) en 1440×900, 390×844 y 320×800, en los modos
normal, reducido, opaco, «Más contraste», colores forzados y movimiento reducido.
Comprueba en el navegador real:
  - la preferencia llega a <html> y no pide datos ni red;
  - cabecera y barras: alpha calculado ≥ suelo del token y contraste real ≥ 4,5:1
    sobre el peor fondo (composición del color calculado sobre negro/blanco);
  - opaco/contraste/forzados: sin backdrop-filter en ningún elemento;
  - sin cristal sobre cristal y sin cristal dentro del área de trabajo;
  - «Más contraste» no aplica filtro a main (imágenes y pictogramas intactos);
  - cambiar la transparencia no recarga ni reinicia la herramienta;
  - sin desbordamiento horizontal;
Mide el contraste contra el FONDO EFECTIVO REAL de cada texto (cadena de ancestros
compuesta; botón opaco dentro de cristal = el botón), con regresión obligatoria.
Rincón: comprueba inspector, diálogos y sheet oscuros y opacos, con capturas.
Guarda capturas 1440×900 y 390×844 de normal/reducido/opaco en
reports/r42-materials/screens/ y el informe en reports/r42-materials/browser.json.
Las capturas sirven para revisión; no constituyen la aceptación (HUMAN QA de María).
"""
from __future__ import annotations

import functools
import json
import re
import threading
import traceback
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

from apply_r42_app_shell import PILOT

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
OUT = ROOT / "reports/r42-materials"
SHOTS = OUT / "screens"
SHOTS.mkdir(parents=True, exist_ok=True)

FLOORS = {"header": 0.86, "bar": 0.88, "dark": 0.80}
VIEWPORTS = {"1440x900": (1440, 900), "390x844": (390, 844), "320x800": (320, 800)}
MODES = ["normal", "reduced", "opaque"]


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


PROBE = r"""(floors) => {
  const parse = c => { const m = String(c).match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return {r:p[0], g:p[1], b:p[2], a:p.length > 3 ? p[3] : 1}; };
  const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
    return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b); };
  const ratio = (x, y) => { const a = lum(x), b = lum(y); return (Math.max(a, b) + .05) / (Math.min(a, b) + .05); };
  const over = (s, bk) => ({r:s.r * s.a + bk.r * (1 - s.a), g:s.g * s.a + bk.g * (1 - s.a), b:s.b * s.a + bk.b * (1 - s.a), a:1});
  const bf = el => { const s = getComputedStyle(el); return (s.backdropFilter || s.webkitBackdropFilter || 'none'); };
  const path = el => { const out = []; for (let n = el; n && n !== document.body && out.length < 6; n = n.parentElement)
    out.unshift(n.tagName.toLowerCase() + (n.id ? '#' + n.id : '') + (n.classList.length ? '.' + [...n.classList].slice(0, 2).join('.') : '')); return out.join(' > '); };
  /* Fondo efectivo real: se parte del propio elemento del texto y se sube por la cadena de
     ancestros apilando capas translúcidas hasta encontrar una opaca. Si antes se llega a un
     elemento sticky/fixed translúcido (chrome sobre contenido que se desplaza), lo que queda
     debajo es contenido arbitrario: se evalúan los dos extremos, negro y blanco. */
  const effective = el => {
    const layers = []; let base = null, openBelow = false;
    for (let n = el; n; n = n.parentElement) {
      const s = getComputedStyle(n), bg = parse(s.backgroundColor);
      if (bg && bg.a > 0) layers.push({node:path(n), rgba:[bg.r, bg.g, bg.b, bg.a]});
      if (bg && bg.a >= .999) { base = bg; break; }
      if ((s.position === 'sticky' || s.position === 'fixed') && bg && bg.a > 0) { openBelow = true; break; }
    }
    const backs = base ? [null] : [{r:0,g:0,b:0,a:1}, {r:255,g:255,b:255,a:1}];
    return backs.map(bk => { let acc = base || bk; const stack = base ? layers.slice(0, -1) : layers;
      for (let i = stack.length - 1; i >= 0; i--) { const [r, g, b, a] = stack[i].rgba; acc = over({r, g, b, a}, acc); }
      return {color:acc, layers, base:base ? 'opaque:' + layers[layers.length - 1].node : (openBelow ? 'scrolling-content(black|white)' : 'canvas(black|white)')}; });
  };
  const measure = (root, limit) => { const rows = [];
    const nodes = [...root.querySelectorAll('a,button,strong,span,h1,h2,p,label,summary,small,li')].filter(n => n.getClientRects().length && n.childNodes.length && [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim())).slice(0, limit);
    for (const n of nodes) { const fg = parse(getComputedStyle(n).color); if (!fg) continue;
      for (const e of effective(n)) rows.push({path:path(n), text:n.textContent.trim().slice(0, 40), fg:[fg.r, fg.g, fg.b], bg:[Math.round(e.color.r), Math.round(e.color.g), Math.round(e.color.b)], base:e.base, layers:e.layers, ratio:Math.round(ratio(fg, e.color) * 100) / 100}); }
    return rows; };

  /* Regresión obligatoria: texto en botón opaco dentro de barra de cristal → el fondo es el botón. */
  const fx = document.createElement('div'); fx.style.cssText = 'position:fixed;left:-9999px;top:0;background:rgba(255,255,255,.5)';
  const btn = document.createElement('button'); btn.style.cssText = 'background:#17395c;color:#fff'; btn.textContent = 'fixture';
  fx.appendChild(btn); document.body.appendChild(fx);
  const reg = effective(btn); const regRatio = ratio({r:255,g:255,b:255}, reg[0].color); fx.remove();

  const quiet = document.body.dataset.igR42Family === 'quiet';
  const out = {mode:document.documentElement.dataset.igTransparency, source:document.documentElement.dataset.igTransparencySource,
    forced:document.documentElement.dataset.igTransparencyForced, materials:document.body.dataset.igMaterials,
    overflow:Math.max(0, document.documentElement.scrollWidth - innerWidth), chrome:[], problems:[],
    regression:{base:reg[0].base, ratio:Math.round(regRatio * 100) / 100, expected:11.82}};
  if (reg.length !== 1 || Math.abs(regRatio - 11.82) > .05) out.problems.push('effective-background regression failed');
  const chrome = [['.hd', quiet ? 'dark' : 'header'], ['.jg-r41-browserbar', 'bar'], ['.jg-gamebar', 'bar'], ['.ig-r42-topbar', null], ['.ig-r42-context', null], ['.ig-r42-rail', null]];
  for (const [sel, key] of chrome) {
    const el = document.querySelector(sel); if (!el || !el.getClientRects().length) continue;
    const bg = parse(getComputedStyle(el).backgroundColor) || {a:0};
    const rows = measure(el, 40); const worst = rows.reduce((m, r) => Math.min(m, r.ratio), 99);
    out.chrome.push({sel, alpha:bg.a, floor:key ? floors[key] : null, backdrop:bf(el), worstText:worst, measurements:rows});
    if (key && bg.a > 0 && bg.a < .999 && bg.a + 1e-3 < floors[key]) out.problems.push(sel + ' alpha ' + bg.a + ' < floor ' + floors[key]);
    for (const r of rows) if (r.ratio < 4.5) out.problems.push(sel + ' text ' + r.ratio + ' at ' + r.path);
  }
  const glassy = [...document.querySelectorAll('body *')].filter(el => bf(el) !== 'none');
  for (const el of glassy) { let p = el.parentElement; while (p) { if (bf(p) !== 'none') { out.problems.push('glass-on-glass: ' + path(el)); break; } p = p.parentElement; } }
  for (const el of glassy) if (el.closest('.ig-r42-stage') && !el.matches('.jg-r41-browserbar,.jg-gamebar'))
    out.problems.push('glass inside workspace: ' + path(el));
  out.glassCount = glassy.length;
  out.mainFilter = getComputedStyle(document.querySelector('main')).filter;
  window.__igMeasure = measure; window.__igLum = c => lum(parse(c));
  return out;
}"""


def route(rel: str) -> str:
    return "/" + rel.removesuffix("index.html")


def main() -> None:
    server = ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=str(DIST)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}"
    report = {"cases": [], "failures": []}

    def case(row, fn):
        try:
            fn(row)
            row["passed"] = True
        except Exception as error:  # noqa: BLE001
            row.update(passed=False, error=str(error), traceback=traceback.format_exc())
            report["failures"].append(row)
        report["cases"].append(row)
        print(json.dumps({k: v for k, v in row.items() if k != "traceback"}, ensure_ascii=False), flush=True)

    with sync_playwright() as pw:
        browser = pw.chromium.launch()

        def context(size, mode=None, contrast=False, **extra):
            ctx = browser.new_context(viewport={"width": size[0], "height": size[1]}, **extra)
            ctx.route("**/*", lambda r: r.continue_() if r.request.url.startswith(base) else r.abort())
            prefs = {"version": 2, "scale": 1, "spacing": False, "controls": False, "contrast": contrast, "guide": False, "motion": False}
            if mode and mode != "normal":
                prefs["transparency"] = mode
            ctx.add_init_script("try{localStorage.setItem('ig-a11y'," + json.dumps(json.dumps(prefs)) + ")}catch(_){}")
            return ctx

        def load(page, rel):
            errors = []
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.goto(base + route(rel), wait_until="domcontentloaded")
            page.locator(".ig-r42-shell").wait_for(state="visible", timeout=20000)
            page.wait_for_timeout(400)
            return errors

        for rel, family in PILOT.items():
            for vname, size in VIEWPORTS.items():
                for mode in MODES:
                    row = {"route": route(rel), "family": family, "viewport": vname, "mode": mode}

                    def run(row, rel=rel, size=size, mode=mode, vname=vname):
                        ctx = context(size, mode)
                        page = ctx.new_page()
                        errors = load(page, rel)
                        probe = page.evaluate(PROBE, FLOORS)
                        row["probe"] = probe
                        assert probe["materials"] == "r42"
                        assert probe["mode"] == mode, probe["mode"]
                        assert probe["overflow"] <= 2, probe["overflow"]
                        if mode == "opaque":
                            assert probe["glassCount"] == 0, probe["glassCount"]
                        assert not probe["problems"], probe["problems"]
                        assert not errors, errors
                        if vname != "320x800":
                            page.screenshot(path=str(SHOTS / f"{family}-{rel.split('/')[0]}-{vname}-{mode}.png"))
                        ctx.close()

                    case(row, run)

        for rel, family in PILOT.items():
            row = {"route": route(rel), "scenario": "contrast + forced colors + reduced motion"}

            def extremes(row, rel=rel):
                ctx = context((1440, 900), None, contrast=True)
                page = ctx.new_page()
                load(page, rel)
                probe = page.evaluate(PROBE, FLOORS)
                assert probe["mainFilter"] == "none", probe["mainFilter"]
                assert probe["glassCount"] == 0, probe["glassCount"]
                ctx.close()
                ctx = context((390, 844), None, forced_colors="active", reduced_motion="reduce")
                page = ctx.new_page()
                load(page, rel)
                probe = page.evaluate(PROBE, FLOORS)
                assert probe["glassCount"] == 0, probe["glassCount"]
                assert probe["overflow"] <= 2
                ctx.close()

            case(row, extremes)

            row = {"route": route(rel), "scenario": "change transparency without reset"}

            def no_reset(row, rel=rel):
                ctx = context((1440, 900))
                page = ctx.new_page()
                load(page, rel)
                page.evaluate("window.__igAlive = document.querySelector('.ig-r42-stage').firstElementChild")
                page.locator("#a11yBtn").click()
                page.locator("[data-ig-transparency-choice='opaque']").click()
                assert page.evaluate("document.documentElement.dataset.igTransparency") == "opaque"
                assert page.evaluate("window.__igAlive === document.querySelector('.ig-r42-stage').firstElementChild")
                assert page.locator("[data-ig-transparency-choice='opaque']").get_attribute("aria-pressed") == "true"
                label = page.locator(".ig-transparency-title").inner_text()
                assert label == ("Transparency" if rel.startswith("en/") else "Transparencia"), label
                page.reload(wait_until="domcontentloaded")
                page.locator(".ig-r42-shell").wait_for(state="visible")
                assert page.evaluate("document.documentElement.dataset.igTransparencySource") == "user"
                ctx.close()

            case(row, no_reset)

        QUIET = [rel for rel, family in PILOT.items() if family == "quiet"]
        TEMP_CHROME = """(sel) => { const el = [...document.querySelectorAll(sel)].find(n => n.getClientRects().length);
          if (!el) return null; const bg = getComputedStyle(el).backgroundColor; const m = bg.match(/rgba?\\(([^)]+)\\)/);
          const p = m ? m[1].split(/[ ,/]+/).map(Number) : [255, 255, 255, 1];
          const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
          const L = .2126 * f(p[0]) + .7152 * f(p[1]) + .0722 * f(p[2]);
          const r = el.getBoundingClientRect();
          return {bg, luminance:Math.round(L * 1000) / 1000, alpha:p.length > 3 ? p[3] : 1, area:Math.round(r.width * r.height / (innerWidth * innerHeight) * 100),
                  texts:window.__igMeasure ? window.__igMeasure(el, 30) : []}; }"""
        for rel in QUIET:
            for vname in ("1440x900", "390x844"):
                for mode in MODES:
                    row = {"route": route(rel), "scenario": "Rincón temporary chrome is dark", "viewport": vname, "mode": mode}

                    def dark_chrome(row, rel=rel, vname=vname, mode=mode):
                        ctx = context(VIEWPORTS[vname], mode)
                        page = ctx.new_page()
                        load(page, rel)
                        page.evaluate(PROBE, FLOORS)
                        lang = rel.split("/")[0]
                        seen = {}
                        # Panel contextual / inspector (en móvil se abre como diálogo).
                        page.locator(".ig-r42-top-actions .ig-r42-action").nth(1).click()
                        page.wait_for_timeout(250)
                        seen["inspector"] = page.evaluate(TEMP_CHROME, ".ig-r42-inspector")
                        seen["inspector_dialog"] = page.evaluate(TEMP_CHROME, "dialog.ig-r42-dialog[open]")
                        page.screenshot(path=str(SHOTS / f"quiet-{lang}-{vname}-{mode}-inspector.png"))
                        page.keyboard.press("Escape")
                        if page.locator("dialog.ig-r42-dialog[open]").count():
                            page.keyboard.press("Escape")
                        # Ayuda (diálogo con el contenido de ayuda del Rincón).
                        page.locator(".ig-r42-top-actions .ig-r42-action").nth(2).click()
                        page.wait_for_timeout(250)
                        seen["help_dialog"] = page.evaluate(TEMP_CHROME, "dialog.ig-r42-dialog[open]")
                        page.screenshot(path=str(SHOTS / f"quiet-{lang}-{vname}-{mode}-help-dialog.png"))
                        page.keyboard.press("Escape")
                        assert page.locator("dialog.ig-r42-dialog[open]").count() == 0, "Escape must close the dialog"
                        # Acciones (paleta de comandos).
                        page.locator(".ig-r42-top-actions .ig-r42-action").nth(0).click()
                        page.wait_for_timeout(250)
                        seen["actions_dialog"] = page.evaluate(TEMP_CHROME, "dialog.ig-r42-dialog[open]")
                        page.keyboard.press("Escape")
                        # Sheet de ajustes en móvil.
                        if vname == "390x844" and page.locator(".r42-settings > summary").count():
                            page.locator(".r42-settings > summary").first.click()
                            page.wait_for_timeout(200)
                            seen["settings_sheet"] = page.evaluate(TEMP_CHROME, ".r42-settings[open]")
                            page.screenshot(path=str(SHOTS / f"quiet-{lang}-{vname}-{mode}-settings-sheet.png"))
                        row["seen"] = seen
                        for name, item in seen.items():
                            if not item:
                                continue
                            assert item["luminance"] <= 0.05, (name, item["bg"])
                            assert item["alpha"] >= 0.999, (name, item["bg"])
                            bad = [t for t in item["texts"] if t["ratio"] < 4.5]
                            assert not bad, (name, bad[:3])
                        assert seen.get("help_dialog"), "help dialog did not open"
                        ctx.close()

                    case(row, dark_chrome)

        row = {"scenario": "contrast forces opaque: Transparency control explains it"}

        def forced_note(row):
            rel = next(iter(PILOT))
            ctx = context((1440, 900), "normal", contrast=True)
            page = ctx.new_page()
            load(page, rel)
            page.locator("#a11yBtn").click()
            box = page.locator("[data-ig-transparency-settings]")
            assert box.get_attribute("data-ig-transparency-forced") == "contrast"
            note = page.locator("[data-ig-transparency-forced-note]")
            assert note.is_visible() and note.get_attribute("role") == "status"
            assert "contraste" in note.inner_text().lower() or "contrast" in note.inner_text().lower()
            assert page.evaluate("document.documentElement.dataset.igTransparency") == "normal"
            ctx.close()

        case(row, forced_note)

        browser.close()
    server.shutdown()
    report["summary"] = {"tested": len(report["cases"]), "failures": len(report["failures"])}
    (OUT / "browser.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if report["failures"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
