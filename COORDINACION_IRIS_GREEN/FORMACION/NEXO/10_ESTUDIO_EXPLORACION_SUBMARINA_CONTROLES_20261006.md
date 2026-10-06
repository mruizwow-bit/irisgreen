# Nexo · Ampliación de investigación: exploración submarina y controles

2026-10-06. María aclara «no sé, investiga en internet». Se amplía la investigación previa de Vida marina R03 con artículos de los propios desarrolladores y fuentes de usabilidad. No cambia la aplicación ni constituye validación con usuarios.

## 1. El mundo necesita lugares reconocibles

Unknown Worlds describe la diversidad de biomas como objetivo del diseño de Subnautica y explica el uso consistente de elementos repetidos para distinguir una zona sin multiplicar indefinidamente modelos y coste. Fuente primaria leída: https://unknownworlds.com/en/news/subnautica-concept-art-coral-reef-3

Aplicación propuesta para Iris Green: referencias locales persistentes —arco de roca, claro de arena, agrupación vegetal compatible— que ayuden a recordar y volver. Reutilizar un conjunto de assets de hábitat con composiciones diferenciadas; cada lugar necesita una función de observación. No basta cambiar el color del fondo ni generar un mapa nuevo al regresar. Esta transferencia es criterio de diseño de Nexo, no prueba de que funcione en nuestra interfaz.

## 2. Cámara estable y respuesta al gesto

Max Kaufmann, ingeniero de Giant Squid, explica que suavizar movimiento puede introducir retraso y que el equipo podía acostumbrarse a controles que seguían siendo problemáticos para nuevos usuarios. En su artículo de cámara explicita mantener el horizonte sin roll y evitar que determinados giros del personaje arrastren la cámara.

Fuentes completas leídas:
- https://giantsquidstudios.com/Fluid-Motion-in-ABZU
- https://giantsquidstudios.com/Camera-Control-in-ABZU

Aplicación: en nuestra escena 2D conservar selección directa, cámara controlada por la persona y parada inmediata al pausar/examinar. Una animación suave no demuestra comodidad. Al pulsar «Asomarse» indicar el cambio, permitir volver y usar salto discreto en NONE; evitar seguimiento automático, rotaciones e inercia añadida por estética. No trasladar el controlador 3D de ABZÛ como dependencia técnica del prototipo.

## 3. Vida mediante conducta colectiva

Matt Nava describe que ABZÛ contiene cientos de especies y simulación de comportamiento en bancos. Fuente primaria: https://mattnava.com/ABZU

Aplicación: especies y encuentros no tienen una relación de uno a uno. Un banco es una unidad perceptiva; un refugio, un lugar de encuentro. Organizar 200+ entradas con familias de conducta y microhábitats contrastados, manteniendo rasgos propios. No convertir todas las especies en un mismo pez ondulante con distinta imagen.

## 4. Reconocimiento y presentación progresiva

NN/G explica cómo señales visibles y ayudas contextuales reducen la necesidad de recordar instrucciones, y cómo mostrar primero las acciones importantes permite reservar detalles para quien los necesita. Las acciones frecuentes deben seguir visibles; no esconder todo detrás de ajustes.

Fuentes leídas:
- https://www.nngroup.com/articles/recognition-and-recall/
- https://www.nngroup.com/articles/progressive-disclosure/

Aplicación: escena como foco, navegación/pausa/mapa disponibles y una acción junto al encuentro seleccionado. Pistas que se refieren a lo visible; no exigir memorizar un tutorial. Identificar mantiene la escena y muestra una explicación breve sobre lo observado; tabla factual y fuentes se abren voluntariamente. El mapa y el historial conservan referencias para continuar otro día. Esto complementa COGA; no sustituye pruebas con María ni conformidad WCAG.

## 5. Prototipo de primer recorrido a contrastar

Entrar en un lugar reconocible; notar un rasgo parcial; pulsar para observar desde otro ángulo; identificar; volver con el encuadre conservado; elegir una ruta visible hacia un encuentro de conducta diferente. No fijar tiempos, reflejos ni espera obligatoria. En NONE, mismo contenido mediante pasos estáticos. Medir si una persona nueva sabe qué tocar, entiende la consecuencia y puede regresar sin explicación oral.

Se localizó además el resumen de la charla GDC «The Design of Subnautica» (https://gdcvault.com/play/1025745/The-Design-of-Subnautica), pero no se vio la charla completa; no se atribuyen a ella conclusiones más allá de su resumen. Las fuentes consultadas no prueban preferencia universal de personas neurodivergentes.

Este documento amplía 09_MUNDO_MARINO_ENCUENTROS_Y_HABITATS_20261006.md y el informe NEXO_MARINE_R03_MUNDO_VIVO_20261006 en la rama nexo/new-games-area-r01-20261004. El siguiente trabajo debe materializar y probar estas decisiones, preservando los assets aprobados y el canon NAVY.
