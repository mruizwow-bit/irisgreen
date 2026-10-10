# IRIS GREEN · JUEGO COGNITIVO 01

## EL CLARO ESCONDIDO
### Especificación integral de construcción · R08

**Fecha:** 10 de octubre de 2026  
**Responsable del informe:** Lumen (A7) · Media inmersiva y producto audiovisual interactivo  
**Destinatarios:** Nexo, Motor, equipo de diseño e ilustración, Axioma, Lex y responsables de QA  
**Ámbito:** arquitectura, mecánica, arte, accesibilidad, datos, test y entrega del *primer* juego cognitivo  
**Estado:** informe de construcción completo. **R08 aún no implementada; arte final pendiente de revisión.**

> **Objeto de la entrega.** Este informe es una especificación para construir la siguiente versión del juego. **No declara implementada R08** ni aprobadas las imágenes. Se basa en la R07 jugable, el material visual original que la usuaria atribuye a Nexo, los estudios R05-R07 y las correcciones expresas posteriores. La decisión humana sobre el acabado final sigue pendiente.

---

# 0. Lectura rápida: las diez decisiones que no se negocian

1. **Sin edades.** No hay bandas de edad, restricciones por fecha de nacimiento, ni techo predeterminado. Se entra por práctica, por una dificultad elegida o por modo automático; cada modalidad permite ayudas y descansos.
2. **La tarea principal es comparar siluetas.** El color, la estación, la textura, el tamaño y el giro no deben indicar por sí solos cuál es la correcta. Una variante de varias muestras añade comparación y seguimiento de consignas; se etiquetará como variante avanzada, no como el mismo ensayo básico.
3. **Una o dos muestras, con cuotas visibles.** Una muestra admite 1-4 coincidencias. Dos muestras muestran obligatoriamente las cantidades de cada una: por ejemplo, A = 2, B = 1; la persona indica a cuál asigna cada hoja. Nunca se presenta «encuentra tres» sin el reparto.
4. **Automática llega a Maestría.** La R07 actual se detiene en Experta. R08 incorpora la rama multiejemplo y permite comenzar por un nivel alto sin forzar una progresión infantilizada.
5. **Banco real de estímulos.** Cada forma se deriva de un master individual verificable y tiene contorno, rasgos, máscara de comparación, versiones y licencias. Las seis hojas de la lámina mostrada por Nexo son **referencias**, no seis masters ya suministrados.
6. **Estaciones verosímiles.** Primavera/verano/otoño/invierno/mezcla; rojos, amarillos y naranjas cuando sean coherentes con el tipo de hoja. No convertir artificialmente en roja una especie perenne solo para distraer.
7. **La dificultad es perceptiva, no punitiva.** Más similitud estructural, rotación y razonamiento de clasificación; nunca tipografías diminutas, pulsaciones veloces, efectos molestos o fondos que oculten el estímulo.
8. **El arte nace de Iris Green.** NAVY y sistema visual aprobado; objetos y paisaje con relación material y función. No otra ilustración genérica de IA, mascota añadida, sol deslumbrante, marcos decorativos, hojas en esquinas ni texto horneado en el fondo.
9. **Lenguaje claro ISO 24495-1.** Una instrucción principal por estado. Cantidades explícitas, verbos concretos y mensajes que expliquen qué hacer después. ES/EN revisados por separado; no traducción automática sin QA.
10. **Dos aprobaciones distintas.** Pruebas técnicas reproducibles y revisión de usuarios/arte no son lo mismo. Ningún `PASS` de código equivale a `VISUAL_KEEP` o lanzamiento público.

# 1. Fuentes, precedencia y estado actual

## 1.1 Material de entrada revisado

| Fuente | Lo que acredita | Lo que **no** acredita |
|---|---|---|
| `IRIS_GREEN_COG01_EL_CLARO_ESCONDIDO_R07_JUGABLE.zip` | HTML autónomo, JS/CSS, 288 derivados WebP, ajustes, QA y capturas; 12 rondas, niveles, estaciones y selección múltiple | Identidad visual aprobada, validez perceptiva/psicométrica, original individual separado de Nexo |
| `iris_cognitivo_01_r07/index_local.html` | Código ejecutable consultado: `LEVELS`, `AUTO_STEPS`, `generate()`, `choose()`, `confirm()`, `completed()` | Que todas las decisiones del código sean correctas: hay fallos funcionales de producto |
| Captura R07 de «Reto 4 de 12», facilitada por la usuaria | Rechazo explícito de la instrucción ambigua entre dos muestras y tres elecciones | Aprobación del diseño de Maestría |
| Lámina mostrada por la usuaria y atribuida a Nexo, seis hojas | Referencia de nervaduras, textura, contorno y estilo deseado | Seis PNG masters aislados, reutilización final validada, transparencia/ICC verificadas |
| Estudios GitHub Lumen `10` a `15` | Investigación artística, análisis botánico, prueba de tamaños y continuidad del problema | Validación humana de formas nuevas |
| `IRIS_GREEN_INFORME_VISUAL_FORMACION_2026-10-09.pdf` | Canon de identidad, separación original/aprobado/rework, referencias P29/P30/P31/P65 | Autorización de copiar el aspecto de un producto a otro o de reusar cualquier exploración como master |

El informe del 9 de octubre recalca que una imagen bonita no prueba un modelo, que un prototipo técnico no prueba calidad artística y que una referencia **KEEP** no debe regenerarse arbitrariamente. Esas reglas se aplican al juego 01.

## 1.2 Auditoría directa de R07: fallos a corregir

| ID | Prioridad | Hecho observado en código o captura | Corrección obligatoria de R08 |
|---|---|---|---|
| F01 | **P0** | `generate()` en Maestría crea por código 2 opciones de A y 1 de B; `ruleMulti` solo dice «tres hojas» | Cuotas visibles A/B y asignación explícita por persona; validar cada cupo |
| F02 | **P0** | `AUTO_STEPS` termina en Experta, sin rama Maestría | Ampliar progresión automática con objetivos A/B y práctica específica antes de entrar |
| F03 | **P0** | El comparador decide por IDs (`family|variant`), no por comprobación perceptiva | Metadatos de contorno; control de proximidad; QA de personas por nivel y tamaño |
| F04 | **P0** | Las hojas provienen de recortes y deformaciones de una lámina | Reemplazar solo al recibir masters independientes, originales y con procedencia confirmada |
| F05 | **P0** | `colorFor()` puede forzar un tono independiente de la especie/estación, e incluso cambiar a rojo con otoño aunque la especie sea perenne | Catálogo de fenología aprobado; color independiente de solución pero plausible; sin cambio forzoso |
| F06 | **P1** | No hay ensayo de tutorial/práctica separado formalmente de los 12 | Añadir tutorial, práctica no incluida en adaptación y salto manual a mayor dificultad |
| F07 | **P1** | Se calcula «acierto» al completar por fin un reto tras múltiples intentos | Registrar intentos y apoyo separadamente; no llamar acierto independiente al resultado asistido |
| F08 | **P1** | El set aleatorio parte de semilla global, sin contrato estable por ensayo/versiones | Semilla por ronda, IDs de versión, reproducibilidad, fixtures de error |
| F09 | **P1** | Los botones se anuncian solo como «Opción 1» y la mayoría de las hojas son imágenes `alt=""` | Una alternativa no visual operable, correctamente etiquetada y documentada como variante perceptiva diferente |
| F10 | **P1** | Pantalla de configuración, contraste y progreso todavía no tienen ensayo de usuarios documentado | Comprobar primera acción, búsqueda, ayuda, retorno de foco, ES/EN y 320px |
| F11 | **P2** | No existe un catálogo de eventos de ensayo ni persistencia optativa estandarizada | Registro local mínimo, configurable, con eliminación; no sincronizar por defecto |
| F12 | **P2** | Las variaciones geométricas pueden crear hojas visualmente extrañas | Deformaciones dentro de límites validados, con revisión de morfología y comparabilidad |

**Consecuencia:** R07 se mantiene como **base ejecutable**, pero no se publica la R08 renombrando la R07. El desarrollo debe introducir estas correcciones de manera comprobable.

# 2. Producto: qué experiencia estamos construyendo

## 2.1 Objetivo para la persona que juega

«Observa una o dos hojas y encuentra las que tienen la misma forma. Puedes fijarte en sus bordes. No hay límite de tiempo. Si necesitas una pista, pídela.»

El juego no clasifica a las personas por edad, diagnóstico, escolarización ni supuesta inteligencia. Puede utilizarlo quien prefiera retos sencillos y quien quiera retos muy exigentes. La persona conserva control sobre la actividad, ayudas y descanso.

## 2.2 Habilidad y alcance de la afirmación

- **Tarea principal:** búsqueda y discriminación visual de contornos, con atención a rasgos relevantes.
- **Variantes secundarias:** reconocimiento pese a rotación/escala; clasificación simultánea de ejemplos múltiples; selección y revisión de conjuntos.
- **Confundidores:** resolución visual, fatiga ocular, familiaridad botánica, comprensión de la instrucción, movilidad de mano, dispositivo, tamaño visible del dibujo, color, dificultad de mover el foco y recursos solicitados.
- **Afirmación pública permitida en esta fase:** «Juego para practicar la comparación visual de formas». No «mejora la atención», «mide funciones cognitivas» ni «detecta alteraciones» sin validación independiente.

## 2.3 Experiencia narrativa sin decoración automática

La persona recorre **seis lugares de observación** coherentes con el mundo Iris Green/Faro: sendero, huerto, suelo rocoso, borde del agua, arboleda y espacio de observación amplio. Estos nombres describen posibles funciones, no obligan a crear un nuevo mapa o topografía ajena al material aprobado. El lugar identifica una fase y puede mostrar una consecuencia breve tras resolver, **sin modificar el estímulo mientras se compara**.

Ejemplo: se observa una muestra, se identifican las coincidencias, se destaca discretamente un punto del recorrido. No introducir marcadores luminosos, animales-guía ni recompensas que distraigan. En un modo neutral, la persona puede prescindir por completo del escenario narrativo.

## 2.4 Contrato del juego completo

- Sesión sugerida de **12 retos** como en R07; puede abandonarse después de cualquier reto y reanudarse si el guardado local está activado. No hay obligación de completar doce.
- Pausa voluntaria disponible siempre, sin contar tiempo ni alterar resultados.
- Antes de la primera partida: demostración breve y una práctica seleccionable; no obligar a practicar cuando el usuario elige Experta o Maestría y comprende la tarea.
- Una pista no supone error ni penalización. Se registra para diferenciar práctica independiente de práctica apoyada si hay métricas optativas.
- Acciones primarias: **elegir**, **desmarcar**, **comprobar**, **siguiente**. Cualquier resultado se puede volver a intentar.
- Idiomas ES y EN completos, mismo conjunto de formas y cuotas, sin texto integrado en imágenes.
- Sin cuenta, publicidad, puntuaciones comparativas, rachas, vidas, castigos o cronómetro visible.

# 3. Reglas cognitivas exactas

## 3.1 Qué significa que dos hojas «sean iguales»

**Iguales = mismo contorno maestro aprobado**, tras normalizar las transformaciones permitidas por el reto. El aspecto puede cambiar de manera controlada sin alterar ese contorno: tono cromático, textura superficial, rotación y escala. La persona no necesita identificar la especie ni su nombre.

**No equivalen:** misma familia botánica con un contorno distinto, hoja reflejada si el reto solo admite giro, o deformaciones que alteren los rasgos de borde, lóbulos, base o ápice.

Definiciones para el generador:

- `shapeId`: identidad inmutable del contorno aprobado.
- `familyId`: grupo morfológico común, solo para construir distractores (no dicta coincidencia).
- `surfaceId`: estado de textura/tonalidad sin impacto en solución.
- `rotationDegrees`, `scale`: transformaciones permitidas e invariantes para la solución, si la variante lo anuncia.
- `targetModelId`: A o B cuando hay dos muestras.
- `correctQuota`: cantidad que debe encontrarse para cada muestra.
- `match`: verdad derivada de `shapeId` y la muestra, nunca almacenada como una suposición separada.

