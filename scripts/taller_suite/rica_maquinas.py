# -*- coding: utf-8 -*-
"""Escena rica de Máquinas e inventos (R65 · tanda 4).

El mecanismo montado sobre su bastidor, a medio terminar y **funcionando**.

Lo que se ve:

* el bastidor de madera taladrada, con sus agujeros y sus tornillos, montado
  sobre la mesa;
* **el tren de engranajes**: tres ruedas dentadas de latón cuyos dientes
  **engranan de verdad** —el diente de una cae en el hueco de la siguiente,
  porque el paso está calculado, no dibujado a ojo—, cada una con su eje, su
  arandela y su sombra;
* la **manivela** en la rueda grande, con el puño de madera gastado;
* la rueda pequeña arrastra un **piñón y una cremallera**, y la cremallera ya ha
  avanzado: se ve el tramo recorrido y el que le queda;
* la **polea** con su cuerda pasando por la garganta, y el peso colgando a media
  altura: no está en el suelo ni arriba del todo, está subiendo;
* la **rampa** con la bola a mitad de bajada y la marca de por dónde ha pasado;
* un engranaje **todavía sin montar**, apoyado en la mesa junto a su eje y su
  tornillo, que es lo que dice que esto se está construyendo ahora;
* la llave fija, el destornillador y los tornillos sueltos en su platillo.

Sin personajes. Lo que se enseña es la transmisión: una cosa mueve a la otra y
se ve por qué.
"""
import math

from taller_suite.escenas_ricas import C, W, H, svg, lg, rg
from taller_suite import rica_comun as M

k = C
P = 'mq'

MESA = 126

LATON = '#c9922f'
LATON_L = '#f0c568'
LATON_S = '#8a6115'
MODULO = 5.6                      # paso del dentado, común a todas las ruedas


def _engranaje(cx, cy, dientes, *, fase=0, col=LATON, eje=True, op=1.0):
    """Una rueda dentada cuyo paso sale del módulo común.

    Como todas las ruedas comparten `MODULO`, dos que se toquen a la distancia
    correcta engranan de verdad: el diente de una cae en el hueco de la otra.
    Es la diferencia entre dibujar un mecanismo y construirlo.
    """
    rp = MODULO * dientes / 2                 # radio primitivo
    ra, rf = rp + MODULO * .62, rp - MODULO * .78
    pts = []
    for i in range(dientes):
        a = math.radians(fase + 360 * i / dientes)
        p = math.radians(360 / dientes)
        for r, da in ((rf, -p * .32), (ra, -p * .17), (ra, p * .17), (rf, p * .32)):
            pts.append((cx + r * math.cos(a + da), cy + r * math.sin(a + da)))
    d = 'M' + ' L'.join(f'{M.r1(x)} {M.r1(y)}' for x, y in pts) + ' Z'
    g = [f'<path d="{d}" fill="{col}" opacity="{op}"/>',
         f'<path d="{d}" fill="none" stroke="{LATON_S}" stroke-width="1" '
         f'opacity="{M.r2(op * .8)}"/>',
         # el alma de la rueda, rebajada
         f'<circle cx="{M.r1(cx)}" cy="{M.r1(cy)}" r="{M.r1(rf - 3)}" '
         f'fill="{LATON_S}" opacity="{M.r2(op * .3)}"/>']
    # los aligeramientos: los agujeros que toda rueda lleva
    if rp > 22:
        for i in range(5):
            a = math.radians(fase + 72 * i + 36)
            g.append(f'<circle cx="{M.r1(cx + rp * .58 * math.cos(a))}" '
                     f'cy="{M.r1(cy + rp * .58 * math.sin(a))}" '
                     f'r="{M.r1(rp * .17)}" fill="{k["noche"]}" '
                     f'opacity="{M.r2(op * .4)}"/>')
    # el brillo del latón: media luna arriba a la izquierda
    g.append(f'<path d="M{M.r1(cx - rp * .8)} {M.r1(cy - rp * .45)} '
             f'A{M.r1(rp)} {M.r1(rp)} 0 0 1 {M.r1(cx + rp * .3)} {M.r1(cy - rp * .9)}" '
             f'fill="none" stroke="{LATON_L}" stroke-width="{M.r1(rp * .2)}" '
             f'opacity="{M.r2(op * .55)}" filter="url(#b2)"/>')
    if eje:
        g.append(f'<circle cx="{M.r1(cx)}" cy="{M.r1(cy)}" r="{M.r1(max(5, rp * .2))}" '
                 f'fill="url(#{P}_metal)" opacity="{op}"/>')
        g.append(f'<circle cx="{M.r1(cx)}" cy="{M.r1(cy)}" r="{M.r1(max(2, rp * .08))}" '
                 f'fill="{k["noche"]}" opacity="{M.r2(op * .55)}"/>')
    return ''.join(g)


