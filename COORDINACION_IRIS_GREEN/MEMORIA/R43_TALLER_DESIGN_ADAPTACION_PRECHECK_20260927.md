# R43 · adaptación Design del Taller al sistema material R02 · precheck Astra · 27/09/2026

## Alcance

Se comparan:
- `Talleer.zip` = adaptación R43 del Taller al sistema material R42;
- `Taller Desing.zip` = paquete Design R01 histórico;
- Design R02 ya aprobado por Astra.

No se reabre ni reaudita el producto Taller R43, sus motores ni su contenido.

## Estado

`R43_TALLER_DESIGN_ADAPTATION_PRECHECK_PASS_COVERAGE_REQUIRED`

## Integridad

`Talleer.zip`
SHA-256:
`62d338cf6cdd509b9dab6696f1ee6c0aa2c39cd62bcdf465577a40abb8290c89`

`Taller Desing.zip`
SHA-256:
`4f2bfec1633d0341bf827bf6136f303be846491295ed05765253370dc8cb3688`

El segundo paquete es Design R01 histórico y NO debe usarse como fuente vigente.

## Fidelidad a Design R02

La adaptación R43 conserva byte-idénticos respecto al R02 aprobado:
- `assets/ig-r42-materials.css`
  SHA-256 `90a4342b0138df1e0c57bb6c28dc6d0eb0aca1d60082f4a9dc7b0ab573bfe7f5`
- `assets/preferencias-lectura.js`
  SHA-256 `8a3dab4dc0025c4671b81401c14c5087180d99dd054dec21161d96e51df41c1f`
- `scripts/measure_r42_materials.py`
  SHA-256 `f65bb50ffad2967cd7d2955bb645c86964124f362faa43d1b6272b720e01c814`

Cambios propios de adaptación:
- `ig-r42-shell.css`: extiende tokens también a `.ig-r42-dialog`;
- `apply_r42_app_shell.py`: inyecta materiales en páginas adicionales que ya declaran `data-ig-r42-pilot="true"`;
- `test_r42_app_shell.py`: añade contrato para suite;
- `test_r42_materials_browser.py`: añade casos navegador para estudios de la suite;
- `ig-suite.css`: consume tokens `--ig-*` con fallback y mantiene canvas/workspace opacos.

## QA reproducido

- ZIP íntegro;
- 5 scripts Python compilan;
- `node --check preferencias-lectura.js`: PASS;
- `measure_r42_materials.py`: **30 filas / 0 FAIL**;
- token disabled R02 `#5f6b80` presente;
- aviso accesible de transparencia forzada presente;
- algoritmo de fondo efectivo R02 presente;
- regresión esperada 11,82:1 presente;
- `ig-suite.css` no introduce `filter:contrast(...)` ni almacenamiento/red;
- toolbar del lienzo queda opaca, no cristal;
- `forced-colors` y `prefers-reduced-motion` se conservan.

Limitación:
el paquete es un overlay y no contiene el repositorio R43 completo, por lo que build/browser end-to-end corresponden a A2/CI.

## Hallazgo bloqueante de cobertura

La adaptación documenta explícitamente las **26 páginas de los 13 estudios R43**.

`build_taller_suite.py` genera esos 13 estudios × ES/EN y luego ejecuta `hub.main()`.

Sin embargo:
- la portada `/es/taller/` y `/en/workshop/` no recibe `data-ig-r42-pilot` ni `data-ig-materials="r42"` desde `hub.py`;
- `apply_r42_app_shell.py` solo amplía automáticamente a páginas cuyo `body` ya lleva `data-ig-r42-pilot="true"`;
- el piloto fijo solo incluye Dibujo en el carril Taller;
- los demás estudios legacy que siguen en el catálogo no están cubiertos por esta adaptación material.

Resultado:
la nueva experiencia Taller puede quedar dividida entre:
- 13 estudios R43 adaptados;
- Dibujo piloto;
- portada + resto de estudios legacy con chrome/material anterior.

Eso contradice el objetivo de adaptar **el Taller actualizado** de forma coherente.

## Corrección requerida

Design no debe tocar motores, contenido, física, audio ni retos.

Solo debe ampliar la adaptación de interfaz/material para que **toda la superficie pública actual del Taller** tenga una regla explícita y coherente:

1. portada ES/EN;
2. todos los estudios visibles desde esa portada, incluidos los legacy todavía públicos;
3. sistema R02 exacto;
4. contenido/workspace opaco;
5. sin cristal sobre lienzo/canvas;
6. ES/EN;
7. móvil;
8. misma preferencia Transparencia;
9. sin propagar fuera del Taller.

### QA requerido
- inventario exacto de rutas Taller ES/EN;
- cobertura 100 % de las rutas visibles;
- no página del Taller con shell/material antiguo por accidente;
- screenshot de portada desktop/móvil;
- al menos un estudio R43 y uno legacy desktop/móvil;
- contrato automatizado que compare catálogo público vs rutas adaptadas;
- build + navegador en A2.

## Observación no bloqueante

El paquete conserva el mismo comportamiento de informes enriquecidos de R02: ejecutar el medidor reproduce las 30 filas/valores pero reescribe metadata narrativa. Se mantiene la observación anterior de reproducibilidad documental; no bloquea esta corrección.

## Gate

No devolver al R01 histórico.

Design corrige únicamente cobertura sobre `Talleer.zip` + R02 vigente.

Marcador esperado:
`R43_TALLER_DESIGN_ADAPTATION_COVERAGE_FIXED_READY_FOR_ASTRA`

No main. No producción.
