# Nexo · Vera: reparación del bolso, revisión de entrega y siguiente patch
Fecha: 2026-10-06
Estado: KEEP_BAG_REPAIR_DIRECTION__FULL_CHARACTER_VISUAL_REWORK_REQUIRED
No es aprobación de todos los clips ni integración definitiva. NO MAIN · NO DEPLOY.

## Base exacta
ZIP recibido VERA_BOLSO_REPARADO_1.zip: baa6e602228d58c18facdfebc9249948e7ad9e8aea0e24cd8d9de464abfbb5b9, 19.361.305 bytes.
GLB completo: 8e99236d3c796fc00571ec3140a95b3e7b9ec7a8dd794d9f9107d6f1492377af.
GLB web: 167d293b41c128e3a5d2534d5161f458ddd73acdd452be46e9f846a4a7a51632.
Conservar originales y este derivado como bases recuperables.

## Comprobaciones propias y límites
Verificados 5/5 SHA256SUMS; cabeceras y longitudes GLB correctas.
Ambos GLB: 12.734 vértices, 15.116 triángulos, 24 huesos, 19 animaciones.
Todos los accessors decodificados de ambos GLB coinciden exactamente; también sus definiciones de animación. Pesos finitos/no negativos, índices de articulaciones válidos, error máximo de suma de pesos 2,384185791015625e-7.
medidas-por-clip.json suma 3.059 fotogramas por versión; la mención previa de 3.159 no coincide.
Revisadas las láminas de selección, seis clips muestreados y detalle del saludo. El bolso mantiene mejor su forma y ubicación; en la fila reparada del saludo sigue una deformación muy visible de la superficie próxima al brazo/torso.
No se ha reproducido aquí skinning de los 19 clips, renderizado vídeo continuo, probado mezclas de animación ni repetido la comparación FBX. Las medidas cinemáticas son evidencia del autor. No están incluidos el script, los IDs de selección ni los originales GLB necesarios para repetir el diff de 364 vértices.
La igualdad de accessor completo/web no demuestra igualdad con el original ni calidad perceptual de las texturas reducidas.

## Decisión
Conservar la dirección de reparación localizada y el bolso resultante como base del siguiente patch.
No aceptar todavía «los saludos pasan» para el personaje completo. El propio informe reconoce el vestido pendiente y las imágenes lo muestran.
Hips 100% hace rígido el bolso por construcción: 0 mm de deformación verifica esa propiedad, no acredita por sí solo ausencia de penetración, continuidad de la correa o naturalidad del personaje. «Todo bolso de cuero es rígido» no es una propiedad universal; aquí es una elección de representación.
La mediana 3,7% de correa frente a ropa ya defectuosa no es un criterio suficiente. La tabla declara estiramientos de correa de 50% al recoger y hasta 87% en Female_Crouch_Pick_Fruit_Basket_Stand. Falta definir fórmula, agregado y aristas/instantes afectados. No fijar ahora un umbral arbitrario ni asumir que esos porcentajes son fallo visual por sí solos: mostrar los peores casos.

## Orden acotada para Claude
1. Partir de una copia nueva del GLB reparado. Mantener identidad de Vera, geometría, UV, materiales, esqueleto, nombres de clips y las correcciones ya útiles. No rerig global, no regeneración Meshy.
2. Preparar selección visible de la falda afectada, por delante/detrás/lados y en pose problemática, con IDs de vértice/triángulo reproducibles. Distinguir falda, manga, axila, correa y costura entre selecciones. Los 894 vértices son una hipótesis del diagnóstico, no una selección aprobada automáticamente. Respetar la revisión de selección antes de modificar pesos.
3. Corregir sólo influencias impropias de esa selección con los huesos reales adecuados a cada tramo. No borrar globalmente influencias de brazo ni asignar toda la falda a Hips/Spine: mangas y zonas articulares pueden necesitar otras influencias. Normalizar pesos y controlar continuidad en los límites; seleccionar no implica que todos necesiten el mismo reparto.
4. Localizar el estiramiento residual de correa en los peores instantes. Entregar métrica definida y acercamientos; ajustar únicamente si la revisión visual lo requiere. Conservar el bolso; comprobar que no atraviese cuerpo/ropa en recoger, agacharse y correr.
5. Reproducir los 19 clips completos con vídeo continuo y revisión localizada de los extremos. Añadir mezclas reales con sus duraciones: Idle↔Walking↔Running, Idle→saludar→Idle e Idle→recoger/agacharse→Idle. Los clips llamados Transition no sustituyen probar el blending del controlador.
6. Comparar original, bolso reparado y nueva reparación en misma pose/cámara, incluyendo costuras y ropa fuera de selección. Entregar diff de pesos y demostrar que no cambian datos ajenos al alcance. Mantener completa y web equivalentes en malla/pesos/animaciones; revisar visualmente ambas texturas.
7. Precisar el alcance de FBX→GLB: reconvertir con el mismo conversor comprueba reproducibilidad, no por sí solo equivalencia frente a un evaluador FBX independiente. Adjuntar método/scripts/versiones/resultados; declarar explícitamente si el FBX fuente sigue sin reparar. No exigir nueva conversión si no hay cambio relevante.
8. Entregar ZIP nuevo con GLB completo/web, selección antes/después, scripts de medición, índices seleccionados, medidas con unidades y agregados, vídeo y hashes. No sustituir los originales ni marcar HUMAN QA PASS.

Siguiente: selección revisable → patch localizado → retest de personaje completo/transiciones → HUMAN QA María → integración de Vera.
No es necesario pedir a María rehacer Meshy mientras esta reparación localizada sea viable.
