# -*- coding: utf-8 -*-
"""Escena rica de Modelado 3D (R54 · repaso contra la norma de septiembre 2026).

Mismo relato que antes —y el concepto no se toca—: un visor de modelado con la
rejilla en perspectiva, una taza a medio hacer (le falta el asa, que se
previsualiza en punteado), vértices seleccionados, ejes de manipulación, el cubo
de vista y la paleta de materiales. Lo que sube es el **acabado**:

* **Fondo de estudio**, no un degradado liso: gradación no lineal, foco de clave
  arriba a la izquierda, el canto donde el suelo se encuentra con el infinito,
  bruma baja y dos haces volumétricos muy tenues que explican de dónde viene la
  luz. Encima, un moteado de nube a baja opacidad para que el plano tenga materia.
* **Rejilla con perspectiva de verdad**: las radiales se atenúan con un degradado
  en espacio de usuario, las horizontales pierden peso y grosor con la distancia,
  hay línea maestra cada cuatro y todo se desvanece en el horizonte en vez de
  cortarse.
* **Suelo de ciclorama**: grano fino que solo se ve cerca de la cámara, charco de
  luz clave y reflejo difuso de la taza.
* **Cerámica**: grosor real en el labio, reflejo especular con forma de ventana
  de estudio (dos paños y su montante), transición de la pared interior en sombra
  al labio iluminado, rebote frío del suelo en la panza baja, línea de horizonte
  reflejada en el vidriado y **sombra de contacto con oclusión** además de la
  proyectada difusa.
* **Paleta de materiales**: cada muestra se ve como el material que representa
  —metal cepillado, cerámica esmaltada (la activa, la que lleva la taza), yeso
  mate, piedra moteada y madera con veta—, con relieve de pastilla y su sombra.
* **Cubo de orientación** con tres valores, canto vivo biselado, oclusión en la
  arista interior y sombra propia.

Texturas propias de esta escena: ``m3d_nube`` (moteado atmosférico de fondo),
``m3d_micro`` (grano fino de suelo y mate), ``m3d_cepillo`` (rayado anisótropo
del metal) y ``m3d_moteado`` (grano de piedra).
"""
from taller_suite.escenas_ricas import C, W, H, svg, lg, rg


# ── geometría de la taza ────────────────────────────────────────────────
CX, RIM_Y, RIM_RX, RIM_RY = 270, 176, 72, 23
BASE_Y, BASE_RX, BASE_RY = 302, 60, 18
CUERPO = (f'M{CX - RIM_RX} {RIM_Y} L{CX - BASE_RX} {BASE_Y} '
          f'A{BASE_RX} {BASE_RY} 0 0 1 {CX + BASE_RX} {BASE_Y} '
          f'L{CX + RIM_RX} {RIM_Y} Z')

VP = (296, 150)          # punto de fuga
SUELO = 150              # línea de horizonte
FONDO = 404              # donde muere la rejilla, ya fuera del lienzo


def _ug(id_, y1, y2, paradas):
    """Degradado vertical en espacio de usuario: sirve para teñir strokes."""
    p = ''.join(f'<stop offset="{o}" stop-color="{c}" stop-opacity="{a}"/>'
                for o, c, a in paradas)
    return (f'<linearGradient id="{id_}" gradientUnits="userSpaceOnUse" '
            f'x1="0" y1="{y1}" x2="0" y2="{y2}">{p}</linearGradient>')


def _ruido(id_, freq, oct_, slope, inter, seed=3, contraste=None):
    """Ruido por turbulencia listo para pintar como capa de materia.

    ``contraste`` abre además los canales de color. Hace falta en las
    frecuencias bajas: la turbulencia fractal se agolpa alrededor del gris medio
    y, si solo se estira el alfa, la nube acaba siendo invisible.
    """
    rgb = ''
    if contraste:
        cs, ci = contraste
        rgb = ''.join(f'<feFunc{c} type="linear" slope="{cs}" intercept="{ci}"/>'
                      for c in 'RGB')
    return (f'<filter id="{id_}" x="0" y="0" width="100%" height="100%">'
            f'<feTurbulence type="fractalNoise" baseFrequency="{freq}" '
            f'numOctaves="{oct_}" seed="{seed}"/>'
            f'<feColorMatrix type="saturate" values="0"/>'
            f'<feComponentTransfer>{rgb}<feFuncA type="linear" slope="{slope}" '
            f'intercept="{inter}"/></feComponentTransfer></filter>')


# ── rejilla ─────────────────────────────────────────────────────────────
def _rejilla(k_op=1.0, maestras=True):
    """Rejilla de suelo con atenuación por distancia y línea maestra cada 4.

    Las radiales llevan el degradado en espacio de usuario como stroke, así que
    nacen invisibles en el horizonte y ganan cuerpo al acercarse a la cámara.
    Las horizontales se atenúan a mano, porque cada una vive a una distancia.
    """
    g = []
    for i in range(-9, 10):
        x = VP[0] + i * 104
        maestra = maestras and i % 4 == 0
        grad = 'm3d_glmaj' if maestra else 'm3d_glmin'
        w = (2.1 if i == 0 else 1.6) if maestra else 1.1
        g.append(f'<path d="M{VP[0]} {VP[1]} L{x} {FONDO}" stroke="url(#{grad})" '
                 f'stroke-width="{w}" opacity="{round(k_op, 3)}"/>')
    n = 15
    for i in range(1, n + 1):
        t = i / float(n)
        y = SUELO + 256 * t ** 2.35
        cerca = t ** 1.5                       # 0 en el horizonte, 1 en cámara
        maestra = maestras and i % 4 == 0
        o = (.05 + .78 * cerca) * (1.6 if maestra else 1.0) * k_op
        w = (.7 + 1.15 * cerca) * (1.55 if maestra else 1.0)
        col = '#eaf7ff' if maestra else '#d3e7f3'
        g.append(f'<path d="M0 {round(y, 1)} H{W}" stroke="{col}" '
                 f'stroke-width="{round(w, 2)}" opacity="{round(min(o, .85), 3)}"/>')
    return ''.join(g)


