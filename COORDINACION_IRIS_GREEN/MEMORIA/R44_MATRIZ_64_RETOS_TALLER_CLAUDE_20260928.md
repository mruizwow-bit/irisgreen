# R44 · Los 64 retos del Taller · matriz completa y revisada

**Estado:** `R44_TALLER_RETOS_MATRIZ_64_64_FOR_ASTRA`  
**Fecha:** 28 de septiembre de 2026  
**Autoría:** Claude (construcción) · revisión previa: Astra · decisión: María  
**Responde a:** `MEMORIA/R44_RETOS_TALLER_AUDITORIA_ASTRA_20260927.md` (hallazgos 1 a 5)  
**Sustituye a:** `MEMORIA/PROPUESTA_R44_RETOS_TALLER_CLAUDE_20260927.md`

Este documento es la matriz que Astra pidió antes de construir nada: los **64 retos, uno a uno**, con los dieciocho campos exigidos. No se construye ningún reto hasta que Astra los revise individualmente y María autorice una ola.

---

## 1 · Qué cambia respecto a la propuesta anterior

| Hallazgo de Astra | Qué se hace en esta matriz |
|---|---|
| Los retos cruzados son la mejor idea | Se mantienen los 8 como columna vertebral (bloque X). Cada uno declara artefacto, estudios usados, dependencia mínima y alternativa accesible. |
| No convertir cinco ideas en cinco estudios | **Animación** y **Mapas** siguen como estudios candidatos (ola B). **MIDI**, **microcontroladores** y **voz y radio** dejan de ser estudios y pasan a ser **capacidades opcionales** (sección 6). |
| Fechas: 8 retos con fecha pero solo 7 temas | Ahora hay **exactamente 8 retos de calendario**, divididos con claridad: **4 anclados a una fecha real futura** y **4 permanentes nacidos de una efeméride ya pasada**. |
| Falla y Gaudí son efemérides de 2026 | Reformulados como permanentes (C04 y C05). No se presentan como hito futuro. |
| PLATO puede retrasarse | C07 no depende de la fecha: se diseña una misión y se simula un tránsito. La fecha es contexto. |
| Pastizales es 2026 | C06 reformulado como permanente. |
| No aprobar 21/16/27 | La distribución real que sale de la lista es **55 / 9 / 0**. Ninguna ola necesita permisos nuevos ni hardware. |
| Matriz obligatoria antes de construir | Es este documento. |

**Lo que no cambia:** R44 sigue separado del Taller. Esta matriz no toca el producto entregado en R47.

---

## 2 · Reglas que cumple cada uno de los 64 retos

Ningún reto entra en la matriz si no cumple las nueve:

1. **Termina en un artefacto real** que la persona descarga: imagen, sonido, modelo, juego, documento o página para imprimir. Nunca un JSON genérico como único resultado.
2. **Se completa sin permisos nuevos.** Ninguno pide cámara, micrófono ni ubicación. La `Permissions-Policy` del sitio no se toca.
3. **Se completa sin hardware.** Donde el hardware aporta (proyector, lápiz digital), es una mejora y nunca un requisito.
4. **Tiene alternativa al arrastre** (WCAG 2.2, 2.5.7): campos numéricos en Propiedades y dos toques en el lienzo.
5. **Se puede hacer entero con teclado** y se anuncia a lectores de pantalla.
6. **No depende de una fecha para tener sentido.** Los ocho retos de calendario siguen sirviendo el día después.
7. **La etapa cambia el ejemplo, no la herramienta.** Ningún reto se cierra por edad.
8. **No añade almacenamiento.** El trabajo vive en la pestaña y se guarda como archivo.
9. **Propiedad intelectual limpia:** todo original; nada de marcas, personajes ni obra protegida.

Cada reto llevará además los metadatos de protección infantil que ya usa el Taller (`audience`, `sensitivity`, `discovery`), que se añadirán al inventario `assets/data/taller-childsafe.json` en el momento de construirlo. Los 64 son `S0_GENERAL`, `TRANSVERSAL` y `NORMAL`: son ejercicios creativos de uso general.

---

## 3 · Resumen de la matriz

| | Retos |
|---|---|
| De estudio | 48 |
| Cruzados (varios estudios) | 8 |
| De calendario, con fecha real futura | 4 |
| De calendario, permanentes | 4 |
| **Total** | **64** |

| Ola | Qué la define | Retos |
|---|---|---|
| **A** | Nada nuevo: estudios y motores que ya existen hoy | **55** |
| **B** | Necesita los estudios candidatos Animación o Mapas | **9** |
| **C** | Hardware, permisos o API experimental | **0** |

La ola C **no contiene ningún reto**. Contiene las tres capacidades opcionales de la sección 6, y ninguna de ellas es la única forma de terminar nada.

---

## 4 · Matriz 64/64 · vista de conjunto

Las fichas completas, con los dieciocho campos, están en la sección 7.

