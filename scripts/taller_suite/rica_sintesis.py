# -*- coding: utf-8 -*-
"""Escena rica de Síntesis y paisajes sonoros (R65 · tanda 6).

El sintetizador modular parcheado: **se ve por dónde va la señal**.

Lo que se ve:

* tres **módulos** en su bastidor, cada uno con su chapa, sus tornillos, sus
  jacks y sus mandos: el oscilador, la envolvente y el filtro;
* los **cables de parcheo** cruzando de un módulo a otro, con su caída propia
  —cuelgan, no describen arcos de dibujo—, su funda de color, la clavija
  metálica con su anillo y el aro de goma del cuello;
* un **cable todavía sin conectar**, con la clavija en el aire y su jack de
  destino libre: el parcheo está a medio hacer y se ve cuál falta;
* el **osciloscopio** encendido, con la retícula, el brillo del fósforo y la
  **onda calculada de verdad** —la suma de la fundamental y sus armónicos, que
  es lo que hace el módulo de al lado—, con su trazo más brillante en el centro
  y la estela más apagada;
* los **deslizadores de la envolvente** a distinta altura, y, dibujada al lado,
  la envolvente que producen: ataque, caída, sostenido y suelta;
* la hoja con el **paisaje sonoro** apuntado a mano: capas por franjas, con su
  duración y sus entradas marcadas;
* los auriculares apoyados, con la almohadilla aplastada donde se apoya.

Sin personajes, sin pantallas de ordenador: aparatos, cables y papel.
"""
import math

from taller_suite.escenas_ricas import C, W, H, svg, lg, rg
from taller_suite import rica_comun as M

k = C
P = 'sn'

MESA = 122

# El bastidor de módulos
BX, BY, BW, BH = 36, 150, 340, 176
MODW = BW / 3

VERDE = '#7dfaa8'


def _onda(t):
    """La onda que se está sintetizando: fundamental más dos armónicos.

    No es una sinusoide decorativa ni un garabato: es la suma que produce el
    módulo de la izquierda, con los pesos que marcan sus mandos. Cambiarlos
    cambiaría el trazo del osciloscopio, que es justo lo que enseña el estudio.
    """
    return (math.sin(t) * 1.0
            + math.sin(2 * t + .6) * 0.42
            + math.sin(3 * t + 1.9) * 0.24
            + math.sin(5 * t + .3) * 0.11)


def _jack(cx, cy, *, conectado=True, col='#e0473c'):
    """Un jack de panel. Si está conectado, la clavija tapa el agujero."""
    g = [f'<circle cx="{M.r1(cx)}" cy="{M.r1(cy)}" r="7.4" fill="url(#{P}_metal)"/>',
         f'<circle cx="{M.r1(cx)}" cy="{M.r1(cy)}" r="5.2" fill="#0e131a"/>',
         f'<circle cx="{M.r1(cx)}" cy="{M.r1(cy)}" r="7.4" fill="none" '
         f'stroke="{k["noche"]}" stroke-width=".9" opacity=".5"/>']
    if conectado:
        g.append(f'<circle cx="{M.r1(cx)}" cy="{M.r1(cy)}" r="5.6" '
                 f'fill="url(#{P}_metal)"/>')
        g.append(f'<circle cx="{M.r1(cx)}" cy="{M.r1(cy)}" r="2.2" fill="#39434e"/>')
        g.append(f'<circle cx="{M.r1(cx)}" cy="{M.r1(cy)}" r="9.4" fill="{col}" '
                 f'opacity=".95"/>')
        g.append(f'<circle cx="{M.r1(cx)}" cy="{M.r1(cy)}" r="9.4" fill="none" '
                 f'stroke="{k["noche"]}" stroke-width=".9" opacity=".4"/>')
        g.append(f'<circle cx="{M.r1(cx - 3)}" cy="{M.r1(cy - 3.4)}" r="2.6" '
                 f'fill="#ffffff" opacity=".35"/>')
    return ''.join(g)


