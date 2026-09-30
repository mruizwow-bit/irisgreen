# R59 · FÓSILES · HALLAZGOS DE INTEGRACIÓN PRESERVADOS · NO REABRIR PRODUCTO

Fecha: 30/09/2026
Issue: #323
Responsable: Agente R59
Coordinación: Aura/Astra

Estado:
`R59_FOSSILS_INTEGRATION_FINDINGS_PRESERVED_QA_GOV_MISSION_UNCHANGED`

## 1. Qué has detectado bien

Tu paquete standalone NO es todavía un paquete de integración Iris Green.

Para una futura integración deberá:
- respetar rutas ES/EN separadas;
- usar shell Iris Green;
- canonical/hreflang/metadata;
- usar assets del repo;
- integrar índices/sitemap si corresponde al HEAD vigente;
- entregarse como overlay `para-irisgreen/` copiable, no como instrucciones manuales.

Estos hallazgos se conservan.

## 2. Qué NO debes hacer ahora

NO rehagas Fósiles para la web.

La orden vigente R2v4 sigue mandando:
- PRODUCT PASS se conserva;
- NO reabrir arte;
- NO reabrir mecánica;
- NO tocar integración A2.

Tu siguiente acción NO es crear:
- `/es/intereses/fosiles/`;
- `/en/interests/fossils/`;
- `ig-fosiles.css/js`;
- índices;
- sitemap.

Eso pertenece a un futuro carril de integración después del PASS final.

## 3. Corrección de base

Antes de afirmar estructura web, relee A2 vivo.

A2 observado ahora:
`agent2/sabik-iris-r08-20260924`
HEAD:
`8ea50128b490207b4dd5508c3c46692f5be69c87`.

Existe:
`assets/ig-global-ui-tokens-2026.css`.

Por tanto queda retirada la afirmación:
“esa hoja no existe en el repositorio”.

No copies una base antigua ni decidas tema inicial desde un snapshot obsoleto.

## 4. Fósiles vs Minerales

El asset:
`img/intereses/minerales-y-fosiles.svg`
NO es por sí solo una decisión de taxonomía.

R59 mantiene:
- Fósiles;
- Minerales;

como pilotos separados.

No fusionar IDs/rutas/catálogo sin nueva decisión de María/Astra.

## 5. Trabajo actual

Vuelve a:
`02_FOSSILS_R2V4_FINAL_QA_GOV.md`.

Cierra:
1. QA nominal 4/4;
2. negative test;
3. gobernanza;
4. GOV-01;
5. ZIP final + hashes + outputs desde limpio.

Marcador:
`R59_FOSSILS_PILOT_R2V4_FINAL_QA_GOV_READY_FOR_ASTRA_MARIA`.

Después STOP.

No Minerales.
No A2.
No main.
No producción.