# Tres ruedas que engranan: la distancia entre centros es la suma de radios
# primitivos, que con el módulo común es lo que hace que los dientes casen.
D1, D2, D3 = 24, 14, 10
R1, R2, R3 = MODULO * D1 / 2, MODULO * D2 / 2, MODULO * D3 / 2
C1 = (178, 252)
C2 = (C1[0] + R1 + R2, C1[1] - 26)
C3 = (C2[0] + R2 + R3, C2[1] + 34)


def _bastidor():
    """El bastidor de madera taladrada donde va montado todo."""
    g = [M.sombra(64, 168, 456, 196, op=.34, dx=12, dy=15, rx=6),
         f'<rect x="64" y="168" width="456" height="196" rx="7" '
         f'fill="url(#{P}_bastidor)"/>',
         f'<rect x="64" y="168" width="456" height="10" rx="5" fill="#e0bd8a" '
         f'opacity=".55"/>',
         f'<rect x="64" y="168" width="456" height="196" rx="7" fill="none" '
         f'stroke="{k["noche"]}" stroke-width="1.4" opacity=".28"/>']
    # la retícula de agujeros
    for j in range(7):
        for i in range(17):
            x, y = 84 + i * 26.6, 186 + j * 27.8
            g.append(f'<circle cx="{M.r1(x)}" cy="{M.r1(y)}" r="4.2" fill="#6b4a26"/>')
            g.append(f'<circle cx="{M.r1(x - .6)}" cy="{M.r1(y - .8)}" r="3.4" '
                     f'fill="{k["noche"]}" opacity=".5"/>')
            g.append(f'<path d="M{M.r1(x - 3)} {M.r1(y + 3.4)} a4.2 4.2 0 0 0 6.6 -.6" '
                     f'fill="none" stroke="#e2bd8c" stroke-width="1" opacity=".5"/>')
    # cuatro tornillos de sujeción, con su ranura orientada distinta
    for i, (x, y) in enumerate(((80, 182), (504, 182), (80, 350), (504, 350))):
        g.append(f'<circle cx="{x}" cy="{y}" r="7.5" fill="url(#{P}_metal)"/>')
        g.append(f'<circle cx="{x}" cy="{y}" r="7.5" fill="none" stroke="{k["noche"]}" '
                 f'stroke-width="1" opacity=".35"/>')
        a = 30 + i * 37
        g.append(f'<path d="M{x} {y} m{M.r1(-6 * math.cos(math.radians(a)))} '
                 f'{M.r1(-6 * math.sin(math.radians(a)))} '
                 f'l{M.r1(12 * math.cos(math.radians(a)))} '
                 f'{M.r1(12 * math.sin(math.radians(a)))}" stroke="{k["noche"]}" '
                 f'stroke-width="2.2" opacity=".55" stroke-linecap="round"/>')
    return ''.join(g)


