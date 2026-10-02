"""Estudio de moda y textil (R43): estampados con repetición, prendas planas, colección y patronaje
de una bolsa tote a escala 1:1 impresa en A4. Textos ES/EN.
Fuentes comprobadas:
- Peter Phillips y Gillian Bunce, «Repeat Patterns: A Manual for Designers, Artists and Architects»,
  Thames & Hudson, 1993 (ISBN 978-0-500-27687-7).
- Alex Russell, «The Fundamentals of Printed Textile Design», 2.ª ed., Bloomsbury, 2021.
No se citan normas de tallas: el estudio no trabaja con tallas del cuerpo."""

ENGINE = 'moda'
SLUG = {'es': 'moda-textil', 'en': 'fashion-textiles'}
SCRIPTS = ['ig-suite-moda.js']
STYLES = ['ig-suite-moda.css']
LIBRARIES = 'SVG propio del taller, sin bibliotecas externas; impresión a escala con el diálogo del navegador'
LIBRARIES_EN = 'Iris Green’s own SVG, no external libraries; true-scale printing through the browser’s print dialogue'

SHAPES_ES = {'circle': 'Círculo', 'rect': 'Rectángulo', 'triangle': 'Triángulo', 'diamond': 'Rombo', 'star': 'Estrella', 'leaf': 'Hoja', 'drop': 'Gota',
             'heart': 'Corazón', 'ring': 'Aro', 'line': 'Línea', 'wave': 'Onda', 'zigzag': 'Zigzag', 'pen': 'Trazo a mano'}
SHAPES_EN = {'circle': 'Circle', 'rect': 'Rectangle', 'triangle': 'Triangle', 'diamond': 'Diamond', 'star': 'Star', 'leaf': 'Leaf', 'drop': 'Drop',
             'heart': 'Heart', 'ring': 'Ring', 'line': 'Line', 'wave': 'Wave', 'zigzag': 'Zigzag', 'pen': 'Freehand stroke'}
KINDS_ES = {'tshirt': 'Camiseta', 'hoodie': 'Sudadera', 'skirt': 'Falda', 'dress': 'Vestido', 'trousers': 'Pantalón', 'tote': 'Bolsa tote', 'beanie': 'Gorro', 'jacket': 'Chaqueta'}
KINDS_EN = {'tshirt': 'T-shirt', 'hoodie': 'Hoodie', 'skirt': 'Skirt', 'dress': 'Dress', 'trousers': 'Trousers', 'tote': 'Tote bag', 'beanie': 'Beanie', 'jacket': 'Jacket'}
ZONES_ES = {'body': 'Cuerpo', 'sleeves': 'Mangas', 'neck': 'Cuello', 'pocket': 'Bolsillo', 'hood': 'Capucha', 'rib': 'Puños y bajo', 'waistband': 'Cinturilla',
            'hem': 'Bajo', 'bodice': 'Cuerpo de arriba', 'skirt': 'Falda', 'belt': 'Cinturón', 'legs': 'Perneras', 'cuffs': 'Vueltas', 'handles': 'Asas',
            'crown': 'Copa', 'brim': 'Vuelta', 'pompom': 'Pompón', 'collar': 'Solapas'}
ZONES_EN = {'body': 'Body', 'sleeves': 'Sleeves', 'neck': 'Neckband', 'pocket': 'Pocket', 'hood': 'Hood', 'rib': 'Cuffs and hem band', 'waistband': 'Waistband',
            'hem': 'Hem', 'bodice': 'Bodice', 'skirt': 'Skirt', 'belt': 'Belt', 'legs': 'Legs', 'cuffs': 'Turn-ups', 'handles': 'Handles',
            'crown': 'Crown', 'brim': 'Brim', 'pompom': 'Pompom', 'collar': 'Lapels'}
