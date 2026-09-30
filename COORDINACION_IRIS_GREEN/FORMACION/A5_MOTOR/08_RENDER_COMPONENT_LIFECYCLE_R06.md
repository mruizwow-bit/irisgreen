# MOTOR · A5 · ESTUDIO PROFUNDO R06 · RENDERING, COMPONENT LIFECYCLE Y OFFLINE ARCHITECTURE

Fecha: 30/09/2026
Amplía: R01–R05
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Rendering pipeline

Fuentes:
- MDN · How browsers work
  https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work
- MDN · CSS performance
  https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/CSS

Modelo mental:
```text
JS / style invalidation
→ style calculation
→ layout
→ paint
→ composite
```

No toda animación cuesta lo mismo.

Cambiar:
- geometry/layout;
- paint-heavy properties;
- composited transforms

puede afectar fases distintas.

Regla Motor:
**medir el pipeline real antes de “optimizar” moviendo cosas a GPU.**

## 2 · Layers no son gratis

MDN recuerda que capas/compositing pueden mejorar algunos repaints, pero consumen memoria.

Anti-patrón:
`will-change: transform` por todas partes.

Regla:
- no promover capas preventivamente sin evidencia;
- retirar `will-change` cuando deja de ser útil;
- medir memoria y raster/composite;
- preferir diseño simple antes que layer explosion.

## 3 · CSS containment

Fuentes:
- MDN · Using CSS containment
  https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Using
- MDN · contain
  https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/contain
- MDN · content-visibility
  https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility

`contain` es widely available.

Puede limitar:
- layout;
- paint;
- size;
- style

a un subárbol.

`content-visibility:auto` puede omitir trabajo de render offscreen y a septiembre 2026 figura como Baseline 2024/newly available.

Regla:
usar containment cuando la independencia del subárbol es verdadera.

No:
aplicarlo para “ganar performance” sin revisar containing blocks, positioning y accessibility.

## 4 · content-visibility y runtimes vivos

Una idea especialmente útil:

`content-visibility:auto` puede disparar `contentvisibilityautostatechange`.

Posible aplicación futura:
- pausar canvas/preview offscreen;
- reanudar al volver a ser relevante.

Pero:
- no introducirlo sin medir;
- no desmontar estado solo porque no se pinta;
- distinguir render paused de domain state.

## 5 · Custom Elements

Fuentes:
- MDN · Web Components
  https://developer.mozilla.org/en-US/docs/Web/API/Web_components
- MDN · Using custom elements
  https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements

Global CustomElementRegistry:
widely available desde 2020.

Lifecycle clásico:
- constructor;
- connectedCallback;
- disconnectedCallback;
- adoptedCallback;
- attributeChangedCallback.

Regla MDN:
hacer setup de lifecycle preferentemente en `connectedCallback()`, no cargar el constructor de side effects.

## 6 · Lifecycle ≠ DOM move

MDN 2026 documenta:
- `connectedMoveCallback()`;
- `Element.moveBefore()`

para preservar estado durante movimientos DOM.

Pero `moveBefore()` aparece como **Limited availability**.

Conclusión:
el concepto importa hoy:
**mover no siempre significa destruir/recrear**.

No hacer que una simple reordenación:
- mate audio;
- reinicie canvas;
- pierda foco;
- borre estado.

No convertir `moveBefore()` en requisito de Iris Green hasta que soporte y necesidad lo justifiquen.

## 7 · Scoped custom element registries

MDN documenta registries scoped por ShadowRoot.

Estado observado:
partes de la API como `Element.customElementRegistry` siguen **Limited availability**.

Regla:
si algún día Iris Green necesita múltiples versiones aisladas de un mismo componente, estudiar scoped registries.

No:
introducirlos hoy como base.

## 8 · Shadow DOM

Fuente:
- MDN · Using shadow DOM
  https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM

Beneficios:
- encapsulación de estructura;
- estilos;
- ids;
- menor colisión accidental.

Costes:
- foco/event retargeting;
- testing más complejo;
- integración con CSS global;
- accesibilidad de custom controls;
- theming;
- debugging.

Regla:
Shadow DOM es una frontera de encapsulación, no un requisito de calidad.

## 9 · ElementInternals

Fuentes:
- MDN · ElementInternals
  https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals
- MDN · attachInternals()
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/attachInternals

Widely available desde 2023, con partes variables.

Puede:
- asociar custom element a forms;
- validity;
- form value;
- default ARIA semantics;
- internal custom states.

Cuidado real:
MDN documenta diferencias de accesibilidad de labels en Safari/VoiceOver para form-associated custom elements.

Regla:
**nativo primero.**
Crear custom control solo cuando un elemento HTML estándar no resuelve el requisito.

## 10 · Arquitectura actual de A5

PR histórico:
#299 · A5 · reconstrucción avanzada del Taller.

Modelo observado:
- scripts globales;
- loaders encadenados;
- `CustomEvent('ig:r43-advanced-ready')`;
- motores que montan dentro de DOM existente;
- Canvas + DOM controls;
- no Web Components.

