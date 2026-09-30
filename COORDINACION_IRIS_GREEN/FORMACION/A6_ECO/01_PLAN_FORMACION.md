# ECO · A6 · PLAN DE FORMACIÓN PROFESIONAL

Fecha: 30/09/2026  
Estado: `R01_FOUNDATION_STUDIED_R02_ADVANCED_STUDIED_CONTINUOUS_LEARNING`

## Objetivo

Convertir a Eco en un especialista capaz de validar voz, audio y media con criterios de ingeniería, no con impresiones.

## R01 · Fundamentos obligatorios

### 1. Fundamentos de audio digital

Dominar:
- frecuencia de muestreo y Nyquist;
- sample format / bit depth;
- PCM y audio comprimido;
- mono, stereo y channel layout;
- bitrate;
- clipping;
- headroom;
- dBFS;
- loudness integrada, short-term/momentary cuando aplique;
- LUFS/LKFS;
- true peak;
- duración/timestamps;
- resampling y sus riesgos.

Herramientas:
- `ffprobe`;
- `ffmpeg`;
- analizadores reproducibles;
- hashes de activos.

### 2. Contenedores, códecs y perfiles

Diferenciar siempre:
- **contenedor**: WAV/RIFF, MP4/M4A/ISO-BMFF, Ogg, WebM/Matroska;
- **códec**: PCM, MP3, AAC, Opus, Vorbis, FLAC;
- **MIME**;
- codec string/perfil;
- disponibilidad real del decoder.

Punto experto:
Chromium y Google Chrome no son equivalentes en todos los códecs. La documentación de Chromium limita AAC propietario a Google Chrome; por tanto, un Playwright Chromium puede fallar con un AAC válido que sí reproduce Chrome estable.

### 3. HTML media

Estudiar:
- `<audio>` / `<video>`;
- múltiples `<source>`;
- `preload`, `autoplay`, `muted`, `controls`, `loop`;
- `play()` y rechazo de Promise;
- `load()`;
- `readyState`;
- `networkState`;
- `MediaError`;
- eventos `loadstart`, `loadedmetadata`, `canplay`, `playing`, `waiting`, `stalled`, `suspend`, `error`;
- selección de fuente;
- autoplay y user activation.

No usar únicamente `canPlayType()`: devuelve una estimación, no una garantía.

### 4. Media Capabilities

Estudiar `MediaCapabilities.decodingInfo()` y, cuando aplique, encoding:
- `supported`;
- `smooth`;
- `powerEfficient`.

Usarlo como señal adicional, nunca como sustituto de reproducción real.

### 5. Web Audio

Base estable:
**Web Audio API 1.0 — W3C Recommendation, 17/06/2021.**

Seguimiento:
**Web Audio API 1.1 — Working Draft, 22/09/2026.**

Dominar:
- `AudioContext`;
- estados suspended/running/closed;
- user activation;
- graph de nodos;
- gain/filter/analyser;
- `AudioWorklet`;
- `baseLatency`, `outputLatency`, `getOutputTimestamp()`;
- lifecycle y release.

Regla:
un Working Draft se estudia como dirección técnica, no se convierte en requisito vigente sin decisión explícita.

### 6. Captura y permisos

Media Capture and Streams:
- `getUserMedia()`;
- `MediaStreamTrack`;
- constraints y capabilities;
- sample rate / channel count cuando estén expuestos;
- echoCancellation;
- autoGainControl;
- noiseSuppression;
- latency;
- deviceId / groupId;
- permisos e indicadores;
- minimización de device fingerprinting.

Content hints de audio:
- `speech`;
- `speech-recognition`;
- `music`.

Validar que el procesamiento automático no destruya música o datos acústicos que el caso de uso necesita.

### 7. Grabación

MediaStream Recording / `MediaRecorder`:
- `isTypeSupported()`;
- MIME/codec de salida;
- timeslices/chunks;
- timestamps;
- eventos y errores;
- consistencia del archivo final;
- recursos/memoria en sesiones largas.

### 8. Realtime / WebRTC

Base:
- WebRTC 1.0;
- RTP/RTCP;
- Opus RFC 6716;
- Opus RTP RFC 7587;
- requisitos de audio WebRTC RFC 7874.

Métricas:
- packet loss;
- jitter;
- RTT;
- jitter buffer delay;
- concealed samples;
- concealment events;
- total playout delay;
- audio level cuando proceda;
- reconexión y cambio de dispositivo.

No resumir “latencia de voz” en una sola cifra sin definir desde dónde hasta dónde se mide.

### 9. Delivery HTTP y streaming

Validar:
- status;
- MIME;
- Content-Length;
- Range / 206 / Content-Range;
- redirects;
- caching;
- CORS cuando aplique;
- time-to-first-byte;
- time-to-first-play;
- seeking;
- stalls;
- HLS/MSE cuando existan.

RFC 9110 es la referencia HTTP para range requests.

### 10. STT / reconocimiento

Validar por capas:
- captura;
- idioma/locale BCP 47;
- transcripción;
- latencia parcial/final;
- word error rate cuando sea apropiado;
- substitutions/deletions/insertions;
- nombres propios;
- números;
- negaciones;
- comandos críticos;
- code-switching;
- ruido;
- distancia al micrófono;
- acentos;
- silencio y falsos positivos.

WER no es suficiente para tareas críticas: debe complementarse con errores semánticos/entidades importantes.

### 11. TTS / síntesis de voz

Validar:
- inteligibilidad;
- pronunciación;
- nombres propios;
- números/fechas;
- prosodia;
- pausas;
- velocidad;
- tono;
- estabilidad;
- artefactos;
- clipping;
- inicio/corte de frases;
- idioma/locale;
- latencia al primer audio;
- continuidad entre chunks;
- interrupción/barge-in;
- coherencia de identidad de voz;
- fallback.

