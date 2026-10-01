# MOTOR · A5 · ESTUDIO PROFUNDO R30 · MEDIA CAPABILITIES, DECODING Y FRAME PIPELINES

Fecha: 01/10/2026
Amplía: R01–R29
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Regla principal

“Este formato se reproduce” no basta.

Motor debe distinguir:
- supported;
- smooth;
- power efficient;
- queue pressure;
- memory lifetime;
- frame ownership;
- fallback.

## 2 · Media Capabilities API

Fuentes:
- MDN · MediaCapabilities
  https://developer.mozilla.org/en-US/docs/Web/API/MediaCapabilities
- MDN · decodingInfo()
  https://developer.mozilla.org/en-US/docs/Web/API/MediaCapabilities/decodingInfo
- MDN · encodingInfo()
  https://developer.mozilla.org/en-US/docs/Web/API/MediaCapabilities/encodingInfo

`decodingInfo()` devuelve:
- `supported`;
- `smooth`;
- `powerEfficient`.

`encodingInfo()` expone la misma clase de señales para encode.

Regla:
**canPlayType ≠ experiencia real.**

Para escenas largas:
elegir codec/resolution/bitrate por capacidad real cuando aporte.

## 3 · Decision ladder de playback

Para reproducción normal:

```
HTMLMediaElement
→ source/codec alternatives
→ MediaCapabilities-informed choice
→ only then lower-level pipeline if needed
```

No saltar a WebCodecs para reproducir un vídeo corriente.

## 4 · HTMLMediaElement sigue siendo baseline de playback

Ventajas:
- buffering;
- A/V sync;
- controls/native semantics;
- power optimizations;
- hardware decode;
- captions/tracks;
- lifecycle maduro.

WebCodecs no sustituye esta capa para uso normal.

## 5 · WebCodecs

Fuente:
- MDN · WebCodecs API
  https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API

Adecuado para:
- edición;
- frame processing;
- streaming custom;
- encode/decode pipeline control;
- transforms de media.

No:
- playback común sin necesidad de frame-level control.

## 6 · Config support

Fuentes:
- MDN · VideoDecoder.isConfigSupported()
  https://developer.mozilla.org/en-US/docs/Web/API/VideoDecoder/isConfigSupported_static
- MDN · VideoEncoder.isConfigSupported()
  https://developer.mozilla.org/en-US/docs/Web/API/VideoEncoder/isConfigSupported_static

Estado 01/10/2026:
**Limited availability / no Baseline**.

Consecuencia:
WebCodecs no puede ser único camino público de Iris Green sin fallback.

## 7 · VideoFrame ownership

Fuentes:
- MDN · VideoFrame
  https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame
- MDN · VideoFrame.close()
  https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame/close
- MDN · VideoFrame.clone()
  https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame/clone

`VideoFrame` puede retener un recurso de media grande.

Regla:
**close as soon as ownership ends.**

`clone()` crea otra referencia al mismo recurso subyacente.

No confundir:
clone ≠ deep pixel copy.

## 8 · Frame leak severity

MDN advierte que mantener menos de ~100 VideoFrames activos puede bastar para agotar memoria en algunos escenarios.

Por tanto:
- no guardar frames indefinidamente;
- ring buffer pequeño;
- close en finally;
- drop cuando consumidor va atrasado.

## 9 · Encoder/decoder queues

VideoEncoder:
- `encodeQueueSize`;
- `dequeue`.

VideoDecoder:
- `decodeQueueSize`;
- `dequeue`.

Regla:
**queue size es presión del pipeline.**

Si productor > encoder:
- no seguir encolando;
- drop/coalesce/frame skip según tarea;
- esperar dequeue/backpressure lógico.

## 10 · Política de drop

Playback:
preferir continuidad temporal.

Processing:
puede saltar frames si análisis no necesita todos.

Export:
no se pueden perder frames silenciosamente.

Live preview:
latest-wins puede ser correcto.

La política se define por producto.

## 11 · reset / flush / close

### flush
esperar trabajo pendiente.

### reset
descartar pending y volver a estado limpio/configurable.

### close
terminar y liberar recursos.

