# MOTOR · A5 · ESTUDIO/LAB R54 · CANVAS 2D STATE, READBACK Y CONTEXT ATTRIBUTES

Fecha: 01/10/2026
Amplía: R21/R24/R43/R53
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Objetivo

Profundizar en Canvas 2D como motor:
- state stack;
- context attributes;
- readback;
- reset;
- Path2D;
- ownership/performance implications.

## 2 · Fuentes

- HTML Living Standard · canvas
  https://html.spec.whatwg.org/multipage/canvas.html
- MDN · HTMLCanvasElement.getContext()
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
- MDN · CanvasRenderingContext2D
  https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
- MDN · reset()
  https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/reset
- MDN · Path2D
  https://developer.mozilla.org/en-US/docs/Web/API/Path2D

## 3 · Regla principal

Canvas 2D puede estar optimizado para:
- drawing frecuente;
o
- readback frecuente.

No pedir ambos modelos como si fueran gratuitos.

La especificación indica que `willReadFrequently:true` marca el contexto para optimización de readback y puede favorecer canvas software.

## 4 · willReadFrequently

Uso apropiado:
- `getImageData()` frecuente;
- análisis de pixels;
- editor que lee backing store reiteradamente.

No usar por defecto en:
- pintura;
- preview;
- grids;
- animations;

si casi nunca hay readback.

## 5 · Auditoría A5

Archivos:
- `assets/ig-taller-r43-advanced.js`;
- `assets/ig-taller-r42-direct.js`;
- `assets/workers/ig-taller-r42-worker.js`;
- `tools/escenas-3d/src/common.js`.

Observado:
- muchos `getContext('2d')`;
- **0** `willReadFrequently`;
- **0** `getImageData()` en Taller R42/R43;
- `common.js` usa `getImageData/putImageData` puntualmente para generar textura.

Conclusión:
**no existe razón observada para activar willReadFrequently globalmente.**

## 6 · Context attributes se fijan al crear

HTMLCanvasElement devuelve el mismo contexto para el mismo mode.

Práctica Chromium:

```js
const a1 = a.getContext('2d');
const a2 = a.getContext('2d', {
  willReadFrequently:true,
  alpha:false
});
```

Resultado:
`a1 === a2` → true.

Attributes antes/después:
- alpha true;
- willReadFrequently false.

La segunda llamada NO reconfiguró el contexto.

Regla:
**elegir attributes antes de la primera adquisición del contexto.**

## 7 · Lab · context attributes

Canvas B:

```js
getContext('2d',{
  willReadFrequently:true,
  alpha:false,
  colorSpace:'srgb'
})
```

Chromium reportó:

```json
{
  "alpha": false,
  "colorSpace": "srgb",
  "colorType": "unorm8",
  "desynchronized": false,
  "willReadFrequently": true
}
```

PASS.

## 8 · alpha:false

Indica que backing store es opaco.

Puede ayudar cuando canvas siempre es opaco.

Pero cambia semántica:
transparent black no existe como output final del buffer.

Práctica:
después de reset, pixel:
`[0,0,0,255]`.

No:
`[0,0,0,0]`.

Regla:
no usar alpha:false si transparencia es parte del diseño/export.

## 9 · reset()

MDN:
widely available desde diciembre 2023.

`ctx.reset()` limpia:
- backing buffer;
- drawing state stack;
- current path;
- styles;
- transforms;
- clipping;
- compositing;
- shadows;
- smoothing/filter state.

Práctica:
antes:
`globalAlpha = 0.25`.

Después de reset:
`globalAlpha = 1`.

PASS.

## 10 · reset vs clearRect

`clearRect()`:
limpia pixels.

NO restaura:
- transform;
- globalAlpha;
- composite op;
- clip;
- styles;
- line dash;
- text state.

`reset()`:
restaura contexto entero.

No intercambiarlos.

## 11 · alpha:false + reset

En contexto opaco:
reset limpia a opaque black según resultado de laboratorio.

Si UI esperaba transparencia:
esto sería incorrecto.

Test debe incluir background semantics.

## 12 · save()/restore()

Canvas state stack permite aislar cambios:

```js
ctx.save();
ctx.translate(...);
ctx.globalAlpha=.5;
draw();
ctx.restore();
```

Regla:
toda función que altera estado temporal debe:
- save/restore;
o
- restablecer explícitamente.

Evitar “state leak” entre render passes.

## 13 · State leak

Bug típico:

```
drawOverlay() sets globalAlpha=.2
drawMain() assumes 1
```

Resultado:
main queda translúcido.

No es data bug:
es hidden render state.

Motor debe tratar drawing context como stateful object.

## 14 · resetTransform

Cuando solo transform debe limpiarse:
`resetTransform()`.

