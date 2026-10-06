# Nexo · Cielo completo R02 · revisión y patch acotado
Fecha: 2026-10-06.
Gate: NEXO_SKY_R02_KEEP_CORE_TARGETED_REWORK_REQUIRED.
NO MAIN · NO PUBLIC DEPLOY. No modificar assets aprobados.

## Base y método
Archivo recibido DESCUBRIMIENTO_CIELO_COMPLETO_R02_1.zip: el sufijo de descarga no es una versión R02.1. Contiene R02.
SHA256 581368ff4b2db0208274f3d8cca65f4973b64a4038e4c15b209a8591cd814cfa; 10.558.730 bytes, 329 archivos.
Comprobación propia: 328/328 SHA256SUMS, 277 hashes de recursos del manifest verificados; 180 assets idénticos byte a byte a R01.
Vídeo CIELO_R02_recorrido_1.mp4: 28,64 s, 1280×800, 25 fps, sin pista de audio. Inspección visual de diez fotogramas distribuidos entre 0 y 28 s y capturas entregadas 320/390.
Leídos motor.js, interfaz.js, config.js, estructura HTML/CSS, documentación y bancos. Reproducciones propias Node VM sobre funciones originales; DOM/render simulados, datos reales y fixtures explícitos. NO ejecución propia en navegador, teléfono ni lector de pantalla. No atribuir como propios los 42+23 resultados entregados.
Evidencia reproducible: retest.cjs y RETEST_RESULTS.json junto a este documento.

Orden contrastada: COORDINACION_IRIS_GREEN/HANDOFFS/NEXO_CIELO_COMPLETO_R01_20261006/PROPUESTA_CONSOLIDADA_CLAUDE_CIELO_R02.md, commit bb53dc1f820d35770b00188ae1db2196c3e461f4.

## KEEP
Clic/tap directo en coordenada señalada; hover no desplaza cámara. Flechas físicas asociadas al foco del escenario, sin cruceta principal de ratón. La circunferencia sigue existiendo como feedback y referencia de teclado, no como puntero que haya que perseguir.
Separación localizar/revelar, objetivo propio de cada campo, pista voluntaria sin reloj, capa de hallazgos, ficha progresiva, zoom anclado, vuelta al lugar y separación restablecer/borrar.
Prueba propia de objetivo: encontrar CMa fuera de orden mantiene Ori; descubrir Ori avanza a Gem.
88 constelaciones, datos, proyección, NAVY y assets se conservan.
Cielo continuo entre dos campos era trabajo arquitectónico posterior (§5), no obligación de este ZIP. No convertirlo ahora en un rebuild.

## R02-N01 · P1 · Una estrella basta para anunciar el cinturón
motor.js: umbralVisibles(v) reduce el mínimo a los puntos visibles. Al ocultarse dos estrellas de Orión, una de una cumple 100%.
Caso real, sin oclusores artificiales: W390 H624, cámara u=0.2041327094, v=-0.1558946667, zoom6; clic (388,530.4). Resultado unico/Ori, dentro1, visibles1, total3.
La interfaz emite tipo cinturon y el copy de tres alineadas. Además reconstruye puntos marcados sin filtrar viewport/horizonte: marca dos aunque el motor sólo consideró una visible.
Corrección: mínimo semántico por patrón. Orión requiere las tres estrellas visibles con su relación; no exigir tres universalmente a figuras legítimas de dos puntos, ni toda Hidra. Para constelaciones extensas usar subpatrones sustentados.
Compartir una única función de visibilidad/evidencia entre examen, marcadores y descripción. No contar lo oculto, pero tampoco reducir el requisito semántico porque se haya ocultado.
Aceptación: 1/3 y 2/3 cinturón no producen el mensaje de tres; 3/3 sí cuando corresponde; mismos puntos aceptados/marcados/descriptos. Revisar también estrellaEn, que no aplica horizonte/oclusores antes de abrir una estrella ya descubierta.

