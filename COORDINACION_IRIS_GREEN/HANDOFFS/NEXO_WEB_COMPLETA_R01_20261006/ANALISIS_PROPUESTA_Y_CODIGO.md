# Nexo · Revisión de IRIS_GREEN_WEB_R01
Fecha: 2026-10-06. Estado: NEXO_WEB_R01_KEEP_VISUAL_SHELL_PRODUCT_REWORK_REQUIRED.
NO MAIN · NO PUBLIC DEPLOY. Revisión del paquete, no implementación.
## Evidencia y límites
ZIP adjunto IRIS_GREEN_WEB_R01.zip, SHA256 8c182a263d25d687b8bf617caee1d4d0c245b524348d3e9bf0416df6dc9da422, 14461737 bytes.
24 páginas raíz; 95 archivos reales (no 94). HASHES.txt: 94/94 correctos; manifest: 93/93 correctos. Diferentes exclusiones explican los recuentos.
Leídos README, PRUEBAS, manifest, registro, generador, app.js completo, CSS completo, banco y cuerpos relevantes. Inspección visual de capturas entregadas index_1440, index_390, juegos_390; no son capturas propias.
Pruebas propias aisladas: app.js original en Node VM con dobles mínimos de DOM, adjuntas en reproduce.cjs y REPRODUCTIONS.json. Confirman lógica, no interacción nativa, layout ni lector de pantalla.
No se ha ejecutado el banco Playwright ni navegador propio: entorno managed sin control-browser disponible. El 30/30 corresponde al autor. No verificadas afirmaciones comparativas sobre la web publicada ni sus 185 fichas/259 enlaces.
## Decisión
KEEP del armazón visual y componentes. REWORK del contrato de producto, navegación a experiencias y comportamiento incompleto. No aceptar como web completa lista para integración.
## Lo que conservaría
NAVY coherente, fuentes empaquetadas, contraste de tokens documentado, cabecera opaca, migas, seis áreas más Inicio (no siete áreas de producto), componentes compartidos, filtros con estado y región viva, foco definido, menú con contención y Escape, generación estática y salida de tests no cero ante fallos.
Biblioteca/libros reunidos y búsqueda por tema pueden mejorar orientación. No fusionar Investigación/Vídeos exclusivamente porque hoy tengan poco contenido: verificar inventario, intención y rutas.
## Desviaciones de producto prioritarias
1. Juegos vuelve a ser nueve categorías de rutinas con pictogramas. La portada, juegos.html, registro y generador lo definen así. María rechazó expresamente esta equiparación. Rutinas permanecen en Recursos/apoyos de vida diaria; Juegos debe alojar juegos por diversión, incluida Construcción 3D. De nueve categorías sólo Higiene enlaza al ejercicio; las demás no ofrecen partida.
2. Creación presenta el prototipo de dos orillas/canal como primera escena. Construcción/El Vado pertenece a Juegos. Creación necesita su contrato propio, incluido Ritmo, sin apropiarse del juego.
3. Descubrimiento se describe como mirar con calma y no desbloquear nada. Debe explicar acciones reales: explorar, localizar, seleccionar, revelar y profundizar; es distinto de Espacio tranquilo. Sus tarjetas sólo saltan a anclas en la misma página. No hay ruta al área navegable ya entregada ni a Cielo/Peces.
4. Espacio tranquilo se reduce a una página donde no ocurre nada. Eso no sustituye Rincón/Pecera y sus experiencias opcionales. Conservar salida sin estímulos como opción, no redefinir toda el área.
5. Faltan las superficies Para todos/Plus de Juegos, Descubrimiento y Creación. El reparto de contenidos puede quedar pendiente sin borrar esta arquitectura ni inventar precios.
6. La versión inglesa está explícitamente pendiente: HTML sólo es, sin selector. Una propuesta de web entera de Iris Green debe resolver navegación y contenido equivalentes ES/EN.
7. No hay ningún img en las 24 páginas. Las seis puertas tienen el mismo hueco técnico, no dibujos; no se ha materializado la diferenciación visual anunciada. Los placeholders pueden servir en trabajo interno, pero no acreditan diseño con assets reales.
## Diseño y formato
Las capturas muestran buena consistencia de superficies y tipografía. El problema es la uniformidad y la prioridad: en móvil se recorren seis tarjetas grandes casi idénticas, con 136 px por hueco aún vacío, antes de ver las últimas áreas.
Propuesta: portada de elección rápida con seis accesos más compactos, nombre + verbo + imagen existente pertinente. En móvil imagen lateral pequeña y texto, apilando cuando texto ampliado lo necesite. Mantener targets, cuerpo y reflow; no resolver reduciendo letra. Ofrecer acceso a todas las áreas sin depender de recorrer un catálogo largo.
Separar tipos de página: portada para elegir, catálogo para comparar, ficha para entender/entrar, escena para hacer, lectura larga sin forzar todo a tarjetas.
Retirar rutas assets/..., nombres de paquetes, Prisma y comparaciones con defectos antiguos del texto de usuario. Llevar producción al README. El acento no está reservado sólo al selected: CSS lo aplica también a CTA y Sabik; corregir la afirmación o la regla.
IG Zero aparece primero sin archivo. Atkinson sí está. No afirmar que añadir otra fuente no cambia medidas: anchos y saltos deben retestarse con los bytes reales.
## Defectos concretos de código
F01. IG.filtros usa querySelector('[data-limpiar]') y enlaza sólo el primer botón. Buscar, Condiciones, Juegos y Situaciones tienen dos; el botón dentro del vacío no funciona. VM reproduce primer listener presente/segundo ausente. Usar todos y probar el botón contextual.
F02. Etiquetas globales hardcoded: 9 juegos se vuelve '9 fichas'; buscar también anuncia fichas. VM y captura entregada de Juegos lo confirman. Parametrizar sustantivo o usar resultados según el catálogo.
F03. decodeURIComponent sin protección: ?q=%E0%A4%A lanza URIError y aborta filtros. VM reproducido. Parsear robustamente y preservar recuperación.
F04. Buscar no indexa el sitio: filtra textContent de cuatro tarjetas. El ejemplo 'no me entienden en el médico' no coincide literalmente con 'Qué hacer en el médico'. Tampoco existe manejo de carga/reintento que promete el texto. Entregar índice local real o etiquetar alcance de demo; probar consulta útil, variantes, vacío y recuperación.
F05. Trámites: select y botón type=button sin listeners, ni formulario funcional. No filtra comunidad/tipo. Sabik: Preguntar también habilitado sin acción, aunque se avisa que no está conectado. Mostrar estado no disponible claramente o respuesta de indisponibilidad; no botón silencioso.
F06. Mensajes idénticos de rutina ('Bien. Sigue.') se repiten sin información de paso en el status; tener aria-live no demuestra anuncio útil de cada acción. Incorporar paso/acción distinguible y probar lector real.
F07. aria-current=page se asigna por data-area: en condiciones.html marca informacion.html como página actual, aunque es el área padre. Distinguir localización de área y página exacta; las migas ya contienen el destino actual.
F08. Cambiar rótulos no es 'un solo sitio': JSON, registro JS y cuerpos HTML/generador duplican nombres; el generador no lee sitio.json. Generar datos offline/JS y páginas desde fuente única, no sincronizar a mano.
F09. NONE sólo existe como selector CSS data-movimiento; no hay control ni persistencia para activarlo. Es soporte de estilo, no ajuste disponible. REDUCED sólo depende del sistema.
Riesgos a reproducir en navegador, no bugs de layout declarados: índice sticky top16 bajo cabecera sticky; cierre por resize enfoca botón Menú oculto en >=1100; cabecera y scroll-padding fijos con texto 200%; marcos de altura fija con placeholders ampliados.
## Promesas que no deben migrarse sin reconciliación
Privacidad dice no guardar nada y no guardar partidas; la construcción acordada sí tendrá guardado local. Limitar texto al paquete si es una demo, y revisar con Lex el texto de producción y Sabik real. No afirmar seguridad/cumplimiento legal.
Inicio ofrece versión corta/detallada, mientras la página de lectura dice pendiente. Mostrar sólo capacidades disponibles.
Espacio tranquilo afirma acceso permanente junto a Sabik; el enlace está en navegación, oculta tras menú en móvil. Ajustar diseño o afirmación.
Canon visual/estados son documentación del equipo; separarlos del pie público salvo decisión explícita.
## Lo que 30/30 cubre y lo que no
- Carga 24 páginas; otras comprobaciones usan CLAVE de 10.
- Navegación aria-current sólo recorre siete portadas, no subpáginas.
- Recorrido usa locator.first: puede pulsar navegación antes que tarjeta; acredita destino pero no cada CTA.
- Targets sólo se miden con la página de escritorio 1440; excluye inputs/selects. La supuesta excepción inline se infiere de texto restante en padre, lo que también excluye grupos de botones. Mantener política interna 44 px, distinguiéndola del criterio mínimo WCAG 2.5.8 (24 CSS px con excepciones).
- Texto 200% sólo comprueba scrollWidth global: no pérdida interna, superposición, foco oculto o todos los estados abiertos.
- Comprobación del fondo anunciada inert+aria-hidden sólo inspecciona inert.
- Regiones vivas: sólo atributos/copy, no salida de lector.
- 'sin imágenes sin alt' es vacuo con cero imágenes; no prueba accesibilidad de las imágenes futuras.
- No hay pruebas efectivas de ES/EN, trámites, NONE seleccionable, experiencias reales, equivalencia de contenidos o assets.
## Siguiente patch recomendado
A. Reconciliar mapa de producto y reusar áreas aprobadas: Juegos reales / Recursos de apoyo / Descubrimiento activo / Creación / Espacio tranquilo.
B. Integrar imágenes existentes verificadas y navegación Para todos/Plus sin asignar acceso ficticio. Inglés funcional. Texto público limpio.
C. Resolver F01–F09 y promesas sin acción. Estado vacío honesto para lo aún no conectado.
D. Fuente de datos única + tests de CTA contextual, consultas reales, controles por viewport, clipping interno, modal/resizing y regreso desde experiencia.
Entrega siguiente: ZIP exacto, hash, capturas del runtime, tabla ruta→función→estado→dependencia. No reemplazar main ni assets aprobados.
Gate sugerido: CLAUDE_DESIGN_WEB_COMPLETA_R02_READY_FOR_REVIEW, seguido de Axioma y HUMAN QA María.
## Fuentes primarias contrastadas
W3C Reflow: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html (sin pérdida de información/función; no sólo scrollWidth).
W3C Target Size Minimum: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html (distinguir mínimo técnico y política 44).
W3C APG Breadcrumb: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/ (página actual frente a padre).