def _tren():
    """El tren de engranajes, con la manivela en la rueda grande."""
    g = []
    for (cx, cy), d, fase in ((C1, D1, 0), (C2, D2, 180 / D2), (C3, D3, 0)):
        g.append(f'<ellipse cx="{M.r1(cx + 6)}" cy="{M.r1(cy + 10)}" '
                 f'rx="{M.r1(MODULO * d / 2 + 4)}" ry="{M.r1(MODULO * d / 2 + 4)}" '
                 f'fill="{k["noche"]}" opacity=".26" filter="url(#b5)"/>')
    g.append(_engranaje(*C1, D1, fase=0))
    g.append(_engranaje(*C2, D2, fase=180 / D2))
    g.append(_engranaje(*C3, D3, fase=0))
    # la manivela
    mx = C1[0] + R1 * .62
    my = C1[1] - R1 * .34
    g.append(f'<path d="M{C1[0]} {C1[1]} L{M.r1(mx)} {M.r1(my)}" '
             f'stroke="url(#{P}_metal)" stroke-width="8" stroke-linecap="round"/>')
    g.append(f'<circle cx="{M.r1(mx)}" cy="{M.r1(my)}" r="9" fill="#8a5a33"/>')
    g.append(f'<circle cx="{M.r1(mx)}" cy="{M.r1(my)}" r="9" fill="none" '
             f'stroke="{k["noche"]}" stroke-width="1" opacity=".4"/>')
    g.append(f'<circle cx="{M.r1(mx - 2.6)}" cy="{M.r1(my - 3)}" r="3" '
             f'fill="#c08a58" opacity=".8"/>')
    # la flecha de giro, discreta
    g.append(f'<path d="M{M.r1(C1[0] - R1 - 16)} {M.r1(C1[1] + 6)} '
             f'A{M.r1(R1 + 16)} {M.r1(R1 + 16)} 0 0 1 {M.r1(C1[0] - R1 - 4)} '
             f'{M.r1(C1[1] - 28)}" fill="none" stroke="{k["tinta"]}" '
             f'stroke-width="1.6" opacity=".4"/>')
    g.append(f'<path d="M{M.r1(C1[0] - R1 - 4)} {M.r1(C1[1] - 28)} l-6 5 m6 -5 l1 7" '
             f'fill="none" stroke="{k["tinta"]}" stroke-width="1.6" opacity=".4" '
             f'stroke-linecap="round"/>')
    return ''.join(g)


def _cremallera():
    """El piñón pequeño arrastra la cremallera: se ve lo recorrido y lo que queda."""
    x0, y = C3[0] - 10, C3[1] + R3 + 9
    g = [M.sombra(x0, y, 176, 18, op=.28, dx=5, dy=8, rx=2, blur='b2'),
         f'<rect x="{M.r1(x0)}" y="{M.r1(y + 7)}" width="176" height="12" rx="2" '
         f'fill="url(#{P}_metal)"/>']
    # los dientes, con el mismo módulo que las ruedas
    n = int(176 / MODULO)
    for i in range(n):
        xx = x0 + i * MODULO
        g.append(f'<path d="M{M.r1(xx)} {M.r1(y + 7)} l{M.r2(MODULO * .22)} -6 '
                 f'l{M.r2(MODULO * .34)} 0 l{M.r2(MODULO * .22)} 6 Z" '
                 f'fill="{LATON}"/>')
        g.append(f'<path d="M{M.r1(xx)} {M.r1(y + 7)} l{M.r2(MODULO * .22)} -6" '
                 f'stroke="{LATON_L}" stroke-width=".9" opacity=".7"/>')
    # el tramo recorrido, marcado en el bastidor
    g.append(f'<path d="M{M.r1(x0 - 40)} {M.r1(y + 26)} H{M.r1(x0 + 2)}" '
             f'stroke="{k["tinta"]}" stroke-width="1.4" opacity=".45" '
             f'stroke-dasharray="5 4"/>')
    g.append(f'<path d="M{M.r1(x0 - 40)} {M.r1(y + 22)} v8 M{M.r1(x0 + 2)} '
             f'{M.r1(y + 22)} v8" stroke="{k["tinta"]}" stroke-width="1.4" '
             f'opacity=".5"/>')
    return ''.join(g)


