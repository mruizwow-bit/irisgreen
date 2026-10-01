# -*- coding: utf-8 -*-
"""Escena rica de Mundos inventados (R54).

Mismo relato que la escena plana: un mapa de un continente inventado sobre la
mesa (costa, cordillera, bosque, rio), marcadores con nombres, rosa de los
vientos, y fichas de especimen, cultura y calendario unidas al mapa por hilos.

Lo que sube el acabado:

* el mapa deja de ser una lamina y pasa a ser **pergamino**: fibra, bordes
  ondulados, sombra propia y una esquina levantada que ensena el reverso;
* la isla deja de ser una mancha: **costa con entrantes, salientes, peninsula
  e islas**, plataforma clara en la orilla que se oscurece mar adentro y
  curvas de batimetria;
* la cordillera se dibuja **por ladera** (cara al noroeste clara, cara opuesta
  en sombra) y proyecta su sombra sobre la tierra;
* rosa de los vientos de laton, con facetas claras y oscuras y brillo;
* fichas apoyadas en la mesa, giradas, con sombra e hilos colgando;
* la ficha del habitante es una **lamina de herbario**: especimen montado con
  su tira de papel engomado, vaina de semillas, corte transversal ampliado y
  etiqueta con escala. Sin mascota ni ojos grandes: sirve a los 8 y a los 45.

Luz calida de lampara desde arriba a la izquierda. Todo inventado.
"""
from taller_suite.escenas_ricas import C, W, H, svg, lg, rg, sombra_suelo

# ---------------------------------------------------------------------------
# paleta propia de la escena (pergamino y mar no estan en C)
# ---------------------------------------------------------------------------
PG_S, PG, PG_L, PG_LL = '#cdb182', '#e7d2a6', '#f2e3bf', '#faf0d8'
PG_REV = '#d9bf90'
MAR_H, MAR_S, MAR, MAR_L, MAR_LL = '#123448', '#1e5470', '#357e98', '#69b0c2', '#a8dbe2'
TIE_S, TIE, TIE_L = '#b89a63', '#d9c493', '#eddfb6'
TINTA = '#3b2c1c'
VERDE_S, VERDE, VERDE_L = '#37592c', '#55803c', '#87b258'
ROCA_S, ROCA, ROCA_L, ROCA_LL = '#6b5a45', '#8d7a5e', '#b7a482', '#ded0b0'

# posiciones del continente: se dibuja en su sistema y se baja 2 px
# ---------------------------------------------------------------------------
# La costa se describe punto a punto, no con una elipse: cabos, calas, una ria
# estrecha al norte, un golfo que casi parte el continente en dos y una
# peninsula larga al suroeste unida por un istmo. De la misma lista salen las
# curvas de nivel del mar, desplazando el contorno hacia fuera.
# ---------------------------------------------------------------------------
PTS = [(137, 178), (142, 162), (155, 153), (149, 142), (165, 140), (176, 149),
       (185, 138), (181, 157), (190, 168), (195, 153), (202, 142), (216, 138),
       (230, 146), (243, 140), (257, 147), (269, 144), (281, 153), (292, 149),
       (301, 161), (296, 172), (306, 179), (315, 193), (310, 206), (297, 211),
       (303, 223), (311, 234), (308, 247), (301, 258), (289, 262), (278, 256),
       (266, 249), (252, 243), (237, 238), (227, 230), (222, 240), (232, 249),
       (245, 256), (257, 266), (267, 275), (274, 287), (269, 298), (257, 305),
       (243, 309), (229, 303), (218, 309), (206, 305), (195, 296), (190, 285),
       (181, 275), (171, 270), (160, 266), (149, 262), (139, 269), (127, 277),
       (114, 287), (102, 296), (90, 304), (78, 307), (70, 299), (75, 290),
       (86, 283), (98, 275), (111, 268), (123, 261), (135, 254), (148, 248),
       (157, 243), (149, 236), (139, 232), (128, 226), (120, 217), (114, 206),
       (121, 196), (116, 187), (123, 179), (130, 176)]

ISL_A = [(383, 156), (376, 163), (368, 171), (356, 167), (345, 161), (349, 152),
         (355, 144), (367, 143), (379, 146)]
ISL_B = [(385, 213), (380, 219), (372, 222), (366, 217), (364, 209), (373, 206), (381, 207)]
ISL_F = [(92, 214), (85, 221), (76, 227), (65, 222), (57, 214), (65, 207), (76, 202), (87, 206)]

RIO_PTS = [(208, 221), (202, 232), (198, 243), (200, 255), (202, 264), (199, 273),
           (198, 283), (200, 294), (200, 303)]
BOSQ_A = [(269, 288), (259, 297), (243, 304), (226, 297), (215, 288), (226, 278),
          (243, 271), (261, 277)]
BOSQ_B = [(195, 255), (188, 262), (176, 268), (163, 263), (156, 255), (164, 247),
          (176, 241), (189, 246)]

PICOS_F = ((262, 207, 16, 26, 2), (234, 201, 19, 32, -3), (204, 199, 21, 35, 3),
           (176, 205, 16, 24, -2))
PICOS = ((272.6, 220, 15, 24, 2), (253, 216, 18.5, 31, -3), (232, 212, 23, 39, 3.5),
         (207.5, 211, 26.5, 46, -4.5), (184.5, 215, 23, 36, 4.5),
         (163.5, 220, 19.5, 26, -3.5), (146, 224, 13, 16, 2.5))


def _suave(pts, t=.17, cerrada=True):
    """Catmull-Rom -> cubicas. Mantiene los cabos vivos y el trazo limpio."""
    n = len(pts)
    d = ['M%.1f %.1f' % pts[0]]
    lim = n if cerrada else n - 1
    for i in range(lim):
        p0 = pts[(i - 1) % n] if cerrada else pts[max(i - 1, 0)]
        p1, p2 = pts[i % n], pts[(i + 1) % n]
        p3 = pts[(i + 2) % n] if cerrada else pts[min(i + 2, n - 1)]
        c1 = (p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t)
        c2 = (p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t)
        d.append('C%.1f %.1f %.1f %.1f %.1f %.1f' % (c1[0], c1[1], c2[0], c2[1], p2[0], p2[1]))
    return ' '.join(d) + (' Z' if cerrada else '')


def _fuera(pts, dist):
    """Desplaza el contorno hacia fuera: de ahi salen las isobatas."""
    n = len(pts)
    cx = sum(p[0] for p in pts) / n
    cy = sum(p[1] for p in pts) / n
    out = []
    for i in range(n):
        ax, ay = pts[(i - 1) % n]
        bx, by = pts[(i + 1) % n]
        tx, ty = bx - ax, by - ay
        m = (tx * tx + ty * ty) ** .5 or 1
        nx, ny = ty / m, -tx / m
        px, py = pts[i]
        if nx * (px - cx) + ny * (py - cy) < 0:
            nx, ny = -nx, -ny
        out.append((px + nx * dist, py + ny * dist))
    return out


