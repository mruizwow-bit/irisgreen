# AXIOMA · A11Y QA · CIELO V2 + HORIZONTE B00 · 03/10/2026

Estado:
`AXIOMA_BATCH_REWORK_REQUIRED`

Carril auditado:
- rama: `motor/prisma-cover-cielo-b00-20261003`
- HEAD: `9f1d414641b17d85236ad9ecd9dab4f1dc07ab0d`
- CI declarado: `37108584205` · SUCCESS
- gate de entrada: `INTEREST_01_CIELO_V2_VISUAL_REWORK_READY_FOR_HUMAN_QA`

Contrato duro:
`EXPLORE → LOCATE → REVEAL`

Alcance Axioma:
- accesibilidad;
- contraste;
- reduced/no-motion;
- equivalentes textuales;
- ninguna información esencial depende solo de la imagen.

No se revisa ni reabre dirección artística.

## Resultado ejecutivo

- ARTE / HORIZONTE B00: **KEEP**
- EXPLORE → LOCATE → REVEAL: **IMPLEMENTADO**
- ES/EN: **PASS**
- TARGETS >=44 px: **PASS**
- TECLADO PARA ORIENTACIÓN/ZOOM: **PASS**
- FORCED COLORS: **PASS con fallback textual/DOM**
- CONTRASTE DE CONTROLES NUEVOS: **PASS**
- REDUCED MOTION: **PASS**
- NO-MOTION ESTRICTO: **REWORK_REQUIRED**
- EQUIVALENTE TEXTUAL DE REVEAL: **PASS**
- EQUIVALENTE TEXTUAL DE LOCATE: **REWORK_REQUIRED**
- DEPENDENCIA SOLO DE IMAGEN: **REWORK_REQUIRED para información espacial**
- RERENDER / REDRAW: **NO**

## 1 · Contraste

Pares críticos declarados por el CSS del carril:

- LIGHT texto `#17395c` sobre `#f8fafc` ≈ **11.30:1**
- LIGHT foco/acento `#5a49a8` sobre `#f8fafc` ≈ **6.80:1**
- NAVY texto `#eef4f8` sobre `#10263f` ≈ **13.81:1**
- NAVY foco/acento `#d5c8ff` sobre `#10263f` ≈ **9.87:1**
- foco sobre escena `#f0dc84` sobre `#06101d` ≈ **13.89:1**

No se detecta blocker de contraste en los nuevos controles/estados auditados.

Estado:
`CIELO_V2_AXIOMA_CONTRAST_PASS`

## 2 · Reduced motion

La preferencia del sistema se resuelve con:
`prefers-reduced-motion: reduce → reduced`.

En `moveCamera()`:
- NORMAL usa interpolación animada con `requestAnimationFrame`;
- REDUCED y NONE saltan directamente al estado final, sin easing ni transición animada.

El CSS además elimina:
- animation;
- transition;
- smooth scroll

para REDUCED/NONE.

Estado:
`CIELO_V2_AXIOMA_REDUCED_MOTION_PASS`

## 3 · No-motion estricto

Problema:

Aunque `motion=none` elimina la animación programática, el listener de:
`pointermove`

sigue actualizando continuamente:
- azimut;
- altura;
- render

mientras la persona arrastra.

Por tanto, el modo llamado **Sin movimiento / No motion** todavía permite movimiento continuo del cielo mediante drag.

Esto no impide EXPLORE porque existen:
- botones direccionales;
- teclado;
- zoom por botones/teclado;
- Home/reset.

Corrección mínima esperada:
- en `motion=none`, desactivar el seguimiento continuo de `pointermove`;
- conservar navegación discreta mediante botones/teclado;
- alternativamente, acumular el gesto y aplicar el cambio al final, sin movimiento continuo.

No tocar geometría, horizonte ni arte.

Estado:
`CIELO_V2_AXIOMA_NO_MOTION_REWORK_REQUIRED`

## 4 · Equivalentes textuales

### REVEAL

PASS.

Al seleccionar una estrella:
- nombre/designación;
- magnitud;
- distancia;
- tipo espectral;
- constelación

se exponen como HTML real mediante `dl/dt/dd`.

Al seleccionar una constelación:
- nombre/abreviatura;
- figura;
- altura aproximada alta/baja;
- mes orientativo

se exponen en texto real.

El panel usa `aria-live="polite"`.

### LOCATE

REWORK_REQUIRED.

La escena visual comunica información espacial que no tiene actualmente equivalente textual suficiente:
- posición relativa de estrellas;
- dirección cardinal/azimut;
- altura de cada estrella;
- dirección de los planetas;
- estructura espacial de las figuras de constelación.

Los botones de estrella exponen:
- nombre;
- magnitud;

pero no exponen:
- altitud;
- azimut/dirección.

El panel de estrella tampoco los muestra.
El contexto planetario textual muestra altura, pero no dirección.

Dado que `LOCATE` es parte explícita de la acción principal, esa información espacial no puede quedar disponible únicamente en canvas/posición visual.

Corrección mínima:
1. estrella: añadir al nombre accesible y/o ficha:
   - altura;
   - dirección cardinal/azimut.
2. lista “En esta vista”: incluir al menos dirección + altura para cada estrella.
3. constelación: añadir dirección aproximada/centro de figura además de alta/baja.
4. contexto planetario: añadir dirección además de altura.
5. no es necesario describir píxel a píxel el cielo ni convertir la figura en texto largo.

Estado:
`CIELO_V2_AXIOMA_LOCATE_TEXT_EQUIVALENT_REWORK_REQUIRED`

## 5 · Horizonte B00

El horizonte B00 entra como pseudo-elemento visual:
`skyv2-scene::after`.

Axioma lo trata como **decorativo/contextual**, no como fuente de datos astronómicos.

PASS condicionado a mantener esa regla:
ninguna fecha, objeto, dirección o conclusión astronómica puede depender exclusivamente del PNG B00.

Estado:
`CIELO_B00_DECORATIVE_CONTEXT_PASS`

## 6 · Información no solo por imagen/color

PASS parcial:
- nombres y facts tienen alternativa HTML;
- selección usa controles reales;
- forced-colors oculta canvas/targets/labels y conserva paneles/listas.

FAIL acotado:
- la localización espacial del cielo aún depende del dibujo/posición visual.

No hay blocker de color-only identificado en el nuevo flujo:
- `aria-pressed` expone estados;
- activar/desactivar pistas también cambia la presencia de labels;
- tema altera la superficie completa, no solo un indicador cromático.

## 7 · Rework exacto antes de retest

Owner de implementación:
**branch owner / Motor en cobertura Prisma**.

Solo runtime/texto:
1. NONE sin drag continuo;
2. altitud + dirección accesibles para estrellas;
3. dirección de planetas en contexto textual;
4. dirección aproximada de constelaciones;
5. añadir assertions a QA para demostrar lo anterior en ES/EN y NORMAL/REDUCED/NONE.

No:
- redraw;
- recolor;
- relight;
- cambio B00;
- main;
- deploy.

## 8 · Retest requerido

Axioma retesta:
- ES/EN;
- 320/390/1440;
- REDUCED;
- NONE;
- teclado;
- touch;
- forced-colors;
- equivalentes textuales de LOCATE;
- contraste de los elementos modificados.

Gate esperado tras corregir:
`CIELO_V2_B00_AXIOMA_A11Y_PASS_READY_FOR_ASTRA`
