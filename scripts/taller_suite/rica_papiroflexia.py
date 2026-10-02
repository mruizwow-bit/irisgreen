# -*- coding: utf-8 -*-
"""Escena rica de Papiroflexia y poliedros (R65 · tanda 4).

La mesa de plegado: el papel con sus marcas, la pieza a medio doblar y el sólido
ya armado.

Lo que se ve:

* la **hoja con el patrón de pliegues** desplegada: montes en línea continua y
  valles a trazos, que es la convención de verdad y no un adorno; las diagonales
  de referencia y las marcas del plegado ya hecho, con el papel **rehundido**
  donde se ha doblado y vuelto a abrir;
* una **esquina ya levantada**: la solapa fuera del plano, con su cara vista,
  su cara en sombra y la sombra que proyecta sobre la propia hoja. Eso es lo que
  dice que la escena es de papel doblado y no un dibujo de líneas;
* el **icosaedro armado**, calculado de verdad: veinte caras, las de atrás
  descartadas y cada una de las visibles sombreada según hacia dónde mira. No es
  un dibujo de un poliedro, es un poliedro proyectado;
* el **desarrollo** del sólido en otra hoja, con sus veinte triángulos en tira,
  las pestañas de pegado y la línea de corte, ya recortado a medias;
* la plegadera de hueso, el punzón y la regla;
* el taco de papeles de colores, con los cantos desalineados y el de arriba ya
  levantado por una esquina;
* los recortes de las pestañas sobrantes.

Nada de figuras con cara: se pliega geometría.
"""
import math

from taller_suite.escenas_ricas import C, W, H, svg, lg, rg
from taller_suite import rica_comun as M

k = C
P = 'pf'

MESA = 128

PAPEL_A = '#e8734f'      # cara vista del papel
PAPEL_B = '#f6f1e4'      # reverso
LUZ3D = (-0.42, -0.72, 0.55)