La igualdad se debe poder explicar en términos de rasgos: «mismo número de lóbulos», «misma forma del borde», «el ancho principal cae en el mismo lugar», sin frases que revelen la solución antes de responder.

## 3.2 Modalidad de una muestra

Se muestra una hoja objetivo y se pide un número concreto **1, 2, 3 o 4**. Puede repetirse el mismo contorno entre las candidatas con colores o giros diferentes. Si hay varias correctas, la persona selecciona exactamente la cuota indicada, revisa y confirma.

| Muestras | Objetivo | Instrucción ES | Candidatas recomendadas |
|---|---|---|---|
| 1 | 1 | «Encuentra una hoja con la misma forma.» | 4-12 |
| 1 | 2 | «Encuentra dos hojas con la misma forma.» | 6-12 |
| 1 | 3 | «Encuentra tres hojas con la misma forma.» | 8-12 |
| 1 | 4 | «Encuentra cuatro hojas con la misma forma.» | 9-12 |

Nunca habrá cuatro coincidencias si se pide una, ni tres si se piden dos. El generador marca el número correcto antes de repartir distractores y después valida el tablero ya mezclado.

## 3.3 Modalidad de dos muestras (corrección central)

Se muestran dos muestras claramente separadas y etiquetadas **A** y **B** con su cantidad propia. La persona indica a qué muestra corresponde **cada hoja seleccionada**. La interacción debe permitir cambiar de A a B y modificar una asignación sin reiniciar la ronda.

| Cuota A | Cuota B | Total | Frase de instrucción obligatoria |
|---:|---:|---:|---|
| 1 | 1 | 2 | «Encuentra una hoja como A y una como B.» |
| 2 | 1 | 3 | «Encuentra dos hojas como A y una como B.» |
| 1 | 2 | 3 | «Encuentra una hoja como A y dos como B.» |
| 2 | 2 | 4 | «Encuentra dos hojas como A y dos como B.» |
| 3 | 1 | 4 | «Encuentra tres hojas como A y una como B.» |
| 1 | 3 | 4 | «Encuentra una hoja como A y tres como B.» |

Las parejas (3,1) y (1,3) son opcionales dentro de Maestría si pasan pruebas perceptivas; las cuatro primeras forman el conjunto obligatorio para esta versión. Las muestras A/B **nunca deben ser la misma forma** ni casi indistinguibles entre sí. Cada carta candidata pertenece como máximo a un modelo correcto.

**Ejemplo comprobable de partida:** A = hoja de roble con 5 lóbulos de contorno X, cuota 2; B = hoja cordada de contorno Y, cuota 1. Entre 12 hojas candidatas hay exactamente dos imágenes de X y una de Y. Las otras nueve son distractores. El orden se baraja sin alterar las cuotas. Un conjunto de tres marcado como A+A+B es correcto si y solo si coincide en **identidad de contorno y asignación**. A+B+B, aunque tenga tres elementos, no sirve.

**Cuando dos hojas correctas son copias de la misma forma:** pueden tener distinto color/rotación, pero deben seguir siendo legibles como la misma silueta. No usar una deformación que las convierta en contornos distintos bajo una cuota A = 2.

## 3.4 Cómo se selecciona en Maestría

Interacción preferida para escritorio y móvil, sin arrastrar:

1. En la franja de muestras, pulsar **«Buscar hojas de A»**. La muestra A se identifica por la letra, un borde y un título accesible; no exclusivamente por un color.
2. Pulsar las hojas que se creen correspondientes a A. Quedan marcadas con «A» y aparece **«A · 1 de 2»** o «A · 2 de 2». Si una hoja no corresponde, pulsarla otra vez para desmarcarla.
3. Pulsar **«Buscar hojas de B»**. Repetir hasta cubrir B; cada hoja queda marcada «B».
4. Si se intenta añadir una cuarta hoja cuando las cuotas suman tres, el sistema explica: **«Ya has elegido tres. Puedes cambiar una.»** No selecciona automáticamente la más reciente ni elimina otra.
5. Al completar las cuotas se activa **«Comprobar mis hojas»**. Antes, aparece desactivado con explicación textual del requisito pendiente (no solo disabled mudo).
6. Confirmación correcta: se resalta discretamente la correspondencia A/B y se ofrece «Siguiente reto».
7. Confirmación con error: **«Hay alguna hoja que no coincide. Puedes cambiarla.»** No se revela la respuesta salvo si la persona solicita una pista más directa.

**Importante:** las cantidades mostradas al lado de las muestras son cuotas objetivo, no información calculada de qué opciones están bien. El contador cuenta asignaciones hechas por la persona; no filtra si son aciertos mientras se juega.

## 3.5 Retos con una sola respuesta y con varias

Con `totalTarget = 1`, elegir una candidata puede ofrecer la respuesta inmediatamente. Con `totalTarget > 1`, la persona prepara un conjunto antes de confirmar. La UI no revela qué opción es correcta mientras las demás siguen abiertas. Así no se puede resolver Maestría probando hojas individuales hasta que el programa confirme una por una.

# 4. Dificultad por capacidad, no por edad

## 4.1 Tres capas independientes

1. **Modo:** Automática, Suave, Media, Alta, Experta, Maestría.
2. **Apariencia:** Estación, modo de movimiento, contraste, tamaño visible de hoja. Ajustes de accesibilidad no deben subir ni bajar una supuesta «capacidad».
3. **Variación del reto:** una muestra / dos; 1-4 coincidencias; proximidad morfológica; rotación; escala; diferencia cromática; número de candidatos; necesidad de asignar A/B.

Nunca ocultar una dificultad porque la persona es menor, mayor o utiliza ayudas.

## 4.2 Tabla de niveles manuales (valores iniciales de ingeniería)

| Nivel | Muestras | Candidatas | Correctas | Comparación | Transformaciones | Requisito de revisión |
|---|---:|---:|---:|---|---|---|
| Suave | 1 | 4 | 1 | familias claramente distintas | giro 0° | pistas libremente disponibles |
| Media | 1 | 6 | 1-2 | familias distintas + una próxima | giros -30° a +30°, escalas 0,95-1,05 | no confundir por tamaño |
| Alta | 1 | 8 | 1-3 | varias de una familia, rasgos de borde visibles | giros hasta 90° y escala 0,85-1,15 | control de similitud de distractores |
| Experta | 1 | 9-12 | 1-4 | contornos cercanos validados, proporción y lóbulos | rotaciones hasta 180°, escala 0,80-1,20 | aprobación perceptiva específica |
| Maestría | 2 | 10-12 | A+B = 2-4 | dos muestras, clasificación y cuotas visibles | rotaciones hasta 180°, escala 0,80-1,20 | equivalencia A/B y clasificación sin pistas de color |

Los números son **objetivos de diseño**, no umbrales clínicos. Si una variante de alto nivel resulta ambigua en una prueba con personas, se retira aunque pase la comparación geométrica. Se permite ampliar el tablero por desplazamiento vertical; no achicar las hojas para meter doce en una pantalla.

## 4.3 Ejes escalables

`axis.quantity`: 4/6/8/9/12.  
`axis.shapeSimilarity`: contrastada → próxima → fina validada.  
`axis.rotation`: 0° / ±30° / ±90° / ±180°.  
`axis.scale`: 1 / 0,95-1,05 / 0,80-1,20.  
`axis.colorIndependence`: tono similar → tono diferente dentro de paleta plausible.  
`axis.correctQuota`: 1 → 2 → 3 → 4.  
`axis.models`: 1 → 2.  
`axis.assignment`: una selección → agrupación A/B.  
`axis.occlusion`: **desactivado para R08** hasta tener test de reconocimiento en 320 px; no inventar ocultación para parecer más difícil.  
`axis.background`: constante en todas las variantes puntuables; no convertir decoración en eje adaptativo sin investigación propia.

**Regla de progresión:** solo cambia **un eje cognitivo** cuando se actualiza dificultad automática. El juego muestra el nuevo reto sin etiqueta de valor o juicio personal. Cambiar de una muestra a dos introduce una nueva regla; debe presentarse como nueva modalidad, con demostración específica, no como un incremento silencioso.

## 4.4 Automática con techo en Maestría

**Objetivo de diseño:** detectar práctica cómoda y proponer mayor reto sin imponerlo. Si la persona inicia directamente Experta o Maestría se respeta esa elección y no se reinicia a Suave.

Propuesta de recorrido automático versionado:

- A0. 4 candidatas, una muestra, una correcta.
- A1. 6 candidatas, una correcta.
- A2. 8 candidatas, contornos diferenciados y giro leve.
- A3. 8 candidatas, más semejanza morfológica.
- A4. 9 candidatas, proximidad estructural validada.
- A5. 9-12 candidatas, hasta dos coincidencias de una muestra.
- A6. 10-12 candidatas, hasta cuatro coincidencias de una muestra.
- A7. Introducción voluntaria a dos modelos; práctica A1+B1.
- A8. Dos muestras A1+B2 o A2+B1.
- A9. Dos muestras A2+B2, o distribuciones A3+B1 / A1+B3 validadas.

La persona puede **rechazar un aumento**, volver a una variante previa o continuar practicando sin límite. En sesiones de doce retos no se exige llegar a A9; la capacidad demostrada y el consentimiento para continuar determinan el avance. Si se usa progreso entre sesiones, se guarda localmente solo bajo opción voluntaria.

## 4.5 Algoritmo de ajuste inicial: comprobable, no clínico

No usar tiempos de respuesta para premiar rapidez ni inferir inteligencia. Se registra si resulta útil para diagnosticar fallos de interfaz en QA, pero no se emplea como condición primaria de subida.

- Ventana deslizante propuesta: últimas **6 rondas puntuables**, excluyendo tutorial y práctica.
- Proponer aumentar **un eje** si ≥5 de 6 se resuelven al primer intento y sin pistas, siempre que hayan aparecido al menos dos configuraciones de estímulos distintas.
- Mantener si 3-4 rondas se resuelven sin ayuda o existe gran variabilidad.
- Proponer ayuda o reducir **un eje** si ≤2 de 6 se resuelven sin ayuda o se repite un error de regla. La persona puede rechazar la reducción.
- Si se percibe confusión sobre la instrucción, no «bajar capacidad»: volver a la demostración de la regla, ofrecer una frase más clara o modo de selección asistida.
- Si se detecta mal rendimiento gráfico o interrupción: invalidar el ensayo para adaptación y preguntar si desea retomarlo.
- Si se cambia idioma, input, tamaño o alto contraste, mantener el reto activo cuando sea seguro; si debe regenerarse, explicar por qué y no contarlo como fallo.

Estas reglas son **hipótesis de producto para calibrar por UX**; no valores normativos ni índice de función cognitiva.

# 5. Estaciones y variación cromática botánica

## 5.1 Cinco opciones visibles

- **Primavera:** verdes tiernos, brotes y hojas jóvenes cuando encajen con la especie.
- **Verano:** verdes desarrollados y otras variaciones reales del follaje.
- **Otoño:** amarillos, ocres, naranjas, rojizos y marrones **según especie y condiciones**.
- **Invierno:** perennes que siguen verdes y muestras caducas secas o recogidas del suelo cuando sea coherente. No asumir hojas frescas en árbol de especie caducifolia en pleno invierno.
- **Mezcla:** caja de observación/colección con muestras de varias estaciones, contextualizada como colección, **no un solo árbol con hojas imposibles**.

El cambio de estación modifica **apariencia**, no reglas de solución ni etiqueta de dificultad. No se vuelve rojo el borde de una hoja incorrecta para señalar error; la respuesta siempre se comunica por texto y contorno/foco.

## 5.2 Atributos que deben existir por especie / familia

