# -*- coding: utf-8 -*-
"""Escenas ricas del Taller (R54 · refinamiento tras la revisión de Astra).

Astra: «vector educativo, formas simples, poca profundidad, material y luz».
Este módulo sube el acabado sin cambiar lo que cuenta cada escena.

Cómo se consigue:

* **Luz con dirección.** Una sola clave desde arriba a la izquierda. Todo objeto
  tiene cara iluminada, cara en sombra y sombra proyectada con desenfoque real.
* **Rango de valor.** Ancla oscura, medios, luces y un brillo. Nada de fills planos
  a media altura, que es lo que aplanaba las escenas anteriores.
* **Material.** Veta de madera, fibra del papel, brillo del metal y del vidrio,
  mate del plástico: capas finas a baja opacidad sobre el color base.
* **Profundidad.** Perspectiva atmosférica: el fondo pierde contraste y saturación
  y se desenfoca; el primer plano gana contraste y detalle.
* **Trazo vivo.** Las líneas dibujadas llevan grosor variable, no un stroke constante.

Se usan filtros SVG (desenfoque, sombra) libremente porque las escenas **se
rasterizan en el build**: el navegador recibe un WebP, no un SVG con filtros, así
que no hay coste en tiempo de ejecución.

Originalidad: todo dibujado aquí. Sin stock, sin material de terceros, sin copiar
ninguna escena protegida.
"""

W, H = 640, 400          # el doble de la tarjeta: se rasteriza a este tamaño
LIGHT = (-0.55, -0.8)    # dirección de la luz: arriba a la izquierda

# Paleta con rango de valor de verdad: cada familia tiene sombra, base y luz.
C = {
    'noche': '#0d1b2a', 'tinta': '#14202e', 'grafito': '#2d3b4a',
    'nubeS': '#8fa6bb', 'nube': '#c6d6e4', 'nubeL': '#eaf2f8',
    'madS': '#6b4a2c', 'mad': '#9a6b3f', 'madL': '#c79a62', 'madLL': '#e3c193',
    'papS': '#d8d2c4', 'pap': '#f2ede2', 'papL': '#fdfbf6',
    'azulS': '#12405e', 'azul': '#256b93', 'azulL': '#5fa3c8', 'azulLL': '#bde0f2',
    'violS': '#3b2f6e', 'viol': '#5a49a8', 'violL': '#8d7fd6', 'violLL': '#d9d2f5',
    'verdS': '#1d5427', 'verd': '#33813f', 'verdL': '#71b86a', 'verdLL': '#c4e8b4',
    'rojS': '#7d1a14', 'roj': '#b3261e', 'rojL': '#e05a44', 'rojLL': '#f4b3a2',
    'oroS': '#8a6600', 'oro': '#d39a00', 'oroL': '#f3c23e', 'oroLL': '#ffe9a8',
    'turqS': '#0a5c5c', 'turq': '#0f8f8f', 'turqL': '#4dc4bd', 'turqLL': '#b7ece6',
    'rosa': '#d98aa4', 'rosaL': '#f3c3d0',
}


def defs(extra=''):
    """Filtros y tramas comunes. Se rasteriza, así que los filtros salen gratis."""
    return f'''<defs>
<filter id="b2" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2"/></filter>
<filter id="b5" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
<filter id="b12" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="12"/></filter>
<filter id="b22" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="22"/></filter>
<filter id="sombra" x="-40%" y="-40%" width="180%" height="190%">
  <feDropShadow dx="6" dy="10" stdDeviation="8" flood-color="#0d1b2a" flood-opacity=".28"/></filter>
<filter id="sombraC" x="-40%" y="-40%" width="180%" height="190%">
  <feDropShadow dx="3" dy="5" stdDeviation="3.5" flood-color="#0d1b2a" flood-opacity=".33"/></filter>
<filter id="grano" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3"/>
  <feColorMatrix type="saturate" values="0"/>
  <feComponentTransfer><feFuncA type="linear" slope=".5" intercept="-.25"/></feComponentTransfer></filter>
<filter id="fibra" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency=".02 .7" numOctaves="4"/>
  <feColorMatrix type="saturate" values="0"/>
  <feComponentTransfer><feFuncA type="linear" slope=".35" intercept="-.1"/></feComponentTransfer></filter>
<filter id="veta" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency=".006 .2" numOctaves="5"/>
  <feColorMatrix type="saturate" values="0"/>
  <feComponentTransfer><feFuncA type="linear" slope=".55" intercept="-.2"/></feComponentTransfer></filter>
{extra}</defs>'''


