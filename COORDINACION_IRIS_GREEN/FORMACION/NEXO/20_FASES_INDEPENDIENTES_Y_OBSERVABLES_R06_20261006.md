# 20 · Fases independientes y cobertura de observables · R06
2026-10-06. Nexo.
Caso: descubrimiento-peces-R06.zip, SHA256 917548b0a710ed2f17a9264e9516a0bd329f86511fe514fc8f5adf52962f6e03.
Evidencia: HANDOFFS/NEXO_MARINE_R06_20261006/RETEST_R06_Y_PATCH_ACOTADO.md, retest.cjs y RETEST_RESULTS.json, rama nexo/new-games-area-r01-20261004.
1. Continuidad local no garantiza dinámica correcta. R06 elimina saltos al cambiar perfil, pero compartir p.fase entre onda acumulada y trayectoria acelera el recorrido: 31 s pasan a 4,95 s en el hacha. Probar instante y evolución.
2. Las unidades de estado son contrato: faseOndaCiclos y faseRecorridoRad no comparten almacenamiento. Auditar lectores además del escritor modificado.
3. Medir velocidad declarada contra desplazamiento real en el tiempo; una derivada antigua puede sobrevivir a un cambio de fórmula y mentir.
4. Desactivar un observable bloqueado conserva exploración provisional, pero no cumple el gate de rasgo. Distinguir fallback, pendiente y PASS.
5. Declarar un esquema nuevo no implica que el motor lo consuma. bodyContext está presente pero ignorado; los datos duplicados iguales ocultan el defecto.
6. Un arreglo vacío no debe producir 100% observado. Validar geometría y estados antes de cargar una experiencia.
7. 23 capturas no indican cobertura de tres animales: son 18 linterna, 5 hacha y cero calamar. Entregar matriz objetivo × encuadre × nivel y motivos de huecos.
8. Al comparar registro local, aplicar transformaciones y ROI en el mismo orden. Recortar antes de mover introduce otro problema de optimización.
9. Prueba de UI con estado preparado por sonda es híbrida; llamarla así. Node VM no sustituye navegador ni percepción.
10. Hash del ZIP canónico y derivado suelto de imagen son evidencias diferentes; no declarar corrupción ni causa de transformación sin comprobar.
Regla: KEEP del núcleo y corrección acotada, evitando convertir cada revisión en rediseño general. No escalar mientras el defecto temporal esté abierto.


## Retest R06.1 · aprendizaje incremental
Base producto8a96259b802176dd6e1aeb30b838586d5c36bd27be5ff83d160786e8a0a2fcc7.
Evidencia Nexo: HANDOFFS/NEXO_MARINE_R06_1_20261006/, commitcf82eba7f2f3218db5d9656dbeed3a57144bf4e7.
Método: motor original en Node VM, carga/dibujo simulados, reloj controlado. No navegador ni percepción humana.

11. Cerrar regresiones con evidencia propia:31/24/38s confirmados a pasos30/60/120Hz, continuidad de posición/onda, calamar bloqueado y bodyContext por animal operativo. No reabrir esos puntos por otros defectos del paquete.
12. No encontrado en un barrido no significa imposible. A6s, cámara(0,25;0,5;1), lienzo1280×520 y luz(0,3;0,2), el producto sin cambios admite hacha y linterna juntos. Muestrear tiempo además de encuadre y luz.
13. Cero casos ejercitados no es PASS: HISTERESIS permitió pasos===0. Exigir precondiciones de cobertura y distinguir NO_EJECUTADO.
14. Un competidor bloqueado no prueba elección entre elegibles. SENALAR-AL-PEQUENO excluía al calamar antes de competir. Completar ensayo con dos elegibles y casos ambiguos.
15. Captura y clave requieren estado atómico. El generador restauraba giro1 en vez de la pose anterior; caso065 almacena giro−1 pero representa+1. Medir de nuevo después de preparar la captura.
16. Flags precalculados no sustituyen validación reproducible. Exigido+sin activos+permiso=true pasa en fixture. El build debe validar y entregar el validador, o el runtime rechazar incoherencia; los tres datos actuales son coherentes.
17. Portabilidad se verifica ejecutando desde extracción real. Los scripts Python aún apuntan a build privado aunque los JS nuevos admiten raíz.
18. Extensión total del observable, cuerpo útil y extensión efectivamente visible son métricas diferentes. No usar caja de sprite como perceptibilidad.
19. Conservar el núcleo y corregir evidencia también es progreso. No convertir nuevos findings en rediseño ni declarar formación dominada por documentarla.
La regresión temporal R06 queda cerrada en este retest lógico. Permanecen pendientes browser/AT, casos de selección/evidencia y HUMAN VISIBILITY QA; puede avanzar diseño documental de microescena.


## Contraste Prisma R06.1 · ampliación
Fuente leída:12f99a55a5eeeb879e04a3342a8cb2b20f5cf354. Orden unificada:8c2cfbe49dbfe97fd88a051c260839769f728152, HANDOFFS/NEXO_MARINE_R06_1_20261006/RETEST_Y_PATCH_ACOTADO.md.
20. Una diagonal grande no garantiza un detalle legible: linterna53,9×6,3px en evidencia Prisma. Registrar ambos ejes visibles y diámetro/separación si son puntos; calibrar después con personas.
21. El oráculo debe comprobar la entidad exacta. Una frase presente en toda la lista no acredita el estado de la fila del calamar. Identificadores estables y fallo explícito si falta el objetivo.
22. Medir componente horizontal no verifica ciclo2D. Nombrar periodoHorizontal/periodoVertical o documentar derivación; preservar rutas correctas.
23. Fuente por afirmación requiere vínculo operativo claimId+estado+alcance y verificador contra el registro; un sidecar aislado deriva.
24. Proximidad a muestras no equivale a pertenencia a silueta. Registrar aproximación, casos de frontera y límites antes de cambiar arquitectura.
25. Reconciliar revisiones antes de convertirlas en órdenes: cero casos en un barrido no elimina un contraejemplo; KEEP parcial no cierra gaps distintos.
26. No reducir por accidente la futura microescena variada al banco de tres animales. Inventario documental puede avanzar, con hábitats compatibles, mientras se cierra el gate perceptual.
Estos puntos incorporan revisión ajena atribuida; no se presentan como nuevas reproducciones propias ni nueva validación humana.