COSTA = _suave(PTS)
ISLA_A = _suave(ISL_A, .22)
ISLA_B = _suave(ISL_B, .22)
ISLA_FANTASMA = _suave(ISL_F, .22)
RIO = _suave(RIO_PTS, .2, False)
RIO_2 = _suave(RIO_PTS[2:], .2, False)
RIO_3 = _suave(RIO_PTS[4:], .2, False)
RIO_4 = _suave(RIO_PTS[6:], .2, False)
BOSQUE = _suave(BOSQ_A, .24)
BOSQUE_2 = _suave(BOSQ_B, .24)

LZ = (-0.566, -0.824)          # direccion de la luz, normalizada


def _rand(n, semilla=7):
    """LCG minimo: la textura tiene que ser identica en cada build."""
    s = semilla
    out = []
    for _ in range(n):
        s = (s * 1103515245 + 12345) % 2147483648
        out.append(s / 2147483648.0)
    return out


# ---------------------------------------------------------------------------
def _pico(x, y, w, h, dx=0, lejos=False):
    """Pico con ladera al noroeste iluminada y ladera opuesta en sombra.
    La sombra proyectada de la sierra se dibuja una sola vez, con el macizo."""
    ax, ay = x + dx, y - h
    q = ax + w * .1
    gl = 'mun_mfL' if lejos else 'mun_mtL'
    gs = 'mun_mfS' if lejos else 'mun_mtS'
    return (
        f'<path d="M{x - w} {y} Q{ax - w * .46:.0f} {y - h * .52:.0f} {ax} {ay} L{q:.0f} {y} Z" '
        f'fill="url(#{gl})"/>'
        f'<path d="M{ax} {ay} Q{x + w * .56:.0f} {y - h * .32:.0f} {x + w} {y} L{q:.0f} {y} Z" '
        f'fill="url(#{gs})"/>'
        # roca clara de la cumbre, en la cara que da a la luz
        f'<path d="M{ax - w * .22:.0f} {ay + h * .24:.0f} Q{ax - w * .06:.0f} {ay + h * .05:.0f} {ax} {ay} '
        f'L{ax + w * .1:.0f} {ay + h * .2:.0f} Q{ax - w * .04:.0f} {ay + h * .1:.0f} '
        f'{ax - w * .1:.0f} {ay + h * .2:.0f} Z" fill="#fdf7e8" opacity=".9"/>'
        # cresta: solo una linea fina de luz y otra de sombra
        f'<path d="M{x - w} {y} Q{ax - w * .46:.0f} {y - h * .52:.0f} {ax} {ay}" fill="none" '
        f'stroke="#fff" stroke-width="1.3" opacity=".5"/>'
        f'<path d="M{ax} {ay} Q{x + w * .56:.0f} {y - h * .32:.0f} {x + w} {y}" fill="none" '
        f'stroke="#2c2317" stroke-width="1.2" opacity=".35"/>')


def _copas(cx, cy, rx, ry, n, semilla):
    """Masa de bosque con textura: copas claras arriba-izquierda, oscuras abajo."""
    r = _rand(n * 3, semilla)
    out = []
    for i in range(n):
        a, b, c = r[i * 3], r[i * 3 + 1], r[i * 3 + 2]
        px = cx + (a * 2 - 1) * rx * .92
        py = cy + (b * 2 - 1) * ry * .92
        if ((px - cx) / rx) ** 2 + ((py - cy) / ry) ** 2 > .95:
            continue
        rr = 3.1 + c * 2.4
        out.append(f'<circle cx="{px:.1f}" cy="{py + rr * .45:.1f}" r="{rr:.1f}" fill="{VERDE_S}" opacity=".55"/>')
        out.append(f'<circle cx="{px:.1f}" cy="{py:.1f}" r="{rr:.1f}" fill="{VERDE}"/>')
        out.append(f'<circle cx="{px - rr * .3:.1f}" cy="{py - rr * .32:.1f}" r="{rr * .52:.1f}" '
                   f'fill="{VERDE_L}" opacity=".9"/>')
    return ''.join(out)


def _nombre(x, y, anchos, col=TINTA, gr=2.0, op=.62):
    """Nombre simulado: trazos, no letras."""
    out, cx = [], x
    for a in anchos:
        out.append(f'<path d="M{cx:.0f} {y} h{a}" stroke="{col}" stroke-width="{gr}" '
                   f'stroke-linecap="round" opacity="{op}" fill="none"/>')
        cx += a + 3.4
    return ''.join(out)


def _marcador(x, y, col, colS, r=5.4):
    """Marcador con volumen y su sombrita sobre el papel."""
    return (f'<ellipse cx="{x + 3}" cy="{y + 5.5}" rx="{r * 1.5}" ry="{r * .55}" fill="{TINTA}" opacity=".3" filter="url(#b2)"/>'
            f'<path d="M{x} {y + 6} l-{r * .55:.1f} -{r * .9:.1f} h{r * 1.1:.1f} Z" fill="{colS}"/>'
            f'<circle cx="{x}" cy="{y}" r="{r}" fill="{colS}"/>'
            f'<circle cx="{x}" cy="{y - .5}" r="{r - .6}" fill="{col}"/>'
            f'<circle cx="{x - r * .3:.1f}" cy="{y - r * .38:.1f}" r="{r * .34:.1f}" fill="#fff" opacity=".8"/>')


def _rosa(cx, cy, R):
    """Rosa de los vientos de laton: facetas segun la luz, aro y brillo."""
    import math
    out = [f'<ellipse cx="{cx + 4}" cy="{cy + R * .96:.1f}" rx="{R * .92:.1f}" ry="{R * .22:.1f}" '
           f'fill="{TINTA}" opacity=".32" filter="url(#b5)"/>',
           f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="url(#mun_lat)" opacity=".5"/>',
           f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="url(#mun_aro)" stroke-width="3.4"/>',
           f'<circle cx="{cx}" cy="{cy}" r="{R - 5.5:.1f}" fill="none" stroke="{C["oroS"]}" '
           f'stroke-width="1.1" opacity=".7"/>']
    # marcas de grado
    for i in range(24):
        a = i * math.pi / 12
        r1 = R - 1.6 if i % 3 else R - 1.0
        r2 = R - 4.4 if i % 3 else R - 7.0
        out.append(f'<path d="M{cx + r1 * math.sin(a):.1f} {cy - r1 * math.cos(a):.1f} '
                   f'L{cx + r2 * math.sin(a):.1f} {cy - r2 * math.cos(a):.1f}" stroke="{C["oroS"]}" '
                   f'stroke-width="{1.5 if i % 3 == 0 else .9}" opacity=".75"/>')
    # puntas: 4 largas y 4 cortas, cada una con faceta clara y faceta oscura
    for i in range(8):
        a = i * math.pi / 4
        largo = (R - 7.5) if i % 2 == 0 else (R - 15)
        base = R * .2
        tx, ty = cx + largo * math.sin(a), cy - largo * math.cos(a)
        for s in (-1, 1):
            b = a + s * math.pi / 4
            bx, by = cx + base * math.sin(b), cy - base * math.cos(b)
            mx, my = (tx + bx) / 2 - cx, (ty + by) / 2 - cy
            n = (mx * mx + my * my) ** .5 or 1
            luz = (mx / n) * LZ[0] + (my / n) * LZ[1]
            col = C['oroLL'] if luz > .45 else (C['oroL'] if luz > 0 else
                                                (C['oro'] if luz > -.45 else C['oroS']))
            out.append(f'<path d="M{tx:.1f} {ty:.1f} L{bx:.1f} {by:.1f} L{cx} {cy} Z" fill="{col}"/>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="{R * .17:.1f}" fill="{C["oroS"]}"/>')
    out.append(f'<circle cx="{cx}" cy="{cy - .8}" r="{R * .13:.1f}" fill="{C["oroLL"]}"/>')
    # flor del norte
    out.append(f'<path d="M{cx} {cy - R + 1} l-4.6 8 h9.2 Z" fill="{C["papL"]}"/>')
    out.append(f'<path d="M{cx} {cy - R + 1} l-4.6 8 h4.6 Z" fill="{C["nube"]}"/>')
    # brillo de metal cruzado
    out.append(f'<path d="M{cx - R * .85:.1f} {cy - R * .5:.1f} A{R} {R} 0 0 1 {cx + R * .28:.1f} {cy - R * .96:.1f}" '
               f'fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55" filter="url(#b2)"/>')
    return ''.join(out)


