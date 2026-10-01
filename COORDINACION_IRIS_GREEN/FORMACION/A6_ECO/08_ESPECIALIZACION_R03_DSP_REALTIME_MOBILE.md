# ECO · A6 · ESPECIALIZACIÓN R03 · DSP, REALTIME Y AUDIO MÓVIL

Fecha: 01/10/2026  
Estado: `ADVANCED_R03_STUDIED_PRACTICE_EVIDENCE_PRESENT`

## Propósito

R03 profundiza donde un validador de media deja de limitarse a “reproduce/no reproduce” y empieza a razonar sobre señal, tiempo real, hardware, red y calidad perceptual.

## 1 · DSP aplicado a QA

### Nivel y dinámica

Distinguir:

- **peak / dBFS**: máximo instantáneo digital;
- **RMS**: energía media de señal;
- **crest factor**: relación pico/RMS;
- **loudness**: medida perceptualmente ponderada, no equivalente a RMS;
- **true peak**: estima picos entre muestras;
- **clipping**: saturación/no linealidad, no solo “audio alto”.

Práctica R03:
una senoide 1 kHz a pico 0.5 dio aproximadamente:
- peak: -6.02 dBFS;
- RMS: -9.03 dBFS;
- crest factor: 3.01 dB.

Tras hard clipping:
- peak: 0 dBFS;
- RMS ≈ -1.78 dBFS;
- crest factor ≈ 1.78 dB;
- THD armónica ≈ 11.7 %.

Lección:
el clipping cambia espectro y dinámica; mirar solo el pico no basta.

### FFT / PSD

Herramientas:
- NumPy FFT;
- SciPy Welch PSD;
- FFmpeg analyzers.

Usos QA:
- localizar hum/tonos;
- comparar ruido;
- observar armónicos;
- confirmar contenido fuera de banda;
- detectar cambios por filtros/codecs.

Una FFT aislada no es “calidad”. Debe interpretarse con ventana, resolución, nivel, banda y objetivo.

### SNR

Definir explícitamente:
`SNR = 10 log10(P_signal / P_noise)`.

Práctica:
objetivo 20 dB → medido ≈ 19.98 dB.

No usar SNR sin:
- referencia;
- banda;
- método de separación signal/noise;
- canal y sample rate.

### Fase y compatibilidad mono

Práctica:
- L/R en fase: correlación +1;
- L/R contrafase: correlación -1;
- plegado mono de contrafase: RMS 0.

FFmpeg confirmó mono fold:
- peak = `-inf`;
- RMS = `-inf`.

Lección:
un contenido puede sonar normal en estéreo y desaparecer en mono. Eco debe incluir phase/correlation/fold-down cuando el producto pueda terminar en altavoces mono, telefonía, accessibility routing o mezclas.

### Resampling / Nyquist

Práctica:
componente 1 kHz + componente 10 kHz a 48 kHz.

Proceso:
48 kHz → 16 kHz → 48 kHz mediante `scipy.signal.resample_poly`.

Resultado:
- 1 kHz preservado;
- 10 kHz atenuado ≈ 114.6 dB.

Razón:
a 16 kHz, Nyquist = 8 kHz; 10 kHz no puede preservarse sin aliasing. El filtro antialias lo elimina.

Lección:
“cambiar sample rate” no es copiar muestras. QA debe comprobar antialiasing, banda útil y artefactos.

### Filtros

Práctica:
Butterworth orden 6, bandpass 300–3400 Hz, implementado como SOS.

Resultado:
- 1 kHz preservado;
- 10 kHz ≈ 70 dB por debajo de 1 kHz.

Criterio:
para IIR de orden elevado, preferir second-order sections y comprobar respuesta; SciPy advierte de problemas numéricos con forma TF en filtros de orden alto/estrechos.

### Silencio ≠ VAD

Fixture:
1 s silencio + 2 s tono + 1 s silencio.

Detección simple a -50 dBFS:
- inicio activo ≈ 1.000 s;
- final ≈ 3.000 s.

FFmpeg `silencedetect` confirmó:
- silencio 0–1.000021;
- silencio 3–4.

