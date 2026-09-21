# B3 runtime assets · R0

The production-candidate code resolves 15 static B3 keyframes under this directory.

Binary PNGs are distributed in the audited conversation artifact:

`SABIK_B3_RUNTIME_ASSETS_R0.zip`

Package SHA-256:

`82373796ff32bb9f3834f1c59472c5f5f25ea5b81393a29ed1d993971ed3b218`

The repository stores the hash contract in `ASSET_MANIFEST.json`. Before a deployable integration build, extract the package and run:

```bash
python tools/stage-sabik-b3-assets-r0.py /path/to/extracted/SABIK_B3_RUNTIME_ASSETS_R0
```

This verifies all 15 derivatives before copying them here.

Until assets are staged, `b3-integration.js` deliberately falls back to the existing Sabik hologram rather than showing a broken/incorrect presence.

**NO DEPLOY from an unstaged R0 branch.**
