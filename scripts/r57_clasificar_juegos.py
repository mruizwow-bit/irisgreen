#!/usr/bin/env python3
"""R57 · P0 · Reclasificar los 297 juegos por tipo de producto.

Construye la matriz machine-readable que pide la orden R57 §1, a partir de las
dos fuentes que ya existen en el repositorio:

  - `assets/data/juegos-iris-data.js`   mecánica real de cada juego (fases) y
                                        el mapa `links` rutina→juego.
  - `assets/data/r42-games-metadata.json`  títulos ES/EN, contexto, etapas,
                                        habilidad y linaje de los 297.

No escribe en ninguna de las dos. No toca rutas públicas, ni interfaz, ni
migra nada: sólo produce la matriz y sus recuentos.

## Por qué la mecánica manda sobre el título

La orden define GAME por lo que la persona hace, y enumera lo que NO basta:
ordenar pasos de una rutina, elegir el siguiente paso, encontrar el paso que
falta y el checklist cotidiano. Esas cuatro cosas son, literalmente, cuatro
`tipo` de fase del dataset: `orden`, `siguiente`, `falta` y `lista`. Por eso la
clasificación se decide primero por la mecánica ejecutable y sólo después por
el tema, y no al revés: el título puede prometer un juego que el código no es.

## Reglas

| mecánica            |  n  | product_kind      | confianza | por qué                        |
|---------------------|-----|-------------------|-----------|--------------------------------|
| orden               | 126 | ROUTINE_PRACTICE  | HIGH      | «ordenar pasos» · NO basta     |
| siguiente           |  53 | ROUTINE_PRACTICE  | HIGH      | «elegir siguiente paso»        |
| falta               |  36 | ROUTINE_PRACTICE  | HIGH      | «encontrar paso que falta»     |
| primero             |   9 | ROUTINE_PRACTICE  | HIGH      | secuenciar una tarea real      |
| meter               |   9 | ROUTINE_PRACTICE  | HIGH      | preparar mochila/mesa          |
| parejas             |   2 | ROUTINE_PRACTICE  | HIGH      | unir objeto y su uso real      |
| repartir (clasific.)|  14 | ROUTINE_PRACTICE  | MEDIUM    | categorizar objetos cotidianos |
| repartir (planific.)|   2 | TOOL              | HIGH      | repartir tareas en el tiempo   |
| construir           |  13 | TOOL              | HIGH      | produce un plan imprimible     |
| lista               |   4 | TOOL              | HIGH      | «checklist cotidiano»          |
| reloj               |   1 | TOOL              | HIGH      | temporizador                   |
| memoria             |  11 | GAME              | HIGH      | parejas de memoria             |
| elegir              |  11 | según tema        | MEDIUM    | ver overrides                  |
| intruso             |   3 | ROUTINE_PRACTICE  | LOW       | ni tarea ni juego · revisar    |
| busca               |   2 | ROUTINE_PRACTICE  | LOW       | buscar entre muchos · revisar  |

Dos señales refuerzan la presunción de ROUTINE_PRACTICE y se aplican antes de
cualquier duda de tema:

  1. Si el juego está enlazado a una rutina imprimible (`links`), el propio
     repositorio ya declara que practica esa rutina. Son 109 de los 297.
  2. Los nueve contextos del catálogo —higiene, vestirse, comidas, mañana,
     casa, salir, estudio, tiempo, cuidarse— son todos de vida diaria, que es
     exactamente la lista de la orden §1 para presumir ROUTINE_PRACTICE.

`INTEREST_MINIGAME` queda en 0 a propósito: ningún registro de los 297 cuelga
de un interés. P05 y P06 son construcciones nuevas, no reclasificaciones.

## Lo que este script NO hace

  - No decide: propone. Cada fila lleva confianza y marca de revisión, y la
    aceptación es de Astra y María.
  - No juzga calidad visual ni de accesibilidad juego a juego: `visual_status`
    y `accessibility_status` describen el estado del catálogo, que es común,
    no una auditoría por registro.
  - No borra, no renombra rutas, no migra a Rutinas y no toca interfaz.

Uso:  python3 scripts/r57_clasificar_juegos.py
"""
import argparse
import csv
import hashlib
import json
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SOURCE = REPO / 'assets/data/juegos-iris-data.js'
META = REPO / 'assets/data/r42-games-metadata.json'

