# APRENDIZAJE_MOTOR_2026-10-01

## Contexto

Se produjo una interrupción de conexión de la interfaz de ChatGPT mientras Motor continuaba la jornada de Formación.

La continuidad se recuperó desde GitHub, no desde memoria del chat.

## Fuente canónica recuperada

Repositorio:
`mruizwow-bit/irisgreen`

Rama:
`formacion/a5-motor-runtime-r01-20260930`

Base de Formación Aura:
`41a01a5534161da5e4b412dd0c6af424e836a53c`

Al recuperar estado tras el corte:
- rama 34 commits ahead de la base;
- 0 detrás en la comparación observada;
- 31 archivos de Formación A5 registrados antes de reanudar.

Hallazgo importante:
la UI se había quedado mostrando actividad alrededor de R23/R24, pero GitHub ya conservaba también R24–R27.

## Formación recuperada tras el corte

Confirmados en GitHub:
- R24 · GC pressure, hot loops y resource reuse;
- R25 · Energy, long sessions y adaptive quality;
- R26 · WebGL pipeline, color y GPU profiling;
- R27 · Progressive enhancement y resilient HTML.

No reconstruir estos bloques desde conversación.

## Formación añadida después de recuperar

### R28 · Worker IPC, MessagePort y backpressure

Estudiado:
- structured clone;
- transferables;
- MessageChannel/MessagePort;
- postMessage ownership;
- Streams/backpressure;
- sequence/request IDs;
- cancellation protocol;
- worker queue growth.

Práctica:
- naive producer/consumer → queue max 900;
- latest-state coalescing → max pending 1;
- credit window → max inflight 4.

Resultado:
`3/3 PASS`.

Marcador:
`MOTOR_WORKER_IPC_BACKPRESSURE_STUDIED_R28`

### R29 · Gamepad, Pointer Lock, Fullscreen y Orientation

Estudiado:
- Gamepad polling y lifecycle;
- deadzones;
- button edges;
- disconnect;
- haptics limitations;
- Pointer Lock;
- raw movement;
- Fullscreen activation/policy;
- orientation lock limitations;
- focus/permissions.

Práctica deadzone:
`4/4 PASS`.

Marcador:
`MOTOR_GAMEPAD_IMMERSIVE_INPUT_STUDIED_R29`

## Continuidad aprendida

Regla confirmada por incidente real:

`CHAT/CONNECTION LOSS ≠ KNOWLEDGE LOSS`

si:
- cada aprendizaje material se persiste;
- la rama queda identificada;
- el siguiente chat lee GitHub antes de reconstruir;
- no se depende de la lista visual de acciones de la UI como fuente de verdad.

## Error de documentación ocurrido

Durante R29 un carácter de marcado causó SyntaxError en el script que construía el texto para GitHub.

Impacto:
- 0 producto;
- 0 pérdida de investigación;
- 0 cambio funcional;
- solo falló el primer intento de crear el documento.

Corrección:
- se reconstruyó el contenido de la nota como lista de líneas;
- commit posterior correcto.

Aprendizaje:
separar claramente errores de la herramienta de documentación de errores del runtime estudiado.

## Estado de jornada

Continúa Formación.

No realizado:
- build de producto;
- merge;
- deploy;
- main;
- producción;
- feature nueva.

## Siguiente línea de estudio

Continuar desde R29, no desde R23.

Candidatos inmediatos de especialización:
1. media decoding/capabilities y frame pipelines;
2. workers/messages con cancellation protocol más avanzado;
3. Canvas text/font metrics e internacionalización visual;
4. input latency en editors under load;
5. browser lifecycle/mobile interruptions;
6. testing de degradación por capability matrix.

## Primeros 10 minutos del siguiente Motor

1. leer este archivo;
2. confirmar rama;
3. listar A5_MOTOR;
4. comprobar último bloque R29;
5. leer solo el bloque siguiente que vaya a ampliar;
6. no repetir R01–R29;
7. mantener 0 producto mientras siga la Jornada de Formación.