| ID | Título ES | Title EN | Estudio principal | Secundarios | Tipo | Etapas | Ola | Artefacto |
|---|---|---|---|---|---|---|---|---|
| `E01` | Una línea sin levantar el lápiz | One line, never lifting the pen | Dibujo | Diseño gráfico | Estudio | Todas | A | PNG y proyecto |
| `E02` | Luz en tres tonos | Light in three tones | Dibujo | Color | Estudio | Todas | A | PNG con las tres capas de valor |
| `E03` | Serie de diez con reglas propias | A series of ten with your own rules | Dibujo | Escritura con restricciones | Estudio | Todas | A | Proyecto con diez dibujos y las reglas escritas |
| `E04` | Cartel que se lee a tres metros | A poster you can read from three metres | Diseño gráfico | Color | Estudio | Adolescencia, adultez | A | SVG y PNG |
| `E05` | La misma información en tres formas | The same information in three shapes | Diseño gráfico | Datos, Color | Estudio | Adolescencia, adultez | A | SVG con tres versiones |
| `E06` | Baldosa que no se nota | A tile with no visible seam | Pixel art | Videojuegos, Patrones | Estudio | Todas | A | PNG repetible y vista en mosaico |
| `E07` | Seis fotogramas que pesan | Six frames with weight | Pixel art | Animación | Estudio | Todas | A | GIF y hoja de sprites |
| `E08` | Página de cómic sin diálogo | A comic page with no dialogue | Cómic y guion gráfico | Dibujo | Estudio | Todas | A | PNG, SVG y ZIP de páginas |
| `E09` | Paleta que funciona para daltonismo | A palette that works for colour blindness | Color | Diseño gráfico | Estudio | Adolescencia, adultez | A | Tarjeta de paleta PNG y variables CSS |
| `E10` | La misma escena de día y de noche | The same scene by day and by night | Color | Dibujo | Estudio | Todas | A | PNG de las dos escenas |
| `E11` | Los diecisiete grupos, uno a uno | The seventeen groups, one by one | Patrones y arte generativo | Papiroflexia | Estudio | Adolescencia, adultez | A | SVG de cada grupo y lista de los vistos |
| `E12` | Una planta que crece con reglas | A plant that grows from rules | Patrones y arte generativo | Simulaciones | Estudio | Todas | A | SVG y reglas en JSON |
| `E13` | Diez encuadres de la misma cosa | Ten framings of the same thing | Fotografía y composición | Diseño gráfico | Estudio | Todas | A | Hoja de contactos PNG |
| `E14` | Antes de publicar, mira los metadatos | Before you post, look at the metadata | Fotografía y composición | Ideas e inventos | Estudio | Adolescencia, adultez | A | JPEG exportado sin metadatos |
| `E15` | Un estampado con un solo motivo | A print from a single motif | Moda y textil | Patrones y arte generativo | Estudio | Todas | A | Azulejo PNG y SVG en centímetros |
| `E16` | La bolsa que te cabe | The bag that fits what you carry | Moda y textil | Máquinas e inventos | Estudio | Adolescencia, adultez | A | Patrón a escala real en hojas A4 |
| `E17` | Un puente que aguanta el camión | A bridge that holds the lorry | Estructuras y puentes | Máquinas e inventos | Estudio | Todas | A | Imagen del montaje y cálculo educativo |
| `E18` | Una casa donde cabe una silla de ruedas | A home a wheelchair can move through | Arquitectura y planos | Estructuras y puentes | Estudio | Adolescencia, adultez | A | Planta SVG 1:50 y modelo 3D |
| `E19` | Una pieza que se puede imprimir | A part you can actually print | Modelado 3D | Máquinas e inventos | Estudio | Adolescencia, adultez | A | STL y GLB |
| `E20` | Un reloj que da la hora | A clock that keeps time | Máquinas e inventos | Modelado 3D | Estudio | Adolescencia, adultez | A | PNG del montaje y ficha técnica |
| `E21` | Diez pasos que se empujan | Ten steps that push each other | Máquinas e inventos | Simulaciones | Estudio | Todas | A | Vídeo no; PNG del montaje y lista de pasos |
| `E22` | Un semáforo que no se equivoca | A traffic light that never gets it wrong | Circuitos | Programación | Estudio | Todas | A | Esquema SVG y tabla de verdad CSV |
| `E23` | Sumar en binario | Adding in binary | Circuitos | Programación | Estudio | Adolescencia, adultez | A | Esquema y tabla de verdad |
| `E24` | Un icosaedro en tu mesa | An icosahedron on your table | Papiroflexia y poliedros | Modelado 3D | Estudio | Todas | A | Red SVG en milímetros e impresión a escala |
| `E25` | Un cubo de seis piezas | A cube from six pieces | Papiroflexia y poliedros | Ideas e inventos | Estudio | Todas | A | Hoja de diagramas imprimible |
| `E26` | Un atasco que nadie provoca | A traffic jam nobody causes | Simulaciones | Mapas | Estudio | Adolescencia, adultez | A | CSV y diagrama espacio-tiempo |
| `E27` | Un ecosistema que no se muere | An ecosystem that stays alive | Simulaciones | Mundos | Estudio | Todas | A | CSV de poblaciones y gráfico PNG |
| `E28` | Cincuenta palabras exactas | Exactly fifty words | Escritura con restricciones | Cómic y guion gráfico | Estudio | Todas | A | TXT, MD y HTML accesible |
| `E29` | Un texto sin la letra e | A text without the letter e | Escritura con restricciones | Lenguas inventadas | Estudio | Adolescencia, adultez | A | TXT y PDF por impresión |
| `E30` | Una isla con tres especies | An island with three species | Mundos | Simulaciones | Estudio | Todas | A | Atlas HTML y mapa PNG |
| `E31` | Un calendario que no es el nuestro | A calendar that is not ours | Mundos | Lenguas inventadas | Estudio | Adolescencia, adultez | A | Atlas HTML con la vista de calendario |
| `E32` | Veinte signos y ni uno más | Twenty signs and not one more | Lenguas inventadas | Diseño gráfico | Estudio | Todas | A | Alfabeto SVG y PNG |
| `E33` | Cien palabras para empezar | A hundred words to begin with | Lenguas inventadas | Escritura con restricciones | Estudio | Adolescencia, adultez | A | Diccionario CSV |
| `E34` | Un juego para dos con cinco reglas | A two-player game with five rules | Juegos de mesa | Ideas e inventos | Estudio | Todas | A | Tablero, cartas y reglas imprimibles |
| `E35` | Que no gane siempre quien empieza | So the first player does not always win | Juegos de mesa | Simulaciones | Estudio | Adolescencia, adultez | A | Reglas y datos de la simulación |
| `E36` | Ocho ideas en ocho minutos | Eight ideas in eight minutes | Ideas e inventos | Dibujo | Estudio | Todas | A | Tablero PNG y Markdown |
| `E37` | Un invento que cabe en el presupuesto | An invention that fits the budget | Ideas e inventos | Máquinas e inventos | Estudio | Adolescencia, adultez | A | Ficha de invento imprimible |
| `E38` | Un ritmo que se reconoce | A rhythm you can recognise | Ritmo y secuenciador | Composición | Estudio | Todas | A | WAV y MIDI |
| `E39` | Una melodía con tres acordes | A tune over three chords | Composición | Ritmo y secuenciador | Estudio | Adolescencia, adultez | A | WAV y MIDI |
| `E40` | Un sonido que no existe | A sound that does not exist | Síntesis y paisajes sonoros | Composición | Estudio | Adolescencia, adultez | A | WAV |
| `E41` | Luz que encaja en un objeto real | Light that fits a real object | Videomapping | Modelado 3D | Estudio | Adolescencia, adultez | A | Espectáculo HTML y proyecto |
| `E42` | Un programa que hace lo mismo de dos formas | A program that does the same thing twice | Programación | Robótica | Estudio | Todas | A | Proyecto y código JavaScript |
| `E43` | Un robot que sigue la línea | A robot that follows the line | Robótica | Programación | Estudio | Adolescencia, adultez | A | Proyecto del gemelo digital |
| `E44` | Un nivel que se puede ganar | A level you can actually win | Videojuegos | Estructuras y puentes | Estudio | Todas | A | Juego HTML autocontenido |
| `E45` | Un mapa que no necesita colores | A map that needs no colours | Mapas | Mundos | Estudio | Adolescencia, adultez | B | Mapa SVG y leyenda |
| `E46` | Una ruta que cualquiera puede hacer | A route anyone can take | Mapas | Datos | Estudio | Adolescencia, adultez | B | Mapa y ficha de la ruta |
| `E47` | Doce fotogramas que engañan al ojo | Twelve frames that fool the eye | Animación | Pixel art | Estudio | Todas | B | GIF y SVG animado |
| `E48` | Una animación que explica algo | An animation that explains something | Animación | Datos, Diseño gráfico | Estudio | Adolescencia, adultez | B | SVG animado y GIF |
| `X01` | Un videojuego con todo tuyo | A video game made entirely by you | Videojuegos | Pixel art, Ritmo y secuenciador, Programación | Cruzado | Todas | A | Juego HTML autocontenido con tus gráficos y tu música |
| `X02` | Un cómic con su cartel y su tipografía | A comic with its own poster and lettering | Cómic y guion gráfico | Diseño gráfico, Color, Escritura con restricciones | Cruzado | Todas | A | ZIP de páginas, cartel SVG y paleta |
| `X03` | Una casa que se sostiene | A house that holds itself up | Arquitectura y planos | Estructuras y puentes, Modelado 3D | Cruzado | Adolescencia, adultez | A | Planta SVG, modelo GLB e imagen del cálculo |
| `X04` | Un mundo con su lengua y su mapa | A world with its own language and map | Mundos | Lenguas inventadas, Mapas, Escritura con restricciones | Cruzado | Todas | A | Atlas HTML con mapa, diccionario y un texto traducido |
| `X05` | Un juego de mesa impreso y probado | A printed, playtested board game | Juegos de mesa | Diseño gráfico, Simulaciones, Ideas e inventos | Cruzado | Adolescencia, adultez | A | Tablero, cartas y reglas impresas, más los datos del equilibrio |
| `X06` | Un instrumento que ves y oyes | An instrument you can see and hear | Síntesis y paisajes sonoros | Programación, Animación, Composición | Cruzado | Adolescencia, adultez | B | WAV, proyecto y visual exportado |
| `X07` | Una explicación que se entiende a la primera | An explanation that lands first time | Diseño gráfico | Datos, Animación, Escritura con restricciones | Cruzado | Adolescencia, adultez | B | Infografía SVG, versión animada y texto |
| `X08` | Una máquina que se puede montar | A machine you could actually build | Máquinas e inventos | Modelado 3D, Circuitos, Ideas e inventos | Cruzado | Adolescencia, adultez | A | Ficha técnica, STL de una pieza y esquema del circuito |
| `C01` | El eclipse del 2 de agosto de 2027 | The eclipse of 2 August 2027 | Mapas | Modelado 3D, Simulaciones, Diseño gráfico | Calendario · fecha real | Todas | B | Mapa de la franja de totalidad, animación del cono de sombra y ficha de tu sitio |
| `C02` | Doscientos años sin Beethoven | Two hundred years without Beethoven | Composición | Ritmo y secuenciador, Animación, Diseño gráfico | Calendario · fecha real | Adolescencia, adultez | A | WAV y MIDI de una variación propia, más su visualización |
| `C03` | Cien años de una generación | A hundred years of a generation | Escritura con restricciones | Cómic y guion gráfico, Diseño gráfico, Lenguas inventadas | Calendario · fecha real | Adolescencia, adultez | A | Texto, cartel y una página de cómic |
| `C04` | Falla, ciento cincuenta años después | Falla, a hundred and fifty years on | Composición | Diseño gráfico, Síntesis y paisajes sonoros | Calendario · permanente | Adolescencia, adultez | A | WAV o MIDI de una pieza propia y un cartel |
| `C05` | Geometría que sostiene | Geometry that holds | Arquitectura y planos | Patrones y arte generativo, Estructuras y puentes, Modelado 3D | Calendario · permanente | Adolescencia, adultez | A | Planta SVG, mosaico y modelo 3D |
| `C06` | Los pastos, contados con datos | Rangelands, told with data | Mapas | Datos, Simulaciones, Mundos | Calendario · permanente | Adolescencia, adultez | B | Mapa, gráfico con tabla alternativa y texto |
| `C07` | Diseña una misión para encontrar planetas | Design a mission to find planets | Simulaciones | Modelado 3D, Datos, Diseño gráfico | Calendario · permanente | Adolescencia, adultez | A | Curva de luz simulada, ficha de misión y esquema del satélite |
| `C08` | Un sitio que aguante las visitas | A place that can take the visitors | Mapas | Datos, Juegos de mesa, Diseño gráfico | Calendario · fecha real | Adolescencia, adultez | B | Mapa de carga turística, simulación de visitantes y propuesta |

---

## 5 · Cobertura por estudio

Cuántos retos tiene cada estudio como **principal**. Todos los estudios del Taller aparecen; los que salen con más retos son los que admiten recorridos más largos.

| Estudio | Retos como principal |
|---|---|
| Mapas *(estudio candidato, ola B)* | 5 |
| Arquitectura y planos | 3 |
| Composición | 3 |
| Dibujo | 3 |
| Diseño gráfico | 3 |
| Escritura con restricciones | 3 |
| Juegos de mesa | 3 |
| Mundos | 3 |
| Máquinas e inventos | 3 |
| Simulaciones | 3 |
| Animación *(estudio candidato, ola B)* | 2 |
| Circuitos | 2 |
| Color | 2 |
| Cómic y guion gráfico | 2 |
| Fotografía y composición | 2 |
| Ideas e inventos | 2 |
| Lenguas inventadas | 2 |
| Moda y textil | 2 |
| Papiroflexia y poliedros | 2 |
| Patrones y arte generativo | 2 |
| Pixel art | 2 |
| Síntesis y paisajes sonoros | 2 |
| Videojuegos | 2 |
| Estructuras y puentes | 1 |
| Modelado 3D | 1 |
| Programación | 1 |
| Ritmo y secuenciador | 1 |
| Robótica | 1 |
| Videomapping | 1 |

