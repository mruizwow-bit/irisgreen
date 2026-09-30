# MOTOR · A5 · ESTUDIO PROFUNDO R05 · COMPATIBILIDAD, DEGRADACIÓN Y FAILURE INJECTION

Fecha: 30/09/2026
Amplía: R01–R04
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Baseline no significa “probado en Iris Green”

Fuentes:
- web.dev · Baseline
  https://web.dev/baseline
- web.dev · Baseline 2026
  https://web.dev/baseline/2026
- MDN · Baseline compatibility
  https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility

Baseline clasifica una feature como:
- limited availability;
- newly available;
- widely available.

Baseline cubre navegadores principales, pero NO garantiza:
- dispositivos viejos;
- webviews;
- tecnología de apoyo;
- rendimiento;
- accesibilidad;
- seguridad;
- ausencia de bugs específicos.

Regla:
**Baseline informa la estrategia de compatibilidad; QA demuestra el producto.**

## 2 · Feature detection antes que browser sniffing

Motor pregunta:
`¿existe la capacidad exacta?`

Ejemplos:
- `typeof Worker === 'function'`;
- `'gpu' in navigator`;
- `canvas.getContext('webgl2')`;
- `typeof scheduler?.yield === 'function'`.

No:
`if Chrome...`
`if Windows...`

El nombre de navegador/plataforma no demuestra una capacidad concreta.

## 3 · Escalera de degradación

Para cada feature avanzada definir:

```text
PRIMARY
↓ no capability / error
FALLBACK 1
↓ degraded
FALLBACK 2
↓
STATIC / SEMANTIC CORE
```

La tarea central debe sobrevivir siempre que sea razonable.

Ejemplos Iris Green:

### Cálculo
Worker → main-thread chunked/local.

### Render
WebGPU → WebGL2 → Canvas/DOM/still.

### Motion
Normal → Reduced → No motion.

### Storage
IndexedDB → memory session + aviso/estado no persistente.

### Audio
AudioWorklet → Web Audio.

## 4 · Tipos de fallo que Motor debe inyectar

### Capability absence
API inexistente.

### Resource failure
asset no carga, decode falla, worker no arranca.

### Resource exhaustion
quota, memoria, GPU context loss.

### Lifecycle interruption
pagehide, bfcache, background.

### Concurrency
operación vieja termina tarde.

### Input interruption
pointercancel, blur, focus move.

### Layout stress
resize continuo, 320px, zoom/text spacing.

## 5 · Storage full

Fuentes:
- MDN · Storage quotas and eviction criteria
  https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
- MDN · QuotaExceededError
  https://developer.mozilla.org/en-US/docs/Web/API/QuotaExceededError

Regla:
toda escritura local no trivial debe contemplar:
- quota;
- abort/transaction failure;
- persistence unavailable;
- user deletion;
- eviction.

No borrar datos automáticamente para “hacer sitio” sin contrato de producto.

## 6 · Auditoría read-only · almacenamiento Taller

Archivo:
`assets/ig-taller-local-data.js`.

Observado:
- intenta IndexedDB;
- si IDB no está disponible durante inicialización, usa `MemoryBackend`;
- marca `persistent=false`;
- expone reason `STORAGE_UNAVAILABLE`;
- captura `QuotaExceededError` y lo traduce a `STORAGE_QUOTA`.

Aprendizaje positivo:
**fallback funcional no finge persistencia.**

No se observó `navigator.storage.persist()` automático.

Eso es coherente con la regla de no pedir persistencia sin decisión de producto.

## 7 · Worker crash

Fuentes:
- MDN · Worker error event
  https://developer.mozilla.org/en-US/docs/Web/API/Worker/error_event
- MDN · Worker.terminate()
  https://developer.mozilla.org/en-US/docs/Web/API/Worker/terminate

`terminate()` mata inmediatamente y no deja terminar cleanup interno.

Regla:
- para fallo duro: terminate;
- para shutdown cooperativo: protocolo de mensaje cuando importe;
- pending promises deben resolverse/rechazarse, nunca quedar colgadas.

### Auditoría read-only Taller

`assets/ig-taller-r42-platform.js`:
- `worker.onerror` rechaza pending;
- limpia map;
- intenta `terminate()`;
- pone worker a null;
- Life cae a cálculo local si task falla.

