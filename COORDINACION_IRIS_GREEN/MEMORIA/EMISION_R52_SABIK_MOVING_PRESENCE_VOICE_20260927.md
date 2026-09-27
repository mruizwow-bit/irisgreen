# R52 · restauración Sabik móvil + voz final · 27/09/2026

Issue: #315
Estado: `R52_SABIK_MOVING_PRESENCE_RESTORE_ORDERED`

## Corrección de precedencia

María aclara que el Sabik anterior ya se movía correctamente y estaba configurado; la pieza pendiente era la voz.

La versión R37 posterior simplificó la presencia a cinco PNG + transiciones breves y dejó PRESENTE inmóvil. Esa simplificación no representa la continuidad visual final aprobada.

## Donante móvil exacto

`sabik-preview@fc5cdfc2f978c85033de2b07c34309f8a4a7bd18`

Blobs:
- CSS: `b38a95b8994de2e20cfb0b8f29e58a69253325a9`
- JS: `7dfb2059d8362174519b1f3e135ed0156120eb73`
- markup /es/nea/: `321d4780b5471bb403928082d1e105e0d22aa193`

Este donante contiene la presencia móvil por capas:
- órbitas;
- núcleo;
- puntos;
- ondas;
- animaciones continuas;
- reduced motion;
- estados de interacción.

## Regla

Restaurar presencia visual móvil, NO la página antigua.

Mantener:
- panel actual;
- retrieval actual;
- safety actual;
- R42/R49/R50;
- cinco estados B3 actuales.

No recuperar inferencias cognitivas antiguas como evaluación del usuario.

## Voz

Única ampliación nueva:
`SABIK_AUDIO_LIBRARY_R01_FINAL_VERIFIED`
SHA `96e570048c5fc44ceda28b911eb2dfa8fc608099101ccd2da7b33a109e0b1f0c`.

El visual móvil debe reaccionar suavemente a voice-start/voice-end usando las capas de onda ya presentes en el donante. No lip sync, no cara, no emoción.

## Responsables

A3 restaura/adapta presencia:
`R52_A3_SABIK_MOVING_PRESENCE_RESTORED_READY_FOR_A2`.

A2 integra + 30 WAV + preview:
`R52_A2_SABIK_MOVING_AND_SPEAKING_PREVIEW_READY_FOR_ASTRA`.

Después Astra → HUMAN QA María.

No main/producción.