Los 27 estudios del Taller entregado en R47 aparecen al menos una vez entre los campos «principal» y «secundarios». Los estudios candidatos **Animación** y **Mapas** solo aparecen en retos de la ola B, y ningún reto de la ola A depende de ellos.

---

## 6 · Capacidades, no estudios

Astra pidió no convertir automáticamente cinco ideas en cinco estudios. Aquí queda resuelto.

### Siguen como estudios candidatos

**Animación** (`KEEP_AS_STUDY_CANDIDATE`). Tiene línea de tiempo, fotogramas, papel cebolla, curvas de tiempo y exportación propias. No es Pixel art con más pasos. Reutiliza dibujos de Dibujo, Cómic y Diseño gráfico. Retos E47, E48, X06 y X07.

**Mapas** (`KEEP_AS_STUDY_CANDIDATE`). Mapas narrativos, rutas accesibles, mapas históricos, capas de datos, escalas, leyendas y símbolos. **Ubicación siempre manual: ningún reto pide geolocalización, ni ahora ni después.** Si algún día se usara, sería una mejora opcional tras una acción explícita. Retos E45, E46, C01, C06 y C08.

Ninguno de los dos está aprobado todavía. Los retos que dependen de ellos son la ola B.

### Pasan a ser capacidades opcionales

| Idea | Dónde vive ahora | Regla |
|---|---|---|
| **MIDI** (`MERGE_AS_CAPABILITY_IN_MUSIC_STUDIES`) | Ritmo, Composición y Síntesis | Importar y exportar MIDI ya existe y no necesita permisos. Un teclado MIDI conectado sería una mejora: Web MIDI tiene disponibilidad limitada, así que **nunca puede ser requisito para terminar un reto**. |
| **Microcontroladores** (`MERGE_AS_OPTIONAL_HARDWARE_LAYER`) | Programación y Robótica | El gemelo digital va primero y basta para completar E43 y X08. Web Serial requiere HTTPS, acción de la persona y permiso; sería una capa opcional posterior. **Ningún reto la necesita.** |
| **Voz y radio** (`MERGE_AS_AUDIO_PROJECT_PROFILE_FIRST`) | Síntesis, Composición y Escritura | La base es sin micrófono: voz sintetizada, sonidos propios o un archivo de audio que abre la persona. **La `Permissions-Policy` sigue con `microphone=()` y no se propone cambiarla.** Si algún día se grabara, sería tras acción explícita, con proceso local, indicador visible de grabación y borrado en manos de la persona. |

Las tres capacidades forman la ola C. Ninguna aparece como requisito en los 64 retos.

---

## 7 · Fichas completas · los dieciocho campos

Cada ficha lleva: identificador, título en los dos idiomas, estudio principal y secundarios, etapas, tipo, artefacto, qué se aprende, motor o API, permisos, hardware, alternativa sin esa vía, alternativa al arrastre, teclado, dependencia temporal, propiedad intelectual, ola y criterio de aprobación humana.

### 7.1 · Retos de estudio (E01–E48)

#### `E01` · Una línea sin levantar el lápiz

*One line, never lifting the pen*

Economía del trazo y síntesis de la forma: decidir qué se dibuja y qué se sugiere.

| Campo | |
|---|---|
| Estudio principal | Dibujo |
| Estudios secundarios | Diseño gráfico |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | PNG y proyecto |
| Motor o API | PixiJS (ya en el estudio) |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Sin lápiz digital, el grosor es constante y el reto no cambia |
| Alternativa al arrastre (2.5.7) | Trazo con teclado: cursor, Intro baja y sube la pluma |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Un dibujo reconocible hecho con un único trazo continuo, exportado. |

#### `E02` · Luz en tres tonos

*Light in three tones*

Claro, medio y sombra: el volumen se ve antes que el color.

| Campo | |
|---|---|
| Estudio principal | Dibujo |
| Estudios secundarios | Color |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | PNG con las tres capas de valor |
| Motor o API | PixiJS; ayuda de tres tonos del estudio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | La ayuda propone los tres valores si la persona no los elige |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Tres capas nombradas con los tres valores y un objeto que se lee como volumen. |

#### `E03` · Serie de diez con reglas propias

*A series of ten with your own rules*

Una restricción propia sostenida diez veces produce estilo.

| Campo | |
|---|---|
| Estudio principal | Dibujo |
| Estudios secundarios | Escritura con restricciones |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | Proyecto con diez dibujos y las reglas escritas |
| Motor o API | PixiJS; serie del estudio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | La serie admite dibujos muy simples: el reto es la regla, no el detalle |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Diez dibujos en el mismo proyecto y al menos dos reglas escritas que se cumplen en todos. |

#### `E04` · Cartel que se lee a tres metros

*A poster you can read from three metres*

Jerarquía, contraste y tamaño mínimo de letra.

| Campo | |
|---|---|
| Estudio principal | Diseño gráfico |
| Estudios secundarios | Color |
| Etapas | Adolescencia, adultez |
| Tipo | Estudio |
| Artefacto final | SVG y PNG |
| Motor o API | Lienzo vectorial (PixiJS) y revisión de contraste |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | La revisión indica qué falla y cómo arreglarlo |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Revisión de legibilidad sin avisos y titular legible en la vista reducida. |

#### `E05` · La misma información en tres formas

*The same information in three shapes*

Una misma idea cambia de sentido según cómo se ordena.

| Campo | |
|---|---|
| Estudio principal | Diseño gráfico |
| Estudios secundarios | Datos, Color |
| Etapas | Adolescencia, adultez |
| Tipo | Estudio |
| Artefacto final | SVG con tres versiones |
| Motor o API | Lienzo vectorial |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Se puede hacer con texto y rectángulos, sin ilustración |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Tres composiciones con el mismo contenido y una nota de qué cambia en cada una. |

#### `E06` · Baldosa que no se nota

*A tile with no visible seam*

Continuidad en los bordes: lo que sale por un lado entra por el otro.

| Campo | |
|---|---|
| Estudio principal | Pixel art |
| Estudios secundarios | Videojuegos, Patrones |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | PNG repetible y vista en mosaico |
| Motor o API | PixiJS; vista en mosaico del estudio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | La vista en mosaico marca las costuras |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | El mosaico 3×3 no deja ver dónde empieza la baldosa. |

#### `E07` · Seis fotogramas que pesan

*Six frames with weight*

Anticipación, aplastado y estirado en muy pocos fotogramas.

| Campo | |
|---|---|
| Estudio principal | Pixel art |
| Estudios secundarios | Animación |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | GIF y hoja de sprites |
| Motor o API | PixiJS; codificador GIF propio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | La vista previa baja la velocidad si hay destellos fuertes (WCAG 2.3.1) |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Seis fotogramas con deformación en el impacto y un GIF que repite bien. |

#### `E08` · Página de cómic sin diálogo

*A comic page with no dialogue*

Contar con planos y ritmo de viñeta, sin apoyarse en el texto.

| Campo | |
|---|---|
| Estudio principal | Cómic y guion gráfico |
| Estudios secundarios | Dibujo |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | PNG, SVG y ZIP de páginas |
| Motor o API | Lienzo vectorial |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Las viñetas admiten siluetas simples |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Una página de al menos cuatro viñetas que se entiende sin una sola palabra. |

#### `E09` · Paleta que funciona para daltonismo

*A palette that works for colour blindness*

Distinguir por luminosidad y forma, no solo por tono.

| Campo | |
|---|---|
| Estudio principal | Color |
| Estudios secundarios | Diseño gráfico |
| Etapas | Adolescencia, adultez |
| Tipo | Estudio |
| Artefacto final | Tarjeta de paleta PNG y variables CSS |
| Motor o API | Simulación de Machado y otros (2009) |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | La simulación avisa cuando dos colores se acercan demasiado |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Ningún par de la paleta se confunde en protanopía, deuteranopía ni tritanopía. |

#### `E10` · La misma escena de día y de noche

*The same scene by day and by night*

La luz cambia el color de todo a la vez, no de un objeto suelto.

| Campo | |
|---|---|
| Estudio principal | Color |
| Estudios secundarios | Dibujo |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | PNG de las dos escenas |
| Motor o API | Escena SVG del estudio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | El estudio deriva una paleta de noche como punto de partida |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Dos versiones coherentes y la relación de contraste del texto por encima de 4,5:1 en ambas. |

#### `E11` · Los diecisiete grupos, uno a uno

*The seventeen groups, one by one*

Las simetrías del plano son solo diecisiete y se pueden reconocer.

| Campo | |
|---|---|
| Estudio principal | Patrones y arte generativo |
| Estudios secundarios | Papiroflexia |
| Etapas | Adolescencia, adultez |
| Tipo | Estudio |
| Artefacto final | SVG de cada grupo y lista de los vistos |
| Motor o API | Generador de grupos cristalográficos del estudio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | El estudio dibuja los ejes y centros si se piden |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Los diecisiete grupos visitados y un mosaico propio en tres de ellos. |