def _mando(cx, cy, r, ang, col='#c9d2da'):
    g = [f'<circle cx="{M.r1(cx + 1.4)}" cy="{M.r1(cy + 2.4)}" r="{M.r1(r)}" '
         f'fill="{k["noche"]}" opacity=".4" filter="url(#b2)"/>']
    for i in range(9):
        a = math.radians(-215 + i * 31)
        g.append(f'<path d="M{M.r1(cx + (r + 3) * math.cos(a))} '
                 f'{M.r1(cy + (r + 3) * math.sin(a))} l{M.r1(2.6 * math.cos(a))} '
                 f'{M.r1(2.6 * math.sin(a))}" stroke="#8d97a1" stroke-width="1" '
                 f'opacity=".7"/>')
    g.append(f'<circle cx="{M.r1(cx)}" cy="{M.r1(cy)}" r="{M.r1(r)}" '
             f'fill="url(#{P}_mando)"/>')
    a = math.radians(ang)
    g.append(f'<path d="M{M.r1(cx)} {M.r1(cy)} L{M.r1(cx + r * .8 * math.cos(a))} '
             f'{M.r1(cy + r * .8 * math.sin(a))}" stroke="{col}" stroke-width="2.2" '
             f'stroke-linecap="round"/>')
    g.append(f'<ellipse cx="{M.r1(cx - r * .3)}" cy="{M.r1(cy - r * .36)}" '
             f'rx="{M.r1(r * .34)}" ry="{M.r1(r * .2)}" fill="#ffffff" opacity=".3" '
             f'filter="url(#b2)"/>')
    return ''.join(g)


def _osciloscopio(x, y, w, h):
    """La pantalla del osciloscopio: retícula, fósforo y la onda calculada."""
    g = [f'<rect x="{M.r1(x)}" y="{M.r1(y)}" width="{M.r1(w)}" height="{M.r1(h)}" '
         f'rx="4" fill="#0a1410"/>',
         f'<rect x="{M.r1(x)}" y="{M.r1(y)}" width="{M.r1(w)}" height="{M.r1(h)}" '
         f'rx="4" fill="url(#{P}_fosforo)"/>']
    for i in range(1, 8):
        g.append(f'<path d="M{M.r1(x + i * w / 8)} {M.r1(y)} v{M.r1(h)}" '
                 f'stroke="{VERDE}" stroke-width=".6" opacity=".16"/>')
    for j in range(1, 5):
        g.append(f'<path d="M{M.r1(x)} {M.r1(y + j * h / 5)} h{M.r1(w)}" '
                 f'stroke="{VERDE}" stroke-width=".6" opacity=".16"/>')
    # el trazo, con su estela
    pts = []
    for i in range(121):
        t = i / 120 * 4 * math.pi
        px = x + i / 120 * w
        py = y + h / 2 - _onda(t) * h * .26
        pts.append(f'{M.r1(px)} {M.r1(py)}')
    d = 'M' + ' L'.join(pts)
    g.append(f'<path d="{d}" fill="none" stroke="{VERDE}" stroke-width="6" '
             f'opacity=".2" filter="url(#b5)"/>')
    g.append(f'<path d="{d}" fill="none" stroke="{VERDE}" stroke-width="2.6" '
             f'opacity=".55" filter="url(#b2)"/>')
    g.append(f'<path d="{d}" fill="none" stroke="#e8fff0" stroke-width="1.3" '
             f'opacity=".95"/>')
    # el vidrio abombado
    g.append(f'<rect x="{M.r1(x)}" y="{M.r1(y)}" width="{M.r1(w)}" height="{M.r1(h)}" '
             f'rx="4" fill="url(#{P}_vidrio)" opacity=".28"/>')
    g.append(f'<path d="M{M.r1(x + 4)} {M.r1(y + h * .55)} '
             f'L{M.r1(x + w * .45)} {M.r1(y + 3)} L{M.r1(x + w * .62)} {M.r1(y + 3)} '
             f'L{M.r1(x + 12)} {M.r1(y + h - 3)} Z" fill="#ffffff" opacity=".07"/>')
    return ''.join(g)


