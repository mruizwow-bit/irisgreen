# MOTOR · A5 · ESTUDIO PROFUNDO R26 · WEBGL PIPELINE, COLOR Y GPU PROFILING

Fecha: 30/09/2026
Amplía: R01–R25
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · WebGL correctness antes que micro-optimización

Fuente:
- MDN · WebGL best practices
  https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices

Regla:
un runtime bien formado no debe generar WebGL errors salvo condiciones externas como OOM/context loss.

Antes de optimizar:
- cero GL errors;
- correct resource lifecycle;
- correct color;
- stable fallback.

## 2 · Shader compilation can stall

MDN recomienda:
- iniciar compilaciones/link;
- evitar consultas bloqueantes innecesarias;
- usar KHR_parallel_shader_compile cuando exista.

Three.js:
`renderer.compileAsync(scene,camera)`
usa esa extensión cuando es posible.

Uso:
precompilar escena probable antes de primer frame visible si profiling demuestra stutter.

No:
precompilar todas las escenas globalmente.

## 3 · KHR_parallel_shader_compile

Estado:
Limited availability.

Fallback:
renderer/compiler normal.

Regla:
optimization progressive, no dependency.

## 4 · GPU timing

EXT_disjoint_timer_query_webgl2:
- mide tiempo GPU sin bloquear pipeline;
- extension, no Baseline.

No usar:
`performance.now()` alrededor de draw y asumir que mide GPU.

CPU submit time ≠ GPU execution time.

## 5 · renderer.info

Three.js WebGLRenderer expone:
- memory.geometries;
- memory.textures;
- render.calls;
- triangles;
- points;
- lines;
- programs.

Uso:
- trend;
- regression;
- draw-call budget;
- leak detection de resources.

No representa toda VRAM exacta.

## 6 · Draw calls

Muchos objetos/materiales → más draw calls.

Mitigaciones:
- InstancedMesh;
- batching;
- shared materials/geometries;
- culling.

No fusionar todo si:
- update individual;
- accessibility/domain identity;
- maintenance

sufren.

## 7 · Auditoría instancing

Encontrado:

### Acuario
`InstancedMesh`: 3 apariciones.

### Río
`InstancedMesh`: 3 apariciones.

Uso para:
- bubbles/leaves/vegetation/repeated geometry.

Patrón positivo:
reduce draw calls de repetición.

## 8 · Overdraw

Transparencia/additive effects:
- burbujas;
- rays;
- particles

pueden pintar muchos fragments.

Costo depende de:
- screen coverage;
- layers;
- DPR.

No evaluar solo triangle count.

En móvil:
fill-rate puede dominar.

## 9 · DPR and fill rate

DPR 2:
4× pixels vs DPR 1.

DPR 3:
9× pixels.

A5 cap/adaptive DPR es crítico para GPU.

Regla:
si fill-rate bottleneck:
resolution reduction puede aportar más que reducir JS.

## 10 · Color management

Fuente:
- Three.js · Color Management
  https://threejs.org/manual/en/color-management.html

Three working color space:
Linear-sRGB.

Display output:
sRGB.

Color textures:
marcar SRGBColorSpace.

Non-color textures:
NoColorSpace.

Lighting:
linear working space.

## 11 · Current renderer audit

`tools/escenas-3d/src/common.js`:

```js
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
```

Dirección coherente:
linear lighting → tone map → display sRGB.

## 12 · CanvasTexture

`canvasTexture(..., srgb=true)`:
marca:
`tex.colorSpace = THREE.SRGBColorSpace`.

Para color art:
correct direction.

Para data textures:
function permite `srgb=false`.

## 13 · Custom ShaderMaterial

Three manual actual:
custom ShaderMaterial/RawShaderMaterial debe participar correctamente en output color conversion.

Una forma:
`#include <colorspace_fragment>`
al final del fragment shader según pipeline/version.

Audit read-only:

