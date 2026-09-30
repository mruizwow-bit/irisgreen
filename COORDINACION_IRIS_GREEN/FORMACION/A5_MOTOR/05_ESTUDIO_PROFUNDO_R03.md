# MOTOR · A5 · ESTUDIO PROFUNDO R03 · MEMORIA, SEGURIDAD Y RESILIENCIA

Fecha: 30/09/2026  
Amplía: R01 + R02  
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Memoria: GC no sustituye ownership

Fuente:
- MDN · JavaScript Memory Management
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Memory_management

Aprendizaje:
JavaScript libera memoria alcanzable según su recolector, pero Motor sigue siendo responsable de no mantener referencias vivas innecesarias.

Fuentes frecuentes de retención:
- listeners;
- observers;
- workers;
- arrays/maps que crecen;
- closures;
- timers;
- canales;
- AudioContext/nodes;
- GPU resources;
- caches sin política de retirada.

### WeakRef / FinalizationRegistry

MDN recomienda evitar depender de ellos salvo casos de optimización específicos.

Regla Motor:
**ningún recurso crítico se libera “cuando el GC quiera”.**

No usar FinalizationRegistry para:
- cerrar workers;
- guardar datos;
- detener audio;
- liberar locks lógicos;
- completar operaciones críticas.

Preferir:
- explicit stop/destroy;
- try/finally;
- AbortController;
- dispose explícito.

## 2 · Explicit Resource Management

Fuentes:
- MDN · DisposableStack
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DisposableStack
- MDN · Symbol.dispose
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/dispose

Estado 30/09/2026:
**Limited availability / no Baseline.**

Aprendizaje:
el modelo es valioso aunque la API todavía no sea baseline:
- registrar recursos al adquirirlos;
- liberar en orden inverso;
- hacer dispose idempotente;
- ownership explícito.

Regla:
Motor puede aplicar el **patrón** hoy sin convertir `using` / `DisposableStack` en requisito de runtime público.

## 3 · AbortSignal como lifecycle owner

Fuentes:
- MDN · AbortSignal
  https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
- MDN · AbortSignal.any()
  https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/any_static
- MDN · AbortSignal.timeout()
  https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static
- MDN · DOM events / AbortSignal
  https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Events

Estado:
- AbortSignal baseline ampliamente disponible;
- `any()` ampliamente disponible desde 2024;
- `timeout()` Baseline 2024.

Patrón:

```text
component/task owner
  └─ AbortController
       ├─ event listeners
       ├─ fetch
       ├─ async task
       └─ combined timeout/user/supersede signal
destroy/supersede → abort once
```

Cuidado:
`AbortSignal.timeout()` mide **active time** y se pausa en bfcache/suspended worker.
No usarlo como cronómetro de tiempo civil.

Cuidado de memoria:
signals combinadas o timeout con listeners pueden mantenerse vivas.
Retirar listeners propios cuando el trabajo termina.

## 4 · Práctica de cleanup ejecutada

Práctica aislada sin tocar producto:

```text
PASS listener lifecycle via AbortSignal
PASS combined cancellation via AbortSignal.any
RESULT 2/2 cleanup checks passed
```

Demostrado:
- listener asociado a signal deja de ejecutarse tras abort;
- una señal combinada aborta por la primera causa y conserva la razón.

## 5 · Storage: cuota, persistencia y expulsión

Fuentes:
- MDN · Storage quotas and eviction criteria
  https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
- MDN · StorageManager
  https://developer.mozilla.org/en-US/docs/Web/API/StorageManager
- MDN · StorageManager.estimate()
  https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate

Aprendizaje:
- storage del navegador es **best-effort por defecto**;
- el navegador puede expulsarlo bajo presión;
- `navigator.storage.persist()` puede solicitar persistencia;
- `estimate()` devuelve estimaciones, no bytes exactos garantizados;
- cuotas dependen del navegador y del contexto.

Regla Iris Green:
**IndexedDB/OPFS no equivalen a almacenamiento permanente.**

Antes de almacenar:
- decisión de producto;
- privacidad;
- tamaño;
- export/backup si el usuario depende del dato;
- recuperación ante cuota;
- error `QuotaExceededError`;
- borrado.

No pedir persistencia por rutina.
Solo cuando la pérdida local tenga impacto real y esté autorizada.

## 6 · Cross-origin isolation: no es un interruptor de rendimiento

Fuentes:
- MDN · Window.crossOriginIsolated
  https://developer.mozilla.org/en-US/docs/Web/API/Window/crossOriginIsolated
