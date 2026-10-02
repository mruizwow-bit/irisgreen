"""Estudio de fotografía y composición (R43): series, encuadres, guías, luz y color, histograma,
hoja de contactos y aviso de metadatos Exif. Textos ES/EN.
Fuentes comprobadas:
- CIPA DC-008-2012 «Exchangeable image file format for digital still cameras: Exif Version 2.3»
  (CIPA y JEITA), https://www.cipa.jp/std/documents/e/DC-008-2012_E.pdf
- AEPD, «Los riesgos del "sharenting" en la vida de los menores», blog, 28-06-2024,
  https://www.aepd.es/prensa-y-comunicacion/blog/los-riesgos-del-sharenting-en-la-vida-de-los-menores
- Michael Freeman, «The Photographer's Eye: Composition and Design for Better Digital Photos»,
  Focal Press, 2007 (ISBN 978-0-240-80934-2)."""

ENGINE = 'fotografia'
SLUG = {'es': 'fotografia', 'en': 'photography-composition'}
SCRIPTS = ['ig-suite-fotografia.js']
STYLES = ['ig-suite-fotografia.css']
LIBRARIES = 'Canvas 2D del navegador, sin bibliotecas externas; lector de metadatos Exif propio'
LIBRARIES_EN = 'The browser’s Canvas 2D, no external libraries; Iris Green’s own Exif metadata reader'

PRACTICE_ES = {'landscape': 'Paisaje', 'stilllife': 'Bodegón', 'street': 'Calle', 'park': 'Parque', 'window': 'Ventana'}
PRACTICE_EN = {'landscape': 'Landscape', 'stilllife': 'Still life', 'street': 'Street', 'park': 'Park', 'window': 'Window'}
ALT_ES = {
    'landscape': 'Imagen de práctica: paisaje con cielo, sol, montañas, un árbol y un prado lleno de flores. El horizonte está un poco por debajo de la mitad.',
    'stilllife': 'Imagen de práctica: bodegón con un cuenco de frutas y una taza sobre una mesa de madera, con luz de ventana desde la derecha.',
    'street': 'Imagen de práctica: calle en perspectiva, con edificios a los lados, farolas y una carretera que se pierde en el centro.',
    'park': 'Imagen de práctica: parque con un árbol, una cometa en el cielo, una pelota en la hierba y un banco.',
    'window': 'Imagen de práctica: fachada con una ventana, dos contraventanas de color y una maceta con flores.',
}
ALT_EN = {
    'landscape': 'Practice image: landscape with sky, sun, mountains, a tree and a meadow full of flowers. The horizon sits a little below the middle.',
    'stilllife': 'Practice image: still life with a bowl of fruit and a cup on a wooden table, lit by a window on the right.',
    'street': 'Practice image: street in perspective, with buildings on both sides, street lamps and a road that vanishes in the centre.',
    'park': 'Practice image: park with a tree, a kite in the sky, a ball on the grass and a bench.',
    'window': 'Practice image: house front with a window, two coloured shutters and a flower pot.',
}
COLOUR_NAMES_ES = {'landscape': 'Prado de flores', 'stilllife': 'Limones', 'street': 'La puerta amarilla', 'park': 'Cometa', 'window': 'Contraventanas'}
COLOUR_NAMES_EN = {'landscape': 'Meadow of flowers', 'stilllife': 'Lemons', 'street': 'The yellow door', 'park': 'Kite', 'window': 'Shutters'}
GUIDES_ES = {'thirds': 'Tercios', 'phi': 'Rejilla áurea', 'spiral': 'Espiral áurea', 'diagonals': 'Diagonales', 'centre': 'Centro', 'none': 'Ninguna'}
GUIDES_EN = {'thirds': 'Thirds', 'phi': 'Golden grid', 'spiral': 'Golden spiral', 'diagonals': 'Diagonals', 'centre': 'Centre', 'none': 'None'}
GUIDE_HELP_ES = {
    'thirds': 'Regla de los tercios: dos líneas verticales y dos horizontales dividen la foto en nueve partes. Colocar lo importante en una línea o en un cruce suele dar una foto más viva que centrarlo.',
    'phi': 'Rejilla áurea: como los tercios, pero las líneas están en la proporción áurea (más o menos 0,38 y 0,62). Queda un poco más cerca del centro.',
    'spiral': 'Espiral áurea: una curva que se va cerrando. El ojo tiende a seguirla hasta su centro. Cambia su orientación para colocar ese centro donde está lo importante.',
    'diagonals': 'Diagonales: las líneas de esquina a esquina y sus perpendiculares. Sirven para alinear bordes, caminos o miradas y dar sensación de movimiento.',
    'centre': 'Centro: marca la mitad. Va bien para fotos simétricas o cuando quieres que algo se vea firme y quieto.',
    'none': 'Sin guías: mira la foto limpia.',
}
GUIDE_HELP_EN = {
    'thirds': 'Rule of thirds: two vertical and two horizontal lines split the photo into nine parts. Putting the important thing on a line or a crossing often gives a livelier photo than centring it.',
    'phi': 'Golden grid: like thirds, but the lines follow the golden ratio (about 0.38 and 0.62). It sits a little closer to the centre.',
    'spiral': 'Golden spiral: a curve that keeps closing in. The eye tends to follow it to its centre. Change its orientation to put that centre where the important thing is.',
    'diagonals': 'Diagonals: the corner-to-corner lines and their perpendiculars. Use them to line up edges, paths or gazes and to suggest movement.',
    'centre': 'Centre: marks the middle. Good for symmetrical photos or when you want something to look firm and still.',
    'none': 'No guides: look at the clean photo.',
}
ADJ_ES = {'exposure': 'Exposición', 'contrast': 'Contraste', 'highlights': 'Luces', 'shadows': 'Sombras', 'saturation': 'Saturación', 'temperature': 'Temperatura', 'tint': 'Matiz', 'vignette': 'Viñeta'}
ADJ_EN = {'exposure': 'Exposure', 'contrast': 'Contrast', 'highlights': 'Highlights', 'shadows': 'Shadows', 'saturation': 'Saturation', 'temperature': 'Temperature', 'tint': 'Tint', 'vignette': 'Vignette'}
HANDLES_ES = {'nw': 'Esquina superior izquierda del encuadre', 'n': 'Borde superior del encuadre', 'ne': 'Esquina superior derecha del encuadre', 'e': 'Borde derecho del encuadre',
              'se': 'Esquina inferior derecha del encuadre', 's': 'Borde inferior del encuadre', 'sw': 'Esquina inferior izquierda del encuadre', 'w': 'Borde izquierdo del encuadre'}
