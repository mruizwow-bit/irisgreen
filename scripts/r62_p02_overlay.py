#!/usr/bin/env python3
"""Rehace sólo la capa vectorial de las láminas de P02, sin volver a renderizar.

El raster tarda veinte minutos por lámina y el chrome cambia por un ajuste de
posición de un rótulo. Como el raster ya está escrito en el `.webp`, basta
volver a configurar la cámara —que es instantáneo— y reescribir el SVG con el
mismo raster incrustado.

Sirve para corregir el chrome. **No sirve si cambia la escena**: en ese caso el
raster ya no corresponde y hay que renderizar de verdad.

El `.webp` de disco es exactamente el que el render incrusta —una sola
codificación—, así que reescribir aquí da el mismo SVG byte a byte que un
render completo. Si no fuera así, esto metería una generación más de
compresión y la entrega dejaría de ser reproducible.

Uso:  python3 scripts/r62_p02_overlay.py
"""
import base64
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import ig_render_e4 as e4          # noqa: E402
import r62_p02_render as p         # noqa: E402

REPO = Path(__file__).resolve().parent.parent
DIR = REPO / 'editorial/r62/p02-terrario-vivo'

LAMINAS = [
    ('gameplay-navy', 'navy', 1180, 900, 104, 120, None, None),
    ('gameplay-claro', 'claro', 1180, 900, 104, 120, None, None),
    ('gameplay-movil-navy', 'navy', 390, 730, 62, 160, (3.55, 7.25), (1.30, 3.95)),
    ('gameplay-movil-claro', 'claro', 390, 730, 62, 160, (3.55, 7.25), (1.30, 3.95)),
]


def main():
    # El terreno se consulta para colocar el anillo del destino, y el terreno
    # lleva ruido, así que las teselas hacen falta aunque no se rasterice nada.
    e4.set_textures(e4.fbm_tile(octaves=6, gain=0.56, lowest=26, seed=11),
                    e4.fbm_tile(octaves=6, gain=0.62, lowest=44, seed=29))
    for nombre, tema, w, h, top, bot, vent, zr in LAMINAS:
        webp = DIR / f'{nombre}.webp'
        if not webp.is_file():
            print(f'falta {webp.name}, se salta')
            continue
        e4.set_theme(tema)
        p.con_roca_demo(False)
        p.configure(w, h, top, bot, ventana=vent, z_rango=zr)
        uri = 'data:image/webp;base64,' + base64.b64encode(webp.read_bytes()).decode('ascii')
        overlay = p.overlay_movil if 'movil' in nombre else p.overlay_svg
        (DIR / f'{nombre}.svg').write_text(overlay(uri), encoding='utf-8')
        print(f'Reescrito {nombre}.svg')


if __name__ == '__main__':
    main()
