# Formación aplicada R02 — Personajes anime/chibi en Blender 3D
Fecha: 2026-10-09
Estado: MATERIAL DE PRÁCTICA PREPARADO — BLOQUEO NO APROBADO — SIN EJECUCIÓN DE BLENDER
Contexto: personajes originales de Iris Green; no alterar assets aprobados, ni la web ni el juego FARO.

## Fuentes primarias estudiadas
- Blender Studio, **Stylized Character Workflow**, Julien Kaspar: https://studio.blender.org/training/stylized-character-workflow/ (concepto → escultura → retopología → UV/shading; contenido de pago y muestras libres).
- Blender Studio, **Toon Character Workflow**: https://studio.blender.org/training/toon-character-workflow/ (modelado → rigging → shape keys → animación).
- Blender Studio, **Character Rigging**: https://studio.blender.org/training/blender-2-8-fundamentals/character-rigging/ (material introductorio gratis).
- Blender 4.5 Manual, **Reference Images (Empty/Image)**: https://docs.blender.org/manual/en/4.5/modeling/empties.html
- Blender 4.5 Manual, **Shape Keys**: https://docs.blender.org/manual/en/4.5/animation/shape_keys/introduction.html
- Three.js, **Loading 3D Models**: https://threejs.org/manual/pages/loading-3d-models.html (glTF/GLB para runtime web).

## Orden y condición de avance
1. Cabeza: **UNA malla editable** girada frontal, lateral y 3/4; corregir contra PNG originales; nunca reutilizar cabeza genérica como identidad.
2. Cara: pómulos/mandíbula → cuencas → ojos y párpados → nariz/boca; comparar identidades sin peinados.
3. Cuerpo: proporciones observadas por personaje, equilibrar articulaciones, pose A; manos y pies.
4. Cabello: volumen y mechones propios; trenzas, lazos y rizados según los PNG exactos.
5. Vestuario: capas de ropa y pliegues característicos; materiales optimizados para tiempo real.
6. Retopología: loops de boca/ojos y articulaciones; normales y UV; revisar densidad.
7. Rigging: esqueleto deformable, pintura de pesos, pruebas de brazos/rodillas/cuello, sin interpenetraciones.
8. Expresiones: shape keys sobre topología estable, probar identidad en varias emociones.
9. Animaciones: idle/caminar/girar/interactuar/sentarse, con controles de accesibilidad; optimización.
10. Exportación GLB para web (o formato confirmado por runtime) y QA de integración; sin publicar sin aprobación.

## Práctica 01 disponible en el chat (archivo VERA_3D_LECCION_01.zip)
Contiene dos recortes EXACTOS del original frontal y perfil, hoja original, script Blender `crear_escena_vera.py` y LEEME.
El script prepara dos referencias tipo Empty/Image y una malla de bloqueo 3D paramétrica editable, que debe ajustarse manualmente. No se ha ejecutado Blender en el entorno de preparación: existe validación de sintaxis de Python y ZIP, no prueba funcional de Blender ni archivo .blend verificado. No afirmar lo contrario.

## QA obligatorio del primer ejercicio
- Misma malla al girar (no renders independientes).
- En frontal y perfil, volumen del cráneo, mejillas, nuca y mandíbula cotejados con referencia.
- Señalar explícitamente lo invisible/hipotético bajo el cabello como inferencia.
- Entregar archivo .blend real, imágenes 0°, 45°, 90° y vídeo de giro de la misma malla.
- Bloqueo sin pelo, ojos, cuerpo o vestuario hasta HUMAN QA sobre cráneo.
- Ninguna medida publicada se considera antropométrica o canónica si proviene de un supuesto.

## Persistencia
Esta es formación de procedimiento, NO aprobación ni capacidad de modelado demostrada. El trabajo 3D seguirá sólo después de pruebas visuales y de archivo editables.