def _paradas(paradas):
    out = []
    for o, c, a in paradas:
        op = '' if a is None else ' stop-opacity="%s"' % a
        out.append('<stop offset="%s" stop-color="%s"%s/>' % (o, c, op))
    return ''.join(out)


def lg(id_, x1, y1, x2, y2, paradas):
    return (f'<linearGradient id="{id_}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}">'
            f'{_paradas(paradas)}</linearGradient>')


def rg(id_, cx, cy, r, paradas, fx=None, fy=None):
    f = f' fx="{fx}" fy="{fy}"' if fx is not None else ''
    return (f'<radialGradient id="{id_}" cx="{cx}" cy="{cy}" r="{r}"{f}>'
            f'{_paradas(paradas)}</radialGradient>')


def sombra_suelo(cx, cy, rx, ry, op=.3, blur='b12'):
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{C["noche"]}" opacity="{op}" filter="url(#{blur})"/>'


def svg(cuerpo, defs_extra=''):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">'
            f'{defs(defs_extra)}{cuerpo}</svg>')


R = {}


def escena(slug):
    def deco(fn):
        R[slug] = fn
        return fn
    return deco


# ---------------------------------------------------------------------------
# Cada estudio vive en su propio módulo rica_<slug>.py y se registra aquí.
# Un fichero por escena: así varias personas pueden trabajar a la vez sin pisarse.
# ---------------------------------------------------------------------------
#: (módulo, slug). Un fichero por escena: así varias personas trabajan a la vez
#: sin pisarse, y un módulo roto no puede tumbar a los demás.
#: Las seis primeras son las piloto aprobadas en R54 y **no se tocan** (KEEP 6/6).
MODULOS = (
    # ── R54 · las seis que fijan el estándar · KEEP 6/6 ──────────────────────
    ('rica_dibujo', 'dibujo'),
    ('rica_estructuras', 'estructuras'),
    ('rica_programacion', 'programacion'),
    ('rica_videojuegos', 'videojuegos'),
    ('rica_mundos', 'mundos'),
    ('rica_modelado3d', 'modelado-3d'),
    # ── R65 · las 21 restantes ───────────────────────────────────────────────
    ('rica_diseno_grafico', 'diseno-grafico'),
    ('rica_pixel_art', 'pixel-art'),
    ('rica_comic', 'comic'),
    ('rica_color', 'color'),
    ('rica_patrones', 'patrones'),
    ('rica_fotografia', 'fotografia'),
    ('rica_moda_textil', 'moda-textil'),
    ('rica_ideas', 'ideas'),
    ('rica_arquitectura', 'arquitectura'),
    ('rica_maquinas', 'maquinas'),
    ('rica_circuitos', 'circuitos'),
    ('rica_papiroflexia', 'papiroflexia'),
    ('rica_simulaciones', 'simulaciones'),
    ('rica_ritmo', 'ritmo'),
    ('rica_composicion', 'composicion'),
    ('rica_sintesis', 'sintesis-sonido'),
    ('rica_videomapping', 'videomapping'),
    ('rica_robotica', 'robotica'),
    ('rica_escritura', 'escritura-restricciones'),
    ('rica_lenguas', 'lenguas-inventadas'),
    ('rica_juegos_mesa', 'juegos-de-mesa'),
    # ── R65 · fase 2 · las nueve variantes AGE_0_12 ──────────────────────────
    ('rica_circuitos_infancia', 'circuitos-age-0-12'),
    ('rica_arquitectura_infancia', 'arquitectura-age-0-12'),
    ('rica_color_infancia', 'color-age-0-12'),
    ('rica_composicion_infancia', 'composicion-age-0-12'),
    ('rica_sintesis_infancia', 'sintesis-sonido-age-0-12'),
    ('rica_videomapping_infancia', 'videomapping-age-0-12'),
    ('rica_fotografia_infancia', 'fotografia-age-0-12'),
    ('rica_lenguas_infancia', 'lenguas-inventadas-age-0-12'),
    ('rica_escritura_infancia', 'escritura-restricciones-age-0-12'),
)


def _cargar():
    import importlib
    for nombre, slug in MODULOS:
        try:
            m = importlib.import_module('taller_suite.' + nombre)
        except ModuleNotFoundError:
            continue
        except Exception as err:            # un módulo roto no puede bloquear a los demás
            import sys
            print(f'(aviso) escena rica {slug} no carga: {err}', file=sys.stderr)
            continue
        R[slug] = m.escena


_cargar()
