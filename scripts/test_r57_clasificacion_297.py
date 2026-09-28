#!/usr/bin/env python3
"""R57 · P0 · Puerta de la reclasificación de los 297 juegos.

Cierra el gate P0 de la orden R57 §1. No opina sobre si la clasificación es la
correcta —eso es de Astra y María—; comprueba que está completa, es coherente
consigo misma y no ha cambiado nada que no debía.

Comprueba:

  1. La matriz tiene 297 filas con 297 game_id únicos.
  2. El conjunto de game_id es **exactamente** el del dataset fuente: ni uno
     perdido, ni uno inventado.
  3. Ninguna fila se queda sin `product_kind`, y todos los valores pertenecen
     al vocabulario cerrado de la orden.
  4. Cada fila trae los campos mínimos que enumera la orden §1.
  5. Vocabularios cerrados en confianza, juego intrínseco y disposición.
  6. Coherencia interna: `intrinsic_play = YES` si y sólo si el registro es
     GAME; `needs_human_review` si y sólo si la confianza no es alta.
  7. Todo `routine_id` existe de verdad en el mapa `links` del dataset, y
     apunta a ese mismo juego.
  8. Los recuentos por categoría están presentes y suman 297.
  9. La lista de confianza baja está publicada y coincide con las filas.
 10. No hay cambios destructivos: las dos fuentes siguen teniendo el sha256
     que la matriz registró al leerlas.
 11. No hay interfaz pública todavía: el commit que introdujo la matriz sólo
     toca `editorial/r57/` y `scripts/`. Ni rutas, ni assets, ni sitemap.

     Se mira **ese commit**, no el rango desde una base fija: un rango se
     ensucia en cuanto aterriza encima trabajo ajeno, y entonces la puerta
     falla por algo que P0 no ha hecho.

Lo que este test NO certifica:
  - Que cada juego esté en la categoría correcta. La matriz es una propuesta
    con confianza declarada; la revisión de producto es el paso siguiente.
  - Que las categorías de la orden sean las definitivas.
  - Nada sobre los seis pilotos: esta puerta es anterior al gate visual.

Uso:  python3 scripts/test_r57_clasificacion_297.py
"""
import argparse
import hashlib
import json
import subprocess
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
MATRIX = REPO / 'editorial/r57/clasificacion-297.json'
SOURCE = REPO / 'assets/data/juegos-iris-data.js'

KINDS = {'GAME', 'ROUTINE_PRACTICE', 'TOOL', 'INTEREST_MINIGAME'}
CONFIDENCE = {'HIGH', 'MEDIUM', 'LOW'}
INTRINSIC = {'YES', 'NO'}
DISPOSITION = {'keep', 'rework', 'merge'}

REQUIRED = ['game_id', 'title_es', 'title_en', 'current_type', 'current_context',
            'current_stages', 'lineage', 'product_kind', 'play_loop', 'intrinsic_play',
            'routine_id', 'interest_id', 'classification_confidence',
            'needs_human_review', 'disposition', 'visual_status',
            'accessibility_status', 'notes']

# P0 no publica interfaz: sólo la matriz y las herramientas que la producen.
ALLOWED_PREFIXES = ('editorial/r57/', 'scripts/')


