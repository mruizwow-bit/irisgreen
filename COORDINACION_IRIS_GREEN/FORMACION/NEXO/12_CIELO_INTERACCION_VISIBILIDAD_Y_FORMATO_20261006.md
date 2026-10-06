# Nexo · Formación aplicada 12 · Cielo, visibilidad e información
Fecha 2026-10-06.

## Práctica y evidencia
Análisis de Cielo completo R01, SHA256 eaa15fcc98157f4d7f26c874a74d9d50bc8bc63061ca81067c56b66f01512bd6, 320/320 hashes.
Informe y fixtures:
COORDINACION_IRIS_GREEN/HANDOFFS/NEXO_CIELO_COMPLETO_R01_20261006/ESTUDIO_INTERACCION_FORMATO_Y_PROPUESTA_CLAUDE.md
Commit de conjunto b6523a9641c2cc15dfe5080ec02cbd5ad50cab58.
Fuente leída, capturas del autor inspeccionadas, fixtures Node independientes. No navegador/lector/teléfono propios.

## Aprendizajes
1. La corrección del gesto principal no garantiza continuidad: objetivos, contador, guardado y carga pueden desincronizarse.
2. Visibilidad es un contrato común: hit-test de estrella, patrón y descripción deben excluir lo oculto igual. Fixture abre ficha de estrella dentro de franja de horizonte, mientras el patrón sí aplica exclusión.
3. Una variable de puntero único sobrescrita no implementa multitouch. Segundo contacto puede terminar en clic; hay que suprimirlo incluso sin ofrecer pinch.
4. Clic selecciona; encuadre mueve cámara. Separarlos evita desplazamientos inesperados. Zoom anclado al puntero es propuesta a probar, no requisito universal de conformidad.
5. Cambiar tamaño del canvas para un panel puede cambiar escala aparente: con escala proporcional al lado mayor, preservar zoom numérico no basta. Proteger dirección y escala sin deformar proyección.
6. Contenido existente no equivale a contenido explicado. «El cazador», genitivo y tabla son datos; falta relacionarlos con lo observado en lenguaje comprensible.
7. Pistas derivadas geométricamente pueden ser duplicadas o poco observables. La validez científica del dato no certifica utilidad de la consigna.
8. Figura, asterismo y región son entidades distintas. No enseñar dibujo como límite oficial ni estrellas alineadas como grupo físico.
9. Profundidad bajo petición permite conservar escena como tarea principal; no ocultar acciones frecuentes ni encadenar demasiados niveles.
10. Denominador explícito para porcentaje de cielo; viewport visible no es documento ni altura CSS. La ampliación de texto exige lectura/operabilidad aunque altere proporción.
11. Mantener cámara al volver es un requisito distinto de guardar el campo. Restablecer vista no debe borrar hallazgos.
12. Selección accesible no es sólo teclado: drag requiere alternativa de puntero simple. Un mapa de vista general puede ser candidato sin volver a cruceta principal.

## Fuentes consultadas
- Stellarium FAQ: https://github.com/Stellarium/stellarium/wiki/FAQ
- IAU: https://iauarchive.eso.org/public/themes/constellations/
- NASA NSN: https://science.nasa.gov/solar-system/skywatching/night-sky-network/connecting-the-dots-with-asterisms/
- NASA: https://science.nasa.gov/skywatching/faq/
- NN/g: https://www.nngroup.com/articles/progressive-disclosure/
- W3C: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
- W3C: https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html

No se leyó la guía completa Stellarium (fallo de tamaño en recuperación); no atribuir al estudio una prueba de software externo. Investigación NASA no implica introducir sus assets en Iris Green. Propuesta documentada; sin modificar runtime ni publicar.