`speciesOrMorphotype`, `deciduous|evergreen|unknown`, `phenologyRules[season]`, `allowedColors`, `colorDistribution`, `surfaceTextureIds`, `originalMasterId`, `sourceRef`, `confidenceLevel`. Para formas puramente morfológicas sin especie definida, usar el término **«muestra de hoja»** sin adjudicar una estación biológica específica; la paleta se justifica como muestra artística y no como especie real.

Cualquier reilustración final debe comprobar bordes, nervaduras y silueta sobre las hojas originales, no derivar el aspecto únicamente de un filtro sobre una única muestra verde.

## 5.3 Reglas antitrampa de color

- Correctas y distractores tienen distribuciones cromáticas equilibradas; el color nunca predice la solución.
- La muestra A y su coincidencia **pueden** presentar colores distintos, siempre plausibles en esa estación o en «Mezcla».
- En un reto rojo/verde, también debe existir al menos un distractor del mismo tono aproximado que la correcta; no permitir que la única roja del tablero sea el objetivo.
- No forzar diferentes tonos si destruye la plausibilidad estacional. Es preferible que muestra y coincidencia compartan color y que otro distractor lo comparta también.
- Ninguna instrucción exige identificar «rojo», «verde» u otro color para resolver esta tarea de silueta.
- `season=mezcla` debe escoger una distribución predefinida de colores, no un sorteo independiente que produzca combinaciones arbitrarias sin contexto.

## 5.4 Paleta de referencia, pendiente de canon por especie

| Uso | Tonos orientativos | Precaución |
|---|---|---|
| Verdes de primavera | `#A5C277`, `#8BB363`, `#74AA6B` | coherencia con hoja joven real |
| Verdes de verano | `#3F7C55`, `#4F8A61`, `#658D49` | no hacer idénticas todas las especies |
| Amarillos | `#E0B043`, `#DBB342` | mostrar nervadura legible |
| Naranjas | `#BC703C`, `#CF8D36` | no contaminar borde/punta |
| Rojizos | `#BC443C`, `#BF493F` | solo cuando la familia/especie lo permita |
| Pardos | `#9A7044`, `#88663E` | textura seca bajo control, sin ocultar la silueta |

Estos colores se heredan de los **ensayos y prototipos**; aún no son una «paleta definitiva» que represente de manera precisa cada especie. El registro final debe tener imágenes naturales de referencia y revisión del equipo visual.

---
# 6. Secuencia de pantallas y recorrido exacto

Cada pantalla debe responder sin esfuerzo a estas preguntas: **¿Qué hago ahora? ¿Qué tengo que mirar? ¿Cómo cambio mi respuesta? ¿Qué pasa después?** No mostrar todas las decisiones y ajustes a la vez. La estructura se organiza por estados.

## P00 · Entrada

- Cabecera discreta: Iris Green / Juegos cognitivos; título «El claro escondido».
- Texto visible: **«Mira las hojas. Encuentra las que tienen la misma forma.»**
- Acción principal: **«Empezar»**.
- Acciones secundarias: «Cómo jugar», «Opciones», «Salir».
- Ajuste opcional de dificultad, sin edad. Por defecto Automática si la persona no elige.
- No iniciar audio, animación o cronómetro automáticamente.
- Cuando se pulsa «Empezar», se ofrece una demostración de diez segundos aproximados **sin obligar a esperar**. Botón «Ir al reto» siempre disponible.

## P01 · Demostración

- Una muestra de hoja grande y **tres candidatas** en el tablero.
- Frase: **«Esta es la hoja que buscamos. Tiene este borde.»**
- Resaltar *una vez* el rasgo de borde de la muestra, no generar movimiento de fondo.
- Mostrar la correspondencia correcta en una candidata.
- Botón «Probar yo»; opción «Saltar explicación».
- Nada de esta pantalla entra en el adaptador ni en las métricas de desempeño.

## P02 · Práctica

- Una muestra, **3-4 candidatas**, una correcta.
- «Elige una hoja con la misma forma.»
- Respuesta correcta: «Sí, esta forma coincide. ¿Seguimos?».
- Respuesta no coincidente: «No es la misma forma. Mira el borde y prueba otra.».
- Botones «Repetir práctica» / «Empezar los retos».
- Si se elige directamente Maestría, ofrecer una **demo específica A/B** de dos muestras y cuotas; no obligar a recorrer Suave.

## P03 · Reto de una muestra

**Orden visual y funcional:**

1. Título pequeño «Reto 4 de 12» y etiqueta de fase, sin una enorme barra de controles.
2. Muestra grande, con encabezado «Mira esta hoja».
3. Instrucción, por ejemplo: «Encuentra dos hojas con esta forma.»; debajo, «El color puede ser distinto.» si el reto usa colores variados.
4. Zona de candidatas en rejilla estable: 4/6/8/9/12 botones grandes. El modelo permanece visible en móvil cuando se desplaza.
5. Acciones «Pedir pista» y «Ampliar muestra». Otras opciones bajo «Opciones».
6. Marcador no competitivo: «Elegidas: 1 de 2»; para una sola coincidencia basta tocar la candidata.
7. Botón «Comprobar mis hojas» cuando hay 2-4 respuestas; solo aparece cuando aporta valor.
8. Resultado descriptivo y botón «Siguiente reto». En error la selección se puede corregir sin perder progreso.

**Criterio de visibilidad:** a 320 px, primera pareja de opciones visible sin recorrer tres bloques de ajustes. No ocultar muestras detrás de un panel que desaparece al hacer scroll. No colocar botones de confirmación flotantes tapando tarjetas.

## P04 · Reto de dos muestras

- Dos muestras de tamaño perceptible, **A** y **B**, simultáneamente visibles, cada una con su cuota.
- Encabezado y texto: **«Busca dos hojas como A y una como B.»** La misma idea expresada de forma simétrica para inglés.
- Controles de grupo: «Buscar hojas de A» / «Buscar hojas de B» con `aria-pressed`, nombre visible y estilo de foco distinto del estilo de selección.
- Al seleccionar una carta con A activo, aparece la letra A en la carta y el contador **A: 1 de 2** cambia. Si ya estaba B, el cambio de A a B requiere confirmación solo si puede causar confusión; no debe borrarse silenciosamente.
- B tiene el mismo funcionamiento.
- La persona puede revisar todo el conjunto. **No se revela el acierto individual antes de «Comprobar mis hojas».**
- El botón de comprobación permanece cerca del final de las opciones y también es alcanzable por teclado; no es un elemento flotante encima del tablero.
- Si faltan elecciones: «Te falta una hoja para B»; el botón puede estar desactivado, pero explicar el motivo sin depender del estado visual solamente.

### Wireframe funcional 1440 px · referencia, no diseño artístico

```text
IRIS GREEN · JUEGOS COGNITIVOS           EL CLARO ESCONDIDO       [Pausa] [Opciones]
Reto 7 de 12                          «Busca 2 como A y 1 como B.»

┌───────────────────────┬────────────────────────────────────────────┐
│ MUESTRAS              │ HOJAS PARA COMPARAR                         │
│ ┌────────┬────────┐   │ [01]  [02]  [03]  [04]                      │
│ │ A      │ B      │   │ [05]  [06]  [07]  [08]                      │
│ │ hoja X │ hoja Y │   │ [09]  [10]  [11]  [12]                      │
│ │ 0 de 2 │ 0 de 1 │   │                                            │
│ └────────┴────────┘   │ Cada tarjeta muestra la hoja grande        │
│ [Buscar hojas de A]  │ y, si se elige, una marca A o B.           │
│ [Buscar hojas de B]  │                                            │
│ [Ampliar] [Pista]    │                                            │
├───────────────────────┴────────────────────────────────────────────┤
│ Elegidas para A: 2 de 2 · Para B: 1 de 1   [Comprobar mis hojas] │
└────────────────────────────────────────────────────────────────────┘
```

### Wireframe funcional 390 px · referencia, no diseño artístico

```text
IRIS GREEN                        [Pausa] [Opciones]
El claro escondido · Reto 7 de 12
Busca 2 hojas como A y 1 como B.

┌─────────────────────────────────────┐
│ A · 0 de 2       B · 0 de 1          │ ← banda de muestras fija
│ [hoja X]         [hoja Y]           │   tras el scroll, sin tapar
│ [Buscar A]       [Buscar B]         │   opciones ni mensajes
└─────────────────────────────────────┘
[01  hoja grande]  [02  hoja grande]
[03  hoja grande]  [04  hoja grande]
... desplazamiento natural ...
[11  hoja grande]  [12  hoja grande]

A: 2 de 2 · B: 1 de 1
[Comprobar mis hojas]
[Pedir pista]      [Ampliar muestra]
```

En 320px dos modelos simultáneos deben conservar una anchura legible; si un ensayo no logra contornos suficientemente grandes, **reducir columnas a una en la banda de modelos o emplear una zona de muestra que se expande**, pero sin esconder A/B ni introducir memoria de cuál era la muestra. El cambio de formato se registra como variante de presentación.

## P05 · Pista de tres pasos

Pedir ayuda es voluntario y reversible en cuanto a interfaz, no en cuanto al registro `assisted` si lo hubiera. No desplazar a la persona a una pantalla lejana sin contexto.

- **Pista 1, recordar la regla:** «Mira el borde. ¿Tiene puntas o curvas?».
- **Pista 2, comparación estructural:** «Compara la parte más ancha de la hoja.»; puede ampliar contorno del modelo sin resaltar ninguna candidata.
- **Pista 3, reducir distractores:** atenuar una parte de las incorrectas sin ocultarlas; ofrecer «Mostrar todas» para recuperar la presentación.
- En A/B, ayudas siempre se refieren al grupo activo: «Ahora busca las dos de A» o «Te falta una de B» sin confirmar correspondencias no verificadas.
- Ninguna pista introduce colores como criterio de solución.

## P06 · Resultado y continuación

- Correcta, 1: «Sí, tiene la misma forma.»
- Correcta, A/B: «Has encontrado dos para A y una para B.»
- Aún no coincide: «Alguna forma no coincide. Puedes cambiarla.»
- Error de reparto A/B: «Comprueba cuántas elegiste para A y para B.» sin revelar qué cartas son correctas antes de una ayuda explícita.
- Acciones: «Revisar hojas», «Pedir pista», «Siguiente reto»; **nunca «Has fallado», «Inténtalo más rápido», vidas o puntos negativos**.
- Animación de escena opcional fuera de las cartas durante un máximo editorial recomendado de 300 ms o sin animación según preferencias; no flashes.

## P07 · Pausa / recuperación

- Abre un diálogo con foco, título «Juego en pausa» y texto «Puedes descansar todo lo que necesites.»
- «Continuar» cierra y devuelve foco al elemento desde el que se abrió.
- `Escape` cierra los diálogos **salvo** si se ha decidido que pausa debe requerir acción explícita: esa regla debe ser consistente y estar documentada. Nunca dejar el foco detrás de un modal.
- Si se oculta la pestaña, entra en pausa lógica. Al volver, pregunta «¿Quieres continuar este reto?»; no cuenta como omisión.
- Reinicio debe pedir confirmación si hay elecciones sin comprobar o si se perderá progreso optativo.

## P08 · Fin de sesión

- Después de 12 retos, o cuando la persona elige terminar, mostrar: «Hoy has practicado cómo comparar formas. Puedes volver cuando quieras.»
- «Jugar otra vez», «Elegir otro reto», «Salir».
- Si está activado el historial local, opción «Ver mi recorrido» en el sentido de qué retos se han practicado, no un índice de salud.
- La persona puede terminar voluntariamente tras cualquier reto; no se muestra una racha perdida ni una penalización por dejarlo.

# 7. Diseño de imagen: lo que se debe producir

## 7.1 Principio de origen

**Nexo creó una lámina visual con seis hojas**: lanceolada, ovada, obovada, cordada, palmada lobulada y pinnada lobulada. La lámina es una referencia para estudiar la calidad de contorno, sombreado, textura y nervaduras. No se deben recortar capturas y llamar «master final» a esas partes. Pedir originales separados de sus propios trabajos o usar masters debidamente aceptados y trazables. Si no existen, crear muestras nuevas **según brief del original**, con aprobación del equipo y de la usuaria.

