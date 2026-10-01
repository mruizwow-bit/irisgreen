# -*- coding: utf-8 -*-
"""Escena rica de Diseño gráfico (R65 · tanda 1).

La mesa de montaje, no el cartel acabado.

Lo que se ve, de atrás a adelante:

* la pared del taller con la luz de la ventana entrando por arriba a la
  izquierda, que es la única clave de la escena;
* la tabla del banco, con su veta, sus juntas y sus marcas de uso;
* **el cartel a medio montar**, un pliego grande apoyado en la mesa: la retícula
  todavía a la vista, las guías de margen y de columna en azul de trazar, el
  titular ya colocado en bloques macizos, una columna de texto compuesta y la de
  al lado **vacía**, y el hueco de la imagen aún sin llenar, con su aspa;
* al pie del pliego, la barra de color de impresión con sus dianas de registro y
  las marcas de corte en las cuatro esquinas: esto es un original para imprenta,
  no una pantalla;
* a la derecha, **la prueba de imprenta** con su trama de semitono, y encima la
  lupa de tipógrafo con el vidrio abombado: dentro se ven los puntos de la trama
  ampliados, que es exactamente para lo que sirve;
* el abanico de muestras abierto, con una pastilla separada y apoyada sobre el
  cartel: la decisión de color que se está tomando ahora mismo;
* la regla de acero y el bisturí en primer plano, con su filo y su sombra.

Sin texto legible: lo que hay son bloques y líneas de composición, que es lo que
de verdad se ve en una mesa de montaje antes de que el texto esté escrito.
Nada de personajes, nada con cara, nada de marcas ajenas.
"""
from taller_suite.escenas_ricas import C, W, H, svg, lg, rg
from taller_suite import rica_comun as M

k = C
P = 'dg'

MESA = 138                      # donde la pared encuentra el banco

# El pliego, en trapecio: la mesa se ve en ligero escorzo.
PL = ((108, 152), (358, 149), (392, 386), (64, 390))
PLD = (f'M{PL[0][0]} {PL[0][1]} L{PL[1][0]} {PL[1][1]} '
       f'L{PL[2][0]} {PL[2][1]} L{PL[3][0]} {PL[3][1]} Z')

# Muestras del abanico: tonos propios, nada de sistemas de color ajenos.
ABANICO = ['#c9463c', '#e0703a', '#e6a93c', '#6ea844', '#2f8f86',
           '#2c6ea8', '#4a4a9c', '#8b4a8f', '#b5536f']


def _x_en(y, izq=True):
    """Borde izquierdo o derecho del pliego a una altura dada (interpolación)."""
    if izq:
        (x0, y0), (x1, y1) = PL[0], PL[3]
    else:
        (x0, y0), (x1, y1) = PL[1], PL[2]
    t = (y - y0) / (y1 - y0)
    return x0 + (x1 - x0) * t


def _reticula():
    """La retícula de maquetación: márgenes, columnas y línea base."""
    g = []
    azul = '#4f8fd0'
    # línea base, todo el pliego, muy tenue
    yy = 176
    i = 0
    while yy < 372:
        g.append(f'<path d="M{M.r1(_x_en(yy) + 9)} {M.r1(yy)} '
                 f'L{M.r1(_x_en(yy, False) - 9)} {M.r1(yy - 1)}" stroke="{azul}" '
                 f'stroke-width=".6" opacity=".2"/>')
        yy += 8.5
        i += 1
    # márgenes
    for t, op in ((0.055, .55), (0.945, .55)):
        y0, y1 = 158, 380
        x0 = _x_en(y0) + (_x_en(y0, False) - _x_en(y0)) * t
        x1 = _x_en(y1) + (_x_en(y1, False) - _x_en(y1)) * t
        g.append(M.guia(f'M{M.r1(x0)} {y0} L{M.r1(x1)} {y1}', azul, w=.9, op=op, s=t))
    for y0, y1 in ((162, 162), (374, 374)):
        g.append(M.guia(f'M{M.r1(_x_en(y0) + 12)} {y0} '
                        f'L{M.r1(_x_en(y0, False) - 12)} {M.r1(y0 - 1)}', azul,
                        w=.9, op=.5, s=y0))
    # dos guías de columna: el pliego va a tres columnas
    for t in (0.36, 0.655):
        x0 = _x_en(166) + (_x_en(166, False) - _x_en(166)) * t
        x1 = _x_en(372) + (_x_en(372, False) - _x_en(372)) * t
        g.append(M.guia(f'M{M.r1(x0)} 166 L{M.r1(x1)} 372', '#e06a9a', w=.9, op=.5, s=t * 9))
    return ''.join(g)


