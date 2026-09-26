# R42 Design R01 · handoff recibido · 26/09/2026

## Fuente
Paquete recibido de Design en conversación:
- archivo original: `Interfaz.zip`
- SHA-256 del ZIP recibido: `65ea0b67c0cc74da3e133bd12c8dc149ed4104f3895b5447a2b4021d40e2ad57`

Design declara como base:
- rama A2: `agent2/sabik-iris-r08-20260924`
- commit: `e8cad400a30d5d4857f9f99b0c1070d786958a8b`
- tree: `827a68fae6596a929e4d246bb47b8494a976e8a3`

Astra volvió a consultar GitHub al recibir el paquete y confirmó que A2 seguía exactamente en ese HEAD/tree.

## Patch de integración

El diff unificado del paquete se ha conservado comprimido en:

`COORDINACION_IRIS_GREEN/HANDOFFS/R42_DESIGN_R01/R42_DESIGN_MATERIALES.patch.gz`

- blob GitHub: `87c3c601ff6da4faf46a1b4a7f49473ddff8e6a1`
- SHA-256 del `.patch.gz`: `916f1ead1f96e817081858d0638a76fce64ca0b6ccc34787b3daf5391969e042`
- diff sin comprimir declarado por Design: contra `e8cad400...`

El patch contiene cambios de producto/QA para:
- `assets/ig-r42-shell.css`
- `assets/preferencias-lectura.js`
- `scripts/apply_r42_app_shell.py`
- `scripts/test_r42_app_shell.py`
- nuevo `assets/ig-r42-materials.css`
- nuevo `scripts/measure_r42_materials.py`
- nuevo `scripts/test_r42_materials_browser.py`
- nuevo `.github/workflows/r42-materiales.yml`
- nuevas mediciones en `reports/r42-materials/`

## Verificación independiente realizada antes del handoff A2

Sobre los bytes recibidos:
- SHA-256 de todos los archivos del ZIP calculado y coherente con la hoja de entrega para los archivos principales;
- `python -m py_compile` PASS para los cuatro scripts Python incluidos;
- `node --check assets/preferencias-lectura.js` PASS;
- `python scripts/measure_r42_materials.py` → **30 filas, 0 FAIL**;
- búsqueda de red en assets/scripts: no `fetch`, XHR, WebSocket o beacon nuevos; la única persistencia funcional es el `localStorage` del almacén `IGPreferences` ya existente;
- el patch afecta únicamente a los 10 archivos de producto/QA declarados;
- el piloto sigue limitado a 8 rutas ES/EN: Dibujo, Juegos, Intereses y Rincón.

No se ha podido declarar desde esta recepción:
- build completo;
- Playwright sobre `dist`;
- 48 capturas;
- lector de pantalla real;
- zoom/reflow manual;
- HUMAN QA de María.

Esos gates corresponden a la CI/integración A2 y a la preview real.

## Marker Design

El paquete contiene `docs/r42-design-materials/R42_NORMATIVA_EMBEBIDA_LEIDA.md`, fechado antes de escribir código. Coordinación registra ese marcador como evidencia recibida; no se afirma que Design pudiera publicarlo directamente en GitHub.

## Estado

`R42_DESIGN_PACKAGE_RECEIVED_PRECHECK_PASS_A2_INTEGRATION_REQUIRED`
