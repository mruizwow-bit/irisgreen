# Nexo · Formación integrada R04 · Del comportamiento correcto al producto comprensible
Fecha: 2026-10-06 · Issue #350.
Estado: CONOCIMIENTO_CONSOLIDADO_CON_PRACTICA_PARCIAL; no certificación, HUMAN QA ni aprobación de los patches pendientes.
Amplía R02/R03 y conecta los módulos08–21. No reemplaza evidencias históricas ni convierte sus estados antiguos en estado vivo.
Encargo de María: ampliar todo lo aprendido, incluyendo errores propios, estudio de Claude y contraste con Prisma/Axioma.

## 1 · Qué debo saber hacer ahora
La cadena que debo poder explicar y comprobar es:
intención → entrada → selección → estado → representación → consecuencia percibida → continuación/recuperación.
Una ruptura en cualquier enlace puede dejar65 pruebas verdes y un producto difícil o incorrecto.
Antes sabía enunciar TECHNICAL_PASS != PRODUCT_PASS. Ahora debo elegir pruebas que puedan contradecir mis decisiones y diseñar experiencias donde el efecto se entienda sin una explicación mía.

Ejemplo transversal: una ficha abierta demuestra navegación; no demuestra que se observó el rasgo, que el clic eligió el objeto querido, que la pista ayudó o que merece la pena continuar.
No sustituir la creación por auditoría interminable: reproducir el fallo, corregir lo acotado, verificar el riesgo concreto y pasar a uso humano cuando corresponda.

## 2 · Contratos de producto que no debo mezclar
| Área | Propósito y acción | Error a evitar |
|---|---|---|
| Recursos | Pictogramas y sus usos/descargas | Duplicar el catálogo de Juegos |
| Juegos | Jugar, tomar decisiones, construir, recorrer y experimentar consecuencias | Disfrazar una rutina didáctica o un ejercicio de controles de juego completo |
| Descubrimiento | Explorar, notar indicios, localizar, revelar y profundizar | Ficha automática por porcentaje; cuestionario para demostrar que se aprendió |
| Creación | Hacer y transformar una producción propia | Trasladar aquí Construcción/El Vado por contener el verbo construir |
| Espacio tranquilo | Experiencias como Pecera con intención de uso propia | Usarlo como modelo de todo Descubrimiento o reducirlo a una página vacía |
| Información | Contenido comprensible, encontrable y trazable | Afirmar cobertura que no está disponible |

Inicio no es una séptima área. Descubrimiento sustituye Intereses y Creación sustituye Taller en navegación pública; se conserva contenido reutilizable. Para todos/Plus son ámbitos de acceso, no temas ni permisos para inventar reparto comercial.
La petición posterior de María es diseño nuevo de TODA la web alineado con Juegos/Descubrimiento, con imágenes en home. Conservar canon no obliga a conservar composición.
Fuente: aclaración de María en HANDOFFS/NEXO_WEB_COMPLETA_R01_20261006/ACLARACION_MARIA_REDISENO_COMPLETO.md, commit812663ca5a05a32e856ce64b658ee2a1b04e88f4.

## 3 · Lo que aprendí estudiando las implementaciones de Claude
KEEP concreto: ZIP portable, fonts locales, carga por campo, separación de motor/datos/interfaz, mundo mayor que viewport, manipulación directa, perfiles de movimiento, máscaras compartidas, nodos reconciliados y documentación de límites.
No idealizar al autor ni copiar su banco como verdad independiente. El valor del estudio consiste en identificar por qué una solución funciona y dónde deja de hacerlo.
Un hash es identidad/integridad; un manifest es inventario; un fixture es una reproducción controlada; una captura es evidencia visual de ese estado. Ninguno sustituye una partida o exploración completa.
Conservar mejoras ya demostradas al pedir un patch. Un fallo nuevo de trayectoria no borra el cierre de continuidad de pose; tampoco ese cierre impide detectar la nueva trayectoria incorrecta.

## 4 · Observación: tres condiciones y tres tipos de validación
Separar BODY_CONTEXT_THRESHOLD, OBSERVABLE_FEATURE_THRESHOLD y revealFacts.
- Contexto: evita identificar una esquina aislada.
- Observable: rasgo que la representación realmente permite mostrar.
- Dato posterior: explicación que no tiene por qué convertirse en condición visual.

