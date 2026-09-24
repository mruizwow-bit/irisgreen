#!/usr/bin/env python3
"""Mapas SVG de España con la zona de totalidad o de anularidad y las líneas de porcentaje de Sol tapado.
Tierra: Natural Earth 10m (dominio público). Zonas: rejillas calculadas con astronomy-engine (gen/eclipses.mjs)."""
import json, math
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

HERE = Path(__file__).resolve().parent.parent
NE = json.load(open(HERE / 'raw/ne_10m_admin_0_countries.geojson'))
LEFT = {'Cádiz', 'Ceuta', 'Santa Cruz de Tenerife'}
KEEP = {'ESP', 'PRT', 'FRA', 'AND', 'MAR', 'DZA', 'GIB', 'ITA'}

def simplify(pts, tol):
    """Douglas-Peucker."""
    if len(pts) < 4: return pts
    a, b = np.array(pts[0], float), np.array(pts[-1], float); P = np.array(pts, float)
    if np.allclose(a, b):                     # anillo cerrado: se parte por el punto más lejano
        i = int(np.argmax(np.hypot(*(P - a).T)))
        if i == 0: return pts
        return simplify(pts[:i + 1], tol)[:-1] + simplify(pts[i:], tol)
    ab = b - a
    d = np.abs(ab[0] * (P[:, 1] - a[1]) - ab[1] * (P[:, 0] - a[0])) / np.hypot(*ab)
    i = int(np.argmax(d))
    if d[i] > tol: return simplify(pts[:i + 1], tol)[:-1] + simplify(pts[i:], tol)
    return [pts[0], pts[-1]]

class Proj:
    def __init__(self, box, width):
        self.box = box; self.k = width / ((box[2] - box[0]) * math.cos(math.radians((box[1] + box[3]) / 2)))
        self.c = math.cos(math.radians((box[1] + box[3]) / 2))
        self.w = width; self.h = (box[3] - box[1]) * self.k
    def xy(self, lon, lat): return ((lon - self.box[0]) * self.c * self.k, (self.box[3] - lat) * self.k)

def land_paths(pr, tol):
    out = []
    b = pr.box
    for f in NE['features']:
        if f['properties'].get('ADM0_A3') not in KEEP: continue
        g = f['geometry']; polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
        d = ''
        for poly in polys:
            ring = poly[0]
            xs = [p[0] for p in ring]; ys = [p[1] for p in ring]
            if max(xs) < b[0] - 1 or min(xs) > b[2] + 1 or max(ys) < b[1] - 1 or min(ys) > b[3] + 1: continue
            r = simplify([tuple(p) for p in ring], tol)
            if len(r) < 3: continue
            d += 'M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in (pr.xy(*p) for p in r)) + 'Z'
        if d: out.append((f['properties']['ADM0_A3'], d))
    return out

def contour_paths(pr, cells, idx, levels):
    lats = sorted({c[0] for c in cells}); lons = sorted({c[1] for c in cells})
    Z = np.zeros((len(lats), len(lons))); li = {v: i for i, v in enumerate(lats)}; lo = {v: i for i, v in enumerate(lons)}
    for c in cells: Z[li[c[0]], lo[c[1]]] = c[idx]
    fig = plt.figure(); cs = plt.contour(lons, lats, Z, levels=levels); plt.close(fig)
    res = []
    for lev, segs in zip(cs.levels, cs.allsegs):
        d = ''
        for s in segs:
            if len(s) < 2: continue
            s = simplify([tuple(p) for p in s], 0.01)
            d += 'M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in (pr.xy(*p) for p in s))
        res.append((lev, d))
    return res

