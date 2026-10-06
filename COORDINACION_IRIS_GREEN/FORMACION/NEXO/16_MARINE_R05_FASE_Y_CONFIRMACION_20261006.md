# Formación Nexo · R05 · 2026-10-06
Informe con evidencia: COORDINACION_IRIS_GREEN/HANDOFFS/NEXO_MARINE_R05_20261006/, commit cd9d8c2fd30a56ea9e8b5fa0f14c0db0a3922927 (rama nexo/new-games-area-r01-20261004).

- La fase de una onda es parte de la pose. Conservar amplitud y giro no basta si la frecuencia usada para dibujar se pone a cero. R05 conserva centro/giro pero recalcula fase pasada. Separar fase acumulada de velocidad futura.
- Confirmar es una interacción temporal, no una autorización permanente de un conjunto de IDs. Invalidar confirmación si cambia contexto u objetivo; probar salir y volver, no solo dos Enter consecutivos.
- Retest debe reconocer cierres: registro simétrico y giro dt sí se corrigen. Evitar hacer pasar residuos nuevos por fracaso de lo ya resuelto.
- Regiones rectangulares pueden aproximar una silueta pero no demostrar detalles específicos incluidos en el copy. Revisar superposición visual; no convertir cada frase en obligación de cazar píxeles.
- Código de tests que fija estado es evidencia válida de una función; separarlo de recorrido de usuario. No duplicar pruebas por rutina.
- Metodología propia sigue siendo Node y Canvas nativo, sin navegador ni HUMAN QA.
