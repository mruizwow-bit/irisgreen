# ECO · A6 · PRÁCTICAS Y EXAMEN INTERNO

Fecha: 30/09/2026

## Regla

Leer documentación no basta. Eco debe demostrar diagnóstico, clasificación de evidencia y capacidad de no sobreafirmar.

## P1 · Caso real Iris Green · AAC/M4A vs MP3

Evidencia revisada:
- `reports/audio-diagnostic.json`
- `scripts/diagnose_audio.py`

Hallazgo:
- `audio/un-momento-de-calma.m4a` existe y se entrega HTTP 200 como `audio/mp4`;
- `audio/atmosfera.mp3` existe y se entrega HTTP 200 como `audio/mpeg`;
- Chromium headless 140 declara AAC vacío en `canPlayType` y el M4A termina en `MEDIA_ERR_SRC_NOT_SUPPORTED` / `DEMUXER_ERROR_NO_SUPPORTED_STREAMS`;
- el MP3 reproduce en ese Chromium;
- Chrome instalado 152 declara AAC `probably` y reproduce el mismo M4A.

Diagnóstico:
**diferencia de disponibilidad del decoder/códec por build de navegador, no evidencia de activo roto ni fallo HTTP.**

Base externa:
la documentación oficial de Chromium clasifica AAC entre los códecs propietarios limitados a Google Chrome.

Resultado P1:
`PASS_EVIDENCE_DIAGNOSIS`

Lección:
un test E2E con Chromium no puede usarse por sí solo para declarar que un AAC compatible con Chrome estable está roto.

## P2 · Laboratorio aislado ejecutado hoy

Entorno:
- FFmpeg 7.1.5;
- ffprobe 7.1.5;
- señal sintética 1 kHz, 48 kHz, mono, 3 s;
- sin tocar producto Iris Green.

Activos generados desde la misma señal:
- WAV / PCM s16le;
- MP3 / libmp3lame;
- M4A / AAC;
- Ogg / Opus.

Verificación `ffprobe`:
- WAV: PCM s16le, 48 kHz, mono;
- MP3: MP3, 48 kHz, mono;
- M4A: AAC, 48 kHz, mono;
- Ogg: Opus, 48 kHz, mono.

Control negativo:
se truncó deliberadamente el M4A a 1200 bytes.

Resultado esperado y observado:
- `ffprobe` exit 1;
- `moov atom not found`;
- `Invalid data found when processing input`.

Esto demuestra que Eco sabe construir un negativo que prueba que el harness puede detectar un contenedor inválido.

Loudness:
se ejecutó `loudnorm` en modo de análisis sobre el WAV de referencia y se obtuvieron métricas reproducibles de loudness/true peak. La práctica confirma la diferencia entre medir y normalizar: el valor medido no se debe interpretar como objetivo universal.

Resultado P2:
`PASS_SYNTHETIC_MEDIA_PROBE_AND_NEGATIVE_CONTROL`

## P3 · Browser lab aislado

Primer intento:
- Playwright + Chromium 144 contra servidor local;
- segundo intento con `file://`.

Ambos fueron bloqueados por política del entorno:
`net::ERR_BLOCKED_BY_ADMINISTRATOR`.

Clasificación:
`HARNESS_NAVIGATION_RESTRICTED`.

Se rediseñó el laboratorio para eliminar red/filesystem:
- página cargada con `page.set_content()`;
- medios suministrados como data URLs;
- mismo gesto explícito de play;
- estados/eventos/errores capturados.

Binario:
`Chromium 144.0.7559.96`.

`canPlayType()`:
- WAV: `maybe`;
- MP3: `probably`;
- AAC: `probably`;
- Opus: `probably`.

Reproducción saludable:
- WAV: PASS;
- MP3: PASS;
- M4A/AAC: PASS;
- Ogg/Opus: PASS;
- todos alcanzaron `readyState=4`, `networkState=1`, sin MediaError.

Control negativo M4A truncado:
- `play()` reject;
- `NotSupportedError`;
- `readyState=0`;
- `networkState=3`;
- MediaError code 4;
- `DEMUXER_ERROR_COULD_NOT_OPEN`.

Resultado P3:
`PASS_BROWSER_DECODE_PLAYBACK_WITH_NEGATIVE_CONTROL`

Lección:
el Chromium 140 histórico del proyecto y el Chromium 144 actual no tienen que compartir la misma matriz AAC. Registrar binario/build exacto es obligatorio.

## P4 · Matriz cross-browser real

Pendiente de ejecución cuando haya entorno/hardware adecuados.

