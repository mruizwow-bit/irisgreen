"""Estudio de arquitectura (R43): plano en planta SVG + vista 3D sincronizada. Textos ES/EN.
Fuente de la revisión de accesibilidad: CTE DB-SUA, anejo A «Itinerario accesible»
(https://www.codigotecnico.org/ · consultado en normatia.com/es/normativa/cte-db-sua/2022/anejo-a-terminologia/)."""

ENGINE = 'arquitectura'
SLUG = {'es': 'arquitectura', 'en': 'architecture-plans'}
SCRIPTS = ['ig-suite-3d.js', 'ig-suite-arquitectura.js']
LIBRARIES = 'Three.js (MIT) con WebGPU o WebGL 2; la planta es SVG propio'
LIBRARIES_EN = 'Three.js (MIT) with WebGPU or WebGL 2; the plan is Iris Green’s own SVG'

FURN_ES = {'bed': 'Cama', 'bed2': 'Cama doble', 'desk': 'Escritorio', 'table': 'Mesa', 'chair': 'Silla', 'sofa': 'Sofá', 'wardrobe': 'Armario',
           'shelf': 'Estantería', 'counter': 'Encimera', 'sink': 'Lavabo', 'toilet': 'Inodoro', 'shower': 'Ducha', 'bathtub': 'Bañera', 'plant': 'Planta',
           'turn': 'Círculo de giro Ø 1,50 m'}
FURN_EN = {'bed': 'Bed', 'bed2': 'Double bed', 'desk': 'Desk', 'table': 'Table', 'chair': 'Chair', 'sofa': 'Sofa', 'wardrobe': 'Wardrobe',
           'shelf': 'Shelves', 'counter': 'Worktop', 'sink': 'Washbasin', 'toilet': 'Toilet', 'shower': 'Shower', 'bathtub': 'Bath', 'plant': 'Plant',
           'turn': 'Turning circle Ø 1.50 m'}
ROOMS_ES = {'bedroom': 'Dormitorio', 'living': 'Salón', 'kitchen': 'Cocina', 'bath': 'Baño', 'corridor': 'Pasillo', 'other': 'Espacio'}
ROOMS_EN = {'bedroom': 'Bedroom', 'living': 'Living room', 'kitchen': 'Kitchen', 'bath': 'Bathroom', 'corridor': 'Corridor', 'other': 'Space'}

