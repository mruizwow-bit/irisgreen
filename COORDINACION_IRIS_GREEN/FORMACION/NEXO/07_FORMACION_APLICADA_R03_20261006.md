# Nexo · Formación aplicada R03 · De los principios al comportamiento
Fecha: 2026-10-06 · Issue #350
Estado: CONOCIMIENTO_DOCUMENTADO_Y_PARCIALMENTE_PRACTICADO; competencia de producto pendiente de demostrar.
Amplía [R02](06_ESTUDIO_EXTENDIDO_R02_20261004.md); no la sustituye.

## 1. Qué ha cambiado en mi comprensión
Ya conocía TECHNICAL_PASS != PRODUCT_PASS y la manipulación directa. La práctica demuestra que poder repetirlos no garantiza aplicarlos. Mi tarea formativa es convertir intención, estado y consecuencia observable en decisiones verificables.

Una experiencia puede completar sus 14 recorridos y seguir actuando en un lugar distinto del señalado, anunciar una acción que luego rechaza o nombrar un rasgo donde no está. Un contador de pruebas correctas no responde a esas preguntas.

El aprendizaje no consiste en encontrar culpables ni idealizar a Claude. Consiste en leer implementaciones concretas, explicar decisiones, reproducir sus límites y transferir lo aprendido a una práctica propia.

## 2. Conocimientos por dominio
| Dominio | Conocimiento incorporado | Aplicación y límite |
|---|---|---|
| Cielo | Dato, proyección, cámara y selección son responsabilidades distintas. Dibujo y hit testing deben compartir transformación y su inversa. | Señalar un punto no debe exigir trasladar el mundo al centro. Separar clic/arrastre; no mover cámara por hover. La base histórica estudiada no es la corrección posterior comunicada por María. |
| Cielo | Revelar y profundizar son transiciones semánticas. La respuesta no debe filtrarse en texto accesible antes de la acción. | Conservar campo y encuadre; cancelar cámara en la posición visible; mantener foco según el origen. Tener datos no significa que la información sea encontrable. |
| Peces | Mundo mayor que viewport; luz, dibujo, muestras y pose deben concordar. Lo que queda fuera de pantalla no cuenta como observación visible. | Una transformación compartida puede tener aproximaciones de raster: medir límites sin afirmar identidad matemática perfecta. |
| Peces | Tiempo, pose, cámara y voluntad de pausa son estados diferentes. | Pausar no rigidiza el animal ni permite continuar una transición de cámara vieja. Repetir pausa debe cancelar trabajo pendiente. El giro debe estudiarse con tiempo, no solo número de fotogramas. |
| Peces | Identidad de nodos y contenido de nodos son cosas diferentes. | Reconciliar por id conserva foco; volver a calcular etiquetas permite actualizar idioma/posición. No reconstruir controles en cada refresco. |
| Peces | Catálogo, slots de escena y validación factual no son equivalentes. | Añadir una especie no la sitúa automáticamente en cualquier tramo. Comprobar pertenencia, estado, fuente y correspondencia de assets. |
| Webs | Canon consumido por componentes; semántica de controles; exportación y runtime tienen contratos distintos. | Una página navegable que acaba en placeholder no contiene la experiencia. Frames a medidas fijas no prueban reflow. Fuente editable y bytes entregados deben corresponder. |
| Construcción | Reglas de costes/apoyo/altura y representación perceptible son planos distintos. | Una variable z correcta no demuestra que subir o construir se entienda. El siguiente paso de juego debe producir una consecuencia legible. |
| Fósiles | Cobertura, muestreo, regiones observadas, cámara e identificación requieren una decisión común coherente. | Mi R01 conserva máscara y cámara separadas, pero permite acciones fuera de pantalla y mensajes contradictorios. Conocer la arquitectura no bastó. |
| Media | Integridad y métricas no demuestran identidad sonora, naturalidad ni confort. | Conservar el principio de escuchar el archivo real y valorar percepción. Este estudio no escucha ni aprueba el audio de Eco. |

