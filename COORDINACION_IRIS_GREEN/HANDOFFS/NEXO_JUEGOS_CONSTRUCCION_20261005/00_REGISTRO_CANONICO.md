# NEXO · Juegos reales · Construcción R01 · Registro canónico
Fecha: 2026-10-05, Europe/Madrid. Issue #369.
Estado: BRIEF_AND_WORK_ORDERS_RECORDED; storyboard, runtime y HUMAN QA pendientes.
Registro consolidado de memoria, diseño, órdenes, planificación y criterios. GitHub es fuente canónica.
## 1. Decisiones de María y memoria
María rechazó la Habitación imposible montada: elegir una flecha y revelar una respuesta no resultó un juego divertido. HUMAN QA FAIL invalida su avance como producto aunque hubiera PASS técnico/storyboard. No continuar rework del runtime anterior.
Mapa del tesoro permanece DISCARD. No rescatarlo por parecido visual.
Necesitamos juegos normales de construcción y parejas de memoria: diversión, decisiones, reto y consecuencias. Recursos ya cubre actividades de aprendizaje; Descubrimiento cubre explorar/localizar/revelar conocimiento; Espacio tranquilo cubre descanso. Juegos no debe duplicar esas áreas ni tener regulación sensorial como objetivo.
Accesibilidad es transversal y no debe eliminar las decisiones jugables.
Nexo define mecánicas y coordina; Prisma realiza storyboard/prototipo; Axioma revisa calidad y accesibilidad; María valida diversión. Nexo comenzó archivos locales de prototipos antes de la corrección de María: trabajo detenido, no entregado y no autorizado como línea de implementación.
WIP activo: construcción. Parejas queda definido como siguiente propuesta, no abrir simultáneamente.
## 2. Fuentes y aprendizaje
FARO_Documento_Maestro_V2(1).pdf y FARO_INFORME_COMPLETO_ESTADO_Y_PLAN.pdf fueron leídos. El segundo está fechado 2026-06-05 y referencia FARO_v141.html; no hemos inspeccionado ese HTML. Su estado es histórico declarado, no evidencia runtime actual.
KEEP conceptual: mundo persistente, refugio propio, materiales y sistemas conectados, alcance reducido.
No adoptar como mecánica central: espera oculta para premios, interpretación del sistema nervioso, seleccionar herramienta/punto caliente para recibir ficha, Atlas educativo, regulación como objetivo.
El informe admite construcción y plantación no implementadas. No declarar esos sistemas existentes.
Referencias oficiales consultadas:
- https://na.store.square-enix-games.com/dragon-quest-builders-2 : explorar, recoger, fabricar; recetas y construcción.
- https://www.minecraft.net/en-us/article/creative-vs-survival-mode : recursos frente a libertad creativa.
- https://www.minecraft.net/article/minecraft-controls : controles de movimiento/colocación.
Inspiración de sistemas, no copia de assets/personajes.
Investigación previa sobre preferencias neurodivergentes: no establecer un ranking universal ni inferir gustos individuales por diagnóstico.
Aprendizaje: TECHNICAL_PASS != PRODUCT_PASS; animar una respuesta no crea una mecánica; prototype-first; HUMAN QA es evidencia; construir debe alterar espacio y permitir utilizar lo construido.
## 3. Contrato de producto
Nombre provisional: El taller de las islas.
Construcción con personaje controlable, materiales limitados, varias soluciones y posterior modo libre.
Bucle: conseguir materiales → elegir piezas → construir → probar → corregir → ampliar posibilidades.
Duración objetivo de prueba 10–15 min, no temporizador de partida.
Alcance: escenario único, personaje, madera/piedra, plataforma/bloque/escalera, dos retos, parcela libre, guardado local.
No incluir Atlas, fichas educativas, respiración, compañeros, multijugador, backend ni otras islas.
## 4. Escenario y recorrido
Referencia de composición: 24x18 casillas; hasta cuatro niveles construibles sobre terreno. Ajustable por Prisma antes del storyboard, con justificación.
Zonas: taller inicial; orilla inicial; canal; orilla opuesta con caja y piedra; terraza tres niveles más alta; parcela libre.
Ruta corta: cuatro casillas de agua sin apoyo intermedio.
Ruta larga: seis casillas con apoyo fijo central.
Ambas deben ser construibles paso a paso, no solo válidas en una imagen final.
Inicio: “La caja de herramientas está al otro lado. Construye un camino para llegar.”
Práctica breve voluntaria: colocar/retirar plataforma; ayuda siempre consultable.
Reto 1: recoger madera, elegir ruta, construir y recorrer; abrir caja desbloquea escaleras.
Reto 2: “Ya puedes fabricar escaleras. Llega a la terraza para abrir tu parcela.”
Al alcanzar parcela: modo libre con materiales ilimitados, mismas reglas espaciales.
No ventanas de tutorial obligatorias.
## 5. Economía
Disponibles: 24 madera en taller, 12 piedra junto a orilla inicial, 12 piedra adicional en orilla opuesta.
Montones visibles, una interacción recoge cada montón; contenido indicado; sin repetición mecánica ni espera de regeneración.
Costes: plataforma 1 madera; bloque 1 piedra; escalera 2 madera.
Retirar devuelve coste completo. Colocación inválida no consume recursos. Permitir reutilización.
## 6. Reglas propuestas y bloqueantes de diseño
Posición por casilla y altura; comprobar ocupación, apoyo y tránsito.
Plataforma: horizontal, una casilla, transitable. Sobre terreno/bloque o conectada a plataforma de misma altura; distancia máxima de dos pasos horizontales a apoyo sólido siguiendo plataformas. No sostiene bloques de piedra.
Bloque: sólido, descansa en terreno u otro bloque; puede formar pilares en lecho del canal. No ocupa otra pieza/personaje. Altura limitada.
Escalera: una casilla, cuatro orientaciones, conecta dos alturas consecutivas; sobre terreno/bloque y salida superior transitable; sin salida contra pared/hueco.
Retirar apoyo con dependientes se bloquea: “Retira primero las piezas que dependen de este apoyo.” Sin derrumbes R01.
Personaje no atraviesa paredes/huecos; agua bloquea paso, no daño; no salto R01.
IMPORTANTE: brief inicial decía subir un bloque automáticamente; eso puede hacer redundante la escalera. NO implementar esa frase sin cerrar contradicción.
Bloqueantes antes de código:
A. Mostrar secuencia de colocación de dos puentes compatible con alcance de construcción y apoyos. Determinar alcance de cursor: aún no cerrado.
B. Fijar tránsito vertical para conservar función de escaleras y bloques.
C. Definir altura del lecho, orillas y piezas con coordenadas concretas; demostrar costes.
Prisma propone; Nexo reconcilia; Axioma verifica. No cambiar silenciosamente reglas.
## 7. Controles e interfaz
Modos Recorrer / Construir; construir detiene personaje; recorrer prueba construcción.
Flechas/WASD para personaje o cursor según modo. Touch cruceta; ratón selecciona casilla.
E/interactuar; B/cambio modo; 1/2/3 piezas; R/girar; Enter/Space colocar; Escape cancelar; Ctrl+Z deshacer. Todos los atajos tienen botón visible equivalente.
Botones subir/bajar nivel, colocar, retirar, deshacer, cancelar.
No drag obligatorio ni pulsaciones simultáneas. Direcciones coherentes con pantalla.
Escena predominante; objetivo breve; materiales; modo; barra de piezas; ayuda/ajustes/pausa.
Selección muestra nombre, coste, orientación, altura, preview y validez textual.
Errores: material insuficiente, casilla ocupada, apoyo demasiado lejano, salida superior de escalera inválida.
Preview distinta de pieza construida; símbolos/texto además del color.
Ayuda voluntaria: controles/objetivo → regla relevante → ejemplo identificado. No resolver automáticamente.
## 8. Guardado y estados
Guardar tras acciones confirmadas: posición, inventario, piezas/orientación, recursos recogidos, receta, retos, ajustes.
Continuar/Nueva partida. Reinicio con confirmación y explicación de borrado. Guardado incompatible/dañado ofrece recuperación clara sin bloquear.
Estados: inicio, recorrer, construir, pausa, reto1 superado, reto2 superado, libre.
Deshacer debe mantener inventario y geometría coherentes; concretar historial mínimo durante diseño runtime.
## 9. Assets
Terreno/canal/lecho/apoyos/taller/terraza; personaje orientable; plataforma/bloque/escalera cuatro orientaciones; montones madera/piedra/caja; iconos con etiquetas; previews/selección/objetivo.
Formas provisionales coherentes para probar reglas. Assets finales después de aprobación de experiencia. Texto fuera de imágenes.
## 10. Normativa y criterios técnicos
No declarar cumplimiento jurídico ni conformidad completa a partir de este brief. Axioma verifica estándares vigentes y Lex aplicabilidad jurídica.
Referencias de trabajo de Axioma: WCAG 2.2, WAI-ARIA 1.2/APG, COGA, EN 301 549, ISO/IEC 30071-1, ISO 9241-210, ISO/IEC 25010/25040. Versiones/aplicabilidad concretas pendientes de revisión por Axioma; no inventar cláusulas.
Objetivo interno touch 44x44 px: requisito del proyecto, no afirmar que sea el mínimo universal WCAG AA.
Teclado completo, foco visible independiente de selected, roles/nombres/estados, feedback textual, sin color/audio exclusivo, reflow/texto ampliado, 320/390/1440, forced-colors.
NORMAL/REDUCED/NONE para movimiento decorativo; mismas reglas de juego; sin flashes/sacudidas; silencio funcional.
aria-live polite breve para resultados/materiales/objetivos, no cada paso.
Representación accesible de casilla seleccionada con coordenadas/altura/contenido/acciones. Imagen sola no basta; verificar posibilidad real de resolver retos con alternativa.
## 11. ORDEN PRISMA
Alcance inmediato STORYBOARD, sin código.
Entregar plano; seis frames (objetivo, recogida, preview, construcción incompleta/error, corrección/cruce, escalera/terraza/libre); dos soluciones con secuencias y costes; escritorio1440/móvil390 y adaptación320; estados Recorrer/Construir/foco/selected/validez; lista assets y provisionales.
Cerrar/proponer correcciones A/B/C del apartado6, sin cambiar contrato silenciosamente.
Registrar archivos/rama/commit en issue369; conservar main.
Gate de entrega: PRISMA_CONSTRUCTION_R01_STORYBOARD_READY_FOR_AXIOMA.
## 12. ORDEN AXIOMA
Revisar versión exacta del storyboard contra este contrato.
Verificar objetivo/acciones, soluciones paso a paso, recursos, apoyos/altura/orientación, función diferenciada bloque/escalera, preview/selected/foco, errores recuperables, equivalencia teclado/touch, objetivos internos y adaptación.
Entregar matriz requisito/evidencia/resultado, bloqueantes por frame y corrección, checks solo verificables en runtime separados, READY FOR HUMAN QA o REWORK.
No certificar diversión ni conformidad runtime a partir de imágenes.
Registrar rama/commit y fuente revisada en issue369.
Gate si pasa: AXIOMA_CONSTRUCTION_R01_STORYBOARD_READY_FOR_HUMAN_QA.
## 13. Planificación y gates
1 Nexo: registrar contrato/memoria/órdenes/criterios (este registro).
2 Prisma: resolver contradicciones y storyboard. Pendiente, no enviado por Slack por este registro.
3 Nexo: reconciliar cambios de reglas; Axioma revisar storyboard.
4 María: HUMAN QA visual explícita.
5 Prisma: prototipo interactivo aprobado, coordinación runtime según disponibilidad. No interrumpir Motor/Sabik ni asumir asignación.
6 Axioma: QA real teclado/touch/estados/guardado/soluciones.
7 María: HUMAN QA diversión.
8 Solo tras PASS, plan integración con main vivo, drift check y rollback. No mergear toda esta rama: contiene runtime anterior rechazado.
Sin fechas de entrega inventadas ni autorización automática de código por publicar documentos.
## 14. Aceptación
Construir desde primer minuto; piezas alteran recorrido; dos soluciones; retirar/reusar; retos completados recorriendo; persistencia; teclado/touch; escena visible; libre tras retos.
HUMAN QA pregunta: ¿construir agradable, decisiones interesantes, ganas de seguir probando? Si falla, revisar mecánica antes de ampliar.
## 15. Parejas: backlog conservado
Cartas ocultas; abrir dos; iguales quedan descubiertas; distintas vuelven a ocultarse; encontrar todas.
Primer prototipo futuro seis parejas; después10/15; barajar; solo o dos locales; acierto permite repetir turno, gana mayor número de parejas.
Tiempo de observación ajustable/cierre manual; reloj no incluido R01; intentos al final opcionales. Sin contenido educativo obligatorio.
Sin orden de implementación simultánea.
## 16. Reanudación
Leer este archivo primero para Juegos. Leer formación Nexo y handoff20261004 para otras líneas. Consultar entregas reales #369, live main y drift. Continuar una sola línea.
No reutilizar gate de Habitación como aprobación de construcción. No declarar storyboard, runtime, envío Slack o HUMAN QA completados hasta evidencia.