# ── ejes de manipulación ────────────────────────────────────────────────
def _eje(ang, largo, grad, cono, sy, brillo='.5'):
    """Eje de manipulación: cilindro con brillo longitudinal y punta cónica."""
    a, b = 13 + largo, 13 + largo + 27
    return (f'<g transform="translate({CX} 304) rotate({ang})">'
            f'<rect x="13" y="-6.5" width="{largo}" height="13" rx="6.5" fill="url(#{grad})"/>'
            f'<rect x="19" y="{sy}" width="{largo - 15}" height="3" rx="1.5" fill="#fff" opacity="{brillo}"/>'
            f'<path d="M{a} -14.5 L{b} 0 L{a} 14.5 Z" fill="url(#{cono})"/>'
            f'<path d="M{a} {-14.5 if sy < 0 else 14.5} L{b} 0 L{a} 0 Z" fill="#fff" opacity=".26"/>'
            f'</g>')


# ── paleta de materiales ────────────────────────────────────────────────
# Cada pastilla tiene que **verse como el material que representa**: no basta con
# el color. Por eso cada una lleva su propio degradado de domo, su textura y su
# respuesta especular, que es lo que de verdad distingue un metal de un mate.
MAT_X, MAT_W = 31, 26

_ESPECULAR = {
    # metal cepillado: la banda clara de arriba es el cielo del estudio y la
    # línea oscura el canto del horizonte, que es como se lee un cromado
    'metal': ('<rect x="0" y="8.6" width="26" height="3.4" fill="#f1f8fc" opacity=".5"/>'
              '<rect x="0" y="12" width="26" height="1.3" fill="#080f16" opacity=".55"/>'
              '<path d="M4.5 3.6 L11 3.2" stroke="#fff" stroke-width="1.5" '
              'stroke-linecap="round" opacity=".6"/>'
              '<path d="M3 21.4 L22 19.6" stroke="#cfe6f2" stroke-width="1.1" '
              'stroke-linecap="round" opacity=".32"/>'),
    # vidriado: un punto especular duro y pequeño, más luz de borde abajo
    'brillo': ('<ellipse cx="8.4" cy="7" rx="5.4" ry="4.4" fill="#fff" opacity=".28" '
               'filter="url(#m3d_b1)"/>'
               '<ellipse cx="8.2" cy="6.6" rx="2.9" ry="2.2" transform="rotate(-24 8.2 6.6)" '
               'fill="#fff" opacity=".95"/>'
               '<path d="M4.6 20.6 A9.4 9.4 0 0 0 21.8 18" fill="none" stroke="#cbeaf9" '
               'stroke-width="1.7" opacity=".5"/>'),
    # mate: la luz se reparte sin punto especular, y el terminador es blando
    'mate': ('<ellipse cx="9" cy="8.4" rx="9.2" ry="7.4" fill="#fff" opacity=".17" '
             'filter="url(#m3d_b1)"/>'
             '<ellipse cx="18" cy="20" rx="8" ry="6.5" fill="#1a1710" opacity=".14" '
             'filter="url(#m3d_b1)"/>'),
    # piedra: respuesta desigual, brillo ancho y sucio, y algún grano que salta
    'piedra': ('<ellipse cx="9.4" cy="8" rx="8.4" ry="6.6" fill="#fff" opacity=".14" '
               'filter="url(#m3d_b1)"/>'
               '<circle cx="15.6" cy="9.2" r=".9" fill="#fff" opacity=".5"/>'
               '<circle cx="7.4" cy="16.4" r=".75" fill="#fff" opacity=".4"/>'
               '<circle cx="18.4" cy="16" r=".6" fill="#05090e" opacity=".45"/>'),
    # madera: sedosa, un velo alargado siguiendo la veta
    'madera': ('<rect x="2.4" y="4" width="21" height="6" rx="3" fill="#fff" opacity=".16" '
               'filter="url(#m3d_b1)"/>'
               '<path d="M2.6 20 H23" stroke="#2a1a0c" stroke-width="2.4" opacity=".2" '
               'filter="url(#m3d_b1)"/>'),
}

MATERIALES = (
    # y, degradado, textura, opacidad de textura, especular, activa
    (50, 'm3d_mmetal', 'm3d_cepillo', .5, 'metal', False),
    (84, 'm3d_mcer', None, 0, 'brillo', True),
    (118, 'm3d_mmate', 'm3d_micro', .55, 'mate', False),
    (152, 'm3d_mpiedra', 'm3d_moteado', .8, 'piedra', False),
    (186, 'm3d_mmad', 'm3d_vetaF', .8, 'madera', False),
)


def _pastilla(y, grad, tex, op_tex, espec, activa):
    """Una muestra de material: relieve, materia, especular propio y su sombra."""
    x = MAT_X
    halo = (f'<rect x="{x - 3}" y="{y - 3}" width="{MAT_W + 6}" height="{MAT_W + 6}" rx="10" '
            f'fill="{C["oroL"]}" opacity=".3" filter="url(#m3d_b3)"/>') if activa else ''
    textura = (f'<rect x="0" y="0" width="{MAT_W}" height="{MAT_W}" filter="url(#{tex})" '
               f'style="mix-blend-mode:multiply" opacity="{op_tex}"/>') if tex else ''
    return (
        # oclusión y sombra de la pastilla contra el carril
        f'<rect x="{x + 1}" y="{y + 2.4}" width="{MAT_W}" height="{MAT_W}" rx="7.5" '
        f'fill="#03101c" opacity=".42" filter="url(#m3d_b1)"/>'
        + halo
        + f'<g transform="translate({x} {y})" clip-path="url(#m3d_cchip)">'
          f'<rect width="{MAT_W}" height="{MAT_W}" fill="url(#{grad})"/>'
          f'{textura}{_ESPECULAR[espec]}'
          # bisel: canto de luz arriba-izquierda, canto oscuro abajo-derecha
          f'<path d="M1.1 19 L1.1 7.4 A6.3 6.3 0 0 1 7.4 1.1 L19 1.1" fill="none" '
          f'stroke="#fff" stroke-width="1.5" opacity=".34"/>'
          f'<path d="M24.9 7.4 L24.9 18.6 A6.3 6.3 0 0 1 18.6 24.9 L7 24.9" fill="none" '
          f'stroke="#04101c" stroke-width="1.5" opacity=".4"/>'
          f'</g>'
        + (f'<rect x="{x - .6}" y="{y - .6}" width="{MAT_W + 1.2}" height="{MAT_W + 1.2}" rx="7.6" '
           f'fill="none" stroke="{C["oroLL"]}" stroke-width="1.6" opacity=".9"/>'
           if activa else
           f'<rect x="{x}" y="{y}" width="{MAT_W}" height="{MAT_W}" rx="7" fill="none" '
           f'stroke="#0a1a26" stroke-width=".9" opacity=".35"/>'))


