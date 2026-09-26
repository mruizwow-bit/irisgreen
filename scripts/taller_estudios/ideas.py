"""Estudio 25 · Ideas e inventos. Textos ES/EN y retos. Incluye las seis mesas que antes estaban en la portada."""
from pathlib import Path

KEY = 'ideas'
NUMBER = 25
SLUG = {'es': 'ideas', 'en': 'ideas'}
SCRIPTS = ['ig-taller-lab.js', 'ig-taller-ideas.js']
EXTRA_CSS = ['ig-taller-lab.css']
_DATA = (Path(__file__).resolve().parent / 'igl_data.json').read_text(encoding='utf-8').replace('</', '<\\/')


def extra_body(lang: str) -> str:
    return f'<div id="igl-mount"></div><script type="application/json" id="igl-data-{lang}">{_DATA}</script>'


LEVELS = {
    1: {'es': 'Mirar distinto', 'en': 'Looking differently'},
    2: {'es': 'Encargos pequeños', 'en': 'Small commissions'},
    3: {'es': 'Encargos reales', 'en': 'Real commissions'},
    4: {'es': 'Sin techo', 'en': 'No ceiling'},
}

CHALLENGES = [
    {'id': 'i1', 'level': 1, 'rules': {'scamper': 1},
     'es': {'object': 'una pinza de la ropa', 'title': 'Una pinza de la ropa', 'goal': 'Pasa una pinza de la ropa por las siete preguntas del método SCAMPER. Una idea en cada letra.', 'limits': ['Una idea en cada una de las 7 letras'], 'tip': 'Las ideas raras también cuentan. Luego se eligen.'},
     'en': {'object': 'a clothes peg', 'title': 'A clothes peg', 'goal': 'Take a clothes peg through the seven questions of the SCAMPER method. One idea for each letter.', 'limits': ['One idea for each of the 7 letters'], 'tip': 'Odd ideas count too. You choose later.'}},
    {'id': 'i2', 'level': 1, 'rules': {'scamper': 3},
     'es': {'title': 'Tres ideas por letra', 'goal': 'Elige un objeto y escribe tres ideas en cada letra de SCAMPER: veintiuna ideas. Una por línea.', 'limits': ['3 ideas en cada letra'], 'tip': 'Cuando se acaban las ideas fáciles empiezan las buenas.'},
     'en': {'title': 'Three ideas per letter', 'goal': 'Choose an object and write three ideas for each SCAMPER letter: twenty-one ideas. One per line.', 'limits': ['3 ideas for each letter'], 'tip': 'The good ideas start once the easy ones run out.'}},
    {'id': 'i3', 'level': 2,
     'es': {'title': 'Soporte para el móvil', 'goal': 'Un soporte que sujete el móvil de pie para ver una receta mientras cocinas.', 'limits': ['Hasta 5 €', 'Cabe en 15 × 10 × 10 cm', 'Hasta 150 g', 'Al menos 2 piezas'], 'tip': 'Mira qué hay en casa: lo que ya tienes cuesta 0 €.',
            'brief': {'text': 'Un soporte que sujete el móvil de pie para ver una receta mientras cocinas.', 'budget': 5, 'size': [15, 10, 10], 'weight': 150, 'minParts': 2}},
     'en': {'title': 'Phone stand', 'goal': 'A stand that holds a phone upright so you can follow a recipe while cooking.', 'limits': ['Up to €5', 'Fits in 15 × 10 × 10 cm', 'Up to 150 g', 'At least 2 parts'], 'tip': 'Look at what is at home: what you already have costs €0.',
            'brief': {'text': 'A stand that holds a phone upright so you can follow a recipe while cooking.', 'budget': 5, 'size': [15, 10, 10], 'weight': 150, 'minParts': 2}}},
    {'id': 'i4', 'level': 2,
     'es': {'title': 'No olvidar las llaves', 'goal': 'Algo junto a la puerta que haga difícil salir de casa sin las llaves.', 'limits': ['Hasta 10 €', 'Cabe en 20 × 10 × 5 cm', 'Hasta 300 g', 'Sin pilas ni enchufe', 'Al menos 3 piezas'], 'tip': 'Piensa en el momento exacto en que se olvidan: ¿qué haces justo antes de abrir la puerta?',
            'brief': {'text': 'Algo junto a la puerta que haga difícil salir de casa sin las llaves.', 'budget': 10, 'size': [20, 10, 5], 'weight': 300, 'minParts': 3, 'extra': 'Sin pilas ni enchufe'}},
     'en': {'title': 'Never forget the keys', 'goal': 'Something by the door that makes it hard to leave home without your keys.', 'limits': ['Up to €10', 'Fits in 20 × 10 × 5 cm', 'Up to 300 g', 'No batteries or plug', 'At least 3 parts'], 'tip': 'Think about the exact moment they get forgotten: what do you do just before opening the door?',
            'brief': {'text': 'Something by the door that makes it hard to leave home without your keys.', 'budget': 10, 'size': [20, 10, 5], 'weight': 300, 'minParts': 3, 'extra': 'No batteries or plug'}}},
    {'id': 'i5', 'level': 3,
     'es': {'title': 'Leer en la cama', 'goal': 'Leer tumbado un rato largo sin que se cansen los brazos ni el cuello.', 'limits': ['Hasta 15 €', 'Cabe en una caja de zapatos: 33 × 20 × 12 cm', 'Hasta 800 g', 'Al menos 4 piezas'], 'tip': 'Pregunta a alguien que lea en la cama qué le molesta. Anótalo en «Para quién».',
            'brief': {'text': 'Leer tumbado un rato largo sin que se cansen los brazos ni el cuello.', 'budget': 15, 'size': [33, 20, 12], 'weight': 800, 'minParts': 4}},
     'en': {'title': 'Reading in bed', 'goal': 'Read lying down for a long time without tiring your arms or neck.', 'limits': ['Up to €15', 'Fits in a shoebox: 33 × 20 × 12 cm', 'Up to 800 g', 'At least 4 parts'], 'tip': 'Ask someone who reads in bed what bothers them. Note it under “Who it is for”.',
            'brief': {'text': 'Read lying down for a long time without tiring your arms or neck.', 'budget': 15, 'size': [33, 20, 12], 'weight': 800, 'minParts': 4}}},
    {'id': 'i6', 'level': 3,
     'es': {'title': 'Una planta sin ti una semana', 'goal': 'Que una planta de maceta tenga agua durante siete días sin que nadie la riegue.', 'limits': ['Hasta 8 €', 'Cabe en 30 × 20 × 20 cm', 'Hasta 600 g sin agua', 'Sin electricidad', 'Al menos 3 piezas'], 'tip': 'En «Cómo compruebo que funciona», escribe cómo lo probarías antes de irte.',
            'brief': {'text': 'Que una planta de maceta tenga agua durante siete días sin que nadie la riegue.', 'budget': 8, 'size': [30, 20, 20], 'weight': 600, 'minParts': 3, 'extra': 'Sin electricidad'}},
     'en': {'title': 'A plant without you for a week', 'goal': 'Keep a potted plant watered for seven days without anyone watering it.', 'limits': ['Up to €8', 'Fits in 30 × 20 × 20 cm', 'Up to 600 g without water', 'No electricity', 'At least 3 parts'], 'tip': 'Under “How I check it works”, write how you would test it before leaving.',
            'brief': {'text': 'Keep a potted plant watered for seven days without anyone watering it.', 'budget': 8, 'size': [30, 20, 20], 'weight': 600, 'minParts': 3, 'extra': 'No electricity'}}},
    {'id': 'i7', 'level': 3,
     'es': {'title': 'Cables en orden', 'goal': 'Que los cables de un escritorio no se enreden ni caigan al suelo, y que se pueda desenchufar uno sin mover los demás.', 'limits': ['Hasta 12 €', 'Cabe en 40 × 15 × 10 cm', 'Hasta 500 g', 'Al menos 3 piezas'], 'tip': 'Cuenta primero cuántos cables hay y de qué grosor.',
            'brief': {'text': 'Que los cables de un escritorio no se enreden ni caigan al suelo, y que se pueda desenchufar uno sin mover los demás.', 'budget': 12, 'size': [40, 15, 10], 'weight': 500, 'minParts': 3}},
     'en': {'title': 'Tidy cables', 'goal': 'Stop the cables on a desk from tangling or falling on the floor, so you can unplug one without moving the rest.', 'limits': ['Up to €12', 'Fits in 40 × 15 × 10 cm', 'Up to 500 g', 'At least 3 parts'], 'tip': 'First count how many cables there are and how thick they are.',
            'brief': {'text': 'Stop the cables on a desk from tangling or falling on the floor, so you can unplug one without moving the rest.', 'budget': 12, 'size': [40, 15, 10], 'weight': 500, 'minParts': 3}}},
    {'id': 'i8', 'level': 4, 'random': True,
     'es': {'title': 'Encargo al azar', 'goal': 'Un problema, una persona, un lugar y unos límites al azar. Pide otro encargo cuando quieras: no se acaban.', 'limits': ['Cambian en cada encargo'], 'tip': 'Si el encargo no te dice nada, pide otro.'},
     'en': {'title': 'Random commission', 'goal': 'A random problem, person, place and set of limits. Ask for another commission whenever you like: they never run out.', 'limits': ['They change with each commission'], 'tip': 'If a commission does nothing for you, ask for another.'}},
]

