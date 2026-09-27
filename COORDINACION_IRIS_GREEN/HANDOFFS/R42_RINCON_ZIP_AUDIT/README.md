# Handoff · auditoría Rincon.zip · 27/09/2026

Estado: `R42_RINCON_ZIP_AUDIT_SPLIT_REQUIRED`

ZIP: `0efd80e61ff489ce4f38a0fd496c934cfad565954130300cfbf90c1574d17309`.

## Regla de integración

NO aplicar `design-r42-crystal-materials-r01.bundle` ni los cinco patches como serie.

### Extraer para A7
Portar únicamente:
1. mutation-safe `setBodyClass` en clean mode;
2. `.r40-scene-actions [hidden]{display:none!important}`.

Ambos faltan en PR #300 HEAD `6c312d3f...`.

### No extraer para A7
- material/cristal R01;
- preferences R01;
- game code;
- pictograms.

Material = Design R02 vigente.

### Preservar para Juegos/Recursos
- 13 juegos R03;
- 71 pictogramas + manifest;
- fix de `arriba()` con offset real de cabecera;
- evidencia móvil.

No integrar desde este bundle. Crear/usar un lote independiente sobre el baseline nuevo y aplicar child-safe.

## Evidencia
111/111 navegador; 273/273 móvil; axe 0 violaciones en 36 runs; checksums completos PASS.

Las capturas del Rincón R01 son estructurales/materiales, no real-media final.