No se autoriza mezclar dibujos de stock, estilos contradictorios o imágenes regeneradas de personajes aprobados. Tampoco utilizar ilustraciones botánicas ajenas como si fueran nuestras.

## 7.2 Master mínimo de hoja

Cada hoja necesita:

- `masterLeafId` estable, nombre identificable y familia morfológica.
- **Una hoja por archivo**. PNG RGBA con fondo transparente real, sRGB ICC, canvas maestro orientativo 1024 o 1400 px que no corte nervadura, ápice ni pecíolo. Tamaño definitivo tras aprobar la línea de producción; no se infiere del PNG de la lámina.
- Versión vectorial del **contorno de comparación** (`outline.svg` o path segmentado con procedencia documentada). Permite derivar máscaras, análisis y feedback sin degradar el master raster.
- Extremos completos: ápice, borde, lóbulos, base, nervaduras y pecíolo cuando corresponda; sin hojas ambiguamente pegadas al fondo.
- Nada de texto, iconos, números, fondo, brillos ni sombras externas irreversibles en el master.
- Máscara alfa, bounding box visible, punto de anclaje, centro normalizado y radio seguro para rotación.
- Variantes de color aprobadas según fenología, no basta recolorar un verde con Hue/Saturation.
- Licencia, titularidad, fuente/referencia de observación, estado aprobación, SHA-256, fecha/versión y transformaciones autorizadas.

## 7.3 Catálogo de estímulos, no biblioteca ornamental

**Familias iniciales de la lámina Nexo:** seis. **Ampliación avanzada propuesta:** diez-doce contornos adicionales basados en estudios botánicos con una ficha de rasgos (ginkgo/abanico, roble, sassafrás en dos formas, tulípero de ápice truncado, acebo espinoso, sauce lanceolado, tilo cordado, castaño serrado, haya elíptica y otros previa revisión). Estas propuestas NO son masters aprobados.

Cada familia debe documentar:

- Característica distintiva (lobulado, serrado, borde entero, proporciones, base, ápice).
- Vistas y rango seguro de giro: qué cambia de percepción y qué debe permanecer.
- Parejas de contornos potencialmente ambiguas; identificadas por un análisis geométrico **y** por revisión humana a 320px.
- Variantes cromáticas aceptables por estación.
- Reglas para usarla como muestra o distractor en cada dificultad.
- Prohibición de usar una pareja imposible de distinguir en pantalla, aunque dos IDs sean diferentes.

## 7.4 Los cinco tipos de imagen necesarios

| Tipo | Cantidad de partida sugerida | Función en juego | Producción / aceptación |
|---|---:|---|---|
| Masters de formas reales | 6 iniciales separados + ampliación validada | comparar siluetas | originales por hoja, uno/archivo, alpha y contorno |
| Estados estacionales | 4 grupos por especie, solo cuando reales | enriquecer apariencia independiente de respuesta | variante aprobada por muestra; nunca «todas verdes» |
| Superficies funcionales | 1 sistema material coherente con Faro, adaptable | sostener visualmente muestras/candidatas | sin botones flotantes ni fondo genérico |
| Referencias de lugar | 3-6 recortes/encuadres anclados en assets Faro | continuidad narrativa fuera de estímulos | reutilizar KEEP donde la licencia y función lo permitan |
| UI/states | foco, elegido A/B, ayuda, error neutro, comprobado | explicar la interacción | CSS/DOM/vector; contraste, animación opcional |

**No hace falta crear seis bosques ilustrados completos antes de probar el juego.** El paisaje debe ser suficiente para identificar el lugar sin competir con la comparación. Si una superficie neutral de observación es más eficaz, se usa; el juego puede ser visualmente rico por la calidad de las hojas mismas.

## 7.5 Dirección de arte concreta

**Cabecera/shell:** NAVY `#0B1A2B`, paneles `#15304A`, texto `#EEF4F8`, secundario `#C9D5DD`, foco `#C3B8FF`, controles de borde `#8494A8`. Tipografía de lectura Atkinson Hyperlegible cuando el recurso local esté disponible, con fallback real comprobado. La tipografía editorial de otras series de Iris Green no se impone a la interacción sin decisión explícita de producto.

**Objeto/hoja:** anatomía creíble, nervaduras legibles, diferencias por contorno, textura suave integrada, sombras de contacto solo en superficies de escena y nunca tanto que dificulten la comparación. La forma de la tarjeta no debe parecer siempre el mismo rectángulo blanco con un icono verde. Fondo de respuesta neutro, con soporte material realista si mejora legibilidad, no distrae y es accesible.

**Composición:** una jerarquía: instrucción breve → muestra → candidatas → comprobar/seguir. En escritorio la muestra puede estar en la columna lateral; en 320-390 px se convierte en banda visible. No reservar el primer viewport entero a menús y opciones.

**Riqueza funcional:** diversidad morfológica real, textura y relaciones materiales; no añadir decoración porque la pantalla «se ve vacía». Un elemento debe ayudar a orientar, observar o interactuar.

**No permitido en producción:** mascotas/rostros no canónicos, posters IA, cielos brillantes con reflejos, rayos solares que parpadean, hojas de relleno, iconos con forma de estrella usados como estímulos, fondos repetidos que no pertenecen al lugar ni marcas de terceros.

## 7.6 Verificación de arte por etapas

1. **Selección del master:** confirmar original y titularidad. No partir de screenshot.
2. **Preflight técnico:** alfa 0-255, ICC sRGB, 1 elemento por canvas, no bordes cortados, perímetro cerrado y hash.
3. **Preflight morfológico:** misma estructura aprobada entre variantes cromáticas; no alterar forma al recolorear.
4. **Lámina de comparación:** modelo vs candidatas a **tamaño realmente renderizado** en 320, 390 y 1440 px.
5. **Lámina de estaciones:** seis hojas × muestras plausibles de primavera, verano, otoño e invierno; registrar excepciones perennes/caducas.
6. **Pruebas con personas:** facilidad para reconocer diferencias significativas y detectar distractores ambiguos; recoger razones cualitativas.
7. **Aprobación humana:** KEEP/REWORK por asset, no aprobar la biblioteca completa porque dos hojas se vean bien.
8. **Integración quirúrgica:** reemplazar paths de sprites, no rehacer lógica o controles del juego.

# 8. Arquitectura técnica del juego

## 8.1 Subsistemas separados

```text
CATÁLOGO DE HOJAS Y FENOLOGÍA (Nexo / Visual)
      ├─ masters y derivados aprobados
      ├─ máscaras / similitud / exclusiones
      └─ versiones y licencia
               │
CONFIGURACIÓN DEL JUEGO (Nexo) ──> GENERADOR + ORÁCULO
               │                        │
               │                   ronda inmutable
               │                        │
        CONTROLADOR DE SESIÓN ────> MOTOR / RENDER
               │                        │
               ├─ estados             DOM/SVG/candidatas
               ├─ adaptación          teclado/táctil/ratón
               ├─ ayudas             accesibilidad y pausa
               └─ privacidad              │
               └────────────── EVENTOS LOCALES
                                   │
                          RESUMEN NO CLÍNICO
```

**Motor:** pinta los objetos, implementa inputs, foco, A/B, ayuda, ampliación, pausas y variantes visuales. **Nexo:** conserva definición versionada, generador, solución, cuotas, dificultad y continuidad de sesión; la división exacta debe validarse con el código existente antes de modificarlo. **Lumen:** guía el lenguaje visual/producción y su QA. **Axioma:** accesibilidad y calidad verificable. **Lex:** estado de derechos, permisos y bases de tratamiento. No afirmar que sus APIs ya están integradas.

## 8.2 Estructura de proyecto recomendada

```text
/es/juegos/cognitivos/el-claro-escondido/
  index.html
  css/game.css
  js/main.mjs
  js/state-machine.mjs
  js/game-definition.mjs
  js/trial-generator.mjs
  js/solution-validator.mjs
  js/difficulty-adapter.mjs
  js/ui-renderer.mjs
  js/accessibility.mjs
  js/session-store.mjs
  js/i18n.mjs
  data/game.definition.json
  data/leaf-catalog.json
  data/seasonal-rules.json
  data/approved-pairs.json
  locales/es.json
  locales/en.json
  assets/master-manifest.json
  assets/leaves/<master-id>/<variant-id>.webp
  assets/ui/...
  tests/unit/
  tests/generative/
  tests/e2e/
  tests/perceptual-fixtures/
  QA/SCREENSHOTS/
  QA/QA_REPORT.json
```

La URL es **propuesta** y debe comprobarse contra el routing real y el canon web del proyecto. R07 puede conservarse como versión de referencia; no publicar automáticamente su HTML independiente en producción. En un modo verdaderamente offline-first, empaquetar todas las dependencias localmente y versionar cachés.

## 8.3 Contrato de definición (`GameDefinition`)

```typescript
type Difficulty = 'auto'|'suave'|'media'|'alta'|'experta'|'maestria';
type Season = 'primavera'|'verano'|'otono'|'invierno'|'mezcla';
type Motion = 'normal'|'reduced'|'none';
type Variant = 'visual'|'high_contrast'|'described_shapes';

interface GameDefinition {
  id: 'iris.cog01.hidden_clearing';
  gameVersion: string;
  stimulusSetVersion: string;
  scoringVersion: string;
  localeVersions: {es: string; en: string};
  ageRestriction: null;                 // jamás filtrar dificultad por edad
  goal: 'visual_outline_matching';
  publicClaims: ['visual_comparison_practice'];
  session: {defaultRounds: 12; canQuitAnytime: true; practiceScored: false};
  supportedInputs: ['mouse','touch','keyboard'];
  defaultSettings: {difficulty: Difficulty; season: Season; motion: Motion};
  renderer: 'dom_and_svg';
  audioRequired: false;
  assessmentEligible: false;
}
```

## 8.4 Contrato de estímulo visual

```typescript
interface LeafMaster {
  id: string;                       // forma inmutable
  familyId: string;                 // agrupación morfológica
  version: string;
  approvedState: 'approved'|'study'|'rework';
  shapeMaskUri: string;
  masterPngUri: string;
  variants: Array<{
    id: string;                       // apariencia, NO identidad
    imageUri: string;
    season: Season;
    hueClass: 'green'|'yellow'|'orange'|'red'|'brown';
    alphaReady: boolean;
  }>;
  safeRotations: number[];
  safeScaleRange: [number,number];
  forbiddenNeighbourIds: string[];   // parejas ambiguas en ese nivel/tamaño
  sourceAndRights: {provenance: string; licenseStatus: string; sha256: string};
}
```

## 8.5 Contrato de reto inmutable

```typescript
type ModelId = 'A'|'B';
interface ModelQuota {
  id: ModelId;
  shapeId: string;
  needed: 1|2|3|4;
  referenceVisualVariantId: string;
}
interface Candidate {
  id: string;                        // único en ronda
  shapeId: string;
  appearanceId: string;
  rotationDeg: number;
  scale: number;
  allowedGroup: ModelId|null;       // verdad privada, nunca enviada al DOM
}
interface Trial {
  id: string;
  seed: number;
  gameVersion: string;
  stimulusSetVersion: string;
  difficultySnapshot: Record<string,number|string>;
  mode: Difficulty;
  season: Season;
  instructionKey: string;
  models: ModelQuota[];
  candidates: Candidate[];
  variant: Variant;
}

interface PlayerAssignment {candidateId: string; assignedTo: ModelId;}
interface TrialEvaluation {
  correct: boolean;
  missingByModel: Record<ModelId,number>;
  incorrectAssignments: Array<{candidateId:string; assignedTo:ModelId}>;
  assisted: boolean;
  attemptCount: number;
}
```

**Separación crítica:** el cliente de interfaz muestra `shapeId` solo si no revela visualmente respuestas; `allowedGroup` pertenece al módulo de solución. Deben existir interfaces que no expongan `match=true` en atributos HTML o nombres descriptivos que permitan «ganar» leyendo el código, especialmente si en el futuro se pretende evaluación estandarizada. La versión libre no promete seguridad antitrampas ni valor psicométrico.

