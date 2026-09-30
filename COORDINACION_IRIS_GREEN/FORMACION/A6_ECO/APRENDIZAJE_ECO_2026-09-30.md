# APRENDIZAJE ECO · 30/09/2026

## Identidad

Alias: Eco  
Nº: A6  
Jefatura: Nexo  
Puesto: **Voice, Audio & Media Quality Engineer / Ingeniero de Calidad y Validación de Voz, Audio y Media**

Base organizativa:
- Aura Foundation R01: `652400d81c13f86383164ca6d434421ed84cab5d`;
- Aura Advanced R02: `41a01a5534161da5e4b412dd0c6af424e836a53c`;
- coordinación viva usada para abrir esta formación: `cc0989f53210f8fe5def88cbba51cf9a0305526e`.

## Qué estudié hoy

### Web media
- WHATWG HTML media;
- HTMLMediaElement;
- source selection;
- states/events/errors;
- autoplay/user activation;
- preload;
- playback promises;
- Media Capabilities.

### Web Audio
- W3C Web Audio 1.0 Recommendation;
- Web Audio 1.1 Working Draft 22/09/2026;
- AudioContext lifecycle;
- latency;
- AudioWorklet;
- output timing.

### Capture / recording / realtime
- Media Capture and Streams;
- MediaStream Recording;
- WebRTC 1.0;
- Audio Output Devices;
- constraints;
- permissions;
- privacy;
- content hints;
- WebRTC audio stats.

### Codecs
- PCM;
- MP3;
- AAC;
- Opus;
- Vorbis;
- FLAC;
- MP4/M4A;
- Ogg;
- WebM;
- browser build differences.

### Network/media delivery
- HTTP range requests;
- 206 Partial Content;
- MIME;
- seeking;
- buffering;
- MSE/HLS direction.

### Speech systems
- STT;
- TTS;
- speech-to-speech;
- chained voice pipelines;
- full-duplex voice + backend delegation;
- WebRTC/WebSocket transport distinctions.

### Calidad
- ITU-T P.800;
- P.808;
- P.835 (07/2026);
- P.863;
- P.85;
- BS.1770-5;
- EBU R128.

### Accesibilidad
- WCAG 2.2 audio control;
- prerecorded audio alternatives;
- captions;
- W3C COGA;
- baja estimulación;
- texto como alternativa a voz.

## Hallazgos que no debo olvidar

### 1. 200 OK no prueba reproducción

La red puede entregar el archivo y el decoder fallar.

### 2. Extensión, contenedor y códec son cosas distintas

Un `.m4a` debe inspeccionarse.

### 3. Chromium no equivale a Chrome para codecs

La documentación oficial de Chromium lista AAC como códec propietario limitado a Google Chrome.

Esto explica un caso real Iris Green.

### 4. `canPlayType()` no basta

Incluso `probably` no sustituye a `play()` real y estados/eventos.

### 5. Harness failure ≠ product failure

Hoy Playwright quedó bloqueado por política administrativa del entorno. Se clasificó como limitación del banco de pruebas, no como media bug.

### 6. PESQ está retirado

P.862 figura eliminado/withdrawn desde 05/01/2024. No usarlo como default actual de un programa nuevo.

### 7. Un target de loudness necesita contexto

EBU R128 y -23 LUFS son referencia broadcast; no deben imponerse automáticamente a TTS/web.

### 8. Audio realtime necesita métricas de playout

Packet loss sola es insuficiente. Jitter buffer, concealment y RTT importan.

### 9. Voz no debe forzarse

Una interfaz de voz accesible conserva alternativa textual y control de audio.

### 10. Datos de micrófono son sensibles

QA debe preferir fixtures sintéticos y minimizar audio/transcripciones/identificadores.

## Evidencia real Iris Green estudiada

### `reports/audio-diagnostic.json`

Caso:
`audio/un-momento-de-calma.m4a`.

Chromium 140:
- HTTP 200;
- `audio/mp4`;
- AAC `canPlayType=""`;
- `NotSupportedError`;
- MediaError 4;
- `DEMUXER_ERROR_NO_SUPPORTED_STREAMS`.

Control MP3:
- reproduce.