- MDN · Cross-Origin-Embedder-Policy
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Embedder-Policy
- MDN · measureUserAgentSpecificMemory()
  https://developer.mozilla.org/en-US/docs/Web/API/Performance/measureUserAgentSpecificMemory

Para cross-origin isolation suelen requerirse:
- COOP `same-origin`;
- COEP `require-corp` o `credentialless`;
- Permissions-Policy compatible.

Esto habilita/reduce restricciones para:
- SharedArrayBuffer;
- mayor precisión temporal;
- measureUserAgentSpecificMemory.

### Estado Iris Green observado

`_headers` actual contiene:
- `Cross-Origin-Opener-Policy: same-origin`;
- NO contiene COEP;
- CSP permite recursos/media/frames cross-origin concretos.

Consecuencia:
no asumir `crossOriginIsolated === true`.

Añadir COEP podría bloquear recursos cross-origin que no cumplan CORP/CORS.

Regla:
**Motor no añade COEP solo para obtener una API de medición.**
Debe existir revisión arquitectónica de todos los recursos y coordinación con Astra/Vector.

## 7 · Medición de memoria

Fuente:
- MDN · Performance.measureUserAgentSpecificMemory()
  https://developer.mozilla.org/en-US/docs/Web/API/Performance/measureUserAgentSpecificMemory

Estado:
**Experimental / Limited availability**.
Requiere secure context + cross-origin isolation.

Uso correcto:
- observar tendencia;
- regression testing;
- sesiones largas;
- diferencias antes/después.

No:
- comparar bytes absolutos entre navegadores/versiones;
- convertirlo en gate universal;
- activar aislamiento solo por la métrica.

`performance.memory` está deprecated/no estándar y no debe ser baseline.

## 8 · Auditoría lifecycle read-only en Iris Green

### `tools/escenas-3d/src/index.js`

Patrones positivos:
- `cancelAnimationFrame`;
- `ResizeObserver.disconnect()`;
- disposal de geometrías/materiales/texturas;
- `renderer.dispose()`;
- `forceContextLoss()`.

Modelo recomendado:
**start() devuelve stop() y stop es idempotente.**

### `assets/ig-taller-r42-direct.js`

Observado:
- listeners;
- MutationObserver;
- ResizeObserver;
- rAF para redraw;
- no existe un `destroy()` explícito en esa capa.

Interpretación:
en una página estática puede coincidir con lifecycle del documento y no manifestarse como fuga.

Riesgo futuro:
si la herramienta pasa a montarse/desmontarse dinámicamente, observers/listeners podrían sobrevivir a la UI.

Regla:
si cambia a lifecycle dinámico, añadir owner/destroy antes de escalar.

### `assets/ig-taller-r42-platform.js`

Tiene singletons de:
- Worker;
- BroadcastChannel;
- AudioContext.

Eso puede ser correcto para lifetime de página.
Si la plataforma adquiere mounts independientes, habrá que definir:
- acquire;
- reuse;
- release;
- shutdown.

## 9 · Seguridad del runtime · dynamic code

Fuentes:
- MDN Web Security
  https://developer.mozilla.org/en-US/docs/Web/Security
- OWASP JavaScript/TypeScript Security Cheat Sheet
  https://cheatsheetseries.owasp.org/cheatsheets/JavaScript_and_TypeScript_Security_Cheat_Sheet.html
- OWASP DOM Based XSS Prevention
  https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html

Auditoría read-only del runtime público:
`assets/runtime/8fe7df74405f3c55.js`

Observado:
- **2 usos de `new Function`**;
- usos de `innerHTML`;
- `DOMParser.parseFromString(..., "text/html")`;
- carga de componentes/scripts desde recursos/URLs del runtime.

Esto NO demuestra por sí solo una vulnerabilidad explotable.

Sí demuestra:
- superficie de ejecución dinámica;
- dependencia histórica de CSP `unsafe-eval`;
- sinks que necesitan una frontera de confianza explícita.

`_headers` actual incluye:
`script-src 'self' 'unsafe-inline' 'unsafe-eval'`.

## 10 · Trusted Types

Fuentes:
- MDN · Trusted Types API
  https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API
- MDN · CSP require-trusted-types-for
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/require-trusted-types-for
- MDN · CSP trusted-types
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/trusted-types

Estado 30/09/2026:
**Trusted Types = Baseline 2026** en navegadores actuales, con posible falta en dispositivos/navegadores antiguos.

Aprendizaje:
- Trusted Types no sanitiza por sí mismo;
- obliga a pasar por políticas controladas;
- CSP puede bloquear strings en injection sinks;
- reduce la superficie auditable.