---
# 9. Generador de rondas: contrato paso a paso

## 9.1 Entradas obligatorias

El generador recibe: `seed`, `gameVersion`, `stimulusSetVersion`, dificultad concreta/automática, `season`, modalidad `one|dual`, `quota[A]`, `quota[B]` si aplica, número de candidatas, transformaciones permitidas, perfil de accesibilidad para el **tamaño renderizado**, colección aprobada de masters y reglas de exclusión. Si falta una entrada crítica, genera un error controlado y utiliza un **fixture válido preconstruido**, nunca inventa una hoja ambigua.

## 9.2 Diez pasos para producir un reto válido

1. **Validar configuración.** Una muestra de 1-4 respuestas o dos muestras con cuotas de la matriz aprobada. Total correcto ≤ número de candidatas - distractores mínimos.
2. **Elegir muestras.** Semilla reproducible y masters `approved` con silueta válida en esta modalidad y a este tamaño. En dos muestras, elegir contornos que no confundan A/B.
3. **Reservar coincidencias exactas.** Crear la cuota completa para cada muestra **antes** de crear distractores: A2+B1 da dos instancias A y una B.
4. **Variar apariencia sin cambiar contorno.** Diferentes tonos plausibles, tamaño y giro seguro; cada candidata tiene ID de instancia único, aunque comparta `shapeId` con otra.
5. **Crear distractores.** Solo formas no equivalentes a A ni B, con semejanza acorde a dificultad; si son muy próximas, requieren aprobación perceptiva específica.
6. **Equilibrar colores.** Evitar atajos: tono de la muestra no debe ser un predictor de pertenencia. Respetar fenología.
7. **Barajar con PRNG determinista.** El orden debe poder reconstruirse a partir de semilla + versiones, sin usar `Math.random()` externo al generador.
8. **Ejecutar oráculo de verdad.** Contar coincidencias reales por `shapeId` **por muestra**; verificar exactamente los cupos A/B, ninguna candidata doble, ninguna muestra sin coincidencia y ninguna pareja prohibida.
9. **Verificar presentación.** Contorno renderizable ≥ tamaño aprobado, zona activa suficientemente grande, 320/390/1440 sin clipping ni overlay, imagen realmente cargada. Una carga fallida de imagen **invalida** el ensayo.
10. **Publicar ronda como objeto inmutable.** Render recibe datos de presentación; solución se mantiene en el validador. Registrar seed y hashes; nunca modificar el reto al reaccionar a un click.

## 9.3 Pseudocódigo de generador R08

```typescript
function createTrial(cfg: TrialConfig, bank: ApprovedLeafBank): Trial {
  assertSupportedQuotas(cfg.modelsCount, cfg.quotas);
  assert(cfg.candidates >= sum(cfg.quotas) + cfg.minimumDistractors);
  const rng = createSeededRng(cfg.seed);

  // Solo masters aprobados, adecuados al tamaño y transformación.
  const available = bank.filter(m => m.approvedState === 'approved'
    && m.safeFor[cfg.screenVariant]
    && m.safeFor[cfg.mode]);
  const modelShapes = chooseModelShapes(available, cfg.modelsCount, rng, {
    rejectAmbiguousPair: true,
    minStructuralSeparation: cfg.modelPairSeparation
  });
  const models = modelShapes.map((s, i) => ({
    id: i === 0 ? 'A' : 'B', shapeId: s.id,
    needed: cfg.quotas[i], referenceVisualVariantId: chooseSurface(s, cfg, rng)
  }));

  const candidates: Candidate[] = [];
  for (const model of models) {
    for (let k = 0; k < model.needed; k++) {
      candidates.push(makeCandidate(model.shapeId, model.id, cfg, rng));
    }
  }
  while (candidates.length < cfg.candidates) {
    const item = chooseDistractor(available, models, cfg, rng);
    if (isEquivalent(item.shapeId, any(models.shapeId))) continue;
    if (!passesPerceptualGate(item, candidates, cfg)) continue;
    if (violatesSpeciesSeason(item, cfg.season)) continue;
    candidates.push(makeCandidate(item.shapeId, null, cfg, rng));
  }
  const shuffled = seededShuffle(candidates, rng);
  const trial = Object.freeze({
    id: stableTrialId(cfg, modelShapes, shuffled), seed: cfg.seed,
    gameVersion: cfg.gameVersion,
    stimulusSetVersion: cfg.stimulusSetVersion,
    difficultySnapshot: cfg.axes,
    mode: cfg.mode, season: cfg.season,
    instructionKey: instructionKeyFor(models),
    models, candidates: shuffled, variant: cfg.variant
  });
  assertTrialInvariants(trial, bank, cfg);
  return trial;
}
```

Las funciones `chooseModelShapes` y `chooseDistractor` no pueden basarse solo en «familia distinta» o «número de lóbulos»: deben consultar máscaras, pares revisados, rasgos y exclusiones de dificultad. La programación puede usar una matriz de distancias precalculada y versionada. **Un valor de IoU alto o bajo no sustituye la revisión perceptiva**: sirve para descartar combinaciones obviamente malas.

## 9.4 Tratamiento de duplicados correctos

En retos A2 o A3, dos candidatas pueden mostrar **la misma silueta** con tonalidad, giro o tamaño diferentes. Deben tener IDs de carta diferentes (`card-05`, `card-09`), pero `shapeId` idéntico. Sus apariencias tienen una diferencia visual superficial suficiente para crear un reto interesante sin convertirse en una copia pixel a pixel evidente.

El validador cuenta instancias; no confunde «hay dos cartas» con «hay dos formas distintas». Tampoco acepta como correctas variantes deformadas hasta cambiar el contorno. Si una variación sustituye un lóbulo o una punta, es **otro shapeId** y se convierte en distractor posible.

## 9.5 Fallos que el generador debe impedir

- Dos modelos A/B iguales bajo rotación.
- A tiene dos coincidencias, pero una está etiquetada como B por un bug.
- Una opción cuenta como A y B al mismo tiempo.
- Correcta duplicada por error cuando cuota = 1.
- Falta una imagen de hoja, y su tarjeta queda vacía.
- Todas las candidatas rojas son correctas; todas las verdes falsas.
- Una hoja perenne se muestra roja sin fundamento en «otoño».
- Una silueta reflejada se marca igual pese a que solo se autorizaba rotación.
- El usuario cambia estación y el programa cuenta la regeneración como fallo.
- El modo automático presenta Maestría sin introducir la consigna nueva.
- Una ronda con 12 candidatas queda inoperable a 320 px o pierde el modelo al desplazarse.

# 10. Validador de respuestas y feedback

## 10.1 Evaluación inequívoca

El usuario entrega **asignaciones**, no una lista desnuda de tres índices. La comprobación exige que cada cuota esté cubierta y que cada `candidateId` asignado a A/B tenga el mismo `shapeId` que su modelo.

```typescript
function evaluateTrial(trial: Trial, answers: PlayerAssignment[]): TrialEvaluation {
  const expected = new Map(trial.models.map(m => [m.id, m]));
  const byId = new Map(trial.candidates.map(c => [c.id, c]));
  const seen = new Set<string>();
  const count = {A: 0, B: 0};
  const wrong: TrialEvaluation['incorrectAssignments'] = [];

  for (const answer of answers) {
    if (!byId.has(answer.candidateId)) throw new InvalidAnswer('CARTA_DESCONOCIDA');
    if (!expected.has(answer.assignedTo)) throw new InvalidAnswer('MUESTRA_DESCONOCIDA');
    if (seen.has(answer.candidateId)) throw new InvalidAnswer('CARTA_DUPLICADA');
    seen.add(answer.candidateId);
    count[answer.assignedTo]++;
    const candidate = byId.get(answer.candidateId)!;
    const model = expected.get(answer.assignedTo)!;
    if (candidate.shapeId !== model.shapeId) {
      wrong.push({candidateId: candidate.id, assignedTo: answer.assignedTo});
    }
  }

  const missing = Object.fromEntries(trial.models.map(m =>
    [m.id, Math.max(0, m.needed - count[m.id])])) as Record<ModelId,number>;
  const overfilled = trial.models.some(m => count[m.id] > m.needed);
  const correct = !overfilled && wrong.length === 0
    && trial.models.every(m => count[m.id] === m.needed)
    && answers.length === trial.models.reduce((n,m)=>n+m.needed,0);
  return {correct, missingByModel: missing, incorrectAssignments: wrong,
          assisted: currentHelpLevel() > 0, attemptCount: currentAttempts()};
}
```

## 10.2 Casos de aceptación obligatoria

| Reto | Asignación elegida | Resultado | Motivo |
|---|---|---|---|
| Una muestra, cuota 1 | Una carta del mismo `shapeId` | Correcto | Misma forma |
| Una muestra, cuota 3 | Dos correctas y una distractora | Incorrecto, recuperable | Falta una correcta |
| A2+B1 | A1, A2 y B1 bien asignadas | Correcto | Ambas cuotas satisfechas |
| A2+B1 | A1 y B1 correctas; A3 distractora | Incorrecto | Error de forma en A |
| A2+B1 | A1, A2 y otra A bajo B | Incorrecto | Error de clasificación a B |
| A2+B1 | Dos de A y ninguna de B | Pendiente, no evaluar | Falta B |
| A1+B2 | Una B correcta asignada a A | Incorrecto | La asignación explícita importa |
| A2+B2 | Cuatro correctas de la familia A | Incorrecto | Falta la cuota B |
| 1 o 2 muestras | Misma carta asignada a dos grupos | Entrada no permitida | Duplicado del candidato |
| 1 o 2 muestras | Coincidencia de forma con otro color | Correcto | El color no es clave |

Una respuesta incorrecta **no completa** el reto ni revela por defecto todas las respuestas. La persona conserva la selección y puede editarla. Las tarjetas ya marcadas no deben saltar, desaparecer ni cambiar de orden después de comprobar.

## 10.3 Mensajes tras un error

- No dar una puntuación numérica ni señalar supuestas capacidades personales.
- Si falta cuota: «Te falta una hoja para B».
- Si se ha elegido una carta de otra forma: «Una de las hojas no tiene la misma forma. Puedes revisarla.»
- Si el usuario pide mayor ayuda: marcar una subregión de contorno de la **muestra**, o reducir distractores; solo después de solicitud expresa se puede señalar una candidata.
- Aceptar varios intentos. No quitar vidas; un ensayo con pistas se etiqueta como asistido para análisis **privado y no clínico**, si el usuario tiene activado guardado.

## 10.4 Diferenciar error de regla y dificultad real

Un error causado por no entender «A: dos; B: una» no demuestra baja capacidad de búsqueda visual. Para separar ambas cosas:

- Añadir práctica específica de asociación A/B con dos tarjetas claras.
- Mantener visible la cuota junto a cada muestra mientras se selecciona.
- Tras dos problemas de cupo, ofrecer «Ver cómo repartir las hojas» (tutorial) antes de reducir semejanza morfológica.
- En QA, observar si la persona sabía cuál hoja correspondía pero la asignó al grupo equivocado por un control mal diseñado.

# 11. Máquina de estados y eventos

## 11.1 Diagrama de flujo

```text
BOOT → LOADING → INTRO → DEMO? → PRACTICE? → PREPARE_TRIAL
                                              │
                                              ↓
                                          TRIAL_ACTIVE
                                   ┌──────────┼───────────┐
                                   ↓          ↓           ↓
                                SELECT      HINT        PAUSE
                                   │          │           │
                                   └─────── CHECK ←── RESUME
                                              │
                                    ┌─────────┴──────────┐
                                    ↓                    ↓
                               REVIEW_RETRY         TRIAL_COMPLETE
                                    │                    │
                                    └── TRIAL_ACTIVE     ↓
                                                   ADAPT / REST?
                                                        │
                                            ┌───────────┴──────────┐
                                            ↓                      ↓
                                     PREPARE_TRIAL               END

En cualquier estado operativo: USER_EXIT → CONFIRM_EXIT → CLEANUP / SAVE_OPT_IN
En fallo técnico: ERROR → RETRY_ASSET / SAFE_FALLBACK → RECOVER → TRIAL_ACTIVE
```