def escena():
    k = C
    d = (
        # ── visor: fondo de estudio ──────────────────────────────────────
        # gradación no lineal: el ciclorama pierde luz hacia arriba y hacia los
        # lados, y gana justo antes del canto del suelo
        lg('m3d_bg', 0, 0, 0, 1, [(0, '#121821', None), (.16, '#182029', None),
                                  (.36, '#232e39', None), (.56, '#334150', None),
                                  (.74, '#455565', None), (.88, '#566776', None),
                                  (1, '#63757f', None)])
        + rg('m3d_key', .17, .02, .82, [(0, '#fff7e6', .52), (.24, '#ffeac2', .28),
                                        (.5, '#e9d9b8', .11), (1, '#e9d9b8', 0)], fx=.09, fy=-.06)
        + rg('m3d_caida', .82, .22, .72, [(0, '#03080f', .34), (.5, '#03080f', .14),
                                          (1, '#03080f', 0)])
        + rg('m3d_relleno', .93, .92, .82, [(0, '#7fb6d8', .3), (.34, '#5d92b4', .13),
                                            (.7, '#3d6d8e', .04), (1, '#3d6d8e', 0)])
        + rg('m3d_ambi', .52, 1, .9, [(0, '#3a5a80', .16), (.55, '#28405e', .05),
                                      (1, '#28405e', 0)])
        + lg('m3d_cove', 0, 0, 0, 1, [(0, '#040a12', 0), (.55, '#050c14', .07),
                                      (.9, '#061019', .17), (1, '#07131d', .05)])
        + lg('m3d_suelo', 0, 0, 0, 1, [(0, '#b3c1c9', None), (.08, '#9dabb5', None),
                                       (.26, '#87959f', None), (.54, '#6d7b86', None),
                                       (.8, '#56616c', None), (1, '#414b56', None)])
        + rg('m3d_charco', .26, .52, .6, [(0, '#ffeec9', .22), (.5, '#ffe2ac', .08),
                                          (1, '#ffe2ac', 0)])
        + lg('m3d_frio', 0, 0, 1, .35, [(0, '#0d2436', 0), (.5, '#0d2436', .06),
                                        (1, '#0b2032', .2)])
        # atenuación de las radiales de la rejilla, en espacio de usuario
        + _ug('m3d_glmin', SUELO, FONDO, [(0, '#d3e7f3', 0), (.05, '#d3e7f3', .06),
                                          (.24, '#d8eaf5', .3), (.55, '#e2f0f8', .56),
                                          (.8, '#ecf6fc', .72), (1, '#f4fafd', .82)])
        + _ug('m3d_glmaj', SUELO, FONDO, [(0, '#eaf7ff', 0), (.05, '#eaf7ff', .07),
                                          (.24, '#eaf7ff', .3), (.55, '#f2fbff', .62),
                                          (.8, '#fbfeff', .8), (1, '#fff', .88)])
        # máscaras de profundidad de la rejilla y del grano del suelo
        + lg('m3d_fade', 0, 0, 0, 1, [(0, '#000', None), (.16, '#0e0e0e', None),
                                      (.46, '#8c8c8c', None), (.78, '#ececec', None),
                                      (1, '#fff', None)])
        + lg('m3d_near', 0, 0, 0, 1, [(0, '#000', None), (.4, '#0c0c0c', None),
                                      (.78, '#d0d0d0', None), (1, '#fff', None)])
        + lg('m3d_piso', 0, 0, 0, 1, [(0, '#000', None), (.3, '#2a2a2a', None),
                                      (.72, '#c4c4c4', None), (1, '#fff', None)])
        # ── taza: sombreado que gira alrededor del cuerpo ────────────────
        + lg('m3d_cuerpo', 0, 0, 1, 0,
             [(0, '#2d6b8f', None), (.05, '#59a7d1', None), (.13, '#9ed2ea', None),
              (.22, '#6fb2d6', None), (.36, '#3782ac', None), (.54, '#1a5e87', None),
              (.74, '#0a3352', None), (.89, '#041e31', None), (1, '#2b6f8f', None)])
        + lg('m3d_vert', 0, 0, 0, 1, [(0, '#fff', .2), (.24, '#fff', 0),
                                      (.74, '#04121e', .05), (1, '#04121e', .16)])
        + lg('m3d_labio', .1, 0, .95, 1,
             [(0, '#f6fdff', None), (.16, '#d3f0fd', None), (.44, '#7db9d8', None),
              (.72, '#2a6c92', None), (1, '#0c3149', None)])
        + lg('m3d_canto', 0, 0, .2, 1, [(0, '#0a2d45', None), (.4, '#06202f', None),
                                        (1, '#041520', None)])
        + lg('m3d_int', 1, 0, 0, 1, [(0, '#2d6786', None), (.32, '#17415b', None),
                                     (.72, '#0c2839', None), (1, '#061622', None)])
        + lg('m3d_fres', 0, 0, 1, 0, [(0, '#eaf8ff', .85), (.18, '#eaf8ff', .12),
                                      (.62, '#9fd9ef', .2), (.86, '#bfe9fb', .75),
                                      (1, '#e4f7ff', .9)])
        + rg('m3d_espec', .5, .4, .55, [(0, '#fff', .92), (.45, '#e8f7ff', .35), (1, '#e8f7ff', 0)])
        # ventana de estudio reflejada en el vidriado
        + lg('m3d_vent', .2, 0, .9, 1, [(0, '#fff', 1), (.4, '#fbfeff', .92),
                                        (1, '#d7eefb', .5)])
        + lg('m3d_refl', 0, 0, 0, 1, [(0, '#c8c8c8', None), (.35, '#4a4a4a', None),
                                      (1, '#000', None)])
        # ── sombra proyectada ────────────────────────────────────────────
        + lg('m3d_som', 0, 0, 1, 0, [(0, '#050e18', .66), (.26, '#071322', .52),
                                     (.58, '#08182a', .3), (.84, '#0a1c30', .1), (1, '#0a1c30', 0)])
        # ── ejes de manipulación ─────────────────────────────────────────
        + lg('m3d_ex', 0, 0, 0, 1, [(0, '#ff9c86', None), (.26, k['rojL'], None),
                                    (.6, k['roj'], None), (1, '#5e120d', None)])
        + lg('m3d_exc', 0, 0, 0, 1, [(0, '#ffb9a6', None), (.45, k['rojL'], None), (1, '#6d150f', None)])
        + lg('m3d_ey', 0, 0, 0, 1, [(0, '#a8e89b', None), (.26, k['verdL'], None),
                                    (.6, k['verd'], None), (1, '#143d1b', None)])
        + lg('m3d_eyc', 0, 0, 0, 1, [(0, '#c2f0b6', None), (.45, k['verdL'], None), (1, '#174420', None)])
        + lg('m3d_ez', 0, 0, 0, 1, [(0, '#0c3247', None), (.4, k['azul'], None),
                                    (.74, k['azulL'], None), (1, '#a5dbf3', None)])
        + lg('m3d_ezc', 0, 0, 0, 1, [(0, '#0d3a52', None), (.55, k['azulL'], None), (1, '#bfe6f8', None)])
        + rg('m3d_orig', .34, .3, .75, [(0, '#ffffff', None), (.5, '#cfe6f2', None), (1, '#6d8b9c', None)])
        # ── vértices y cubo de vista ─────────────────────────────────────
        + lg('m3d_vtx', 0, 0, 1, 1, [(0, '#fff3c4', None), (.35, k['oroL'], None), (1, '#a97c00', None)])
        + lg('m3d_cubeT', .12, 0, .88, 1, [(0, '#ffffff', None), (.38, '#e2edf5', None),
                                           (.78, '#c0d3e0', None), (1, '#9fb8c9', None)])
        + lg('m3d_cubeL', 0, 0, 1, 1, [(0, '#7e9aac', None), (.55, '#5a7486', None),
                                       (1, '#3b5264', None)])
        + lg('m3d_cubeR', 0, 0, 1, 1, [(0, '#26394a', None), (.6, '#1a2a39', None),
                                       (1, '#0e1a26', None)])
        + lg('m3d_panel', 0, 0, .6, 1, [(0, '#617f92', .93), (.42, '#3e5769', .9),
                                        (1, '#243349', .93)])
        + rg('m3d_asaglow', .5, .5, .6, [(0, k['violL'], .5), (1, k['violL'], 0)])
        # ── materiales de la paleta ──────────────────────────────────────
        # metal: cielo oscuro arriba, banda de horizonte, rebote de suelo abajo
        + lg('m3d_mmetal', 0, 0, 0, 1, [(0, '#394b58', None), (.2, '#8ba3b2', None),
                                        (.36, '#e6f1f7', None), (.5, '#5d7284', None),
                                        (.68, '#1d2a35', None), (.86, '#41525f', None),
                                        (1, '#96a9b6', None)])
        + rg('m3d_mcer', .3, .24, .95, [(0, '#e4f8ff', None), (.3, '#7fcbe9', None),
                                        (.62, '#2478a4', None), (.88, '#0d3c5a', None),
                                        (1, '#1c5a7c', None)])
        + rg('m3d_mmate', .32, .26, .98, [(0, '#f9f3e6', None), (.42, '#ddd2bd', None),
                                          (.8, '#9a9080', None), (1, '#7d7466', None)])
        + rg('m3d_mpiedra', .34, .26, .98, [(0, '#c9ccd1', None), (.36, '#949aa4', None),
                                            (.74, '#565d69', None), (1, '#3a414d', None)])
        + lg('m3d_mmad', .15, 0, .85, 1, [(0, k['madLL'], None), (.34, k['madL'], None),
                                          (.72, k['mad'], None), (1, k['madS'], None)])
        # ── recortes y máscaras ──────────────────────────────────────────
        + f'<clipPath id="m3d_ccuerpo"><path d="{CUERPO}"/></clipPath>'
        + (f'<clipPath id="m3d_cint"><ellipse cx="{CX}" cy="{RIM_Y + 1}" '
           f'rx="{RIM_RX - 17}" ry="{RIM_RY - 7.5}"/></clipPath>')
        + f'<clipPath id="m3d_cchip"><rect width="{MAT_W}" height="{MAT_W}" rx="7"/></clipPath>'
        + (f'<mask id="m3d_mgrid"><rect x="0" y="{SUELO}" width="{W}" height="{H - SUELO}" '
           f'fill="url(#m3d_fade)"/></mask>')
        + (f'<mask id="m3d_mnear"><rect x="0" y="{SUELO}" width="{W}" height="{H - SUELO}" '
           f'fill="url(#m3d_near)"/></mask>')
        + (f'<mask id="m3d_mpiso"><rect x="0" y="{SUELO}" width="{W}" height="{H - SUELO}" '
           f'fill="url(#m3d_piso)"/></mask>')
        + (f'<mask id="m3d_mrefl"><rect x="{CX - RIM_RX - 8}" y="{BASE_Y}" '
           f'width="{2 * RIM_RX + 16}" height="74" fill="url(#m3d_refl)"/></mask>')
        + '<filter id="m3d_b1" x="-30%" y="-30%" width="160%" height="160%">'
          '<feGaussianBlur stdDeviation="2.1"/></filter>'
        + '<filter id="m3d_b3" x="-40%" y="-40%" width="180%" height="180%">'
          '<feGaussianBlur stdDeviation="3.2"/></filter>'
        + '<filter id="m3d_b7" x="-45%" y="-45%" width="190%" height="190%">'
          '<feGaussianBlur stdDeviation="7"/></filter>'
        + '<filter id="m3d_b11" x="-50%" y="-60%" width="200%" height="220%">'
          '<feGaussianBlur stdDeviation="11"/></filter>'
        + '<filter id="m3d_b26" x="-60%" y="-70%" width="220%" height="240%">'
          '<feGaussianBlur stdDeviation="26"/></filter>'
        # ── texturas propias ─────────────────────────────────────────────
        + _ruido('m3d_nube', '.022 .04', 5, 1.9, '-.78', 11,      # aire del estudio
                 contraste=(2.2, '-.68'))
        + _ruido('m3d_micro', '1.15', 2, .46, '-.19', 5)          # grano fino
        + _ruido('m3d_cepillo', '1.6 .035', 3, .55, '-.22', 9)    # metal cepillado
        + _ruido('m3d_moteado', '.42', 3, .74, '-.3', 17)         # grano de piedra
        + _ruido('m3d_vetaF', '.03 .55', 4, .8, '-.28', 23)       # veta corta, de muestra
    )

    return svg(
        # ═══ fondo de estudio ═══════════════════════════════════════════
        f'<rect width="{W}" height="{H}" fill="url(#m3d_bg)"/>'
        # moteado de aire: el ciclorama tiene materia, no es un degradado liso
        f'<g opacity=".7" filter="url(#m3d_b26)">'
        f'<ellipse cx="96" cy="34" rx="210" ry="96" fill="#8fa6bb" opacity=".18"/>'
        f'<ellipse cx="392" cy="20" rx="180" ry="80" fill="#050c14" opacity=".3"/>'
        f'<ellipse cx="560" cy="112" rx="200" ry="74" fill="#6d8496" opacity=".12"/>'
        f'<ellipse cx="232" cy="118" rx="240" ry="58" fill="#0a131c" opacity=".2"/>'
        f'</g>'
        f'<rect width="{W}" height="{SUELO + 8}" filter="url(#m3d_nube)" '
        f'style="mix-blend-mode:overlay" opacity=".2"/>'
        # foco de clave arriba a la izquierda: de ahí viene toda la luz
        f'<rect width="{W}" height="{H}" fill="url(#m3d_key)"/>'
        # dos haces volumétricos muy tenues, que es lo que separa el aire del plano
        f'<g filter="url(#m3d_b26)">'
        f'<path d="M-40 -30 L120 -30 L278 {SUELO + 6} L74 {SUELO + 6} Z" fill="#fff1d8" opacity=".3"/>'
        f'<path d="M166 -30 L222 -30 L346 {SUELO + 6} L266 {SUELO + 6} Z" fill="#fff1d8" opacity=".15"/>'
        f'<path d="M300 -30 L330 -30 L432 {SUELO + 6} L384 {SUELO + 6} Z" fill="#eaf3fb" opacity=".07"/>'
        f'</g>'
        f'<rect width="{W}" height="{SUELO + 8}" fill="url(#m3d_caida)"/>'
        f'<rect width="{W}" height="{SUELO + 8}" fill="url(#m3d_ambi)"/>'
        f'<rect width="{W}" height="{SUELO + 8}" fill="url(#m3d_relleno)"/>'
        # el ruido del sensor vive en las sombras: en modo screen, la zona oscura
        # deja de ser un plano vacío sin que se ensucie el resto
        f'<rect width="{W}" height="{SUELO + 8}" filter="url(#m3d_nube)" '
        f'style="mix-blend-mode:screen" opacity=".1"/>'
        f'<rect width="{W}" height="{SUELO + 8}" filter="url(#m3d_micro)" '
        f'style="mix-blend-mode:screen" opacity=".07"/>'
        # canto donde el suelo se encuentra con el infinito: el ciclorama se cierra
        f'<rect x="0" y="{SUELO - 86}" width="{W}" height="88" fill="url(#m3d_cove)"/>'
        # bruma baja, pegada al horizonte y más densa donde da la clave
        f'<ellipse cx="236" cy="{SUELO + 2}" rx="368" ry="26" fill="#9ec6dd" opacity=".34" '
        f'filter="url(#m3d_b26)"/>'
        f'<ellipse cx="118" cy="{SUELO + 6}" rx="184" ry="16" fill="#e2f2fb" opacity=".3" '
        f'filter="url(#m3d_b11)"/>'
        # ═══ suelo ══════════════════════════════════════════════════════
        f'<rect x="0" y="{SUELO}" width="{W}" height="{H - SUELO}" fill="url(#m3d_suelo)"/>'
        f'<rect x="0" y="{SUELO}" width="{W}" height="{H - SUELO}" fill="url(#m3d_charco)"/>'
        f'<rect x="0" y="{SUELO}" width="{W}" height="{H - SUELO}" fill="url(#m3d_frio)"/>'
        f'<ellipse cx="152" cy="330" rx="230" ry="96" fill="#ffe9c0" opacity=".1" '
        f'filter="url(#m3d_b26)"/>'
        # grano del suelo: solo se ve de la mitad hacia la cámara
        f'<rect x="0" y="{SUELO}" width="{W}" height="{H - SUELO}" filter="url(#m3d_nube)" '
        f'style="mix-blend-mode:multiply" opacity=".14"/>'
        f'<g mask="url(#m3d_mpiso)">'
        f'<rect x="0" y="{SUELO}" width="{W}" height="{H - SUELO}" filter="url(#m3d_micro)" '
        f'style="mix-blend-mode:multiply" opacity=".3"/></g>'
        # la línea del canto, fina y caliente por la izquierda
        f'<rect x="0" y="{SUELO - 1.5}" width="{W}" height="2.6" fill="#dcedf6" opacity=".46" '
        f'filter="url(#b2)"/>'
        f'<rect x="0" y="{SUELO - 2}" width="300" height="3" fill="#fff0d2" opacity=".3" '
        f'filter="url(#b5)"/>'
        # ═══ rejilla: lejos desenfocada y tenue, cerca nítida ════════════
        f'<g mask="url(#m3d_mgrid)" filter="url(#m3d_b1)">{_rejilla(1.0)}</g>'
        f'<g mask="url(#m3d_mnear)" opacity=".9">{_rejilla(.9)}</g>'
        # ═══ objeto de referencia al fondo: desenfocado y sin contraste ══
        f'<g filter="url(#m3d_b3)" opacity=".55">'
        f'<ellipse cx="506" cy="216" rx="34" ry="8" fill="#0b1b2a" opacity=".45"/>'
        f'<ellipse cx="506" cy="214" rx="20" ry="4.6" fill="#040e18" opacity=".5"/>'
        f'<path d="M506 168 L534 182 L506 196 L478 182 Z" fill="#b6ccd8"/>'
        f'<path d="M478 182 L506 196 L506 214 L478 200 Z" fill="#59788c"/>'
        f'<path d="M506 196 L534 182 L534 200 L506 214 Z" fill="#33505f"/></g>'
        f'<path d="M478 182 L506 168 L534 182" fill="none" stroke="#dbeaf4" stroke-width="1.6" '
        f'opacity=".3" filter="url(#m3d_b1)"/>'
        # ═══ el modelo, a escala de protagonista ════════════════════════
        f'<g transform="translate(-32.4 -7) scale(1.12)">'
        # reflejo difuso en el suelo de estudio: la taza deja de flotar
        f'<g mask="url(#m3d_mrefl)" opacity=".42" filter="url(#m3d_b3)">'
        f'<g transform="translate(0 {2 * BASE_Y}) scale(1 -1)">'
        f'<path d="{CUERPO}" fill="url(#m3d_cuerpo)"/>'
        f'<ellipse cx="{CX}" cy="{RIM_Y}" rx="{RIM_RX}" ry="{RIM_RY}" fill="url(#m3d_labio)"/>'
        f'</g></g>'
        # ═══ sombra proyectada: cola larga y difusa ═════════════════════
        f'<ellipse cx="398" cy="320" rx="154" ry="40" transform="rotate(4 398 320)" '
        f'fill="url(#m3d_som)" filter="url(#m3d_b7)"/>'
        f'<ellipse cx="452" cy="323" rx="132" ry="34" transform="rotate(5 452 323)" '
        f'fill="url(#m3d_som)" opacity=".38" filter="url(#m3d_b11)"/>'
        f'<ellipse cx="336" cy="317" rx="96" ry="26" fill="#061220" opacity=".4" filter="url(#m3d_b7)"/>'
        f'<ellipse cx="296" cy="316" rx="70" ry="17" fill="#030d18" opacity=".34" filter="url(#m3d_b7)"/>'
        # ═══ contacto con oclusión: pegada al suelo, no flotando ════════
        f'<ellipse cx="{CX + 12}" cy="{BASE_Y + 12}" rx="{BASE_RX + 13}" ry="12" fill="#04101c" '
        f'opacity=".28" filter="url(#m3d_b7)"/>'
        f'<path d="M{CX - BASE_RX + 5} {BASE_Y + 12.5} A{BASE_RX - 5} {BASE_RY - 5} 0 0 0 '
        f'{CX + BASE_RX - 3} {BASE_Y + 11}" fill="none" stroke="#010609" stroke-width="6" '
        f'opacity=".55" filter="url(#m3d_b1)"/>'
        # ═══ la taza ════════════════════════════════════════════════════
        f'<path d="M{CX - RIM_RX + 1} {RIM_Y + 8} L{CX - BASE_RX + 1} {BASE_Y - 16}" fill="none" '
        f'stroke="#fff0cf" stroke-width="7" stroke-linecap="round" opacity=".3" filter="url(#m3d_b3)"/>'
        f'<path d="{CUERPO}" fill="url(#m3d_cuerpo)"/>'
        f'<path d="{CUERPO}" fill="url(#m3d_vert)"/>'
        f'<g clip-path="url(#m3d_ccuerpo)">'
        f'<path d="M{CX - RIM_RX + 2} {RIM_Y + 9} A{RIM_RX - 2} {RIM_RY - 2} 0 0 0 '
        f'{CX + RIM_RX - 2} {RIM_Y + 8}" fill="none" stroke="#04182a" stroke-width="9" '
        f'opacity=".34" filter="url(#m3d_b3)"/>'
        # luz de borde en el canto que da a la luz
        f'<path d="M{CX - RIM_RX + 2} {RIM_Y + 4} L{CX - BASE_RX + 2} {BASE_Y - 4}" fill="none" '
        f'stroke="#ffeec7" stroke-width="9" stroke-linecap="round" opacity=".34" filter="url(#m3d_b3)"/>'
        f'<path d="M{CX - RIM_RX + 3} {RIM_Y + 6} L{CX - BASE_RX + 3} {BASE_Y - 30}" fill="none" '
        f'stroke="#fffaf0" stroke-width="3" stroke-linecap="round" opacity=".62" filter="url(#m3d_b1)"/>'
        # luz de rebote fría en la zona de sombra (canto derecho)
        f'<path d="M{CX + RIM_RX - 3} {RIM_Y + 10} L{CX + BASE_RX - 3} {BASE_Y - 6}" fill="none" '
        f'stroke="#69d4e8" stroke-width="8" stroke-linecap="round" opacity=".6" filter="url(#m3d_b3)"/>'
        # rebote del suelo en la panza baja: frío y neutro, como el ciclorama
        f'<ellipse cx="282" cy="298" rx="66" ry="20" fill="#b9d8ea" opacity=".2" filter="url(#b12)"/>'
        f'<ellipse cx="318" cy="296" rx="44" ry="15" fill="#7fb9d6" opacity=".14" filter="url(#b12)"/>'
        # línea de horizonte del estudio reflejada en el vidriado
        f'<path d="M204 274 A66 21 0 0 0 336 270" fill="none" stroke="#e6f6ff" stroke-width="2.2" '
        f'opacity=".3" filter="url(#m3d_b1)"/>'
        # reflejo especular de ventana de estudio: dos paños y su montante
        f'<ellipse cx="233" cy="240" rx="15" ry="50" transform="rotate(-3 233 240)" '
        f'fill="url(#m3d_espec)" opacity=".46" filter="url(#m3d_b7)"/>'
        f'<g opacity="1">'
        f'<path d="M226.6 203 C230.4 200 234.6 201.4 235.2 205.4 C236.4 224 235.8 244 234 258 '
        f'C233.2 264 228 264.6 227 259 C225 243 224.6 219 226.6 203 Z" fill="url(#m3d_vent)"/>'
        f'<path d="M238.6 212 C241.4 210.2 244.2 211.6 244.2 214.6 C244 230 242.6 245 240.6 255 '
        f'C239.6 260 235.6 260 235.4 255 C235.2 241 236.4 224 238.6 212 Z" fill="url(#m3d_vent)" '
        f'opacity=".62"/>'
        f'<path d="M228.4 205 C226.8 222 226.8 242 228.4 255" fill="none" stroke="#fff" '
        f'stroke-width="2" stroke-linecap="round" opacity=".95"/>'
        f'</g>'
        # un segundo reflejo, más débil y estirado, del lado de sombra
        f'<ellipse cx="322" cy="248" rx="5" ry="34" transform="rotate(4 322 248)" '
        f'fill="#cfeeff" opacity=".16" filter="url(#m3d_b3)"/>'
        # oclusión de la base contra el suelo, por dentro del contorno
        f'<ellipse cx="{CX}" cy="{BASE_Y + 27}" rx="{BASE_RX + 8}" ry="19" fill="#02090f" '
        f'opacity=".26" filter="url(#m3d_b7)"/>'
        f'<path d="M211 300 A59 18.5 0 0 1 329 300" fill="none" stroke="#f2fafe" stroke-width="5.4" '
        f'opacity=".54" filter="url(#m3d_b1)"/>'
        f'<path d="M214 303 A57 17 0 0 1 296 314" fill="none" stroke="#fff" stroke-width="2" '
        f'opacity=".42" filter="url(#m3d_b1)"/>'
        # grano fino del vidriado: material, no color plano
        f'<rect x="180" y="150" width="180" height="180" filter="url(#m3d_nube)" '
        f'style="mix-blend-mode:multiply" opacity=".18"/>'
        f'<rect x="180" y="150" width="180" height="180" filter="url(#grano)" '
        f'style="mix-blend-mode:overlay" opacity=".16"/>'
        # malla: isoparamétricas de la cara vista
        f'<path d="M202 222 A67.6 21.2 0 0 1 338 222" fill="none" stroke="#dff2ff" stroke-width="1.2" opacity=".14"/>'
        f'<path d="M207 266 A63.4 19.5 0 0 1 333 266" fill="none" stroke="#dff2ff" stroke-width="1.2" opacity=".13"/>'
        f'<path d="M228 195 L236 317 M270 199 L270 320 M312 195 L304 317" fill="none" '
        f'stroke="#dff2ff" stroke-width="1.2" opacity=".13"/>'
        f'</g>'
        f'<path d="{CUERPO}" fill="none" stroke="url(#m3d_fres)" stroke-width="2.6" '
        f'opacity=".6"/>'
        # ═══ el labio: la cerámica tiene grosor de pared ════════════════
        # canto exterior oscuro: es el espesor visto desde fuera
        f'<ellipse cx="{CX}" cy="{RIM_Y + 5}" rx="{RIM_RX + .6}" ry="{RIM_RY}" fill="url(#m3d_canto)"/>'
        f'<ellipse cx="{CX}" cy="{RIM_Y}" rx="{RIM_RX}" ry="{RIM_RY}" fill="url(#m3d_labio)"/>'
        # el filo de abajo del anillo: la pared cercana vista por su canto
        f'<path d="M{CX - RIM_RX + 2} {RIM_Y + 4} A{RIM_RX} {RIM_RY} 0 0 0 {CX + RIM_RX - 2} '
        f'{RIM_Y + 3}" fill="none" stroke="#e6f6ff" stroke-width="1.5" opacity=".5"/>'
        # el filo de la pared, iluminado en la mitad que mira a la clave
        f'<path d="M{CX - RIM_RX + 3} {RIM_Y - 5} A{RIM_RX} {RIM_RY} 0 0 1 {CX + 14} '
        f'{RIM_Y - RIM_RY + .5}" fill="none" stroke="#fff" stroke-width="3.2" '
        f'stroke-linecap="round" opacity=".82" filter="url(#m3d_b1)"/>'
        # y apagado del lado de sombra, donde solo llega el rebote
        f'<path d="M{CX + 26} {RIM_Y - RIM_RY + 3} A{RIM_RX} {RIM_RY} 0 0 1 {CX + RIM_RX - 5} '
        f'{RIM_Y + 6}" fill="none" stroke="#9fd6ec" stroke-width="2" stroke-linecap="round" '
        f'opacity=".45" filter="url(#m3d_b1)"/>'
        # interior de la boca, en sombra, con oclusión contra la pared
        f'<ellipse cx="{CX}" cy="{RIM_Y + 1}" rx="{RIM_RX - 17}" ry="{RIM_RY - 7.5}" fill="url(#m3d_int)"/>'
        f'<g clip-path="url(#m3d_cint)">'
        f'<ellipse cx="{CX}" cy="{RIM_Y + 1}" rx="{RIM_RX - 17}" ry="{RIM_RY - 7.5}" fill="none" '
        f'stroke="#03101b" stroke-width="12" opacity=".72" filter="url(#m3d_b3)"/>'
        # la pared interior del fondo sí recibe la clave: es lo que cuenta la
        # transición de la sombra del interior al labio iluminado
        f'<path d="M{CX - 22} {RIM_Y - 12} A{RIM_RX - 19} {RIM_RY - 9} 0 0 1 {CX + 50} {RIM_Y + 3}" '
        f'fill="none" stroke="#8fcfe8" stroke-width="4.4" opacity=".5" filter="url(#m3d_b3)"/>'
        f'<path d="M{CX - 14} {RIM_Y - 11} A{RIM_RX - 21} {RIM_RY - 10} 0 0 1 {CX + 30} {RIM_Y - 8}" '
        f'fill="none" stroke="#d8f1fd" stroke-width="1.6" opacity=".4" filter="url(#m3d_b1)"/>'
        f'<ellipse cx="{CX + 6}" cy="{RIM_Y + 8}" rx="26" ry="6" fill="#1d5474" opacity=".5" filter="url(#m3d_b3)"/>'
        f'</g>'
        # ═══ el asa que falta: previsualización punteada con resplandor ══
        f'<ellipse cx="376" cy="238" rx="58" ry="56" fill="url(#m3d_asaglow)" opacity=".72" filter="url(#b12)"/>'
        f'<path d="M340 206 C404 208 410 260 332 274" fill="none" stroke="{k["violL"]}" '
        f'stroke-width="15" stroke-linecap="round" opacity=".5" filter="url(#m3d_b3)"/>'
        f'<path d="M340 206 C404 208 410 260 332 274" fill="none" stroke="{k["violLL"]}" '
        f'stroke-width="4.2" stroke-linecap="round" stroke-dasharray="11 8" opacity="1"/>'
        f'<path d="M347 218 C388 222 392 254 340 264" fill="none" stroke="{k["violLL"]}" '
        f'stroke-width="2" stroke-dasharray="6 6" opacity=".55"/>'
        f'<circle cx="340" cy="206" r="4.5" fill="{k["violLL"]}" opacity=".9"/>'
        f'<circle cx="332" cy="274" r="4.5" fill="{k["violLL"]}" opacity=".9"/>'
        # ═══ selección: arista viva del labio + vértices con brillo ══════
        f'<ellipse cx="{CX}" cy="{RIM_Y}" rx="{RIM_RX}" ry="{RIM_RY}" fill="none" stroke="{k["oroL"]}" '
        f'stroke-width="4.6" opacity=".3" filter="url(#m3d_b3)"/>'
        f'<ellipse cx="{CX}" cy="{RIM_Y}" rx="{RIM_RX}" ry="{RIM_RY}" fill="none" stroke="{k["oroLL"]}" '
        f'stroke-width="1.8" opacity=".85"/>'
        + ''.join(
            f'<rect x="{x - 7}" y="{y - 7}" width="14" height="14" rx="1" fill="{k["oroL"]}" '
            f'opacity=".5" filter="url(#m3d_b3)"/>'
            f'<rect x="{x - 5.5}" y="{y - 5.5}" width="11" height="11" rx="1.5" fill="url(#m3d_vtx)" '
            f'stroke="#0a1a26" stroke-width="1.4"/>'
            f'<rect x="{x - 4}" y="{y - 4}" width="4.5" height="3" rx="1" fill="#fff" opacity=".85"/>'
            for x, y in ((CX - RIM_RX, RIM_Y), (CX + RIM_RX, RIM_Y), (CX, RIM_Y - RIM_RY),
                         (CX, RIM_Y + RIM_RY), (CX - BASE_RX, BASE_Y), (CX + BASE_RX, BASE_Y)))
        # ═══ ejes de manipulación: cilindros con brillo y puntas cónicas ══
        + _eje(6, 76, 'm3d_ex', 'm3d_exc', -4.8)
        + _eje(-90, 66, 'm3d_ey', 'm3d_eyc', -4.8)
        + _eje(157, 62, 'm3d_ez', 'm3d_ezc', 1.8, '.42')
        + f'<circle cx="{CX}" cy="304" r="9" fill="url(#m3d_orig)"/>'
        f'<circle cx="{CX}" cy="304" r="9" fill="none" stroke="#0a1a26" stroke-width="1.2" opacity=".55"/>'
        + '</g>'
        # ═══ cubo de vista: tres valores, canto biselado y sombra propia ══
        + f'<g transform="translate(566 62) scale(.86) translate(-566 -62)">'
        f'<ellipse cx="574" cy="99" rx="30" ry="7" fill="#040d16" opacity=".3" '
        f'filter="url(#m3d_b3)"/>'
        f'<g filter="url(#sombraC)">'
        f'<path d="M566 28 L600 45 L566 62 L532 45 Z" fill="url(#m3d_cubeT)"/>'
        f'<path d="M532 45 L566 62 L566 96 L532 79 Z" fill="url(#m3d_cubeL)"/>'
        f'<path d="M566 62 L600 45 L600 79 L566 96 Z" fill="url(#m3d_cubeR)"/></g>'
        # oclusión en la arista interior, donde las tres caras se juntan
        f'<path d="M566 62 L566 96" fill="none" stroke="#04101c" stroke-width="3.4" '
        f'opacity=".38" filter="url(#m3d_b1)"/>'
        f'<path d="M566 62 L600 45" fill="none" stroke="#04101c" stroke-width="2.6" '
        f'opacity=".3" filter="url(#m3d_b1)"/>'
        # canto vivo: bisel iluminado en las tres aristas que miran a la clave
        f'<path d="M532 45 L566 28" fill="none" stroke="#fff" stroke-width="2.6" '
        f'stroke-linecap="round" opacity=".92"/>'
        f'<path d="M566 28 L600 45" fill="none" stroke="#dcecf6" stroke-width="1.5" '
        f'stroke-linecap="round" opacity=".5"/>'
        f'<path d="M532 45 L566 62" fill="none" stroke="#eaf6fd" stroke-width="1.4" opacity=".4"/>'
        f'<path d="M532 45 L532 79" fill="none" stroke="#f2fafe" stroke-width="2" opacity=".62"/>'
        f'<path d="M532 79 L566 96 L600 79" fill="none" stroke="#04101c" stroke-width="1.6" '
        f'stroke-linejoin="round" opacity=".42"/>'
        f'<path d="M566 90 L566 96 L578 90" fill="none" stroke="#020a12" stroke-width="5" '
        f'opacity=".3" filter="url(#m3d_b1)"/>'
        f'<circle cx="566" cy="28" r="3.6" fill="{k["oroLL"]}" opacity=".9"/></g>'
        # ═══ paleta de materiales del visor ═════════════════════════════
        + f'<ellipse cx="46" cy="228" rx="42" ry="14" fill="#03101c" opacity=".3" '
        f'filter="url(#m3d_b7)"/>'
        f'<g filter="url(#sombra)"><rect x="22" y="36" width="44" height="192" rx="13" '
        f'fill="url(#m3d_panel)"/></g>'
        f'<rect x="22" y="36" width="44" height="192" rx="13" fill="none" stroke="#cfe6f2" '
        f'stroke-width="1.2" opacity=".3"/>'
        f'<path d="M28 39 H60" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".18"/>'
        f'<rect x="22" y="36" width="44" height="192" rx="13" filter="url(#m3d_micro)" '
        f'style="mix-blend-mode:overlay" opacity=".18"/>'
        + ''.join(_pastilla(*m) for m in MATERIALES)
        # ═══ grano y viñeteado ══════════════════════════════════════════
        + f'<rect width="{W}" height="{H}" filter="url(#grano)" style="mix-blend-mode:overlay" opacity=".11"/>'
        f'<rect width="{W}" height="{H}" fill="url(#m3d_vin)"/>',
        d + rg('m3d_vin', .5, .44, .8, [(.48, '#000', 0), (1, '#02101c', .4)]))
