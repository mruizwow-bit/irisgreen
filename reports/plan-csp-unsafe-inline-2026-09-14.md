# Plan de retirada de `script-src 'unsafe-inline'` · 14-09-2026

**Estado:** plan para revisión. No se ejecuta en este PR y no modifica `_headers`, `dist/_headers`, plantillas ni runtimes.

## 1. Estado real del punto de partida

El encargo original partía de:

```text
script-src 'self' 'unsafe-inline' 'unsafe-eval'
```

En el `main` revisado, la fuente `_headers` todavía conserva esa política transicional, pero el último tramo del build ejecuta `scripts/finalize_dc_runtime_csp.py`. Ese paso retira `unsafe-eval` de **la salida pública** y `scripts/check_csp_eval_scope.py` impide que reaparezcan `eval()`, `new Function()` o `unsafe-eval` en `dist`.

Por tanto, la deuda ejecutable que queda para este plan es `script-src 'unsafe-inline'`. `style-src 'unsafe-inline'` existe también, pero queda expresamente fuera de este plan: mezclar ambas retiradas ampliaría demasiado el cambio de infraestructura.

## 2. Qué necesitaba `eval` exactamente

El runtime DC antiguo evaluaba JavaScript que las páginas guardaban como texto:

1. Leía el bloque `script[data-dc-script]` de cada página.
2. Construía una función con `new Function("DCLogic", "StreamableLogic", "React", source + …)`.
3. Esa función devolvía la clase `Component` definida en el bloque de la página.
4. Había un segundo camino de evaluación dinámica para JavaScript cargado mediante `x-import`: `new Function("React", "module", "exports", "require", code)`.

No era una necesidad de datos ni de contenido editorial; era una forma de compilar lógica de interfaz en el navegador.

El `main` actual ya eliminó esa necesidad en publicación: `finalize_dc_runtime_csp.py` precompila la lógica durante el build, desactiva la ejecución JavaScript de `x-import` y genera `/assets/runtime/dc-runtime-csp.js` sin evaluación dinámica.

## 3. Las 24 páginas y qué significa realmente «renderizarlas en build»

El guardarraíl actual exige exactamente 24 páginas DC. Cada una debe tener el contrato conocido: un `<x-dc>`, un bloque `data-dc-script` y ningún import dinámico que obligue a ampliar el runtime.

La migración de `unsafe-eval` ya precompila su lógica, pero para retirar `unsafe-inline` sin dejar otra excepción hay que completar el trabajo en dos capas:

### 3.1 Lógica ejecutable

La factoría precompilada que hoy se inserta como `<script data-dc-precompiled>…</script>` no puede seguir inline cuando desaparezca `unsafe-inline`.

Debe salir a un archivo propio con nombre por contenido, por ejemplo:

```text
/assets/runtime/dc-pages/<sha256>.js
```

La página referenciará ese archivo con `src` y el runtime solo consumirá una factoría ya registrada. No se usará `eval`, `new Function`, `blob:` ni `data:` como sustituto.

### 3.2 HTML inicial

Las 24 páginas deben publicar un único árbol de contenido inicial generado en build a partir de sus propios datos y plantilla. Ese árbol debe ser el mismo que se ofrece con JavaScript desactivado y el que el runtime mejora cuando JavaScript está disponible.

El objetivo es poder retirar la convivencia histórica entre plantilla DC + fallback duplicado cuando la paridad esté demostrada. Al haber un solo árbol inicial:

- no aparecen dos `<h1>` por mantener simultáneamente dos representaciones de la página;
- no aparecen ids repetidos por duplicar controles o secciones en fallback y plantilla;
- el contenido principal existe antes de ejecutar JavaScript;
- buscadores, rastreadores y navegación sin JS leen el mismo documento, no una versión paralela.

No se eliminará ningún fallback actual hasta que estas cuatro propiedades estén verificadas sobre las 24 páginas.

## 4. Por qué no usar hashes CSP como solución principal