HANDLES_EN = {'nw': 'Top-left corner of the frame', 'n': 'Top edge of the frame', 'ne': 'Top-right corner of the frame', 'e': 'Right edge of the frame',
              'se': 'Bottom-right corner of the frame', 's': 'Bottom edge of the frame', 'sw': 'Bottom-left corner of the frame', 'w': 'Left edge of the frame'}
TEN_ES = ['Todo el bodegón', 'Cuenco al centro', 'Frutas de cerca', 'Vertical 4:5', 'Taza en vertical', 'Panorámica de la mesa', 'Detalle de una fruta', 'Diagonal inclinada', 'Taza en cuadrado', 'Blanco y negro']
TEN_EN = ['The whole still life', 'Bowl in the centre', 'Fruit up close', 'Vertical 4:5', 'Cup, vertical', 'Wide view of the table', 'Detail of one fruit', 'Tilted diagonal', 'Cup, square', 'Black and white']

PAGE = {
    'es': {
        'title': 'Fotografía y composición',
        'description': 'Abre tus fotos sin subirlas, encuádralas con proporciones y guías de composición, corrige la luz con el histograma y monta series con su hoja de contactos. Al exportar se borran los datos ocultos como la ubicación.',
        'lede': 'Encuadra, compón y corrige la luz de tus fotos o de las imágenes de práctica. Tus fotos no salen de tu dispositivo.',
        'make': ['Una serie de 5 fotos de un mismo color', 'La misma cosa en 10 encuadres distintos', 'Un retrato de un objeto con su fondo', 'Una foto oscura bien corregida con ayuda del histograma', 'Fotos en JPEG o PNG sin datos ocultos y una hoja de contactos en PNG'],
        'steps': [
            'Pulsa «Abrir foto…» y elige una foto de tu dispositivo, o añade una imagen de práctica desde Estructura. No se sube a ningún sitio. Si la foto lleva ubicación u otros datos ocultos, el estudio te avisa.',
            'Con Encuadre, mueve el rectángulo o sus asas, o escribe las medidas en Propiedades. Elige una proporción (1:1, 3:2, 4:5, 16:9…) y una guía de composición.',
            'En «Luz y color», ajusta exposición, contraste, luces, sombras y color. Mira el histograma y compara el antes y el después.',
            'Crea varias versiones de la misma foto con «Nueva versión»: cada una es un encuadre distinto. Así haces el reto de los 10 encuadres.',
            'Exporta en Archivo la foto en JPEG o PNG, sin metadatos, o la hoja de contactos de toda la serie.',
        ],
        'sections': [
            {'h': 'Tus fotos y tu privacidad', 'p': 'Las fotos que abres se quedan en esta pestaña: no se suben ni se guardan en el navegador, y el estudio no usa la cámara.\n\nMuchas fotos llevan datos ocultos (Exif): fecha, modelo del móvil y a veces la ubicación GPS. El estudio te avisa y, al exportar, esos datos desaparecen. Una foto con ubicación puede decir dónde vives o dónde estudias. Antes de compartir, pide permiso a quien sale.'},
            {'h': 'Componer', 'p': 'Encuadrar es decidir qué entra en la foto. La proporción es la forma del rectángulo: 1:1 es cuadrado, 4:5 y 9:16 son verticales y 16:9 es panorámica. Las guías (tercios, rejilla y espiral áureas, diagonales, centro) son formas de mirar, no reglas: prueba varias versiones y compáralas en la hoja de contactos.'},
            {'h': 'Luz e histograma', 'p': 'Un paso de exposición (1 EV) es el doble de luz. El histograma cuenta cuántos puntos hay de cada brillo, de negro (izquierda) a blanco (derecha). Si se amontonan en un borde, hay zonas sin detalle: sombras empastadas o luces quemadas. El estudio lo avisa y da una tabla con los porcentajes.'},
            {'h': 'Series y proyecto', 'p': 'Una serie tiene hasta 12 fotos y cada foto puede tener varias versiones. El proyecto guarda tus fotos dentro del archivo, reducidas a 1600 píxeles y sin metadatos, para no pasar de 8 MB.'},
            {'h': 'Fuentes', 'p': 'CIPA y JEITA. «CIPA DC-008-2012: Exchangeable image file format for digital still cameras: Exif Version 2.3». Camera & Imaging Products Association, 2012. cipa.jp.\n\nAgencia Española de Protección de Datos (AEPD). «Los riesgos del sharenting en la vida de los menores». Blog de la AEPD, 28 de junio de 2024. aepd.es.\n\nMichael Freeman. «The Photographer’s Eye: Composition and Design for Better Digital Photos». Focal Press, 2007.'},
        ],
        'links': [('Todo el taller', '/es/taller/'), ('Diseño gráfico', '/es/taller/diseno-grafico/'), ('Cómic', '/es/taller/comic/')],
    },
    'en': {
        'title': 'Photography and composition',
        'description': 'Open your photos without uploading them, frame them with aspect ratios and composition guides, fix the light with the histogram and build series with a contact sheet. Hidden data such as location is removed when you export.',
        'lede': 'Frame, compose and fix the light of your photos or the practice images. Your photos never leave your device.',
        'make': ['A series of five photos of one colour', 'The same subject in ten different framings', 'A portrait of an object and its background', 'A dark photo corrected with the help of the histogram', 'JPEG or PNG photos without hidden data, and a PNG contact sheet'],
        'steps': [
            'Press “Open photo…” and choose a photo from your device, or add a practice image from Structure. Nothing is uploaded. If the photo carries its location or other hidden data, the studio tells you.',
            'With Frame, move the rectangle or its handles, or type the measurements in Properties. Choose an aspect ratio (1:1, 3:2, 4:5, 16:9…) and a composition guide.',
            'In “Light and colour”, adjust exposure, contrast, highlights, shadows and colour. Check the histogram and compare before and after.',
            'Make several versions of the same photo with “New version”: each one is a different framing. That is how you do the ten-framings challenge.',
            'From File, export the photo as JPEG or PNG with no metadata, or the contact sheet for the whole series.',
        ],
        'sections': [
            {'h': 'Your photos and your privacy', 'p': 'The photos you open stay in this tab: they are not uploaded or stored in the browser, and the studio does not use the camera.\n\nMany photos carry hidden data (Exif): the date, the phone model and sometimes the GPS location. The studio warns you and, when you export, that data disappears. A photo with its location can tell people where you live or where you study. Before sharing, ask the people in it for permission.'},
            {'h': 'Composing', 'p': 'Framing means deciding what goes into the photo. The aspect ratio is the shape of the rectangle: 1:1 is square, 4:5 and 9:16 are vertical and 16:9 is widescreen. The guides (thirds, golden grid and spiral, diagonals, centre) are ways of looking, not rules: try several versions and compare them on the contact sheet.'},
            {'h': 'Light and the histogram', 'p': 'One stop of exposure (1 EV) is twice the light. The histogram counts how many points have each brightness, from black (left) to white (right). If they pile up at an edge, some areas have no detail: crushed shadows or blown highlights. The studio warns you and gives a table with the percentages.'},
            {'h': 'Series and project', 'p': 'A series holds up to 12 photos and each photo can have several versions. The project keeps your photos inside the file, reduced to 1600 pixels and without metadata, so it stays under 8 MB.'},
            {'h': 'Sources', 'p': 'CIPA and JEITA. “CIPA DC-008-2012: Exchangeable image file format for digital still cameras: Exif Version 2.3”. Camera & Imaging Products Association, 2012. cipa.jp.\n\nSpanish Data Protection Agency (AEPD). “Los riesgos del sharenting en la vida de los menores” (The risks of sharenting in children’s lives). AEPD blog, 28 June 2024. aepd.es.\n\nMichael Freeman. “The Photographer’s Eye: Composition and Design for Better Digital Photos”. Focal Press, 2007.'},
        ],
        'links': [('The whole workshop', '/en/workshop/'), ('Graphic design', '/en/workshop/graphic-design/'), ('Comics', '/en/workshop/comics-storyboarding/')],
    },
}

