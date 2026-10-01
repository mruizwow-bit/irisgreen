# -*- coding: utf-8 -*-
"""Escena rica de Cómic y guion gráfico (R65 · tanda 1).

El tablero donde se entinta una página, no la página publicada.

Lo que se ve:

* la pared con la luz de la ventana y, clavada, **la tira de miniaturas**: el
  guion gráfico en pequeño, que es por donde empieza de verdad una página;
* el tablero inclinado y, encima, **la página a medias**, sujeta con pinzas:
  * la primera viñeta **entintada**, con su negro macizo, su tramado y el blanco
    reservado donde da la luz;
  * la segunda todavía **a lápiz**, con las líneas de construcción a la vista;
  * la tercera con el bocadillo dibujado y **vacío**, esperando el texto;
  * las tres de abajo solo con la caja marcada en azul de trazar, y una con un
    garabato de encuadre;
* la retícula de la página: márgenes, calles entre viñetas y línea de corte,
  todo en azul, que es lo que no sale impreso;
* el tintero abierto, con la tinta densa y su reflejo;
* la plumilla apoyada en el canto de la viñeta que se está entintando, con la
  punta todavía húmeda y brillante;
* el pincel, la goma moldeable y la regla de acero;
* una mancha de tinta seca en el tablero, porque un tablero de entintar las
  tiene.

Sin texto legible: los bocadillos llevan renglones, que es lo que hay antes de
rotular. Sin personajes con cara: lo que se dibuja dentro de las viñetas es
paisaje y objeto.
"""
from taller_suite.escenas_ricas import C, W, H, svg, lg, rg
from taller_suite import rica_comun as M

k = C
P = 'cm'

MESA = 146

# La página, en escorzo suave sobre el tablero inclinado.
PG = ((96, 132), (430, 124), (452, 392), (74, 398))
PGD = (f'M{PG[0][0]} {PG[0][1]} L{PG[1][0]} {PG[1][1]} '
       f'L{PG[2][0]} {PG[2][1]} L{PG[3][0]} {PG[3][1]} Z')

AZUL = '#6ba2d8'          # azul de trazar: no sale en la reproducción
TINTA = '#101820'


def _en(u, v):
    """Punto (u,v) en [0,1]² dentro del cuadrilátero de la página."""
    (x0, y0), (x1, y1), (x2, y2), (x3, y3) = PG
    xa, ya = x0 + (x1 - x0) * u, y0 + (y1 - y0) * u
    xb, yb = x3 + (x2 - x3) * u, y3 + (y2 - y3) * u
    return M.r1(xa + (xb - xa) * v), M.r1(ya + (yb - ya) * v)


#: Las seis viñetas, en coordenadas de página: (u0, v0, u1, v1).
VINETAS = [
    (.07, .06, .50, .30), (.54, .06, .93, .30),
    (.07, .34, .93, .58),
    (.07, .62, .33, .92), (.37, .62, .63, .92), (.67, .62, .93, .92),
]


def _caja(i, *, color, w, op, dash=None):
    u0, v0, u1, v1 = VINETAS[i]
    p = [_en(u0, v0), _en(u1, v0), _en(u1, v1), _en(u0, v1)]
    d = 'M%s %s L%s %s L%s %s L%s %s Z' % tuple(c for xy in p for c in xy)
    da = f' stroke-dasharray="{dash}"' if dash else ''
    return (f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{w}" '
            f'opacity="{op}"{da}/>'), p


def _clip_vineta(i):
    _, p = _caja(i, color='#000', w=1, op=1)
    d = 'M%s %s L%s %s L%s %s L%s %s Z' % tuple(c for xy in p for c in xy)
    return f'<clipPath id="{P}_cpv{i}"><path d="{d}"/></clipPath>'


