# Nexo → Claude Design · Cielo nocturno y Vida marina completos · R01

## 1. Autorización, alcance y responsables
María, 2026-10-05 20:18 Europe/Madrid: «Cielo está corregido y Vida marina también [...] vamos a hacer los descubrimientos enteros [...] crea tú lo que debe hacer y le pido a Astra los ZIP con todo».

Se autoriza ampliar e integrar las dos experiencias existentes, su información completa y el recorrido desde el área Descubrimiento. No esperar otra autorización para preparar estructura, datos y montaje. La confirmación de María habilita continuar; no inventa el hash de los ejecutables corregidos ni una revisión independiente.
Estado: EXPANSION_AUTHORIZED_BY_MARIA; corrected_runtime_hashes = pendiente de recepción.
Claude Design: construir esta entrega integrada reutilizando los motores corregidos. Astra: empaquetar biblioteca y datos existentes con procedencia. Nexo: contrato y reconciliación. Axioma: revisión independiente del ejecutable completo. Prisma/Vector: integración posterior en el repositorio/web cuando corresponda. Motor permanece con Sabik.

Alcance inmediato: Cielo nocturno completo (88 constelaciones y sus contenidos existentes) y Vida marina completo (todos los registros/animales únicos entregados y sus ambientes). Este encargo no diseña ahora Sistema Solar, eclipses, meteoros, exoplanetas ni fósiles: sus paquetes se inventarían aparte si Astra los aporta. No confundir «completo» con añadir otros productos sin interacción definida.

## 2. Entrada, navegación y acceso
Reutilizar DESCUBRIMIENTO_AREA_NAVEGABLE_R01_1, SHA d0ef4877a09e892cf219afdb90089a44cad83b181544b2f70df7972c815b04e3, sin rehacer su diseño.
Recorrido real: portada → tema o catálogo → ficha → Explorar → escena → información → volver a escena → volver al área. Ningún Explorar termina en el aviso de experiencia no conectada al cerrar esta entrega.
Sustituir placeholders por recursos existentes adecuados y con alt ES/EN. No anticipar identidades de encuentros ni una constelación resuelta en la portada del primer descubrimiento.
Para todos y Plus conservan rutas y estados. La asignación comercial no está fijada: datos de acceso separados de tema, escena y objeto; no inventar precios, bloqueo ni clasificar todo un tema arbitrariamente. La revisión interna da acceso a todo el contenido integrado, con un selector interno de pruebas fuera del flujo público. No duplicar contenido para rellenar ambos catálogos.
Cuando exista el reparto autorizado se aplica por configuración, sin reescribir motores. Los enlaces a otras áreas se conectan únicamente con rutas existentes verificadas.
Corregir el caso pendiente del menú móvil si se reproduce: resize a escritorio con foco en Cerrar no puede dejar foco en un control oculto. Completar reserva Sabik sin reconstruirlo ni tocar su runtime.

## 3. Contrato común de descubrimiento
EXPLORE → LOCATE → EXAMINE → IDENTIFY → REVEAL → DEPTH.
Entrar ofrece lugar/objetivo, nunca la respuesta. Señalar y examinar son acciones distintas; hover no identifica.
No recompensas arbitrarias, puntuación, cuenta atrás, preguntas de examen ni música añadida.
El entorno debe poder recorrerse, no esperar a que los objetos lleguen al trozo visible. Lo descubierto se conserva al volver, cerrar una ficha o pausar.
Ayuda breve por modalidad. Mantener autonomía para explorar y ayudas opcionales sin conducir automáticamente a la respuesta.
Portada orienta, escena permite observar, ficha aporta conocimiento. No reemplazar una experiencia por una enciclopedia de tarjetas.

## 4. Cielo nocturno completo
### 4.1 Extensión de contenido
Integrar 88 constelaciones canónicas y materiales asociados existentes: geometría estelar, nombres, límites regionales, líneas de figura, masters, atlas/guías y horizonte. Una imagen por constelación no constituye una escena astronómica.
Usar campos curados coherentes con datos disponibles, cargados bajo demanda. No pegar 88 posters en un cielo ni colocar constelaciones en posiciones estéticas.
Ofrecer «Explorar el cielo», «Continuar» y un selector comprensible de campos/recorridos. No exigir terminar los 88 en un orden fijo. Orión conserva su primera experiencia.
Los campos usan CURATED_OBSERVATION_PRESET. No anunciar «tu cielo ahora» ni inventar fecha, hora, lugar, visibilidad o coincidencia de todos los objetos. Las referencias geográficas/temporales sólo aparecen cuando estén respaldadas por datos de la escena.
Cada constelación debe tener un recorrido accesible desde alguna escena incluida, registrado en una matriz objeto→escena. Resolver la cobertura de 88 con los datos entregados; una fila en el índice sin experiencia no cuenta como integrada.

