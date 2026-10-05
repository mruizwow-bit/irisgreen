# Nexo · Fósiles · Definición de la experiencia de Descubrimiento R01
Fecha: 2026-10-05
Estado: PRODUCT_DEFINITION_PROPOSED_FOR_MARIA
Ámbito: DESCUBRIMIENTO → FÓSILES
Encargo actual: definir primero la experiencia. No construir runtime ni regenerar arte en este bloque.

## 1. Decisión de producto
La pregunta que mueve la experiencia es:
**«¿Qué quedó conservado en esta roca y qué nos permite saber?»**

La persona explora una superficie geológica, encuentra una forma parcialmente expuesta, retira cobertura donde decide, observa los rasgos que aparecen y abre la identificación contextual. La satisfacción está en hacer visible una evidencia y entenderla.

Secuencia:
EXPLORAR SUPERFICIE → LOCALIZAR INDICIO → DESPEJAR LOCALMENTE → OBSERVAR RASGOS → IDENTIFICAR → DOCUMENTAR → PROFUNDIZAR / SEGUIR EXPLORANDO.

El sedimento retirado permanece retirado al mover la vista, salir de la ficha y cambiar de sector. Esto distingue Fósiles del haz temporal de Peces. El puntero actúa donde señala; no obliga a transportar un objeto hasta un círculo central.

No se añaden puntuación, cronómetro, vidas, penalización por tocar roca, premio aleatorio ni test de nombres. La inferencia puede ser reconocer una forma, una textura o un tipo de resto; no se exige saber paleontología para avanzar.

## 2. Lo recuperado en GitHub y cómo se conserva
- #323, comentario 5938830463: María había aprobado Fósiles.
- Auditoría Astra del 02/10: KEEP de dirección, mecánica, datos y arte R2v4; 7 estratos, 14 piezas específicas, 59 assets. No reconstruirlo desde cero.
- Atlas, ref d3cdb27457bec677cafd5a1910bd739938fbf96a: preservación R2v4 separada de R2v3 y de expansión.
- #323, comentario 5978231129: escena/indicio/retirada por capas/revelado/contexto; definición visual e interacción antes de montaje.
- Senda, ref ad75e07664538e01bd8245226f3a1179a41d584a: 14 KEEP + 50 unidades curriculares previstas en F01–F05, total planificado 64. Plan no equivale a 64 assets aprobados disponibles.
- Main leído en 46df7dd4d4fe2535ce7bcecd4af0d46a7616bf0a: F02-04 Acanthostega sigue REWORK_REQUIRED en su control. No usarlo como pieza cerrada.

El presente documento concreta interacción, composición e información para el área actual. No revoca KEEP ni presupone que cada detalle nuevo ya existe en el ejecutable. El ZIP no se ha abierto en este bloque: los inventarios y cualidades históricas se atribuyen a sus informes, no a una nueva inspección propia.

Fuente R2v4: FOSILES_PILOTO_R2v4_PARA_SUBIR_3.zip; SHA-256 e321b32d4d2a9d16c4df6a99da7e956543ceba5b0666919e6b8e48adac7a4ff1.

## 3. Entrada y primer minuto
Entrada directa a una superficie de roca creíble, con volumen, grano y matriz coherentes con el arte aprobado. Un indicio parcialmente expuesto debe ser visible sin búsqueda minuciosa; puede haber otro más lejos que invite a recorrer. No enseñar la silueta completa, el nombre, un marcador luminoso ni la solución antes de actuar.

Título: **Fósiles**.
Texto breve: **«Explora la roca y descubre qué conserva.»**
Ayuda inicial junto a la escena: **«Selecciona un indicio para observarlo de cerca.»**

La escena empieza estable. No viaja sola, no vibra y no sigue el ratón. No se empieza por catálogo de especies, mapa mundial, lista de épocas o formulario. «Otros sectores» y «Mis hallazgos» son accesos secundarios.

Primera experiencia propuesta: trilobite de la base KEEP, porque ya figura en el inventario. Antes de elegir el asset concreto se comprobará qué pieza representa y qué rasgos permite ver; no inventar especie, periodo puntual o anatomía que no esté documentada.

