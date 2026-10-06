# Nexo · Vera nueva animada · intake y revisión inicial
Fecha: 2026-10-06. NO MAIN · NO DEPLOY.
Gate: VERA_NEW_ANIMATED_KEEP_CANDIDATE__GARMENT_AND_CLIP_INTEGRATION_REVIEW_REQUIRED.

## Fuente exacta
Meshy_AI_Bluebell_Lace_Doll_biped.zip
SHA256: 8515e02730f6afb558ca04e829c4f726b07e0ed3277cae7625d93dce65a064e8
292648567 bytes. Original conservado en adjunto de María / Library libfile_c2ac2f471d9c8191b9cea4feb0fa485e. Este registro NO sube los binarios a GitHub ni crea URL pública para Claude.

## Comprobación realizada
13 GLB, cada uno con personaje, skin y texturas. 28 joints con nombres Mixamo. 41463 vértices exportados y 30708 triángulos por malla. Color base 2048x2048. Mismos bytes de posiciones/índices/pesos/joints y mismo color base decodificado en los 13; no equivale a haber comparado todos los materiales y bind matrices byte a byte.
Pesos suman 1 con error máximo 1.78814e-7; índices de joints válidos. Todos los tiempos de todos los canales aumentan y sus valores son finitos.
Render propio: evaluación TRS, interpolación lineal/slerp, jerarquía, inverse bind y skinning; 6 poses distribuidas por clip principal (78 renders), cámara fija a 30 grados, color base sin PBR. Revisión visual de las 13 secuencias muestreadas. No reproducción continua ni prueba de transiciones, colisiones, contacto con objetos, rendimiento web o retarget en motor final. Algunas acciones salen del encuadre fijo: no atribuir ese recorte al modelo.

## Inventario (duración en segundos)
- Idle_11: 1.875.
- Walking: 1.041667.
- Walking_Woman: 1.
- Running: 0.666667.
- Wave_One_Hand: 4.125.
- Collect_Object: 6.
- Female_Stand_Pick_Fruit_Basket: 6.208333.
- Carry_Heavy_Object_Walk_inplace: 6.5.
- Charged_Axe_Chop: 7.708333.
- Reaping_Swing: 5.916667.
- Stand_Talking_Angry: 20.833334.
- Agree_Gesture: 13.
- 01a110ff-0826-76f2-8ba4-818bcaf7adb0: 4.041667 (movimiento generado, candidato colocar/recoger-colocar según relato de María).
El GLB generado incluye además animación .001 de 0.083333 s: 14 entradas de animación en total, no 14 acciones de juego aprobadas. No despacharla como acción adicional sin clasificar.

## Conclusiones
KEEP del personaje como candidato; no pedir nueva generación completa.
Reposo, saludo y recogida de pie prometen utilidad. Caminar/correr tienen ciclos y pelvis casi vuelve al origen, pero eso NO prueba pies plantados ni loop visual perfecto.
En poses de caminar/correr/agacharse la falda se separa en lóbulos y deja ver regiones interiores. Revisar clip completo, perfil/espalda y escala de juego, verificando deformación/intersecciones antes de integrar. No inferir todavía qué vértices/huesos causan el defecto ni repintar a ciegas. En saludo muestreado no se observa arrastre extremo de falda como el problema del bolso anterior.
Charged_Axe_Chop y Reaping_Swing tienen posturas y desplazamientos amplios; no asignarlos directamente a construir/recolectar por traducción del título. En coordenadas locales de Hips, rangos XYZ: hacha .482/.722/.766; cosecha .850/.535/.806. Son rangos de pelvis, NO distancia mundial recorrida ni medida de root motion aislado.
Stand_Talking_Angry no es charla neutral: mantener fuera de conversación por defecto. Agree_Gesture dura 13 s y también requiere selección editorial.
El clip generado empieza con manos delante, baja y termina erguido; revisar contacto y recorte de acción antes de darle nombre operativo definitivo. No prometer recoger/colocar objeto real desde animación sin prop ni eventos.

## Integración siguiente
1. Preparar copia derivada con una malla/rig y clips, deduplicando tras verificar compatibilidad de jerarquía/bind pose; no cargar 13 personajes completos en web.
2. Conservar fuentes sin alteración. La reducción de peso del paquete no requiere regenerar a Vera.
3. Revisar falda en locomoción y flexión profunda; ajustes localizados o alternativa de clip solo si evidencia lo pide.
4. Clasificar .001; nombrar clip generado y definir inicio/contacto/soltar/fin. Inventario y colocación solo se actualizan una vez en el evento de juego adecuado.
5. Probar transiciones idle-walk-run-idle, transportar-colocar-idle y recoger-idle, con cancelación y colisiones. No corregir movimiento borrando indiscriminadamente toda traducción de Hips.
6. HUMAN QA María sobre runtime real. Este intake no concede RIG_PASS ni GAME_PASS.

## Aprendizajes
Nombre truncado de catálogo no basta para elegir clip; exportación revela intención Angry. Máscaras/estructura válidas no demuestran ropa bien animada. Capturas muestreadas no son revisión continua. Exportar con skin repite recursos y engorda paquete sin implicar que web deba cargar ese peso. Separar animación, semántica de acción y consecuencias reales del juego.