def _polea():
    """La polea con la cuerda en la garganta y el peso subiendo."""
    cx, cy = 482, 198
    g = [f'<ellipse cx="{cx + 5}" cy="{cy + 9}" rx="30" ry="30" fill="{k["noche"]}" '
         f'opacity=".24" filter="url(#b5)"/>']
    # el soporte
    g.append(f'<path d="M{cx - 9} {cy - 34} h18 v16 h-18 Z" fill="url(#{P}_metal)"/>')
    g.append(f'<circle cx="{cx}" cy="{cy}" r="28" fill="url(#{P}_metal)"/>')
    g.append(f'<circle cx="{cx}" cy="{cy}" r="28" fill="none" stroke="{k["noche"]}" '
             f'stroke-width="1.2" opacity=".35"/>')
    # la garganta
    g.append(f'<circle cx="{cx}" cy="{cy}" r="23" fill="none" stroke="{k["noche"]}" '
             f'stroke-width="6" opacity=".3"/>')
    g.append(f'<circle cx="{cx}" cy="{cy}" r="8" fill="#39434e"/>')
    g.append(M.brillo_borde(f'M{cx - 22} {cy - 14} A28 28 0 0 1 {cx + 2} {cy - 28}',
                            w=3, op=.6))
    # la cuerda: sube por un lado, baja por el otro y sostiene el peso
    g.append(f'<path d="M{cx - 23} {cy} V{cy - 12}" stroke="#d8c49a" '
             f'stroke-width="3.4" stroke-linecap="round"/>')
    # la armella donde se amarra el cabo: una cuerda tiene que ir atada a algo
    g.append(f'<circle cx="{cx - 23}" cy="{cy - 18}" r="7" fill="none" '
             f'stroke="url(#{P}_metal)" stroke-width="3.4"/>')
    g.append(f'<path d="M{cx - 23} {cy - 25} v-9" stroke="url(#{P}_metal)" '
             f'stroke-width="4" stroke-linecap="round"/>')
    g.append(f'<path d="M{cx - 27} {cy - 8} q4 -6 8 0" fill="none" stroke="#d8c49a" '
             f'stroke-width="2.4"/>')
    g.append(f'<path d="M{cx + 23} {cy} V{cy + 54}" stroke="#d8c49a" '
             f'stroke-width="3.4" stroke-linecap="round"/>')
    g.append(f'<path d="M{cx - 23} {cy} A23 23 0 0 1 {cx + 23} {cy}" fill="none" '
             f'stroke="#d8c49a" stroke-width="3.4"/>')
    for i in range(16):
        yy = cy + 6 + i * 5
        if yy > cy + 52:
            break
        g.append(f'<path d="M{cx + 21} {M.r1(yy)} l4 2.4" stroke="#a88f5f" '
                 f'stroke-width="1" opacity=".6"/>')
    # el peso, a media altura: ni en el suelo ni arriba
    py = cy + 54
    g.append(M.sombra(cx + 6, py, 36, 34, op=.3, dx=7, dy=10, rx=3, sesgo=-.2))
    g.append(f'<path d="M{cx + 8} {py} h30 l4 32 h-38 Z" fill="url(#{P}_peso)"/>')
    g.append(f'<path d="M{cx + 8} {py} h30 l2 6 h-34 Z" fill="#ffffff" opacity=".2"/>')
    g.append(f'<path d="M{cx + 16} {py} a7 7 0 0 1 14 0" fill="none" '
             f'stroke="#39434e" stroke-width="3"/>')
    return ''.join(g)


def _suelto():
    """El engranaje todavía sin montar, con su eje y su tornillo al lado."""
    g = [M.contacto(232, 400, 62, op=.4, alto=6)]
    g.append(_engranaje(262, 382, 12, fase=9, eje=False))
    g.append(f'<circle cx="262" cy="382" r="7" fill="{k["noche"]}" opacity=".5"/>')
    # el eje y el tornillo, esperando
    g.append(f'<rect x="304" y="384" width="54" height="7" rx="3.5" '
             f'fill="url(#{P}_metal)" transform="rotate(-8 331 387)"/>')
    g.append(f'<g transform="rotate(14 372 392)">'
             f'<rect x="352" y="389" width="34" height="6" rx="1.5" '
             f'fill="url(#{P}_metal)"/>'
             f'<path d="M386 386 l9 6 l-9 6 Z" fill="#8d97a1"/>'
             f'<circle cx="350" cy="392" r="6" fill="url(#{P}_metal)"/>'
             f'<path d="M346 392 h8" stroke="{k["noche"]}" stroke-width="1.8" '
             f'opacity=".5"/></g>')
    return ''.join(g)


