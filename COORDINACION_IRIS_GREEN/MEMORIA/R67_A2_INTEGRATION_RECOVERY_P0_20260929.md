# R67 · A2 · recuperación de integración real · 29/09/2026

Issue: #333

Estado:
`R67_A2_INTEGRATION_RECOVERY_P0_ORDERED`.

Astra audita el HEAD vivo A2 `9e69bd1...` y reproduce cuatro fallos de integración:

1. shell global nuevo no gobierna transversalmente la web visible; sobreviven headers antiguos;
2. Taller R64 es un fixture HUMAN QA que reemplaza main en runtime sobre el Taller R40 antiguo, no la integración definitiva;
3. Sabik sigue siendo retrieval + mensajes fijos; R66 solo tiene BASE READ;
4. child-safe duro no forma parte del build actual: existe el script R42, pero build_site.py no lo ejecuta y páginas S2 siguen con contenido completo en source inicial.

R67 fuerza una recuperación secuencial:
shell → child-safe → Taller → Sabik → única preview integrada.

Los PASS parciales previos siguen como evidencia técnica, pero dejan de funcionar como gate de producto final.

Marcador final:
`R67_A2_IRIS_GREEN_INTEGRATED_PREVIEW_READY_FOR_MARIA`.

No main. No producción.