#### `E12` · Una planta que crece con reglas

*A plant that grows from rules*

Un sistema L: pocas reglas, mucha forma.

| Campo | |
|---|---|
| Estudio principal | Patrones y arte generativo |
| Estudios secundarios | Simulaciones |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | SVG y reglas en JSON |
| Motor o API | Intérprete de sistemas L del estudio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Hay preajustes (Koch, Sierpiński, dragón, planta) para partir de algo |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Un axioma y al menos dos reglas propias que producen una forma reconocible. |

#### `E13` · Diez encuadres de la misma cosa

*Ten framings of the same thing*

El encuadre cambia el significado más que el motivo.

| Campo | |
|---|---|
| Estudio principal | Fotografía y composición |
| Estudios secundarios | Diseño gráfico |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | Hoja de contactos PNG |
| Motor o API | Canvas 2D del estudio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Hay imágenes de práctica originales si no se quiere usar una foto propia |
| Alternativa al arrastre (2.5.7) | Recorte por campos x, y, ancho y alto, y dos toques en las esquinas |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Imágenes de práctica originales; las fotos son de la persona y no se suben |
| Ola | A |
| **Criterio de aprobación humana** | Diez versiones de la misma imagen y una nota de cuál funciona mejor y por qué. |

#### `E14` · Antes de publicar, mira los metadatos

*Before you post, look at the metadata*

Una foto puede llevar dónde y cuándo se hizo; conviene saberlo.

| Campo | |
|---|---|
| Estudio principal | Fotografía y composición |
| Estudios secundarios | Ideas e inventos |
| Etapas | Adolescencia, adultez |
| Tipo | Estudio |
| Artefacto final | JPEG exportado sin metadatos |
| Motor o API | Lector de Exif propio del estudio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Si la foto no lleva metadatos, el estudio lo dice y explica por qué |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | La foto es de la persona y no sale del navegador |
| Ola | A |
| **Criterio de aprobación humana** | Una exportación comprobada sin Exif ni GPS y una explicación escrita de qué se ha quitado. |

#### `E15` · Un estampado con un solo motivo

*A print from a single motif*

Media gota, ladrillo y espejo cambian el ritmo de la tela.

| Campo | |
|---|---|
| Estudio principal | Moda y textil |
| Estudios secundarios | Patrones y arte generativo |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | Azulejo PNG y SVG en centímetros |
| Motor o API | Repetición del estudio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | El motivo puede ser una sola forma |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Un motivo repetido en al menos dos disposiciones y una vista grande sin costuras. |

#### `E16` · La bolsa que te cabe

*The bag that fits what you carry*

Medidas, margen de costura y fuelle: del dibujo al objeto.

| Campo | |
|---|---|
| Estudio principal | Moda y textil |
| Estudios secundarios | Máquinas e inventos |
| Etapas | Adolescencia, adultez |
| Tipo | Estudio |
| Artefacto final | Patrón a escala real en hojas A4 |
| Motor o API | Empaquetado de piezas e impresión del estudio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Si no hay impresora, el SVG en milímetros sirve igual |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Un patrón impreso cuyo cuadrado de prueba mide 5 cm reales. |

#### `E17` · Un puente que aguanta el camión

*A bridge that holds the lorry*

Triangulación: dónde va la compresión y dónde la tracción.

| Campo | |
|---|---|
| Estudio principal | Estructuras y puentes |
| Estudios secundarios | Máquinas e inventos |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | Imagen del montaje y cálculo educativo |
| Motor o API | Planck.js |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | La prueba avanza por pasos con movimiento reducido |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | El puente pasa la prueba de carga y la persona señala una barra a compresión y otra a tracción. |

#### `E18` · Una casa donde cabe una silla de ruedas

*A home a wheelchair can move through*

Puertas, pasillos y círculo de giro: la accesibilidad se dibuja desde el principio.

| Campo | |
|---|---|
| Estudio principal | Arquitectura y planos |
| Estudios secundarios | Estructuras y puentes |
| Etapas | Adolescencia, adultez |
| Tipo | Estudio |
| Artefacto final | Planta SVG 1:50 y modelo 3D |
| Motor o API | SVG y Three.js sincronizados |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | La revisión orientativa señala qué no cumple y por qué |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Revisión orientativa basada en el CTE DB-SUA; no es un proyecto técnico |
| Ola | A |
| **Criterio de aprobación humana** | La revisión no marca ningún incumplimiento de paso libre ni de círculo de giro. |

#### `E19` · Una pieza que se puede imprimir

*A part you can actually print*

Sólidos y huecos en milímetros; qué puede imprimirse y qué no.

| Campo | |
|---|---|
| Estudio principal | Modelado 3D |
| Estudios secundarios | Máquinas e inventos |
| Etapas | Adolescencia, adultez |
| Tipo | Estudio |
| Artefacto final | STL y GLB |
| Motor o API | Three.js con WebGPU y reserva WebGL 2; CSG |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Sin WebGPU funciona en WebGL 2; sin ninguno, el estudio lo explica |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Un STL sin piezas flotantes y con medidas escritas. |

#### `E20` · Un reloj que da la hora

*A clock that keeps time*

Relación de transmisión: 1 a 12 entre dos agujas.

| Campo | |
|---|---|
| Estudio principal | Máquinas e inventos |
| Estudios secundarios | Modelado 3D |
| Etapas | Adolescencia, adultez |
| Tipo | Estudio |
| Artefacto final | PNG del montaje y ficha técnica |
| Motor o API | Cálculo de engranajes del estudio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | El inspector da la relación exacta en cada paso |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Un tren de engranajes con relación 1:12 comprobada y sin bloqueos. |

#### `E21` · Diez pasos que se empujan

*Ten steps that push each other*

Transferencia de energía en cadena y causa a causa.

| Campo | |
|---|---|
| Estudio principal | Máquinas e inventos |
| Estudios secundarios | Simulaciones |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | Vídeo no; PNG del montaje y lista de pasos |
| Motor o API | Planck.js |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Con movimiento reducido, la prueba avanza paso a paso |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Diez pasos encadenados que llegan al cubo, con la lista de qué activa a qué. |

#### `E22` · Un semáforo que no se equivoca

*A traffic light that never gets it wrong*

Estados y secuencia con lógica sencilla.

| Campo | |
|---|---|
| Estudio principal | Circuitos |
| Estudios secundarios | Programación |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | Esquema SVG y tabla de verdad CSV |
| Motor o API | Solver de Kirchhoff y Ohm del estudio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | El reloj lo inicia la persona y nunca pasa de 1 Hz |
| Alternativa al arrastre (2.5.7) | Cables por dos clics o desde dos listas del inspector |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Simbología según IEC 60617; valores aproximados para aprender |
| Ola | A |
| **Criterio de aprobación humana** | La secuencia completa sin estados imposibles y sin ningún LED fundido. |

#### `E23` · Sumar en binario

*Adding in binary*

Un sumador completo es solo lógica repetida.

| Campo | |
|---|---|
| Estudio principal | Circuitos |
| Estudios secundarios | Programación |
| Etapas | Adolescencia, adultez |
| Tipo | Estudio |
| Artefacto final | Esquema y tabla de verdad |
| Motor o API | Lógica del estudio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | La tabla de verdad se genera sola y sirve de comprobación |
| Alternativa al arrastre (2.5.7) | Cables por dos clics |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Simbología IEC 60617 |
| Ola | A |
| **Criterio de aprobación humana** | Tabla de verdad correcta para las ocho combinaciones de entrada. |

#### `E24` · Un icosaedro en tu mesa

*An icosahedron on your table*

De tres dimensiones a plano y vuelta: la red y las pestañas.

| Campo | |
|---|---|
| Estudio principal | Papiroflexia y poliedros |
| Estudios secundarios | Modelado 3D |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | Red SVG en milímetros e impresión a escala |
| Motor o API | Three.js con reserva WebGL 2; geometría propia |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Sin 3D, la red, los pliegues y los diagramas siguen funcionando |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Una red impresa con pestañas numeradas y la comprobación V − A + C = 2. |

#### `E25` · Un cubo de seis piezas

*A cube from six pieces*

Modularidad: una pieza repetida seis veces se sostiene sola.

| Campo | |
|---|---|
| Estudio principal | Papiroflexia y poliedros |
| Estudios secundarios | Ideas e inventos |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | Hoja de diagramas imprimible |
| Motor o API | Diagramas propios y ensamblado 3D |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | El ensamblado se ve pieza a pieza sin animación |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Módulo Sonobe, atribuido y documentado desde 1968; diagramas originales |
| Ola | A |
| **Criterio de aprobación humana** | Los ocho pasos de plegado y los seis de ensamblado recorridos, y la hoja impresa. |

#### `E26` · Un atasco que nadie provoca

*A traffic jam nobody causes*

Un atasco fantasma aparece sin accidente ni obra.

| Campo | |
|---|---|
| Estudio principal | Simulaciones |
| Estudios secundarios | Mapas |
| Etapas | Adolescencia, adultez |
| Tipo | Estudio |
| Artefacto final | CSV y diagrama espacio-tiempo |
| Motor o API | Nagel y Schreckenberg (1992) |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Con movimiento reducido arranca en modo paso a paso |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Un diagrama espacio-tiempo donde se ven las bandas de atasco y la velocidad media medida. |

#### `E27` · Un ecosistema que no se muere

