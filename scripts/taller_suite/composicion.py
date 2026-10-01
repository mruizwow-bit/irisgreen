"""Composición (R43): el estudio de música con rodillo de piano y arreglo. Textos ES/EN."""
from taller_suite import musica_comun as M

ENGINE = 'musica'
MODE = 'compose'
SLUG = {'es': 'composicion', 'en': 'composition'}
SCRIPTS = M.SCRIPTS
LIBRARIES, LIBRARIES_EN = M.LIBRARIES, M.LIBRARIES_EN
STRINGS = M.STRINGS

PAGE = {
    'es': {
        'title': 'Composición',
        'description': 'Compón con pistas, clips y un rodillo de piano: melodía, acordes, bajo y batería con instrumentos editables y mezcla. Exporta en WAV y MIDI.',
        'lede': 'Un estudio de composición completo en el navegador. Dibuja notas en el rodillo de piano, ordena los clips en la línea de tiempo, mezcla las pistas y escucha el resultado mientras trabajas.',
        'make': ['Una canción con varias pistas', 'Melodías, acordes y líneas de bajo', 'Tu mezcla en WAV y la partitura en MIDI'],
        'steps': [
            'Pulsa Reproducir (o Espacio) para escuchar el ejemplo.',
            'Elige un clip en la línea de tiempo: sus notas aparecen abajo, en el rodillo de piano. Cada fila es una nota; más arriba, más aguda.',
            'Con el Lápiz, toca para poner una nota y arrastra para alargarla. Con Mover, arrastra notas; Mayús + tocar elige varias.',
            'Añade pistas con otros instrumentos en la lista Estructura y ajusta volumen, panorama y sonido en Propiedades.',
            'Exporta el sonido en WAV o la partitura en MIDI desde Archivo.',
        ],
        'sections': [
            {'h': 'Clips y bucles', 'p': 'Un clip es un trozo de música dentro de una pista. Puedes duplicarlo, moverlo o alargarlo. Así una idea de un compás se convierte en una canción entera sin volver a escribirla.'},
        ] + M.section_common('es'),
        'links': [('Todo el taller', '/es/taller/'), ('Ritmo y secuenciador', '/es/taller/ritmo/'), ('Síntesis y paisajes sonoros', '/es/taller/sintesis-sonido/')],
    },
    'en': {
        'title': 'Composition',
        'description': 'Compose with tracks, clips and a piano roll: melody, chords, bass and drums with editable instruments and mixing. Export as WAV and MIDI.',
        'lede': 'A complete composition studio in the browser. Draw notes on the piano roll, arrange clips on the timeline, mix the tracks and hear the result while you work.',
        'make': ['A song with several tracks', 'Melodies, chords and bass lines', 'Your mix as WAV and the score as MIDI'],
        'steps': [
            'Press Play (or Space) to hear the example.',
            'Choose a clip on the timeline: its notes appear below, on the piano roll. Each row is a note; higher up means higher pitch.',
            'With the Pencil, tap to add a note and drag to lengthen it. With Move, drag notes; Shift + tap chooses several.',
            'Add tracks with other instruments in the Structure list and adjust volume, pan and sound under Properties.',
            'Export the sound as WAV or the score as MIDI from File.',
        ],
        'sections': [
            {'h': 'Clips and loops', 'p': 'A clip is a piece of music inside a track. You can duplicate, move or lengthen it. That is how a one-bar idea becomes a whole song without writing it again.'},
        ] + M.section_common('en'),
        'links': [('The whole workshop', '/en/workshop/'), ('Rhythm and sequencer', '/en/workshop/rhythm-sequencer/'), ('Synthesis and soundscapes', '/en/workshop/synthesis-soundscapes/')],
    },
}
