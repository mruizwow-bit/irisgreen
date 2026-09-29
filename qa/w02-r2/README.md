# W02 R2 · freeze QA-only de contraste · baseline-first

Estado contractual: `W02_R2_QA_FREEZE_READY` únicamente cuando el workflow R2 reproduzca el baseline rojo 4/4 con mapping CSS→PNG corregido y telemetría válida.

## Autoridad e identidad

- R1 aceptado: PR #222 @ `7c2fd9cc85ee06b107452c01e7e2600c964c2d07`
- R1 runner blob: `4245c0c23f29a208e37463a0091e0a7671a13e1f`
- R1 contract blob: `32e5488a342f6733525687c7c893aae3dffcf916`
- baseline producto: `e48b51814afed825a92e83a2f6e51ee8a1c85e45`

R2 no edita R1. Añade archivos nuevos bajo `qa/w02-r2/` y un workflow R2 separado.

## Contrato funcional inmutable

R2 conserva exactamente W02-01..W02-04, rutas, selectores, expected_per_route, estados, source/dist, modos, viewports 320/390/768/1440, zoom 200/400, umbral 4.5:1, analytic sanity y comprobaciones de font-size/font-weight.

El JSON R2 solo cambia schema/contract_id para distinguir la versión QA.

## Único cambio funcional QA

El runner transforma coordenadas CSS a píxeles PNG usando la relación demostrada por R13:

```
x_png = (x_css - visualViewport.offsetLeft)
        * visualViewport.scale
        * devicePixelRatio

y_png = (y_css - visualViewport.offsetTop)
        * visualViewport.scale
        * devicePixelRatio
```

Por medida registra Range rects, element box, scale, offsets, DPR, tamaño del screenshot, puntos CSS/PNG, RGB, ratio, p01, plan, ruta, caso, índice y estado. También verifica en runtime escala y dimensiones del screenshot frente al visual viewport.

## Baseline-first

La construcción/aceptación R2 ejecuta SOLO el baseline.

Debe obtener:
- W02-01 FAIL real;
- W02-02 FAIL real;
- W02-03 FAIL real;
- W02-04 FAIL real;
- 54/54 registros zoom con mapping numéricamente válido;
- 0 page errors;
- threshold 4.5 intacto.

Si no reproduce 4/4: `W02_R2_FREEZE_BLOCKED_BASELINE_REPRODUCTION`.

## Candidato #225

NO se ejecuta durante la construcción R2 y NO se usa para calibrar el mapping.

Solo tras aceptación explícita de Astra, Agent 1 podrá ejecutar este mismo runner/contrato sobre el HEAD candidato exacto, sin modificar los blobs del freeze.

## Límites

`Emulation.setPageScaleFactor` sigue siendo un diagnóstico Chromium de page-scale. No sustituye una comprobación manual de zoom nativo del navegador.

0 archivos producto. No cambios de color. No merge/deploy/producción.