SSML 1.1 sigue siendo referencia estable para markup de síntesis donde el sistema lo soporte.

### 12. Arquitecturas de voz AI

Distinguir:
1. pipeline encadenado STT → agente → TTS;
2. speech-to-speech realtime;
3. conversación full-duplex con backend delegado.

Para OpenAI, estudiar la documentación vigente de Audio & Voice, Voice agents, Realtime y TTS; **Córtex sigue siendo autoridad sobre modelo/provider**, Eco sobre la validación media/voz.

### 13. Calidad perceptual

Estudiar:
- ITU-T P.800;
- P.808 crowdsourced;
- P.835 para speech/noise/overall (revisión 07/2026);
- P.863 POLQA;
- P.85 para voice-output devices/TTS.

Actualización importante:
**P.862/PESQ está eliminado/withdrawn desde 05/01/2024.**
No diseñar un programa nuevo de calidad como si P.862 fuese la referencia vigente principal.

### 14. Loudness

Referencias:
- ITU-R BS.1770-5;
- EBU R128 v5.0 (11/2023);
- EBU Tech 3341.

EBU R128 usa -23 LUFS en contexto broadcast. Eco debe aprender la metodología, no imponer -23 LUFS a todo audio web/voz sin requisito de producto.

### 15. Accesibilidad y neurodiversidad

Coordinar con Axioma.

Validar técnicamente:
- control de audio inesperado/autoplay;
- pausa/stop/volumen;
- alternativas textuales para audio-only pregrabado;
- captions en sincronizado;
- captions live cuando aplique;
- controles operables;
- foco/teclado;
- estado anunciado;
- carga sensorial;
- opción de silencio;
- no obligar a voz si existe alternativa textual;
- transcripción legible cuando sea pertinente.

Fuentes:
WCAG 2.2 y W3C COGA.

### 16. Privacidad

Micrófono/voz son datos de alta sensibilidad contextual.

Eco debe:
- activar captura solo cuando corresponda;
- verificar user gesture;
- observar permisos e indicadores;
- evitar registrar audio crudo innecesario;
- no persistir device identifiers sin necesidad;
- separar métricas técnicas de contenido hablado;
- entregar a Vigía/Lex cualquier necesidad de telemetría/retención que exceda la prueba.

### 17. Cross-browser / real-device QA

Matriz mínima según alcance:
- Chrome Stable real;
- Edge Stable cuando aplique;
- Firefox;
- Safari/macOS;
- Safari/iOS / WebKit real;
- Android;
- auriculares/Bluetooth cuando sea relevante;
- altavoz integrado;
- micrófono integrado y, si aplica, headset.

Playwright/Chromium es una herramienta, no una población completa.

## R02 · Estudio avanzado

Profundizar en:
- codec/container negotiation;
- WebCodecs cuando el producto lo necesite;
- MSE/HLS/CMAF;
- jitter buffers y concealment;
- echo/AGC/noise suppression;
- device switching;
- AudioWorklet performance;
- full-duplex y barge-in;
- VAD/turn-taking;
- TTS streaming;
- audio chunk boundaries;
- observabilidad de voz sin invadir privacidad;
- evaluation design;
- long-session soak tests;
- power/battery on mobile;
- hardware-assisted decoding;
- background/lock-screen behavior cuando aplique.

## Fuentes primarias estudiadas

### W3C / WHATWG
- https://www.w3.org/TR/webaudio/
- https://www.w3.org/TR/webaudio-1.1/
- https://www.w3.org/TR/webrtc/
- https://www.w3.org/TR/mediacapture-streams/
- https://www.w3.org/TR/mediastream-recording/
- https://www.w3.org/TR/media-capabilities/
- https://www.w3.org/TR/audio-output/
- https://www.w3.org/TR/mse/
- https://html.spec.whatwg.org/multipage/media.html
- https://www.w3.org/TR/coga-usable/
- https://www.w3.org/WAI/WCAG22/Understanding/audio-control.html

### IETF
- https://www.rfc-editor.org/rfc/rfc6716
- https://www.rfc-editor.org/rfc/rfc7587
- https://www.rfc-editor.org/rfc/rfc7874
- https://www.rfc-editor.org/rfc/rfc9110
- https://www.rfc-editor.org/rfc/rfc5646

### Chromium / browser engineering
- https://www.chromium.org/audio-video/
- https://playwright.dev/docs/browsers
- https://developer.apple.com/documentation/webkit/delivering-video-content-for-safari
- https://webkit.org/blog/7763/a-closer-look-into-webrtc/

### ITU / EBU
- https://www.itu.int/rec/T-REC-P.800/
- https://www.itu.int/rec/T-REC-P.808/
- https://www.itu.int/rec/T-REC-P.835/
- https://www.itu.int/rec/T-REC-P.863/
- https://www.itu.int/rec/T-REC-P.862/
- https://www.itu.int/rec/R-REC-BS.1770/
- https://tech.ebu.ch/publications/r128

### Tooling
- https://ffmpeg.org/ffprobe.html
- https://ffmpeg.org/ffmpeg-filters.html

### OpenAI · documentación de proveedor vigente estudiada como contexto Sabik
- https://developers.openai.com/api/docs/guides/audio
- https://developers.openai.com/api/docs/guides/voice-agents
- https://developers.openai.com/api/docs/guides/realtime
- https://developers.openai.com/api/docs/guides/text-to-speech

## Formación continua

Cada nueva incidencia real debe convertirse en al menos uno de:
- caso de prueba;
- fixture;
- runbook;
- test automatizado;
- matriz de compatibilidad;
- aprendizaje versionado.

No hay “formación terminada” en media web: navegadores, codecs, OS, providers y estándares cambian.