def _entintada():
    """La viñeta 1, ya entintada: negro macizo, tramado y blanco reservado.

    Paisaje: un camino que se va, un poste indicador y un cerro al fondo. Ni
    personajes ni caras; lo que se lee es el oficio de entintar.
    """
    u0, v0, u1, v1 = VINETAS[0]
    (ax, ay) = _en(u0, v0)
    (bx, by) = _en(u1, v1)
    g = [f'<g clip-path="url(#{P}_cpv0)">',
         f'<rect x="{ax - 4}" y="{ay - 4}" width="{bx - ax + 8}" height="{by - ay + 8}" '
         f'fill="#fdfbf5"/>']
    hx = ax + (bx - ax) * .5
    hy = ay + (by - ay) * .52
    # cielo: tramado horizontal que se aclara hacia el horizonte
    g.append(M.tramado(13, ax + 2, ay + 5, bx - ax - 6, 0, 2.6, TINTA,
                       w=.85, o0=.34, o1=.05, s=3.1))
    # el cerro del fondo, macizo
    g.append(f'<path d="M{ax - 4} {M.r1(hy)} q{M.r1((bx - ax) * .18)} '
             f'{M.r1(-(by - ay) * .2)} {M.r1((bx - ax) * .34)} -2 '
             f'q{M.r1((bx - ax) * .2)} {M.r1((by - ay) * .1)} {M.r1((bx - ax) * .4)} 2 '
             f'V{M.r1(hy + 4)} H{ax - 4} Z" fill="{TINTA}" opacity=".82"/>')
    # el suelo, en blanco reservado, con tramado solo a la derecha
    g.append(f'<rect x="{ax - 4}" y="{M.r1(hy + 2)}" width="{bx - ax + 8}" '
             f'height="{M.r1(by - hy + 4)}" fill="#fdfbf5"/>')
    g.append(M.tramado(16, hx + 6, hy + 6, 10, 26, 3.4, TINTA, w=1, o0=.1, o1=.6, s=5.7))
    # el camino que se va: dos líneas que convergen
    g.append(M.trazo(f'M{M.r1(ax + (bx - ax) * .18)} {M.r1(by + 4)} '
                     f'L{M.r1(hx - 4)} {M.r1(hy + 2)}', TINTA, w=2.2, op=.95, halo=False))
    g.append(M.trazo(f'M{M.r1(ax + (bx - ax) * .74)} {M.r1(by + 4)} '
                     f'L{M.r1(hx + 5)} {M.r1(hy + 2)}', TINTA, w=2.2, op=.95, halo=False))
    # el poste indicador, con su sombra proyectada en el suelo
    px, py = ax + (bx - ax) * .72, hy - 2
    g.append(f'<path d="M{M.r1(px)} {M.r1(py)} V{M.r1(by - 6)}" stroke="{TINTA}" '
             f'stroke-width="3" stroke-linecap="round"/>')
    g.append(f'<path d="M{M.r1(px - 20)} {M.r1(py + 5)} h22 l6 4 l-6 4 h-22 Z" '
             f'fill="{TINTA}"/>')
    g.append(f'<path d="M{M.r1(px)} {M.r1(by - 6)} l-22 5" stroke="{TINTA}" '
             f'stroke-width="2.4" opacity=".8" stroke-linecap="round"/>')
    g.append('</g>')
    return ''.join(g)


