# R59 · Fase 1 72/72 · Astra review · content PASS / independence-schema fix · 28/09/2026

Issue: #323.

Estado:
`R59_ASTRA_PHASE1_72_CONTENT_PASS_INDEPENDENCE_SCHEMA_FIX_REQUIRED`

Artefacto:
`R59_FASE1_INTERESES_72_R58.zip`

SHA-256:
`e658e720302144833624cc7f6efeb1edc5e2d9af2c04521b543f07d766f57c93`

## PASS de contenido

Las 72 experiencias están decididas una a una bajo R58 y la norma visual E4.

Pasan como dirección:
- escenas propias;
- acciones concretas;
- visual_2026_direction;
- 14 keep / 58 rework;
- 23 mundo nuevo / 35 reenfoque / 14 afinar;
- mapas subordinados;
- 6 sensibles con tratamiento;
- 13 dudas registradas.

Ejemplos fuertes:
Fósiles=yacimiento, Historia=mismo lugar por épocas, Ordenadores=escala del chip, Química=gabinete de elementos, Terremotos=sismógrafo antes del mapa, Mar=descenso material.

## Tests Astra

Ejecutados:
- build_matriz_r58.py exit 0;
- test_independencia.py PASS;
- test_calidad.py PASS.

El test actual demuestra independencia de renderer/estado R48 para la mayor parte de campos de decisión.

## Bloqueo Independence-01

La orden activa también exige independencia de:
- needs_map;
- needs_real_data;
- source_pressure.

Pero build_matriz_r58.py los copia desde DONOR_UTIL.

Verificado:
- 72/72 needs_map idéntico donor;
- 72/72 needs_real_data idéntico donor;
- 72/72 source_pressure idéntico donor.

DECISION_COLS del test actual no contiene esos tres.

Corrección:
mover esos tres a decisiones_r58, añadirlos al fingerprint y probar mutación/borrado de donor.

## Schema

Faltan nombres/arrays canónicos:
- r48_build_state;
- r48_renderer;
- r48_donor_keep[];
- r48_donor_rework[];
- r48_missing_dependencies[];
- notes.

Normalizar sin rehacer las 72 decisiones.

r58_experience_decision debe alinearse al binario keep/rework; conservar MUNDO_NUEVO/REENFOQUE/AFINAR como r58_change_scope.

## Documentación

- MUNDO_EXPLORABLE correcto = 14, no 15.
- marker CODEX incorrecto.
- gate activo = R59_AGENT...
- registrar marcadores de lectura R42 y base R59.

## Setas

Fuente oficial vigente revisada 28/09/2026:
Servicio de Información Toxicológica: 91 562 04 20, 24 h.

Usar solo como actuación ante posible intoxicación, nunca como apoyo de identificación/recolección.

## Cocina

“con una persona adulta” se aplica a Infancia, no a usuarios adultos.

## Próximo

`R59_AGENT_INTERESTS_72_RESTRUCTURE_R1_READY_FOR_ASTRA`

Solo corrección de independencia/schema/documentación.

No construir 72.
No construir 6 pilotos.
No A2/main/producción.
