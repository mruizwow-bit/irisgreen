# MOTOR · A5 · PRÁCTICA R71 · VERSIONADO Y NEGOCIACIÓN DE CAPABILITIES EN RUNTIME

Fecha: 01/10/2026
Amplía: R68/R69/R70
Puesto: **Interactive Systems & Web Runtime Engineer**

No modifica producto.
No abre issue/PR durante Formación.

## 1 · Objetivo

Extraer una regla de arquitectura del mismatch observado entre:

- controller público `assets/rincon-calma.js`;
- runtime `assets/rincon-immersive-r42.js`.

Problema raíz:

> dos módulos con generaciones distintas comparten un nombre/API aproximado, pero no existe negociación explícita de capabilities.

## 2 · Selección actual de runtime

`rincon-calma.js`:

```js
var lib = window.IGScenesR42 || window.IGScenesR04;
```

Si no existe:
carga R42 dinámicamente.

Después llama:
```js
lib.supported()
lib.start(kind, canvas, opts)
```

## 3 · Controller no comprueba version

Búsqueda en `rincon-calma.js`:

- referencias a `IGScenesR42`: presentes;
- referencias a `IGScenesR04`: presentes;
- lectura de `lib.version`: **ausente**.

Por tanto:
el controller no distingue semánticamente versiones.

## 4 · Runtime sí publica version

R42 exporta:

```js
version: 'R42_A7_IMMERSIVE_WEBGL2'
```

Pero ese dato hoy es:
- informativo;
- no participa en compatibilidad.

Una version string sin negociación:
no protege callers.

## 5 · Contrato que el controller asume

Por inspección de calls:

### Scene flow

```js
lib.start(kind, canvas, {
  speed,
  color,
  reduced
})
```

### Pause flow

```js
lib.start('pause', canvas, {
  reduced,
  phase
})
```

### Returned handle assumptions

Caller puede consultar:
- `canPoke`;
- `poke(x,y)`;
- `stop()`.

Así que el contrato efectivo del controller es:

```
supported()
start(kind, canvas, opts)
  opts.speed?
  opts.color?
  opts.reduced?
  opts.phase?
→ {
    stop(),
    poke?,
    canPoke?
  }
```

## 6 · Contrato que R42 implementa

R42:

### supported
Comprueba:
- WebGL2;
- o Canvas2D fallback.

### kinds
12:
sea/rain/river/night/aquarium/bubbles/jellies/fibre/octopus/forest/dawn/clouds.

No:
pause.

### opts consumed
- reduced;
- speed;
- color.

No:
phase.

### returned handle
- stop;
- poke noop;
- canPoke:false.

## 7 · Mismatch table

| Contract | Controller expects | R42 implements |
|---|---|---|
| supported() | yes | yes |
| scene kinds public | 9 | yes |
| pause kind | yes | **no** |
| opts.reduced | yes | yes |
| opts.speed | yes | yes |
| opts.color | yes | yes |
| opts.phase | yes | **no** |
| stop() | yes | yes |
| canPoke | optional | false |
| poke | optional | noop |
| version negotiation | implicit | version only |

## 8 · Failure mode

Unknown kind handling:

```js
var scene = MAP.hasOwnProperty(kind) ? MAP[kind] : 0;
```

This converts contract violation into valid-looking output.

Caller asks:
`pause`.

Engine silently supplies:
`sea`.

This is worse for diagnosis than a clear failure because:
- no exception;
- no console error;
- static checks can pass;
- UI still renders something.

Rule:
**unknown capability should not silently masquerade as a different capability.**

## 9 · Fail-fast vs fail-soft

Not every mismatch should throw to user.

Good split:

### Internal contract
Fail fast:
`UNKNOWN_SCENE_KIND`.

### Product boundary
Catch and fail soft:
- keep original orb;
- static fallback;
- accessible message if needed.

This preserves:
diagnostic clarity + user resilience.

## 10 · Capability negotiation pattern

Conceptual:

```js
const caps = lib.capabilities();

{
  version:'R42_A7...',
  kinds:['sea',...],
  options:{
    reduced:true,
    speed:true,
    color:true,
    phase:false
  },
  poke:false,
  contextRecovery:false
}
```

