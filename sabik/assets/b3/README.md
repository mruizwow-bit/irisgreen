# B3 runtime assets · R1 current preview

Fuente visual: PR #182 @ `e5f70cba76a4414527c10b0fbecfd549a7390e66`.

Este directorio contiene 15 derivados WebP de runtime:

- Web × 5 B3;
- IA × 5 B3;
- Educa × 5 B3.

Todos los derivados R1 quedan normalizados a **64×64**. El candidato R0 contenía una inconsistencia de dimensión en `web_confirmar.webp`; R1 la corrige sin tocar el keyframe fuente.

`ASSET_MANIFEST.json` registra SHA-256, bytes, dimensiones y hashes de las 15 fuentes congeladas.

Los derivados son empaquetado de runtime, no una nueva familia visual.

**NO MERGE · NO DEPLOY.**
