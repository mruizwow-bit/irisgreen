# LUMEN · COGNITIVO 01 · ESTUDIO DE MORFOLOGÍA, ASSETS Y COMPOSICIÓN

Fecha: 2026-10-10
Estado: INVESTIGACION_VERIFICADA_PARCIAL__NO_VISUAL_PASS
Objetivo: sustentar una nueva propuesta de *El claro escondido* sin generar arte genérico, sin tocar el R03 funcional ni copiar referencias ajenas.

## 1. Problema identificado
La captura R03 del usuario muestra un bosque genérico dibujado como óvalos, hojas con formas radiales abstractas, botones rectangulares sobre una escena intercambiable. No basta con sustituir el bitmap de fondo ni añadir decoración. El juego tiene que usar formas observadas, materiales propios y composición donde la función sea evidente.

## 2. Referencias botánicas contrastadas

1. Royal Botanic Gardens, Kew — “What leaves reveal about wildflowers”: https://growwild.kew.org/blog/leaves-reveal-wildflowers — distinción entre hoja simple y compuesta, lámina, pecíolo, filotaxis y foliolos.
2. USDA Forest Service — *Field Guide* (tabla de formas/márgenes de hojas, p. 92 del PDF): https://www.srs.fs.usda.gov/pubs/gtr/gtr_srs062/gtr_srs062.pdf — formas lanceolada, elíptica, ovada, obovada, cordada, lineal, triangular; márgenes enteros, dentados, serrados, crenados, ondulados y lobulados.
3. Royal Botanic Gardens, Kew — Plants of the World Online, Malvaceae: https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:30000208-2/general-information — descripciones de hojas ovadas, lanceoladas y cordadas y margen entero/crenado/serrado (referencia de diversidad morfológica).

Fuentes usadas únicamente para **investigación de forma**; no se han copiado ni descargado imágenes al producto. Los nombres morfológicos no significan identificación de especie: el juego sigue siendo de comparación de siluetas, no un herbario taxonómico.

## 3. Taxonomía inicial de siluetas a dibujar **desde cero**

| Clave | Clase de estudio | Rasgos discriminantes estructurales | Primer uso | Riesgo |
|---|---|---|---|---|
| LS01 | Lanceolada | lámina estrecha, anchura máxima por debajo/centro, punta prolongada | básica | similar a elíptica si se dibuja demasiado ancha |
| LS02 | Elíptica | anchura central, extremos afinados, margen continuo | básica | casi indistinguible de ovada con simetría exagerada |
| LS03 | Ovada | anchura máxima bajo el centro, extremo distal más agudo | básica/media | dirección de tallo debe mantenerse uniforme |
| LS04 | Obovada | anchura máxima sobre el centro, punta más redondeada | básica/media | puede confundirse al girar 180º: NO emparejar LS03/LS04 cuando rotación es invariante sin estudio de ejes y pecíolo |
| LS05 | Cordada | hendidura basal en forma de corazón y lámina amplia | básica | reconocer por hendidura, no por color |
| LS06 | Trilobulada | tres lóbulos unidos en una lámina | básica/media | el anterior generador hacía hojas como estrellas radiales: prohibido |
| LS07 | Palmadamente lobulada | 5 lóbulos con senos profundos, una lámina continua | media/alta | evitar dibujo de mano o arce caricaturizado |
| LS08 | Pinnadamente lobulada | lóbulos pares a lo largo de nervio central, lámina continua | media/alta | no confundir con hoja pinnadamente compuesta |
| LS09 | Margen serrado | perímetro definido por dientes repetibles visibles | alta (solo al tamaño suficiente) | no usar microdientes invisibles en 320px |
| LS10 | Margen ondulado | borde continuo ondulado no lobulado | alta | no confundir ondulación estilística de trazo con atributo válido |