def _titular():
    """El titular, ya colocado: bloques macizos, no letras."""
    g = []
    y = 176
    for anchos, alto, op in (((92, 58, 34), 13, .92), ((74, 46), 13, .92), ((110, 26), 9, .6)):
        x = _x_en(y) + 22
        for a in anchos:
            g.append(f'<rect x="{M.r1(x)}" y="{M.r1(y)}" width="{a}" height="{alto}" '
                     f'rx="1.5" fill="{k["tinta"]}" opacity="{op}"/>')
            x += a + 9
        y += alto + 7
    return ''.join(g)


def _columna(x0, y0, lineas, ancho, *, op=.55, s=1.0):
    """Texto compuesto: renglones de largo desigual, como un párrafo real."""
    g = []
    for i in range(lineas):
        a = ancho * (.72 + M.n(i, s) * .28)
        if i and i % 7 == 6:
            a = ancho * (.32 + M.n(i, s + 2) * .3)      # final de párrafo
        g.append(f'<rect x="{M.r1(x0 + (0 if i % 7 else 6))}" y="{M.r1(y0 + i * 6.4)}" '
                 f'width="{M.r1(a)}" height="2.6" rx="1.3" fill="{k["grafito"]}" '
                 f'opacity="{M.r2(op * (.82 + M.n(i, s + 5) * .3))}"/>')
    return ''.join(g)


def _hueco_imagen():
    """El hueco de la imagen, todavía vacío: aspa y marco fino. Esto es lo que dice
    que el cartel está a medias."""
    x, y, w, h = 246, 232, 118, 86
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#dfe6ec" opacity=".55"/>'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="none" '
            f'stroke="{k["grafito"]}" stroke-width="1.1" opacity=".55"/>'
            + M.guia(f'M{x} {y} L{x + w} {y + h}', k['grafito'], w=.9, op=.42, s=3)
            + M.guia(f'M{x + w} {y} L{x} {y + h}', k['grafito'], w=.9, op=.42, s=7)
            + f'<rect x="{x}" y="{y}" width="{w}" height="10" fill="{k["noche"]}" '
              f'opacity=".1" filter="url(#b2)"/>')


def _registro(cx, cy, r=9):
    """Diana de registro: cruz larga y dos anillos. Marca de imprenta, no adorno."""
    return (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{k["tinta"]}" '
            f'stroke-width="1" opacity=".8"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{M.r1(r * .5)}" fill="none" '
            f'stroke="{k["tinta"]}" stroke-width="1" opacity=".8"/>'
            f'<path d="M{cx - r - 6} {cy} H{cx + r + 6} M{cx} {cy - r - 6} V{cy + r + 6}" '
            f'stroke="{k["tinta"]}" stroke-width=".9" opacity=".8"/>')


def _barra_color():
    """La barra de control de color al pie del original."""
    g = []
    x = 104
    for i, c in enumerate(['#1b1b1b', '#00a0c6', '#d9317a', '#f2c200',
                           '#6a6a6a', '#b9b9b9', '#e4e4e4']):
        g.append(f'<rect x="{M.r1(x)}" y="358" width="18" height="13" fill="{c}"/>'
                 f'<rect x="{M.r1(x)}" y="358" width="18" height="4" fill="#ffffff" '
                 f'opacity=".16"/>')
        x += 19
    return ''.join(g)


