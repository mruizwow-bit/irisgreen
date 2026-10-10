# LUMEN · ESTUDIO DE DISEÑO VISUAL · COGNITIVO 01 «EL CLARO ESCONDIDO»

Fecha: 10/10/2026  
Estado: ESTUDIO_DOCUMENTADO__DIRECCION_VISUAL_PENDIENTE_HUMAN_QA  
Origen de la orden: rechazo de la pantalla R03/R04 («es muy tuyo, no es de mi marca») y requerimiento de estudiar diseños antes de generar nada.  
Alcance: dirección artística del juego 01. No cambia mecánicas, edades, assets KEEP_LOCKED ni publica nada.

## A. Hallazgos al inspeccionar el canon propio

### A1 · Informe de formación visual Iris Green, 09/10/2026
Fuente: Library, IRIS_GREEN_INFORME_VISUAL_FORMACION_2026-10-09.pdf, 184 páginas. Páginas examinadas: 1-22, 52-54, 70, 102-103, 117-118.

- Pág. 4: Faro se construye por **funciones, materiales, topografía, escala y luz**, no por decoración añadida. Menciona huerto, taller, muelle, tres parcelas, caminos, puentes, canales, costa y faro. Paleta de mundo del Faro documentada: hierba #79C653/#4F8F58, tierra #C99B6A, roca #7B8797, arena #E8D39B, agua #72D8D2/#1D679C, madera #93633D, piedra #A7B2BF. No inventar nuevos assets de la isla por inercia.
- Pág. 5: El Taller rechaza explícitamente portadas/fondos genéricos de IA, hojas decorativas, papel envejecido, personajes repetidos, texto de relleno. Las pantallas deben permitir **hacer la actividad**, no ilustrar un anuncio.
- Págs. 20-21: hojas originales de Vera (diferentes vistas y diseño aislado). KEEP como identidad, NO dibujar un sustituto o mascota.
- Pág. 70: P31 portada Faro; páginas 117/118: P29 ordenador y P30 móvil. Están catalogadas como «referencia definitiva/aprobada» **según nombre del archivo**. Hay que tratar esa condición como etiqueta de la fuente, NO como validación autónoma de cada píxel del juego cognitivo.
- Págs. 102-103: P65/P66, misma isla bajo luz de mañana/mediodía. Enseñan continuidad de lugar y de iluminación.
- Pág. 2: diferenciación entre ORIGINAL, APROBADA, REWORK y PRUEBA TÉCNICA. Nunca mezclar estados.

### A2 · Identidad editorial
Fuente: Library, HOJA_IDENTIDAD_VISUAL_RECURSOS.docx, serie «En la vida diaria».

- Manifiesto de silencio, composición editorial y reconocibilidad por sistema, no por adorno.
- Ese documento se circunscribe explícitamente a fichas, publicaciones, cartelería y materiales de la serie editorial. **No es autorización para sustituir el lenguaje visual del juego Faro** por el estilo de una ficha impresa.
- Sí sirve como evidencia transversal de rechazo de decoración automática y de criterio compositivo.
- No injertar la estrella azul de Luma ni los puntos de su serie en el juego cognitivo salvo aprobación expresa.

### A3 · Manual de Lumen en GitHub
- COORDINACION_IRIS_GREEN/FORMACION/A7_LUMEN/00_EMPIEZA_AQUI.md
- 08_APRENDIZAJE_OPERATIVO_R04_20261007.md
- 09_CONTINUIDAD_OPERATIVA_20261007.md

Principios: evitar regenerar KEEP_LOCKED, distinguir QA técnico y perceptivo, documentar procedencia, escena limpia, teclado/móvil accesible, no declarar aprobada una imagen generada.

## B. Estudio externo: TÉCNICA, no apropiación de estilo

