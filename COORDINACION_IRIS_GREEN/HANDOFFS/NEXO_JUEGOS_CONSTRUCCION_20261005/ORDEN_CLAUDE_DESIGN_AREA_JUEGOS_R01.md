# CLAUDE DESIGN · ÁREA DE JUEGOS · DISEÑO VISUAL R01
Orden de Nexo · 2026-10-05 · Iris Green · Seguimiento GitHub #369

## 1. Encargo y entrega esperada
Diseña la entrada del Área de Juegos y sus dos páginas de catálogo: **Juegos / Juegos para todos / Juegos Plus**. Entrega una propuesta visual completa, editable y revisable en escritorio y móvil. Es trabajo de diseño previo a implementación.

María distingue dos colaboradores:
- Claude Rincón: Pecera y su vídeo completo de cinco minutos.
- Claude Design: diseño de juegos, webs e interfaces. Este encargo concreto es el Área de Juegos.

Prisma conserva Construcción R02 y su corrección final de texto legacy. Axioma revisa calidad/accesibilidad. María realiza HUMAN QA. No modificar ese storyboard ni duplicar el patch de Prisma.
Nexo asigna esta superficie de diseño para avanzar sin iniciar otro juego.

## 2. Qué producto estamos haciendo
Iris Green tiene áreas diferentes:
- Información: conocimiento.
- Recursos: herramientas y apoyos prácticos.
- Juegos: jugar, tomar decisiones, superar retos, construir y divertirse.
- Descubrimiento: explorar, localizar e identificar fenómenos y después recibir información.
- Creación: crear piezas/proyectos.
- Espacio tranquilo: descanso audiovisual.

Juegos debe parecer una invitación a jugar. Evitar copy de terapia, entrenamiento cognitivo, regulación o lecciones como propósito de la página. Accesibilidad transversal, sin suponer que todas las personas neurodivergentes tienen los mismos gustos.
Dirección: atractiva, clara, con imágenes del juego y acciones reconocibles. Sin infantilizar por defecto, sin estética clínica, sin dashboard lleno de indicadores.

## 3. Arquitectura obligatoria
Navegación global, manteniendo identidad de Iris Green:
Inicio · Información · Recursos · Juegos · Descubrimiento · Creación · Espacio tranquilo.
Juegos es una sección de primer nivel, no hija de Recursos.
Sabik es asistente persistente; no crear una categoría Sabik ni rediseñar su núcleo/voz.

Patrón:
Juegos → Juegos para todos | Juegos Plus.
Son páginas separadas; no una rejilla mezclada de juegos abiertos y candados.

Rutas objetivo para el handoff, no despliegue autorizado:
- ES: /es/juegos/ ; /es/juegos/para-todos/ ; /es/juegos/plus/
- EN: /en/games/ ; /en/games/for-everyone/ ; /en/games/plus/

No tocar rutas legacy, Home, Sabik ni main.

## 4. Pantallas
### J01 · Portada de Juegos
Primer viewport:
- navegación global y ubicación actual;
- H1 «Juegos»;
- copy breve propuesto: «Construye, resuelve y juega a tu manera.»;
- dos accesos claros «Juegos para todos» y «Juegos Plus», con jerarquía equivalente y explicación breve;
- una imagen representativa del juego de Construcción para dar identidad, subordinada a la claridad de acceso.

Evitar hero enorme que obligue a buscar los accesos, carrusel automático, vídeo/audio autoplay y bloques de texto largos. Mostrar contenido suficiente para saber qué hay y cómo entrar.

### J02 · Juegos para todos
- H1 «Juegos para todos».
- Copy: «Juegos completos disponibles para todo el mundo.»
- catálogo legible con imagen, nombre, una frase de acción jugable y acceso al detalle/juego cuando esté disponible;
- no candados, contadores de intentos, energía o interrupción comercial;
- no inventar un número de juegos para llenar la pantalla.

### J03 · Juegos Plus
- H1 «Juegos Plus».
- Explicación sobria: «Más juegos para elegir.»
- misma familia visual, sin convertirlo en una página de presión comercial;
- acceso comercial únicamente mediante zona adulta/cuenta existente, pendiente de su contrato;
- no inventar precios, prueba gratuita, descuento, checkout, ventajas o disponibilidad.