Primer recorrido:
1. María ve un fragmento de forma que contrasta con la roca.
2. Hace clic directamente sobre él. Una marca discreta confirma la selección sin desplazar la cámara.
3. Activa «Despejar». Al pasar por la zona elegida, desaparece sólo la cobertura local y permanece la roca descubierta.
4. Aparecen detalles de la pieza. Puede acercarse, cambiar de zona o continuar.
5. Pulsa «Examinar» cuando lo desea. Se señalan rasgos visibles; cuando permiten presentar el hallazgo, aparece la identificación sobre la misma pieza.
6. Puede abrir «Qué nos cuenta», guardar en sus hallazgos o volver al sector.

No se obliga a limpiar el 100 % de la imagen ni a repetir un número fijo de movimientos.

## 4. Gestos y controles: una intención por acción
Dos modos visibles: **Explorar | Despejar**. Selected y foco distintos. La selección inicial activa Explorar; no se cambia de modo sin indicarlo.

| Entrada | Explorar | Despejar |
|---|---|---|
| Clic / toque breve | Selecciona el punto o indicio señalado, sin centrar automáticamente | Retira una porción local de cobertura en ese punto |
| Arrastre con botón/contacto mantenido | Desplaza la vista; no selecciona al soltar | Traza retirada local; no mueve la cámara |
| Movimiento del ratón sin pulsar | Sólo hover | Sólo preview discreto de herramienta; no limpia |
| Zoom + / − | Cambia escala conservando el punto de interés | Igual; no borra progreso |
| Escape | Cancela selección transitoria o cierra panel según contexto | Cancela gesto y vuelve a Explorar |

El cambio de modo resuelve la ambigüedad entre desplazar y limpiar. Tras un arrastre no se dispara el clic de selección. pointercancel no confirma acciones pendientes. Fuera de la escena, el scroll del documento sigue siendo normal.

Las flechas físicas funcionan con la escena enfocada: desplazan vista en Explorar y el punto de trabajo en Despejar. Enter/Espacio actúan en el punto de trabajo; Tab llega a las acciones DOM. No interceptar flechas de toda la página ni impedir usar formularios.

Alternativa sin arrastre: seleccionar un área con toque/clic y «Despejar esta zona», con retirada en pasos visibles. «Sectores» permite cambiar de encuadre por acciones simples. La vía descriptiva lista indicios disponibles por posición y rasgos visibles, nunca por la identidad oculta. La equivalencia mantiene las mismas oportunidades de descubrir; no exige precisión ni velocidad.

Targets ≥44 px; herramienta con radio cómodo en pantalla, sin necesidad de rozar un píxel. El radio expresa dónde se actuará y sólo aparece en Despejar; no es una retícula que gobierna la cámara.

## 5. Qué cambia realmente al despejar
La cobertura se retira por ubicación, no mediante una opacidad global de toda la escena. No vale frotar una esquina y revelar un objeto lejano.

Cada pieza tiene región del fósil, cobertura y zonas de rasgos observables. Todas comparten coordenadas con dibujo, puntero y zoom. El avance depende de la superficie nueva descubierta: frotar repetidamente el mismo punto ya limpio no añade progreso artificial.

Los bordes de lo retirado deben integrar la textura; la pieza no puede verse como un PNG pegado encima de un cuadrado. No deformar ni redibujar el fósil aprobado. Si su losa/matriz está incorporada en el asset, conservarla y adaptar la cobertura a esa geometría.

«Examinar» siempre permite una observación útil del estado actual. Si aún sólo se ve una parte, describe esa parte y permite seguir; no responde «incorrecto». La identidad se ofrece tras una acción de examen cuando los rasgos designados están visibles. No revelar por temporizador o porcentaje genérico de canvas.

La decisión exacta de qué rasgos bastan se define por pieza en los datos editoriales. El sistema no afirma que un fragmento aislado permita diagnosticar científicamente una especie: cuando haga falta, el copy dice «Esta representación corresponde a…» y explica el contexto conocido.

El cepillado es una simplificación de interacción, no una afirmación de que toda roca se retire con una brocha. Una nota breve en ayuda lo aclara; el producto no enseña procedimientos químicos ni operaciones reales de extracción.

## 6. Identificación, información y continuidad
Al examinar, el fósil sigue protagonista en el mismo encuadre. Desktop: panel estrecho al lado. Móvil: bloque bajo la escena; abrir información no tapa la zona recién descubierta ni cambia el zoom.

