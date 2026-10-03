# PRISMA · CIELO Y ESPACIO · FRONTEND SHELL R01

Fecha: 03/10/2026

Gate objetivo:
`SPACE_SECTION_FRONTEND_SHELL_READY_FOR_ASSET_INTAKE`

Branch:
`prisma/space-section-frontend-shell-r01-20261003`

Base funcional:
`PRISMA_INTEREST_ASSET_CARDS_FOUNDATION_R01_PASS`

Base main original:
`411f8eb9cfd7c0baf17a9e6b773fdafc222502ef`

## Orden

Preparar componente/card/scene shell para las 5 entradas sin esperar a que termine producción visual.

## Entradas

1. Cielo nocturno / Night sky — ruta ACTIVE
2. Planetas y sistema solar / Planets and the Solar System — ruta ACTIVE
3. Exoplanetas / Exoplanets — ruta ACTIVE
4. Eclipses / Eclipses — ruta ACTIVE
5. Meteoros / Meteors — ruta PENDING

La quinta entrada se identifica por la cola canónica:
`INTEREST_05_METEORS_PRODUCT_CONTENT_REUSE_AND_ASSET_BRIEF_PASS`.

Prisma NO inventa una ruta para Meteoros antes de su contrato de producto.
El slot existe, pero no es enlace.

## Visuales

Los cinco slots nacen:
`assetStatus = pending`

Consecuencia:
- 0 `<img>` de master;
- 0 `src` de master;
- 0 solicitudes de bytes de master.

Cuando un visual de Croma/otro productor pase revisión y packaging:
1. cambiar SOLO ese item a `assetStatus: approved`;
2. añadir path canónico `src`;
3. añadir dimensiones/alt si aplican;
4. el shell activa lazy loading;
5. los demás slots siguen pending.

## UX

- responsive desktop/tablet/mobile;
- mobile explícito 320/390;
- LIGHT / DARK local al componente;
- enlaces nativos para rutas activas;
- quinta entrada no clicable hasta contrato de ruta;
- focus visible;
- forced-colors;
- no overflow horizontal;
- noscript con las cuatro rutas activas y quinta como estado textual.

## Contenido

Las descripciones de las cuatro rutas existentes se preservan desde el `main` observado.
Prisma no reescribe contenido factual.

Meteoros no recibe descripción factual hasta brief de Senda.

## Archivos

- `assets/ig-space-section-shell.css`
- `assets/ig-space-section-shell.js`
- `assets/ig-space-section-init.js`
- `assets/data/space-section-shell.es.json`
- `assets/data/space-section-shell.en.json`
- `es/intereses/index.html`
- `en/interests/index.html`
- `scripts/test_prisma_space_section_shell.py`
- `.github/workflows/prisma-space-section-shell.yml`

No masters astronómicos creados.
No main.


## QA FINAL DEL HEAD ACTUAL

Estado:
`SPACE_SECTION_FRONTEND_SHELL_READY_FOR_ASSET_INTAKE`

HEAD:
`7b53c94063a71e6171966dd61091ce200420ec19`

GitHub Actions:
- run: `37099834557`
- job: `111137044566`
- conclusión: **SUCCESS**

PASS:
- ES / EN;
- 320 / 390 / 1440;
- 5 cards;
- 4 rutas activas;
- Meteoros = ruta pending;
- LIGHT / DARK;
- forced-colors;
- 0 solicitudes de master mientras los cinco slots están pending;
- build canónico;
- aislamiento visual frente a chrome global.

Artifact:
`prisma-space-section-shell`
ID:
`11265668416`

Digest:
`sha256:bf11f8a612c7bc808399ba6a699b825c3266bfdb7072c60ecd4f204222fe526c`

## Cierre

El shell queda listo para recibir assets aprobados uno a uno o por tanda.
No hace falta esperar al catálogo completo.
No se conecta ningún visual hasta `assetStatus=approved`.


## Micro-bloque · approved-only asset intake

Fecha: 03/10/2026

Objetivo:
probar el camino real `pending → approved` antes de conectar masters astronómicos reales.

Se añade fixture no productivo con:
- 1 asset local de QA marcado `approved`;
- 4 slots `pending`;
- 320 / 390 / 1440.

Contrato esperado:
- approved crea un único `<img>`;
- `loading=lazy`;
- `decoding=async`;
- entra en IntersectionObserver;
- pending crea 0 `<img>`;
- pending genera 0 requests de asset.

Archivos:
- `tools/prisma/space-section-approved-fixture.html`
- `scripts/test_prisma_space_asset_intake.py`

Commits:
- fixture: `bf25feb79da90c96f73e434e9621c9753c4d5266`
- test: `0b6e50db78f10b128168bf207f160fcd1bdf2aee`
- workflow gate: `6ae21766a0a99aec4da695d48c47fd6901655c12`

CI:
`37102845076` · IN_PROGRESS al checkpoint.

No esperar en chat.
