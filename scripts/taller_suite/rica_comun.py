# -*- coding: utf-8 -*-
"""Materia común de las escenas ricas del Taller (R65).

Las seis piloto de R54 se escribieron una a una, cada una resolviendo por su
cuenta la pared, la mesa, el grano del papel y la sombra de contacto. Para las 21
que faltan eso no escala: o se comparte la materia, o la calidad depende de con
cuánta paciencia se escribió cada fichero.

Aquí vive lo que se repite en un banco de trabajo, y **solo** eso:

* ruido determinista, para que nada quede clonado ni dependa del azar;
* la pared del taller con su luz de ventana;
* la tabla del banco, con veta en dos escalas, juntas, nudos y brillo especular;
* papel, metal, vidrio y plástico como capas finas sobre un color base;
* sombra proyectada, sombra de contacto y oclusión;
* el velo de profundidad que separa el fondo del primer plano;
* trazo de mano, con presión variable.

Lo que **no** vive aquí es la composición de ninguna escena. Cada estudio tiene
su propio fichero y su propia idea; esto es el material, no el cuadro. Dos
escenas que usen `banco()` no se parecen más entre sí de lo que se parecen dos
mesas de madera distintas.

Importante para el contrato R54-SYNC-01: **nada de esto lo usan las seis escenas
aprobadas**. Sus ficheros no se tocan, así que su `svg_sha256` no se mueve.
KEEP 6/6.
"""
from __future__ import annotations

import math

from taller_suite.escenas_ricas import C, W, H, lg, rg

k = C

# Dirección de la clave, la misma que fijaron las seis piloto: arriba izquierda.
LUZ = (-0.55, -0.8)


# ── ruido determinista ──────────────────────────────────────────────────────
def n(i, s=1.0):
    """Ruido en [0,1). Determinista: el mismo árbol da el mismo SVG byte a byte."""
    v = math.sin(i * 12.9898 + s * 78.233) * 43758.5453
    return round(v - math.floor(v), 4)


def r1(x):
    """Redondeo a una decimal. Menos bytes en el SVG y ningún cambio visible."""
    return round(float(x), 1)


def r2(x):
    return round(float(x), 2)


# ── definiciones reutilizables ──────────────────────────────────────────────
def defs_taller(p, *, pared=('#ddd6c9', '#a89d8d'), tabla=None, luz='#ffe6b8'):
    """Gradientes base de un banco de trabajo, con prefijo propio por escena.

    `p` es el prefijo de los identificadores. Cada escena usa el suyo para que
    dos escenas distintas no compartan un `id` dentro del mismo documento si
    algún día se compusieran juntas.
    """
    claro, oscuro = pared
    m = tabla or (k['madLL'], k['madL'], k['mad'], k['madS'])
    return (
        lg(f'{p}_pared', 0, 0, .45, 1,
           [(0, claro, None), (.55, claro, None), (1, oscuro, None)])
        + rg(f'{p}_luzvent', .16, .1, .95,
             [(0, luz, .85), (.35, luz, .38), (1, luz, 0)])
        + lg(f'{p}_cielo', 0, 0, 0, 1,
             [(0, '#a9d4ec', None), (.52, '#d6ebf6', None), (1, '#f2efdf', None)])
        + lg(f'{p}_lejos', 0, 0, 0, 1,
             [(0, '#a8c69a', None), (1, '#7ba874', None)])
        + lg(f'{p}_tabla', 0, 0, .18, 1,
             [(0, m[0], None), (.22, m[1], None), (.62, m[2], None), (1, m[3], None)])
        + lg(f'{p}_canto', 0, 0, 0, 1,
             [(0, m[1], None), (.4, m[2], None), (1, m[3], None)])
        + lg(f'{p}_especular', 0, 0, 1, 0,
             [(0, '#ffffff', 0), (.28, '#fff6e2', .3), (.52, '#ffeecb', .14),
              (1, '#ffffff', 0)])
        + lg(f'{p}_velo', 0, 0, 0, 1,
             [(0, '#b9c8d8', .42), (1, '#b9c8d8', 0)])
        + rg(f'{p}_vineta', .5, .46, .78,
             [(0, k['noche'], 0), (.62, k['noche'], 0), (1, k['noche'], .3)])
    )


