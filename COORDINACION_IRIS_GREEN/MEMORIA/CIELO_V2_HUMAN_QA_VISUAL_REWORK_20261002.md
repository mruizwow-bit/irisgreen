# CIELO V2 · HUMAN QA VISUAL FAIL + REWORK · 02/10/2026

## Evidencia
Captura de María:
`/Iris Green/Handoffs/Astra/CIELO_V2_HUMAN_QA_FAIL_20261002/cielo-v2-human-qa-fail.png`

SHA-256:
`1896cb1cc5dd86527552ac717febac38a607dd43c6f6fa45119e193767744e3b`

Dimensiones:
`2047×1543`

## Estado
`INTEREST_01_CIELO_V2_HUMAN_QA_FAIL_VISUAL_QUALITY`

El gate técnico previo NO se invalida como evidencia funcional:
- HYG/IAU/JPL locales;
- 0 red externa;
- 18 targets interactivos;
- <=5 constelaciones etiquetadas;
- teclado/touch;
- NORMAL/REDUCED/NONE;
- forced-colors;
- depth lazy;
- 0 JS/404 en el gate.

Pero el producto visual NO pasa HUMAN QA.

## Motivos observables

1. La experiencia se lee como **dashboard/panel de datos**, no como cielo.
2. La escena queda encerrada dentro de una caja con borde/radius y una columna lateral dominante.
3. La columna `En esta vista` ocupa demasiado espacio y duplica visualmente lo que ya está en la escena.
4. Las estrellas interactivas se perciben como **burbujas/botones grandes**, no como estrellas.
5. Las etiquetas de constelaciones se perciben como pills de UI sobre un lienzo técnico.
6. El horizonte no participa perceptivamente en el primer viewport.
7. Falta profundidad atmosférica y sensación de mirar un cielo real desde un lugar.
8. La ficha técnica de Sadr es demasiado dominante para el primer viewport.
9. La jerarquía contradice perceptivamente:
`WORLD_SCENE_FIRST → EXPLORE → CURATED_REAL_INFO → DEPTH_ON_DEMAND`.
10. El resultado parece una herramienta técnica funcional, no una experiencia premium/E4.

## KEEP
- datos y subset;
- cálculos;
- interacción pointer/touch/keyboard;
- target hit areas accesibles;
- lazy depth;
- fuentes locales;
- límites de labels/targets;
- no geolocalización automática;
- first-party/no third-party.

## REWORK visual
Owner primario inmediato:
**Prisma A8 · Frontend Platform & Design Systems**.

Motor NO se interrumpe mientras cubre Nexo/Suite5.

### Dirección
- escena ocupa la mayor parte del viewport;
- eliminar lectura de dashboard;
- no sidebar persistente dominante;
- cielo como superficie principal;
- horizonte visible desde el primer viewport;
- targets interactivos mantienen 44px de hit area, pero el hit area debe ser visualmente invisible;
- estrella visible = punto natural pequeño; halo solo sutil/contextual;
- constelaciones: líneas mucho más finas y etiquetas discretas/contextuales;
- `En esta vista` sigue existiendo como alternativa DOM, pero NO domina la composición;
- datos de la estrella aparecen bajo interacción, con progressive disclosure;
- lugar/fecha/motion/theme se agrupan en disclosure compacto;
- sin duplicar controles;
- mobile = escena primero; panel/contexto debajo o sheet accesible;
- no esconder información esencial por estética;
- forced-colors y lectura sin canvas deben seguir funcionando.

## Restricciones Prisma
Puede tocar:
- CSS;
- estructura/presentación DOM del componente;
- jerarquía visual;
- responsive;
- visual states/focus styles.

No tocar:
- algoritmos astronómicos;
- dataset;
- selección factual;
- JPL/HYG/IAU;
- lazy-depth contract;
- motion state model;
- geolocalización;
- 02–07.

Si un cambio necesita nueva semántica de eventos/state, queda HANDOFF a Motor cuando se libere.

## Gate esperado
`INTEREST_01_CIELO_V2_VISUAL_REWORK_READY_FOR_HUMAN_QA`

QA mínimo:
- ES/EN;
- 320/390/1440;
- LIGHT/NAVY;
- NORMAL/REDUCED/NONE;
- keyboard/touch;
- forced-colors;
- 0 JS/404;
- 18 targets siguen disponibles;
- <=5 labels;
- depth sigue lazy;
- screenshot 1440 y 390 para HUMAN QA;
- primera impresión debe ser **cielo**, no dashboard.

No merge main hasta HUMAN QA de María/Astra.
