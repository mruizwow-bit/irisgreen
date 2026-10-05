# CLAUDE · CIELO NOCTURNO / ORIÓN · PROTOTIPO INTERACTIVO R01
Nexo · Iris Green · 2026-10-05 · seguimiento GitHub #323

## 0. Encargo y autorización actual
María pide: «dame el de cielo para que lo vaya haciendo Claude también, a ver cómo sale; acuérdate del canon de estilo».
Construye ahora un PROTOTIPO INTERACTIVO AISLADO que María pueda abrir y usar. HTML/CSS/JS de prototipo autorizados para esta entrega. No entregues solo nuevos PNG ni un pase de diapositivas.
Esta autorización supera el STOP pre-code del storyboard únicamente para este prototipo privado. No equivale a HUMAN QA PASS ni autoriza producción, main, despliegue público o una segunda constelación. Prisma no debe rehacer el storyboard.

Área: DESCUBRIMIENTO → CIELO NOCTURNO → PRIMERA EXPERIENCIA → ORIÓN.
Cielo es PRODUCT_NEW_FROM_ZERO en interacción. Reutilizar datos y assets; no rescatar el runtime anterior por inercia.
No mezclar este trabajo con Peces, Pecera, Construcción, Juegos o Sabik.

## 1. Producto que debe sentir María
«Muevo el cielo → veo un patrón → lo localizo → lo identifico → ahora me explican qué he encontrado».
Contrato: ENTRAR → ORIENTAR → OBSERVAR → LOCALIZAR → IDENTIFICAR → REVELAR → PROFUNDIZAR.
Regla: NO_REVEAL_BEFORE_SEMANTIC_USER_ACTION.
No es un cuestionario ni una ficha educativa de entrada. No hay puntos, aciertos, vidas, reloj, música, partículas ni premios.
La orientación del cielo es la acción principal. No reutilizar la linterna de Peces.

Primer texto visible:
**Cielo nocturno**
**Busca tres estrellas brillantes casi en línea.**

No mostrar «Orión», nombres del cinturón, figura completa ni líneas al entrar, tampoco mediante texto alternativo, título de página, tooltips, lector de pantalla, etiquetas ocultas o panel de fuentes abierto antes del descubrimiento.
Los nombres internos en los datos no son UI: conservarlos para trazabilidad, sin exponerlos antes de tiempo.

## 2. Material de entrada incluido
- referencias/STORYBOARD_R02/: 12 frames, contact sheets, continuidad y manifest de Prisma. Referencia de secuencia, no plantilla para copiar colores/tipografías antiguas ni texto técnico.
- datos/sky-a01-04-ori.json: JSON Atlas original, 247 estrellas; usar las 161 con apparent_mag <= 5.15, como R02. No añadir estrellas aleatorias.
- datos/provenance_A01.json: procedencia y licencias de los datos.
- assets/horizonte/01-cielo-horizonte-observacion-r01.png: B00 existente, 2560×768 RGBA con ICC.
- assets/profundidad/orion-referencia-existente.png: imagen utilizada como referencia de profundidad por Prisma. Solo después de identificar. No usarla como campo navegable ni como fuente de posiciones.
- assets/fonts/: Atkinson 400/700 y Newsreader variable 200–800, bytes iguales a main leído, más licencias.
- canon/iris-green-navy.css y CANON_NAVY.md: valores obligatorios.
- PROCEDENCIA_Y_LIMITES.md y SHA256SUMS.txt.

La imagen de profundidad es una ilustración existente, no evidencia de alineación científica del renderer. Las estrellas y líneas interactivas deben salir del JSON.
No editar los PNG ni pintar encima de capturas para borrar líneas. No generar astronomía, otro horizonte, estrellas decorativas ni arte nuevo.

## 3. Modelo del cielo y representación
CURATED_OBSERVATION_PRESET: vista preparada para observar. No «tu cielo ahora».
Sin geolocalización, reloj, fecha/hora/lugar inventados, meteorología, altitud, azimut o brújula geográfica ficticia.
El horizonte es referencia visual neutra, no localización factual. El campo A01 usa una proyección gnomónica de revisión; esta entrega prueba interacción, no exactitud de un planetario situacional.

Usar projected.x/y como coordenadas del campo y UNA transformación compartida para estrellas, líneas, selección y hit testing.
Pan/zoom cambian la cámara, nunca regeneran el campo. No recolocar estrellas al cambiar tamaño de pantalla. Mantener proporción geométrica; no estirar X e Y por separado.
Magnitud controla jerarquía visual de manera contenida; no exagerar brillo del objetivo. Colores existentes como representación sobria. Sin twinkle ni halos pulsantes.
Campo finito: limitar cámara/zoom a datos disponibles; nunca repetir el mosaico ni inventar estrellas al llegar al borde.
El fondo general y de la escena será #0B1A2B; colocar el horizonte existente sin deformar sus proporciones. No añadir un gran fondo negro alternativo.

