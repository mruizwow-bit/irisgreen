# R63 · Sakura · revisión Astra R2 runtime/handoff · 29/09/2026

Estado:
`R63_ASTRA_SAKURA_RUNTIME_HANDOFF_PASS_READY_FOR_A2_WITH_INTEGRATION_GATES`

## Material revisado
- R63_SAKURA_HANDOFF_20260929_2.zip;
- sakura_normal_2.mp4;
- sakura_reducido_2.mp4;
- LEEME.md;
- MANIFIESTO.json;
- qa/runtime.json;
- qa/evidencia/evidencia_r2.json;
- docs/SOLICITUD_CONTRATO_ESCALONES_SALAS.md;
- código de stage y Sakura.

## 1 · Evidencia temporal
PASS como evidencia temporal de movimiento.

Los dos MP4 aportados:
- 780×346;
- 15 fps;
- 300 fotogramas;
- 20,0 s.

La entrega documenta correctamente que NO son screen recording del lienzo vivo, sino secuencias deterministas generadas pidiendo instantes reales del renderer mediante freeze(t).

Esto sirve para:
- comparar patrón NORMAL vs REDUCIDO;
- verificar densidad/deriva;
- observar ausencia de eventos bruscos;
- evidenciar SIN_MOVIMIENTO.

NO sirve para certificar:
- FPS real;
- jitter;
- frame pacing;
- rendimiento GPU real.

Ese punto permanece `PENDING_HARDWARE_QA`.

## 2 · REDUCIDO estructural
PASS.

Verificado en código:
- NORMAL: 170 pétalos;
- REDUCIDO: 64 pétalos;
- el draw count se reduce realmente;
- uVivo se desactiva fuera de NORMAL, retirando la respiración dinámica del cove;
- además stage mantiene speed 0,34 y drift 0,22.

Por tanto REDUCIDO ya no es solo la misma escena ralentizada.

## 3 · Contrato de escalones de Salas
SOLICITUD ACEPTADA.

Contrato canónico para Salas:
`B WebGL2 → C Canvas2D → D estática`.

No existe tier A de Salas y NO debe declararse.

Motivo aceptado:
- A de Respirar es un shader fullscreen con port WebGPU acotado;
- A de Salas implicaría un segundo renderer completo, con coste y QA propios;
- no hay evidencia de que la sala actual necesite ese renderer para cumplir calidad/rendimiento;
- progressive enhancement exige escalones reales y útiles, no simetría nominal.

Condición:
si una sala futura demuestra limitación de rendimiento/material que justifique WebGPU, se abre una orden propia. No se reabre R63 por paridad de etiquetas.

Nueva regla local:
`R63_SALAS_PROGRESSIVE_ENHANCEMENT_CONTRACT_BCD_ACCEPTED`.

## 4 · Red externa
PASS de atribución; blocker queda en A2.

Runtime actual:
- 1 request externo ES;
- 1 request externo EN;
- ambos a fonts.googleapis.com desde plantilla global.

Con el enlace global retirado:
- ES = 0;
- EN = 0.

Sakura/Rincón no origina red externa.

A2 debe cerrar el gate en integración real:
`R63_A2_ZERO_EXTERNAL_REQUESTS_REQUIRED`.

R63 no debe parchear el header global.

## 5 · Identidad del handoff
PASS.

Una sola identidad:
- branch claude/r46-rincon-inmersivo-20260927;
- base A2 bf44d6ae7aa362b81fadb16b44bdef358cc31bcc;
- head e4437e51d84d673df746cf1d6be1fa21fb2e58da;
- 37 commits;
- 114 ficheros propios;
- solape real 1;
- único solape = hoja canónica de tokens, byte-identical con A2;
- merge-tree limpio.

LEEME generado desde manifest y constructor bloquea divergencias.

## Dictamen

Los cinco puntos del rework quedan cerrados por Astra.

Se autoriza handoff a A2.

A2 debe:
1. integrar sobre HEAD vivo;
2. mantener tokens canónicos;
3. retirar Google Fonts/obtener 0 requests externos;
4. repetir runtime sobre preview;
5. mantener `PENDING_HARDWARE_QA` hasta dispositivo/preview representativa;
6. no abrir siguiente sala;
7. entregar Deploy Preview para HUMAN QA María.

Marcador:
`R63_ASTRA_SAKURA_RUNTIME_HANDOFF_PASS_READY_FOR_A2`.

Solo María puede emitir:
`R63_SAKURA_HUMAN_APPROVED_UNLOCK_NEXT_ROOM`.

No main. No producción. No siguiente sala.