Otra posibilidad sería mantener scripts inline y añadir un `sha256-…` por bloque a `script-src`. No es la opción recomendada aquí:

- la política global tendría que acumular hashes de muchas páginas distintas;
- cualquier cambio editorial que altere un bloque precompilado obligaría a recalcular CSP;
- una discrepancia entre HTML y `_headers` bloquearía la página en producción;
- seguiríamos conservando lógica ejecutable dentro del HTML, aunque ya no se llamara `unsafe-inline`.

Los archivos externos con nombre por contenido mantienen `script-src 'self'`, usan la caché larga ya prevista para `/assets/runtime/*` y hacen visible la dependencia en el grafo normal de recursos.

## 5. Orden de ejecución propuesto

### Fase 0 · Inventario final, sin cambiar nada

Extender el inventario que ya produce `scripts/audit_csp_dependencies.py` para guardar, por ruta:

- scripts inline **ejecutables**;
- scripts de datos (`application/ld+json`, `application/json`, `text/x-dc`, etc.) separados de los ejecutables;
- atributos de evento HTML reales (`onclick`, `onchange`, …);
- URLs `javascript:` si existiera alguna;
- ruta y hash de cada bloque ejecutable.

El informe debe ejecutarse **después** de todos los postprocesados del build, porque esa es la salida que recibe el navegador.

Criterio para pasar de fase: saber exactamente qué sigue obligando a `unsafe-inline`; no trabajar a partir de una estimación.

### Fase 1 · Externalizar la lógica precompilada de las 24 páginas

Modificar el paso de finalización DC para que, en vez de insertar una factoría ejecutable inline:

1. genere un archivo JS por contenido bajo `/assets/runtime/dc-pages/`;
2. sustituya el bloque inline por `<script src="…"></script>` en el mismo punto de orden;
3. mantenga un identificador estable de página/factoría para que el runtime consuma la correcta;
4. falle si dos páginas intentan registrar de forma incompatible la misma clave;
5. conserve la prohibición de `eval`, `new Function` y ejecución de `x-import`.

Criterio de salida: las 24 páginas funcionan con una CSP experimental `script-src 'self'` aunque todavía no se haya cambiado la CSP publicada.

### Fase 2 · Unificar el HTML inicial de las 24 páginas

Generar durante el build el árbol principal que hoy termina montando el runtime y comprobarlo contra la versión sin JavaScript.

Antes de retirar cualquier representación antigua, añadir pruebas para las 24 páginas que exijan, con JS activado y desactivado:

- exactamente un `<main>` útil;
- exactamente un `<h1>` visible/semántico;
- ids únicos en el documento;
- cero `{{ }}` crudos en `<main>`;
- texto principal presente;
- enlaces y controles básicos presentes;
- misma ruta/canonical/lang que ahora.

Solo después se puede eliminar el fallback o plantilla redundante que cause duplicación.

Criterio de salida: un solo árbol inicial válido y la interfaz dinámica sigue funcionando encima de él.

### Fase 3 · Externalizar el resto de scripts ejecutables inline

Con el inventario de Fase 0, mover cada bootstrap ejecutable restante a un módulo/archivo propio bajo `assets/runtime/` o al asset común que le corresponda.

Reglas:

- no introducir handlers HTML `on*` para reemplazar scripts;
- usar `addEventListener`/contratos `data-*` cuando haga falta enlazar controles;
- no convertir código en `javascript:` URLs;
- no usar `blob:` o `data:` para eludir la política;
- conservar como datos los bloques JSON/JSON-LD que no sean JavaScript ejecutable, verificando en Chromium que no generan violaciones con la política final.

Criterio de salida: el inventario final informa **cero scripts ejecutables inline y cero event handlers HTML**.

### Fase 4 · Probar la CSP estricta antes de publicarla

Sin tocar aún la política de producción, hacer que `scripts/test_csp_runtime.py` pueda servir `dist` con una política candidata:

```text
script-src 'self'
```

Ejecutar como mínimo:

- las 24 páginas DC;
- `/es/videos/` activando reproductores;
- Investigación y sus filtros/buscador;
- Directorio;
- Libros;
- Taller;
- Intereses;
- Juegos representativos;
- controles de Lectura y Música;
- portada y navegación.

Debe fallar ante cualquier `Refused to execute inline script`, `Refused to evaluate`, error de página o control que no responda.

### Fase 5 · Cambiar CSP en un PR independiente

Solo con Fases 0–4 verdes:

1. cambiar la salida final a `script-src 'self'`;
2. actualizar `audit_csp_dependencies.py` para que `unsafe-inline` ya no sea un permiso permitido en `script-src`;
3. actualizar `check_csp_eval_scope.py` o crear un guardarraíl hermano que falle si reaparece `unsafe-inline`;
4. mantener `style-src 'unsafe-inline'` sin cambios en este PR;
5. ejecutar toda la batería de publicación antes de fusionar.

No mezclar esta fase con menús, diseño, rutinas, Juegos, Tarjetas ni cambios editoriales.

## 6. Qué se rompe si se hace en el orden incorrecto

### Se quita `unsafe-inline` antes de externalizar la lógica DC

Chromium bloqueará `data-dc-precompiled`. El runtime llegará a `evalDcLogic` sin `window.__dcPrecompiledLogic` y las interfaces DC no montarán.

### Se externaliza la factoría con orden incorrecto

Si el runtime intenta consumirla antes de que el archivo de página se haya ejecutado, aparecerá el error `precompiled logic missing in CSP-safe public build`. Puede manifestarse como páginas vacías o controles sin respuesta.

### Se elimina el fallback antes de tener HTML inicial equivalente

Las páginas pueden volver a quedar vacías sin JavaScript, perder su `<h1>`, perder enlaces rastreables o depender del runtime para contenido básico.

### Se conservan dos árboles durante la transición sin comprobar ids

Reaparecen ids duplicados, relaciones `aria-labelledby` ambiguas y más de un `<h1>`/control equivalente en el DOM sin JavaScript.

### Se usan hashes CSP globales y quedan desincronizados

Un cambio de un solo byte en el script inline invalida el hash y el navegador bloquea la lógica en producción aunque el build HTML parezca correcto.

### Se reutilizan nombres no versionados con caché `immutable`

Una página nueva puede apuntar a código antiguo retenido por caché. Por eso cualquier JS externalizado en este plan debe llevar nombre por contenido.

### Se amplía `x-import` sin una decisión explícita

El runtime actual lo bloquea deliberadamente para poder garantizar ausencia de evaluación dinámica. Reintroducirlo exigiría diseñar un sistema de imports estáticos conocido en build; no debe resolverse reabriendo `eval`.

## 7. Comprobaciones obligatorias del PR de ejecución

- `python3 scripts/build_site.py` termina correctamente.
- `git status` queda igual que antes del build.
- Se siguen construyendo las 999 páginas esperadas por el baseline vigente.
- Cero `eval()` / `new Function()` en JS publicado.
- Cero `unsafe-eval` y cero `unsafe-inline` en `script-src` de `dist/_headers`.
- Cero scripts ejecutables inline en `dist`.
- Cero event handlers HTML reales en `dist`.
- Cero `{{ }}` crudos en `<main>` fuera de cualquier excepción todavía declarada; la meta de las 24 páginas es cero.
- Un único `<h1>` semántico y ids únicos en las 24 páginas con JS activado y desactivado.
- `scripts/test_csp_runtime.py`, axe y pruebas de accesibilidad pasan.
- Vídeos, buscadores, filtros, Lectura y Música siguen respondiendo.
- Capturas comparativas de al menos una página DC de contenido, Vídeos e Investigación si el HTML inicial cambia visualmente.

## 8. Decisión recomendada para revisión

Aprobar el enfoque **externalizar + nombre por contenido + un solo HTML inicial**, no una lista global de hashes CSP. Después, ejecutar las fases en un PR separado y dedicado exclusivamente a CSP/runtime.

Este documento no autoriza ni realiza esa ejecución.
