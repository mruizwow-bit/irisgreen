# Vera · revisión del bolso y criterio de reparación
2026-10-06 · Nexo
Estado: DEFECTO_VISUAL_OBSERVADO · CAUSA_Y_REPARACION_PENDIENTES_DE_VERIFICACION
No modifica el personaje ni emite PASS de animación.

## Evidencia y límites
Se ha inspeccionado la lámina vera-bolso-por-clip.png aportada por María. Se observa estiramiento importante de la correa al levantar el brazo, especialmente en los saludos. Las cuatro muestras de Idle_11, Walking y Running no prueban ausencia de defectos en todos los fotogramas ni durante mezclas de clips.
Claude comunica 35 vértices de cadera con 33 % RightForeArm y 6 % RightHand. Nexo no ha reproducido aquí esa medición ni verificado la selección de esos vértices. Es compatible con influencias indebidas del brazo, pero para atribuir el defecto al FBX original y excluir conversión hay que comparar la misma pose en FBX y GLB.
La inspección estructural inicial de Nexo no era una validación visual del rig.

## Decisión propuesta para integración
Conservar Vera y el original canónico. Se puede continuar la integración provisional con los clips básicos tras reproducir sus ciclos completos y transiciones. Excluir provisionalmente los saludos defectuosos.
Reposo, caminar y correr no cubren toda la orden de El Vado: siguen pendientes giro, escaleras, recogida y la acción de construcción. No eliminar acciones necesarias para ocultar el defecto.
No afirmar que el defecto nunca aparece ni que se corrige en diez minutos.

## Reparación acotada sobre copia
1. Duplicar el archivo de trabajo; conservar FBX, texturas, clips y hashes originales. No regenerar la identidad de Vera.
2. Seleccionar manualmente bolso y correa con inspección delantera y trasera. Entregar vista de selección y comprobar que no incluye mangas, falda o bordados. La proximidad, el color o las islas UV por sí solos no acreditan pertenencia al accesorio.
3. Inspeccionar todas las influencias de deformación de la selección. Eliminar las influencias del brazo que se confirmen erróneas, no una lista arbitraria de cuatro grupos sin revisar las restantes.
4. Tratar bolsa y correa por separado. La bolsa puede requerir sujeción rígida al anclaje adecuado; la correa debe acompañar su recorrido sobre el cuerpo. Elegir pesos de torso/cadera, o un hueso accesorio si hace falta, según la estructura real. No imponer todo a Spine con peso 1: puede trasladar el problema a flexión, torsión o penetración de ropa.
5. Revisar y normalizar las influencias modificadas cuando corresponda, preservando lo no seleccionado. No soldar toda la malla ni rehacer automáticamente todo el rig como primera reparación.
6. Comparar antes/después en ciclos completos de saludos, recogida, inclinación, reposo, marcha y carrera; probar sus transiciones. Revisar correa, bolsa, ropa y penetraciones desde varios ángulos.
7. Exportar derivado GLB y comprobar las mismas poses en el loader del juego. Registrar hashes, selección, pesos cambiados, clips revisados y pendientes. Si no puede aislarse el accesorio con confianza, entregar la selección parcial y el bloqueo concreto.

## Aprendizaje incorporado
- Inventario de clips no equivale a cobertura de acciones ni QA visual.
- Capturas muestreadas no acreditan continuidad temporal.
- Separar diagnóstico plausible, medición reproducida y causa localizada en la cadena FBX/importación/exportación/runtime.
- Una reparación necesita una selección fiable; un clasificador geométrico fallido no justifica repintado a ciegas.
- Evitar recetas universales de hueso/peso para accesorios con partes rígidas y flexibles.
- No trasladar a María trabajo en Blender/Meshy antes de agotar una reparación localizada y verificable en una copia.

## Fuentes consultadas
Blender documenta que los pesos automáticos pueden asignar influencias no deseadas y requerir edición manual:
https://docs.blender.org/manual/en/5.0/animation/armatures/skinning/parenting.html
Armature Modifier: grupos de vértices e influencia de huesos:
https://docs.blender.org/manual/en/latest/modeling/modifiers/deform/armature.html
Herramientas de edición de pesos:
https://docs.blender.org/manual/en/2.80/sculpt_paint/weight_paint/editing.html
Estas referencias explican el mecanismo general; no certifican el rig de Vera.

NO MAIN · NO PUBLIC DEPLOY · ORIGINAL INTACTO