def _modulos():
    """Los tres módulos en su bastidor: oscilador, envolvente y filtro."""
    g = [M.contacto(BX - 6, BY + BH + 8, BW + 12, op=.44, alto=8),
         M.sombra(BX, BY, BW, BH, op=.36, dx=12, dy=15, rx=6),
         # los raíles del bastidor
         f'<rect x="{BX - 10}" y="{BY - 10}" width="{BW + 20}" height="{BH + 20}" '
         f'rx="7" fill="url(#{P}_rack)"/>',
         f'<rect x="{BX - 10}" y="{BY - 10}" width="{BW + 20}" height="6" rx="3" '
         f'fill="#ffffff" opacity=".2"/>']
    for n in range(3):
        x = BX + n * MODW
        g.append(f'<rect x="{M.r1(x + 2)}" y="{BY}" width="{M.r1(MODW - 4)}" '
                 f'height="{BH}" rx="3" fill="url(#{P}_panel)"/>')
        g.append(f'<rect x="{M.r1(x + 2)}" y="{BY}" width="{M.r1(MODW - 4)}" '
                 f'height="4" rx="2" fill="#ffffff" opacity=".22"/>')
        # los tornillos de cada módulo
        for ty in (BY + 8, BY + BH - 8):
            for tx in (x + 12, x + MODW - 12):
                g.append(f'<circle cx="{M.r1(tx)}" cy="{M.r1(ty)}" r="3.6" '
                         f'fill="url(#{P}_metal)"/>')
                g.append(f'<path d="M{M.r1(tx - 2.4)} {M.r1(ty)} h4.8" '
                         f'stroke="{k["noche"]}" stroke-width="1.2" opacity=".55"/>')
        # el rótulo del módulo, como bloque
        g.append(f'<rect x="{M.r1(x + 22)}" y="{BY + 16}" '
                 f'width="{M.r1(MODW - 60)}" height="4" rx="2" fill="#c9d2da" '
                 f'opacity=".8"/>')

    # ── módulo 1 · oscilador: mandos y la forma de onda grabada
    x = BX
    for i, (dx, dy, ang) in enumerate(((28, 44, -120), (76, 44, 30), (52, 84, -40))):
        g.append(_mando(x + dx, BY + dy, 13, ang))
    g.append(f'<path d="M{x + 20} {BY + 116} q10 -12 20 0 q10 12 20 0 q10 -12 20 0" '
             f'fill="none" stroke="{VERDE}" stroke-width="1.8" opacity=".75"/>')
    for i, dx in enumerate((26, 54, 82)):
        g.append(_jack(x + dx, BY + 146, conectado=(i != 2), col='#e0473c'))

    # ── módulo 2 · envolvente: cuatro deslizadores y la curva que producen
    x = BX + MODW
    alturas = (.82, .46, .62, .24)
    for i, h0 in enumerate(alturas):
        sx = x + 24 + i * 22
        g.append(f'<rect x="{M.r1(sx - 3)}" y="{BY + 36}" width="6" height="78" rx="3" '
                 f'fill="#141a20"/>')
        sy = BY + 114 - h0 * 74
        g.append(f'<rect x="{M.r1(sx - 9)}" y="{M.r1(sy)}" width="18" height="12" '
                 f'rx="2.5" fill="url(#{P}_mando)"/>')
        g.append(f'<rect x="{M.r1(sx - 9)}" y="{M.r1(sy + 5)}" width="18" height="2" '
                 f'fill="{VERDE}" opacity=".8"/>')
    # la envolvente dibujada en la chapa
    a, d0, s0, r0 = alturas
    g.append(f'<path d="M{x + 22} {BY + 140} L{M.r1(x + 22 + 18 * a)} {BY + 122} '
             f'L{M.r1(x + 40 + 16 * d0)} {M.r1(BY + 140 - 18 * s0)} '
             f'L{M.r1(x + 78)} {M.r1(BY + 140 - 18 * s0)} '
             f'L{M.r1(x + 78 + 18 * r0)} {BY + 140}" fill="none" stroke="{VERDE}" '
             f'stroke-width="1.8" opacity=".75" stroke-linejoin="round"/>')
    for i, dx in enumerate((28, 58, 88)):
        g.append(_jack(x + dx, BY + 160, conectado=(i == 0), col='#f0b419'))

    # ── módulo 3 · filtro: osciloscopio, mando y jacks
    x = BX + 2 * MODW
    g.append(_osciloscopio(x + 14, BY + 30, MODW - 32, 62))
    g.append(_mando(x + 34, BY + 116, 15, -80, col='#4dc4bd'))
    g.append(_mando(x + 76, BY + 116, 11, 40, col='#4dc4bd'))
    for i, dx in enumerate((28, 58, 88)):
        g.append(_jack(x + dx, BY + 156, conectado=(i != 1), col='#4dc4bd'))
    return ''.join(g)