### Reglas para construir los masters de estudio
- Cada silueta tiene máscara binaria de hoja (sin nervaduras, texturas ni tallo ambiguo) y `morphology_id` explícito.
- Usar un sistema físico consistente para punta, base, pecíolo y escala; no manipular arbitrariamente una hoja 2D para aparentar variedad.
- Las rotaciones **no cambian** `morphology_id`. Una supuesta pareja válida con forma distinta solo por color debe mantener contorno idéntico bajo la transformada permitida.
- Medir separabilidad del contorno con IoU normalizado y distancia entre contornos como cribado de QA, seguido siempre de inspección humana a 320/390/1440. Los umbrales métricos requieren calibración perceptiva, no se inventan.
- En una ronda: **exactamente 1 respuesta**; no elegir distractores del mismo contorno canónico por mero cambio de color o patrón.
- En nivel inicial, separar claramente clases distintas. En mayor dificultad, escoger morfologías próximas solo si los contornos se distinguen realmente en el dispositivo de entrada.
- No mezclar hojar simple y compuesta sin cambiar la instrucción; de lo contrario cambia el constructo.

## 4. Inventario de primeras rutas **verificadas en GitHub main**

Inspeccionado con GET de GitHub `mruizwow-bit/irisgreen` a 10/10/2026 (solo nombres/tamaños; NO validación visual, artística ni legal):

| Recurso del repo | Uso potencial | Estado honesto |
|---|---|---|
| `img/vineta-hoja.png` / `.webp` | posible elemento editorial relacionado con hojas | EXISTE, pendiente mirar píxeles; NO APPROVED para Cog 01 |
| `img/j1-vera.png` / `.webp` | referencia/derivado de personaje Vera en sección juegos | EXISTE, pendiente comparación original/uso y licencia |
| `img/taller-mesa-mirar.png` / `.webp` | referencia de materialidad/mesa de observación | EXISTE, pendiente inspección; NO asumir escena reutilizable |
| `img/taller-mesa-construir.png` / `.webp` | referencia de objetos/mesas | EXISTE, pendiente inspección |
| `img/taller-portada.png` / `.webp` | jerarquía visual de El Taller | EXISTE, no convertir en fondo del juego |
| `img/intereses/flores/` (12 `.webp`) | banco floral propio, otras funciones | EXISTE; NO son siluetas de hojas aprobadas |
| `img/taller/` (carpeta con 17 entradas) | maquetas/categorías propias de Taller | EXISTE, revisar procedencia antes de reutilizar |
| `img/juegos-coleccion/` (93 `.webp`) | colección visual de juegos y recursos | EXISTE, sin asegurar que contenga los masters deseados |
| `assets/ig-suite-juego-runtime.js` | runtime reusable existente | EXISTE; no afirmar compatibilidad hasta inspeccionar código |
| `assets/juegos-iris.css`, `assets/juegos-iris.js` | UI/juegos actuales | EXISTE; no asumir contrato validado |
| `assets/ig-fonts.css`, `assets/ig-global-ui-tokens-2026.css` | fuente y tokens de la web | EXISTE; revisar código/tokens antes de integración |

Riesgo: que un archivo se llame “hoja” o “Vera” no prueba que esté autorizado para esta mecánica. No copiarlo a R04 todavía.

## 5. Canon visual comparado

Referencia interna: PDF `IRIS_GREEN_INFORME_VISUAL_FORMACION_2026-10-09.pdf`, Library.

- p.4 y p.5: función/escala/materiales; rechazo de «hoja de decoración», fondo de IA de género y página disfrazada de cartel.
- p.70 P31 (portada Faro); p.117 P29 (Faro ordenador); p.118 P30 (Faro móvil): **referencias visuales de su producto**. No son plantillas para el juego cognitivo. Mantener su sentido de mundo y jerarquía, no copiar directamente botones.
- p.102-103 P65/66: comparar una misma isla con iluminación distinta, **misma geografía**.
- p.20-21: Vera original; prohibido reemplazar por guía animal o generar personaje nuevo por estilo.
- `HOJA_IDENTIDAD_VISUAL_RECURSOS.docx`: el manifiesto de silencio y antidiseño genérico aplica como criterio de calidad transversal, pero sus estrellas, colores y estructura editorial corresponden específicamente a la serie `En la vida diaria`, **no son el canon completo de juegos**.

