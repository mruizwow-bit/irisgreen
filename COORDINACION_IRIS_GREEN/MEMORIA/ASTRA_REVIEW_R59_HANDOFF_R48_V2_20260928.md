# R59 · Astra review handoff R48 v2 · 28/09/2026

Issue: #323.

Estado:
`R59_ASTRA_HANDOFF_V2_DONOR_SCHEMA_PASS_STANDALONE_QA_REWORK`

## Artefactos
- COORDINACION_R48_MEMORIA_20260928_v2.zip · sha256 5139981a7e47dcef7d4f5e06cd6be6315fe0957f376238ff1a6aa5e7911aaa62
- IRIS_INTERESES_R48_ES_EN_PARA_SUBIR_v2.zip · sha256 a50521b4e9bc2c45ffb7ed76677ef95467f981e2fd6191ef9319d937b4f64e7a
- HANDOFF_PILOTOS_R59_v2.zip · sha256 b32e1a698dcf5b719b9622172295f330501a34d684427881a649287832fa6a33

## PASS

### Donor matrix
- 72 filas / 72 IDs únicos.
- CSV y JSON avisan explícitamente que donor_* no es decisión R58.
- DEPTH/CARDS/TIMELINE/CRYSTAL3D/NETWORK quedan no heredables.
- Donors editoriales de los seis pilotos registrados por separado.
- 40 keep / 32 rework quedan solo como donor_keep_rework, no como decisión R58.

### CSS faltantes v1
Cerrado:
- ig-r48-m-depth.css presente;
- ig-r48-m-cards.css presente.

### Overlay completo
El ZIP "para subir" tiene exactamente 17 referencias ausentes y coinciden 17/17 con la allowlist documentada de archivos ya existentes en el repo sin cambios.

## REWORK del claim standalone/completeness

1. completo.py imprime faltantes pero siempre retorna exit 0.
2. Su regex solo cubre /assets con css/js/json; no cubre /img ni imágenes WebP/font/audio/CSS url().
3. El handoff piloto v2 sigue sin img/v40-brand-symbol.webp, referenciado por las 10 páginas ES/EN. Además el libros-flipbooks.js incluido cita dos portadas WebP no incluidas.
4. matriz_donor_r59.py no se reproduce desde el handoff: faltan g03b.py y g04.py..g09.py. Rerun standalone cambia 40 CONSTRUIDO_R48 a 15 y 52 pendientes.
5. "sin_decision": 0 es semánticamente ambiguo para un documento que afirma no contener decisiones R58.

## Decisión

La matriz donor v2 es válida como input para Codex Fase 1.

No bloquear Codex por packaging.

Claude corrige solo el handoff/completeness y para en:
`R59_CLAUDE_HANDOFF_V3_STANDALONE_QA_READY_FOR_ASTRA`

Codex sigue su Fase 1 y para en:
`R59_CODEX_INTERESTS_72_RESTRUCTURE_READY_FOR_ASTRA`

No 72 build.
No 6 pilotos.
No A2.
No main.
No producción.
