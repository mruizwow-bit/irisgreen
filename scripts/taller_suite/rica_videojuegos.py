# -*- coding: utf-8 -*-
"""Escena rica de Diseño de videojuegos (R54 R2 · norma visual móvil sep-2026).

El concepto no cambia: se ve **el editor de niveles abierto**, con el nivel a
medio construir. Tres marcos de capa desplazados en diagonal (fondo desenfocado,
capa media con su relieve propio, capa de juego nítida) dicen que el mundo se
monta por capas; la rejilla deja ver las celdas vacías; una pieza baja hacia su
hueco; a la izquierda la bandeja y a la derecha el inspector; y un trazado de
cámara cruza el aire vacío.

Lo que sube respecto de la versión anterior es el **acabado a tamaño de móvil**
(240 × 150 px), donde la composición antigua se convertía en textura de interfaz:

* **Densidad a la baja, escala a la alta.** Bandeja de 6 piezas grandes en vez de
  12 pequeñas; inspector con una ficha y dos valores en vez de cuatro filas y dos
  deslizadores; la tira de capas del pie desaparece y su mensaje se traslada a
  las pestañas de los marcos, que crecen. Celda de rejilla de 36 en vez de 24:
  menos líneas y bloques que se leen.
* **Materia en las superficies grandes.** Los paneles son aluminio anodizado:
  cepillado direccional (``ve_cep``), moteado fino (``ve_mote``), reflexión
  controlada en banda, canto biselado con luz arriba y sombra abajo, y marcas de
  uso. El escritorio del fondo lleva moteado de gran escala (``ve_nube``) y un
  canto de mesa iluminado. La roca de la capa media lleva grano propio
  (``ve_roca``).
* **Oclusión de contacto.** Cada panel y cada marco llevan dos sombras: la
  proyectada difusa y una corta y muy oscura pegada al encuentro.
* **Variedad orgánica.** Los espolones de la capa media son cinco siluetas
  distintas —aguja inclinada, meseta con muesca, torre partida, racimo bajo y
  aguja lejana— y la vegetación son cuatro matas de forma y tamaño distintos.
  Nada clonado.
* **Menos cuadraditos.** Las asas del marco desaparecen, las de la criatura pasan
  de ocho a cuatro y más grandes, y el trazado de cámara se queda con dos nodos.
"""
from taller_suite.escenas_ricas import C, W, H, svg, lg, rg, sombra_suelo

k = C

FX, FY, FW, FH = 142, 84, 360, 252       # marco de la capa de juego (delante)
MX, MY = FX + 13, FY - 14                # capa media
BX, BY = FX + 26, FY - 28                # capa de fondo
G = 36                                   # lado de celda: pocas celdas, grandes
SUELO = FY + 5 * G                       # 264 · fila donde se está construyendo
BASE = FY + 6 * G                        # 300 · fila de cimiento, ya colocada
REJ = '#cfe6ee'                          # tinta de la rejilla del editor
SEL = '#5fd6cf'                          # turquesa de selección/edición

TX, TY, TW, TH = 22, 84, 104, 236        # bandeja de piezas
IX, IY, IW, IH = 512, 100, 106, 204      # inspector


# ── chapa anodizada: el material de los dos paneles ────────────────────────
def _panel(x, y, w, h, clip, r=12):
    """Panel de aluminio anodizado.

    Sombra proyectada difusa + oclusión de contacto corta y oscura; cuerpo con
    cepillado direccional y moteado; una banda de reflexión; canto biselado con
    luz arriba y a la izquierda y sombra abajo y a la derecha; marcas de uso.
    """
    c = f' clip-path="url(#{clip})"'
    p = (  # proyectada
        f'<rect x="{x + 6}" y="{y + 14}" width="{w}" height="{h}" rx="{r}" '
        f'fill="{k["noche"]}" opacity=".52" filter="url(#b12)"/>'
        # oclusión: corta, oscura, pegada al canto
        f'<rect x="{x + 2}" y="{y + 5}" width="{w}" height="{h}" rx="{r}" '
        f'fill="#04060c" opacity=".66" filter="url(#b2)"/>'
        # cuerpo
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="url(#ve_pan)"/>'
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}"{c} filter="url(#ve_cep)" '
        f'style="mix-blend-mode:multiply" opacity=".4"/>'
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}"{c} filter="url(#ve_mote)" '
        f'style="mix-blend-mode:overlay" opacity=".17"/>'
        # reflexión controlada: una banda ancha y otra fina, en diagonal
        f'<g{c}><path d="M{x} {y + h * .46} L{x + w} {y + h * .2} L{x + w} {y + h * .33} '
        f'L{x} {y + h * .59}z" fill="#fff" opacity=".055"/>'
        f'<path d="M{x} {y + h * .2} L{x + w} {y - h * .03} L{x + w} {y + h * .01} '
        f'L{x} {y + h * .24}z" fill="#fff" opacity=".07"/>'
        # marcas de uso: rayas finas y un roce
        f'<path d="M{x + 14} {y + h * .63} l{w * .42} -5" stroke="#fff" stroke-width="1" '
        f'opacity=".15"/>'
        f'<path d="M{x + w * .3} {y + h * .78} l{w * .5} -3" stroke="#fff" stroke-width=".8" '
        f'opacity=".12"/>'
        f'<path d="M{x + 9} {y + h * .34} l{w * .24} 2" stroke="#05070d" stroke-width=".9" '
        f'opacity=".28"/>'
        f'<ellipse cx="{x + w * .74}" cy="{y + h * .9}" rx="{w * .16}" ry="4" fill="#05070d" '
        f'opacity=".18" filter="url(#b2)"/></g>'
        # bisel
        f'<path d="M{x + r} {y + 1.1} H{x + w - r}" stroke="#fff" stroke-width="1.9" opacity=".44"/>'
        f'<path d="M{x + 1.2} {y + r} V{y + h * .58}" stroke="#fff" stroke-width="1.4" opacity=".17"/>'
        f'<path d="M{x + r} {y + h - 1.2} H{x + w - r}" stroke="#04060c" stroke-width="2.2" '
        f'opacity=".55"/>'
        f'<path d="M{x + w - 1.2} {y + r} V{y + h - r}" stroke="#04060c" stroke-width="1.7" '
        f'opacity=".42"/>'
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="none" stroke="#83809a" '
        f'stroke-width="1.2" opacity=".62"/>')
    return p


