"""Estudio de programación (R43): bloques ↔ JavaScript ↔ escenario. Textos ES/EN."""
from taller_suite import codigo_comun

ENGINE = 'programacion'
SLUG = {'es': 'programacion', 'en': 'coding'}
SCRIPTS = ['ig-suite-physics.js', 'ig-suite-codigo.js', 'ig-suite-programacion.js']
LIBRARIES = 'Blockly (Apache 2.0), CodeMirror (MIT), acorn (MIT), PixiJS (MIT) y, si se activa la física, Rapier (Apache 2.0) o Planck.js (MIT)'
LIBRARIES_EN = 'Blockly (Apache 2.0), CodeMirror (MIT), acorn (MIT), PixiJS (MIT) and, when physics is turned on, Rapier (Apache 2.0) or Planck.js (MIT)'

PAGE = {
    'es': {
        'title': 'Programación',
        'description': 'Programa con bloques o con JavaScript y mira el resultado al momento: personajes que se mueven, dibujan, suenan y obedecen a la física. Los bloques y el código están siempre sincronizados.',
        'lede': 'Bloques, código y resultado a la vez. Monta un programa con bloques y verás el mismo programa en JavaScript y en Python; escribe JavaScript y se convierte en bloques. Pulsa Ejecutar y el escenario lo hace.',
        'make': ['Dibujos y arte generativo con el lápiz', 'Animaciones y pequeños juegos con teclado', 'Música sencilla con notas', 'Tu programa en JavaScript (.js) y en Python (.py), y una imagen del escenario'],
        'steps': [
            'A la izquierda está el programa. Arrastra bloques desde las categorías al área de trabajo y encájalos debajo de un bloque de suceso, como «al pulsar Ejecutar».',
            'En la pestaña JavaScript ves el mismo programa escrito como código. Puedes escribir allí: al volver a Bloques, el código se convierte en bloques.',
            'Pulsa Ejecutar. Los personajes del escenario hacen lo que dice el programa. Parar lo detiene; Volver al inicio los devuelve a su sitio.',
            'Cada personaje tiene sus propios guiones. Elígelo en la lista Estructura o tocándolo en el escenario, y cambia su nombre, forma o color en Propiedades.',
            'Guarda el proyecto o exporta el programa como archivo .js o .py.',
        ],
        'sections': [
            {'h': 'Bloques y código son lo mismo', 'p': 'Cada bloque es una instrucción de JavaScript. «repetir 10 veces» es un bucle for; «si … entonces» es un if; «esperar 1 segundos» es esperar(1). Mirar las dos vistas a la vez ayuda a pasar de los bloques al código escrito.\n\nNo todo lo que se puede escribir en JavaScript tiene bloque. Si escribes algo que no se puede convertir, el taller te dice en qué línea está y por qué.'},
            {'h': 'Varios guiones a la vez', 'p': 'Cada suceso empieza un guion. Los guiones funcionan a la vez: uno puede mover a un personaje mientras otro cuenta puntos. Los bucles ceden el turno en cada vuelta, así el escenario no se congela aunque un bucle no termine nunca.'},
            {'h': 'Física opcional', 'p': 'Con «activar física» un personaje cae, choca con los bordes y rebota. «fijar en su sitio» lo convierte en suelo o pared para los demás.'},
        ],
        'links': [('Todo el taller', '/es/taller/'), ('Robótica', '/es/taller/robotica/'), ('Estructuras y puentes', '/es/taller/estructuras/')],
    },
    'en': {
        'title': 'Coding',
        'description': 'Code with blocks or with JavaScript and see the result straight away: sprites that move, draw, play sounds and follow physics. Blocks and code always stay in sync.',
        'lede': 'Blocks, code and result together. Build a program with blocks and you will see the same program in JavaScript and in Python; type JavaScript and it turns into blocks. Press Run and the stage does it.',
        'make': ['Drawings and generative art with the pen', 'Animations and small keyboard games', 'Simple music with notes', 'Your program in JavaScript (.js) and Python (.py), and an image of the stage'],
        'steps': [
            'The program is on the left. Drag blocks from the categories onto the workspace and snap them under an event block, such as “when Run is pressed”.',
            'The JavaScript tab shows the same program written as code. You can type there: when you go back to Blocks, the code turns into blocks.',
            'Press Run. The sprites on the stage do what the program says. Stop halts it; Back to start puts them back where they were.',
            'Each sprite has its own scripts. Choose it in the Structure list or by tapping it on the stage, and change its name, shape or colour under Properties.',
            'Save the project, or export the program as a .js or .py file.',
        ],
        'sections': [
            {'h': 'Blocks and code are the same thing', 'p': 'Each block is a JavaScript instruction. “repeat 10 times” is a for loop; “if … then” is an if; “wait 1 seconds” is wait(1). Looking at both views at once helps you move from blocks to written code.\n\nNot everything you can write in JavaScript has a block. If you write something that cannot be converted, the workshop tells you which line it is on and why.'},
            {'h': 'Several scripts at once', 'p': 'Each event starts a script. Scripts run at the same time: one can move a sprite while another keeps score. Loops give way on every turn, so the stage never freezes even if a loop never ends.'},
            {'h': 'Optional physics', 'p': 'With “turn on physics” a sprite falls, hits the edges and bounces. “fix in place” turns it into a floor or wall for the others.'},
        ],
        'links': [('The whole workshop', '/en/workshop/'), ('Robotics', '/en/workshop/robotics/'), ('Structures and bridges', '/en/workshop/structures/')],
    },
}