def defs_papel(p, base=None):
    """Gradientes de una lámina de papel: el pliego nunca es un blanco plano."""
    b = base or (k['papL'], k['pap'], k['papS'])
    return (
        lg(f'{p}_pliego', .08, 0, .92, 1,
           [(0, b[0], None), (.34, b[1], None), (.78, b[1], None), (1, b[2], None)])
        + lg(f'{p}_canto', 0, 0, 0, 1, [(0, b[2], None), (1, '#b8b0a0', None)])
    )


def defs_metal(p, frio=True):
    """Metal: la clave es que el gradiente cambie de sentido, no que sea gris."""
    if frio:
        paradas = [(0, '#f4f8fb', None), (.18, '#c3cdd8', None), (.42, '#8d9aa8', None),
                   (.55, '#e6edf3', None), (.74, '#7f8c9b', None), (1, '#4d5764', None)]
    else:
        paradas = [(0, '#fff2d4', None), (.2, '#e3c489', None), (.46, '#b28f4e', None),
                   (.58, '#f5dfae', None), (.78, '#9a7a3f', None), (1, '#5d4824', None)]
    return lg(f'{p}_metal', 0, 0, 1, .35, paradas)


def defs_vidrio(p):
    return (
        lg(f'{p}_vidrio', 0, 0, .8, 1,
           [(0, '#ffffff', .5), (.28, '#dcecf6', .22), (.6, '#9fc0d4', .12),
            (1, '#ffffff', .3)])
        + lg(f'{p}_reflejo', 0, 0, 1, 1,
             [(0, '#ffffff', .6), (.5, '#ffffff', .1), (1, '#ffffff', 0)])
    )


