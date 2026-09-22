# Sabik Web R01 · integration/replacement QA freeze

**Output contractual:** `SABIK_WEB_R01_INTEGRATION_QA_FREEZE_READY`

Este freeze implementa DEC-064: el prototipo antiguo es `HISTORICAL_IMPLEMENTATION + REGRESSION_BASELINE`. Sus botones y controles ya comprobados no se redescubren; se congelan como comportamiento esperado y se vuelven a ejecutar como **no-regression** sobre el Sabik nuevo integrado.

## Receta congelada

```text
A03 exacto @ 4c67e276d4fd0a0d4d407d3504a7416d7ed39cfb
  └─ ya contiene A01 exacto @ 0a1d4339bae2628dc963501a30f326553605821b
+ delta de PRODUCTO A02 exacto procedente de #213
  └─ sabik/sabik-page.css · base blob b38a95b... → A02 blob 9a0e69e...
+ SABIK_WEB_VISUAL_PRESENTATION_R01 aceptada
= futuro candidato Sabik Web integrado
```

A01 **no se reaplica**.

Los dos archivos QA de A02 (`test-sabik-a02-lateral.js` y su workflow) se conservan como fixtures/regresión; no forman parte del delta de producto.

## I01–I26

El mapa completo está en `integration-contract-v1.json`. Incluye identidad/ancestry, regresiones A01/A02/A03, S0/S1/S4/V7/A11Y, controles manuales, layout/teclado/foco/responsive, B3, reduced-motion, offline/cloud-disabled, fallback texto, privacidad, high contrast, errores/recovery, no inferencia cognitiva, no autoplay, build y provenance.

## 23 S1 manuales

La evidencia histórica llegó a **23/23 PASS_REAL** sobre `6bf17b9cd0f13d251cd2d87fb2af986b326f9804`.

Eso NO se hereda. En el futuro candidato integrado las 23 filas empiezan otra vez como:

`PENDIENTE_ENTORNO`

y solo permiten PASS final cuando sean **23/23 PASS_REAL sobre el mismo HEAD/tree final**.

La matriz exacta está en `s1-manual-regression-v1.json`.

## Fixtures automáticos congelados

El contrato fija por blob los tests aceptados:
- A01 core + browser;
- A02 L01–L20;
- A03;
- S0;
- S1;
- S4 unit/browser;
- V7;
- A11Y closure.

La futura QA debe ejecutar los blobs congelados, no versiones adaptadas por el candidato.

Secuencia mínima futura:
1. checkout exacto del candidato;
2. fetch de A01/A02/A03 exactos;
3. materializar/usar los fixtures congelados;
4. A01/A03/S0/S1/S4/V7/A11Y source;
5. A02 L01–L20 source;
6. Linux build;
7. A01/A02/S1/S4 dist;
8. high contrast, storage/privacy, offline/cloud-disabled, text-only/voice-absent, no-autoplay, error/recovery;
9. comprobar B3 + visual R01;
10. ejecutar 23 S1 manuales en el mismo SHA;
11. crear evidencia I01–I25;
12. revalidar HEAD/tree remoto;
13. ejecutar este mismo runner en `--phase candidate`.

## Rerun final

```bash
python3 qa/sabik-web-r01/run-integration-gate-v1.py \
  --phase candidate \
  --root /ruta/candidato \
  --contract qa/sabik-web-r01/integration-contract-v1.json \
  --evidence /ruta/evidence-final.json \
  --output /tmp/sabik-web-r01-integration-report.json

git -C /ruta/candidato diff --check
```

El evidence JSON debe estar unido al HEAD/tree final, registrar la receta/provenance, el visual aceptado, I01–I25, las 23 filas manuales y la revalidación de identidad posterior.

## Límites

- 0 product edits en este freeze.
- 0 combined branch.
- no B3 motion.
- no activación de voz.
- no autoplay.
- no activación Cloud/API.
- no merge/deploy/producción.
- 32 px de B3 sigue `PENDING_HUMAN_TEST`; no diseñar función crítica que dependa de distinguir estados a 32 px.
