# R42 Taller · física y CSP · decisión Astra · 26/09/2026

## Estado

`R42_A5_PHYSICS_CSP_DUAL_ENGINE_REQUIRED`

## Hecho técnico verificado

La fuente `_headers` todavía contiene históricamente `'unsafe-eval'`, pero el build de publicación ejecuta `scripts/finalize_dc_runtime_csp.py`, que transforma la CSP pública a:

`script-src 'self' 'unsafe-inline'`

y `scripts/check_csp_eval_scope.py` falla si `'unsafe-eval'` reaparece.

Por tanto, la salida pública actual no habilita WebAssembly mediante CSP.

Rapier JavaScript es un módulo WebAssembly. Sin `'wasm-unsafe-eval'` en `script-src`, los navegadores modernos que aplican CSP bloquean la compilación/instanciación de WebAssembly.

Planck.js actual es una reescritura JavaScript/TypeScript de Box2D para física 2D y no necesita WebAssembly.

## Decisión

No modificar ahora la CSP global de Iris Green.

Para Taller:
- **Planck es el backend de física de producción garantizado** bajo la CSP vigente.
- **Rapier queda como backend opcional/acelerado** solo cuando la política efectiva permita WebAssembly.
- Ninguna función pública del Taller puede depender exclusivamente de Rapier.
- Un bloqueo de Rapier por CSP debe degradar silenciosamente a Planck, sin error visible, sin estado roto y sin pérdida de controles.
- El paquete `planck` actual debe preferirse al paquete deprecado `planck-js`.

## Razón

`'wasm-unsafe-eval'` es mucho más limitado que `'unsafe-eval'`: habilita WebAssembly, no eval/Function de JavaScript. Aun así amplía deliberadamente la superficie permitida por la CSP.

Como existe una alternativa 2D funcional que conserva la política actual, no hay necesidad de relajar la CSP global para cerrar el Taller.

## Condición de equivalencia

Planck no se trata como “fallback pobre”. Mientras la producción use la CSP actual, es el motor canónico para las funciones 2D.

A5 debe encapsular la física detrás de una API común con el subconjunto realmente utilizado:
- mundo/gravedad;
- cuerpos estáticos y dinámicos;
- caja/círculo/polígono cuando proceda;
- posición/velocidad;
- fricción/restitución;
- step;
- colisiones/contactos;
- reset/pausa.

Las experiencias públicas deben comportarse de forma equivalente dentro de tolerancias razonables con ambos backends.

No introducir una función visible que exista solo en Rapier si la ruta pública de producción no puede ejecutarla.

## Límite 2D/3D

Planck es 2D. Esta decisión cubre física 2D del Taller.

Si un estudio futuro exige **física 3D real**, el gate debe reabrirse. Una vista 3D/isométrica sin simulación física 3D no obliga a habilitar WASM.

## Selección de motor

Preferencia:
1. no provocar una violación CSP conocida en cada carga;
2. si el build conoce que WASM está deshabilitado, seleccionar Planck directamente;
3. si se permite Rapier en un entorno concreto, inicializarlo de forma controlada y capturar cualquier fallo;
4. no dejar promesas rechazadas ni errores visibles en consola como funcionamiento esperado.

## CSP futura

Si más adelante se valora `'wasm-unsafe-eval'`:
- será una decisión separada A2/Astra;
- nunca equivale a restaurar `'unsafe-eval'`;
- se probará primero en Report-Only/preview;
- se medirá necesidad real de rendimiento/funciones;
- se intentará limitar al Taller en lugar de toda la web;
- la configuración debe producir una única política efectiva compatible con WASM en esas rutas.

Importante: añadir una segunda CSP más permisiva no anula otra más restrictiva; múltiples CSP se aplican conjuntamente.

## QA obligatorio de A5/A2

Bajo la **CSP real de producción**:
- 0 `'unsafe-eval'`;
- 0 `'wasm-unsafe-eval'` mientras esta decisión siga vigente;
- motor efectivo = Planck;
- física funcional;
- 0 error visible;
- 0 unhandled rejection;
- teclado/touch/puntero conservados;
- reduced motion/pausa/reset conservados.

Gate opcional de laboratorio:
- política explícita con `'wasm-unsafe-eval'`;
- Rapier inicializa;
- mismas escenas de regresión pasan con tolerancias equivalentes.

Escenas mínimas comunes:
- caída/gravedad;
- colisión estática;
- restitución;
- fricción;
- reset;
- pausa;
- al menos una interacción directa del estudio que use física.

## Límite de verificación actual

La decisión anterior evalúa la arquitectura propuesta.

A fecha de este registro, el HEAD remoto visible de PR #299 es:

`8c1a9cc132ae9ebcacf1acbec3f99767db295634`

y en ese HEAD todavía no aparecen referencias a Rapier o Planck. Por tanto:
- no se declara implementado el doble motor en GitHub;
- no se declara probado el fallback;
- A5 debe subir HEAD/tree nuevos y evidencias;
- Astra/A2 revisarán entonces la implementación real contra este criterio.

## Integración

A2 no debe tocar la CSP para integrar A5.

A2 integra el Taller dual y valida primero la ruta Planck con el header final generado por build.

Estado: `R42_A5_PHYSICS_CSP_DUAL_ENGINE_REQUIRED`.
