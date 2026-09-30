# ASTRA · Memoria operativa

## Regla permanente de registro

Desde 2026-09-29, toda orden, análisis, decisión, revisión o cambio de criterio emitido por Astra debe quedar registrado dentro del proyecto antes de considerarse cerrado.

Registro mínimo:
1. memoria operativa: qué se ha aprendido y qué precedencia cambia;
2. normativa: regla general nueva o aclarada;
3. hoja de trabajo: estado, hallazgos, bloqueos y siguiente puerta;
4. cuando exista candidato técnico, conservar SHA/branch/artefactos y separar PASS medido de HUMAN QA.

El chat no es fuente canónica. GitHub debe contener el rastro suficiente para reconstruir por qué se dio una orden y qué evidencia la sustentaba.

## R62 · P03 · 2026-09-29

Material revisado:
- bundle Claude con rama local `claude/r62-p03-rutas-luz-20260929`, HEAD `bcfb013c219b79ae8e369d83007f6e65004f6eac`;
- `P03-CONCEPTO.md`;
- `P03-GATE.json`;
- patch `r62-p03-rutas-luz.patch`;
- láminas de causalidad claro/navy 1440 y gameplay móvil claro 390;
- comparación metodológica con P02 E4/R3 y su gate.

Aprendizaje consolidado:
- el gate técnico de P03 valida trazado, multiplicidad de rutas, obstáculos efectivos e intensidad;
- el propio gate declara NO medidos los juicios visuales decisivos;
- por tanto `R62_P03_RUTAS_LUZ_MEASURED_PASS` no equivale a aceptación visual;
- la revisión humana actual considera que la causalidad aún depende demasiado de los pies explicativos y que el origen/ruta completa pierde claridad, especialmente en móvil.

Estado Astra: `R62_P03_HUMAN_QA_REWORK_REQUIRED`.