# ── marcos de capa ─────────────────────────────────────────────────────────
def _marco(x, y, borde, pest, grosor=2, act=False):
    """Marco de una capa: pestaña grande, sombra proyectada y oclusión corta."""
    s = (f'<rect x="{x + 8}" y="{y + 10}" width="{FW}" height="{FH}" rx="8" fill="none" '
         f'stroke="{k["noche"]}" stroke-width="12" opacity=".4" filter="url(#b5)"/>'
         f'<rect x="{x + 3}" y="{y + 4}" width="{FW}" height="{FH}" rx="7" fill="none" '
         f'stroke="#04060c" stroke-width="5" opacity=".4" filter="url(#b2)"/>')
    t = (f'<path d="M{x} {y + 2} v-11 a6 6 0 0 1 6-6 h34 a6 6 0 0 1 6 6 v11z" fill="{pest}"/>'
         f'<path d="M{x + 2} {y - 14} h42" stroke="#fff" stroke-width="1.7" opacity=".34"/>'
         f'<circle cx="{x + 13}" cy="{y - 7}" r="4" fill="{"#fff" if act else pest}" '
         f'opacity="{.95 if act else .5}"/>'
         f'<rect x="{x + 22}" y="{y - 9.4}" width="{19 if act else 13}" height="4" rx="2" '
         f'fill="#fff" opacity="{.64 if act else .3}"/>')
    m = f'<rect x="{x}" y="{y}" width="{FW}" height="{FH}" rx="6" fill="none" stroke="{borde}" stroke-width="{grosor}"/>'
    if act:
        m += (f'<rect x="{x + 2}" y="{y + 2}" width="{FW - 4}" height="{FH - 4}" rx="5" fill="none" '
              f'stroke="{SEL}" stroke-width="1" opacity=".3"/>')
    return s + t + m


def _asas4(x, y, w, h, r=5, col=None):
    """Solo las cuatro esquinas, y grandes: a 240 px ocho asas eran ruido."""
    col = col or k['oroL']
    return ''.join(f'<rect x="{px - r}" y="{py - r}" width="{r * 2}" height="{r * 2}" rx="1.6" '
                   f'fill="{col}" stroke="{k["noche"]}" stroke-width="1.4"/>'
                   for px, py in ((x, y), (x + w, y), (x + w, y + h), (x, y + h)))


# ── piezas del nivel ───────────────────────────────────────────────────────
def _bloque(x, y, w, h, capa=True):
    """Masa de tiles de madera: veta, juntas biseladas, canto y oclusión baja."""
    p = (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="url(#ve_tile)"/>'
         f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" filter="url(#veta)" '
         f'style="mix-blend-mode:multiply" opacity=".34"/>')
    p += ''.join(f'<path d="M{sx} {y + 2}v{h - 4}" stroke="{k["madS"]}" stroke-width="2" opacity=".42"/>'
                 f'<path d="M{sx + 2} {y + 2}v{h - 4}" stroke="{k["madLL"]}" stroke-width="1.2" opacity=".22"/>'
                 for sx in range(int(x) + G, int(x + w), G))
    if capa:
        p += (f'<rect x="{x}" y="{y}" width="{w}" height="4.4" rx="2" fill="{k["madLL"]}" opacity=".9"/>'
              f'<rect x="{x}" y="{y + 4.4}" width="{w}" height="3" fill="{k["verdS"]}" opacity=".5"/>'
              # desgaste del canto vivo: dos mellas
              f'<path d="M{x + w * .34} {y + 1} l7 0 l-2 3.4 l-4 0z" fill="{k["madS"]}" opacity=".45"/>'
              f'<path d="M{x + w * .71} {y + 1} l5 0 l-1.5 3 l-3 0z" fill="{k["madS"]}" opacity=".35"/>')
    p += (f'<rect x="{x}" y="{y + h - 7}" width="{w}" height="7" fill="{k["noche"]}" opacity=".34"/>'
          f'<path d="M{x} {y + h - .8} h{w}" stroke="#04060c" stroke-width="1.6" opacity=".5"/>')
    return p


def _fantasma(x, y, w, h):
    """Pieza planificada y todavía sin construir."""
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="{REJ}" opacity=".07"/>'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" fill="none" stroke="{REJ}" '
            f'stroke-width="1.7" stroke-dasharray="7 8" opacity=".44"/>')


