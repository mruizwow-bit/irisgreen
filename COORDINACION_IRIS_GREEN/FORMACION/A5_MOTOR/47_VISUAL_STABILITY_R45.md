# MOTOR · A5 · ESTUDIO PROFUNDO R45 · VISUAL STABILITY, LAYOUT SHIFT E INVALIDATION

Fecha: 01/10/2026
Amplía: R01–R44
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Regla principal

Una interfaz rápida que se mueve inesperadamente bajo el puntero/foco puede ser peor que una interfaz algo más lenta.

Motor debe optimizar:
- responsiveness;
- visual stability;
- predictability

como objetivos separados.

## 2 · CLS

Fuentes:
- web.dev · Cumulative Layout Shift
  https://web.dev/articles/cls
- web.dev · Core Web Vitals
  https://web.dev/articles/vitals

CLS mide estabilidad visual inesperada.

Referencia de Core Web Vitals:
- good: **≤ 0.1**;
- poor: **> 0.25**;
- evaluar p75 de page visits, móvil/desktop.

Es métrica de campo/página.
No convertirla en score de un componente aislado sin contexto.

## 3 · Layout Shift score

Un shift individual:
```
impact fraction × distance fraction
```

No mide tiempo.

Un movimiento pequeño de gran parte de viewport puede ser relevante.

## 4 · Práctica de score

Modelo:

- impact fraction = 0.25;
- distance fraction = 0.10.

Score:
`0.25 × 0.10 = 0.025`.

Dos shifts equivalentes dentro de misma ventana:
≈ 0.05 acumulado.

Qué demuestra:
la métrica combina área y distancia.

No es medición real del navegador.

## 5 · Session windows

CLS moderno agrupa bursts de shifts:
- gaps <1 s;
- ventana máx. 5 s;
- toma la ventana con score acumulado mayor.

Importante para:
- páginas largas;
- SPA;
- interfaces con actividad sostenida.

No sumar ingenuamente toda una sesión infinita.

## 6 · Expected vs unexpected

Layout shifts con input reciente pueden excluirse de CLS.

`hadRecentInput` ayuda a diagnosticar.

Pero:
“no cuenta en CLS” no significa automáticamente “buena UX”.

Ejemplo:
usuario pulsa botón y panel empuja foco fuera de vista.
Puede ser esperado estadísticamente pero molesto.

HUMAN QA sigue importando.

## 7 · LayoutShift API

Fuente:
- MDN · LayoutShift
  https://developer.mozilla.org/en-US/docs/Web/API/LayoutShift

Estado 01/10/2026:
**Experimental / Limited availability / no Baseline**.

Permite:
- value;
- hadRecentInput;
- lastInputTime;
- sources.

Uso:
diagnóstico progresivo.

No:
gate único cross-browser.

## 8 · PerformanceObserver

Para `layout-shift` se usa PerformanceObserver.

`performance.getEntriesByType('layout-shift')` no es la vía soportada.

Feature detect:
```
PerformanceObserver.supportedEntryTypes.includes('layout-shift')
```

## 9 · sources

LayoutShift.sources puede señalar nodos con mayor contribución.

Útil:
- encontrar imagen;
- embed;
- panel;
- font swap.

No persistir DOM nodes en telemetría.

Vigía gobierna observabilidad de producción.

## 10 · Causas comunes

Fuentes:
- imágenes sin dimensiones;
- iframes/embeds sin reserva;
- contenido inyectado arriba;
- fuentes web;
- UI async que cambia tamaño.

R43 y R41 conectan directamente:
- image decode;
- font loading.

## 11 · Reserve space

Para media:
- width/height;
- aspect-ratio;
- placeholder estable.

Para componentes async:
- min size;
- skeleton similar;
- overlay cuando corresponde.

No reservar 1000 px por miedo a shift:
también perjudica layout.

## 12 · Dynamic insertion

No insertar banners/paneles por encima del contenido que la persona está usando sin espacio reservado.

Preferir:
- overlay no intrusivo;
- región reservada;
- insertar después;
según semántica.

## 13 · Focus stability

Si aparece contenido:
el elemento focal no debe moverse inesperadamente fuera de alcance o quedar oculto.

Prueba:
- focus control;
- async content arrives;
- verify focus position/visibility.

CLS no mide completamente este problema.

## 14 · Pointer stability

Si un botón se mueve entre pointerdown y pointerup:
puede activar otra cosa o cancelar.

Motor debe evitar layout mutation durante gesture crítica cuando sea posible.

R04 pointer cancellation + R45 visual stability se combinan.

