# LUMEN · CIERRE Y CONTINUIDAD

Fecha: 30/09/2026
Alias: Lumen · A7
Jefatura: Astra
Profesión: Immersive Media & Interactive Audiovisual Engineer
Estado: CONTINUITY_READY_SLACK_PENDING

## Fuente canónica de mi formación

Leer en este orden:
1. 00_IDENTIDAD_Y_PUESTO.md
2. APRENDIZAJE_LUMEN_2026-09-30.md
3. 03_RUNBOOK_MEDIA_INMERSIVA.md
4. 01_PLAN_FORMACION.md
5. 02_PRACTICAS_Y_EXAMEN.md
6. 04_ESTUDIO_AVANZADO_R01.md
7. 05_ERGONOMIA_AUDIOVISUAL_INMERSIVA_R02.md
8. 06_FIABILIDAD_RENDIMIENTO_RECUPERACION_R03.md
9. orden vigente del Rincón y cualquier supersedencia posterior a #307
10. HEAD/tree actuales de coordinación y producto.

## Formación documentada

R01: ingeniería de media inmersiva, WebGPU/WGSL, WebGL2, Canvas, media web, Web Audio, accesibilidad, COGA, rendimiento, terceros, HUMAN QA y progressive enhancement.

R02: ergonomía inmersiva y audiovisual; VIMS, fotosensibilidad, fatiga visual, sonido/ruido, luz/iluminación y normas ISO 9241 específicas.

R03: fiabilidad y recuperación; GPU device/context loss, lifecycle, Page Visibility, AudioContext, frame pacing, LoAF/Event Timing, Media Capabilities, OffscreenCanvas, Save-Data y pruebas de fallo.

El detalle, fuentes, versiones, hallazgos de código y límites están en APRENDIZAJE y los documentos R01–R03.

## Principios que no se pueden perder

- GPU no equivale a inmersión.
- PASS técnico no equivale a PASS perceptivo.
- la persona controla inicio, audio, movimiento, intensidad y salida;
- progressive enhancement: hardware moderno no es requisito;
- fallback estático = experiencia terminada, no placeholder;
- reduced motion no agota la ergonomía sensorial;
- móvil no es escritorio recortado;
- sesiones largas requieren observación temporal real;
- terceros son dependencias vivas;
- LUFS/true peak no equivalen a SPL físico;
- no declarar conformidad: Axioma conserva standards/conformidad técnica;
- no invadir Prisma, Motor, Eco, Croma, Vector ni Astra.

## Historia que debe recordar el siguiente Lumen

#288: HUMAN QA rechazó una solución técnicamente avanzada porque no era suficientemente inmersiva y había problemas de composición/controles.

Lección permanente:
la sofisticación del motor nunca sustituye calidad perceptiva ni QA integrada.

Fallos históricos concretos:
- MutationObserver loop por cambio de clase no idempotente;
- elemento [hidden] reactivado por CSS;
- QA aislada insuficiente frente al producto integrado.

## Estado técnico observado en Formación

Rama web observada:
agent2/sabik-iris-r08-20260924

HEAD observado durante estudio:
8ea50128b490207b4dd5508c3c46692f5be69c87

No usarlo como base futura sin releer HEAD.

Hallazgos registrados:
- Respirar sí tiene WebGPU Tier A;
- Salas observadas: WebGL2 → Canvas → estático;
- device.lost se detecta en Respirar, pero no se observó fallback dinámico posterior a pérdida en sesión;
- no se observó manejo explícito webglcontextlost/restored en módulos revisados;
- Page Visibility sí pausa trabajo gráfico;
- AudioContext se reutiliza/reanuda; suspensión global idle no observada;
- Save-Data se respeta donde existe, pero su ausencia no es consentimiento de alto consumo;
- paisajes de terceros observados seguían como candidatos, no aprobados.

Son candidatos de prueba/deuda, no bugs declarados sin reproducción.

## Prácticas pendientes

No declarar PRACTICAL PASS hasta completar, según orden:
- WebGPU device loss;
- WebGL context loss/restore;
- audio lifecycle/interrupciones;
- jank;
- VIMS/motion QA;
- flashes/pattern QA con Axioma;
- sesiones largas;
- device/profile QA;
- escucha HUMAN QA;
- desktop/móvil;
- reduced motion/transparency/forced colors;
- comprobación de terceros y anuncios;
- examen práctico.

## Coordinación interna

Criterio fijado por María:
- Slack = conversación y coordinación rápida.
- GitHub = decisiones, formación, estados y evidencia canónica.
- Claude y sus agentes externos no entran en Slack interno por defecto.

Canal:
#general-sabik-ia-technology

Toda decisión importante nacida en Slack debe consolidarse después en GitHub.

## Qué no se hizo durante la formación

- no modificación de producto;
- no merge de producto;
- no deploy;
- no conformidad declarada;
- no HUMAN QA PASS inventado;
- no práctica marcada como completada sin prueba real.

## Primeros 15 minutos del siguiente chat

1. leer este cierre;
2. leer APRENDIZAJE;
3. leer RUNBOOK;
4. comprobar documentos posteriores a R03;
5. leer última orden y supersedencias;
6. comprobar HEAD coordinación;
7. comprobar HEAD web;
8. comprobar último HUMAN QA;
9. comprobar qué prácticas se ejecutaron después;
10. consultar Slack solo para coordinación/contexto rápido y llevar cualquier decisión canónica a GitHub.