def _herramientas():
    """La llave fija y el platillo de los tornillos."""
    g = ['<g transform="rotate(-9 96 388)">',
         M.sombra(24, 380, 150, 16, op=.28, dx=5, dy=8, rx=4, blur='b2'),
         f'<rect x="46" y="382" width="106" height="13" rx="4" '
         f'fill="url(#{P}_metal)"/>',
         f'<path d="M24 381 q-8 7 0 14 l24 -2 v-10 Z" fill="url(#{P}_metal)"/>',
         f'<path d="M28 385 q-4 3.4 0 7 l12 -1 v-5 Z" fill="{k["noche"]}" '
         f'opacity=".55"/>',
         f'<path d="M152 383 l20 3 q8 5 0 10 l-20 -1 Z" fill="url(#{P}_metal)"/>',
         f'<circle cx="164" cy="389" r="5" fill="{k["noche"]}" opacity=".55"/>',
         M.brillo_borde('M48 384 h102', w=1.6, op=.5),
         '</g>']
    # el platillo con tornillos
    g.append(M.contacto(390, 392, 76, op=.36, alto=6))
    g.append(f'<ellipse cx="428" cy="380" rx="40" ry="16" fill="url(#{P}_metal)"/>')
    g.append(f'<ellipse cx="428" cy="377" rx="35" ry="12.6" fill="#7f8a95"/>')
    for i in range(7):
        a = M.n(i, 3.1) * 6.28
        x = 428 + math.cos(a) * 22 * M.n(i, 5.3)
        y = 377 + math.sin(a) * 8 * M.n(i, 7.7)
        g.append(f'<g transform="rotate({M.r1(M.n(i, 9.1) * 180)} {M.r1(x)} {M.r1(y)})">'
                 f'<rect x="{M.r1(x - 9)}" y="{M.r1(y - 2)}" width="14" height="4" '
                 f'rx="1" fill="#b9c2ca"/>'
                 f'<circle cx="{M.r1(x + 7)}" cy="{M.r1(y)}" r="4" fill="#cdd5dc"/>'
                 f'</g>')
    return ''.join(g)


def escena():
    defs = (
        M.defs_taller(P, tabla=('#bd9a6f', '#9a7848', '#735432', '#4a341c'))
        + M.defs_metal(P)
        + M.defs_papel(P)
        + lg(f'{P}_bastidor', .1, 0, .9, 1,
             [(0, '#d3a870', None), (.3, '#b78a50', None), (1, '#8a6434', None)])
        + lg(f'{P}_peso', 0, 0, .3, 1,
             [(0, '#6f7a85', None), (.4, '#4e5860', None), (1, '#2b333a', None)])
        + rg(f'{P}_focosuelo', .5, .5, .5, [(0, '#fff0cf', .48), (1, '#fff0cf', 0)])
    )

    c = M.pared(P, MESA + 6, vx=250, vy=6, vw=140, vh=96)
    c += M.banco(P, MESA, juntas=(560,), nudos=((580, 320, 8),))
    c += (f'<ellipse cx="240" cy="220" rx="250" ry="150" fill="url(#{P}_focosuelo)" '
          f'opacity=".46" filter="url(#b22)"/>')

    c += _bastidor()
    c += _polea()
    c += _cremallera()
    c += _tren()
    c += _suelto()
    c += _herramientas()

    c += M.velo(P, MESA - 6, 46, op=.28)
    c += M.vineta(P, .85)
    return svg(c, defs)