STRINGS = {
    'es': {
        'canvasLabel': 'Escenario', 'canvasHelp': 'Con el programa parado, las flechas mueven el personaje elegido. Mientras se ejecuta, las teclas llegan al programa. Ctrl o Cmd + Intro ejecuta.',
        'kRun': 'Ctrl/Cmd + Intro: ejecutar', 'kStageKeys': 'En el escenario, mientras se ejecuta: las teclas llegan al programa (flechas, espacio, a, d, s, w, intro)',
        'startHello': 'Hola, programa', 'startHelloDesc': 'Un personaje saluda y recorre un cuadrado. Cambia los números y vuelve a ejecutar.',
        'startStar': 'Dibuja una estrella', 'startStarDesc': 'El lápiz dibuja una estrella con un bucle. ¿Y si giras 72 grados?',
        'startCatch': 'Atrapa la pelota', 'startCatchDesc': 'Un juego: mueve la cesta con las flechas y cuenta los puntos con una variable.',
        'startBounce': 'Pelota con física', 'startBounceDesc': 'Una pelota cae, rebota en una rampa y salta con la tecla espacio.',
        'startGen': 'Arte generativo', 'startGenDesc': 'Una espiral de colores que sale de una regla sencilla. Prueba otros ángulos.',
        'startMusic': 'Música con notas', 'startMusicDesc': 'Un acorde al empezar y una nota cada vez que tocas el personaje.',
        'running': 'Ejecutando.', 'looseBlocks': 'Hay {n} bloques sueltos que no cuelgan de ningún suceso: no se ejecutan.', 'stopped': 'Programa parado.', 'resetDone': 'Personajes de vuelta a su posición inicial.',
        'movedSprite': 'Movido: {name}', 'spriteAt': '{name} en x {x}, y {y}', 'editingSprite': 'Programando: {name}', 'spriteN': 'Personaje {n}',
        'logEmpty': 'Aquí aparece lo que dicen los personajes y los avisos.', 'sprites': 'Personajes', 'addSprite': 'Añadir personaje', 'duplicate': 'Duplicar',
        'name': 'Nombre', 'nameTaken': 'Ya hay un personaje con ese nombre, o está vacío.', 'renamed': 'Nombre cambiado', 'direction': 'Dirección', 'shape': 'Forma', 'colour': 'Color', 'size': 'Tamaño',
        'deleteSprite': 'Borrar personaje', 'output': 'Salida', 'variables': 'Variables', 'error': 'aviso',
        'spriteSummary': '{name}: {shape} en x {x}, y {y}, dirección {dir} grados.', 'codeChanged': 'Programa cambiado',
        'run': 'Ejecutar', 'stop': 'Parar', 'reset': 'Volver al inicio',
        'exportPng': 'Exportar el escenario (PNG)', 'exportJs': 'Exportar el programa (JavaScript)', 'exportPy': 'Exportar el programa (Python)', 'spriteWord': 'Personaje',
    },
    'en': {
        'canvasLabel': 'Stage', 'canvasHelp': 'While the program is stopped, the arrow keys move the chosen sprite. While it runs, keys go to the program. Ctrl or Cmd + Enter runs it.',
        'kRun': 'Ctrl/Cmd + Enter: run', 'kStageKeys': 'On the stage, while running: keys go to the program (arrows, space, a, d, s, w, enter)',
        'startHello': 'Hello, program', 'startHelloDesc': 'A sprite says hello and goes round a square. Change the numbers and run it again.',
        'startStar': 'Draw a star', 'startStarDesc': 'The pen draws a star with a loop. What if you turn 72 degrees?',
        'startCatch': 'Catch the ball', 'startCatchDesc': 'A game: move the basket with the arrow keys and keep score with a variable.',
        'startBounce': 'Ball with physics', 'startBounceDesc': 'A ball falls, bounces off a ramp and jumps with the space key.',
        'startGen': 'Generative art', 'startGenDesc': 'A colourful spiral that comes from one simple rule. Try other angles.',
        'startMusic': 'Music with notes', 'startMusicDesc': 'A chord at the start and a note every time you tap the sprite.',
        'running': 'Running.', 'looseBlocks': 'There are {n} loose blocks not attached to any event: they do not run.', 'stopped': 'Program stopped.', 'resetDone': 'Sprites back where they started.',
        'movedSprite': 'Moved: {name}', 'spriteAt': '{name} at x {x}, y {y}', 'editingSprite': 'Coding: {name}', 'spriteN': 'Sprite {n}',
        'logEmpty': 'What the sprites say and any warnings appear here.', 'sprites': 'Sprites', 'addSprite': 'Add sprite', 'duplicate': 'Duplicate',
        'name': 'Name', 'nameTaken': 'There is already a sprite with that name, or it is empty.', 'renamed': 'Name changed', 'direction': 'Direction', 'shape': 'Shape', 'colour': 'Colour', 'size': 'Size',
        'deleteSprite': 'Delete sprite', 'output': 'Output', 'variables': 'Variables', 'error': 'warning',
        'spriteSummary': '{name}: {shape} at x {x}, y {y}, direction {dir} degrees.', 'codeChanged': 'Program changed',
        'run': 'Run', 'stop': 'Stop', 'reset': 'Back to start',
        'exportPng': 'Export the stage (PNG)', 'exportJs': 'Export the program (JavaScript)', 'exportPy': 'Export the program (Python)', 'spriteWord': 'Sprite',
    },
}
for _l in ('es', 'en'):
    STRINGS[_l].update(codigo_comun.STRINGS[_l])
assert set(STRINGS['es']) == set(STRINGS['en'])
