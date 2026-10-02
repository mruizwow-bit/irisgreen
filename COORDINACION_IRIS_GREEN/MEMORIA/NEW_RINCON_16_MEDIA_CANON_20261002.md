# NUEVO RINCÓN · 16 PIEZAS AUDIOVISUALES · CANON · 02/10/2026

## Precedencia
- `NEW_RINCON = PRODUCT_BASE`
- `OLD_RINCON = DONOR_ONLY`
- `5MIN = FINAL PRODUCT TARGET`
- `10MIN = MASTER/DONOR ONLY WHEN IT EXISTS`
- producción **una pieza cada vez**
- no activar la siguiente hasta `ITEM_PASS` de la actual
- todo queda en GitHub + MEMORIA + CONTROL/evidencia + HANDOFF cuando cambie owner

## Dos familias

### A · Vídeos relajantes = ventana/paisaje
Plano amplio, paleta natural, cámara quieta o casi quieta, pieza con principio y final.

1. A1 · **Acuario / Pecera R61**
2. A2 · **Medusas**
3. A3 · **Mar**
4. A4 · **Río**
5. A5 · **Lluvia en la ventana**
6. A6 · **Noche estrellada**
7. A7 · **Bosque**
8. A8 · **Brasas**

### B · Sala sensorial = instrumento visual
Fondo oscuro/liso, un objeto o fenómeno luminoso principal, cámara quieta, ciclo lento, bucle sin costura.

1. B1 · **Tubo de burbujas**
2. B2 · **Discos líquidos**
3. B3 · **Espejo infinito**
4. B4 · **Cielo de estrellas**
5. B5 · **Columna de cera**
6. B6 · **Cáusticas**
7. B7 · **Velos de color**
8. B8 · **Lluvia de luz**

## Audio canónico
- first-party;
- sin voz;
- sin muestras externas si no hacen falta;
- low-stimulation;
- sin picos/ataques bruscos;
- target técnico aproximado: -23 LUFS, a verificar por Eco;
- el producto arranca muted;
- control propio accesible Activar/Quitar audio;
- quitar audio no detiene imagen.

## Pipeline por pieza

`LUMEN VISUAL/REUSE GATE`
→ `ECO AUDIO PROTOTYPE`
→ `ASTRA + MARÍA PROTOTYPE GATE`
→ `LUMEN FINAL ~5 MIN`
→ `ECO FINAL MEDIA QA`
→ `MOTOR COMMON PLAYER INTEGRATION`
→ `AXIOMA ACCESSIBILITY/MOTION QA`
→ `ASTRA + MARÍA FINAL GATE`
→ `ITEM_PASS`
→ activar siguiente pieza.

### Excepción de reutilización
Si una pieza ya existe visualmente a ~5 min y está aprobada (A1 Pecera), Lumen no rerenderiza: valida KEEP y Eco añade/corrige audio; después sigue el resto del pipeline.

## Orden de producción canónico

1. **A1 Acuario/Pecera R61** — actual
2. **A3 Mar** — prototipo recibido
3. **B2 Discos líquidos** — prototipo recibido
4. **A2 Medusas**
5. **A4 Río**
6. **A5 Lluvia en la ventana**
7. **A6 Noche estrellada**
8. **A7 Bosque**
9. **A8 Brasas**
10. **B1 Tubo de burbujas**
11. **B3 Espejo infinito**
12. **B4 Cielo de estrellas**
13. **B5 Columna de cera**
14. **B6 Cáusticas**
15. **B7 Velos de color**
16. **B8 Lluvia de luz**

El orden prioriza: cerrar primero la pieza más avanzada (Pecera), después los dos pilotos ya recibidos (Mar y Discos), y luego completar el catálogo sin producción masiva.

## Estado actual

### ACTIVE
`A1_ACUARIO_PECERA_R61`

Checkpoint Lumen completado:
`RINCON_A1_LUMEN_VISUAL_KEEP_PASS`

Binario exacto que pasa a Eco:
- archivo canónico: `pecera_10min_parte1_de_2.mp4`;
- copia Library verificada: `pecera_10min_parte1_de_2(1).mp4`;
- ambas copias son byte-identical;
- SHA-256: `8b2e5e7cb28e9ccfbf1a045c718fd9201f8cac6e2c92ee707545c386693a1e8f`;
- tamaño: `19.838.329 B`;
- duración: `300.083333 s` ≈ 5:00;
- H.264 High;
- 960×540;
- 24 fps;
- bitrate vídeo: ~526.758 bps;
- bitrate total: ~528.875 bps;
- 1 stream de vídeo;
- **0 streams de audio**.

Revisión Lumen:
- visual KEEP;
- cámara fija/estable;
- composición mantiene profundidad por capas, vegetación, peces y columna lateral de burbujas;
- variación lenta perceptible a lo largo de los 5 min;
- sin cortes detectados en barrido de scene-change >0,08;
- muestreo temporal de luminancia estable: rango aproximado 2,06/255 en muestras de 1 s;
- cambio visual 0,25 s contenido: media ~2,13/255, p95 ~2,59/255, máximo ~3,03/255;
- decode completo del vídeo: 0 errores ffmpeg;
- no se observa defecto visual que justifique rerender;
- **no cambiar arte por duración**.

Checkpoint Eco completado:
`RINCON_A1_ECO_AUDIO_MEDIA_PASS`

