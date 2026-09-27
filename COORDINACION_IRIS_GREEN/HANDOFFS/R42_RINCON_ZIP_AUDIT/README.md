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

### Juegos
**Fuera de alcance de este handoff.** Claude está actualizando Juegos en su propio carril. No derivar tareas a A1 ni integrar contenido de Juegos desde este ZIP.

### Responsables operativos
- **A7:** portar los dos fixes del Rincón.
- **A2:** integrar después el resultado de A7 y ejecutar build/preview/HUMAN QA.

Nadie más actualiza Rincón desde este paquete.

## Evidencia
111/111 navegador; 273/273 móvil; axe 0 violaciones en 36 runs; checksums completos PASS.

Las capturas del Rincón R01 son estructurales/materiales, no real-media final.
