# Referencia E4 de Juegos · medida sobre P01

**Estado:** `R62_P01_HABITACION_E4_HUMAN_APPROVED`
**Fecha:** 28/09/2026
**Ámbito:** los pilotos de Juegos y cualquier superficie que la norma visual de
septiembre de 2026 obligue a rebenchmarkear.

Pregunté tres veces contra qué referencia medíamos. La aprobación de P01 la
contesta: **la referencia es P01**. Este documento la hace medible, porque una
referencia que sólo existe como «mira la lámina» se interpreta distinto cada
vez y no converge.

Fuente: `scripts/r62_p01_render.py`, rama
`claude/r62-p01-render-premium-20260928`. Los números de abajo están sacados
del script, no de memoria.

---

## Lo que E4 significa en concreto

### Luz

| Rasgo | En P01 |
| --- | --- |
| Clave direccional | una sola, normalizada `(-0.46, -0.30, 0.84)` |
| Especular | Blinn-Phong con exponente derivado de la rugosidad por material |
| Ambiente | hemisférico: cielo frío arriba, rebote cálido abajo, modulado por oclusión |
| Sombra | marcha de rayo en espacio de pantalla, **4 direcciones promediadas** para penumbra que se abre con la distancia; 58 pasos crecientes; media resolución |
| Oclusión | por horizonte, 12 direcciones, 5 radios |
| Fuente secundaria | derrame desde el vano, caída `1/(1+(d/3,2)²)`, tono más cálido que la clave |
| Rebote | término cálido del suelo hacia las caras que miran abajo |

**El listón:** una fuente comprensible, sombra con penumbra, contacto, oclusión
y al menos un rebote o derrame. Una direccional dura y sola **no llega a E4**:
así era P01 en la vuelta que se rechazó.

### Material

| Rasgo | En P01 |
| --- | --- |
| Textura | fBm procedural propio, dos escalas, proyección triplanar por coordenadas de mundo |
| Estratos | función del eje vertical deformada por el ruido |
| Despiece | por material: muro a soga 0,98 × 0,44 m; suelo a losa 1,00 m a junta corrida |
| Junta | 28 mm, rehundida: oscurece el albedo **y gira la normal** a cada lado |
| Variación por pieza | hash determinista del índice de sillar, ±10 % de tono |
| Desgaste de canto | 85 mm **multiplicado por ruido**, así unos cantos están rotos y otros no |
| Bisel | la normal se inclina hacia fuera cerca de la arista |
| Manchas | humedad que sube hasta 2,1 m, más veladura general |

**El listón:** ninguna superficie que represente materia puede quedar resuelta
con color plano, y ninguna imperfección puede ser uniforme. Si el desgaste es
igual en todas las piezas, se lee como patrón y no como uso.

### Composición y móvil

**Dos composiciones, no una escalada.** Es la parte que fallé y que más conviene
que quede escrita.

| | Escritorio | Móvil |
| --- | --- | --- |
| Lienzo | 1180 × 880 | 390 × 730, vertical |
| Encuadre | bandas de 104 arriba y 120 abajo | bandas de 62 y 150; margen casi nulo |
| Interfaz | miniaturas de 19 px, teclas dibujadas | objetivos de **60 px**, texto táctil |
| Detalle secundario | crédito de lámina | se oculta |

El §12 permite simplificar, ocultar detalle y cambiar disposición. Lo que
prohíbe —y es el error concreto que cometí— es servir la composición de
escritorio encogida.

### Entrega

- Raster con la materia y la luz; **texto e interfaz en vector encima**, para
  que escale y lo lea un lector de pantalla.
- SVG autocontenido con el raster incrustado como WebP en base64.
- Pesos de referencia: **45 KB** escritorio, **26 KB** móvil.
- Determinista: semilla fija, sin reloj. El mismo escenario da el mismo píxel,
  así que una lámina se puede regenerar y comparar.

---

## Lo que NO forma parte de la referencia

El §10 de la norma dice que los productos comparten **calidad, no plantilla**,
y esto importa para no convertir Iris Green en un renderizador con pieles.

No son referencia: la paleta cálida de caliza, la proyección axonométrica, la
arquitectura de sillería, el latón como acento, ni el vacío oscuro de fondo.
Todo eso es el lenguaje de P01. El Terrario será húmedo y frontal; el Rincón,
sensorial; Intereses, mundos temáticos.

Lo que se hereda es el **nivel de exigencia** de las tres tablas de arriba.

---

## Cómo medir un piloto contra esta referencia

Las diez preguntas del §15 siguen mandando y siguen exigiendo revisión humana.
Estas cinco son las que en P01 marcaron la diferencia entre rechazo y
aprobación, y por eso conviene mirarlas primero:

1. ¿La sombra tiene penumbra, o es un canto duro?
2. ¿Hay alguna imperfección **desigual** —desgaste, mancha, variación pieza a
   pieza—, o toda la irregularidad es uniforme?
3. ¿Alguna superficie grande queda resuelta con color plano?
4. ¿Existe una segunda fuente —derrame, rebote— o sólo la clave?
5. A 390 px, ¿es una composición propia o la de escritorio encogida?

Un «no» en cualquiera de las cinco fue, en P01, motivo de rework.

---

## Deuda conocida

El motor sigue viviendo dentro del script de P01. Intenté extraerlo al aprobarse
la referencia y lo dejé a medias a propósito: el motor y la escena no se separan
con un corte limpio, y no merece la pena operar sobre una lámina recién aprobada
guiándome por suposiciones. **El reparto correcto lo dirá el segundo piloto que
lo use**, que es cuando se ve qué es de verdad común y qué era de P01.
