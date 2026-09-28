# R44 · Astra review guardada · Matriz 64 retos Taller · 28/09/2026

Issue: #319
Estado: `R44_MATRIZ_64_ASTRA_REVIEWED_CORRECTIONS_REQUIRED_BEFORE_BUILD`

## Fuente
`R44_MATRIZ_64_RETOS_TALLER_CLAUDE_20260928.md`

## Decisión
La matriz queda aceptada como **base de trabajo**, no como autorización de construcción.

No se autoriza todavía construir los 55 retos de Ola A.

## Correcciones previas
1. separar `recommended_stage/starter_stage` de audience/safety;
2. auditar 55/55 contra el HEAD final R47+R54;
3. verificar interoperabilidad real de proyectos cruzados con gate `CROSS_STUDIO_IO_VERIFIED`;
4. corregir criterios problemáticos E09/E18/X03/E35/E41 y equivalentes;
5. heredar R54: los retos entran por escenas/previews y artefactos, no por filas/iconos.

## Secuencia posterior a R54
- A0: framework + 8 pilotos.
- A1: retos de estudio independientes.
- A2: cruzados tras IO verified.
- A3: calendario A con recheck de fuentes.
- Ola B: solo tras decidir Animación y Mapas.

## Gates
`SOURCE_RECHECK_BEFORE_RELEASE`
`VISUAL_R54_PASS`
`CROSS_STUDIO_IO_VERIFIED`

## Próximo estado
Tras cierre de R54:
`R44_MATRIZ_64_RECONCILED_AGAINST_FINAL_TALLER_READY_FOR_MARIA`

No main. No producción. No build masivo.