# ── pared y luz ─────────────────────────────────────────────────────────────
def pared(p, alto, *, ventana=True, vx=54, vy=16, vw=150, vh=112):
    """Fondo de taller: yeso moteado, manchas de tono y la ventana desenfocada.

    El yeso no es un relleno: lleva moteado fino y manchas grandes de tono no
    lineales, que es lo que evita que la pared se lea como un rectángulo de
    color. La ventana va desenfocada de verdad —es el fondo— y es de donde entra
    la única clave de luz de la escena.
    """
    out = [f'<rect width="{W}" height="{alto}" fill="url(#{p}_pared)"/>']
    # manchas grandes de tono: la pared de un taller nunca es uniforme
    for i in range(11):
        cx = 30 + n(i, 2.1) * (W - 60)
        cy = 10 + n(i, 5.3) * (alto - 20)
        rx = 40 + n(i, 7.7) * 90
        out.append(f'<ellipse cx="{r1(cx)}" cy="{r1(cy)}" rx="{r1(rx)}" '
                   f'ry="{r1(rx * (.42 + n(i, 9.1) * .4))}" '
                   f'fill="{"#ffffff" if i % 2 else k["nubeS"]}" '
                   f'opacity="{r2(.04 + n(i, 3.3) * .05)}" filter="url(#b22)"/>')
    if ventana:
        out.append(
            # halo de la luz que rebasa el marco
            f'<rect x="{r1(vx - 22)}" y="{r1(vy - 16)}" width="{r1(vw + 44)}" '
            f'height="{r1(vh + 36)}" rx="18" fill="#fffdf4" opacity=".38" '
            f'filter="url(#b22)"/>'
            f'<g filter="url(#b5)" opacity=".96">'
            # la vista: cielo, sol velado y una franja de verde lejano, todo
            # desenfocado porque está fuera y lejos
            f'<rect x="{vx}" y="{vy}" width="{vw}" height="{vh}" rx="3" '
            f'fill="url(#{p}_cielo)"/>'
            f'<circle cx="{r1(vx + vw * .26)}" cy="{r1(vy + vh * .3)}" '
            f'r="{r1(vh * .2)}" fill="#fff7d8" opacity=".9"/>'
            f'<path d="M{vx} {r1(vy + vh * .74)} q{r1(vw * .22)} {r1(-vh * .1)} '
            f'{r1(vw * .44)} {r1(vh * .02)} q{r1(vw * .26)} {r1(vh * .08)} '
            f'{r1(vw * .56)} {r1(-vh * .04)} V{r1(vy + vh)} H{vx} Z" '
            f'fill="url(#{p}_lejos)" opacity=".9"/>'
            f'</g>'
            # el marco, ya nítido: es lo que hace que se lea como ventana
            f'<g opacity=".8">'
            f'<rect x="{r1(vx + vw * .48)}" y="{vy}" width="6" height="{vh}" fill="#aab6c2"/>'
            f'<rect x="{vx}" y="{r1(vy + vh * .5)}" width="{vw}" height="5" fill="#aab6c2"/>'
            f'<rect x="{r1(vx - 4)}" y="{r1(vy - 4)}" width="{r1(vw + 8)}" '
            f'height="{r1(vh + 8)}" rx="2" fill="none" stroke="#98a4b0" stroke-width="5"/>'
            f'<rect x="{r1(vx - 4)}" y="{r1(vy - 4)}" width="{r1(vw + 8)}" height="3" '
            f'fill="#ffffff" opacity=".5"/>'
            f'</g>'
            # alféizar con grosor y su sombra propia
            f'<rect x="{r1(vx - 9)}" y="{r1(vy + vh)}" width="{r1(vw + 18)}" height="7" '
            f'rx="2" fill="#dfe5ea"/>'
            f'<rect x="{r1(vx - 9)}" y="{r1(vy + vh + 5)}" width="{r1(vw + 18)}" height="4" '
            f'fill="#9aa4b0" opacity=".55" filter="url(#b2)"/>')
    # el derrame de luz de la ventana sobre la pared
    out.append(f'<rect width="{W}" height="{alto}" fill="url(#{p}_luzvent)"/>')
    # moteado del yeso
    out.append(f'<rect width="{W}" height="{alto}" filter="url(#grano)" opacity=".16"/>')
    return ''.join(out)


