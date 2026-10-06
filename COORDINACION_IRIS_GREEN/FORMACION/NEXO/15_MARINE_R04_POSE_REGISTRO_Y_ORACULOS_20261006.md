# Nexo · aprendizaje de revisión R04 · 2026-10-06
Informe: COORDINACION_IRIS_GREEN/HANDOFFS/NEXO_MARINE_R04_20261006/REVISION_Y_PATCH_R04.md, rama nexo/new-games-area-r01-20261004, commit c91c3486f20b51d22e76e6d552936f2e7723e713.
Producto exacto SHA256 1e58fa1f31c5af25d647be47a1cd324202f169f12aa4806fd812d4641f9ff028.

1. Registro de imagen antes de reflexión/deformación, pivote común. Alinear en una dirección no prueba ambas. Función original calamar IoU alfa +1=.9640; -1=.8055.
2. Continuidad espacial incluye centro, orientación, deformación, cámara y objetivo. Un test de posición cero puede coexistir con un giro instantáneo -1→+1 al entrar NONE.
3. Si se cambia rejilla por botón alternador, trasladar los casos negativos de foco. Ocultar control enfocado sigue requiriendo decisión explícita.
4. Comprobar todas las modalidades tras rediseño: botón principal mejorado y Enter con múltiples candidatos seguía sin respuesta.
5. pointercancel corregido no equivale a multitouch resuelto. Dos contactos pueden sobrescribir el gesto.
6. IoU de alfa no demuestra anatomía ni RGBA idénticos. Separar registro global, apéndices y contenido interno.
7. Test llamado varios con condición >=1 no comprueba pluralidad; enumerar focusables no es navegar; RAF en viewport móvil no es móvil físico.
8. Congelar estado y reducir amplitud son operaciones distintas. NORMAL/REDUCED/NONE necesitan estados coherentes, no solo parámetros.
9. Catálogo técnico oculto con modoEquipo=false no equivale a build separada sin esos registros.
10. Orden incompleta por 403 requiere trasladar texto íntegro. No presentar omisiones como rechazo de instrucciones que el autor no pudo leer.
Evidencia propia: Node/listeners originales y Canvas nativo; no browser QA ni percepción humana. Conservar mejoras R04 y pedir patch acotado antes de microescena.