Audio first-party:
- archivo: `A1_pecera_audio_firstparty_5min.m4a`;
- SHA-256: `36e7b00ccb4b268a8b7f1a4d640af7564585bd549071e5061fd291c2c871000e`;
- tamaño: 4.886.202 B;
- AAC-LC · 48 kHz · estéreo · ~128.730 bps;
- duración de stream: 300.083 s;
- integrada: −23,03 LUFS;
- LRA: 1,90 LU;
- true peak: −10,58 dBTP;
- 0 voz / 0 música / 0 samples externos;
- cuerpo de agua + 275 resonancias de burbuja irregulares;
- seed determinista: 61012026;
- >98,1 % de la energía espectral medida queda por debajo de 1 kHz.

Mux final:
- archivo: `A1_pecera_5min_AV_ECO_R01.mp4`;
- SHA-256: `7bd18bd4aac9373fcb2ccbc25ceb8ae7e9fefeead3c161a4eb5cf343a74012c3`;
- tamaño: 24.789.723 B;
- H.264 High 3.1 + AAC-LC;
- 960×540 · 24 fps;
- duración: 300.083333 s;
- delta A/V: 0,000333 s;
- vídeo copiado sin recodificar: hash elemental H.264 antes/después idéntico `771f88e17784fccc6dff36260366b6cfc2c6b3e2ecc2a7ae1d1c0aa215f6973b`;
- full ffmpeg decode: PASS;
- faststart aplicado: `moov` pasa de casi el final del input a offset 36 del mux final.

Browser lab:
- Chromium 144.0.7559.96;
- exact mux final;
- H.264/AAC `canPlayType=probably`;
- play/unmute/seek PASS;
- 0 dropped / 0 corrupted en la muestra;
- HTTP Range/206 queda pendiente hasta disponer de player/host real.

Evidencia:
`COORDINACION_IRIS_GREEN/EVIDENCIA/NEW_RINCON_16_MEDIA_20261002/A1_ECO_AUDIO_MEDIA_EVIDENCE.json`

Generador:
`COORDINACION_IRIS_GREEN/EVIDENCIA/NEW_RINCON_16_MEDIA_20261002/A1_ECO_AUDIO_GENERATOR_R01.py`

Handoff:
`COORDINACION_IRIS_GREEN/HANDOFFS/NEW_RINCON_16_MEDIA_20261002/A1_ECO_AUDIO_MEDIA_PASS.md`

Checkpoint Lumen final AV completado:
`RINCON_A1_LUMEN_FINAL_AV_PASS`

Inputs verificados:
- visual KEEP original: `pecera_10min_parte1_de_2.mp4`
  - SHA-256 `8b2e5e7cb28e9ccfbf1a045c718fd9201f8cac6e2c92ee707545c386693a1e8f`
- mux Eco: `A1_pecera_5min_AV_ECO_R01.mp4`
  - SHA-256 `7bd18bd4aac9373fcb2ccbc25ceb8ae7e9fefeead3c161a4eb5cf343a74012c3`
- audio separado: `A1_pecera_audio_firstparty_5min.m4a`
  - SHA-256 `36e7b00ccb4b268a8b7f1a4d640af7564585bd549071e5061fd291c2c871000e`

Control audiovisual Lumen:
- vídeo H.264 del mux = **idéntico bit a bit** al visual KEEP;
- hash elemental Annex-B antes/después:
  `771f88e17784fccc6dff36260366b6cfc2c6b3e2ecc2a7ae1d1c0aa215f6973b`;
- 7.202 fotogramas en ambos;
- 300.083333 s en ambos;
- audio embebido = bitstream AAC idéntico al M4A separado;
- audio: AAC-LC · 48 kHz · estéreo · 300.083 s;
- integrada independiente: ~−23.0 LUFS;
- LRA: ~1.8–1.9 LU;
- true peak: ~−10.6 dBTP;
- estéreo equilibrado;
- fade-in/fade-out suave;
- tramo central sin ataques bruscos: cambio RMS p95 <1 dB por 50 ms, máximo observado ~1.8 dB;
- ~98,1 % de energía espectral bajo 1 kHz;
- sin voz, sin música, sin samples externos;
- cuerpo de agua + burbujas irregulares first-party.

Juicio:
- `VISUAL_UNCHANGED_PASS`;
- `AUDIO_LOW_STIMULATION_PASS`;
- `AUDIO_FITS_AQUARIUM_PASS`;
- `NO_DISTRACTING_PEAKS_EVENTS`;
- `RELAXING_WINDOW_FAMILY_KEEP`;
- `NO_RERENDER`.

Siguiente etapa planificada:
`MOTOR_COMMON_PLAYER_INTEGRATION`

Pero **NO se entrega todavía a Motor**:
`WAIT_MOTOR_RELEASE`
`DO_NOT_INTERRUPT_MOTOR_FOR_RINCON`.

No handoff a Motor.
No Astra.
No Axioma.
No A3.
No B2.
Cola congelada por `ONE ACTIVE MEDIA ITEM ONLY`.

### QUEUED
A3, B2, A2, A4, A5, A6, A7, A8, B1, B3, B4, B5, B6, B7, B8.

## Regla de WIP
`ONE ACTIVE MEDIA ITEM ONLY`

Nadie empieza la pieza siguiente por adelantado.


## Restricción temporal de Motor

María confirma que Motor está cerrando temporalmente el carril de Nexo porque Nexo se ha bloqueado.

Mientras siga esa cobertura:

- Motor = ocupado con R44/Suite5;
- Rincón no debe interrumpirlo;
- la etapa de player de A1 queda `WAIT_MOTOR_RELEASE`;
- Lumen/Eco/Lumen pueden avanzar A1 hasta el handoff previo al player;
- Axioma espera al player;
- A3 no se activa hasta `RINCON_A1_FINAL_PASS`.

Regla:
`DO_NOT_INTERRUPT_MOTOR_FOR_RINCON`