def _ficha(x, y, w, h, rot, interior, tono='#efe6d2'):
    """Ficha de papel sobre la mesa: sombra proyectada, fibra y borde."""
    cx, cy = x + w / 2, y + h / 2
    return (f'<g transform="rotate({rot} {cx:.0f} {cy:.0f})">'
            f'<g filter="url(#sombra)"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="4" fill="{tono}"/></g>'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="4" fill="url(#mun_fic)"/>'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="4" filter="url(#fibra)" '
            f'style="mix-blend-mode:multiply" opacity=".16"/>'
            f'<path d="M{x + 3} {y + 2} h{w - 6}" stroke="#fff" stroke-width="2" opacity=".7" fill="none"/>'
            f'<rect x="{x + 5}" y="{y + 5}" width="{w - 10}" height="{h - 10}" rx="2.5" fill="none" '
            f'stroke="{C["madS"]}" stroke-width="1.2" opacity=".45"/>'
            f'{interior}</g>')


def _hilo(x1, y1, x2, y2, caida=14):
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2 + caida
    return (f'<path d="M{x1} {y1} Q{mx:.0f} {my:.0f} {x2} {y2}" fill="none" stroke="{C["madS"]}" '
            f'stroke-width="1.5" opacity=".62"/>'
            f'<path d="M{x1} {y1} Q{mx:.0f} {my - 1.2:.0f} {x2} {y2}" fill="none" stroke="{C["madLL"]}" '
            f'stroke-width=".7" opacity=".45"/>'
            f'<circle cx="{x1}" cy="{y1}" r="2.6" fill="{C["rojS"]}"/>'
            f'<circle cx="{x1 - .8}" cy="{y1 - .9}" r="1.2" fill="{C["rojL"]}"/>'
            f'<circle cx="{x2}" cy="{y2}" r="2.6" fill="{C["rojS"]}"/>'
            f'<circle cx="{x2 - .8}" cy="{y2 - .9}" r="1.2" fill="{C["rojL"]}"/>')


# ---------------------------------------------------------------------------
# Ficha de espécimen: lámina de herbario de una planta del mundo inventado.
# Sustituye a la criatura: mismo papel, mismo tamaño, mismo hilo y chincheta.
# ---------------------------------------------------------------------------
TALLO = 'M512 188 C510 176 515 166 514 154 C513 144 516 136 518 129'
VAINA = 'M519 111 C527 116 530 123 527 129 C524 134 515 135 511 129 C506 122 511 115 519 111 Z'
HOJAS = ((511, 172, 480, 165, 8.0, 'mun_hoj'),
         (512, 164, 547, 156, 8.0, 'mun_hojb'),
         (513, 155, 483, 145, 7.5, 'mun_hoj'),
         (514, 147, 549, 138, 7.0, 'mun_hojb'),
         (515, 139, 492, 130, 6.2, 'mun_hoj'),
         (516, 132, 539, 125, 5.4, 'mun_hojb'))


def _hoja(bx, by, tx, ty, w):
    """Hoja lanceolada: contorno, borde de luz al noroeste y borde en sombra."""
    dx, dy = tx - bx, ty - by
    m = (dx * dx + dy * dy) ** .5 or 1
    nx, ny = -dy / m, dx / m
    if ny > 0:                      # c1 es siempre el borde que mira a la luz
        nx, ny = -nx, -ny
    mx, my = (bx + tx) / 2, (by + ty) / 2
    c1 = (mx + nx * w * 2, my + ny * w * 2)
    c2 = (mx - nx * w * 2, my - ny * w * 2)
    cv = (mx + nx * w * .5, my + ny * w * .5)
    d = ('M%.1f %.1f Q%.1f %.1f %.1f %.1f Q%.1f %.1f %.1f %.1f Z'
         % (bx, by, c1[0], c1[1], tx, ty, c2[0], c2[1], bx, by))
    borde = 'M%.1f %.1f Q%.1f %.1f %.1f %.1f' % (bx, by, c1[0], c1[1], tx, ty)
    sombra = 'M%.1f %.1f Q%.1f %.1f %.1f %.1f' % (bx, by, c2[0], c2[1], tx, ty)
    vena = 'M%.1f %.1f Q%.1f %.1f %.1f %.1f' % (bx, by, cv[0], cv[1], tx, ty)
    return d, borde, sombra, vena


