"""Portada del Taller (R43 · lanzador visual, interfaz R42 aprobada).

Genera es/taller/index.html y en/workshop/index.html completos:
- lanzador WORKSPACE-FIRST: estudios visibles en el primer viewport, agrupados en los cinco perfiles de banco de trabajo;
- «Para ti: Cualquier edad · Infancia · Adolescencia · Adultez» solo en la dirección (?para= / ?for=), nunca guardado;
- búsqueda y filtros por perfil progresivos (sin JS la portada es una lista completa de enlaces);
- ilustraciones SVG propias, sin imágenes externas ni almacenamiento.
La sección «Mi colección» de A5 se conserva plegada al final (OBS-R42-TALLER-STORAGE-01 sin cambios).
"""
from __future__ import annotations

import html
import json
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = {'es': ROOT / 'es/taller/index.html', 'en': ROOT / 'en/workshop/index.html'}
BASE = {'es': '/es/taller/', 'en': '/en/workshop/'}
SITE = 'https://irisgreen.eu'
V = 'r54-tokens-2'

PROFILES = [
    ('lienzo', 'Lienzo creativo', 'Creative canvas', 'Dibujar, componer y diseñar imágenes.', 'Draw, compose and design images.'),
    ('construir', 'Construir y probar', 'Build and test', 'Montar algo y comprobar si funciona.', 'Build something and test whether it works.'),
    ('tiempo', 'Línea de tiempo', 'Timeline', 'Música, sonido y luz que cambian con el tiempo.', 'Music, sound and light that change over time.'),
    ('codigo', 'Código y bloques', 'Code and blocks', 'Programar con bloques o con código real.', 'Program with blocks or real code.'),
    ('documento', 'Inventar y contar', 'Invent and tell', 'Escribir, inventar mundos, lenguas y juegos.', 'Write and invent worlds, languages and games.'),
]