Lección:
threshold/silencedetect son útiles para controles deterministas, pero **no equivalen a Voice Activity Detection semántica**.

## 2 · Procesamiento de micrófono

Media Capture expone controles/capacidades para:
- sampleRate;
- sampleSize;
- channelCount;
- latency;
- echoCancellation;
- autoGainControl;
- noiseSuppression.

No asumir:
`requested constraints == actual settings`.

Siempre capturar:
- `getCapabilities()`;
- constraints pedidos;
- `getSettings()`;
- cambios tras `applyConstraints()`.

### AEC / NS / AGC

WebRTC Audio Processing Module aplica mejoras de speech:
- Acoustic Echo Cancellation;
- Noise Suppression;
- Automatic Gain Control.

Son apropiadas para VoIP/speech, pero pueden destruir:
- música;
- audio ambiental;
- señales de prueba;
- dinámica necesaria para análisis.

Eco debe probar ON/OFF cuando el caso de uso no sea speech convencional.

## 3 · Voz realtime y RTP

### Audio level

RFC 6464 define un RTP header extension para nivel de audio client-to-mixer y opcionalmente un bit de VAD.

No confundir:
- audio level instantáneo;
- VAD;
- DTX;
- long-term loudness.

### Opus

Opus:
- speech + music;
- VBR por defecto;
- DTX opcional;
- packet loss concealment;
- in-band FEC.

RFC 7587:
la FEC incluye información redundante del paquete anterior en el siguiente paquete.

Consecuencia QA:
para aprovechar FEC hay que tolerar al menos el retardo necesario para disponer del paquete siguiente.

### FEC

RFC 8854:
- FEC puede mejorar resistencia a pérdidas;
- añade overhead y puede aumentar playout delay;
- para Opus se recomienda in-band FEC bajo condiciones apropiadas;
- no recupera arbitrariamente ráfagas largas de pérdidas.

Eco no debe afirmar “FEC arregla packet loss”.
Debe probar:
- loss aislado;
- burst loss;
- RTT;
- jitter;
- bitrate;
- playout delay;
- concealment.

## 4 · WebRTC stats avanzadas

No usar una única métrica.

### Inbound RTP

Observar:
- packetsReceived;
- packetsLost;
- jitter;
- jitterBufferDelay;
- jitterBufferEmittedCount;
- concealedSamples;
- concealmentEvents;
- totalSamplesDuration;
- audioLevel;
- totalAudioEnergy.

### Remote inbound / transport

Observar:
- roundTripTime;
- totalRoundTripTime;
- roundTripTimeMeasurements;
- fractionLost;
- candidate pair;
- currentRoundTripTime;
- bytes/packets.

### Derivadas

Promedio jitter buffer:
`jitterBufferDelay / jitterBufferEmittedCount`.

No comparar counters absolutos entre sesiones de distinta duración sin normalizar.

## 5 · Latencia de conversación

Descomponer:

1. capture;
2. local preprocessing;
3. uplink;
4. turn detection / endpointing;
5. model/backend;
6. tools;
7. synthesis;
8. first audio arrival;
9. client buffer;
10. DAC/output.

Medir al menos:
- median;
- p95;
- outliers;
- time-to-first-useful-audio;
- time-to-complete-answer;
- interruption stop latency.

Una frase de relleno no cuenta como “respuesta útil” si la información que necesita la persona llega después.

## 6 · VAD y endpointing

OpenAI Realtime actual:
- `server_vad`;
- eventos speech_started/speech_stopped;
- VAD puede desactivarse;
- algunas rutas requieren commit manual;
- configuración de delay en realtime transcription crea trade-off latency/accuracy.

QA:
- habla rápida;
- pausas internas;
- final de frase largo;
- hesitación;
- backchannel;
- ruido;
- respiración;
- doble habla;
- mic distante.

Medir:
- false start;
- false stop;
- speech clipping;
- tail clipping;
- endpoint latency;
- empty turns.

## 7 · Full duplex y barge-in

Para sistemas full duplex:
- input y output son flujos independientes;
- el usuario puede interrumpir mientras el asistente habla;
- backend puede seguir trabajando.

