# CLAUDE DESIGN · DESCUBRIMIENTO · ÁREA WEB NAVEGABLE R01

## Encargo

Crea el área web completa de Descubrimiento de Iris Green para que María pueda probarla. Incluye portada, Para todos, Plus, catálogos, fichas de Cielo nocturno y Vida marina/Peces, y navegación de ida y vuelta. Entrega HTML/CSS/JS ejecutable; las capturas son evidencia complementaria.

Tu responsabilidad es esta interfaz. Prisma integrará tu entrega y conectará los runtimes finales. No rehagas la interfaz de Juegos ni programes una segunda versión de los motores Cielo/Peces.

Esta orden complementa y concreta para Claude el montaje general:
COORDINACION_IRIS_GREEN/HANDOFFS/NEXO_MONTAJE_AREAS_20261005/ORDEN_PRISMA_JUEGOS_DESCUBRIMIENTO.md
commit a5de649cae27e3bf235ca15c9e61099c2bd662b9.

## Fuentes de entrada

- Diseño Juegos de referencia para coherencia: CLAUDE_DESIGN_JUEGOS_AREA_VISUAL_R01_3.zip, SHA256 6dc3e7e94804357f85daaf538a65a27a1afbc60e0498f92ee492324db6fa2af5.
- Gate de ese diseño: AXIOMA_GAMES_AREA_VISUAL_R01_3_READY_FOR_HUMAN_QA. Es referencia del sistema visual, no aprobación anticipada de Descubrimiento.
- Cielo: recepción Nexo del patch en #323 comentario 5999464286.
- Peces: correcciones finales pendientes en #323 comentario 5999609455.
- Los prototipos están hechos; consumir su entrega final validada, con hash identificado.
- María confirma que las imágenes de ambas áreas están producidas. Reutilizar paquetes aprobados/manifiestos; no generar imágenes nuevas.
- Si un paquete no está disponible en tu sesión, avanzar con estructura/navegación/canon y declarar sólo ese archivo faltante. No inventar rutas, assets, thumbnails ni afirmar acceso a un ZIP que no has abierto.

## Arquitectura requerida

1. Portada Descubrimiento: título, introducción breve, entradas Para todos y Plus, acceso reconocible a los temas existentes.
2. Catálogo Para todos.
3. Catálogo Plus.
4. Ficha Cielo nocturno.
5. Ficha Vida marina / Peces.
6. Navegación real: portada → catálogo → ficha → Explorar → experiencia → volver.

Para todos/Plus son ámbitos de acceso, no temas. Cielo y Vida marina son temas. Mantener esta distinción en los datos y en la UI.
Conservar la IA canónica: Información / Recursos / Juegos / Descubrimiento / Creación / Espacio tranquilo.
Reutilizar los enlaces externos al área si se entregan rutas verificadas; nunca fingir que funcionan con href=#.

## Contrato de producto

ACTION → CONSEQUENCE → INFERENCE → REVEAL.

Cielo: orientar y ampliar → localizar patrón → examinar → identificar → revelar → profundizar.
Peces: recorrer entorno → orientar luz → observar → examinar → identificar → profundizar/álbum.

La portada orienta para entrar; la experiencia la protagoniza la escena. No convertir las experiencias en un atlas de tarjetas ni copiar la linterna de Peces a Cielo.
No puntuación, quiz, confeti, autoplay, decoración sensorial ni música añadida.

## Contenido de las fichas

Nombre de la experiencia, imagen existente adecuada, descripción breve, qué puede hacer la persona, CTA Explorar y retorno claro.
En Cielo el título público es Cielo nocturno: no anticipar «Orión» ni usar una imagen con nombre/figura resuelta en el acceso al primer hallazgo.
En Peces no anticipar identidades de los encuentros iniciales con nombres o imágenes completamente reveladas que den la respuesta. Usar sólo recursos neutrales existentes y adecuados, sin editar ni generar.
No mostrar al público IDs, hashes, gates, anotaciones de revisión o marcadores de fold.