# slug ES, slug EN, perfil, nombre ES, nombre EN, frase ES, frase EN, nuevo
STUDIOS = [
    ('dibujo', 'drawing', 'lienzo', 'Dibujo', 'Drawing', 'Capas, pinceles, simetría y perspectiva', 'Layers, brushes, symmetry and perspective', False),
    ('diseno-grafico', 'graphic-design', 'lienzo', 'Diseño gráfico', 'Graphic design', 'Carteles y publicaciones con revisión de contraste', 'Posters and posts with a contrast check', False),
    ('pixel-art', 'pixel-art', 'lienzo', 'Pixel art', 'Pixel art', 'Paletas, fotogramas, mosaico y GIF', 'Palettes, frames, tiling and GIF', False),
    ('comic', 'comics-storyboarding', 'lienzo', 'Cómic y guion gráfico', 'Comics and storyboards', 'Viñetas, bocadillos y páginas', 'Panels, balloons and pages', False),
    ('color', 'colour', 'lienzo', 'Color', 'Colour', 'Rueda, mezclas, contraste y paletas', 'Wheel, mixes, contrast and palettes', False),
    ('patrones', 'patterns-generative-art', 'lienzo', 'Patrones y arte generativo', 'Patterns and generative art', 'Repeticiones, simetrías y teselados', 'Repetition, symmetry and tessellation', False),
    ('fotografia', 'photography-composition', 'lienzo', 'Fotografía y composición', 'Photography and composition', 'Encuadre y luz con tus fotos, sin subirlas', 'Framing and light with your photos, never uploaded', False),
    ('moda-textil', 'fashion-textiles', 'lienzo', 'Moda y textil', 'Fashion and textiles', 'Patrones, tejidos y estampados', 'Patterns, fabrics and prints', False),
    ('estructuras', 'structures', 'construir', 'Estructuras y puentes', 'Structures and bridges', 'Puentes y grúas con cálculo y física', 'Bridges and cranes with forces and physics', False),
    ('arquitectura', 'architecture-plans', 'construir', 'Arquitectura y planos', 'Architecture and plans', 'Planta y 3D a la vez, con paseo', 'Plan and 3D together, with a walk-through', False),
    ('modelado-3d', '3d-modelling', 'construir', 'Modelado 3D', '3D modelling', 'Sólidos y huecos en milímetros; STL para imprimir', 'Solids and holes in millimetres; STL to print', True),
    ('maquinas', 'machines', 'construir', 'Máquinas e inventos', 'Machines and inventions', 'Engranajes, palancas, poleas y rampas', 'Gears, levers, pulleys and ramps', False),
    ('circuitos', 'circuits', 'construir', 'Circuitos', 'Circuits', 'Pilas, luces, interruptores y puertas lógicas', 'Batteries, lights, switches and logic gates', False),
    ('papiroflexia', 'origami-polyhedra', 'construir', 'Papiroflexia y poliedros', 'Origami and polyhedra', 'Pliegues y sólidos que se despliegan', 'Folds and solids that unfold', False),
    ('simulaciones', 'simulations', 'construir', 'Simulaciones', 'Simulations', 'Ecosistemas, tráfico y autómatas', 'Ecosystems, traffic and automata', False),
    ('ritmo', 'rhythm-sequencer', 'tiempo', 'Ritmo y secuenciador', 'Rhythm and sequencer', 'Batería y pistas; WAV y MIDI', 'Drums and tracks; WAV and MIDI', False),
    ('composicion', 'composition', 'tiempo', 'Composición', 'Composition', 'Piano roll con acordes e instrumentos', 'Piano roll with chords and instruments', False),
    ('sintesis-sonido', 'synthesis-soundscapes', 'tiempo', 'Síntesis y paisajes sonoros', 'Synthesis and soundscapes', 'Osciladores, envolventes y efectos', 'Oscillators, envelopes and effects', False),
    ('videomapping', 'projection-mapping', 'tiempo', 'Videomapping', 'Projection mapping', 'Luz que encaja en objetos reales', 'Light that fits real objects', True),
    ('programacion', 'coding', 'codigo', 'Programación', 'Coding', 'Bloques, JavaScript y Python', 'Blocks, JavaScript and Python', False),
    ('robotica', 'robotics', 'codigo', 'Robótica', 'Robotics', 'Un robot con sensores y su gemelo digital', 'A robot with sensors and its digital twin', False),
    ('videojuegos', 'video-game-design', 'codigo', 'Diseño de videojuegos', 'Video game design', 'Escenarios con física; exporta tu juego', 'Scenes with physics; export your game', False),
    ('escritura-restricciones', 'constraint-writing', 'documento', 'Escritura con restricciones', 'Constraint writing', 'Sin una letra, palabras contadas, formas poéticas', 'Missing letters, counted words, poetic forms', False),
    ('mundos', 'worlds', 'documento', 'Mundos', 'Worlds', 'Mapas, especies, historia y personajes', 'Maps, species, history and characters', False),
    ('lenguas-inventadas', 'invented-languages', 'documento', 'Lenguas inventadas', 'Invented languages', 'Sonidos, alfabeto, gramática y diccionario', 'Sounds, alphabet, grammar and dictionary', False),
    ('juegos-de-mesa', 'board-games', 'documento', 'Juegos de mesa', 'Board games', 'Tablero, cartas y reglas para imprimir', 'Board, cards and printable rules', False),
    ('ideas', 'ideas', 'documento', 'Ideas e inventos', 'Ideas and inventions', 'Laboratorio de ideas y SCAMPER', 'Idea lab and SCAMPER', False),
]

# Sugerencias por etapa: orientan, no limitan (slug ES).
SUGGEST = {'': ['programacion', 'estructuras', 'ritmo'], 'infancia': ['pixel-art', 'robotica', 'videomapping'],
           'adolescencia': ['videojuegos', 'modelado-3d', 'sintesis-sonido'], 'adultez': ['arquitectura', 'diseno-grafico', 'composicion']}

