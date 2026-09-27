#!/usr/bin/env python3
"""R42 · Bloque E · El generador de sprites representa los datos actuales.

El generador afirmaba por `assert` que había 58 pictogramas y repartía con un
literal `BATCHES = [8,8,8,8,8,8,8,2]`. En el repositorio hay 93 registros en 13
sprites: las siete primeras tandas de ocho, una de dos y cinco de siete. Es
decir, el guion ya no representaba sus propios datos y habría fallado al
ejecutarlo.

El reparto no necesitaba estar en el código: `sources.csv` ya declara, fila a
fila, a qué sprite pertenece cada símbolo.

Comprueba:

  1. El guion no conserva ningún literal histórico de reparto ni de recuento.
  2. `plan()` agrupa los registros reales en los sprites que declara el CSV,
     con los tamaños reales y sin depender de que sean 58, 93 ni otra cifra.
  3. Los identificadores son únicos en el CSV.
  4. El plan coincide **exactamente** con los sprites que hay en disco: mismos
     archivos, mismos identificadores y en el mismo orden dentro de cada uno.
  5. Ejecutado de punta a punta contra un ZIP sintético, el generador escribe
     esos mismos 13 archivos con esos mismos 93 símbolos: 0 faltantes, 0
     duplicados, manifiesto coherente.
  6. El generador es independiente del tamaño: con un conjunto inventado de
     otra forma, reparte igual de bien.
  7. Un identificador repetido o una fila sin sprite se rechazan con un error
     claro en lugar de producir una salida silenciosamente incompleta.

Lo que este test NO certifica:
  - No valida el dibujo de ningún pictograma ni su licencia: el paso 5 usa un
    ZIP sintético, porque el archivo original de Mulberry no está en el
    repositorio. Regenerar los sprites de verdad sigue necesitando ese ZIP.
  - No comprueba que los 93 símbolos históricos sigan siendo los que la
    herramienta debe ofrecer: el catálogo vivo son los 292 SVG sueltos de
    `assets/pictogramas/`, y de eso se ocupa `test_rutinas_visuales.py`.

Ejecutar desde la raíz del repositorio.
"""
import csv
import importlib.util
import io
import json
import re
import sys
import tempfile
import zipfile
from pathlib import Path

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
SCRIPT = ROOT / 'scripts/generate_rutinas_sprites.py'
ASSETS = ROOT / 'assets/mulberry-rutinas'
SOURCES = ASSETS / 'sources.csv'
OUT = ROOT / 'reports/r42-recursos'

spec = importlib.util.spec_from_file_location('gen_sprites', SCRIPT)
gen = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gen)

SYMBOLS = re.compile(r'<symbol\s+id=["\']([^"\']+)["\']')


def ids_in(path):
    return SYMBOLS.findall(path.read_text(encoding='utf-8'))


def fake_zip(rows):
    """Un ZIP con un SVG mínimo por cada archivo que el CSV menciona."""
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, 'w') as z:
        for row in rows:
            z.writestr('EN-symbols/' + row['archivo_mulberry'],
                       '<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" '
                       'viewBox="0 0 100 100"><rect width="100" height="100"/></svg>')
    path = Path(tempfile.mkdtemp()) / 'mulberry.zip'
    path.write_bytes(buffer.getvalue())
    return path


def main():
    report = {'checks': [], 'notes': [
        'El paso de punta a punta usa un ZIP sintético: el archivo original de Mulberry no está en el repositorio.',
        'No valida dibujos ni licencias.',
    ]}

    # 1 · sin literales históricos
    text = SCRIPT.read_text(encoding='utf-8')
    for banned in ('BATCHES', '!= 58', 'Se esperaban 58', "'symbols': 58", "'sprites': 8"):
        assert banned not in text, f'el guion conserva el literal histórico: {banned}'
    report['checks'].append('sin literales históricos de reparto ni de recuento')

    # 2 y 3 · el plan sale de los datos
    rows = list(csv.DictReader(SOURCES.open(encoding='utf-8-sig', newline='')))
    groups = gen.plan(rows)
    sizes = {name: len(members) for name, members in
             sorted(groups, key=lambda g: int(re.search(r'\d+', g[0]).group()))}
    assert sum(sizes.values()) == len(rows), ('el plan no cubre todas las filas', sizes)
    ids = [r['id'] for r in rows]
    assert len(set(ids)) == len(ids), 'identificadores repetidos en sources.csv'
    report['checks'].append(f'{len(rows)} registros repartidos en {len(groups)} sprites')
    report['per_sprite'] = sizes

    # 4 · el plan coincide con el disco, archivo por archivo y en orden
    on_disk = sorted(ASSETS.glob('sprite-*.svg'), key=lambda p: int(re.search(r'\d+', p.name).group()))
    assert {p.name for p in on_disk} == set(sizes), (
        'los sprites en disco no coinciden con los que declara el CSV',
        sorted(p.name for p in on_disk), sorted(sizes))
    for name, members in groups:
        disk_ids = ids_in(ASSETS / name)
        assert disk_ids == [m['id'] for m in members], (
            f'{name}: el orden o el contenido difieren de sources.csv', disk_ids)
    report['checks'].append('el plan reproduce exactamente los sprites que hay en disco')

    # 5 · de punta a punta contra un ZIP sintético
    archive = fake_zip(rows)
    with tempfile.TemporaryDirectory() as tmp:
        dest = Path(tmp)
        gen.build(archive, SOURCES, dest)
        written = sorted(dest.glob('sprite-*.svg'))
        assert {p.name for p in written} == set(sizes), (
            'la salida no produce los mismos archivos', sorted(p.name for p in written))
        produced = [i for p in written for i in ids_in(p)]
        assert len(produced) == len(rows), ('recuento distinto', len(produced), len(rows))
        assert len(set(produced)) == len(produced), 'símbolos duplicados en la salida'
        assert set(produced) == set(ids), 'los identificadores no coinciden con el CSV'
        for name, members in groups:
            assert ids_in(dest / name) == [m['id'] for m in members], f'{name}: reparto distinto'
    report['checks'].append('ejecución completa: 0 faltantes, 0 duplicados, manifiesto coherente')

    # 6 · independiente del tamaño
    invented = [{'id': f'x{n}', 'sprite': f'sprite-{n // 5 + 1}.svg',
                 'archivo_mulberry': f'x{n}.svg'} for n in range(23)]
    other = gen.plan(invented)
    assert sum(len(m) for _, m in other) == 23, 'el plan no cubre un conjunto inventado'
    assert len(other) == 5, ('reparto inesperado en el conjunto inventado', len(other))
    report['checks'].append('funciona con un conjunto de otro tamaño y otro reparto')

    # 7 · errores claros
    for bad, why in [
        ([{'id': 'a', 'sprite': 'sprite-1.svg'}, {'id': 'a', 'sprite': 'sprite-1.svg'}],
         'identificador repetido'),
        ([{'id': 'a', 'sprite': ''}], 'fila sin sprite'),
        ([{'id': 'a', 'sprite': 'otro.svg'}], 'nombre de sprite inesperado'),
    ]:
        try:
            gen.plan(bad)
        except AssertionError:
            pass
        else:
            raise AssertionError(f'no se rechazó: {why}')
    report['checks'].append('rechaza identificadores repetidos, filas sin sprite y nombres raros')

    report['gate'] = 'R42_ROUTINE_SPRITE_GENERATOR_CURRENT_DATA_PASS'
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / 'sprite-generator.json').write_text(
        json.dumps(report, ensure_ascii=False, indent=1), encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