| Referencia | Evidencia del proceso | Principio abstraído | Lo prohibido |
|---|---|---|---|
| Hidden Folks | arte dibujado a mano, escaneado, compuesto en capas, interacciones individuales; https://hiddenfolks.com/press/hidden-folks-1 | diseñar paisaje como colección de elementos con función real, con organización por capas; el detalle no es pegote | replicar su trazo monocromo, escenas ni puzles |
| Alba: A Wildlife Adventure | preproducción con lugares de España, referencias fotográficas y de Sorolla; simplificación material con gradientes, decals, LOD; https://ustwogames.co.uk/news/the-environment-art-of-alba-a-wildlife-adventure/ | construir mundo con geografía y materiales antes de estilizar; mantener continuidad entre escenas | copiar isla, vegetación, look mediterráneo o personajes |
| A Little to the Left | objetos basados en su casa y dibujados digitalmente a mano; https://www.ps4blog.net/2022/11/ps4blog-net-interview-max-inferno-on-a-little-to-the-left/ | el objeto principal necesita proporción, tactilidad, materiales y respuesta interactiva | copiar estilo flat, gato, objetos o soluciones |
| Smithsonian Gardens botanical illustration | diferencia explícita precisión de ilustración científica vs expresión artística; https://gardens.si.edu/exhibitions/orchids-hidden-stories-of-groundbreaking-women/botanical-art-and-illustration/ | estudiar morfología foliar real y silhouette antes de estilizar | copiar láminas; llamar científica a una hoja ficticia |

No se descargan ni integran imágenes de videojuegos como assets. Las referencias exteriores son estudio únicamente.

## C. Diagnóstico visual R03/R04 (rechazado)

Observaciones a partir de la captura de usuario y prototipos revisados:
- Elipse = árbol; círculos/bordes/sombras de tarjetas repetidos; hojas radiales genéricas; paisaje indiferenciado: lenguaje placeholder.
- Escena y respuestas no comparten materialidad: botones flotan sobre fondo que no responde a la interacción.
- Contenido ambiental intercambiable: podría ser cualquier juego, no un lugar propio reconocible.
- Intensa dependencia de fórmulas IA («bosque cozy», mascota, cielo brillante, flores de relleno, cartelas).
- La riqueza es superficial: número de objetos, no observación/materiales/proceso.
- El arte generado R04 no tiene aceptación de calidad humana. Marcar VISUAL_REWORK_REQUIRED, conservar motores jugables y tests técnicos.
- Evitar derivar nueva imagen de ese arte como base: aumenta sesgo de estilo.

## D. Tres hipótesis artísticas distintas, SIN declarar aprobación

### H1 · ESTACIÓN DE OBSERVACIÓN EN UN LUGAR REAL DE FARO — candidata a estudiar primero
La persona encuentra hojas como objetos físicos sobre una superficie de observación integrada en un claro de la isla original. El mundo existe como sitio concreto en segundo plano, sin ser un tapiz de decoración. Los objetos necesarios se apoyan físicamente, no flotan en tarjetas de videojuego. La muestra modelo se encuentra en una zona de comparación estable. El desafío visual no debe confundirse con identificación de especies ni dar pistas por la textura.

Ganancias: vínculo directo con la identidad Faro; estímulos controlables y ricos en materiales; utilidad en 2D. Riesgos: introducir una mesa o bandeja que no exista en los assets aprobados; exigir verificación antes de integrarla. No copiar mesas de puzles externos.

### H2 · MIRADOR EN EL MUNDO / BUSQUEDA IN SITU
Una panorámica de un claro de Faro con puntos de observación auténticos (huerto, sendero, costa) y hojas seleccionables ubicadas de forma natural. Mayor exploración espacial. Riesgo: fondos, clima, variabilidad de escala y oclusión contaminan la discriminación de silueta; acceso por teclado y 320px más difícil. Posible modo libre separado de entrenamiento.

### H3 · HERBARIO INTERACTIVO, PRESENTACIÓN EDITORIAL
Muestras aisladas comparables sobre superficie de papel/estudio de campo, con anotaciones contenidas. Excelente control de saliencia y contraste. Riesgo: puede convertirse en ficha escolar, perder mundo/jugabilidad e invadir el lenguaje de la serie editorial. Solo usar con justificación de producto.

Hipótesis recomendada para prototipo visual futuro: evaluar H1 en una diana 1440 y 390, con H3 como contraste de claridad. No marcar KEEP hasta revisión humana.

## E. Gramática visual preliminar y no aprobada para H1