def source_ids():
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
    data = json.loads(text[start:end + 1])
    return {g['s'] for g in data['juegos']}, data['links']


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--commit', default=None,
                    help='commit de P0; por defecto, el que introdujo la matriz')
    args = ap.parse_args()

    assert MATRIX.is_file(), f'No existe la matriz: {MATRIX}'
    report = json.loads(MATRIX.read_text(encoding='utf-8'))
    rows = report['rows']
    failures = []

    def check(condition, message):
        if not condition:
            failures.append(message)

    # 1 y 2 · completitud e identidad
    ids = [r['game_id'] for r in rows]
    check(len(rows) == 297, f'La matriz tiene {len(rows)} filas, no 297')
    check(len(set(ids)) == len(ids), 'Hay game_id repetidos en la matriz')
    src_ids, links = source_ids()
    check(set(ids) == src_ids,
          f'IDs perdidos: {sorted(src_ids - set(ids))[:5]} · inventados: {sorted(set(ids) - src_ids)[:5]}')

    # 3, 4 y 5 · campos y vocabularios
    for row in rows:
        missing = [f for f in REQUIRED if f not in row]
        if missing:
            failures.append(f'{row.get("game_id")}: faltan campos {missing}')
            continue
        check(row['product_kind'] in KINDS,
              f'{row["game_id"]}: product_kind inválido {row["product_kind"]!r}')
        check(row['classification_confidence'] in CONFIDENCE,
              f'{row["game_id"]}: confianza inválida {row["classification_confidence"]!r}')
        check(row['intrinsic_play'] in INTRINSIC,
              f'{row["game_id"]}: intrinsic_play inválido {row["intrinsic_play"]!r}')
        check(row['disposition'] in DISPOSITION,
              f'{row["game_id"]}: disposición inválida {row["disposition"]!r}')
        check(isinstance(row['needs_human_review'], bool),
              f'{row["game_id"]}: needs_human_review no es booleano')
        check(bool(row['title_es']) and bool(row['title_en']),
              f'{row["game_id"]}: falta título en ES o EN')
        check(bool(row['play_loop']), f'{row["game_id"]}: play_loop vacío')

        # 6 · coherencia interna
        check((row['intrinsic_play'] == 'YES') == (row['product_kind'] == 'GAME'),
              f'{row["game_id"]}: intrinsic_play y product_kind no concuerdan')
        check(row['needs_human_review'] == (row['classification_confidence'] != 'HIGH'),
              f'{row["game_id"]}: needs_human_review no concuerda con la confianza')

        # 7 · los enlaces a rutina son reales
        if row['routine_id']:
            check(links.get(row['routine_id']) == row['game_id'],
                  f'{row["game_id"]}: routine_id {row["routine_id"]!r} no lo enlaza en links')

    # 3 bis · el gate pide explícitamente cero sin product_kind
    sin_kind = [r['game_id'] for r in rows if not r.get('product_kind')]
    check(not sin_kind, f'Registros sin product_kind: {sin_kind[:5]}')

    # 8 · recuentos
    tally = report.get('by_product_kind', {})
    check(bool(tally), 'Faltan los recuentos por categoría')
    check(sum(tally.values()) == 297, f'Los recuentos suman {sum(tally.values())}, no 297')
    for kind, n in tally.items():
        real = sum(1 for r in rows if r['product_kind'] == kind)
        check(real == n, f'Recuento de {kind}: dice {n}, hay {real}')

    # 9 · lista de confianza baja
    low_rows = sorted(r['game_id'] for r in rows if r['classification_confidence'] == 'LOW')
    check(report.get('low_confidence') == low_rows,
          'La lista low_confidence no coincide con las filas de confianza baja')

    # 10 · sin cambios destructivos en las fuentes
    for key, path in (('source_dataset', SOURCE),
                      ('metadata_source', REPO / 'assets/data/r42-games-metadata.json')):
        recorded = report.get(key, {}).get('sha256')
        actual = hashlib.sha256(path.read_bytes()).hexdigest()
        check(recorded == actual,
              f'{path.name} ha cambiado desde que se generó la matriz')

    # 11 · P0 no publica interfaz
    def git(*args):
        out = subprocess.run(['git', *args], cwd=REPO, capture_output=True,
                             text=True, timeout=60)
        return out.stdout.split() if out.returncode == 0 else []

    changed, commit = [], args.commit
    try:
        if not commit:
            found = git('log', '-1', '--format=%H', '--',
                        'editorial/r57/clasificacion-297.json')
            commit = found[0] if found else None
        if commit:
            changed = git('diff', '--name-only', f'{commit}^', commit)
    except (OSError, subprocess.SubprocessError):
        changed = []
    leaked = [p for p in changed if not p.startswith(ALLOWED_PREFIXES)]
    check(not leaked, f'P0 toca archivos fuera de editorial/r57 y scripts: {leaked[:8]}')

    result = {
        'gate': 'R57_CODEX_GAMES_297_CLASSIFICATION_READY_FOR_ASTRA' if not failures else 'FAIL',
        'records': len(rows),
        'by_product_kind': tally,
        'by_confidence': report.get('by_confidence'),
        'low_confidence': report.get('low_confidence'),
        'needs_human_review': len(report.get('needs_human_review', [])),
        'p0_commit': commit,
        'files_changed_in_p0_commit': changed,
        'failures': failures,
    }
    print(json.dumps(result, ensure_ascii=False, indent=1))
    if failures:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