def _corte():
    """Marcas de corte en las cuatro esquinas del pliego."""
    g = []
    for (cx, cy), (sx, sy) in zip(PL, ((1, 1), (-1, 1), (-1, -1), (1, -1))):
        g.append(f'<path d="M{M.r1(cx + sx * 8)} {M.r1(cy + sy * 2)} '
                 f'h{M.r1(sx * 17)} M{M.r1(cx + sx * 2)} {M.r1(cy + sy * 8)} '
                 f'v{M.r1(sy * 17)}" stroke="{k["grafito"]}" stroke-width=".9" '
                 f'opacity=".7"/>')
    return ''.join(g)


def _tono(u, v):
    """Tono de la imagen que lleva la prueba: una esfera iluminada sobre su suelo.

    Se calcula, no se dibuja a ojo, y el mismo cálculo sirve para la trama de la
    hoja y para lo que se ve aumentado dentro de la lupa. Por eso la lupa
    coincide con lo que hay debajo: es la misma imagen, con el punto más grande.

    `u`,`v` van de -1 a 1 sobre el área de imagen. Devuelve 0 (papel) a 1 (negro).
    """
    # fondo: degradado de estudio, claro, para que la esfera destaque
    tono = 0.52 - 0.20 * (v + 1) * .5
    # el suelo
    if v > 0.30:
        tono = 0.24 + (v - 0.30) * 0.30
        # sombra proyectada de la esfera, alargada hacia la derecha
        d = ((u - 0.30) / 0.80) ** 2 + ((v - 0.66) / 0.24) ** 2
        if d < 1:
            tono += 0.55 * (1 - d) ** .55
    # la esfera
    nx, ny = u / 0.74, (v + 0.06) / 0.68
    d = (nx * nx + ny * ny) ** .5
    if d < 1.0:
        nz = max(0.0, 1 - d * d) ** .5
        difusa = max(0.0, nx * -0.52 + ny * -0.66 + nz * 0.54)
        tono = 0.90 - 0.84 * (difusa ** .85)
        if v > 0.05:                       # rebote cálido del suelo por abajo
            tono -= 0.20 * (v - 0.05)
        if d > 0.88:                       # el borde se cierra
            tono += (d - 0.88) * 2.2
        # el brillo especular: casi papel blanco
        e = ((nx + 0.42) ** 2 + (ny + 0.46) ** 2) ** .5
        if e < 0.30:
            tono *= (e / 0.30) ** .7
    return min(1.0, max(0.0, tono))


#: área de imagen de la prueba, dentro de sus márgenes
IMG = (410, 258, 152, 100)


def _prueba():
    """La prueba de imprenta: papel con márgenes y, dentro, la imagen tramada."""
    x, y, w, h = 396, 246, 178, 122
    g = [M.sombra(x, y, w, h, op=.3, dx=7, dy=10),
         f'<g transform="rotate(-4 485 307)">',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="1.5" '
         f'fill="url(#{P}_pliego)"/>',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="1.5" fill="none" '
         f'stroke="#b8b0a0" stroke-width=".8" opacity=".8"/>']
    ix, iy, iw, ih = IMG
    paso = 4.2
    filas, cols = int(ih / paso), int(iw / paso)
    for fy in range(filas + 1):
        for fx in range(cols + 1):
            cx = ix + fx * paso
            cy = iy + fy * paso
            u = (fx / cols) * 2 - 1
            v = (fy / filas) * 2 - 1
            t = _tono(u, v)
            if t <= .03:
                continue
            r = 0.16 + 2.18 * (t ** 1.05) * (0.9 + M.n(fx * 3 + fy, 1.3) * 0.2)
            g.append(f'<circle cx="{M.r1(cx)}" cy="{M.r1(cy)}" r="{M.r2(r)}" '
                     f'fill="{k["tinta"]}" opacity=".86"/>')
    # dianas de registro y filete del área de imagen
    g.append(f'<rect x="{ix - 3}" y="{iy - 3}" width="{iw + 6}" height="{ih + 6}" '
             f'fill="none" stroke="{k["grafito"]}" stroke-width=".6" opacity=".35"/>')
    g.append(_registro(x + 10, y + 10, 6))
    g.append(_registro(x + w - 10, y + h - 10, 6))
    g.append('</g>')
    return ''.join(g)


