# B3 runtime assets · R0

**Status:** production candidate from frozen B3 R1.

This directory contains the 15 runtime derivatives used by the real integration spike: one WebP per Web/IA/Educa × PRESENTE/ORIENTAR/TRANSICIÓN/PAUSA/CONFIRMAR.

## Runtime contract

- source: PR #182 @ `e5f70cba76a4414527c10b0fbecfd549a7390e66`;
- source keyframes: 15 accepted R1 PNGs, 544×544;
- runtime: 15 committed WebP derivatives, one per presence/state;
- minimum runtime dimension: 64×64; actual dimensions are recorded per file;
- states: PRESENTE · ORIENTAR · TRANSICIÓN · PAUSA · CONFIRMAR;
- presences: Web · IA · Educa;
- no sprite dependency;
- each runtime file SHA-256 and byte count is recorded in `ASSET_MANIFEST.json`.

The 15 source SHA-256 values and Library IDs are recorded in `ASSET_MANIFEST.json`.

This is a runtime derivative, not a new visual family. No source keyframe, geometry or semantic state in #181/#182 is changed.

If a requested runtime asset cannot load, `b3-integration.js` keeps the existing legacy hologram visible rather than showing a broken image.

**NO MERGE · NO DEPLOY.**