Ruta futura, NO ejecutada hoy:
1. inventariar sinks;
2. rastrear provenance de cada string;
3. eliminar dynamic code donde sea posible;
4. precompilar componentes;
5. centralizar sanitización;
6. probar Trusted Types en report/entorno controlado;
7. retirar `unsafe-eval` solo cuando no sea necesario;
8. probar páginas históricas completas;
9. Vector/Astra revisan integración y headers.

## 11 · Sanitizer API

Fuentes:
- MDN · HTML Sanitizer API
  https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API
- MDN · Element.setHTML()
  https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTML
- MDN · Document.parseHTML()
  https://developer.mozilla.org/en-US/docs/Web/API/Document/parseHTML_static

Estado:
**Limited availability / no Baseline**.

Aprendizaje:
`setHTML()` y `Document.parseHTML()` ofrecen sanitización XSS-safe en navegadores compatibles.

No convertirlos todavía en único camino de render si Iris Green necesita compatibilidad más amplia.

## 12 · DOMParser también es trust boundary

Fuente:
- MDN · DOMParser.parseFromString()
  https://developer.mozilla.org/en-US/docs/Web/API/DOMParser/parseFromString

Aunque el Document parseado es inicialmente inerte, scripts/event handlers pueden cobrar efecto si nodos inseguros pasan al DOM activo.

Regla:
**“parseado” no significa “sanitizado”.**

## 13 · Pointer de alta frecuencia

Fuente:
- MDN · PointerEvent.getCoalescedEvents()
  https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/getCoalescedEvents

Uso:
dibujo/stylus de alta precisión puede recuperar eventos coalescidos.

Estado:
**Limited availability / no Baseline**.

Aplicación:
- feature detection;
- fallback a evento normal;
- no procesar más muestras de las que el renderer puede consumir;
- no convertir precisión máxima en requisito de tarea.

## 14 · SharedWorker

Fuente:
- MDN · SharedWorker
  https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker

Estado 30/09/2026:
**Baseline 2026**, con advertencia sobre navegadores/dispositivos antiguos.

Puede compartir un worker entre ventanas same-origin.

Iris Green ya posee otros patrones:
- Web Locks;
- BroadcastChannel;
- dedicated Workers.

Regla:
no añadir SharedWorker solo porque ya sea Baseline.
Adoptarlo si resuelve una necesidad real de coordinación/coste y simplifica, no si añade otra capa.

## 15 · Media frame scheduling

Fuente:
- MDN · HTMLVideoElement.requestVideoFrameCallback()
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback

Estado:
**Baseline 2024**.

Uso:
sincronizar trabajo con frames de vídeo reales es preferible a inferirlos con `timeupdate` o un rAF genérico cuando la tarea depende del frame de media.

Frontera:
Motor puede diseñar el runtime/scheduling.
Lumen/Eco conservan ownership de media/audio de producto según alcance.

## 16 · WebCodecs

Fuente:
- MDN · WebCodecs API
  https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API

Útil para:
- edición;
- procesamiento frame a frame;
- codificación/decodificación de bajo nivel.

No usar para reproducción normal que HTMLMediaElement ya resuelve.

Regla:
**elegir la API de menor nivel solo cuando se necesita el control de menor nivel.**

## 17 · Nuevos anti-patrones de Motor

### GC as cleanup
“No guardo referencia, ya se limpiará.”
→ incorrecto para recursos externos/lifecycle.

### Cross-origin isolation for metrics
“Activo COEP para poder medir memoria.”
→ puede romper recursos y cambia seguridad/arquitectura.

### Baseline = mandatory
“Ya es Baseline 2026, lo usamos siempre.”
→ soporte histórico/fallback sigue importando.

### Security by CSP only
“CSP tiene una regla, ya no hay XSS.”
→ CSP es defensa en profundidad; reducir sinks sigue siendo necesario.

### Sanitizer future bias
“setHTML() es mejor; lo sustituyo todo.”
→ primero soporte, compatibilidad, semántica y test.

## 18 · Estado R03

Prácticas:
- lifecycle/cleanup: **2/2 PASS**;
- auditoría read-only de ownership: completada;
- auditoría read-only de dynamic-code/sinks: completada;
- revisión de headers de aislamiento/CSP: completada.

Marcador:
`MOTOR_RUNTIME_MEMORY_SECURITY_RESOURCE_OWNERSHIP_STUDIED_R03`

No:
- cambio funcional;
- build;
- merge;
- deploy;
- cambio de headers;
- main/producción.
