"""Estudio de cómic y guion gráfico (R43). Textos ES/EN."""
from taller_suite import lienzo_comun

ENGINE = 'comic'
SLUG = {'es': 'comic', 'en': 'comics-storyboarding'}
SCRIPTS = ['ig-suite-lienzo.js', 'ig-suite-comic.js']
LIBRARIES = 'PixiJS (MIT); letras Atkinson Hyperlegible, Bricolage Grotesque, Newsreader y JetBrains Mono (SIL OFL)'
LIBRARIES_EN = 'PixiJS (MIT); typefaces Atkinson Hyperlegible, Bricolage Grotesque, Newsreader and JetBrains Mono (SIL OFL)'

PAGE = {
    'es': {
        'title': 'Cómic y guion gráfico',
        'description': 'Crea tiras, páginas de cómic y guiones gráficos con viñetas, bocadillos, cartelas, dibujo a mano e imágenes. Exporta PNG, SVG y todas las páginas en un ZIP.',
        'lede': 'Cuenta una historia en viñetas. Elige una plantilla de página, dibuja o pon imágenes, y añade bocadillos de habla, pensamiento o grito. También sirve para planificar un vídeo o una animación plano a plano.',
        'make': ['Una tira de tres viñetas', 'Un cómic de varias páginas', 'El guion gráfico (storyboard) de un vídeo', 'Bocadillos y cartelas con texto que se lee bien', 'PNG para compartir, SVG para editar y un ZIP con todas las páginas'],
        'steps': [
            'Elige una distribución de viñetas en Propiedades (con nada elegido) o dibuja tus viñetas con la herramienta Viñeta.',
            'Añade personajes y fondos con formas, el lápiz o tus propias imágenes.',
            'Pon bocadillos con la herramienta Bocadillo. Arrastra la punta amarilla de la cola hacia quien habla.',
            'Escribe los textos en Propiedades y mira la Revisión de lectura: contraste, tamaño de letra y frases largas.',
            'Añade páginas en Estructura y exporta en Archivo.',
        ],
        'sections': [
            {'h': 'Viñetas y ritmo', 'p': 'Cada viñeta es un momento. Viñetas grandes ralentizan la lectura; muchas pequeñas la aceleran. En castellano y en inglés se lee de izquierda a derecha y de arriba abajo, así que la historia debe seguir ese orden.'},
            {'h': 'Bocadillos', 'p': 'El bocadillo de habla tiene una cola que apunta a quien habla. El de pensamiento usa burbujas. El de grito tiene picos. La cartela, rectangular, es la voz de quien narra. Frases cortas y letra clara hacen que todo el mundo pueda leer tu cómic.'},
            {'h': 'Guion gráfico', 'p': 'Un guion gráfico (storyboard) es un cómic de trabajo para planificar un vídeo: en cada viñeta se dibuja el plano y en la cartela se anota qué pasa, el tipo de plano o el sonido. Es el paso previo a grabar o animar.'},
            {'h': 'Personajes propios', 'p': 'Los ejemplos usan personajes hechos con formas sencillas. Crea los tuyos: los personajes de otras personas o de marcas tienen derechos de autor.'},
        ],
        'links': [('Todo el taller', '/es/taller/'), ('Pixel art', '/es/taller/pixel-art/'), ('Diseño gráfico', '/es/taller/diseno-grafico/')],
    },
    'en': {
        'title': 'Comics and storyboards',
        'description': 'Make strips, comic pages and storyboards with panels, speech balloons, captions, freehand drawing and images. Export PNG, SVG and every page in a ZIP.',
        'lede': 'Tell a story in panels. Choose a page layout, draw or add images, and add speech, thought or shout balloons. It also works for planning a video or an animation shot by shot.',
        'make': ['A three-panel strip', 'A comic of several pages', 'The storyboard for a video', 'Balloons and captions with text that is easy to read', 'PNG to share, SVG to edit and a ZIP with every page'],
        'steps': [
            'Choose a panel layout in Properties (with nothing selected) or draw your own panels with the Panel tool.',
            'Add characters and backgrounds with shapes, the pencil or your own images.',
            'Add balloons with the Balloon tool. Drag the yellow tip of the tail towards whoever is speaking.',
            'Write the text in Properties and look at the Readability check: contrast, text size and long sentences.',
            'Add pages in Structure and export from File.',
        ],
        'sections': [
            {'h': 'Panels and pace', 'p': 'Each panel is a moment. Big panels slow reading down; lots of small ones speed it up. In English and Spanish we read left to right and top to bottom, so the story should follow that order.'},
            {'h': 'Balloons', 'p': 'A speech balloon has a tail that points to the speaker. A thought balloon uses bubbles. A shout balloon has spikes. The rectangular caption is the narrator’s voice. Short sentences and clear lettering mean everyone can read your comic.'},
            {'h': 'Storyboards', 'p': 'A storyboard is a working comic for planning a video: each panel shows the shot and the caption notes what happens, the type of shot or the sound. It is the step before filming or animating.'},
            {'h': 'Your own characters', 'p': 'The examples use characters made from simple shapes. Create your own: other people’s and brands’ characters are protected by copyright.'},
        ],
        'links': [('The whole workshop', '/en/workshop/'), ('Pixel art', '/en/workshop/pixel-art/'), ('Graphic design', '/en/workshop/graphic-design/')],
    },
}