Cinturón, por IDs estables del JSON:
- Alnitak: hyg-local-32.
- Alnilam: hyg-local-30.
- Mintaka: hyg-local-74.
Estos nombres NO se presentan hasta identificar.
Las líneas completas proceden de guide_lines. No unir todas las estrellas por proximidad. No inventar geometría ni dibujar una figura mitológica.
Preservar atribuciones: HYG v4.1 / David Nash CC BY-SA 4.0; nombres IAU/WGSN mediante compilación citada; geometrías d3-celestial y procedencia Atlas. Separar dato, proyección calculada y representación visual.

## 4. Secuencia funcional
### ENTRY / ORIENTING
Cielo protagonista y horizonte inferior. Orientación inicial con el cinturón fuera del centro de examen; no centrar automáticamente la respuesta.
Seis botones siempre alcanzables: Izquierda, Derecha, Arriba, Abajo, Acercar, Alejar. Flechas/pan cambian realmente el campo; zoom conserva anclaje.
Retícula discreta fija en el centro útil de observación. Al desplazar el cielo, las estrellas cruzan esa retícula. Nunca sigue al cinturón.
Drag de ratón/touch puede añadirse, pero no es obligatorio para completar la experiencia.

### OBSERVING / LOCATING
El patrón se vuelve visible por la orientación elegida por la persona, no por pulsar un botón «siguiente».
Acción explícita **Examinar esta zona**.
La retícula muestra el área que se va a examinar. Su región es fija y neutral, con tolerancia amplia para móvil, nunca un imán oculto hacia la solución.
Selección: calcular si los TRES IDs del cinturón están visibles, dentro de la región examinada y fuera de zonas tapadas por UI. El clic en Examinar es necesario; entrar con el patrón en la zona no revela nada automáticamente.
Definir radio/área y zoom inicial/mínimo/máximo en configuración. Documentar los valores elegidos. A máximo alejamiento, evitar una región que abarque todo el campo y acepte sin localizar.
Calibrar para que no haya que atinar a un píxel: selección de zona, no tres estrellas minúsculas por separado.
No centrar, cambiar zoom ni recentrar al examinar.

Si no corresponde: «Aquí no aparece ese patrón. Sigue mirando.» Sin castigo, pistas direccionales, radar, caliente/frío, brillo artificial ni recuento de intentos. El mensaje no debe mentir sobre otros patrones existentes: se refiere a las tres estrellas objetivo del preset, no a una afirmación general astronómica.

### PATTERN LOCATED
Primera identificación: marcar y unir SOLO las tres estrellas sobre EL MISMO cielo.
Copy:
«Has encontrado tres estrellas alineadas.»
«Es el cinturón de Orión.»
Este es el primer momento en que aparece el nombre.
Botón **Ver Orión completa** para avanzar deliberadamente; no transición automática con temporizador.

### ORION REVEALED
Añadir las líneas completas, el nombre y una frase breve al campo existente. Nunca sustituir el cielo por una tarjeta o por la imagen de profundidad.
F03 → F04 → F05 conservan camera, zoom, coordenadas y selección. Solo cambian overlays/paneles.
Si el usuario mueve el cielo después, líneas y estrellas se mueven juntas.

Móvil: panel inferior parcial compacto, que pueda plegarse; no ocultar el patrón. Escritorio: panel lateral estrecho sin cambio de cámara al abrir.
No copiar al producto frases de revisión como «las líneas aparecen ahora», «la base no cambia» o nombres de gates.

### DEPTH
Acciones: «Ver de cerca», «Cómo reconocerla», «Qué estrellas la forman», «Fuentes».
Aquí puede aparecer la imagen existente y los nombres del cinturón. No fabricar distancias, edades, tamaños o fechas: omitir datos no necesarios o pendientes de validación.
Distinguir el dibujo convencional de líneas de la región astronómica de la constelación; no tratar las líneas como objetos visibles en el cielo.
Cerrar devuelve a la misma orientación, zoom y estado; Orión permanece localizada.
«Volver a explorar» cierra el panel y permite seguir moviendo el mismo campo.
«Reiniciar experiencia» es acción explícita; no reiniciar por resize, idioma, modo de movimiento, cierre de visor o pérdida de foco.