## R02-N02 · P1 · Fichas asíncronas todavía obsoletas
tokenCarga cambia al abrir campo o salir a portada; abrirFicha copia ese token, pero no crea un token de ficha y cerrarPanel no lo invalida.
Reproducciones VM:
- pedir Ori, abrir/cerrar Fuentes, resolver después la carga Ori: vuelve a abrir ficha Ori;
- pedir Ori, después Gem; resolver Gem y luego Ori: termina en Ori.
La documentación afirma invalidación por cierre y ficha nueva, que el código no implementa.
Corrección: identidad de solicitud de ficha independiente; invalidar al cerrar, cambiar de panel, seleccionar otra ficha, abandonar escena o cambiar campo. Validar pantalla, campo y solicitud al aplicar.
Mientras carga un campo, evitar interacción con el campo anterior bajo el nuevo campoId. No presentar metadatos nuevos con motor antiguo operativo.
Pruebas con cargas retrasadas y orden invertido, cierre durante carga y error de carga; no sólo dos campos sucesivos.

## R02-N03 · P1 de interacción · Continuar con un dedo tras pinza salta
Los punteros conservan inicio anterior a la pinza. Cuando queda uno, el fallback de drag (movementX/Y=0) usa ese inicio antiguo.
Fixture de los handlers originales: dedos (100,250)/(200,250), abrir a (80,250)/(220,250), soltar segundo, mover primero a79. Movimiento físico1px → desplazamiento del mundo21px.
Esto reproduce un defecto lógico; confirmar su manifestación en teléfono físico. No se declara prueba touch real.
Corrección: rebasar origen/última posición del dedo restante al salir de multitouch; usar deltas clientX/clientY coherentes. Mantener gestoMulti hasta fin para no seleccionar al soltar.
Pruebas pinch→un dedo→pan, pointercancel, tres dedos y alternancia de movementX disponible/no disponible.

## R02-N04 · P1 de producto · Pista única en datos no es pista observable
88 textos, 63 únicos; 53 mencionan magnitud numérica: «la más brillante es de magnitud 2.2», por ejemplo.
Sin instrumento o etiqueta previa, la persona no puede leer ese decimal de un punto luminoso. Contar los puntos de una figura aún desconocida tampoco define por sí solo dónde empieza/termina el grupo entre todas las estrellas del campo.
La prueba R18 compara cadenas duplicadas y busca cifras; no valida distinción perceptual. El JSON declara unicidad pero no demuestra que el renderer comunique esas diferencias.
Corrección: pilotar pistas de forma, relación y brillo relativo que se puedan señalar sobre el cielo SIN líneas. Magnitud exacta pasa a profundidad. No añadir etiquetas numéricas antes de descubrir para salvar la pista.
Cubrir una ruta Orión→vecina y casos débil/extenso/concurrido; mantener acceso a88 y declarar cuáles siguen pendientes de revisión editorial/perceptual. No inventar 88 aprobaciones ni reabrir assets.
Pregunta humana: «¿Qué buscarías aquí?» y después qué patrón señaló, sin sugerir el nombre ni exigir términos técnicos.

## R02-N05 · P2 · Guardado parcial y validación insuficiente
trasMovimiento recuerda cámara en memoria pero no llama guardar. Tras mover con flecha, reproducción: memoria u0.1388888889, almacenamiento u0. Recargar/cerrar pestaña directamente puede perder el último encuadre; la prueba del autor sale por portada, que sí guarda.
Guardar al terminar gesto/transición con frecuencia controlada, y posición visible si se interrumpe. No escribir por cada fotograma.
cargar acepta cámaras v2 con u/zoom no numéricos. M.ajustarCamara no los sanea; la proyección produce NaN (JSON de evidencia lo serializa null).
Validar forma, finitud, IDs y límites antes de mutar estado. Aplicar fallback local seguro y documentar versiones; no asumir que versión correcta garantiza contenido válido.
Prueba reiniciar documento sin visitar portada y guardado malformado. Revisar preservación/migración de hallazgos R01 antes de reemplazo público.