def _lupa():
    """La lupa de tipógrafo apoyada en la prueba.

    Dentro no hay un adorno: está **la misma imagen**, con el mismo cálculo de
    tono, tramada con un punto mucho mayor. Por eso lo que se ve por el vidrio
    encaja con lo que hay debajo, que es justo lo que hace una lupa.
    """
    cx, cy, r = 528, 320, 36
    ix, iy, iw, ih = IMG
    g = [M.sombra(cx - r, cy - r + 12, r * 2, r * 2, op=.34, blur='b5', rx=36, dx=10, dy=13)]
    # el faldón cónico va primero: queda detrás del vidrio
    g.append(f'<path d="M{cx - r + 4} {cy + 6} L{cx - r - 6} {cy + 52} '
             f'L{cx + r + 6} {cy + 52} L{cx + r - 4} {cy + 6} Z" '
             f'fill="url(#{P}_metal)" opacity=".95"/>')
    g.append(f'<path d="M{cx - r - 6} {cy + 52} L{cx + r + 6} {cy + 52}" '
             f'stroke="{k["noche"]}" stroke-width="2" opacity=".3"/>')
    g.append(M.contacto(cx - r - 6, cy + 52, (r + 6) * 2, op=.4, alto=6))
    g.append(f'<g clip-path="url(#{P}_cp_lupa)">')
    g.append(f'<rect x="{cx - r}" y="{cy - r}" width="{r * 2}" height="{r * 2}" '
             f'fill="#fcf9f1"/>')
    # aumento 3,4x alrededor del punto de la imagen que queda bajo el vidrio
    aum = 2.8
    paso = 4.2 * aum
    pasos = int(r * 2 / paso) + 2
    for fy in range(pasos):
        for fx in range(pasos):
            px = cx - r + fx * paso
            py = cy - r + fy * paso
            # de coordenadas de pantalla a coordenadas de la imagen
            u = ((px - cx) / aum + cx - ix) / iw * 2 - 1
            v = ((py - cy) / aum + cy - iy) / ih * 2 - 1
            t = _tono(u, v)
            if t <= .03:
                continue
            rr = 0.6 + 7.3 * (t ** 1.05)
            g.append(f'<circle cx="{M.r1(px)}" cy="{M.r1(py)}" r="{M.r2(rr)}" '
                     f'fill="{k["tinta"]}" opacity=".9"/>')
    # la curvatura del vidrio: un velo muy leve y el reflejo de la ventana
    g.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#{P}_vidrio)" opacity=".45"/>')
    g.append(f'<ellipse cx="{cx - 13}" cy="{cy - 16}" rx="21" ry="12" fill="#ffffff" '
             f'opacity=".5" filter="url(#b5)" transform="rotate(-28 {cx - 13} {cy - 16})"/>')
    g.append('</g>')
    # el aro, con espesor
    g.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="url(#{P}_metal)" '
             f'stroke-width="7"/>')
    g.append(f'<circle cx="{cx}" cy="{cy}" r="{r + 3.5}" fill="none" stroke="{k["noche"]}" '
             f'stroke-width="1" opacity=".35"/>')
    g.append(M.brillo_borde(f'M{cx - 26} {cy - 24} A{r} {r} 0 0 1 {cx + 4} {cy - r - 1}',
                            w=2.2, op=.65))
    return ''.join(g)