La clasificación de títulos entre Para todos y Plus aún no está cerrada. Diseñar el componente de catálogo con contenido de muestra claramente identificado en las anotaciones de revisión; no asignar Construcción a un plan ni publicar esa asignación.
Para estados sin catálogo confirmado, representar la plantilla y una variante vacía honesta; no simular juegos terminados.

## 5. Contenido de referencia del juego
Único juego activo: **El taller de las islas** (nombre provisional).
Resumen para la portada/ficha:
«Recoge materiales, construye un camino y llega a la otra orilla.»
Loop: recoger → elegir piezas → construir → recorrer → corregir.

Información para que la imagen represente el juego correcto:
- mundo de islas/canal, cámara fija en tres cuartos;
- personaje femenino 3D aportado por María como objetivo; proxy del storyboard aún provisional;
- madera y piedra; plataformas, bloques y escaleras;
- construir un cruce para alcanzar una caja; después escaleras para alcanzar terraza/parcela libre;
- lo construido altera el recorrido;
- sin salto, combate, muerte, reloj ni preguntas educativas en este prototipo.

La geometría/costes/soluciones del storyboard de Prisma son la autoridad de ese juego. No redibujar un puente terminado como si fuera el inicio ni inventar mecánicas nuevas.
Usar un frame existente de Prisma como referencia visual; si no tienes acceso al asset, mostrar un recuadro de referencia identificado en anotaciones y avanzar con el resto del diseño. No presentar un proxy como arte final.

Parejas de memoria es backlog, no segundo juego autorizado. No diseñar ahora su tablero ni sus mecánicas. Mapa del tesoro está descartado y la Habitación imposible anterior no se reutiliza.

## 6. Componentes y navegación
Diseñar:
- cabecera desktop y menú móvil;
- indicador de página actual;
- accesos Para todos / Plus;
- ficha de juego con un solo CTA principal;
- retorno a Juegos y retorno desde juego conservando conceptualmente página y posición;
- estado normal, hover cuando aplique, foco, seleccionado y no disponible;
- estado vacío de catálogo;
- reserva compatible para el acceso persistente a Sabik sin tapar CTA ni contenido.

No añadir buscador, filtros, favoritos, rankings o progreso ficticio para llenar huecos. Si el catálogo crece, se evaluarán después.
Los enlaces del prototipo visual pueden conectar frames para revisar navegación. No implementar login, pagos, guardado ni runtime del juego.
Una imagen/ficha de un juego todavía no publicado no debe simular que funciona. Documentar disponibilidad y destino pendiente en la entrega de revisión, sin meter nombres de gates/commits en el copy de producto.

## 7. Dirección visual e identidad
Reutilizar logo, tipografía, colores y componentes aprobados de Iris Green cuando se aporten o estén accesibles. Registrar origen de cada asset/token.
Si falta un token o asset de marca, marcarlo PROVISIONAL en la documentación y continuar con una propuesta coherente; no afirmar que es canónico.
Conservar variantes LIGHT/NAVY existentes si se reciben como parte del sistema; no inventar una tercera identidad.
Las ilustraciones no deben convertirse en fondos de texto ilegible. Imagen del juego, título y acción deben tener jerarquía clara.
No dibujar letras dentro de ilustraciones reutilizables: texto en capas editables.
No copiar assets/personajes de Dragon Quest Builders o Minecraft.

## 8. Accesibilidad y responsive
Requisitos internos para que Axioma pueda revisar:
- targets >=44×44 CSS px equivalentes en el diseño;
- foco visible independiente del estado seleccionado;
- información y selección distinguibles mediante texto/borde/símbolo además de color;
- textos normales con contraste mínimo 4.5:1 y controles/foco verificables según revisión Axioma;
- títulos y texto ampliables, sin alturas que obliguen a recortar;
- 320 y 390 en una columna donde haga falta; ningún overflow horizontal;
- orden de lectura y de teclado anotado; nombres claros para iconos;
- menú móvil abierto/cerrado con salida visible y retorno de foco previsto;
- equivalentes forced-colors definidos;
- silencio completo funcional, sin reproducción automática.

