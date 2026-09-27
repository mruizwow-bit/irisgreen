# Sabik · Copy de producción R02 · 27/09/2026

Estado: `SABIK_COPY_PRODUCCION_R02_FINAL_FIXED_AUDIO_BOUND`.

## Fuente actual

- PR #244.
- HEAD inspeccionado: `bf44d6ae7aa362b81fadb16b44bdef358cc31bcc`.
- Se revisaron los archivos runtime de Sabik del panel, montaje, retrieval, motion y transporte.
- No se detectaron nuevas cadenas visibles que amplíen los 40 registros del inventario R01.

## Resultado

- 40 registros fijos.
- KEEP: 25.
- REVISED: 15.
- HOLD: 0.
- Locución propia de Sabik: 10 `SYSTEM_VOICE` + 5 `SYSTEM_VOICE_OPTIONAL`.
- UI/screen reader no se convierte en audio propio de Sabik salvo cambio de producto explícito.

El único HOLD de R01 queda resuelto por inspección del código actual: `lowIntensity=true` fuerza `SIN_MOVIMIENTO`. Por tanto el copy revisado del control pasa de **Bajar intensidad / Lower intensity** a **Desactivar movimiento / Turn off motion**, que describe el efecto real.

## Voz y postproceso

- EN: R02 exacto validado contra V6_12_T01.
- ES: E0 seleccionado como SABIK_ES_V1.
- Normalización post-síntesis obligatoria: **-16.5 LUFS integrados**.
- Pico de muestra objetivo: **≤ -1 dBFS**.
- Sin cambio de pitch, tempo o timbre; sin EQ/compresión por defecto.

## Audio final asociado

- 30 WAV = 15 ES + 15 EN.
- ZIP original SHA-256: `fd6f73544fbd6153c077a302a275b7d893cee4e49104d7140ca7153b2a49eadc`.
- Handoff verificado SHA-256: `96e570048c5fc44ceda28b911eb2dfa8fc608099101ccd2da7b33a109e0b1f0c`.
- Manifest SHA-256: `dd4a44d222d6fbbade669a32a705d08fe5601ac11c39911105df8cb37d71d4d9`.
- EN model SHA-256: `3aec07b84f81b199af25e170a044b51c96b54f9ec24ed4b77bc3a13b4f47e9df`.
- ES model SHA-256: `8100e9770471094efae26c186c9020056c35c55e9b0822aaec800f1affd1c291`.
- Loudness: -16.5 LUFS; peak ≤ -1 dBFS; 0 clipping.

## Siguiente gate

A2 integra sobre el HEAD vigente: actualiza el copy fijo a R02, añade assets de audio versionados, enlaza reproducción únicamente bajo control del usuario, mantiene `SCREENREADER_ONLY` fuera de la voz propia de Sabik y ejecuta QA ES/EN en preview.

No main · no producción · no publicación de masters humanos/modelos entrenados.