T = {
    'es': {
        'title': 'Crea algo', 'meta': 'El taller de Iris Green: 27 formas de crear para crear en el navegador, sin puntuaciones y sin subir nada. Dibujo, 3D, música, código, robótica, videojuegos, escritura y más.',
        'lede': 'Crea imágenes, música, construcciones, código e historias. Aquí están los 27 formas de crear, agrupados por lo que quieres hacer.',
        'note': '',
        'para': 'Para ti', 'paraOpts': [('', 'Cualquier edad'), ('infancia', 'Infancia'), ('adolescencia', 'Adolescencia'), ('adultez', 'Adultez')], 'paraKey': 'para',
        'paraHelp': 'Cambia los ejemplos de partida. No se guarda y no quita herramientas.',
        'search': 'Buscar qué crear', 'searchPh': 'Por ejemplo: 3D, música, robot…',
        'start': 'Para empezar', 'startCta': 'Empezar', 'all': 'Todas las herramientas', 'allFilter': 'Todos', 'filters': 'Filtrar por herramienta',
        'new': 'Nuevo', 'count': '{n} herramientas', 'none': 'Ninguna herramienta coincide con «{q}».', 'clear': 'Quitar la búsqueda',
        'collection': 'Tus proyectos', 'collectionH': 'Guardar y abrir',
        'collectionP': 'Para conservar un proyecto, abre Opciones dentro de la herramienta y elige «Guardar proyecto». Para retomarlo otro día, usa Continuar proyecto o bien Opciones → Abrir.',
        'skip': 'Saltar a las herramientas',
        'profiles': 'Cinco formas de trabajar', 'profileCta': 'Ver las herramientas', 'profileCount': '{n} herramientas',
        'continueT': 'Seguir donde estabas', 'continueCta': 'Volver a {name}',
        'allOpen': 'Ver los 27 formas de crear', 'allClose': 'Cerrar', 'allDialog': 'Todas las herramientas',
    },
    'en': {
        'title': 'Make something', 'meta': 'Iris Green’s workshop: 27 ways to create to create in the browser, with no scores and nothing uploaded. Drawing, 3D, music, code, robotics, video games, writing and more.',
        'lede': 'Create images, music, structures, code and stories. Browse all 27 ways to create, grouped by what you want to make.',
        'note': '',
        'para': 'For you', 'paraOpts': [('', 'Any age'), ('childhood', 'Childhood'), ('adolescence', 'Adolescence'), ('adulthood', 'Adulthood')], 'paraKey': 'for',
        'paraHelp': 'Changes the starting examples. Nothing is saved and no tools are taken away.',
        'search': 'Find something to create', 'searchPh': 'For example: 3D, music, robot…',
        'start': 'Good places to start', 'startCta': 'Start', 'all': 'All tools', 'allFilter': 'All', 'filters': 'Filter by tool',
        'new': 'New', 'count': '{n} tools', 'none': 'No tool matches “{q}”.', 'clear': 'Clear the search',
        'collection': 'Your projects', 'collectionH': 'Save and open',
        'collectionP': 'To keep a project, open Options in the tool and choose “Save project”. To carry on another day, use Continue project or Options → Open.',
        'skip': 'Skip to the tools',
        'profiles': 'Five ways of working', 'profileCta': 'See the tools', 'profileCount': '{n} tools',
        'continueT': 'Carry on where you were', 'continueCta': 'Back to {name}',
        'allOpen': 'See all 27 ways to create', 'allClose': 'Close', 'allDialog': 'All tools',
    },
}
STAGE_MAP = {'infancia': 'childhood', 'adolescencia': 'adolescence', 'adultez': 'adulthood'}


def e(s: str) -> str:
    return html.escape(str(s), quote=True)


def fold(s: str) -> str:
    return ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if unicodedata.category(c) != 'Mn')


# ---------- Escenas de cada estudio (R54) ----------
# El Taller entra por escenas, no por iconos: cada estudio tiene una mini-escena
# con fondo, trabajo empezado y acción visible. Viven en taller_suite/escenas.py.
from taller_suite import escenas as ESC  # noqa: E402

# Alias en inglés para las ilustraciones de perfil escritas antes de R54.
C = dict(ESC.P)
C.update({'ink': ESC.P['tinta'], 'blue': ESC.P['azul'], 'sky': ESC.P['cielo'], 'violet': ESC.P['violeta'],
          'lav': ESC.P['lila'], 'teal': ESC.P['turquesa'], 'mint': ESC.P['menta'], 'yellow': ESC.P['oro'],
          'sun': ESC.P['sol'], 'red': ESC.P['rojo'], 'pink': ESC.P['rosa'], 'green': ESC.P['verde'],
          'leaf': ESC.P['hoja'], 'grey': ESC.P['gris'], 'paper': ESC.P['papel'], 'sand': ESC.P['arena']})