# ── el banco de trabajo ─────────────────────────────────────────────────────
def banco(p, y, *, canto=13, juntas=(), nudos=(), marcas=True, brillo=True):
    """La tabla del banco vista casi de frente: veta, juntas, nudos y uso.

    `y` es la línea donde empieza la tabla; ocupa desde ahí hasta abajo. La veta
    va en dos escalas —la fina del filtro `veta`, y unas pocas líneas largas
    dibujadas— porque solo con el filtro la madera se lee como papel pintado.
    """
    out = [f'<rect x="0" y="{r1(y)}" width="{W}" height="{r1(H - y)}" fill="url(#{p}_tabla)"/>',
           # canto delantero de la tabla, con su propia luz
           f'<rect x="0" y="{r1(y)}" width="{W}" height="{canto}" fill="url(#{p}_canto)"/>',
           # sombra que la tabla proyecta sobre la pared, justo detrás del canto
           f'<rect x="0" y="{r1(y - 9)}" width="{W}" height="11" fill="{k["noche"]}" '
           f'opacity=".26" filter="url(#b5)"/>']
    # veta larga dibujada: pocas líneas, muy tendidas, con deriva
    for i in range(22):
        yy = y + canto + 6 + n(i, 1.7) * (H - y - canto - 10)
        amp = 2 + n(i, 4.1) * 7
        out.append(
            f'<path d="M-10 {r1(yy)} C{r1(W * .28)} {r1(yy - amp)} {r1(W * .62)} '
            f'{r1(yy + amp)} {W + 10} {r1(yy + (n(i, 8.3) - .5) * 6)}" fill="none" '
            f'stroke="{k["madS"] if i % 3 else k["madLL"]}" '
            f'stroke-width="{r2(.5 + n(i, 6.1) * 1.5)}" '
            f'opacity="{r2(.1 + n(i, 2.9) * .17)}"/>')
    for jx in juntas:
        out.append(f'<rect x="{r1(jx)}" y="{r1(y + canto)}" width="2" height="{r1(H - y - canto)}" '
                   f'fill="{k["madS"]}" opacity=".5"/>'
                   f'<rect x="{r1(jx + 2)}" y="{r1(y + canto)}" width="1.6" '
                   f'height="{r1(H - y - canto)}" fill="{k["madLL"]}" opacity=".3"/>')
    for i, (nx, ny, nr) in enumerate(nudos):
        out.append(f'<ellipse cx="{nx}" cy="{ny}" rx="{nr}" ry="{r1(nr * .72)}" '
                   f'fill="{k["madS"]}" opacity=".5" filter="url(#b2)"/>'
                   f'<ellipse cx="{nx}" cy="{ny}" rx="{r1(nr * .5)}" ry="{r1(nr * .36)}" '
                   f'fill="#4e3418" opacity=".45"/>')
        for j in range(3):
            rr = nr * (1.5 + j * .7)
            out.append(f'<ellipse cx="{nx}" cy="{ny}" rx="{r1(rr)}" ry="{r1(rr * .5)}" '
                       f'fill="none" stroke="{k["madS"]}" stroke-width="{r2(.6 + j * .2)}" '
                       f'opacity="{r2(.22 - j * .05)}"/>')
    if marcas:
        # marcas de uso: cortes finos, no decorativos, agrupados donde se trabaja
        for i in range(16):
            x = 40 + n(i, 11.3) * (W - 80)
            yy = y + canto + 14 + n(i, 13.7) * (H - y - canto - 20)
            ln = 6 + n(i, 17.1) * 26
            out.append(f'<path d="M{r1(x)} {r1(yy)} l{r1(ln)} {r1((n(i, 19.3) - .5) * 4)}" '
                       f'stroke="{k["madS"]}" stroke-width="{r2(.5 + n(i, 23.1) * .6)}" '
                       f'opacity="{r2(.12 + n(i, 29.3) * .16)}" stroke-linecap="round"/>')
    # fibra fina del filtro, y el brillo especular que sigue la tabla
    out.append(f'<rect x="0" y="{r1(y)}" width="{W}" height="{r1(H - y)}" '
               f'filter="url(#veta)" opacity=".3"/>')
    if brillo:
        out.append(f'<rect x="0" y="{r1(y + canto)}" width="{W}" height="{r1(H - y - canto)}" '
                   f'fill="url(#{p}_especular)" opacity=".5"/>')
    return ''.join(out)


# ── sombras ─────────────────────────────────────────────────────────────────
def sombra(x, y, w, h, *, op=.3, blur='b5', rx=3, dx=8, dy=11, sesgo=-.24):
    """Sombra proyectada de un objeto apoyado: se aleja de la luz y se deforma."""
    return (f'<g transform="matrix(1,0,{sesgo},1,{r1(dx)},{r1(dy)})">'
            f'<rect x="{r1(x)}" y="{r1(y)}" width="{r1(w)}" height="{r1(h)}" rx="{rx}" '
            f'fill="{k["noche"]}" opacity="{op}" filter="url(#{blur})"/></g>')


def contacto(x, y, w, *, op=.42, alto=5):
    """Sombra de contacto: estrecha, oscura y pegada. Sin ella nada pesa."""
    return (f'<ellipse cx="{r1(x + w / 2)}" cy="{r1(y)}" rx="{r1(w * .52)}" ry="{alto}" '
            f'fill="{k["noche"]}" opacity="{op}" filter="url(#b2)"/>')


def oclusion(d, *, op=.3, blur='b5', color=None):
    """Oclusión ambiental sobre una forma: oscurece donde dos cosas se juntan."""
    return (f'<path d="{d}" fill="{color or k["noche"]}" opacity="{op}" '
            f'filter="url(#{blur})"/>')


