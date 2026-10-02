# NUEVO RINCÓN · A1 PECERA · ECO AUDIO / MEDIA PASS

Fecha: 02/10/2026  
Owner: **Eco · A6 — Voice, Audio & Media Quality / Validation Engineer**  
Issue: #368  
Input gate: `RINCON_A1_LUMEN_VISUAL_KEEP_PASS`

Estado:
`RINCON_A1_ECO_AUDIO_MEDIA_PASS`

## 1 · Input visual congelado

Binario recibido de Lumen:
`pecera_10min_parte1_de_2.mp4`

SHA-256:
`8b2e5e7cb28e9ccfbf1a045c718fd9201f8cac6e2c92ee707545c386693a1e8f`

Eco lo volvió a medir sobre el binario real:
- 19.838.329 B;
- 300.083333 s;
- H.264 High Level 3.1;
- yuv420p;
- 960×540;
- 24 fps;
- ~526.758 bps vídeo;
- 1 stream vídeo;
- 0 audio.

No rerender.
No modificación visual.

## 2 · Sonido first-party

Archivo:
`A1_pecera_audio_firstparty_5min.m4a`

SHA-256:
`36e7b00ccb4b268a8b7f1a4d640af7564585bd549071e5061fd291c2c871000e`

Tamaño:
4.886.202 B.

Formato:
- AAC-LC;
- 48 kHz;
- estéreo;
- ~128.730 bps;
- 300.083 s.

Diseño:
- 100 % síntesis local determinista;
- 0 samples externos;
- 0 grabaciones;
- 0 voz;
- 0 música;
- cuerpo de agua filtrado 35–700 Hz;
- textura suave 260–2400 Hz;
- 275 resonancias de burbuja irregulares;
- modelo de resonancia inspirado en Minnaert;
- ataque suavizado;
- decaimiento exponencial;
- paneo leve;
- modulaciones lentas no conmensurables;
- fade in/out 2,5 s;
- sin loop corto.

Seed:
`61012026`

Generador:
`COORDINACION_IRIS_GREEN/EVIDENCIA/NEW_RINCON_16_MEDIA_20261002/A1_ECO_AUDIO_GENERATOR_R01.py`

## 3 · Loudness / low-stimulation

Medición final AAC:
- integrada: **−23,03 LUFS**;
- LRA: **1,90 LU**;
- true peak: **−10,58 dBTP**.

Eco no eleva artificialmente el true peak hasta el límite:
el margen es deliberado para baja estimulación.

Distribución espectral media de 12 muestras:
- <1 kHz: **98,118 %**;
- 1–3 kHz: **1,811 %**;
- >3 kHz: **0,028 %**.

Correlación estéreo en bloques de 10 s:
~0,928.

Cambios de nivel entre ventanas interiores de 100 ms:
- p95: 1,27 dB;
- p99: 1,73 dB;
- máximo: 2,36 dB.

Conclusión:
`LOW_STIMULATION_AUDIO_TECHNICAL_PASS`

El juicio perceptivo final corresponde a Lumen + HUMAN QA.

## 4 · Mux final

Archivo:
`A1_pecera_5min_AV_ECO_R01.mp4`

SHA-256:
`7bd18bd4aac9373fcb2ccbc25ceb8ae7e9fefeead3c161a4eb5cf343a74012c3`

Tamaño:
24.789.723 B.

Streams:
- vídeo: H.264 High 3.1 · yuv420p · 960×540 · 24 fps · 300.083333 s;
- audio: AAC-LC · 48 kHz estéreo · 300.083000 s;
- ambos start_time = 0.

Delta duración A/V:
`0,000333 s`.

El stream H.264 se copió, NO se recodificó.

Hash elementary H.264 antes:
`771f88e17784fccc6dff36260366b6cfc2c6b3e2ecc2a7ae1d1c0aa215f6973b`

Hash elementary H.264 después:
`771f88e17784fccc6dff36260366b6cfc2c6b3e2ecc2a7ae1d1c0aa215f6973b`

Resultado:
`VIDEO_STREAM_BYTE_IDENTITY_PASS`

