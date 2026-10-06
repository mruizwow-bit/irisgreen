# Regiones manuales de observación · QA

Las regiones siguientes se definieron manualmente sobre los tres assets originales. No se generan por proporciones genéricas del rectángulo.

Coordenadas normalizadas en el asset `[x1,y1,x2,y2]`.

## Trilobite · f-trilobites.webp · 400×480
SHA-256 `3dd61dd5ad2b1aeffab574187e28d8fd2e242772951af8b4467eda0211663d44`

- `thorax_segments`: `[0.27,0.38,0.72,0.73]`
- Observación: repetición de bandas/segmentos en la parte media.
- Fuente de contraste: Natural History Museum, “How trilobites conquered prehistoric oceans”: el tórax está dividido en segmentos.
- Límite: no se usa esta región para identificar especie.

## Dimetrodon · f-dimetrodon.webp · 420×540
SHA-256 `73b4581dcafce6eac23bd602e4fe5fef2744d39fc6eba2add8def03425c25a18`

- `spine`: `[0.40,0.15,0.60,0.59]`
- `junction`: `[0.30,0.62,0.70,0.82]`
- Observación: una prolongación ósea larga y estrecha y su continuidad con una base vertebral más ancha.
- Fuente de contraste: Smithsonian, “Five Incredible Fossils…”: espinas muy alargadas sobre las vértebras de Dimetrodon.
- Límite: no se atribuye una función exacta a la vela.

## Meganeura · f-meganeura.webp · 560×380
SHA-256 `f71be3076399273d2ffd433b935f997ccc93dc55922bd73d92046ddc10c68c62`

- `outline`: `[0.11,0.32,0.89,0.70]`
- `veins`: `[0.24,0.39,0.72,0.62]`
- Observación: contorno alargado de una impresión de ala y red de líneas internas representada.
- Fuentes de contraste: Natural History Museum, “Griffinflies: The earliest flying insects” y “Dragonflies: The ultimate hunters”.
- Límite: no se afirma que esta imagen sea un espécimen concreto de Meganeura.

Las imágenes anotadas de QA están en `qa/` y no modifican los WebP originales.