STRINGS = {
    'es': {
        'stStrip': 'Tira de tres viñetas', 'stStripD': 'Un personaje, una sorpresa y un final. Cambia los bocadillos.',
        'stPage': 'Página con dos partes', 'stPageD': 'Una viñeta grande de paisaje y dos de diálogo, más una segunda página.',
        'stBoard': 'Guion gráfico', 'stBoardD': 'Seis viñetas con cartelas para planificar un vídeo corto.',
        'sizePage': 'Página (proporción A4)', 'sizeStrip': 'Tira horizontal', 'sizeSquare': 'Cuadrado',
        'svgTitle': 'Cómic, página {n} · El taller de Iris Green',
        'layout': 'Distribución de viñetas', 'layoutApplied': 'Distribución aplicada', 'layoutHelp': 'Cambia las viñetas de esta página; el resto de objetos se queda.',
        'layout_l1': 'Una', 'layout_l2': 'Dos', 'layout_l3': 'Tres', 'layout_l4': 'Cuatro', 'layout_l6': 'Seis', 'layout_s3': 'Tira de tres',
        'ex1a': 'Hoy voy a aprender a hacer malabares.', 'ex1b': '¡Uy!', 'ex1c': 'Mañana, con dos pelotas.', 'ex1cap': 'Un domingo por la tarde…',
        'sb1': '1. Plano general: la calle al amanecer.', 'sb2': '2. Plano medio: Sara sale de casa.', 'sb3': '3. Detalle: el reloj marca las 8.',
        'sb4': '4. Movimiento: Sara corre hacia el autobús.', 'sb5': '5. Sonido: la puerta se cierra.', 'sb6': '6. Final: Sara sonríe dentro.',
        'ex3cap': 'En lo alto de la colina…', 'ex3a': 'Se me ha perdido la cometa.', 'ex3b': '¡Mira arriba! Está en el árbol.',
    },
    'en': {
        'stStrip': 'Three-panel strip', 'stStripD': 'A character, a surprise and an ending. Change the balloons.',
        'stPage': 'Page in two parts', 'stPageD': 'A big landscape panel and two dialogue panels, plus a second page.',
        'stBoard': 'Storyboard', 'stBoardD': 'Six panels with captions to plan a short video.',
        'sizePage': 'Page (A4 proportion)', 'sizeStrip': 'Horizontal strip', 'sizeSquare': 'Square',
        'svgTitle': 'Comic, page {n} · Iris Green’s workshop',
        'layout': 'Panel layout', 'layoutApplied': 'Layout applied', 'layoutHelp': 'Changes the panels on this page; other objects stay.',
        'layout_l1': 'One', 'layout_l2': 'Two', 'layout_l3': 'Three', 'layout_l4': 'Four', 'layout_l6': 'Six', 'layout_s3': 'Strip of three',
        'ex1a': 'Today I am going to learn to juggle.', 'ex1b': 'Oops!', 'ex1c': 'Tomorrow, with two balls.', 'ex1cap': 'One Sunday afternoon…',
        'sb1': '1. Wide shot: the street at dawn.', 'sb2': '2. Mid shot: Sara leaves home.', 'sb3': '3. Close-up: the clock says 8.',
        'sb4': '4. Movement: Sara runs to the bus.', 'sb5': '5. Sound: the door closes.', 'sb6': '6. Ending: Sara smiles inside.',
        'ex3cap': 'At the top of the hill…', 'ex3a': 'I have lost my kite.', 'ex3b': 'Look up! It is in the tree.',
    },
}
for _l in ('es', 'en'):
    STRINGS[_l].update(lienzo_comun.STRINGS[_l])
assert set(STRINGS['es']) == set(STRINGS['en'])