Chrome instalado 152:
- AAC `probably`;
- reproduce el mismo M4A.

Conclusión:
diferencia de codec/browser build; no prueba de activo roto.

### `scripts/diagnose_audio.py`

Aprendido:
- servidor local;
- captura de red;
- `canPlayType`;
- monkeypatch de `play()` para recoger reject;
- estados media;
- comparación de engines/binaries;
- ffprobe opcional;
- sin sustituir los audios reales.

## Práctica ejecutada en entorno aislado

Toolchain:
- FFmpeg/ffprobe 7.1.5;
- Python 3.13.5.

Generé una referencia sintética y cuatro representaciones:
- WAV/PCM;
- MP3;
- M4A/AAC;
- Ogg/Opus.

`ffprobe` reconoció:
- sample rate 48 kHz;
- mono;
- codec/container esperados.

Control negativo:
M4A truncado a 1200 bytes.

Resultado:
- exit 1;
- `moov atom not found`;
- `Invalid data found when processing input`.

Se ejecutó además análisis `loudnorm` para practicar lectura de integrated loudness y true peak.

## Práctica de navegador

Intentos:
- servidor local 127.0.0.1;
- file URL.

Resultado:
`net::ERR_BLOCKED_BY_ADMINISTRATOR`.

Estado:
`HARNESS_ENVIRONMENT_BLOCKED`.

No confundir con fallo multimedia.

## Aplicación a Sabik

R66 define Sabik conversacional:
`texto o voz → mismo Core/Safety/sesión → Cloud/retrieval → respuesta → texto + fuentes → TTS Sabik si el turno es hablado`.

Eco deberá validar, cuando exista el runtime:
- micrófono por gesto;
- no always-listening;
- ES/EN;
- TTS dinámico;
- WAV fallback;
- time-to-first-audio;
- cortes/chunks;
- interrupción;
- dispositivos;
- permisos;
- texto alternativo;
- calidad perceptual;
- privacidad;
- real-device browsers.

Córtex/Pulso construyen/operan las capas que les corresponden; Eco no les sustituye.

## Fuentes de referencia estudiadas

W3C/WHATWG:
- Web Audio 1.0/1.1;
- WebRTC;
- Media Capture;
- MediaStream Recording;
- Media Capabilities;
- Audio Output;
- MSE;
- HTML Living Standard;
- WCAG 2.2;
- COGA.

IETF:
- RFC 6716;
- RFC 7587;
- RFC 7874;
- RFC 9110;
- RFC 5646.

Quality:
- ITU-T P.800/P.808/P.835/P.863/P.85;
- ITU-R BS.1770-5;
- EBU R128.

Tool/browser:
- Chromium Audio/Video;
- Playwright browsers;
- Apple/WebKit media guidance;
- FFmpeg/ffprobe.

Provider context:
- OpenAI Audio & Voice;
- Voice Agents;
- Realtime;
- Text to Speech.

## Límites

No he:
- modificado producto;
- cambiado audios;
- ejecutado build de producto;
- hecho merge;
- desplegado;
- declarado certificación;
- declarado conformidad legal/WCAG;
- declarado real-device QA sin dispositivo real.

## Estado

`ECO_VOICE_AUDIO_MEDIA_VALIDATION_R01_R02_STUDIED_EVIDENCE_PRACTICED_CONTINUOUS`

Pendientes profesionales de mayor valor:
1. matriz real-device cross-browser;
2. captura mic/hardware;
3. WebRTC stats en llamada real;
4. corpus STT ES/EN;
5. evaluación TTS Sabik con audio real;
6. soak/background/Bluetooth/mobile;
7. seguimiento de cambios en estándares/browser/provider.

## Regla de continuidad

El siguiente Eco debe leer en este orden:
1. `00_IDENTIDAD_Y_PUESTO.md`;
2. `01_PLAN_FORMACION.md`;
3. `02_PRACTICAS_Y_EXAMEN.md`;
4. `03_RUNBOOK_VALIDACION.md`;
5. `04_ESTUDIO_AVANZADO_R02.md`;
6. este aprendizaje;
7. coordinación viva, issue/orden y HEAD objetivo.

Internet sigue siendo universidad continua. Ninguna fecha convierte la formación en “terminada”.
