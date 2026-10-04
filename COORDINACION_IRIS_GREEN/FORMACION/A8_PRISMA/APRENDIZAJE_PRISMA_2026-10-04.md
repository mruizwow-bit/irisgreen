# APRENDIZAJE_PRISMA_2026-10-04

## Resume gate
GitHub sigue siendo la fuente canónica. No usar equipo local para trabajo que GitHub ya permite ejecutar.

Gobernanza vigente:
`ONE_SMALL_BLOCK → MAIN → VERIFY → REPORT → NEXT`.
No nuevas ramas Prisma para #369.
En rutas generadas se corrige el generador/plantilla canónica; una rama PASS no equivale a producto integrado.

## P0 #369 · límites confirmados
### Juegos #1/#3
P01/P02/P03 conservan masters E4, renderers, overlays y tests en main, pero no existe un runtime público jugable recuperable.
No crear una falsa “recuperación” desde imágenes. El ensamblaje de mecánica es trabajo de runtime/producto y requiere su carril correspondiente.

### Fósiles #2
La auditoría R2v4 está preservada en GitHub, pero el paquete de producto fue registrado como `LOCAL_ONLY_NOT_TRANSFERABLE_TO_A2`; no existe rama remota R59/Fósiles que pueda reconciliarse desde GitHub.
No reconstruir los 59 assets ni las 14 piezas.
Pendiente real: materializar el paquete canónico en GitHub/entrada transferible o recibir un handoff remoto equivalente.

### Sabik Web #354
Prisma sigue después de Croma/asset canónico. No sustituir el diseño aprobado por una aproximación.

## Bloque ejecutado · Taller Hojas
Deuda proveniente de #363:
- `WORKSHOP_SHEETS_HREFLANG_PAIR_OPEN`
- `WORKSHEETS_SCREEN_CHROME_TOKEN_MIGRATION_REQUIRED`

Corregido directamente en main:
- ES: `125b08e83106632415bd200580a1815db7ce7391`
- EN: `b7e788aacd18bb75103f6ab2f1979f4e17f418be`
- gate: `f736152ca1989f08e8c9b9aab748f226a1fcaf7f`
- hook build: `8b23f006801a98e5334edf149cabbca17f5e60ff`

Resultado:
- canonical + hreflang ES/EN/x-default recíprocos;
- chrome de pantalla usa tokens globales;
- botones primary/secondary consumen tokens semánticos;
- foco/forced-colors siguen delegados al sistema global;
- el papel A4 conserva fondo blanco intencional;
- la excepción de impresión no se usa para justificar blancos de UI.

Verificación de fuente en main: PASS.
El workflow no emitió run para este push; no declarar CI PASS hasta que exista evidencia de ejecución.