- Una sola acción primaria visible por momento: COMPARAR. El modelo permanece a la vista para no añadir memoria inadvertidamente.
- Primer plano: siluetas originales de familia morfológica real, elaboradas a partir de dibujo de estudio propio; evitar formas radiales arbitrarias.
- Soporte físico (si existe): madera/roca del mundo, con borde y espesor, no tarjetas blancas idénticas repetidas. Selección y foco accesible siempre sobre contenido real de interfaz/DOM.
- Medio plano: elementos geográficos de la isla que contextualizan, sin plantas decorativas que simulen respuestas.
- Fondo: faro, costa, talud, huerto o camino SOLO si respaldados por assets de Faro; sin inventar nueva topografía.
- Paleta interfaz: Iris Green NAVY #0B1A2B, foco #C3B8FF, texto #EEF4F8; materiales del mundo según Faro. Los límites de 14 colores del mundo 3D no obligan a 14 colores en todos los SVG cognitivos: deben documentarse de forma separada.
- Tipografía: legible y consistente con web; no hornear texto en bitmap. Sin mensajes tipo «pequeños retos, grandes avances» inventados.
- Sin personaje guía ni mascota genérica. Si se quiere Vera, reutilizar los originales KEEP sin rediseño, solo tras aprobar que tiene función jugable.
- Sin brillos animados, halos, hojas decorativas en esquinas, rayos de sol/partículas de relleno, marcos dobles ni otros clichés.
- Movimiento del fondo quieto por defecto; NORMAL/REDUCED/NONE, teclado/ratón/touch y ES/EN.
- Diferencia de silueta por estructura, NO por color/patrón/tamaño. Contorno comparado con rotación/escala normalizadas; un único objetivo correcto debe verificarse por generador.

## F. Inventario de diseño antes de abrir generación de imagen

Evidencias requeridas:
1. Una lámina de 6-8 fotos/referencias de morfología foliar real con fuente y permiso de uso para estudio. Fuentes propias o de instituciones y sin trasladar la imagen licenciada a producto final.
2. Selección de 4-6 siluetas diseñadas por observación, ficha de rasgos discriminantes, pruebas de rotación/escalado y de confusión perceptiva.
3. Inventario de modelos/paisajes existentes de Faro: nombre de asset, fuente en repo, estado APPROVED/EXPLORATORY, licencia, función.
4. Moodboard de técnicas: detalle, materialidad, interacción, luz, foco y composición. Un ejemplo por técnica; no collage de cinco estilos.
5. Dos bocetos de layout de la MISMA tarea, 1440 y 390. No alterar mecánica al cambiar layout.
6. Oráculo de accesibilidad: objetivos >=44px, foco, alto contraste, disabled, respuesta asistida, ausencia de feedback solo por color.
7. Comparativa con la captura rechazada usando criterios observables, nunca «más bonito».
8. Visto bueno humano ANTES de producir los escenarios finales.

## G. Pruebas de aceptación del diseño futuro

[ ] El lugar es reconocible por geografía/material y puede anclarse en assets propios de Iris; no bosque genérico.
[ ] Ningún elemento existe solo para adornar; cada elemento narra la localización, permite interacción o explica una acción.
[ ] Estímulos basados en morfología y son distinguibles por silueta a 320/390 sin depender del color.
[ ] Acierto no depende de luz, textura, tamaño o el fondo.
[ ] La muestra objetivo y las candidatas tienen el mismo sistema de dibujo.
[ ] El prototipo usa assets originales/autorizados, no imágenes de estudio externo ni arte IA rechazado.
[ ] El usuario identifica primera acción sin explicación externa.
[ ] Se mantienen las mismas mecánicas y toda la accesibilidad.
[ ] Se valida la composición en navegador 1440/390/320.
[ ] Diseño/art PASS humano explícito separado de PASS runtime.
[ ] Solo tras gate visual, adaptar el código existente. Nunca empezar por portada.

## H. Decisiones cerradas / pendientes

CERRADO:
- no redibujar antes de investigar; no generar ilustraciones de género «cozy forest»;
- R03/R04 visual rechazados, mecánica se preserva;
- dificultad SIN EDAD, por capacidad demostrada y preferencias;
- investigación exterior aporta métodos, no arte reutilizable;
- texto no horneado; no personajes nuevos de IA;
- registro de este estudio en GitHub.

PENDIENTE:
- elección/QA humana de dirección artística (H1/H2/H3);
- inventario a nivel de archivo de masters aprobados en repositorio y Library; el PDF por sí solo es evidencia de referencia, NO extracción de originales licenciados;
- estudio botánico por selección precisa de muestras y generación de estímulos;
- pantallas reales y tests de rendimiento/percepción.

Gate: COGNITIVO_01_ART_RESEARCH_COMPLETED__VISUAL_CONCEPT_NOT_APPROVED.