NORMAL: solo transiciones discretas de interfaz, sin animación continua imprescindible.
REDUCED: transiciones sin desplazamientos amplios.
NONE: cambios instantáneos.
El contenido y las acciones son idénticos en los tres modos.

Comprobar las etiquetas completas, incluidos restos de capas antiguas, no solo los rectángulos nuevos. Ningún badge, foco, título o CTA debe solaparse o quedar cortado.
44 px es objetivo del proyecto; no declararlo mínimo universal WCAG AA. No declarar conformidad normativa completa a partir de imágenes.

## 9. Idiomas
Diseño principal ES y tabla de copy EN completa para todas las pantallas/estados entregados.
Base:
- Juegos / Games
- Juegos para todos / Games for everyone
- Juegos Plus / Games Plus
- Construye, resuelve y juega a tu manera. / Build, solve and play your way.
- Juegos completos disponibles para todo el mundo. / Complete games available to everyone.
- Más juegos para elegir. / More games to choose from.
- Volver a Juegos / Back to Games
- Recoge materiales, construye un camino y llega a la otra orilla. / Gather materials, build a path and reach the other side.

Nombre inglés del juego pendiente de validación: no convertir una traducción propuesta en título oficial.
Mostrar al menos la pantalla móvil con mayor densidad también en EN para detectar desbordamientos. No traducir con texto incrustado en imágenes.

## 10. Archivos de entrega
Un paquete completo:
1. J01/J02/J03, cada una en 320, 390 y 1440: **9 frames individuales**, con altura indicada y viewport inicial identificable.
2. Estados complementarios de menú móvil, foco/selected y catálogo vacío, reutilizando componentes.
3. Hoja de componentes con medidas, tipografía, colores, contrastes y forced-colors.
4. Mapa de navegación y matriz NORMAL/REDUCED/NONE.
5. Tabla ES/EN.
6. Inventario de assets: existente/reutilizado/provisional/faltante, con procedencia.
7. Archivo editable nativo; PNG de revisión con sRGB; README y manifest con nombres.
8. ZIP o enlace accesible. No basta anunciar el nombre del paquete.

Nombre recomendado:
CLAUDE_DESIGN_JUEGOS_AREA_VISUAL_R01.zip

Si no tienes acceso a GitHub, entrega todo aquí a María para que Nexo lo registre; no lo uses como motivo para detener el diseño. No asumas acceso a la Biblioteca de ChatGPT ni a archivos locales de otro chat.

## 11. Referencias canónicas
Arquitectura:
https://github.com/mruizwow-bit/irisgreen/blob/main/COORDINACION_IRIS_GREEN/MEMORIA/NEW_WEB_INFORMATION_ARCHITECTURE_R01_20261004.md

Contexto de Juegos:
https://github.com/mruizwow-bit/irisgreen/blob/3eeb426f803eff60c61d139870825a674fdef753/COORDINACION_IRIS_GREEN/HANDOFFS/NEXO_JUEGOS_CONSTRUCCION_20261005/00_REGISTRO_CANONICO.md
Sus reglas iniciales de construcción fueron refinadas por Prisma/Axioma: no reabrirlas desde ese documento histórico.

Último retest consultado de Construcción:
https://github.com/mruizwow-bit/irisgreen/issues/369#issuecomment-5995409728
Orden vigente de Prisma:
https://github.com/mruizwow-bit/irisgreen/issues/369#issuecomment-5995462455
Artifact visual de referencia:
https://github.com/mruizwow-bit/irisgreen/actions/runs/37314984917/artifacts/11347511815

Este artifact aún tiene texto legacy Madera/Piedra en 1440: no trasladar ese defecto a la portada.
La orden presente es autocontenida; los enlaces aportan trazabilidad y assets, no sustituyen el brief.

## 12. Cierre
Entregar diseño para revisión Nexo → Axioma → HUMAN QA María.
Estado de entrega esperado: CLAUDE_DESIGN_JUEGOS_AREA_R01_READY_FOR_REVIEW, no PASS.
No HTML/CSS/JS de producción, runtime de juego, despliegue, cambios en main ni integración de pagos/Sabik.
No intervenir en Pecera ni abrir un segundo juego.
Los enlaces entre frames son navegación de diseño; no presentarlos como una partida funcional.
