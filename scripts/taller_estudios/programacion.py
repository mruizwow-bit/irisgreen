"""Estudio 12 · Programación. Textos ES/EN y retos."""
from .codigo_strings import C, LANG_REF

KEY = 'programacion'
NUMBER = 12
SLUG = {'es': 'programacion', 'en': 'coding'}
SCRIPTS = ['ig-taller-codigo.js', 'ig-taller-programacion.js']

LEVELS = {
    1: {'es': 'Secuencias', 'en': 'Sequences'},
    2: {'es': 'Bucles', 'en': 'Loops'},
    3: {'es': 'Variables y decisiones', 'en': 'Variables and decisions'},
    4: {'es': 'Funciones', 'en': 'Functions'},
    5: {'es': 'Recursividad', 'en': 'Recursion'},
    6: {'es': 'Sin techo', 'en': 'No ceiling'},
}

SQUARE = 'repetir 4 {\n avanzar 100\n derecha 90\n}'
FIZZ_ES = [('¡zas!' if n % 3 == 0 else str(n)) for n in range(1, 21)]
FIZZ_EN = [('zap!' if n % 3 == 0 else str(n)) for n in range(1, 21)]

CHALLENGES = [
    {'id': 'p1', 'level': 1, 'ref': SQUARE, 'rules': {},
     'es': {'title': 'Cuadrado', 'goal': 'Dibuja un cuadrado de 100 pasos de lado. La silueta violeta te dice dónde.', 'limits': ['Que coincida con la silueta'], 'tip': 'Avanza y gira 90 grados. Cuatro veces.'},
     'en': {'title': 'Square', 'goal': 'Draw a square with sides of 100 steps. The violet outline shows you where.', 'limits': ['Match the outline'], 'tip': 'Go forward and turn 90 degrees. Four times.'}},
    {'id': 'p2', 'level': 1, 'ref': 'repetir 5 {\n avanzar 30\n derecha 90\n avanzar 30\n izquierda 90\n}', 'rules': {},
     'es': {'title': 'Escalera', 'goal': 'Una escalera de cinco peldaños de 30 pasos que sube hacia la derecha.', 'limits': ['Que coincida con la silueta'], 'tip': 'Un peldaño: arriba, derecha. Luego vuelve a mirar hacia arriba.'},
     'en': {'title': 'Staircase', 'goal': 'A staircase of five 30-step stairs going up to the right.', 'limits': ['Match the outline'], 'tip': 'One stair: up, then right. Then face upwards again.'}},
    {'id': 'p3', 'level': 1, 'ref': SQUARE + '\navanzar 100\nderecha 30\navanzar 100\nderecha 120\navanzar 100', 'rules': {},
     'es': {'title': 'Casa', 'goal': 'Un cuadrado de 100 con un tejado en triángulo encima, con los tres lados iguales.', 'limits': ['Que coincida con la silueta'], 'tip': 'En un triángulo de lados iguales, la tortuga gira 120 grados en cada esquina.'},
     'en': {'title': 'House', 'goal': 'A 100-step square with a triangular roof on top, all three sides equal.', 'limits': ['Match the outline'], 'tip': 'In a triangle with equal sides, the turtle turns 120 degrees at each corner.'}},
    {'id': 'p4', 'level': 2, 'ref': SQUARE, 'rules': {'maxBlocks': 3, 'repeat': 1},
     'es': {'title': 'Cuadrado en tres bloques', 'goal': 'El mismo cuadrado, ahora con tres bloques como máximo.', 'limits': ['Máximo 3 bloques', 'Con un bucle'], 'tip': 'Un «repetir» con dos órdenes dentro cuenta como tres bloques.'},
     'en': {'title': 'Square in three blocks', 'goal': 'The same square, now with three blocks at most.', 'limits': ['3 blocks at most', 'With a loop'], 'tip': 'A “repeat” with two instructions inside counts as three blocks.'}},
    {'id': 'p5', 'level': 2, 'ref': 'repetir 5 {\n avanzar 150\n derecha 144\n}', 'rules': {'maxBlocks': 3, 'repeat': 1},
     'es': {'title': 'Estrella de cinco puntas', 'goal': 'Una estrella de cinco puntas con lados de 150, sin levantar el lápiz.', 'limits': ['Máximo 3 bloques'], 'tip': 'Al terminar, la tortuga ha dado dos vueltas completas: 720 grados entre 5 giros.'},
     'en': {'title': 'Five-pointed star', 'goal': 'A five-pointed star with sides of 150, without lifting the pen.', 'limits': ['3 blocks at most'], 'tip': 'By the end, the turtle has turned round twice: 720 degrees over 5 turns.'}},
    {'id': 'p6', 'level': 2, 'ref': 'repetir 12 {\n avanzar 40\n derecha 30\n}', 'rules': {'maxBlocks': 3, 'repeat': 1},
     'es': {'title': 'Dodecágono', 'goal': 'Un polígono de 12 lados de 40 pasos.', 'limits': ['Máximo 3 bloques'], 'tip': 'Una vuelta entera son 360 grados. Repártelos entre los lados.'},
     'en': {'title': 'Dodecagon', 'goal': 'A 12-sided polygon with sides of 40 steps.', 'limits': ['3 blocks at most'], 'tip': 'A full turn is 360 degrees. Share it out between the sides.'}},
    {'id': 'p7', 'level': 3, 'ref': 'lado = 10\nrepetir 20 {\n avanzar lado\n derecha 90\n lado = lado + 10\n}', 'rules': {'vars': 1, 'repeat': 1},
     'es': {'title': 'Espiral cuadrada', 'goal': 'Una espiral de 20 lados: el primero mide 10 y cada uno mide 10 más que el anterior.', 'limits': ['Con una variable', 'Con un bucle'], 'tip': 'Guarda el largo en una variable y súmale 10 después de cada lado.'},
     'en': {'title': 'Square spiral', 'goal': 'A 20-sided spiral: the first side is 10 and each side is 10 longer than the one before.', 'limits': ['With a variable', 'With a loop'], 'tip': 'Keep the length in a variable and add 10 after each side.'}},
    {'id': 'p8', 'level': 3, 'rules': {'vars': 1, 'repeat': 1, 'log': [str(7 * n) for n in range(1, 11)]},
     'es': {'title': 'La tabla del 7', 'goal': 'Escribe en «Salida» la tabla del 7: 7, 14, 21… hasta 70. Solo los resultados, uno por línea.', 'limits': ['Con una variable', 'Con un bucle'], 'tip': 'escribir n * 7'},
     'en': {'title': 'The 7 times table', 'goal': 'Print the 7 times table under “Output”: 7, 14, 21… up to 70. Just the results, one per line.', 'limits': ['With a variable', 'With a loop'], 'tip': 'print n * 7'}},
    {'id': 'p9', 'level': 3,
     'es': {'title': '¡Zas!', 'goal': 'Escribe los números del 1 al 20, pero en lugar de cada múltiplo de 3 escribe ¡zas!', 'limits': ['Con una decisión (si)', 'Con un bucle'], 'tip': 'n % 3 es el resto de dividir entre 3. Si es 0, es múltiplo.', 'rules': {'ifs': 1, 'repeat': 1, 'log': FIZZ_ES}},
     'en': {'title': 'Zap!', 'goal': 'Print the numbers from 1 to 20, but instead of each multiple of 3 print zap!', 'limits': ['With a decision (if)', 'With a loop'], 'tip': 'n % 3 is the remainder after dividing by 3. If it is 0, it is a multiple.', 'rules': {'ifs': 1, 'repeat': 1, 'log': FIZZ_EN}}},
    {'id': 'p10', 'level': 4, 'ref': 'funcion poligono(lados, tam) {\n repetir lados {\n  avanzar tam\n  derecha 360 / lados\n }\n}\npoligono(3, 80)\npoligono(4, 80)\npoligono(5, 80)\npoligono(6, 80)', 'rules': {'funcParams': 2, 'calls': 4},
     'es': {'title': 'Una función para todos los polígonos', 'goal': 'Crea una función con dos parámetros, lados y tamaño, y úsala para dibujar un triángulo, un cuadrado, un pentágono y un hexágono de 80, todos desde el mismo punto.', 'limits': ['Una función con 2 parámetros', 'Usada 4 veces'], 'tip': 'El giro en cada esquina es 360 entre el número de lados.'},
     'en': {'title': 'One function for every polygon', 'goal': 'Make a function with two parameters, sides and size, and use it to draw a triangle, a square, a pentagon and a hexagon of 80, all from the same point.', 'limits': ['A function with 2 parameters', 'Used 4 times'], 'tip': 'The turn at each corner is 360 divided by the number of sides.'}},
    {'id': 'p11', 'level': 4, 'ref': 'funcion cuadrado(t) {\n repetir 4 {\n  avanzar t\n  derecha 90\n }\n}\nrepetir 12 {\n cuadrado(80)\n derecha 30\n}', 'rules': {'funcParams': 1, 'repeat': 1},
     'es': {'title': 'Flor de cuadrados', 'goal': 'Doce cuadrados de 80 que giran 30 grados cada vez alrededor del mismo punto.', 'limits': ['Con una función', 'Con un bucle'], 'tip': 'Primero una función cuadrado(t). Luego repítela girando entre cuadrado y cuadrado.'},
     'en': {'title': 'Flower of squares', 'goal': 'Twelve 80-step squares, each turned 30 degrees round the same point.', 'limits': ['With a function', 'With a loop'], 'tip': 'First a function square(t). Then repeat it, turning between one square and the next.'}},
    {'id': 'p12', 'level': 5, 'rules': {'recursion': True, 'minSegs': 31},
     'es': {'title': 'Árbol', 'goal': 'Un árbol en el que cada rama se divide en dos ramas más cortas, hasta que son muy pequeñas. Al menos 31 ramas.', 'limits': ['Una función que se llama a sí misma', 'Al menos 31 trazos'], 'tip': 'rama(t): si t es grande, avanza t, gira, rama(t * 0.7), gira al otro lado, rama(t * 0.7), vuelve a girar y retrocede t. En el programa, los decimales se escriben con punto: 0.7.'},
     'en': {'title': 'Tree', 'goal': 'A tree where each branch splits into two shorter branches, until they are very small. At least 31 branches.', 'limits': ['A function that calls itself', 'At least 31 lines'], 'tip': 'branch(t): if t is large, go forward t, turn, branch(t * 0.7), turn the other way, branch(t * 0.7), turn back and go back t.'}},
    {'id': 'p13', 'level': 5, 'ref': 'funcion koch(t, n) {\n si n == 0 {\n  avanzar t\n } sino {\n  koch(t / 3, n - 1)\n  izquierda 60\n  koch(t / 3, n - 1)\n  derecha 120\n  koch(t / 3, n - 1)\n  izquierda 60\n  koch(t / 3, n - 1)\n }\n}\nsubir_lapiz\nir_a(-150, 90)\nbajar_lapiz\nrumbo 90\nrepetir 3 {\n koch(300, 3)\n derecha 120\n}', 'rules': {'recursion': True},
     'es': {'title': 'Copo de nieve de Koch', 'goal': 'El copo de Koch de nivel 3: un triángulo de lado 300 que empieza en (-150, 90) mirando a la derecha, en el que cada lado se parte en cuatro tramos una y otra vez.', 'limits': ['Una función que se llama a sí misma', 'Que coincida con la silueta'], 'tip': 'koch(t, n): si n es 0, avanza t. Si no, cuatro veces koch(t / 3, n - 1) con giros de 60, 120 y 60 grados entre medias.'},
     'en': {'title': 'Koch snowflake', 'goal': 'The level-3 Koch snowflake: a triangle with sides of 300 starting at (-150, 90) facing right, where each side splits into four pieces again and again.', 'limits': ['A function that calls itself', 'Match the outline'], 'tip': 'koch(t, n): if n is 0, go forward t. Otherwise, four times koch(t / 3, n - 1) with turns of 60, 120 and 60 degrees in between.'}},
    {'id': 'p14', 'level': 6, 'rules': {'colors': 3, 'minSegs': 100},
     'es': {'title': 'Arte generativo', 'goal': 'Un dibujo que cambie cada vez que lo ejecutas: usa azar() y al menos tres colores. Sin silueta: es tuyo.', 'limits': ['Al menos 3 colores', 'Al menos 100 trazos'], 'tip': 'color "rosa", color "azul"… y giros de azar(10, 170) grados.'},
     'en': {'title': 'Generative art', 'goal': 'A drawing that changes each time you run it: use random() and at least three colours. No outline: it is yours.', 'limits': ['At least 3 colours', 'At least 100 lines'], 'tip': 'colour "pink", colour "blue"… and turns of random(10, 170) degrees.'}},
    {'id': 'p15', 'level': 6, 'rules': {'recursion': True, 'minSegs': 300},
     'es': {'title': 'Tu propio fractal', 'goal': 'Inventa un fractal: una función que se llame a sí misma y dibuje al menos 300 trazos. Pon el nombre en «Título» y guárdalo.', 'limits': ['Una función que se llama a sí misma', 'Al menos 300 trazos'], 'tip': 'Cambia el ángulo o el número de ramas del árbol y mira qué sale.'},
     'en': {'title': 'Your own fractal', 'goal': 'Invent a fractal: a function that calls itself and draws at least 300 lines. Put its name in “Title” and save it.', 'limits': ['A function that calls itself', 'At least 300 lines'], 'tip': 'Change the angle or the number of branches in the tree and see what happens.'}},
]