def _especimen():
    """Espécimen de la flora del mundo, montado y anotado como en un herbario:
    tallo cortado bajo su tira de papel engomado, hojas con haz y envés, vaina
    de semillas y el corte transversal ampliado al lado."""
    import math
    k = C
    hs = [(_hoja(bx, by, tx, ty, w), g) for bx, by, tx, ty, w, g in HOJAS]

    # sombra del espécimen sobre la ficha: silueta desplazada y desenfocada
    sil = ''.join(f'<path d="{h[0][0]}"/>' for h in hs)
    out = [f'<g transform="translate(4 5)" filter="url(#b2)" opacity=".2" fill="#463a22">'
           f'{sil}<path d="{VAINA}"/>'
           f'<path d="{TALLO}" fill="none" stroke="#463a22" stroke-width="5" stroke-linecap="round"/></g>']

    # tallo
    out.append(f'<path d="{TALLO}" fill="none" stroke="{VERDE_S}" stroke-width="5.4" stroke-linecap="round"/>')
    out.append(f'<path d="{TALLO}" fill="none" stroke="url(#mun_tallo)" stroke-width="3.6" stroke-linecap="round"/>')

    # hojas
    for (d, borde, sombra, vena), g in hs:
        out.append(f'<path d="{d}" fill="url(#{g})"/>')
        out.append(f'<path d="{sombra}" fill="none" stroke="{VERDE_S}" stroke-width="1" opacity=".42"/>')
        out.append(f'<path d="{borde}" fill="none" stroke="#d6e4ae" stroke-width="1" opacity=".42"/>')
        out.append(f'<path d="{vena}" fill="none" stroke="{VERDE_S}" stroke-width=".85" opacity=".38"/>')

    # vaina de semillas en la punta, con costuras y brillo
    out.append(f'<path d="{VAINA}" fill="url(#mun_vain)"/>')
    out.append(f'<path d="M519 111 C514 117 512 124 515 133 M519 111 C524 117 526 124 524 132" '
               f'fill="none" stroke="#7d5424" stroke-width="1" opacity=".45"/>')
    out.append(f'<path d="M519 111 C513 114 510 120 510 126" fill="none" stroke="#ffe9a8" '
               f'stroke-width="1.7" stroke-linecap="round" opacity=".55"/>')

    # tira de papel engomado que sujeta el tallo cortado
    out.append(f'<g transform="rotate(-3 513 181)">'
               f'<rect x="497" y="177" width="33" height="9" fill="{TINTA}" opacity=".16" '
               f'transform="translate(2 3)" filter="url(#b2)"/>'
               f'<rect x="497" y="177" width="33" height="9" fill="{PG_LL}" opacity=".85"/>'
               f'<rect x="497" y="177" width="33" height="3" fill="#fff" opacity=".5"/>'
               f'<rect x="497" y="183.5" width="33" height="2.5" fill="{PG_S}" opacity=".5"/></g>')

    # línea de llamada hasta la ampliación del corte
    out.append(f'<circle cx="528" cy="119" r="2.2" fill="none" stroke="{TINTA}" stroke-width="1.2" opacity=".6"/>'
               f'<path d="M531 120 C545 124 558 128 570 132" fill="none" stroke="{TINTA}" '
               f'stroke-width="1" stroke-dasharray="5 5" opacity=".38"/>')

    # ampliación: corte transversal de la vaina
    cx, cy, R = 588, 136, 14.5
    out.append(f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="url(#mun_cort)"/>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="{TINTA}" stroke-width="1.3" opacity=".55"/>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="{R - 3.8}" fill="none" stroke="#8a6238" '
               f'stroke-width="2" opacity=".6"/>')
    for i in range(5):
        a = i * 2 * math.pi / 5 - math.pi / 2
        sx, sy = cx + 5.9 * math.cos(a), cy + 5.9 * math.sin(a)
        out.append(f'<circle cx="{sx:.1f}" cy="{sy:.1f}" r="2.9" fill="#6d7f45"/>'
                   f'<circle cx="{sx - .9:.1f}" cy="{sy - 1:.1f}" r="1.3" fill="#a8b877" opacity=".85"/>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="1.6" fill="#7d5424"/>')
    out.append(f'<path d="M{cx - 10} {cy - 8} A{R} {R} 0 0 1 {cx + 4} {cy - 13.5}" fill="none" '
               f'stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".4" filter="url(#b2)"/>')

    # etiqueta: nombre del espécimen y escala
    out.append(_nombre(470, 191, (19, 13), TINTA, 2.4, .55))
    out.append(_nombre(566, 163, (25, 13), TINTA, 2.2, .5))
    out.append(_nombre(566, 172, (17, 22), TINTA, 2.2, .4))
    out.append(f'<path d="M566 186 h34" stroke="{TINTA}" stroke-width="1.3" opacity=".5" fill="none"/>'
               f'<path d="M566 183 v6 M583 184 v4 M600 183 v6" stroke="{TINTA}" stroke-width="1.2" '
               f'opacity=".5" fill="none"/>'
               f'<rect x="566" y="186" width="8.5" height="2.4" fill="{TINTA}" opacity=".45"/>')
    return ''.join(out)


def _cultura():
    """Simbolo de cultura: disco de piedra con emblema de laton en relieve."""
    import math
    k = C
    cx, cy, R = 502, 256, 30
    out = [f'<ellipse cx="{cx + 3}" cy="{cy + 28}" rx="30" ry="5" fill="{TINTA}" opacity=".26" filter="url(#b5)"/>',
           f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="url(#mun_dis)"/>',
           f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="{C["grafito"]}" stroke-width="1.6" opacity=".55"/>',
           f'<circle cx="{cx}" cy="{cy}" r="{R - 4.5}" fill="none" stroke="{C["oroS"]}" stroke-width="1.2" opacity=".8"/>']
    for i in range(8):
        a = i * math.pi / 4
        out.append(f'<path d="M{cx + (R - 6) * math.sin(a):.1f} {cy - (R - 6) * math.cos(a):.1f} '
                   f'L{cx + (R - 10) * math.sin(a):.1f} {cy - (R - 10) * math.cos(a):.1f}" '
                   f'stroke="{C["oro"]}" stroke-width="1.6" opacity=".85"/>')
    # emblema: triangulo hueco + anillo + tres puntos
    out.append(f'<path d="M{cx} {cy - 15} l14 24 h-28 Z" fill="none" stroke="{C["oroS"]}" stroke-width="5"/>')
    out.append(f'<path d="M{cx} {cy - 16} l14 24 h-28 Z" fill="none" stroke="url(#mun_emb)" stroke-width="3.4"/>')
    out.append(f'<circle cx="{cx}" cy="{cy + 1}" r="7" fill="none" stroke="{C["oroS"]}" stroke-width="4"/>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="7" fill="none" stroke="url(#mun_emb)" stroke-width="2.6"/>')
    out.append(f'<circle cx="{cx - 9}" cy="{cy + 13}" r="2.2" fill="{C["oroL"]}"/>'
               f'<circle cx="{cx}" cy="{cy + 16}" r="2.2" fill="{C["oroL"]}"/>'
               f'<circle cx="{cx + 9}" cy="{cy + 13}" r="2.2" fill="{C["oroL"]}"/>')
    out.append(f'<path d="M{cx - 21} {cy - 17} A{R} {R} 0 0 1 {cx + 7} {cy - 29}" fill="none" '
               f'stroke="#fff" stroke-width="3.4" stroke-linecap="round" opacity=".45" filter="url(#b2)"/>')
    out.append(_nombre(544, 240, (30, 18), TINTA, 2.4, .5))
    out.append(_nombre(544, 252, (22, 26), TINTA, 2.4, .42))
    out.append(_nombre(544, 264, (16, 30), TINTA, 2.4, .42))
    return ''.join(out)