# Mecánicas que la orden §1 nombra como insuficientes para GAME.
NO_BASTA = {'orden', 'siguiente', 'falta', 'lista'}

PLAY_LOOP = {
    'orden': 'ver los pasos desordenados → tocar el que toca ahora → repetir hasta completar la tarea',
    'siguiente': 'ver el estado de la tarea → elegir cuál es el paso siguiente → confirmar',
    'falta': 'ver la secuencia con un hueco → identificar el paso ausente → colocarlo',
    'primero': 'ver dos acciones → decidir cuál va primero → confirmar el orden',
    'meter': 'ver objetos disponibles → elegir los que hacen falta → meterlos en la bolsa o la mesa',
    'parejas': 'ver objetos y usos → unir cada objeto con lo que se hace con él',
    'repartir': 'ver elementos sueltos → repartirlos entre dos o tres destinos → revisar el reparto',
    'construir': 'elegir los pasos que quieres → ordenarlos a tu manera → obtener un plan que puedes imprimir',
    'lista': 'ver la lista del día → marcar lo ya hecho → conservar la marca durante la sesión',
    'reloj': 'iniciar la cuenta cuando tú quieras → ver vaciarse el tiempo → pausar o reiniciar',
    'memoria': 'destapar dos fichas → recordar dónde estaba cada una → formar todas las parejas',
    'elegir': 'leer dos o tres opciones válidas → elegir una → seguir por ahí',
    'intruso': 'ver un conjunto → señalar el elemento que no encaja',
    'busca': 'ver muchos objetos → localizar los que se piden',
}

# Mecánica → (product_kind, confianza). Los casos que dependen del tema, no.
BY_MECHANIC = {
    'orden': ('ROUTINE_PRACTICE', 'HIGH'),
    'siguiente': ('ROUTINE_PRACTICE', 'HIGH'),
    'falta': ('ROUTINE_PRACTICE', 'HIGH'),
    'primero': ('ROUTINE_PRACTICE', 'HIGH'),
    'meter': ('ROUTINE_PRACTICE', 'HIGH'),
    'parejas': ('ROUTINE_PRACTICE', 'HIGH'),
    'construir': ('TOOL', 'HIGH'),
    'lista': ('TOOL', 'HIGH'),
    'reloj': ('TOOL', 'HIGH'),
    'memoria': ('GAME', 'HIGH'),
    'intruso': ('ROUTINE_PRACTICE', 'LOW'),
    'busca': ('ROUTINE_PRACTICE', 'LOW'),
}

# Decisiones de producto que la mecánica sola no resuelve. Cada una lleva su
# motivo, porque son justamente las que Astra tiene que poder discutir.
OVERRIDES = {
    'cambio-de-plan': ('TOOL', 'MEDIUM',
                       'Menú de afrontamiento: el plan se cancela y todas las opciones valen. No practica una tarea.'),
    'tiempo-con-pantallas': ('TOOL', 'MEDIUM',
                             'Apoyo para dejar la pantalla. No hay tarea que practicar ni sistema que responda.'),
    'cambio-de-actividad': ('TOOL', 'MEDIUM',
                            'Apoyo de transición entre actividades. Sin rutina imprimible asociada.'),
    'volver-del-descanso': ('TOOL', 'MEDIUM',
                            'Apoyo para retomar la tarea. Sin rutina imprimible asociada.'),
    'r40-tiempo-elegir': ('TOOL', 'MEDIUM',
                          'Elegir cómo prepararse para un cambio: apoyo de transición, no práctica de tarea.'),
    'r40-cuidarse-elegir': ('TOOL', 'MEDIUM',
                            '«¿Qué necesitas ahora?»: menú de autocuidado, no práctica de tarea.'),
    'organizar-los-deberes': ('TOOL', 'HIGH',
                              'Reparte deberes entre hoy, mañana y la semana: herramienta de planificación.'),
    'demasiadas-tareas': ('TOOL', 'HIGH',
                          'Reparte tareas entre ahora, más tarde y otro día: herramienta de planificación.'),
}

