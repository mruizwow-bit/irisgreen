# Sabik Audio R01 · integración A2 · 27/09/2026

**Estado:** `SABIK_AUDIO_R01_A2_RUNTIME_PREVIEW_READY_WAV_TRANSFER_BLOCKED`.

## Autoridad
- #289 · R42-A2, puerta única web.
- Handoff final: `SABIK_AUDIO_LIBRARY_R01_FINAL_VERIFIED_HANDOFF_READY`.
- Artefacto canónico en Library: `/SABIK/HANDOFFS/SABIK_AUDIO_LIBRARY_R01_FINAL_VERIFIED.zip`.
- SHA-256: `96e570048c5fc44ceda28b911eb2dfa8fc608099101ccd2da7b33a109e0b1f0c`.

## Integración verificada
- A2 integró PR #310 Home R42 + child-safe sobre la rama `agent2/sabik-iris-r08-20260924`.
- La Deploy Preview de PR #244 muestra la Home R42 ES/EN y el control visible `Voz de Sabik / Sabik voice`.
- Copy R02 aplicado: 40 registros = 25 KEEP + 15 REVISED + 0 HOLD.
- Runtime canónico único: `sabik/audio-r01.mjs`.
- Manifest canónico: `sabik/assets/audio-r01/manifest.runtime.json`.
- Voz OFF por defecto de sesión; activación explícita; `aria-pressed`; sin persistencia nueva.
- Cambio de idioma, nueva acción/estado, reset y desactivación cancelan el audio anterior.
- No preload/autoplay y no narración dinámica de resultados o artículos.
- `UI_SCREENREADER` / `SCREENREADER_ONLY` no se convierten en voz propia de Sabik.
- Build publica `.json` y `.wav` bajo `sabik/assets/audio-r01/`.
- Gate fail-closed: `scripts/test_sabik_audio_assets_r01.py` exige exactamente 30 WAV, 15 ES + 15 EN, RIFF/WAVE válido y SHA-256 exacto por manifest.

## Evidencia
- Home R42 child-safe: workflow A8 PASS en A2.
- En la secuencia A2 vigente pasan runtime Sabik, copy R02, transporte y build.
- HTTP real de preview:
  - manifest R01: disponible;
  - `/sabik/assets/audio-r01/es/sabik__welcome.wav`: 404.
- No se ha publicado main ni producción.

## Bloqueo exacto
Los 30 WAV exactos están verificados en el artefacto de Library, pero no están todavía en el árbol GitHub. El conector GitHub disponible no acepta una referencia binaria de Library/local para crear blobs; el entorno de contenedor no dispone de salida de red. No se encontró copia byte-idéntica de los WAV finales en ramas/histórico Git reutilizable.

Por tanto:
- el runtime, copy, UI, manifest y QA estructural están montados;
- el gate final **debe fallar** mientras falte cualquier WAV;
- no se emite `SABIK_AUDIO_R01_A2_PREVIEW_READY_FOR_ASTRA`;
- HUMAN QA de voz no comienza hasta 30/30 assets + HTTP/MIME/hash PASS.

## Restricciones conservadas
No main · no producción · no regeneración/retraining · no modelos/weights/masters humanos en Git · no Team Login/secrets · no narración dinámica.
