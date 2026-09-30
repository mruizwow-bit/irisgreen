# MOTOR · A5 · ESTUDIO PROFUNDO R19 · LAZY ENGINES, MODULE LOADING Y RESOURCE SCHEDULING

Fecha: 30/09/2026
Amplía: R01–R18
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Código descargado también tiene coste de ejecución

Un motor lazy puede pagar en el primer gesto:
- network;
- parse;
- compile;
- evaluate;
- initialize;
- layout/render.

Regla:
medir:
`USER INTENT → TOOL USABLE`.

No medir solo bytes.

## 2 · Static import

Ventajas:
- análisis estático;
- linking;
- tree shaking/tooling;
- errores de import temprano.

Para dependencias iniciales críticas:
preferible cuando la arquitectura ya es ESM.

## 3 · Dynamic import

Fuente:
- MDN · import()
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import

Widely available desde 2020.

Uso:
```js
const module = await import("./engine.js");
```

Adecuado cuando:
- feature poco usada;
- motor pesado;
- se conoce tras intención.

No usar si solo complica una dependencia que siempre se necesita.

## 4 · Dynamic import tiene error contract

Puede rechazar por:
- network;
- parse;
- evaluation.

Debe entrar en loader state machine R12.

No:
`import(...).catch(()=>{})`.

## 5 · import defer

Fuente:
- MDN · import defer
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/defer

Estado 30/09/2026:
**Experimental / Limited availability**.

Concepto:
fetch/link upfront, evaluation deferred.

No baseline de Iris Green.

## 6 · modulepreload

Fuente:
- MDN · rel=modulepreload
  https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/modulepreload

Widely available desde 2023.

Puede:
- fetch;
- parse/compile;
- poner módulo en module map.

Ventaja:
reduce cascada antes de uso.

Coste:
compite por:
- bandwidth;
- CPU;
- memory.

MDN advierte que no se debe preload todo.

## 7 · preload

Fuente:
- MDN · rel=preload
  https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload

Descarga/cachea recurso crítico temprano.

Para modules:
preferir `modulepreload`.

No preload:
- feature rara;
- assets pesados opcionales;
- todas las escenas.

## 8 · Prefetch/speculation boundary

Prefetch:
probabilidad futura, menor prioridad conceptual que preload.

No asumir que browser ejecutará hints exactamente como esperamos.

Resource hints son hints.

## 9 · A5 loader actual/histórico

R42/R43 usa scripts clásicos insertados dinámicamente:

```text
paths
→ platform
→ advanced
→ direct
→ shell
```

Ventaja:
orden controlado por onload chain.

Coste:
- cadena secuencial;
- globals;
- error handling parcial;
- parse/eval distribuido.

No migrar automáticamente a ESM.

Primero medir.

## 10 · Dynamic script defer

A5 asigna `.defer=true` a scripts dinámicos.

El orden real de esa cadena se asegura por:
`onload → insert next`.

No depender de `defer` como mecanismo principal para scripts insertados dinámicamente.

## 11 · Global namespace debt

Actual:
- `window.IGTallerR42Platform`;
- `window.IGTallerR43Advanced`;
- etc.

Beneficio:
interop simple.

Coste:
- name collisions;
- readiness implicit;
- hard-to-tree-shake;
- test isolation.

Una futura migración a modules debe justificarse por:
- maintainability;
- code splitting;
- contracts.

No por estética.

## 12 · First interaction latency

Para estudio:
medir:

```text
click/open route
→ base UI visible
→ motor requested
→ motor downloaded
→ evaluated
→ mounted
→ first input accepted
→ first visible response
```

Marcar cada fase con Performance API.

## 13 · Prewarm by intent

Antes de preload global:
puede bastar iniciar carga ante:
- focus;
- pointerenter;
- visible card;
- user opens “Taller”.

Cuidado:
hover no existe en touch.
Focus sí puede indicar intención de teclado.

No disparar por mousemove global.

## 14 · Intersection-based loading

Para escenas/cards offscreen:
IntersectionObserver puede iniciar carga al aproximarse.

No usar para contenido crítico inicial.

Motor mantiene fallback:
si observer no dispara por condición inesperada, interacción explícita carga.

## 15 · Abortability

`import()` no ofrece un AbortSignal estándar para cancelar una importación en curso.

Si cancelabilidad estricta importa:
- arquitectura custom fetch + compilation cuando aplica;
- o aceptar que download/eval complete pero invalidar ownership.

No inventar cancel de dynamic import.

## 16 · Module cache

Una vez cargado/evaluado, el module map reutiliza módulo por specifier/url.

No diseñar “unmount” suponiendo que import() descarga el módulo de memoria.

Lifecycle del **motor instance** debe ser separado del lifecycle del **module code**.

## 17 · Cache busting

A5 usa query versions:
`?v=r42-a5-3`.

Eso produce URL distinta.

Debe coordinarse con:
- release;
- cache headers;
- source maps;
- rollback.

Vector gobierna artefacto/release.

Motor define compatibilidad runtime entre versioned modules.

## 18 · Dependency version skew

Durante deploy:
HTML viejo puede solicitar asset viejo.
HTML nuevo → asset nuevo.

URLs versionadas ayudan.

No eliminar assets antiguos demasiado pronto si clientes ya abiertos pueden pedir lazy chunks después.

Esto es especialmente importante para code splitting.

## 19 · Retry

Un failed lazy module:
- no retry infinito;
- retry explícito/limitado;
- fallback old engine si compatible.

Si syntax/evaluation error:
retry misma URL normalmente no arregla nada.

## 20 · Preload budget

Clasificar:

### Critical
necesario antes de interacción inicial.

### Likely-soon
prewarm tras intención.

### Optional
load on action.

### Heavy rare
never preload globally.

## 21 · Worker/worklet modules

`modulepreload` permite destinos script-like según plataforma.

Pero:
no asumir que preloaded main module cubre todas dependencias automáticamente en todos navegadores.

Si se necesita:
medir requests reales.

## 22 · Loading status accessibility

Durante motor load:
- status polite;
- no freeze;
- cancel/back usable;
- fallback visible.

No spinner infinito sin texto.

## 23 · Failure state

Si advanced engine falla:
```text
ADVANCED_FAILED
→ BASIC_READY
```

es mejor que:
```text
LOADING...
```
eterno.

Conecta R12.

## 24 · Security

Dynamic module/script URL:
no construir desde input usuario arbitrario.

Allowlist/map IDs → URLs conocidas.

CSP debe permitir solo orígenes necesarios.

## 25 · Profiling

Comparar:
- eager;
- lazy;
- intent-prewarm.

Métricas:
- initial JS;
- parse/eval;
- first interaction;
- memory;
- network.

No elegir por intuición.

## 26 · Estado R19

Estudiado:
- static/dynamic import;
- modulepreload/preload;
- import defer limitations;
- lazy first-interaction latency;
- cache/version skew;
- abort limitations;
- accessible loading states.

Auditoría:
- A5 classic-script chain reinterpretada como loader contract.

Marcador:
`MOTOR_LAZY_ENGINE_RESOURCE_LOADING_STUDIED_R19`

No:
- ESM migration;
- preload;
- bundler change;
- product build;
- merge;
- deploy;
- main/production.