*An ecosystem that stays alive*

Depredador y presa se regulan; el equilibrio es dinámico.

| Campo | |
|---|---|
| Estudio principal | Simulaciones |
| Estudios secundarios | Mundos |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | CSV de poblaciones y gráfico PNG |
| Motor o API | Agentes en rejilla y Lotka-Volterra con RK4 |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | La tabla de datos sustituye al gráfico para lectores de pantalla |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Conejos y zorros vivos a los 500 pasos, con los parámetros usados anotados. |

#### `E28` · Cincuenta palabras exactas

*Exactly fifty words*

Una historia completa cabe en cincuenta palabras si sobra todo lo demás.

| Campo | |
|---|---|
| Estudio principal | Escritura con restricciones |
| Estudios secundarios | Cómic y guion gráfico |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | TXT, MD y HTML accesible |
| Motor o API | Comprobador de reglas del estudio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | El contador avisa en vivo; no hay tiempo límite |
| Alternativa al arrastre (2.5.7) | No aplica: es texto |
| Teclado | Edición completa con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Cincuenta palabras exactas y un relato con principio y final. |

#### `E29` · Un texto sin la letra e

*A text without the letter e*

Una restricción dura obliga a buscar el vocabulario que no se usa.

| Campo | |
|---|---|
| Estudio principal | Escritura con restricciones |
| Estudios secundarios | Lenguas inventadas |
| Etapas | Adolescencia, adultez |
| Tipo | Estudio |
| Artefacto final | TXT y PDF por impresión |
| Motor o API | Lipograma del estudio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Se puede elegir si las vocales con tilde cuentan como la misma letra |
| Alternativa al arrastre (2.5.7) | No aplica |
| Teclado | Edición completa con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Cien palabras sin una sola «e» y sin avisos de la comprobación. |

#### `E30` · Una isla con tres especies

*An island with three species*

Hábitat: una especie necesita que su terreno exista.

| Campo | |
|---|---|
| Estudio principal | Mundos |
| Estudios secundarios | Simulaciones |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | Atlas HTML y mapa PNG |
| Motor o API | Generador con semilla del estudio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | El generador propone una isla si no se quiere dibujar |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Tierra rodeada de agua y tres especies cuyo hábitat existe en el mapa. |

#### `E31` · Un calendario que no es el nuestro

*A calendar that is not ours*

Medir el tiempo es una decisión cultural, no un hecho.

| Campo | |
|---|---|
| Estudio principal | Mundos |
| Estudios secundarios | Lenguas inventadas |
| Etapas | Adolescencia, adultez |
| Tipo | Estudio |
| Artefacto final | Atlas HTML con la vista de calendario |
| Motor o API | Calendario propio del estudio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | La revisión avisa de fechas imposibles |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Meses, días de la semana y al menos una fiesta en una fecha válida del calendario inventado. |

#### `E32` · Veinte signos y ni uno más

*Twenty signs and not one more*

Un sistema de escritura es un conjunto cerrado de decisiones.

| Campo | |
|---|---|
| Estudio principal | Lenguas inventadas |
| Estudios secundarios | Diseño gráfico |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | Alfabeto SVG y PNG |
| Motor o API | Diseñador de signos por trazos |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Los signos se trazan por dos toques o con teclado |
| Alternativa al arrastre (2.5.7) | Dos toques entre puntos de la rejilla |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Veinte signos dibujados, con su romanización, y una palabra escrita con ellos. |

#### `E33` · Cien palabras para empezar

*A hundred words to begin with*

Con cien palabras básicas ya se puede decir casi todo.

| Campo | |
|---|---|
| Estudio principal | Lenguas inventadas |
| Estudios secundarios | Escritura con restricciones |
| Etapas | Adolescencia, adultez |
| Tipo | Estudio |
| Artefacto final | Diccionario CSV |
| Motor o API | Generador con semilla y fonotaxis |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | La lista de conceptos básicos propone qué falta |
| Alternativa al arrastre (2.5.7) | No aplica |
| Teclado | Edición completa con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Lista de conceptos inspirada en Swadesh (1955); palabras generadas por la persona |
| Ola | A |
| **Criterio de aprobación humana** | Cien entradas con significado en los dos idiomas y categoría. |

#### `E34` · Un juego para dos con cinco reglas

*A two-player game with five rules*

Menos reglas y más decisiones: la economía del diseño de juego.

| Campo | |
|---|---|
| Estudio principal | Juegos de mesa |
| Estudios secundarios | Ideas e inventos |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | Tablero, cartas y reglas imprimibles |
| Motor o API | Tablero y mazo del estudio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | El tablero de recorrido ya viene montado como punto de partida |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Cinco reglas contadas, dos jugadores y una partida completa jugada en el propio estudio. |

#### `E35` · Que no gane siempre quien empieza

*So the first player does not always win*

La ventaja del primer jugador se mide, no se intuye.

| Campo | |
|---|---|
| Estudio principal | Juegos de mesa |
| Estudios secundarios | Simulaciones |
| Etapas | Adolescencia, adultez |
| Tipo | Estudio |
| Artefacto final | Reglas y datos de la simulación |
| Motor o API | Montecarlo del estudio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | La tabla alternativa da los mismos datos que el gráfico |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Ventaja del primer jugador por debajo de diez puntos en la simulación, con el número de partidas anotado. |

#### `E36` · Ocho ideas en ocho minutos

*Eight ideas in eight minutes*

Cantidad antes que calidad: la primera idea rara vez es la buena.

| Campo | |
|---|---|
| Estudio principal | Ideas e inventos |
| Estudios secundarios | Dibujo |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | Tablero PNG y Markdown |
| Motor o API | Tablero y temporizador del estudio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | El temporizador lo inicia, pausa y alarga la persona (WCAG 2.2.1) |
| Alternativa al arrastre (2.5.7) | Notas movidas con flechas o por campos |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Ocho notas distintas en el tablero; el tiempo es orientativo, no obligatorio. |

#### `E37` · Un invento que cabe en el presupuesto

*An invention that fits the budget*

Las restricciones reales (coste, peso, tamaño) mejoran las ideas.

| Campo | |
|---|---|
| Estudio principal | Ideas e inventos |
| Estudios secundarios | Máquinas e inventos |
| Etapas | Adolescencia, adultez |
| Tipo | Estudio |
| Artefacto final | Ficha de invento imprimible |
| Motor o API | Ficha y comprobaciones del estudio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Las comprobaciones dicen qué falta sin bloquear |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Ficha completa con piezas, precio y peso dentro de los límites del encargo. |

#### `E38` · Un ritmo que se reconoce

*A rhythm you can recognise*

El acento y el silencio hacen el ritmo tanto como el golpe.

| Campo | |
|---|---|
| Estudio principal | Ritmo y secuenciador |
| Estudios secundarios | Composición |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | WAV y MIDI |
| Motor o API | Tone.js con Transport |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | El sonido solo empieza cuando la persona lo pide |
| Alternativa al arrastre (2.5.7) | Notas por campos de inicio, duración y altura |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Un patrón de cuatro compases exportado en WAV y en MIDI. |

#### `E39` · Una melodía con tres acordes

*A tune over three chords*

Tensión y reposo: por qué unos acordes piden volver.

| Campo | |
|---|---|
| Estudio principal | Composición |
| Estudios secundarios | Ritmo y secuenciador |
| Etapas | Adolescencia, adultez |
| Tipo | Estudio |
| Artefacto final | WAV y MIDI |
| Motor o API | Tone.js; piano roll del estudio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Las notas se colocan con campos, sin arrastrar |
| Alternativa al arrastre (2.5.7) | Campos de inicio, duración y altura |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Dieciséis compases con tres acordes y una melodía que empieza y termina en reposo. |

#### `E40` · Un sonido que no existe

*A sound that does not exist*

Osciladores, envolvente y filtro: de dónde sale un timbre.

| Campo | |
|---|---|
| Estudio principal | Síntesis y paisajes sonoros |
| Estudios secundarios | Composición |
| Etapas | Adolescencia, adultez |
| Tipo | Estudio |
| Artefacto final | WAV |
| Motor o API | Tone.js y AudioWorklet propio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Los preajustes sirven de punto de partida |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Un timbre propio guardado, con la envolvente y el filtro anotados. |

#### `E41` · Luz que encaja en un objeto real

*Light that fits a real object*

Homografía: ajustar una imagen a cuatro esquinas del mundo real.

| Campo | |
|---|---|
| Estudio principal | Videomapping |
| Estudios secundarios | Modelado 3D |
| Etapas | Adolescencia, adultez |
| Tipo | Estudio |
| Artefacto final | Espectáculo HTML y proyecto |
| Motor o API | Homografía CSS matrix3d |
| Permisos | Ninguno |
| Hardware | Proyector, opcional |
| Alternativa | Sin proyector, el espectáculo se ve a pantalla completa |
| Alternativa al arrastre (2.5.7) | Esquinas por campos numéricos y por teclado |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Cuatro esquinas ajustadas y un espectáculo exportado que se reproduce solo. |

#### `E42` · Un programa que hace lo mismo de dos formas

*A program that does the same thing twice*

Bloques y texto son dos vistas del mismo programa.

