# SENDA · LABORATORIO DE PROFILING R01

Fecha: 30/09/2026

Estado:
`SENDA_NON_PRODUCT_PROFILING_LAB_R01_COMPLETED_WITH_GPU_TEST_PENDING`

Este laboratorio es formación. No usa ni modifica producto Iris Green.

## Objetivo

Comprobar con medición real —aunque sea en un entorno de laboratorio— varias hipótesis de la formación:

1. render continuo consume presupuesto aunque la escena no cambie;
2. render bajo demanda reduce trabajo, pero no salva una escena excesivamente densa;
3. primera interacción debe medirse;
4. un entorno headless no sustituye dispositivo real;
5. una prueba no ejecutable debe declararse pendiente, no simularse como PASS.

## Entorno

- Chromium: 144.0.7559.96
- headless;
- Playwright Python;
- viewports: 390×844 y 1440×900;
- Canvas 2D;
- objetos sintéticos;
- `performance.mark/measure`;
- `PerformanceObserver` para long-animation-frame cuando estuvo disponible.

Limitación:
los valores son diagnósticos relativos del laboratorio. No representan rendimiento de un móvil físico concreto.

## Resultado 6.000 objetos

### Móvil · render bajo demanda

- frames ejecutados: 8
- render medio: 1,66 ms
- render máximo: 5,5 ms
- acción → siguiente frame, media: 13,72 ms
- máximo: 14,5 ms

### Móvil · render continuo

- frames ejecutados: 205
- render medio: 6,42 ms
- render máximo: 9,1 ms
- acción → siguiente frame, media: 22,52 ms
- máximo: 23,1 ms

### Lectura

La escena continua realizó mucho más trabajo y aumentó la latencia de la acción aun sin necesidad funcional de redibujar todo constantemente.

Regla confirmada:
`RENDER_ONLY_WHEN_NEEDED_WHEN_SCENE_IS_STATIC`.

## Resultado 30.000 objetos · móvil

### Bajo demanda

- render medio: 6,28 ms
- acción media: 52,43 ms
- máximo: 55,7 ms
- long frames registradas: 4
- máxima: 95 ms

### Continuo

- render medio: 11,21 ms
- acción media: 76,3 ms
- máximo: 82,8 ms

### Lectura

Bajo demanda reduce trabajo, pero una escena demasiado densa sigue degradando interacción.

Regla:
`ON_DEMAND_IS_NOT_A_LICENSE_FOR_UNBOUNDED_COMPLEXITY`.

## Hallazgo sobre métricas

No todas las señales se comportaron de forma intuitiva:
la variante continua pesada no reportó long-animation-frame en esta ejecución aunque la latencia de acción aumentó.

Conclusión:
no depender de una sola métrica.

Combinar:
- User Timing;
- interacción;
- long frames/tasks;
- profiler;
- frame/render stats;
- recursos;
- memoria;
- prueba perceptiva.

## Laboratorio GPU context loss

Intento:
- obtener WebGL/WebGL2;
- obtener `WEBGL_lose_context`;
- provocar pérdida/restauración.

Resultado:
`NOT_EXECUTABLE_IN_CURRENT_LAB`.

El Chromium headless disponible no expuso WebGL en este entorno.

Por tanto:
- NO se declara PASS de recuperación GPU;
- queda pendiente en entorno con WebGL/GPU disponible.

## Prueba arquitectónica separada

Se ejecutó un mock de renderer independiente del state store.

Estado antes/durante/después:
- selected = fossil-7;
- progress = 0.42;
- collection = [fossil-2].

Resultado:
`STATE_RENDERER_SEPARATION_MOCK_PASS`.

Caveat:
esto demuestra separación lógica del estado.
NO demuestra recuperación real de WebGL/WebGPU.

## Aprendizaje profesional

1. medir, no suponer;
2. headless ≠ dispositivo real;
3. render continuo tiene coste aunque “se vea fluido”;
4. bajar frecuencia de render no sustituye optimizar complejidad;
5. una métrica aislada puede ocultar problemas;
6. un test no disponible se marca PENDING;
7. mock arquitectónico y prueba hardware son evidencias distintas.

## Gate de formación

PASS:
- profiling CPU/Canvas ejecutado;
- User Timing ejecutado;
- comparación on-demand/continuous ejecutada;
- stress test ejecutado;
- limitaciones documentadas.

PENDING:
- WebGL context-loss real;
- WebGPU device-loss real;
- profiling en móvil físico;
- GPU memory/profile real.

Estado final:
`SENDA_NON_PRODUCT_PROFILING_LAB_R01_COMPLETED_WITH_GPU_TEST_PENDING`

No certificación externa.
No build/merge/deploy de producto.
