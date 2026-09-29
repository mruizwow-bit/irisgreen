# Aclaración R63 · evidencia temporal, reduced motion y handoff reproducible · 29/09/2026

Esta aclaración no cambia el diseño de Sakura ni crea una norma visual transversal nueva. Precisa cómo se aplica la orden #328.

## Evidencia temporal

Cuando una orden fija una duración mínima de evidencia (15–30 s), una captura de 4 s no la sustituye aunque tenga métricas de frames correctas.

La evidencia debe coincidir con el intervalo solicitado porque el objetivo incluye detectar periodicidad, repetición, acumulación y fatiga perceptiva.

## Reduced motion

Una reducción cuantitativa de velocidad/amplitud no basta cuando la orden exige explícitamente una variante estructural.

Para R63, REDUCIDO debe tener al menos una diferencia discreta respecto a NORMAL además de speed/drift:
- menos pétalos/instancias;
- menor densidad;
- eliminación de una capa dinámica;
- o equivalente documentado.

Debe conservar el mismo espacio y significado, sin saltos bruscos.

## Tiers / progressive enhancement

No se inventan niveles. Si el runtime real tiene menos niveles que el contrato solicitado:
- se implementa el nivel faltante; o
- se solicita ajuste explícito del contrato antes de declarar PASS.

La honestidad documental es necesaria pero no convierte por sí sola una desviación contractual en cumplimiento.

## Handoff reproducible

Todos los documentos de entrega deben compartir una sola identidad:
- base;
- HEAD;
- número de commits;
- lista/conteo de archivos;
- hashes.

Si LEEME, manifest y lista de commits difieren, el handoff permanece abierto hasta reconciliación.