Mínimo:
- Chrome Stable;
- Edge Stable si está en población objetivo;
- Firefox;
- Safari/macOS;
- Safari/iOS;
- Android/Chrome.

Por navegador:
- MIME;
- `canPlayType()`;
- `decodingInfo()` cuando aplique;
- `play()` resolve/reject;
- ready/network state;
- MediaError;
- events;
- seeking;
- time-to-first-play;
- stall;
- background/interruption si aplica.

## P5 · Captura de voz

Pendiente de hardware/permiso real.

Casos:
1. permiso grant;
2. deny;
3. revoked;
4. micrófono no disponible;
5. device switch;
6. headset/Bluetooth;
7. ruido;
8. speech vs music processing;
9. página pierde foco;
10. sesión larga.

## P6 · WebRTC realtime

Pendiente de entorno de llamada.

Capturar:
- RTT;
- jitter;
- packet loss;
- jitter buffer delay;
- concealment;
- playout delay;
- eventos de reconexión;
- cambio de dispositivo;
- dropout audible.

## P7 · STT

Corpus mínimo ES/EN:
- nombres propios;
- fechas;
- números;
- negaciones;
- frases cortas/largas;
- ruido;
- varios acentos;
- code-switching.

Medidas:
- WER;
- errores de entidades críticas;
- latencia parcial/final;
- falsos inicios;
- cortes.

## P8 · TTS

Matriz:
- ES/EN;
- nombres propios;
- siglas;
- puntuación;
- interrogativas;
- listas;
- números/fechas;
- párrafos largos;
- interrupción;
- streaming;
- reinicio;
- cambio de turno.

Medir:
- time-to-first-audio;
- duración;
- cortes;
- artefactos;
- estabilidad;
- pronunciación;
- inteligibilidad;
- prosodia;
- loudness/peak;
- evaluación humana estructurada.

## Examen interno R01/R02

### Parte A · teoría

Eco debe poder explicar sin consultar:

1. diferencia entre contenedor y códec;
2. por qué M4A no implica por sí mismo AAC reproducible;
3. por qué 200 OK no prueba playback;
4. diferencia entre `canPlayType` y reproducción real;
5. `readyState` vs `networkState`;
6. cuándo una Promise de `play()` puede fallar;
7. por qué autoplay audible es un problema técnico y de accesibilidad;
8. por qué Chromium y Chrome pueden diferir;
9. qué mide `ffprobe`;
10. qué significan sample rate/channels/bitrate;
11. qué aportan LUFS y true peak;
12. qué es un jitter buffer;
13. qué revelan concealed samples;
14. qué diferencia STT, TTS y speech-to-speech;
15. por qué WER no basta en comandos críticos;
16. por qué P.862/PESQ no debe tratarse como referencia vigente principal;
17. qué aporta P.835;
18. qué debe ocultarse/minimizarse en pruebas de micrófono;
19. qué debe comprobarse en Safari/iOS además de desktop;
20. cuándo escalar a Axioma, Lex, Pulso, Vigía, Córtex, Motor, Lumen o Vector.

### Parte B · diagnóstico

Dado:
- archivo 200 OK;
- MIME correcto;
- `canPlayType="probably"`;
- `play()` reject;
- `MediaError.code=4`;

Eco debe:
- no concluir “red rota”;
- inspeccionar codec/container;
- registrar browser build;
- probar control positivo;
- comparar navegador objetivo real;
- capturar estados/eventos;
- entregar hipótesis ordenadas por evidencia.

### Parte C · diseño de QA

Diseñar una matriz para un asistente de voz ES/EN que:
- recibe micrófono;
- responde por TTS;
- permite texto como alternativa;
- admite interrupciones;
- funciona en móvil.

Debe incluir:
- funcional;
- calidad;
- latencia;
- red;
- dispositivos;
- permisos;
- privacidad;
- accesibilidad;
- idioma;
- fallbacks;
- métricas;
- evidencia.

## Criterio de estado

A 30/09/2026:
- teoría R01: STUDIED;
- estudio avanzado R02: STUDIED;
- P1 análisis de evidencia real: PASS;
- P2 práctica sintética: PASS;
- P3 browser decode/playback: PASS mediante data URLs; navegación local quedó clasificada aparte como restricción del harness;
- P4–P8: diseñadas, pendientes cuando exista hardware/entorno/proveedor real.

Estado honesto:
`FOUNDATION_STUDIED_ADVANCED_STUDIED_PRACTICE_EVIDENCE_PRESENT_REAL_DEVICE_QA_PENDING`

No certificación externa.