- common: 1 ShaderMaterial;
- aquarium: 2;
- river: 3;
- jelly: 4;
- sea: 3;
- night: 2.

En archivos auditados:
**0 ocurrencias `colorspace_fragment`**.

Esto NO demuestra visual incorrecto:
- shader values;
- blending;
- version;
- material role
deben revisarse en runtime.

Sí crea un gate:
**CUSTOM_SHADER_COLOR_PIPELINE_REVIEW**.

## 14 · Tone mapping custom shaders

Si material custom representa final lit color:
revisar también tone mapping integration.

No añadir chunks indiscriminadamente a:
- data pass;
- mask;
- non-color buffer.

La semántica del pass manda.

## 15 · Common mistake

Escena demasiado oscura/clara:
no “arreglar” subiendo luz hasta revisar:
- texture colorSpace;
- output colorSpace;
- double conversion;
- missing conversion;
- tone mapping.

Dos errores pueden aparentar brillo correcto pero color/shading incorrectos.

## 16 · Precision

MDN:
ser explícito con GLSL precision.

Three renderer puede seleccionar highp/mediump según device.

Shaders custom:
probar móviles reales.

No asumir highp fragment universal sin renderer fallback behavior.

## 17 · Texture formats

Best practices:
- mipmaps para textures 3D apropiadas;
- no asumir float render targets;
- compressed textures si asset scale lo justifica;
- uploads pueden flush pipeline.

Iris Green procedural CanvasTextures son pequeños/first-party.

No introducir compressed pipeline sin necesidad.

## 18 · Resource creation in frame

No:
- new Texture;
- new Material;
- shader compilation

por frame.

Crear:
- init;
- asset load;
- controlled state transition.

A5 scenes siguen mayormente ese patrón.

## 19 · Material change cost

Cambiar material/shader frequently puede:
- switch program;
- state changes.

Agrupar cuando profiling lo requiera.

No reordenar semántica visual sin HUMAN QA.

## 20 · Context loss

R03/R05 ya fijaron:
- context loss real;
- recreate resources.

Para shader pipeline:
source/config debe conservarse fuera de invalid GL handles.

## 21 · GPU profiling matrix

### CPU
- rAF duration;
- update time;
- draw submit.

### Three
- renderer.info calls/triangles/textures/geometries.

### GPU
- disjoint timer extension when supported.

### Visual
- frame stability;
- resolution;
- artifacts.

No confundir capas.

## 22 · First-frame stutter

Scenario:
open scene → shader compile.

Measure:
- click;
- load;
- compile;
- first stable frame.

Options:
- compileAsync after user intent/prewarm;
- loading state;
- simpler shader.

No hide 500ms freeze behind animation.

## 23 · Shader variants

Material defines/options can create program variants.

Too many variants:
- compile cost;
- memory.

Reuse configurations.

No dynamic defines per frame.

## 24 · Validation gate for Iris scenes

```text
WEBGL_ERRORS
CONTEXT_LOSS
DRAW_CALLS
TRIANGLES
TEXTURES
GEOMETRIES
SHADER_COMPILE_STALL
CUSTOM_SHADER_COLOR
DPR
FILL_RATE
MEMORY_TREND
REDUCED_MODE
SOFTWARE_RENDERER
PHYSICAL_GPU_QA
```

## 25 · State R26

Audit:
- renderer sRGB/ACES: positive;
- CanvasTexture sRGB handling: positive;
- InstancedMesh usage: positive;
- 15 custom ShaderMaterial occurrences in sampled core files;
- 0 explicit colorspace_fragment occurrences in those files;
- future color-pipeline gate identified.

Studied:
- parallel shader compile;
- GPU timing;
- renderer.info;
- overdraw/fill-rate;
- color management;
- precision/resources.

Marker:
`MOTOR_WEBGL_PIPELINE_COLOR_GPU_PROFILING_STUDIED_R26`

No:
- shader modification;
- color correction;
- compileAsync integration;
- GPU benchmark;
- build;
- merge;
- deploy;
- main/production.
