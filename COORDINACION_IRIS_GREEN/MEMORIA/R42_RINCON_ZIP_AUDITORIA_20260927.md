# R42 · auditoría Rincon.zip · paquete mixto Design/Rincón/Juegos · 27/09/2026

## Estado

`R42_RINCON_ZIP_AUDIT_SPLIT_REQUIRED`

El archivo recibido como `Rincon.zip` NO es un handoff puro de Rincón. Es la entrega completa `R42-DESIGN-R01` de Claude/Design con cinco commits sobre A2.

ZIP SHA-256:
`0efd80e61ff489ce4f38a0fd496c934cfad565954130300cfbf90c1574d17309`

Manifest interno:
- base A2: `e8cad400a30d5d4857f9f99b0c1070d786958a8b`;
- HEAD empaquetado: `d78330bc3efc3175ec96d8196659db87e920bb75`;
- tree: `4615b69c3a1a32a7de522a1774b7c1f7d7267313`;
- 103 archivos;
- +10934 / −6062;
- 5 commits.

Todos los archivos de `SHA256SUMS.txt` verifican correctamente.

## Decisión

**PROHIBIDO integrar el bundle/los cinco patches como una unidad.**

El paquete mezcla trabajo que hoy pertenece a tres estados diferentes:

1. sistema material Design R01 → superseded por Design R02 aprobado;
2. dos correcciones puntuales de Rincón → siguen siendo necesarias;
3. 13 juegos R03 + 71 pictogramas + fixes móviles → lote independiente no integrado todavía.

## 1 · Sistema material

El commit `9ae07216...` y sus cambios de materiales/transparencia son una versión R01 histórica.

Estado vigente del sistema material:
`R42_DESIGN_CRYSTAL_SYSTEM_READY_FOR_A2`

Paquete vigente: Design R02 revisado por Astra.

Por tanto NO integrar desde Rincon.zip:
- `assets/ig-r42-materials.css/js` R01;
- preferencia de transparencia R01;
- mediciones R01;
- modificaciones material R01 de Taller/Juegos/Intereses/Rincón;
- documentación que declara `R42_DESIGN_CRYSTAL_SYSTEM_READY_FOR_A2` antes del precheck/R02.

R02 tiene precedencia.

## 2 · Dos fixes del Rincón que no deben perderse

El commit material R01 contiene dos correcciones pequeñas sobre la fuente A7 que son independientes del sistema de cristal.

### FIX-RINCON-01 · evitar bucle/mutación redundante en Pantalla limpia

R01 sustituye llamadas directas a:
`document.body.classList.toggle('r42-clean', on)`

por una función idempotente:
`setBodyClass(c,on)`

que solo muta `classList` cuando el estado cambia.

Esto es relevante porque `MutationObserver` observa el atributo `class` de `body` y vuelve a llamar `syncClean`. La entrega R01 registra que la implementación anterior podía congelar Pantalla limpia.

**Comprobación Astra sobre A7 vigente PR #300 HEAD `6c312d3f...`:**
- `assets/rincon-r42.js` SHA `a546b92d...`;
- NO contiene `setBodyClass`;
- SÍ conserva `document.body.classList.toggle('r42-clean',on)`.

Por tanto el fix NO está en el rebuild A7 actual.

### FIX-RINCON-02 · respetar [hidden] en acciones

R01 añade:
`.r42-rincon .r40-scene-actions [hidden]{display:none!important}`

Motivo documentado: una regla `display:flex!important` podía hacer visible `#sceneTouch`, creando una píldora vacía sin nombre accesible.

**Comprobación Astra sobre A7 vigente PR #300 HEAD `6c312d3f...`:**
- `assets/rincon-r42-humanqa.css` SHA `d0e5b6af...`;
- el selector anterior NO está presente.

Por tanto también falta en A7 actual.

### Gate

A7 debe portar solo esos dos fixes sobre su HEAD más nuevo y volver a ejecutar:
- clean mode entrar/salir repetidamente;
- MutationObserver sin feedback loop;
- foco/teclado/Escape;
- `#sceneTouch[hidden]` realmente no renderizado;
- ES/EN;
- 390×844 + desktop;
- real-media preview.

No portar estilos de cristal R01: R02 Design los sustituye.

## 3 · Evidencia visual del Rincón

Las capturas R01 verifican estructura/material local y Pantalla limpia, pero el stage muestra placeholder oscuro, no el vídeo natural real de A7 HQA.

No pueden sustituir:
- PR #300 real media;
- Deploy Preview;
- escucha;
- HUMAN QA visual/auditiva.

La evidencia R01 sí conserva valor para chrome y controles.

## 4 · Lote de Juegos R03

El paquete añade 13 juegos sobre los 297 de A1:
- preparar-una-reunion
- prioriza-tus-tareas
- cocina-pasta
- limpia-la-cocina
- el-autobus-no-llega
- preparar-un-examen
- una-quedada
- pedir-ayuda
- volver-a-casa-con-calma
- el-dia-del-viaje
- bolsa-de-la-piscina
- hacer-un-tramite
- ropa-segun-el-plan

Astra comprobó PR/head A1 vigente `8f686098...`: los 13 slugs están ausentes y el dataset sigue declarando 297 juegos.

El lote también contiene 71 pictogramas Mulberry R03 con manifest/licencia y pasa sus gates locales según la evidencia recibida.

No integrar el lote a través del bundle Design R01.

Debe preservarse como handoff independiente para el carril Juegos/Recursos y pasar por el modelo child-safe vigente antes de integración. La propia entrega declara que ningún juego enlaza a contenido S2.

## 5 · Fix móvil de Juegos que sigue ausente

R01 modifica `arriba()` en `assets/juegos-iris.js` para descontar la altura real de una cabecera sticky/fixed al abrir un juego, además de 24 px.

Astra comprobó A1 HEAD `8f686098...`:
- SHA `a0821606...`;
- conserva el offset fijo antiguo;
- no contiene cálculo de `header.hd.getBoundingClientRect().height`.

La entrega R01 lo usó para el gate WCAG 2.4.11 y reporta 273/273 comprobaciones móviles.

Este fix debe evaluarse/portarse en el lote Juegos, no mezclarse con materiales R01.

Los ajustes CSS R01 de 44×44, scroll-padding y títulos móviles deben reconciliarse con Design R02 antes de portar: no copiar literalmente selectores/materiales de la versión R01.

## 6 · QA recibido

- qa navegador: 111/111 PASS;
- qa móvil: 273/273 PASS;
- axe: 36 ejecuciones, 0 violaciones;
- medición materiales: 64 filas de evidencia;
- SHA256SUMS: todo OK.

Estos resultados cubren el paquete R01 recibido, no el producto integrado actual.

## Próxima acción

1. A7 porta FIX-RINCON-01/02 en PR #300 o sucesor.
2. A2 NO aplica el bundle Rincon.zip.
3. Design R02 sigue siendo la fuente material vigente.
4. Los 13 juegos + pictogramas + fix de foco móvil se preservan como lote separado y se integran solo tras reconciliación con A1/child-safe.

No main. No producción.
