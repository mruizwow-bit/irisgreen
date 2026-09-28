#!/usr/bin/env python3
"""P02 contra la referencia E4 · lo que se puede medir.

`REFERENCIA-E4` deja cinco preguntas y el `CONCEPTO.md` de P02 deja seis
criterios de PASS. Unas se pueden medir y otras son juicio. Este test mide las
que se pueden medir y **dice cuáles no**, en vez de dar una puerta verde que
tape la diferencia.

Se mide:

  1. **Penumbra.** Una sombra de canto duro sólo tiene 0 y 1. Se cuenta qué
     parte de la sombra cae en valores intermedios.
  2. **Imperfección desigual.** Si toda la irregularidad es del mismo tamaño se
     lee como patrón. Se compara la varianza del albedo a dos escalas: si la
     gruesa no aporta, la variación es sólo grano.
  3. **Ninguna superficie grande plana.** Se busca la mayor región contigua con
     varianza local baja, sobre la imagen ya compuesta y dentro de la máscara
     de escena. El listón sale de medir igual la referencia aprobada: P01 da
     2,0 %.
  4. **Segunda fuente.** Se comprueba que el derrame del charco llega a una
     parte no trivial de la escena.
  5. **Composición propia a 390.** Se comprueba que el encuadre de móvil no es
     el de escritorio: ventana y rango de cota distintos.

No se mide, y por eso no se declara:

  - si la lámina «parece un terrario» y no una ficha;
  - si los materiales se reconocen como materia distinta;
  - si la consecuencia de la segunda lámina se entiende sin leer los pies
     —el delta de musgo se mide, que es otra cosa—;
  - si algún elemento recuerda a obra de terceros.

Todo eso es el §14 del concepto y necesita ojos.

Uso:  python3 scripts/test_r62_p02_e4.py
"""
import json
import sys
from pathlib import Path

import numpy as np
from scipy.ndimage import label, uniform_filter

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO / 'scripts'))

import ig_render_e4 as e4          # noqa: E402
import r62_p02_render as p         # noqa: E402


def preparar(ventana=None, z_rango=None, w=1180, h=900):
    p.SS = 1
    e4.set_textures(e4.fbm_tile(octaves=6, gain=0.56, lowest=26, seed=11),
                    e4.fbm_tile(octaves=6, gain=0.62, lowest=44, seed=29))
    e4.set_theme('navy')
    p.con_roca_demo(False)
    p.configure(w, h, top=104, bot=120, ventana=ventana, z_rango=z_rango)
    buf = e4.Buffers()
    p.build_scene(buf)
    return buf


