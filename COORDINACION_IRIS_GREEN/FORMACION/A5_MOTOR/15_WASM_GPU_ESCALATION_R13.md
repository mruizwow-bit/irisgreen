# MOTOR · A5 · ESTUDIO PROFUNDO R13 · COMPUTE ESCALATION, WEBASSEMBLY Y GPU

Fecha: 30/09/2026
Amplía: R01–R12
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Regla de escalado

Motor elige la capa más sencilla que cumple el requisito.

```text
DOM / native browser API
↓
JavaScript
↓
JavaScript + Worker
↓
WebAssembly + Worker
↓
GPU/WebGL/WebGPU
```

No significa que siempre haya que bajar por la escalera.

Cada escalón añade:
- build/toolchain;
- debugging;
- transferencia de datos;
- lifecycle;
- fallbacks;
- superficie de mantenimiento.

## 2 · WebAssembly no reemplaza JavaScript

Fuentes:
- WebAssembly FAQ
  https://webassembly.org/docs/faq/
- WebAssembly High-Level Goals
  https://webassembly.org/docs/high-level-goals/

WebAssembly está diseñado para complementar JavaScript.

Ejemplo ideal:
HTML/CSS/JS accesible alrededor de:
- simulación;
- imagen;
- audio;
- compresión;
- cálculo

intensivo en Wasm.

Regla Iris Green:
**UI, semántica, foco y accesibilidad siguen en Web Platform/DOM salvo razón extraordinaria.**

## 3 · Estado del estándar

Fuente:
- WebAssembly Specifications
  https://webassembly.org/specs/

En 2026 WebAssembly.org documenta:
- Wasm 3.0 specification;
- WebAssembly JS API;
- Web API;
- evolución versionless/feature-tested.

Motor no debe inferir que toda feature/proposal de Wasm está igualmente disponible en todos los navegadores.

Feature detection + toolchain compatibility.

## 4 · Linear memory

Fuentes:
- MDN · Using WebAssembly JavaScript API
  https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Using_the_JavaScript_API
- WebAssembly JS API guide
  https://webassembly.org/getting-started/js-api/

Wasm Memory:
- rango lineal de bytes;
- aislado por instancia;
- accesible mediante TypedArrays desde JS.

Coste:
- copiar datos JS → memory;
- interpretar layout;
- copiar/sincronizar salida.

Regla:
**si cada operación cruza JS↔Wasm miles de veces con objetos pequeños, el boundary puede comerse la ganancia.**

Preferir:
- batches;
- arrays compactos;
- menos crossings.

## 5 · Streaming compilation

En web:
`WebAssembly.instantiateStreaming(fetch(...))`
puede compilar mientras descarga si servidor/MIME son correctos.

Fallback:
bytes + instantiate.

Motor no introduce Wasm si el pipeline/release no puede:
- servir MIME;
- versionar artefacto;
- validar CSP;
- cachear correctamente.

Vector participa en integración/release.

## 6 · Worker + Wasm

Para CPU-heavy:
Wasm dentro de Worker suele ser mejor frontera que Wasm en main thread.

Beneficios:
- UI responsive;
- compute isolated.

No resuelve:
- algoritmo lento;
- memoria excesiva;
- transfer cost.

## 7 · Shared memory / threads

Shared WebAssembly memory usa SharedArrayBuffer.

En web:
- cross-origin isolation;
- Atomics;
- coordinación compleja.

Iris Green actual no tiene COEP/crossOriginIsolated.

Regla:
**no introducir Wasm threads sin necesidad medida + arquitectura de aislamiento aprobada.**

## 8 · SIMD

WebAssembly Core incluye vector/SIMD instructions.

Puede ayudar en:
- imagen;
- DSP;
- matrices;
- física numérica.

No escribir SIMD a mano por reflejo.

Primero:
- profiler;
- compiler auto-vectorization;
- benchmark real.

## 9 · Determinismo

WebAssembly persigue alto grado de determinismo formal, pero la aplicación completa puede perderlo por:
- host APIs;
- threads;
- clocks;
- random;
- floating point details;
- GPU.

No declarar “Wasm = deterministic replay”.

## 10 · Security boundary

WebAssembly está sandboxed dentro del browser y sometido al security model web.

Pero un módulo puede contener:
- bugs lógicos;
- loops caros;
- memory growth;
- vulnerable parser compiled from C/C++.

Sandbox ≠ código confiable.

Validar input igualmente.

## 11 · Toolchain cost

