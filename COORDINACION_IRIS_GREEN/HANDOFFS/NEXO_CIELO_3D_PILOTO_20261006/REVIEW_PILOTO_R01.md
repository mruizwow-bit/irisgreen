# Nexo · revisión piloto Cielo3D R01
2026-10-06. KEEP_SPHERICAL_CORE · TARGETED_INTERACTION_AND_QA_PATCH.
NO MAIN · NO PUBLIC DEPLOY. No sustituir experiencia actual ni extender88.

## Evidencia propia
ZIP SHA256 369b37a569a26689f7b52197a6393280d538ef4a413d65ceae98042a19dfb813. SHA256SUMS66/66 correctos.
Ejecutadas unitarias del paquete en Node:11/11 PASS. Inspeccionados esfera.js, configuración, secciones de interfaz, pruebas de gestos y documentación. Vídeo59.88s1280x800: inspección de ocho muestras a intervalos8s, no visionado continuo.
No ejecutadas23pruebas navegador de autor: Chromium local ausente. No teléfono físico ni AT. No se afirma integridad comparada contra todo R02.

## KEEP
Direcciones unitarias RA/Dec, cámara fija, proyección perspectiva, transformación compartida, descarte detrás cámara, orientación correcta en pruebas. Canvas2D es un renderer válido para este piloto geométrico3D; no pedir WebGL sólo por etiqueta.
1660estrellas12figuras2zonas verificadas por prueba. Apertura6gradosradio/12diámetro. Orión3/3, negativos1/3y2/3 pasan. Entrada no-spoiler, gesto directo, pinza y cancelación explícitas, fuentes locales.
Continuidad entre zonas se consigue manteniendo una esfera común. No es algo imposible con renderer2D: este mismo piloto lo usa. El contraste es arquitectura por campos frente a orientación continua.

## 1. P1 · decisión ambigua aún depende de CSSpx
La pertenencia a evidencia ya es angular. Pero esfera.examinar resuelve intención con diferencias de distancia redondeada en píxeles y umbral24px. U03 sólo cubre Orión único.
Probe propio con fixture declarado de2patrones de3puntos cada uno, no constelaciones reales:
P0 RA+2/15h, Dec[-.3,0,.3]; P1 RA-2/15h, Dec[-.3,0,.3]; aristas0-1-2.
CámaraRA0Dec0FOV60, clicdirecciónRA-2/15Dec0.
320x304: ambos3puntos, distancias18/0 → ambiguo.
390x450: ambos3puntos, distancias27/0 → intenciónP1.
1440x648: ambos3puntos, distancias39/0 → intenciónP1.
Misma dirección/cámara/evidencia, distinta decisión. No es contraejemplo observado con figuras reales ni tasa de error humano.
Separar política de adquisición motora de resolución semántica: comparar intención angular o dejar elección explícita consistente cuando hay empate; documentar contrato. No volver a engordar apertura móvil.
Además pintarMensaje muestra nombres de constelaciones no descubiertas como opciones ambiguas. Preferir candidatos espaciales/anónimos con marcado correspondiente, revelar nombre tras elección. Añadir fixture de interfaz ambiguo y comprobación no-spoiler.

## 2. P1 de producto · alternativa central demasiado protagonista
En vídeo se ve círculo central y botón Examinar zona central prominente. Entrada enfoca escenario y focus fija tecladoActivo=true incluso con foco programático. No es retícula obligatoria: clic directo existe; no decir que se ha vuelto a imponer.
Patch: distinguir foco accesible de modalidad de entrada. Mantener foco correcto, pero mostrar guía central al usar teclado/alternativa voluntaria; puntero/touch limpian esa guía también al arrastrar, no sólo al examinar.
Primera instrucción breve: arrastra para mirar y pulsa una zona para examinar. Alternativas a drag disponibles en controles secundarios, no borrar accesibilidad.
No rebajar letra/targets por alcanzar70%. Compactar coordenadas técnicas y controles secundarios antes de ajustar cielo320. Medir área visible real, conservar dato53.5% como pendiente explícito.

## 3. P1 de QA · N05 no prueba el dedo que dice
En navegador.js tras touchEnd queda dedo id2,xcentro+110; siguiente touchMove cambia a id1,xcentro-109. No es el mismo dedo desplazado1px: cambia id y219px.
El handler rebasea el dedo restante de forma razonable, pero prueba no demuestra ese contrato.
Corregir secuencia manteniendo id2 y moviendo su x±1; exigir que el evento actualice cámara con delta pequeño NO CERO para evitar PASS por ignorar dedo inexistente. Separar cancel, tresdedos y pan de dosdedos con centro móvil.

## 4. Precisión de pruebas
U08 paso5<=radio6 no demuestra que todo patrón sea alcanzable por rejilla: región válida depende de intersección de conos de sus estrellas. Renombrar a comprobación de parámetro o probar recorrido real.
U11 inspecciona métricas ya guardadas, no las recalcula; documentar procedencia/cálculo y no presentarlo como validación astronómica independiente.
Navegador sin inyectar cámara no equivale a usuario novel: el banco puede usar datos para encontrar destino. Mantener prueba y declarar ayuda algorítmica.
1.19ms por dibujo no equivale a latencia total ni rendimiento de móvil físico.

## Decisión
Mantener piloto y motor. Resolver estos puntos acotados y probar comodidad con María; no exigir reescritura ni expandir catálogo. Puede verlo ya como comparación exploratoria, sin confundirla con HUMAN QA final.
Pregunta principal: ¿señalas lo que quieres y te orientas con comodidad? Si no aporta, no sustituir por novedad técnica.
Orden para Claude: patch selección ambigua + modalidad retícula + N05; ajustar jerarquía320; nuevoZIP/hash/video corto. Revisión técnica/Axioma después, sin reabrir masters.
