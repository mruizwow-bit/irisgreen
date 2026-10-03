# AXIOMA · A11Y QA · ECLIPSES R02 · 03/10/2026

Estado:
`AXIOMA_BATCH_REWORK_REQUIRED`

Carril auditado:
- rama: `motor/prisma-cover-eclipse-r02-20261003`
- HEAD: `c6324e5e879c6fe89a7e82e3530dc4233781a39a`
- CI declarado: `37108890303` · SUCCESS
- gate de entrada: `ECLIPSE_CANONICAL_TYPE_VISUAL_SET_PRISMA_INTEGRATION_PASS`

Contrato:
`EXPLORE → LOCATE → REVEAL`

Alcance:
- accesibilidad;
- contraste;
- reduced/no-motion;
- equivalentes textuales;
- no dependencia exclusiva de imagen.

No se reabre el set visual canónico.

## Resultado ejecutivo

- 6 TIPOS CANÓNICOS: **KEEP**
- 2 SECUENCIAS: **KEEP VISUAL**
- DISPATCH EXACTO + fallback=null: **PASS**
- ES/EN EXTERNO A SVG: **PASS**
- 44px NUEVOS CONTROLES DE TIPOS: **PASS**
- FORCED COLORS: **PASS**
- CONTRASTE NUEVO EXPLORADOR: **PASS**
- CANONICAL ALT: **PASS**
- SEQUENCE ALT: **REWORK_REQUIRED**
- REDUCED MOTION: **FAIL / REWORK_REQUIRED**
- NO-MOTION: **FAIL / REWORK_REQUIRED**
- INFORMACIÓN SOLO EN IMAGEN: **REWORK_REQUIRED solo en las secuencias**
- RERENDER: **NO**

## 1 · Contraste

Pares críticos del nuevo explorador:

- texto de botón `#17395c` sobre `#f4f7fa` ≈ **11.00:1**
- foco `#5a49a8` sobre `#f4f7fa` ≈ **6.61:1**
- texto de fase `#5a2a0c` sobre `#fff4d9` ≈ **10.84:1**
- texto inset `#eef3ff` sobre `#03070f` ≈ **18.15:1**

Los botones activos además exponen `aria-pressed`, y forced-colors usa Highlight/HighlightText.

Estado:
`ECLIPSE_R02_AXIOMA_CONTRAST_PASS`

## 2 · Canonical type equivalents

PASS.

Cada imagen canónica recibe externamente:
- `alt_es` / `alt_en`;
- título localizado en figcaption.

Los seis alt describen la geometría relevante del tipo:
- alineación;
- umbra/penumbra;
- parte cubierta;
- anillo;
- entrada completa/parcial en sombra.

El SVG interno inglés no es la única alternativa.

Estado:
`ECLIPSE_R02_CANONICAL_ALT_PASS`

## 3 · Didactic sequence equivalents

REWORK_REQUIRED.

Las dos secuencias tienen un `alt` genérico:

Solar:
“Secuencia didáctica genérica de las fases de un eclipse solar total.”

Lunar:
“Secuencia didáctica genérica de las fases de un eclipse lunar total.”

Sin embargo, el propio manifest conserva el contenido informativo más preciso:

- solar total:
  `ingress → totality → egress`
- lunar total:
  `penumbral → partial → total → partial → penumbral`

Ese orden es información didáctica y no debe quedar solo en la secuencia visual.

Corrección mínima:
- ES solar:
  “Secuencia: eclipse parcial de entrada → totalidad → eclipse parcial de salida.”
- EN solar:
  “Sequence: partial ingress → totality → partial egress.”
- ES lunar:
  “Secuencia: penumbral → parcial → total → parcial → penumbral.”
- EN lunar:
  “Sequence: penumbral → partial → total → partial → penumbral.”

Puede ir en:
- `alt`, si se mantiene breve;
- o texto/caption adyacente y alt más conciso.

No tocar los SVG.

Estado:
`ECLIPSE_R02_SEQUENCE_TEXT_EQUIVALENT_REWORK_REQUIRED`

## 4 · Reduced motion

FAIL.

La función:
`reduce()`

devuelve true con:
- `prefers-reduced-motion: reduce`;
- `data-ig-motion="off"`.

Pero `start()` sigue ejecutando un `setInterval`.

En NORMAL:
- intervalo 100 ms;
- avance temporal 40 s (o 3 s cerca de totalidad).

En REDUCED/OFF:
- intervalo 200 ms;
- avance temporal se multiplica por 2.

Resultado:
la velocidad temporal efectiva queda aproximadamente igual:
- lejos de totalidad: 400 s simulados/s real;
- cerca de totalidad: 30 s simulados/s real.

Por tanto, REDUCED:
- reduce frecuencia de actualización;
- aumenta el salto por frame;
- **no reduce el movimiento total ni la velocidad efectiva**.

No es un reduced-motion real.

Estado:
`ECLIPSE_R02_REDUCED_MOTION_FAIL`

## 5 · No-motion

FAIL.

`data-ig-motion="off"` entra en el mismo camino que `reduce()` y sigue usando `setInterval`.

Por tanto, el ajuste OFF:
- NO elimina movimiento continuo;
- NO convierte el simulador en actualización discreta/manual.

Corrección mínima:
- con OFF/no-motion, el botón de reproducción automática no debe iniciar avance continuo;
- mantener navegación por:
  - slider;
  - Inicio;
  - Máximo;
  - Final/controles discretos si existen.
- con prefers-reduced-motion, usar actualización discreta y/o un ritmo perceptiblemente reducido, sin compensar aumentando el salto de tiempo.

No tocar visuales canónicos.

Estado:
`ECLIPSE_R02_NO_MOTION_FAIL`

## 6 · EXPLORE → LOCATE → REVEAL

La estructura es accesible en lo esencial:
- EXPLORE: rango/controles temporales nativos y texto de hora;
- LOCATE: select de eclipse + botones de tipo;
- REVEAL: facts HTML + canonical visual + caption/alt.

El canvas dinámico expone `aria-label` con:
- lugar;
- hora;
- fase;
- porcentaje de Sol cubierto.

Además existen datos, mapas y tablas fuera del canvas.

No se detecta dependencia obligatoria del canvas para los facts principales.

La única dependencia de imagen pendiente es el orden didáctico de las dos secuencias.

## 7 · Controles y estado

Nuevo explorador:
- botones reales;
- `aria-pressed`;
- `role=group` con nombre localizado;
- min-height 44 px;
- layout móvil en una columna;
- forced-colors.

Estado:
`ECLIPSE_R02_TYPE_EXPLORER_CONTROL_PASS`

## 8 · Rework exacto

Owner:
**Motor / branch owner**.

Solo runtime/copy:
1. reduced-motion real;
2. no-motion/off sin reproducción continua;
3. secuencia solar: equivalente textual ordenado ES/EN;
4. secuencia lunar: equivalente textual ordenado ES/EN;
5. ampliar tests con reduced + off/no-motion.

No:
- SVG rework;
- re-render;
- cambio de dispatch;
- cambio de 6 tipos;
- main;
- deploy.

## 9 · Retest

Axioma retesta:
- ES/EN;
- 390/1440;
- prefers-reduced-motion;
- `data-ig-motion=off`;
- teclado;
- canonical alt;
- sequence equivalents;
- forced-colors;
- contraste del componente modificado.

Gate esperado:
`ECLIPSE_R02_AXIOMA_A11Y_PASS_READY_FOR_ASTRA`