Adoptar Wasm implica:
- lenguaje/toolchain;
- compiler;
- source maps/debug info;
- CI;
- artifact provenance;
- licenses;
- security updates;
- possibly native dependencies.

Para un proyecto pequeño/mediano, JavaScript optimizado puede ser mejor negocio.

## 12 · Auditoría Iris Green

Búsqueda del repositorio:
- no se encontraron `.wasm`;
- no se encontraron referencias `WebAssembly`.

Estado:
**no existe deuda de Wasm que Motor deba mantener hoy.**

No se propone introducirlo durante Formación.

## 13 · Decision cases de Motor

### Caso A · Game of Life 36×22
~792 celdas.

Elección:
**JavaScript**.
Worker opcional si otras cargas crecen.

Wasm sería sobreingeniería.

### Caso B · 4K image filter repetido
Millones de pixels.

Proceso:
1. JS typed arrays baseline;
2. Worker;
3. benchmark;
4. Wasm/SIMD o GPU si hay cuello real.

### Caso C · DOM search/filter
Elección:
DOM/JS.

Wasm no ayuda al acceso DOM; crossings empeoran arquitectura.

### Caso D · audio DSP custom sample/block-level
AudioWorklet primero.
Wasm dentro de AudioWorklet solo si DSP pesado y benchmark lo justifica.

### Caso E · cryptography
Usar Web Crypto.
No implementar crypto casera en JS/Wasm.

## 14 · GPU vs Wasm

### Wasm
CPU compute.

### WebGL/WebGPU
GPU parallel/render/compute.

Pregunta:
¿el problema es:
- scalar/branchy CPU;
- vector/bulk numerical;
- massively parallel;
- rendering?

Elegir por workload.

## 15 · GPU transfer cost

Mover datos CPU→GPU y leerlos de vuelta cuesta.

Para workloads pequeños:
CPU puede ganar.

Para pipeline que ya vive en GPU:
mantener datos allí puede ganar.

No benchmarkear solo kernel; incluir:
- upload;
- dispatch/draw;
- synchronization;
- readback.

## 16 · WebGPU

Motor ya estudió que WebGPU no debe ser único baseline de Iris Green.

Si se adopta:
- capability;
- adapter/device errors;
- device lost;
- limits/features;
- WebGL2/CPU fallback según tarea.

No inferir GPU tier por user agent.

## 17 · Device loss

WebGPU device puede perderse.

Mismo principio WebGL:
- state domain separado de resource handles;
- recreate device/resources;
- fallback.

Nunca guardar GPU handles en proyecto persistido.

## 18 · Compile/load budget

Wasm puede reducir parse cost de grandes módulos, pero un módulo grande sigue:
- descargando;
- compilando;
- instanciando;
- inicializando memoria.

Lazy load por necesidad.

Preload solo si evidencia demuestra beneficio.

## 19 · FFI/API surface

Diseñar exports pequeños y estables.

Mal:
cientos de llamadas finas JS↔Wasm.

Bien:
```text
input buffer
→ process batch
→ output buffer
```

Versionar ABI/contract.

## 20 · Accessibility boundary

Nunca usar Wasm como excusa para:
- Canvas-only sin semántica;
- keyboard missing;
- opaque custom control.

Wasm puede calcular.
DOM sigue comunicando y operando.

## 21 · Testing

### Correctness
JS reference implementation vs Wasm result.

### Performance
warm/cold;
main/worker;
small/large inputs.

### Failure
compile fail;
instantiate fail;
memory grow fail;
worker fail.

### Compatibility
capability + fallback.

### Security
malformed/untrusted input.

## 22 · Adoption gate

Motor recomienda Wasm solo si:

```text
PROFILED BOTTLENECK
+ COMPUTE SUITABLE
+ MEASURED WIN
+ TOOLCHAIN OWNER
+ FALLBACK
+ TESTS
+ RELEASE SUPPORT
+ MAINTENANCE PLAN
```

Si falta:
seguir con JS/Worker.

## 23 · Estado R13

Auditoría:
- repo sin Wasm: verificado;
- compute escalation decision matrix: completada.

Estudiado:
- Wasm goals/spec;
- linear memory;
- JS boundary;
- workers;
- threads/isolation;
- SIMD;
- GPU tradeoffs.

Marcador:
`MOTOR_COMPUTE_ESCALATION_WASM_GPU_STUDIED_R13`

No:
- Wasm artifact;
- compiler/toolchain;
- WebGPU feature;
- build;
- merge;
- deploy;
- main/production.