STRINGS = {
    'es': {
        'iNewDone': 'Proyecto nuevo',
        'iLabTitle': 'Calentar: las seis mesas', 'iLabNote': 'Seis actividades cortas para soltar ideas: historias con piezas, preguntas imposibles, inventos combinados, formas, usos y puntos de vista.',
        'iScTitle': 'Método SCAMPER', 'iScNote': 'Siete preguntas para transformar un objeto que ya existe. Escribe una idea por línea. Ninguna es mala: primero se apuntan todas y luego se eligen.',
        'iScObject': 'Objeto', 'iScSuggest': 'Otro objeto', 'iScThis': 'este objeto',
        'iScObjects': 'una pinza de la ropa|un paraguas|una silla|una botella de agua|una mochila|un cepillo de dientes|una cuchara|un despertador|una bicicleta|una caja de zapatos|un lápiz|una lámpara|un calcetín|un cubo',
        'iSc_S': 'Sustituir', 'iSc_C': 'Combinar', 'iSc_A': 'Adaptar', 'iSc_M': 'Modificar', 'iSc_P': 'Poner otro uso', 'iSc_E': 'Eliminar', 'iSc_R': 'Reordenar',
        'iScQ_S': '¿Qué parte o material de {o} podrías cambiar por otro?', 'iScQ_C': '¿Con qué otra cosa podrías juntar {o}?', 'iScQ_A': '¿Qué idea de otro objeto, animal o lugar podrías copiar para {o}?',
        'iScQ_M': '¿Qué pasa si {o} es mucho más grande, más pequeño, más blando o de otra forma?', 'iScQ_P': '¿Para qué más podría servir {o}? ¿Y en otro sitio, o para otra persona?',
        'iScQ_E': '¿Qué le puedes quitar a {o} y que siga funcionando?', 'iScQ_R': '¿Qué pasa si cambias el orden, le das la vuelta o lo usas al revés?',
        'iScCount': 'Ideas escritas: {n}',
        'iInvTitle': 'Ficha de invento', 'iInvNote': 'Para pasar de la idea a algo que se puede construir: qué problema resuelve, para quién, cómo se usa, cuánto cuesta, cuánto mide y cuánto pesa. Los precios y pesos los pones tú: míralos en una tienda o en lo que ya tienes en casa.',
        'iNoBrief': 'Sin encargo', 'iNoBriefText': 'Elige un reto de encargo arriba o rellena la ficha con tu propio invento.', 'iBriefK': 'Encargo', 'iAnotherBrief': 'Otro encargo', 'iGoSheet': 'Ir a la ficha', 'iGoScamper': 'Ir a SCAMPER',
        'iLimBudget': 'Coste total: hasta {v} €', 'iLimSize': 'Medidas del invento montado: hasta {v} cm', 'iLimWeight': 'Peso total: hasta {v} g', 'iLimParts': 'Piezas distintas: al menos {v}',
        'iF_name': 'Nombre del invento', 'iF_who': 'Para quién es', 'iF_problem': 'Qué problema resuelve', 'iF_how': 'Cómo se usa, paso a paso', 'iF_test': 'Cómo compruebo que funciona', 'iF_better': 'Qué mejoraría en la versión 2',
        'iSizeLegend': 'Medidas del invento montado', 'iSize_0': 'Largo (cm)', 'iSize_1': 'Ancho (cm)', 'iSize_2': 'Alto (cm)',
        'iPartsTitle': 'Piezas y materiales', 'iPartsNote': 'Una fila por pieza. El precio y el peso son por unidad. Lo que ya tienes en casa puede costar 0 €.', 'iPartsCap': 'Piezas del invento',
        'iThPart': 'Pieza o material', 'iThQty': 'Cantidad', 'iThPrice': 'Precio por unidad (€)', 'iThWeight': 'Peso por unidad (g)', 'iThDel': 'Quitar',
        'iAriaPart': 'Pieza {n}: nombre', 'iAriaQty': 'Pieza {n}: cantidad', 'iAriaPrice': 'Pieza {n}: precio por unidad en euros', 'iAriaWeight': 'Pieza {n}: peso por unidad en gramos',
        'iDelPart': 'Quitar la pieza {n}', 'iPartDeleted': 'Pieza quitada', 'iAddPart': 'Añadir pieza', 'iNoParts': 'Todavía no hay piezas.',
        'iTotals': 'Coste total: {c} € · Peso total: {w} g · Piezas con nombre: {n} · Medidas: {s} cm',
        'iChecksTitle': 'Cómo va la ficha', 'iAllOk': 'La ficha está completa y cumple el encargo.', 'iSomeOk': 'Así va. Completa lo que falta cuando quieras.',
        'iChkField': '{f}: escrito', 'iChkBudget': 'Coste: {c} € (hasta {m} €)', 'iChkSize': 'Medidas: {s} cm (hasta {m} cm, en cualquier orientación)', 'iChkWeight': 'Peso: {w} g (hasta {m} g)',
        'iChkParts': 'Piezas: {n} (al menos {m})', 'iChkScamper': 'Al menos {m} idea(s) en cada letra de SCAMPER',
        'iRandText': '{p}, para {who}, {where}.',
        'iRandPools': 'Llevar la compra sin que se rompan los huevos|Saber qué toca hacer mañana sin mirar el móvil|Secar las zapatillas mojadas más rápido|Encontrar el mando a distancia siempre|Que el perro beba agua cuando no hay nadie|Que una puerta no dé portazos con el viento|Tapar la luz de los aparatos por la noche|Colgar la bici en poco sitio|Llevar un paraguas sin tener que sujetarlo|Que la mochila pese menos en la espalda|Guardar las gafas donde no se pisen|Avisar de que el agua de la pasta va a salirse||una persona mayor|alguien que va en silla de ruedas|una familia con un bebé|un estudiante que vive en un piso compartido|alguien que trabaja por la noche|una persona que no oye bien|alguien a quien le molestan los ruidos fuertes|una persona con poca fuerza en las manos|alguien que viaja mucho||en una cocina pequeña|en la entrada de casa|en un balcón|en una clase|en una habitación compartida|en el coche|en un parque|en una tienda pequeña|en una biblioteca||Sin pilas ni enchufe|Que se pueda lavar|Que se monte en menos de dos minutos|Que se pueda usar con una sola mano|Sin herramientas para montarlo|Que no haga ruido|Todo reutilizado menos una pieza',
    },
    'en': {
        'iNewDone': 'New project',
        'iLabTitle': 'Warm up: the six tables', 'iLabNote': 'Six short activities to get ideas flowing: stories from pieces, impossible questions, combined inventions, shapes, uses and points of view.',
        'iScTitle': 'The SCAMPER method', 'iScNote': 'Seven questions to transform an object that already exists. Write one idea per line. None of them is bad: first you note them all down, then you choose.',
        'iScObject': 'Object', 'iScSuggest': 'Another object', 'iScThis': 'this object',
        'iScObjects': 'a clothes peg|an umbrella|a chair|a water bottle|a backpack|a toothbrush|a spoon|an alarm clock|a bicycle|a shoebox|a pencil|a lamp|a sock|a bucket',
        'iSc_S': 'Substitute', 'iSc_C': 'Combine', 'iSc_A': 'Adapt', 'iSc_M': 'Modify', 'iSc_P': 'Put to another use', 'iSc_E': 'Eliminate', 'iSc_R': 'Rearrange',
        'iScQ_S': 'Which part or material of {o} could you swap for another?', 'iScQ_C': 'What else could you join {o} with?', 'iScQ_A': 'What idea from another object, animal or place could you borrow for {o}?',
        'iScQ_M': 'What happens if {o} is much bigger, smaller, softer or a different shape?', 'iScQ_P': 'What else could {o} be used for? Somewhere else, or by someone else?',
        'iScQ_E': 'What can you take away from {o} so that it still works?', 'iScQ_R': 'What happens if you change the order, turn it over or use it the other way round?',
        'iScCount': 'Ideas written: {n}',
        'iInvTitle': 'Invention sheet', 'iInvNote': 'To go from an idea to something you can build: what problem it solves, who it is for, how it is used, how much it costs, how big it is and how much it weighs. You enter the prices and weights: look them up in a shop or in what you already have at home.',
        'iNoBrief': 'No commission', 'iNoBriefText': 'Pick a commission challenge above, or fill in the sheet with your own invention.', 'iBriefK': 'Commission', 'iAnotherBrief': 'Another commission', 'iGoSheet': 'Go to the sheet', 'iGoScamper': 'Go to SCAMPER',
        'iLimBudget': 'Total cost: up to €{v}', 'iLimSize': 'Size of the finished invention: up to {v} cm', 'iLimWeight': 'Total weight: up to {v} g', 'iLimParts': 'Different parts: at least {v}',
        'iF_name': 'Name of the invention', 'iF_who': 'Who it is for', 'iF_problem': 'What problem it solves', 'iF_how': 'How it is used, step by step', 'iF_test': 'How I check it works', 'iF_better': 'What I would improve in version 2',
        'iSizeLegend': 'Size of the finished invention', 'iSize_0': 'Length (cm)', 'iSize_1': 'Width (cm)', 'iSize_2': 'Height (cm)',
        'iPartsTitle': 'Parts and materials', 'iPartsNote': 'One row per part. Price and weight are per unit. What you already have at home can cost €0.', 'iPartsCap': 'Parts of the invention',
        'iThPart': 'Part or material', 'iThQty': 'Quantity', 'iThPrice': 'Price per unit (€)', 'iThWeight': 'Weight per unit (g)', 'iThDel': 'Remove',
        'iAriaPart': 'Part {n}: name', 'iAriaQty': 'Part {n}: quantity', 'iAriaPrice': 'Part {n}: price per unit in euros', 'iAriaWeight': 'Part {n}: weight per unit in grams',
        'iDelPart': 'Remove part {n}', 'iPartDeleted': 'Part removed', 'iAddPart': 'Add part', 'iNoParts': 'There are no parts yet.',
        'iTotals': 'Total cost: €{c} · Total weight: {w} g · Named parts: {n} · Size: {s} cm',
        'iChecksTitle': 'How the sheet is going', 'iAllOk': 'The sheet is complete and meets the commission.', 'iSomeOk': 'Here is how it is going. Fill in what is missing whenever you like.',
        'iChkField': '{f}: written', 'iChkBudget': 'Cost: €{c} (up to €{m})', 'iChkSize': 'Size: {s} cm (up to {m} cm, in any orientation)', 'iChkWeight': 'Weight: {w} g (up to {m} g)',
        'iChkParts': 'Parts: {n} (at least {m})', 'iChkScamper': 'At least {m} idea(s) for each SCAMPER letter',
        'iRandText': '{p}, for {who}, {where}.',
        'iRandPools': 'Carrying the shopping without breaking the eggs|Knowing what is on tomorrow without looking at your phone|Drying wet trainers faster|Always finding the remote control|Making sure the dog drinks when nobody is home|Stopping a door slamming in the wind|Covering the lights on devices at night|Hanging a bike up in a small space|Carrying an umbrella without holding it|Making a backpack feel lighter on your back|Keeping glasses where nobody steps on them|Warning that the pasta water is about to boil over||an older person|someone who uses a wheelchair|a family with a baby|a student living in a shared flat|someone who works nights|someone who is hard of hearing|someone bothered by loud noises|someone with little strength in their hands|someone who travels a lot||in a small kitchen|in the hallway at home|on a balcony|in a classroom|in a shared bedroom|in the car|in a park|in a small shop|in a library||No batteries or plug|It can be washed|It goes together in under two minutes|It can be used with one hand|No tools needed to build it|It makes no noise|All reused except one part',
    },
}
assert set(STRINGS['es']) == set(STRINGS['en'])