Separar validación factual, registro gráfico y perceptibilidad humana. Un artículo sobre transparencia no valida este PNG; un IoU global no valida los brazos; puntos brillantes detectados no son fotóforos anatómicos automáticamente.
La región se anota sobre el asset real y con fuente pertinente, no sobre porcentajes genéricos del rectángulo. Mi práctica de Fósiles cometió precisamente ese error.
La regla visible no puede degradarse a «lo poco que queda es100%»: en Cielo R02 una estrella visible bastaba para anunciar tres alineadas. Hace falta un mínimo semántico por patrón, sin exigir tres puntos a todos los objetos.
En Peces R06, activo:false no permite interpretar una lista vacía como evidencia suficiente. Configuración inválida, bloqueo y ausencia deliberada de requisito son estados distintos.
bodyContext.requiredFraction debe ser consumido realmente por el motor. Cambiar un valor de prueba por animal detecta un esquema meramente decorativo.

## 5 · Pistas perceptibles y umbrales humanos
En Cielo R02,53/88 pistas mencionan magnitud numérica. La unicidad dentro del dataset no demuestra que una persona pueda distinguir ese decimal en pantalla.
Una pista inicial debe dirigir a una relación visible sin exigir conocer previamente el grupo que se busca. Reservar datos exactos para profundidad; pilotar forma, relación y brillo relativo frente a vecinos reales.
En Peces, porcentaje iluminado no basta si el rasgo es diminuto. Medir tamaño aparente en píxeles CSS, zoom, pose y oclusión; no fijar un mínimo universal sin revisión humana.
La batería debe separar frontera válida y adversos. Un caso justo por debajo del umbral es deliberadamente no examinable por esa condición; filtrarlo con examinable=true elimina la mitad útil de la prueba.
Hacha de canto no sirve para validar su silueta de perfil. Cola/aletas sin tronco es un adverso pertinente. Calamar bloqueado no se presenta como cobertura aprobada.
Preguntar «¿Qué detalle distingues?» permite señalar o describir sin términos técnicos ni cronómetro. Esta tarea pertenece al QA, no al flujo público como examen.
Una fuente por afirmación incluye alcance taxonómico: familia, género, especie o ejemplar. No trasladar talla/profundidad de Sternoptyx obscura a un asset identificado sólo como pez hacha.

## 6 · Selección e interacción directa
El ratón/toque actúa donde se señala; hover no arrastra la cámara. Flechas físicas funcionan con foco contextual y no secuestran botones, radios o campos DOM.
Separar seleccionar, mover vista y encuadrar como ayuda. «Esta zona» debe producir un efecto en esa zona; si la asistencia elige otro lugar debe explicarlo.
Elegibilidad no es prioridad. Un objeto más iluminado no necesariamente es el señalado. La intención explícita y «Otro animal» prevalecen sobre una puntuación recalculada.
Mantener selección estable; no cambiar el elegido cada frame. Si desaparece, resolver foco y comunicarlo. Conservar un nodo no resuelve su retirada.
Confirmación pertenece al contexto, no sólo a una lista de IDs. No caducar por defecto a los pocos segundos: permitir responder lentamente. Reconfirmar ante cambio significativo, evitando ciclos por el nado ordinario.
pointercancel cancela; pulsación lenta sigue siendo válida; NONE conserva precisión. Pinch→un dedo requiere rebasar referencias: en Cielo R02,1px físico produjo21px de movimiento en fixture.
Teclado no sustituye toda alternativa de puntero simple. Una vista general puede ofrecer destino sin arrastrar; verificar su alcance, no sólo que algún botón mueva algo.

## 7 · Tiempo, pose, cámara y asíncronía
La fase acumulada evita recalcular el pasado al cambiar frecuencia. Pero onda en ciclos y recorrido en radianes no deben compartir variable.
Peces R06 corrige discontinuidad instantánea y, al mismo tiempo, acelera el periodo horizontal del hacha de31s declarados a4.95s efectivos. Probar instante de cambio Y evolución durante un periodo.
Giro usa dt; comparar a iguales tiempos en30/60/120Hz. La velocidad declarada debe concordar con el desplazamiento real.
Pausa conserva posición, orientación, deformación y cámara; reanudar no revive destinos cancelados. NONE no borra pose.
Cada carga tiene dominio e identidad: campo, ficha y panel no comparten automáticamente la misma cancelación. En Cielo R02, token de campo no protege dos fichas del mismo campo ni un cierre.
Al aplicar respuesta, verificar solicitud vigente, pantalla y objetivo. Incluir espera, error, cierre y orden invertido; bloquear el motor viejo durante carga de un mundo nuevo.

