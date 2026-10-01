# MOTOR · A5 · ESTUDIO PROFUNDO R40 · HIGH-FIDELITY POINTER INPUT Y LATENCIA DE DIBUJO

Fecha: 01/10/2026
Amplía: R01–R39
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Estado normativo

Fuentes:
- W3C · Pointer Events · Recommendation 30/06/2026
  https://www.w3.org/TR/pointerevents3/
- W3C · Pointer Events Level 4 · Working Draft
  https://www.w3.org/TR/pointerevents4/
- MDN · PointerEvent
  https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent

Pointer Events Level 3 es Recomendación W3C desde el 30/06/2026.

Incluye:
- pointerrawupdate;
- coalesced events;
- predicted events;
- altitudeAngle;
- azimuthAngle.

Pointer Events Level 4 sigue como Working Draft.
Motor no trata Level 4 como requisito vigente.

## 2 · Regla principal

Más muestras no significan automáticamente menor latencia percibida.

Un listener de alta frecuencia puede:
- ocupar main thread;
- retrasar paint;
- aumentar GC;
- empeorar INP;
- producir más latencia que pointermove normal.

Regla:
**alta fidelidad solo si el pipeline completo puede consumirla.**

## 3 · pointermove

Base estable.

Ventajas:
- widely supported;
- el navegador puede coalescer trabajo;
- suficiente para muchas herramientas.

Debe seguir siendo baseline funcional.

## 4 · pointerrawupdate

Fuente:
- MDN · pointerrawupdate
  https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerrawupdate_event

Se dispara con mayor frecuencia que pointermove cuando el navegador dispone de datos.

Características:
- puede incluir coalesced events;
- bubbles;
- composed;
- no cancelable;
- no default action.

Estado 01/10/2026:
**Limited availability / no Baseline**.

Regla:
no sustituir pointermove por pointerrawupdate universalmente.

Usarlo solo si:
- dibujo/drag visible necesita menor latencia;
- feature detection;
- handler extremadamente barato;
- fallback pointermove.

## 5 · getCoalescedEvents()

Fuente:
- MDN · getCoalescedEvents()
  https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/getCoalescedEvents

Devuelve muestras que el navegador agrupó dentro del evento despachado.

Útil para:
- curvas suaves;
- stylus;
- firma/dibujo;
- reconstrucción de path.

Estado:
**Limited availability / no Baseline**.

Patrón:
```js
const samples = e.getCoalescedEvents?.();
const points = samples?.length ? samples : [e];
```

No exigirlo para operar.

## 6 · getPredictedEvents()

Fuente:
- MDN · getPredictedEvents()
  https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/getPredictedEvents

Estado:
**Baseline 2024 newly available**.

Devuelve posiciones futuras estimadas por el navegador.

Puede reducir latencia perceptiva dibujando por delante de la muestra real.

Pero:
**predicción ≠ verdad.**

## 7 · Speculative rendering

Patrón profesional:

```
ACTUAL STROKE LAYER
  ← solo eventos reales/coalesced

PREDICTION LAYER
  ← predicted events
  ← temporal
  ← borrado/reconciliado al llegar input real
```

Nunca:
guardar predicted points como trazo definitivo sin reconciliación.

Si la predicción falla:
el usuario no debe heredar geometría inventada.

## 8 · Reconciliation

En el siguiente evento real:
1. retirar segmento predicted anterior;
2. incorporar nuevas muestras reales;
3. generar nueva predicción;
4. renderizar.

El estado persistente contiene solo input confirmado.

## 9 · Latency vs correctness

Para preview:
predicción puede priorizar latencia.

Para:
- undo;
- export;
- persistence;
- replay;
- hit-test lógico;

usar muestras reales.

La preview puede ser especulativa.
El modelo no.

## 10 · pointerrawupdate + rAF

No pintar DOM/canvas completo en cada raw event si llegan cientos/segundo.

Mejor separación:

```
raw/coalesced input
→ append samples to bounded buffer
→ rAF consumes buffer
→ draw batch
```

Si el buffer crece:
- coalesce;
- simplify;
- latest-wins donde semántica lo permita;
- reducir fidelity.

## 11 · Modelo sintético de carga

Ejercicio aislado, no benchmark de navegador:

- input de stylus: 240 Hz;
- paint: 60 Hz;
- duración: 1 s.

Naive:
- 240 callbacks/render opportunities.

Batch por frame:
- 60 consumos.

Relación:
**4:1**.

Aprendizaje:
agrupar muestras puede conservar trayectoria sin obligar a renderizar a frecuencia de input.

Esto NO demuestra números reales de Iris Green.
Solo valida el modelo de backpressure.

## 12 · Stroke simplification

Si hay muchas muestras:
algoritmos de simplificación pueden reducir geometría.

Cuidado:
- no destruir forma;
- no alterar presión;
- no aplicar simplificación irreversible antes de conocer uso/export.

Puede guardarse:
- raw bounded stroke;
- simplified render path.

Elegir por producto.

## 13 · Pressure

PointerEvent.pressure:
normalmente 0–1.

No asumir:
- pen siempre pressure;
- mouse siempre 0.5;
- valores fiables iguales entre hardware.

Fallback:
si pressure no aporta:
usar grosor fijo/control UI.

No hacer presión requisito de dibujo.

## 14 · altitudeAngle / azimuthAngle