# ── el icosaedro, calculado ────────────────────────────────────────────────
def _icosaedro():
    """Vértices y caras de un icosaedro regular."""
    phi = (1 + 5 ** .5) / 2
    v = []
    for s1 in (-1, 1):
        for s2 in (-1, 1):
            v.append((0, s1 * 1, s2 * phi))
            v.append((s1 * 1, s2 * phi, 0))
            v.append((s1 * phi, 0, s2 * 1))
    # aristas por distancia mínima: así las caras salen solas y sin tablas
    d2 = min((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2
             for i, a in enumerate(v) for j, b in enumerate(v) if i < j)
    ady = {i: {j for j, b in enumerate(v)
               if i != j and abs(sum((v[i][t] - b[t]) ** 2 for t in range(3)) - d2) < 1e-6}
           for i in range(len(v))}
    caras = set()
    for i in range(len(v)):
        for j in ady[i]:
            for l in ady[i] & ady[j]:
                caras.add(tuple(sorted((i, j, l))))
    return v, sorted(caras)


def _rot(p, ax, ay):
    x, y, z = p
    x, z = x * math.cos(ay) + z * math.sin(ay), -x * math.sin(ay) + z * math.cos(ay)
    y, z = y * math.cos(ax) - z * math.sin(ax), y * math.sin(ax) + z * math.cos(ax)
    return x, y, z


def _solido(cx, cy, r):
    """El icosaedro proyectado: caras traseras descartadas y sombreado real."""
    v, caras = _icosaedro()
    ax, ay = math.radians(-24), math.radians(28)
    pv = [_rot(p, ax, ay) for p in v]
    esc = r / (( (1 + ((1 + 5 ** .5) / 2) ** 2) ) ** .5)
    g = [f'<ellipse cx="{M.r1(cx + 8)}" cy="{M.r1(cy + r * .96)}" '
         f'rx="{M.r1(r * 1.05)}" ry="{M.r1(r * .3)}" fill="{k["noche"]}" '
         f'opacity=".34" filter="url(#b5)"/>']
    visibles = []
    for a, b, c in caras:
        pa, pb, pc = pv[a], pv[b], pv[c]
        ux, uy, uz = (pb[0] - pa[0], pb[1] - pa[1], pb[2] - pa[2])
        wx, wy, wz = (pc[0] - pa[0], pc[1] - pa[1], pc[2] - pa[2])
        nx, ny, nz = (uy * wz - uz * wy, uz * wx - ux * wz, ux * wy - uy * wx)
        ln = (nx * nx + ny * ny + nz * nz) ** .5 or 1
        nx, ny, nz = nx / ln, ny / ln, nz / ln
        # la cara mira al espectador si su normal apunta hacia +z
        centro_z = (pa[2] + pb[2] + pc[2]) / 3
        if nz * (1 if centro_z >= 0 else 1) < 0:
            nx, ny, nz = -nx, -ny, -nz
        if nz <= .02:
            continue
        dif = max(0.0, nx * LUZ3D[0] + ny * LUZ3D[1] + nz * LUZ3D[2])
        visibles.append((centro_z, (pa, pb, pc), dif))
    visibles.sort(key=lambda t: t[0])
    for _, (pa, pb, pc), dif in visibles:
        pts = ' '.join(f'{M.r1(cx + p[0] * esc)},{M.r1(cy - p[1] * esc)}'
                       for p in (pa, pb, pc))
        # el tono sale de la iluminación, no de una paleta elegida a ojo
        t = .24 + dif * .76
        col = _mezcla('#5a2f1c', '#ffd9b0', t)
        g.append(f'<polygon points="{pts}" fill="{col}"/>')
        g.append(f'<polygon points="{pts}" fill="none" stroke="#7a3f22" '
                 f'stroke-width=".9" opacity=".55"/>')
    return ''.join(g)


def _mezcla(c0, c1, t):
    a = [int(c0[i:i + 2], 16) for i in (1, 3, 5)]
    b = [int(c1[i:i + 2], 16) for i in (1, 3, 5)]
    return '#' + ''.join(f'{int(a[i] + (b[i] - a[i]) * t):02x}' for i in range(3))


# ── la hoja con el patrón de pliegues ──────────────────────────────────────
HX, HY, HL = 44, 178, 214          # esquina y lado de la hoja cuadrada


def _hoja_pliegues():
    """La hoja desplegada con montes, valles y una esquina ya levantada."""
    g = [M.sombra(HX, HY, HL, HL, op=.3, dx=9, dy=12, rx=2)]
    d = (f'M{HX} {HY + 8} L{HX + HL - 6} {HY} L{HX + HL} {HY + HL - 8} '
         f'L{HX + 6} {HY + HL} Z')
    g.append(f'<path d="{d}" fill="{PAPEL_A}"/>')
    g.append(f'<path d="{d}" fill="none" stroke="#a8462a" stroke-width="1" '
             f'opacity=".5"/>')
    g.append(f'<g clip-path="url(#{P}_cp_hoja)">')
    # la fibra del papel
    g.append(f'<rect x="{HX}" y="{HY}" width="{HL}" height="{HL}" filter="url(#fibra)" '
             f'opacity=".18"/>')

    def pt(u, v):
        return (M.r1(HX + 3 + u * (HL - 6) + v * 3),
                M.r1(HY + 4 + v * (HL - 8) - u * 6))

    # las dos diagonales y las medianas: montes en continua
    montes = [((0, 0), (1, 1)), ((1, 0), (0, 1)), ((.5, 0), (.5, 1)), ((0, .5), (1, .5))]
    for i, (a, b) in enumerate(montes):
        pa, pb = pt(*a), pt(*b)
        # el rehundido del papel: una línea clara y otra oscura pegadas
        g.append(f'<path d="M{pa[0]} {pa[1]} L{pb[0]} {pb[1]}" stroke="#ffffff" '
                 f'stroke-width="2.6" opacity=".3" transform="translate(-1 -1.2)"/>')
        g.append(f'<path d="M{pa[0]} {pa[1]} L{pb[0]} {pb[1]}" stroke="#8f3a20" '
                 f'stroke-width="1.6" opacity=".7"/>')
    # los valles, a trazos: la convención de verdad
    valles = [((.25, 0), (0, .25)), ((.75, 0), (1, .25)), ((0, .75), (.25, 1)),
              ((1, .75), (.75, 1)), ((.25, .5), (.5, .25)), ((.5, .75), (.75, .5)),
              ((.25, .5), (.5, .75)), ((.5, .25), (.75, .5))]
    for i, (a, b) in enumerate(valles):
        pa, pb = pt(*a), pt(*b)
        g.append(f'<path d="M{pa[0]} {pa[1]} L{pb[0]} {pb[1]}" stroke="#ffffff" '
                 f'stroke-width="2.2" opacity=".26" transform="translate(-1 -1.2)" '
                 f'stroke-dasharray="9 5"/>')
        g.append(f'<path d="M{pa[0]} {pa[1]} L{pb[0]} {pb[1]}" stroke="#8f3a20" '
                 f'stroke-width="1.4" opacity=".62" stroke-dasharray="9 5"/>')
    g.append('</g>')

    # la esquina ya levantada: fuera del plano, con su sombra sobre la hoja
    a = pt(1, 0)
    b = pt(.5, 0)
    c = pt(1, .5)
    # la sombra que arroja la solapa
    g.append(f'<path d="M{b[0]} {b[1]} L{c[0]} {c[1]} L{M.r1(a[0] - 26)} '
             f'{M.r1(a[1] + 20)} Z" fill="{k["noche"]}" opacity=".3" '
             f'filter="url(#b5)"/>')
    # la solapa, doblada hacia el espectador: se ve el reverso
    apx, apy = a[0] - 44, a[1] + 34
    g.append(f'<path d="M{b[0]} {b[1]} L{M.r1(apx)} {M.r1(apy)} L{c[0]} {c[1]} Z" '
             f'fill="{PAPEL_B}"/>')
    g.append(f'<path d="M{b[0]} {b[1]} L{M.r1(apx)} {M.r1(apy)} L{c[0]} {c[1]} Z" '
             f'fill="none" stroke="#c9c0ac" stroke-width="1" opacity=".8"/>')
    # la arista del doblez, con su filo de luz
    g.append(f'<path d="M{b[0]} {b[1]} L{c[0]} {c[1]}" stroke="#ffffff" '
             f'stroke-width="2.2" opacity=".55"/>')
    # el canto del papel: el papel tiene grosor
    g.append(f'<path d="M{M.r1(apx)} {M.r1(apy)} L{c[0]} {c[1]}" stroke="#d6cdb8" '
             f'stroke-width="2.6" opacity=".9"/>')
    return ''.join(g)


def _desarrollo():
    """El desarrollo del sólido: veinte triángulos en tira, con pestañas."""
    x, y, w, h = 268, 148, 232, 158
    g = [M.sombra(x, y, w, h, op=.28, dx=7, dy=10, rx=2),
         f'<g transform="rotate(-4 {x + w / 2} {y + h / 2})">',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="1.5" '
         f'fill="url(#{P}_pliego)"/>',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="1.5" fill="none" '
         f'stroke="#b5ac9b" stroke-width=".8" opacity=".8"/>']
    lado = 21.4
    alt = lado * (3 ** .5) / 2
    for fila in range(2):
        y0 = y + 42 + fila * (alt + 26)
        for i in range(10):
            arriba = i % 2 == 0
            x0 = x + 18 + i * lado / 2
            if arriba:
                pts = [(x0, y0 + alt), (x0 + lado, y0 + alt), (x0 + lado / 2, y0)]
            else:
                pts = [(x0, y0), (x0 + lado, y0), (x0 + lado / 2, y0 + alt)]
            d = 'M' + ' L'.join(f'{M.r1(px)} {M.r1(py)}' for px, py in pts) + ' Z'
            # los triángulos ya recortados de la primera fila van con el canto
            recortado = fila == 0 and i < 5
            g.append(f'<path d="{d}" fill="{"#f7f2e4" if recortado else "none"}" '
                     f'stroke="{k["grafito"]}" stroke-width="1" opacity=".7"/>')
            # las líneas de plegado interiores, a trazos
            g.append(f'<path d="M{M.r1(pts[0][0])} {M.r1(pts[0][1])} '
                     f'L{M.r1(pts[1][0])} {M.r1(pts[1][1])}" stroke="{k["grafito"]}" '
                     f'stroke-width=".8" opacity=".4" stroke-dasharray="4 3"/>')
        # las pestañas de pegado del borde superior
        for i in range(0, 10, 2):
            x0 = x + 18 + i * lado / 2
            g.append(f'<path d="M{M.r1(x0 + 2)} {M.r1(y0 + alt)} '
                     f'l{M.r1(lado - 4)} 0 l-4 9 l{M.r1(-lado + 12)} 0 Z" '
                     f'fill="none" stroke="{k["grafito"]}" stroke-width=".8" '
                     f'opacity=".45" stroke-dasharray="3 3"/>')
    # la línea de corte ya seguida a medias
    g.append(f'<path d="M{x + 16} {y + 34} H{x + 128}" stroke="#c8322c" '
             f'stroke-width="1.6" opacity=".7"/>')
    g.append(f'<path d="M{x + 128} {y + 34} H{x + 216}" stroke="#c8322c" '
             f'stroke-width="1.4" opacity=".35" stroke-dasharray="5 4"/>')
    g.append('</g>')
    return ''.join(g)


def _plegadera():
    """La plegadera de hueso: lisa, con el filo romo y el brillo del hueso."""
    return ('<g transform="rotate(-22 210 372)">'
            + M.sombra(140, 364, 152, 18, op=.28, dx=5, dy=8, rx=8, blur='b2')
            + f'<path d="M142 372 q6 -10 26 -10 h96 q18 0 18 10 q0 10 -18 10 h-96 '
              f'q-20 0 -26 -10 Z" fill="url(#{P}_hueso)"/>'
            + f'<path d="M150 366 q10 -4 22 -4 h92" fill="none" stroke="#ffffff" '
              f'stroke-width="2.4" opacity=".6"/>'
            + f'<path d="M142 372 q6 10 26 10 h96" fill="none" stroke="{k["noche"]}" '
              f'stroke-width="1.6" opacity=".18"/>'
            + '</g>')


def _taco():
    """El taco de papeles de colores, con los cantos desalineados."""
    g = [M.contacto(474, 398, 130, op=.4, alto=7)]
    colores = ['#3f8dd0', '#4fae6b', '#f0c93c', '#e8734f', '#b073c9', '#f6f1e4']
    for i, col in enumerate(reversed(colores)):
        dx = M.r1((M.n(i, 3.1) - .5) * 9)
        dy = M.r1(394 - i * 4.6)
        g.append(f'<g transform="rotate({M.r1((M.n(i, 5.7) - .5) * 5)} 534 {dy})">'
                 f'<rect x="{M.r1(474 + dx)}" y="{M.r1(dy - 64)}" width="120" '
                 f'height="66" rx="1.5" fill="{col}"/>'
                 f'<rect x="{M.r1(474 + dx)}" y="{M.r1(dy - 64)}" width="120" '
                 f'height="4" fill="#ffffff" opacity=".3"/>'
                 f'<rect x="{M.r1(474 + dx)}" y="{M.r1(dy - 3)}" width="120" '
                 f'height="3" fill="{k["noche"]}" opacity=".2"/></g>')
    # el de arriba, ya levantado por una esquina
    g.append(f'<path d="M480 332 L600 328 L588 340 q-40 10 -108 4 Z" fill="#3f8dd0"/>')
    g.append(f'<path d="M588 340 q-40 10 -108 4 l-2 -6 q52 8 104 -4 Z" '
             f'fill="#7fb7e2" opacity=".9"/>')
    return ''.join(g)


def _recortes():
    """Los recortes de las pestañas que han ido sobrando."""
    g = []
    for i in range(6):
        x = 236 + M.n(i, 3.1) * 150
        y = 366 + M.n(i, 7.7) * 28
        g.append(f'<path d="M{M.r1(x)} {M.r1(y)} l{M.r1(12 + M.n(i, 5.3) * 14)} '
                 f'{M.r1(-2 - M.n(i, 9.1) * 4)} l-2 6 l{M.r1(-12 - M.n(i, 5.3) * 14)} '
                 f'{M.r1(2 + M.n(i, 9.1) * 3)} Z" fill="#f2ecdd" '
                 f'transform="rotate({M.r1(M.n(i, 2.7) * 180)} {M.r1(x)} {M.r1(y)})" '
                 f'opacity=".92"/>')
    return ''.join(g)


def _punzon():
    return ('<g transform="rotate(12 344 340)">'
            + M.sombra(286, 334, 122, 12, op=.24, dx=4, dy=6, rx=6, blur='b2')
            + f'<rect x="308" y="334" width="96" height="12" rx="6" fill="#7b4a2c"/>'
            + f'<rect x="308" y="335" width="96" height="3.4" rx="1.7" '
              f'fill="#b9714f" opacity=".8"/>'
            + f'<rect x="298" y="336" width="14" height="8" rx="2" '
              f'fill="url(#{P}_metal)"/>'
            + f'<path d="M286 340 l14 -3 v6 Z" fill="#c3cbd3"/>'
            + '</g>')


def escena():
    defs = (
        M.defs_taller(P, tabla=('#b99a72', '#96774b', '#705431', '#48331c'))
        + M.defs_papel(P)
        + M.defs_metal(P)
        + lg(f'{P}_hueso', 0, 0, .3, 1,
             [(0, '#fdfaf0', None), (.35, '#eee5d2', None), (1, '#c9bda2', None)])
        + rg(f'{P}_focosuelo', .5, .5, .5, [(0, '#fff0cf', .46), (1, '#fff0cf', 0)])
        + M.clip(f'{P}_cp_hoja',
                 f'M{HX} {HY + 8} L{HX + HL - 6} {HY} L{HX + HL} {HY + HL - 8} '
                 f'L{HX + 6} {HY + HL} Z')
    )

    c = M.pared(P, MESA + 6, vx=222, vy=6, vw=136, vh=96)
    c += M.banco(P, MESA, juntas=(414,), nudos=((388, 340, 8),))
    c += (f'<ellipse cx="220" cy="220" rx="240" ry="140" fill="url(#{P}_focosuelo)" '
          f'opacity=".46" filter="url(#b22)"/>')

    c += _desarrollo()
    c += _hoja_pliegues()
    c += _taco()
    c += _solido(534, 214, 68)
    c += _recortes()
    c += _punzon()
    c += _plegadera()

    c += M.velo(P, MESA - 6, 46, op=.28)
    c += M.vineta(P, .85)
    return svg(c, defs)
