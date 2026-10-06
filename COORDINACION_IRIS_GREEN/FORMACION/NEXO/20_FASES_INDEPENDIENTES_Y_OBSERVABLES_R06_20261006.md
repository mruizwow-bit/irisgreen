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