# ── profundidad ─────────────────────────────────────────────────────────────
def velo(p, y, alto, *, op=.5):
    """Perspectiva atmosférica: el fondo pierde contraste, el frente lo gana."""
    return (f'<rect x="0" y="{r1(y)}" width="{W}" height="{r1(alto)}" '
            f'fill="url(#{p}_velo)" opacity="{op}"/>')


def vineta(p, op=.9):
    """Cierre de la escena. Muy suave: a 240 px una viñeta dura se ve sucia."""
    return f'<rect width="{W}" height="{H}" fill="url(#{p}_vineta)" opacity="{op}"/>'


# ── materiales de superficie ────────────────────────────────────────────────
def papel(p, d, *, fibra=True, grano_op=.2):
    """Una lámina: pliego con gradiente, fibra con dirección y grano."""
    out = [f'<path d="{d}" fill="url(#{p}_pliego)"/>']
    if fibra:
        out.append(f'<g clip-path="url(#{p}_cp_papel)">'
                   f'<rect width="{W}" height="{H}" filter="url(#fibra)" '
                   f'opacity="{grano_op}"/></g>')
    return ''.join(out)


def clip(id_, d):
    return f'<clipPath id="{id_}"><path d="{d}"/></clipPath>'


def clip_rect(id_, x, y, w, h, rx=0):
    return (f'<clipPath id="{id_}"><rect x="{r1(x)}" y="{r1(y)}" width="{r1(w)}" '
            f'height="{r1(h)}" rx="{rx}"/></clipPath>')


def brillo_borde(d, *, color='#ffffff', w=1.4, op=.45):
    """El canto que mira a la luz. Un objeto sin esto se queda plano."""
    return (f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{w}" '
            f'opacity="{op}" stroke-linecap="round"/>')


# ── trazo de mano ───────────────────────────────────────────────────────────
def trazo(d, color, *, w=2.0, op=1.0, s=1.0, halo=True):
    """Una línea trazada a mano: base difusa y encima la línea con presión."""
    out = []
    if halo:
        out.append(f'<path d="{d}" fill="none" stroke="{color}" '
                   f'stroke-width="{r2(w * 1.8)}" opacity="{r2(op * .3)}" '
                   f'filter="url(#b2)" stroke-linecap="round"/>')
    out.append(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{r2(w)}" '
               f'opacity="{op}" stroke-linecap="round" stroke-linejoin="round"/>')
    return ''.join(out)


def guia(d, color, *, w=1.0, op=.5, s=1.0):
    """Línea de construcción: discontinua e irregular, como una mina blanda."""
    return (f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{w}" '
            f'stroke-dasharray="{r1(6 + n(s, 3.1) * 12)} {r2(.6 + n(s, 5.7) * 1.6)}" '
            f'opacity="{op}" stroke-linecap="round"/>')


def tramado(cant, x0, y0, dx, dy, paso, color, *, w=1.1, o0=.25, o1=.6, s=1.0):
    """Sombreado a mano: densidad creciente y ningún trazo igual a otro."""
    out = []
    for i in range(cant):
        t = i / max(cant - 1, 1)
        a, b = n(i, s), n(i, s + 7.3)
        ex, ey = dx * (.85 + b * .3), dy * (.85 + a * .3)
        out.append(
            f'<path d="M{r1(x0 + i * paso + (a - .5) * paso * .4)} '
            f'{r1(y0 + (b - .5) * 3)} l{r1(ex)} {r1(ey)}" fill="none" stroke="{color}" '
            f'stroke-width="{r2(w * (.7 + a * .65))}" stroke-linecap="round" '
            f'stroke-dasharray="{r1(5 + b * 12)} {r2(.4 + a * 1.3)}" '
            f'opacity="{r2((o0 + (o1 - o0) * t) * (.75 + b * .45))}"/>')
    return ''.join(out)