## 8 · Persistencia y operaciones coherentes
Recordar en memoria no equivale a escribir almacenamiento. Probar cerrar/recargar sin pasar por Volver a portada; guardar al completar gesto/transición con frecuencia controlada.
Versión no valida contenido: tipos, finitud, rangos, IDs y coherencia deben comprobarse antes de mutar. Datos desconocidos no se sobreescriben como si fueran válidos.
Cargar una partida debe ser atómico: validar primero; si falla, conservar la actual.
Deshacer construcción afecta apoyo, personaje, ocupación, inventario, progreso y navegación, además de la pieza.
Retirar usa superficie impactada; colocar usa destino adyacente. No reutilizar la misma celda por comodidad.
Restablecer vista y borrar progreso son acciones distintas. Un cambio de representación no autoriza borrar un álbum existente.

## 9 · Mundo vivo y variedad sin200 motores
La gramática BIOMA × MICROHÁBITAT × PISTA × CONDUCTA × INTERACCIÓN × OBSERVABLE permite reutilización sólo entre combinaciones factual y visualmente compatibles.
Hábitat no es decoración: refugio, sustrato y oclusión participan en descubrimiento. Pan2D no equivale a rodear una roca; definir cómo cambia la visibilidad.
Pares luz/oscuro sirven donde existe ese mecanismo, no son requisito para cualquier encuentro diurno.
Movimiento y presencia ambiental son preferencias distintas. NONE debe conservar acceso mediante acciones estáticas, sin esperas obligatorias ni esconder especies.
Separar número de taxones únicos, encuentros y animales simultáneos.200 plazas no prueban200 especies. Cargar sólo lo necesario y medir memoria decodificada, no sólo pesoZIP.
Una microescena completa comprueba interés/claridad; después varias prueban transferencia. Los números de biomas o una regla «no repetir más de dos veces» son propuestas, no leyes probadas.
Fuentes y límites de investigación: módulos09–11. No afirmar preferencias universales de personas neurodivergentes.

## 10 · Construcción3D y Vera
Tener z o renderThree no hace un juego. Transferir de Dragon Quest Builders la relación materiales→decisión→obra→uso; no copiar sus assets ni intentar construir su escala.
Dos soluciones útiles, acceso abierto por una obra y uso por un personaje aportan consecuencias comprobables. Completar colocando/quitando la misma pieza mientras la parcela queda vacía sólo acredita contador.
Modelo de alturas y piezas puede bastar para un piloto. No imponer voxel completo, física nueva o migración de motor sin necesidad concreta.
Vera es el personaje entregado por María; preservar identidad. Su original contiene20 AnimationStack, no20 acciones jugables aprobadas. Nombres de clip orientan; hay que reproducirlos.
El FBX estructuralmente legible no demuestra deformación, pies estables o rendimiento. Comprobar escala/ejes, skin, materiales, bucles, colisión y transiciones dentro del juego.
Elegir root motion o desplazamiento del controlador con coherencia. Evitar doble desplazamiento. DerivadoGLB/texturas optimizadas conserva procedencia y masters;116MB de fuente no es presupuesto de entrega.
No pedir a María rehacer Meshy sin defecto visual concreto con clip/instante. No hay animación de construir verificada por el inventario.
Fuente: HANDOFFS/NEXO_VERA_PERSONAJE_CANONICO_20261006/VERA_ORIGINAL_Y_GUIA_INTEGRACION.md, commit719b0b6c4d011c1c21afb77620a78f12bb258016.