## 15 · Fonts

Font swap puede cambiar:
- width;
- line wraps;
- height;
- position.

Mitigaciones:
- fallback métricamente compatible;
- size-adjust/font metrics overrides cuando apropiado;
- carga estratégica;
- no bloquear todo.

Prisma/Atlas pueden intervenir en typography/assets.

## 16 · Images

Evitar:
```html
<img src="..." />
```
sin dimensiones/aspect ratio cuando layout depende de la imagen.

Responsive images:
preservar ratio.

Decode tardío no debería recalcular espacio si dimensions ya conocidas.

## 17 · Canvas

Canvas backing resize puede borrar contenido y cambiar layout si CSS size no está separado.

R21 cubrió CSS vs backing size.

R45 añade:
- mantener CSS box estable;
- cambiar resolución interna sin mover surrounding layout.

## 18 · Dialog/popover

Top-layer overlays suelen evitar reflow del documento.

Para acciones transitorias:
pueden ser más estables que insertar panel inline.

Pero:
no usar modal por performance si semántica no es modal.

## 19 · Animation vs layout

Animar:
- transform;
- opacity

suele evitar layout comparado con:
- top/left/width/height.

No es regla absoluta de compositor.

Perfilar.

Y:
transform visual puede desalinear semántica/hit testing si se abusa.

## 20 · Resize invalidation

Cuando viewport cambia:
layout shift por resize es esperado y tratado diferente en métrica.

Pero runtime debe:
- recompute geometry;
- no conservar caches stale;
- no entrar en observer loop.

R22/R32 conectan.

## 21 · bfcache/restoration

Al restaurar:
- scroll;
- fonts;
- images;
- dynamic state

pueden provocar shifts si mount duplica/inserta de nuevo.

Test R32:
bfcache + visual stability.

## 22 · Loading states

Spinner que aparece/desaparece cambiando altura:
puede causar shift.

Preferir:
- reserved status region;
- overlay;
- same-size skeleton.

Para Sabik:
results/status region debe mantener experiencia predecible.

## 23 · Error states

Error no debe colapsar layout de forma que desaparezca contexto/input.

Conservar:
- query;
- controls;
- recovery action.

No reemplazar toda UI con bloque de error distinto de tamaño sin necesidad.

## 24 · Current A5 context

R41:
font metric changes pueden alterar geometry.

R43:
image decode y intrinsic sizing.

R35:
navigation/transition.

R32:
mobile viewport.

R22:
observers/invalidation.

R45 integra estas piezas bajo un objetivo:
**stability of visual position during async runtime.**

## 25 · Existing evidence boundary

Históricamente Iris Green ha medido CLS en QA de otras capas.

Motor no reapropia esa evidencia como PASS de A5.

Si una feature A5 cambia layout:
debe medir su delta específico e integrado.

## 26 · Lab vs field

Lab:
reproduce shifts concretos.

Field:
CLS real entre dispositivos/sesiones.

No extrapolar un Chrome headless perfecto a usuarios.

## 27 · Privacy

Field RUM:
Vigía decide:
- qué datos;
- sampling;
- retention;
- consent/legal boundary.

Motor define:
qué runtime event podría explicar un shift sin enviar contenido sensible.

## 28 · PerformanceObserver dropped entries

Performance timeline tiene buffers.

Si entries se pierden:
diagnóstico puede ser incompleto.

No afirmar:
“0 shifts”
si API no soportada o entries dropped.

## 29 · Testing

### image delayed
space stays reserved.

### font delayed
no disruptive reflow or measured/accepted.

### async panel
focus stable.

### error state
layout/context stable.

### rotate/keyboard mobile
viewport adaptation.

### bfcache
no duplicate layout injection.

### 320px
no horizontal jump.

## 30 · Adoption gate

Para async UI:

```
RESERVED GEOMETRY
+ FOCUS STABILITY
+ POINTER STABILITY
+ FONT/IMAGE CONTRACT
+ MOBILE VIEWPORT
+ LAB SHIFT TEST
+ FIELD SIGNAL IF GOVERNED
```

## 31 · Estado R45

Estudiado:
- CLS;
- session windows;
- LayoutShift API;
- attribution;
- async layout stability;
- focus/pointer stability;
- font/image/layout connection.

Práctica:
- layout shift score model 0.025 PASS.

Marcador:
`MOTOR_VISUAL_STABILITY_LAYOUT_SHIFT_STUDIED_R45`

No:
- RUM;
- layout product change;
- build;
- merge;
- deploy;
- main/production.