### 4.2 Controles definitivos
Ratón: clic directo en punto/zona para seleccionar. Arrastre voluntario para mover vista; zoom con controles y rueda gestionada sin atrapar indiscriminadamente scroll.
Cielo quieto al apuntar. Sin círculo obligatorio, sin perseguir retícula, sin pan/zoom automático al seleccionar. Soltar arrastre no selecciona. Flechas son teclas físicas con escena enfocada, no una cruceta que haya que pulsar con ratón.
Toque directo y navegación táctil; vía equivalente sólo con teclado. Conservar orientación corregida y coordenadas compartidas de dibujo/selección.

### 4.3 Hallazgo e información
Pistas basadas en rasgos realmente observables, ES/EN. No nombres ni figura antes de encontrar.
Examinar una zona válida confirma el patrón; después ofrecer revelar figura y «Saber más» claramente visible. Las líneas permanecen alineadas sobre el mismo cielo.
Ficha completa por constelación con contenido existente verificado:
- nombres ES/EN y denominación canónica;
- qué se ha encontrado y cómo reconocerlo;
- estrellas principales, con datos y unidades disponibles;
- diferencia entre dibujo convencional y región oficial;
- material visual de profundidad, con pie y alt;
- hechos de interés y contexto cultural cuando estén documentados, separados de hechos astronómicos;
- fuentes y procedencia; incertidumbre donde corresponda.
No rellenar ausencias con cifras inventadas. Falta de información se registra por campo y se completa con fuentes identificadas antes de declarar cobertura final.
Estrellas seleccionables tras el hallazgo permiten consultar datos propios si están disponibles. Fuentes accesibles sin revelar la solución antes de tiempo.
Cerrar ficha recupera cámara, zoom y selección. El atlas completo reside en profundidad; para volver a explorar se vuelve al mismo campo.
Cuaderno de hallazgos: objetos descubiertos, consultar ficha y regresar al campo. No mostrar nombres/imágenes resueltas de pendientes como spoilers.

## 5. Vida marina completa
### 5.1 Catálogo y escenas
Integrar todos los animales únicos de la biblioteca recibida, no asumir que 301 registros equivalen a 301 especies. Reconciliar alias, variantes, duplicados, fases vitales y sustituciones.
Agrupar mediante hábitat, región, profundidad y ambiente respaldados por los datos. No meterlos todos en «200–1000 m» ni asumir coexistencia porque comparten profundidad.
Usar escenas diferenciadas según inventario real: litoral/arrecife, aguas abiertas, profundidad, fondo u otras categorías documentadas. No crear categorías vacías sólo para aparentar variedad.
Si el inventario contiene agua dulce/cavernícola, aislar esos ambientes y rotularlos correctamente, sin presentarlos como marinos. Su encaje nominal en el área se documenta para Nexo; no cambiar taxones para forzarlos.
Todas las filas tienen destino: escena válida, revisión interna o exclusión justificada. Un caso pendiente no paraliza los demás.
Ensayo interno de todos los assets incluidos —incluidos candidatos señalados— accesible sólo en modo equipo y sin afirmar hábitat/especie inciertos como hechos. No resucitar archivos revocados ni meter pendientes en escenas factuales públicas.

### 5.2 Motor y percepción
Conservar natación, cámara, selección directa, luz, pausa y ajustes que María ya ha probado. No aplicar a Peces el rework de controles de Cielo.
Parámetros por animal: desplazamiento, giro, deformación, anclaje/pivote, escala y comportamiento. Evitar una onda idéntica para peces, medusas, animales de fondo y organismos rígidos; usar configuraciones apropiadas y declarar aproximaciones visuales.
Todo el cuerpo, sus máscaras y puntos de examen comparten transformación. Examinable sólo cuando está suficientemente visible/iluminado dentro de pantalla; no basta una cola fuera de escena o un ejemplar de canto.
No imponer haz oscuro a ambientes diurnos si sus assets/escena no lo justifican. Usar comportamiento de iluminación definido por escena y recursos existentes; no rediseñar la interacción que funciona.
Pausa conserva pose, luz, cámara y selección. Reanudar no revive destinos de cámara cancelados. REDUCED reduce movimiento, NONE mantiene acceso al contenido sin natación. El álbum y las fichas no obligan a perseguir un animal.
Escala legible no debe fingirse escala física real si se ha ajustado para observar. No inventar tamaños exactos.

### 5.3 Información completa
Tras Examinar: imagen revelada, nombre común ES/EN, taxón y nivel de certeza, grupo, rasgos observables, tamaño/rango con unidades, distribución/hábitat/profundidad documentados, alimentación/comportamiento disponibles y fuentes.
Bioluminiscencia, transparencia o adaptaciones sólo cuando estén respaldadas para ese taxón; no inferirlas por una imagen oscura o brillante.
Fases vitales, sexo o morfos se indican cuando afecten al asset. No intercambiar especies parecidas.
Álbum: conservar hallazgos por ID, consultar ficha, volver a escena, filtrar por ambientes/grupos descubiertos. Ocultar identidades pendientes en el flujo exploratorio.
No necesita cuenta ni red para guardar localmente; error de almacenamiento no impide explorar. Borrar progreso requiere acción explícita de la persona.

