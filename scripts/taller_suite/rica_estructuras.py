# -*- coding: utf-8 -*-
"""Escena rica de Estructuras y puentes (R54).

Mismo relato que la escena plana: un puente de celosía sobre el río, con sus
pilares, un camión de prueba cruzando, las flechas de carga y una barra que
todavía está bajando a su hueco. Lo que cambia es el acabado: luz baja de
tarde con una sola dirección (arriba a la izquierda), agua con material y
reflejo deformado, barras con cara iluminada y canto en sombra, hormigón con
textura y una orilla nítida en primer plano contra un fondo desenfocado.
"""
import math

from taller_suite.escenas_ricas import C, W, H, svg, lg, rg, sombra_suelo

# Dirección de la luz clave: sol bajo, arriba a la izquierda.
LX, LY = -0.55, -0.8

# Geometría maestra del puente ------------------------------------------------
Y0, Y1 = 178.0, 92.0                     # cordón inferior / superior de la celosía
DECK = 24.0                              # canto del tablero
BN = (56.0, 152.0, 248.0, 344.0, 440.0, 536.0)   # nudos de abajo
TN = (104.0, 200.0, 296.0, 392.0, 488.0)         # nudos de arriba
PIL = (152.0, 440.0)                     # ejes de los dos pilares en el río
HUECO = (440.0, Y0, 488.0, Y1)           # la diagonal que falta
AGUA = 238.0                             # horizonte del agua
PIE = 322.0                              # cota donde los pilares entran en el agua


def _n(v):
    return round(v, 1)


def _pts(seq):
    return ' '.join('%s,%s' % (_n(x), _n(y)) for x, y in seq)


def _orilla(x):
    """Borde de la orilla cercana: una curva orgánica, no una recta."""
    return 348.0 - 9.0 * math.sin(x / 71.0) - 4.5 * math.cos(x / 29.0)


def barra(x1, y1, x2, y2, w, base, luz, som, rim=None, ext=0.0, bri=None):
    """Una barra con volumen: cara iluminada arriba-izquierda, canto en sombra."""
    dx, dy = x2 - x1, y2 - y1
    L = math.hypot(dx, dy) or 1.0
    ux, uy = dx / L, dy / L
    nx, ny = -uy, ux
    if nx * LX + ny * LY < 0:          # la normal tiene que mirar hacia la luz
        nx, ny = -nx, -ny
    x1 -= ux * ext
    y1 -= uy * ext
    x2 += ux * ext
    y2 += uy * ext
    h = w / 2.0

    def q(a, b):
        return _pts([(x1 + nx * h * a, y1 + ny * h * a),
                     (x2 + nx * h * a, y2 + ny * h * a),
                     (x2 + nx * h * b, y2 + ny * h * b),
                     (x1 + nx * h * b, y1 + ny * h * b)])

    out = (f'<polygon points="{q(1, -1)}" fill="{base}"/>'
           f'<polygon points="{q(1, .3)}" fill="{luz}"/>'
           f'<polygon points="{q(-.2, -1)}" fill="{som}"/>')
    if bri:
        out += f'<polygon points="{q(1, .82)}" fill="{bri}" opacity=".7"/>'

    if rim:
        out += (f'<line x1="{_n(x1 + nx * h)}" y1="{_n(y1 + ny * h)}" '
                f'x2="{_n(x2 + nx * h)}" y2="{_n(y2 + ny * h)}" '
                f'stroke="{rim}" stroke-width="2.2" opacity=".9"/>')
    return out


def _miembros():
    """Diagonales y cordón superior, sin la barra que falta."""
    ms = []
    for i, tx in enumerate(TN):
        a = (BN[i], Y0, tx, Y1)
        if a != HUECO:
            ms.append(a)
        ms.append((tx, Y1, BN[i + 1], Y0))
    for i in range(len(TN) - 1):
        ms.append((TN[i], Y1, TN[i + 1], Y1))
    return ms


MIEMBROS = _miembros()