def _a_lapiz():
    """La viñeta 2, todavía a lápiz: construcción a la vista, nada cerrado."""
    u0, v0, u1, v1 = VINETAS[1]
    (ax, ay) = _en(u0, v0)
    (bx, by) = _en(u1, v1)
    g = [f'<g clip-path="url(#{P}_cpv1)">',
         f'<rect x="{ax - 4}" y="{ay - 4}" width="{bx - ax + 8}" height="{by - ay + 8}" '
         f'fill="#fdfbf5"/>']
    hy = ay + (by - ay) * .46
    gr = k['grafito']
    # horizonte y puntos de fuga: la construcción de la perspectiva
    g.append(M.guia(f'M{ax - 4} {M.r1(hy)} H{bx + 4}', gr, w=.9, op=.5, s=2))
    for t in (.12, .34, .58, .82):
        g.append(M.guia(f'M{M.r1(ax + (bx - ax) * .22)} {M.r1(hy)} '
                        f'L{M.r1(ax + (bx - ax) * t)} {M.r1(by + 6)}', gr,
                        w=.8, op=.42, s=t * 7))
    # un volumen en construcción: caja en perspectiva, sin cerrar
    x0 = ax + (bx - ax) * .42
    g.append(M.guia(f'M{M.r1(x0)} {M.r1(hy + 10)} l34 -8 l0 30 l-34 8 Z', gr, w=1.1, op=.62, s=9))
    g.append(M.guia(f'M{M.r1(x0 + 34)} {M.r1(hy + 2)} l16 6 l0 30 l-16 -6', gr,
                    w=1.1, op=.55, s=11))
    g.append(M.tramado(9, x0 + 4, hy + 20, 9, 14, 3.2, gr, w=.9, o0=.16, o1=.4, s=13))
    g.append('</g>')
    return ''.join(g)


def _bocadillo(cx, cy, rx, ry, *, renglones=3, rabo=(0, 1), op=1.0, vacio=False):
    """Un bocadillo. Si está vacío, solo el contorno: falta rotular."""
    dx, dy = rabo
    g = [f'<ellipse cx="{M.r1(cx)}" cy="{M.r1(cy)}" rx="{M.r1(rx)}" ry="{M.r1(ry)}" '
         f'fill="#fdfbf5" stroke="{TINTA}" stroke-width="1.8" opacity="{op}"/>',
         f'<path d="M{M.r1(cx + dx * rx * .3)} {M.r1(cy + dy * ry * .8)} '
         f'l{M.r1(dx * 12 + 5)} {M.r1(dy * 16)} l{M.r1(-dx * 6 - 11)} '
         f'{M.r1(-dy * 7)} Z" fill="#fdfbf5" stroke="{TINTA}" stroke-width="1.8" '
         f'stroke-linejoin="round" opacity="{op}"/>']
    if not vacio:
        for i in range(renglones):
            a = rx * (1.28 - abs(i - (renglones - 1) / 2) * .34)
            g.append(f'<rect x="{M.r1(cx - a / 2)}" y="{M.r1(cy - ry * .45 + i * 7)}" '
                     f'width="{M.r1(a)}" height="2.4" rx="1.2" fill="{TINTA}" '
                     f'opacity="{M.r2(.7 * op)}"/>')
    return ''.join(g)


def _tintero():
    """El tintero abierto: vidrio, tinta densa y el reflejo de la ventana."""
    cx, cy = 528, 268
    g = [M.contacto(cx - 40, cy + 54, 80, op=.44, alto=8),
         M.sombra(cx - 36, cy - 6, 72, 58, op=.3, dx=6, dy=8, rx=6, sesgo=-.18)]
    # el cuerpo de vidrio
    g.append(f'<path d="M{cx - 38} {cy + 52} L{cx - 32} {cy - 8} '
             f'L{cx + 32} {cy - 8} L{cx + 38} {cy + 52} Z" fill="url(#{P}_vidriocuerpo)"/>')
    # la tinta dentro, con su menisco
    g.append(f'<path d="M{cx - 35} {cy + 52} L{cx - 31} {cy + 14} '
             f'L{cx + 31} {cy + 14} L{cx + 35} {cy + 52} Z" fill="{TINTA}"/>')
    g.append(f'<ellipse cx="{cx}" cy="{cy + 14}" rx="31" ry="7" fill="#1d2a36"/>')
    g.append(f'<ellipse cx="{cx - 11}" cy="{cy + 12}" rx="11" ry="3" fill="#6e8296" '
             f'opacity=".5" filter="url(#b2)"/>')
    # el cuello y el borde
    g.append(f'<ellipse cx="{cx}" cy="{cy - 8}" rx="32" ry="8" fill="none" '
             f'stroke="#cfe0ea" stroke-width="2.4" opacity=".85"/>')
    g.append(M.brillo_borde(f'M{cx - 30} {cy + 44} L{cx - 25} {cy - 4}',
                            color='#ffffff', w=3, op=.5))
    g.append(M.brillo_borde(f'M{cx + 27} {cy + 40} L{cx + 24} {cy + 2}',
                            color='#ffffff', w=1.6, op=.3))
    # el tapón, apoyado al lado
    g.append(M.contacto(cx + 46, cy + 54, 30, op=.36, alto=5))
    g.append(f'<ellipse cx="{cx + 60}" cy="{cy + 46}" rx="15" ry="9" '
             f'fill="url(#{P}_vidriocuerpo)"/>')
    g.append(f'<ellipse cx="{cx + 60}" cy="{cy + 44}" rx="15" ry="9" fill="#dce9f1" '
             f'opacity=".7"/>')
    return ''.join(g)