BG = ESC.BG


from taller_suite.migradas import MIGRADAS, variante_migrada
from taller_suite.escenas_raster import formatos as ESCENAS_FORMATOS

ESCENAS_DIR = Path(__file__).resolve().parents[2] / 'img' / 'taller' / 'escenas'


def art(slug: str, prioritaria: bool = False) -> str:
    """Escena de la tarjeta: raster rico si el estudio está migrado, si no el SVG.

    Las escenas ricas se dibujan como SVG con luz, material y desenfoque y se
    rasterizan fuera del navegador (``scripts/render_escenas_ricas.py``), que
    emite 640x400 y 1280x800 en AVIF y en WebP.

    Se sirven con ``<picture>``: AVIF primero y WebP de reserva, cada uno con su
    ``srcset`` por densidad. El navegador descarga **un solo fichero**, el mejor
    que sepa leer. El AVIF pesa en torno a la mitad que el WebP a igualdad de
    aspecto, y ese margen es el que permite subir microdetalle sin romper el
    presupuesto de peso (norma visual SEP 2026, §14). El WebP sigue ahí para el
    resto de navegadores, así que nadie se queda sin imagen.

    Son decorativas —de ahí el ``alt`` vacío—: el nombre y la descripción del
    estudio ya van en texto.

    ``prioritaria`` marca las tarjetas que entran en la primera pantalla: esas se
    cargan de inmediato y con prioridad alta, porque una de ellas es el elemento
    de contenido mayor de la portada. El resto van diferidas.

    Un estudio declarado en ``MIGRADAS`` al que le falte cualquiera de sus cuatro
    ficheros **rompe el build**. Astra rechazó la caída silenciosa al SVG plano:
    escondía escenas sin migrar detrás de una imagen que parecía correcta.
    """
    if slug in MIGRADAS:
        return _picture(slug, prioritaria, 'igk-art-svg igk-art-rica')
    return ESC.svg(ESC.S[slug]())


def _picture(slug: str, prioritaria: bool, clases: str) -> str:
    """El ``<picture>`` de una escena rasterizada, con build-strict.

    AVIF primero y WebP de reserva, cada uno con su ``srcset`` por densidad. El
    navegador descarga un solo fichero, el mejor que sepa leer.
    """
    faltan = [n for _c, n, *_ in ESCENAS_FORMATOS(slug)
              if not (ESCENAS_DIR / n).exists()]
    if faltan:
        raise SystemExit(
            f'R54 build-strict: «{slug}» está en MIGRADAS pero faltan '
            f'{", ".join(faltan)} en img/taller/escenas/. '
            f'Ejecuta scripts/render_escenas_ricas.py {slug} '
            f'o quítalo de scripts/taller_suite/migradas.py.')
    carga = ('loading="eager" fetchpriority="high"' if prioritaria
             else 'loading="lazy" fetchpriority="low"')
    base = '/img/taller/escenas'
    return (
        '<picture>'
        f'<source type="image/avif" srcset="{base}/{slug}.avif 1x, '
        f'{base}/{slug}@2x.avif 2x">'
        f'<source type="image/webp" srcset="{base}/{slug}.webp 1x, '
        f'{base}/{slug}@2x.webp 2x">'
        f'<img class="{clases}" src="{base}/{slug}.webp" '
        f'srcset="{base}/{slug}.webp 1x, {base}/{slug}@2x.webp 2x" '
        f'width="640" height="400" alt="" {carga} decoding="async">'
        '</picture>')


def art_child(slug: str) -> str:
    """Variante para «Contenido para… = Infancia», donde la base es demasiado técnica.

    R65 fase 2: si la variante ``AGE_0_12`` de ese estudio ya está migrada a
    escena rica, se sirve el raster; si no, sigue el SVG plano de R47, y eso es
    explícito. Las dos van con la clase ``igk-art-child``, que es la que el
    lanzador conmuta al elegir la banda, así que no cambia nada de la interfaz.

    La variante va **siempre diferida**: no está en la primera pantalla y solo se
    ve cuando la persona elige esa banda.
    """
    rica = variante_migrada(slug)
    if rica:
        return _picture(rica, False, 'igk-art-svg igk-art-rica igk-art-child')
    fn = ESC.S_CHILD.get(slug)
    return ESC.svg(fn(), 'igk-art-svg igk-art-child') if fn else ''