def signed(cells):
    """Campo continuo para el borde de la zona: dentro, duración al cuadrado (crece en línea recta desde el borde);
    fuera, lo que falta para llegar a la zona, escalado con la misma pendiente por celda."""
    idx = {(round(c[0], 2), round(c[1], 2)): c for c in cells}
    inside = [c for c in cells if c[2] > 0]
    if not inside: return [c[:2] + [-1] for c in cells]
    o_ref = min(c[3] for c in inside)
    lats = sorted({round(c[0], 2) for c in cells}); lons = sorted({round(c[1], 2) for c in cells})
    st = round(lats[1] - lats[0], 2)
    ratios = []
    for c in inside:
        la, lo = round(c[0], 2), round(c[1], 2)
        for dla, dlo in ((st, 0), (-st, 0), (0, st), (0, -st)):
            i2 = idx.get((round(la - dla, 2), round(lo - dlo, 2)))                 # segunda celda dentro
            o1 = idx.get((round(la + dla, 2), round(lo + dlo, 2)))                 # primera fuera
            o2 = idx.get((round(la + 2 * dla, 2), round(lo + 2 * dlo, 2)))         # segunda fuera
            if not (i2 and o1 and o2) or i2[2] == 0 or o1[2] > 0 or o2[2] > 0: continue
            si = i2[4] ** 2 - c[4] ** 2; so = o1[3] - o2[3]
            if si > 0 and so > 0: ratios.append(si / so)
    K = sorted(ratios)[len(ratios) // 2] if ratios else 1e6
    return [c[:2] + [c[4] ** 2 + 1e-6 if c[2] > 0 else -(o_ref - c[3]) * K - 1e-6] for c in cells]

def fill_path(pr, cells, idx, level):
    """Zona rellena (totalidad/anularidad) con contourf sobre el campo continuo."""
    cells = signed(cells); idx = 2; level = 0
    lats = sorted({c[0] for c in cells}); lons = sorted({c[1] for c in cells})
    Z = np.zeros((len(lats), len(lons))); li = {v: i for i, v in enumerate(lats)}; lo = {v: i for i, v in enumerate(lons)}
    for c in cells: Z[li[c[0]], lo[c[1]]] = c[idx]
    if Z.max() <= level: return ''
    fig = plt.figure(); cs = plt.contourf(lons, lats, Z, levels=[level, 1e6]); plt.close(fig)
    d = ''
    for path in cs.get_paths():
        for poly in path.to_polygons():
            if len(poly) < 3: continue
            d += 'M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in (pr.xy(*p) for p in poly)) + 'Z'
    return d

def eclipse_map(key, grids, cities, lang, kind_word, title):
    """Mapa de la península y Baleares con recuadro de Canarias."""
    pr = Proj([-9.9, 34.5, 4.5, 44.0], 720)
    pc = Proj([-18.3, 27.5, -13.3, 29.5], 250)
    ox, oy = pr.w - pc.w - 10, pr.h - pc.h - 10          # recuadro de Canarias abajo a la derecha
    parts = [f'<svg class="ec-map" viewBox="0 0 {pr.w:.0f} {pr.h:.0f}" role="img" aria-labelledby="ec-map-{key}-t"><title id="ec-map-{key}-t">{title}</title>',
             f'<rect width="{pr.w:.0f}" height="{pr.h:.0f}" class="ec-sea"/>']
    for a3, d in land_paths(pr, 0.03): parts.append(f'<path d="{d}" class="ec-land{" ec-es" if a3 == "ESP" else ""}"/>')
    g = grids['peninsula']
    z = fill_path(pr, g, 2, 0.5)
    if z: parts.append(f'<path d="{z}" class="ec-zone ec-zone-{kind_word}"/>')
    for lev, d in contour_paths(pr, g, 3, [0.7, 0.8, 0.9]):
        if d: parts.append(f'<path d="{d}" class="ec-iso"/>')
    durs = contour_paths(pr, g, 4, [60, 120, 180, 240]) if kind_word == 'total' else []
    durs = [x for x in durs if x[1]]
    for k_, (lev, d) in enumerate(durs):
        parts.append(f'<path d="{d}" class="ec-dur"/>')
        if 0 < k_ < len(durs) - 1: continue
        pts = [tuple(map(float, p.split(','))) for p in d.replace('M', 'L').split('L') if p] if d else []
        pts = [p for p in pts if 4 < p[0] < pr.w - 280 and 20 < p[1] < pr.h - 8]
        if pts:
            x, y = min(pts, key=lambda p: abs(p[0] - (14 if k_ == 0 else 380)))
            parts.append(f'<text x="{x + 2:.0f}" y="{y - 3:.0f}" class="ec-dur-t">{int(lev // 60)} min</text>')
    # etiquetas de las isolíneas: en su punto más al oeste dentro del mapa
    for lev, d in contour_paths(pr, g, 3, [0.7, 0.8, 0.9]):
        if not d: continue
        pts = [tuple(map(float, p.split(','))) for p in d.replace('M', 'L').split('L') if p]
        pts = [p for p in pts if 30 < p[0] < pr.w - 30 and 20 < p[1] < pr.h - 20]
        if pts:
            x, y = min(pts, key=lambda p: p[0] + abs(p[1] - pr.h * 0.45) * 0.4)
            parts.append(f'<text x="{x + 4:.0f}" y="{y - 4:.0f}" class="ec-iso-t">{int(lev * 100)} %</text>')
    # Canarias
    parts.append(f'<g transform="translate({ox},{oy})"><rect width="{pc.w:.0f}" height="{pc.h:.0f}" class="ec-sea ec-caja"/>')
    for a3, d in land_paths(pc, 0.01):
        if a3 == 'ESP': parts.append(f'<path d="{d}" class="ec-land ec-es"/>')
    gc = grids['canarias']; zc = fill_path(pc, gc, 2, 0.5)
    if zc: parts.append(f'<path d="{zc}" class="ec-zone ec-zone-{kind_word}"/>')
    parts.append('</g>')
    # ciudades
    for c in cities:
        if not c.get('map'): continue
        inset = c['lat'] < 30 and c['lon'] < -12
        x, y = (pc.xy(c['lon'], c['lat']) if inset else pr.xy(c['lon'], c['lat']))
        if inset: x += ox; y += oy
        left = c['n'] in LEFT; anc = ' text-anchor="end"' if left else ''
        parts.append(f'<g class="ec-city"><circle cx="{x:.1f}" cy="{y:.1f}" r="3"/><text x="{x - 5 if left else x + 5:.1f}" y="{y - 4:.1f}"{anc}>{c.get("label", c["n"])}</text></g>')
    parts.append('</svg>')
    return ''.join(parts), {'box': pr.box, 'w': pr.w, 'h': pr.h, 'inset': {'box': pc.box, 'x': ox, 'y': oy, 'w': pc.w, 'h': pc.h}}

if __name__ == '__main__':
    D = json.load(open(HERE / 'out/eclipses.json'))
    MAPC = {'Madrid', 'Barcelona', 'Sevilla', 'Valencia', 'Bilbao', 'A Coruña', 'Málaga', 'Cádiz', 'Palma', 'Zaragoza', 'Oviedo', 'Almería', 'Ceuta', 'Melilla', 'Las Palmas', 'Santa Cruz de Tenerife', 'Valladolid', 'Murcia', 'Badajoz', 'León', 'Tarifa'}
    for c in D['ciudades']: c['map'] = c['n'] in MAPC
    svg, meta = eclipse_map('2027', D['rejillas']['2027-08-02'], D['ciudades'], 'es', 'total', 'Eclipse de 2027')
    (HERE / 'out/map_test.svg').write_text(svg)
    print(len(svg), meta)
