# APRENDIZAJE NEXO · 2026-10-07

## Qué cambió hoy

Hoy consolidé una diferencia clave entre:
- componente técnicamente correcto;
- experiencia comprensible;
- dirección de producto elegida;
- producto listo para escalar.

### Aprendizajes principales

1. **No reabrir una dirección elegida por HUMAN QA.**
   Si María elige 3D por comprensión espacial, la siguiente tarea es mejorar esa dirección, no volver a comparar por defecto.

2. **No sobrerreaccionar al primer diagnóstico.**
   En Mar una revisión exacta redujo un rework amplio a tres defectos concretos. El alcance debe seguir la evidencia más reciente y fuerte.

3. **No aceptar oráculos vacíos.**
   Una prueba de histéresis con 0 casos no prueba estabilidad. Toda condición debe alcanzarse antes de poder evaluarse.

4. **La evidencia semántica tiene que ser visible.**
   Un punto de constelación sin estrella renderizada no puede contar como “estrella observada”.

5. **Compatibilidad futura significa no destruir datos desconocidos.**
   Ignorar un schema futuro al leer no basta; también hay que impedir que la sesión actual lo sobrescriba.

6. **3D sólo cuando aporta significado espacial.**
   Cielo/Vida marina: sí. Escritura/Ritmo/Dibujo: no como obligación.

7. **Una escena espacial debe ser la interfaz principal.**
   Paneles grandes que explican toda la experiencia convierten el mundo en fondo.

8. **Un motor con muchos sistemas no es todavía un juego.**
   El Vado mostró que locomoción + inventario + construcción + objetivos pueden seguir siendo una demo técnica.

9. **Animación perceptual > distancia al hueso.**
   Un objeto unido correctamente a la mano no hace convincente una carga pesada.

10. **Creación se aprende por consecuencia.**
    La entrada correcta es actuar primero y comprender la herramienta por el efecto.

11. **Escalar datos requiere rediseñar la experiencia humana.**
    12→88 constelaciones no es sólo añadir registros.

## Errores propios corregidos

- He emitido órdenes demasiado amplias antes de contar con la revisión exacta de los artefactos. Nueva regla: comparar binarios/medios primero y acotar rework después.
- He tratado a veces “prototipo técnicamente fuerte” como cercano a producto final. El Vado demuestra que hay que evaluar profundidad jugable y consecuencia funcional.
- He formulado alguna dirección como “3D” cuando la regla correcta es “3D cuando mejora significado espacial”.
- En Creación, “Mundos o Escritura” era demasiado abierto. Tras Axioma, el quinto slice queda fijado en Escritura con restricciones para probar que GAME_FIRST funciona sin sesgo 3D.

## Cómo actuaré en siguientes revisiones

1. Identificar pregunta exacta del gate.
2. Elegir evidencia adecuada a esa pregunta.
3. Reproducir caso negativo antes de ordenar cambios cuando sea posible.
4. Separar KEEP / defecto / hipótesis / propuesta.
5. No llamar PASS a ausencia de casos.
6. No usar métrica técnica como sustituto de percepción.
7. No pedir reconstrucción si un patch acotado resuelve el defecto.
8. No escalar catálogos antes de demostrar arquitectura humana.
9. Registrar siempre qué decisión humana está cerrada y qué sigue abierto.
10. Actualizar esta formación cuando un aprendizaje cambie mi método, no sólo cuando aparezca un nuevo artefacto.

Estado:
`NEXO_LEARNING_2026_10_07_INTEGRATED_NOT_CERTIFIED`