def _plumilla():
    """La plumilla apoyada en el canto de la viñeta, con la punta aún húmeda."""
    g = ['<g transform="rotate(-27 300 300)">',
         M.sombra(202, 294, 170, 11, op=.3, dx=3, dy=5, rx=5, blur='b2', sesgo=-.1),
         f'<rect x="216" y="292" width="150" height="12" rx="5" fill="#2b2118"/>',
         f'<rect x="216" y="293" width="150" height="3.4" rx="1.7" fill="#6b5340" '
         f'opacity=".8"/>',
         f'<rect x="336" y="291" width="30" height="14" rx="3" fill="url(#{P}_metal)"/>',
         # la plumilla: dos hojas y la hendidura
         f'<path d="M196 292 L218 296 L218 300 L196 304 Z" fill="url(#{P}_metal)"/>',
         f'<path d="M196 298 L214 298" stroke="{k["noche"]}" stroke-width="1.1" '
         f'opacity=".65"/>',
         # la punta, mojada: tinta brillante
         f'<path d="M193 296.5 L200 297.4 L200 299.4 L193 300.3 Z" fill="{TINTA}"/>',
         f'<circle cx="196" cy="298.4" r="1.6" fill="#7e94a8" opacity=".8"/>',
         M.brillo_borde('M200 294.4 L216 297', w=1.4, op=.85),
         '</g>']
    return ''.join(g)


def _pincel():
    return ('<g transform="rotate(12 480 358)">'
            + M.sombra(404, 354, 160, 10, op=.28, dx=3, dy=5, rx=5, blur='b2', sesgo=-.1)
            + f'<rect x="418" y="352" width="132" height="11" rx="5" fill="#8a3b2e"/>'
            + f'<rect x="418" y="353" width="132" height="3" rx="1.5" fill="#c16a55" '
              f'opacity=".8"/>'
            + f'<rect x="404" y="351" width="20" height="13" rx="2" fill="url(#{P}_metal)"/>'
            + f'<path d="M404 353 C388 353 378 356 372 357.5 C378 359 388 362 404 362 Z" '
              f'fill="{TINTA}" opacity=".92"/>'
            + f'<path d="M382 356.6 C376 357 373 357.3 372 357.5" stroke="#4a5a68" '
              f'stroke-width="1" opacity=".6"/>'
            + '</g>')