## R02-N06 · P2 factual · Apertura angular incoherente
Al centro de la proyección, la fórmula recorta el radio inferior a0 y divide entre2. Fixture W390 H624 zoom1.35: anuncia6°, aunque usando su propia inversa c(r)=2atan(r/2) el radio es11.9274° y el diámetro23.8547°.
Definir si comunica radio, diámetro u otra extensión, e implementarlo consistentemente. Para punto fuera del centro, obtener ángulos entre rayos transformados por la inversa, no confundir diferencia radial con todo el círculo.
Pruebas centro, borde y continuidad al pasar por r0=dR, con unidades explícitas. No etiquetar «real» una aproximación sin definirla.

## R02-N07 · Formato y alcance de evidencia
El panel desktop sigue absoluto sobre el cielo; estar debajo del texto de objetivo no garantiza no tapar el patrón astronómico. Probar patrón a la derecha, aperturas/cierre conservando dirección y escala aparente. No desplazarlo automáticamente para ocultar el problema; panel en espacio reservado o presentación explícita que conserve referencia.
El 73.9% de320 es altura total canvas/viewport, no intersección visible. En captura320×568 el cielo empieza aproximadamente y195: sólo unos373px (~65.7%) entran inicialmente. El resto y la acción requieren scroll. Informar área visible/intersección, o nombrar la métrica como altura del componente. No recortar letra/targets para alcanzar70%.
touch-action:none cubre la escena; comprobar en móvil real que se puede continuar bajando hasta la acción sin quedar atrapado manipulando el cielo.
Cambio de pantalla oculta el botón activador sin foco de destino explícito en varios recorridos; verificar Tab/lector tras Empezar, Zonas, Volver y carga. No declarar pérdida de foco reproducida en navegador a partir de la VM.
Fuentes fuera de escena no tiene el mismo cierre Escape/contexto que el panel: revisar promesa documental.
Cuaderno actual es lista sin mapa/búsqueda; declarar alcance parcial de propuesta, no necesidad de bloquear todas las correcciones por añadirlo ahora.

## R02-N08 · Pruebas que sobredeclaran
R17 busca múltiples zooms y centros hasta encontrar un resultado correcto, descartando los intentos fallidos. «88 alcanzables» es válido; «ninguna selección equivocada por intención» no se deduce.
Congelar casos de intención ANTES del resultado: todos los clics/errores/ninguno/ambiguo se registran, sin buscar luego un encuadre favorable. Separar cobertura88, precisión en muestra, negativos y percepción humana.
R16 permite PASS cuando el clic directo está fuera de pantalla y se salta esa mitad.
apuntarYPulsar/colocar modifican IG_DEBUG.estado.camara; R15 dispara click por evaluate. Son pruebas híbridas, no recorrido completo «sin atajos». Eventos touch de Playwright no equivalen a dedo en teléfono físico.
Mantener bancos útiles, renombrar alcance y añadir recorridos reales para los contratos relevantes. Los65PASS siguen siendo evidencia del autor, no HUMAN QA.

## Decisión de producto: nombre de Orión
La contradicción procede de §4 de la orden de Nexo, que pidió «Empezar por Orión». Claude la siguió; no atribuirle ese error.
Resolución para el patch: primera visita «Empezar a explorar» / «Start exploring», manteniendo entrada al mismo campo y pista del cinturón. El nombre aparece al localizar el patrón como establece storyboard. Tras descubrimiento, «Volver a Orión» puede nombrar lo ya encontrado.
No pedir a María resolver una contradicción que introdujo la coordinación.

## Orden siguiente y entrega
Conservar R02 y ejecutar R02-N01 a N06; resolver los casos concretos de N07 y corregir la evidencia N08. Pistas: piloto explícito, no texto técnico disfrazado de pista.
Entregar ZIP patch con versión inequívoca, hashes, changelog por hallazgo, pruebas separadas por tipo y vídeo: clic directo fuera del centro → localizar → revelar → ficha → volver → siguiente patrón. Incluir tramo móvil pinch→un dedo y carga/cierre adversos.
Gate de entrega esperado: CLAUDE_SKY_R02_1_PATCH_READY_FOR_REVIEW (todavía NO emitido).
Después revisión técnica/Axioma y HUMAN QA María. No main, deploy ni expansión a cielo continuo dentro de este patch.
