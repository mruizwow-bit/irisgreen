"""Síntesis y paisajes sonoros (R43): el estudio de música empezando por el diseño de sonido. Textos ES/EN."""
from taller_suite import musica_comun as M

ENGINE = 'musica'
MODE = 'synth'
SLUG = {'es': 'sintesis-sonido', 'en': 'synthesis-soundscapes'}
SCRIPTS = M.SCRIPTS
LIBRARIES, LIBRARIES_EN = M.LIBRARIES, M.LIBRARIES_EN
STRINGS = M.STRINGS

PAGE = {
    'es': {
        'title': 'Síntesis y paisajes sonoros',
        'description': 'Diseña sonidos desde cero: formas de onda, filtro, envolvente que se dibuja arrastrando, síntesis FM y AM, ruido para viento y mar, reverberación y eco. Exporta en WAV y MIDI.',
        'lede': 'Aquí el instrumento lo haces tú. Elige una onda, dibuja su envolvente, cierra el filtro, añade espacio. Escucha cada cambio al momento mientras suena la secuencia.',
        'make': ['Instrumentos propios (bajos, colchones, campanas, solistas)', 'Paisajes sonoros con ruido filtrado', 'Un WAV con tu sonido'],
        'steps': [
            'Pulsa Reproducir: la secuencia suena en bucle mientras cambias el sonido.',
            'En Propiedades, la sección Instrumento tiene la forma de onda, la envolvente, el filtro y los efectos. Mueve cualquier control y escucha el cambio.',
            'Dibuja la envolvente arrastrando sus tres puntos, o escribe los valores en los campos de debajo.',
            'Activa «Tocar con el teclado» para probar el sonido con las teclas del ordenador.',
            'Exporta el resultado en WAV desde Archivo.',
        ],
        'sections': [
            {'h': 'Qué es cada parte', 'p': 'La forma de onda da el color básico: la senoidal es suave; la de sierra, brillante. La envolvente dice cómo empieza y cómo termina el sonido: ataque, caída, sostenido y final. El filtro quita los agudos por encima de la frecuencia de corte; la resonancia refuerza justo esa frecuencia.\n\nEn la síntesis FM una onda cambia muy deprisa la frecuencia de otra: así salen campanas y sonidos metálicos. El ruido rosa filtrado se parece al viento o al mar.'},
        ] + M.section_common('es'),
        'links': [('Todo el taller', '/es/taller/'), ('Composición', '/es/taller/composicion/'), ('Ritmo y secuenciador', '/es/taller/ritmo/')],
    },
    'en': {
        'title': 'Synthesis and soundscapes',
        'description': 'Design sounds from scratch: waveforms, filter, an envelope you shape by dragging, FM and AM synthesis, noise for wind and sea, reverb and echo. Export as WAV and MIDI.',
        'lede': 'Here you make the instrument. Pick a wave, draw its envelope, close the filter, add space. Hear every change at once while the sequence plays.',
        'make': ['Your own instruments (basses, pads, bells, leads)', 'Soundscapes with filtered noise', 'A WAV with your sound'],
        'steps': [
            'Press Play: the sequence loops while you change the sound.',
            'Under Properties, the Instrument section has the waveform, envelope, filter and effects. Move any control and hear the change.',
            'Shape the envelope by dragging its three points, or type the values in the fields below it.',
            'Turn on “Play with the keyboard” to try the sound with the computer keys.',
            'Export the result as WAV from File.',
        ],
        'sections': [
            {'h': 'What each part does', 'p': 'The waveform gives the basic colour: a sine is soft; a sawtooth is bright. The envelope says how the sound starts and ends: attack, decay, sustain and release. The filter removes treble above the cutoff frequency; resonance boosts that very frequency.\n\nIn FM synthesis one wave changes another wave’s frequency very fast: that is how bells and metallic sounds are made. Filtered pink noise sounds like wind or the sea.'},
        ] + M.section_common('en'),
        'links': [('The whole workshop', '/en/workshop/'), ('Composition', '/en/workshop/composition/'), ('Rhythm and sequencer', '/en/workshop/rhythm-sequencer/')],
    },
}
