# MEMORIA · CHILD SAFETY · AGE GATE OBLIGATORIO R01

Fecha: 2026-10-04  
Decisión explícita de María.

## Hallazgo

El runtime actual une dos conceptos que deben permanecer separados:

`current === AGE_18_PLUS → isAdult() → adult-explicit/full access`

Esto permite que cualquier persona pulse 18+ y alcance contenido completo/restringido.

## Decisión

1. Los tres botones de edad son **obligatorios** antes de usar la experiencia normal.
2. `GENERAL` deja de ser bypass público.
3. Pulsar 18+ NO demuestra mayoría de edad.
4. Se separa:
   `AGE_18_PLUS_CLAIMED`
   de
   `ADULT_ASSURANCE_VERIFIED`.
5. Sin assurance independiente válida:
   `SAFE_VARIANT_ONLY`.
6. El mismo gate aplica a Home, navegación, búsqueda, direct URLs, assets full, Sabik, recomendaciones y futuras zonas.
7. Fallo/desconocido/caducado = safe-by-default.
8. No usar pago/Stripe como prueba de edad.
9. El mecanismo concreto de age assurance necesita Lex + Vigía + Axioma.
10. HUMAN QA María cierra el cambio.

Documento normativo:
`COORDINACION_IRIS_GREEN/NORMATIVA/CHILD_SAFETY_AGE_ASSURANCE_R01.md`

Control:
`COORDINACION_IRIS_GREEN/CONTROL/CHILD_SAFETY_MANDATORY_AGE_GATE_R01_20261004.json`

Regla corta:

`MANDATORY_AGE_SELECTION + INDEPENDENT_ADULT_ASSURANCE + FAIL_CLOSED`

Estado:
`CHILD_SAFETY_R01_ORDERED`
