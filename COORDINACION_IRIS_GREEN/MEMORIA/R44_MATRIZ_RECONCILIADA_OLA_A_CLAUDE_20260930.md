# R44 · matriz reconciliada · Ola A · Claude · 30/09/2026

Reconciliación obligatoria del §3 de `01_A0_FRAMEWORK_8_PILOTOS.md`, hecha
**antes** de implementar ningún piloto.

Fuente: `R44_MATRIZ_64_RETOS_TALLER_CLAUDE_20260928.md`,
sha256 `f059d56607c97336612ac6112592264d7b34d3bbfa3d358aed400a8b4166695e`,
88 581 bytes, preservada en esta misma rama. Nada reconstruido de memoria:
las 64 fichas se leen del fichero.

## 1 · Qué está verificado y qué no

Distingo las dos cosas, porque mezclarlas es lo que convierte una QA en una
afirmación.

**Verificado ejecutando:**

- las 64 filas se leen del fichero y el reparto real sale **55 Ola A y 9 Ola B**,
  que es lo que la propia matriz declaraba;
- `ENGINE_VERIFIED`: los 27 estudios del Taller tienen página y motor cargado
  -comprobado en el build, no supuesto-. Ningún reto de Ola A se queda sin motor;
- `EXPORT_VERIFIED`: los formatos que pide cada ficha se contrastan contra los
  exportadores reales del motor de su estudio más el núcleo. **Un solo hueco**,
  abajo;
- `INPUT_VERIFIED`: los 27 estudios tienen teclado, campos numéricos como
  alternativa al arrastre y manejo de foco, vía `ig-suite-core.js` y su propio
  motor;
- `ACCESSIBILITY_VERIFIED`: axe-core sobre **los 27 estudios**, WCAG 2.0/2.1/2.2
  A y AA, DARK NAVY a 1440: **0 infracciones**.

**No verificado todavía, y por eso no lo llamo PASS:** la accesibilidad de los
retos en sí, que aún no existen. Los cuatro flags de abajo dicen que *el estudio
que hospeda el reto* está en condiciones, no que el reto esté hecho.

## 2 · El único hueco de exportación

`X08` -Una máquina que se puede montar- pide **STL de una pieza**, y el motor de
Máquinas no exporta STL: el exportador STL vive en Modelado 3D.

No es un defecto de la matriz. Es exactamente el caso que el §6 ya bloquea: los
cruzados no se construyen hasta `CROSS_STUDIO_IO_VERIFIED`, y este es el tipo de
dependencia que ese gate tiene que resolver -formato exacto de export/import
entre estudios y su fallback-. Queda anotado como requisito concreto de ese gate,
no como trabajo de A0.

## 3 · Colisión de nombre que hay que evitar

El Taller ya sirve `es/taller/taller-retos.json`: **72 retos** que son propuestas
de papel y lápiz -«Dibuja el mismo objeto diez veces»-, con campos `mesa`, `dur`,
`es`/`en`. No son los retos R44, que acaban en artefacto digital dentro del
estudio.

No es trabajo duplicado, pero comparten la palabra «retos». El framework R44 usa
espacio de nombres propio y no toca ese fichero ni su UI. Lo dejo señalado para
que la integración de R67 no los mezcle.

## 4 · Correcciones aplicadas a la matriz

La orden nombra cuatro y pide revisar equivalentes. Busqué en las 64 fichas por
forma de afirmación absoluta, no por intuición: aparecen **las cuatro nombradas
más una quinta**, `E22`, que además está en uno de los ocho pilotos.

Todas están en el mismo campo, «Criterio de aprobación humana», que es donde una
promesa se vuelve contractual.

### `E09`

**Antes:** Ningún par de la paleta se confunde en protanopía, deuteranopía ni tritanopía.

**Ahora:** Ningún par de la paleta queda indistinguible en la simulación de protanopía, deuteranopía y tritanopía que incluye el estudio, y además cada par se distingue por luminosidad o por forma, no solo por tono.

**Por qué:** la redacción anterior promete una garantía de daltonismo que ninguna simulación puede dar. La nueva dice qué comprueba la herramienta y exige que el color no sea el único canal.

### `E18`

**Antes:** La revisión no marca ningún incumplimiento de paso libre ni de círculo de giro.

**Ahora:** La revisión orientativa no señala ningún paso libre ni círculo de giro por debajo de los valores de referencia usados como material educativo.

**Por qué:** la anterior se lee como conformidad normativa. Esto es orientación educativa y no un proyecto técnico ni una certificación.

### `X03`

**Antes:** Una planta que pasa la revisión de accesibilidad y una estructura que pasa la prueba de carga.

