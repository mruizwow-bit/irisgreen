# NUEVO RINCÓN · A1 PECERA · LUMEN FINAL AUDIOVISUAL CHECK

Fecha: 02/10/2026  
Owner: **Lumen · A7 — Immersive Media & Interactive Audiovisual Engineer**  
Issue: #368  
Precondición recibida: `RINCON_A1_ECO_AUDIO_MEDIA_PASS`

Estado:
`RINCON_A1_LUMEN_FINAL_AV_PASS`

## Alcance

Solo:
- confirmar que el mux no alteró el visual KEEP;
- confirmar que el audio first-party encaja con Pecera y baja estimulación;
- comprobar que no introduce picos/eventos incompatibles;
- confirmar que la pieza sigue perteneciendo a la familia **RELAXING / ventana**.

No:
- player;
- Motion3;
- accesibilidad;
- A3;
- B2;
- otras piezas;
- rerender.

## Inputs

### Visual KEEP original
`pecera_10min_parte1_de_2.mp4`

SHA-256:
`8b2e5e7cb28e9ccfbf1a045c718fd9201f8cac6e2c92ee707545c386693a1e8f`

### Mux final Eco
`A1_pecera_5min_AV_ECO_R01.mp4`

SHA-256:
`7bd18bd4aac9373fcb2ccbc25ceb8ae7e9fefeead3c161a4eb5cf343a74012c3`

### Audio first-party separado
`A1_pecera_audio_firstparty_5min.m4a`

SHA-256:
`36e7b00ccb4b268a8b7f1a4d640af7564585bd549071e5061fd291c2c871000e`

## 1 · Integridad visual del mux

Original y mux:
- H.264 High;
- 960×540;
- 24 fps;
- 300.083333 s;
- 7.202 frames.

Hash del elementary H.264 convertido a Annex-B:
- original:
  `771f88e17784fccc6dff36260366b6cfc2c6b3e2ecc2a7ae1d1c0aa215f6973b`
- mux:
  `771f88e17784fccc6dff36260366b6cfc2c6b3e2ecc2a7ae1d1c0aa215f6973b`

Resultado:
`VIDEO_BIT_IDENTICAL_PASS`

El mux no ha alterado el visual.

No rerender.

## 2 · Integridad del audio

Audio separado:
- AAC-LC;
- 48 kHz;
- estéreo;
- 300.083 s;
- ~128.730 bps.

El bitstream AAC del mux y el M4A separado producen el mismo hash de stream:
`d1fdc7106d2c9040cd76963d201feba6a48af4389e4ed4d69927dcd04158dc62`

Resultado:
`EMBEDDED_AUDIO_MATCHES_SEPARATE_PASS`.

A/V:
- ambos arrancan en 0;
- diferencia de duración ≈0,000333 s.

## 3 · Low-stimulation / dinámica

Medición independiente del audio:
- integrada ≈ `−23.0 LUFS`;
- LRA ≈ `1.8 LU`;
- true peak ≈ `−10.6 dBTP`;
- RMS de los dos canales prácticamente equilibrado;
- 100 ms RMS central:
  - mediana ≈ −25,36 dBFS;
  - máximo ≈ −22,51 dBFS;
- cambios de RMS cada 50 ms, excluyendo fades:
  - p95 ≈ 0,95 dB;
  - p99 ≈ 1,25 dB;
  - máximo ≈ 1,80 dB;
- fade-in suave durante los primeros segundos;
- fade-out suave al final;
- sin ataques/picos abruptos detectados.

Espectro:
- mediana de centroide ≈409,6 Hz;
- ≈98,12 % de energía media bajo 1 kHz;
- energía >=6 kHz residual.

Esto es coherente con un ambiente estable, grave/medio-bajo y poco intrusivo.

Resultado:
`AUDIO_LOW_STIMULATION_PASS`.

## 4 · Encaje con Pecera

La evidencia reproducible de Eco describe:
- cuerpo de agua first-party;
- 275 resonancias de burbuja irregulares;
- 0 voz;
- 0 música;
- 0 samples externos.

Combinado con:
- espectro fuertemente concentrado bajo 1 kHz;
- dinámica estrecha;
- ausencia de picos;
- fades suaves;
- visual de cámara fija y movimiento lento ya KEEP,

la pieza conserva la identidad:
`RELAXING_WINDOW / ACUARIO`.

Resultado:
`AUDIO_FITS_AQUARIUM_PASS`.

No se detecta una razón audiovisual para reabrir arte o audio.

## 5 · Decisión Lumen

`RINCON_A1_LUMEN_FINAL_AV_PASS`

Subresultados:
- `VIDEO_BIT_IDENTICAL_PASS`
- `AUDIO_LOW_STIMULATION_PASS`
- `AUDIO_FITS_AQUARIUM_PASS`
- `NO_DISTRACTING_PEAKS_EVENTS`
- `RELAXING_WINDOW_FAMILY_KEEP`
- `NO_RERENDER`

## 6 · STOP / cadena

La siguiente etapa del pipeline será:
`MOTOR_COMMON_PLAYER_INTEGRATION`

pero Motor permanece:
`WAIT_MOTOR_RELEASE`

Regla:
`DO_NOT_INTERRUPT_MOTOR_FOR_RINCON`

Por instrucción de María:
- **NO handoff a Motor todavía**;
- NO Astra;
- NO Axioma.

A1 queda:
`ACTIVE · WAIT_MOTOR_RELEASE`

No activar A3.
No activar B2.
No trabajar ninguna otra pieza.

`ONE ACTIVE MEDIA ITEM ONLY`.