### 5.4 Hallazgos de Astra que deben acompañar la expansión
Fuentes leídas: #390 comentario 5999828991 y HANDOFFS/MAR22_CORRECCIONES_20261005/ESTADO.md + CONTROL/MAR22_CORRECCIONES_20261005.json.
Incluir MAR22_CUATRO_PAREJAS_QA_20261005.zip (pepino, sifonóforo, pez gota, ctenóforo) como delta técnico, no PASS científico. Sus oscuros ya están corregidos y registrados; no regenerarlos.
Probar semitransparencia real al iluminar: la auditoría del motor anterior detectó que superponer luz con source-over podía aumentar alfa. Comprobar el motor corregido recibido; si persiste, corregir composición sin alterar la anatomía. Revisar haz parcial, retirada, oclusión y giro con cada tipo de transparencia.
B10 correspondencias pendientes; B16 sustituto revocado se excluye, sin rehabilitarlo por existir; B15 aprobado se conserva. Mantener estado por registro; no detener toda la integración por estos casos ni declararlos solucionados.

## 6. Datos y paquete técnico
Un registro canónico por objeto y por escena. IDs estables; separar:
- asset: rutas relativas, versión, SHA256, dimensiones, perfil, licencia/procedencia, alt;
- contenido ES/EN y fuentes por afirmación/campo;
- pertenencia a escena con evidencia y estado;
- parámetros de dibujo/animación;
- acceso comercial;
- revisión técnica, factual y humana, separadas.
Manifiesto de escenas declara objetos y campos de cámara/iluminación. Validar referencias antes de arrancar. No usar un booleano genérico zonaValidada para cualquier ambiente.
Compatibilidad file://: datos locales empaquetados, sin depender de fetch remoto o CDN. Si hay copia de datos para ejecución, generarla desde una única fuente y comprobar equivalencia, no mantener dos catálogos a mano.
Cargar sólo recursos del campo/escena activo y miniaturas necesarias. Liberar recursos al cambiar de escena, no precargar toda la biblioteca. Fuera de vista o página oculta no seguir consumiendo animación innecesaria.
Ningún asset sustituido en silencio. Registros ausentes se listan por ID y causa. Conservar originales fuera de la ruta pública.

## 7. Canon visual y accesibilidad
NAVY único: fondo #0B1A2B; panel #15304A; secundaria #1D3D5C; texto #EEF4F8; secundario #C9D5DD; enlace #9FDCEA; foco/acento #C3B8FF; borde #8494A8; separador #2A4460; botón principal #DCE8F2/texto #0B1A2B.
Atkinson Hyperlegible local 16px/1.6; intro ~19px/1.58. Newsreader local títulos 600/1.2; portada 400,40–56px/1.06.
320/390/1440, texto 200 %, targets >=44px, foco distinto de selected, teclado/touch, feedback aria-live no continuo por cada fotograma, alternativas textuales utilizables, forced-colors y NORMAL/REDUCED/NONE.
Escena protagonista; información secundaria bajo ella o en panel que no tape el hallazgo. Ningún título o botón recortado para alcanzar un porcentaje artificial.
ES/EN funcional en navegación, ayuda, fichas y anuncios, preservando foco/estado. Los términos científicos conservan su forma canónica.
No llenar UI con hashes, gates, coordinaciones, etiquetas de debug o problemas internos.

## 8. Entrega y aceptación
Entregar DESCUBRIMIENTO_COMPLETO_R01.zip con index.html; si el tamaño obliga a dividir, paquetes por escena con estructura de extracción idéntica y guía única, sin editar rutas manualmente.
Incluir fuentes/assets locales, datos, README, manifest, SHA256, matriz de cobertura y grabación real de recorridos.
Matriz Cielo: 88 esperadas → recibidas → escenas accesibles → fichas completas → pendientes concretos.
Matriz Vida marina: registros recibidos → únicos/variantes/duplicados/revocados → destinos de prueba/escena → fichas → pendientes. No objetivo numérico inventado antes del inventario.
Chequeo automático de TODOS los archivos/registros: integridad, referencias, campos y rutas. Pruebas de interacción por tipos de escena/animal, más revisión visual de cada asset en visor interno para detectar registro, escala, deformación y transparencia.
Evidencia de navegador sobre el ZIP final, no sólo funciones puras. Cielo: seleccionar fuera del centro con ratón/teclado/touch. Peces: desplazarse a encuentros inicialmente fuera de pantalla, pausar, iluminar, identificar, abrir álbum y volver.
Menú, ida/vuelta sin perder progreso, idioma, almacenamiento, movimiento y 200 %. Un PASS de tres animales no valida la biblioteca entera.
La integración se hace por lotes verificables para no romper lo anterior, pero el objetivo autorizado es completar el inventario entregado; no detenerse en tres animales ni sólo Orión por una orden antigua.
Disponibilidad de biblioteca no equivale a aprobación factual global. Puede entregarse una versión completa de PRUEBA con incidencias identificadas; la publicación requiere resolver lo aplicable y QA posterior.
NO MAIN · NO PUBLIC DEPLOY. No tocar Sabik ni el juego de Construcción.