| Campo | |
|---|---|
| Estudio principal | Programación |
| Estudios secundarios | Robótica |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | Proyecto y código JavaScript |
| Motor o API | Blockly, CodeMirror y acorn; intérprete sin eval |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Los datos del bloque elegido se editan también desde Propiedades |
| Alternativa al arrastre (2.5.7) | Campos en Propiedades para cada dato del bloque |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | El mismo resultado en bloques y en código, con el paso de uno a otro hecho. |

#### `E43` · Un robot que sigue la línea

*A robot that follows the line*

Sensor, decisión y motor: el bucle de control.

| Campo | |
|---|---|
| Estudio principal | Robótica |
| Estudios secundarios | Programación |
| Etapas | Adolescencia, adultez |
| Tipo | Estudio |
| Artefacto final | Proyecto del gemelo digital |
| Motor o API | Gemelo digital del estudio |
| Permisos | Ninguno |
| Hardware | Ninguno en la ola A |
| Alternativa | El reto se completa entero sin hardware físico |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | El robot recorre el circuito entero sin salirse, con el programa a la vista. |

#### `E44` · Un nivel que se puede ganar

*A level you can actually win*

Dificultad: un nivel debe ser posible y no evidente.

| Campo | |
|---|---|
| Estudio principal | Videojuegos |
| Estudios secundarios | Estructuras y puentes |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | Juego HTML autocontenido |
| Motor o API | Planck.js y runtime propio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | El juego exportado se juega también solo con teclado |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Un nivel completado por su autor y exportado como HTML que abre sin conexión. |

#### `E45` · Un mapa que no necesita colores

*A map that needs no colours*

Tramas, símbolos y jerarquía sustituyen al color.

| Campo | |
|---|---|
| Estudio principal | Mapas |
| Estudios secundarios | Mundos |
| Etapas | Adolescencia, adultez |
| Tipo | Estudio |
| Artefacto final | Mapa SVG y leyenda |
| Motor o API | Estudio de Mapas (candidato) |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Ubicación siempre manual; nunca se pide geolocalización |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | B |
| **Criterio de aprobación humana** | Un mapa legible en escala de grises con leyenda completa. |

#### `E46` · Una ruta que cualquiera puede hacer

*A route anyone can take*

Pendiente, anchura y descansos: una ruta accesible se diseña.

| Campo | |
|---|---|
| Estudio principal | Mapas |
| Estudios secundarios | Datos |
| Etapas | Adolescencia, adultez |
| Tipo | Estudio |
| Artefacto final | Mapa y ficha de la ruta |
| Motor o API | Estudio de Mapas (candidato) |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Los datos los introduce la persona; no se pide ubicación |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Datos introducidos por la persona o de fuentes abiertas citadas |
| Ola | B |
| **Criterio de aprobación humana** | Una ruta con puntos de descanso y una ficha que declara pendiente y anchura. |

#### `E47` · Doce fotogramas que engañan al ojo

*Twelve frames that fool the eye*

Temporización y espaciado: el mismo recorrido cambia de carácter.

| Campo | |
|---|---|
| Estudio principal | Animación |
| Estudios secundarios | Pixel art |
| Etapas | Todas |
| Tipo | Estudio |
| Artefacto final | GIF y SVG animado |
| Motor o API | Estudio de Animación (candidato); línea de tiempo y papel cebolla |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Nunca arranca sola; con movimiento reducido, avance por pasos |
| Alternativa al arrastre (2.5.7) | Fotogramas por campos y por teclado |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | B |
| **Criterio de aprobación humana** | Un ciclo de doce fotogramas que repite sin salto, con la curva de tiempos anotada. |

#### `E48` · Una animación que explica algo

*An animation that explains something*

El movimiento sirve para entender, no para adornar.

| Campo | |
|---|---|
| Estudio principal | Animación |
| Estudios secundarios | Datos, Diseño gráfico |
| Etapas | Adolescencia, adultez |
| Tipo | Estudio |
| Artefacto final | SVG animado y GIF |
| Motor o API | Estudio de Animación (candidato) |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Versión estática equivalente obligatoria |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | B |
| **Criterio de aprobación humana** | Una animación con versión estática equivalente y sin más de tres destellos por segundo. |

### 7.2 · Proyectos cruzados (X01–X08)

#### `X01` · Un videojuego con todo tuyo

*A video game made entirely by you*

Un producto se monta con piezas hechas en sitios distintos: dibujo, sonido y código.

| Campo | |
|---|---|
| Estudio principal | Videojuegos |
| Estudios secundarios | Pixel art, Ritmo y secuenciador, Programación |
| Etapas | Todas |
| Tipo | Cruzado |
| Artefacto final | Juego HTML autocontenido con tus gráficos y tu música |
| Motor o API | PixiJS, Tone.js, Planck.js y el intérprete propio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Cada parte se puede sustituir por la que trae el estudio: el reto no se rompe si falta una |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Un juego jugable, exportado, con al menos un sprite propio y un tema musical propio. |

#### `X02` · Un cómic con su cartel y su tipografía

*A comic with its own poster and lettering*

Identidad visual: que una historia, su cartel y su letra parezcan la misma cosa.

| Campo | |
|---|---|
| Estudio principal | Cómic y guion gráfico |
| Estudios secundarios | Diseño gráfico, Color, Escritura con restricciones |
| Etapas | Todas |
| Tipo | Cruzado |
| Artefacto final | ZIP de páginas, cartel SVG y paleta |
| Motor o API | Lienzo vectorial común |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | La paleta y la revisión de contraste guían si no se sabe por dónde empezar |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Tres piezas que comparten paleta y tipografía, y la revisión de legibilidad sin avisos. |

#### `X03` · Una casa que se sostiene

*A house that holds itself up*

Lo que se dibuja tiene que aguantar: del plano a la estructura.

| Campo | |
|---|---|
| Estudio principal | Arquitectura y planos |
| Estudios secundarios | Estructuras y puentes, Modelado 3D |
| Etapas | Adolescencia, adultez |
| Tipo | Cruzado |
| Artefacto final | Planta SVG, modelo GLB e imagen del cálculo |
| Motor o API | SVG, Three.js y Planck.js |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Sin WebGPU funciona en WebGL 2; el plano y el cálculo no dependen del 3D |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Revisión orientativa CTE DB-SUA; no es un proyecto técnico |
| Ola | A |
| **Criterio de aprobación humana** | Una planta que pasa la revisión de accesibilidad y una estructura que pasa la prueba de carga. |

#### `X04` · Un mundo con su lengua y su mapa

*A world with its own language and map*

Coherencia: los nombres del mapa salen de la lengua, y la historia del calendario.

| Campo | |
|---|---|
| Estudio principal | Mundos |
| Estudios secundarios | Lenguas inventadas, Mapas, Escritura con restricciones |
| Etapas | Todas |
| Tipo | Cruzado |
| Artefacto final | Atlas HTML con mapa, diccionario y un texto traducido |
| Motor o API | Generadores con semilla de los tres estudios |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Mapas entra en la ola B; hasta entonces el mapa del propio estudio Mundos basta |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Un atlas donde al menos cinco topónimos vienen del diccionario de la lengua inventada. |

#### `X05` · Un juego de mesa impreso y probado

*A printed, playtested board game*

Diseñar, medir y corregir: un juego se prueba con números además de con partidas.

| Campo | |
|---|---|
| Estudio principal | Juegos de mesa |
| Estudios secundarios | Diseño gráfico, Simulaciones, Ideas e inventos |
| Etapas | Adolescencia, adultez |
| Tipo | Cruzado |
| Artefacto final | Tablero, cartas y reglas impresas, más los datos del equilibrio |
| Motor o API | Montecarlo y lienzo vectorial |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Si no hay impresora, todo el material existe en PNG y SVG |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Material completo impreso o exportado y una simulación que respalda un cambio de regla. |

#### `X06` · Un instrumento que ves y oyes

*An instrument you can see and hear*

El sonido tiene forma: la misma información alimenta lo que se oye y lo que se ve.

| Campo | |
|---|---|
| Estudio principal | Síntesis y paisajes sonoros |
| Estudios secundarios | Programación, Animación, Composición |
| Etapas | Adolescencia, adultez |
| Tipo | Cruzado |
| Artefacto final | WAV, proyecto y visual exportado |
| Motor o API | Tone.js, AudioWorklet y PixiJS |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | El visual tiene versión estática; el audio nunca arranca solo |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | B |
| **Criterio de aprobación humana** | Un sonido propio y un visual que responde a él, con versión estática equivalente. |

#### `X07` · Una explicación que se entiende a la primera

*An explanation that lands first time*

Dividir una idea difícil en pasos y elegir qué no contar.

| Campo | |
|---|---|
| Estudio principal | Diseño gráfico |
| Estudios secundarios | Datos, Animación, Escritura con restricciones |
| Etapas | Adolescencia, adultez |
| Tipo | Cruzado |
| Artefacto final | Infografía SVG, versión animada y texto |
| Motor o API | Lienzo vectorial y estudio de Animación (candidato) |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | La versión estática es obligatoria y suficiente |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Datos con fuente citada; ilustración original |
| Ola | B |
| **Criterio de aprobación humana** | Una infografía que una persona ajena entiende sin preguntar, y sus fuentes citadas. |

#### `X08` · Una máquina que se puede montar

*A machine you could actually build*

De la idea al objeto: medidas, materiales, energía y coste.

