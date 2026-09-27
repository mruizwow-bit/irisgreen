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
