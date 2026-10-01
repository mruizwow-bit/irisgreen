# MOTOR · A5 · ESTUDIO PROFUNDO R33 · CAPABILITY MATRIX Y DEGRADACIÓN REPRODUCIBLE

Fecha: 01/10/2026
Amplía: R01–R32
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Regla principal

Feature detection sin prueba del fallback es una promesa sin verificar.

Motor debe poder demostrar:

```
CAPABILITY PRESENT → ruta avanzada funciona
CAPABILITY ABSENT  → fallback funciona
CAPABILITY FAILS   → recuperación funciona
```

## 2 · Capacidad ≠ navegador

No usar:
- “Safari no puede”;
- “Chrome sí puede”;
- “móvil lento”.

Usar:
- feature detection;
- runtime error;
- measured capability;
- fallback tested.

Los navegadores cambian.
Las capacidades concretas son el contrato.

## 3 · CSS feature queries

Fuentes:
- MDN · @supports
  https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@supports
- MDN · CSS.supports()
  https://developer.mozilla.org/en-US/docs/Web/API/CSS/supports_static

`@supports` / `CSS.supports()` comprueban si el navegador acepta una declaración/sintaxis.

Limitación importante:
**que una declaración sea aceptada no demuestra implementación perfecta ni ausencia de bugs.**

Por tanto:
feature query = selección de ruta.
QA = demostración de comportamiento.

## 4 · Script feature detection

Fuente:
- MDN · HTMLScriptElement.supports()
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement/supports_static

Puede detectar tipos como:
- module;
- importmap;
- speculationrules.

Widely available desde 2022.

No inventar user-agent sniffing para import maps.

## 5 · JS capability detection

Patrones:

```js
typeof Worker === 'function'
'OffscreenCanvas' in globalThis
navigator.gpu
HTMLScriptElement.supports?.('importmap')
CSS.supports('container-type: inline-size')
```

Pero detection debe corresponder exactamente a lo que se usa.

Ejemplo:
`'gpu' in navigator` no garantiza que `requestAdapter()` vaya a devolver un adapter útil.

## 6 · Capability success ≠ operation success

Dos niveles:

### static capability
API existe.

### operational capability
la operación concreta funciona.

Ejemplos:
- WebGL exists → context creation puede fallar;
- Fullscreen exists → request puede ser rechazado;
- Worker exists → constructor puede fallar por CSP/URL;
- AudioContext exists → resume puede quedar bloqueado;
- IndexedDB exists → open puede fallar;
- WakeLock exists → request puede ser rechazado.

Regla:
**detectar API + manejar rechazo real.**

## 7 · Capability matrix

Cada feature tiene:

```
NAME
DETECTION
PRIMARY PATH
FALLBACK
FAILURE PATH
TEST PRESENT
TEST ABSENT
TEST FAILURE
OWNER
```

Ejemplo:

| Capability | Primary | Fallback |
|---|---|---|
| Worker | off-main compute | local/chunked |
| OffscreenCanvas | worker preview | Canvas main |
| WebGL2 | 3D scene | Canvas/still |
| AudioWorklet | custom audio | Web Audio |
| IndexedDB | persistent local | memory session |
| WebGPU | advanced GPU | WebGL2 |
| Popover | native overlay | dialog/custom minimal |
| MediaCapabilities | codec choice | source order |

## 8 · Playwright projects

Fuente:
- Playwright · Projects
  https://playwright.dev/docs/test-projects
- Playwright · Browsers
  https://playwright.dev/docs/browsers

Projects permiten ejecutar el mismo contrato en:
- Chromium;
- Firefox;
- WebKit;
- móvil emulado;
- configuraciones distintas.

Regla:
**compatibilidad multi-browser debe ser una matriz, no una ejecución única de Chromium.**

## 9 · Emulation

Fuente:
- Playwright · Emulation
  https://playwright.dev/docs/emulation

Puede variar:
- viewport;
- touch;
- locale;
- timezone;
- geolocation;
- permissions;
- color scheme;
- reduced motion.

Emulación ≠ dispositivo físico.

Sirve para:
- reproducibilidad;
- cobertura rápida.

No sustituye:
- GPU real;
- thermal/battery;
- teclado móvil real;
- AT;
- IME real.

## 10 · Mock browser APIs

Fuente:
- Playwright · Mock browser APIs
  https://playwright.dev/docs/mock-browser-apis

`page.addInitScript()` / `context.addInitScript()` pueden preparar mocks antes de que ejecute el código de la página.

Uso:
- capability absent;
- API reject;
- valores controlados;
- semillas.

Ejemplo conceptual:
```
delete navigator.someCapability
```
si es configurable, o redefinir prototype.

Cuidado:
un mock debe reproducir:
- métodos;
- events;
- errors;
- lifecycle;
no solo un boolean.

## 11 · Forzar ausencia

Casos:

### Worker absent
Mock/entorno sin Worker.
PASS:
fallback local.

### OffscreenCanvas absent
PASS:
Canvas main o no preview avanzada.

### WebGL absent
Mock context creation null.
PASS:
fallback visible.

