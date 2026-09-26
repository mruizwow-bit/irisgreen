# R39 R06 · integración web A2 y preview real · 26/09/2026

Estado: **R39_R06_WEB_INTEGRATED_PREVIEW_READY_FOR_REAL_HTTP_QA**

## Cloud privado R06
- source candidate: `8690e26140f6d513c3592df62bc82b167cbb1d0e`
- deploy: `6ab7a2cd2cf8dc09d3ae9aca`
- origin: `https://6ab7a2cd2cf8dc09d3ae9aca--sabik-asistente.netlify.app`
- state: READY
- context: `deploy-preview`
- `published_at=null`
- deploy source: CLI
- functions: `n04-library-qa` + `n04-team-transport`
- Node runtime observado: Node 24
- Team Login/secretos no modificados por A2.

## Integración web
- base A2 antes de PR272: `9ad3cc8116b6c1d237b84f71855f3808e93ddbad`
- PR272 HEAD: `95f5e81e34196eef182b49aa3b0d122b5706977c`
- PR272: merge limpio/fast-forward sobre la rama A2; GitHub la marca merged.
- HEAD A2 final después de ajustar CI/CSP: **`538daa9729b8904d85f5bc1519e8e13a40fb59bb`**
- tree final: **`034cc898463fcc31d6da703c1800b60d1fbedc1a`**
- rama: `agent2/sabik-iris-r08-20260924`
- PR web: #244

## Delta R06 integrado
- `sabik/authorized-transport.mjs`: iframe privado + MessageChannel; sin popup/window.opener.
- `sabik/mount-config.mjs`: Cloud R06 exacto.
- `_headers`: `frame-src` añade únicamente el origen Cloud R06 exacto.
- `scripts/test_iris_brief_r08.py`: origen esperado actualizado.
- `tools/test-sabik-authorized-transport-r06.mjs`: regresión R06.
- workflow A2 actualizado para ejecutar explícitamente la regresión R06.
- guardarraíles CSP actualizados en dos pruebas para aceptar exclusivamente los 3 proveedores de vídeo revisados + el único origen Sabik R06 exacto. Sin comodines.

## CI
HEAD final `538daa9...`: **20/20 workflows SUCCESS**.
El montaje `Iris Green y Sabik R08` ejecuta y pasa:
- Motion R37
- Taller
- Rincón R03
- `tools/test-sabik-authorized-transport-r06.mjs`
- build
- Iris brief / Recursos / R09 / Taller F1

El gate CSP quedó verde después de actualizar los contratos cerrados de `frame-src`; no se relajó la política.

## Preview web real
- deploy ID: **`6ab7a8687285860008f3b5a4`**
- commit_ref: `538daa9729b8904d85f5bc1519e8e13a40fb59bb`
- state: READY
- context: `deploy-preview`
- `published_at=null`
- review_id: 244
- alias: `https://deploy-preview-244--irisgreen-home.netlify.app`
- permalink: `https://6ab7a8687285860008f3b5a4--irisgreen-home.netlify.app`
- 0 Functions/Edge nuevas en la web.
- 0 producción.

## Gate siguiente
No se envió ninguna consulta automática a Sabik.
Siguiente fase: cinco casos HTTP reales con sesión humana legítima:
1. resultados + fuentes;
2. cero resultados;
3. cancelación/sustitución;
4. error/timeout recuperable;
5. UI EN con citas `lang=es`.

No afirmar todavía `MONTADO_CONECTADO_REAL` hasta pasar esos cinco casos.

## Límites preservados
- no main;
- no producción;
- no DNS;
- no cambios de Team Login;
- no voz/TTS;
- no corpus/ranking;
- no credenciales nuevas;
- no secretos copiados ni leídos.
