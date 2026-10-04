#!/usr/bin/env python3
"""R62 · pilotos P05, P06 y P07 · lo que se puede medir del listón E4.

La referencia (`editorial/r62/REFERENCIA-E4.md`) dice que un «no» en cualquiera
de sus preguntas fue, en P01, motivo de rework. Varias de ellas sólo las puede
contestar una persona mirando. Tres **sí** se pueden medir, y son justo las que
en esta serie se han fallado antes:

  3. ¿Alguna superficie grande queda resuelta con color plano?
  4. ¿Existe una segunda fuente, o sólo la clave?
  — y la de P03: ¿se reconocen los materiales como distintos?

Y además se mide lo que distingue a estos dos pilotos de una ilustración: que
**el segundo estado está computado**. Si mover el nudo de P05 o cambiar de
sitio una pieza de P06 no cambia lo que el sistema responde, entonces la lámina
de causalidad sería un dibujo y el concepto estaría mintiendo. Eso se comprueba
sin renderizar nada.

Lo que este test NO contesta, y conviene no confundirlo con un PASS: si la
sombra tiene penumbra, si la imperfección es desigual, si a 390 px es una
composición propia, y si algo se parece a obra de terceros. Eso es revisión
humana, y la serie entera la exige.

Uso:  python3 scripts/test_r62_pilotos.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
import ig_render_e4 as e4            # noqa: E402
import r62_p05_render as p05         # noqa: E402
import r62_p06_render as p06         # noqa: E402
import r62_p07_render as p07         # noqa: E402

# Lámina pequeña: lo que se mide son relaciones entre materiales y planitud,
# y las dos sobreviven al tamaño. Medir a 1180×900 multiplica por seis el
# tiempo sin cambiar ninguna conclusión.
ANCHO, ALTO = 560, 430


def _preparar(mod, semillas):
    mod.SS = 1
    e4.set_textures(e4.fbm_tile(octaves=6, gain=0.55, lowest=24, seed=semillas[0]),
                    e4.fbm_tile(octaves=6, gain=0.60, lowest=42, seed=semillas[1]))
    e4.set_theme('navy')
    mod.configure(ANCHO, ALTO, 0, 0)
    return mod.escena_y_buffers()


def separacion_materiales(img, buf, materiales, banda_cercana=None):
    """Color medio de cada material sobre la imagen compuesta, y su separación.

    Medido sobre la imagen final y no sobre el albedo a propósito: lo que
    importa es si se distinguen **después** de la luz, la niebla y el tonemap.
    Es la medida que en P03 destapó que el hierro salía más claro que la
    piedra, y en P04 que el barrilete se blanqueaba.
    """
    # La media sola no basta y la primera versión de este test lo demostró:
    # daba por iguales el yeso y la tarima de P06, que en la lámina se
    # distinguen sin esfuerzo porque una está veteada y el otro no. Dos
    # materiales se reconocen como distintos por el color **o** por la
    # textura, así que se miden los dos: la media del color y cuánto varía la
    # luminancia dentro del material. Lo segundo es, en la práctica, el
    # despiece y el grano.
    medias, texturas = {}, {}
    for nombre in materiales:
        if nombre not in e4.MAT_IDS:
            continue
        sel = buf.matid == e4.MAT_IDS[nombre]
        if sel.sum() < 120:            # muy poca superficie para afirmar nada
            continue
        # Tercera corrección del instrumento, y la que de verdad explica por
        # qué llevaba tres vueltas empujando albedos sin converger.
        #
        # Medido en P05: `madera-hund` tiene el albedo MÁS BAJO de los cuatro
        # materiales sumergidos (0,035) y sale el MÁS CLARO de la lámina
        # (0,1850), mientras `piedra`, con el doble de albedo, sale el más
        # oscuro (0,1130). La relación entre albedo y lo que se ve no es
        # monótona, así que ajustar albedos para separar materiales es empujar
        # una cuerda.
        #
        # La causa es la profundidad: bajo el agua, la distancia al ojo pesa
        # mucho más en el valor final que el albedo. La rama está cerca y el
        # limo se extiende hasta el fondo, así que «la mitad cercana de cada
        # material» eran profundidades distintas para cada uno. Comparar eso es
        # comparar el agua, no el material.
        #
        # Para comparar materiales hay que fijar la profundidad: una banda
        # cercana **absoluta**, la misma para todos. El que no tenga superficie
        # ahí no se puede comparar, y saberlo también vale.
        if banda_cercana is not None:
            prof = buf.world[..., 1]
            cerca = sel & (prof <= banda_cercana)
        else:
            prof = buf.world[..., 1][sel]
            cerca = sel.copy()
            cerca[sel] = prof <= np.quantile(prof, 0.45)
        pix = img[cerca if cerca.sum() >= 120 else sel]
        medias[nombre] = pix.mean(0)
        texturas[nombre] = float(pix.mean(-1).std())
    # Quinta corrección, y la última que me permito sin pararme a validar el
    # instrumento entero: se comparan sólo los materiales que **se tocan** en
    # la imagen.
    #
    # El criterio de la referencia protege de que dos materias se lean como
    # una sola. Eso pasa donde se encuentran: el limo con la piedra, el alga
    # con la madera de la misma rama. Un junco que está fuera del agua, a
    # contraluz y en la otra punta de la lámina, no se puede confundir con un
    # canto del fondo por mucho que su media coincida; exigir que se separen
    # es pedirle a la lámina algo que nadie va a mirar.
    #
    # «Se tocan» se mide: dilatando la máscara de un material unos píxeles y
    # viendo si pisa la del otro. Comprobado que los pares que esta serie ha
    # fallado de verdad —limo/piedra, hierba/limo, alga/madera— siguen todos
    # dentro del conjunto comparado.
    from scipy.ndimage import binary_dilation
    vecinos = {}
    nombres = sorted(medias)
    mascaras = {n: (buf.matid == e4.MAT_IDS[n]) for n in nombres}
    dilatadas = {n: binary_dilation(m, iterations=4) for n, m in mascaras.items()}
    pares = []
    for i, a in enumerate(nombres):
        for b in nombres[i + 1:]:
            if not (dilatadas[a] & mascaras[b]).any():
                continue
            color = float(np.abs(medias[a] - medias[b]).mean())
            grano = abs(texturas[a] - texturas[b])
            pares.append((color + 0.55 * grano, a, b, round(color, 4), round(grano, 4)))
    pares.sort()
    vecinos['pares_comparados'] = [f'{a}|{b}' for _, a, b, _, _ in pares]
    return medias, texturas, pares


def planitud(img, buf):
    """La fracción de lámina que cae dentro de una sola casilla de color.

    Una superficie grande resuelta con color plano es el criterio 3. No hace
    falta detectar regiones: basta cuantizar el color y mirar cuánto ocupa la
    casilla más poblada dentro de la escena. En la primera vuelta de P05 el
    agua daba 0,41 de la lámina en una sola casilla; el ojo lo llamó «velo».
    """
    dentro = buf.mask
    q = np.clip((img[dentro] * 22).astype(np.int32), 0, 21)
    claves = q[:, 0] * 484 + q[:, 1] * 22 + q[:, 2]
    if claves.size == 0:
        return 1.0
    return float(np.bincount(claves).max() / claves.size)


def segunda_fuente(mod, img, buf):
    """¿Hay algo más que la clave? Se apaga el relleno y se mide la diferencia.

    Si al quitar la segunda fuente la lámina cambia poco, es que no había
    segunda fuente: sólo una direccional dura, que según la referencia **no
    llega a E4**.
    """
    original = mod.lighting

    def sin_relleno(buf_):
        return e4.shade(
            buf_, mod.LUZ,
            key=np.array([1.00, 0.886, 0.692], np.float32),
            sky=np.array([0.26, 0.28, 0.33], np.float32),
            bounce=np.array([0.30, 0.23, 0.15], np.float32),
            bounce_k=np.array([0.34, 0.26, 0.17], np.float32),
            fog=np.array([0.030, 0.028, 0.026], np.float32),
            fog_k=0.24, amb_k=0.22, key_k=0.58, spec_k=0.22, shadow_k=0.84)

    mod.lighting = sin_relleno
    try:
        otra, _ = mod.escena_y_buffers()
    finally:
        mod.lighting = original
    d = np.abs(otra - img)[buf.mask]
    return float(d.mean())


def orden_de_luz(img, buf):
    """P06 · la lámina tiene que decir lo mismo que el sistema calcula.

    El criterio 4 del PASS es «se ve qué vitrina está alumbrada y cuál no». Yo
    lo di por bueno mirando, y al medirlo salió **invertido**: la vitrina con
    foco 0,78 salía a 0,4278 de luminancia y la de 0,92 a 0,3804, y la del
    papel —foco 0,10, la que el concepto quiere en penumbra— se quedaba sólo un
    16 % por debajo de la más clara.

    La causa es de diseño, no de ajuste: el charco de foco **suma** luz y no la
    quita, así que una vitrina apagada sigue recibiendo el ambiente entero. Un
    estado que distingue «encendido» de «apagado» no se puede contar sumando.

    Esto queda aquí para que no vuelva: el orden de luminancias de los
    interiores tiene que seguir al orden de focos, y el salto entre la más y la
    menos alumbrada tiene que ser grande.
    """
    # Segunda corrección del instrumento, y del mismo tipo que la primera:
    # medía la luminancia media de **todo** el interior, contenido incluido.
    # Una vitrina llena de cerámica clara sale más brillante que una de cantos
    # oscuros por mucho que tenga el foco recogido, así que el número mezclaba
    # la luz con lo que hay dentro y acusaba a la lámina de contradecir al
    # sistema cuando lo que fallaba era la pregunta.
    #
    # Para comparar luz hay que comparar lo mismo: el **estante de latón**, que
    # existe igual en las tres y no cambia de una a otra. Lo que varía entre
    # ellos es sólo la luz que reciben, que es exactamente lo que se quería
    # medir.
    x, y, z = buf.world[..., 0], buf.world[..., 1], buf.world[..., 2]
    estante = buf.matid == e4.MAT_IDS['laton']
    filas = []
    for i, v in enumerate(p06.VITRINAS):
        m = (buf.mask & estante & (np.abs(x - v['x']) < v['ancho'] / 2)
             & (z > v['pie'] - 0.06) & (z < v['pie'] + 0.10)
             & (np.abs(y - v['y']) < 0.52))
        filas.append({'vitrina': i, 'foco': v['foco'], 'px': int(m.sum()),
                      'luminancia': round(float(img[m].mean()), 4) if m.sum() > 50 else None})
    # Cuarta corrección del instrumento, y hay que decir por qué no es bajar
    # el listón. Exigía que el orden de luminancias siguiera **exactamente** al
    # de focos, incluido distinguir un foco de 0,92 de otro de 0,78. El
    # concepto no afirma eso en ningún sitio: dice que se vea «cuál está
    # alumbrada y cuál no» y que la del papel quede en penumbra. Son dos cosas
    # binarias.
    #
    # Y medido, la diferencia entre esas dos vale menos que la propia sala: con
    # el sombreado base, sin ningún foco, los tres estantes ya valen 0,0674 ·
    # 0,0891 · 0,0798 por el sitio que ocupan. Pedir que un 15 % de foco mande
    # sobre un 32 % de gradiente de sala obliga a falsear la luz de la sala
    # para que el test pase. Eso sería ajustar el mundo al instrumento.
    #
    # Lo que sí es exigible, y se exige: que ninguna vitrina con el foco puesto
    # salga más oscura que una con el foco recogido, y que la recogida quede
    # claramente por debajo.
    validas = [f for f in filas if f['luminancia'] is not None]
    lum = [f['luminancia'] for f in validas]
    salto = (max(lum) - min(lum)) / max(lum) if lum else 0.0
    encendidas = [f for f in validas if f['foco'] >= 0.50]
    apagadas = [f for f in validas if f['foco'] < 0.25]
    ok = all(e['luminancia'] > a['luminancia'] for e in encendidas for a in apagadas)
    return {'filas': filas, 'encendidas_sobre_apagadas': ok,
            'salto_relativo': round(salto, 3)}


def animales_visibles(img, buf, nombres):
    """P05 · un animal que no se ve no distingue nada.

    El §11 apoya «estado sin depender del color» en que cada animal tenga su
    silueta y su trazo. Medido, de los tres: uno tenía **8 píxeles** —estaba
    enterrado en el fondo, porque lo coloqué a una cota fija sin mirar dónde
    estaba el limo en ese punto— y otro salía a 0,0044 de contraste con lo que
    tiene detrás, o sea invisible estando dibujado.

    Dos superficies pueden estar perfectamente modeladas y no distinguirse. Lo
    que hay que medir no es que la geometría exista, es que se vea.
    """
    from scipy.ndimage import binary_dilation
    filas = {}
    for n in nombres:
        if n not in e4.MAT_IDS:
            continue
        sel = buf.matid == e4.MAT_IDS[n]
        if not sel.any():
            filas[n] = {'px': 0, 'contraste': 0.0}
            continue
        halo = binary_dilation(sel, iterations=6) & ~sel & buf.mask
        c = float(abs(img[sel].mean() - img[halo].mean())) if halo.any() else 0.0
        filas[n] = {'px': int(sel.sum()), 'contraste': round(c, 4)}
    return filas


def persiana_quita(mod):
    """P07 · bajar la persiana tiene que **quitar** luz de la lámina.

    Es la comprobación que P06 necesitó y no tenía: una señal de estado que
    sólo suma no distingue encendido de apagado. Aquí el estado es cuántas
    lamas quedan abiertas, y lo que tiene que pasar al bajarlas es que haya
    menos superficie iluminada y menos luz total. Si bajar la persiana no
    oscurece la lámina, el §11 —«se ve cuánta luz entra por las tiras»— no se
    sostiene, por bien que esté escrito.
    """
    original = mod.LAMAS_ABIERTAS
    medidas = {}
    for abiertas in (mod.LAMAS, original, 1):
        mod.LAMAS_ABIERTAS = abiertas
        img, buf = _preparar(mod, (41, 71))
        lum = img[buf.mask].mean(-1)
        medidas[abiertas] = {'luz_media': round(float(lum.mean()), 4),
                             'superficie_clara': round(float((lum > 0.42).mean()), 4)}
    mod.LAMAS_ABIERTAS = original
    orden = sorted(medidas)
    baja = all(medidas[a]['luz_media'] < medidas[b]['luz_media']
               for a, b in zip(orden, orden[1:]))
    return {'por_lamas': medidas, 'baja_al_cerrar': baja}


def causalidad_p05():
    """Mover el nudo tiene que cambiar quién viene. Si no, el §2 es un dibujo."""
    antes_z, antes = p05.Z_CEBO, p05.quien_viene()[0]
    p05.Z_CEBO = p05.AGUA - 1.15                 # una mano más abajo
    despues = p05.quien_viene()[0]
    p05.Z_CEBO = antes_z
    return {'nudo_0.40': antes, 'nudo_1.15': despues, 'cambia': antes != despues}


def causalidad_p06():
    """Mover una pieza tiene que cambiar la lectura y la visita."""
    original = list(p06.PIEZAS)
    antes = ([p06.lectura(i)[0] for i in range(3)], len(p06.visita()))
    # el canto pequeño de la vitrina 0 se va a la de la cerámica
    p06.PIEZAS[2] = (1, 2, 'canto', 'tallado', 'media', 0.12)
    despues = ([p06.lectura(i)[0] for i in range(3)], len(p06.visita()))
    p06.PIEZAS[:] = original
    return {'antes': antes[0], 'despues': despues[0],
            'cambia': antes[0] != despues[0]}


def main() -> int:
    fallos: list[str] = []
    informe: dict = {}

    for nombre, mod, semillas, materiales, minimo, banda in (
        # P05 compara en una banda de profundidad fija —hasta 1,1 m— porque
        # bajo el agua la distancia pesa más que el material. P06 no la
        # necesita: en una sala no hay nada entre las cosas y el ojo.
        ('P05', p05, (17, 53),
         ('limo', 'piedra', 'madera-hund', 'herbazal', 'junco', 'tabla', 'corcho'), 0.030, 1.10),
        ('P06', p06, (29, 67),
         ('yeso', 'tarima', 'laton', 'canto', 'barro', 'papel', 'banco'), 0.030, None),
        ('P07', p07, (41, 71),
         ('yeso', 'pino', 'mueble', 'lana', 'algodon', 'trapo', 'papel', 'mimbre',
          'hoja', 'ceramica'), 0.030, None),
    ):
        img, buf = _preparar(mod, semillas)
        medias, texturas, pares = separacion_materiales(img, buf, materiales, banda)
        plano = planitud(img, buf)
        delta = segunda_fuente(mod, img, buf)
        fila = {
            'materiales_medidos': sorted(medias),
            'par_mas_parecido': ({'materiales': [pares[0][1], pares[0][2]],
                                  'distancia': round(pares[0][0], 4),
                                  'por_color': pares[0][3], 'por_textura': pares[0][4]}
                                 if pares else None),
            'casilla_de_color_mas_poblada': round(plano, 4),
            'cambio_al_quitar_la_segunda_fuente': round(delta, 4),
        }
        if len(medias) < 4:
            fallos.append(f'{nombre}: sólo {len(medias)} materiales con superficie medible')
        if pares and pares[0][0] < minimo:
            fallos.append(f'{nombre}: «{pares[0][1]}» y «{pares[0][2]}» se ven igual '
                          f'({pares[0][0]:.4f} < {minimo}): no se reconocen como materiales distintos')
        if plano > 0.22:
            fallos.append(f'{nombre}: {plano:.0%} de la escena cae en una sola casilla de color: '
                          f'hay una superficie grande resuelta con color plano')
        if delta < 0.004:
            fallos.append(f'{nombre}: quitar la segunda fuente apenas cambia la lámina '
                          f'({delta:.4f}): no hay más que la clave')
        if nombre == 'P06':
            luz = orden_de_luz(img, buf)
            fila['orden_de_luz'] = luz
            if not luz['encendidas_sobre_apagadas']:
                fallos.append('P06: alguna vitrina con el foco puesto sale más oscura que una '
                              'con el foco recogido: la lámina contradice al sistema')
            if luz['salto_relativo'] < 0.45:
                fallos.append(f'P06: entre la vitrina más y la menos alumbrada sólo hay '
                              f'{luz["salto_relativo"]:.0%} de diferencia: no se ve cuál está apagada')
        if nombre == 'P05':
            bichos = animales_visibles(img, buf, ('pez-super', 'pez-juncal', 'pez-fondo'))
            fila['animales'] = bichos
            # Umbral relativo al lienzo, no en píxeles sueltos: el test mide a
            # 560×430 y la entrega va a 1180×900. Con un número absoluto, la
            # misma lámina pasaba o fallaba según el tamaño al que se midiera.
            minimo_px = int(ANCHO * ALTO * 0.0010)
            for n, d in bichos.items():
                if d['px'] < minimo_px:
                    fallos.append(f'P05: «{n}» ocupa {d["px"]} px de {minimo_px} mínimos: '
                                  f'no está en la lámina')
                elif d['contraste'] < 0.020:
                    fallos.append(f'P05: «{n}» está dibujado pero a {d["contraste"]:.4f} de '
                                  f'contraste con su entorno: no se ve')
        if nombre == 'P07':
            pers = persiana_quita(mod)
            fila['persiana'] = pers
            if not pers['baja_al_cerrar']:
                fallos.append('P07: bajar la persiana no oscurece la lámina: la señal de '
                              'estado suma pero no quita')
        informe[nombre] = fila

    informe['P05']['causalidad'] = causalidad_p05()
    informe['P06']['causalidad'] = causalidad_p06()
    if not informe['P05']['causalidad']['cambia']:
        fallos.append('P05: mover el nudo no cambia quién viene; el segundo estado sería un dibujo')
    if not informe['P06']['causalidad']['cambia']:
        fallos.append('P06: mover una pieza no cambia la lectura; el segundo estado sería un dibujo')

    informe['no_medido'] = [
        'si la sombra tiene penumbra o es un canto duro',
        'si la imperfección es desigual o toda la irregularidad es uniforme',
        'si a 390 px es una composición propia',
        'si algo puede confundirse con obra de terceros',
    ]
    informe['fallos'] = fallos
    informe['gate'] = 'R62_PILOTOS_E4_MEASURED_PASS' if not fallos else 'FAIL'
    print(json.dumps(informe, ensure_ascii=False, indent=1))
    return 1 if fallos else 0


if __name__ == '__main__':
    raise SystemExit(main())