def _abanico():
    """El abanico de muestras, abierto sobre la mesa."""
    cx, cy = 592, 214
    g = [M.contacto(cx - 70, cy + 8, 140, op=.34, alto=7)]
    for i, c in enumerate(ABANICO):
        a = -128 + i * 9.6
        g.append(f'<g transform="rotate({M.r1(a)} {cx} {cy})">'
                 f'<rect x="{cx - 9}" y="{cy - 88}" width="19" height="90" rx="2.5" '
                 f'fill="{c}"/>'
                 f'<rect x="{cx - 9}" y="{cy - 88}" width="19" height="90" rx="2.5" '
                 f'fill="url(#{P}_chipluz)"/>'
                 f'<rect x="{cx - 9}" y="{cy - 16}" width="19" height="14" '
                 f'fill="#ffffff" opacity=".85"/>'
                 f'<rect x="{cx - 5}" y="{cy - 12}" width="11" height="1.8" rx=".9" '
                 f'fill="{k["grafito"]}" opacity=".5"/>'
                 f'</g>')
    # el remache que las sujeta
    g.append(f'<circle cx="{cx}" cy="{cy}" r="6" fill="url(#{P}_metal)"/>'
             f'<circle cx="{cx}" cy="{cy}" r="2.2" fill="{k["noche"]}" opacity=".45"/>')
    return ''.join(g)


def _pastilla_suelta():
    """Una muestra separada del abanico y apoyada sobre el cartel: la decisión."""
    x, y = 166, 300
    return (M.sombra(x, y, 46, 22, op=.3, dx=5, dy=7, rx=2)
            + f'<g transform="rotate(-9 {x + 23} {y + 11})">'
            f'<rect x="{x}" y="{y}" width="46" height="22" rx="2" fill="#2f8f86"/>'
            f'<rect x="{x}" y="{y}" width="46" height="22" rx="2" fill="url(#{P}_chipluz)"/>'
            f'<rect x="{x}" y="{y + 15}" width="46" height="7" fill="#ffffff" opacity=".85"/>'
            + M.brillo_borde(f'M{x + 1} {y + 2} h44', w=1, op=.4)
            + '</g>')


def _regla_bisturi():
    """Regla de acero y bisturí en primer plano: el filo, no el icono."""
    g = [f'<g transform="rotate(-8 300 372)">',
         M.sombra(96, 366, 330, 15, op=.3, dx=6, dy=9, rx=1),
         f'<rect x="96" y="366" width="330" height="15" rx="1.5" fill="url(#{P}_metal)"/>',
         f'<rect x="96" y="366" width="330" height="4" fill="#ffffff" opacity=".4"/>']
    for i in range(34):
        x = 104 + i * 9.4
        largo = 9 if i % 5 == 0 else 5
        g.append(f'<path d="M{M.r1(x)} 381 V{M.r1(381 - largo)}" stroke="{k["tinta"]}" '
                 f'stroke-width=".8" opacity=".72"/>')
    g.append('</g>')
    # bisturí, cruzando, con el filo iluminado
    g.append('<g transform="rotate(16 470 368)">')
    g.append(M.sombra(396, 358, 150, 12, op=.3, dx=6, dy=9, rx=3))
    g.append(f'<rect x="396" y="358" width="112" height="12" rx="3" '
             f'fill="url(#{P}_metal)"/>')
    for i in range(11):
        g.append(f'<rect x="{M.r1(404 + i * 8)}" y="359" width="2.6" height="10" rx="1.3" '
                 f'fill="{k["noche"]}" opacity=".22"/>')
    g.append(f'<path d="M508 360 L556 363 L556 367 L508 370 Z" fill="url(#{P}_metal)"/>')
    g.append(M.brillo_borde('M509 361 L555 363.8', w=1.6, op=.9))
    g.append('</g>')
    return ''.join(g)