def prof_art(pid: str) -> str:
    k = C
    a = {
        'lienzo': (
            f'<rect x="10" y="10" width="180" height="100" rx="8" fill="#fff" stroke="{k["grey"]}" stroke-width="1.5"/>'
            f'<path d="M26 86 C52 24, 84 104, 112 44 S164 30, 176 70" fill="none" stroke="{k["violet"]}" stroke-width="9" stroke-linecap="round" opacity=".9"/>'
            f'<path d="M26 96 C52 42, 84 112, 112 58 S164 46, 176 82" fill="none" stroke="{k["pink"]}" stroke-width="5" stroke-linecap="round" opacity=".8"/>'
            f'<rect x="18" y="18" width="40" height="28" rx="4" fill="{k["sun"]}" opacity=".85"/>'
            f'<rect x="26" y="26" width="40" height="28" rx="4" fill="{k["mint"]}" opacity=".85"/>'
            f'<rect x="34" y="34" width="40" height="28" rx="4" fill="{k["sky"]}" opacity=".85"/>'
        ),
        'construir': (
            f'<path d="M14 100 h172" stroke="{k["grey"]}" stroke-width="3"/>'
            f'<rect x="20" y="78" width="26" height="22" fill="{k["sand"]}" stroke="{k["navy"]}" stroke-width="2"/>'
            f'<rect x="154" y="78" width="26" height="22" fill="{k["sand"]}" stroke="{k["navy"]}" stroke-width="2"/>'
            f'<path d="M33 78 L70 34 h60 l37 44 M70 34 l22 44 22-44 22 44" fill="none" stroke="{k["navy"]}" stroke-width="4" stroke-linejoin="round"/>'
            f'<rect x="88" y="86" width="24" height="12" rx="3" fill="{k["red"]}"/>'
            f'<circle cx="94" cy="98" r="4" fill="{k["ink"]}"/><circle cx="106" cy="98" r="4" fill="{k["ink"]}"/>'
            f'<path d="M150 20 v16 M142 28 h16" stroke="{k["teal"]}" stroke-width="3" stroke-linecap="round"/>'
        ),
        'tiempo': (
            ''.join(f'<rect x="{16+x*16}" y="{24+y*20}" width="12" height="14" rx="3" fill="{(k["coral"] if (x*3+y*5) % 4 == 0 else "#fff")}" stroke="{k["grey"]}" stroke-width="1"/>' for y in range(4) for x in range(11))
            + f'<rect x="76" y="16" width="3" height="90" rx="1.5" fill="{k["red"]}"/>'
            + f'<path d="M14 112 ' + ' '.join(f'Q{20+i*18} {104 if i % 2 == 0 else 118} {28+i*18} 112' for i in range(9)) + f'" fill="none" stroke="{k["violet"]}" stroke-width="3"/>'
        ),
        'codigo': (
            f'<rect x="12" y="16" width="86" height="20" rx="5" fill="{k["yellow"]}"/>'
            f'<rect x="20" y="40" width="78" height="18" rx="5" fill="{k["violet"]}"/>'
            f'<rect x="20" y="62" width="18" height="34" rx="5" fill="{k["green"]}"/>'
            f'<rect x="40" y="62" width="58" height="15" rx="5" fill="{k["blue"]}"/>'
            f'<rect x="40" y="81" width="46" height="15" rx="5" fill="{k["blue"]}"/>'
            f'<rect x="110" y="16" width="78" height="88" rx="6" fill="{k["navy"]}"/>'
            f'<circle cx="132" cy="70" r="10" fill="{k["sun"]}"/>'
            f'<rect x="118" y="86" width="62" height="6" rx="3" fill="{k["leaf"]}"/>'
            f'<path d="M150 40 l10 10 -10 10" fill="none" stroke="{k["mint"]}" stroke-width="3" stroke-linecap="round"/>'
        ),
        'documento': (
            f'<rect x="12" y="12" width="80" height="96" rx="6" fill="#fff" stroke="{k["navy"]}" stroke-width="2"/>'
            + ''.join(f'<rect x="22" y="{26+i*13}" width="{w}" height="6" rx="3" fill="{k["grey"]}"/>' for i, w in enumerate([60, 48, 58, 36, 54, 42]))
            + f'<rect x="22" y="22" width="30" height="8" rx="4" fill="{k["violet"]}"/>'
            f'<circle cx="140" cy="34" r="12" fill="{k["mint"]}" stroke="{k["teal"]}" stroke-width="2"/>'
            f'<circle cx="116" cy="76" r="11" fill="{k["sun"]}" stroke="{k["yellow"]}" stroke-width="2"/>'
            f'<circle cx="168" cy="82" r="11" fill="{k["lav"]}" stroke="{k["violet"]}" stroke-width="2"/>'
            f'<path d="M134 45 L122 66 M150 44 L162 71 M127 80 h30" fill="none" stroke="{k["navy"]}" stroke-width="2"/>'
        ),
    }[pid]
    return f'<svg class="igk-p-svg" viewBox="0 0 200 120" aria-hidden="true" focusable="false">{a}</svg>'


