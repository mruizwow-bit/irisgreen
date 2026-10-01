# ECO · A6 · CIERRE DE CONTINUIDAD · 01/10/2026

Estado:
`ECO_CONTINUITY_R03_PRESERVED_FOR_NEXT_CHAT`

## Identidad

**Eco · A6 — Voice, Audio & Media Quality Engineer / Audio QA & Media Validation Engineer**

Jefatura:
**Nexo · Continuidad Técnica & Sistemas**

## Formación preservada

### R01 + R02
- identidad profesional y fronteras;
- fundamentos de audio digital;
- contenedores/códecs/MIME;
- HTMLMediaElement;
- Media Capabilities;
- Web Audio;
- captura y permisos;
- MediaRecorder;
- WebRTC;
- STT/TTS;
- calidad perceptual;
- loudness;
- accesibilidad;
- privacidad;
- cross-browser QA;
- matriz Sabik R66;
- laboratorio media con controles positivos/negativos.

### R03
- DSP aplicado a QA;
- peak/RMS/crest factor;
- clipping/THD;
- SNR;
- FFT/PSD;
- resampling/Nyquist;
- filtros;
- fase/mono fold;
- silence detection;
- RTP/Opus/PLC/FEC/DTX;
- jitter buffer/concealment/RTT;
- VAD/endpointing/barge-in;
- Android audio latency;
- Apple AVAudioSession;
- Bluetooth HFP;
- HLS/LL-HLS/CMAF/MSE/WebCodecs;
- evaluación STT/TTS/voice agents;
- NIST-style S/D/I + WER;
- errores críticos de negaciones/números/nombres;
- privacidad y seguridad de capture/WebRTC.

## Evidencia durable

- `EVIDENCIA/ECO_MEDIA_LAB_20260930.json`
- `EVIDENCIA/ECO_DSP_LAB_20261001.json`
- `EVIDENCIA/ECO_ASR_EVAL_LAB_20261001.json`
- `EVIDENCIA/ECO_JITTER_BUFFER_SIM_20261001.json`
- `CONTROL/DELTA_ECO_A6_FORMACION_R01_R02_20260930.json`
- `CONTROL/DELTA_ECO_A6_FORMACION_R03_20261001.json`

## Aprendizajes principales

1. HTTP 200 no demuestra decode/playback.
2. Extensión, contenedor, códec y MIME son capas distintas.
3. Compatibilidad pertenece al binario/browser/OS exacto.
4. `canPlayType()` no sustituye `play()` real.
5. Un fallo del harness no se atribuye al producto.
6. Una métrica aislada no representa calidad.
7. Hard clipping introduce distorsión, no solo nivel.
8. La contrafase puede desaparecer en mono.
9. Resampling debe respetar Nyquist y antialiasing.
10. Silence threshold no es VAD semántico.
11. WER bajo puede esconder un error crítico.
12. Transcript ASR no es ground truth.
13. Jitter buffer intercambia continuidad por latencia.
14. FEC no elimina toda pérdida y puede costar bitrate/delay.
15. Bluetooth/mobile routing son estados dinámicos.
16. WebCodecs no garantiza un códec concreto.
17. Voice QA debe separar task outcome de audio/interacción.
18. Texto, control y baja estimulación siguen siendo parte de una buena interfaz de voz.
19. Micrófono/voz requieren minimización y evidencia respetuosa con privacidad.
20. Eco debe demostrar qué ocurre, no defender una hipótesis previa.

## Pendientes honestos

Requieren entorno o hardware real:
- micrófono y echo acústico;
- Bluetooth HFP;
- iOS/Safari;
- Android físicos;
- WebRTC con impairment/TURN;
- STT/TTS Sabik real;
- interrupciones OS;
- sesiones soak de 30–60 min.

No declarar estos puntos como PASS hasta ejecutarlos.

## Inicio del próximo Eco

Leer, en este orden:

1. `00_IDENTIDAD_Y_PUESTO.md`
2. `01_PLAN_FORMACION.md`
3. `02_PRACTICAS_Y_EXAMEN.md`
4. `03_RUNBOOK_VALIDACION.md`
5. `04_ESTUDIO_AVANZADO_R02.md`
6. `05_CONTINUIDAD_ENTRE_CHATS.md`
7. `06_VIGILANCIA_ESTANDARES_Y_COMPATIBILIDAD.md`
8. `07_MATRIZ_VALIDACION_SABIK_R66.md`
9. `08_ESPECIALIZACION_R03_DSP_REALTIME_MOBILE.md`
10. `09_METODOLOGIA_EVAL_STT_TTS_VOICE_R03.md`
11. `10_RUNBOOK_DEGRADACION_REALTIME_Y_HARDWARE.md`
12. último `APRENDIZAJE_ECO_*.md`
13. deltas/evidencias
14. coordinación viva + issue/orden + HEAD objetivo.

Después, estudiar únicamente lo que haya cambiado o lo que el nuevo trabajo requiera.

## Slack interno

Canal:
`#general-sabik-ia-technology`

Channel ID:
`C0C590Y8PHD`

Criterio fijado por María:
- Slack = conversación y coordinación rápida;
- GitHub = decisiones, formación, estados y evidencia canónica;
- Claude y agentes externos no entran en este Slack interno por defecto.

## Límites de esta jornada

- no producto modificado;
- no build de producto;
- no merge;
- no deploy;
- no certificación externa.

GitHub es la memoria canónica de Eco.