def _lapiz():
    """El lápiz azul de trazar, apoyado donde se acaba de marcar una guía."""
    return ('<g transform="rotate(-24 150 344)">'
            + M.sombra(80, 338, 128, 11, op=.28, dx=5, dy=8, rx=5)
            + f'<rect x="80" y="338" width="112" height="11" rx="5" fill="#2c6ea8"/>'
            + f'<rect x="80" y="338" width="112" height="3.4" rx="1.7" fill="#5f9ed0" '
              f'opacity=".8"/>'
            + f'<path d="M192 338 L216 342.5 L216 344.5 L192 349 Z" fill="{k["madL"]}"/>'
            + f'<path d="M210 341.4 L222 343.2 L210 345.8 Z" fill="#1c4f80"/>'
            + '</g>')


def escena():
    defs = (
        M.defs_taller(P, pared=('#ded7ca', '#a79b8b'),
                      tabla=('#cfae80', '#b08a58', '#8a653c', '#5c4227'))
        + M.defs_papel(P)
        + M.defs_metal(P)
        + M.defs_vidrio(P)
        + lg(f'{P}_chipluz', 0, 0, .7, 1,
             [(0, '#ffffff', .3), (.45, '#ffffff', .06), (1, k['noche'], .18)])
        + rg(f'{P}_focosuelo', .5, .5, .5,
             [(0, '#fff3d8', .5), (1, '#fff3d8', 0)])
        + M.clip(f'{P}_cp_papel', PLD)
        + f'<clipPath id="{P}_cp_lupa"><circle cx="528" cy="320" r="36"/></clipPath>'
    )

    c = M.pared(P, MESA + 6, vx=46, vy=10, vw=172, vh=116)
    c += M.banco(P, MESA, juntas=(214, 468), nudos=((300, 246, 9), (556, 186, 7)))
    # el charco de luz de la ventana caído sobre la mesa
    c += (f'<ellipse cx="196" cy="236" rx="230" ry="132" fill="url(#{P}_focosuelo)" '
          f'opacity=".55" filter="url(#b22)"/>')

    # ── el cartel a medio montar ─────────────────────────────────────────────
    c += M.sombra(64, 150, 328, 238, op=.34, dx=11, dy=14, rx=2)
    c += M.papel(P, PLD)
    c += f'<path d="{PLD}" fill="none" stroke="#b5ac9b" stroke-width="1.1" opacity=".85"/>'
    # el pliego ondula: una luz larga y una sombra larga sobre el papel
    c += (f'<path d="M132 152 C150 232 140 312 118 388" fill="none" stroke="#ffffff" '
          f'stroke-width="16" opacity=".3" filter="url(#b12)"/>'
          f'<path d="M318 150 C332 230 344 310 362 386" fill="none" stroke="{k["nubeS"]}" '
          f'stroke-width="20" opacity=".22" filter="url(#b12)"/>')
    c += _reticula()
    c += _titular()
    c += _columna(120, 232, 18, 96, op=.6, s=1.7)
    # la segunda columna está vacía: es lo que falta por componer
    c += (f'<rect x="228" y="232" width="8" height="2.6" rx="1.3" fill="{k["grafito"]}" '
          f'opacity=".35"/>')
    c += _hueco_imagen()
    c += _barra_color()
    c += _corte()
    c += _pastilla_suelta()
    # una anotación a mano en el margen, y su flecha al hueco de la imagen
    c += M.trazo('M74 250 q16 -8 30 -2', '#c9463c', w=1.6, op=.8, halo=False)
    c += M.trazo('M74 258 q22 -6 40 0', '#c9463c', w=1.6, op=.8, halo=False)
    c += M.trazo('M118 254 q56 -14 122 -18 l-11 -5 m11 5 l-9 8', '#c9463c',
                 w=1.5, op=.75, halo=False)

    # ── prueba, lupa y abanico ───────────────────────────────────────────────
    c += _abanico()
    c += _prueba()
    c += _lupa()

    # ── primer plano ─────────────────────────────────────────────────────────
    c += _lapiz()
    c += _regla_bisturi()

    # ── cierre: profundidad y viñeta ─────────────────────────────────────────
    c += M.velo(P, MESA - 4, 58, op=.4)
    c += M.vineta(P, .85)
    return svg(c, defs)
