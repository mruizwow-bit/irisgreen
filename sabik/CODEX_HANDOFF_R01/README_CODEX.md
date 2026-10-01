# SABIK · CODEX LAYER HANDOFF R01

Fecha: 2026-10-01

Objetivo: montar y conectar el Sabik con núcleo central aprobado por María.

## Fidelidad
La referencia recibida está aplanada. No contiene capas fuente editables ni permite recuperar píxeles ocultos detrás de transparencias. No se debe afirmar que esas capas originales se han recuperado.

El paquete local generado por Nexo contiene:
- referencia exacta;
- cuerpo transparente;
- órbitas;
- anillos del núcleo;
- luz central;
- partículas;
- diagrama de colocación;
- CSS/JS de montaje;
- preview;
- manifest de capas.

## Canvas y anclaje
- canvas lógico: 1065 × 760
- crop de referencia: (180,180) → (1245,940)
- núcleo / transform-origin: (530,359)
- porcentaje: 49.765% 47.237%

**No mover el contenedor completo.** El núcleo permanece anclado.

## Cuerpo
- x=176
- y=8
- width=690
- height=642
- object-fit=contain

## Z-order
10 halo-back
20 orbits-back
30 body
40 core-rings
50 core-light
60 particles-front

## Estados
- idle = reposo/presencia
- listening = exterior→núcleo
- processing = actividad alrededor del núcleo
- speaking = núcleo→exterior
- degraded = menos actividad/luz, sin flashes

Pulso/runtime emite el estado semántico. La capa visual solo lo representa. No usar timers decorativos para inferir estado.

## Accesibilidad
NORMAL: motion semántico calmado.
REDUCIDO: sin rotación continua; transiciones breves.
SIN MOVIMIENTO: 0 animación + etiqueta textual/estado accesible.

## Gate
Codex monta en rama aislada → Motor/Prisma → Axioma → Astra → Nexo E2E → HUMAN QA María.

Issue relacionada: #354.
