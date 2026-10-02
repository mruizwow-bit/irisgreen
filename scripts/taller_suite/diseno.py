"""Estudio de diseño gráfico (R43). Textos ES/EN."""
from taller_suite import lienzo_comun

ENGINE = 'diseno'
SLUG = {'es': 'diseno-grafico', 'en': 'graphic-design'}
SCRIPTS = ['ig-suite-lienzo.js', 'ig-suite-diseno.js']
LIBRARIES = 'PixiJS (MIT); letras Atkinson Hyperlegible, Bricolage Grotesque, Newsreader y JetBrains Mono (SIL OFL)'
LIBRARIES_EN = 'PixiJS (MIT); typefaces Atkinson Hyperlegible, Bricolage Grotesque, Newsreader and JetBrains Mono (SIL OFL)'

PAGE = {
    'es': {
        'title': 'Diseño gráfico',
        'description': 'Diseña carteles, invitaciones, publicaciones y banners con texto, formas e imágenes. Revisa el contraste y la legibilidad, y exporta PNG para pantalla o impresión y SVG.',
        'lede': 'Un buen diseño se entiende de un vistazo. Aquí compones carteles, tarjetas y publicaciones con jerarquía clara, y el estudio te avisa si algún texto no se lee bien.',
        'make': ['Una invitación o tarjeta', 'Un cartel A4 para un evento', 'Una publicación cuadrada o vertical para redes', 'Un banner para una web', 'PNG para pantalla, PNG a 3× para imprimir y SVG editable'],
        'steps': [
            'Elige un ejemplo o un formato en Propiedades (con nada elegido).',
            'Añade textos, rectángulos, elipses, líneas o tus imágenes. Arrastra para colocarlos y usa las asas para cambiar el tamaño.',
            'Cambia letra, tamaño y colores en Propiedades. El contraste de cada texto se calcula al momento.',
            'Ordena las capas en Estructura: lo que está arriba en la lista se ve por encima.',
            'Mira la Revisión de lectura y exporta en Archivo.',
        ],
        'sections': [
            {'h': 'Jerarquía', 'p': 'Lo más importante, más grande y arriba. Un buen cartel tiene un título que se lee de lejos, un texto breve que lo explica y los datos prácticos (cuándo y dónde) fáciles de encontrar. Deja espacio vacío: ayuda a respirar.'},
            {'h': 'Contraste y legibilidad', 'p': 'Las pautas de accesibilidad web (WCAG 2.2, criterio 1.4.3) piden un contraste de al menos 4,5:1 entre texto y fondo, o 3:1 si la letra es grande (24 px, o 18,7 px en negrita). El estudio lo calcula para cada texto. Atkinson Hyperlegible es una letra diseñada para distinguir bien las letras parecidas.'},
            {'h': 'Lenguaje claro', 'p': 'Las pautas de lenguaje claro (ISO 24495-1) recomiendan frases cortas y palabras conocidas. La revisión te avisa si una frase pasa de 25 palabras. Para textos en Lectura Fácil formal existe otra norma (UNE 153101) y validación con personas lectoras.'},
            {'h': 'Pantalla o papel', 'p': 'El PNG normal sirve para pantallas. Para imprimir, usa el PNG a 3×: en A4 da unos 290 puntos por pulgada. El SVG guarda formas y textos editables e incluye las letras, así que se ve igual en otros programas.'},
        ],
        'links': [('Todo el taller', '/es/taller/'), ('Cómic', '/es/taller/comic/'), ('Color', '/es/taller/color/')],
    },
    'en': {
        'title': 'Graphic design',
        'description': 'Design posters, invitations, social posts and banners with text, shapes and images. Check contrast and readability, and export PNG for screen or print and SVG.',
        'lede': 'Good design is understood at a glance. Here you compose posters, cards and posts with a clear hierarchy, and the studio tells you if any text is hard to read.',
        'make': ['An invitation or card', 'An A4 poster for an event', 'A square or vertical social media post', 'A banner for a website', 'PNG for screens, 3× PNG for print and editable SVG'],
        'steps': [
            'Choose an example, or a format in Properties (with nothing selected).',
            'Add text, rectangles, ellipses, lines or your images. Drag to place them and use the handles to resize.',
            'Change typeface, size and colours in Properties. The contrast of each text is calculated instantly.',
            'Order the layers in Structure: what is higher in the list is shown on top.',
            'Look at the Readability check and export from File.',
        ],
        'sections': [
            {'h': 'Hierarchy', 'p': 'The most important thing goes biggest and at the top. A good poster has a title you can read from a distance, a short text that explains it and the practical details (when and where) easy to find. Leave empty space: it lets the design breathe.'},
            {'h': 'Contrast and readability', 'p': 'The web accessibility guidelines (WCAG 2.2, success criterion 1.4.3) ask for a contrast of at least 4.5:1 between text and background, or 3:1 for large text (24 px, or 18.7 px bold). The studio calculates it for each text. Atkinson Hyperlegible is a typeface designed to tell similar letters apart.'},
            {'h': 'Plain language', 'p': 'Plain-language guidance (ISO 24495-1) recommends short sentences and familiar words. The check warns you if a sentence is longer than 25 words. Formal Easy Read in Spain follows another standard (UNE 153101) and is validated with readers.'},
            {'h': 'Screen or paper', 'p': 'The normal PNG is for screens. For printing, use the 3× PNG: on A4 it gives about 290 dots per inch. The SVG keeps shapes and text editable and includes the typefaces, so it looks the same in other programs.'},
        ],
        'links': [('The whole workshop', '/en/workshop/'), ('Comics', '/en/workshop/comics-storyboarding/'), ('Colour', '/en/workshop/colour/')],
    },
}

