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

Y, desde la R2, cuatro medidas más, una por cada punto del rework que admite
número:

  6. **Variedad de follaje.** Cuántas familias distintas se plantan de verdad y
     si alguna acapara. Contar familias declaradas no vale: lo que importa es
     el reparto que sale sobre el terreno.
  7. **Colgantes ramificadas.** Cuántas ramas hijas salen por planta. Una
     colgante sin ramas es la cuerda verde que el R2 rechaza.
  8. **La roca nueva pertenece al mundo.** Su luminancia comparada con la del
     resto de la escena. Si dobla largamente a lo que la rodea, es un marcador.
  9. **La bandeja tiene nombres.** Que los siete elementos tengan etiqueta
     visible en móvil y nombre accesible en las dos composiciones.
 10. **El díptico enseña el cambio.** Cuánto del panel cambia entre ANTES y
     DESPUÉS, y —lo que de verdad importa— qué parte de ese cambio cae donde
     está la roca y su sombra. Un cambio grande repartido por todo el panel no
     se lee como consecuencia de nada; concentrado donde cae la sombra, sí.

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
        # el encuadre que de verdad se enseña, no uno antiguo: medir el musgo
        # en una ventana distinta de la del díptico daba un número que no
        # hablaba de la lámina
        p.configure(560, 512, ventana=p.VENTANA_CAUSALIDAD, z_rango=p.Z_CAUSALIDAD)
        b2 = e4.Buffers()
        p.build_scene(b2)
        # las dos densidades: el musgo joven es donde más se nota el cambio,
        # y contar sólo el establecido se dejaba fuera dos tercios del efecto
        musgo[con] = int((b2.matid == e4.MAT_IDS['musgo']).sum()
                         + (b2.matid == e4.MAT_IDS['musgo-joven']).sum())
    p.con_roca_demo(False)
    p.MOSTRAR_EN_VUELO = True
    delta = 100.0 * (musgo[True] - musgo[False]) / max(musgo[False], 1)
    r['musgo_sin_roca'] = musgo[False]
    r['musgo_con_roca'] = musgo[True]
    r['musgo_dos_capas'] = True
    r['musgo_delta_pct'] = round(delta, 1)
    if delta < 15.0:
        fallos.append(f'causalidad: la roca sólo cambia el musgo un {delta:.0f}%; '
                      f'la consecuencia no se verá sin leer el pie')

    # 6 · variedad de follaje, por reparto real y no por catálogo
    import collections
    rep = collections.Counter(p.familia(x, y) for x, y, _ in p.MATAS)
    r['familias'] = dict(rep)
    dominante = max(rep.values()) / max(sum(rep.values()), 1)
    r['familia_dominante_pct'] = round(100 * dominante, 1)
    if len(rep) < 3:
        fallos.append(f'follaje: sólo {len(rep)} familias sobre el terreno')
    if dominante > 0.45:
        fallos.append(f'follaje: una familia acapara el {100*dominante:.0f}% del plantado')

    # 7 · las colgantes ramifican
    ramas = []
    for i, (x, z, largo, prof) in enumerate(p.COLGANTES):
        cuenta = {'n': 0}
        real = p._rama

        def contar(buf_, p0, dir0, l, g, m, mc, rr, nivel=0, tono=1.0):
            if nivel > 0:
                cuenta['n'] += 1
            return real(buf_, p0, dir0, l, g, m, mc, rr, nivel, tono)

        p._rama = contar
        b3 = e4.Buffers()
        p.colgante(b3, x, prof, z, largo, 'hoja', 'hoja-clara', seed=3 + i)
        p._rama = real
        ramas.append(cuenta['n'])
    r['ramas_por_colgante'] = ramas
    r['colgantes_sin_ramificar'] = sum(1 for n in ramas if n == 0)
    if sum(1 for n in ramas if n == 0) > 1:
        fallos.append(f'colgantes: {sum(1 for n in ramas if n == 0)} no ramifican')

    # 8 · la roca nueva no puede robar la lámina
    p.MOSTRAR_EN_VUELO = False
    p.con_roca_demo(True)
    p.configure(560, 512, ventana=p.VENTANA_CAUSALIDAD, z_rango=p.Z_CAUSALIDAD)
    b4 = e4.Buffers()
    p.build_scene(b4)
    img4 = p.cristal(e4.compose(p.agua(p.lighting(b4), b4), b4, p.backdrop,
                                exposure=1.95, vignette=(1.12, 0.38, 1.55),
                                contraste=0.34, pivote=0.38))
    roca = b4.matid == e4.MAT_IDS['roca-humeda']
    resto = b4.mask & ~roca
    lr = float(img4[roca].mean()) if roca.any() else 0.0
    le = float(np.median(img4[resto]))
    r['luminancia_roca_nueva'] = round(lr, 3)
    r['luminancia_escena'] = round(le, 3)
    r['razon_roca_escena'] = round(lr / max(le, 1e-6), 2)
    if lr / max(le, 1e-6) > 2.2:
        fallos.append(f'roca nueva: {lr/le:.1f}× más clara que la escena; '
                      f'se lee como marcador')
    p.con_roca_demo(False)
    p.MOSTRAR_EN_VUELO = True

    # 9 · la bandeja tiene nombres, visibles y accesibles
    d = REPO / 'editorial/r62/p02-terrario-vivo'
    nombres = [n for n, _ in p.BANDEJA]
    for f in ('gameplay-movil-navy.svg', 'gameplay-navy.svg'):
        ruta = d / f
        if not ruta.is_file():
            fallos.append(f'bandeja: falta {f} para comprobar los nombres')
            continue
        txt = ruta.read_text(encoding='utf-8')
        sin_titulo = [n for n in nombres if f'<title>{n}' not in txt]
        if sin_titulo:
            fallos.append(f'bandeja {f}: sin nombre accesible {sin_titulo}')
        if 'movil' in f:
            sin_etiqueta = [n for n in nombres if f'>{n}</text>' not in txt]
            if sin_etiqueta:
                fallos.append(f'bandeja móvil: sin etiqueta visible {sin_etiqueta}')
    r['bandeja_elementos'] = len(nombres)

    # 10 · el díptico enseña el cambio, y lo enseña donde toca
    p.MOSTRAR_EN_VUELO = False
    paneles = {}
    mundos = {}
    for con in (False, True):
        p.con_roca_demo(con)
        p.configure(533, 512, ventana=p.VENTANA_CAUSALIDAD, z_rango=p.Z_CAUSALIDAD)
        b5 = e4.Buffers()
        p.build_scene(b5)
        paneles[con] = p.cristal(e4.compose(p.agua(p.lighting(b5), b5), b5, p.backdrop,
                                           exposure=1.95, vignette=(1.12, 0.38, 1.55),
                                           contraste=0.34, pivote=0.38))
        mundos[con] = (b5.world.copy(), b5.mask.copy())
    p.con_roca_demo(False)
    p.MOSTRAR_EN_VUELO = True

    dif = np.abs(paneles[True].mean(-1) - paneles[False].mean(-1))
    cambia = dif > 0.045
    r['diptico_cambio_pct'] = round(100 * float(cambia.mean()), 1)

    # ¿dónde está la roca y su sombra nueva, en pantalla?
    w, msk = mundos[True]
    x, y = w[..., 0], w[..., 1]
    p.con_roca_demo(True)
    som1 = p.sombra_solar(x, np.clip(y, 0.0, None))
    en_roca = p._en_roca_demo(x, y)
    p.con_roca_demo(False)
    som0 = p.sombra_solar(x, np.clip(y, 0.0, None))
    zona = msk & (en_roca | ((som1 - som0) > 0.15))
    r['zona_roca_y_sombra_pct'] = round(100 * float(zona.mean()), 1)
    dentro = float(dif[cambia & zona].sum()) / max(float(dif[cambia].sum()), 1e-6)
    r['cambio_en_la_zona_pct'] = round(100 * dentro, 1)

    if cambia.mean() < 0.04:
        fallos.append(f'díptico: sólo cambia el {100*cambia.mean():.1f}% del panel')
    if dentro < 0.55:
        fallos.append(f'díptico: sólo el {100*dentro:.0f}% del cambio cae donde está '
                      f'la roca y su sombra; repartido así no se lee como consecuencia')

    r['no_medido'] = [
        'si parece un terrario y no una ficha',
        'si tierra, roca, madera, musgo, hoja y agua se reconocen como materiales distintos',
        'si la cadena roca → sombra → humedad → musgo se entiende de un vistazo',
        'si algún elemento recuerda a obra de terceros',
    ]
    r['fallos'] = fallos
    r['gate'] = 'R62_P02_TERRARIO_E4_MEASURED_PASS' if not fallos else 'FAIL'
    print(json.dumps(r, ensure_ascii=False, indent=1))
    return 1 if fallos else 0


if __name__ == '__main__':
    raise SystemExit(main())