## 11 · Web, formato y canon
Aplicar canon no significa repetir cajas. Portada con imágenes pertinentes, acciones distinguibles y rutas reales; placeholder no cuenta como integración.
Datos de navegación deben producir derivados; editar JSON+JS+HTML a mano es duplicación aunque se llame fuente única.
Probar cada botón contextual: reset vacío, cerrar, volver, recuperación y error, además de ruta principal.
Reflow incluye clipping interno, capas abiertas y foco visible. scrollWidth global, ausencia de errores o alt vacío de un sitio sin imágenes no son pruebas completas.
Medir cielo visible mediante intersección viewport/oclusores; alturaCSS/viewport es otra métrica. Preservar zoom numérico al cambiar canvas no asegura escala aparente.
Panel fuera del título puede seguir tapando el patrón. Elegir composición que preserve orientación y comprensión al abrir/cerrar, sin cámara que persiga objetos.
NAVY: fondo#0B1A2B, panel#15304A, superficie#1D3D5C, texto#EEF4F8, secundario#C9D5DD, enlaces#9FDCEA, foco#C3B8FF, borde#8494A8, separador#2A4460, principal#DCE8F2/texto#0B1A2B.
Atkinson Hyperlegible cuerpo1rem/1.6; Newsreader títulos600/1.2; hero400,40–56px/1.06. Targets44px son canon del proyecto; no presentarlos como resumen universal de WCAG.
ES/EN incluye estados, ayudas, accesibilidad y errores. No afirmar conformidad jurídica desde esta formación.

## 12 · Media, Sabik y Payments: conservar límites aprendidos
Pecera: medir volumen o duración no acredita burbujas audibles, identidad sonora, comodidad ni continuidad. Escuchar el archivo exacto; comparar contra referencia aprobada; no confundir A1 técnico antiguo con nueva pieza5min. Este módulo no ha escuchado ni aprobado una nueva entrega.
Voz: hash de modelo y HTTP200 no acreditan identidad ni reproducción audible. La cadena voz→STT→Core/Safety/sesión→respuesta→TTS necesita prueba real con cancelación y retorno; un mock sólo prueba su parte.
Conocimiento de Sabik necesita contenido recuperable y prompts adecuados; número de documentos o snippets no prueba conversación útil.
Payments conserva gate de testE2E y autorización específica para live. Este estudio no revalida implementación, voces o release actual; leer estado vivo antes de actuar.
Ritmo conserva trabajo técnico, pendiente de experiencia dentro de Creación cuando así figure en su estado. No reabrirlo sólo por añadir una nota de formación.

## 13 · Método de prueba que cambia mi trabajo
| Pregunta | Evidencia apropiada | Lo que no basta |
|---|---|---|
| ¿Son los mismos bytes? | Hash del artefacto/archivo canónico | Nombre o captura parecida |
| ¿Se puede llegar a cada objeto? | Cobertura por objeto con condiciones declaradas | Contar fichas |
| ¿El clic elige lo querido? | Casos fijados antes del resultado, incluidos errores | Buscar encuadres hasta acertar |
| ¿Nada salta? | Centro+giro+fase+deformación+cámara y evolución | Sólo centro en un instante |
| ¿El rasgo se ve? | Escena al umbral, pose/tamaño y revisión humana | Porcentaje o IoU |
| ¿El mundo es útil/divertido? | Recorrido humano con elecciones y consecuencias | Solver, contador o vídeo promocional |
| ¿Se retoma la sesión? | Recarga/restore y guardados adversos | Estado en memoria |
| ¿Funciona la interfaz? | Navegación real y modalidades/dispositivos declarados | DOM simulado o .focus() inyectado |

Las pruebas adversas deben refutar un riesgo concreto. No ampliar sin límite un banco porque haya herramientas disponibles.
Contrastar revisiones por versión, hash, método y evidencia; no votar entre autores. Fuentes primarias apoyan afirmaciones concretas, no cada decisión de diseño.
Este módulo consolida fuentes ya estudiadas en06–21; no declara una nueva investigación bibliográfica ni vigencia de estándares.

## 14 · Errores de coordinación que asumo
Pedí «Empezar por Orión» y contradije el no-reveal anterior. La corrección es entrada neutra; no culpar a Claude por cumplir mi orden.
Confundimos storyboard aprobado con experiencia lista para jugar. HUMAN QA debe recibir un ejecutable cuando se evalúa interacción.
Una orden inaccesible para otro agente no está entregada efectivamente. Preparar texto íntegro y paquete exacto; enlace autenticado de Biblioteca no garantiza acceso externo.
Mantener una orden consolidada y base exacta por tarea. No mezclar Cielo, Construcción y Pecera ni reiniciar lo que ya tieneKEEP. No decir que se avisó por Slack si sólo se escribió GitHub.
Formación no es repositorio de instrucciones eternas: decisiones posteriores de María prevalecen, estados históricos se marcan y main vivo se contrasta antes de integración.