## 11.2 Estados precisos y transiciones

| Estado | Entra cuando | Acciones | Salida autorizada |
|---|---|---|---|
| `LOADING` | Carga catálogo + assets | indicador textual de carga, no animación obligatoria | `INTRO` o `ERROR` |
| `INTRO` | Juego disponible | empezar, opciones, salir | `DEMO`, `PRACTICE`, `PREPARE_TRIAL` |
| `DEMO` | Usuario solicita cómo jugar o se recomienda | explicar con respuesta mostrada | `PRACTICE` / `PREPARE_TRIAL` |
| `PRACTICE` | Ensayo no puntuable | elegir, ayuda, repetir | `PREPARE_TRIAL` |
| `TRIAL_ACTIVE` | Ensayo válido renderizado | elegir/desmarcar, asignar A/B, pista, pausa | `REVIEW_RETRY`, `TRIAL_COMPLETE`, `PAUSED` |
| `REVIEW_RETRY` | Comprobación no correcta | mantener selecciones, explicar revisión | `TRIAL_ACTIVE` |
| `TRIAL_COMPLETE` | Respuesta validada | siguiente, descanso, terminar | `PREPARE_TRIAL`, `REST`, `END` |
| `PAUSED` | Pausa, tab oculta, llamada o configuración bloqueante | continuar o salir | estado anterior sin doble conteo |
| `REST` | Se recomienda pausa breve entre bloques | continuar cuando desee | `PREPARE_TRIAL`, `END` |
| `ERROR` | Imagen no carga, estado inválido, versión incompatible | reintentar, mostrar alternativa, salir sin penalización | `RECOVER`, `END` |
| `END` | Final o salida voluntaria | repetir, volver al catálogo, borrar datos si existen | `INTRO` o salida |

**Invariantes:** una acción por toque; el mismo `actionId` no se procesa dos veces; una pausa detiene/neutraliza latencia; un modal intercepta el foco; una opción no puede mutar después de `TRIAL_COMPLETE`.

## 11.3 Modelo de eventos mínimo y privacidad

Evento interno sin transmisión por defecto:

```json
{
  "schema": "iris.cog01.events.v1",
  "sessionId": "local-random-id",
  "trialId": "t-0007",
  "eventId": "local-unique-id",
  "seq": 38,
  "type": "trial_checked",
  "gameVersion": "0.8.0-design-target",
  "stimulusSetVersion": "approved-assets-pending",
  "scoringVersion": "r08-draft",
  "seed": 87654321,
  "locale": "es",
  "inputMode": "touch",
  "motionMode": "none",
  "season": "otono",
  "difficulty": "maestria",
  "variant": "visual",
  "metrics": {
    "modelCount": 2,
    "quotaA": 2,
    "quotaB": 1,
    "attemptCount": 1,
    "hintLevel": 0,
    "assisted": false,
    "correct": true
  }
}
```

La fecha exacta, identidad personal, centro educativo y diagnóstico **no son necesarios** para jugar. Por defecto los eventos viven en memoria durante la sesión; el guardado local voluntario conserva solo información mínima para retomar y debe proporcionar «Borrar mis datos». Eliminar datos requiere borrar IndexedDB/localStorage/cache asociados, explicar qué queda y documentar retención. No activar sincronización automática ni analítica de terceros. Cualquier piloto con datos infantiles reales requiere revisión de propósito, transparencia y base jurídica con Lex.

## 11.4 Política de continuidad local

- `sessionId` aleatorio local, no identificador estable entre instalaciones sin aceptación.
- Estado guardado: versión, reto, semilla, opciones/shapeIds, quotas, selecciones A/B, preferencias, secuencia. Debe recuperarse **exactamente el mismo tablero**, no uno nuevo con igual número de cartas.
- Reto interrumpido: reanudar o reiniciar sin penalización, marcando `interrupted=true` solo en análisis interno si se guarda.
- Sesiones guardadas bajo consentimiento/preferencia específica, revocable; opción de no guardar siempre disponible.
- Si cambia `stimulusSetVersion`, migrar si es posible y seguro; en caso contrario explicar que debe iniciarse un reto nuevo, conservando el historial optativo separado.

# 12. Accesibilidad desde el diseño

## 12.1 Interacción

- **Ratón, táctil y teclado con paridad funcional.** Todas las hojas candidatas son controles nativos o equivalentes semánticos correctamente etiquetados.
- **Tamaño de objetivo ≥44×44 CSS px** como contrato propio Iris Green; hojas visibles preferiblemente mayores. El mínimo WCAG 2.2 AA de target 24×24 no sustituye este criterio más fuerte.
- Selección multi `aria-pressed`; muestra activa A/B identificada también por letra, forma de borde y texto, nunca solo color.
- Navegación por tabulador predecible; flechas opcionales dentro de la cuadrícula con roving tabindex solo si está probado; Enter y Espacio activan.
- No obligar a drag, doble clic ni multitáctil. Cuando se amplía una muestra, la imagen sigue siendo una imagen con `alt` pertinente al estado, no un texto que revele automáticamente la solución.
- El foco al cerrar ayuda/zoom vuelve a su control de origen; al terminar el reto se sitúa de forma razonable en el mensaje de resultado o en «Siguiente reto», sin sorprender.

## 12.2 Accesibilidad cognitiva / ISO 24495-1

- **La persona encuentra** lo necesario en el lugar en que lo busca: muestra antes de cartas, cantidad junto a muestra, «Comprobar» tras selección.
- **Comprende** la instrucción: verbo al inicio, sujeto directo, sin dobles negaciones, sin metáforas ni referencias vagas.
- **Puede utilizar** esa información: cada mensaje indica la acción siguiente, y los términos no cambian entre reto/pista/ayuda. Traducción ES/EN revisada.
- Se puede pedir otra explicación, ampliar o detener la actividad sin perder la posibilidad de jugar.

ISO 24495-1:2023 es una norma de principios de lenguaje claro aplicada aquí a instrucciones y textos de interfaz. **No certifica por sí sola accesibilidad digital ni eficacia cognitiva**. La interfaz debe pasar también WCAG 2.2 y revisión con usuarios.

## 12.3 Sensibilidad perceptiva y motora

- Movimiento NORMAL / REDUCED / NONE, con NONE equivalente funcional. Los estímulos de silueta no se mueven mientras se eligen; un «giro» es una orientación estática, no una animación obligatoria.
- Sonido desactivado por defecto; silencio nunca afecta la solución. Evitar flashes, grandes destellos y transiciones de alta luminancia.
- Contraste alto y forced-colors: bordes suficientes, marcas A/B textuales, estados seleccionado/confirmado/foco diferenciados; no depender de textura de la hoja para percibir un botón.
- Zoom: aumenta el estímulo visible y conserva el modelo; no cambia la verdad de la ronda. Registrar variantes de presentación si se interpretan resultados.
- Un control con tamaño físico de 44px **no significa** que una hoja de 14px dentro sea legible. Debe verificarse el dibujo completo a su tamaño efectivo.
- Menor movilidad: botones grandes, no exigir arrastre, se pueden deshacer marcas y repetir acciones sin reloj.

## 12.4 Alternativas de baja visión

Si una persona no puede distinguir contornos visuales, ofrecer variante **descriptiva o táctil/sonora si existe tecnología adecuada** que permita participar, pero indicar que ya no es la misma tarea perceptiva. No comparar el progreso de esa modalidad con «discriminación visual estándar», ni presentarla como equivalente clínico. En lectura de pantalla, anunciar por ejemplo «Opción cinco, asignada a A» y describir rasgos solo si el modo descriptivo está activado; no usar textos alternativos que revelen toda la solución sin declarar el cambio de variante.

# 13. Lenguaje claro: diccionario de pantalla ES/EN

Evitar información duplicada: si el encabezado dice «A: 2; B: 1», la frase explica el reparto una vez y el resto del espacio se dedica a comparar. Usar números junto a las cantidades cuando ayudan, siempre con su lectura verbal equivalente.

| Estado | Texto exacto ES | Texto recomendado EN |
|---|---|---|
| Entrada | «Mira las hojas. Encuentra las que tienen la misma forma.» | “Look at the leaves. Find the ones with the same shape.” |
| Botón de inicio | «Empezar» | “Start” |
| Demostración | «Mira esta hoja. Fíjate en el borde.» | “Look at this leaf. Look at its outline.” |
| Práctica | «Elige una hoja con la misma forma.» | “Choose a leaf with the same shape.” |
| Una muestra / cuota 2 | «Encuentra dos hojas con esta forma.» | “Find two leaves with this shape.” |
| Una muestra / cuota 4 | «Encuentra cuatro hojas con esta forma.» | “Find four leaves with this shape.” |
| A1+B1 | «Encuentra una hoja como A y una como B.» | “Find one leaf like A and one like B.” |
| A2+B1 | «Encuentra dos hojas como A y una como B.» | “Find two leaves like A and one like B.” |
| A1+B2 | «Encuentra una hoja como A y dos como B.» | “Find one leaf like A and two like B.” |
| A2+B2 | «Encuentra dos hojas como A y dos como B.» | “Find two leaves like A and two like B.” |
| Seleccionar A | «Buscar hojas de A» | “Choose leaves for A” |
| Seleccionar B | «Buscar hojas de B» | “Choose leaves for B” |
| Contador A | «A: 1 de 2» | “A: 1 of 2” |
| Contador B | «B: 0 de 1» | “B: 0 of 1” |
| Falta B | «Te falta una hoja para B.» | “You still need one leaf for B.” |
| Cuota llena | «Ya has elegido tres. Puedes cambiar una.» | “You have chosen three. You can change one.” |
| Confirmar | «Comprobar mis hojas» | “Check my leaves” |
| Coincidencia | «Sí, tiene la misma forma.» | “Yes. It has the same shape.” |
| Hay error | «Alguna hoja no coincide. Puedes cambiarla.» | “One or more leaves do not match. You can change them.” |
| Pista 1 | «Mira el borde de la hoja.» | “Look at the leaf’s edge.” |
| Pista 2 | «Fíjate en la parte más ancha.» | “Look at the widest part.” |
| Pista 3 | «Voy a quitar algunas opciones que no coinciden.» | “I’ll remove some options that do not match.” |
| Ampliar | «Ampliar muestra» | “Enlarge model” |
| Pausa | «Juego en pausa. Puedes descansar.» | “Game paused. You can rest.” |
| Continuar | «Continuar» | “Continue” |
| Terminar | «Terminar por hoy» | “Finish for now” |
| Cierre | «Has practicado cómo comparar formas.» | “You practised comparing shapes.” |
| Contraste | «Contraste alto» | “High contrast” |
| Dificultad manual | «Elegir dificultad» | “Choose difficulty” |
| Opciones | «Opciones» | “Options” |
| Privacidad | «No se envían tus respuestas.» | “Your answers are not sent.” |

La tabla es **copy objetivo para revisión**, no una alegación de certificación ISO. Si se activa el guardado opcional, el aviso de privacidad debe distinguir «se conserva en este dispositivo» de «se envía» sin decir algo falso.

---
# 14. QA del generador: pruebas automatizadas y perceptivas

## 14.1 Batería automatizada mínima

**NO HEREDAR UN PASS de R07:** sus 73 comprobaciones pertenecen al código R07 anterior y no cubren la corrección A/B ni los masters de R08. La futura implementación R08 debe volver a ejecutar una batería nueva.