PAGE = {
    'es': {
        'title': 'Arquitectura y planos',
        'description': 'Dibuja el plano de una habitación o una casa, en metros, y recórrela en 3D. Puertas, ventanas, muebles, superficies y una revisión orientativa de luz natural y accesibilidad.',
        'lede': 'Dibuja en planta, como los arquitectos, y mira al lado cómo se levanta en 3D. Todo se mide en metros. Puedes pasear por dentro a la altura de tus ojos.',
        'make': ['El plano de tu habitación, con tus muebles', 'Una casa con varias habitaciones', 'Una vivienda con mucha luz natural', 'Una vivienda por la que se pueda circular en silla de ruedas', 'El plano en SVG a escala 1:50, imágenes PNG y el modelo 3D en GLB u OBJ'],
        'steps': [
            'Elige la herramienta Habitación y marca dos esquinas opuestas: aparecen el suelo y las paredes. Las habitaciones vecinas comparten pared.',
            'Con Puerta y Ventana, toca una pared para abrir un hueco. Con Mueble, elige el tipo en la lista y tócalo donde quieras.',
            'Con Elegir, toca cualquier cosa para cambiar sus medidas en Propiedades o arrástrala. Lo que eliges en la planta se marca también en 3D, y al revés.',
            'Pulsa «Pasear» para ver el espacio a la altura de los ojos. Flechas para andar y girar.',
            'Mira la Revisión en Propiedades y exporta el plano o el modelo desde Archivo.',
        ],
        'sections': [
            {'h': 'Planta y 3D a la vez', 'p': 'La planta es un dibujo visto desde arriba, como si quitaras el techo. Es la forma en que se diseñan los edificios: en ella se ven las paredes, los huecos de puertas y ventanas, los muebles y las medidas. La vista 3D se construye a partir de la planta, así que cualquier cambio se ve en las dos.'},
            {'h': 'Medidas', 'p': 'La cuadrícula tiene líneas cada 50 cm, y las más marcadas, cada metro. Las cotas junto a las paredes indican su longitud en metros. Cada habitación muestra su superficie en metros cuadrados. Con el teclado, el cursor avanza 10 cm (1 m con Mayús).'},
            {'h': 'Revisión orientativa', 'p': 'La revisión comprueba tres ideas del Código Técnico de la Edificación de España (CTE DB-SUA, anejo A, itinerario accesible): puertas con al menos 0,80 m de paso libre, pasillos de al menos 1,20 m y espacio para girar una silla de ruedas en un círculo de 1,50 m. También comprueba si las ventanas de cada habitación suman al menos una décima parte de su suelo, una referencia habitual en normas de habitabilidad (cada comunidad autónoma o municipio fija su valor). Es una ayuda para aprender: no sustituye el proyecto de un técnico.'},
            {'h': 'Archivos', 'p': 'El plano SVG se abre en programas de dibujo y se imprime a escala 1:50 (1 m = 2 cm). GLB y OBJ se abren en visores y programas 3D. El proyecto se guarda como un archivo en tu dispositivo.'},
        ],
        'links': [('Todo el taller', '/es/taller/'), ('Modelado 3D', '/es/taller/modelado-3d/'), ('Estructuras', '/es/taller/estructuras/')],
    },
    'en': {
        'title': 'Architecture and plans',
        'description': 'Draw the plan of a room or a house, in metres, and walk through it in 3D. Doors, windows, furniture, floor areas and a guideline check of natural light and accessibility.',
        'lede': 'Draw in plan, like architects do, and watch it rise in 3D right beside it. Everything is measured in metres. You can walk around inside at your own eye height.',
        'make': ['The plan of your room, with your furniture', 'A house with several rooms', 'A home full of natural light', 'A home you can move around in a wheelchair', 'The plan as SVG at 1:50 scale, PNG images and the 3D model as GLB or OBJ'],
        'steps': [
            'Choose the Room tool and mark two opposite corners: the floor and walls appear. Neighbouring rooms share a wall.',
            'With Door and Window, tap a wall to make an opening. With Furniture, choose the type in the list and tap where you want it.',
            'With Select, tap anything to change its measurements in Properties or drag it. What you select in the plan is also highlighted in 3D, and the other way round.',
            'Press “Walk” to see the space at eye height. Arrow keys to walk and turn.',
            'Look at the Check in Properties and export the plan or the model from File.',
        ],
        'sections': [
            {'h': 'Plan and 3D together', 'p': 'The plan is a drawing seen from above, as if you had lifted off the roof. It is how buildings are designed: it shows the walls, the openings for doors and windows, the furniture and the measurements. The 3D view is built from the plan, so any change shows in both.'},
            {'h': 'Measurements', 'p': 'The grid has lines every 50 cm, and the stronger ones every metre. The dimensions beside the walls show their length in metres. Each room shows its floor area in square metres. With the keyboard, the cursor moves 10 cm (1 m with Shift).'},
            {'h': 'Guideline check', 'p': 'The check tests three ideas from Spain’s Building Code (CTE DB-SUA, Annex A, accessible route): doors with at least 0.80 m clear width, corridors at least 1.20 m wide and space to turn a wheelchair in a 1.50 m circle. It also checks whether the windows in each room add up to at least one tenth of its floor, a common reference in housing standards (each region or town sets its own value). It is a learning aid: it does not replace a professional’s design.'},
            {'h': 'Files', 'p': 'The SVG plan opens in drawing programs and prints at 1:50 scale (1 m = 2 cm). GLB and OBJ open in 3D viewers and programs. The project is saved as a file on your device.'},
        ],
        'links': [('The whole workshop', '/en/workshop/'), ('3D modelling', '/en/workshop/3d-modelling/'), ('Structures', '/en/workshop/structures/')],
    },
}