No usar reset() si queremos conservar:
- styles;
- buffer;
- clipping? (reset también borra clip/state).

Elegir alcance mínimo.

## 15 · Path2D

MDN:
Baseline/widely available desde 2016.

Permite:
- construir geometría una vez;
- stroke/fill repetidamente;
- compartir path;
- Path2D en Worker.

Candidato:
formas estáticas repetidas.

No:
crear miles de Path2D por frame sin medir.

## 16 · Path2D lab

Chromium:
`typeof Path2D === 'function'`.

PASS.

No es cross-browser lab;
R53 labels apply.

## 17 · globalCompositeOperation

Controla cómo source se compone con destination.

Casos:
- source-over;
- destination-out;
- multiply;
- screen;
- copy;
etc.

Debe restablecerse después de un pass.

Para borrador:
`destination-out`
puede ser mejor que limpiar todo.

Pero export/color semantics deben probarse.

## 18 · globalAlpha

Afecta shapes/images antes de compositing.

No modificar pixel alpha en datos si basta state global.

Pero:
state leak risk.

## 19 · getImageData()

Widely available.

Readback:
- es síncrono desde perspectiva de API;
- puede obligar a transfer/flush del backing store;
- puede ser costoso en canvas acelerado.

No llamar:
cada pointermove/frame
sin necesidad.

## 20 · willReadFrequently tradeoff

Spec:
si true, browser sabe que habrá readback frecuente y puede elegir software canvas.

Eso puede:
- mejorar reads;
- empeorar accelerated drawing.

No existe “true = performance”.

Existe:
**workload-specific optimization**.

## 21 · putImageData()

Pinta pixels directamente.

Importante:
no sigue la current transform de Canvas como drawing normal.

No mezclar mentalmente con drawImage.

Para dirty rectangles:
puede limitar actualización.

## 22 · getImageData transforms

getImageData coordinates no siguen transform matrix.

R21 coordinate model:
distinguir canvas backing coordinates de transformed world.

## 23 · Path caching

Cache key necesita:
- geometry;
- scale semantics;
- stroke width when baked;
- version.

No cachear path que depende de mutable state sin invalidation.

R22 invalidation.

## 24 · Clipping

Clip queda en drawing state y stack.

No existe “unclip” simple:
restore/reset.

Por eso:
clip temporary → save/clip/draw/restore.

## 25 · Context loss 2D

CanvasRenderingContext2D expone `isContextLost()` en plataformas modernas.

No asumir 2D context jamás se pierde.

Pero:
WebGL context-loss lab no se extrapola a 2D.

Solo estudiar/testear si una feature crítica lo requiere.

## 26 · desynchronized

Context option:
hint para reducir latency desincronizando canvas paint cycle.

No garantía.

Puede cambiar:
- tearing;
- visual consistency;
- browser behavior.

No usar para “low latency” sin measured need.

## 27 · colorSpace / colorType

Current HTML/MDN:
- colorSpace: srgb/display-p3;
- colorType: unorm8/float16 en implementations/spec.

R26 color management aplica.

No activar display-p3/float16:
- si assets/UI trabajan sRGB;
- sin pipeline/color QA;
- por marketing.

## 28 · getContextAttributes()

Permite verificar atributos reales.

Útil en QA:
no asumir browser honró hint.

Lab mostró:
- default context: willReadFrequently false;
- configured context: true.

## 29 · Lab completo

Chromium 144.0.7559.96.

Resultados:

```json
{
  "sameContext": true,
  "attrsDefault": {
    "alpha": true,
    "colorSpace": "srgb",
    "colorType": "unorm8",
    "desynchronized": false,
    "willReadFrequently": false
  },
  "attrsReadback": {
    "alpha": false,
    "colorSpace": "srgb",
    "colorType": "unorm8",
    "desynchronized": false,
    "willReadFrequently": true
  },
  "beforePixel": [64,0,0,255],
  "afterResetPixel": [0,0,0,255],
  "globalAlphaAfter": 1,
  "hasReset": true,
  "path2D": true
}
```

## 30 · Evidence label

`CHROMIUM_LAB_PASS`.

No:
`ENGINE_MATRIX_PASS`.

## 31 · Adoption gate

Before context tuning:

```
WORKLOAD PROFILED
+ DRAW/READBACK RATIO
+ ALPHA SEMANTICS
+ COLOR PIPELINE
+ CONTEXT ATTRS FIRST
+ RESET/STATE CONTRACT
+ CROSS-BROWSER FALLBACK
```

## 32 · Marcador

`MOTOR_CANVAS2D_STATE_READBACK_LAB_PASS_R54`

## 33 · Límites

No:
- context attribute change product;
- willReadFrequently product;
- color-space change;
- build;
- merge;
- deploy;
- main/production.
