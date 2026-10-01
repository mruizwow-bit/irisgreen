# MOTOR · A5 · ESTUDIO PROFUNDO R44 · SCROLL-DRIVEN ANIMATIONS Y SCROLL RUNTIME

Fecha: 01/10/2026
Amplía: R01–R43
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Regla principal

Scroll es input continuo de alta frecuencia.

No usar:
`scroll event → leer layout → escribir estilos`
por defecto si CSS/animation timelines pueden expresar la relación.

Primero:
- semántica/layout;
- CSS;
- compositor-friendly properties;
- reduced motion;
- fallback.

## 2 · Scroll-driven Animations

Fuentes:
- MDN · CSS scroll-driven animations
  https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations
- W3C · Scroll-driven Animations
  https://www.w3.org/TR/scroll-animations-1/

Permite ligar animación a:
- progreso de scroll;
- posición de un elemento dentro del viewport.

No depende del paso del tiempo.

## 3 · Estado de especificación

A 01/10/2026:
W3C Scroll-driven Animations sigue como Working Draft.

APIs JS:
- ScrollTimeline;
- ViewTimeline;

siguen con **Limited availability / no Baseline** según MDN.

Regla:
no convertirlas en requisito único.

## 4 · AnimationTimeline

Fuente:
- MDN · AnimationTimeline
  https://developer.mozilla.org/en-US/docs/Web/API/AnimationTimeline

Interfaz base ampliamente disponible.

Tipos:
- DocumentTimeline;
- ScrollTimeline;
- ViewTimeline.

Pero soporte de subclases no implica soporte universal de scroll timelines.

## 5 · Scroll progress timeline

Progreso:
0% → inicio rango de scroll.
100% → final.

Ventaja:
mapeo declarativo.

No necesita mantener manualmente:
`lastScrollY`,
`direction`,
`animationState`
si la animación solo representa progreso.

## 6 · View progress timeline

ViewTimeline liga progreso a posición/visibilidad de un subject en su scroller.

Útil:
- reveal;
- parallax muy suave;
- progress affordance;
- entrada/salida.

No usar para ocultar contenido esencial hasta animación.

Contenido debe existir/ser accesible aunque la timeline no funcione.

## 7 · Práctica de progreso

Modelo aislado:

Rango:
- start = 100;
- end = 500.

```
progress = clamp((scroll - start)/(end-start), 0, 1)
```

Resultados:
- 0 → 0;
- 100 → 0;
- 250 → 0.375;
- 500 → 1;
- 700 → 1.

PASS.

Al invertir scroll:
el progreso se invierte de forma natural.

Qué demuestra:
modelo continuo/reversible.

Qué NO demuestra:
browser/compositor real.

## 8 · CSS first

Si soporte existe:
preferir CSS:
- animation-timeline;
- scroll();
- view();
- view-timeline;
- scroll-timeline.

Ventajas potenciales:
- menos JS;
- mejor integración con rendering engine;
- relación declarativa.

No asumir rendimiento superior sin medir.

## 9 · JS ScrollTimeline

Fuente:
- MDN · ScrollTimeline
  https://developer.mozilla.org/en-US/docs/Web/API/ScrollTimeline

Limited availability.

Puede pasarse a Web Animations.

No baseline para Iris Green.

Si se usa:
feature detection + fallback.

## 10 · ViewTimeline JS

Fuente:
- MDN · ViewTimeline
  https://developer.mozilla.org/en-US/docs/Web/API/ViewTimeline

Limited availability.

No usar como única forma de revelar/operar contenido.

## 11 · Axis

Preferir:
- block;
- inline;

cuando la intención sigue writing mode.

No hardcodear x/y si la UI debe adaptarse a writing modes futuros.

R15 cubrió bidi/writing direction.
R44 aplica esa idea a scroll.

## 12 · Reduced motion

Scroll-driven sigue siendo motion.

`prefers-reduced-motion` aplica igualmente.

Patrón:
```css
@media (prefers-reduced-motion: reduce) {
  .scroll-animated {
    animation: none;
    transform: none;
  }
}
```

No reemplazar movimiento continuo por otra animación intensa.

## 13 · Motion sickness

Parallax grande, zoom, scale y profundidad ligados a scroll pueden causar malestar.

Iris Green:
especial cuidado por objetivo neurodivergente/sensorial.

Regla:
- amplitud baja;
- opcional;
- reduced;
- no contenido esencial;
- HUMAN QA perceptivo cuando aplique.

## 14 · Scroll listener fallback

Si no existe timeline y el efecto aporta:
listener pasivo cuando no necesita preventDefault.

No renderizar directamente cada evento si puede agruparse:
```
scroll → mark dirty
rAF → read once → write once
```