PAGE = {
    'es': {
        'title': 'Estudio de ideas e inventos',
        'description': 'Seis mesas para soltar ideas, el método SCAMPER y una ficha de invento con límites reales de coste, tamaño y peso. Encargos sin fin.',
        'lede': 'De la idea suelta al invento que se puede construir. Calienta con las seis mesas, transforma objetos con SCAMPER y diseña inventos con límites reales de dinero, tamaño y peso.',
        'pills': ['Las seis mesas', 'Método SCAMPER', 'Ficha de invento', 'Coste, medidas y peso', '8 retos en 4 niveles', 'Encargos al azar sin fin'],
        'steps': [
            'Calienta con una de las seis mesas si te apetece. Puedes saltártelo.',
            'Elige un reto: SCAMPER para transformar un objeto, o un encargo con límites.',
            'En la ficha de invento, escribe el problema, para quién es y cómo se usa. Añade las piezas con su precio y su peso.',
            'La lista «Cómo va la ficha» se actualiza sola: dice qué cumple y qué falta.',
            'Guarda el proyecto en un archivo o imprime la ficha.',
        ],
        'sections': [
            {'h': 'Por qué con límites', 'p': 'Los límites bien puestos ayudan a inventar: obligan a buscar caminos que no se buscarían con dinero y espacio sin fin. Por eso cada encargo tiene un presupuesto, unas medidas y un peso máximos. Los límites nunca llevan puntuación ni tiempo.'},
        ],
        'links': [('Estudio de dibujo, para dibujar tu invento', '/es/taller/dibujo/'), ('Estudio de estructuras', '/es/taller/estructuras/'), ('Volver al Taller', '/es/taller/')],
        'credits': 'Estudio de ideas de Iris Green. SCAMPER es un método de creatividad descrito por Bob Eberle (1971) a partir de las preguntas de Alex Osborn.',
    },
    'en': {
        'title': 'Ideas and inventions studio',
        'description': 'Six tables to get ideas flowing, the SCAMPER method and an invention sheet with real limits on cost, size and weight. Endless commissions.',
        'lede': 'From a loose idea to an invention you can build. Warm up with the six tables, transform objects with SCAMPER and design inventions with real limits on money, size and weight.',
        'pills': ['The six tables', 'SCAMPER method', 'Invention sheet', 'Cost, size and weight', '8 challenges on 4 levels', 'Endless random commissions'],
        'steps': [
            'Warm up at one of the six tables if you like. You can skip it.',
            'Pick a challenge: SCAMPER to transform an object, or a commission with limits.',
            'On the invention sheet, write the problem, who it is for and how it is used. Add the parts with their price and weight.',
            'The “How the sheet is going” list updates itself: it says what is met and what is missing.',
            'Save the project to a file or print the sheet.',
        ],
        'sections': [
            {'h': 'Why limits', 'p': 'Well-chosen limits help you invent: they push you to look for routes you would never try with endless money and space. That is why each commission has a maximum budget, size and weight. Limits never come with a score or a clock.'},
        ],
        'links': [('Drawing studio, to draw your invention', '/en/workshop/drawing/'), ('Structures studio', '/en/workshop/structures/'), ('Back to the workshop', '/en/workshop/')],
        'credits': 'Iris Green ideas studio. SCAMPER is a creativity method described by Bob Eberle (1971), based on questions by Alex Osborn.',
    },
}