def page(lang: str) -> str:
    from build_taller_estudios import HEADER, FOOTER  # noqa: E402
    t = T[lang]
    other = 'en' if lang == 'es' else 'es'
    url = BASE[lang]
    by = {s[0]: s for s in STUDIOS}

    def href(s):
        return BASE[lang] + (s[0] if lang == 'es' else s[1]) + '/'

    def name(s):
        return s[3] if lang == 'es' else s[4]

    def desc(s):
        return s[5] if lang == 'es' else s[6]

    def prof_name(pid):
        p = [x for x in PROFILES if x[0] == pid][0]
        return p[1] if lang == 'es' else p[2]

    def tile(s, big=False, prioritaria=False):
        search = fold(' '.join([s[3], s[4], s[5], s[6], prof_name(s[2]), s[0], s[1]]))
        badge = f'<span class="igk-badge">{e(t["new"])}</span>' if s[7] else ''
        cta = f'<span class="igk-cta" aria-hidden="true">{e(t["startCta"])} →</span>' if big else ''
        nino = art_child(s[0])
        arte = (f'<span class="igk-art{" igk-art-2" if nino else ""}" style="--igk-bg:{BG[s[2]]}">'
                f'{art(s[0], prioritaria)}{nino}{badge}</span>')
        return (f'<li class="igk-item" data-profile="{s[2]}" data-search="{e(search)}"'
                f' data-audience="TRANSVERSAL" data-sensitivity="S0_GENERAL" data-discovery="NORMAL">'
                f'<a class="igk-tile{" igk-tile-big" if big else ""}" href="{href(s)}" data-studio="{s[0]}">'
                f'{arte}'
                f'<span class="igk-text"><span class="igk-name">{e(name(s))}</span>'
                f'<span class="igk-desc">{e(desc(s))}</span></span>{cta}</a></li>')

    def seg(v, label):
        link = ('?' + t['paraKey'] + '=' + v) if v else './'
        cur = '' if v else ' aria-current="true"'
        return f'<li><a class="igk-seg" data-para="{v}" href="{link}"{cur}>{e(label)}</a></li>'
    para_links = ''.join(seg(v, label) for v, label in t['paraOpts'])
    def start_list(k, v):
        dp = {'infancia':'AGE_0_12','adolescencia':'AGE_13_17','adultez':'AGE_18_PLUS'}.get(k, 'ALL_AGES')
        hid = ' hidden' if k else ''
        return f'<ul class="igk-grid igk-start" data-para="{dp}"{hid}>' + ''.join(tile(by[x], True, prioritaria=not k) for x in v) + '</ul>'
    starts = ''.join(start_list(k, v) for k, v in SUGGEST.items())
    chips = ''.join([f'<li><button type="button" class="igk-chip" data-filter="" aria-pressed="true">{e(t["allFilter"])}</button></li>'] +
                    [f'<li><button type="button" class="igk-chip" data-filter="{p[0]}" aria-pressed="false">{e(p[1] if lang == "es" else p[2])}</button></li>' for p in PROFILES])
    groups = ''.join(
        f'<section class="igk-group" data-profile="{p[0]}" aria-labelledby="igk-g-{p[0]}"><div class="igk-group-head"><h3 id="igk-g-{p[0]}">{e(p[1] if lang == "es" else p[2])}</h3><p>{e(p[3] if lang == "es" else p[4])}</p></div>'
        f'<ul class="igk-grid">' + ''.join(tile(s) for s in STUDIOS if s[2] == p[0]) + '</ul></section>'
        for p in PROFILES)
    def prof_card(p):
        n = len([x for x in STUDIOS if x[2] == p[0]])
        label = p[1] if lang == 'es' else p[2]
        return (f'<li class="igk-p" data-profile="{p[0]}" style="--igk-bg:{BG[p[0]]}">'
                f'<button type="button" class="igk-p-btn" data-open-profile="{p[0]}">'
                f'<span class="igk-p-art">{prof_art(p[0])}</span>'
                f'<span class="igk-p-text"><span class="igk-p-name">{e(label)}</span>'
                f'<span class="igk-p-desc">{e(p[3] if lang == "es" else p[4])}</span>'
                f'<span class="igk-p-n">{e(t["profileCount"].replace("{n}", str(n)))}</span></span>'
                f'<span class="igk-cta" aria-hidden="true">{e(t["profileCta"])} →</span></button></li>')
    profiles_html = '<ul class="igk-profiles">' + ''.join(prof_card(p) for p in PROFILES) + '</ul>'
    other_url = BASE[other]
    head = (
        f'<!DOCTYPE html><html lang="{lang}"><head><script src="/assets/preferencias-lectura.js"></script><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        f'<title>{e(t["title"])} | Iris Green</title><meta name="description" content="{e(t["meta"])}"><meta name="theme-color" content="#0B1A2B"><meta name="robots" content="index,follow">'
        f'<link rel="canonical" href="{SITE}{url}"><link rel="alternate" hreflang="{lang}" href="{SITE}{url}"><link rel="alternate" hreflang="{other}" href="{SITE}{other_url}"><link rel="alternate" hreflang="x-default" href="{SITE}{BASE["es"]}">'
        f'<meta property="og:type" content="website"><meta property="og:site_name" content="Iris Green"><meta property="og:title" content="{e(t["title"])}"><meta property="og:description" content="{e(t["meta"])}"><meta property="og:url" content="{SITE}{url}"><meta property="og:image" content="https://irisgreen.eu/img/og-condiciones.png">'
        '<link href="/assets/site-v23.css" rel="stylesheet"><link rel="stylesheet" href="/assets/ajustes-interfaz.css"/><link rel="stylesheet" href="/assets/controles-comunes.css"/><link rel="stylesheet" href="/assets/preferencias-lectura.css">'
        f'<link rel="stylesheet" href="/assets/ig-global-ui-tokens-2026.css?v={V}">'
        f'<link rel="stylesheet" href="/assets/ig-r42-materials.css?v=r42-r02-1">'
        f'<link rel="stylesheet" href="/assets/ig-suite-launcher.css?v={V}"><link rel="stylesheet" href="/assets/ig-r44-hub.css"></head>'
    )
    body = (
        '<body data-ig-taller-launcher="true" data-ig-no-page-finder="true" data-ig-materials="r42"'
        ' data-ig-audience="TRANSVERSAL" data-ig-sensitivity="S0_GENERAL" data-ig-discovery="NORMAL"'
        f' data-ig-storage="tab-memory">' + HEADER[lang].replace('{other}', other_url)
        + f'<main id="main" class="igk" data-lang="{lang}">'
        # 1 · título compacto  2 · Contenido para…  (R47 §5)
        + f'<header class="igk-head"><div class="igk-title"><h1>{e(t["title"])}</h1><p class="igk-lede">{e(t["lede"])}</p></div>'
        + f'<nav class="igk-para" aria-labelledby="igk-para-t"><p id="igk-para-t" class="igk-para-t">{e(t["para"])}</p><ul class="igk-segs">{para_links}</ul><p class="igk-para-help">{e(t["paraHelp"])}</p></nav>'
        + f'<div class="igk-actions"><div class="igk-search" role="search" hidden><label for="igk-q">{e(t["search"])}</label>'
        + f'<div class="igk-search-row"><input id="igk-q" type="search" autocomplete="off" placeholder="{e(t["searchPh"])}" aria-describedby="igk-status" aria-controls="igk-all">'
        + f'<button type="button" class="igk-clear" hidden aria-label="{e(t["clear"])}">×</button></div></div>'
        + f'<button type="button" class="igk-all-btn" data-open-profile="" hidden>{e(t["allOpen"])}</button></div></header>'
        + hub_actions(lang)
        # 3 · seguir donde estabas (solo en esta sesión: se resuelve con el referente, sin guardar nada)
        + f'<section class="igk-continue" aria-labelledby="igk-cont-t" hidden><h2 id="igk-cont-t" class="igk-h2">{e(t["continueT"])}</h2><p class="igk-cont-slot"></p></section>'
        # 4 · tres propuestas para empezar
        # 5 · los cinco perfiles como lanzador visual
        # 7 · todos los estudios: secundario (hoja/diálogo con JS; sección normal sin JS)
        + f'<section id="igk-all" class="igk-all" aria-labelledby="igk-all-t" tabindex="-1"><div class="igk-all-head"><h2 id="igk-all-t" class="igk-h2">{e(t["all"])}</h2>'
        + f'<ul class="igk-chips" aria-label="{e(t["filters"])}" hidden>{chips}</ul></div>'
        + f'<p id="igk-status" class="igk-status" role="status" aria-live="polite"></p>{groups}</section>'
        # 8 · proyectos y guardado, en panel
        + f'<details class="igk-collection"><summary>{e(t["collection"])}</summary><div class="igt-sec"><h2>{e(t["collectionH"])}</h2><p>{e(t["collectionP"])}</p></div></details>'
        
        + '</main>' + FOOTER[lang].replace('{credits}', '')
        + '<script id="igk-i18n" type="application/json">'
        + json.dumps({'count': t['count'], 'none': t['none'], 'key': t['paraKey'], 'contCta': t['continueCta'],
                      'allDialog': t['allDialog'], 'close': t['allClose'], 'allOpen': t['allOpen'],
                      'base': BASE[lang]}, ensure_ascii=False).replace('</', '<\\/') + '</script>'
        + '<script defer src="/assets/lectura-accesible.js"></script><script defer src="/assets/interfaz-comun.js"></script><script defer src="/assets/musica.js"></script>'
        + f'<script defer src="/assets/ig-childsafe.js?v={V}"></script>'
        + f'<script defer src="/assets/ig-suite-launcher.js?v={V}"></script><script defer src="/assets/ig-r44-hub.js"></script></body></html>\n'
    )
    return head + body