## 6. Estudio de composición SIN crear una nueva imagen

### H1 — Estación de observación integrada en Faro (candidato a prototipar)

**1440 px:** cabecera compacta en NAVY con título e idioma/pausa; columna de misión/modelo ~24-27% del ancho útil; escena de observación ~73-76%, con objetos distribuidos en posiciones alcanzables y anclados a superficie; un solo mensaje en la base, sin dos barras compitiendo. La mesa/superficie NO se presupone parte del mundo hasta comprobar master propio; puede modelarse como interfaz física cuando se apruebe.

**390 px:** cabecera compacta; modelo horizontal ocupando menos de 30% del alto inicial; área de elección **primera** y visible sin desplazamiento excesivo; 2 columnas de candidatos con hitbox >=44 CSS px, preferible >=64; ayudas y pausa accesibles sin tapar objetivo. No reducir una escena desktop hasta texto microscópico.

**320 px:** repetir control de 44 px y 2 columnas solo mientras los contornos sean claramente legibles; si no, paginar candidatos por bloques sin desordenar la tarea cognitiva, registrar variante de presentación (paginación altera estrategia de búsqueda).

**Interacción en cualquier tamaño:** modelo siempre visible, selecciones por puntero/teclado; no cambiar la respuesta al cambiar tamaño; accesibilidad forced colors. No comparar latencias entre presentaciones diferentes como si fueran el mismo ensayo.

### H2 — Observación dentro del paisaje

Riqueza contextual, pero variación no controlada de luz, oclusión, tamaño y disposición de hojas. Mantener como **exploración libre**, no como variante métricamente equivalente a H1.

### H3 — Herbario interactivo

Capacidad de discriminación mejor aislada, útil como baseline de legibilidad; riesgo de parecer ficha escolar. No trasplantar sin razón elementos visuales de la serie «En la vida diaria».

## 7. Separación de capas artísticas

1. MUNDO/FARO (canon de material/paisaje aprobado) — entorno identificable por continuidad de geografía, no cliché de bosque.
2. SOPORTE FÍSICO (si corresponde) — superficie cuya existencia y materialidad deben verificarse.
3. ESTÍMULO COGNITIVO — SVG máscara y dibujo botánico original con atributos medibles. No cocinar estímulo en bitmap de fondo.
4. INPUT/FEEDBACK — foco visible, selección, confirmación, pistas y mensajes en DOM, ES/EN.

NINGUNA capa justifica añadir mascotas, viento, brillos, partículas, rayos solares, banners, fichas de papel desgastado ni flores decorativas por defecto.

## 8. Gate antes de producir R05

- [x] Fuentes botánicas metodológicas documentadas.
- [x] Rutas de assets del repositorio inventariadas preliminarmente.
- [x] Diferencia entre identidad editorial y visual de Faro explicitada.
- [x] Dos diseños de composición descritos para tamaños desktop/móvil (no capturas).
- [ ] Abrir e inspeccionar píxeles de archivos `img/vineta-hoja`, `img/taller-mesa-mirar`, etc. Confirmar derecho/procedencia y QA humano.
- [ ] Dibujar hoja de observación (con 8-10 máscaras) y cotejar morfología real sin copiar dibujos externos.
- [ ] Probar legibilidad bajo rotación/escala en 320 y 390.
- [ ] Obtener visto bueno humano de dirección visual H1/H2/H3 ANTES de producir ilustraciones finales.
- [ ] Generar y comprobar interfaz jugable adaptada sobre base existente, nunca reescribir las reglas.

**Gate actual: `COGNITIVO_01_MORPHOLOGY_AND_REPO_INVENTORY_RESEARCH_PASS__ASSET_AND_VISUAL_QA_PENDING`**