## 5. Accesibilidad: otra vía real de observar
Teclado:
- área de observación con nombre accesible neutral y foco visible;
- flechas orientan únicamente con foco en esa área;
- +/− zoom; Enter examina la región actual;
- Tab navega controles sin miles de estrellas como tabstops;
- Enter/Space activan botones; Escape cierra panel/diálogo y devuelve foco.
No role=application global. No capturar flechas mientras se escribe o se maneja otro control.

Touch: botones >=44×44 CSS px, preferiblemente 48×48, separados y completos a 320. Un arrastre no puede ser requisito exclusivo; no impedir el scroll de toda la página.

**Explorar con descripción** debe permitir observar y localizar sin visión:
- describir el campo o región actual con señales neutrales, posición relativa y forma antes de dar identidades;
- permitir navegar regiones mediante controles y seleccionar la región observada, usando la misma cámara y lógica;
- cuando el cinturón esté en la región, describir «tres puntos brillantes casi alineados»; después Examinar revela el nombre;
- no botón con «Ir al cinturón/Orión», no lista que dé la respuesta anticipadamente, no requisito de adivinar a ciegas.
No simular equivalencia con un aria-label genérico que no cambia.

aria-live=polite para cambios confirmados de región/descripción, resultado de examen y revelado; no anunciar cada píxel de pan.
No reconstruir el botón enfocado al actualizar candidatos; preservar nodos/IDs o restaurar foco de forma estable. Probar Tab/Enter de principio a fin, no sustituirlo por clicks automatizados.
Canvas decorativo para AT si el DOM proporciona la experiencia completa; o región gráfica con nombre y descripción más controles equivalentes. No canvas focusable sin nombre.
Foco independiente de selección: anillo de 3 px #C3B8FF con separación de 2 px; seleccionado con marca/texto y borde #EEF4F8. aria-pressed solo en toggles reales; no añadirlo a botones de acción.
Forced-colors: controles, foco y vía descriptiva operables, con colores de sistema; no perder toda interacción si las estrellas no se distinguen.

## 6. NORMAL / REDUCED / NONE
NORMAL: desplazamiento suave breve por acción de la persona; sin inercia indefinida.
REDUCED: cambios de cámara directos o muy breves, sin vuelo, parallax ni transiciones decorativas.
NONE: cambios discretos inmediatos, misma cantidad de regiones y mismas funciones.
Respetar prefers-reduced-motion al inicio. Cambiar modo durante un movimiento cancela la animación pendiente.
Sin autoplay, cielo girando solo, sonido, partículas o narración automática. Redibujar por evento; al estar quieto, no mantener un bucle requestAnimationFrame.

## 7. Canon visual obligatorio · SOLO NAVY
| Elemento | Valor |
|---|---|
| Fondo general, cabecera, pie y escena | #0B1A2B |
| Tarjetas/paneles | #15304A |
| Superficie secundaria | #1D3D5C |
| Texto principal | #EEF4F8 |
| Texto secundario | #C9D5DD |
| Enlaces | #9FDCEA |
| Acento/foco | #C3B8FF |
| Bordes controles | #8494A8 |
| Separadores decorativos | #2A4460 |
| Botón principal | #DCE8F2 con texto #0B1A2B |
| Cuerpo | Atkinson Hyperlegible, 1rem/16px, line-height 1.6 |
| Títulos | Newsreader, peso600, line-height1.2 |
| Título principal | Newsreader400, 40–56px, line-height1.06 |
| Introducción | Atkinson Hyperlegible, ~19px, line-height1.58 |

No tema claro ni selector de tema. No sustituir tipografías por una aproximación.
Cargar fuentes LOCALES incluidas; sin CDN, /_blob/, archivos ausentes ni rutas absolutas de otra sesión.
El CSS entregado contiene IG Zero para U+0030, conforme a la regla del sitio. Usarlo también en las pilas que muestren números.
Marca textual Iris Green si hace falta; no inventar logotipo. Nada de ilustraciones de planetas, gradientes morados de marca ni tarjetas de 88 constelaciones al entrar.
Las excepciones forced-colors usan el sistema; no son un segundo tema.

## 8. Composición y tamaños
320/390: una columna; cabecera compacta, objetivo, cielo y controles. Cielo >=70% del área útil de experiencia en estado de exploración como objetivo de diseño.
No forzar ese porcentaje si obliga a recortar controles o texto ampliado: documentar lo conseguido y priorizar acceso/reflow. No reducir títulos/cuerpo fuera del canon para hacerlo caber.
A 200% de texto permitir scroll vertical y reflow, sin paneles fijos que cubran acciones.
1440: mucho cielo y panel posterior estrecho, sin consola ni dashboard.
No colocar controles sobre las tres estrellas objetivo ni debajo de una zona tapada por navegador móvil. Ampliar escena opcional y reversible.
Anotaciones de QA fuera de la interfaz. Sin información interna de paquetes/hashes/gates para el usuario.