## 15 · Layout thrash

Mal:
```
for each scroll:
  getBoundingClientRect()
  style.transform = ...
  getBoundingClientRect()
  style...
```

Mejor:
- batch reads;
- batch writes;
- rAF;
- cached geometry invalidada correctamente.

## 16 · IntersectionObserver boundary

IntersectionObserver es mejor para:
- “entró/salió”;
- lazy load;
- coarse visibility.

ScrollTimeline/ViewTimeline:
progreso continuo.

No usar IntersectionObserver con 100 thresholds para simular un timeline si existe mejor alternativa y soporte lo permite.

## 17 · Scroll snapping

Scroll-snap y scroll-driven animations interactúan.

No crear una animación que implique posiciones intermedias incompatibles con snap.

Test:
- keyboard;
- touch;
- reduced motion;
- snap.

## 18 · Scroll anchoring

Contenido dinámico puede alterar scroll.

No asumir scrollY estable si:
- imágenes cargan;
- fonts cambian;
- contenido se inserta.

Para timeline nativa:
browser recalcula.

Para JS:
invalidar geometry.

## 19 · Programmatic scroll

`scrollIntoView()`, fragment navigation, focus pueden mover scroll.

La animación ligada a scroll reaccionará también.

No inferir:
“scroll change = gesto manual”.

## 20 · Focus

Animación no debe desplazar visualmente el elemento focal lejos de su posición lógica de forma que confunda.

No usar transform para “mover” controles esenciales grandes distancias mientras reciben foco.

## 21 · Sticky

Sticky + scroll animation:
puede ser potente, pero:
- stacking;
- paint;
- focus;
- reduced motion;
- mobile viewport

requieren QA.

No sobreusar para storytelling si la tarea principal es información.

## 22 · Current A5 audit

Archivos auditados:
- `assets/ig-taller-r42.js`;
- `assets/ig-taller-r42-platform.js`;
- `sabik/iris-mount.mjs`.

No se encontraron usos de:
- ScrollTimeline;
- ViewTimeline;
- animation-timeline;
- scroll-timeline;
- view-timeline;
- scroll listener en esos runtimes.

Conclusión:
no existe deuda actual A5 de scroll-driven animation.

No introducir durante Formación.

## 23 · Potential Iris Green use

Podría servir en:
- progreso de artículo;
- pequeños reveals;
- navegación visual;
- experiencias editoriales.

Pero para Iris Green:
**información primero, motion después.**

Senda/Prisma/Croma/Axioma intervienen según producto/visual/accesibilidad.

## 24 · Fallback

Primary:
scroll-driven animation.

Fallback:
- estado estático final;
- simple transition;
- IntersectionObserver discrete reveal.

Nunca:
contenido oculto permanentemente.

## 25 · Capability detection

CSS:
```
CSS.supports('animation-timeline: scroll()')
```

No basta:
sintaxis soportada puede no implicar comportamiento perfecto.

QA por browser.

## 26 · Performance

Medir:
- scroll latency;
- dropped frames;
- layout;
- paint;
- compositor;
- INP no aplica directamente al scroll continuo de la misma forma, pero interacción general sí.

No optimizar solo “60fps” si el scroll se siente pesado.

## 27 · Testing

### capability absent
static fallback.

### reduced motion
no motion.

### reverse scroll
progress reversible.

### keyboard/PageDown
same semantics.

### touch momentum
no jank.

### dynamic content
timeline correct.

### zoom
no clipping.

### bfcache
restored state correct.

## 28 · Anti-patterns

### window.onscroll everything
trabajo por evento.

### parallax by default
sensorialmente costoso.

### JS thresholds as fake timeline
complejidad innecesaria.

### hidden content until scroll
accessibility/content failure.

### no reduced motion
incompatible con Iris Green.

## 29 · Adoption gate

```
MOTION HAS PURPOSE
+ CONTENT WORKS STATIC
+ REDUCED MOTION
+ CAPABILITY FALLBACK
+ NO LAYOUT THRASH
+ INPUT MODES
+ PERF TEST
+ SENSORY QA
```

## 30 · Estado R44

Estudiado:
- Scroll-driven Animations;
- ScrollTimeline;
- ViewTimeline;
- CSS timeline syntax;
- fallback;
- rAF batching;
- sensory/accessibility concerns.

Práctica:
- progress mapping PASS.

Auditoría:
- A5 sin scroll-driven runtime actual.

Marcador:
`MOTOR_SCROLL_DRIVEN_RUNTIME_STUDIED_R44`

No:
- scroll animation feature;
- parallax;
- build;
- merge;
- deploy;
- main/production.