def _silueta(w=16):
    """Líneas gordas de toda la celosía: sirven de sombra y de reflejo."""
    s = f'<line x1="40" y1="{Y0}" x2="552" y2="{Y0}" stroke-width="{w}"/>'
    for x1, y1, x2, y2 in MIEMBROS:
        s += (f'<line x1="{_n(x1)}" y1="{_n(y1)}" x2="{_n(x2)}" y2="{_n(y2)}" '
              f'stroke-width="{w}"/>')
    return s


def escena():
    k = C
    cem, cemL, cemLL, cemS = '#a89a86', '#d8caae', '#f2e6c8', '#5f564a'

    d = (
        # ── cielo de tarde, sol bajo y bruma de horizonte
        lg('est_cielo', 0, 0, 0, 1, [(0, '#14507b', None), (.2, '#4e8cb4', None),
                                     (.44, '#9bb5bc', None), (.66, '#e2b982', None),
                                     (.85, '#ffc478', None), (1, '#ffd79c', None)])
        + rg('est_sol', .5, .5, .5, [(0, '#fff4d2', .95), (.24, '#ffdd9c', .6),
                                     (.58, '#ffb469', .26), (1, '#ff9448', 0)])
        + lg('est_bruma', 0, 0, 0, 1, [(0, '#ffdfb0', 0), (1, '#ffdfb0', .85)])
        + lg('est_colina', 0, 0, 0, 1, [(0, '#71879f', None), (1, '#9aacbc', None)])
        + lg('est_colina2', 0, 0, 0, 1, [(0, '#5f7a68', None), (1, '#8d9d84', None)])
        + lg('est_banco', 0, 0, 0, 1, [(0, '#cbb083', None), (1, '#8d9464', None)])
        # ── agua
        + lg('est_agua', 0, 0, 0, 1, [(0, '#e3c795', None), (.08, '#93a39f', None),
                                      (.3, '#2f6180', None), (.68, '#1a4763', None),
                                      (1, '#0d3149', None)])
        + lg('est_orilla', 0, 0, 0, 1, [(0, '#cdb98e', 0), (1, '#bda67c', .34)])
        + lg('est_brillo', 0, 0, 0, 1, [(0, '#fffbe8', .95), (1, '#ffc87a', .15)])
        # ── tablero, pilares, nudos
        + lg('est_deck', 0, 0, 0, 1, [(0, '#f0d3a4', None), (.2, k['madL'], None),
                                      (.58, k['mad'], None), (1, k['madS'], None)])
        + lg('est_pilar', 0, 0, 1, 0, [(0, cemLL, None), (.26, cemL, None),
                                       (.66, cem, None), (1, cemS, None)])
        + lg('est_cap', 0, 0, 0, 1, [(0, cemLL, None), (1, cem, None)])
        + rg('est_nodo', .3, .26, .82, [(0, '#5e9dc4', None), (.42, '#2a6389', None),
                                        (1, '#0b3046', None)])
        # ── camión
        + lg('est_caja', .1, 0, .9, 1, [(0, k['rojL'], None), (.4, k['roj'], None),
                                        (1, k['rojS'], None)])
        + lg('est_cabina', 0, 0, 0, 1, [(0, k['rojL'], None), (.52, k['roj'], None),
                                        (1, k['rojS'], None)])
        + lg('est_cris', .05, 0, .95, 1, [(0, '#f0f8ff', None), (.45, '#9ec7e0', None),
                                          (1, '#41718f', None)])
        # ── orilla cercana
        + lg('est_hierba', .1, 0, .5, 1, [(0, k['verdLL'], None), (.16, k['verdL'], None),
                                          (.52, k['verd'], None), (1, '#153f1c', None)])
        + rg('est_piedra', .3, .24, .84, [(0, '#f6ecd8', None), (.42, '#c0b39a', None),
                                          (1, '#5f584a', None)])
        # ── pases de luz cálida y sombra fría
        + rg('est_calor', .17, .18, .85, [(0, '#ffdda0', .5), (.5, '#ffbc70', .2),
                                          (1, '#ff9d50', 0)])
        + lg('est_frio', .3, 0, 1, 1, [(0, '#2b4a6b', 0), (.6, '#2b4a6b', .04),
                                       (1, '#16304a', .13)])
        # ── filtros y recortes propios
        + '<filter id="est_som" x="-70%" y="-70%" width="250%" height="260%">'
          '<feDropShadow dx="14" dy="21" stdDeviation="8" flood-color="#0d1b2a" '
          'flood-opacity=".45"/></filter>'
        + '<filter id="est_b3" x="-40%" y="-40%" width="180%" height="180%">'
          '<feGaussianBlur stdDeviation="3"/></filter>'
        + f'<clipPath id="est_cpagua"><rect x="0" y="{AGUA}" width="{W}" height="{H - AGUA}"/></clipPath>'
        + ''.join(
            f'<clipPath id="est_cp{i}"><polygon points="'
            f'{_pts([(cx - 27, 208), (cx + 27, 208), (cx + 23, PIE + 4), (cx - 23, PIE + 4)])}"/></clipPath>'
            for i, cx in enumerate(PIL))
    )

    # ══ 1 · cielo, sol y nubes ════════════════════════════════════════════════
    cuerpo = (
        f'<rect width="{W}" height="{H}" fill="#f0c48c"/>'
        f'<rect width="{W}" height="{AGUA + 10}" fill="url(#est_cielo)"/>'
        f'<circle cx="100" cy="88" r="182" fill="url(#est_sol)"/>'
        f'<circle cx="100" cy="88" r="34" fill="#ffe7ae" opacity=".9" filter="url(#b5)"/>'
        f'<circle cx="100" cy="88" r="21" fill="#fffaea"/>'
    )
    # nubes largas y blandas, teñidas por la luz baja
    for cx, cy, rx, ry, op in ((470, 46, 100, 12, .5), (524, 62, 68, 9, .4),
                               (246, 30, 76, 10, .32), (196, 148, 132, 10, .34),
                               (512, 156, 116, 9, .3), (356, 190, 150, 8, .26), (592, 26, 84, 8, .3)):
        cuerpo += (f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="#ffe6c2" '
                   f'opacity="{op}" filter="url(#b12)"/>')

    # ══ 2 · fondo lejano: colinas desenfocadas y desaturadas ══════════════════
    cuerpo += (
        f'<g filter="url(#b12)" opacity=".8">'
        f'<path d="M-20 208 q78-58 152-24 q66 30 124-10 q72-50 154-12 q72 34 148 4 '
        f'q56-22 106 0 V244 H-20z" fill="url(#est_colina)"/></g>'
        f'<g filter="url(#b5)" opacity=".88">'
        f'<path d="M-20 224 q92-34 168-8 q78 26 150-8 q86-40 172-4 q68 28 134 6 '
        f'V246 H-20z" fill="url(#est_colina2)"/></g>'
    )
    # arbolado lejano: manchas sin dibujo, muy bajas de contraste
    cuerpo += '<g filter="url(#b5)" opacity=".5">'
    for i in range(18):
        x = 8 + i * 37 + 9 * math.sin(i * 2.1)
        r = 6 + 5 * abs(math.sin(i * 1.7))
        cuerpo += (f'<ellipse cx="{_n(x)}" cy="{_n(231 - r * .5)}" rx="{_n(r)}" '
                   f'ry="{_n(r * .85)}" fill="#66856c"/>')
    cuerpo += '</g>'
    # banco de arena del fondo y bruma cálida pegada al horizonte
    cuerpo += (
        f'<path d="M-20 232 q120-8 210 1 q118 12 230-3 q120-15 240 2 V{AGUA + 4} H-20z" '
        f'fill="url(#est_banco)" filter="url(#b2)" opacity=".95"/>'
        f'<rect x="0" y="170" width="{W}" height="72" fill="url(#est_bruma)" '
        f'opacity=".55" filter="url(#b12)"/>'
    )

    # ══ 3 · agua: material, reflejo deformado, sombras y brillo ═══════════════
    cuerpo += f'<rect x="0" y="{AGUA}" width="{W}" height="{H - AGUA}" fill="url(#est_agua)"/>'
    cuerpo += '<g clip-path="url(#est_cpagua)">'

    # reflejo del puente: espejado, aplastado y desenfocado
    cuerpo += (
        f'<g transform="translate(0,348) scale(1,-0.45)" filter="url(#est_b3)" opacity=".42">'
        f'<rect x="16" y="{Y0}" width="608" height="{DECK}" fill="{k["madS"]}"/>'
        f'<g stroke="{k["azulS"]}" stroke-linecap="round">{_silueta(15)}</g>'
        f'<rect x="248" y="130" width="68" height="42" fill="{k["rojS"]}"/>'
        f'<rect x="316" y="144" width="36" height="28" fill="{k["rojS"]}"/>'
        f'</g>'
    )
    # continuación del reflejo de los pilares hacia el espectador
    for cx in PIL:
        cuerpo += (f'<rect x="{cx - 21}" y="{PIE - 4}" width="42" height="34" '
                   f'fill="{cemS}" opacity=".3" filter="url(#b5)"/>')
    # rizos horizontales que deforman el reflejo y dan superficie al agua
    for i in range(26):
        y = 242 + i * 3.6 + 0.14 * i * i
        if y > 356:
            break
        amp = 0.9 + i * 0.17
        x0 = 8 + 50 * math.sin(i * 1.31)
        wl = 130 + 160 * abs(math.cos(i * 0.83))
        cuerpo += (f'<path d="M{_n(x0)} {_n(y)} q{_n(wl * .25)} {_n(-amp)} {_n(wl * .5)} 0 '
                   f'q{_n(wl * .25)} {_n(amp)} {_n(wl * .5)} 0" fill="none" '
                   f'stroke="{"#eaf7ff" if i % 2 else "#0a2438"}" '
                   f'stroke-width="{_n(1 + i * .07)}" opacity="{_n(.11 + i * .008)}" '
                   f'stroke-linecap="round"/>')
    # sombra proyectada de toda la celosía sobre el agua (sol bajo → sombra larga)
    cuerpo += (
        f'<g transform="matrix(1,0,-0.75,-0.16,173.5,328.5)" filter="url(#b5)" opacity=".36">'
        f'<g stroke="{k["noche"]}" stroke-linecap="round">{_silueta(17)}</g></g>'
    )
    # sombra de cada pilar sobre el agua
    for cx in PIL:
        _sp = _pts([(cx - 24, PIE - 4), (cx + 23, PIE - 4),
                    (cx + 118, PIE + 22), (cx + 71, PIE + 22)])
        cuerpo += (f'<polygon points="{_sp}" '
                   f'fill="{k["noche"]}" opacity=".32" filter="url(#b5)"/>')
    # agua somera junto a la orilla: los cantos del fondo se ven a traves
    for cx, cy, rx, ry, op in ((72, 338, 16, 6, .45), (214, 344, 12, 4.5, .4),
                               (330, 336, 18, 6, .42), (498, 344, 14, 5, .38),
                               (588, 334, 11, 4, .34)):
        cuerpo += (f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="#5f5744" '
                   f'opacity="{op}" filter="url(#b2)"/>')
    cuerpo += f'<rect x="0" y="320" width="{W}" height="44" fill="url(#est_orilla)"/>'
    # franja de sol tumbada sobre el agua, justo bajo el horizonte
    cuerpo += (f'<rect x="0" y="{AGUA}" width="{W}" height="10" fill="#ffd79c" '
               f'opacity=".32" filter="url(#b5)"/>')
    # brillo especular: la columna de sol picada sobre el agua
    for i in range(22):
        y = 240 + i * 4.2 + 0.11 * i * i
        if y > 336:
            break
        ww = 9 + i * 3.1
        x = 100 + 11 * math.sin(i * 1.9) + i * 1.3
        cuerpo += (f'<rect x="{_n(x - ww / 2)}" y="{_n(y)}" width="{_n(ww)}" height="{_n(2 + i * .26)}" '
                   f'rx="{_n(1 + i * .13)}" fill="url(#est_brillo)" '
                   f'opacity="{_n(.95 - i * .026)}" filter="url(#b2)"/>')
    cuerpo += (f'<rect x="0" y="300" width="200" height="64" fill="#0a2c44" '
               f'opacity=".18" filter="url(#b22)"/>')
    cuerpo += '</g>'

    # ══ 4 · pilares de hormigón: textura, cara en sombra y sombra recibida ════
    for i, cx in enumerate(PIL):
        cuerpo += (
            f'<ellipse cx="{cx}" cy="{PIE}" rx="34" ry="7" fill="{k["noche"]}" '
            f'opacity=".38" filter="url(#b5)"/>'
            f'<polygon points="{_pts([(cx - 27, 208), (cx + 27, 208), (cx + 23, PIE), (cx - 23, PIE)])}" '
            f'fill="url(#est_pilar)"/>'
            f'<g clip-path="url(#est_cp{i})">'
            # poro y veta del hormigón
            f'<rect x="{cx - 30}" y="204" width="60" height="124" filter="url(#veta)" '
            f'style="mix-blend-mode:multiply" opacity=".26"/>'
            f'<rect x="{cx - 30}" y="204" width="60" height="124" filter="url(#grano)" '
            f'style="mix-blend-mode:multiply" opacity=".16"/>'
            # sombra del tablero volando sobre el pilar
            f'<polygon points="{_pts([(cx - 40, 208), (cx + 40, 208), (cx + 52, 240), (cx - 28, 240)])}" '
            f'fill="{k["noche"]}" opacity=".3" filter="url(#b2)"/>'
            # sombra de dos diagonales de la celosía cruzando la cara
            f'<polygon points="{_pts([(cx - 46, 236), (cx - 28, 236), (cx + 16, 330), (cx - 2, 330)])}" '
            f'fill="{k["noche"]}" opacity=".19" filter="url(#b2)"/>'
            f'<polygon points="{_pts([(cx + 2, 232), (cx + 18, 232), (cx + 58, 330), (cx + 42, 330)])}" '
            f'fill="{k["noche"]}" opacity=".15" filter="url(#b2)"/>'
            # juntas de encofrado
            f'<path d="M{cx - 30} 252 h60 M{cx - 30} 288 h60" stroke="{cemS}" '
            f'stroke-width="1.8" opacity=".38"/>'
            f'<path d="M{cx - 30} 254.4 h60 M{cx - 30} 290.4 h60" stroke="{cemLL}" '
            f'stroke-width="1.3" opacity=".45"/>'
            f'</g>'
            # capitel
            f'<rect x="{cx - 34}" y="196" width="68" height="14" rx="2" fill="url(#est_cap)"/>'
            f'<rect x="{cx - 34}" y="196" width="68" height="4" fill="{cemLL}" opacity=".9"/>'
            f'<rect x="{cx - 34}" y="206" width="68" height="4" fill="{cemS}" opacity=".5"/>'
            # rizos donde el pilar entra en el agua
            f'<ellipse cx="{cx}" cy="{PIE}" rx="30" ry="5.5" fill="none" stroke="#f0faff" '
            f'stroke-width="2.2" opacity=".55"/>'
            f'<ellipse cx="{cx}" cy="{PIE + 4}" rx="42" ry="7" fill="none" stroke="#dff0ff" '
            f'stroke-width="1.6" opacity=".32"/>'
        )

    # ══ 5 · celosía: cada barra con cara de luz, canto en sombra y nudos ══════
    cuerpo += barra(40, Y0, 552, Y0, 16, '#17496b', '#3d7fa6', '#092b42',
                    k['oroLL'], bri='#9ccde8')
    for x1, y1, x2, y2 in MIEMBROS:
        cuerpo += barra(x1, y1, x2, y2, 15, '#17496b', '#3d7fa6', '#092b42',
                        k['oroLL'], ext=4, bri='#9ccde8')
    for x, y in [(x, Y0) for x in BN] + [(x, Y1) for x in TN]:
        cuerpo += (f'<circle cx="{_n(x)}" cy="{_n(y)}" r="10" fill="url(#est_nodo)"/>'
                   f'<circle cx="{_n(x)}" cy="{_n(y)}" r="10" fill="none" stroke="{k["azulS"]}" '
                   f'stroke-width="1.5" opacity=".75"/>'
                   f'<circle cx="{_n(x - 3.2)}" cy="{_n(y - 3.4)}" r="1.7" fill="{k["oroLL"]}" opacity=".9"/>')

    # ══ 6 · tablero, con veta y canto en sombra ═══════════════════════════════
    cuerpo += (
        f'<rect x="16" y="{Y0}" width="608" height="{DECK}" fill="url(#est_deck)"/>'
        f'<rect x="16" y="{Y0}" width="608" height="{DECK}" filter="url(#veta)" '
        f'style="mix-blend-mode:multiply" opacity=".28"/>'
        f'<rect x="16" y="{Y0}" width="608" height="4" fill="#ffe9bd" opacity=".85"/>'
        f'<rect x="16" y="{Y0 + DECK - 6}" width="608" height="6" fill="{k["noche"]}" opacity=".32"/>'
        f'<rect x="16" y="{Y0 + DECK}" width="608" height="5" fill="{k["noche"]}" '
        f'opacity=".18" filter="url(#b2)"/>'
    )
    # juntas de las vigas del tablero
    for x in range(64, 616, 96):
        cuerpo += (f'<rect x="{x}" y="{Y0 + 4}" width="2.4" height="{DECK - 4}" '
                   f'fill="{k["madS"]}" opacity=".45"/>'
                   f'<rect x="{x + 2.4}" y="{Y0 + 4}" width="1.6" height="{DECK - 4}" '
                   f'fill="#ffe0ac" opacity=".45"/>')
    # sombra de los nudos y las diagonales sobre la cara del tablero
    for x in BN:
        _sd = _pts([(x + 6, Y0), (x + 20, Y0), (x + 34, Y0 + DECK), (x + 20, Y0 + DECK)])
        cuerpo += f'<polygon points="{_sd}" fill="{k["madS"]}" opacity=".3"/>'
    # traviesas vistas por debajo del tablero
    for x in range(32, 616, 32):
        cuerpo += f'<rect x="{x}" y="{Y0 + DECK - 5}" width="7" height="6" fill="{k["madS"]}" opacity=".55"/>'

    # ══ 7 · camión de prueba cruzando ═════════════════════════════════════════
    cuerpo += (
        # sombra bajo las ruedas, larga hacia la derecha
        f'<polygon points="{_pts([(250, 176), (352, 176), (406, 182), (304, 182)])}" '
        f'fill="{k["noche"]}" opacity=".32" filter="url(#b5)"/>'
        f'<ellipse cx="300" cy="175" rx="54" ry="6" fill="{k["noche"]}" opacity=".42" filter="url(#b2)"/>'
        # caja
        f'<rect x="248" y="130" width="68" height="42" rx="3" fill="url(#est_caja)"/>'
        f'<rect x="248" y="130" width="68" height="5" rx="2" fill="#ffe9a8" opacity=".6"/>'
        f'<rect x="248" y="130" width="5" height="42" fill="#fff" opacity=".26"/>'
        f'<rect x="248" y="164" width="68" height="8" fill="{k["noche"]}" opacity=".24"/>'
        f'<rect x="254" y="140" width="56" height="18" rx="2" fill="{k["rojS"]}" opacity=".32"/>'
        # cabina
        f'<path d="M316 144 h22 l14 16 v12 h-36z" fill="url(#est_cabina)"/>'
        f'<path d="M316 144 h22 l4 5 h-26z" fill="#ffe9a8" opacity=".55"/>'
        f'<path d="M320 148 h17 l10 11 h-27z" fill="url(#est_cris)"/>'
        f'<path d="M322 148 l7 0 l-6 11 h-3z" fill="#fff" opacity=".5"/>'
        f'<rect x="316" y="166" width="36" height="6" fill="{k["noche"]}" opacity=".24"/>'
        # faro y su halo
        f'<circle cx="350" cy="162" r="8" fill="#ffe9a8" opacity=".55" filter="url(#b5)"/>'
        f'<circle cx="350" cy="162" r="3.2" fill="#fff8de"/>'
        f'<rect x="248" y="158" width="4" height="7" rx="1" fill="{k["oroL"]}" opacity=".85"/>'
        # ruedas con llanta
        + ''.join(
            f'<circle cx="{x}" cy="172" r="9.5" fill="{k["tinta"]}"/>'
            f'<circle cx="{x}" cy="172" r="4.4" fill="#9fb0bd"/>'
            f'<circle cx="{x - 1.5}" cy="170" r="2" fill="#e7eef3" opacity=".85"/>'
            for x in (268, 300, 340))
    )

    # ══ 8 · flechas de carga sobre los nudos ══════════════════════════════════
    for x in (200, 392):
        cuerpo += (
            f'<g filter="url(#b5)" opacity=".45">'
            f'<path d="M{x} 30 v42 M{x} 78 l-9-11 M{x} 78 l9-11" stroke="{k["violL"]}" '
            f'stroke-width="9" stroke-linecap="round" fill="none"/></g>'
            f'<path d="M{x} 30 v38" stroke="{k["violS"]}" stroke-width="7" stroke-linecap="round"/>'
            f'<path d="M{x} 32 v34" stroke="{k["violL"]}" stroke-width="3" stroke-linecap="round" opacity=".85"/>'
            f'<path d="M{x} 79 l-11-13 h22z" fill="{k["violS"]}"/>'
            f'<path d="M{x} 72 l-7-7 h14z" fill="{k["violL"]}" opacity=".9"/>'
        )

    # ══ 9 · el hueco punteado y la barra que está bajando ═════════════════════
    gx1, gy1, gx2, gy2 = HUECO
    cuerpo += (
        # halo claro para que el punteado se lea sobre el cielo
        f'<line x1="{gx1}" y1="{gy1}" x2="{gx2}" y2="{gy2}" stroke="#fff3d6" '
        f'stroke-width="19" opacity=".6" stroke-linecap="round"/>'
        f'<line x1="{gx1}" y1="{gy1}" x2="{gx2}" y2="{gy2}" stroke="{k["azulS"]}" '
        f'stroke-width="16" opacity=".15" stroke-linecap="round"/>'
        f'<line x1="{gx1}" y1="{gy1}" x2="{gx2}" y2="{gy2}" stroke="{k["tinta"]}" '
        f'stroke-width="4.6" stroke-dasharray="12 9" stroke-linecap="round" opacity=".8"/>'
        # guía punteada desde la barra hasta su sitio
        f'<path d="M506 128 q16 6 22 20" fill="none" stroke="{k["oroS"]}" stroke-width="3" '
        f'stroke-dasharray="6 7" stroke-linecap="round" opacity=".8"/>'
        f'<path d="M530 152 l-9-3 l5 9z" fill="{k["oroS"]}" opacity=".9"/>'
        # la barra suelta, en primer plano, con sombra propia que la despega
        f'<g filter="url(#est_som)">'
        + barra(500, 166, 560, 62, 22, k['oro'], k['oroL'], '#6b4f00',
                k['oroLL'], bri=k['oroLL'])
        + f'<circle cx="503" cy="161" r="7.5" fill="{k["oroS"]}"/>'
          f'<circle cx="502" cy="159.5" r="3.6" fill="{k["oroLL"]}"/>'
          f'<circle cx="557" cy="67" r="7.5" fill="{k["oroS"]}"/>'
          f'<circle cx="556" cy="65.5" r="3.6" fill="{k["oroLL"]}"/>'
          f'</g>'
        # brillo de chapa cruzando la barra
        f'<path d="M513 142 l38-66" stroke="#fff" stroke-width="3" opacity=".55" stroke-linecap="round"/>'
    )

    # ══ 10 · orilla cercana, nítida y contrastada ═════════════════════════════
    puntos = 'M-10 %s ' % _n(_orilla(0)) + ' '.join(
        'L%s %s' % (x, _n(_orilla(x))) for x in range(0, 660, 10))
    cuerpo += (
        f'<path d="{puntos} L660 {H} L-10 {H}z" fill="url(#est_hierba)"/>'
        f'<path d="{puntos} L660 {H} L-10 {H}z" filter="url(#fibra)" '
        f'style="mix-blend-mode:multiply" opacity=".16"/>'
        f'<path d="{puntos}" fill="none" stroke="#eaf7ff" stroke-width="3.4" opacity=".4"/>'
        f'<path d="{puntos}" fill="none" stroke="{k["verdLL"]}" stroke-width="2.2" opacity=".55"/>'
    )
    # hierba: briznas cortas, inclinadas por la luz
    briznas = []
    for i in range(74):
        x = i * 8.7 + 2
        base = _orilla(x)
        h = 8 + 7 * abs(math.sin(i * 2.3))
        dxb = -3 + 6 * math.sin(i * 1.11)
        briznas.append(f'M{_n(x)} {_n(base + 4)} q{_n(dxb * .4)} {_n(-h * .6)} {_n(dxb)} {_n(-h)}')
    cuerpo += (f'<path d="{" ".join(briznas[::2])}" fill="none" stroke="#12401c" '
               f'stroke-width="2.1" stroke-linecap="round" opacity=".6"/>'
               f'<path d="{" ".join(briznas[1::2])}" fill="none" stroke="{k["verdL"]}" '
               f'stroke-width="1.5" stroke-linecap="round" opacity=".5"/>')
    # piedras de la orilla, con su sombra larga hacia la derecha
    for cx, cy, rx, ry in ((84, 372, 21, 12), (146, 392, 15, 9), (330, 366, 17, 10),
                           (404, 386, 25, 14), (560, 370, 19, 11), (612, 392, 13, 8)):
        cuerpo += (f'<ellipse cx="{_n(cx + rx * 1.0)}" cy="{_n(cy + ry * .5)}" rx="{_n(rx * 1.6)}" '
                   f'ry="{_n(ry * .6)}" fill="{k["noche"]}" opacity=".38" filter="url(#b5)"/>'
                   f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="url(#est_piedra)"/>'
                   f'<path d="M{_n(cx - rx * .6)} {_n(cy - ry * .45)} q{_n(rx * .5)} {_n(-ry * .6)} '
                   f'{_n(rx * 1.1)} {_n(-ry * .12)}" fill="none" stroke="#fffaf0" '
                   f'stroke-width="2.2" opacity=".5"/>')
    # piedras a caballo de la lamina de agua: la parte sumergida se enfria
    for cx, rx, ry in ((252, 20, 11), (470, 16, 9), (112, 14, 8)):
        cy = _orilla(cx) - ry * .35
        cuerpo += (f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="url(#est_piedra)"/>'
                   f'<path d="M{_n(cx - rx)} {_n(cy)} a{rx} {ry} 0 0 0 {_n(rx * 2)} 0z" '
                   f'fill="#1d4e6b" opacity=".45"/>'
                   f'<path d="M{_n(cx - rx)} {_n(cy)} h{_n(rx * 2)}" stroke="#eaf7ff" '
                   f'stroke-width="1.8" opacity=".55"/>')
    # la estructura tira su sombra tambien sobre la orilla cercana
    cuerpo += ('<path d="M400 400 L476 342 L640 328 L640 400z" fill="#0d1b2a" '
               'opacity=".3" filter="url(#b12)"/>')
    # acopio de barras esperando turno: la obra sigue
    cuerpo += (f'<ellipse cx="238" cy="382" rx="66" ry="10" fill="{k["noche"]}" '
               f'opacity=".38" filter="url(#b5)"/>')
    for x0, y0, ln in ((180, 378, 118), (186, 367, 106), (194, 356, 94)):
        cuerpo += barra(x0, y0, x0 + ln, y0 - 3, 11, '#17496b', '#3d7fa6', '#092b42',
                        k['oroLL'], bri='#9ccde8')
    # juncos en primer plano, contra la luz
    for i in range(6):
        x = 8 + i * 12
        cuerpo += (f'<path d="M{x} {_n(_orilla(x) + 14)} q{_n(-4 + i)} -28 {_n(-10 + i * 2)} -50" '
                   f'fill="none" stroke="#12401c" stroke-width="2.8" stroke-linecap="round" '
                   f'opacity=".9"/>')

    # ══ 11 · pase de luz cálida, sombra fría, grano y viñeteado ═══════════════
    cuerpo += (
        f'<rect width="{W}" height="{H}" fill="url(#est_calor)" style="mix-blend-mode:screen" opacity=".26"/>'
        f'<rect width="{W}" height="{H}" fill="url(#est_frio)" style="mix-blend-mode:multiply"/>'
        f'<rect width="{W}" height="{H}" filter="url(#grano)" '
        f'style="mix-blend-mode:overlay" opacity=".06"/>'
        f'<rect width="{W}" height="{H}" fill="url(#est_vin)"/>'
    )

    return svg(cuerpo, d + rg('est_vin', .5, .45, .78,
                              [(.55, '#000', 0), (1, '#0d1b2a', .26)]))
