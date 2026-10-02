# SABIK · CODEX LAYER HANDOFF R01

Fecha: 2026-10-01

Objetivo: montar y conectar el Sabik con núcleo central aprobado por María.

## Fuente exacta del cuerpo
Para evitar una reinterpretación, Codex debe reutilizar como **cuerpo** el asset transparente ya existente y canónico:

`sabik/assets/web-r01/web_presente.png`  
SHA: `c18d8f2aae53c281e02baeeac0ccd832acca4ecb`

El nuevo Sabik NO consiste en redibujar ese cuerpo: se monta añadiendo el sistema de núcleo, órbitas, halo y partículas alrededor del mismo centro.

La imagen completa aprobada por María está aplanada, así que no se deben inventar “capas fuente originales” ocultas. Este handoff define las **capas de runtime** necesarias para reconstruir y animar el sistema.

## Canvas y anclaje
- canvas lógico: 1065 × 760
- núcleo / transform-origin común: **(530,359)**
- porcentaje: **49.765% 47.237%**

**No mover el contenedor completo.** El núcleo permanece anclado.

## Cuerpo
- source: `../assets/web-r01/web_presente.png`
- x=176
- y=8
- width=690
- height=642
- object-fit=contain

## Z-order
10 halo-back  
20 `03_orbits_back.svg`  
30 body  
40 `04_core_rings.svg`  
50 `05_core_light.svg`  
60 `06_particles_front.svg`

## Estados
- `idle` = reposo/presencia
- `listening` = exterior → núcleo
- `processing` = actividad alrededor del núcleo
- `speaking` = núcleo → exterior
- `degraded` = menos actividad/luz, sin flashes

Pulso/runtime debe emitir el estado semántico. La capa visual solo lo representa.

## Regla crítica
`MOTION = SYSTEM_STATE_COMMUNICATION, NOT DECORATION`

No usar translate del emblema completo para representar estados.

## Accesibilidad
NORMAL: motion semántico calmado.  
REDUCIDO: sin rotación continua; transiciones breves.  
SIN MOVIMIENTO: 0 animación + etiqueta textual/estado accesible.

## Archivos de handoff
- `layer-manifest.json`
- `03_orbits_back.svg`
- `04_core_rings.svg`
- `05_core_light.svg`
- `06_particles_front.svg`
- `sabik-layered.css`
- `sabik-layered.js`
- `preview.html`

## Gate
Codex monta en rama aislada → Motor/Prisma → Axioma → Astra → Nexo E2E → HUMAN QA María.

Issue relacionada: #354.