Pointer Events Level 3 incorpora geometría de pen más explícita.

Uso potencial:
- pincel caligráfico;
- sombreado;
- dirección de brocha.

No usar si:
- hardware no lo expone;
- no hay beneficio visible;
- añade complejidad sin necesidad.

## 15 · twist / tangentialPressure

Capacidades de stylus avanzadas.

Soporte/hardware variable.

Regla:
feature-detect/value-check.
Nunca baseline de herramienta pública.

## 16 · Hover pen

Pen puede producir eventos hover sin contacto.

No confundir:
hover preview con stroke.

Commit de trazo:
desde pointerdown/contact según herramienta.

## 17 · pointercancel

Alta frecuencia no cambia la regla:
`pointercancel` cierra el gesto.

Al cancelar:
- limpiar buffer;
- limpiar prediction layer;
- release ownership;
- definir si stroke parcial se conserva/revierte.

## 18 · Pointer capture

Para stroke:
captura mantiene eventos aunque el puntero salga del canvas.

Pero:
- lostpointercapture también debe cerrar/reconciliar;
- componente destroy libera state.

No depender solo de pointerup.

## 19 · Multi-pointer

Dibujo puede recibir:
- pen;
- touch secundario;
- palm.

Usar:
- pointerId;
- pointerType;
- isPrimary;
- policy de herramienta.

No mezclar muestras de distintos pointerId en un stroke.

## 20 · Palm rejection

Browser/hardware puede generar pointercancel o filtrar eventos.

Motor no implementa palm rejection casera sin evidencia.

Debe tolerar cancelaciones.

## 21 · Smoothing

Filtros:
- moving average;
- spline;
- exponential smoothing.

Tradeoff:
más smoothing = más lag.

No “suavizar” tanto que el trazo deje de seguir intención.

Predicted events pueden ayudar a compensar latencia, pero no eliminan tradeoff.

## 22 · CPU/GPU boundary

Input sampling en JS.
Render puede ser:
- Canvas2D;
- WebGL;
- OffscreenCanvas.

No mover a GPU una herramienta simple si el cuello está en event handling.

Perfilar:
- event handler;
- path construction;
- paint;
- compositing.

## 23 · Current A5 audit

Archivos auditados:
- `assets/ig-taller-r42-direct.js`;
- `assets/ig-taller-r43-advanced.js`;
- `assets/ig-taller-r40-tools.js`.

No se encontraron usos de:
- `pointerrawupdate`;
- `getCoalescedEvents()`;
- `getPredictedEvents()`;
- `altitudeAngle`;
- `azimuthAngle`.

Los motores actuales usan:
- pointerdown;
- pointermove;
- pointerup/cancel;
- capture en varios casos.

Conclusión:
no existe deuda de estas APIs.
No introducirlas durante Formación.

## 24 · Where it could help

Futuro:
- dibujo libre;
- firma;
- pincel sensible;
- editor vectorial;
- stylus avanzado.

No aporta claramente a:
- botones;
- grids;
- selección simple;
- juego por celdas;
- controles discretos.

## 25 · Testing matrix

### Base
pointermove only.

### Coalesced
0, 1, many samples.

### Predicted
none / wrong prediction / good prediction.

### Raw
high-frequency burst.

### Cancel
pointercancel/lostcapture.

### Pen
pressure/tilt absent/present.

### Load
CPU throttled.

PASS:
- trazo final correcto;
- preview no corrompe model;
- buffer acotado;
- no main-thread collapse;
- fallback funcional.

## 26 · Metrics

Medir:
- input sample → visual response;
- event handler cost;
- batch size;
- dropped/coalesced samples;
- rAF frame time;
- memory per stroke.

No usar FPS únicamente.

## 27 · Security/privacy

Stylus hardware details pueden aportar fingerprint surface.

No registrar:
- pen geometry;
- pressure profiles;
- device-specific characteristics

fuera de sesión sin necesidad/gobernanza.

## 28 · Accessibility

Alta fidelidad de pen es mejora.

Debe mantenerse:
- mouse;
- touch;
- teclado/controles alternativos según función;
- no drag-only cuando aplique;
- tamaños/feedback.

La herramienta no se vuelve “más accesible” solo por admitir stylus.

## 29 · Adoption gate

Usar raw/coalesced/predicted solo con:

```
VISIBLE LATENCY PROBLEM
+ MEASURED BOTTLENECK
+ CAPABILITY CHECK
+ FALLBACK
+ BOUNDED BUFFER
+ SPECULATIVE LAYER SEPARATE
+ CANCEL TEST
+ PERFORMANCE TEST
```

Si falta:
pointermove normal.

## 30 · Estado R40

Estudiado:
- Pointer Events Level 3 Recommendation;
- Level 4 draft boundary;
- pointerrawupdate;
- coalesced events;
- predicted events;
- pen geometry;
- speculative rendering;
- input backpressure.

Práctica conceptual:
- 240 Hz input vs 60 Hz paint → 4:1 batching model.

Auditoría:
- A5 no usa todavía estas APIs avanzadas.

Marcador:
`MOTOR_HIGH_FIDELITY_POINTER_LATENCY_STUDIED_R40`

No:
- cambio de drawing engine;
- raw input feature;
- predicted rendering;
- build;
- merge;
- deploy;
- main/production.
