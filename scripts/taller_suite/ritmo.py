"""Ritmo y secuenciador (R43): el estudio de música empezando por la batería. Textos ES/EN."""
from taller_suite import musica_comun as M

ENGINE = 'musica'
MODE = 'rhythm'
SLUG = {'es': 'ritmo', 'en': 'rhythm-sequencer'}
SCRIPTS = M.SCRIPTS
LIBRARIES, LIBRARIES_EN = M.LIBRARIES, M.LIBRARIES_EN
STRINGS = M.STRINGS

PAGE = {
    'es': {
        'title': 'Ritmo y secuenciador',
        'description': 'Crea ritmos tocando casillas: bombo, caja, palmadas, charles y toms en una cuadrícula, con bucle, tempo y mezcla. Exporta el ritmo en WAV y en MIDI.',
        'lede': 'Una caja de ritmos de verdad. Toca las casillas para poner golpes, cambia el tempo y escucha el bucle mientras editas. Añade un bajo o una melodía cuando quieras: es el mismo estudio de música.',
        'make': ['Un ritmo propio en bucle', 'Una base con batería y bajo', 'Un archivo WAV para escuchar y un MIDI para otros programas'],
        'steps': [
            'Pulsa Reproducir (o Espacio). Suena el ritmo del ejemplo en bucle.',
            'En la cuadrícula de abajo, cada fila es un sonido y cada casilla una parte del compás. Con el Lápiz, toca una casilla para poner un golpe; tócala otra vez para quitarlo.',
            'Arriba están las pistas. Arrastra un clip para moverlo y su borde derecho para alargarlo. En la regla, Mayús + arrastrar marca el bucle.',
            'En Propiedades cambias el tempo, la cuadrícula, el volumen y el panorama de cada pista, y la intensidad de cada golpe.',
            'Exporta en WAV o en MIDI desde Archivo.',
        ],
        'sections': [
            {'h': 'Cómo se lee la cuadrícula', 'p': 'Un compás tiene cuatro tiempos. Con la cuadrícula en semicorcheas, cada tiempo se divide en cuatro casillas: dieciséis casillas por compás. El bombo suele caer en los tiempos 1 y 3; la caja, en el 2 y el 4.'},
        ] + M.section_common('es'),
        'links': [('Todo el taller', '/es/taller/'), ('Composición', '/es/taller/composicion/'), ('Síntesis y paisajes sonoros', '/es/taller/sintesis-sonido/')],
    },
    'en': {
        'title': 'Rhythm and sequencer',
        'description': 'Make beats by tapping cells: kick, snare, claps, hi-hats and toms on a grid, with loop, tempo and mixing. Export the beat as WAV and MIDI.',
        'lede': 'A real drum machine. Tap the cells to add hits, change the tempo and hear the loop while you edit. Add a bass or a melody whenever you like: it is the same music studio.',
        'make': ['Your own looping beat', 'A backing track with drums and bass', 'A WAV file to listen to and a MIDI file for other programs'],
        'steps': [
            'Press Play (or Space). The example beat plays in a loop.',
            'In the grid below, each row is a sound and each cell a part of the bar. With the Pencil, tap a cell to add a hit; tap it again to remove it.',
            'The tracks are at the top. Drag a clip to move it and its right edge to lengthen it. On the ruler, Shift + drag sets the loop.',
            'Under Properties you change the tempo, the grid, each track’s volume and pan, and the velocity of each hit.',
            'Export as WAV or MIDI from File.',
        ],
        'sections': [
            {'h': 'How to read the grid', 'p': 'A bar has four beats. With the grid set to sixteenth notes, each beat is split into four cells: sixteen cells per bar. The kick usually falls on beats 1 and 3; the snare on 2 and 4.'},
        ] + M.section_common('en'),
        'links': [('The whole workshop', '/en/workshop/'), ('Composition', '/en/workshop/composition/'), ('Synthesis and soundscapes', '/en/workshop/synthesis-soundscapes/')],
    },
}
