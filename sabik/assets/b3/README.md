# B3 runtime assets · R0

**Status:** production candidate from frozen B3 R1.

This directory contains the runtime visual derivative used by the real integration spike:

`sabik-b3-r0-sprite-256-lossless.webp`

## Runtime contract

- source: PR #182 @ `e5f70cba76a4414527c10b0fbecfd549a7390e66`;
- source keyframes: 15 accepted R1 PNGs, 544×544;
- runtime cells: 256×256 LANCZOS derivatives;
- packaging: one **lossless WebP** sprite, 5 columns × 3 rows;
- columns: PRESENTE · ORIENTAR · TRANSICIÓN · PAUSA · CONFIRMAR;
- rows: Web · IA · Educa;
- SHA-256: `3bc05d596927f45feed44bebb70750507a9ec6aeaa6b39d856ee9f06f6216c67`;
- bytes: `6660`.

The 15 source SHA-256 values and Library IDs are recorded in `ASSET_MANIFEST.json`.

This is a runtime derivative, not a new visual family. No source keyframe, geometry or semantic state in #181/#182 is changed.

If the sprite cannot load, `b3-integration.js` keeps the existing legacy hologram visible rather than showing a broken image.

**NO MERGE · NO DEPLOY.**
