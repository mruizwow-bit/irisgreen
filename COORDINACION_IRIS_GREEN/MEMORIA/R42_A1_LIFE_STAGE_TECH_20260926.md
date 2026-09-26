# R42 · Agente 1 · etapas + arquitectura tecnológica de Recursos · 26/09/2026

## Estado

`R42_A1_LIFE_STAGE_TECH_READY_FOR_A2`

## Autoridad y continuidad

- Parent de producto: #286.
- Handoff A1 anterior: `c88ede84d8f4f88e3a93390d7502e226ba5f4e0d`.
- Addendum canónico: `R42_LIFE_STAGE_SEPARATION_ADOPTED`.
- Directriz posterior de María: la calidad tecnológica avanzada debe aplicarse a Recursos, Juegos y al resto del carril A1, no solo a la separación por etapas.
- A1 no invade Taller, Intereses ni Rincón.

## Identidad final

- rama: `agent1/r42-life-stage-separation-r01-20260926`
- PR: #298 · READY FOR REVIEW
- HEAD: `8f68609852ed83d4cf846c0390931b74c18d4cdb`
- base funcional del addendum: `c88ede84d8f4f88e3a93390d7502e226ba5f4e0d`
- compare: 39 commits ahead · 0 behind · 20 archivos frente al handoff anterior
- base A2 observada al cierre del PR: `ab952077464b1348d3da88ee974f9375b3458bc9`
- PR mergeable: true
- 0 merge A1 · 0 deploy A1 · 0 producción

## Separación por etapas

Superficies orientadas explícitamente:
- Infancia / Childhood
- Adolescencia / Adolescence
- Adultez / Adulthood
- Cualquier edad / Any age

Reglas conservadas:
- la etapa orienta y nunca bloquea;
- se puede ver todo;
- un recurso puede pertenecer a varias etapas;
- no se duplican registros para aparentar separación;
- no se solicita ni persiste fecha de nacimiento, diagnóstico o perfil.

## Arquitectura tecnológica aplicada

Se estudió documentación web actual y se adoptó progressive enhancement:
- View Transitions para cambios de orientación relevantes, con `prefers-reduced-motion`;
- Popover nativo;
- CSS Anchor Positioning con fallback;
- Container Queries;
- `content-visibility` y containment para colecciones grandes;
- forced-colors;
- teclado y foco explícito;
- sin framework ni dependencia nueva.

### Recursos
- hub por etapas;
- Container Queries;
- pintura diferida de tarjetas de recursos;
- ES/EN.

### Juegos
- entrada etapa → contexto → juego;
- navegación por etapa visible y reversible;
- View Transitions solo en navegación relevante;
- Popover de filtros/opciones;
- Anchor Positioning progresivo;
- catálogos con `content-visibility`;
- interacción sin depender de drag.

### Rutinas imprimibles
- entrada por etapa;
- rail de etapa;
- Container Queries;
- View Transitions progresivas;
- descargas y watermark existentes conservados.

### Rutinas visuales
- edición de pasos con preview en vivo agrupada por `requestAnimationFrame`;
- búsqueda de pictogramas agrupada por frame;
- biblioteca con `content-visibility`, containment y scrollbar estable;
- selector múltiple explícito `all()` para evitar ambigüedad del alias anterior.

### Tarjeta Iris
- preview realmente en vivo mientras se escribe;
- actualización agrupada por `requestAnimationFrame`;
- estado conservado solo en `sessionStorage` según contrato existente;
- sin envío de datos ni cuenta.

## QA final

Mismo HEAD `8f68609852ed83d4cf846c0390931b74c18d4cdb`:
- workflow `Comprobar rutinas visuales` run `36253137816`: SUCCESS;
- workflow `Recursos actuales ES y EN` run `36253137789`: SUCCESS;
- build completo: SUCCESS;
- navegador ES/EN: SUCCESS;
- 1440 px y 320 px dentro del gate: SUCCESS;
- reduced-motion dentro del gate: SUCCESS.

Durante QA se detectaron y corrigieron:
1. contrato histórico que no atravesaba la nueva entrada etapa/contexto;
2. selector ambiguo del disparador Popover;
3. alias de colección `$$` degradado durante parcheo; sustituido por helper explícito `all()`.

No se rebajaron gates.

## Siguiente puerta

A2 integra #298 sobre su HEAD vigente y publica la preview integrada. La aceptación perceptiva final sigue requiriendo HUMAN QA de María, dispositivo físico, lector de pantalla real y revisión integrada.