| ID de test | Qué ejecuta | Oráculo para PASS |
|---|---|---|
| GEN-001 | 10.000 semillas, cada dificultad y estación | No se producen errores ni rondas vacías |
| GEN-002 | 1 muestra, cuota 1-4 | Número exacto de instancias correctas |
| GEN-003 | 2 muestras, A1+B1, A2+B1, A1+B2, A2+B2 | Contador verdadero por muestra coincide con cuotas |
| GEN-004 | Extremos A3+B1 y A1+B3 opcionales | Si se activan, generables y validados como cualquier otro |
| GEN-005 | Todos los giros y escalas autorizados | No cambia `shapeId` ni el número de soluciones |
| GEN-006 | Misma forma con distinta paleta | Evaluación idéntica antes/después del cambio de color |
| GEN-007 | Hoja distractora de la misma familia | No se convierte en correcta por pertenecer a esa familia |
| GEN-008 | Mismo `candidateId` asignado a A y B | Rechazo controlado, sin corrupción de sesión |
| GEN-009 | Muestra A = B | El generador rehúsa el reto; utiliza pareja válida |
| GEN-010 | Asset sin master/verificación | No se usa y no se sirve en partida |
| GEN-011 | Dos distractores o un distractor y muestra con contorno demasiado parecido | Combinación bloqueada si incumple matriz perceptiva aprobada |
| GEN-012 | Misma semilla/versiones | Se reproduce exactamente la ronda y sus soluciones |
| GEN-013 | Se modifica `stimulusSetVersion` | No se mezclan resultados ni retoma equivocada |
| GEN-014 | Regla A2+B1, selección A+A+B | Correcto si las tres formas corresponden |
| GEN-015 | Regla A2+B1, selección A+B+B | Incorrecto aunque el total sea tres |
| GEN-016 | Error, ayuda y corrección | Se permite volver a probar y queda marcado `assisted` si procede |
| GEN-017 | Cambio de estación con colores equivalentes | Nunca cambia solución; no se cuentan errores |
| GEN-018 | Idioma ES→EN en mitad de ronda | Las cuotas y cartas permanecen iguales |
| GEN-019 | Rotación visual de una carta después de selección | Se conserva selección y valor de verdad |
| GEN-020 | 12 rondas completas y una sesión cancelada | Cierre correcto; sin puntajes o castigos |

## 14.2 QA web / móvil / accesibilidad

Ejecutar combinaciones relevantes (no bastan capturas vacías):

- Viewports **320×800**, **390×844**, **1440×900**, además de alturas pequeñas y zoom al 200 %.
- Prueba de **4, 6, 8, 9 y 12 candidatos**; dos muestras A/B con cuota 2+2 en 320.
- En 320: modelo visible, primera pareja de hojas utilizable y posibilidad de llegar a «Comprobar» sin overlay.
- Recorrido completo mediante teclado; ratón y táctil con pruebas físicas en dispositivo cuando haya hardware.
- Lector de pantalla (al menos uno de NVDA/VoiceOver/TalkBack por plataforma objetivo, con prueba humana); no declarar PASS solo porque ARIA exista.
- `forced-colors: active`, alto contraste interno y `prefers-reduced-motion: reduce`.
- Opción A/B activa visible sin color; estado de carta marcada A/B en texto.
- Pausa por botón, cambio de pestaña, retorno de llamada, salida y restauración.
- Pistas, ampliación de modelo, reordenación por scroll y vuelta del foco al cerrar diálogos.
- ES y EN sin texto cortado, sin frases ambiguas y sin caracteres incrustados en PNG.
- Compatibilidad sin red una vez descargado pack, sin CDN ni solicitudes a terceros; no exponer analítica por defecto.
- Revisión de contraste de textos y componentes con herramientas automáticas más inspección visual de botones seleccionados/foco.
- En todos los estados: ausencia de overflow horizontal, imágenes recortadas o candidatos demasiado pequeños.

## 14.3 QA de usuario: protocolo cualitativo

No usar esta fase para reclamar eficacia cognitiva. Observar a personas con perfiles funcionales variados que quieran probar el juego, sin asignar dificultad por edad. Buscar comprensión, reconocimiento, comodidad y disfrute.

**Sesión de prueba:**

1. Dar solo la instrucción inicial del propio juego. Observar si sabe cómo empezar sin ayuda externa.
2. Probar Suave y Media; anotar confusión entre hoja modelo y decoración.
3. Si desea más reto, ir directamente a Experta y Maestría. Observar si sabe que A y B tienen cuotas propias.
4. Pedir que cambie una hoja asignada a A por otra de B. Comprobar si entiende el control.
5. Activar alto contraste, ampliar muestra y volver al reto. Detectar cambios de significado.
6. Probar un tablero con hojas de otoño: preguntar qué rasgos comparó, no si «su atención mejoró».
7. Terminar o pausar libremente. Confirmar que no percibe castigo ni pérdida.
8. Registrar propuestas de mejora y problemas de interés, fatiga o sobrecarga, sin recopilar diagnóstico innecesario.

**Criterios de aceptación propuestos para un piloto de usabilidad, no científicos:** ≥90 % de participantes de la muestra piloto comprenden el objetivo tras demo sin explicación adicional del facilitador; cero errores de lógica A/B; cero bloqueos para terminar o cambiar una elección; ningún distractor ambiguo confirmado que el equipo ignore. El porcentaje se recalibrará por tamaño/población piloto y no se interpretará como validez cognitiva.

## 14.4 Verificación visual comparada con la captura rechazada

La aceptación del nuevo arte no se basa en «más bonito». Registrar evidencia observable:

- **Antes:** dibujos de formas semejantes a estrellas. **Después exigido:** contornos botánicos distinguibles con ápice, base, lóbulos y nervaduras coherentes.
- **Antes:** todas verdes o alternancia artificial. **Después exigido:** paletas de estación plausibles y variadas.
- **Antes:** fondo intercambiable o cartas flotantes. **Después exigido:** espacio funcional unido a objetos/materiales de Iris Green, o superficie neutral deliberada.
- **Antes:** dos muestras A/B con «encuentra tres». **Después exigido:** cuotas y grupos visibles durante todo el reto.
- **Antes:** grandes controles antes de la tarea en móvil. **Después exigido:** prioridad muestra + cartas; opciones colapsadas.

# 15. Performance, formatos y costes técnicos

## 15.1 Presupuestos de partida (propuesta R08)

El juego de comparación no necesita WebGL para funcionar. Usar DOM/CSS e imágenes optimizadas; SVG para focos, máscaras y contornos. Un escenario de Faro opcional no debe convertir la pantalla de comparación en una escena 3D costosa.

| Recurso | Objetivo inicial | Tope / control |
|---|---|---|
| Primera carga HTML/CSS/JS | < 350 KB sin banco completo de hojas | medir gzip/brotli en servidor real |
| Banco base de 6 masters | 6 archivos aprobados + variantes necesarias bajo demanda | no incrustar 288 imágenes en primer paint |
| Pack mínimo de reto Suave/Media | ≤ 1 MB de recursos descargados, objetivo no contrato previo | valorar formato real, DPR y calidad |
| Pack avanzado local | por demanda / precarga consentida | descarga y cache por versión; no bloquear juego base |
| TTFB/FCP/INP | usar Core Web Vitals vigentes como referencia | medir en hardware, no inventar |
| Imágenes sobre cards | `srcset`/sizes, lazy-loading cuando no altere primera interacción | arte y transparencia sin halos |
| Ejercicio en 320 px | modelo + candidatas de dimensiones suficientes | prueba perceptiva humana exigida |

Estos valores son **guardarraíles para prototipado**, no mediciones de la R08 ni sustituyen el presupuesto global Faro. No exportar un HTML de varios megabytes por comodidad si existe arquitectura de paquetes; un HTML autónomo de QA sí puede mantener versiones incrustadas por separado.

## 15.2 Derivados y formato

- Masters PNG RGBA sRGB; pueden derivarse WebP o AVIF por cada estado autorizado, comprobando soporte/alpha y calidad.
- Mantener relación 1:1 entre `shapeId` y máscara; la paleta no añade ni elimina lóbulos.
- Generar thumbnails y comparativas de alpha sobre fondo negro, blanco y gris medio.
- No convertir a JPG las hojas transparentes salvo justificación formal.
- SVG de forma sin scripts ni recursos remotos; sanitizado antes de integrarlo en DOM.
- Manifest de derivados contiene `sha256`, tamaño, dimensiones, color/profile y `generatedFrom` masterId/versión.
- Favorecer versiones pequeñas para móvil sin sacrificar la anatomía de borde, que es precisamente la tarea.

## 15.3 Carga y limpieza

- Precarga solo muestras y candidatos de la ronda; la siguiente en segundo plano si memoria disponible.
- En red lenta, mostrar indicador textual y no iniciar la ronda hasta que las imágenes críticas estén cargadas y visibles.
- Cancelar requests, listeners, recursos y temporizadores al salir; `dispose` si se usa renderer 3D accesorio.
- Un asset fallido activa fallback descriptivo de error de carga, no una tarjeta que el jugador deba adivinar.
- No almacenar rostros, micrófono, cámara ni telemetría personal para ejecutar esta tarea.

# 16. Organización de equipo y flujo de trabajo

## 16.1 Responsabilidades (propuesta, por verificar con responsables)

| Responsable | Entregas concretas | No debe hacer |
|---|---|---|
| **Lumen · Dirección visual** | brief de hoja y composición, manifiesto de fuentes/derivados, QA de tamaño/percepción, contraste, presentación y animación | declarar arte aprobado sin revisión humana; rediseñar assets KEEP |
| **Nexo · Datos/continuidad** | definición versionada, catálogo aprobado, cuotas, generador/validador, persistencia optativa, adaptación | deducir acierto del color, edad o velocidad |
| **Motor · Runtime** | máquina de estados, UI, selección A/B, teclado/touch/ratón, ajustes, pausa, carga offline, pruebas de navegador | «arreglar» dificultad mediante decoración y timers |
| **Equipo de arte de Nexo o titular del asset** | PNG originales por hoja y variante, textura, contorno, informes de procedencia | enviar solo una lámina y llamarla seis masters |
| **Axioma** | revisión WCAG/COGA, ISO 24495-1 por UX, ES/EN, alternativas y HUMAN QA | confundir passes automatizados con aceptación de usuarios |
| **Lex** | validación de titularidad/licencias, privacidad y publicación | permitir assets con derechos indocumentados |
| **Persona responsable del producto** | selección de dirección visual definitiva, revisión de escenas y decisión KEEP/REWORK | aprobar por métricas técnicas sin ver una partida |

Las asignaciones precisas dependen de quién tenga actualmente el código y la autoría de cada recurso. En caso de conflicto, **GitHub y las órdenes explícitas posteriores** tienen prioridad; no reconstruir el proyecto desde el chat.

## 16.2 Plan de construcción en once pasos

| Paso | Actividad ejecutable | Salida para aceptar el paso |
|---:|---|---|
| 01 | Congelar R07 como referencia y registrar fallos F01-F12 | commit / hash original / captura defectuosa / inventario |
| 02 | Obtener masters separados de las 6 hojas de Nexo y derechos | seis masters, contornos, licencias, sha, aprobado/pending por asset |
| 03 | Crear banco de shapeIds y fenología | catálogos + comparativa morfológica por estación |
| 04 | Construir oráculos de formas y exclusiones | máscaras, matriz similitud, fixtures perceptivos validados |
| 05 | Programar generador con cuotas A/B y casos `one/dual` | GEN-001 a GEN-019 verdes con 10k semillas |
| 06 | Programar selección A/B, contadores y validador | verificación visual y funcional A2+B1, A1+B2, A2+B2 |
| 07 | Añadir dificultad 0-9 automática y niveles manuales | cambios un eje/vez, entrada directa Expert/Mastery |
| 08 | Rediseñar layout sin arte decorativo ajeno | diana visual 1440 / 390 / 320 aprobada sobre misma ronda |
| 09 | Integrar colores reales de estación, ajustes y textos ES/EN | inspección por especie, claridad, inputs y feedback |
| 10 | QA transversal y usabilidad con personas | informes técnicos + problemas corregidos + decisión HUMAN QA |
| 11 | Empaquetar, versionar y solo después valorar publicación | build reproducible, hashes, licencia, sin CDN, gate release |