## 15 · Qué he demostrado y qué falta
Demostrado: lectura de código y contratos; reproducción independiente de fallos lógicos; contraste de evidencias; reconocimiento de errores propios; formulación de correcciones acotadas.
Parcial: convertir conocimiento en prototipos propios atractivos, anotación semántica, diseño de pistas y microescenas.
Pendiente sin evidencia específica: patches corregidos y retest, teléfono/lector/navegadores, calidad perceptual de nado/audio, integración de Vera, HUMAN QA y escala200+.
No otorgarme PASS formativo por escribir este módulo. Prácticas7–14 de02_PRACTICAS_Y_EXAMEN.md son la próxima demostración; estado inicial PENDIENTE.

## 16 · Evidencia canónica de las conclusiones recientes
- CieloR02: commit2d8c2eb28c3f88f1c494b541d52f9d97c7ff3977, HANDOFFS/NEXO_CIELO_COMPLETO_R02_20261006/ANALISIS_R02_Y_PATCH_R02_1.md + retest.cjs + RETEST_RESULTS.json.
- MarineR06: commitc046c7919dcfcb3eed56ddc0717341cce6efd3bf, HANDOFFS/NEXO_MARINE_R06_20261006/; orden consolidada Nexo/Axioma/Prisma commitd91aed8fb6f2c2db47400fd6bd2e8fc90e19afb3.
- Construcción: commit18207efd9b07ddab68ac626a5624a7e346196bed, HANDOFFS/NEXO_CONSTRUCTION_3D_VADO_20261006/; orden conVera9725dbc11b27a2c864a757bf9f83b17a6f8b8031.
- Web: commitdc6c2f0f3bec929aa6e8ab9c53604a34a5294508, HANDOFFS/NEXO_WEB_COMPLETA_R01_20261006/; aclaración posterior812663ca5a05a32e856ce64b658ee2a1b04e88f4.
- Fósiles propios: commit61e350229e907b06cbba0e4a4e4af76904568aa0, HANDOFFS/NEXO_FOSILES_DESCUBRIMIENTO_20261005/REVISION_NEXO_R01_20261006/.
Rutas relativas a COORDINACION_IRIS_GREEN, evidencias en rama nexo/new-games-area-r01-20261004. La formación reside en nexo/work-handoff-20261004. No resolver esos enlaces como si fueran archivos de main.

## 17 · Práctica Vera: reparación localizada y evidencia que no debo confundir
Revisión del ZIP de bolso reparado, SHA baa6e602228d58c18facdfebc9249948e7ad9e8aea0e24cd8d9de464abfbb5b9. Informe a00bb8fe2a0f2cac1f7c84dcc238686d705f4c27 y evidencia estructural 2e573910a6c76cbb587a2c6d989ef16815df892f en el handoff NEXO_VERA_PERSONAJE_CANONICO_20261006.
- Comprobado personalmente: 5/5 hashes, ambos GLB con 19 clips/24 huesos/12.734 vértices/15.116 triángulos, accessors y definiciones de animación idénticos entre completo y web, pesos normalizados dentro de error flotante. Esto no es reproducción de clips ni comparación con el original.
- El bolso mejora visualmente; la ropa sigue estirándose en el saludo. Reparar un accesorio no aprueba el personaje entero ni todos sus clips.
- Un bolso fijado a Hips tiene rigidez por construcción: medir cero deformación no prueba contacto correcto, ausencia de penetración o correa natural. No universalizar rigidez de cuero.
- Mediana favorable frente a ropa defectuosa no decide calidad. Pedir localización de los extremos de correa, definición de métrica y evidencia visual pertinente; no convertir un porcentaje sin contexto en umbral inventado.
- 3.059 fotogramas suman los resúmenes entregados; no 3.159. Resúmenes por clip no son datos brutos por frame ni scripts reproducibles. Muestreo de láminas no equivale a vídeo continuo ni blending.
- Una reconversión por el mismo conversor comprueba repetibilidad; una comparación independiente con FBX requiere declarar evaluador, poses y método.
- Selección por color/luminancia es específica de la textura y su iluminación. Verificar orientación UV primero y entregar IDs/selección visual. No usar umbral global como regla para ropa futura.
- Siguiente patch acotado: selección de falda revisable, pesos por tramo real, límites de costura, clips completos y transiciones. Conservar master y derivado útil; no pedir nueva generación Meshy mientras la reparación localizada sea viable.