def _cable_parcheo(x0, y0, x1, y1, col, caida=64):
    """Un cable de parcheo: cuelga por su peso, no describe un arco de dibujo."""
    mx = (x0 + x1) / 2
    my = max(y0, y1) + caida
    d = f'M{M.r1(x0)} {M.r1(y0)} Q{M.r1(mx)} {M.r1(my)} {M.r1(x1)} {M.r1(y1)}'
    return (f'<path d="{d}" fill="none" stroke="{k["noche"]}" stroke-width="8" '
            f'opacity=".22" filter="url(#b2)" transform="translate(4 7)"/>'
            f'<path d="{d}" fill="none" stroke="{col}" stroke-width="6" '
            f'stroke-linecap="round"/>'
            f'<path d="{d}" fill="none" stroke="#ffffff" stroke-width="1.6" '
            f'opacity=".3" transform="translate(-1 -1.6)"/>')


def _clavija_suelta(cx, cy, ang, col):
    """La clavija que todavía no está puesta, en el aire."""
    return (f'<g transform="rotate({ang} {cx} {cy})">'
            + M.sombra(cx - 10, cy + 20, 20, 10, op=.3, dx=6, dy=12, rx=5, blur='b5')
            + f'<rect x="{cx - 9}" y="{cy - 26}" width="18" height="26" rx="4" '
              f'fill="{col}"/>'
            + f'<rect x="{cx - 9}" y="{cy - 26}" width="5" height="26" rx="2.5" '
              f'fill="#ffffff" opacity=".28"/>'
            + f'<rect x="{cx - 4}" y="{cy}" width="8" height="16" rx="1.4" '
              f'fill="url(#{P}_metal)"/>'
            + f'<rect x="{cx - 4}" y="{cy + 9}" width="8" height="2" '
              f'fill="{k["noche"]}" opacity=".5"/>'
            + f'<path d="M{cx - 4} {cy + 16} h8 l-4 4 Z" fill="#8d97a1"/>'
            + '</g>')


def _paisaje_papel():
    """La hoja del paisaje sonoro: capas por franjas, con entradas marcadas."""
    x, y, w, h = 396, 254, 216, 132
    g = [M.sombra(x, y, w, h, op=.28, dx=7, dy=10, rx=2),
         f'<g transform="rotate(5 {x + w / 2} {y + h / 2})">',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" '
         f'fill="url(#{P}_pliego)"/>',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="none" '
         f'stroke="#b5ac9b" stroke-width=".8" opacity=".8"/>']
    capas = [('#2f6f87', 14, 176), ('#c8813a', 44, 120), ('#4d8a4d', 70, 152),
             ('#8a4d8a', 96, 84)]
    for i, (col, dy, ancho) in enumerate(capas):
        g.append(f'<rect x="{M.r1(x + 16 + i * 8)}" y="{M.r1(y + 18 + dy)}" '
                 f'width="{M.r1(ancho)}" height="12" rx="3" fill="{col}" '
                 f'opacity=".55"/>')
        g.append(f'<rect x="{M.r1(x + 16 + i * 8)}" y="{M.r1(y + 18 + dy)}" '
                 f'width="{M.r1(ancho)}" height="12" rx="3" fill="none" '
                 f'stroke="{col}" stroke-width="1.2" opacity=".85"/>')
        # la marca de entrada
        g.append(f'<path d="M{M.r1(x + 16 + i * 8)} {M.r1(y + 14 + dy)} v-7 m-3 3 l3 -3 '
                 f'l3 3" fill="none" stroke="{k["tinta"]}" stroke-width="1.2" '
                 f'opacity=".6" stroke-linecap="round"/>')
    # la línea de tiempo con sus marcas
    g.append(f'<path d="M{x + 14} {y + 12} H{x + w - 14}" stroke="{k["tinta"]}" '
             f'stroke-width="1.2" opacity=".6"/>')
    for i in range(7):
        g.append(f'<path d="M{M.r1(x + 16 + i * 30)} {y + 8} v8" stroke="{k["tinta"]}" '
                 f'stroke-width="1" opacity=".5"/>')
    g.append('</g>')
    return ''.join(g)


