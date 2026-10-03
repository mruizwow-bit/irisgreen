# ATLAS · CIELO B00 · BINARY PACKAGING R01

Gate:
`INTEREST_01_SKY_HORIZON_BINARY_PACKAGE_READY_FOR_PRISMA`

Canonical web path:
`/img/intereses/cielo/01-cielo-horizonte-observacion-r01.png`

Approved Library master SHA-256:
`f35cb943ca72b254a092c721e8007ddbe4d414ed80d154f287b5eedce57493d0`

Web package SHA-256:
`ee569aa0e520d0d819e259eff684fafdf1180d3a22d9dbd4cc1ec7b84b1d4641`

Decoded RGBA SHA-256:
`3f3591d332530dfa4226f14eaa3cc3d23c401c01edef20e6d23d4bc365b099ed`

ICC profile SHA-256:
`0ea2385dc1cadf2842b4088a2b1e09a4f3b5d6d61aeb1c7b69ac9f79c3cff729`

The repo PNG is a PNG re-encode. Its compressed byte stream differs from the approved Library master, but decoded RGBA pixels and the embedded ICC profile are identical. No art was changed.

Technical contract:
- PNG RGBA 2560×768
- embedded sRGB ICC
- transparent upper sky
- safe-crop 16:9 / 3:4 / mobile PASS
- no redraw/recolor/relight
- no runtime changes
- no main

Prisma may now bind:
`--skyv2-horizon-image: url('/img/intereses/cielo/01-cielo-horizonte-observacion-r01.png')`

Then Prisma owns the 390/1440 integration QA and HUMAN-QA-ready gate.
