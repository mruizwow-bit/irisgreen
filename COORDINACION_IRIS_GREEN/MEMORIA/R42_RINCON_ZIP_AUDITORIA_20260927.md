# R42 · auditoría Rincon.zip · acción operativa limitada a Rincón · 27/09/2026

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

El paquete mezcla material histórico de varios carriles, pero por decisión de María **esta auditoría solo genera acciones operativas para Rincón**:

1. sistema material Design R01 → superseded por Design R02 aprobado; no se actúa desde este handoff;
2. dos correcciones puntuales de Rincón → siguen siendo necesarias;
3. cualquier contenido de Juegos incluido en el ZIP queda **fuera de alcance** porque Claude está actualizando Juegos en su propio carril. No se deriva ninguna tarea a A1, Design ni A2 desde este paquete para Juegos.

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

## 4 · Contenido de Juegos dentro del ZIP · FUERA DE ALCANCE

El ZIP contiene también material de Juegos, pero **no se usa como fuente operativa en esta auditoría**.

Decisión de María:
- Claude está actualizando Juegos;
- no derivar tareas de Juegos a A1 desde `Rincon.zip`;
- no pedir a A2 que integre esos juegos desde este bundle;
- no mezclar ese material con el carril Rincón;
- cualquier valor histórico del lote queda únicamente como evidencia del ZIP recibido.

Por tanto, los 13 juegos, pictogramas y ajustes móviles de Juegos encontrados quedan **IGNORED_FOR_RINCON_HANDOFF**. Su eventual reutilización o descarte corresponde al carril de Claude/Juegos, no a A7/A2.

## 5 · QA recibido

- qa navegador: 111/111 PASS;
- qa móvil: 273/273 PASS;
- axe: 36 ejecuciones, 0 violaciones;
- medición materiales: 64 filas de evidencia;
- SHA256SUMS: todo OK.

Estos resultados cubren el paquete R01 recibido, no el producto integrado actual.

## Próxima acción

1. **A7** porta únicamente FIX-RINCON-01/02 en PR #300 o sucesor.
2. **A2** no aplica el bundle `Rincon.zip`; integra después el Rincón corregido por A7 y ejecuta build/preview/HUMAN QA.
3. Design R02 sigue siendo la fuente material vigente, pero no recibe ninguna acción desde este handoff.
4. Juegos queda fuera de este handoff y continúa únicamente en el carril de Claude.

**Responsables operativos de Rincón desde este ZIP: A7 + A2.**

No main. No producción.