# ── la criatura: recurso seleccionado dentro del editor ────────────────────
def _criatura(tx, ty, s=1.0, luz=True):
    """Cuadrúpedo de silueta trabajada. Sin ojos grandes, sin sonrisa."""
    g = f'<g transform="translate({tx},{ty}) scale({s})">'
    # patas traseras, detrás del cuerpo
    g += (f'<path d="M64 44 L57 56 L62 68 M76 44 L82 56 L77 68" fill="none" stroke="#1e1642" '
          f'stroke-width="4.6" stroke-linecap="round" stroke-linejoin="round"/>')
    # cola larga, que sale del marco de la silueta
    g += f'<path d="M48 34 C30 26 14 30 2 42 C13 35 28 34 48 42 Z" fill="#2b2057"/>'
    # placas dorsales, inclinadas hacia atrás
    g += (f'<path d="M57 23 C60 14 57 9 52 6 C63 9 69 15 70 22 Z '
          f'M75 20 C77 11 74 6 69 3 C80 7 86 12 87 19 Z" fill="#3a2b6e"/>'
          f'<path d="M57 23 C60 14 57 9 52 6 C58 12 60 17 60 22 Z '
          f'M75 20 C77 11 74 6 69 3 C75 9 77 14 77 19 Z" fill="#54429b" opacity=".65"/>')
    # torso: bajo, alargado, con grupa marcada
    g += (f'<path d="M46 41 C41 31 48 23 61 20 C75 17 95 19 104 26 C111 32 112 40 106 44 '
          f'C97 49 54 48 46 41 Z" fill="url(#ve_crea)"/>')
    # cuello y cabeza en cuña
    g += (f'<path d="M96 25 C106 16 120 12 129 14 C137 16 141 22 139 28 C137 34 129 36 123 33 '
          f'C116 30 107 31 100 36 Z" fill="url(#ve_crea2)"/>')
    g += (f'<path d="M50 44 C66 50 95 49 106 41 C102 50 56 51 50 44 Z" fill="#150e33" opacity=".55"/>'
          f'<path d="M64 29 C71 39 88 41 100 34 M72 24 C77 35 92 38 103 30" fill="none" '
          f'stroke="#1c1442" stroke-width="1.7" opacity=".4"/>')
    if luz:
        g += (f'<path d="M47 39 C43 29 50 22 61 19 C75 15 94 17 103 25" fill="none" '
              f'stroke="#e6e0ff" stroke-width="3.2" stroke-linecap="round" opacity=".5" '
              f'filter="url(#b2)"/>')
    # patas delanteras, por delante del cuerpo
    g += (f'<path d="M96 42 L102 55 L97 68 M85 44 L79 56 L85 68" fill="none" stroke="#2a1f57" '
          f'stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>'
          f'<path d="M96 42 L101 53" fill="none" stroke="#6f5fb8" stroke-width="1.6" '
          f'stroke-linecap="round" opacity=".6"/>')
    g += (f'<path d="M101 19 C111 13 122 10 128 13" fill="none" stroke="#d3c8ff" '
          f'stroke-width="2.1" stroke-linecap="round" opacity=".6"/>'
          f'<path d="M123 23 l10 -2.5" stroke="#ffca6e" stroke-width="2.6" stroke-linecap="round"/>'
          f'<path d="M133 30 l6 1" stroke="#150e33" stroke-width="1.8" stroke-linecap="round" '
          f'opacity=".7"/>')
    return g + '</g>'


# ── bandeja de piezas: seis, grandes, de materiales distintos ──────────────
def _pieza_tabla(u):
    """Suelo de tablas: veta, juntas y canto gastado."""
    return (f'<rect width="{u}" height="{u}" rx="7" fill="url(#ve_sw_mad)"/>'
            f'<rect width="{u}" height="{u}" filter="url(#veta)" style="mix-blend-mode:multiply" '
            f'opacity=".38"/>'
            f'<path d="M4 17h34M4 29h34" stroke="{k["madS"]}" stroke-width="2.2" opacity=".5"/>'
            f'<path d="M4 18.8h34M4 30.8h34" stroke="{k["madLL"]}" stroke-width="1.2" opacity=".28"/>'
            f'<ellipse cx="14" cy="10" rx="3.4" ry="2.2" fill="{k["madS"]}" opacity=".32"/>'
            f'<rect y="1" width="{u}" height="3.6" rx="1.8" fill="{k["madLL"]}" opacity=".7"/>')


def _pieza_piedra(u):
    """Muro de sillería: grano, aparejo a matajunta y aristas no perfectas."""
    return (f'<rect width="{u}" height="{u}" rx="7" fill="url(#ve_sw_pie)"/>'
            f'<rect width="{u}" height="{u}" filter="url(#ve_roca)" style="mix-blend-mode:multiply" '
            f'opacity=".42"/>'
            f'<path d="M3 16.5 h36 M3 29 h36 M17 4 v12.5 M27 16.5 v12.5 M13 29 v9" '
            f'stroke="#26242f" stroke-width="2.1" opacity=".55" stroke-linecap="round"/>'
            f'<path d="M3 18.2 h36 M3 30.7 h36" stroke="#c9cbd8" stroke-width="1" opacity=".22"/>'
            f'<path d="M6 8 l6 1 M22 22 l7 -1" stroke="#0e0d14" stroke-width="1.2" opacity=".3"/>'
            f'<rect y="1" width="{u}" height="3" rx="1.5" fill="#d2d5e0" opacity=".3"/>')


def _pieza_rampa(u):
    """Rampa: cara iluminada arriba, hueco oscuro debajo."""
    return (f'<rect width="{u}" height="{u}" rx="7" fill="url(#ve_sw_mad)"/>'
            f'<rect width="{u}" height="{u}" filter="url(#veta)" style="mix-blend-mode:multiply" '
            f'opacity=".3"/>'
            f'<path d="M4 37 L38 9 L38 37z" fill="{k["madL"]}" opacity=".9"/>'
            f'<path d="M4 37 L38 9 L38 13 L10 37z" fill="#fff3d8" opacity=".55"/>'
            f'<path d="M4 37 L38 37 L38 31z" fill="{k["noche"]}" opacity=".35"/>')


def _pieza_escalera(u):
    """Escalera: dos largueros de sección redonda y tres peldaños."""
    return (f'<rect width="{u}" height="{u}" rx="7" fill="url(#ve_sw_mad2)"/>'
            f'<rect width="{u}" height="{u}" filter="url(#veta)" style="mix-blend-mode:multiply" '
            f'opacity=".32"/>'
            f'<path d="M13 4v34M29 4v34" stroke="{k["madS"]}" stroke-width="4.4" '
            f'stroke-linecap="round"/>'
            f'<path d="M11.6 4v34M27.6 4v34" stroke="{k["madLL"]}" stroke-width="1.6" '
            f'stroke-linecap="round" opacity=".55"/>'
            f'<path d="M13 13h16M13 21h16M13 29h16" stroke="{k["madS"]}" stroke-width="3.4" '
            f'stroke-linecap="round"/>'
            f'<path d="M13 12h16M13 20h16M13 28h16" stroke="{k["madLL"]}" stroke-width="1.2" '
            f'opacity=".45"/>')


