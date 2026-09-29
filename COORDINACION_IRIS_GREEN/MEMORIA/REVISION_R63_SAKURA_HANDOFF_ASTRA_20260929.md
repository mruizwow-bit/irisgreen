# R63 · Sakura · revisión final de handoff por Astra · 29/09/2026

Estado: `R63_ASTRA_RUNTIME_HANDOFF_REWORK_NARROW_REQUIRED`

## Material revisado

- issue #328 y sus dos decisiones Astra previas;
- `R63_SAKURA_HANDOFF_20260929.zip`;
- `sakura_normal.mp4` y `sakura_reducido.mp4` aportados por María;
- `MANIFIESTO.json`;
- `LEEME.md` / `HANDOFF_R63_SAKURA_RUNTIME.md`;
- QA runtime, a11y y evidencia;
- comparativa visual, 1440 y 390;
- código del stage y Sakura.

## Visual

Se conserva el PASS visual ya emitido en #328.

KEEP:
- sala sensorial Sakura reconocible;
- cerezo con ramas/racimos;
- óculo y pared coordinados;
- geometría circular;
- tubo sensorial;
- mobiliario redondeado;
- cove;
- masters NAVY/LIGHT;
- móvil propio;
- lenguaje ilustrativo propio sin perseguir fotorealismo.

No se ordena más rework visual.

## Runtime que sí pasa

- SIN_MOVIMIENTO: 0 RAF continuo.
- recurso tardío: un repintado y después 0 RAF.
- start/stop/start: no acumula objetos GL en tres ciclos.
- fallo de shader: diagnóstico reproducible y degradación sin pantalla negra.
- fallo de master/textura: diagnóstico reproducible.
- 1440/390/320 sin overflow horizontal.
- teclado: 11/11 controles visibles alcanzables.
- foco visible.
- clean mode idempotente y Escape.
- forced-colors.
- ES/EN lang correctos.
- sin autoplay/audio.
- performance correctamente queda `PENDING_HARDWARE_QA`.

## Bloqueos acotados

### 1. Evidencia temporal demasiado corta

La última orden Astra en #328 exige vídeos de 15–30 s para NORMAL y REDUCIDO.

Los dos MP4 entregados son exactamente:
- 760×422;
- 8 fps;
- 32 frames;
- **4,0 s**.

Los hashes de los archivos aportados por María coinciden byte a byte con los incluidos en el ZIP.

La medición cuantitativa de 32 frames es útil, pero no satisface la duración contractual solicitada.

### 2. REDUCIDO sigue siendo un multiplicador global

La orden dice expresamente que REDUCIDO no puede ser «la misma escena al 32 %» y pide menos pétalos, menor velocidad y menos deriva/paralaje.

El stage implementa:
- normal: speed 1 / drift 1;
- reducido: speed 0,34 / drift 0,22;
- quieto: 0 / 0.

Sakura usa esos valores globales para tiempo/deriva y conserva el mismo buffer/cantidad de pétalos.

La evidencia muestra que el movimiento reducido es realmente menor (0,709 % vs 7,979 % de píxeles), pero la implementación sigue siendo esencialmente la misma escena escalada en tiempo/deriva. Falta una reducción estructural mínima: densidad/cantidad de pétalos u otra diferencia discreta además del multiplicador.

### 3. Escalones de Salas no reconciliados con la orden Astra

La decisión Astra previa pidió reconciliar nomenclatura y no mantener un A aspiracional vacío.

El handoff conserva:
- Salas B = WebGL2;
- C = Canvas2D;
- D = estática;
- A inexistente para Salas.

Esto es honesto, pero no cumple la reconciliación solicitada ni el mínimo A/B/C/D de la orden. Debe hacerse una de dos:
1. normalizar los niveles reales de Sakura a un contrato aprobado; o
2. solicitar y registrar explícitamente la reducción del contrato a tres niveles para Salas.

No inventar un tier.

### 4. Red externa sigue fallando

Runtime:
- ES: 1 request externo a fonts.googleapis.com;
- EN: 1 request externo a fonts.googleapis.com.

La sala Sakura no origina esa petición; viene de la plantilla global. Pero el gate pedido era 0 red externa.

R63 no debe parchear el header global. El bloqueo pasa a A2 como dependencia explícita: autoalojar la fuente / retirar Google Fonts en esta superficie antes del PASS integrado, o reconciliar el gate por decisión de María/Astra.

### 5. Handoff no es internamente exacto

`LEEME.md` dice:
- 33 commits;
- 106 ficheros tocados.

`MANIFIESTO.json` y `patch/commits.txt` acreditan:
- 34 commits;
- 111 ficheros tocados.

La cabeza del manifest es `888f52f28c3e7cf16db9e0bbab934a6595338ded`.

Un handoff reproducible no puede tener dos identidades diferentes. Corregir documentación/manifest para que una única identidad sea canónica.

## Dictamen

No volver a tocar dirección visual.

Hacer una corrección corta de handoff/runtime:
1. vídeos NORMAL y REDUCIDO de 15–30 s;
2. REDUCIDO con diferencia estructural real, no solo speed/drift multiplicados;
3. reconciliar tiers de Salas;
4. marcar red externa como blocker A2 y demostrar 0 external requests en el preview integrado;
5. corregir 33/106 vs 34/111 y regenerar handoff coherente.

Después volver a Astra.

Marcador esperado:
`R63_CLAUDE_SAKURA_RUNTIME_HANDOFF_R2_READY_FOR_ASTRA`.

No A2 hasta cerrar 1, 2, 3 y 5.
El punto 4 puede cerrarse en A2 porque pertenece al chrome global, pero debe quedar como gate de integración.

No siguiente sala. No main. No producción.