def _miniaturas():
    """La tira de miniaturas clavada en la pared: el guion gráfico."""
    x, y = 398, 18
    g = [M.sombra(x, y, 208, 104, op=.24, dx=5, dy=7, rx=2),
         f'<g transform="rotate(-2 {x + 104} {y + 52})">',
         f'<rect x="{x}" y="{y}" width="208" height="104" rx="1.5" '
         f'fill="url(#{P}_pliego)"/>']
    for i in range(6):
        cx = x + 9 + (i % 3) * 65
        cy = y + 9 + (i // 3) * 45
        g.append(f'<rect x="{M.r1(cx)}" y="{M.r1(cy)}" width="57" height="37" '
                 f'fill="none" stroke="{k["grafito"]}" stroke-width="1" opacity=".7"/>')
        # garabatos de encuadre: manchas y líneas, no dibujo acabado
        g.append(M.tramado(6, cx + 5, cy + 22, 7, -9, 6.4, k['grafito'],
                           w=1.1, o0=.25, o1=.5, s=i * 3 + 1))
        g.append(M.trazo(f'M{M.r1(cx + 4)} {M.r1(cy + 26)} q14 -7 26 -2 q12 5 24 -6',
                         k['grafito'], w=1.2, op=.5, halo=False))
        if i % 2 == 0:
            g.append(f'<ellipse cx="{M.r1(cx + 40)}" cy="{M.r1(cy + 11)}" rx="10" ry="6" '
                     f'fill="none" stroke="{k["grafito"]}" stroke-width="1" opacity=".55"/>')
    g.append('</g>')
    # la chincheta
    g.append(f'<circle cx="{x + 104}" cy="{y + 3}" r="5" fill="#b3261e"/>'
             f'<circle cx="{x + 102}" cy="{y + 1}" r="1.8" fill="#f4b3a2" opacity=".9"/>')
    return ''.join(g)


def _pinza(cx, cy):
    """Pinza metálica que muerde la página contra el tablero."""
    return (M.sombra(cx - 17, cy - 5, 34, 17, op=.3, dx=4, dy=6, rx=2)
            + f'<rect x="{cx - 17}" y="{cy - 6}" width="34" height="15" rx="2.5" '
              f'fill="url(#{P}_metal)"/>'
            + f'<rect x="{cx - 17}" y="{cy - 6}" width="34" height="4" rx="2" '
              f'fill="#ffffff" opacity=".4"/>'
            + f'<rect x="{cx - 8}" y="{cy - 12}" width="16" height="8" rx="3" '
              f'fill="#6f7d8c"/>')


def escena():
    defs = (
        M.defs_taller(P, tabla=('#c9a97e', '#a98554', '#835f39', '#563e25'))
        + M.defs_papel(P, base=('#fdfbf5', '#f6f1e5', '#ddd5c4'))
        + M.defs_metal(P)
        + M.defs_vidrio(P)
        + lg(f'{P}_tablero', 0, 0, .2, 1,
             [(0, '#4e6274', None), (.4, '#3b4c5c', None), (1, '#25323e', None)])
        + lg(f'{P}_vidriocuerpo', 0, 0, 1, .2,
             [(0, '#eef6fb', .9), (.3, '#c2d8e5', .75), (.55, '#9bb6c8', .7),
              (.72, '#e4f0f7', .8), (1, '#7f9aad', .75)])
        + rg(f'{P}_focosuelo', .5, .5, .5, [(0, '#fff1d4', .5), (1, '#fff1d4', 0)])
        + M.clip(f'{P}_cp_papel', PGD)
        + ''.join(_clip_vineta(i) for i in range(6))
    )

    c = M.pared(P, MESA + 6, vx=34, vy=12, vw=146, vh=108)
    c += M.banco(P, MESA, juntas=(560,), nudos=((596, 300, 8),))
    c += (f'<ellipse cx="200" cy="250" rx="240" ry="140" fill="url(#{P}_focosuelo)" '
          f'opacity=".5" filter="url(#b22)"/>')
    c += _miniaturas()

    # ── el tablero inclinado ────────────────────────────────────────────────
    c += M.sombra(52, 116, 428, 288, op=.36, dx=14, dy=16, rx=4)
    c += (f'<path d="M78 118 L446 108 L470 400 L56 400 Z" fill="url(#{P}_tablero)"/>'
          f'<path d="M78 118 L446 108" stroke="#8ea3b4" stroke-width="2.4" opacity=".6"/>')
    # mancha de tinta seca en el tablero: un tablero de entintar las tiene
    c += (f'<ellipse cx="468" cy="330" rx="22" ry="13" fill="{TINTA}" opacity=".5" '
          f'transform="rotate(-18 468 330)"/>'
          f'<ellipse cx="486" cy="345" rx="5" ry="3.4" fill="{TINTA}" opacity=".45"/>')

    # ── la página ───────────────────────────────────────────────────────────
    c += M.sombra(74, 124, 378, 274, op=.3, dx=7, dy=9, rx=2)
    c += M.papel(P, PGD)
    c += f'<path d="{PGD}" fill="none" stroke="#c9c0ae" stroke-width="1" opacity=".9"/>'
    # la ondulación del pliego
    c += (f'<path d="M150 128 C166 214 158 306 140 394" fill="none" stroke="#ffffff" '
          f'stroke-width="18" opacity=".26" filter="url(#b12)"/>'
          f'<path d="M382 126 C394 212 404 304 420 392" fill="none" stroke="{k["nubeS"]}" '
          f'stroke-width="20" opacity=".2" filter="url(#b12)"/>')

    # la retícula azul: márgenes y calles
    for u in (.04, .96):
        a, b = _en(u, .02), _en(u, .98)
        c += M.guia(f'M{a[0]} {a[1]} L{b[0]} {b[1]}', AZUL, w=.9, op=.5, s=u * 5)
    for v in (.03, .97):
        a, b = _en(.02, v), _en(.98, v)
        c += M.guia(f'M{a[0]} {a[1]} L{b[0]} {b[1]}', AZUL, w=.9, op=.5, s=v * 9)

    # las cajas de las seis viñetas, en azul
    for i in range(6):
        caja, _ = _caja(i, color=AZUL, w=1.3, op=.75)
        c += caja

    c += _entintada()
    c += _a_lapiz()
    # las cajas entintadas de las dos primeras, ya cerradas en negro
    for i in (0, 1):
        caja, _ = _caja(i, color=TINTA, w=2.6 if i == 0 else 1.4,
                        op=1 if i == 0 else .35)
        c += caja
    # un garabato de encuadre en una de las de abajo
    gx, gy = _en(.44, .74)
    c += M.trazo(f'M{gx} {gy} q16 -12 30 -2 q12 9 26 -4', k['grafito'], w=1.4,
                 op=.45, halo=False)
    c += M.tramado(7, gx + 4, gy + 16, 8, 12, 5.2, k['grafito'], w=1, o0=.18, o1=.36, s=7)

    # bocadillos: uno con renglones sobre la viñeta ancha, otro vacío
    bx, by = _en(.30, .40)
    c += _bocadillo(bx, by, 40, 25, renglones=3, rabo=(-.6, 1))
    bx, by = _en(.76, .42)
    c += _bocadillo(bx, by, 34, 21, rabo=(.6, 1), vacio=True)

    c += _pinza(*_en(.22, .02))
    c += _pinza(*_en(.80, .015))

    # ── herramientas ────────────────────────────────────────────────────────
    c += _tintero()
    c += _pincel()
    # la goma moldeable
    c += M.contacto(464, 392, 48, op=.34, alto=4)
    c += (f'<path d="M466 372 q14 -12 30 -6 q16 7 12 18 q-5 12 -22 10 q-20 -3 -20 -22 Z" '
          f'fill="#8c9bab"/>'
          f'<path d="M472 372 q12 -8 24 -3" stroke="#c3cfda" stroke-width="3" '
          f'opacity=".5" stroke-linecap="round"/>')
    c += _plumilla()

    c += M.velo(P, MESA - 6, 54, op=.32)
    c += M.vineta(P, .85)
    return svg(c, defs)