def _pieza_agua(u):
    """Agua: dos crestas con luz especular y fondo más oscuro."""
    return (f'<rect width="{u}" height="{u}" rx="7" fill="url(#ve_sw_agu)"/>'
            f'<path d="M0 22 q10-9 20 0 q10 9 22 0 V{u} H0z" fill="#0b5f68" opacity=".55"/>'
            f'<path d="M3 16 q9-8 19 0 q9 8 18 0" fill="none" stroke="#eafbff" stroke-width="2.4" '
            f'opacity=".65" stroke-linecap="round"/>'
            f'<path d="M3 27 q9-8 19 0 q9 8 18 0" fill="none" stroke="#bdf0f4" stroke-width="1.8" '
            f'opacity=".38" stroke-linecap="round"/>'
            f'<rect width="{u}" height="{u}" filter="url(#ve_mote)" style="mix-blend-mode:overlay" '
            f'opacity=".16"/>')


def _pieza_mata(u):
    """Mata: tres copas de tamaño distinto sobre un tronco corto."""
    return (f'<rect width="{u}" height="{u}" rx="7" fill="url(#ve_sw_ver)"/>'
            f'<path d="M19 22 l1 15 h3 l1-15z" fill="#3d2a18"/>'
            f'<ellipse cx="12" cy="26" rx="9.5" ry="8" fill="#3b7548"/>'
            f'<ellipse cx="31" cy="27" rx="8" ry="7" fill="#2f6340"/>'
            f'<ellipse cx="21" cy="18" rx="11.5" ry="10" fill="#4d9457"/>'
            f'<path d="M14 12 q7-5 13 1" fill="none" stroke="{k["verdLL"]}" stroke-width="3.2" '
            f'stroke-linecap="round" opacity=".8"/>'
            f'<path d="M5 22 q5-4 10 0" fill="none" stroke="{k["verdL"]}" stroke-width="2.6" '
            f'stroke-linecap="round" opacity=".5"/>'
            f'<path d="M27 23 q5-3 8 1" fill="none" stroke="{k["verdL"]}" stroke-width="2.2" '
            f'stroke-linecap="round" opacity=".42"/>'
            f'<path d="M3 36.5 h36" stroke="#101d16" stroke-width="4.5" opacity=".45"/>')


_PIEZAS = (_pieza_tabla, _pieza_piedra, _pieza_rampa,
           _pieza_escalera, _pieza_agua, _pieza_mata)