**Ahora:** Una planta cuya revisión orientativa de accesibilidad no señala incidencias y una estructura que aguanta la carga de la prueba del estudio.

**Por qué:** mismo motivo que E18: «pasa la revisión de accesibilidad» suena a certificado. Queda como revisión orientativa.

### `E35`

**Antes:** Ventaja del primer jugador por debajo de diez puntos en la simulación, con el número de partidas anotado.

**Ahora:** La ventaja del primer jugador queda medida y anotada con el número de partidas simuladas, y la persona explica qué regla la reduce. No se fija un umbral como garantía.

**Por qué:** diez puntos era un umbral absoluto sin fundamento declarado. Lo que enseña el reto es medir y razonar, no acertar una cifra.

### `E41`

**Antes:** Cuatro esquinas ajustadas y un espectáculo exportado que se reproduce solo.

**Ahora:** Cuatro esquinas ajustadas y un espectáculo exportado que se reproduce cuando la persona lo pone en marcha.

**Por qué:** ningún espectáculo exportado arranca solo. Además de la orden, un arranque automático choca con reproducción sin intervención y con movimiento reducido.

### `E22`

**Antes:** La secuencia completa sin estados imposibles y sin ningún LED fundido.

**Ahora:** La secuencia se completa sin estados imposibles y la simulación no informa de ningún LED fuera de su rango de corriente.

**Por qué:** equivalente absoluto encontrado por mí, no nombrado en la orden. «Sin ningún LED fundido» promete un resultado universal; lo que existe es el informe de la simulación.

## 5 · Etapa y audiencia, separadas

La matriz traía una sola columna «Etapas» que mezclaba dos cosas distintas. Se
separan, como pide el §3:

- `recommended_stage` / `starter_stage`: **solo cambian el ejemplo y el
  andamiaje**. Nunca cierran una herramienta ni un reto.
- `audience` / `sensitivity` / `discovery`: pertenecen a child-safe y al
  descubrimiento, y son los que sí pueden filtrar.

Taxonomía canónica aplicada: `AGE_0_12`, `AGE_13_17`, `AGE_18_PLUS`,
`ALL_AGES`. Traducción de lo que decía la matriz:

| Matriz | recommended_stage | audience |
|---|---|---|
| Todas | `ALL_AGES` | `ALL_AGES` |
| Adolescencia, adultez | `AGE_13_17` como starter | `ALL_AGES`, con ejemplo adulto |

Ningún reto de Ola A queda cerrado por edad. Un reto marcado «Adolescencia,
adultez» sigue abierto a `AGE_0_12`: lo que cambia es el ejemplo con el que
entra y el andamiaje, no el acceso a la herramienta.

## 6 · Los ocho pilotos autorizados, con su fila real

Uno por ámbito del §4, todos de Ola A y todos existentes en la matriz:

| Ámbito | ID | Título | Estudio | Artefacto | Etapas |
|---|---|---|---|---|---|
| Dibujo | `E01` | Una línea sin levantar el lápiz | Dibujo | PNG y proyecto | Todas |
| Pixel art | `E06` | Baldosa que no se nota | Pixel art | PNG repetible y vista en mosaico | Todas |
| Estructuras | `E17` | Un puente que aguanta el camión | Estructuras y puentes | Imagen del montaje y cálculo educativo | Todas |
| Circuitos | `E22` | Un semáforo que no se equivoca | Circuitos | Esquema SVG y tabla de verdad CSV | Todas |
| Escritura | `E28` | Cincuenta palabras exactas | Escritura con restricciones | TXT, MD y HTML accesible | Todas |
| Juego de mesa | `E34` | Un juego para dos con cinco reglas | Juegos de mesa | Tablero, cartas y reglas imprimibles | Todas |
| Música | `E38` | Un ritmo que se reconoce | Ritmo y secuenciador | WAV y MIDI | Todas |
| Videojuegos | `E44` | Un nivel que se puede ganar | Videojuegos | Juego HTML autocontenido | Todas |

Ninguno inventado: los ocho salen de la matriz preservada, con su ID.

## 7 · Tabla de verificación · los 55 de Ola A

`M` motor · `E` export · `I` entrada -teclado y alternativa al arrastre- ·
`A` accesibilidad del estudio que lo hospeda.

