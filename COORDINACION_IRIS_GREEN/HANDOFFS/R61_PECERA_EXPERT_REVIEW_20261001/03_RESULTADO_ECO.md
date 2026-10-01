# R61 · PECERA · RESULTADO ECO · MEDIA / CODEC / DELIVERY QA · 01/10/2026

Owner:
**Eco · A6 — Voice, Audio & Media Quality / Validation Engineer**

Handoff recibido:
- `01_REVISION_LUMEN.md`
- `02_RESULTADO_LUMEN.md`
- `ENTREGA_R61_PECERA_ILUSTRADA_3.md`

Issue:
#325

Orden vigente:
#355 · **QA ONLY · R61 Pecera**

Estado:
`R61_ECO_MEDIA_QA_PARTIAL_BINARY_ACCESS_REQUIRED`

## Resultado ejecutivo

- `NO_RERENDER`
- `NO_EVIDENCE_TO_REENCODE_YET`
- `DECLARED_H264_AAC_PROFILE_PLAUSIBLE_NOT_BINARY_VERIFIED`
- `FINAL_H264_AAC_PLAYBACK_PENDING_BINARY_ACCESS`
- `RANGE_206_PENDING_HOSTED_ASSET`
- `MOOV_FASTSTART_PENDING_BINARY_CHECK`
- `AV_SYNC_PENDING_REAL_MEDIA`
- `PERFORMANCE_HARDWARE_QA_PENDING`
- `MOBILE_ENCODE_METADATA_INTERNALLY_CONSISTENT`

Eco **no emite PASS E4 ni media PASS final**.

El bloqueo de Eco no es visual ni de arte. Es estrictamente de evidencia:
los binarios finales existen según la transferencia canónica en:

`C:\Users\mruiz\Downloads\iris-pecera-burbujas\`

pero ese directorio local **no está accesible desde este runtime de Eco** y los binarios no están preservados en GitHub ni disponibles en la Library/conversation files de este chat.

Por tanto:
**no afirmar que el MP4 H.264/AAC final fue reproducido, medido o inspeccionado por Eco.**

---

## 1 · Inventario declarado

Según la entrega preservada:

| asset | declaración |
|---|---|
| `pecera_10min.mp4` | 1280×720 · 24 fps · H.264 High · 1882 kbps + AAC 129 kbps · 151,2 MB |
| `pecera_10min_movil.mp4` | 512×640 · 4:5 · H.264 + AAC · 618 + 97 kbps · 54,0 MB |
| `pecera_audio_10min.m4a` | audio standalone · 9,3 MB |
| `pecera_audio_10min.opus` | audio standalone alternativo · 6,1 MB |
| `pecera_poster.jpg` | poster desktop |
| `pecera_poster_movil.jpg` | poster móvil |
| `pecera_bu.mp4` | máster ≈321,4 MB |
| `pecera.html` | player ES/EN |

Hashes esperados preservados en la entrega:
- `pecera_10min.mp4`: `70e11f73d2d5b9b8a2783d32464a71552d6ba908c5527a7e8de3802f4e28bc17`
- `pecera_10min_movil.mp4`: `9651e67b4f8c61885fffa9e85dcaa1f41f9ac8003d2f5b530e166dbde2a8a5f3`
- `pecera_audio_10min.m4a`: `a96d9248aa3d4dab2471e5aa5565531f84961a825b0698227fbaa6ee86999fcd`
- `pecera_audio_10min.opus`: `1ec4c04597464da2ae79c79d81f9a4c2591e153407e92cec396a840cabc3ba9e`
- `pecera_poster.jpg`: `98f50e59932ec3fbd1218ce30a9c57419b11d1542766ac92d0061d5749c25250`
- `pecera_poster_movil.jpg`: `8e721ab40feebee551218225bc9193181f15c9004192a0c9e4c40c5a30895186`
- `pecera.html`: `418c56f91a16feea24ddbb4f935bd6ee57b011cf584138e47635f38745cd3b79`
- `pecera_bu.mp4`: `5fe20fa38311525512e3c1a4efee240092b988edd3384967405cf41f1a51fdd2`

La transferencia previa declaró verificación byte-identical, incluida la reconstrucción tras la incidencia C2PA.

Eco no repite esa afirmación como medición propia.

---

## 2 · Codec/container · juicio Eco

### Formato declarado

Desktop:
- container MP4;
- H.264 High;
- AAC.

Móvil:
- container MP4;
- H.264;
- AAC.

### Compatibilidad

La estrategia **H.264 + AAC en MP4 es razonable para browser web objetivo**:

- Chromium documenta H.264 y AAC como codecs propietarios disponibles en Google Chrome, no necesariamente en Chromium genérico;
- Apple recomienda H.264 MP4 para vídeo estático web en Safari.

Esto explica por qué el browser QA con Chromium no pudo decodificar el asset final y por qué usar VP9 como sustituto solo validó controles/layout.

Decisión:
`CHROMIUM_VP9_TEST_NOT_FINAL_CODEC_EVIDENCE`

No se considera defecto del MP4 por ese resultado.

### Lo que falta inspeccionar en el binario

Eco necesita ejecutar `ffprobe` sobre los dos MP4 para confirmar:

- container real;
- codec_name;
- profile;
- H.264 level;
- pixel format;
- width/height;
- exact avg/r_frame_rate;
- duración;
- bitrate;
- AAC profile;
- sample rate;
- channels/channel layout;
- start_time;
- duración individual de audio y vídeo;
- tags/metadata relevantes.

Punto especialmente importante:
**H.264 High no basta como descripción de compatibilidad**.
Debe confirmarse al menos pixel format y level del archivo final.

Estado:
`BINARY_CODEC_PROBE_PENDING`

---

## 3 · Peso y bitrate

Los metadatos declarados son internamente coherentes.

Desktop:
- vídeo ≈1882 kbps;
- audio ≈129 kbps;
- total ≈2,0 Mbps sostenidos;
- 10 min → orden de magnitud coherente con 151,2 MB.

Móvil:
- vídeo ≈618 kbps;
- audio ≈97 kbps;
- total ≈0,7 Mbps sostenidos;
- 10 min → orden de magnitud coherente con 54 MB.

Esto permite una conclusión limitada:

**el peso grande proviene principalmente de la duración de 10 min; no hay, solo por las cifras declaradas, evidencia de un bitrate absurdo.**

Pero una única versión progresiva desktop a ~2 Mbps:
- puede ser cómoda en conexiones estables;
- puede sufrir stalls en conexiones sostenidas por debajo o cerca de ese throughput;
- no se adapta a variaciones de red como lo haría una estrategia ABR.

Eso NO autoriza reencode por sí solo.

Decisión:
`CURRENT_DESKTOP_ENCODE_HOLD_PENDING_REAL_DELIVERY_MEASUREMENT`

Móvil:
`MOBILE_ENCODE_METADATA_ACCEPTABLE_FOR_MEASUREMENT`

No equivale a performance PASS.

---

## 4 · preload="none"

La entrega declara:
`preload="none"`

KEEP.

Ventajas:
- 0 descarga de vídeo por intención del autor antes de que la persona pulse;
- coherente con coste de datos;
- coherente con Rincón low-stimulation;
- evita precarga masiva de un asset de 151 MB.

Limitación:
`preload="none"` **no garantiza startup rápido después del gesto**.

Una vez se pulsa play importan:
- estructura del MP4;
- metadata/index;
- soporte de byte ranges;
- servidor/CDN;
- RTT;
- throughput;
- buffer policy.

Decisión:
`PRELOAD_NONE_KEEP`

---

## 5 · MP4 fast-start / moov

No existe en la evidencia preservada confirmación de:
- posición del átomo `moov`;
- uso de `-movflags +faststart`;
- MP4 fragmentado.

FFmpeg define `faststart` como un segundo paso que mueve el índice `moov` al comienzo del archivo.

Para un MP4 progresivo grande, Eco exige comprobarlo en el binario.

Gate:
- obtener offsets/atom order;
- si es MP4 no fragmentado, preferir `moov` antes de `mdat` para startup web;
- si no, medir browser startup con Range antes de ordenar cualquier remux.

Un **remux faststart**, si fuese necesario, NO reabre arte ni requiere rerender.

Estado:
`MOOV_FASTSTART_PENDING_BINARY_CHECK`

Fuente:
https://www.ffmpeg.org/ffmpeg-formats.html

---

## 6 · HTTP Range / streaming

RFC 9110 define Range y 206 Partial Content; Range es opcional en HTTP, por lo que no puede asumirse sin probar el servidor final.

Para el asset final hospedado, Eco necesita:

### HEAD / GET base
- status;
- `Content-Type: video/mp4`;
- `Content-Length`;
- cache headers;
- ETag/Last-Modified cuando proceda;
- `Accept-Ranges` si lo anuncia.

### Range real
Solicitud:
`Range: bytes=0-1048575`

Esperado si el servidor lo soporta:
- status 206;
- `Content-Range`;
- longitud parcial coherente.

Segundo Range hacia el final del archivo:
- demostrar random/late retrieval;
- útil para metadata/seek según estructura.

### Browser
Capturar:
- requests reales al pulsar;
- bytes descargados antes de `playing`;
- respuesta 200/206;
- stalls.

Estado:
`RANGE_206_PENDING_HOSTED_ASSET`

Fuente:
https://www.rfc-editor.org/rfc/rfc9110.html#name-range-requests

---

## 7 · Startup

No hay medición Eco del MP4 final.

El informe original midió controles con un clip VP9 sustituto.

Eso NO permite trasladar:
- time-to-metadata;
- time-to-first-frame;
- time-to-playing;
- bytes-to-first-frame

al H.264/AAC final.

Gate Eco mínimo:

T0 = click `Ver y escuchar`

Medir:
- `loadstart`;
- `loadedmetadata`;
- `loadeddata`;
- `canplay`;
- `playing`;
- primer frame visible cuando pueda observarse;
- bytes transferidos hasta `playing`.

Reportar:
- p50 de ≥5 ejecuciones por target;
- peor caso observado;
- conexión/perfil de red.

Estado:
`FINAL_MEDIA_STARTUP_PENDING`

---

## 8 · Buffering y seek

No existe evidencia Eco del asset final.

Capturar:
- `waiting`;
- `stalled`;
- `suspend`;
- buffer ranges;
- currentTime;
- dropped frames si API disponible;
- seek a ~2 min / 5 min / 8 min;
- tiempo hasta reanudar tras seek.

La orden de #325 exige escuchar/visionar 0/2/5/8/10 min.

Ese recorrido debe hacerse con el H.264/AAC final, no con sustituto VP9.

Estado:
`FINAL_MEDIA_BUFFERING_SEEK_PENDING`

---

## 9 · A/V sync

NORMAL:
el MP4 declara vídeo + AAC integrado.

Eco debe verificar:
- inicio simultáneo perceptivo;
- ausencia de drift en 0/2/5/8/10;
- duración de streams por ffprobe;
- start_time;
- desajuste audio/video al final.

La relación burbujas visuales/audio **no es lip-sync ni sincronización evento-a-evento**:
la entrega documenta intencionadamente 6,5 burbujas visuales/s y ~1,6 audibles/s.

Por tanto el gate no exige que cada anillo produzca sonido.

MODO SUAVE:
la entrega indica vídeo a 0,7 y audio separado sin ralentizar.

Eso es una **decisión de diseño desacoplada**, no A/V sync clásico.
Debe comprobarse confort/percepción, no exigir sincronía de eventos.

Estado:
`AV_SYNC_NORMAL_PENDING_REAL_MEDIA`
`SOFT_MODE_AUDIO_DECOUPLING_KEEP_PENDING_HUMAN_QA`

---

## 10 · Controles

La prueba VP9 sí aporta evidencia útil para la lógica UI:

- play;
- mute;
- volume;
- stop;
- fullscreen;
- mode suave;
- image only;
- keyboard/focus;
- targets;
- forced colors;
- zoom/reflow;
- reduced motion.

Eco acepta esa evidencia **solo como control/UI evidence**, no como codec/media final evidence.

Marcador:
`PLAYER_CONTROL_LOGIC_EVIDENCE_KEEP`

Al obtener el binario final:
repetir al menos play/mute/volume/stop/fullscreen con el MP4 final real para comprobar que no hay error específico de media.

---

## 11 · Performance / hardware

No hay acceso desde este Eco a:
- archivo final;
- Chrome/Safari real con asset;
- teléfono físico;
- telemetría CPU/GPU/memory de la reproducción.

Por tanto:

`PENDING_HARDWARE_QA`

Campos concretos pendientes:
- Chrome Stable desktop;
- Safari/macOS;
- iPhone/Safari;
- Android/Chrome;
- startup;
- buffering;
- seek;
- memory;
- CPU;
- GPU/video decode path si disponible;
- thermal/battery en sesión prolongada móvil;
- fullscreen;
- orientation/resize.

No inventar PASS.

---

## 12 · ¿Hace falta VP9/WebM ahora?

No.

Decisión Eco:
`VP9_WEBM_NOT_REQUIRED_WITHOUT_MEASURED_H264_DELIVERY_FAILURE`

Razón:
- H.264/AAC es un objetivo válido para Chrome/Safari;
- añadir un segundo encode aumenta:
  - almacenamiento;
  - QA;
  - source selection;
  - mantenimiento;
  - riesgo de divergencia visual.

Solo estudiar VP9/WebM o un H.264 más ligero si el H.264 actual demuestra:
- startup inaceptable;
- stalls;
- coste de datos desproporcionado;
- target browser concreto sin reproducción;
- mejora material de peso manteniendo calidad.

No rerender:
derivar desde `pecera_bu.mp4`.

---

## 13 · ¿Hace falta un encode desktop más ligero ahora?

Tampoco se autoriza todavía.

Primero medir el MP4 actual.

Si falla delivery, orden de intervención Eco recomendado:

1. **remux faststart** si `moov` no es favorable;
2. comprobar servidor/range/CDN;
3. si throughput/peso sigue siendo problema:
   - derivar H.264 web más ligero desde máster;
   - comparar calidad contra actual;
4. solo después estudiar VP9/WebM;
5. ABR/HLS únicamente si el producto realmente necesita adaptación y justifica la complejidad.

No tocar:
- composición;
- burbujas;
- detalle;
- arena;
- audio creativo

para solucionar un problema de delivery antes de demostrar que esos elementos son la causa.

---

## 14 · Móvil

Lumen:
`MOBILE_PASS`

Eco:
`MOBILE_VISUAL_GATE_ACCEPTED_FROM_LUMEN`

Desde media/delivery:
54 MB / ~0,7 Mbps declarado es sustancialmente más ligero que desktop.

Pero quedan:
- codec binary probe;
- real mobile playback;
- network startup/stall;
- memory/thermal;
- fullscreen/orientation.

Por tanto:
`MOBILE_MEDIA_HARDWARE_PENDING`

No contradice el MOBILE_PASS perceptivo de Lumen.

---

## 15 · Compatibilidad del test Chromium

La observación original es correcta:

Chromium documenta:
- H.264 como proprietary video codec limitado a Google Chrome;
- AAC como proprietary audio codec limitado a Google Chrome.

Por tanto:
un Chromium QA build sin esos codecs NO es el browser adecuado para declarar que el MP4 H.264/AAC final está roto.

Test target mínimo:
- Google Chrome Stable real;
- Safari/macOS;
- Safari/iOS si entra en población objetivo;
- Android Chrome.

Fuente:
https://www.chromium.org/audio-video/

Apple recomienda H.264 MP4 para static video delivery en Safari:
https://developer.apple.com/documentation/webkit/delivering-video-content-for-safari

---

## 16 · Incidencia C2PA

KEEP de la memoria previa:

- un chunk MP4 fue mutado por una capa de procedencia;
- gzip evitó la detección/mutación;
- reconstrucción final se declaró byte-identical.

Implicación Eco:
**hash after transport is mandatory for binary evidence**.

No mezclar esta incidencia de transporte con compatibilidad web del asset.

---

## 17 · Bloqueo actual exacto

Eco buscó los binarios por nombre en:
- conversación actual;
- Library.

No están disponibles.

GitHub conserva:
- orden;
- memoria;
- hashes;
- entrega;
- resultados Lumen;
- pero no los MP4/M4A/Opus finales.

La única ubicación canónica declarada de bytes es:
`C:\Users\mruiz\Downloads\iris-pecera-burbujas\`

Este runtime Eco no tiene acceso al filesystem local de Windows de María.

Por tanto el siguiente gate técnico necesita que los bytes finales sean visibles al entorno de QA o exista una preview/host que sirva esos mismos hashes.

Esto **no es una solicitud de rerender ni de reconstrucción**.

---

## 18 · Siguiente acción exacta

Cuando el paquete sea visible al entorno Eco, ejecutar en este orden:

### A · Hash
- SHA-256 de todos los assets;
- comparar con entrega.

### B · ffprobe
Desktop + mobile + audio standalone.

### C · estructura MP4
- atom order;
- `moov`;
- faststart;
- keyframe/GOP básico.

### D · browser branded
Chrome Stable + Safari donde sea viable.

### E · delivery host
- Content-Type;
- Content-Length;
- Range/206;
- cache;
- startup;
- seek;
- buffering.

### F · A/V
0 / 2 / 5 / 8 / 10 min.

### G · performance
desktop + móvil representativo.

Solo después:
`R61_ECO_MEDIA_QA_PASS`
o
`R61_ECO_MEDIA_QA_REWORK_DELIVERY_ONLY`.

Si REWORK:
**transcode/remux desde máster; NO rerender.**

---

## 19 · Marcadores

`R61_ECO_MEDIA_QA_PARTIAL_BINARY_ACCESS_REQUIRED`

`R61_ECO_NO_RERENDER`

`R61_ECO_NO_EVIDENCE_TO_REENCODE_YET`

`R61_ECO_PLAYER_CONTROL_LOGIC_EVIDENCE_KEEP`

`R61_ECO_FINAL_H264_AAC_PLAYBACK_PENDING`

`R61_ECO_RANGE_FASTSTART_PENDING`

`R61_ECO_AV_SYNC_PENDING`

`R61_ECO_HARDWARE_QA_PENDING`

`R61_ECO_MOBILE_MEDIA_HARDWARE_PENDING`

---

## 20 · Conclusión para Astra

Eco coincide con Lumen en el punto operativo central:

**congelar arte. No rerender.**

No existe evidencia técnica actual que obligue a:
- reducir detalle;
- cambiar composición;
- mover burbujas;
- reabrir arena;
- sustituir H.264/AAC;
- crear VP9/WebM.

Sí existe evidencia insuficiente para aprobar:
- playback final;
- streaming;
- startup;
- A/V sync;
- performance/hardware.

Por eso el estado honesto es:

`MEDIA_GATE_PENDING_FINAL_BINARY_MEASUREMENT`

No `FAIL`.

No `PASS`.

No producción.