## Canon NAVY exacto

| Uso | Valor |
|---|---|
| Fondo general en toda la página | #0B1A2B |
| Panel/tarjeta | #15304A |
| Superficie secundaria | #1D3D5C |
| Texto principal | #EEF4F8 |
| Texto secundario | #C9D5DD |
| Enlace | #9FDCEA |
| Foco/acento | #C3B8FF |
| Borde control | #8494A8 |
| Separador decorativo | #2A4460 |
| Botón principal | #DCE8F2; texto #0B1A2B |
| Cuerpo | Atkinson Hyperlegible, 1rem/16px base, interlineado 1.6 |
| Títulos | Newsreader, 600, interlineado 1.2 |
| Título de portada | Newsreader, 400, adaptable 40–56px, interlineado 1.06 |
| Introducción | Atkinson Hyperlegible, ~19px, interlineado 1.58 |

Fuentes locales con licencias. Sin CDN, tema claro ni selector de tema. Marca textual Iris Green y recursos de marca existentes; no inventar logotipo. Reserva Sabik coherente con Juegos; no recrear su asistente.

## Para todos y Plus

Montar ambas rutas y estados, no dos botones sin destino.
Usar sólo clasificación de acceso documentada. No decidir unilateralmente qué experiencia es Plus, duplicar contenido para llenar las dos partes ni inventar precios, planes, paywall o condiciones.
Si no se recibe el reparto final, usar un registro central con estado interno pendiente y un catálogo neutral/estado vacío honesto en cada parte. Mostrar las fichas neutrales desde la portada permite probarlas sin atribuirles un nivel de acceso falso.
Esa incertidumbre no bloquea construir la página.
La prueba interna no exige pago. No conectar checkout ni pagos live.

## Conexión de prototipos

Conectar sólo ejecutables disponibles e identificados; conservar motores y assets originales.
Si aún falta el ZIP final, preparar el punto de integración y declararlo en README. No implementar una simulación que parezca el prototipo validado ni decir que Explorar funciona si no hay destino.
Prisma finalizará los enlaces a los runtimes y el regreso al área.
La biblioteca completa se incorpora después de validar cada prototipo, mediante sus manifiestos: constelaciones con datos geométricos; peces por hábitat/zona/escena y pares compatibles. No situarlos todos en la misma escena.

## Responsive y accesibilidad

320, 390 y 1440 px; texto al 200 % sin pérdida de contenido ni scroll horizontal de página.
Controles reales >=44×44 CSS px, foco visible independiente de selected, semántica de enlaces/botones, aria-current, nombres ES/EN y navegación con teclado.
Menú móvil funcional: abrir, cerrar, Escape y retorno de foco.
NORMAL / REDUCED / NONE; sin movimiento automático esencial.
Forced-colors; información no dependiente sólo del color.
En móvil debe entenderse cómo continuar y entrar. Si un CTA queda abajo, conservar continuidad visual y scroll natural sin reducir tipografía ni controles.

## Entrega

DESCUBRIMIENTO_AREA_NAVEGABLE_R01.zip:
- index.html como entrada única; doble clic tras extraer cuando sea compatible con los runtimes disponibles;
- CSS/JS y fuentes locales; recursos existentes incluidos con procedencia;
- README con cómo abrir, mapa de rutas, conexión implementada/pendiente y clasificación comercial pendiente;
- manifiesto y SHA256;
- capturas 320/390/1440 del ejecutable extraído;
- pruebas realmente ejecutadas de rutas, menú, foco, reflow y carga; separar pendientes;
- si entregas lienzo Design, el ZIP ejecutable manda y ambos deben corresponder al mismo producto.

Gate de entrega: CLAUDE_DISCOVERY_AREA_NAVIGABLE_R01_READY_FOR_REVIEW.
Después Nexo/Axioma revisan el artifact exacto y María prueba. No declarar HUMAN QA PASS.
NO MAIN · NO PUBLIC DEPLOY.
