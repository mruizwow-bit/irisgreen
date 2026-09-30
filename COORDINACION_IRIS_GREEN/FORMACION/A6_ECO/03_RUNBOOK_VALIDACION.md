# ECO · A6 · RUNBOOK DE VALIDACIÓN DE VOZ, AUDIO Y MEDIA

Fecha: 30/09/2026

## 0 · Antes de tocar nada

Registrar:
- orden/issue;
- commit/branch/deploy exactos;
- activo o flujo exacto;
- población objetivo;
- navegador/OS/dispositivo objetivo;
- si la prueba es sintética, automatizada, real-device o humana.

No empezar por “arreglar”.

## 1 · Clasificar el fallo

Categorías:
- ASSET;
- CONTAINER/CODEC;
- DELIVERY_HTTP;
- BROWSER_CAPABILITY;
- PLAYBACK_POLICY;
- WEB_AUDIO;
- CAPTURE_PERMISSION;
- INPUT_DEVICE;
- OUTPUT_DEVICE;
- RECORDING;
- WEBRTC_NETWORK;
- SPEECH_RECOGNITION;
- TTS;
- ACCESSIBILITY;
- PRIVACY;
- HARNESS/TEST_ENVIRONMENT;
- UNKNOWN.

## 2 · Activo

Comprobar:
- existe;
- bytes > 0;
- hash;
- cabecera/signature;
- ffprobe;
- container;
- codec/profile;
- sample rate;
- channels/layout;
- duration;
- bitrate;
- metadata;
- errores de parse/demux.

Nunca confiar en extensión.

## 3 · Delivery

Capturar:
- URL final;
- redirects;
- status;
- Content-Type;
- Content-Length;
- Accept-Ranges;
- prueba Range cuando aplique;
- CORS;
- cache headers relevantes;
- tiempo de respuesta;
- errores de red.

Un 200 solo prueba entrega HTTP de una respuesta.

## 4 · Capacidad del navegador

Registrar browser **real y versión**.

Probar:
- `canPlayType()`;
- `MediaCapabilities.decodingInfo()` cuando sea aplicable;
- fuente alternativa;
- `play()`.

Si Chromium falla AAC y Chrome estable pasa, comprobar build/codec antes de atribuir bug de producto.

## 5 · Estado HTMLMediaElement

Capturar al fallo:
- `currentSrc`;
- `readyState`;
- `networkState`;
- `paused`;
- `currentTime`;
- `duration`;
- `error.code`;
- `error.message`.

Eventos:
- loadstart;
- loadedmetadata;
- loadeddata;
- canplay;
- playing;
- waiting;
- stalled;
- suspend;
- abort;
- emptied;
- error;
- ended.

## 6 · Playback policy

Si `play()` rechaza:
- capturar error;
- confirmar user activation;
- revisar autoplay audible;
- muted/unmuted;
- iframe/Permissions Policy si existe;
- visibilidad/background;
- intervención del usuario.

No implementar hacks para evitar una política sin entenderla.

## 7 · Web Audio

Registrar:
- `AudioContext.state`;
- si requiere `resume()`;
- sampleRate;
- baseLatency;
- outputLatency cuando esté disponible;
- worklet errors;
- graph/lifecycle;
- output sink si aplica.

## 8 · Captura

Antes:
- HTTPS/secure context;
- permiso;
- user gesture;
- disponibilidad.

Durante:
- settings reales de `MediaStreamTrack`;
- muted/enabled/readyState;
- device change;
- constraints aplicados;
- echo cancellation / AGC / noise suppression;
- content hint;
- indicador visible.

Privacidad:
no conservar voz ni device identifiers salvo necesidad explícita.

## 9 · Recording

Probar:
- `MediaRecorder.isTypeSupported()`;
- MIME final;
- blobs/chunks;
- tamaño;
- timestamps;
- duración;
- parse con ffprobe;
- reproducción posterior;
- stop/error;
- sesiones largas.

## 10 · WebRTC

Recoger `getStats()` y separar:
- transporte;
- audio inbound;
- audio outbound;
- playout.

Métricas:
- packetsReceived/sent;
- packetsLost;
- jitter;
- roundTripTime;
- jitterBufferDelay / emittedCount;
- concealedSamples;
- concealmentEvents;
- totalSamplesDuration;
- totalPlayoutDelay.

Correlacionar con eventos audibles, no mirar métricas aisladas.

## 11 · TTS

Separar:
1. contenido correcto;
2. voz/identidad;
3. calidad acústica;
4. prosodia;
5. pronunciación;
6. latencia;
7. streaming;
8. interrupción;
9. salida;
10. fallback.

Métricas técnicas:
- request start;
- first audio byte/chunk;
- first audible output cuando medible;
- completion;
- duration;
- chunk gaps;
- peak/loudness;
- retries/errors.

Evaluación humana:
usar escalas/guías definidas; no solo “me gusta/no me gusta”.

## 12 · STT

Registrar:
- idioma solicitado/detectado;
- input;
- transcript parcial/final;
- timings;
- confidence solo si el sistema la expone de forma útil;
- substitutions;
- deletions;
- insertions;
- entidad crítica correcta/incorrecta.

No guardar audio de usuarios reales como fixture por defecto.

## 13 · Accesibilidad

Comprobar:
- no autoplay audible inesperado;
- pausa/stop;
- volumen;
- texto alternativo/transcripción según caso;
- captions;
- teclado;
- foco;
- etiquetas/estado;
- texto como alternativa a voz;
- no forzar micrófono;
- baja estimulación.

Axioma confirma conformidad; Eco entrega evidencia técnica.

## 14 · Controles

Toda incidencia debe intentar incluir:

**Control positivo**
un formato/flujo conocido que debe funcionar.

**Control negativo**
un activo/condición deliberadamente inválido o no soportado.

Esto evita falsos diagnósticos del harness.

## 15 · Evidence pack

Mínimo:
- fecha/hora;
- branch/commit/deploy;
- OS/device;
- browser/version;
- activo/hash;
- ffprobe;
- request/response;
- reproducción/estado/error;
- consola relevante;
- screenshot/video cuando aporte;
- WebRTC stats cuando aplique;
- métricas;
- matriz PASS/FAIL/PENDING;
- limitaciones.

## 16 · Severidad orientativa

**P0**
riesgo grave / pérdida amplia de función crítica / daño de privacidad o seguridad: escalar.

**P1**
voz/audio principal inutilizable para población objetivo sin fallback adecuado.

**P2**
degradación significativa con workaround/fallback.

**P3**
calidad menor/edge case sin pérdida material.

La prioridad final se coordina con jefatura/Producto.

## 17 · Escalado

- runtime conversacional → Pulso;
- telemetría/provenance → Vigía;
- interactive lifecycle no específico de media → Motor;
- experiencia inmersiva/escena → Lumen;
- modelo/provider/voz AI → Córtex;
- standard/conformity → Axioma;
- obligación legal/privacy policy → Lex;
- integración/release → Vector;
- arquitectura/gate de producto → Astra/Nexo según circuito;
- decisión final de producto/HUMAN QA → María.

## 18 · STOP conditions

STOP y documentar cuando:
- falta source exacto;
- entorno de prueba no representa target y la conclusión depende de ello;
- no hay permiso para capturar voz;
- se necesitaría conservar audio real sin base aprobada;
- el harness está bloqueado;
- la prueba exige hardware no disponible;
- la evidencia contradice el supuesto inicial.

## Regla final

**Eco no tiene que demostrar que tenía razón. Tiene que demostrar qué ocurre.**
