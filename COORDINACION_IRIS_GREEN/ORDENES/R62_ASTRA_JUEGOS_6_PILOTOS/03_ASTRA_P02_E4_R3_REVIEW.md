# R62 · ASTRA · P02 TERRARIO E4 R3 · REVIEW

Fecha: 29/09/2026  
Issue: #326

Estado:
`R62_P02_TERRARIO_E4_ASTRA_PASS_HUMAN_QA_PENDING`

## Decisión

PASS Astra.

El único bloqueo de R2 queda resuelto: la cadena causal
`roca → sombra → humedad → musgo`
se entiende ya en el díptico sin depender de la explicación numerada.

## Evidencia visual

KEEP:
- gameplay desktop LIGHT/NAVY;
- gameplay móvil LIGHT/NAVY;
- motor E4;
- variedad de follaje;
- colgantes;
- sustrato;
- agua/madera/roca;
- bandeja/labels;
- composición 390.

No R4.

## Evidencia medida

- musgo +278,7 %;
- panel cambiado 16,0 %;
- 84,3 % del cambio en zona roca+sombra;
- roca/escena 1,64×;
- fallos medidos 0.

Las métricas respaldan, no sustituyen, el juicio visual.

## Scope note

R3 regeneró algunos assets gameplay aunque la orden pedía solo causalidad.
No hay regresión visual y el último rework no toca `ig_render_e4.py`, por lo que no se bloquea.

En adelante, declarar cualquier regeneración de KEEP fuera del scope previsto.

## Paquete

Bundle incremental:
- rama P02 → `0e8e365248dd61f9f17a76d326bb1ed766143372`;
- prerequisite → `c119d3297bfa3fadff89a3c0423b2fbf3ff9f633`.

Antes de integración final:
documentar prerequisite o generar bundle autocontenido.

## Gate humano

Pendiente María.

Si aprueba:
`R62_P02_TERRARIO_E4_HUMAN_APPROVED_UNLOCK_P03`.

Hasta entonces P03–P06 y Codex #321 HOLD.

No A2/main/producción.

## Normativa

No cambia normativa transversal.
