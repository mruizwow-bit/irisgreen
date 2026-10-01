# APRENDIZAJE ECO · R03 · 01/10/2026

## Estado

`ECO_ADVANCED_R03_DSP_REALTIME_MOBILE_EVAL_STUDIED_PRACTICED`

Rama:
`eco/a6-advanced-r03-dsp-realtime-20261001`

Base:
`d9b6f46f1005db990102c05f18c40709bca6ea8b`

## Qué profundicé

### DSP
- RMS vs peak vs loudness;
- crest factor;
- clipping y armónicos;
- SNR;
- FFT / Welch PSD;
- resampling;
- Nyquist;
- antialiasing;
- filtros SOS;
- fase/correlación;
- mono fold;
- silence detection.

### Realtime
- RTP audio level;
- VAD vs audio-level vs DTX;
- Opus;
- PLC;
- in-band FEC;
- WebRTC stats;
- jitter buffer;
- concealment;
- RTT;
- full duplex;
- barge-in;
- endpointing.

### Mobile
- Android latency;
- AAudio/Oboe;
- xruns;
- callbacks;
- 48 kHz/device native rate;
- Apple AVAudioSession;
- voiceChat;
- route changes;
- Bluetooth HFP;
- interruptions/background.

### Streaming
- HLS;
- LL-HLS;
- CMAF;
- MSE;
- WebCodecs.

### Eval
- NIST sclite/WER;
- critical entity errors;
- P.85 TTS;
- Crawl/Walk/Run;
- transcript ≠ ground truth;
- task vs audio axes;
- p50/p95 latency;
- production failure → fixture.

### Privacy/security
- Media Capture privacy indicators;
- deviceId fingerprinting;
- permission lifecycle;
- WebRTC security/IP handling.

## Laboratorio R03

Toolchain:
- NumPy 2.3.5;
- SciPy 1.17.0;
- FFmpeg 7.1.5;
- 48 kHz.

### Clean 1 kHz

- peak: -6.0206 dBFS;
- RMS: -9.0309 dBFS;
- crest: 3.0103 dB;
- THD armónica prácticamente nula.

### Hard clipping

Input peak: 1.35 digital.  
Postclip: 1.0.

- ≈45.8 % de muestras del seno ideal sobrepasaban full scale antes de clip;
- RMS ≈ -1.78 dBFS;
- crest ≈ 1.78 dB;
- THD armónica ≈ 0.1169.

Aprendizaje:
clipping es una no linealidad espectral, no una simple subida de volumen.

### SNR

Target: 20 dB.  
Measured: ≈19.98 dB.

### Phase

- in-phase correlation +1;
- anti-phase correlation -1;
- anti-phase fold-to-mono RMS = 0.

FFmpeg:
peak/RMS de mono = `-inf`.

### Resampling

48k → 16k → 48k:
- 1 kHz preservado;
- 10 kHz atenuado ≈ -114.6 dB.

### Voice-band filter

Butterworth order 6 SOS, 300–3400:
- 10 kHz ≈ -70.2 dB relativo a 1 kHz.

### Silence fixture

1 s silence + 2 s tone + 1 s silence.

Python:
active ≈ 1.00002–3.000 s.

FFmpeg silencedetect:
- 0–1.000021;
- 3–4.

## Nuevos principios

1. Una sola métrica nunca representa calidad de audio.
2. Nivel y voz activa no son lo mismo.
3. VAD y endpointing son parte del UX, no un detalle invisible.
4. FEC cambia la relación loss/bitrate/latency.
5. Jitter buffer puede mejorar continuidad aumentando delay.
6. Mobile routing es estado dinámico.
7. Bluetooth es una condición técnica, no “el mismo audio por otro altavoz”.
8. Transcript no es ground truth.
9. La acción real del backend debe verificarse aparte de lo que la voz afirma.
10. Un eval voice serio necesita audio + traces + task state.
11. WebCodecs API no garantiza ningún codec.
12. HLS/LL-HLS no es sustituto de transporte conversacional realtime.

## OpenAI provider context actualizado

A 01/10/2026, la documentación pública actual distingue:
- GPT-Live full duplex con backend delegado;
- Realtime session speech-to-speech;
- pipeline chained;
- file/realtime transcription;
- TTS streaming;
- VAD configurable;
- evals de voz con task success + audio timing.

Eco no elige provider/model.
Eco valida el comportamiento observable.

## Pendientes que siguen necesitando hardware/entorno

- mic real;
- echo físico;
- Bluetooth HFP;
- iOS/Safari;
- Android devices;
- network impairment WebRTC real;
- TURN;
- STT corpus Sabik;
- TTS Sabik real;
- 30–60 min soak;
- interruptions OS.

## Archivos R03

- `08_ESPECIALIZACION_R03_DSP_REALTIME_MOBILE.md`
- `09_METODOLOGIA_EVAL_STT_TTS_VOICE_R03.md`
- `10_RUNBOOK_DEGRADACION_REALTIME_Y_HARDWARE.md`
- `EVIDENCIA/ECO_DSP_LAB_20261001.json`
- este aprendizaje.

## Regla al siguiente Eco

No repetir teoría como si fuera nueva.
Empieza por:
- qué cambió desde esta fecha;
- qué hardware real está disponible;
- qué runtime Sabik existe;
- qué navegador/provider cambió;
- qué fallo real merece convertirse en fixture.