def _auriculares():
    """Los auriculares apoyados, con la almohadilla aplastada donde se apoya."""
    g = [M.contacto(54, 392, 112, op=.4, alto=6)]
    g.append('<g transform="rotate(-16 104 352)" >')
    # la diadema
    g.append(f'<path d="M44 368 C44 312 166 312 166 368" fill="none" '
             f'stroke="#2b333c" stroke-width="12" stroke-linecap="round"/>')
    g.append(f'<path d="M44 368 C44 312 166 312 166 368" fill="none" '
             f'stroke="#5b6773" stroke-width="3.4" opacity=".55" '
             f'transform="translate(0 -3)"/>')
    # los cascos: el de la izquierda apoyado y aplastado
    g.append(f'<ellipse cx="44" cy="374" rx="26" ry="19" fill="#1d242b"/>')
    g.append(f'<ellipse cx="44" cy="374" rx="18" ry="12" fill="#39434e"/>')
    g.append(f'<ellipse cx="166" cy="370" rx="24" ry="22" fill="#1d242b"/>')
    g.append(f'<ellipse cx="166" cy="370" rx="16" ry="15" fill="#39434e"/>')
    g.append(f'<ellipse cx="160" cy="364" rx="7" ry="6" fill="#ffffff" opacity=".12"/>')
    g.append('</g>')
    return ''.join(g)


def _defs():
    """Los gradientes, filtros y recortes de esta escena.

    Vive aparte para que la variante AGE_0_12 pueda reutilizar
    exactamente los mismos, sin duplicarlos y sin que puedan divergir.
    """
    return (
        M.defs_taller(P, tabla=('#ac8c66', '#8a6c41', '#654a2c', '#3f2d19'))
        + M.defs_papel(P)
        + M.defs_metal(P)
        + M.defs_vidrio(P)
        + lg(f'{P}_rack', 0, 0, .25, 1,
             [(0, '#4c565f', None), (.35, '#343d46', None), (1, '#1c232a', None)])
        + lg(f'{P}_panel', 0, 0, .3, 1,
             [(0, '#38424c', None), (.35, '#28313a', None), (1, '#161d24', None)])
        + rg(f'{P}_mando', .34, .3, .9,
             [(0, '#e4eaef', None), (.5, '#b4bec7', None), (1, '#6f7a85', None)])
        + rg(f'{P}_fosforo', .5, .5, .8,
             [(0, '#16311f', None), (.6, '#0d2016', None), (1, '#07120d', None)])
        + rg(f'{P}_focosuelo', .5, .5, .5, [(0, '#fff0cf', .4), (1, '#fff0cf', 0)])
    )


def escena():
    defs = _defs()

    c = M.pared(P, MESA + 6, vx=426, vy=6, vw=138, vh=96)
    c += M.banco(P, MESA, juntas=(392,), nudos=((310, 366, 8),))
    c += (f'<ellipse cx="220" cy="210" rx="250" ry="140" '
          f'fill="url(#{P}_focosuelo)" opacity=".4" filter="url(#b22)"/>')
    # el resplandor verde del osciloscopio sobre el bastidor
    c += (f'<ellipse cx="{M.r1(BX + 2 * MODW + MODW / 2)}" cy="{BY + 62}" rx="110" '
          f'ry="76" fill="{VERDE}" opacity=".07" filter="url(#b22)"/>')

    c += _paisaje_papel()
    c += _modulos()
    # los cables de parcheo, por delante de los módulos
    c += _cable_parcheo(BX + 26, BY + 146, BX + MODW + 28, BY + 160, '#e0473c', 58)
    c += _cable_parcheo(BX + 54, BY + 146, BX + 2 * MODW + 28, BY + 156, '#f0b419', 74)
    # el cable que falta por conectar: sale de un jack y su clavija espera
    # en el aire, a la vista, sobre la madera despejada
    c += _cable_parcheo(BX + 2 * MODW + 88, BY + 156, 372, 346, '#4dc4bd', 44)
    c += _clavija_suelta(378, 340, 28, '#4dc4bd')
    c += _auriculares()

    c += M.velo(P, MESA - 6, 44, op=.26)
    c += M.vineta(P, .85)
    return svg(c, defs)
