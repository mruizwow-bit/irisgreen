# MOTOR · A5 · ESTUDIO PROFUNDO R43 · IMAGE DECODE, BITMAP OWNERSHIP Y ASSET PIPELINES

Fecha: 01/10/2026
Amplía: R01–R42
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Regla principal

“Imagen descargada” no significa:
- decodificada;
- lista para pintar sin pausa;
- barata en memoria.

Motor debe separar:

```
FETCH / RESOURCE LOAD
→ DECODE
→ BITMAP / GPU RESOURCE
→ DRAW / UPLOAD
→ OWNERSHIP
→ CLOSE / RELEASE
```

## 2 · HTMLImageElement.decode()

Fuente:
- MDN · HTMLImageElement.decode()
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decode

Baseline / widely available.

Devuelve Promise que se resuelve cuando la imagen está decodificada y lista para usarse.

Ventaja:
evita que el siguiente paint tenga que bloquearse para decodificar una imagen recién insertada.

Puede rechazar con `EncodingError` si:
- request falla;
- src cambia durante decode;
- datos están corruptos.

## 3 · decoding attribute/property

Fuente:
- MDN · HTMLImageElement.decoding
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decoding

Valores:
- sync;
- async;
- auto.

Es un **hint** al navegador.

No reemplaza:
`await img.decode()`
cuando el código necesita una barrera explícita de decode.

## 4 · createImageBitmap()

Fuente:
- MDN · Window.createImageBitmap()
  https://developer.mozilla.org/en-US/docs/Web/API/Window/createImageBitmap

Baseline / widely available.

Puede crear bitmap desde:
- img;
- SVG image;
- video;
- canvas;
- blob;
- ImageData;
- ImageBitmap;
- OffscreenCanvas;
- VideoFrame según contexto.

Promise-based.

Útil:
- preparar imagen para Canvas/WebGL;
- crop;
- resize;
- worker pipelines.

## 5 · Worker createImageBitmap()

Fuente:
- MDN · WorkerGlobalScope.createImageBitmap()
  https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/createImageBitmap

Permite decode/preparación de bitmap fuera de la ventana principal en escenarios compatibles.

No significa “decode gratis”:
sigue consumiendo CPU/memoria.

Pero puede proteger responsiveness del main thread.

## 6 · ImageBitmap lifecycle

Fuente:
- MDN · ImageBitmap
  https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap
- MDN · ImageBitmap.close()
  https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap/close

ImageBitmap representa recurso gráfico.

Es:
- transferable;
- explícitamente disposable mediante `close()`.

Regla:
**owner que ya no necesita bitmap debe consumirlo o cerrarlo.**

No esperar al GC.

## 7 · transferFromImageBitmap()

Fuente:
- MDN · ImageBitmapRenderingContext.transferFromImageBitmap()
  https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmapRenderingContext/transferFromImageBitmap

Transfiere ownership al canvas/contexto.

Después:
el bitmap queda consumido como recurso transferido.

Diferencia importante:

### drawImage(bitmap)
NO consume ownership.
→ close manual al terminar.

### transferFromImageBitmap(bitmap)
transfiere/consume ownership.

Motor documenta cuál ocurre.

## 8 · transferToImageBitmap()

Fuente:
- MDN · OffscreenCanvas.transferToImageBitmap()
  https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/transferToImageBitmap

Genera un ImageBitmap del último buffer renderizado.

Puede crear recursos gráficos grandes repetidamente.

Regla:
no producir bitmaps a mayor ritmo del consumidor.

Mismo problema de backpressure R09/R28.

## 9 · Decoded size

Tamaño de archivo comprimido ≠ memoria decodificada.

Aproximación RGBA8:

```
width × height × 4 bytes
```

Ejemplo:
4096 × 4096 × 4 =
67,108,864 bytes
≈ **64 MiB**
para un solo buffer bruto.

Eso no incluye necesariamente:
- copias;
- mipmaps;
- GPU padding;
- browser overhead.

## 10 · Práctica de memoria

Modelo aislado:

### Imagen 4096×4096 RGBA8
≈ 64 MiB.

### 10 previews 1024×1024 RGBA8
cada una ≈ 4 MiB.
10 ≈ **40 MiB**.

Aprendizaje:
un asset comprimido de pocos MB puede multiplicarse mucho después de decode.

No es medición de memoria del navegador.
Es presupuesto mínimo teórico de pixels.

## 11 · Responsive images

Para DOM content:
usar:
- width/height;
- srcset;
- sizes;
- formatos adecuados.

No cargar 4K si se muestra a 300 px sin necesidad de zoom/processing.

Motor coordina con Atlas/Vector/Prisma según asset/release/UI.

## 12 · Intrinsic dimensions

Definir width/height/aspect ratio reduce layout shifts.

Para Canvas:
conocer dimensiones antes del draw evita geometría improvisada.

No usar `naturalWidth` antes de que metadata/resource esté disponible sin fallback.

## 13 · Decode failure

Decode error:
- no debe dejar spinner eterno;
- no retry infinito;
- fallback visual/textual;
- resource state claro.

Distinguir:
- network fail;
- unsupported format;
- corrupt image;
- decode aborted/src changed.

## 14 · Source revision

Caso:
- start decode A;
- user selects B;
- A termina tarde.

Patrón R02:
revision/ticket.