# Pares casi idénticos: mismo contexto y misma mecánica, uno heredado y otro
# de la tanda R40. Candidatos a fusión, no a borrado.
MERGE_PAIRS = [
    ('memoria-de-la-higiene', 'r40-higiene-memoria'),
    ('memoria-de-la-cocina', 'r40-comidas-memoria'),
]


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_source():
    text = SOURCE.read_text(encoding='utf-8')
    start = text.index('var G=') + len('var G=')
    depth = 0
    for end in range(start, len(text)):
        if text[end] == '{':
            depth += 1
        elif text[end] == '}':
            depth -= 1
            if depth == 0:
                break
    return json.loads(text[start:end + 1])


def mechanics(game):
    return sorted({phase.get('tipo') for phase in game.get('f', []) if phase.get('tipo')})


def classify(meta, game, routine_id):
    mechs = mechanics(game)
    primary = mechs[0] if len(mechs) == 1 else next(
        (m for m in mechs if m not in ('elegir',)), mechs[0])
    notes = []

    if meta['id'] in OVERRIDES:
        kind, confidence, why = OVERRIDES[meta['id']]
        notes.append(why)
    elif primary == 'repartir':
        # Repartir objetos cotidianos es práctica; repartir tareas en el
        # tiempo es planificación. El tipo declarado distingue las dos.
        if meta['type'] == 'planificar':
            kind, confidence = 'TOOL', 'HIGH'
            notes.append('Reparto de carga en el tiempo: herramienta de planificación.')
        else:
            kind, confidence = 'ROUTINE_PRACTICE', 'MEDIUM'
            notes.append('Categorizar objetos cotidianos por su sitio o su uso.')
    elif primary in BY_MECHANIC:
        kind, confidence = BY_MECHANIC[primary]
    else:  # 'elegir' puro sin override: elegir por dónde empezar una tarea real
        kind, confidence = 'ROUTINE_PRACTICE', 'MEDIUM'
        notes.append('Elegir el punto de entrada de una tarea cotidiana concreta.')

    if primary in NO_BASTA:
        notes.append('La orden R57 §1 nombra esta mecánica entre las que no bastan para GAME.')
    if routine_id and kind == 'ROUTINE_PRACTICE':
        notes.append(f'El repositorio ya la enlaza con la rutina imprimible «{routine_id}».')
    if primary == 'intruso':
        notes.append('Señalar al intruso no practica la tarea ni es juego autónomo: '
                     'está cerca de «pregunta con decoración». Candidato a reconvertir.')
    if primary == 'busca':
        notes.append('Buscar entre muchos es la mecánica del catálogo más cercana a un juego '
                     'después de la memoria: merece la atención de Astra para los pilotos.')
    if kind == 'GAME':
        notes.append('Mecánica autónoma: el interés no depende de la tarea que decora. '
                     'Temática genérica y ambición baja.')

    intrinsic = 'YES' if kind == 'GAME' else 'NO'
    return kind, confidence, intrinsic, primary, notes


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', type=Path, default=REPO / 'editorial/r57')
    args = ap.parse_args()

    source = load_source()
    games = {g['s']: g for g in source['juegos']}
    routine_of = {game: routine for routine, game in source['links'].items()}
    meta = json.loads(META.read_text(encoding='utf-8'))
    records = meta['games']

    assert len(records) == 297, f'Se esperaban 297 registros, hay {len(records)}'
    missing = [r['id'] for r in records if r['id'] not in games]
    assert not missing, f'Registros sin juego en el dataset fuente: {missing[:5]}'

    merge_of = {}
    for keep, other in MERGE_PAIRS:
        merge_of[other] = keep

    rows = []
    for r in records:
        game = games[r['id']]
        routine_id = routine_of.get(r['id'], '')
        kind, confidence, intrinsic, primary, notes = classify(r, game, routine_id)

        if r['id'] in merge_of:
            disposition = 'merge'
            notes.append(f'Casi idéntico a «{merge_of[r["id"]]}»: mismo contexto y misma mecánica.')
        elif confidence == 'LOW':
            disposition = 'rework'
        else:
            disposition = 'keep'

        rows.append({
            'game_id': r['id'],
            'title_es': r['title']['es'],
            'title_en': r['title']['en'],
            'current_type': r['type'],
            'current_context': r['context'],
            'current_stages': list(game.get('e', [])),
            'lineage': r['lineage'],
            'mechanic': primary,
            'mechanics': mechanics(game),
            'product_kind': kind,
            'play_loop': ' · '.join(PLAY_LOOP[m] for m in mechanics(game) if m in PLAY_LOOP),
            'intrinsic_play': intrinsic,
            'routine_id': routine_id,
            'interest_id': '',
            'classification_confidence': confidence,
            'needs_human_review': confidence != 'HIGH',
            'disposition': disposition,
            'visual_status': 'TEMPLATE_GENERIC',
            'accessibility_status': 'BASELINE_OK',
            'notes': ' '.join(notes),
        })

    def tally(field):
        out = {}
        for row in rows:
            out[row[field]] = out.get(row[field], 0) + 1
        return dict(sorted(out.items(), key=lambda kv: -kv[1]))

    report = {
        'schema': 'IRIS_R57_GAMES_CLASSIFICATION/1.0',
        'order': 'R57 · P0 · reclasificar 297',
        'source_dataset': {'path': str(SOURCE.relative_to(REPO)), 'total': len(records),
                           'sha256': sha256(SOURCE)},
        'metadata_source': {'path': str(META.relative_to(REPO)), 'schema': meta['schema'],
                            'sha256': sha256(META)},
        'totals': {
            'records': len(rows),
            'unique_ids': len({r['game_id'] for r in rows}),
            'without_product_kind': sum(1 for r in rows if not r['product_kind']),
        },
        'by_product_kind': tally('product_kind'),
        'by_confidence': tally('classification_confidence'),
        'by_mechanic': tally('mechanic'),
        'by_disposition': tally('disposition'),
        'needs_human_review': sorted(r['game_id'] for r in rows if r['needs_human_review']),
        'low_confidence': sorted(r['game_id'] for r in rows if r['classification_confidence'] == 'LOW'),
        'intrinsic_play_yes': sorted(r['game_id'] for r in rows if r['intrinsic_play'] == 'YES'),
        'limits': [
            'Propuesta de clasificación, no decisión: la aceptación es de Astra y María.',
            'visual_status y accessibility_status describen el catálogo, que es común a todos '
            'los registros, no una auditoría por juego.',
            'INTEREST_MINIGAME queda en 0: ningún registro de los 297 cuelga hoy de un interés.',
            'No se ha borrado, renombrado ni migrado nada.',
        ],
        'rows': rows,
    }

    args.out.mkdir(parents=True, exist_ok=True)
    (args.out / 'clasificacion-297.json').write_text(
        json.dumps(report, ensure_ascii=False, indent=1), encoding='utf-8')

    fields = [k for k in rows[0] if k != 'current_stages'] + ['current_stages']
    with (args.out / 'clasificacion-297.csv').open('w', encoding='utf-8', newline='') as fh:
        writer = csv.DictWriter(fh, fieldnames=fields)
        writer.writeheader()
        for row in rows:
            flat = dict(row)
            flat['current_stages'] = '|'.join(row['current_stages'])
            writer.writerow(flat)

    print(json.dumps({k: report[k] for k in
                      ('totals', 'by_product_kind', 'by_confidence', 'by_disposition')},
                     ensure_ascii=False, indent=1))
    print(f'LOW confidence ({len(report["low_confidence"])}): {report["low_confidence"]}')
    print(f'A revisar por humano: {len(report["needs_human_review"])}')
    print(f'Escrito en {args.out}/clasificacion-297.json y .csv')


if __name__ == '__main__':
    main()
