# Sabik · Copy de producción R02 · 27/09/2026

Estado: `R02_FIXED_SYSTEM_COPY_REFRESHED_EDITORIALLY_REVIEWED_AUDIO_CANDIDATE`.

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

## Siguiente gate

Generar los 15 textos locutables en ES/EN como `SABIK_AUDIO_LIBRARY_R01_CANDIDATE`, registrar hashes por texto/modelo/audio y pasar HUMAN QA antes de integrar o desplegar.

No se publican masters humanos/modelos en GitHub.
