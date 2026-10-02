# INTERÉS 01 · CIELO V2 · HORIZONTE ATLAS · REVISIÓN DE CANDIDATO · 02/10/2026

## Candidato recibido
Archivo visual aportado por María:
`Panorama montañoso nocturno en capas (1).png`

SHA-256 observado:
`f7c306a04e499f2007d86027577a6da9ea1e700d08483ad0cd0ffb699bb9e261`

Tamaño:
`664633 B`

## Evaluación visual
Estado:
`VISUAL_DIRECTION_KEEP`

Pasa:
- paisaje nocturno neutral;
- horizonte bajo/medio;
- sin estrellas;
- sin Luna;
- sin planetas;
- sin aurora;
- sin texto;
- sin logos;
- sin personas;
- sin landmarks identificables;
- composición suficientemente tranquila;
- parte superior realmente transparente;
- útil como base sobre la que Motor dibuje cielo HYG/IAU/JPL.

## Medición técnica real
- formato: PNG;
- modo: RGBA;
- tamaño real: **2048×682**;
- bbox alfa no vacío: x=0..2047, y=128..681;
- ~73.53 % de píxeles con alpha=0;
- parte superior completamente transparente;
- **sin perfil ICC/sRGB embebido detectado**.

## Resultado
No puede recibir todavía:
`INTEREST_01_SKY_HORIZON_ASSET_PASS`

Motivos técnicos:
1. contrato exige **2560×768**;
2. candidato real es **2048×682**;
3. relación de aspecto actual (~3.003:1) no coincide con 2560×768 (~3.333:1), por lo que no debe estirarse sin criterio;
4. contrato exige sRGB y el PNG recibido no lleva perfil ICC/sRGB embebido detectable.

Clasificación:
`INTEREST_01_SKY_HORIZON_VISUAL_KEEP_TECHNICAL_REWORK_REQUIRED`

## Corrección permitida para Atlas
- conservar esta dirección visual;
- NO reimaginar el paisaje;
- adaptar canvas/composición a 2560×768 sin deformación perceptible;
- conservar transparencia superior;
- embebir perfil sRGB;
- validar safe-crop 16:9 / 3:4 / móvil;
- entregar manifest + SHA-256 + provenance + alpha/safe-crop evidence.

Después, si todo pasa:
`INTEREST_01_SKY_HORIZON_ASSET_PASS`

No Voyager.
No ISS.
No runtime.
No main de producto.