Decode completo ffmpeg:
`PASS`

## 5 · Faststart

Input visual:
- `mdat` offset 44;
- `moov` offset 19.758.982.

Mux Eco:
- `moov` offset 36;
- `mdat` offset 201.729.

Resultado:
`MP4_FASTSTART_PASS`

Se mejora delivery progresivo sin recodificar la imagen.

## 6 · Browser media QA

Browser:
`Chromium 144.0.7559.96 · Debian GNU/Linux 13`

Exact mux final, cargado como data URL para aislar decode/playback de red.

`canPlayType`:
- H.264 + AAC: `probably`;
- H.264: `probably`;
- AAC: `probably`.

Playback:
- duration: 300.083333 s;
- 960×540;
- readyState 4;
- error: null;
- play resuelve;
- currentTime >1 s en ~1,12 s;
- muestra inicial: 29 frames · 0 dropped · 0 corrupted.

Unmute:
- reproducción continúa;
- error null.

Seek a 150 s:
- ~0,067 s con asset ya cargado;
- reproducción continúa;
- muestra acumulada: 111 frames · 0 dropped · 0 corrupted.

Resultado:
`EXACT_MUX_BROWSER_DECODE_PLAY_SEEK_PASS`

Limitación:
este test NO es HTTP y por tanto no valida:
- Range/206;
- CDN;
- startup real de red;
- buffering real de producción.

Estos puntos quedan:
`WAIT_COMMON_PLAYER_OR_HOST_SURFACE`

No bloquean este gate de creación/mux.

## 7 · Transporte de binarios

Los binarios finales existen en el runtime Eco y se entregan también como artefactos de esta conversación.

Intento de persistencia Library:
`FAILED_PLATFORM_CONTAINER_SESSION_EXPIRED`

Intento de transporte Slack:
el workspace entregó URLs firmadas, pero el runtime no dispone de DNS saliente para hacer el POST de bytes:
`FAILED_RUNTIME_DNS`

Esto se clasifica:
`HARNESS_TRANSPORT_LIMITATION`

NO como fallo de media.

Continuidad reproducible:
- input visual canónico persiste en Library;
- generator exacto persiste en GitHub;
- seed/recipe/hashes/evidence persisten en GitHub.

## 8 · Evidencia

Machine-readable:
`COORDINACION_IRIS_GREEN/EVIDENCIA/NEW_RINCON_16_MEDIA_20261002/A1_ECO_AUDIO_MEDIA_EVIDENCE.json`

Generador:
`COORDINACION_IRIS_GREEN/EVIDENCIA/NEW_RINCON_16_MEDIA_20261002/A1_ECO_AUDIO_GENERATOR_R01.py`

## 9 · Handoff a Lumen

Lumen debe hacer ahora **únicamente** el final AV check:

- confirmar que el mux no alteró visual;
- escuchar la pieza;
- comprobar que el paisaje sonoro no distrae;
- comprobar ausencia perceptiva de clicks/pops/eventos bruscos;
- confirmar pertenencia a Relajantes/ventana;
- no reabrir arte salvo defecto visual real.

Salida esperada:
`RINCON_A1_LUMEN_FINAL_AV_PASS`

## 10 · WIP / STOP

Eco STOP tras este checkpoint.

No:
- player;
- A3 Mar;
- B2 Discos líquidos;
- otras 13 piezas;
- rerender;
- Motor interrupt.

Sigue:
`ONE_ACTIVE_MEDIA_ITEM_ONLY`

Motor:
`WAIT_MOTOR_RELEASE`

## Marcadores

`RINCON_A1_ECO_AUDIO_MEDIA_PASS`

`RINCON_A1_AUDIO_FIRSTPARTY_PASS`

`RINCON_A1_VIDEO_STREAM_BYTE_IDENTITY_PASS`

`RINCON_A1_FASTSTART_PASS`

`RINCON_A1_BROWSER_MEDIA_PASS_LOCAL_ASSET`

`RINCON_A1_HTTP_RANGE_PENDING_PLAYER_SURFACE`