No usar flush como cancel.

## 12 · requestVideoFrameCallback

Fuente:
- MDN · requestVideoFrameCallback()
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback

Para overlays/analysis:
seguir frame real de media.

Metadata:
puede incluir dimensiones, mediaTime, expectedDisplayTime, etc.

No garantiza sincronización sample-perfect.

## 13 · createImageBitmap / transfer

Para procesar frames:
- ImageBitmap puede transferirse;
- evita copias adicionales en algunos pipelines;
- debe cerrarse si el recurso lo permite.

Ownership explícito.

## 14 · MediaCapabilities y energía

`powerEfficient=false` puede indicar camino costoso.

No degradar automáticamente sin UX:
- quizá la calidad es esencial;
- quizá conviene ofrecer variante;
- quizá el dispositivo sigue sobrado.

Usar como señal, no como dogma.

## 15 · Battery / thermal

No existe una API universal fiable para “temperatura” web.

Motor infiere coste por:
- frame time;
- dropped frames;
- long sessions;
- decodingInfo;
- user-visible degradation.

No fingerprinting agresivo.

## 16 · Rincón · aplicación profesional

Para escena audiovisual larga:
1. definir formatos;
2. query MediaCapabilities si aporta;
3. seleccionar source;
4. user action para play/audio;
5. monitorizar playback state;
6. fallback si decode falla;
7. mantener stop/mute/fullscreen operables;
8. HUMAN QA sensorial real.

## 17 · Frame processing pipeline

```
demux/source
→ decode queue
→ VideoFrame
→ transform
→ render/encode
→ close frame
```

Cada frontera necesita:
- queue limit;
- ownership;
- cancel;
- error;
- cleanup.

## 18 · Backpressure

Si:
decode 60 fps
transform 20 fps

sin política:
queue crece.

Opciones:
- lower decode rate;
- drop frames;
- skip transform;
- batch;
- reduce resolution;
- stop pipeline.

## 19 · Resize/reconfigure

Cambiar resolución/codec:
- puede exigir decoder/encoder reconfigure;
- pending frames deben tratarse;
- no mezclar frames de config vieja/nueva sin version ID.

Patrón:
`configRevision`.

## 20 · Error taxonomy

Distinguir:
- unsupported config;
- decode error;
- corrupt input;
- queue overload;
- user cancel;
- lifecycle stop;
- resource exhaustion.

No enseñar el mismo “error de vídeo” para todo.

## 21 · Práctica conceptual · queue pressure

Caso:
- producer 60 fps;
- encoder 10 fps;
- 5 s.

Sin control:
~250 frames pendientes potenciales.

Con:
`if encodeQueueSize > threshold → drop preview frame`

la memoria queda acotada.

Para export final:
no drop; se regula productor.

## 22 · Práctica conceptual · frame ownership

```
frame = decoded
try:
  process(frame)
finally:
  frame.close()
```

Si se transfiere:
el owner cambia.

Si se clona:
cada clone debe cerrarse.

## 23 · Testing

### Capability
- MediaCapabilities absent;
- WebCodecs absent;
- codec unsupported.

### Pressure
- slow transform;
- encoder queue growth.

### Memory
- repeated 10 min playback/processing;
- verify frames closed.

### Lifecycle
- stop;
- hidden;
- restore;
- source switch.

### Performance
- smooth;
- dropped frames;
- powerEfficiency signal.

## 24 · Boundary

Lumen/Eco:
contenido/media/audio perceptivo.

Motor:
pipeline, scheduling, frame ownership, backpressure.

Vector:
asset/release.

Astra:
arquitectura/gate.

## 25 · Estado R30

Estudiado:
- MediaCapabilities;
- decoding/encoding signals;
- WebCodecs support limits;
- VideoFrame lifecycle;
- encoder/decoder queues;
- frame dropping policy;
- media backpressure.

Marcador:
`MOTOR_MEDIA_CAPABILITIES_FRAME_PIPELINES_STUDIED_R30`

No:
- asset nuevo;
- codec migration;
- WebCodecs feature;
- build;
- merge;
- deploy;
- main/production.