**No rehacer el juego entero.** R07 ya tiene selector de dificultad, parte de la lógica de rondas y la infraestructura básica de controles. R08 sustituye cuidadosamente sus puntos defectuosos; se recomiendan módulos independientes para testear sin render.

## 16.3 Estimaciones de trabajo (no compromiso de calendario)

Estas cifras sirven para dimensionar una R08 construida **sobre R07**, no desde cero, con recursos aprobados disponibles. Distinguir esfuerzo técnico y humano:

| Bloque | Días de trabajo especializados, aproximados | Dependencias |
|---|---:|---|
| Catálogo/master/mascaras/fenología | 3-8 | originales Nexo, derechos y revisión botánica |
| Generador + validador + fixtures | 4-7 | esquema de datos estable |
| Reglas A/B, contadores y accesibilidad | 3-6 | generador y copy final |
| Adaptación automática y preferencias | 2-4 | métricas por ensayo y estados |
| Arte y composición final 1440/390/320 | 4-10 | masters + dirección artística elegida |
| QA completo y corrección de defectos | 5-10 | build integrado y dispositivos accesibles |
| **Total indicativo (sin solapamiento)** | **21-45 días-persona** | QA perceptivo y aprobación fuera del cálculo |

Puede ejecutarse parcialmente en paralelo. **El plazo real dependerá de las revisiones visuales**, disponibilidad de masters, plataforma de publicación y hallazgos de usabilidad. Una primera versión con seis formas no puede prometer automáticamente retos expertos perceptivamente sólidos: podría necesitar ampliar el banco.

# 17. Gating: listo para construir, probar y publicar

## 17.1 `READY_TO_BUILD`

- [ ] Mecánica y cuotas A/B firmadas como decisión de producto.
- [ ] Formato de catálogo versionado, con ejemplos válidos e inválidos.
- [ ] Licencias/procedencia de masters confirmadas; recortes de captura prohibidos para release.
- [ ] Umbrales técnicos y revisión perceptiva para parejas expertas documentados.
- [ ] Wireframes 1440/390/320 revisados contra identidad Iris Green.
- [ ] Diccionario ES/EN y accesibilidad mínima aprobados.

## 17.2 `READY_TO_TEST`

- [ ] Generador reproducible y validador exacto por muestra.
- [ ] Batería de 10.000 semillas / combinaciones pasa o aporta evidencia equivalente acordada.
- [ ] Ninguna carta vacía; ninguna pareja prohibida.
- [ ] Entradas ratón, touch y teclado; diálogo de ayuda y pausa.
- [ ] Dos muestras A/B con 1+1, 2+1, 1+2 y 2+2 visibles y correctas.
- [ ] Estaciones sin soluciones basadas en color, assets coherentes.
- [ ] QA de 320/390/1440 real y capturas con contenido en los cinco niveles.
- [ ] Modo sin movimiento y alto contraste verificados.

## 17.3 `READY_TO_RELEASE`

- [ ] HUMAN QA visual explícito (no inferido de captura).
- [ ] QA de usuarios sobre comprensión de instrucciones y distinción de hojas complejas.
- [ ] Revisión ES/EN, y lenguaje claro ISO 24495-1 documentada con prueba de comprensión.
- [ ] Accesibilidad WCAG 2.2 AA y política reforzada Iris 44px; variantes etiquetadas.
- [ ] Licencia/autoría de assets y aprobaciones de marcas y derechos.
- [ ] Modelo de datos privado, sin transmisión automática, borrado si hay guardado.
- [ ] No publicidad, no claims clínicos, sin rachas, sin cronómetros coercitivos.
- [ ] Build sin CDN, empaquetado versionado, hash, reproducibilidad y rollback.
- [ ] Vista móvil y carga offline probadas en hardware objetivo.
- [ ] Aprobación de publicación por responsables. No despliegue desde este informe.

# 18. Anexo: casos completos de partidas

## 18.1 Caso S01 · Suave, primavera, una muestra

**Config:** 4 cartas, modelo `leaf-oval-01`, cuota 1, sin giro. Las otras tres pertenecen a contornos claramente diferentes y aprobados. El color de la muestra y la correcta puede diferir dentro de los verdes autorizados.

**Secuencia:** muestra visible → «Encuentra una hoja con esta forma» → toca carta 3 → validador compara `shapeId` → correcta: «Sí, tiene la misma forma» → siguiente. Incorrecta: muestra en pantalla la regla, no elimina carta, permite probar otra.

**QA:** exactamente una correcta; modelo y correcta no necesitan compartir color; teléfono 320px muestra referencia y una fila de candidatas.

## 18.2 Caso H01 · Alta, otoño, tres coincidencias

**Config:** 8 cartas, una muestra de contorno palmado validado, cuota 3, dos verdes/ocres/rojos plausibles según catalogación de esa especie, distractores próximos con lóbulos diferentes. Al menos un distractor comparte tono con alguna correcta.

**Secuencia:** «Encuentra tres hojas con esta forma» → marca 2, 5, 7 → texto «Elegidas: 3 de 3» → «Comprobar mis hojas». Si una no coincide, permanece seleccionada con estado de revisión neutro; el usuario puede cambiarla.

**QA:** no vale solo marcar tres de la misma familia; todas deben compartir `shapeId` normalizado.

## 18.3 Caso M01 · Maestría A2+B1, mezcla estacional

**Config:** 12 cartas; modelo A = contorno X, cuota 2; modelo B = contorno Y, cuota 1; nueve distractores. A=X en amarillo y marrón; B=Y en rojo si es plausible; las muestras muestran tonos distintos que no permiten deducir solución. En «Mezcla» se presenta colección de hojas de estaciones distintas, no paisaje de un árbol contradictorio.

**Pantalla visible:** «Busca dos hojas como A y una como B.» A: «0 de 2» / B «0 de 1». Botón «Buscar hojas de A» activo. El jugador marca #2 y #8; contador A «2 de 2»; cambia a B y marca #11; B «1 de 1». Confirma; el validador compara `(shapeId, assignedTo)`.

**Resultado acertado:** «Has encontrado dos para A y una para B.» Desaparece posibilidad de cambiar, aparece «Siguiente reto».

**Resultado equivocado por reparto:** si la tercera hoja es X asignada a B, no sirve aunque sea correcta para A y haya tres hojas marcadas. Mensaje «Comprueba las formas de A y B. Puedes cambiar una.» No revela la ubicación de la correcta.

## 18.4 Caso M02 · Maestría A2+B2, invierno, acceso por teclado

**Config:** 12 cartas, dos muestras, cuatro correctas de dos contornos diferentes; muestras de especie caduca seca o perenne conservando verdes según catálogo, sin hojas imposibles. Usuario selecciona A con Tab+Enter, marca 2 cartas, selecciona B y marca 2 cartas, pulsa «Comprobar mis hojas».

**Oráculo:** cuatro cartas distintas, A2+B2 exacto, sin uso de ratón. La pantalla 320px permite llegar a todas mediante scroll vertical; el modelo sigue identificable y los contadores leíbles. Pausar y reanudar no borra asignaciones.

# 19. Referencias y límites de evidencia

## 19.1 Fuentes internas consultadas

- R07: `IRIS_GREEN_COG01_EL_CLARO_ESCONDIDO_R07_JUGABLE.zip`, su `README.md`, `index_local.html`, `QA_R07.json` y `QA_E2E_R07.json`. Código R07 revisado en octubre de 2026: 55 + 18 comprobaciones previas **solo de R07**.
- Capturas del juego rechazado R06/R07 aportadas por la usuaria; la última evidencia muestra 2 muestras y la consigna ambigua «Encuentra las tres hojas».
- Lámina original de seis hojas mostrada en el chat y atribuida a Nexo; solo referencia, no masters separados.
- Documentación Lumen en `mruizwow-bit/irisgreen`, carpeta `COORDINACION_IRIS_GREEN/FORMACION/A7_LUMEN/`, informes 10-15 de diseño, botánica, layout y R07.
- PDF de formación visual de Iris Green de 9 de octubre de 2026, disponible en la Biblioteca de Iris Green; separación de ORIGINAL / APROBADO / REWORK / PRUEBA.

## 19.2 Fuentes externas oficiales para normas de diseño

1. **ISO 24495-1:2023, Plain language, Part 1.** Principios para redactar información que se pueda localizar, comprender y utilizar. https://www.iso.org/standard/78907.html (consulta octubre de 2026).
2. **W3C WCAG 2.2.** Especialmente 1.4.11 (contraste no textual), 2.5.7 (alternativa al arrastre), 2.5.8 (tamaño objetivo AA) y 2.5.5 (44px enhanced AAA). https://www.w3.org/TR/WCAG22/ (consulta octubre de 2026).
3. **W3C WAI, Cognitive Accessibility.** Necesidad de navegación coherente, instrucciones directas, pausa y posibilidad de corregir errores. https://www.w3.org/WAI/cognitive/
4. **W3C WAI, Use Clear and Understandable Content.** Lenguaje sencillo y bloques de texto cortos; https://www.w3.org/WAI/WCAG2/supplemental/objectives/o3-clear-content/
5. **Botánica de observación.** Estudios anteriores de Lumen sobre formas reales: Arnold Arboretum de Harvard, Royal Horticultural Society y Smithsonian; sus imágenes externas son fuente de investigación, no assets copiados al juego.

## 19.3 Qué está decidido y qué sigue sin confirmación

**Decidido por la usuaria y canon:** sin edades; dificultad por capacidad; estaciones diversas; reto avanzado real; cuotas por muestra; lenguaje claro; identidad Iris Green; no dibujar de nuevo por automatismo; no producir personajes/fondos genéricos; conservar la base funcional.

**Definido técnicamente en este informe, pero aún pendiente de implementar:** asignación explícita A/B, seis combinaciones de cuotas, algoritmo versionado, adaptador hasta Maestría, bancos botánicos aprobados, estados, contratos y QA.

**No demostrado:** que R08 esté construida; que los recortes de Nexo sean masters separados; que las variantes morfológicas sean suficientemente distinguibles por personas avanzadas; cumplimiento formal de WCAG/ISO; idoneidad clínica; protección jurídica de un asset concreto; una publicación web nueva. **Ninguna de esas cuestiones se declara PASS.**

---

## Cierre y orden de ejecución

**Construir primero el generador, el validador y la interfaz A/B con ejemplos visibles**. En paralelo, aprobar los masters individuales y su fenología. Integrar arte después de tener la lógica comprobada y la diana visual revisada. Validar los cinco niveles y las cinco opciones estacionales en 320/390/1440, y realizar QA humano antes de publicar.

**Gate de documentación:** `COG01_R08_CONSTRUCTION_SPEC_COMPLETE__IMPLEMENTATION_REQUIRED`.

**Prioridad inmediata:** corregir la ambigüedad de dos muestras / tres respuestas y asegurar que la progresión automática llega realmente a Maestría. **No generar más portadas de muestra ni sustituir assets aprobados.**

# 20. Anexo visual de procedencia (no arte final)

**Lámina facilitada por la usuaria y atribuida a Nexo.** Los seis dibujos se estudian como referencia de textura, nervadura y estructura. No son masters individuales incorporables al juego sin separación y QA.

![Seis hojas de referencia de Nexo, atribución facilitada por la usuaria](EVIDENCIA/LAMINA_NEXO_REFERENCIA.png){width=14cm}

**Captura de R07 facilitada por la usuaria.** Demuestra la consigna insuficiente «Encuentra las tres hojas» con dos modelos. La R08 exige repartir el objetivo por muestra y distinguir asignaciones A/B.

![Captura de la ambigüedad A/B de R07](EVIDENCIA/CAPTURA_R07_AMBIGUEDAD_A_B.png){width=14cm}

**Clasificación de las imágenes:** referencia visual de Nexo y captura de una interfaz que necesita correcciones. **Ninguna es un master final ni demuestra que R08 esté publicada.**
