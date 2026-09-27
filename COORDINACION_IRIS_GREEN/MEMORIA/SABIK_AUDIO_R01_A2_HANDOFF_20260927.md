# Sabik Audio R01 · handoff físico a A2 · 27/09/2026

Estado fuente:
`SABIK_AUDIO_LIBRARY_R01_FINAL_VERIFIED_HANDOFF_READY`

Estado operativo siguiente:
`SABIK_AUDIO_R01_A2_INTEGRATION_ORDERED`

## Artefacto exacto

Biblioteca persistente:
`/SABIK/HANDOFFS/SABIK_AUDIO_LIBRARY_R01_FINAL_VERIFIED.zip`

SHA-256:
`96e570048c5fc44ceda28b911eb2dfa8fc608099101ccd2da7b33a109e0b1f0c`

Tamaño:
5.096.173 bytes.

Contenido:
- 30 WAV;
- 15 ES;
- 15 EN;
- 15 IDs × 2 idiomas;
- manifest;
- index;
- copy spoken R02;
- QA;
- verification;
- handoff.

Verificación Astra independiente:
- 30/30 audio SHA coinciden;
- 30/30 text SHA coinciden;
- textos coinciden con copy spoken R02;
- 0 clipping;
- 0 discrepancias.

## Copy

Canónico:
`CONTROL/SABIK_COPY_PRODUCCION_R02_20260927.csv`

- 40 registros;
- 25 KEEP;
- 15 REVISED;
- 0 HOLD.

El ZIP solo contiene los 15 IDs locutados. A2 debe aplicar los 40 registros canónicos completos antes de enlazar audio.

Corrección obligatoria:
`sabik.action.low` → `Desactivar movimiento / Turn off motion`.

## A2

A2:
1. monta copy R02;
2. copia 30 WAV versionados;
3. enlaza ID/idioma/hash;
4. añade control de voz ES/EN, OFF por defecto de sesión;
5. no preload/autoplay;
6. cancela audio anterior en nuevo estado/acción/idioma/reset;
7. no locuta SCREENREADER_ONLY/UI_SCREENREADER;
8. no narra resultados dinámicos/artículos;
9. hace CI + preview + HUMAN QA.

Marcador esperado:
`SABIK_AUDIO_R01_A2_PREVIEW_READY_FOR_ASTRA`.

No main/producción.

## Cierre

Entrenamiento, selección de modelos, normalización y construcción de biblioteca fija quedan cerrados en este gate. No reabrir salvo nueva decisión de María o fallo objetivo del artefacto.
