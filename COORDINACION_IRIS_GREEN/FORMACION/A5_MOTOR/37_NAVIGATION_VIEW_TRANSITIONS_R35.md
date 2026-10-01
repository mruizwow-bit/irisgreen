# MOTOR · A5 · ESTUDIO PROFUNDO R35 · NAVIGATION API, HISTORY Y VIEW TRANSITIONS

Fecha: 01/10/2026
Amplía: R01–R34
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Regla principal

Una transición visual nunca debe convertirse en la fuente de verdad de navegación.

Primero:
- URL;
- history/navigation state;
- foco;
- contenido;
- lifecycle.

Después:
- animación como mejora progresiva.

## 2 · Document.startViewTransition()

Fuente:
- MDN · Document.startViewTransition()
  https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition

Estado 01/10/2026:
**Baseline 2025 newly available**.

Permite transiciones same-document.

Proceso:
1. snapshot old view;
2. callback actualiza DOM;
3. snapshot new view;
4. transición.

Si update callback falla:
transición se abandona.

Regla:
el DOM debe quedar correcto incluso si animación no arranca.

## 3 · ViewTransition promises

Fuentes:
- MDN · ViewTransition.ready
  https://developer.mozilla.org/en-US/docs/Web/API/ViewTransition/ready
- MDN · ViewTransition.finished
  https://developer.mozilla.org/en-US/docs/Web/API/ViewTransition/finished

`ready`:
cuando pseudo-tree está listo.

Puede rechazar por:
- configuración;
- nombres duplicados;
- update failure.

`finished`:
cuando end state ya está visible/interactivo.

Si animación se omite:
el end state sigue alcanzándose.

Regla:
**no bloquear estado funcional en animation success.**

## 4 · Reduced motion

A5 actual:
`assets/ig-taller-r42-platform.js` evita View Transition si `prefers-reduced-motion`.

Patrón correcto:
- update ocurre igualmente;
- motion es opcional.

No usar transition callback como único lugar donde muta estado.

## 5 · View transition names

Riesgos:
- duplicate names;
- elementos desaparecen;
- bfcache conserva estilos/nombres;
- state viejo produce conflicto.

Limpieza:
retirar nombres temporales al terminar.

No persistir `view-transition-name` dinámico sin lifecycle.

## 6 · Types

Fuente:
- MDN · ViewTransition.types
  https://developer.mozilla.org/en-US/docs/Web/API/ViewTransition/types

Estado:
**Baseline 2026 newly available**.

Permite tipos:
- forwards;
- backwards;
- drill-in;
- drill-out;
etc.

Usar para styling, no como estado de negocio.

## 7 · Element-scoped transitions

Fuente:
- MDN · Element.startViewTransition()
  https://developer.mozilla.org/en-US/docs/Web/API/Element/startViewTransition

Estado:
**Limited availability / experimental**.

No baseline para Iris Green.

Document-scoped primero mientras cubra la necesidad.

## 8 · Cross-document transitions

Fuentes:
- MDN · View Transition API
  https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- MDN · pagereveal
  https://developer.mozilla.org/en-US/docs/Web/API/Window/pagereveal_event

MPA puede usar:
- `@view-transition`;
- `pageswap`;
- `pagereveal`.

Pero varias piezas siguen con soporte desigual/limited.

Regla:
cross-document view transition = progressive enhancement.

Navegación convencional debe seguir funcionando.

## 9 · pagereveal

Puede ocurrir al:
- cargar fresh;
- restaurar bfcache;
- activar prerender.

No asumir:
pagereveal = fresh document.

Combinar con navigation/lifecycle cuando se necesita distinguir.

## 10 · Navigation API

Fuentes:
- MDN · Navigation navigate event
  https://developer.mozilla.org/en-US/docs/Web/API/Navigation/navigate_event
- MDN · NavigateEvent.intercept()
  https://developer.mozilla.org/en-US/docs/Web/API/NavigateEvent/intercept

Estado:
varias piezas principales entraron en **Baseline 2026 newly available**.

