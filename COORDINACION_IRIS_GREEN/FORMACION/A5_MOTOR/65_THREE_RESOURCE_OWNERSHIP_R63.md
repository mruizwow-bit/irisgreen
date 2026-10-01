# MOTOR · A5 · LABORATORIO R63 · THREE RESOURCE DISPOSAL Y TEXTURE OWNERSHIP

Fecha: 01/10/2026
Amplía: R49/R51/R59
Puesto: **Interactive Systems & Web Runtime Engineer**

No modifica producto.
No declara leak de producción.
No es certificación externa.

## 1 · Objetivo

Auditar el cleanup fino del runtime 3D actual:

`tools/escenas-3d/src/index.js`

especialmente:
- textures directas;
- textures compartidas;
- textures dentro de ShaderMaterial.uniforms.

## 2 · Fuente técnica

Three.js manual actual:

- `Material.dispose()` libera recursos relacionados con material/shader.
- **No libera texturas**.
- Texturas deben liberar sus recursos mediante `Texture.dispose()`.
- Recursos compartidos requieren ownership de aplicación.

Fuente:
Three.js · How to dispose of Objects.

## 3 · Cleanup actual

`stop()` recorre scene:

```js
if (o.geometry) o.geometry.dispose();

if (o.material)
  materials.forEach(m => {
    Object.values(m).forEach(v => {
      if (v && v.isTexture) v.dispose();
    });
    m.dispose();
  });

renderer.dispose();
renderer.forceContextLoss?.();
```

Fortalezas:
- geometry dispose;
- material dispose;
- direct texture properties;
- renderer dispose;
- context loss at teardown.

## 4 · Auditoría de escenas

Se escanearon los archivos:
- aquarium;
- bubbletube;
- fibre;
- jelly;
- night;
- pause;
- rainwindow;
- river;
- sea;
- common;
- fish.

Único sampler2D propio encontrado en ShaderMaterial uniforms:
`rainwindow.js`.

## 5 · Rainwindow texture

Blob:
`a5461050a71340d443c97a38fabc0d6865894567`.

Creación:

```js
const tex = new THREE.CanvasTexture(dmap);

const U = {
  uT: {value:0},
  uDrops: {value:tex},
  ...
};

new THREE.ShaderMaterial({
  uniforms: U,
  ...
});
```

Shader:
`uniform sampler2D uDrops`.

## 6 · Existing tex.dispose()

Existe:

```js
if (height changed) {
  tex.dispose();
  init();
  ...
}
```

Eso cubre realloc/reinit del mapa de gotas durante resize.

No se observó:
`tex.dispose()`
en final teardown de la escena.

## 7 · Why current generic traversal misses it

`Object.values(material)` contiene:
- `uniforms` object;

pero no recorre:
`uniforms.uDrops.value`.

Por tanto:
`tex.isTexture`
no aparece como direct material value.

## 8 · Lab · current traversal model

Modelo con:
- two cloned materials sharing `map`;
- one shader material with `uniforms.uDrops.value = texture`.

Resultado:

```json
{
  "sharedDisposeCount": 2,
  "nestedDisposeCount": 0,
  "materialDispose": [1,1,1]
}
```

Interpretación:
- shared direct texture puede recibir dispose repetido;
- nested uniform texture no es encontrada.

## 9 · Important severity caveat

Current `stop()` también llama:

```
renderer.dispose()
forceContextLoss()
```

Three.js docs:
- renderer.dispose frees renderer resources;
- forceContextLoss simulates WebGL context loss.

Un context loss elimina recursos GPU del contexto.

Por eso:

**NO se afirma GPU leak actual.**

La falta de `Texture.dispose()` explícito puede quedar enmascarada por destrucción completa del contexto.

## 10 · Why explicit ownership still matters

Si future runtime:
- reuses renderer/context;
- stops only one scene;
- hot-swaps worlds;
- removes forceContextLoss;
- shares renderer;

entonces:
nested uniform texture needs explicit disposal.

Además:
JS-side object/image/canvas lifetime is separate from GPU lifetime.

## 11 · Shared texture duplicate disposal

Aquarium:
- `rayMat` has a map;
- clones can share map.

Generic traversal may see same texture from multiple materials.

Repeated `Texture.dispose()` is not a desirable ownership model.

Better:
collect unique resources before disposing.

## 12 · Candidate collector pattern

Not product code.

```js
const textures = new Set();

for each material:
  collect direct isTexture values

  for each uniform:
    if uniform.value.isTexture:
      textures.add(value)

    if Array:
      collect texture elements

for each unique texture:
  texture.dispose()
```

Then:
materials dispose.

## 13 · Candidate collector lab

Same synthetic resources.

Result:

```json
{
  "names":["sharedMap","uniformTex"],
  "shared":1,
  "nested":1
}
```

PASS.

## 14 · Why not recursive Object walk

Blind recursive traversal can:
- hit cycles;
- traverse huge structures;
- dispose resources not owned;
- inspect engine internals.

Prefer:
- explicit known texture slots;
- uniforms;
- resource registry;
- ownership tracking.

## 15 · Stronger architecture

Best long-term pattern for dynamic scenes:

```
ResourceTracker
  track(geometry)
  track(material)
  track(texture)
  track(renderTarget)

disposeOwned()
```

Ownership explicit at creation time.

Better than discovering resources during teardown.

## 16 · Renderer reuse boundary

Current runtime:
one renderer per `start()`.

If future architecture reuses renderer:
R63 becomes more important.

Astra/Lumen/Motor should decide:
- per-scene renderer;
- shared renderer;
- scene resource owner.

## 17 · Context loss relation

R49/R51:
context loss invalidates GPU handles.

R63:
normal scene lifecycle should still have explicit resource ownership.

Context destruction is not a substitute for correct resource graph if renderer remains alive.

## 18 · Current classification

`FINE_GRAINED_TEXTURE_OWNERSHIP_ASYMMETRY_CONFIRMED`

`CURRENT_GPU_LEAK_NOT_ESTABLISHED_DUE_FULL_CONTEXT_TEARDOWN`

`FUTURE_RENDERER_REUSE_REQUIRES_STRONGER_RESOURCE_TRACKING`

## 19 · Handoff

Destination:
- Motor: runtime ownership;
- Lumen: scene architecture;
- Astra: shared/per-scene renderer decision.

No urgent product action during Training.

## 20 · Marker

`MOTOR_THREE_RESOURCE_OWNERSHIP_AUDIT_PASS_R63`

## 21 · Límites

No:
- leak severity;
- patch;
- issue;
- renderer refactor;
- build;
- merge;
- deploy;
- main/production.