STRINGS = {
    'es': {
        'canvasLabel': 'Mesa de fotografía',
        'canvasHelp': 'Las flechas mueven el encuadre (más rápido con Mayús). Los corchetes [ y ] lo hacen más pequeño o más grande. R y Mayús + R enderezan medio grado. H y V voltean. G cambia de guía y B muestra el antes. Coma y punto cambian de versión; Re Pág y Av Pág, de foto. Cada asa del encuadre es un botón: con el foco en ella, las flechas mueven ese borde. También puedes tocar dos veces: una esquina y la contraria.',
        'kPhCrop': 'En el lienzo: flechas para mover el encuadre; [ y ] para cambiar su tamaño; R para enderezar',
        'kPhKeys': 'H y V voltean; G cambia la guía; B compara antes y después',
        'kPhPhotos': 'Coma y punto: versión anterior o siguiente; Re Pág y Av Pág: foto anterior o siguiente',
        'stColour': 'Serie de 5 fotos de un color', 'stColourD': 'Cinco imágenes de práctica con el amarillo como hilo. Reto del taller.',
        'stTen': 'La misma cosa en 10 encuadres', 'stTenD': 'Un bodegón con diez versiones: cerca, lejos, vertical, cuadrado… Reto del taller.',
        'stPlay': 'Juego de encuadres', 'stPlayD': 'Un parque de práctica y cuatro encargos: encuentra cada encuadre.',
        'stPortrait': 'Retrato de un objeto', 'stPortraitD': 'Un objeto y su fondo en formato 4:5, con viñeta y tres versiones.',
        'stLight': 'Corregir la luz con el histograma', 'stLightD': 'Un paisaje oscuro y frío para corregir mirando el histograma, y una versión de ejemplo.',
        'toolCrop': 'Encuadre', 'toolView': 'Resultado', 'toolSheet': 'Hoja de contactos',
        'openPhoto': 'Abrir foto…', 'addPractice': 'Añadir imagen de práctica', 'addPracticeShort': '+ Imagen de práctica…', 'compareBtn': 'Ver antes', 'newVersion': 'Nueva versión', 'delVersion': 'Borrar versión',
        'rotLeft': 'Girar −1°', 'rotRight': 'Girar +1°', 'swapRatio': 'Girar el encuadre', 'autoLight': 'Luz automática', 'resetLight': 'Quitar ajustes', 'resetCrop': 'Encuadre completo',
        'photoUp': 'Subir', 'photoDown': 'Bajar', 'delPhoto': 'Quitar foto', 'seriesProps': 'Propiedades de la serie',
        'seriesList': 'Serie ({n} de {max})', 'nVersions': '{n} v.', 'versionsOf': 'Versiones ({n})', 'versionN': 'Versión {n}',
        'versionOf': 'Versión {n} de {total}: {name}', 'selectedPhoto': 'Foto «{name}», {v}', 'deselectedSeries': 'Propiedades de la serie.',
        'versionsHint': 'Otro encuadre de la misma foto',
        'emptyStage': 'No hay fotos. Pulsa «Abrir foto…» o añade una imagen de práctica.', 'loadingPhoto': 'Preparando la foto…',
        'beforeBadge': 'Antes', 'afterBadge': 'Después',
        'secPhoto': 'Foto', 'secCrop': 'Encuadre', 'secGuides': 'Guías de composición', 'secLight': 'Luz y color', 'secCompare': 'Antes y después', 'secHist': 'Histograma',
        'photoName': 'Nombre de la foto', 'altText': 'Descripción de la foto', 'altHelp': 'Describe en una frase qué se ve. Sirve a quien no puede ver la imagen y aparece en la descripción del lienzo.',
        'myPhoto': 'Mi foto', 'photo': 'Foto',
        'metaFound': 'Esta foto lleva datos ocultos', 'metaNone': 'No hemos encontrado datos ocultos', 'metaGps': 'Ubicación GPS', 'metaDate': 'Fecha y hora de la foto',
        'metaModel': 'Marca o modelo de la cámara o del móvil', 'metaYes': 'sí', 'metaNo': 'no',
        'metaStripped': 'No mostramos ni guardamos estos datos. Al exportar se eliminan, y el proyecto guarda la foto sin ellos.',
        'practiceNote': 'Imagen de práctica', 'practiceNoMeta': 'La ha dibujado el taller con código. No lleva datos ocultos.',
        'privacyTitle': 'Tu foto y tu privacidad', 'privacyShort': 'Se queda en tu dispositivo',
        'privacyIntro': 'Esta foto lleva datos ocultos (Exif). El estudio no los envía a ningún sitio. Hemos encontrado:',
        'privacyGps': 'La ubicación GPS dice dónde se hizo la foto, con un error de pocos metros. Si la foto es de tu casa o de tu colegio, podría decir a cualquiera dónde vives o dónde estudias.',
        'privacyExport': 'Cuando exportes la foto desde el estudio, en JPEG o en PNG, estos datos ya no estarán: la foto se vuelve a dibujar y se guarda de nuevo sin ellos.',
        'understood': 'Entendido',
        'privacySeries': 'Las fotos que abres no salen de este dispositivo. Al exportar se eliminan la ubicación, la fecha y el modelo de cámara. Antes de compartir, piensa en quién sale en la foto y pide permiso.',
        'projectNote': 'El proyecto guarda tus fotos dentro del archivo, a {n} píxeles por el lado largo y sin metadatos. Si hay muchas, se reducen más para no pasar de 8 MB y te avisamos.',
        'savedPhotos': 'Proyecto guardado con {n} fotos tuyas ({mb} MB), sin metadatos.', 'savedReduced': 'Proyecto guardado con {n} fotos tuyas reducidas para no pasar de 8 MB ({mb} MB).',
        'versionName': 'Nombre de la versión', 'ratio': 'Proporción', 'ratioFree': 'Libre', 'width': 'Ancho', 'height': 'Alto', 'straighten': 'Enderezar',
        'flipH': 'Voltear horizontal', 'flipV': 'Voltear vertical', 'flippedH': 'Volteada en horizontal', 'flippedV': 'Volteada en vertical',
        'cropHelp': 'Al enderezar, el encuadre se hace un poco más pequeño para que no aparezcan esquinas vacías. Las medidas están en píxeles de la foto.',
        'cropNow': 'Encuadre de {w} × {h} píxeles ({ratio}), a {x} % del borde izquierdo y {y} % del superior.',
        'cropChanged': 'Encuadre cambiado', 'cropReset': 'Encuadre completo', 'ratioSet': 'Proporción {r}', 'ratioSwapped': 'Encuadre girado',
        'straightened': 'Enderezada {a}°', 'tapFirst': 'Primera esquina marcada. Toca la esquina contraria.', 'cancelled': 'Cancelado',
        'handleHelp': 'Flechas para mover este borde; Mayús para ir más rápido.',
        'guide': 'Guía', 'guideNow': 'Guía: {g}', 'spiralOrient': 'Orientación de la espiral', 'spiral_0': 'Centro abajo a la derecha', 'spiral_1': 'Centro abajo a la izquierda',
        'spiral_2': 'Centro arriba a la derecha', 'spiral_3': 'Centro arriba a la izquierda', 'guidesOnResult': 'Mostrar las guías también en el resultado',
        'bw': 'Blanco y negro', 'bwOn': 'Blanco y negro activado', 'bwOff': 'Color recuperado',
        'lightHelp': 'Un paso de exposición (1 EV) es el doble de luz o la mitad. Temperatura: cálida (+) o fría (−). Matiz: magenta (+) o verde (−). Viñeta: bordes más oscuros (+) o más claros (−).',
        'adjChanged': '{what} cambiada', 'adjDone': 'Ajuste aplicado', 'autoDone': 'Luz automática aplicada. Revisa el histograma y afina a tu gusto.', 'lightReset': 'Ajustes de luz y color quitados',
        'compareLabel': 'Ver', 'compare_after': 'Después', 'compare_before': 'Antes', 'compare_split': 'Antes y después a la vez', 'splitPos': 'Línea de separación',
        'compareHelp': '«Antes» es el mismo encuadre sin los ajustes de luz y color. «A la vez» muestra el antes a la izquierda y el después a la derecha; mueve la línea con el control, sin arrastrar.',
        'histWarn': 'Hay zonas sin detalle', 'histOk': 'Sin zonas quemadas ni empastadas',
        'histLo': 'Sombras empastadas: {p} % de la foto es negro sin detalle.', 'histHi': 'Luces quemadas: {p} % de la foto es blanco sin detalle.', 'histMean': 'Brillo medio: {p} %.',
        'histTable': 'Porcentaje de píxeles por zona de brillo', 'histTableShow': 'Ver la tabla del histograma', 'zone': 'Zona', 'lum': 'Brillo',
        'zone_0': 'Negros', 'zone_1': 'Sombras', 'zone_2': 'Medios', 'zone_3': 'Luces', 'zone_4': 'Blancos',
        'showClip': 'Marcar zonas quemadas (rosa) y empastadas (azul)',
        'histHelp': 'Izquierda: oscuros. Derecha: claros. La zona gris es el brillo; las líneas de color, los canales rojo, verde y azul.',
        'seriesTitle': 'Título de la serie', 'seriesDefault': 'Serie sin título', 'seriesColour': 'Color de la serie', 'useTheme': 'Usar este color en las imágenes de práctica nuevas',
        'colourChanged': 'Color cambiado', 'changed': 'Cambiado', 'renamed': 'Nombre cambiado', 'altChanged': 'Descripción cambiada',
        'challenges': 'Retos', 'ch1': 'Serie de 5 fotos de un color.', 'ch1State': 'Fotos con al menos un 8 % de ese color: {n} de 5.',
        'ch2': 'La misma cosa en 10 encuadres.', 'ch2State': 'La foto con más versiones tiene {n} de 10.',
        'colourTable': 'Cuánto color de la serie hay en cada foto', 'colourShare': 'Color de la serie',
        'colourHelp': 'El estudio cuenta los puntos de cada encuadre con un tono parecido al color de la serie. Es orientativo: tu mirada decide.',
        'sheetTitle': 'Hoja de contactos', 'sheetMode': 'Qué entra', 'sheet_photos': 'Una por foto', 'sheet_versions': 'Todas las versiones',
        'sheetBg': 'Fondo', 'sheet_light': 'Claro', 'sheet_dark': 'Oscuro', 'viewSheet': 'Ver la hoja de contactos',
        'photoAdded': 'Añadida: {name}', 'photoMoved': 'Foto movida al puesto {n}', 'deletedWhat': 'Quitado: {name}', 'versionAdded': 'Nueva versión: {name}',
        'lastVersion': 'Cada foto tiene que tener al menos una versión.', 'maxVersions': 'Máximo {n} versiones por foto.', 'maxPhotos': 'Una serie puede tener hasta {n} fotos.',
        'photoTooBig': 'La foto es demasiado grande (máximo 40 MB).', 'photoError': 'No se ha podido abrir esa imagen. Prueba con una foto JPEG, PNG o WebP.',
        'exportJpg': 'Exportar foto (JPEG, sin metadatos)', 'exportPng': 'Exportar foto (PNG, sin metadatos)', 'exportSheet': 'Exportar hoja de contactos (PNG)',
        'exportError': 'No se ha podido exportar. Inténtalo de nuevo.', 'exportedClean': 'Foto exportada sin ubicación, fecha ni modelo de cámara.',
        'summaryBase': 'Serie «{title}» con {n} fotos. Foto {i}: «{name}», versión {vi} de {vn}, «{v}».', 'summaryAlt': 'Se ve: {alt}',
        'summaryAdj': 'Ajustes: {list}.', 'summaryNoAdj': 'Sin ajustes de luz y color.', 'summarySheet': 'Hoja de contactos de «{title}» con {n} imágenes:',
        'exColourTitle': 'Amarillo', 'exTenTitle': 'Un bodegón, diez miradas', 'exTenPhoto': 'Bodegón',
        'exPlayTitle': 'Juego de encuadres', 'exPlayPhoto': 'Parque', 'exPlayPhoto2': 'Ventana',
        'exPlay_0': 'Encargo 1: todo el parque', 'exPlay_1': 'Encargo 2: solo la cometa', 'exPlay_2': 'Encargo 3: la pelota en un tercio', 'exPlay_3': 'Encargo 4: el árbol en vertical',
        'exPortraitTitle': 'Retrato de un objeto', 'exPortraitPhoto': 'Frutas', 'exPortrait_0': 'Objeto y fondo', 'exPortrait_1': 'Con mucho aire', 'exPortrait_2': 'Detalle apagado',
        'exLightTitle': 'Corregir la luz', 'exLightPhoto': 'Paisaje oscuro', 'exLight_0': 'Sin corregir', 'exLight_1': 'Corregida (ejemplo)', 'exLightPhoto2': 'Calle',
    },
    'en': {
        'canvasLabel': 'Photography table',
        'canvasHelp': 'The arrow keys move the frame (faster with Shift). The brackets [ and ] make it smaller or larger. R and Shift + R straighten by half a degree. H and V flip. G changes the guide and B shows the before. Comma and full stop change version; Page Up and Page Down change photo. Each frame handle is a button: with focus on it, the arrow keys move that edge. You can also tap twice: one corner and then the opposite one.',
        'kPhCrop': 'On the canvas: arrow keys to move the frame; [ and ] to resize it; R to straighten',
        'kPhKeys': 'H and V flip; G changes the guide; B compares before and after',
        'kPhPhotos': 'Comma and full stop: previous or next version; Page Up and Page Down: previous or next photo',
        'stColour': 'Series of five photos of one colour', 'stColourD': 'Five practice images tied together by yellow. A workshop challenge.',
        'stTen': 'The same subject in ten framings', 'stTenD': 'A still life with ten versions: close, far, vertical, square… A workshop challenge.',
        'stPlay': 'Framing game', 'stPlayD': 'A practice park and four tasks: find each framing.',
        'stPortrait': 'Portrait of an object', 'stPortraitD': 'An object and its background in 4:5, with a vignette and three versions.',
        'stLight': 'Fix the light with the histogram', 'stLightD': 'A dark, cold landscape to correct by reading the histogram, plus an example version.',
        'toolCrop': 'Frame', 'toolView': 'Result', 'toolSheet': 'Contact sheet',
        'openPhoto': 'Open photo…', 'addPractice': 'Add a practice image', 'addPracticeShort': '+ Practice image…', 'compareBtn': 'Show before', 'newVersion': 'New version', 'delVersion': 'Delete version',
        'rotLeft': 'Rotate −1°', 'rotRight': 'Rotate +1°', 'swapRatio': 'Turn the frame', 'autoLight': 'Auto light', 'resetLight': 'Clear adjustments', 'resetCrop': 'Full frame',
        'photoUp': 'Move up', 'photoDown': 'Move down', 'delPhoto': 'Remove photo', 'seriesProps': 'Series properties',
        'seriesList': 'Series ({n} of {max})', 'nVersions': '{n} v.', 'versionsOf': 'Versions ({n})', 'versionN': 'Version {n}',
        'versionOf': 'Version {n} of {total}: {name}', 'selectedPhoto': 'Photo “{name}”, {v}', 'deselectedSeries': 'Series properties.',
        'versionsHint': 'Another framing of the same photo',
        'emptyStage': 'There are no photos. Press “Open photo…” or add a practice image.', 'loadingPhoto': 'Getting the photo ready…',
        'beforeBadge': 'Before', 'afterBadge': 'After',
        'secPhoto': 'Photo', 'secCrop': 'Frame', 'secGuides': 'Composition guides', 'secLight': 'Light and colour', 'secCompare': 'Before and after', 'secHist': 'Histogram',
        'photoName': 'Photo name', 'altText': 'Photo description', 'altHelp': 'Describe what can be seen in one sentence. It helps people who cannot see the image and appears in the canvas description.',
        'myPhoto': 'My photo', 'photo': 'Photo',
        'metaFound': 'This photo carries hidden data', 'metaNone': 'We found no hidden data', 'metaGps': 'GPS location', 'metaDate': 'Date and time of the photo',
        'metaModel': 'Camera or phone make or model', 'metaYes': 'yes', 'metaNo': 'no',
        'metaStripped': 'We do not show or keep this data. It is removed when you export, and the project stores the photo without it.',
        'practiceNote': 'Practice image', 'practiceNoMeta': 'The workshop drew it with code. It carries no hidden data.',
        'privacyTitle': 'Your photo and your privacy', 'privacyShort': 'It stays on your device',
        'privacyIntro': 'This photo carries hidden data (Exif). The studio does not send it anywhere. We found:',
        'privacyGps': 'The GPS location says where the photo was taken, to within a few metres. If the photo is of your home or your school, it could tell anyone where you live or where you study.',
        'privacyExport': 'When you export the photo from the studio, as JPEG or PNG, this data will be gone: the photo is redrawn and saved again without it.',
        'understood': 'Got it',
        'privacySeries': 'The photos you open never leave this device. Exporting removes the location, the date and the camera model. Before sharing, think about who is in the photo and ask for permission.',
        'projectNote': 'The project keeps your photos inside the file, at {n} pixels on the long side and without metadata. If there are many, they are reduced further to stay under 8 MB and we tell you.',
        'savedPhotos': 'Project saved with {n} of your photos ({mb} MB), without metadata.', 'savedReduced': 'Project saved with {n} of your photos, reduced to stay under 8 MB ({mb} MB).',
        'versionName': 'Version name', 'ratio': 'Aspect ratio', 'ratioFree': 'Free', 'width': 'Width', 'height': 'Height', 'straighten': 'Straighten',
        'flipH': 'Flip horizontally', 'flipV': 'Flip vertically', 'flippedH': 'Flipped horizontally', 'flippedV': 'Flipped vertically',
        'cropHelp': 'When you straighten, the frame gets a little smaller so no empty corners appear. Measurements are in pixels of the photo.',
        'cropNow': 'Frame of {w} × {h} pixels ({ratio}), {x}% from the left edge and {y}% from the top.',
        'cropChanged': 'Frame changed', 'cropReset': 'Full frame', 'ratioSet': 'Aspect ratio {r}', 'ratioSwapped': 'Frame turned',
        'straightened': 'Straightened {a}°', 'tapFirst': 'First corner marked. Tap the opposite corner.', 'cancelled': 'Cancelled',
        'handleHelp': 'Arrow keys move this edge; Shift makes it faster.',
        'guide': 'Guide', 'guideNow': 'Guide: {g}', 'spiralOrient': 'Spiral orientation', 'spiral_0': 'Centre bottom right', 'spiral_1': 'Centre bottom left',
        'spiral_2': 'Centre top right', 'spiral_3': 'Centre top left', 'guidesOnResult': 'Show the guides on the result too',
        'bw': 'Black and white', 'bwOn': 'Black and white on', 'bwOff': 'Colour back',
        'lightHelp': 'One stop of exposure (1 EV) is double or half the light. Temperature: warm (+) or cool (−). Tint: magenta (+) or green (−). Vignette: darker edges (+) or lighter edges (−).',
        'adjChanged': '{what} changed', 'adjDone': 'Adjustment applied', 'autoDone': 'Auto light applied. Check the histogram and fine-tune it to your taste.', 'lightReset': 'Light and colour adjustments cleared',
        'compareLabel': 'Show', 'compare_after': 'After', 'compare_before': 'Before', 'compare_split': 'Before and after together', 'splitPos': 'Dividing line',
        'compareHelp': '“Before” is the same frame without the light and colour adjustments. “Together” shows before on the left and after on the right; move the line with the control, no dragging needed.',
        'histWarn': 'Some areas have no detail', 'histOk': 'No blown highlights or crushed shadows',
        'histLo': 'Crushed shadows: {p}% of the photo is black with no detail.', 'histHi': 'Blown highlights: {p}% of the photo is white with no detail.', 'histMean': 'Average brightness: {p}%.',
        'histTable': 'Percentage of pixels in each brightness zone', 'histTableShow': 'Show the histogram table', 'zone': 'Zone', 'lum': 'Brightness',
        'zone_0': 'Blacks', 'zone_1': 'Shadows', 'zone_2': 'Midtones', 'zone_3': 'Highlights', 'zone_4': 'Whites',
        'showClip': 'Mark blown (pink) and crushed (blue) areas',
        'histHelp': 'Left: darks. Right: lights. The grey area is brightness; the coloured lines are the red, green and blue channels.',
        'seriesTitle': 'Series title', 'seriesDefault': 'Untitled series', 'seriesColour': 'Series colour', 'useTheme': 'Use this colour in new practice images',
        'colourChanged': 'Colour changed', 'changed': 'Changed', 'renamed': 'Name changed', 'altChanged': 'Description changed',
        'challenges': 'Challenges', 'ch1': 'Series of five photos of one colour.', 'ch1State': 'Photos with at least 8% of that colour: {n} of 5.',
        'ch2': 'The same subject in ten framings.', 'ch2State': 'The photo with most versions has {n} of 10.',
        'colourTable': 'How much of the series colour each photo has', 'colourShare': 'Series colour',
        'colourHelp': 'The studio counts the points in each frame with a hue close to the series colour. It is only a guide: your eye decides.',
        'sheetTitle': 'Contact sheet', 'sheetMode': 'What goes in', 'sheet_photos': 'One per photo', 'sheet_versions': 'Every version',
        'sheetBg': 'Background', 'sheet_light': 'Light', 'sheet_dark': 'Dark', 'viewSheet': 'Show the contact sheet',
        'photoAdded': 'Added: {name}', 'photoMoved': 'Photo moved to position {n}', 'deletedWhat': 'Removed: {name}', 'versionAdded': 'New version: {name}',
        'lastVersion': 'Each photo needs at least one version.', 'maxVersions': 'Up to {n} versions per photo.', 'maxPhotos': 'A series can have up to {n} photos.',
        'photoTooBig': 'The photo is too large (40 MB maximum).', 'photoError': 'That image could not be opened. Try a JPEG, PNG or WebP photo.',
        'exportJpg': 'Export photo (JPEG, no metadata)', 'exportPng': 'Export photo (PNG, no metadata)', 'exportSheet': 'Export contact sheet (PNG)',
        'exportError': 'Could not export. Please try again.', 'exportedClean': 'Photo exported without location, date or camera model.',
        'summaryBase': 'Series “{title}” with {n} photos. Photo {i}: “{name}”, version {vi} of {vn}, “{v}”.', 'summaryAlt': 'It shows: {alt}',
        'summaryAdj': 'Adjustments: {list}.', 'summaryNoAdj': 'No light or colour adjustments.', 'summarySheet': 'Contact sheet for “{title}” with {n} images:',
        'exColourTitle': 'Yellow', 'exTenTitle': 'One still life, ten ways of seeing', 'exTenPhoto': 'Still life',
        'exPlayTitle': 'Framing game', 'exPlayPhoto': 'Park', 'exPlayPhoto2': 'Window',
        'exPlay_0': 'Task 1: the whole park', 'exPlay_1': 'Task 2: just the kite', 'exPlay_2': 'Task 3: the ball on a third', 'exPlay_3': 'Task 4: the tree, vertical',
        'exPortraitTitle': 'Portrait of an object', 'exPortraitPhoto': 'Fruit', 'exPortrait_0': 'Object and background', 'exPortrait_1': 'Plenty of space', 'exPortrait_2': 'Muted detail',
        'exLightTitle': 'Fixing the light', 'exLightPhoto': 'Dark landscape', 'exLight_0': 'Not corrected', 'exLight_1': 'Corrected (example)', 'exLightPhoto2': 'Street',
    },
}
for _k in PRACTICE_ES:
    STRINGS['es']['pr_' + _k] = PRACTICE_ES[_k]
    STRINGS['en']['pr_' + _k] = PRACTICE_EN[_k]
    STRINGS['es']['prAlt_' + _k] = ALT_ES[_k]
    STRINGS['en']['prAlt_' + _k] = ALT_EN[_k]
    STRINGS['es']['exColourN_' + _k] = COLOUR_NAMES_ES[_k]
    STRINGS['en']['exColourN_' + _k] = COLOUR_NAMES_EN[_k]
for _k in GUIDES_ES:
    STRINGS['es']['guide_' + _k] = GUIDES_ES[_k]
    STRINGS['en']['guide_' + _k] = GUIDES_EN[_k]
    STRINGS['es']['guideHelp_' + _k] = GUIDE_HELP_ES[_k]
    STRINGS['en']['guideHelp_' + _k] = GUIDE_HELP_EN[_k]
for _k in ADJ_ES:
    STRINGS['es']['adj_' + _k] = ADJ_ES[_k]
    STRINGS['en']['adj_' + _k] = ADJ_EN[_k]
for _k in HANDLES_ES:
    STRINGS['es']['handle_' + _k] = HANDLES_ES[_k]
    STRINGS['en']['handle_' + _k] = HANDLES_EN[_k]
for _i, (_es, _en) in enumerate(zip(TEN_ES, TEN_EN)):
    STRINGS['es']['exTen_%d' % _i] = _es
    STRINGS['en']['exTen_%d' % _i] = _en

assert set(STRINGS['es']) == set(STRINGS['en'])
assert set(PAGE['es']) == set(PAGE['en'])
assert len(PAGE['es']['sections']) == len(PAGE['en']['sections'])
