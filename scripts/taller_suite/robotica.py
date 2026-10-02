"""Estudio de robótica (R43): gemelo digital programable. Textos ES/EN."""
from taller_suite import codigo_comun

ENGINE = 'robotica'
SLUG = {'es': 'robotica', 'en': 'robotics'}
SCRIPTS = ['ig-suite-physics.js', 'ig-suite-codigo.js', 'ig-suite-robotica.js']
LIBRARIES = 'Blockly (Apache 2.0), CodeMirror (MIT), acorn (MIT), PixiJS (MIT) y Rapier (Apache 2.0) o Planck.js (MIT)'
LIBRARIES_EN = 'Blockly (Apache 2.0), CodeMirror (MIT), acorn (MIT), PixiJS (MIT) and Rapier (Apache 2.0) or Planck.js (MIT)'

PAGE = {
    'es': {
        'title': 'Robótica',
        'description': 'Programa un robot de dos ruedas con bloques o JavaScript y pruébalo en su gemelo digital: sigue líneas, esquiva obstáculos, sale de laberintos. Exporta el programa para un robot real.',
        'lede': 'Un robot de verdad, pero en la pantalla: dos motores, sensor de distancia, dos sensores de línea, sensor de color, parachoques, luz y zumbador. Lo programas con bloques o con JavaScript y se mueve con física real.',
        'make': ['Un seguidor de línea', 'Un robot que esquiva obstáculos', 'Un robot que sale de un laberinto', 'Tus propias pistas y arenas', 'El programa en JavaScript y un borrador en Python para un robot real'],
        'steps': [
            'Monta el programa con bloques (izquierda). Los bloques de Motores mueven el robot; los de Sensores dicen lo que ve.',
            'Pulsa Ejecutar y mira el robot en la arena (derecha). El panel Propiedades muestra en directo lo que miden sus sensores.',
            'Con el programa parado puedes cambiar la arena: mueve el robot, añade paredes, cajas, líneas y zonas de color.',
            'Si el robot no hace lo que esperabas, mira qué bloque se ilumina y qué dicen los sensores en ese momento.',
            'Exporta el programa en JavaScript o el borrador en Python para adaptarlo a un robot real.',
        ],
        'sections': [
            {'h': 'Cómo es el robot', 'p': 'Mide 16 × 14 cm y tiene dos ruedas con motor, una a cada lado. Si las dos giran igual, va recto; si una gira más, tuerce. El sensor de distancia mira hacia delante hasta 2 metros. Los dos sensores de línea están delante, uno a cada lado, y detectan una línea negra en el suelo. El sensor de color lee el suelo bajo el centro del robot.'},
            {'h': 'Gemelo digital', 'p': 'Un gemelo digital es una copia en el ordenador que se comporta como el objeto real. Aquí el robot tiene masa, choca con las paredes y empuja las cajas gracias a un motor físico. Probar primero en el gemelo ahorra tiempo y piezas.'},
            {'h': 'Del gemelo a un robot real', 'p': 'El borrador en Python usa las mismas instrucciones: motores, distancia, línea izquierda… Para una placa concreta hay que escribir esas instrucciones con la biblioteca de la placa. El taller no se conecta a ningún robot ni envía datos.'},
        ],
        'links': [('Todo el taller', '/es/taller/'), ('Programación', '/es/taller/programacion/'), ('Circuitos', '/es/taller/circuitos/')],
    },
    'en': {
        'title': 'Robotics',
        'description': 'Program a two-wheeled robot with blocks or JavaScript and test it on its digital twin: follow lines, avoid obstacles, escape mazes. Export the program for a real robot.',
        'lede': 'A real robot, but on the screen: two motors, a distance sensor, two line sensors, a colour sensor, a bumper, a light and a buzzer. You program it with blocks or JavaScript and it moves with real physics.',
        'make': ['A line follower', 'A robot that avoids obstacles', 'A robot that gets out of a maze', 'Your own tracks and arenas', 'The program in JavaScript and a Python draft for a real robot'],
        'steps': [
            'Build the program with blocks (left). Motors blocks move the robot; Sensors blocks tell you what it detects.',
            'Press Run and watch the robot in the arena (right). The Properties panel shows live what its sensors measure.',
            'While the program is stopped you can change the arena: move the robot, add walls, boxes, lines and coloured zones.',
            'If the robot does not do what you expected, watch which block lights up and what the sensors say at that moment.',
            'Export the program in JavaScript or the Python draft to adapt it for a real robot.',
        ],
        'sections': [
            {'h': 'What the robot is like', 'p': 'It measures 16 × 14 cm and has two motorised wheels, one on each side. If both turn the same, it goes straight; if one turns more, it turns. The distance sensor looks ahead up to 2 metres. The two line sensors are at the front, one on each side, and detect a black line on the floor. The colour sensor reads the floor under the centre of the robot.'},
            {'h': 'Digital twin', 'p': 'A digital twin is a copy on the computer that behaves like the real object. Here the robot has mass, hits walls and pushes boxes thanks to a physics engine. Testing on the twin first saves time and parts.'},
            {'h': 'From the twin to a real robot', 'p': 'The Python draft uses the same instructions: motors, distance, line left… For a specific board you need to write those instructions with that board’s library. The workshop does not connect to any robot or send any data.'},
        ],
        'links': [('The whole workshop', '/en/workshop/'), ('Coding', '/en/workshop/coding/'), ('Circuits', '/en/workshop/circuits/')],
    },
}