def _bandeja():
    x, y, w, h = TX, TY, TW, TH
    u = 42                                   # lado de la muestra: se ve a 240 px
    p = _panel(x, y, w, h, 've_ct')
    # cabecera
    p += (f'<rect x="{x + 11}" y="{y + 11}" width="12" height="12" rx="3" fill="{SEL}" opacity=".92"/>'
          f'<rect x="{x + 29}" y="{y + 13}" width="40" height="4.4" rx="2.2" fill="#fff" opacity=".5"/>'
          f'<rect x="{x + 29}" y="{y + 20}" width="24" height="3" rx="1.5" fill="#fff" opacity=".24"/>'
          f'<path d="M{x + 9} {y + 31} h{w - 18}" stroke="#04060c" stroke-width="1.4" opacity=".45"/>'
          f'<path d="M{x + 9} {y + 32.4} h{w - 18}" stroke="#fff" stroke-width="1" opacity=".14"/>')
    # rejilla de piezas: 2 × 3, grandes
    for i, dibujo in enumerate(_PIEZAS):
        cx = x + 6 + (i % 2) * 50
        cy = y + 42 + (i // 2) * 50
        p += (f'<rect x="{cx + 2}" y="{cy + 4}" width="{u}" height="{u}" rx="7" fill="#04060c" '
              f'opacity=".62" filter="url(#b2)"/>'
              f'<g transform="translate({cx},{cy})">{dibujo(u)}'
              f'<path d="M6 1.3 h30" stroke="#fff" stroke-width="1.5" opacity=".34"/>'
              f'<path d="M6 {u - 1.2} h30" stroke="#04060c" stroke-width="1.6" opacity=".45"/>'
              f'<rect width="{u}" height="{u}" rx="7" fill="none" stroke="#6d6a84" '
              f'stroke-width="1.1" opacity=".55"/></g>')
        if i == 1:                            # la piedra es la que está en la mano
            p += (f'<rect x="{cx - 4}" y="{cy - 4}" width="{u + 8}" height="{u + 8}" rx="10" '
                  f'fill="none" stroke="{SEL}" stroke-width="5" opacity=".3" filter="url(#b2)"/>'
                  f'<rect x="{cx - 3}" y="{cy - 3}" width="{u + 6}" height="{u + 6}" rx="9.5" '
                  f'fill="none" stroke="{SEL}" stroke-width="2.4"/>')
    # un solo control al pie: tamaño del pincel de celdas
    p += (f'<path d="M{x + 9} {y + 196} h{w - 18}" stroke="#04060c" stroke-width="1.4" opacity=".45"/>'
          f'<path d="M{x + 9} {y + 197.4} h{w - 18}" stroke="#fff" stroke-width="1" opacity=".14"/>'
          f'<rect x="{x + 12}" y="{y + 210}" width="80" height="6" rx="3" fill="#04060c" opacity=".6"/>'
          f'<rect x="{x + 12}" y="{y + 210}" width="49" height="6" rx="3" fill="{SEL}" opacity=".9"/>'
          f'<circle cx="{x + 61}" cy="{y + 213}" r="8" fill="url(#ve_perilla)" '
          f'stroke="{k["noche"]}" stroke-width="1.2"/>'
          f'<circle cx="{x + 61}" cy="{y + 213}" r="8" fill="none" stroke="#fff" '
          f'stroke-width="1.2" opacity=".35"/>')
    return p


# ── inspector: una ficha y dos valores ─────────────────────────────────────
def _inspector():
    x, y, w, h = IX, IY, IW, IH
    p = _panel(x, y, w, h, 've_ci', 11)
    # cabecera
    p += (f'<rect x="{x + 10}" y="{y + 11}" width="11" height="11" rx="3" fill="{k["oroL"]}"/>'
          f'<rect x="{x + 27}" y="{y + 13}" width="44" height="4.2" rx="2.1" fill="#fff" opacity=".52"/>'
          f'<rect x="{x + 27}" y="{y + 20}" width="26" height="3" rx="1.5" fill="#fff" opacity=".24"/>'
          f'<path d="M{x + 9} {y + 31} h{w - 18}" stroke="#04060c" stroke-width="1.4" opacity=".45"/>'
          f'<path d="M{x + 9} {y + 32.4} h{w - 18}" stroke="#fff" stroke-width="1" opacity=".14"/>')
    # ficha del recurso: la criatura en su visor, hundido en el panel
    cx, cy, cw, ch = x + 7, y + 40, w - 14, 72
    p += (f'<rect x="{cx}" y="{cy}" width="{cw}" height="{ch}" rx="7" fill="url(#ve_thumb)"/>'
          + ''.join(f'<path d="M{cx + i * 23} {cy}v{ch}" stroke="{REJ}" stroke-width="1" opacity=".13"/>'
                    for i in range(1, 4))
          + f'<path d="M{cx} {cy + 48} h{cw}" stroke="{REJ}" stroke-width="1" opacity=".13"/>'
          + f'<ellipse cx="{cx + cw / 2}" cy="{cy + 58}" rx="32" ry="5" fill="{k["noche"]}" '
            f'opacity=".5" filter="url(#b2)"/>'
          + _criatura(cx + 11, cy + 24, .53, luz=False)
          + f'<path d="M{cx + 5} {cy + 1.4} h{cw - 10}" stroke="#04060c" stroke-width="2" opacity=".6"/>'
          + f'<path d="M{cx + 5} {cy + ch - 1.2} h{cw - 10}" stroke="#fff" stroke-width="1.1" opacity=".16"/>'
          + f'<rect x="{cx}" y="{cy}" width="{cw}" height="{ch}" rx="7" fill="none" '
            f'stroke="#8b889f" stroke-width="1.3" opacity=".8"/>')
    # dos valores, y que se lean
    for i, (lw, vw, col) in enumerate(((34, 30, k['oroL']), (44, 22, SEL))):
        fy = y + 126 + i * 20
        p += (f'<rect x="{x + 11}" y="{fy + 1.6}" width="{lw}" height="5" rx="2.5" fill="#fff" opacity=".3"/>'
              f'<rect x="{x + w - 11 - vw}" y="{fy}" width="{vw}" height="9" rx="4.5" fill="{col}" '
              f'opacity=".92"/>'
              f'<rect x="{x + w - 11 - vw}" y="{fy}" width="{vw}" height="3.4" rx="1.7" fill="#fff" '
              f'opacity=".3"/>')
    # un botón, el de aplicar
    p += (f'<rect x="{x + 12}" y="{y + 172}" width="{w - 24}" height="18" rx="6" fill="#04060c" '
          f'opacity=".5" filter="url(#b2)"/>'
          f'<rect x="{x + 11}" y="{y + 170}" width="{w - 22}" height="18" rx="6" fill="url(#ve_bot)"/>'
          f'<path d="M{x + 17} {y + 171.3} h{w - 34}" stroke="#fff" stroke-width="1.4" opacity=".45"/>'
          f'<rect x="{x + 34}" y="{y + 177}" width="38" height="4.2" rx="2.1" fill="#04321f" '
          f'opacity=".6"/>')
    return p


def escena():
    d = (
        # chrome del editor
        lg('ve_app', 0, 0, 1, 1, [(0, '#514458', None), (.4, '#2f2d3d', None),
                                  (.76, '#212330', None), (1, '#13161f', None)])
        + rg('ve_glow', .06, .02, .95, [(0, '#ffdcaa', .4), (.42, '#e0a274', .14), (1, '#c98a66', 0)])
        + lg('ve_mesa', 0, 0, 0, 1, [(0, '#0b0d15', .0), (.16, '#2b2736', .5),
                                     (.4, '#221f2c', .55), (1, '#0f111a', .7)])
        + lg('ve_pan', .1, 0, .9, 1, [(0, '#565367', None), (.3, '#403d52', None),
                                      (.72, '#2e2c3d', None), (1, '#222131', None)])
        + lg('ve_bot', 0, 0, 0, 1, [(0, '#7ee6dd', None), (.5, '#3fb8b4', None), (1, '#17787c', None)])
        + rg('ve_perilla', .32, .26, .85, [(0, '#ffffff', None), (.35, '#dfe6ee', None),
                                           (.8, '#98a4b2', None), (1, '#5c6673', None)])
        + lg('ve_thumb', 0, 0, .4, 1, [(0, '#2a2740', None), (.6, '#1e1c30', None), (1, '#141224', None)])
        # capa de fondo: cielo de tarde desaturado
        + lg('ve_sky', 0, 0, .15, 1, [(0, '#343a78', None), (.26, '#5f5f96', None),
                                      (.5, '#9c7f95', None), (.7, '#dda27c', None),
                                      (.85, '#f5c78d', None), (1, '#fadfab', None)])
        + rg('ve_sol', .34, .46, .42, [(0, '#fff5da', .92), (.4, '#f4cb9c', .32), (1, '#f0c79c', 0)])
        + lg('ve_ridge', 0, 0, 0, 1, [(0, '#8b87b4', None), (.5, '#75739f', None), (1, '#63628c', None)])
        # capa media
        + lg('ve_mid', 0, 0, 0, 1, [(0, '#4d8b7c', None), (.45, '#316b62', None), (1, '#1d4644', None)])
        + lg('ve_roca_g', .1, 0, .95, 1, [(0, '#9ecbb4', None), (.28, '#6ea593', None),
                                          (.7, '#4a7d76', None), (1, '#2d5a5c', None)])
        + lg('ve_bruma', 0, 0, 0, 1, [(0, '#e9d2bd', 0), (.55, '#e6cdb8', .13), (1, '#e2c8b4', .26)])
        # capa de juego
        + lg('ve_tile', .12, 0, .8, 1, [(0, k['madLL'], None), (.26, k['madL'], None),
                                        (.7, k['mad'], None), (1, k['madS'], None)])
        + lg('ve_pieza', .1, 0, .85, 1, [(0, '#f6dcb0', None), (.28, k['madLL'], None),
                                         (.7, k['madL'], None), (1, '#8a5f36', None)])
        + lg('ve_sub', 0, 0, 0, 1, [(0, '#241a24', .06), (.45, '#1b1420', .26), (1, '#100c16', .5)])
        + rg('ve_crea', .3, .22, .9, [(0, k['violL'], None), (.36, k['viol'], None),
                                      (.74, k['violS'], None), (1, '#241b49', None)])
        + rg('ve_crea2', .3, .3, .85, [(0, k['violL'], None), (.5, k['viol'], None),
                                       (1, '#2b2157', None)])
        # materiales de las muestras de la bandeja
        + lg('ve_sw_mad', .1, 0, .9, 1, [(0, k['madL'], None), (.5, k['mad'], None), (1, k['madS'], None)])
        + lg('ve_sw_mad2', .1, 0, .9, 1, [(0, '#c08d55', None), (.55, '#8d6136', None), (1, '#5d3f24', None)])
        + lg('ve_sw_pie', .1, 0, .9, 1, [(0, '#9aa0b4', None), (.45, '#70768c', None), (1, '#454a5e', None)])
        + lg('ve_sw_agu', .1, 0, .9, 1, [(0, k['turqL'], None), (.5, k['turq'], None), (1, k['turqS'], None)])
        + lg('ve_sw_ver', .1, 0, .9, 1, [(0, '#2e3b30', None), (.55, '#1e2822', None), (1, '#141b18', None)])
        # texturas nuevas: cepillado, moteado, moteado de gran escala y grano de roca
        + '<filter id="ve_cep" x="0" y="0" width="100%" height="100%">'
          '<feTurbulence type="fractalNoise" baseFrequency=".004 1.1" numOctaves="2"/>'
          '<feColorMatrix type="saturate" values="0"/>'
          '<feComponentTransfer><feFuncA type="linear" slope=".44" intercept="-.17"/>'
          '</feComponentTransfer></filter>'
        + '<filter id="ve_mote" x="0" y="0" width="100%" height="100%">'
          '<feTurbulence type="fractalNoise" baseFrequency=".42" numOctaves="3"/>'
          '<feColorMatrix type="saturate" values="0"/>'
          '<feComponentTransfer><feFuncA type="linear" slope=".5" intercept="-.22"/>'
          '</feComponentTransfer></filter>'
        + '<filter id="ve_nube" x="0" y="0" width="100%" height="100%">'
          '<feTurbulence type="fractalNoise" baseFrequency=".011" numOctaves="4"/>'
          '<feColorMatrix type="saturate" values="0"/>'
          '<feComponentTransfer><feFuncA type="linear" slope=".6" intercept="-.26"/>'
          '</feComponentTransfer></filter>'
        + '<filter id="ve_roca" x="0" y="0" width="100%" height="100%">'
          '<feTurbulence type="turbulence" baseFrequency=".05 .09" numOctaves="4"/>'
          '<feColorMatrix type="saturate" values="0"/>'
          '<feComponentTransfer><feFuncA type="linear" slope=".5" intercept="-.18"/>'
          '</feComponentTransfer></filter>'
        + f'<clipPath id="ve_ct"><rect x="{TX}" y="{TY}" width="{TW}" height="{TH}" rx="12"/></clipPath>'
        + f'<clipPath id="ve_ci"><rect x="{IX}" y="{IY}" width="{IW}" height="{IH}" rx="11"/></clipPath>'
        + f'<clipPath id="ve_cb"><rect x="{BX}" y="{BY}" width="{FW}" height="{FH}" rx="6"/></clipPath>'
        + f'<clipPath id="ve_cm"><rect x="{MX}" y="{MY}" width="{FW}" height="{FH}" rx="6"/></clipPath>'
        + f'<clipPath id="ve_cj"><rect x="{FX}" y="{FY}" width="{FW}" height="{FH}" rx="6"/></clipPath>')

    # rejilla del editor: pocas celdas y grandes
    rejilla = (''.join(f'<path d="M{FX + i * G} {FY}v{FH}" stroke="{REJ}" stroke-width="1" '
                       f'opacity="{.24 if i % 3 == 0 else .1}"/>' for i in range(1, 10))
               + ''.join(f'<path d="M{FX} {FY + j * G}h{FW}" stroke="{REJ}" stroke-width="1" '
                         f'opacity="{.24 if j % 3 == 0 else .1}"/>' for j in range(1, 7)))

    # trazado de cámara: dos nodos, nada más
    tr = 'M152 252 C 198 166 256 112 322 106 C 386 100 430 128 490 100'
    nodos = ''.join(f'<rect x="{px - 7}" y="{py - 7}" width="14" height="14" rx="2" '
                    f'transform="rotate(45 {px} {py})" fill="{SEL}" stroke="{k["noche"]}" '
                    f'stroke-width="1.6"/>' for px, py in ((152, 252), (490, 100)))

    # espolones de la capa media: cinco siluetas distintas, ninguna repetida, y
    # colocadas donde la capa de juego todavía no ha construido nada, que es
    # donde de verdad se ven.
    crestas = (
        # espolón de la izquierda, el que el nivel todavía no tapa
        ('M148 268 L157 178 L174 170 L178 268z', 'M157 178 L174 170 L170 212 L159 218z', .34),
        # aguja lejana, delgada · la más clara, la que está más lejos
        ('M296 292 L304 210 L312 292z', 'M304 210 L312 292 L306 290 L306 228z', .55),
        # aguja inclinada, la más alta
        ('M322 294 L331 186 L346 178 L348 294z', 'M331 186 L346 178 L342 222 L333 228z', .18),
        # meseta con muesca
        ('M358 296 L367 240 L391 234 L399 249 L412 243 L418 296z',
         'M367 240 L391 234 L387 262 L371 266z', .3),
        # torre partida, escalonada
        ('M430 292 L436 216 L448 211 L450 243 L460 239 L462 292z',
         'M436 216 L448 211 L446 244 L438 246z', .42),
        # racimo bajo y ancho
        ('M470 298 L482 255 L492 269 L503 247 L516 298z', 'M482 255 L492 269 L486 280 L478 275z', .12),
    )
    # vegetación de la cresta: cuatro matas de forma y tamaño distintos
    matas = (
        ('M336 300 l9-26 l5 11 l7-18 l10 33z', '#1a4a3c', 'M343 296 q2-14 5-18'),
        ('M398 300 q-6-18 9-21 q5-12 14-5 q10 7 5 17 q7 6 1 9z', '#16423a', 'M404 294 q-2-14 9-17'),
        ('M448 298 q-6-14 3-19 q3-10 12-4 q8 6 3 15 q5 5 0 8z', '#1d5343', 'M453 292 q-1-11 7-14'),
        ('M486 300 l5-18 l5 7 l4-10 l7 21z', '#194838', ''),
    )

    return svg(
        # ═══ escritorio del editor: fondo con moteado de gran escala y canto de mesa
        f'<rect width="{W}" height="{H}" fill="url(#ve_app)"/>'
        f'<rect width="{W}" height="{H}" fill="url(#ve_glow)"/>'
        f'<rect y="270" width="{W}" height="130" fill="url(#ve_mesa)"/>'
        f'<path d="M0 292 h{W}" stroke="#8d86a8" stroke-width="1.4" opacity=".16"/>'
        f'<rect width="{W}" height="{H}" filter="url(#ve_nube)" style="mix-blend-mode:overlay" '
        f'opacity=".15"/>'
        # la mesa es plástico mate: moteado, un charco de luz rebotada y rozaduras
        f'<rect y="286" width="{W}" height="114" filter="url(#ve_mote)" '
        f'style="mix-blend-mode:overlay" opacity=".13"/>'
        f'<ellipse cx="80" cy="336" rx="74" ry="16" fill="#d3c1a8" opacity=".07" filter="url(#b22)"/>'
        f'<ellipse cx="566" cy="320" rx="72" ry="15" fill="#d3c1a8" opacity=".06" filter="url(#b22)"/>'
        f'<ellipse cx="322" cy="356" rx="196" ry="20" fill="#cdbba4" opacity=".05" filter="url(#b22)"/>'
        f'<path d="M26 376 l156 -15" stroke="#cbbfae" stroke-width="1" opacity=".07"/>'
        f'<path d="M398 386 l186 -21" stroke="#cbbfae" stroke-width=".9" opacity=".06"/>'
        f'<path d="M126 356 l88 -7" stroke="#0a0c14" stroke-width="1.3" opacity=".16"/>'
        f'<path d="M470 352 l52 4" stroke="#0a0c14" stroke-width="1.1" opacity=".13"/>'
        # ═══ capa 1 · fondo desenfocado, sin contraste ni saturación
        + f'<g clip-path="url(#ve_cb)"><g filter="url(#b12)">'
        f'<rect x="{BX - 30}" y="{BY - 30}" width="{FW + 60}" height="{FH + 60}" fill="url(#ve_sky)"/>'
        f'<circle cx="228" cy="164" r="86" fill="url(#ve_sol)"/>'
        # bancos de nubes: el cielo de la capa de fondo no es un degradado liso
        f'<ellipse cx="236" cy="108" rx="66" ry="9" fill="#e7d4ea" opacity=".34"/>'
        f'<ellipse cx="316" cy="130" rx="98" ry="13" fill="#f4d4b3" opacity=".44"/>'
        f'<ellipse cx="432" cy="154" rx="74" ry="10" fill="#ffe7c6" opacity=".38"/>'
        f'<ellipse cx="204" cy="150" rx="52" ry="7" fill="#ffdcb4" opacity=".3"/>'
        f'<path d="M{BX - 30} 236 L214 190 L262 214 L322 176 L378 212 L438 182 L492 214 '
        f'L{BX + FW + 30} 194 V{BY + FH + 30} H{BX - 30}z" fill="url(#ve_ridge)"/>'
        f'<path d="M{BX - 30} 262 q74-26 150-6 q70 18 142-10 q62-24 138 2 V{BY + FH + 30} H{BX - 30}z" '
        f'fill="#655f92" opacity=".78"/></g>'
        f'<rect x="{BX}" y="{BY}" width="{FW}" height="{FH}" fill="#b0b6d2" opacity=".1"/></g>'
        + _marco(BX, BY, '#9791c2', '#6f6a9c')
        # ═══ capa 2 · media: relieve con silueta propia y vegetación variada
        + f'<g clip-path="url(#ve_cm)">'
        + ''.join(f'<g filter="url(#b2)"><path d="{silueta}" fill="url(#ve_roca_g)"/>'
                  f'<path d="{silueta}" filter="url(#ve_roca)" style="mix-blend-mode:multiply" '
                  f'opacity=".3"/>'
                  f'<path d="{cara}" fill="#c3e4d2" opacity=".38"/>'
                  f'<path d="{cara}" fill="none" stroke="#ffd9a6" stroke-width="1.6" '
                  f'opacity=".34"/>'
                  f'<path d="{silueta}" fill="#cdd6e8" opacity="{bruma}"/></g>'
                  for silueta, cara, bruma in crestas)
        # falda de la capa media: masa blanda de la que salen los espolones
        + f'<g filter="url(#b5)">'
        f'<path d="M{MX - 30} 250 C 168 236 202 246 236 240 C 268 234 292 250 322 262 '
        f'C 350 273 336 296 362 292 C 396 284 430 290 458 297 C 482 303 506 296 '
        f'{MX + FW + 30} 288 V{MY + FH + 30} H{MX - 30}z" fill="url(#ve_mid)"/></g>'
        + ''.join(f'<path d="{m}" fill="{col}" opacity=".95"/>'
                  + (f'<path d="{luz}" fill="none" stroke="#6ba98c" stroke-width="2.2" '
                     f'stroke-linecap="round" opacity=".45"/>' if luz else '')
                  for m, col, luz in matas)
        # bruma de tarde acumulada en la falda: separa la capa media del fondo
        + f'<rect x="{MX}" y="252" width="{FW}" height="56" fill="url(#ve_bruma)"/>'
        + f'<rect x="{MX}" y="{MY}" width="{FW}" height="{FH}" fill="#9fb8bd" opacity=".06"/></g>'
        + _marco(MX, MY, '#54ac9f', '#2f7a72')
        # ═══ capa 3 · plano de juego, nítido y en construcción
        + f'<g clip-path="url(#ve_cj)">'
        # cimiento ya colocado, de lado a lado, más apagado que la superficie
        + _bloque(FX, BASE, FW, G, capa=False)
        + f'<rect x="{FX}" y="{BASE}" width="{FW}" height="{G}" fill="url(#ve_sub)"/>'
        # superficie construida hasta la mitad
        + _bloque(FX, SUELO, 5 * G, G)
        # plataforma elevada y su sombra sobre el suelo
        + sombra_suelo(232, SUELO + 6, 68, 10, .4)
        + _bloque(160, FY + 3 * G, 4 * G, G)
        # canto vivo donde se corta la obra
        + f'<path d="M322 {SUELO}v{G}" stroke="{k["madS"]}" stroke-width="2.6" opacity=".85"/>'
        f'<path d="M324.4 {SUELO}v{G}" stroke="{k["madLL"]}" stroke-width="1.3" opacity=".3"/>'
        # piezas planificadas, todavía sin construir
        + _fantasma(394, SUELO, 3 * G, G) + _fantasma(394, FY + 2 * G, 2 * G, G)
        + rejilla
        # marcador de aparición
        + f'<circle cx="472" cy="208" r="12" fill="none" stroke="{k["oroL"]}" stroke-width="2" '
        f'stroke-dasharray="5 5" opacity=".88"/>'
        f'<path d="M472 192v7M472 217v7M454 208h7M483 208h7" stroke="{k["oroL"]}" stroke-width="2" '
        f'stroke-linecap="round" opacity=".88"/>'
        f'<circle cx="472" cy="208" r="3" fill="{k["oroL"]}"/>'
        # hueco de destino
        + f'<rect x="322" y="{SUELO}" width="{2 * G}" height="{G}" rx="3" fill="{SEL}" opacity=".18"/>'
        f'<rect x="322" y="{SUELO}" width="{2 * G}" height="{G}" rx="3" fill="none" stroke="{SEL}" '
        f'stroke-width="2.6" stroke-dasharray="9 7"/>'
        # trazado de cámara
        + f'<path d="{tr}" fill="none" stroke="{k["noche"]}" stroke-width="7" opacity=".32"/>'
        f'<path d="{tr}" fill="none" stroke="{SEL}" stroke-width="2.8" stroke-dasharray="13 8" '
        f'stroke-linecap="round" opacity=".95"/>'
        + nodos
        # criatura seleccionada sobre la plataforma
        + sombra_suelo(238, 194, 56, 8, .5, 'b5')
        + _criatura(166, 127, .95)
        + f'<rect x="168" y="124" width="132" height="70" fill="none" stroke="{k["oroL"]}" '
        f'stroke-width="1.7" stroke-dasharray="8 6" opacity=".9"/>'
        + _asas4(168, 124, 132, 70)
        # etiqueta del recurso
        + f'<rect x="168" y="99" width="70" height="19" rx="4.5" fill="{k["noche"]}" opacity=".82"/>'
        f'<rect x="168" y="99" width="70" height="19" rx="4.5" fill="none" stroke="{k["oroL"]}" '
        f'stroke-width="1.3" opacity=".88"/>'
        f'<circle cx="178" cy="108.5" r="3.6" fill="{k["oroL"]}"/>'
        f'<rect x="187" y="105" width="42" height="4" rx="2" fill="#fff" opacity=".68"/>'
        f'<rect x="187" y="111" width="24" height="2.8" rx="1.4" fill="#fff" opacity=".3"/>'
        # guía de caída y sombra de la pieza que baja al hueco
        + f'<path d="M358 250v12" stroke="{SEL}" stroke-width="1.8" stroke-dasharray="4 5" opacity=".8"/>'
        f'<ellipse cx="362" cy="278" rx="34" ry="8" fill="{k["noche"]}" opacity=".55" '
        f'filter="url(#b5)"/>'
        # la pieza, ligeramente por encima y algo girada
        + f'<g transform="rotate(-3.5 358 240)">'
        f'<rect x="322" y="222" width="{2 * G}" height="{G}" rx="3" fill="url(#ve_pieza)"/>'
        f'<rect x="322" y="222" width="{2 * G}" height="{G}" rx="3" filter="url(#veta)" '
        f'style="mix-blend-mode:multiply" opacity=".3"/>'
        f'<path d="M358 224v32" stroke="{k["madS"]}" stroke-width="2" opacity=".42"/>'
        f'<rect x="322" y="222" width="{2 * G}" height="4.4" rx="2" fill="#fff8e6" opacity=".82"/>'
        f'<rect x="322" y="251" width="{2 * G}" height="7" fill="{k["noche"]}" opacity=".3"/>'
        f'<rect x="320.4" y="220.4" width="{2 * G + 3}" height="{G + 3}" rx="4" fill="none" '
        f'stroke="{SEL}" stroke-width="2"/></g>'
        + f'</g>'
        + _marco(FX, FY, SEL, '#1f8f8c', 2.6, act=True)
        # ═══ paneles del editor
        + _bandeja() + _inspector()
        # ═══ grano y viñeteado
        + f'<rect width="{W}" height="{H}" filter="url(#grano)" style="mix-blend-mode:overlay" opacity=".1"/>'
        f'<rect width="{W}" height="{H}" fill="url(#ve_vin)"/>',
        d + rg('ve_vin', .5, .45, .78, [(.55, '#000', 0), (1, '#0d1b2a', .26)]))
