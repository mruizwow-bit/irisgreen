# R59 · Fósiles R2v3 · reproducibilidad aceptada / QA-GOV bloqueados · 30/09/2026

Estado:

`R59_FOSSILS_R2V3_REPRO_CONTRACT_ACCEPTED_QA_NOMINAL_GOV_STILL_BLOCKED`

El contrato de reproducibilidad R2v3 mejora materialmente la entrega:
- 74 entradas selladas;
- web + generadores + arnés + documentos;
- resultados fuera del manifiesto con digest del mismo;
- ejecución fail-closed por entradas alteradas;
- regeneración temporal;
- comparación pixel cuando cambian bytes;
- self-test 0/2/1.

Aura verifica de forma independiente:
- manifest 74/74;
- digest cruzado;
- modificación de `fuente/piezas.py` → exit 2 y archivo nombrado.

No se concede cierre total porque:
1. `qa/shots.py` sigue sin usar `idx` en las capturas nominales;
2. captura T. rex muestra Iguanodon;
3. GOV-01 sigue sin reconciliar ejecutor real vs rama `codex/`.

Producto visual sigue PASS.
No rerender.

Siguiente marcador:
`R59_FOSSILS_PILOT_R2V4_NOMINAL_QA_GOV_FIXED_READY_FOR_ASTRA_MARIA`.
