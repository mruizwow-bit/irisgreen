# MOTOR · A5 · ESTUDIO PROFUNDO R36 · PRERENDER, SPECULATION RULES Y STARTUP SEGURO

Fecha: 01/10/2026
Amplía: R01–R35
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Regla principal

**“El script está ejecutándose” no significa “la persona ya está viendo la página”.**

Con prerender:
- documento puede cargar;
- JS puede ejecutar;
- subrecursos pueden cargar;
- fetches pueden ocurrir;
- la página permanece invisible.

Por tanto:
efectos secundarios sensibles deben distinguir prerender de activación real.

## 2 · Speculation Rules API

Fuente:
- MDN · Speculation Rules API
  https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API

Estado 01/10/2026:
**Limited availability / Experimental / no Baseline**.

Permite:
- prefetch;
- prerender

de futuras navegaciones.

Regla:
no hacerla dependencia funcional.

## 3 · Prefetch vs prerender

### prefetch
descarga documento probable.

No ejecuta la página completa.

### prerender
puede:
- descargar documento;
- cargar subrecursos;
- renderizar;
- ejecutar JS;
- hacer fetch iniciado por scripts;

en contexto invisible.

La diferencia es arquitectónicamente importante.

## 4 · Feature detection

Fuente:
- MDN · HTMLScriptElement.supports()
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement/supports_static

Patrón:
```js
HTMLScriptElement.supports?.("speculationrules")
```

Eso detecta soporte del tipo de script.

No significa:
- regla aceptada;
- prerender ejecutado;
- target elegible;
- activación futura.

## 5 · document.prerendering

Fuente:
- MDN · Document.prerendering
  https://developer.mozilla.org/en-US/docs/Web/API/Document/prerendering

Estado:
Limited availability.

`true`:
documento está actualmente prerendering.

Patrón:
```js
if (document.prerendering) {
  document.addEventListener("prerenderingchange", activate, {once:true});
} else {
  activate();
}
```

## 6 · prerenderingchange

Fuente:
- MDN · prerenderingchange
  https://developer.mozilla.org/en-US/docs/Web/API/Document/prerenderingchange_event

Se dispara cuando documento prerenderizado es activado.

Útil para retrasar:
- analytics;
- user-session start;
- media start logic;
- interactive connection;
- attention announcements;
- expensive work que solo tiene valor si se ve.

## 7 · activationStart

Navigation Timing puede indicar que una página fue prerenderizada y ya se activó antes de que cierto código consultase `document.prerendering`.

Regla:
si la métrica/diagnóstico necesita distinguir pasado de prerender:
combinar:
- document.prerendering;
- prerenderingchange;
- navigation.activationStart.

## 8 · Startup tiers

Motor debe separar:

### SAFE_TO_PREPARE
- parse config;
- build pure state;
- preload local immutable resources;
- compile deterministic templates si no hay side effect.

### WAIT_FOR_ACTIVATION
- audio;
- notifications;
- user-visible announcement;
- session analytics;
- connection that has cost/privacy;
- wake lock;
- permissions;
- autoplay-like behavior.

### USER_GESTURE_REQUIRED
- audio play;
- fullscreen;
- clipboard write;
- pointer lock;
- wake lock when product requires explicit intent.

## 9 · Sabik implication

Sabik mount actual:
- monta UI;
- crea transporte si config enabled;
- crea query object;
- no conecta hasta submit.

Patrón positivo:
la conexión real no parece abrirse automáticamente en mount.

Esto reduce riesgo de prerender side effect.

No declarar compatibilidad total sin ejecutar prerender real.

## 10 · Media implication

Una escena prerenderizada:
no debe empezar:
- audio;
- video autoplay sensorial;
- animation intensiva innecesaria.

El browser puede deferir algunas APIs, pero Motor no depende de restricciones implícitas como diseño.

## 11 · Analytics

Motor no posee analytics.

Pero runtime debe saber:
prerendered page ≠ page view real.

Brújula/Vigía deben gobernar semántica y privacidad.

Si un futuro analytics se añade:
activation, no mera ejecución, debe informar page-view cuando corresponda.

## 12 · Network cost

Prerender puede consumir:
- datos;
- CPU;
- memoria;
- batería.

No prerenderizar:
- rutas pesadas;
- media larga;
- recursos con side effects;
- destinos poco probables

sin evidencia de beneficio.

## 13 · Save-Data / user preferences

Si el navegador/arquitectura ofrece preferencias de reducción de datos:
speculation agresiva debe evitarlas/respetarlas según soporte.

No anular intención del usuario por “velocidad”.

## 14 · CSP

Fuente:
- MDN · script type=speculationrules
  https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/speculationrules

Inline speculation rules requieren ser permitidas por CSP mediante mecanismo apropiado:
- inline-speculation-rules;
- hash;
- nonce.

Motor no relaja `script-src` para activarlas sin revisión de seguridad.

## 15 · Unsafe speculative loading

No prerenderizar rutas que:
- hagan acciones mutantes por GET;
- logout;
- add-to-cart/action;
- cambien estado remoto;
- tengan side effects al load.

Principio web:
GET/navigation debería ser safe, pero no asumir terceros/código histórico perfecto.

## 16 · Session/history

Una página prerendered puede luego convertirse en navegación activa.

State initialization debe ser:
- idempotente;
- activation-aware;
- compatible con history.

No crear una “segunda sesión” al activar.

## 17 · Lifecycle overlap

Prerender se cruza con:
- pageshow;
- pagereveal;
- bfcache;
- visibility.

No construir lifecycle como una línea única.

Mejor:
state machine:

```
PRERENDERING
→ ACTIVATED_VISIBLE
→ HIDDEN
→ BFCACHE/FROZEN?
→ RESTORED
→ DISCARDED
```

con transiciones parciales según navegador.

## 18 · Testing

Casos:
1. normal load;
2. prerender then activate;
3. prerender never activate;
4. prerender + network failure;
5. prerender + hidden;
6. bfcache after activation;
7. reduced motion;
8. save-data environment.

Comprobar:
- no audio;
- no transport premature;
- no analytics duplicate;
- no focus steal;
- no announcement;
- no irreversible action.

## 19 · Current Iris Green audit

Búsqueda previa:
A5 platform detecta `HTMLScriptElement.supports` para otras capacidades y View Transitions.

No se ha identificado una necesidad canónica actual de Speculation Rules.

No introducir durante Formación.

## 20 · Anti-patterns

### DOMContentLoaded = user saw page
falso con prerender/background.

### mount = connect
puede abrir recursos antes de activación.

### pageview on script execute
duplica prerender/no-view.

### speculation for every link
desperdicio.

### relax CSP
seguridad por velocidad.

## 21 · Estado R36

Estudiado:
- Speculation Rules;
- prefetch/prerender distinction;
- prerendering;
- activation;
- startup tiers;
- CSP;
- speculative side effects;
- lifecycle overlap.

Marcador:
`MOTOR_PRERENDER_SPECULATIVE_STARTUP_STUDIED_R36`

No:
- speculation rules;
- prefetch/prerender feature;
- CSP change;
- analytics change;
- build;
- merge;
- deploy;
- main/production.