def hub_actions(lang):
    import importlib
    # Derive routing from the engine declarations, never from untrusted file paths.
    from build_taller_suite import SUITE
    routes = {}
    for name in SUITE:
        mod = importlib.import_module('taller_suite.' + name)
        routes[mod.ENGINE] = BASE[lang] + mod.SLUG[lang] + '/'
    en = lang == 'en'
    draw = BASE[lang] + ('drawing/' if en else 'dibujo/')
    words = ('Make something', 'Continue project', 'Try an invitation', 'Create freely') if en else ('Crear algo', 'Continuar proyecto', 'Probar una invitación', 'Crear libremente')
    return ('<nav class="r44-hub-actions" aria-label="' + words[0] + '">'
            + '<a href="' + draw + '">' + words[0] + '</a>'
            + '<button type="button" id="r44-continue">' + words[1] + '</button>'
            + '<a href="' + draw + '?invitation=E02">' + words[2] + '</a>'
            + '<a href="#igk-all">' + words[3] + '</a></nav>'
            + '<p id="r44-file-status" role="status" aria-live="polite"></p>'
            + '<script type="application/json" id="r44-project-routes">'
            + json.dumps(routes, ensure_ascii=False).replace('</', '<\\/') + '</script>')


def main() -> None:
    for lang in ('es', 'en'):
        OUT[lang].write_text(page(lang), encoding='utf-8')


if __name__ == '__main__':
    main()