## 9. Arquitectura y entrega ejecutable
Separar DATOS / MOTOR DE PROYECCIÓN-CÁMARA / INTERFAZ-ESTADO.
Estado mínimo: camera, zoom, selection, stage, panel, locale, motion. No disparar identificación por hover, resize, zoom o carga de assets.
Fuente local JSON conservada intacta. Para abrir con file://, empaquetar los datos en un JS local generado desde ese JSON o dentro del HTML; no depender de fetch('archivo.json') ni de módulos bloqueados por file://.
No alterar datos para hacer más fácil el puzzle ni generar otros. Conservar provenance/licencias.
El horizonte y el recurso de profundidad se cargan por rutas relativas; si fallan, aviso claro y recuperación. Nunca sustituir por un paisaje/constelación inventados.
Sin backend, cuentas, permisos, ubicación, APIs, age gate ni integración con Sabik. No tocar el player de Motor.
Sesión suficiente; persistencia opcional solo si es explícita y reversible.

Entregar CIELO_ORION_INTERACTIVO_R01.zip con:
- cielo-nocturno.html, HTML funcional real;
- JS/CSS locales;
- datos y assets exactos, fuentes y licencias;
- README con apertura por doble clic tras extraer;
- manifest SHA256;
- NOTAS_DE_PRUEBAS con evidencia y limitaciones;
- capturas 320/390/1440 antes y después de identificar.
Un lienzo vivo puede acompañar; no reemplaza el ZIP. Identificar si el lienzo y el ZIP difieren.
No entregar mocks, botones sin efecto ni «prototipo» que solo cambie capturas F01–F06.

## 10. Copy ES/EN
| ES | EN |
|---|---|
| Cielo nocturno | Night sky |
| Busca tres estrellas brillantes casi en línea. | Look for three bright stars almost in a line. |
| Examinar esta zona | Examine this area |
| Aquí no aparece ese patrón. Sigue mirando. | That pattern is not in this area. Keep looking. |
| Has encontrado tres estrellas alineadas. | You have found three stars in a line. |
| Es el cinturón de Orión. | This is Orion's Belt. |
| Ver Orión completa | Reveal Orion |
| Ver de cerca | Take a closer look |
| Explorar con descripción | Explore with descriptions |
| Volver a explorar | Keep exploring |
| Reiniciar experiencia | Restart experience |
| Vista preparada para observar | Curated observation view |
| Fuentes | Sources |

ES/EN deben conservar acciones, estados y cantidad de información. Cambiar idioma conserva lo observado y la cámara.
Aplicar lenguaje claro; no añadir explicaciones técnicas de implementación a los paneles de producto.

## 11. Pruebas y cierre
T01 Entrada sin nombre/figura/líneas/alt que revele identidad; fuentes públicas neutrales antes del hallazgo.
T02 Pan y zoom cambian campo coherente; mismo anclaje de estrellas y horizonte de referencia.
T03 Alineación visible no revela sin Examinar.
T04 Examinar región incorrecta conserva estado y da feedback neutral.
T05 Examinar región correcta revela solo cinturón; siguiente acción añade Orión completa.
T06 Capturar cámara/zoom/posiciones antes/después del reveal: sin salto de fondo ni recenter.
T07 Cerrar profundidad conserva cámara/zoom/identificación.
T08 Completar por teclado y touch sin arrastre; foco estable; vía descriptiva señala patrón antes del nombre.
T09 NORMAL/REDUCED/NONE funcionales; 30 s inactivo sin autoplay ni bucle de render.
T10 320/390/1440 y 200% de texto: controles/paneles sin recortes, scroll vertical permitido.
T11 Forced-colors y lector real cuando esté disponible; no convertir una simulación en prueba real.
T12 Apertura file:// sin errores JS, dependencias ausentes ni peticiones de terceros automáticas.
T13 Datos/PNG/fuentes verificables; no estrellas nuevas ni otra constelación interactiva.
T14 ES/EN, resize, límites de cámara/zoom, recurso ausente y reinicio explícito.

Distinguir lo probado, lo parcial y lo no probado. No declarar HUMAN QA ni conformidad completa.
Entrega: CLAUDE_SKY_ORION_INTERACTIVE_R01_READY_FOR_REVIEW.
Secuencia: Claude entrega ZIP → Nexo recepción/revisión → Axioma runtime/accesibilidad → María prueba.
María decide si entiende que explora, encuentra y solo entonces recibe explicación.
No ampliar las 88 constelaciones ni integrar main hasta nueva decisión.