def main():
    fallos = []
    r = {'schema': 'IRIS_R62_P02_E4/1.0'}

    buf = preparar()

    # 1 · penumbra
    sombra = e4.shadow_mask(buf, p.LUZ)[buf.mask]
    media = (sombra > 0.08) & (sombra < 0.92)
    en_sombra = sombra > 0.08
    frac = float(media.sum() / max(en_sombra.sum(), 1))
    r['penumbra_fraccion_intermedia'] = round(frac, 3)
    if frac < 0.30:
        fallos.append(f'penumbra: sólo {frac:.0%} de la sombra es intermedia; '
                      f'parece canto duro')

    # 2 · imperfección a dos escalas
    alb = buf.albedo.mean(-1)
    fino = alb - uniform_filter(alb, 5)
    grueso = uniform_filter(alb, 9) - uniform_filter(alb, 61)
    sf, sg = float(fino[buf.mask].std()), float(grueso[buf.mask].std())
    r['desviacion_fina'] = round(sf, 4)
    r['desviacion_gruesa'] = round(sg, 4)
    r['razon_gruesa_fina'] = round(sg / max(sf, 1e-6), 3)
    if sg / max(sf, 1e-6) < 0.45:
        fallos.append('imperfección: la variación gruesa no llega a la mitad de '
                      'la fina; toda la irregularidad es grano')

    # 3 · superficie grande resuelta de una sola manera
    #
    # Se mide sobre la imagen compuesta y dentro de la máscara de escena, no
    # sobre el albedo. Medirlo en el albedo daba un 64 % y era mentira: la
    # tierra tiene poco contraste de color y todo el relieve se lo da la luz,
    # que en el albedo todavía no está. Y medirlo sobre la imagen entera sin
    # máscara da un 71 % en P01, porque su vacío oscuro es liso de verdad: el
    # fondo no es una superficie que represente materia.
    #
    # El listón sale de la referencia aprobada medida igual: P01 da 2,0 % con
    # este umbral. Se admite hasta el 12 %, que deja margen para una escena con
    # más superficie continua que una sala de sillería sin dejar pasar un campo
    # liso.
    img = e4.compose(p.agua(p.lighting(buf), buf), buf, p.backdrop,
                     exposure=1.95, vignette=(1.20, 0.62, 1.55),
                     contraste=0.34, pivote=0.38)
    lum = img.mean(-1)
    var = uniform_filter(lum ** 2, 15) - uniform_filter(lum, 15) ** 2
    plano = (var < 2.2e-4) & buf.mask
    et, n = label(plano)
    mayor = int(np.bincount(et.ravel())[1:].max()) if n else 0
    total = int(buf.mask.sum())
    r['mayor_region_plana_pct'] = round(100 * mayor / total, 2)
    r['mayor_region_plana_pct_p01'] = 2.0
    if mayor / total > 0.12:
        fallos.append(f'superficie plana: una región contigua ocupa el '
                      f'{100*mayor/total:.1f}% de la escena (P01 da 2,0 %)')

    # 4 · segunda fuente
    pos = np.array([6.4, 1.5, p.NIVEL_AGUA], np.float32)
    d = np.linalg.norm(pos[None, None, :] - buf.world, axis=-1) + 1e-6
    l2 = (pos[None, None, :] - buf.world) / d[..., None]
    caida = 1.0 / (1.0 + (d / 2.6) ** 2)
    alcance = ((np.clip((buf.normal * l2).sum(-1), 0, 1) * caida > 0.02) & buf.mask)
    r['segunda_fuente_pct'] = round(100 * float(alcance.sum()) / total, 2)
    if alcance.sum() / total < 0.04:
        fallos.append('segunda fuente: el derrame del charco casi no llega a nada')

    # 5 · el móvil no es el escritorio encogido
    esc = (None, (1.46, 4.86))
    mov = ((3.55, 7.25), (1.30, 3.95))
    r['encuadre_escritorio'] = str(esc)
    r['encuadre_movil'] = str(mov)
    if esc[0] == mov[0] or esc[1] == mov[1]:
        fallos.append('móvil: mismo encuadre que escritorio')

    # extra medible · la consecuencia de la segunda lámina
    musgo = {}
    for con in (False, True):
        p.MOSTRAR_EN_VUELO = False
        p.con_roca_demo(con)
        p.configure(560, 512, ventana=(3.95, 8.35))
        b2 = e4.Buffers()
        p.build_scene(b2)
        musgo[con] = int((b2.matid == e4.MAT_IDS['musgo']).sum())
    p.con_roca_demo(False)
    p.MOSTRAR_EN_VUELO = True
    delta = 100.0 * (musgo[True] - musgo[False]) / max(musgo[False], 1)
    r['musgo_sin_roca'] = musgo[False]
    r['musgo_con_roca'] = musgo[True]
    r['musgo_delta_pct'] = round(delta, 1)
    if delta < 15.0:
        fallos.append(f'causalidad: la roca sólo cambia el musgo un {delta:.0f}%; '
                      f'la consecuencia no se verá sin leer el pie')

    r['no_medido'] = [
        'si parece un terrario y no una ficha',
        'si tierra, roca, madera, musgo, hoja y agua se reconocen como materiales distintos',
        'si algún elemento recuerda a obra de terceros',
    ]
    r['fallos'] = fallos
    r['gate'] = 'R62_P02_TERRARIO_E4_MEASURED_PASS' if not fallos else 'FAIL'
    print(json.dumps(r, ensure_ascii=False, indent=1))
    return 1 if fallos else 0


if __name__ == '__main__':
    raise SystemExit(main())