Permite:
- observar navegaciones;
- interceptar same-document elegibles;
- manejar rutas.

No todas las navegaciones pueden interceptarse.

## 11 · canIntercept

Fuente:
- MDN · NavigateEvent.canIntercept
  https://developer.mozilla.org/en-US/docs/Web/API/NavigateEvent/canIntercept

No interceptar:
- cross-origin;
- download;
- navegación que la plataforma no permite.

Regla:
si `canIntercept=false`, dejar trabajar al navegador.

## 12 · Progressive navigation

Patrón Iris Green preferible:

```
<a href="/ruta-real/">
  funciona sin JS
</a>

if Navigation API + architecture requires:
  enhance navigation
```

No:
`<div onclick="router('/ruta')">`

HTML real conserva:
- open in new tab;
- copy link;
- keyboard;
- history;
- no-JS.

## 13 · currentEntry

Fuente:
- MDN · navigation.currentEntry
  https://developer.mozilla.org/en-US/docs/Web/API/Navigation/currentEntry

Puede representar entry actual y facilitar traverseTo/key.

No guardar entry key como identidad durable entre sesiones.

History entry es runtime.

## 14 · Navigation state

Si se usa state asociado a history:
- pequeño;
- serializable;
- no datos sensibles innecesarios;
- no reemplaza storage de documento/proyecto.

URL sigue siendo parte central de deep link.

## 15 · Focus after navigation

Después de cambiar vista:
definir:
- heading focus;
- main focus;
- invoker restore si overlay;
- browser natural focus si full navigation.

No animar página y dejar foco en un nodo oculto/eliminado.

## 16 · Scroll

Navegación debe respetar:
- fragment target;
- back/forward scroll restoration;
- user scroll.

No hacer `scrollTo(0,0)` universal.

Si router custom altera scroll:
test back/forward.

## 17 · Pending navigation

Nueva navegación puede superseder una anterior.

Contrato:
- abort old loader;
- invalidate revision;
- preserve URL consistency;
- no old content after new URL.

Mismo patrón de ownership asíncrono estudiado en R02.

## 18 · Error durante route load

No dejar:
URL nueva + vista vieja ambigua.

Opciones:
- error view;
- rollback si architecture permite;
- full navigation fallback.

No ocultar error bajo transition.

## 19 · bfcache

Navigation/view transition debe coexistir con bfcache.

Al restore:
- evitar transition names stale;
- no ejecutar mount doble;
- no reiniciar audio;
- no reemplazar state durable.

## 20 · A5 current audit

`assets/ig-taller-r42-platform.js`:
- detecta `document.startViewTransition`;
- función `transition(update)`;
- si reduced motion o API absent: ejecuta `update()` directo;
- si existe: envuelve en view transition.

Patrón muy bueno:
**enhancement no controla funcionalidad.**

No se observó necesidad de migrar el sitio a Navigation API.

## 21 · Testing

### API absent
update still happens.

### reduced motion
no transition; state correct.

### update throws
error controlled; state semantics known.

### rapid double navigation
old work cancelled.

### back/forward
URL/content/focus/scroll correct.

### bfcache
restore without duplicate mount.

### no-JS
links work.

## 22 · Anti-patterns

### Animation-first router
estado depende de finished.

### PreventDefault everything
rompe browser behavior.

### Fake links
div/button para navegación normal.

### Dynamic names never cleaned
bfcache/name conflict.

### Transition on reduced motion
ignora preferencia.

## 23 · Estado R35

Estudiado:
- View Transitions baseline;
- promises;
- types;
- cross-document limits;
- Navigation API;
- interception;
- focus/scroll/history;
- bfcache interaction.

Auditoría:
- transición A5 actual revisada.

Marcador:
`MOTOR_NAVIGATION_VIEW_TRANSITIONS_STUDIED_R35`

No:
- router;
- Navigation API feature;
- view transition nueva;
- route change;
- build;
- merge;
- deploy;
- main/production.