Conclusión:
no hay razón suficiente hoy para migrar a Web Components.

Mejora conceptual sí necesaria:
cada motor debería poder evolucionar hacia un contrato explícito:

```text
mount(root, options)
→ instance
   ├─ update(...)
   ├─ pause()
   ├─ resume()
   └─ destroy()
```

sin que eso obligue a usar Custom Elements.

## 11 · Auditoría read-only del A5 avanzado

`assets/ig-taller-r43-advanced.js`:
- crea `ResizeObserver` dentro de `fit()`;
- no conserva referencia;
- no se observa `disconnect()` en la capa añadida;
- añade pointer/keyboard handlers sobre canvases.

Interpretación:
si la instancia vive hasta unload, puede ser aceptable.

Riesgo:
si se reemplaza/monta repetidamente, puede retener observers/listeners.

No se declara fuga demostrada sin profiling.

Sí se establece requisito futuro:
**si existe dynamic remount, debe existir destroy verificable.**

## 12 · Práctica lifecycle ejecutada

Práctica aislada:

Un owner contiene:
- AbortController;
- EventTarget listener;
- timer;
- destroy flag.

Resultado:

```text
PASS owner lifecycle: active before destroy
PASS destroy idempotent
PASS listeners/timer stop after destroy
RESULT 3/3 lifecycle ownership checks passed
```

Principio fijado:
**destroy debe ser idempotente.**

## 13 · Memory profiling

Fuente:
- Chrome DevTools · Fix memory problems
  https://developer.chrome.com/docs/devtools/memory-problems

Métodos estudiados:
- Memory timeline;
- heap snapshots;
- allocation profiling;
- detached DOM tree filtering;
- retained size.

Patrón de prueba para un motor dinámico:
1. baseline heap;
2. mount;
3. interact;
4. destroy;
5. force/esperar GC en entorno de diagnóstico;
6. repetir N veces;
7. comparar detached nodes / retained owners.

No usar una única medición de heap como prueba suficiente.

## 14 · Service Workers

Fuentes:
- MDN · Service Worker API
  https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- MDN · Using Service Workers
  https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
- MDN · skipWaiting()
  https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting
- MDN · Clients.claim()
  https://developer.mozilla.org/en-US/docs/Web/API/Clients/claim

Service Workers son ampliamente soportados.

Pero introducen:
- install;
- waiting;
- activate;
- fetch interception;
- cache versioning;
- multi-version client coordination.

Una nueva versión normalmente espera hasta que desaparecen clientes antiguos.

`skipWaiting()` puede activar antes.
`clients.claim()` puede reclamar páginas existentes.

Riesgo:
una página cargada con assets/versiones anteriores puede pasar a ser controlada por un worker nuevo.

Regla:
**no usar skipWaiting + claim automáticamente sin estrategia de compatibilidad entre versiones.**

## 15 · Estado Iris Green y Service Worker

En la inspección realizada:
- no se encontró registro de service worker en las rutas/código consultados;
- no se observa arquitectura offline-first activa en A5.

Eso es correcto si no existe requisito offline.

No añadir un Service Worker por:
- “PWA”;
- performance genérica;
- cachear todo.

Solo si producto define:
- qué funciona offline;
- qué puede quedar stale;
- versión de caches;
- update UX;
- rollback;
- privacidad;
- almacenamiento.

## 16 · View Transitions

Fuentes:
- MDN · ViewTransition
  https://developer.mozilla.org/en-US/docs/Web/API/ViewTransition
- MDN · Using View Transition API
  https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using

Estado:
ViewTransition figura Baseline 2025/newly available, con partes variables.

Cross-document:
actualmente mismo origen + opt-in CSS.

Regla:
es progressive enhancement.

Fallback:
actualizar DOM/navegar normalmente.

En Iris Green:
reduced motion tiene precedencia sobre “bonita transición”.

## 17 · Static gates vs runtime gates

El test histórico:
`scripts/test_r43_a5_advanced_taller.js`

comprueba por regex/presencia:
- motores;
- teclado;
- pointer;
- stylus;
- local-only;
- CSS media queries.

Eso es útil como contract/static gate.

No demuestra:
- comportamiento temporal;
- mount/destroy;
- race;
- resize;
- memory;
- pointercancel real;
- IME;
- bfcache;
- GPU context loss.

Regla de Motor:
```text
STATIC CONTRACT
+ BEHAVIORAL TEST
+ FAILURE INJECTION
+ PERFORMANCE
+ ACCESSIBILITY
+ HUMAN QA
```

## 18 · Estado R06

Práctica:
- lifecycle owner/destroy: **3/3 PASS**.

Auditorías read-only:
- A5 advanced lifecycle: completada;
- rendering/component architecture: completada;
- offline/service-worker decision model: estudiado.

Marcador:
`MOTOR_RENDER_COMPONENT_LIFECYCLE_ARCHITECTURE_STUDIED_R06`

No:
- refactor;
- service worker;
- custom element migration;
- build;
- merge;
- deploy;
- main/producción.