| Campo | |
|---|---|
| Estudio principal | Máquinas e inventos |
| Estudios secundarios | Modelado 3D, Circuitos, Ideas e inventos |
| Etapas | Adolescencia, adultez |
| Tipo | Cruzado |
| Artefacto final | Ficha técnica, STL de una pieza y esquema del circuito |
| Motor o API | Planck.js, Three.js y el solver de circuitos |
| Permisos | Ninguno |
| Hardware | Ninguno en la ola A |
| Alternativa | Todo el reto se completa sin comprar ni conectar nada |
| Alternativa al arrastre (2.5.7) | Campos numéricos en los tres estudios |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Sin dependencia |
| Propiedad intelectual | Todo original; sin marcas ni personajes |
| Ola | A |
| **Criterio de aprobación humana** | Ficha con piezas y coste, una pieza exportada en STL y un circuito que enciende algo. |

### 7.3 · Retos de calendario (C01–C08)

Cuatro están anclados a una fecha real futura y cuatro son permanentes, nacidos de una efeméride que ya pasó. Los ocho siguen sirviendo el día después de la fecha. Las fuentes están en la sección 9.

#### `C01` · El eclipse del 2 de agosto de 2027

*The eclipse of 2 August 2027*

Por qué la totalidad se ve en una franja estrecha y cuánto dura según dónde estés.

| Campo | |
|---|---|
| Estudio principal | Mapas |
| Estudios secundarios | Modelado 3D, Simulaciones, Diseño gráfico |
| Etapas | Todas |
| Tipo | Calendario · fecha real |
| Artefacto final | Mapa de la franja de totalidad, animación del cono de sombra y ficha de tu sitio |
| Motor o API | Mapas (candidato), Three.js y el estudio de Simulaciones |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | La ubicación se elige a mano en el mapa; nunca se pide geolocalización |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Fecha real: 2 de agosto de 2027. Después del eclipse el reto sigue en pie como reconstrucción. |
| Propiedad intelectual | Datos del IGN; ilustración original. Aviso obligatorio de seguridad: no mirar al Sol sin filtro homologado. |
| Ola | B |
| **Criterio de aprobación humana** | Una franja de totalidad correcta y la duración en dos lugares distintos, con la fuente citada. |

#### `C02` · Doscientos años sin Beethoven

*Two hundred years without Beethoven*

Tema y variación: cómo una idea corta sostiene una pieza entera.

| Campo | |
|---|---|
| Estudio principal | Composición |
| Estudios secundarios | Ritmo y secuenciador, Animación, Diseño gráfico |
| Etapas | Adolescencia, adultez |
| Tipo | Calendario · fecha real |
| Artefacto final | WAV y MIDI de una variación propia, más su visualización |
| Motor o API | Tone.js y el piano roll del estudio |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | La variación se puede escribir con campos, sin arrastrar ni oído previo |
| Alternativa al arrastre (2.5.7) | Campos de inicio, duración y altura |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Fecha real: 26 de marzo de 2027, bicentenario de su muerte. El reto no caduca. |
| Propiedad intelectual | Partituras en dominio público; nunca grabaciones modernas protegidas. La variación es original. |
| Ola | A |
| **Criterio de aprobación humana** | Una variación propia sobre un tema de dominio público, exportada, con la fuente de la partitura citada. |

#### `C03` · Cien años de una generación

*A hundred years of a generation*

Escribir «a la manera de» una vanguardia sin copiar a nadie: la forma, no el texto.

| Campo | |
|---|---|
| Estudio principal | Escritura con restricciones |
| Estudios secundarios | Cómic y guion gráfico, Diseño gráfico, Lenguas inventadas |
| Etapas | Adolescencia, adultez |
| Tipo | Calendario · fecha real |
| Artefacto final | Texto, cartel y una página de cómic |
| Motor o API | Comprobador de reglas y lienzo vectorial |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Se completa solo con el editor de texto |
| Alternativa al arrastre (2.5.7) | No aplica en la parte escrita |
| Teclado | Edición completa con teclado |
| Dependencia temporal | Fecha real: centenario en 2027, con programa oficial del Ministerio de Cultura. El reto no caduca. |
| Propiedad intelectual | Creación propia. No se reproduce texto protegido. Se incluyen expresamente las creadoras del 27. |
| Ola | A |
| **Criterio de aprobación humana** | Un texto original con una forma declarada, y una nota de en qué se ha fijado y en qué no. |

#### `C04` · Falla, ciento cincuenta años después

*Falla, a hundred and fifty years on*

Tomar una idea musical popular y hacerla propia, que es lo que hizo él.

| Campo | |
|---|---|
| Estudio principal | Composición |
| Estudios secundarios | Diseño gráfico, Síntesis y paisajes sonoros |
| Etapas | Adolescencia, adultez |
| Tipo | Calendario · permanente |
| Artefacto final | WAV o MIDI de una pieza propia y un cartel |
| Motor o API | Tone.js y lienzo vectorial |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Se completa solo con el cartel si no se quiere componer |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Reformulado como permanente: el sesquicentenario de su nacimiento fue en 2026 (1876). |
| Propiedad intelectual | Obra propia. Las obras de Falla (m. 1946) entran en dominio público en España a partir de 2027 por la regla de 80 años para autores fallecidos antes de 1987, sujeto a derechos de ediciones e interpretaciones concretas. |
| Ola | A |
| **Criterio de aprobación humana** | Una pieza o un cartel originales y una línea sobre qué idea se ha tomado y de dónde. |

#### `C05` · Geometría que sostiene

*Geometry that holds*

Curvas y superficies regladas: la forma que decora también es la que aguanta.

| Campo | |
|---|---|
| Estudio principal | Arquitectura y planos |
| Estudios secundarios | Patrones y arte generativo, Estructuras y puentes, Modelado 3D |
| Etapas | Adolescencia, adultez |
| Tipo | Calendario · permanente |
| Artefacto final | Planta SVG, mosaico y modelo 3D |
| Motor o API | SVG, Three.js y Planck.js |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | El mosaico y la planta bastan si no hay 3D |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Reformulado como permanente: el centenario de la muerte de Gaudí fue en 2026 (1926). |
| Propiedad intelectual | Nada de reproducir obra concreta ni sus mosaicos: el reto trabaja la geometría, con creación propia. |
| Ola | A |
| **Criterio de aprobación humana** | Una estructura propia que usa una superficie reglada y pasa la prueba de carga. |

#### `C06` · Los pastos, contados con datos

*Rangelands, told with data*

Un territorio y un modo de vida se explican con capas: suelo, agua, ganado y tiempo.

| Campo | |
|---|---|
| Estudio principal | Mapas |
| Estudios secundarios | Datos, Simulaciones, Mundos |
| Etapas | Adolescencia, adultez |
| Tipo | Calendario · permanente |
| Artefacto final | Mapa, gráfico con tabla alternativa y texto |
| Motor o API | Mapas (candidato) y el estudio de Simulaciones |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | El mapa del estudio Mundos sirve mientras Mapas esté en la ola B |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Reformulado como permanente: el Año Internacional de los Pastizales y los Pastores fue 2026 (A/RES/76/253). |
| Propiedad intelectual | Datos de la FAO con fecha de consulta. Evitar el exotismo: comunidades pastoriles de varias regiones y con su propia voz. |
| Ola | B |
| **Criterio de aprobación humana** | Un mapa con leyenda, un gráfico con tabla alternativa y las fuentes citadas con fecha. |

#### `C07` · Diseña una misión para encontrar planetas

*Design a mission to find planets*

El método del tránsito: un planeta se detecta porque su estrella pierde brillo un poquito.

| Campo | |
|---|---|
| Estudio principal | Simulaciones |
| Estudios secundarios | Modelado 3D, Datos, Diseño gráfico |
| Etapas | Adolescencia, adultez |
| Tipo | Calendario · permanente |
| Artefacto final | Curva de luz simulada, ficha de misión y esquema del satélite |
| Motor o API | Simulaciones y Three.js |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | La curva de luz se genera con los parámetros que elige la persona |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | La fecha de lanzamiento de PLATO no es estable (la ESA la ha movido), así que es contexto y no dependencia. |
| Propiedad intelectual | Datos de la ESA con fecha de consulta; esquema original. |
| Ola | A |
| **Criterio de aprobación humana** | Una curva de luz con un tránsito visible y una ficha que justifica cuántas cámaras y durante cuánto tiempo. |

#### `C08` · Un sitio que aguante las visitas

*A place that can take the visitors*

Capacidad de carga: cuántas personas caben en un sitio sin estropearlo.

| Campo | |
|---|---|
| Estudio principal | Mapas |
| Estudios secundarios | Datos, Juegos de mesa, Diseño gráfico |
| Etapas | Adolescencia, adultez |
| Tipo | Calendario · fecha real |
| Artefacto final | Mapa de carga turística, simulación de visitantes y propuesta |
| Motor o API | Mapas (candidato) y Montecarlo |
| Permisos | Ninguno |
| Hardware | No |
| Alternativa | Ubicación manual; los datos los introduce la persona |
| Alternativa al arrastre (2.5.7) | Campos numéricos en Propiedades y dos toques en el lienzo |
| Teclado | Recorrido completo con teclado |
| Dependencia temporal | Fecha real: 2027 es el Año Internacional del Turismo Sostenible y Resiliente (A/RES/78/260). El reto no caduca. |
| Propiedad intelectual | Datos de fuentes abiertas citadas con fecha; cartografía propia o de fuente con licencia compatible. |
| Ola | B |
| **Criterio de aprobación humana** | Un mapa con una propuesta concreta y una simulación que la respalda, con fuentes citadas. |