Primera información:
- nombre del grupo/taxón o tipo de evidencia, al nivel documentado;
- qué se conserva en ESTA pieza (no descripción automática de todo el animal);
- periodo/intervalo contrastado;
- una observación que conecte el detalle visible con una explicación breve.

Profundidad bajo demanda:
- «Mira los detalles»: puntos seleccionables sobre la misma imagen, cada uno con explicación;
- «Qué nos cuenta»: inferencias apoyadas y límites;
- «Cuándo y dónde»: contexto de referencia, fuentes y procedencia; nunca un yacimiento inventado;
- «Cómo se conservó»: preservación documentada;
- «Comparar»: dos hallazgos propios, mismo criterio y escalas explícitas cuando haya datos;
- «Fuentes».

Ampliar significa acercar la imagen real disponible. Un PNG frontal no autoriza giro 3D, cara posterior ni reconstrucción anatómica inventada. Ilustración de organismo vivo sólo si existe aprobada; secundaria, distinguible del fósil.

Cerrar profundidad devuelve al mismo sector, zoom, selección y cobertura. Cambiar idioma conserva esos estados. El foco vuelve a la acción de origen si existe.

## 7. Contexto, banco de observación y museo
Al registrar un hallazgo se conserva conjuntamente: pieza, sector de la experiencia, observaciones y contexto documental. No pedir copiar manualmente datos ya disponibles.

«Observar de cerca» puede abrir una vista de banco sobre el mismo bloque/asset, con zoom y puntos de interés. El registro conserva el contexto de origen. No hacer desaparecer mágicamente la matriz ni representar una extracción real si no existen los estados y datos que la sostienen.

«Mis hallazgos» es una colección opcional para volver a observar y comparar. No es una vitrina de siluetas bloqueadas ni un requisito para seguir explorando. El usuario puede continuar sin añadir nada.

Recomposición no será un puzzle obligatorio. Sólo se habilitará en un caso con fragmentos separados y correspondencia documentada. No cortar un PNG intacto arbitrariamente, inventar piezas faltantes ni presentar un montaje hipotético como espécimen completo. Esto concreta la propuesta histórica de recomposición sin convertir todos los fósiles en el mismo juego.

La conservación del progreso durante la sesión es obligatoria. Persistencia entre sesiones se decidirá al integrar con el contrato vivo de la web; este documento no introduce por su cuenta almacenamiento automático.

## 8. Sectores y ampliación de contenido
La navegación permite explorar épocas/ambientes, pero esos sectores son escenas didácticas curadas. No presentar todos los estratos, periodos y piezas internacionales como una única pared geológica real.

La base R2v4 mantiene su linaje separado. F01–F05 entran mediante registro de expansión, sin reemplazar originales por similitud de nombres. Cada escena acepta piezas con contexto compatible; si se agrupan por comparación, se declara como mesa/colección comparativa, no como coexistencia histórica.

El sistema tiene que admitir TAXON y EVIDENCE_TYPE. Huellas, polen, plantas, microfósiles y ámbar no deben convertirse todos en huesos o especies. La experiencia adapta su acción:
- restos/impresiones en matriz: despejar y examinar;
- huellas: descubrir superficie y seguir rasgos del rastro cuando existan;
- microfósiles: pasar al banco de observación con aumento declarado;
- inclusiones: observar detalles del material aprobado, sin fingir que se excavan del ámbar.

Son extensiones del mismo contrato, no autorización para inventar assets o crear todos estos submodos ahora. El primer prototipo demostrará el recorrido completo con la base disponible.

## 9. Composición, canon y movimiento
NAVY exclusivamente. Fondo general #0B1A2B; panel #15304A; secundaria #1D3D5C; texto #EEF4F8; secundario #C9D5DD; enlaces #9FDCEA; foco/acento #C3B8FF; borde #8494A8; separadores #2A4460; botón principal #DCE8F2 con texto #0B1A2B.

Atkinson Hyperlegible local: cuerpo 16 px / 1.6; introducción 19 px / 1.58. Newsreader local: títulos 600 / 1.2; portada 400, 40–56 px / 1.06. El arte conserva sus colores naturales; NAVY corresponde a la interfaz, no a teñir de azul el fósil.

1440: escena ancha y controles compactos; información inicial no consume media pantalla.
390/320: una columna; título breve, escena, herramientas, información bajo demanda. Una sola composición fluida, sin texto sobre texturas de bajo contraste. Propuesta de área de escena inicial: alrededor de 60–70 % de la altura visible; ajustar mediante uso real sin recortar controles o reducir el canon. No convertir un porcentaje en sustituto de legibilidad.