A no puede sustituir B.

Si operación puede abortarse:
abortar cuando sea posible.

`decode()` en sí no expone AbortSignal;
se controla lifecycle del image/source y ownership del resultado.

## 15 · Object URL images

Si Blob → object URL → image:
revoke solo cuando ya no se necesita la URL.

Si decode no ha terminado:
revocar demasiado pronto puede fallar.

Contrato:
```
create URL
set src
decode
use
cleanup element/resource
revoke URL
```

## 16 · Cross-origin images

Canvas puede quedar tainted si dibuja recursos cross-origin sin CORS adecuado.

Consecuencia:
operaciones de lectura/export:
- getImageData;
- toBlob/toDataURL;
pueden bloquearse.

No “arreglar” con proxy improvisado.

Atlas/Vector/Lex según origen/licencia/infraestructura.

## 17 · createImageBitmap options

Opciones pueden incluir:
- imageOrientation;
- premultiplyAlpha;
- colorSpaceConversion;
- resizeWidth/Height;
- resizeQuality.

No cambiarlas por reflejo.

Especialmente color:
R26 cubre color pipeline.
Mantener contrato coherente.

## 18 · Crop

createImageBitmap puede crop/resize durante preparación.

Puede evitar:
- bitmap completo intermedio en lógica propia;
- draw+copy adicional.

Pero medir beneficio real.

## 19 · Sprite sheets

Sprite sheet:
- reduce número de requests;
- puede aumentar memoria si se decodifica un atlas enorme.

No asumir:
menos HTTP = mejor runtime.

Con HTTP moderno:
muchos assets pequeños pueden ser razonables.

Elegir por:
- cache;
- memory;
- update granularity;
- decode.

## 20 · Lazy decode

No decodificar todas las escenas/previews al cargar.

Preferir:
- visibility/intent;
- preload budget;
- bounded cache.

R19 cubre lazy resource scheduling.
R43 añade decode/memory layer.

## 21 · Cache de bitmaps

Si cachea ImageBitmap:
definir:
- max entries/bytes;
- LRU/eviction;
- close on eviction;
- version/source key;
- component teardown.

No cache infinita.

## 22 · Current A5 audit

### `assets/workers/ig-taller-r42-worker.js`
- `OffscreenCanvas.transferToImageBitmap()`;
- bitmap se transfiere por postMessage.

### `assets/ig-taller-r42-platform.js`
- recibe bitmap;
- `drawImage(bitmap,...)`;
- llama `bitmap.close()` si existe.

Patrón positivo:
**drawImage no consume; receiver cierra después.**

No se encontraron usos actuales de:
- `HTMLImageElement.decode()`;
- `createImageBitmap()`
en los archivos auditados.

## 23 · ImageBitmapRenderingContext

Contexto:
`bitmaprenderer`.

Puede presentar ImageBitmap con transferencia de ownership.

Útil:
pipelines de frame/worker específicos.

No sustituye Canvas2D si se necesita composición compleja.

## 24 · Frame pipelines

Relacionar R30:
- VideoFrame;
- ImageBitmap;
- Canvas;
- WebGL.

Cada conversión puede:
- copiar;
- transferir;
- retener recursos.

Documentar pipeline completo, no solo API individual.

## 25 · Backpressure

Worker produce previews 60/s.
Main consume 10/s.

Sin límite:
bitmaps pueden acumularse.

Políticas:
- latest preview wins;
- close discarded bitmaps;
- credit/window;
- lower production rate.

Nunca dejar bitmaps descartados sin close.

## 26 · Loading UI

Mientras decode:
- skeleton/placeholder estable;
- no layout jump;
- no bloquear botones no relacionados.

Si imagen es decoración:
no anunciar “cargando” innecesariamente.

Si es contenido esencial:
texto/alt/equivalente.

## 27 · Accessibility

Canvas/image runtime no sustituye:
- alt;
- semantic content;
- captions/descriptions según contenido.

Motor gestiona lifecycle técnico.
Atlas/Axioma/Croma pueden aportar asset/semantics/design.

## 28 · Performance tests

### Cold
resource + decode.

### Warm cache
decode may still matter.

### Many images
memory/GC.

### Repeated scene switch
resource release.

### Slow CPU
decode latency.

### corrupt input
error state.

## 29 · Adoption gate

```
RIGHT RESOLUTION
+ DECODE CONTRACT
+ ASYNC OWNERSHIP
+ BOUNDED CACHE
+ CLOSE/TRANSFER
+ ERROR FALLBACK
+ ACCESSIBLE EQUIVALENT
+ MEMORY BUDGET
```

## 30 · Estado R43

Estudiado:
- HTMLImageElement.decode;
- decoding hint;
- createImageBitmap;
- Worker image decode path;
- ImageBitmap lifecycle;
- bitmaprenderer ownership;
- decoded memory budgets;
- tainted canvas boundary;
- cache/backpressure.

Práctica:
- 4096² RGBA8 ≈ 64 MiB;
- 10×1024² RGBA8 ≈ 40 MiB.

Auditoría:
- current Worker preview ownership pattern revisado y positivo.

Marcador:
`MOTOR_IMAGE_DECODE_BITMAP_OWNERSHIP_STUDIED_R43`

No:
- image pipeline change;
- asset format change;
- preload;
- build;
- merge;
- deploy;
- main/production.
