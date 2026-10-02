# -*- coding: utf-8 -*-
"""Fotografía y composición · variante AGE_0_12 (R65 · fase 2).

**Mismo estudio, mismo proceso, misma calidad.** Menos soportes de lo mismo.

La escena base enseña la tira de negativos **y** la hoja de contactos **y** la
copia con las escuadras: tres veces los mismos fotogramas, en tres estados. Para
quien ya sabe lo que es un contacto, es exacto. Para quien no, son tres rejillas
de cuadraditos.

Aquí queda una sola cadena, y grande:

* **la mesa de luz encendida**, que sigue siendo la segunda fuente de la escena
  y le da su color frío;
* encima, **tres fotogramas grandes** en vez de doce pequeños, en negativo de
  color de verdad —con su máscara naranja—, y **uno rodeado con lápiz graso** y
  otro tachado: elegir es el estudio;
* **la copia grande** debajo, con **las escuadras de recorte formando ventana**:
  se ve lo que queda dentro y lo que queda fuera. Encuadrar es el estudio;
* la cámara apoyada de canto, con el reflejo azulado de la mesa de luz en el
  vidrio del objetivo;
* el lápiz graso rojo.

Fuera la hoja de contactos y la retícula de tercios. El mismo negativo, la misma
mesa de luz y las mismas escuadras: **hay menos y son mayores**.
"""
from taller_suite.escenas_ricas import C, W, H, svg
from taller_suite import rica_comun as M
from taller_suite import rica_fotografia as B

k = C
P = B.P
MESA = 118

ROJO = B.ROJO
LX, LY, LW, LH = 40, 156, 352, 150


def _mesa_luz():
    g = [M.sombra(LX, LY, LW, LH, op=.34, dx=11, dy=14, rx=6),
         f'<rect x="{LX - 9}" y="{LY - 9}" width="{LW + 18}" height="{LH + 18}" rx="9" '
         f'fill="url(#{P}_marco)"/>',
         f'<rect x="{LX - 9}" y="{LY - 9}" width="{LW + 18}" height="7" rx="3.5" '
         f'fill="#ffffff" opacity=".35"/>',
         f'<rect x="{LX - 34}" y="{LY - 34}" width="{LW + 68}" height="{LH + 68}" '
         f'rx="34" fill="#e8f6ff" opacity=".78" filter="url(#b22)"/>',
         f'<rect x="{LX}" y="{LY}" width="{LW}" height="{LH}" rx="3" '
         f'fill="url(#{P}_difusor)"/>']
    return ''.join(g)


def _tira():
    """Tres fotogramas grandes, uno rodeado y otro tachado."""
    x, y, w, h = LX + 18, LY + 24, 316, 102
    g = [f'<g transform="rotate(-2 {x + w / 2} {y + h / 2})">',
         M.sombra(x, y, w, h, op=.26, dx=5, dy=8, rx=1, blur='b2'),
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="#2b2f33"/>']
    for yy in (y + 5, y + h - 15):
        for i in range(17):
            g.append(f'<rect x="{M.r1(x + 9 + i * 18)}" y="{M.r1(yy)}" width="10" '
                     f'height="10" rx="2" fill="url(#{P}_difusor)"/>')
    for i in range(3):
        fx = x + 12 + i * 100
        g.append(f'<g clip-path="url(#{P}_cp_g{i})">')
        g.append(B._paisaje(fx, y + 22, 92, 58, i, negativo=True))
        g.append('</g>')
        g.append(f'<rect x="{M.r1(fx)}" y="{y + 22}" width="92" height="58" '
                 f'fill="none" stroke="#15181b" stroke-width="2"/>')
    # el elegido y el descartado
    g.append(f'<ellipse cx="{M.r1(x + 158)}" cy="{y + 51}" rx="56" ry="38" fill="none" '
             f'stroke="{ROJO}" stroke-width="5" opacity=".92" stroke-linecap="round"/>')
    fx = x + 212
    g.append(M.trazo(f'M{M.r1(fx + 6)} {y + 26} L{M.r1(fx + 86)} {y + 76}', ROJO,
                     w=5, op=.9, halo=False))
    g.append(M.trazo(f'M{M.r1(fx + 86)} {y + 26} L{M.r1(fx + 6)} {y + 76}', ROJO,
                     w=5, op=.9, halo=False))
    g.append('</g>')
    return ''.join(g)


def _copia():
    """La copia grande con las escuadras formando ventana."""
    x, y, w, h = 296, 252, 296, 132
    g = [M.sombra(x, y, w, h, op=.3, dx=8, dy=11, rx=2),
         f'<g transform="rotate(-3 {x + w / 2} {y + h / 2})">',
         f'<g clip-path="url(#{P}_cp_copia_inf)">',
         B._paisaje(x, y, w, h, 2),
         '</g>',
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="none" '
         f'stroke="#efe9dc" stroke-width="7"/>',
         f'<rect x="{x - 3.5}" y="{y - 3.5}" width="{w + 7}" height="{h + 7}" '
         f'fill="none" stroke="{k["noche"]}" stroke-width="1.2" opacity=".3"/>']

    def ele(px, py, rot):
        return (f'<g transform="rotate({rot} {px} {py})">'
                + M.sombra(px, py, 116, 24, op=.34, dx=5, dy=8, rx=2, blur='b2')
                + f'<path d="M{px} {py} h116 v22 h-94 v70 h-22 Z" '
                  f'fill="url(#{P}_carton)"/>'
                + f'<path d="M{px} {py} h116 v5 h-111 v87 h-5 Z" fill="#ffffff" '
                  f'opacity=".5"/>'
                + f'<path d="M{px} {py} h116 v22 h-94 v70 h-22 Z" fill="none" '
                  f'stroke="{k["noche"]}" stroke-width="1.2" opacity=".35"/>'
                + '</g>')
    g.append(ele(x + 18, y + 12, 0))
    g.append(ele(x + 276, y + 120, 180))
    g.append('</g>')
    return ''.join(g)


def _defs_extra():
    d = ''.join(M.clip_rect(f'{P}_cp_g{i}', LX + 30 + i * 100, LY + 46, 92, 58)
                for i in range(3))
    return d + M.clip_rect(f'{P}_cp_copia_inf', 296, 252, 296, 132)


def escena():
    c = M.pared(P, MESA + 6, vx=470, vy=6, vw=130, vh=92)
    c += M.banco(P, MESA, juntas=(), nudos=((240, 386, 8),))
    c += (f'<ellipse cx="{LX + LW / 2}" cy="{LY + LH / 2}" rx="320" ry="220" '
          f'fill="url(#{P}_luzmesa)" filter="url(#b22)"/>')

    c += _mesa_luz()
    c += _tira()
    c += _copia()
    # la cámara, apoyada de canto a la izquierda
    c += '<g transform="translate(-30 23) scale(.92)">'
    c += B._camara()
    c += '</g>'
    c += '<g transform="translate(-40 -62) scale(1)">'
    c += B._lapiz_graso()
    c += '</g>'

    c += M.velo(P, MESA - 6, 40, op=.22)
    c += M.vineta(P, .82)
    return svg(c, B._defs() + _defs_extra())
