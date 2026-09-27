# A2 · integrar SABIK AUDIO R01 FINAL_VERIFIED · 27/09/2026

Estado de entrada: `SABIK_AUDIO_LIBRARY_R01_FINAL_VERIFIED_HANDOFF_READY`.

## Artefacto canónico

Library:
`/SABIK/HANDOFFS/SABIK_AUDIO_LIBRARY_R01_FINAL_VERIFIED.zip`

SHA-256:
`96e570048c5fc44ceda28b911eb2dfa8fc608099101ccd2da7b33a109e0b1f0c`

Bytes: 5.096.173.

Verificación Astra:
- 36 entradas ZIP;
- 30 WAV;
- 15 ES + 15 EN;
- 30/30 hashes internos coinciden con `manifest.json`;
- 30/30 `machine_qa=PASS`.

No usar el ZIP original ni candidatos anteriores. No regenerar audio.

## Copy

Aplicar antes de enlazar WAV:
`CONTROL/SABIK_COPY_PRODUCCION_R02_20260927.csv`

Contrato:
- 40 registros;
- 25 KEEP;
- 15 REVISED;
- 0 HOLD.

Obligatorio:
- `sabik.status.unavailable` → “La búsqueda en fuentes todavía no está disponible.” / “Source search is not available yet.”
- `sabik.status.available` → “La búsqueda en fuentes está disponible.” / “Source search is available.”
- `sabik.action.low` → “Desactivar movimiento” / “Turn off motion”.

## Control de voz

Añadir control visible/accesible ES/EN en Sabik:
- voz OFF por defecto cada sesión;
- activación explícita;
- no persistencia nueva;
- no autoplay;
- al desactivar, cancelar audio;
- al cambiar idioma, cancelar audio;
- semántica accesible + teclado.

## Runtime

- assets versionados;
- un único mapping `id + language -> file + text_sha256 + audio_sha256 + policy`;
- seleccionar por idioma real de interfaz;
- no cruzar ES/EN;
- mismatch de `text_sha256` = no reproducir;
- no preload de 30 WAV;
- un solo audio activo; nuevo estado cancela anterior.

Políticas:
- SYSTEM_VOICE: solo si voz activada;
- SYSTEM_VOICE_OPTIONAL: no autoplay por mera visibilidad;
- UI_ONLY: no voz automática;
- UI_SCREENREADER/SCREENREADER_ONLY: no voz Sabik; mantener AT y evitar doble habla.

R01 no narra contenido dinámico, resultados, artículos, citas ni texto de usuario.

## Integración con R42/R02

Consumir materiales/tokens vigentes. No crear estética paralela.

PR #310 Home monta el panel Sabik existente: después de integrar audio/copy, cualquier build Home debe consumir el panel actualizado. No duplicar un segundo control de voz.

## QA preview

ES/EN · desktop · 390×844 · 320.

Demostrar:
- voz OFF al cargar;
- 0 requests WAV antes de enable;
- 30 WAV HTTP 200 + MIME correcto + hash esperado;
- enable/disable;
- cambio de idioma;
- cancelación/reemplazo;
- busy/error/empty/cancelled/connected/reset;
- no doble habla con live regions;
- reduced motion / “Desactivar movimiento” no altera audio;
- copy R02 40/40;
- 0 copy R01 obsoleto.

Entregar base/final HEAD+tree, diff, manifest runtime, mapping, network log, QA, preview y Memoria/Control.

Marcador:
`SABIK_AUDIO_R01_A2_PREVIEW_READY_FOR_ASTRA`.

No main. No producción. No modelos/masters en GitHub público.