REP_ES = {'straight': 'Recta', 'halfdrop': 'Media gota', 'brick': 'Ladrillo', 'mirror': 'Espejo'}
REP_EN = {'straight': 'Straight', 'halfdrop': 'Half-drop', 'brick': 'Brick', 'mirror': 'Mirror'}
REP_HELP_ES = {
    'straight': 'Recta: el motivo se repite en filas y columnas, como una cuadrícula.',
    'halfdrop': 'Media gota: cada columna baja medio motivo respecto a la anterior. Disimula las filas y queda más natural.',
    'brick': 'Ladrillo: cada fila se desplaza medio motivo hacia un lado, como los ladrillos de una pared.',
    'mirror': 'Espejo: el motivo se refleja a derecha e izquierda y arriba y abajo. Crea formas simétricas nuevas.',
}
REP_HELP_EN = {
    'straight': 'Straight: the motif repeats in rows and columns, like a grid.',
    'halfdrop': 'Half-drop: each column drops half a motif from the one before. It hides the rows and looks more natural.',
    'brick': 'Brick: each row shifts half a motif sideways, like the bricks in a wall.',
    'mirror': 'Mirror: the motif is reflected left and right and up and down. It makes new symmetrical shapes.',
}
PRESETS_ES = {'blank': 'Estampado vacío', 'dots': 'Lunares', 'stripes': 'Rayas', 'grid': 'Cuadros vichy', 'leaves': 'Hojas', 'waves': 'Ondas', 'mine': 'Mi motivo'}
PRESETS_EN = {'blank': 'Empty print', 'dots': 'Polka dots', 'stripes': 'Stripes', 'grid': 'Gingham', 'leaves': 'Leaves', 'waves': 'Waves', 'mine': 'My motif'}
CW_ES = {'navy': 'Marino', 'rose': 'Rosa', 'night': 'Noche', 'lemon': 'Limón', 'sea': 'Mar', 'red': 'Rojo', 'garden': 'Jardín', 'terracotta': 'Terracota', 'mono': 'Blanco y negro', 'canvas': 'Lona'}
CW_EN = {'navy': 'Navy', 'rose': 'Rose', 'night': 'Night', 'lemon': 'Lemon', 'sea': 'Sea', 'red': 'Red', 'garden': 'Garden', 'terracotta': 'Terracotta', 'mono': 'Black and white', 'canvas': 'Canvas'}

PAGE = {
    'es': {
        'title': 'Moda y textil',
        'description': 'Diseña estampados con repetición recta, media gota, ladrillo o espejo, vístelos en camisetas, sudaderas, faldas y más, monta una colección y saca el patrón real de una bolsa tote en hojas A4.',
        'lede': 'Diseña un estampado, póntelo en una prenda y reúne tus prendas en una colección. Con el patrón de la bolsa tote puedes coserla de verdad.',
        'make': ['Un estampado con un motivo propio', 'Una colección de 5 prendas con su línea', 'Hasta 4 combinaciones de color del mismo estampado', 'El patrón de una bolsa tote a tamaño real, en hojas A4'],
        'steps': [
            'En Motivo, añade formas con «Añadir forma» y cámbialas en Propiedades o con el teclado.',
            'En Repetición, elige cómo se repite y mira la tela en grande. La escala es el tamaño real del motivo en centímetros.',
            'En Prenda, toca una zona (cuerpo, mangas, cuello…) y rellénala de color o de estampado.',
            'En Colección, ve todos tus looks juntos. Añade looks desde Estructura (hasta 8).',
            'En Patronaje, pon las medidas de la bolsa y pulsa «Imprimir patrón (A4)».',
        ],
        'sections': [
            {'h': 'Repeticiones', 'p': 'Un estampado es un motivo que se repite. El cuadrado discontinuo es el azulejo: lo que sale por un borde vuelve a entrar por el contrario, así no se ve la unión. Recta, media gota, ladrillo y espejo cambian cómo se colocan las copias. Una combinación de color (en inglés, colourway) es el mismo dibujo con otros colores.'},
            {'h': 'Prendas y colección', 'p': 'Las prendas son dibujos técnicos planos, de frente y de espalda, como los que usan los talleres de confección. Cada zona se rellena por separado. La línea de la colección pone todos los looks de frente con su nombre.'},
            {'h': 'Patrón de la bolsa: comprueba la escala', 'p': 'Imprime al 100 % o «Tamaño real», nunca «Ajustar a la página». En la primera hoja con piezas hay un cuadrado de prueba: mide 5 cm por cada lado. Si no mide 5 cm, cambia la escala de impresión y vuelve a imprimir. Luego recorta el margen blanco y une las hojas haciendo coincidir los triángulos morados y las letras (A1, A2, B1…). La línea continua es el corte; la discontinua, la costura.'},
            {'h': 'Fuentes', 'p': 'Peter Phillips y Gillian Bunce. «Repeat Patterns: A Manual for Designers, Artists and Architects». Thames & Hudson, 1993.\n\nAlex Russell. «The Fundamentals of Printed Textile Design». 2.ª edición. Bloomsbury, 2021.'},
        ],
        'links': [('Todo el taller', '/es/taller/'), ('Patrones y arte generativo', '/es/taller/patrones/'), ('Diseño gráfico', '/es/taller/diseno-grafico/')],
    },
    'en': {
        'title': 'Fashion and textiles',
        'description': 'Design prints with straight, half-drop, brick or mirror repeats, put them on T-shirts, hoodies, skirts and more, build a collection and print a real tote bag pattern on A4 sheets.',
        'lede': 'Design a print, put it on a garment and gather your garments into a collection. With the tote bag pattern you can really sew it.',
        'make': ['A print made from your own motif', 'A collection of five garments with its line-up', 'Up to four colourways of the same print', 'A full-size tote bag pattern on A4 sheets'],
        'steps': [
            'In Motif, add shapes with “Add shape” and change them in Properties or with the keyboard.',
            'In Repeat, choose how it repeats and see the fabric big. The scale is the real size of the motif in centimetres.',
            'In Garment, tap an area (body, sleeves, neckband…) and fill it with a colour or a print.',
            'In Collection, see all your looks together. Add looks from Structure (up to 8).',
            'In Pattern, set the bag measurements and press “Print pattern (A4)”.',
        ],
        'sections': [
            {'h': 'Repeats', 'p': 'A print is a motif that repeats. The dashed square is the tile: whatever leaves one edge comes back in on the opposite one, so the join does not show. Straight, half-drop, brick and mirror change how the copies are placed. A colourway is the same design in other colours.'},
            {'h': 'Garments and collection', 'p': 'The garments are flat technical drawings, front and back, like the ones clothing makers use. Each area is filled separately. The collection line-up shows every look from the front with its name.'},
            {'h': 'Tote pattern: check the scale', 'p': 'Print at 100% or “Actual size”, never “Fit to page”. The first sheet with pieces has a test square: it measures 5 cm on each side. If it does not, change the print scale and print again. Then trim the white margin and join the sheets by matching the purple triangles and the letters (A1, A2, B1…). The solid line is the cutting line; the dashed one is the stitching line.'},
            {'h': 'Sources', 'p': 'Peter Phillips and Gillian Bunce. “Repeat Patterns: A Manual for Designers, Artists and Architects”. Thames & Hudson, 1993.\n\nAlex Russell. “The Fundamentals of Printed Textile Design”. 2nd edition. Bloomsbury, 2021.'},
        ],
        'links': [('The whole workshop', '/en/workshop/'), ('Patterns and generative art', '/en/workshop/patterns-generative-art/'), ('Graphic design', '/en/workshop/graphic-design/')],
    },
}

