# MOTOR · A5 · ESTUDIO PROFUNDO R41 · CANVAS TEXT, FONT LOADING Y MÉTRICAS

Fecha: 01/10/2026
Amplía: R01–R40
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Regla principal

Texto dibujado en Canvas depende de la fuente realmente disponible.

Si Motor:
1. configura una font web;
2. mide texto antes de que cargue;
3. fija layout/hitboxes;
4. la fuente real llega después;

las métricas pueden cambiar.

Regla:
**font selection/loading forma parte del estado de render.**

## 2 · CSS Font Loading API

Fuentes:
- MDN · CSS Font Loading API
  https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API
- MDN · FontFaceSet
  https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet
- W3C · CSS Font Loading Module Level 3
  https://drafts.csswg.org/css-font-loading/

Estado:
CSS Font Loading API = widely available / Baseline desde 2020 en navegadores modernos.

También disponible en Workers en varias piezas.

## 3 · document.fonts

Fuente:
- MDN · Document.fonts
  https://developer.mozilla.org/en-US/docs/Web/API/Document/fonts

Devuelve FontFaceSet del documento.

Permite:
- consultar;
- esperar;
- cargar;
- reaccionar a loading/loadingdone/loadingerror.

No esperar todas las fuentes del sitio si solo se necesita una concreta.

## 4 · FontFaceSet.ready

Fuente:
- MDN · FontFaceSet.ready
  https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/ready

Promise se resuelve cuando:
- las fuentes usadas han terminado de cargar;
- layout pendiente asociado ha finalizado;
- no quedan font loads requeridos por el documento.

Útil:
cuando Canvas depende de geometría final de texto.

No usar:
como bloqueo global de toda interacción si el canvas puede funcionar provisionalmente.

## 5 · FontFaceSet.load()

Fuente:
- MDN · FontFaceSet.load()
  https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/load

Permite solicitar una fuente concreta:

```js
await document.fonts.load("16px MyFont", text)
```

Puede incluir texto para limitar font faces por unicode-range.

No comprueba cobertura exacta de cada glyph.

Regla:
para Canvas:
preferir esperar la font concreta necesaria en vez de todas las fonts del documento.

## 6 · FontFace.status

Estados:
- unloaded;
- loading;
- loaded;
- error/failed según interfaz/documentación.

Motor debe tratar fallo de font como degradación:
- fallback legible;
- layout recalculado;
- no canvas vacío.

## 7 · Fallback-first vs font-blocking

### Fallback-first
render provisional con sistema/fallback.

Cuando carga fuente:
re-medida + redraw.

Ventaja:
respuesta inmediata.

Riesgo:
cambio visual.

### Font-first
esperar font antes de render específico.

Ventaja:
geometría estable.

Riesgo:
latencia/blank.

Elegir según tarea.

No bloquear una herramienta completa solo por tipografía decorativa.

## 8 · CanvasRenderingContext2D.measureText()

Fuente:
- MDN · measureText()
  https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/measureText

Widely available.

Devuelve `TextMetrics`.

`width`:
advance width del texto según font actual.

No equivale necesariamente a bounding box visual.

## 9 · TextMetrics

Fuente:
- MDN · TextMetrics
  https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics

Métricas:
- width;
- actualBoundingBoxLeft/Right;
- actualBoundingBoxAscent/Descent;
- fontBoundingBoxAscent/Descent;
- baselines.

Muchas propiedades modernas están ampliamente disponibles; algunas llegaron después que width.

Feature detect propiedades si compatibilidad objetivo lo exige.

## 10 · Advance width vs ink bounds

Texto italic/overhang puede dibujar fuera del advance width.

Para clipping/hitbox visual:
```
actualBoundingBoxLeft + actualBoundingBoxRight
```
puede representar mejor extensión de tinta que `width`.

No usar width como “rectángulo exacto” universal.

## 11 · Vertical metrics

Para centrar:
no hardcodear:
`fontSize * 0.8`.

Usar cuando exista:
- actualBoundingBoxAscent;
- actualBoundingBoxDescent;
- fontBoundingBox*;
- baseline correcta.

Scripts distintos:
- Latin;
- Arabic;
- Devanagari;
- CJK;
- emoji

pueden tener geometrías diferentes.

## 12 · textBaseline

Valores:
- top;
- hanging;
- middle;
- alphabetic;
- ideographic;
- bottom.

No usar alphabetic universal si el diseño mezcla scripts.

## 13 · direction

Canvas context admite:
- ltr;
- rtl;
- inherit.

Iris Green ya tiene ES/EN.
Si aparecen lenguas RTL:
Canvas debe respetar dirección real, no solo traducir strings.

R15 ya cubrió bidi/Unicode a nivel runtime.
R41 aplica esa regla a Canvas text.

## 14 · Grapheme ≠ width char-by-char

No medir/splitear por:
`text[i]`
para layout humano.

Unicode graphemes pueden incluir:
- combining marks;
- emoji sequences;
- ZWJ.

Para segmentación:
Intl.Segmenter cuando aplique.

No posicionar cada code unit manualmente salvo motor tipográfico real.

