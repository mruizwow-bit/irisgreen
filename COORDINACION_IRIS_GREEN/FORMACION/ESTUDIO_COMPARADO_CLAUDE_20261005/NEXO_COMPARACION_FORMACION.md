# Nexo · Lo conocido, lo no aplicado y la formación que falta demostrar

Fecha: 2026-10-05. Síntesis propia después de leer los tres dominios. No atribuye capacidades internas a otro agente ni sustituye los estudios individuales encargados a Prisma y Axioma.

## Fuentes de formación realmente leídas

Todas bajo COORDINACION_IRIS_GREEN/FORMACION:

| Documento | Identidad consultada | Conocimiento documentado |
|---|---|---|
| NEXO/01_PLAN_FORMACION.md | blob d6bef5c64405848a58f3c694420f31efbef4da96 | Sistemas, verificación/validación, continuidad, fiabilidad, aprendizaje sin culpa. |
| NEXO/06_ESTUDIO_EXTENDIDO_R02_20261004.md | ref 9d88b97252fc5fd9dbc37daebba64893ab2a69c7; blob c7d9d1f3e993b05926e34878e328a5dc0ebdc05a | Producto distinto de técnica, manipulación directa, descubrimiento causal, QA perceptual, bytes reales. |
| NEXO/APRENDIZAJE_NEXO_2026-10-04.md | misma ref; blob 97ab53284ed05e9e1a4cabb7e415e46c3f68468a | Solver no demuestra buen juego, métricas no demuestran percepción, historial no equivale a estado vivo. |
| A8_PRISMA/APRENDIZAJE_PRISMA_2026-10-03.md | blob c33301da53b9937d30750b52dc758801d2e3e33f | Plataforma, tokens, fuente editable, exportación, copy y contrato de assets. |
| A8_PRISMA/APRENDIZAJE_PRISMA_2026-10-04.md | blob 266f66da5d3123a14e33e35e210e2212d3c02acd | Artefacto no equivale a runtime, fidelidad al diseño, tokens y evidencia de CI. |

La formación R02 de Nexo se recuperó del handoff fijado, no de la carpeta actual de main. Hay una lección de continuidad: un currículo existente pero ausente de la entrada de trabajo no se aplica por estar escrito. No se han trasladado esos documentos a main. La gobernanza antigua de los documentos no anula las restricciones actuales de esta tarea.

No se localizó aquí el currículo canónico de Axioma; su orden exige recuperarlo y citarlo. Esa ausencia de acceso no demuestra falta de formación.

## Diagnóstico basado en código

| Dominio | Qué demuestra la implementación estudiada | Ya estaba en nuestra formación | Qué debe aprenderse o practicarse |
|---|---|---|---|
| Cielo | Proyección común, etapas explícitas, cámara cancelable y foco según origen; la base histórica acopla selección al centro. | Escena principal, acción semántica, continuidad. | Traducir intención a eventos y coordenadas; separar cámara/selección; diseñar profundidad encontrable. |
| Peces | Mundo mayor que vista, gesto diferenciado, muestras iluminadas coherentes, pose separada del reloj, DOM por id. | Descubrimiento causal, estados de movimiento, verificación perceptual. | Geometría y aproximaciones; tiempo independiente de refresco; propiedad/cancelación de animaciones; identidad del DOM y foco. |
| Webs | Tokens consumidos, fuentes locales, layout fluido, semántica y rutas en Descubrimiento; exportación visual fija en Juegos. | Canon, generador canónico, artefacto versus producto. | Contratos entre diseño/exportación/runtime; fuente única de datos; estados de navegación y restauración. |
| Construcción propia | Apoyo, costes, undo y guardado implementados; z no proyectada visualmente, personaje geométrico y casillas restringidas. | Prototype-first y tarea antes de interfaz. | Representación espacial, picking, locomoción, decisiones jugables y feedback. No confundir variable z con altura percibida. |
| Evaluación | Pruebas útiles de invariantes, rutas y estructuras, con conclusiones a veces más amplias que sus aserciones. | TECHNICAL_PASS != PRODUCT_PASS. | Diseñar el oráculo desde la pregunta; probar que detecta un defecto; observación de tareas y crítica perceptual previa. |