def _calendario():
    """Calendario propio: rueda de nueve tramos, uno todavia sin cerrar."""
    import math
    k = C
    cx, cy, R = 497, 348, 30
    out = [f'<ellipse cx="{cx + 3}" cy="{cy + 28}" rx="29" ry="5" fill="{TINTA}" opacity=".24" filter="url(#b5)"/>',
           f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="url(#mun_cal)"/>']
    cols = (k['turq'], k['oro'], k['roj'], k['viol'], k['verd'], k['turqL'], k['oroL'], k['azul'])
    for i in range(9):
        a0, a1 = i * 2 * math.pi / 9 - math.pi / 2, (i + 1) * 2 * math.pi / 9 - math.pi / 2
        x0, y0 = cx + R * math.cos(a0), cy + R * math.sin(a0)
        x1, y1 = cx + R * math.cos(a1), cy + R * math.sin(a1)
        if i == 8:      # el tramo que falta por decidir
            out.append(f'<path d="M{cx} {cy} L{x0:.1f} {y0:.1f} A{R} {R} 0 0 1 {x1:.1f} {y1:.1f} Z" '
                       f'fill="none" stroke="{C["grafito"]}" stroke-width="1.8" stroke-dasharray="5 4" opacity=".55"/>')
            continue
        out.append(f'<path d="M{cx} {cy} L{x0:.1f} {y0:.1f} A{R} {R} 0 0 1 {x1:.1f} {y1:.1f} Z" '
                   f'fill="{cols[i]}" opacity=".85"/>')
        am = (a0 + a1) / 2
        out.append(f'<path d="M{cx + R * .5 * math.cos(am):.1f} {cy + R * .5 * math.sin(am):.1f} '
                   f'l{5.5 * math.cos(am):.1f} {5.5 * math.sin(am):.1f}" stroke="{C["papL"]}" '
                   f'stroke-width="1.8" stroke-linecap="round" opacity=".85"/>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="url(#mun_vidr)" opacity=".5"/>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="none" stroke="{C["madS"]}" stroke-width="3"/>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="{R - 3}" fill="none" stroke="{C["madLL"]}" '
               f'stroke-width="1" opacity=".6"/>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="{R * .3:.1f}" fill="{C["papS"]}"/>')
    out.append(f'<circle cx="{cx}" cy="{cy - .8}" r="{R * .24:.1f}" fill="{C["papL"]}"/>')
    # aguja
    out.append(f'<path d="M{cx} {cy} L{cx + 15} {cy - 19} l3 5z" fill="{C["rojS"]}"/>')
    out.append(f'<path d="M{cx} {cy} L{cx + 15} {cy - 19} l-1 5z" fill="{C["rojL"]}"/>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="3.2" fill="{C["grafito"]}"/>')
    out.append(f'<circle cx="{cx - .8}" cy="{cy - 1}" r="1.4" fill="{C["nubeL"]}"/>')
    out.append(_nombre(538, 332, (28, 14), TINTA, 2.4, .5))
    out.append(_nombre(538, 344, (18, 24), TINTA, 2.4, .42))
    out.append(_nombre(538, 356, (24,), TINTA, 2.4, .36))
    out.append(f'<path d="M538 366 h34" stroke="{C["grafito"]}" stroke-width="2" stroke-dasharray="4 4" '
               f'opacity=".4" fill="none"/>')
    return ''.join(out)


# ---------------------------------------------------------------------------
def escena():
    k = C
    d = (
        # ambiente
        lg('mun_pared', 0, 0, 0, 1, [(0, '#2a2233', None), (.55, '#3b3040', None), (1, '#4a3a3c', None)])
        + lg('mun_mesa', .1, 0, .9, 1, [(0, k['madL'], None), (.3, k['mad'], None),
                                        (.72, '#7c5533', None), (1, k['madS'], None)])
        + rg('mun_lampara', .13, .02, .92, [(0, '#ffeec2', .8), (.4, '#ffd98f', .26), (1, '#ffd08a', 0)])
        + rg('mun_pool', .26, .52, .72, [(0, '#ffe3ad', .42), (.55, '#ffd79a', .14), (1, '#ffd79a', 0)])
        # pergamino
        + lg('mun_perg', .1, 0, .95, 1, [(0, '#ead7a6', None), (.26, '#dcc491', None), (.66, '#c2a470', None), (1, '#a08152', None)])
        + lg('mun_rev', 0, 0, 1, 1, [(0, '#fff3d9', None), (.5, PG_REV, None), (1, '#b89a6c', None)])
        # mar y tierra
        + lg('mun_mar', .1, 0, .95, 1, [(0, '#0e3243', None), (.45, '#0a2434', None), (1, '#06161f', None)])
        + rg('mun_hondo', .38, .34, .72, [(0, '#1b5570', .2), (.5, '#0a2434', 0), (1, '#03101a', .5)])
        + lg('mun_tie', .1, 0, .88, 1, [(0, '#d9c493', None), (.32, '#c7ac78', None), (.74, '#ae9161', None), (1, '#8f7444', None)])
        + rg('mun_relieve', .3, .24, .8, [(0, '#ffeec0', .38), (.45, '#e3d09c', .06), (1, '#7d6739', .42)])
        + lg('mun_mfL', .05, .05, .95, .95, [(0, '#e9dcc0', None), (.45, '#d2c2a0', None), (1, '#ab9a7b', None)])
        + lg('mun_mfS', .05, .05, .9, 1, [(0, '#8d7c63', None), (.45, '#6d5f48', None), (1, '#53442f', None)])
        + lg('mun_macizo', .1, .1, .9, 1, [(0, '#d9c9a6', None), (.4, '#b9a682', None), (1, '#7d6a50', None)])
        + lg('mun_mtL', .05, .05, .95, .95, [(0, '#fdf6e4', None), (.38, '#e6d7b6', None), (.74, '#c6b593', None), (1, '#9d8a69', None)])
        + lg('mun_mtS', .05, .05, .9, 1, [(0, '#7b6a50', None), (.42, '#57493580', None), (1, '#372c1e', None)])
        + lg('mun_rio', 0, 0, 0, 1, [(0, MAR_LL, None), (.45, MAR_L, None), (1, MAR, None)])
        # objetos
        + lg('mun_lat', 0, 0, 1, 1, [(0, k['oroLL'], None), (.5, k['oro'], None), (1, k['oroS'], None)])
        + lg('mun_aro', .1, 0, .9, 1, [(0, k['oroLL'], None), (.3, k['oroL'], None),
                                       (.62, k['oroS'], None), (1, k['oro'], None)])
        + lg('mun_emb', .1, 0, .9, 1, [(0, k['oroLL'], None), (.55, k['oroL'], None), (1, k['oro'], None)])
        + lg('mun_fic', .1, 0, .9, 1, [(0, '#fbf4e4', None), (.55, '#efe4cd', None), (1, '#dccfb2', None)])
        + lg('mun_hoj', .1, 0, .9, 1, [(0, '#9cb973', None), (.42, '#5d8045', None), (1, '#38522e', None)])
        + lg('mun_hojb', .1, 0, .9, 1, [(0, '#77985a', None), (.45, '#466936', None), (1, '#2b4227', None)])
        + lg('mun_tallo', 0, 0, 1, 0, [(0, '#9cb973', None), (.42, '#5c8045', None), (1, '#31492b', None)])
        + rg('mun_vain', .32, .24, .9, [(0, '#e8c68a', None), (.45, '#bd8a45', None), (1, '#7d5424', None)])
        + rg('mun_cort', .32, .26, .9, [(0, '#f2e5bf', None), (.55, '#cdb27d', None), (1, '#8b6f45', None)])
        + rg('mun_dis', .3, .24, .9, [(0, '#8d97a3', None), (.5, '#5d6874', None), (1, '#333c47', None)])
        + rg('mun_cal', .3, .26, .9, [(0, '#fbf4e4', None), (1, '#cdbf9e', None)])
        + lg('mun_vidr', .1, 0, .8, 1, [(0, '#fff', .55), (.42, '#fff', .05), (1, '#fff', 0)])
        + lg('mun_est', 0, 0, 0, 1, [(0, '#6a5660', None), (1, '#2a232e', None)])
        + lg('mun_glob', .3, .2, 1, 1, [(0, '#7fa6b8', None), (.6, '#3f6a83', None), (1, '#24445a', None)])
        + lg('mun_lapiz', 0, 0, 0, 1, [(0, k['madLL'], None), (.35, k['madL'], None), (1, k['madS'], None)])
        + rg('mun_calor', .1, .04, .95, [(0, '#fff2cd', .42), (.42, '#ffe7b0', .12), (1, '#ffe7b0', 0)])
        + rg('mun_vin', .48, .44, .72, [(.5, '#000', 0), (1, '#120a14', .56)])
        + '<clipPath id="mun_cpm"><path d="M48 126 H398 V310 L378 340 H48 Z"/></clipPath>'
        + '<clipPath id="mun_cpt"><path transform="translate(0 5)" d="' + COSTA + '"/></clipPath>'
    )

    # ── mar, costa y batimetria ────────────────────────────────────────────
    def _plataforma():
        """La orilla se aclara y el agua se oscurece mar adentro: trazos anchos
        y desenfocados centrados en el propio contorno; la mitad que cae en
        tierra queda despues tapada por el continente."""
        o = []
        for gr, col, bl in ((64, '#153f52', 'b22'), (44, '#1c5468', 'b22'),
                            (30, '#266a7a', 'b12'), (19, '#33808b', 'b5'),
                            (10, '#4a9a9b', 'b5')):
            for pth, f in ((COSTA, 1), (ISLA_A, .6), (ISLA_B, .5)):
                o.append(f'<path d="{pth}" fill="none" stroke="{col}" stroke-width="{gr * f:.0f}" '
                         f'filter="url(#{bl})"/>')
        return ''.join(o)

    def _isobatas():
        o = []
        for i, (dist, gr, op) in enumerate(((40, 1.2, .24), (24, 1.0, .2))):
            o.append(f'<path d="{_suave(_fuera(PTS[::2], dist), .2)}" fill="none" stroke="{MAR_LL}" '
                     f'stroke-width="{gr}" stroke-dasharray="{7 - i} {5 + i}" opacity="{op}"/>')
        return ''.join(o)

    mar = (
        f'<rect x="44" y="120" width="360" height="228" fill="url(#mun_mar)"/>'
        f'<rect x="44" y="120" width="360" height="228" fill="url(#mun_hondo)"/>'
        + _isobatas()
        + _plataforma()
        # marcas de oleaje, solo en aguas hondas
        + ''.join(
            f'<path d="M{x} {y} q5 -3.5 10 0 q5 3.5 10 0" fill="none" stroke="{MAR_LL}" '
            f'stroke-width="1.6" opacity=".24"/>'
            for x, y in ((52, 246), (52, 258), (328, 318), (322, 132)))
        # isla que se esta proponiendo: todavia a lapiz
        + f'<path d="{ISLA_FANTASMA}" fill="none" stroke="{C["grafito"]}" stroke-width="2" '
        f'stroke-dasharray="6 5" opacity=".6"/>'
        f'<path d="M66 216 q5 -4 9 0 M62 224 q5 -4 9 0" fill="none" stroke="{C["grafito"]}" '
        f'stroke-width="1.5" opacity=".45"/>'
        # ── islas
        + f'<path d="{ISLA_A}" fill="url(#mun_tie)"/><path d="{ISLA_A}" fill="url(#mun_relieve)" opacity=".55"/>'
        f'<path d="M357 158 l8 -13 l9 13z" fill="{ROCA_S}"/><path d="M357 158 l8 -13 l3 13z" fill="{ROCA_LL}"/>'
        f'<circle cx="371" cy="162" r="3.4" fill="{VERDE}"/><circle cx="363" cy="165" r="2.8" fill="{VERDE_S}"/>'
        f'<path d="{ISLA_A}" fill="none" stroke="{TINTA}" stroke-width="1.9" opacity=".88"/>'
        f'<path d="{ISLA_B}" fill="url(#mun_tie)"/>'
        f'<circle cx="374" cy="214" r="3" fill="{VERDE}"/>'
        f'<path d="{ISLA_B}" fill="none" stroke="{TINTA}" stroke-width="1.7" opacity=".85"/>'
        # ── continente
        + f'<path d="{COSTA}" fill="{TINTA}" opacity=".36" transform="translate(3 5)" filter="url(#b5)"/>'
        f'<path d="{COSTA}" fill="url(#mun_tie)"/>'
        f'<path d="{COSTA}" fill="url(#mun_relieve)" opacity=".6"/>'
        f'<g clip-path="url(#mun_cpt)">'
        # borde interior: la tierra se oscurece justo en la orilla
        f'<path d="{COSTA}" fill="none" stroke="#f2e4c2" stroke-width="8" opacity=".5" filter="url(#b2)"/><path d="{COSTA}" fill="none" stroke="{ROCA_S}" stroke-width="30" opacity=".2" filter="url(#b12)" transform="translate(4 5)"/>'
        # sombra que la cordillera echa sobre la tierra, hacia el sureste
        f'<path d="M148 230 C186 212 244 208 292 226 C266 250 206 256 154 240 Z" fill="{ROCA_S}" '
        f'opacity=".26" filter="url(#b12)"/>'
        + f'<path d="M120 200 C150 172 200 164 236 176 C214 204 166 216 126 214 Z" fill="#f4e6bd" '
        f'opacity=".3" filter="url(#b12)"/>'
        f'<path d="M200 262 C240 250 290 258 312 282 C274 306 214 306 186 288 Z" fill="#9a8253" '
        f'opacity=".22" filter="url(#b12)"/>'
        # bosques como masa con textura, no manchas planas
        + f'<path d="{BOSQUE}" fill="{VERDE_S}" opacity=".9"/>'
        + _copas(243, 288, 26, 15, 34, 11)
        + f'<path d="{BOSQUE_2}" fill="{VERDE_S}" opacity=".9"/>'
        + _copas(176, 255, 19, 12, 16, 29)
        # rio: baja de la montana y se ensancha hasta el mar
        + f'<path d="{RIO}" fill="none" stroke="{ROCA_S}" stroke-width="5" opacity=".34" '
        f'transform="translate(2 3)" filter="url(#b2)"/>'
        f'<path d="{RIO}" fill="none" stroke="url(#mun_rio)" stroke-width="3" stroke-linecap="round"/>'
        f'<path d="{RIO_2}" fill="none" stroke="url(#mun_rio)" stroke-width="4.6" stroke-linecap="round"/>'
        f'<path d="{RIO_3}" fill="none" stroke="url(#mun_rio)" stroke-width="6.6" stroke-linecap="round"/>'
        f'<path d="{RIO_4}" fill="none" stroke="url(#mun_rio)" stroke-width="9" stroke-linecap="round"/>'
        f'<ellipse cx="199" cy="253" rx="11" ry="7" fill="{MAR_S}"/>'
        f'<ellipse cx="199" cy="252" rx="10" ry="6" fill="{MAR_L}"/>'
        f'<ellipse cx="196" cy="250" rx="4.5" ry="2" fill="{MAR_LL}" opacity=".85"/>'
        # cordillera: primero el macizo que une los picos, luego las cumbres
        + f'<path d="M126 234 C138 216 150 208 162 212 C172 200 182 194 192 198 C200 186 210 180 219 186 '
        f'C229 178 240 178 248 188 C258 184 268 190 274 200 C284 198 292 208 296 220 '
        f'C299 228 299 234 297 238 Z" fill="{ROCA_S}" opacity=".5" filter="url(#b5)" '
        f'transform="translate(6 7)"/>'
        f'<path d="M126 234 C138 216 150 208 162 212 C172 200 182 194 192 198 C200 186 210 180 219 186 '
        f'C229 178 240 178 248 188 C258 184 268 190 274 200 C284 198 292 208 296 220 '
        f'C299 228 299 234 297 238 Z" fill="url(#mun_macizo)"/>'
        + ''.join(_pico(*p, lejos=True) for p in PICOS_F)
        + ''.join(_pico(*p) for p in PICOS)
        + f'<path d="M132 232 C170 222 230 220 296 234 C240 248 180 248 136 240 Z" fill="#6b5a45" '
        f'opacity=".28" filter="url(#b5)"/>'
        + '</g>'
        # delta: el rio se abre al entrar en el mar
        # la desembocadura tine el agua: pluma de sedimento, sin bordes duros
        + f'<ellipse cx="201" cy="312" rx="20" ry="13" fill="{MAR_L}" opacity=".5" filter="url(#b5)"/>'
        f'<ellipse cx="201" cy="307" rx="11" ry="7" fill="{MAR_LL}" opacity=".35" filter="url(#b5)"/>'
        # costa a tinta
        + f'<path d="{COSTA}" fill="none" stroke="{TINTA}" stroke-width="2.4" opacity=".92"/>'
        # marcadores y nombres simulados
        + _marcador(268, 161, k['rojL'], k['rojS']) + _nombre(277, 174, (9, 11))
        + _marcador(209, 292, k['oroL'], k['oroS']) + _nombre(218, 290, (10, 15))
        + _marcador(95, 292, k['turqL'], k['turqS']) + '<g transform="rotate(-34 106 288)">' + _nombre(106, 288, (11, 13), TINTA, 2.0, .55) + '</g>'
        + _marcador(153, 213, k['violL'], k['violS'], 4.6) + _nombre(161, 211, (9, 13))
        + _marcador(248, 281, k['verdL'], k['verdS'], 4.6) + _nombre(257, 279, (13, 8))
        # ruta entre los extremos habitados, a trazos, y aldeas pequenas
        + f'<path d="M100 289 C140 276 168 252 196 236 C224 220 248 186 266 166" fill="none" '
        f'stroke="{TINTA}" stroke-width="1.6" stroke-dasharray="5 4" opacity=".45"/>'
        + ''.join(f'<circle cx="{x}" cy="{y}" r="2" fill="{TINTA}" opacity=".6"/>'
                  f'<circle cx="{x - .6}" cy="{y - .7}" r="1" fill="{PG_LL}" opacity=".8"/>'
                  for x, y in ((137, 268), (176, 232), (232, 262), (290, 232), (213, 175)))
        # hueco marcado a lapiz y el marcador nuevo, todavia en el aire
        + f'<circle cx="222" cy="288" r="7" fill="none" stroke="{C["grafito"]}" stroke-width="2" '
        f'stroke-dasharray="4 4" opacity=".65"/>'
        f'<ellipse cx="224" cy="288" rx="8" ry="2.6" fill="{TINTA}" opacity=".32" filter="url(#b2)"/>'
        f'<g transform="rotate(-16 227 268)">' + _marcador(227, 268, k['oroL'], k['oroS'], 6.2) + '</g>'
        + ''.join(f'<path d="M{x} {y - 4} v8 M{x - 4} {y} h8" stroke="{k["oroLL"]}" stroke-width="1.6" '
                  f'stroke-linecap="round" opacity=".85"/>' for x, y in ((241, 256), (249, 268))))

    # ── pergamino: forma con bordes ondulados y esquina levantada ──────────
    perg = ('M30 108 C140 102 300 104 432 106 C436 170 434 250 436 300 '
            'L366 368 C260 372 140 368 34 364 C26 250 28 170 30 108 Z')
    solapa = 'M436 300 L366 368 L368 298 C392 291 418 293 436 300 Z'

    mapa = (
        f'<g transform="rotate(-1.6 232 236)">'
        # sombra propia del pergamino sobre la mesa
        f'<g filter="url(#sombra)"><path d="{perg}" fill="{PG}"/></g>'
        f'<path d="{perg}" fill="url(#mun_perg)"/>'
        f'<path d="{perg}" fill="url(#mun_calor)"/>'
        # el papel se curva: banda oscura en el borde inferior y luz en el superior
        f'<path d="M34 364 C140 368 260 372 366 368 L360 358 C258 362 140 358 36 354 Z" '
        f'fill="{PG_S}" opacity=".5" filter="url(#b5)"/>'
        f'<path d="M30 108 C140 102 300 104 432 106 L432 114 C300 112 140 110 31 116 Z" '
        f'fill="{PG_LL}" opacity=".75" filter="url(#b2)"/>'
        f'<path d="M30 108 C26 170 28 250 34 364 L44 360 C39 250 37 170 40 112 Z" '
        f'fill="{PG_LL}" opacity=".6" filter="url(#b2)"/>'
        # fibra del papel
        f'<path d="{perg}" filter="url(#fibra)" style="mix-blend-mode:multiply" opacity=".15"/>'
        # marco del mapa
        f'<rect x="44" y="122" width="358" height="222" rx="2" fill="none" stroke="{C["madS"]}" '
        f'stroke-width="3" opacity=".7"/>'
        f'<rect x="47" y="125" width="352" height="216" rx="1" fill="none" stroke="{C["madS"]}" '
        f'stroke-width=".9" opacity=".45"/>'
        # el mapa
        f'<g clip-path="url(#mun_cpm)">{mar}</g>'
        # rosa de los vientos, apoyada sobre el mapa
        f'<g clip-path="url(#mun_cpm)">{_rosa(358, 286, 31)}</g>'
        # cartela del titulo, en el margen de arriba
        f'<g transform="rotate(-.8 118 116)">'
        f'<path d="M44 106 h150 l-8 10 8 10 h-150 l8 -10 Z" fill="{PG_S}" opacity=".55" filter="url(#b2)"/>'
        f'<path d="M42 104 h150 l-8 10 8 10 h-150 l8 -10 Z" fill="{PG_L}" stroke="{C["madS"]}" '
        f'stroke-width="1.4"/>'
        + _nombre(60, 110, (24, 14, 30), TINTA, 3.0, .68)
        + _nombre(60, 119, (18, 36, 12), TINTA, 2.0, .42)
        + '</g>'
        # escala, abajo a la izquierda del margen
        + f'<path d="M58 352 h68" stroke="{TINTA}" stroke-width="1.6" opacity=".6" fill="none"/>'
        f'<path d="M58 348 v8 M92 349 v6 M126 348 v8" stroke="{TINTA}" stroke-width="1.6" '
        f'opacity=".6" fill="none"/>'
        f'<rect x="58" y="352" width="17" height="3.4" fill="{TINTA}" opacity=".55"/>'
        f'<rect x="92" y="352" width="17" height="3.4" fill="{TINTA}" opacity=".55"/>'
        + _nombre(136, 354, (12, 8), TINTA, 2.0, .45)
        # esquina levantada: sombra y reverso
        + f'<path d="M436 300 L366 368 L368 298 Z" fill="{TINTA}" opacity=".4" '
        f'transform="translate(9 11)" filter="url(#b5)"/>'
        f'<path d="{solapa}" fill="url(#mun_rev)"/>'
        f'<path d="{solapa}" filter="url(#fibra)" style="mix-blend-mode:multiply" opacity=".2"/>'
        f'<path d="M436 300 L366 368" stroke="{PG_S}" stroke-width="1.6" opacity=".8" fill="none"/>'
        f'<path d="M368 298 C392 291 418 293 436 300" stroke="#fff" stroke-width="1.8" '
        f'opacity=".55" fill="none"/>'
        f'</g>')

    # ── lapiz de carpintero en primer plano, sobre el borde del pergamino ──
    lapiz = (f'<g transform="rotate(-9 130 366)" filter="url(#sombraC)">'
             f'<rect x="60" y="358" width="126" height="15" rx="3" fill="url(#mun_lapiz)"/>'
             f'<rect x="60" y="358" width="126" height="5" rx="2.5" fill="#fff" opacity=".3"/>'
             f'<rect x="60" y="369" width="126" height="4" fill="{C["noche"]}" opacity=".2"/>'
             f'<path d="M60 358 l-18 7.5 l18 7.5z" fill="{PG_L}"/>'
             f'<path d="M60 358 l-18 7.5 l18 3z" fill="{PG_LL}"/>'
             f'<path d="M45 364 l-8 1.5 l8 2.5z" fill="{C["grafito"]}"/>'
             f'<rect x="172" y="358" width="14" height="15" rx="2" fill="{C["turq"]}"/>'
             f'<rect x="172" y="358" width="14" height="5" rx="2" fill="{C["turqL"]}"/></g>')

    return svg(
        # ── ambiente: pared en penumbra, estanteria desenfocada y lampara
        f'<rect width="{W}" height="{H}" fill="url(#mun_pared)"/>'
        f'<g filter="url(#b5)" opacity=".92">'
        f'<rect x="352" y="0" width="288" height="86" fill="url(#mun_est)"/>'
        f'<rect x="352" y="76" width="288" height="12" fill="#1f1a24"/>'
        + ''.join(f'<rect x="{x}" y="{y}" width="{w}" height="{76 - y}" rx="2" fill="{c}" opacity=".85"/>'
                  for x, y, w, c in ((368, 30, 11, '#6d4a3c'), (381, 24, 9, '#4d5a6b'),
                                     (392, 32, 13, '#7a6238'), (407, 26, 8, '#5b4460'),
                                     (417, 34, 12, '#3f5b52'), (432, 22, 10, '#6d4a3c'),
                                     (444, 30, 9, '#4d5a6b')))
        + f'<circle cx="536" cy="44" r="34" fill="url(#mun_glob)"/>'
        f'<path d="M514 34 q14 -6 26 2 q12 8 26 2" fill="none" stroke="#8fb9a0" stroke-width="7" opacity=".6"/>'
        f'<path d="M518 54 q16 8 32 -2" fill="none" stroke="#8fb9a0" stroke-width="6" opacity=".5"/>'
        f'<path d="M520 80 h32 M530 74 h12 v10 h-12z" fill="#3a2f2a" stroke="#3a2f2a" stroke-width="5"/>'
        f'</g>'
        # pantalla de lampara arriba a la izquierda, fuera de foco
        f'<g filter="url(#b12)" opacity=".92">'
        f'<path d="M22 -24 L146 -24 L176 44 L-8 44 Z" fill="#6b4630"/>'
        f'<path d="M-8 44 L176 44 L172 52 L-4 52 Z" fill="#ffe0a0" opacity=".9"/></g>'
        f'<rect width="{W}" height="120" fill="url(#mun_lampara)"/>'
        # ── mesa con veta
        f'<rect x="0" y="84" width="{W}" height="316" fill="url(#mun_mesa)"/>'
        f'<rect x="0" y="84" width="{W}" height="316" filter="url(#veta)" '
        f'style="mix-blend-mode:multiply" opacity=".26"/>'
        f'<rect x="0" y="84" width="{W}" height="4" fill="{C["madLL"]}" opacity=".6"/>'
        f'<rect x="0" y="88" width="{W}" height="18" fill="{C["noche"]}" opacity=".16"/>'
        f'<rect x="0" y="84" width="{W}" height="316" fill="url(#mun_pool)"/>'
        # ── mapa
        + mapa
        # ── hilos que atan las fichas al mapa, clavados con su nudo
        + _hilo(430, 162, 470, 142, 16)
        + _hilo(434, 252, 478, 246, 14)
        + _hilo(404, 298, 468, 340, 16)
        + lapiz
        # ── fichas apoyadas en la mesa
        + _ficha(456, 100, 168, 102, -4, _especimen())
        + _ficha(462, 212, 166, 88, 3, _cultura())
        + _ficha(452, 306, 166, 84, -2.5, _calendario())
        # ── viñeteado y grano
        + f'<rect width="{W}" height="{H}" filter="url(#grano)" style="mix-blend-mode:overlay" opacity=".07"/>'
        f'<rect width="{W}" height="{H}" fill="url(#mun_vin)"/>',
        d)
