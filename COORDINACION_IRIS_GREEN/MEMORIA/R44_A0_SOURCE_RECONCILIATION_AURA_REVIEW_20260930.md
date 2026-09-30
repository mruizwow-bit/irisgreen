# R44-A0 · revisión Aura de fuente y reconciliación · 30/09/2026

Issue #319.

Estado:
`R44_A0_SOURCE_PRESERVED_RECONCILIATION_ACCEPTED_FRAMEWORK_8_PILOTS_IN_PROGRESS`.

## Artefactos verificados

Matriz fuente:
- archivo: `R44_MATRIZ_64_RETOS_TALLER_CLAUDE_20260928.md`;
- SHA-256: `f059d56607c97336612ac6112592264d7b34d3bbfa3d358aed400a8b4166695e`;
- tamaño: 88 581 bytes.

Reconciliación:
- archivo: `R44_MATRIZ_RECONCILIADA_OLA_A_CLAUDE_20260930.md`;
- SHA-256: `f1c1d709a4e37e87c4436cd47cd3d9718dfc69feae72318b110ea7aec6eafc44`;
- tamaño: 11 852 bytes.

Coordinación aplicó el patch serie recibido en un repositorio temporal:
- fuente reconstruida byte-identical;
- reconciliación reconstruida byte-identical.

## Decisión

§2 PASS/CERRADO: fuente recuperada y preservada.

§3 ACEPTADO para continuar A0:
- 55 Ola A / 9 Ola B;
- pilotos E01/E06/E17/E22/E28/E34/E38/E44;
- X08 necesita STL de Modelado 3D y queda bajo CROSS_STUDIO_IO_VERIFIED;
- R44 usa namespace propio y no toca el `taller-retos.json` legacy de 72 propuestas.

Los resultados de ejecución declarados sobre los 27 hosts no se convierten en PASS de los retos. Los logs brutos deben viajar en el handoff A0.

## Correcciones de precedencia

La fuente histórica conserva lenguaje legacy. Implementación:
- `ALL_AGES` / AGE_* canónico;
- `recommended_stage/starter_stage` separado de audience/sensitivity/discovery;
- no `TRANSVERSAL` como clasificación de producto.

Antes de release, E09 debe perder la promesa “funciona para daltonismo” también en título/copy.

Siguiente:
§4 framework + §5 ocho pilotos.

No main. No producción.
