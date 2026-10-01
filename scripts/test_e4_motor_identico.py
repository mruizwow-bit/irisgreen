#!/usr/bin/env python3
"""El motor compartido no puede cambiar la lámina aprobada de P01.

`R62_P01_HABITACION_E4_HUMAN_APPROVED`. Sacar el motor del script de P01 a
`scripts/ig_render_e4.py` sólo era legítimo si la salida no se movía ni un
byte. Esta prueba lo fija: vuelve a renderizar P01 en un directorio aparte y
compara con los archivos versionados.

Compara contra los archivos del repositorio y no contra una lista de hashes
escrita a mano. Un hash en el código habría que actualizarlo cuando el arte
cambie de verdad, y entonces la prueba pasaría a certificar el hash en vez de
la lámina. Lo que está en la rama es el artefacto aprobado.

Si esto falla hay exactamente dos posibilidades, y conviene no confundirlas:

  a) la refactorización rompió algo, y entonces se arregla el motor;
  b) alguien cambió el arte a propósito, y entonces hace falta revisión humana
     otra vez, porque lo aprobado era la lámina concreta, no el script.

Lo que esta prueba NO certifica: que la lámina sea buena, ni que el motor sea
correcto en general. Sólo que no ha cambiado.

Uso:  python3 scripts/test_e4_motor_identico.py
"""
import hashlib
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
APROBADO = REPO / 'editorial/r62/p01-habitacion-imposible'
LAMINAS = ['gameplay-navy', 'gameplay-claro', 'gameplay-movil-navy', 'gameplay-movil-claro']


def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()


def main():
    faltan = [n for n in LAMINAS
              if not (APROBADO / f'{n}.svg').is_file() or not (APROBADO / f'{n}.webp').is_file()]
    if faltan:
        print('FALLO · no están las láminas aprobadas en la rama:', ', '.join(faltan))
        return 1

    tmp = Path(tempfile.mkdtemp(prefix='e4-'))
    try:
        r = subprocess.run([sys.executable, str(REPO / 'scripts/r62_p01_render.py'),
                            '--out', str(tmp)], capture_output=True, text=True)
        if r.returncode != 0:
            print('FALLO · el render de P01 no termina\n', r.stderr[-2000:])
            return 1

        malas = []
        for n in LAMINAS:
            for ext in ('svg', 'webp'):
                a, b = APROBADO / f'{n}.{ext}', tmp / f'{n}.{ext}'
                if not b.is_file():
                    malas.append((f'{n}.{ext}', 'no se generó'))
                elif sha(a) != sha(b):
                    malas.append((f'{n}.{ext}',
                                  f'{sha(a)[:12]} aprobado ≠ {sha(b)[:12]} generado'))

        if malas:
            print('FALLO · la lámina aprobada de P01 ha cambiado:')
            for nombre, motivo in malas:
                print(f'  {nombre}: {motivo}')
            return 1
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

    print(f'PASS · {len(LAMINAS)} láminas × 2 archivos idénticas byte a byte')
    print('R62_P01_E4_ENGINE_EXTRACTION_LOSSLESS_PASS')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