Conclusión limitada: conocemos muchos principios; no hemos demostrado aplicarlos de forma consistente a productos interactivos. No hay base para afirmar que falta inteligencia, voluntad o un framework. Tampoco basta con repetir principios o añadir más hashes.

## Qué aprendo yo de Claude

1. **Especificar consecuencias junto a invariantes.** En Peces, iluminación, anatomía visible y examinable se conectan. En Construcción, una regla correcta no produce por sí sola altura visible. Mi encargo debe explicar qué cambia para la persona, además de qué variable queda correcta.
2. **Descomponer control y continuidad.** Cámara, selección, reloj, pose, panel y foco tienen propietarios y reglas distintas. «Pausar» o «volver» son demasiado ambiguos sin enumerar qué se conserva y qué se cancela.
3. **Distinguir productos de sus representaciones.** Un frame HTML con enlaces puede seguir siendo un frame. Un catálogo navegable puede terminar en un placeholder. Debo describir la frontera real, aunque el paquete venga bien presentado.
4. **Reconocer el proceso iterativo.** Claude tampoco llegó completo al primer intento. Sus mejoras nacieron de observaciones concretas de María y correcciones con reproducción. Estudiar esa evolución enseña más que copiar el último archivo.
5. **No externalizar toda la valoración básica a María.** Antes de pedirle una prueba, corresponde usar la experiencia, contrastar promesa con representación y detectar las carencias evidentes. Su HUMAN QA sigue siendo irremplazable; no debe ser la primera vez que alguien pregunta si la acción tiene sentido.

## Prácticas de Nexo y evidencia

Ejecutado ahora: lectura separada de tres bases; comparación de 42/39/75/7 archivos con cuatro ZIP; ejercicio de geometría de Cielo con tres configuraciones y 27 inversiones; banco puro de Peces en copia, 6/6 aserciones leídas. No se ha ejecutado navegador ni emitido aprobación nueva.

Ejercicio de especificación aplicado:

| Intención | Entrada | Estado | Consecuencia visible | Siguiente decisión |
|---|---|---|---|---|
| Examinar un punto del cielo | Señalar punto/zona y confirmar | Selección independiente; etapa sólo cambia al examinar | Marca donde se señaló, campo inmóvil; patrón localizado si procede | Revelar o seguir buscando |
| Observar un animal | Recorrer, iluminar, examinar | Cámara/luz y pose coherentes; pausa temporal | Cuerpo visible examinado conserva encuadre | Profundizar o continuar con pausa manual respetada |
| Subir a una terraza | Elegir apoyo, colocar escalera, recorrer | Coste/apoyo/tránsito válidos | Altura y paso legibles en mundo; personaje llega a superficie | Abrir nueva posibilidad de construcción |

Lo pendiente de práctica no se presenta como realizado: ejercicio visual de dos alturas de Prisma, contraejemplos de pruebas de Axioma y comparación independiente entre sus informes. Después se incorpora al currículo sólo lo demostrado, con ejemplo y límite. No hace falta otro ciclo de documentación sin transferencia.

## Formación aplicada propuesta

Tres módulos técnicos: transformaciones/picking y representación espacial; máquinas de estado/tiempo/cancelación/foco; componentes web fluidos/datos/exportación. Dos módulos de producto y evaluación: diseño de decisiones y feedback; oráculos, observación y percepción. Cada módulo termina en un ejercicio pequeño explicado y usado, no en un cuestionario de definiciones.

Las órdenes incluyen decisiones de Claude que NO se deben copiar sin más: retícula fija como selección universal, giro por fotograma, duplicación de registros, frames fijos tratados como reflow o informes previos tratados como ejecución actual. Aprender es entender el compromiso y mejorar la decisión, no imitar al autor.

El estudio actual no cubre el audio de Eco ni afirma haberlo escuchado. Tampoco cambia las correcciones aceptadas de Cielo/Peces ni detiene la ampliación de contenido autorizada.