Estudios propios: [Cielo](https://github.com/mruizwow-bit/irisgreen/blob/0f80aa868139cd6bc36621a5c258d39cd7bb6ac6/COORDINACION_IRIS_GREEN/FORMACION/ESTUDIO_COMPARADO_CLAUDE_20261005/NEXO_CIELO.md), [Peces](https://github.com/mruizwow-bit/irisgreen/blob/0f80aa868139cd6bc36621a5c258d39cd7bb6ac6/COORDINACION_IRIS_GREEN/FORMACION/ESTUDIO_COMPARADO_CLAUDE_20261005/NEXO_PECES.md), [Webs y Construcción](https://github.com/mruizwow-bit/irisgreen/blob/0f80aa868139cd6bc36621a5c258d39cd7bb6ac6/COORDINACION_IRIS_GREEN/FORMACION/ESTUDIO_COMPARADO_CLAUDE_20261005/NEXO_WEBS_Y_CONSTRUCCION.md), [comparación con mi formación](https://github.com/mruizwow-bit/irisgreen/blob/0f80aa868139cd6bc36621a5c258d39cd7bb6ac6/COORDINACION_IRIS_GREEN/FORMACION/ESTUDIO_COMPARADO_CLAUDE_20261005/NEXO_COMPARACION_FORMACION.md). Los alcances y hashes específicos están allí; no se extrapolan a versiones posteriores.

## 3. Lo que mi práctica enseñó con evidencia
Artifact: NEXO_FOSILES_PRACTICA_R01.zip, SHA-256 21a6663524368ad2322f06e405d6af1417e42b21925d4a2123c9c29934ae668c.

| Caso | Error propio | Regla que debo aplicar |
|---|---|---|
| R00 | Todas las muestras despejadas no implica dos regiones visibles. Paso anuncia preparado y Examinar rechaza. | Una misma decisión gobierna elegibilidad, estado y feedback; no usar proxies distintos como si fueran equivalentes. |
| R01 | Identificación del trilobite con su borde derecho a −295,32 px de la vista. | Antes de actuar validar selección vigente, contexto y visibilidad apropiada al contrato. |
| R02 | Cepillado de teclado modifica 80 celdas fuera de una escena de 850×560. | La herramienta debe seguir visible o pedir reencuadre explícito. No producir consecuencias invisibles. |
| R03 | pointerup sustituye el aviso útil por un texto genérico. | Resolver el resultado de la acción y publicar su mensaje final una sola vez. aria-live no corrige un mensaje incorrecto. |
| R04 | Cambiar idioma en Despejar publica instrucciones de Explorar. | Copy, nombres accesibles y ayuda derivan del estado actual. |
| R05 | «Esta zona» despeja a 295,81 unidades del punto seleccionado. | La acción respeta el destino elegido; si es asistencia que elige otra región, debe nombrarlo y mostrarlo. |
| R06 | Selector NORMAL/REDUCED/NONE sin efectos diferenciados. | No ofrecer controles vacíos. Si todo es estático, no inventar animación para justificar un selector. |

[Informe](https://github.com/mruizwow-bit/irisgreen/blob/61e350229e907b06cbba0e4a4e4af76904568aa0/COORDINACION_IRIS_GREEN/HANDOFFS/NEXO_FOSILES_DESCUBRIMIENTO_20261005/REVISION_NEXO_R01_20261006/ANALISIS_NEXO_R01.md) · [reproducciones](https://github.com/mruizwow-bit/irisgreen/blob/61e350229e907b06cbba0e4a4e4af76904568aa0/COORDINACION_IRIS_GREEN/HANDOFFS/NEXO_FOSILES_DESCUBRIMIENTO_20261005/REVISION_NEXO_R01_20261006/REPRODUCTIONS.json) · [banco](https://github.com/mruizwow-bit/irisgreen/blob/61e350229e907b06cbba0e4a4e4af76904568aa0/COORDINACION_IRIS_GREEN/HANDOFFS/NEXO_FOSILES_DESCUBRIMIENTO_20261005/REVISION_NEXO_R01_20261006/reproduce.cjs).

La cobertura = 1 de R00 es cobertura de muestras, no exposición visual total. Las reproducciones usan el código con un getter de observación, DOM simulado y Canvas nativo: no son navegador real.

## 4. Precisión semántica sobre assets aprobados
Conservar un asset aprobado solo garantiza que no alteré sus bytes. No valida anclajes, etiquetas, tamaños relativos, contexto, hit testing ni interpretación que añada.

Mi generador colocó puntos según proporción horizontal/vertical y opacidad, sin identificar anatomía. En Dimetrodon, «Cuerpo de la vértebra» cae sobre el tramo alargado de la ilustración. Debo localizar regiones por pieza y contrastarlas con lo representado antes de asignar nombres específicos.

El 48 % y dos puntos son parámetros del ejercicio, no una validación perceptual o paleontológica. Distinguir píxeles del fósil y de una losa; explicar qué detalle se ve y por qué justifica avanzar. No sustituir esa observación por un cuestionario.

## 5. Diseñar pruebas desde la pregunta
Antes de construir el banco, escribir:
1. Qué intenta hacer la persona.
2. Qué cambia y qué debe permanecer.
3. Qué resultado observaría.
4. Qué nunca debe suceder.
5. Qué prueba puede refutar mi implementación.
6. Qué no puede demostrar ese método.

Ejemplos de invariantes: navegar no despeja; cancelar no confirma; una selección vieja no actúa fuera de contexto; cerrar profundidad conserva encuadre; una condición de bloqueo no anuncia disponibilidad; el punto señalado y la consecuencia coinciden.

El banco anterior probaba sobre todo lista de indicios → pasos → examen. No probaba por eso ratón completo, tacto, layout o satisfacción. Su prueba de arrastre miraba identificación, no que la máscara quedara igual.

Separar evidencia: lectura estática; modelo puro; fixture DOM; render de Canvas; navegador sobre artifact; dispositivo/lector; observación perceptual; HUMAN QA. Una capa no se renombra como otra. Hashes identifican bytes; no demuestran calidad.

## 6. Accesibilidad como comportamiento
- Teclado y alternativa de puntero sin arrastrar se evalúan por separado. Las flechas físicas no sustituyen toda vía de clic/toque. Eso no obliga a hacer una cruceta el controlador principal.
- Foco es estado de usuario: conservar identidad de controles cuando sobreviven; decidir destino cuando desaparecen.
- La disponibilidad se valida en la acción aunque el control use aria-disabled.
- El idioma alcanza ayuda, nombres accesibles, estados y contenidos dinámicos.
- No declarar accesibilidad por presencia de atributos. Verificar uso real y límite del método.
- No confundir criterio WCAG, explicación WAI/APG, guía de usabilidad, obligación jurídica o certificación.

## 7. Formación que falta demostrar
| Capacidad | Estado real | Próxima demostración |
|---|---|---|
| Leer y explicar transformaciones, estados y contratos | Practicada en estudios; aplicada parcialmente | Trazar gesto → estado → geometría → percepción en una versión corregida. |
| Diseñar oráculos que detecten errores propios | Siete reproducciones obtenidas | Regresiones que fallen con R01 y pasen con corrección sin debilitar aserciones. |
| Anotación semántica de piezas | Deficiencia detectada; no resuelta | Regiones revisadas por pieza y comprobación visual con fuente pertinente. |
| Diseño de descubrimiento atractivo y comprensible | No demostrado por el banco | Uso real de caparazón, espina y ala; observar comprensión y repetición. |
| Accesibilidad/browser QA | Pendiente | Navegador real, ratón, Tab/Enter, touch, reflow, lector y perfiles. |
| Síntesis colaborativa | Pendiente de revisiones independientes | Comparar evidencia de Prisma/Axioma/Nexo y acordar cambios. |

No me otorgo un PASS formativo por escribir este módulo. El resultado profesional se demuestra en la siguiente práctica y su revisión.

## 8. Aprendizaje compartido sin contaminar la base
Decisión de María de 2026-10-06: dejar analizar y responder a los compañeros y mejorar entre todos. R01 permanece intacta; no empezar mi R02 mientras se esperan esas respuestas.

No atribuir a Prisma o Axioma conclusiones que no se hayan leído. Cada práctica conserva autoría. Después comparar: coincidencias, aportaciones nuevas, discrepancias, evidencias y límites. Convertir cada acuerdo en acción concreta, owner y criterio observable. Una mayoría de opiniones no sustituye reproducción; una reproducción tampoco decide por sí sola el valor de producto.

Conservar versiones de informe y actualizar formación, prácticas y runbook tras la síntesis. La coordinación de otros trabajos no se congela por esta espera.

## 9. Fuentes de estudio
Consultadas en los estudios de 05–06/10/2026; enlaces para volver a contrastar, sin nueva declaración de vigencia o certificación:
- W3C: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
- W3C: https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- W3C: https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html
- W3C APG: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
- W3C: https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html
- W3C: https://www.w3.org/WAI/WCAG22/Techniques/html/H102
- MDN: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
- MDN: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
- NN/g: https://www.nngroup.com/articles/direct-manipulation/
- Shneiderman (1983), referenciado en el estudio de Cielo: https://www.cs.umd.edu/~ben/papers/Shneiderman1983Direct.pdf

## 10. Entrada de continuidad
Leer R02 → este R03 → informe de Fósiles → revisiones independientes cuando existan → síntesis. No retomar únicamente desde el número de pruebas o el último mensaje del chat.