STRINGS = {
    'es': {
        'canvasLabel': 'Plano en planta y vista 3D',
        'canvasHelp': 'En la planta, las flechas mueven un cursor 10 cm (1 m con Mayús) e Intro usa la herramienta en ese punto: con Habitación y Pared, el primer Intro marca el inicio y el segundo el final. Con Elegir, Intro elige lo que hay bajo el cursor y las flechas lo mueven. R gira un mueble, Supr borra y Esc cancela. En la vista 3D, las flechas giran la vista; en modo Pasear, andan y giran.',
        'kArchCursor': 'En la planta: flechas para el cursor; Intro para usar la herramienta; R gira un mueble',
        'kArchWalk': 'En la vista 3D con Pasear: flecha arriba y abajo para andar, izquierda y derecha para girar, Esc para salir',
        'stRoom': 'Mi habitación', 'stRoomD': 'Una habitación de 4 × 3,5 m con cama, escritorio, armario, puerta y ventana.',
        'stHouse': 'Casa pequeña', 'stHouseD': 'Salón, cocina, baño y dos dormitorios con sus puertas y ventanas.',
        'stLight': 'Casa con luz natural', 'stLightD': 'La misma casa con ventanas grandes. Mira la revisión de luz.',
        'stAccess': 'Vivienda accesible', 'stAccessD': 'Pasillo de 1,30 m, puertas de 0,90 m y círculos de giro de 1,50 m.',
        'toolSelect': 'Elegir', 'toolRoom': 'Habitación', 'toolWall': 'Pared', 'toolDoor': 'Puerta', 'toolWindow': 'Ventana', 'toolFurn': 'Mueble',
        'toolErase': 'Borrar', 'toolPan': 'Mover la vista', 'furnLabel': 'Mueble', 'viewLabel': 'Ver', 'viewBoth': 'Planta y 3D', 'viewPlan': 'Solo planta', 'view3d': 'Solo 3D',
        'walkBtn': 'Pasear', 'fitBtn': 'Encuadrar', 'view3dLabel': 'Vista 3D del edificio. Flechas para girarla; con Pasear, para andar.',
        'walkOn': 'Paseo a {h} de altura. Flechas para andar y girar; Esc para salir.', 'walkOff': 'Fin del paseo',
        'no3d': 'Este navegador no puede mostrar 3D. La planta funciona igual.',
        'door': 'Puerta', 'window': 'Ventana', 'wallN': 'Pared {n}', 'elements': 'Elementos',
        'descWall': 'Pared de {l}, {t} cm de grosor', 'descDoor': 'Puerta de {w} de ancho y {h} de alto', 'descWindow': 'Ventana de {w} × {h}, a {s} del suelo',
        'descRoom': '{name}: {w} × {h}, {a}', 'descFurn': '{name}, {w} × {d}',
        'selected': 'Elegido: {what}', 'deselected': 'Nada elegido.', 'nothingHere': 'Aquí no hay nada.', 'cancelled': 'Cancelado',
        'cursorAt': 'Cursor en x {x} m, y {y} m', 'pendingRoom': 'habitación de {l}', 'pendingWall': 'pared de {l}',
        'roomStart': 'Primera esquina en x {x} m, y {y} m. Marca la esquina opuesta.', 'wallStart': 'Pared desde x {x} m, y {y} m. Marca el final.',
        'roomTooSmall': 'La habitación debe medir al menos 0,5 m por lado.', 'roomAdded': 'Añadido: {name}, {a}', 'wallAdded': 'Pared de {l}. Sigue marcando o pulsa Esc.',
        'wallChainEnd': 'Paredes terminadas', 'doorAdded': 'Puerta añadida', 'windowAdded': 'Ventana añadida', 'furnAdded': 'Añadido: {name}',
        'noWallNear': 'Toca cerca de una pared para abrir el hueco.', 'wallTooShort': 'La pared es demasiado corta para ese hueco.',
        'deleted': 'Borrado: {what}', 'moved': 'Movido', 'changed': 'Medidas cambiadas', 'rotated': 'Girado', 'renamed': 'Nombre cambiado',
        'name': 'Nombre', 'roomTypeLabel': 'Uso', 'width': 'Ancho', 'depth': 'Fondo', 'length': 'Longitud', 'thickness': 'Grosor', 'height': 'Alto',
        'sill': 'Altura desde el suelo', 'flipDoor': 'Abrir hacia el otro lado', 'fromStart': 'Distancia desde el inicio de la pared', 'rotation': 'Giro',
        'roomWallsNote': 'Las paredes no se mueven con el suelo: elígelas aparte para cambiarlas.',
        'deleteBtn': 'Borrar', 'planSettings': 'Plano', 'wallStartPt': 'Inicio', 'wallEndPt': 'Final', 'newRoomType': 'Uso de las habitaciones nuevas', 'wallHeight': 'Altura de las paredes',
        'showDims': 'Mostrar cotas', 'eyeHeight': 'Altura de los ojos al pasear',
        'reviewTitle': 'Revisión', 'reviewEmpty': 'Añade habitaciones y puertas para ver la revisión.',
        'reviewOk': 'Todo cumple la revisión orientativa', 'reviewBad': 'Puntos que revisar: {n}', 'okWord': 'Cumple', 'checkWord': 'Revisar',
        'revLightOk': '{name}: ventanas de {wa}, más de la décima parte del suelo ({need}).', 'revLightBad': '{name}: ventanas de {wa}; conviene al menos {need}.',
        'revTurnOk': '{name}: cabe un círculo de giro de 1,50 m (sin contar muebles).', 'revTurnBad': '{name}: no cabe un círculo de giro de 1,50 m.',
        'revCorrOk': '{name}: {w} de ancho, al menos 1,20 m.', 'revCorrBad': '{name}: {w} de ancho; el itinerario accesible pide 1,20 m.',
        'revDoorOk': 'Puerta de {w}: paso libre de unos {c}, al menos 0,80 m.', 'revDoorBad': 'Puerta de {w}: paso libre de unos {c}; se piden 0,80 m.',
        'reviewNote': 'Orientativo, basado en el CTE DB-SUA (anejo A) y en una referencia habitual de luz natural. No sustituye el proyecto de un técnico.',
        'summary': 'Habitaciones: {rooms}, con {area} en total. Paredes: {walls}; puertas: {doors}; ventanas: {windows}; muebles: {furn}.',
        'emptyPlan': 'El plano está vacío. Elige Habitación y marca dos esquinas.',
        'planTitle': 'Plano en planta · El taller de Iris Green', 'scaleNote': 'escala 1:50 al imprimir a tamaño real',
        'exportSvg': 'Exportar plano a escala (SVG)', 'exportPngPlan': 'Exportar plano (PNG)', 'exportGlb': 'Exportar modelo 3D (GLB)', 'exportObj': 'Exportar modelo 3D (OBJ)',
        'exportPng3d': 'Exportar vista 3D (PNG)', 'exportError': 'No se ha podido exportar. Inténtalo de nuevo.',
        'exMyRoom': 'Mi habitación', 'exLiving': 'Salón', 'exBed1': 'Dormitorio 1', 'exBed2': 'Dormitorio 2', 'exKitchen': 'Cocina', 'exBath': 'Baño',
        'exBathAcc': 'Baño accesible', 'exCorridor': 'Pasillo',
    },
    'en': {
        'canvasLabel': 'Floor plan and 3D view',
        'canvasHelp': 'In the plan, the arrow keys move a cursor 10 cm (1 m with Shift) and Enter uses the tool at that point: with Room and Wall, the first Enter marks the start and the second the end. With Select, Enter selects what is under the cursor and the arrow keys move it. R rotates a piece of furniture, Delete removes and Esc cancels. In the 3D view, the arrow keys turn the view; in Walk mode, they walk and turn.',
        'kArchCursor': 'In the plan: arrow keys for the cursor; Enter to use the tool; R rotates furniture',
        'kArchWalk': 'In the 3D view with Walk: up and down arrows to walk, left and right to turn, Esc to stop',
        'stRoom': 'My room', 'stRoomD': 'A 4 × 3.5 m room with bed, desk, wardrobe, door and window.',
        'stHouse': 'Small house', 'stHouseD': 'Living room, kitchen, bathroom and two bedrooms with their doors and windows.',
        'stLight': 'House full of light', 'stLightD': 'The same house with big windows. Look at the light check.',
        'stAccess': 'Accessible home', 'stAccessD': 'A 1.30 m corridor, 0.90 m doors and 1.50 m turning circles.',
        'toolSelect': 'Select', 'toolRoom': 'Room', 'toolWall': 'Wall', 'toolDoor': 'Door', 'toolWindow': 'Window', 'toolFurn': 'Furniture',
        'toolErase': 'Delete', 'toolPan': 'Move the view', 'furnLabel': 'Furniture', 'viewLabel': 'Show', 'viewBoth': 'Plan and 3D', 'viewPlan': 'Plan only', 'view3d': '3D only',
        'walkBtn': 'Walk', 'fitBtn': 'Fit to view', 'view3dLabel': '3D view of the building. Arrow keys to turn it; with Walk, to walk.',
        'walkOn': 'Walking at {h} eye height. Arrow keys to walk and turn; Esc to stop.', 'walkOff': 'Walk finished',
        'no3d': 'This browser cannot show 3D. The plan works just the same.',
        'door': 'Door', 'window': 'Window', 'wallN': 'Wall {n}', 'elements': 'Elements',
        'descWall': 'Wall of {l}, {t} cm thick', 'descDoor': 'Door {w} wide and {h} high', 'descWindow': 'Window {w} × {h}, {s} above the floor',
        'descRoom': '{name}: {w} × {h}, {a}', 'descFurn': '{name}, {w} × {d}',
        'selected': 'Selected: {what}', 'deselected': 'Nothing selected.', 'nothingHere': 'There is nothing here.', 'cancelled': 'Cancelled',
        'cursorAt': 'Cursor at x {x} m, y {y} m', 'pendingRoom': 'room of {l}', 'pendingWall': 'wall of {l}',
        'roomStart': 'First corner at x {x} m, y {y} m. Mark the opposite corner.', 'wallStart': 'Wall from x {x} m, y {y} m. Mark the end.',
        'roomTooSmall': 'The room must be at least 0.5 m on each side.', 'roomAdded': '{name} added: {a}', 'wallAdded': 'Wall of {l}. Keep marking or press Esc.',
        'wallChainEnd': 'Walls finished', 'doorAdded': 'Door added', 'windowAdded': 'Window added', 'furnAdded': '{name} added',
        'noWallNear': 'Tap near a wall to make the opening.', 'wallTooShort': 'The wall is too short for that opening.',
        'deleted': 'Deleted: {what}', 'moved': 'Moved', 'changed': 'Measurements changed', 'rotated': 'Rotated', 'renamed': 'Name changed',
        'name': 'Name', 'roomTypeLabel': 'Use', 'width': 'Width', 'depth': 'Depth', 'length': 'Length', 'thickness': 'Thickness', 'height': 'Height',
        'sill': 'Height above the floor', 'flipDoor': 'Open the other way', 'fromStart': 'Distance from the start of the wall', 'rotation': 'Rotation',
        'roomWallsNote': 'Walls do not move with the floor: select them separately to change them.',
        'deleteBtn': 'Delete', 'planSettings': 'Plan', 'wallStartPt': 'Start', 'wallEndPt': 'End', 'newRoomType': 'Use of new rooms', 'wallHeight': 'Wall height',
        'showDims': 'Show dimensions', 'eyeHeight': 'Eye height when walking',
        'reviewTitle': 'Check', 'reviewEmpty': 'Add rooms and doors to see the check.',
        'reviewOk': 'Everything meets the guideline check', 'reviewBad': 'Points to look at: {n}', 'okWord': 'Meets', 'checkWord': 'Look at',
        'revLightOk': '{name}: {wa} of windows, more than a tenth of the floor ({need}).', 'revLightBad': '{name}: {wa} of windows; at least {need} is advisable.',
        'revTurnOk': '{name}: a 1.50 m turning circle fits (not counting furniture).', 'revTurnBad': '{name}: a 1.50 m turning circle does not fit.',
        'revCorrOk': '{name}: {w} wide, at least 1.20 m.', 'revCorrBad': '{name}: {w} wide; an accessible route needs 1.20 m.',
        'revDoorOk': 'Door of {w}: about {c} clear width, at least 0.80 m.', 'revDoorBad': 'Door of {w}: about {c} clear width; 0.80 m is required.',
        'reviewNote': 'A guideline based on the CTE DB-SUA (Annex A) and a common natural-light reference. It does not replace a professional’s design.',
        'summary': 'Rooms: {rooms}, {area} in total. Walls: {walls}; doors: {doors}; windows: {windows}; furniture: {furn}.',
        'emptyPlan': 'The plan is empty. Choose Room and mark two corners.',
        'planTitle': 'Floor plan · Iris Green’s workshop', 'scaleNote': '1:50 scale when printed at actual size',
        'exportSvg': 'Export scale plan (SVG)', 'exportPngPlan': 'Export plan (PNG)', 'exportGlb': 'Export 3D model (GLB)', 'exportObj': 'Export 3D model (OBJ)',
        'exportPng3d': 'Export 3D view (PNG)', 'exportError': 'Could not export. Please try again.',
        'exMyRoom': 'My room', 'exLiving': 'Living room', 'exBed1': 'Bedroom 1', 'exBed2': 'Bedroom 2', 'exKitchen': 'Kitchen', 'exBath': 'Bathroom',
        'exBathAcc': 'Accessible bathroom', 'exCorridor': 'Corridor',
    },
}
for _k, _v in FURN_ES.items():
    STRINGS['es']['furn_' + _k] = _v
    STRINGS['en']['furn_' + _k] = FURN_EN[_k]
for _k, _v in ROOMS_ES.items():
    STRINGS['es']['roomType_' + _k] = _v
    STRINGS['en']['roomType_' + _k] = ROOMS_EN[_k]
assert set(STRINGS['es']) == set(STRINGS['en'])