NORMAL: respuesta local inmediata; transiciones breves y voluntarias.
REDUCED: cambios discretos y sin viajes animados.
NONE: mismo estado final sin interpolación ni partículas.
Sin música, sonido automático, parallax ni polvo ornamental necesario para entender. No es una experiencia de estimulación sensorial.

## 10. Contrato mínimo para el futuro ejecutor
Antes de programar, recuperar el ZIP R2v4 y mapear:
- qué existe y se reutiliza;
- qué comportamiento de esta definición ya cumple;
- qué diferencia necesita adaptación;
- qué asset/dato falta realmente.
No empezar otro motor genérico ni importar el de luz de Peces como excavación.

Registro por pieza:
id estable; lineage; tipo de unidad; taxón/nombre ES/EN; parte representada; asset/hash/dimensiones; región útil; escala conocida o desconocida; zonas observables; información y fuentes por afirmación; contexto geológico de referencia; identificación prudente; estados de disponibilidad factual/visual separados.
Registro por escena:
id; contexto real/curado; piezas incluidas; coordenadas; cobertura inicial; indicios; límites de navegación; retorno.
Estado de usuario:
cámara; modo; selección; cobertura retirada por pieza; rasgos observados; identificación; panel; foco de retorno; idioma; movimiento; hallazgos.
No inventar valores científicos ni geometrías de assets no inspeccionados.

## 11. Cómo sabremos si la experiencia funciona
Primera comprobación de producto, antes de pedir a María otra ronda:
1. Se entiende dónde actuar sin explicación oral.
2. Lo que se retira coincide exactamente con el lugar señalado.
3. Aparece una forma material legible, no una tarjeta o rectángulo de premio.
4. Se puede elegir otro indicio y volver sin perder el trabajo.
5. Examinar explica qué se está viendo; la persona encuentra la información.
6. El segundo hallazgo aporta una observación distinta, no sólo otro nombre tras el mismo relleno.
7. Ratón, toque y teclado conservan intención y consecuencia.
8. Ninguna prueba confunde el nombre del archivo de captura con la identidad activa.

La dificultad de empaquetado y la disponibilidad de expansión se registran separadas de estas preguntas. No esperar 64 piezas para probar el comportamiento; tampoco llamar completo al catálogo por probar una.

## 12. Fuentes y alcance de esta definición
Fuentes internas consultadas:
- COORDINACION_IRIS_GREEN/MEMORIA/FOSSILS_R2V4_INDEPENDENT_LIBRARY_AUDIT_20261002.md, blob 416ce2c223fa58a16d993c968593b50d5be419af.
- COORDINACION_IRIS_GREEN/HANDOFFS/FOSSILS_R2V4_PRESERVATION_R01/HANDOFF.md, ref d3cdb27457bec677cafd5a1910bd739938fbf96a.
- COORDINACION_IRIS_GREEN/MEMORIA/R59_FOSSILS_EXPANSION_CURRICULUM_BATCH_PLAN_20261003.md, ref ad75e07664538e01bd8245226f3a1179a41d584a.
- COORDINACION_IRIS_GREEN/CONTROL/FOSILES_ACANTHOSTEGA_20261005.json, blob e4131a9dc030fcd3bc56c73e68c6f6f403bf03b0.
- #323 comentarios 5938830463, 5977712988 y 5978231129.
- Estudio Nexo de Claude del 05/10: gesto directo, estado/percepción, continuidad y profundidad encontrable.

Contraste científico general, consultado 05/10:
NHM, Fossil preparation: https://www.nhm.ac.uk/discover/fossil-preparation.html
NHM, What is a fossil?: https://www.nhm.ac.uk/discover/what-is-a-fossil.html
AMNH, Preparation: https://research.amnh.org/paleontology/perissodactyl/evidence/preparation
Estas fuentes sustentan la distinción entre hallazgo, matriz y preparación y la diversidad de evidencias. No validan cada taxón ni convierten la interacción simplificada en procedimiento profesional.

Siguiente entrega: convertir esta definición en encargo de prototipo tras la revisión de María, conservando base y arte aprobados. Estado actual: definición propuesta, no HUMAN QA PASS, no orden de implementación.