Patrón positivo.

Pendiente profesional:
si aparecen tareas con side effects, distinguir retry seguro de operación no idempotente.

## 8 · GPU context loss

Fuentes:
- MDN · WEBGL_lose_context
  https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_lose_context
- MDN · webglcontextlost
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
- MDN · restoreContext()
  https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_lose_context/restoreContext

`WEBGL_lose_context` permite inyectar pérdida/restauración real.

Contrato de prueba:
1. start scene;
2. loseContext();
3. comprobar que loop no produce cascada de errores;
4. mantener UI operable/fallback;
5. restoreContext();
6. recrear recursos;
7. volver a render o permanecer en fallback explícito.

### Estado Iris Green observado

`tools/escenas-3d/src/index.js`:
- hace cleanup explícito;
- usa `forceContextLoss()` en stop;
- no se observaron listeners explícitos `webglcontextlost/restored`.

Conclusión:
cleanup de cierre ≠ recuperación ante pérdida espontánea.

No se declara bug sin probar el runtime de integración.
Sí queda como práctica avanzada pendiente.

## 9 · ResizeObserver stress

Fuente:
- MDN · ResizeObserver
  https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver

Un callback que modifica dimensiones observadas puede crear ciclos.

El navegador evita lockup total, pero puede producir:
`ResizeObserver loop completed with undelivered notifications`.

Regla:
- evitar write-read-write circular;
- separar cálculo y aplicación;
- usar expected-size guard cuando proceda;
- stress test de resize.

## 10 · bfcache restore

Fuente:
- MDN · pageshow
  https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event

`pageshow` también ocurre al restaurar desde bfcache.

Test:
- abrir estado interactivo;
- navegar fuera;
- volver atrás;
- si `event.persisted`, comprobar:
  - no listener duplicado;
  - no worker doble;
  - no audio duplicado;
  - no estado obsoleto;
  - foco/controles coherentes.

## 11 · Reporting API

Fuente:
- MDN · Reporting API
  https://developer.mozilla.org/en-US/docs/Web/API/Reporting_API

Estado 30/09/2026:
**Baseline 2026 newly available**.

Puede recibir informes de:
- CSP;
- deprecations;
- políticas.

Frontera:
Motor diseña errores/runtime reportables.
**Vigía** gobierna observabilidad, privacidad y evidencia.

No añadir telemetría desde A5 por cuenta propia.

## 12 · No sobreinterpretar errores

Un fallback debe distinguir:
- capability absent;
- expected user cancel;
- timeout;
- transient failure;
- corrupted state;
- programmer bug.

No mostrar “error” al usuario por una cancelación normal.

No ocultar un programmer bug detrás de un fallback infinito.

## 13 · Matriz de failure injection de Motor

| Área | Inyección | PASS |
|---|---|---|
| Worker | constructor/task falla | función principal sigue o explica limitación |
| Storage | IDB unavailable | sesión sigue, persistent=false |
| Storage | quota | error controlado, no pérdida silenciosa |
| WebGL | no context | fallback |
| WebGL | context lost | no crash en bucle |
| Motion | reduced | tarea preservada |
| Pointer | cancel | drag/paint cerrado |
| Async | old result late | no overwrite |
| Lifecycle | bfcache restore | no duplicación |
| Resize | resize storm | sin loop permanente |
| Network/asset | fetch/decode fail | estado recuperable |

## 14 · Estrategia de versiones

### Widely available
Puede ser baseline técnico si:
- el producto la necesita;
- pasa QA.

### Newly available
Preferir:
- feature detection;
- fallback;
- pruebas de compatibilidad.

### Limited availability
Nunca requisito único de una tarea pública sin decisión explícita y alternativa.

## 15 · Estado R05

Auditorías read-only:
- fallback storage: completada;
- failure path Worker: completada;
- GPU cleanup/recovery gap conceptual: identificado;
- Baseline strategy: estudiada.

Marcador:
`MOTOR_COMPATIBILITY_FAILURE_INJECTION_STUDIED_R05`

No:
- build;
- cambio funcional;
- merge;
- deploy;
- main/producción.