## 15 · Line wrapping

Canvas no hace layout de párrafos por nosotros.

Motor debe definir:
- max width;
- line breaking;
- whitespace;
- locale;
- hyphenation si se necesita.

Para contenido normal:
DOM/CSS es mejor.

Canvas text:
solo cuando forma parte de una superficie gráfica/interactiva.

## 16 · Font failure

Si font web falla:
- fallback;
- redraw;
- no infinite retry;
- no layout NaN.

No considerar loadingerror una catástrofe si la función sigue siendo usable.

## 17 · Font-display

CSS `font-display` influye en cómo texto DOM usa fallback/swap.

Canvas controla su propio timing de draw.

No asumir que font-display por sí solo resuelve métricas Canvas.

## 18 · Worker fonts

CSS Font Loading API y TextMetrics tienen soporte en worker en partes relevantes.

OffscreenCanvas puede dibujar texto en Worker.

Pero:
- font debe estar disponible en ese context;
- load/FontFace ownership debe diseñarse;
- fallback sigue necesario.

No mover typography a Worker solo por poder.

## 19 · textRendering

Fuente:
- MDN · CanvasRenderingContext2D.textRendering
  https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/textRendering

Estado 01/10/2026:
**Limited availability / no Baseline**.

Es un hint:
- auto;
- optimizeSpeed;
- optimizeLegibility;
- geometricPrecision.

No depender funcionalmente de él.

## 20 · Font metrics cache

Medir texto repetidamente tiene coste.

Puede cachearse:
```
key = font + text + direction + letterSpacing? + language context
```

Pero invalidar cuando:
- font load cambia;
- font settings cambian;
- zoom/DPR no siempre afectan CSS-pixel metrics igual;
- locale/text cambia.

No cache global sin lifecycle.

## 21 · Font load invalidation

Patrón:

```
renderFallback()
await document.fonts.load(fontSpec, relevantText)
if (revision still current):
  remeasure()
  redraw()
```

Mismo patrón de ownership asíncrono:
si componente se destruyó o cambió texto,
font load vieja no debe redibujar state nuevo.

## 22 · Hit testing

Si un botón/celda Canvas depende de text width:
recalcular después de font load.

No:
medir con fallback y dejar hitbox vieja alrededor de texto nuevo.

Mejor:
control DOM real si es UI.

## 23 · Accessibility

Texto Canvas no forma parte automáticamente del accessibility tree.

Para texto significativo:
- equivalente DOM;
- accessible name/description;
- no depender solo de pixel text.

R41 no cambia esa regla.

## 24 · Práctica aislada de métricas

Práctica tipográfica fuera del navegador.
Misma cadena:

`Iris Green WWW iii 123`

Tamaño:
48 px.

Fuente A, monoespaciada:
- longitud aproximada: **635.94 px**
- bbox width: **636 px**

Fuente B:
- longitud aproximada: **509.38 px**
- bbox width: **509 px**

Diferencia:
**126.56 px (~19.9 %)**.

Qué demuestra:
la elección de fuente puede cambiar materialmente geometría/hitbox.

Qué NO demuestra:
- timing real de browser;
- FontFaceSet behavior concreto;
- layout de Iris Green.

Ese comportamiento se apoya en especificación/documentación y requerirá QA de navegador si se implementa Canvas text dependiente de font web.

## 25 · Current A5 audit

Archivos auditados:
- `assets/ig-taller-r43-advanced.js`;
- `assets/workers/ig-taller-r42-worker.js`;
- `tools/escenas-3d/src/common.js`.

No se encontraron usos actuales de:
- `fillText()`;
- `measureText()`;
- `document.fonts`;
- `FontFace`.

Conclusión:
no existe deuda actual de Canvas typography en A5.

Bloque preventivo para futuras herramientas.

## 26 · Testing

### Font slow
fallback visible + later redraw.

### Font fail
fallback stays usable.

### Text changes during load
old load no stale redraw.

### RTL
alignment/direction.

### CJK/emoji
bounds not clipped.

### Zoom/DPR
canvas remains sharp and geometry correct.

### Worker
font unavailable/error fallback.

## 27 · Adoption gate

Canvas text avanzado solo si:

```
CANVAS IS THE RIGHT SURFACE
+ FONT LOAD CONTRACT
+ FALLBACK
+ REMEASURE
+ UNICODE/BIDI
+ ACCESSIBLE EQUIVALENT
+ FAILURE TEST
```

Para texto documental:
preferir DOM/CSS.

## 28 · Estado R41

Estudiado:
- CSS Font Loading API;
- FontFaceSet;
- document.fonts;
- measureText;
- TextMetrics;
- baselines;
- font failure;
- worker font loading;
- textRendering limits.

Práctica:
- dos fuentes, misma cadena, ~19.9 % de diferencia de anchura.

Auditoría:
- A5 sin Canvas text actual.

Marcador:
`MOTOR_CANVAS_TEXT_FONT_LOADING_STUDIED_R41`

No:
- fuente nueva;
- Canvas text feature;
- font preload;
- build;
- merge;
- deploy;
- main/production.
