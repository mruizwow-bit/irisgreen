# W02 R1 · freeze independiente de contraste

Estado contractual: `W02_R1_QA_FREEZE_READY` una vez que el workflow Linux de este freeze reproduzca el baseline.

## Baseline inmutable

`main@e48b51814afed825a92e83a2f6e51ee8a1c85e45`

La auditoría de entrada es `W02_CONTRAST_AUDIT_READY`: 4/4 familias son `TRUE_WCAG_CONTRAST_DEFECT`.
El umbral de texto normal es **4.5:1** y no puede rebajarse.

## Casos congelados

- `W02-01` · breadcrumbs de fichas · `.crumb > a` · 12 instancias en las seis rutas de detalle ES/EN del contrato.
- `W02-02` · encabezados de ayuda · `.helps > h2` · 6 instancias en esas mismas seis rutas.
- `W02-03` · Intereses · `.album-tema > .cuenta` · 6 instancias.
- `W02-04` · breadcrumbs de índices · `.crumb > a` · 3 instancias (`/es/situaciones/`, `/es/biblioteca/`, `/es/datos/`).

Las rutas, recuentos, colores, tamaños, pesos y ratios de referencia están fijados en `w02-contrast-contract-v1.json`.

## Cobertura del runner

El runner independiente:
- mide navegador sobre **source y dist** en la condición núcleo 1440;
- recorre todas las instancias congeladas;
- conserva un cálculo analítico del gradiente como sanity check independiente;
- registra peor posición, RGB de foreground/background y ratio;
- usa el foreground CSS computado y no convierte antialiasing del texto en excusa de PASS;
- comprueba `320 / 390 / 768 / 1440`;
- comprueba estados `default / hover / focus` en breadcrumbs;
- comprueba el modo normal y la preferencia de **Más contraste** de Iris Green;
- añade diagnósticos Chromium a 200 % y 400 % sin presentarlos como una preferencia interna de Iris Green;
- conserva tamaño/peso de texto del contrato para impedir obtener PASS reclasificando artificialmente el texto como grande;
- trata dark mode como N/A porque el baseline no define uno.

## Reejecución exacta después de Codex

No modificar estos blobs.

1. Verificar los hashes/blobs del freeze contra `freeze-manifest-v1.json`.
2. Checkout del **HEAD candidato exacto** en un worktree limpio.
3. Obtener del freeze, sin editar, `w02-contrast-contract-v1.json` y `run-w02-contrast-gate-v1.py`.
4. En Linux:
   - `python3 scripts/build_site.py`
   - instalar Playwright 1.55.0 + Pillow 11.3.0 y Chromium;
   - ejecutar:
     `python /ruta/freeze/run-w02-contrast-gate-v1.py --phase candidate --contract /ruta/freeze/w02-contrast-contract-v1.json --source-root . --dist-root dist --output /tmp/w02-r1-candidate-report.json`
   - ejecutar `git diff --check`.
5. El veredicto solo puede ser:
   - cobertura congelada completa PASS en las cuatro familias → `W02_R1_QA_PASS`;
   - cualquier FAIL/drift del contrato → `W02_R1_QA_BLOCKED`.

No adaptar fixtures, expectativas, rutas, umbral o runner al candidato.

## Límites

Este freeze es un gate de regresión para los cuatro defectos auditados, no una certificación WCAG completa. El zoom nativo con chrome del navegador sigue siendo una comprobación manual de accesibilidad distinta de la emulación diagnóstica disponible en Playwright.

## Prohibiciones

0 archivos de producto. No CSS/HTML de producto, no cambios de color, no merge, no deploy, no producción.
