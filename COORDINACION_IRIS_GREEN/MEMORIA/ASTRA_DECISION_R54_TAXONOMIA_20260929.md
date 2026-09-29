# ASTRA · decisión R54 · taxonomía canónica de edad · 29/09/2026

Estado: `R54_TAXONOMY_DECISION_RESOLVED_R54_SCOPE_LIMITED`

Issue operativo: #318.

## Decisiones

1. Los valores de URL/query que representan banda de edad pasan a usar los IDs canónicos:
   - `AGE_0_12`
   - `AGE_13_17`
   - `AGE_18_PLUS`
   - `ALL_AGES`

   Los valores legacy pueden seguir aceptándose temporalmente como entrada mediante UNA única tabla/función de compatibilidad. Las nuevas salidas/enlaces no deben seguir emitiéndolos.

2. La HUMAN QA de las seis tarjetas R54 NO espera a la migración transversal completa. Antes de mostrar el instrumento a María, Claude corrige únicamente la página de QA para mostrar el copy canónico ES/EN y usar IDs AGE_* si el fixture contiene IDs. El arte 6/6 no se reabre ni se rerenderiza.

3. La migración real de las 48 páginas, query params públicos, audience registry, child-safe, starters, deep links y tests NO pertenece a R54. Es trabajo transversal A2/global.

4. Home v4, header, tema global y hoja de tokens final siguen siendo responsabilidad A2. R54 no integra una segunda hoja de tokens.

## Secuencia

R54 corrige fixture QA → HUMAN QA María de 6/6 arte → A2 ejecuta migración transversal de edad → preview conjunta antes de integración final.

Marcador esperado de Claude:
`R54_CLAUDE_QA_6_CARDS_CANONICAL_AGE_READY_FOR_MARIA`

No main. No producción.