STRINGS = {
    'es': {
        'canvasLabel': 'Mesa de diseño textil',
        'canvasHelp': 'En Motivo: punto y coma eligen forma, las flechas la mueven (más con Mayús), [ y ] cambian su tamaño, R la gira, C cambia su color, D la duplica, Supr la borra e Intro añade la forma elegida. En Prenda, las flechas eligen zona. En Colección, eligen look. En Repetición, cambian la combinación de color.',
        'kModMotif': 'Motivo: punto y coma eligen forma; flechas la mueven; [ y ] tamaño; R gira; C color; D duplica',
        'kModGarment': 'Prenda y Colección: flechas para elegir zona o look',
        'stMotif': 'Estampado con un motivo', 'stMotifD': 'Un motivo de hojas en media gota, con tres combinaciones de color. Reto del taller.',
        'stDots': 'Camiseta de lunares', 'stDotsD': 'Una camiseta con estampado de lunares y mangas de color.',
        'stHoodie': 'Sudadera con motivo propio', 'stHoodieD': 'Un motivo de estrella y zigzag en ladrillo, en una sudadera y un gorro.',
        'stCapsule': 'Colección cápsula de 5 prendas', 'stCapsuleD': 'Cinco prendas que combinan entre sí, con tres estampados. Reto del taller.',
        'stTote': 'Bolsa tote para imprimir', 'stToteD': 'El patrón real de una bolsa, a escala 1:1 en hojas A4, listo para coser.',
        'toolMotif': 'Motivo', 'toolRepeat': 'Repetición', 'toolGarment': 'Prenda', 'toolLine': 'Colección', 'toolPattern': 'Patronaje',
        'shapeKind': 'Forma', 'addShape': 'Añadir forma', 'penBtn': 'Trazo a mano', 'penOn': 'Trazo a mano activado: dibuja en el azulejo. Con lápiz, la presión cambia el grosor.', 'penOff': 'Trazo a mano desactivado',
        'duplicate': 'Duplicar', 'duplicated': 'Duplicado', 'deleteBtn': 'Borrar', 'deleted': 'Borrado: {what}', 'added': 'Añadido: {what}', 'moved': 'Movido', 'resized': 'Tamaño cambiado', 'rotated': 'Girado',
        'changed': 'Cambiado', 'renamed': 'Nombre cambiado', 'colourChanged': 'Color cambiado', 'selected': 'Elegido: {name}', 'deselected': 'Nada elegido.',
        'toFront': 'Al frente', 'toBack': 'Al fondo', 'toFrontDone': 'Forma al frente', 'toBackDone': 'Forma al fondo',
        'noPrints': 'No hay estampados. Añade uno desde Estructura.', 'noLooks': 'No hay prendas. Añade un look desde Estructura.',
        'printsList': 'Estampados ({n} de {max})', 'newPrint': 'Nuevo estampado', 'newPrintShort': '+ Nuevo estampado…', 'dupPrint': 'Duplicar', 'delPrint': 'Borrar',
        'printAdded': 'Estampado añadido: {name}', 'printSel': 'Estampado: {name}', 'copyOf': '{name} (copia)', 'maxPrints': 'Hasta {n} estampados por proyecto.',
        'shapesList': 'Formas del motivo ({n})', 'shapesHelp': 'La de arriba se dibuja encima. Toca una forma o elígela aquí.', 'maxShapes': 'Hasta {n} formas por motivo.',
        'looksList': 'Colección ({n} de {max})', 'newLook': 'Nuevo look', 'newLookShort': '+ Nuevo look…', 'dupLook': 'Duplicar', 'delLook': 'Borrar', 'moveUp': 'Subir', 'moveDown': 'Bajar',
        'lookAdded': 'Look añadido: {name}', 'lookSel': 'Look: {name}', 'lookMoved': 'Look movido al puesto {n}', 'maxLooks': 'Una colección puede tener hasta {n} looks.', 'lookN': 'Look {n}',
        'zonesList': 'Zonas', 'piecesList': 'Piezas del patrón',
        'shapeType': 'Forma', 'colourSlot': 'Color', 'slotN': 'Color {n}', 'slotBg': 'Fondo', 'slotShort': 'c{n}', 'slotBgShort': 'fondo', 'colourSlotNow': 'Color {n}',
        'width': 'Ancho', 'height': 'Alto', 'rotation': 'Giro', 'strokeWidth': 'Grosor del trazo', 'waves': 'Ondas o picos', 'rounded': 'Esquinas redondeadas', 'opacity': 'Opacidad',
        'unitsShort': 'u.', 'unitsHelp': 'Las medidas van en unidades del azulejo: el azulejo mide 100 × 100. Lo que pasa de un borde aparece por el contrario.',
        'shapeDesc': '{what} en x {x}, y {y}, de {w} × {h}, {c}',
        'printProps': 'Estampado', 'name': 'Nombre', 'repeat': 'Repetición', 'repeatNow': 'Repetición: {r}', 'scale': 'Tamaño del azulejo en la tela', 'scaleNow': 'Azulejo de {n} cm',
        'scaleHelp': 'Es el tamaño real del motivo en la prenda y en las exportaciones SVG.',
        'colorways': 'Combinaciones de color ({n} de {max})', 'activeCw': 'Combinación activa', 'cwName': 'Nombre de la combinación', 'addCw': 'Nueva combinación', 'delCw': 'Borrar combinación',
        'cwAdded': 'Combinación añadida', 'cwNow': 'Combinación: {name}', 'cwN': 'Combinación {n}', 'lastCw': 'Tiene que quedar al menos una combinación.', 'maxCw': 'Hasta {n} combinaciones por estampado.',
        'cwHelp': 'Cada forma usa el color 1, 2 o 3, o el fondo. Cambia aquí los colores y todo el estampado cambia.',
        'addShapeTitle': 'Añadir formas', 'addShapeHelp': 'Elige la forma en la barra y pulsa «Añadir forma», o pulsa Intro en el lienzo. Con «Trazo a mano» dibujas libremente.',
        'tileLabel': 'Azulejo · {cm} cm', 'rulerCm': '{n} cm',
        'challenges': 'Retos', 'ch1': 'Estampado con un motivo.', 'ch1Ok': 'Hecho: un motivo repetido viste una prenda.', 'ch1Todo': 'Crea un motivo y ponlo en una zona de una prenda.',
        'ch2': 'Colección de 5 prendas.', 'ch2State': 'Looks en la colección: {n} de 5.',
        'front': 'Delante', 'back': 'Detrás', 'zoneTitle': '{z} · {look}', 'fillType': 'Relleno', 'fill_solid': 'Color liso', 'fill_print': 'Estampado',
        'whichPrint': 'Estampado', 'whichCw': 'Combinación de color', 'zoneColour': 'Color de la zona', 'customColour': 'Otro color', 'colourHex': 'Color {hex}',
        'zonePrintHelp': 'El azulejo mide {cm} cm en la prenda. Cámbialo en Repetición.', 'applyAll': 'Aplicar a todas las zonas', 'appliedAll': 'Aplicado a todas las zonas',
        'zoneSel': '{z}: {fill}', 'zoneFilled': '{z}: {fill}', 'fillSolid': 'color {c}', 'fillPrint': 'estampado {name}, {cw}', 'printShort': 'estampado',
        'lookProps': 'Look', 'garment': 'Prenda', 'kindNow': 'Prenda: {k}', 'zonesHelp': 'Toca una zona en el dibujo o elígela en Estructura para rellenarla.',
        'collectionProps': 'Colección', 'collectionName': 'Nombre de la colección', 'collectionDefault': 'Mi colección',
        'lineHelp': 'La línea muestra todos los looks de frente, en orden. Exporta la línea en SVG o PNG desde Archivo.',
        'toteTitle': 'Medidas de la bolsa (terminada)', 'toteW': 'Ancho', 'toteH': 'Alto', 'toteG': 'Fuelle (0 = sin fuelle)', 'toteHL': 'Largo de cada asa', 'toteHW': 'Ancho del asa',
        'toteSeam': 'Margen de costura', 'toteHem': 'Dobladillo de arriba', 'totePocket': 'Con bolsillo delantero', 'toteChanged': 'Medidas cambiadas',
        'sheetsNeeded': 'Hojas A4: {n}', 'sheetsHelp': 'Una hoja de mapa y las hojas con piezas. Las hojas vacías no se imprimen.',
        'cutTable': 'Piezas que cortar (con margen)', 'piece': 'Pieza', 'cut': 'Cortar', 'cutSize': 'Medida',
        'printPattern': 'Imprimir patrón (A4)', 'printing': 'Abriendo la impresión: {n} hojas. Elige «Tamaño real» o 100 %.',
        'scaleCheckTitle': 'Cómo comprobar la escala', 'scaleCheck': 'Imprime al 100 % («Tamaño real»). Mide con una regla el cuadrado de prueba de la hoja A1: debe medir 5 cm por cada lado. Si mide menos, la impresora ha reducido el patrón; cambia la escala y vuelve a imprimir.',
        'sewTitle': 'Cómo se cose', 'sew1': 'Corta las piezas por la línea continua. El margen de costura ({s} cm) ya está incluido.',
        'sew2': 'Dobla las asas en cuatro a lo largo y cóselas por el borde.', 'sew3': 'Si hay bolsillo, dobla su borde de arriba, cóselo y colócalo en el delantero.',
        'sew4': 'Abre el fuelle (es una sola tira) y cóselo alrededor del delantero y luego del trasero, por la línea discontinua (o cose delantero y trasero juntos si no hay fuelle).',
        'sew5': 'Dobla el borde de arriba {hem} cm hacia dentro, mete los extremos de las asas y cóselo todo. Da la vuelta a la bolsa.',
        'pc_body': 'Delantero y trasero', 'pc_gusset': 'Fuelle', 'pc_handle': 'Asa', 'pc_pocket': 'Bolsillo', 'cutN': 'Cortar {n}', 'pcSize': '{w} × {h} cm con margen',
        'handleFold': 'Dobla en 4 a lo largo', 'cutFold': 'Cortar 1 en tela doblada', 'cutFoldShort': '×1 en doblez', 'foldEdge': 'Borde en el doblez de la tela (centro del fondo)', 'grain': 'Hilo recto', 'joinWith': 'Une con {s}', 'sheetN': 'Hoja {s} · {n} de {total}',
        'testSquare': 'Cuadrado de prueba: 5 cm', 'testSquare2': 'Mídelo antes de cortar.', 'testSquare3': 'Si no mide 5 cm, imprime al 100 %.',
        'seamLegend': 'Continua: corte. Discontinua: costura a {s} cm.',
        'printTitle': 'Patrón de bolsa tote · El taller de Iris Green', 'printInfo1': 'Hojas con piezas: {n}. Imprime al 100 % (tamaño real), sin «Ajustar a la página».',
        'printInfo2': 'Esta hoja es el mapa de montaje; no está a escala.', 'printInfo3': 'Comprueba el cuadrado de prueba de 5 cm en la hoja A1.',
        'printInfo4': 'Recorta el margen blanco y une las hojas por los triángulos morados.',
        'tileDesc': 'Azulejo repetible, repetición {rep}; 100 unidades = {cm} cm. El dibujo que se repite es el rectángulo de arriba ({w} × {h} unidades); la franja de abajo lleva la marca.',
        'summaryPrint': 'Estampado «{name}», repetición {rep}, azulejo de {cm} cm, {n} formas; combinación «{cw}» de {cws}.',
        'summaryLook': 'Look «{name}»: {kind}, delante y detrás.', 'summaryLine': 'Colección «{title}» con {n} looks:',
        'summaryTote': 'Patrón de bolsa tote de {w} × {h} cm con fuelle de {g} cm y margen de costura de {s} cm. Piezas:',
        'exportTilePng': 'Exportar azulejo repetible (PNG)', 'exportTileSvg': 'Exportar azulejo repetible (SVG)', 'exportSwatchPng': 'Exportar muestra de tela (PNG)',
        'exportGarmentSvg': 'Exportar prenda (SVG)', 'exportGarmentPng': 'Exportar prenda (PNG)', 'exportLineSvg': 'Exportar línea de la colección (SVG)', 'exportLinePng': 'Exportar línea de la colección (PNG)',
        'exportPatternSvg': 'Exportar patrón de la bolsa a escala 1:1 (SVG)', 'exportError': 'No se ha podido exportar. Inténtalo de nuevo.',
        'exOneMotif': 'Hojas en media gota', 'exOneMotifTitle': 'Un motivo', 'exLookLeaves': 'Camiseta de hojas', 'exDotsTitle': 'Lunares', 'exLookDots': 'Camiseta de lunares',
        'exMyMotif': 'Estrellas y zigzag', 'exHoodieTitle': 'Mi motivo', 'exLookHoodie': 'Sudadera de estrellas', 'exLookBeanie': 'Gorro a juego',
        'exCapsuleTitle': 'Cápsula de primavera', 'exCap1': 'Camiseta de rayas', 'exCap2': 'Pantalón arena', 'exCap3': 'Falda de hojas', 'exCap4': 'Vestido de lunares', 'exCap5': 'Chaqueta marino',
        'exToteTitle': 'Bolsa para la compra', 'exLookTote': 'Bolsa tote',
    },
    'en': {
        'canvasLabel': 'Textile design table',
        'canvasHelp': 'In Motif: comma and full stop choose a shape, the arrow keys move it (further with Shift), [ and ] resize it, R rotates it, C changes its colour, D duplicates it, Delete removes it and Enter adds the chosen shape. In Garment, the arrow keys choose an area. In Collection, they choose a look. In Repeat, they change the colourway.',
        'kModMotif': 'Motif: comma and full stop choose a shape; arrow keys move it; [ and ] size; R rotates; C colour; D duplicates',
        'kModGarment': 'Garment and Collection: arrow keys to choose an area or a look',
        'stMotif': 'Print made from one motif', 'stMotifD': 'A leaf motif in half-drop, with three colourways. A workshop challenge.',
        'stDots': 'Polka-dot T-shirt', 'stDotsD': 'A T-shirt with a polka-dot print and coloured sleeves.',
        'stHoodie': 'Hoodie with your own motif', 'stHoodieD': 'A star and zigzag motif in a brick repeat, on a hoodie and a beanie.',
        'stCapsule': 'Capsule collection of five garments', 'stCapsuleD': 'Five garments that go together, with three prints. A workshop challenge.',
        'stTote': 'Tote bag to print', 'stToteD': 'A real bag pattern at 1:1 scale on A4 sheets, ready to sew.',
        'toolMotif': 'Motif', 'toolRepeat': 'Repeat', 'toolGarment': 'Garment', 'toolLine': 'Collection', 'toolPattern': 'Pattern',
        'shapeKind': 'Shape', 'addShape': 'Add shape', 'penBtn': 'Freehand', 'penOn': 'Freehand on: draw on the tile. With a stylus, pressure changes the thickness.', 'penOff': 'Freehand off',
        'duplicate': 'Duplicate', 'duplicated': 'Duplicated', 'deleteBtn': 'Delete', 'deleted': 'Deleted: {what}', 'added': 'Added: {what}', 'moved': 'Moved', 'resized': 'Size changed', 'rotated': 'Rotated',
        'changed': 'Changed', 'renamed': 'Name changed', 'colourChanged': 'Colour changed', 'selected': 'Selected: {name}', 'deselected': 'Nothing selected.',
        'toFront': 'To front', 'toBack': 'To back', 'toFrontDone': 'Shape brought to front', 'toBackDone': 'Shape sent to back',
        'noPrints': 'There are no prints. Add one from Structure.', 'noLooks': 'There are no garments. Add a look from Structure.',
        'printsList': 'Prints ({n} of {max})', 'newPrint': 'New print', 'newPrintShort': '+ New print…', 'dupPrint': 'Duplicate', 'delPrint': 'Delete',
        'printAdded': 'Print added: {name}', 'printSel': 'Print: {name}', 'copyOf': '{name} (copy)', 'maxPrints': 'Up to {n} prints per project.',
        'shapesList': 'Motif shapes ({n})', 'shapesHelp': 'The one at the top is drawn on top. Tap a shape or choose it here.', 'maxShapes': 'Up to {n} shapes per motif.',
        'looksList': 'Collection ({n} of {max})', 'newLook': 'New look', 'newLookShort': '+ New look…', 'dupLook': 'Duplicate', 'delLook': 'Delete', 'moveUp': 'Move up', 'moveDown': 'Move down',
        'lookAdded': 'Look added: {name}', 'lookSel': 'Look: {name}', 'lookMoved': 'Look moved to position {n}', 'maxLooks': 'A collection can have up to {n} looks.', 'lookN': 'Look {n}',
        'zonesList': 'Areas', 'piecesList': 'Pattern pieces',
        'shapeType': 'Shape', 'colourSlot': 'Colour', 'slotN': 'Colour {n}', 'slotBg': 'Background', 'slotShort': 'c{n}', 'slotBgShort': 'bg', 'colourSlotNow': 'Colour {n}',
        'width': 'Width', 'height': 'Height', 'rotation': 'Rotation', 'strokeWidth': 'Stroke thickness', 'waves': 'Waves or peaks', 'rounded': 'Rounded corners', 'opacity': 'Opacity',
        'unitsShort': 'u.', 'unitsHelp': 'Measurements are in tile units: the tile is 100 × 100. Whatever goes past one edge appears on the opposite one.',
        'shapeDesc': '{what} at x {x}, y {y}, {w} × {h}, {c}',
        'printProps': 'Print', 'name': 'Name', 'repeat': 'Repeat', 'repeatNow': 'Repeat: {r}', 'scale': 'Tile size on the fabric', 'scaleNow': '{n} cm tile',
        'scaleHelp': 'This is the real size of the motif on the garment and in SVG exports.',
        'colorways': 'Colourways ({n} of {max})', 'activeCw': 'Active colourway', 'cwName': 'Colourway name', 'addCw': 'New colourway', 'delCw': 'Delete colourway',
        'cwAdded': 'Colourway added', 'cwNow': 'Colourway: {name}', 'cwN': 'Colourway {n}', 'lastCw': 'At least one colourway must remain.', 'maxCw': 'Up to {n} colourways per print.',
        'cwHelp': 'Each shape uses colour 1, 2 or 3, or the background. Change the colours here and the whole print changes.',
        'addShapeTitle': 'Adding shapes', 'addShapeHelp': 'Choose the shape in the toolbar and press “Add shape”, or press Enter on the canvas. With “Freehand” you draw freely.',
        'tileLabel': 'Tile · {cm} cm', 'rulerCm': '{n} cm',
        'challenges': 'Challenges', 'ch1': 'Print made from one motif.', 'ch1Ok': 'Done: a repeated motif is dressing a garment.', 'ch1Todo': 'Make a motif and put it on an area of a garment.',
        'ch2': 'Collection of five garments.', 'ch2State': 'Looks in the collection: {n} of 5.',
        'front': 'Front', 'back': 'Back', 'zoneTitle': '{z} · {look}', 'fillType': 'Fill', 'fill_solid': 'Plain colour', 'fill_print': 'Print',
        'whichPrint': 'Print', 'whichCw': 'Colourway', 'zoneColour': 'Area colour', 'customColour': 'Other colour', 'colourHex': 'Colour {hex}',
        'zonePrintHelp': 'The tile measures {cm} cm on the garment. Change it in Repeat.', 'applyAll': 'Apply to every area', 'appliedAll': 'Applied to every area',
        'zoneSel': '{z}: {fill}', 'zoneFilled': '{z}: {fill}', 'fillSolid': 'colour {c}', 'fillPrint': 'print {name}, {cw}', 'printShort': 'print',
        'lookProps': 'Look', 'garment': 'Garment', 'kindNow': 'Garment: {k}', 'zonesHelp': 'Tap an area on the drawing or choose it in Structure to fill it.',
        'collectionProps': 'Collection', 'collectionName': 'Collection name', 'collectionDefault': 'My collection',
        'lineHelp': 'The line-up shows every look from the front, in order. Export it as SVG or PNG from File.',
        'toteTitle': 'Bag measurements (finished)', 'toteW': 'Width', 'toteH': 'Height', 'toteG': 'Gusset (0 = no gusset)', 'toteHL': 'Length of each handle', 'toteHW': 'Handle width',
        'toteSeam': 'Seam allowance', 'toteHem': 'Top hem', 'totePocket': 'With a front pocket', 'toteChanged': 'Measurements changed',
        'sheetsNeeded': 'A4 sheets: {n}', 'sheetsHelp': 'One map sheet plus the sheets with pieces. Empty sheets are not printed.',
        'cutTable': 'Pieces to cut (with allowance)', 'piece': 'Piece', 'cut': 'Cut', 'cutSize': 'Size',
        'printPattern': 'Print pattern (A4)', 'printing': 'Opening print: {n} sheets. Choose “Actual size” or 100%.',
        'scaleCheckTitle': 'How to check the scale', 'scaleCheck': 'Print at 100% (“Actual size”). Measure the test square on sheet A1 with a ruler: it must be 5 cm on each side. If it is smaller, the printer has shrunk the pattern; change the scale and print again.',
        'sewTitle': 'How to sew it', 'sew1': 'Cut the pieces along the solid line. The seam allowance ({s} cm) is already included.',
        'sew2': 'Fold each handle in four lengthways and stitch along the edge.', 'sew3': 'If there is a pocket, fold its top edge over, stitch it and place it on the front.',
        'sew4': 'Open out the gusset (it is one strip) and stitch it around the front and then the back, along the dashed line (or stitch front and back together if there is no gusset).',
        'sew5': 'Fold the top edge {hem} cm inwards, tuck in the ends of the handles and stitch it all. Turn the bag right side out.',
        'pc_body': 'Front and back', 'pc_gusset': 'Gusset', 'pc_handle': 'Handle', 'pc_pocket': 'Pocket', 'cutN': 'Cut {n}', 'pcSize': '{w} × {h} cm with allowance',
        'handleFold': 'Fold in 4 lengthways', 'cutFold': 'Cut 1 on the fold', 'cutFoldShort': '×1 on fold', 'foldEdge': 'Place on the fabric fold (centre of the base)', 'grain': 'Grain line', 'joinWith': 'Join to {s}', 'sheetN': 'Sheet {s} · {n} of {total}',
        'testSquare': 'Test square: 5 cm', 'testSquare2': 'Measure it before cutting.', 'testSquare3': 'If it is not 5 cm, print at 100%.',
        'seamLegend': 'Solid: cutting line. Dashed: stitching at {s} cm.',
        'printTitle': 'Tote bag pattern · Iris Green’s workshop', 'printInfo1': 'Sheets with pieces: {n}. Print at 100% (actual size), without “Fit to page”.',
        'printInfo2': 'This sheet is the assembly map; it is not to scale.', 'printInfo3': 'Check the 5 cm test square on sheet A1.',
        'printInfo4': 'Trim the white margin and join the sheets at the purple triangles.',
        'tileDesc': 'Repeating tile, {rep} repeat; 100 units = {cm} cm. The part that repeats is the rectangle at the top ({w} × {h} units); the strip below carries the credit.',
        'summaryPrint': 'Print “{name}”, {rep} repeat, {cm} cm tile, {n} shapes; colourway “{cw}” of {cws}.',
        'summaryLook': 'Look “{name}”: {kind}, front and back.', 'summaryLine': 'Collection “{title}” with {n} looks:',
        'summaryTote': 'Tote bag pattern of {w} × {h} cm with a {g} cm gusset and {s} cm seam allowance. Pieces:',
        'exportTilePng': 'Export repeating tile (PNG)', 'exportTileSvg': 'Export repeating tile (SVG)', 'exportSwatchPng': 'Export fabric swatch (PNG)',
        'exportGarmentSvg': 'Export garment (SVG)', 'exportGarmentPng': 'Export garment (PNG)', 'exportLineSvg': 'Export collection line-up (SVG)', 'exportLinePng': 'Export collection line-up (PNG)',
        'exportPatternSvg': 'Export 1:1 tote pattern (SVG)', 'exportError': 'Could not export. Please try again.',
        'exOneMotif': 'Half-drop leaves', 'exOneMotifTitle': 'One motif', 'exLookLeaves': 'Leaf T-shirt', 'exDotsTitle': 'Polka dots', 'exLookDots': 'Polka-dot T-shirt',
        'exMyMotif': 'Stars and zigzag', 'exHoodieTitle': 'My motif', 'exLookHoodie': 'Star hoodie', 'exLookBeanie': 'Matching beanie',
        'exCapsuleTitle': 'Spring capsule', 'exCap1': 'Striped T-shirt', 'exCap2': 'Sand trousers', 'exCap3': 'Leaf skirt', 'exCap4': 'Polka-dot dress', 'exCap5': 'Navy jacket',
        'exToteTitle': 'Shopping bag', 'exLookTote': 'Tote bag',
    },
}
for _src_es, _src_en, _pre in [(SHAPES_ES, SHAPES_EN, 'shape_'), (KINDS_ES, KINDS_EN, 'kind_'), (ZONES_ES, ZONES_EN, 'zone_'), (REP_ES, REP_EN, 'rep_'),
                               (REP_HELP_ES, REP_HELP_EN, 'repHelp_'), (PRESETS_ES, PRESETS_EN, 'preset_'), (CW_ES, CW_EN, 'cw_')]:
    for _k in _src_es:
        STRINGS['es'][_pre + _k] = _src_es[_k]
        STRINGS['en'][_pre + _k] = _src_en[_k]

assert set(STRINGS['es']) == set(STRINGS['en'])
assert set(PAGE['es']) == set(PAGE['en'])
assert len(PAGE['es']['sections']) == len(PAGE['en']['sections'])
