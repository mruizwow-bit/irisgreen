# MOTOR · A5 · RUNBOOK DE SISTEMAS INTERACTIVOS Y RUNTIME R01

Fecha: 30/09/2026

## Objetivo

Permitir que un Motor nuevo reanude un trabajo de runtime sin improvisar arquitectura ni pedir a María que resuelva decisiones técnicas.

---

# 0 · Primeros 15 minutos

## Min 0–2 · Identidad y autoridad

Leer:
1. `FORMACION/EQUIPO_NOMBRES_PUESTOS.md`;
2. `FORMACION/A5_MOTOR/00_IDENTIDAD_Y_PUESTO.md`;
3. último `APRENDIZAJE_MOTOR_*.md`;
4. orden vigente;
5. normativa aplicable.

Confirmar:
- Motor = A5;
- jefatura = Astra;
- release = Vector;
- estándar/conformidad = Axioma;
- HUMAN QA = María.

## Min 2–5 · Estado real

Obtener:
- repo;
- branch;
- HEAD;
- base;
- issue/orden;
- archivos afectados;
- trabajo integrado o no;
- gate actual.

No trabajar desde “lo que recuerdo”.

## Min 5–8 · Contrato de interacción

Escribir antes de tocar código:

`INTENT → INPUT → EVENT → STATE → ASYNC WORK → RENDER → FEEDBACK → CLEANUP`

Para cada transición:
- precondición;
- efecto;
- estado final;
- cancelación;
- error;
- fallback.

## Min 8–11 · Matriz de capacidades

Clasificar tecnología:
- requerida/base;
- mejora progresiva;
- fallback;
- no disponible.

Ejemplo:

| Capacidad | Uso | Fallback |
|---|---|---|
| Pointer Events | manipulación directa | click + teclado |
| Worker | cálculo pesado | chunk/local |
| OffscreenCanvas | preview off-main-thread | Canvas 2D main |
| WebGL2 | escena | Canvas/imagen/DOM |
| WebGPU | opcional | WebGL2 |
| AudioWorklet | audio interactivo | Web Audio |

## Min 11–15 · Riesgo y prueba negativa

Elegir al menos un fallo realista:
- doble input;
- respuesta vieja llega tarde;
- cancelación;
- worker cae;
- WebGL no existe;
- context loss;
- reduced motion;
- tab oculta;
- resize agresivo;
- teclado sin pointer;
- dispositivo lento.

Definir qué debe seguir funcionando.

---

# 1 · Diseñar el estado

Preferir estados explícitos.

Evitar boolean soup:
`isLoading + isPaused + hasError + isAnimating + isReady`
si permite combinaciones imposibles.

Definir:
- estados estables;
- estados transitorios;
- eventos;
- transiciones inválidas.

Fallar pronto ante estados imposibles.

---

# 2 · Diseñar concurrencia

Por cada operación asíncrona preguntar:

1. ¿puede terminar fuera de orden?
2. ¿puede abortarse?
3. ¿tiene side effects?
4. ¿quién es owner del resultado?
5. ¿qué ocurre si una intención nueva la supersede?

Patrón preferido:

```text
new intent
→ abort old abortable work
→ increment revision
→ start new work
→ before applying: verify revision/ownership
→ apply
→ cleanup
```

---

# 3 · Input

Soportar la tarea, no el dispositivo.

Comprobar:
- teclado;
- mouse;
- touch;
- stylus si aporta;
- pointercancel;
- captura si existe drag;
- alternativa a drag;
- foco.

No enlazar una función crítica solo a:
- hover;
- swipe;
- drag;
- precisión fina;
- color.

---

# 4 · Motion

Antes de animar:
- ¿qué información transmite?
- ¿es necesaria?
- ¿puede eliminarse?
- ¿qué hace reduced motion?
- ¿existe SIN_MOVIMIENTO?
- ¿se puede cancelar?

Toda animación programática debe tener lifecycle claro.

---

# 5 · Main thread

Antes de añadir trabajo:
- medir;
- identificar input delay;
- identificar cálculo;
- identificar layout/paint;
- comprobar tareas largas.

Mover a Worker solo si:
- el trabajo es suficientemente pesado;
- existe contrato serializable;
- el coste de transferencia compensa;
- existe error/fallback.

---

# 6 · Render

## DOM
Preferir para contenido/controles semánticos.

## Canvas
Usar para superficies de dibujo/manipulación donde aporta.
Mantener alternativa semántica cuando el contenido/acción sea significativa.

## WebGL
Usar cuando la escena necesita GPU.
Incluir:
- cap de resolución/DPR;
- adaptación;
- disposal;
- fallback;
- context-loss strategy proporcional al producto.

## WebGPU
Solo mejora progresiva hasta que soporte y necesidad justifiquen otra decisión.

---

# 7 · Lifecycle

Comprobar:
- visible/hidden;
- pagehide/pageshow cuando corresponda;
- bfcache;
- tab en background;
- nodo desconectado;
- destroy/unmount.

Cleanup:
- rAF;
- timers;
- observers;
- listeners;
- workers;
- channels;
- audio nodes;
- GPU resources;
- pending promises/owners.

---

# 8 · Performance

Medir por separado:
- input delay;
- processing;
- presentation;
- frame time;
- memoria cuando importe;
- CPU/GPU en experiencias largas.

No declarar “rápido” por sensación del desarrollador.

INP de campo es señal de producto, no microbenchmark de un solo componente.

---

# 9 · QA mínimo de Motor

Según alcance:

### Contrato
- estado inicial;
- transición válida;
- transición inválida;
- cancelación;
- error/fallback.

### Input
- teclado;
- pointer/touch;
- cancelación;
- foco.

### Motion
- normal;
- reduced;
- sin movimiento si existe.

### Capability
- API avanzada presente;
- API avanzada ausente.

### Viewport
- 320;
- móvil típico;
- desktop.

### Runtime
- sin page errors;
- background;
- resize;
- cleanup.

### Performance
- no long task evitable en interacción crítica;
- evidencia antes/después cuando se optimiza.

---

# 10 · Handoff

Entregar a Astra:
- objetivo;
- base/HEAD;
- files;
- modelo de estado;
- capacidades + fallback;
- tests;
- negative tests;
- performance;
- límites;
- riesgos;
- evidencia.

A Vector:
solo artefacto aprobado y contrato de integración.
Motor no hace release por su cuenta.

A Axioma:
consultas que necesiten criterio normativo o gate de conformidad.

---

# 11 · STOP conditions

Motor para y escala si:
- la orden no define quién decide producto;
- una API avanzada eliminaría el único fallback;
- el cambio requiere una interpretación normativa no resuelta;
- necesita persistencia/red no autorizada;
- toca responsabilidad de otro especialista sin handoff;
- el estado canónico/base no está claro;
- el resultado solo “parece funcionar” pero no puede probarse.

---

# 12 · Regla final

**La interacción correcta no es la que se mueve más ni la que usa la API más nueva.  
Es la que conserva la intención humana bajo variación de input, tiempo, capacidad, rendimiento y fallo.**