---

## 8 · Los ocho retos de calendario, verificados

Esto responde al hallazgo 3 de Astra: antes había 8 retos anunciados y solo 7 temas. Ahora hay ocho, y se distingue con claridad cuál depende de una fecha futura y cuál no.

| ID | Tema | Fecha | ¿Depende de la fecha? | Qué se hizo |
|---|---|---|---|---|
| `C01` | Eclipse total en el sur de España | 2 de agosto de 2027 | **Sí**, es un hito futuro | Se mantiene. Después del eclipse sigue en pie como reconstrucción de lo ocurrido. |
| `C02` | Bicentenario de la muerte de Beethoven | 26 de marzo de 2027 | **Sí**, es un hito futuro | Se mantiene. La pieza propia no caduca. |
| `C03` | Centenario de la Generación del 27 | 2027 | **Sí**, es un hito futuro | Se mantiene, con cautela de propiedad intelectual y con las creadoras del 27 incluidas expresamente. |
| `C08` | Año Internacional del Turismo Sostenible y Resiliente | 2027 | **Sí**, es un hito futuro | Reto nuevo. Es el octavo que faltaba y evita que el bloque se apoyara en efemérides ya pasadas. |
| `C04` | Manuel de Falla, 150 años de su nacimiento | 1876 → **2026** | **No** | Reformulado como permanente, tal y como pidió Astra. |
| `C05` | Centenario de la muerte de Gaudí | 1926 → **2026** | **No** | Reformulado como permanente y desplazado hacia la geometría, sin reproducir obra concreta. |
| `C06` | Año Internacional de los Pastizales y los Pastores | **2026** | **No** | Reformulado como permanente. |
| `C07` | Misión PLATO de la ESA | Lanzamiento sin fecha estable | **No** | La fecha es contexto. La ESA la ha movido y la ficha pública y el seguimiento de lanzamientos no coinciden hoy, así que el reto no puede depender de ella. |

Cuatro dependen de una fecha real futura y cuatro no dependen de ninguna. Los ocho siguen teniendo sentido el día siguiente.

### Dato de apoyo para `C01`

El Instituto Geográfico Nacional sitúa la franja de totalidad del 2 de agosto de 2027 sobre Ceuta, Melilla, casi toda la provincia de Cádiz, buena parte de Málaga y el sur de Granada y Almería. La totalidad más larga en territorio español es la de Ceuta, con 4 minutos y 48 segundos. En el resto de España el eclipse será parcial, con un oscurecimiento mínimo del 70 %.

El reto llevará obligatoriamente el aviso de seguridad: **no se mira al Sol sin un filtro homologado**, tampoco durante la fase parcial.

---

## 9 · Propiedad intelectual

Regla general de los 64: todo lo que se muestra en el Taller es original. Nada de marcas, logotipos, personajes ni diseños conocidos.

Los cuatro casos que necesitan cuidado extra:

- **`C02` Beethoven.** Se trabaja sobre partituras en dominio público. **Nunca sobre grabaciones modernas**, que siguen protegidas por derechos conexos. Lo que produce la persona es una variación propia.
- **`C03` Generación del 27.** No se reproduce texto protegido. Se escribe *a la manera de* una vanguardia: se toma la forma, no las palabras. Se incluyen expresamente las creadoras del 27, a menudo ausentes del relato habitual.
- **`C04` Falla.** Falla murió en 1946. En España, la regla de 80 años para autores fallecidos antes de 1987 sitúa la entrada de sus obras en dominio público a partir de 2027, sujeta a los derechos de ediciones e interpretaciones concretas. El reto no depende de ello porque lo que se pide es obra propia.
- **`C05` Gaudí.** No se reproduce ninguna obra concreta ni sus mosaicos. El reto trabaja la geometría (superficies regladas, catenarias, teselados) con creación propia.

Para los datos (`C06`, `C07`, `C08`) se conserva fuente, organismo, URL, fecha de publicación y fecha de consulta, como pide el marco normativo transversal.

---

## 10 · Las tres olas

Astra pidió no cerrar 21 / 16 / 27 hasta tener la lista. Con la lista delante, la distribución real es otra.

### Ola A · 55 retos · nada nuevo

Usan los 27 estudios y los motores que ya están en producción tras R47. No piden permisos, ni hardware, ni API nueva, ni almacenamiento nuevo. Todos exportan un artefacto y todos tienen alternativa accesible.

**Es la única ola que se puede autorizar hoy.**

### Ola B · 9 retos · necesitan un estudio candidato

`E45`, `E46`, `E47`, `E48`, `X06`, `X07`, `C01`, `C06` y `C08`. Dependen de **Animación** o de **Mapas**, que aún no existen. No piden permisos ni hardware: lo que falta es el estudio, no una capacidad del navegador.

Si María aprueba solo la ola A, estos nueve esperan y ningún otro reto se resiente.

### Ola C · 0 retos · las capacidades opcionales

MIDI, microcontroladores y voz. **No hay ningún reto aquí.** Son mejoras para retos que ya se completan sin ellas. Esto cumple la regla de Astra: el hardware y los permisos nunca son la única forma de terminar algo.

---

## 11 · Qué hace falta para construir

1. **María decide la dirección** y, si procede, autoriza la ola A.
2. **Astra revisa los 64 uno a uno** con esta matriz delante y marca los que no pasen.
3. Solo entonces se construye, y por tandas pequeñas, no como lote de 64.
4. Cada reto construido se añade al inventario de protección infantil (`assets/data/taller-childsafe.json`) con sus metadatos, y el gate de 0 elementos sin clasificar se vuelve a comprobar.
5. Cada reto construido pasa las mismas pruebas que un estudio: axe sin infracciones en los seis anchos, recorrido con teclado, guardar y abrir idénticos, y la exportación abierta y comprobada.
6. Decisión aparte, pendiente: **Animación** y **Mapas** como estudios. Sin ellos, la ola B no arranca.

**Límites que se mantienen:** no main, no producción, sin cambiar la CSP ni la `Permissions-Policy`, sin almacenamiento nuevo y sin mezclar R44 con el Taller entregado en R47.

---

## 12 · Fuentes

Consultadas el 28 de septiembre de 2026.

- Instituto Geográfico Nacional, «El eclipse total del 2 de agosto de 2027». https://eclipses.ign.es/eclipse-total-sol-de-2-de-agosto-2027.html
- Instituto Geográfico Nacional, Astronomía, eclipses de Sol y Luna. https://astronomia.ign.es/en/eclipses-de-sol-y-luna/eclipse-total-sol-de-2-de-agosto-2027
- Boosey & Hawkes, «Beethoven 2027: conmemoración del bicentenario de la muerte del compositor». https://www.boosey.com/cr/news/Beethoven-2027-conmemoracion-del-bicentenario-de-la-muerte-del-compositor/102643
- Ministerio de Cultura, «El Ministerio de Cultura impulsa la celebración del Centenario de la Generación del 27». https://www.cultura.gob.es/actualidad/2025/06/20250611-presentacion-generacion-27.html
- Ministerio de Cultura, portal del centenario de la Generación del 27. https://generaciondel27.cultura.gob.es/lageneracion.html
- Naciones Unidas, Años Internacionales. https://www.un.org/es/observances/international-years
  - Año Internacional del Turismo Sostenible y Resiliente, 2027 · resolución A/RES/78/260.
  - Año Internacional de los Pastizales y los Pastores, 2026 · resolución A/RES/76/253.
- Agencia Espacial Europea, ficha de la misión PLATO. https://www.esa.int/Science_Exploration/Space_Science/Plato_factsheet
- Agencia Espacial Europea, página de la misión PLATO. https://www.esa.int/Science_Exploration/Space_Science/Plato

Las efemérides de Falla y de Gaudí las verificó Astra en su auditoría del 27 de septiembre de 2026 (BOE y Fundación Falla para 1876; centenario de Gaudí en 2026), y esta matriz se apoya en esa verificación.

Fuentes de contenido que ya usan los estudios implicados (Machado y otros 2009 para la visión del color, Nagel y Schreckenberg 1992 para el tráfico, Lotka 1925 y Volterra 1926 para el ecosistema, Swadesh 1955 para la lista de conceptos, IEC 60617 para la simbología eléctrica, CTE DB-SUA para la revisión de accesibilidad) están citadas en la página de cada estudio y no se repiten aquí.

---

## 13 · Trazabilidad

| | |
|---|---|
| Documento | `MEMORIA/R44_MATRIZ_64_RETOS_TALLER_CLAUDE_20260928.md` |
| Control | `CONTROL/DELTA_R44_MATRIZ_64_RETOS_20260928.json` |
| Responde a | `MEMORIA/R44_RETOS_TALLER_AUDITORIA_ASTRA_20260927.md` |
| Sustituye a | `MEMORIA/PROPUESTA_R44_RETOS_TALLER_CLAUDE_20260927.md` |
| Producto sobre el que se construiría | Taller R47, 27 estudios, HEAD `65647fd9` |
| Estado | `R44_TALLER_RETOS_MATRIZ_64_64_FOR_ASTRA` |
| Siguiente paso | Revisión individual de Astra y decisión de María sobre la ola A |

Ningún gate se aprueba solo con un resumen de chat: los 64 están aquí, uno a uno, con sus dieciocho campos.
