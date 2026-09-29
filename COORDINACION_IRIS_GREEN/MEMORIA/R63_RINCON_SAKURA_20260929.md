# R63 · Rincón · Sakura · emisión y reconciliación · 29/09/2026

Issue: #328  
Estado: `R63_CLAUDE_RINCON_SAKURA_CANDIDATE_ORDERED`

## Auditoría previa cerrada

Antes de emitir R63 se reconciliaron Normativa, Órdenes, Estado, Memoria, Control, Handoffs, Evidencias, PR #244 vivo, #317 y #325, además de los artefactos recientes de Biblioteca.

Hallazgos determinantes:
- A2 PR #244 observado en `9800661d7b7a085acaf593d9f432b2ec426151b8`; A2 y main están divergidos, por lo que no se usa main como baseline sustitutivo.
- el Rincón A2 vigente todavía carga el stack R42 histórico y no tiene integrado el trabajo R53/Sakura;
- `assets/ig-global-ui-tokens-2026.css` existe en A2, pero la propagación global al Rincón sigue pendiente de integración;
- PR #303 permanece open/draft y no merged: los dos fixes de clean mode/hidden no están hoy en el runtime A2;
- R53 no tiene una rama GitHub reutilizable localizada; su trabajo reciente vive como artefactos/handoffs externos;
- no se localizó un ZIP/patch/bundle de código de Sakura en Biblioteca, aunque sí memoria y evidencia visual.

## Nueva precedencia de producto

Fuente de decisión: reselección de salas sensoriales ordenada por María el 29/09.

- Globos retirado.
- Sakura ya construida como prototipo.
- antiguas cuatro salas congeladas.
- nueva tanda potencial posterior: Faroles flotantes, Lluvia de luz, Agua y reflejos, Bosque bioluminiscente.
- ninguna siguiente sala se desbloquea antes de HUMAN QA de Sakura.

Evidencia localizada:
- `sakura_en_la_pagina.png`;
- `sakura_dos_horas.png`.

Se separan de concept art/referencias, que no pueden entrar como assets o fuente.

## Revisión Astra previa a orden

La dirección Sakura pasa a **CONTINUE**:
- el tema aprovecha una técnica adecuada a elementos pequeños/planos/translúcidos;
- composición con ramas, pétalos, profundidad y reflejo es materialmente más coherente que el carril Globos;
- la evidencia disponible no basta para aceptación final porque no incluye un handoff reproducible ni demuestra por sí sola 390, tres niveles de movimiento, fallbacks y rendimiento.

## R63

R63 no pide rehacer Sakura.

Pide:
- recuperar el source exacto;
- materializarlo;
- reconciliarlo con A2 vivo;
- consumir tokens globales;
- mantener stage/art separado del tema de chrome;
- aplicar superficies low-stimulation;
- usar taxonomía AGE_* vigente;
- 0 autoplay;
- NORMAL/REDUCED/NO_MOTION reales;
- fallbacks documentados;
- portar los dos fixes #303;
- ES/EN;
- QA 1440/390;
- handoff exacto y PR draft a A2.

Si source exacto no existe/accesible:
`R63_SAKURA_SOURCE_ARTIFACT_MISSING_BLOCKED`.

## Separación de carriles

R61 Pecera #325 no cambia.
R60 Música no cambia.
A2 conserva header/tema/tokens globales e integración.
No tocar Home/Taller/Intereses/Juegos/Sabik/Cloud.

Siguiente:
Claude → Astra → A2 → Deploy Preview → HUMAN QA María.