STRINGS = {
    'es': {
        'canvasLabel': 'Arena del robot', 'canvasHelp': 'Con el programa parado, las flechas mueven lo elegido en la lista Arena (el robot, si no hay nada elegido) y Supr lo borra. Mientras se ejecuta, las teclas llegan al programa y Esc lo para.',
        'kRun': 'Ctrl/Cmd + Intro: ejecutar · Esc en la arena: parar', 'kArena': 'En la arena, con el programa parado: flechas para mover lo elegido; Supr para borrarlo',
        'startFree': 'Arena libre', 'startFreeDesc': 'Una arena vacía con una zona verde. El robot avanza, gira y pita.',
        'startSquare': 'Un cuadrado', 'startSquareDesc': 'El robot recorre un cuadrado con un bucle. ¿Sale exacto?',
        'startLine': 'Sigue la línea', 'startLineDesc': 'Un circuito ovalado y un programa con dos sensores de línea. Hazlo más rápido.',
        'startAvoid': 'Esquiva obstáculos', 'startAvoidDesc': 'El sensor de distancia detecta paredes y el robot cambia de rumbo.',
        'startMaze': 'Sal del laberinto', 'startMazeDesc': 'Paredes, un programa que las sigue y una salida verde. Mejora la estrategia.',
        'startClean': 'Robot limpiador', 'startCleanDesc': 'Cuatro cajas dentro de un círculo. Sácalas empujándolas.',
        'displayLog': 'Pantalla del robot: {text}', 'error': 'Aviso',
        'running': 'Ejecutando.', 'looseBlocks': 'Hay {n} bloques sueltos que no cuelgan de ningún suceso: no se ejecutan.', 'stopped': 'Programa parado.', 'resetDone': 'Robot en su posición de salida.',
        'robotAt': 'Robot a {x} cm del borde izquierdo y {y} cm del borde inferior, mirando a {dir} grados, sobre {colour}.',
        'boxAdded': 'Caja añadida.', 'zoneAdded': 'Zona de color añadida.', 'wallAdded': 'Pared añadida.', 'lineAdded': 'Línea añadida.', 'lineRemoved': 'Línea borrada.', 'movedObj': 'Movido: {name}',
        'robot': 'Robot', 'boxN': 'Caja {n}', 'wallN': 'Pared {n}', 'zoneN': 'Zona {n} ({c})',
        'logEmpty': 'Aquí aparece lo que muestra la pantalla del robot y los avisos.',
        'sDistance': 'Distancia', 'sLineL': 'Línea izquierda', 'sLineR': 'Línea derecha', 'sColour': 'Color del suelo', 'sCompass': 'Brújula', 'sMotors': 'Motores',
        'yes': 'sí', 'no': 'no', 'arena': 'Arena', 'linesCount': 'Líneas en el suelo: {n}. Para borrar una, usa Borrar y toca la línea.',
        'startDir': 'Dirección de salida', 'robotHelp': 'Arrastra el robot o usa las flechas para cambiar su posición de salida.',
        'zoneColour': 'Color de la zona', 'width': 'Ancho', 'height': 'Alto', 'remove': 'Quitar', 'sensors': 'Sensores', 'output': 'Salida', 'variables': 'Variables',
        'arenaSummary': 'En la arena hay {w} paredes, {b} cajas, {l} líneas y {z} zonas de color.', 'codeChanged': 'Programa cambiado',
        'run': 'Ejecutar', 'stop': 'Parar', 'reset': 'Volver a la salida',
        'toolMove': 'Mover', 'toolWall': 'Pared', 'toolBox': 'Caja', 'toolLine': 'Línea', 'toolZone': 'Zona', 'toolErase': 'Borrar',
        'exportJs': 'Exportar el programa (JavaScript)', 'exportPy': 'Exportar borrador para robot real (Python)', 'exportPng': 'Exportar la arena (PNG)',
    },
    'en': {
        'canvasLabel': 'Robot arena', 'canvasHelp': 'While the program is stopped, the arrow keys move whatever is chosen in the Arena list (the robot, if nothing is chosen) and Delete removes it. While it runs, keys go to the program and Esc stops it.',
        'kRun': 'Ctrl/Cmd + Enter: run · Esc in the arena: stop', 'kArena': 'In the arena, while stopped: arrow keys move the chosen item; Delete removes it',
        'startFree': 'Open arena', 'startFreeDesc': 'An empty arena with a green zone. The robot drives, turns and beeps.',
        'startSquare': 'A square', 'startSquareDesc': 'The robot drives round a square with a loop. Is it exact?',
        'startLine': 'Follow the line', 'startLineDesc': 'An oval track and a program with two line sensors. Make it faster.',
        'startAvoid': 'Avoid obstacles', 'startAvoidDesc': 'The distance sensor detects walls and the robot changes course.',
        'startMaze': 'Escape the maze', 'startMazeDesc': 'Walls, a program that follows them and a green exit. Improve the strategy.',
        'startClean': 'Cleaning robot', 'startCleanDesc': 'Four boxes inside a circle. Push them out.',
        'displayLog': 'Robot display: {text}', 'error': 'Warning',
        'running': 'Running.', 'looseBlocks': 'There are {n} loose blocks not attached to any event: they do not run.', 'stopped': 'Program stopped.', 'resetDone': 'Robot back at its starting position.',
        'robotAt': 'Robot {x} cm from the left edge and {y} cm from the bottom edge, facing {dir} degrees, on {colour}.',
        'boxAdded': 'Box added.', 'zoneAdded': 'Coloured zone added.', 'wallAdded': 'Wall added.', 'lineAdded': 'Line added.', 'lineRemoved': 'Line removed.', 'movedObj': 'Moved: {name}',
        'robot': 'Robot', 'boxN': 'Box {n}', 'wallN': 'Wall {n}', 'zoneN': 'Zone {n} ({c})',
        'logEmpty': 'What the robot display shows and any warnings appear here.',
        'sDistance': 'Distance', 'sLineL': 'Left line', 'sLineR': 'Right line', 'sColour': 'Floor colour', 'sCompass': 'Compass', 'sMotors': 'Motors',
        'yes': 'yes', 'no': 'no', 'arena': 'Arena', 'linesCount': 'Lines on the floor: {n}. To remove one, use Delete and tap the line.',
        'startDir': 'Starting direction', 'robotHelp': 'Drag the robot or use the arrow keys to change where it starts.',
        'zoneColour': 'Zone colour', 'width': 'Width', 'height': 'Height', 'remove': 'Remove', 'sensors': 'Sensors', 'output': 'Output', 'variables': 'Variables',
        'arenaSummary': 'The arena has {w} walls, {b} boxes, {l} lines and {z} coloured zones.', 'codeChanged': 'Program changed',
        'run': 'Run', 'stop': 'Stop', 'reset': 'Back to start',
        'toolMove': 'Move', 'toolWall': 'Wall', 'toolBox': 'Box', 'toolLine': 'Line', 'toolZone': 'Zone', 'toolErase': 'Delete',
        'exportJs': 'Export the program (JavaScript)', 'exportPy': 'Export a draft for a real robot (Python)', 'exportPng': 'Export the arena (PNG)',
    },
}
for _l in ('es', 'en'):
    STRINGS[_l].update(codigo_comun.STRINGS[_l])
assert set(STRINGS['es']) == set(STRINGS['en'])