STRINGS = {
    'es': {
        'stCard': 'Invitación de cumpleaños', 'stCardD': 'Una tarjeta alegre con título, mensaje y fecha.',
        'stPoster': 'Cartel de un taller', 'stPosterD': 'Un cartel A4 con título grande, explicación, datos y llamada a la acción.',
        'stPost': 'Publicación cuadrada', 'stPostD': 'Fondo oscuro, título amarillo y un mensaje breve.',
        'stBanner': 'Banner para una web', 'stBannerD': 'Formato ancho con texto a la izquierda, imagen a la derecha y un botón.',
        'sizeA4': 'Cartel A4', 'sizeCard': 'Tarjeta', 'sizeSquare': 'Publicación cuadrada', 'sizeStory': 'Vertical (historias)', 'sizeBanner': 'Banner', 'sizeSlide': 'Diapositiva 16:9',
        'svgTitle': 'Diseño · El taller de Iris Green',
        'exCardTitle': '¡Ven a mi cumple!', 'exCardBody': 'Habrá juegos, música y una tarta enorme.', 'exCardWhen': 'Sábado 14 · 17:00 · En el parque',
        'exPosterKicker': 'TALLER ABIERTO', 'exPosterTitle': 'Ciencia en la cocina',
        'exPosterBody': 'Hacemos experimentos con cosas de casa: volcanes, colores que cambian y cristales de sal. No hace falta saber nada. Trae ganas de probar.',
        'exPosterWhen': 'Jueves 10 de octubre, a las 18:00', 'exPosterWhere': 'Biblioteca del barrio, sala 2', 'exPosterCta': 'Entrada libre',
        'exPostTitle': 'Pequeños cambios', 'exPostBody': 'Apagar la luz al salir también cuenta.', 'exPostTag': '#energía #cadadía',
        'exBannerTitle': 'Aprende a programar jugando', 'exBannerBody': 'Retos cortos, bloques y código real. Empieza hoy, a tu ritmo.', 'exBannerCta': 'Empezar',
    },
    'en': {
        'stCard': 'Birthday invitation', 'stCardD': 'A cheerful card with a title, a message and the date.',
        'stPoster': 'Workshop poster', 'stPosterD': 'An A4 poster with a big title, an explanation, the details and a call to action.',
        'stPost': 'Square post', 'stPostD': 'Dark background, yellow title and a short message.',
        'stBanner': 'Website banner', 'stBannerD': 'A wide format with text on the left, an image on the right and a button.',
        'sizeA4': 'A4 poster', 'sizeCard': 'Card', 'sizeSquare': 'Square post', 'sizeStory': 'Vertical (stories)', 'sizeBanner': 'Banner', 'sizeSlide': '16:9 slide',
        'svgTitle': 'Design · Iris Green’s workshop',
        'exCardTitle': 'Come to my party!', 'exCardBody': 'There will be games, music and a huge cake.', 'exCardWhen': 'Saturday 14 · 5 pm · In the park',
        'exPosterKicker': 'OPEN WORKSHOP', 'exPosterTitle': 'Kitchen science',
        'exPosterBody': 'We do experiments with things from home: volcanoes, colours that change and salt crystals. You do not need to know anything. Just bring your curiosity.',
        'exPosterWhen': 'Thursday 10 October, 6 pm', 'exPosterWhere': 'Local library, room 2', 'exPosterCta': 'Free entry',
        'exPostTitle': 'Small changes', 'exPostBody': 'Switching off the light when you leave counts too.', 'exPostTag': '#energy #everyday',
        'exBannerTitle': 'Learn to code by playing', 'exBannerBody': 'Short challenges, blocks and real code. Start today, at your own pace.', 'exBannerCta': 'Start',
    },
}
for _l in ('es', 'en'):
    STRINGS[_l].update(lienzo_comun.STRINGS[_l])
assert set(STRINGS['es']) == set(STRINGS['en'])