Casos obligatorios:
- interrupción temprana;
- interrupción al final;
- habla simultánea;
- cancel mientras tool corre;
- late tool result tras cancel;
- audio en cola tras cancel;
- reentrada inmediata;
- muted input ≠ closed session.

Resultado correcto requiere coherencia entre:
- audio realmente oído;
- transcript;
- session state;
- task state;
- tool state.

## 8 · Audio móvil

### Android

Android distingue:
- input latency;
- output latency;
- round-trip latency;
- warmup latency.

Guía oficial:
- AAudio/Oboe para high performance;
- low-latency performance mode;
- exclusive cuando esté disponible;
- natural device sample rate, habitualmente 48 kHz;
- callbacks;
- evitar operaciones bloqueantes;
- medir xruns.

Importante:
las cifras varían mucho entre dispositivos. Ningún PASS desktop sustituye device QA.

### Apple / iOS

Conceptos:
- AVAudioSession;
- playAndRecord;
- voiceChat;
- interruptions;
- route changes;
- Bluetooth HFP;
- lock/background;
- input permission.

`voiceChat` puede aplicar procesamiento de voz y limitar rutas a las apropiadas para chat.

QA:
- incoming call/system interruption;
- lock/unlock;
- route disconnect;
- AirPods/headset;
- HFP;
- speaker;
- Bluetooth switching;
- mic permission;
- suspension/resume.

Para Sabik Web, las APIs web siguen mandando; este conocimiento explica el comportamiento de la capa OS que el navegador hereda.

## 9 · Streaming moderno

### HLS

RFC 8216 es la base publicada; Apple mantiene requisitos actuales y una evolución HLS2.

HLS ofrece:
- variantes por bitrate;
- adaptación a red;
- live/VOD;
- audio renditions;
- CDN delivery.

### Low-Latency HLS

Usa:
- partial segments;
- playlist delta updates;
- blocking reload;
- preload hints;
- rendition reports.

No confundir LL-HLS con conversational realtime: sus objetivos/latencias y transporte son distintos.

### CMAF

CMAF:
- header + fragments;
- tracks;
- switching sets;
- fMP4/ISO-BMFF;
- interoperabilidad de packaging para adaptive delivery.

### MSE

Media Source Extensions permite alimentar `HTMLMediaElement` desde buffers generados por JavaScript.

### WebCodecs

Working Draft 21/09/2026.

Clave:
WebCodecs **no exige ningún codec**. Una implementación puede ofrecer cualquier combinación o ninguno.

Por tanto:
`AudioDecoder exists ≠ desired codec supported`.

## 10 · Seguridad y privacidad

Media Capture:
- requiere consentimiento;
- deviceId tiene superficie de fingerprinting;
- labels/info de dispositivos se restringen antes de permiso;
- permisos persistentes deben poder revocarse;
- UI debe indicar access/live state;
- `stop()` y fin de tracks importan.

RFC 8826:
un sitio arbitrario no debe poder iniciar envío de mic/camera sin consentimiento.

RFC 8828:
WebRTC también tiene superficie de privacidad de IP/network path.

Eco debe validar:
- cuándo empieza captura;
- cuándo termina de verdad;
- indicadores;
- permission denied/revoked;
- device enumeration antes/después;
- logs sin audio/transcript sensibles;
- candidate/network exposure solo al nivel necesario.

## 11 · Fuentes R03

- W3C Media Capture and Streams
- W3C WebRTC Stats
- W3C WebCodecs WD 21/09/2026
- WebRTC Audio Processing Module
- RFC 6464
- RFC 6716
- RFC 7587
- RFC 7874
- RFC 8834
- RFC 8854
- RFC 8826
- RFC 8828
- Android AAudio / Low latency audio
- Apple AVAudioSession / interruptions / route changes / voiceChat
- RFC 8216 + Apple HLS Authoring / LL-HLS / CMAF
- NumPy FFT
- SciPy Welch / resample_poly / Butterworth / sosfilt
- FFmpeg filters

## Resultado

Eco R03 entiende que la calidad media surge de la interacción entre:

`signal + DSP + codec + transport + timing + OS/device + browser + conversational state + human perception`

y que ninguno de esos ejes puede sustituirse por una sola métrica.