### IndexedDB open rejects
PASS:
memory backend + state no persistente.

### AudioWorklet module reject
PASS:
Web Audio fallback.

## 12 · Forzar fallo después de detectar

Más importante que “API absent”:

- Worker constructor success, task throws;
- WebGL context lost;
- IDB transaction abort;
- media decode error;
- WakeLock release;
- BroadcastChannel closes;
- network becomes offline.

La ruta de recuperación necesita test propio.

## 13 · Matriz de navegadores

Mínimo conceptual para runtime público:

```
Chromium desktop
Firefox desktop
WebKit desktop
Mobile Chromium emulated
Mobile WebKit emulated
```

Más:
- reduced motion;
- forced colors donde soporte;
- no-JS para core content;
- software WebGL cuando aplique.

No declarar “cross-browser” si solo se ejecutó Chromium.

## 14 · Current Iris Green evidence

Los tests R22 estudiados usan Chromium explícitamente.

Eso demuestra:
- una ruta Chromium bien instrumentada.

No demuestra por sí solo:
- Firefox;
- WebKit;
- Safari iOS real.

No se declara defecto:
es una observación sobre alcance de evidencia.

## 15 · Current A5 platform capability map

`assets/ig-taller-r42-platform.js` detecta:
- Worker;
- OffscreenCanvas;
- IndexedDB;
- OPFS;
- File System Access;
- Web Locks;
- BroadcastChannel;
- AudioWorklet;
- WebGL2;
- WebGPU;
- View Transitions;
- Popover;
- Anchor Positioning.

Patrón positivo:
capacidades opcionales.

Siguiente madurez:
**una prueba negativa reproducible por cada fallback material.**

## 16 · Capability registry

Para motores complejos puede ser útil obtener una snapshot:

```json
{
  "worker": true,
  "offscreen": false,
  "webgl2": true,
  "webgpu": false
}
```

Regla:
snapshot es diagnóstico local.

No enviar a servidor/telemetría sin gobernanza de Vigía/privacidad.

## 17 · Decision logging de tests

Cuando una prueba falla, registrar:

```
EXPECTED_CAPABILITY
ACTUAL_CAPABILITY
PRIMARY_OR_FALLBACK
FAILURE_STAGE
ERROR_CLASS
BROWSER_PROJECT
```

Evitar:
“Safari falló”.

Mejor:
“WebKit project: AudioWorklet module loading rejected; Web Audio fallback PASS/FAIL”.

## 18 · API version drift

Una feature puede pasar:
- limited → newly → widely.

La matriz necesita revisión periódica.

Pero:
no borrar fallback solo porque una tabla cambió.

Retirar fallback cuando:
- audiencia mínima;
- analytics/evidencia;
- maintenance cost;
- estrategia producto

lo justifiquen.

## 19 · Capability removal test

Todo fallback crítico debe tener test de ausencia.

Si nadie puede ejecutar el fallback en CI:
probablemente acabará pudriéndose.

## 20 · Failure vs unsupported

UI/diagnóstico debe distinguir:

### UNSUPPORTED
capacidad inexistente.

### BLOCKED
policy/permission/CSP.

### FAILED
capacidad existía pero operación falló.

### CANCELLED
usuario/lifecycle.

### DEGRADED
fallback operativo.

Esto evita mensajes engañosos.

## 21 · Matrix de Iris Green propuesta

Sin crear test nuevo hoy:

| Área | Presente | Ausente | Falla |
|---|---|---|---|
| Worker | task worker | local | reject pending + local |
| Offscreen | bitmap worker | main canvas | main canvas |
| AudioWorklet | worklet | Web Audio | Web Audio |
| IDB | persistent | memory | controlled error/memory where safe |
| WebGL2 | scene | fallback | context loss |
| WebGPU | optional | WebGL2 | WebGL2 |
| OPFS | optional storage | other storage | error |
| Locks | Web Locks | local mutex | reconciliation |
| Broadcast | cross-tab event | no event | re-read state |
| MediaCapabilities | informed source | default source order | default source order |

## 22 · Testing capability absence safely

No cambiar producto code para “hacerlo testeable” si puede inyectarse el entorno.

Preferir:
- dependency/capability injection;
- addInitScript;
- test adapter;
- local test harness.

No añadir hidden query params públicos con poderes de fallo sin revisión de seguridad.

## 23 · Evidence hierarchy

1. unit contract;
2. forced capability test;
3. cross-browser project;
4. real-device check;
5. HUMAN QA cuando perceptivo.

Ninguna capa sustituye todas las demás.

## 24 · Estado R33

Estudiado:
- CSS/JS feature detection;
- operational capability;
- Playwright projects;
- browser emulation;
- browser API mocks;
- absence/failure injection;
- capability matrices.

Auditoría:
- R42 capability registry;
- R22 Chromium scope.

Marcador:
`MOTOR_CAPABILITY_MATRIX_DEGRADATION_TESTING_STUDIED_R33`

No:
- nuevos tests de producto;
- build;
- merge;
- deploy;
- main/production.
