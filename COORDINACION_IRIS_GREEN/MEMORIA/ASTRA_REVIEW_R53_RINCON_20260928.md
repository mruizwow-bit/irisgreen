# R53 · Rincón · Astra review FAIL + rebuild de Salas · 28/09/2026

Issue: #317
Estado: `R53_CLAUDE_RINCON_REBUILD_ORDERED`

## Fuente auditada

ZIP de Claude:
`irisgreen-r46-claude-rincon.zip`

Marcador incluido:
`R46_CLAUDE_RINCON_REBUILD_READY_FOR_ASTRA`

Astra NO lo acepta.

## Fallos raíz

- cinco salas implementadas como presets de un único fragment shader;
- nube final sigue leyendo como cielo;
- respiración del espacio repite la gramática de globos;
- jardín/papel siguen sin lenguaje material correcto;
- WebGL2 único en Salas, sin fallback Canvas/static;
- reduced motion incompleto;
- audio de Salas documentado pero ausente;
- media provenance inexistente;
- ad gate no ejecutado;
- QA 112 PASS no cubre producto completo;
- claim CSP bloqueante incorrecto: base A2 ya permite youtube-nocookie;
- evidencia final mezcla prototipos descartados.

## KEEP

- motor Respirar como base, corrigiendo reduced motion;
- loader Paisajes;
- Pantalla limpia;
- fixes #303;
- layout wide;
- R42/R02;
- ES/EN.

## REBUILD

- Salas como cinco instalaciones realmente distintas;
- fallbacks;
- audio de Salas;
- reduced motion;
- media provenance/ad gate;
- QA temporal/per-room/performance.

## Marcadores

Código aún con media QA pendiente:
`R53_CLAUDE_RINCON_INSTALLATIONS_CODE_READY_MEDIA_QA_PENDING`

Final real:
`R53_CLAUDE_RINCON_INSTALLATIONS_READY_FOR_ASTRA`

Solo el segundo puede pasar a A2.