STRINGS = {
    'es': dict(C['es'], **{
        'pCanvasLabel': 'Lienzo de la tortuga', 'pExportPng': 'Guardar PNG', 'pNewDone': 'Programa nuevo', 'pOutput': 'Salida', 'pProgram': 'Programa', 'pTitle': 'Título',
        'pGhost': 'Mostrar la silueta del reto', 'pGrid': 'Mostrar la cuadrícula',
        'pKTab': 'Recorre los bloques, sus campos y sus botones', 'pKEnter': 'En un campo, confirma el valor; en un botón, lo pulsa',
        'pErrTooManyLines': 'demasiadas líneas dibujadas (más de 60.000)', 'pErrColor': 'no conozco el color «{c}». Prueba azul, rojo, verde, naranja, violeta, rosa, amarillo, gris, marrón, negro o un código como #1f5f8b',
        'pDone': 'Programa terminado: {n} trazos', 'pAltTitle': 'Qué hay en el lienzo', 'pAltEmpty': 'Todavía no hay nada dibujado.',
        'pAltText': '{n} trazos. Ocupan {w} × {h} pasos, con {c} colores. La tortuga ha recorrido {d} pasos.',
        'pTurtleAt': 'La tortuga está en x {x}, y {y}, mirando a {hd} grados, con el lápiz {pen}.', 'pPenDown': 'bajado', 'pPenUp': 'subido',
        'pGhostInfo': 'La silueta del reto tiene {n} trazos.', 'pLoadStart': 'Cargar el programa inicial', 'pStartConfirm': 'Esto sustituye tu programa. Puedes deshacerlo. ¿Seguir?', 'pStartLoaded': 'Programa inicial cargado',
        'pChkShape': 'El dibujo coincide con la silueta', 'pChkMaxBlocks': 'Bloques: {n} (máximo {m})', 'pChkLoop': 'Usa un bucle', 'pChkVars': 'Variables: {n} (mínimo {m})',
        'pChkFunc': 'Una función con {m} parámetros o más', 'pChkCalls': 'Usos de funciones: {n} (mínimo {m})', 'pChkRecursion': 'Una función se llama a sí misma',
        'pChkMinSegs': 'Trazos: {n} (mínimo {m})', 'pChkLog': 'La salida tiene las {n} líneas esperadas, en orden', 'pChkColors': 'Colores: {n} (mínimo {m})', 'pChkIf': 'Usa una decisión (si)',
        'pCheckOk': 'Reto cumplido.', 'pCheckSome': 'Así va el reto. Cambia lo que haga falta y vuelve a ejecutar.',
        'pMadeIn': 'hecho en el Taller', 'pUntitled': 'Sin título',
        'pStarter': '# Tu primer programa. Pulsa «Ejecutar».\navanzar 100\nderecha 90\navanzar 50',
    }),
    'en': dict(C['en'], **{
        'pCanvasLabel': 'Turtle canvas', 'pExportPng': 'Save PNG', 'pNewDone': 'New program', 'pOutput': 'Output', 'pProgram': 'Program', 'pTitle': 'Title',
        'pGhost': 'Show the challenge outline', 'pGrid': 'Show the grid',
        'pKTab': 'Moves through the blocks, their fields and their buttons', 'pKEnter': 'In a field, confirms the value; on a button, presses it',
        'pErrTooManyLines': 'too many lines drawn (over 60,000)', 'pErrColor': 'I do not know the colour “{c}”. Try blue, red, green, orange, violet, pink, yellow, grey, brown, black or a code such as #1f5f8b',
        'pDone': 'Program finished: {n} lines', 'pAltTitle': 'What is on the canvas', 'pAltEmpty': 'Nothing has been drawn yet.',
        'pAltText': '{n} lines. They take up {w} × {h} steps, with {c} colours. The turtle has travelled {d} steps.',
        'pTurtleAt': 'The turtle is at x {x}, y {y}, facing {hd} degrees, with the pen {pen}.', 'pPenDown': 'down', 'pPenUp': 'up',
        'pGhostInfo': 'The challenge outline has {n} lines.', 'pLoadStart': 'Load the starting program', 'pStartConfirm': 'This replaces your program. You can undo it. Carry on?', 'pStartLoaded': 'Starting program loaded',
        'pChkShape': 'The drawing matches the outline', 'pChkMaxBlocks': 'Blocks: {n} (at most {m})', 'pChkLoop': 'Uses a loop', 'pChkVars': 'Variables: {n} (at least {m})',
        'pChkFunc': 'A function with {m} or more parameters', 'pChkCalls': 'Function uses: {n} (at least {m})', 'pChkRecursion': 'A function calls itself',
        'pChkMinSegs': 'Lines: {n} (at least {m})', 'pChkLog': 'The output has the {n} expected lines, in order', 'pChkColors': 'Colours: {n} (at least {m})', 'pChkIf': 'Uses a decision (if)',
        'pCheckOk': 'Challenge done.', 'pCheckSome': 'Here is how the challenge is going. Change what you need and run it again.',
        'pMadeIn': 'made in the Workshop', 'pUntitled': 'Untitled',
        'pStarter': '# Your first program. Press “Run”.\nforward 100\nright 90\nforward 50',
    }),
}
assert set(STRINGS['es']) == set(STRINGS['en'])