Caller:

```js
if (caps.kinds.includes('pause') && caps.options.phase) {
  startPause3d();
} else {
  keepNativePauseOrb();
}
```

No silent default.

## 11 · supported(kind)

A smaller alternative:

```js
lib.supported('pause')
lib.supported('aquarium')
```

Current `supported()` only answers graphics backend availability.

That name is ambiguous.

Better distinguish:

- `backendSupported()`;
- `supportsScene(kind)`;
- `capabilities()`.

## 12 · Semantic version alone is insufficient

Even if version were:
`4.2.0`,
controller still needs to know:
what capability changed.

Do not write:
```js
if (version >= 42) ...
```
for every feature.

Prefer capability detection.

Version remains useful for:
- diagnostics;
- evidence;
- cache;
- compatibility matrix.

## 13 · Contract test

Future static test:

```
requestedKinds(controller)
  ⊆ supportedKinds(engine)
```

R69 automated audit produced:

```json
{
  "unsupportedRequestedKinds": ["pause"],
  "engineOnlyKinds": ["forest","dawn","clouds"]
}
```

That test would have caught R68 immediately.

## 14 · Option contract test

Also inspect option keys.

Caller supplies:
`phase`.

Engine does not read:
`opts.phase`.

Static contract test can flag:
`CALLER_OPTION_UNUSED_BY_ENGINE`.

Not every unused option is bug:
may be tolerated forward/backward compatibility.

But it requires an explicit compatibility decision.

## 15 · Return handle contract

Caller should not guess optional fields.

Type-like contract:

```ts
interface SceneHandle {
  stop(): void;
  canPoke: boolean;
  poke?(x:number,y:number): void;
}
```

If canPoke=false:
caller should not expose touch UI.

Current R42 + calm do this correctly.

## 16 · Feature deprecation

If engine removes:
`pause`.

Process should be:
1. mark deprecated;
2. update caller;
3. test both;
4. remove;
5. delete compatibility shim.

Not:
replace engine and keep caller assumption.

## 17 · Contract ownership

Motor:
runtime interface.

Lumen:
which scene capabilities product needs.

Prisma:
if frontend adapter pattern becomes shared platform.

Astra:
architecture/gate.

Vector:
integration version compatibility.

## 18 · State compatibility

Runtime versions can also differ in:
- serialized project state;
- event names;
- defaults;
- lifecycle.

The same capability-manifest principle applies.

R23 type contracts and R09 migrations connect here.

## 19 · Backward compatibility

If R42 must accept old R04 callers:

Options:

### Adapter
`R04-compatible adapter → R42`.

### Compatibility layer
implement pause mapping.

### Explicit rejection
caller falls back.

Do not silently map unknown to unrelated scene.

## 20 · Runtime API health checks

At mount:

```
assert typeof lib.start === 'function'
assert typeof lib.supported === 'function'
assert supported scene kinds
```

In production:
fail-soft.

In CI:
fail-fast.

## 21 · Test naming

Avoid:
`R42 static pass`
if it only tests asset presence.

Prefer:
- `R42_ASSET_CONTRACT_PASS`;
- `R42_CONTROLLER_ENGINE_API_PASS`;
- `R42_LIFECYCLE_PASS`;
- `R42_PERCEPTUAL_HUMAN_PASS`.

Evidence names should say what passed.

## 22 · Result

Root architectural pattern identified:

`CONTROLLER_ENGINE_CAPABILITY_NEGOTIATION_MISSING`.

Specific mismatch already evidenced:
- pause kind;
- phase option.

R64/R65/R68/R70 show downstream lifecycle effects.

## 23 · Practice outcome

Motor can now answer:

> When two generations of a runtime coexist, should caller branch by version string?

Answer:
**prefer explicit capability contracts; version for diagnostics, not feature guessing.**

## 24 · Marker

`MOTOR_RUNTIME_CAPABILITY_NEGOTIATION_DRILL_PASS_R71`

## 25 · Límites

No:
- API redesign product;
- adapter implementation;
- semver migration;
- build;
- merge;
- deploy.
