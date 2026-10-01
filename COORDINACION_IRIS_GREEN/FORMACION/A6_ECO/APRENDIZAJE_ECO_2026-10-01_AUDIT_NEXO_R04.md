# APRENDIZAJE ECO · AUDITORÍA NEXO R04 · 01/10/2026

Estado:
ECO_NEXO_MEDIA_AUDIT_R01_READY_FOR_NEXO

## Provenance

Este aprendizaje pertenece al carril de auditoría de Nexo y NO sustituye la formación profesional R01-R03.

Formación/continuidad previa de Eco:
- rama: eco/a6-advanced-r03-dsp-realtime-20261001
- HEAD: bcf68ad512aed95521fae0fe95c794afb0f68a34
- cierre: COORDINACION_IRIS_GREEN/FORMACION/A6_ECO/11_CIERRE_CONTINUIDAD_20261001.md

Auditoría actual:
- issue: #353
- rama: eco/a6-nexo-media-audit-r01-20261001
- base Nexo: b753746dccaba59d5968cfa1c65567a85f907ec6
- informe: COORDINACION_IRIS_GREEN/CONTROL/ECO_NEXO_MEDIA_AUDIT_R01_20261001.md
- delta: COORDINACION_IRIS_GREEN/CONTROL/DELTA_ECO_NEXO_MEDIA_AUDIT_R01_20261001.json

No se hace merge artificial entre ambas líneas durante READ-ONLY / RESEARCH / ANALYSIS.

## Qué comprobé

### Sabik actual
- El core R66 ya soporta inputMode y permite una sola ruta lógica para texto/voz.
- El mount web actual solo envía inputMode text.
- No hay micrófono, STT, TTS dinámico ni WebRTC en el mount inspeccionado.
- La voz actual son 30 WAV fijos ES/EN, opt-in y OFF por defecto.

### Evidencia de voz fija
- Materialización/hash/RIFF tienen evidencia fuerte.
- Los tests de lógica usan fakeAudio.
- No localicé un gate actual que demuestre playback real 30/30, calidad perceptual o hardware.

### Música global
- Existe una mitigación explícita para AAC/M4A: se filtra M4A cuando canPlayType no declara AAC.
- Esto corresponde a un incidente histórico reproducido: Chromium 140 fallaba AAC mientras MP3 pasaba y Chrome 152 reproducía AAC.
- No localicé un regression test específico del reproductor global.

### Rincón
- El sonido es opcional y empieza tras acción explícita.
- La mayoría de soundscapes R42 se generan first-party.
- La escena mar conserva /audio/rincon/r04/scenes.m4a y usa decodeAudioData sin fallback específico de codec.
- En un browser/build sin AAC puede perderse ese sonido sin romper necesariamente toda la experiencia.

### Motion
- R37 no expresa listening/processing/speaking como estados semánticos de voz.
- setVoiceActive AS-IS no constituye una gramática perceptual.
- La nueva decisión #353/#354 exige motion como comunicación de estado.
- R69 mejora lifecycle/reduced/no-motion, pero su movimiento continuo de traslación/rotación no debe confundirse con la nueva dirección de núcleo estable.

### Comunicación no verbal
- Sabik tiene textarea como único input conversacional visible.
- Iris Green ya tiene un corpus importante de pictogramas con ES/EN y manifiesto/licencia.
- La oportunidad es una entrada visual/AAC opcional que desemboque en el mismo submitTurn/Safety, no un segundo asistente ni una pared de iconos.

## Aprendizajes nuevos

1. Tener inputMode en el core permite añadir modalidades sin bifurcar el asistente.
2. Asset integrity PASS no equivale a audible experience PASS.
3. fakeAudio test no sustituye browser/device playback.
4. Una defensa de codec localizada debe convertirse en política/test para evitar regresión.
5. El mismo riesgo AAC ya resuelto en música aparece de otra forma en el Rincón.
6. Motion de voz debe nacer del estado conversacional, no de amplitud instantánea ni decoración.
7. Semantic motion necesita equivalentes en REDUCIDO y SIN_MOVIMIENTO.
8. Voice-first debe seguir siendo multimodal, no voice-only.
9. Una ruta no verbal útil debe reutilizar símbolos familiares y permitir confirmar/corregir.
10. El corpus de pictogramas existente reduce la necesidad de inventar un sistema visual desde cero.
11. WER/latency/network/media deben observarse por capas; no existe una métrica única de “voz funciona”.
12. No se debe recoger audio/transcript para diagnosticar red si WebRTC stats bastan.
13. Hardware/mobile sigue siendo PENDING hasta dispositivo real.

## Avances externos estudiados para esta auditoría

- W3C Media Capture and Streams: consentimiento, lifecycle y privacidad de deviceId.
- W3C WebRTC Stats: jitter buffer, concealment y métricas de playout.
- W3C COGA: símbolos familiares, claros y sin saturación.
- WAI-Adapt Symbols/AAC: dirección de interoperabilidad/personalización; no tratar draft como requisito estable.
- Safari 26.0: cambios WebRTC, incluido Speaker Selection API en iOS/iPadOS.
- OpenAI actual: GPT-Live full-duplex, Realtime y pipeline encadenado como clases de arquitectura; Realtime VAD server/semantic; evals Crawl/Walk/Run.

Córtex mantiene autoridad de provider/model. Eco usa estas fuentes para definir qué debe poder evaluarse.

## Salida para Nexo

12 hallazgos:
- MEDIA_GAP;
- VOICE_RISK;
- REALTIME_RISK;
- ACCESSIBILITY;
- PERCEPTUAL_QUALITY;
- HARDWARE_PENDING.

Prioridades Eco:
NOW = contrato multimodal + semantic motion + eval harness + audible gate.
NEXT = primer prototipo voz + visual/AAC + stats + comfort gate + regressions.
LATER = hardware real + impairment/TURN + soak + HUMAN QA perceptual.

## Próximo Eco

Leer:
1. cierre R03 en rama de formación;
2. este aprendizaje;
3. informe ECO_NEXO_MEDIA_AUDIT_R01_20261001.md;
4. delta JSON;
5. Issue #353 y síntesis de Nexo posterior;
6. Issue #354 si Sabik visual/motion sigue activo.

No asumir que los candidatos inspeccionados fueron integrados después de esta fecha. Revalidar HEAD/preview.

## Límites

No producto.
No build.
No merge.
No deploy.
No micrófono.
No provider elegido.
No SYSTEM PASS.
