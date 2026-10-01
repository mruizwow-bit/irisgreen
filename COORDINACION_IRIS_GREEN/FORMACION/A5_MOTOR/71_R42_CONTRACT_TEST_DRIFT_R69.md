# MOTOR · A5 · AUDITORÍA R69 · DERIVA ENTRE ORDEN, IMPLEMENTACIÓN Y TEST R42

Fecha: 01/10/2026
Amplía: R66/R68
Puesto: **Interactive Systems & Web Runtime Engineer**

No modifica producto.
No abre issue/PR durante Formación.

## 1 · Objetivo

Reconciliar tres contratos distintos del Rincón R42:

1. orden de producto;
2. implementación pública actual;
3. test estático R42.

El objetivo es no confundir:
- capability interna;
- escena pública;
- expectativa de test.

## 2 · Orden canónica R42

Issue:
`#288 · R42-A7 · finalizar Rincón tranquilo inmersivo`.

Orden específica:

```text
### Visual
9 escenas modernas y creíbles; no motor antiguo debajo de una barra nueva.
Reduced motion y fallback.
```

Por tanto:
**la orden explícita de producto habla de 9 escenas visuales.**

## 3 · HTML público actual

Se parsearon:
- `es/sitio-tranquilo/index.html`;
- `en/quiet-space/index.html`.

En ambos:

```json
[
  "sea",
  "rain",
  "river",
  "night",
  "aquarium",
  "bubbles",
  "jellies",
  "fibre",
  "octopus"
]
```

Conteo:
**9**.

ES y EN están alineados.

## 4 · Motor R42

`assets/rincon-immersive-r42.js` MAP:

```json
[
  "sea",
  "rain",
  "river",
  "night",
  "aquarium",
  "bubbles",
  "jellies",
  "fibre",
  "octopus",
  "forest",
  "dawn",
  "clouds"
]
```

Conteo:
**12 capabilities visuales**.

Las tres extras:
- forest;
- dawn;
- clouds.

No aparecen en la lista pública actual.

## 5 · Controller/audio map

`assets/rincon-calma.js`
conserva sound routes también para:
- forest;
- dawn;
- clouds.

Eso indica que el runtime conserva soporte/capability histórica o futura.

No prueba que deban ser públicas.

## 6 · Test actual R42

`tools/test-r42-rincon.js`:

```js
const scenes=[
  'sea','rain','river','night','aquarium','bubbles',
  'jellies','fibre','octopus','forest','dawn','clouds'
];

scenes.forEach(k =>
  assert.ok(h.includes('data-scene="'+k+'"'))
);

assert.equal(
  (h.match(/data-scene=/g)||[]).length,
  12,
  lang+' exactly 12 immersive scene buttons'
);
```

Por tanto:
el test exige 12 botones públicos.

## 7 · Contradicción

Current state:

```
ORDER = 9
PUBLIC HTML = 9
ENGINE CAPABILITY = 12
STATIC TEST = 12
```

No todos describen la misma capa.

## 8 · Correct classification

NO:
`THREE_PUBLIC_SCENES_MISSING`.

Sí:
`R42_STATIC_TEST_CONTRACT_DRIFT_CONFIRMED`.

El test mezcla:
- engine capability count;
con:
- public product scene count.

## 9 · Why 9 public is not a defect by itself

La orden #288 exige 9.

El HTML actual cumple ese número.

Por tanto:
la ausencia de forest/dawn/clouds de la UI pública no puede declararse regresión solo porque el motor todavía las soporte.

## 10 · Delivery history nuance

Una entrega posterior llegó a describir “12 espacios inmersivos”.

Eso representa un estado/entrega intermedia.

Pero:
- orden original específica = 9;
- current public HTML = 9.

Motor no decide cuál set debe ganar si existe una decisión de producto posterior no localizada.

Astra/María son autoridad del producto/gate.

## 11 · HUMAN QA commits

Current HTML history incluye:
- `R42 A7: ES human-QA media rebuild`;
- `A2 port A7 Rincón two fixes`.

El commit two-fixes inspeccionado no alteró el número de escenas:
cambió versiones CSS/JS.

Así que:
el estado público de 9 no fue introducido por ese pequeño two-fixes commit.

## 12 · Test consequence

Si `tools/test-r42-rincon.js` se ejecuta literalmente contra current main:
- forest assertion falla;
- dawn assertion falla;
- clouds assertion falla;
- count 12 assertion falla porque current count = 9.

Por tanto:
ese test no representa el contrato público actual.

## 13 · Why this matters

Un test stale puede:
- dar falsos negativos;
- empujar código a reintroducir producto retirado;
- hacer que un agente “arregle” la web para satisfacer una expectativa histórica;
- confundir capability con UX.

Regla Motor:
**no modificar producto para satisfacer un test hasta reconciliar el test con la orden vigente.**

## 14 · Correct test split

Propuesta conceptual, no patch:

### Engine capability test
```
assert engine MAP supports intended internal scene set
```

### Public product test
```
assert public scene list equals product-approved set
```

No usar una misma lista para ambas capas.

## 15 · Public contract source

Idealmente:
una manifest/canonical data source define:
- publicScenes[];
- engineCapabilities[];
- audioRoutes[];

Tests leen contratos explícitos.

Evita duplicación de arrays en:
- HTML;
- engine;
- test;
- sound map.

## 16 · Relation to pause R68

La contract audit también encontró:
`pause`
como único kind solicitado por controller pero ausente del engine MAP.

Eso sí es mismatch funcional.

Forest/dawn/clouds:
engine-only extras.

Pause:
caller-only missing capability.

Diferencia importante.

## 17 · Automated contract audit result

```json
{
  "engineKinds": 12,
  "publicKindsES": 9,
  "publicKindsEN": 9,
  "explicitStartKinds": ["pause"],
  "unsupportedRequestedKinds": ["pause"],
  "engineOnlyKinds": ["forest","dawn","clouds"]
}
```

## 18 · Evidence level

- canonical order read;
- current public source parsed;
- current engine parsed;
- current static test read.

No browser execution needed to prove set mismatch.

Label:
`STATIC_CONTRACT_AUDIT_PASS`.

## 19 · Handoff

- Astra: determine approved public scene set and gate.
- Vector: align integration tests.
- Lumen: confirm intended immersive catalogue.
- Motor: engine/controller interface contract.

No need to re-add scenes from A5 without product decision.

## 20 · Marker

`MOTOR_R42_CONTRACT_DRIFT_AUDIT_PASS_R69`

`R42_STATIC_TEST_SCENE_COUNT_DRIFT_CONFIRMED`

## 21 · Límites

No:
- product scene decision;
- test patch;
- issue severity;
- build;
- merge;
- deploy.