PAGE = {
    'es': {
        'title': 'Estudio de programación',
        'description': 'Programa una tortuga que dibuja con un lenguaje propio en español o en inglés: bloques que se ven como texto, bucles, variables, funciones y recursividad.',
        'lede': 'Programa una tortuga que dibuja. Con bloques o escribiendo: los dos son el mismo programa. Empieza con un cuadrado y sube hasta los fractales.',
        'pills': ['Bloques y texto', 'Español o inglés', 'Paso a paso', 'Bucles, variables y funciones', 'Recursividad', '15 retos en 6 niveles', 'Teclado completo'],
        'steps': [
            'Elige un reto o empieza en modo libre. La silueta violeta enseña lo que hay que dibujar.',
            'Añade bloques con los botones «+», o cambia a «Texto» y escribe el programa.',
            'Pulsa «Ejecutar». Con «Paso a paso» ves qué hace cada orden: el bloque en marcha se resalta.',
            'Si algo falla, el mensaje dice en qué línea y por qué.',
            'Guarda el programa en un archivo o el dibujo en PNG.',
        ],
        'sections': [
            {'h': 'El lenguaje', 'p': 'Es un lenguaje propio del Taller. Se entiende en español y en inglés, así que un programa escrito en un idioma funciona en el otro. La tortuga empieza en el centro, en (0, 0), mirando hacia arriba; el lienzo va de -300 a 300 en cada dirección.',
             'li': [code + ': ' + what for code, what in LANG_REF['es']] + ['Colores: azul, rojo, verde, naranja, violeta, rosa, amarillo, gris, marrón, negro o un código como "#1f5f8b". Otras órdenes: subir_lapiz, bajar_lapiz, grosor 5, ir_a(x, y), rumbo 90, centro, circulo 50. Para saber dónde está: posx(), posy(), direccion().']},
        ],
        'links': [('Estudio de robótica: el mismo lenguaje para mover un robot', '/es/taller/robotica/'), ('Estudio de dibujo', '/es/taller/dibujo/'), ('Estudio de estructuras', '/es/taller/estructuras/'), ('Volver al Taller', '/es/taller/')],
        'credits': 'Estudio de programación de Iris Green. Intérprete propio: el texto nunca se ejecuta como código del navegador.',
    },
    'en': {
        'title': 'Coding studio',
        'description': 'Program a drawing turtle with our own language in English or Spanish: blocks you can see as text, loops, variables, functions and recursion.',
        'lede': 'Program a turtle that draws. With blocks or by typing: both are the same program. Start with a square and work up to fractals.',
        'pills': ['Blocks and text', 'English or Spanish', 'Step by step', 'Loops, variables and functions', 'Recursion', '15 challenges on 6 levels', 'Full keyboard use'],
        'steps': [
            'Pick a challenge or start in free mode. The violet outline shows what to draw.',
            'Add blocks with the “+” buttons, or switch to “Text” and type the program.',
            'Press “Run”. With “Step by step” you see what each instruction does: the running block is highlighted.',
            'If something goes wrong, the message says which line and why.',
            'Save the program to a file or the drawing as a PNG.',
        ],
        'sections': [
            {'h': 'The language', 'p': 'It is the Workshop’s own language. It understands English and Spanish, so a program written in one language works in the other. The turtle starts in the middle, at (0, 0), facing up; the canvas runs from -300 to 300 in each direction.',
             'li': [code + ': ' + what for code, what in LANG_REF['en']] + ['Colours: blue, red, green, orange, violet, pink, yellow, grey, brown, black or a code such as "#1f5f8b". Other instructions: penup, pendown, width 5, goto(x, y), setheading 90, home, circle 50. To find out where it is: xcor(), ycor(), heading().']},
        ],
        'links': [('Robotics studio: the same language to drive a robot', '/en/workshop/robotics/'), ('Drawing studio', '/en/workshop/drawing/'), ('Structures studio', '/en/workshop/structures/'), ('Back to the workshop', '/en/workshop/')],
        'credits': 'Iris Green coding studio. Our own interpreter: the text is never run as browser code.',
    },
}