| ID | Estudio | M | E | I | A | Nota |
|---|---|:--:|:--:|:--:|:--:|---|
| `E01` | Dibujo | sí | sí | sí | sí |  |
| `E02` | Dibujo | sí | sí | sí | sí |  |
| `E03` | Dibujo | sí | sí | sí | sí |  |
| `E04` | Diseño gráfico | sí | sí | sí | sí |  |
| `E05` | Diseño gráfico | sí | sí | sí | sí |  |
| `E06` | Pixel art | sí | sí | sí | sí |  |
| `E07` | Pixel art | sí | sí | sí | sí |  |
| `E08` | Cómic y guion gráfico | sí | sí | sí | sí |  |
| `E09` | Color | sí | sí | sí | sí |  |
| `E10` | Color | sí | sí | sí | sí |  |
| `E11` | Patrones y arte generativo | sí | sí | sí | sí |  |
| `E12` | Patrones y arte generativo | sí | sí | sí | sí |  |
| `E13` | Fotografía y composición | sí | sí | sí | sí |  |
| `E14` | Fotografía y composición | sí | sí | sí | sí |  |
| `E15` | Moda y textil | sí | sí | sí | sí |  |
| `E16` | Moda y textil | sí | sí | sí | sí |  |
| `E17` | Estructuras y puentes | sí | sí | sí | sí |  |
| `E18` | Arquitectura y planos | sí | sí | sí | sí |  |
| `E19` | Modelado 3D | sí | sí | sí | sí |  |
| `E20` | Máquinas e inventos | sí | sí | sí | sí |  |
| `E21` | Máquinas e inventos | sí | sí | sí | sí |  |
| `E22` | Circuitos | sí | sí | sí | sí |  |
| `E23` | Circuitos | sí | sí | sí | sí |  |
| `E24` | Papiroflexia y poliedros | sí | sí | sí | sí |  |
| `E25` | Papiroflexia y poliedros | sí | sí | sí | sí |  |
| `E26` | Simulaciones | sí | sí | sí | sí |  |
| `E27` | Simulaciones | sí | sí | sí | sí |  |
| `E28` | Escritura con restricciones | sí | sí | sí | sí |  |
| `E29` | Escritura con restricciones | sí | sí | sí | sí |  |
| `E30` | Mundos | sí | sí | sí | sí |  |
| `E31` | Mundos | sí | sí | sí | sí |  |
| `E32` | Lenguas inventadas | sí | sí | sí | sí |  |
| `E33` | Lenguas inventadas | sí | sí | sí | sí |  |
| `E34` | Juegos de mesa | sí | sí | sí | sí |  |
| `E35` | Juegos de mesa | sí | sí | sí | sí |  |
| `E36` | Ideas e inventos | sí | sí | sí | sí |  |
| `E37` | Ideas e inventos | sí | sí | sí | sí |  |
| `E38` | Ritmo y secuenciador | sí | sí | sí | sí |  |
| `E39` | Composición | sí | sí | sí | sí |  |
| `E40` | Síntesis y paisajes sonoros | sí | sí | sí | sí |  |
| `E41` | Videomapping | sí | sí | sí | sí |  |
| `E42` | Programación | sí | sí | sí | sí |  |
| `E43` | Robótica | sí | sí | sí | sí |  |
| `E44` | Videojuegos | sí | sí | sí | sí |  |
| `X01` | Videojuegos | sí | sí | sí | sí |  |
| `X02` | Cómic y guion gráfico | sí | sí | sí | sí |  |
| `X03` | Arquitectura y planos | sí | sí | sí | sí |  |
| `X04` | Mundos | sí | sí | sí | sí |  |
| `X05` | Juegos de mesa | sí | sí | sí | sí |  |
| `X08` | Máquinas e inventos | sí | NO | sí | sí | falta STL en este motor |
| `C02` | Composición | sí | sí | sí | sí |  |
| `C03` | Escritura con restricciones | sí | sí | sí | sí |  |
| `C04` | Composición | sí | sí | sí | sí |  |
| `C05` | Arquitectura y planos | sí | sí | sí | sí |  |
| `C07` | Simulaciones | sí | sí | sí | sí |  |

## 8 · Qué queda fuera de A0

- **Ola B, 9 retos**: necesitan los estudios candidatos Animación y Mapas, que no
  existen en el Taller. Comprobado: son los dos únicos nombres de estudio de la
  matriz que no resuelven contra un estudio real.
- **X01–X08**: no se construyen como lote hasta `CROSS_STUDIO_IO_VERIFIED`.
- **Calendario**: `SOURCE_RECHECK_BEFORE_RELEASE` antes de publicar cualquier
  reto fechado.
- **MIDI, microcontroladores, voz y radio**: capacidad opcional, nunca requisito
  de completado.

## 9 · Relación con R65 y R67

R65 queda cerrado en `R65_TALLER_27_PLUS_9_HUMAN_APPROVED_FOR_R67_INTEGRATION` y
**no se reabre**. R44 se construye en rama propia y no se integra en A2/R67 hasta
que R65 esté integrado en R67 Fase 3, A0 esté preservado, y pasen revisión de
Astra/Aura y la HUMAN QA de María.
