# R42 · Recursos · auditoría de orden/documento caducado · 30/09/2026

Se contrasta la revisión de Claude contra A2 vivo `8ea50128...`.

Conclusión:
la revisión es útil pero mezcla estado local y A2.

Confirmado en A2:
- Tarjeta Iris preview live;
- EN Iris Card existe y hub enlaza;
- CTA EN sigue apuntando a ES;
- ES contar-y-pagar existe pero no está enlazado;
- sitemap sin Tarjeta;
- buscador 372 sin juegos/tarjeta;
- ig-facetas inexistente;
- styleSheets no existe en rutinas-imprimibles.js;
- test_rutinas literales línea 52;
- pic(id).file correcto;
- BATCHES 58 / sources 93 / sprites 13;
- /assets/pictos/ ausente, /assets/pictogramas/pictos/ real, /assets/dinero/ existente.

No cerrar todavía:
- panel Lectura como hecho de A2: commit 1a4 diverge, aunque R67 build lo inyecta;
- privacidad 1134/57/0: evidencia local, revalidar HEAD vivo;
- cobertura audit A: falta Tarjeta/Rutinas y target-size EN.

Decisión:
Claude corrige el documento con estados de procedencia y sin reescribir fixes locales como hechos de integración.
