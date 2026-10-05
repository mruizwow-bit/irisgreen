# Nexo · Estudio independiente de Cielo

Fecha: 2026-10-05. Objetivo: entender decisiones de implementación y convertir la formación en práctica. No es un nuevo gate ni una revisión de la corrección posterior comunicada por María.

## Base y método

ZIP CIELO_ORION_INTERACTIVO_R01(1).zip, SHA-256 `2e036ce4c3e3984be09d2c0ba630470f2129be49738960ec070bffa756d0026c`. Los 42 archivos extraídos coinciden byte a byte con el ZIP. Lectura de motor, interfaz, configuración, datos, copy y estructura HTML. Ejercicio geométrico ejecutado en Node mediante el motor real, sin DOM ni navegador. No se escuchó audio ni se observaron sesiones nuevas de uso.

María ya comunica una selección corregida. No tenemos en este estudio el nuevo binario identificado; la retícula se analiza como decisión histórica y oportunidad de aprendizaje, no como defecto atribuido a esa corrección.

## 1. La arquitectura que conviene entender

`datos-cielo.js` contiene datos generados desde el JSON; `config.js` fija composición y parámetros; `motor.js` transforma coordenadas y dibuja; `interfaz.js` controla estados, acciones, foco y paneles; `copia.js` mantiene textos. La ventaja no está en tener varios archivos, sino en que una transformación sirve al dibujo y a la comprobación de selección.

`construirCampo()` filtra estrellas por magnitud, construye el índice por id y transforma las líneas del mismo campo. `aCampo()` aplica la inversión de orientación una sola vez. `aPantalla()` aplica después cámara y zoom. El aprendizaje es definir claramente qué pertenece al dato, qué a la proyección y qué a la representación. No corregir un espejo cambiando sólo el fondo mientras líneas y selección conservan otro sistema.

El horizonte actúa como referencia de entrada. El encuadre inicial se calcula para dejar el cinturón fuera del centro. Eso es una composición preparada, no una observación del cielo actual. Este estudio comprueba la consistencia del código; no revalida el catálogo astronómico, la proyección científica ni fechas/lugares.

## 2. La secuencia tiene estado, no sólo pantallas

La interfaz mantiene `observando`, `localizada` y `revelada`, más panel, idioma, movimiento y mensaje. `examinar()` es una acción explícita. Comprueba región visible y oclusiones; si coincide, localiza. `revelar()` es otra acción, que dibuja la figura completa sobre el mismo campo. Abrir y cerrar profundidad no exige cambiar cámara.

Un detalle valioso: el texto del botón de revelación se vacía antes de descubrir, además de ocultarlo. La regla de no anticipar la respuesta debe cumplirse en el DOM y el nombre accesible, no sólo en los píxeles. La descripción alternativa informa sobre patrones visibles sin nombrar automáticamente la identidad buscada.

Esta arquitectura concreta el contrato de Descubrimiento que Nexo ya conocía: acción, señal, inferencia, revelación y profundidad. La formación pendiente consiste en diseñar y revisar las transiciones, no en volver a escribir ese contrato en mayúsculas.

## 3. Por qué la retícula podía ser correcta y el gesto incómodo

`examinarRegion()` fija `cx = ancho / 2` y `cy = alto / 2`. Comprueba que las tres estrellas estén dentro de ese círculo, visibles y no tapadas. La interfaz permite arrastrar cámara y usar flechas, pero esta base no contiene selección de una región arbitraria mediante clic. Para elegir lo que ve, la persona tiene que trasladar el cielo hasta el centro. Cámara y selección quedan acopladas.

La orden original permitía retícula/selección central: sería inexacto tratarlo sólo como desobediencia del implementador. El aprendizaje de Nexo es que describir seis estados visuales no resuelve por sí solo el gesto entre ellos. Debíamos comprobar antes si la operación principal pedida era orientar la vista o señalar un objeto ya visible.

Ejercicio reproducido con el motor original:

| Área del canvas | Tres estrellas visibles al entrar | Examinable desde centro inicial | Examinable al centrar la cámara |
|---|---|---|---|
| 1440 × 558 | Sí | No | Sí |
| 390 × 574 | Sí | No | Sí |
| 320 × 386 | Sí | No | Sí |

Esto no mide mareo ni facilidad de uso; demuestra la dependencia geométrica que ayuda a explicar el rechazo de María. El script `sky-learning-probe.js` acompaña el estudio.

Para entender una selección directa, el ejercicio invierte la transformación: `u = cam.u + (x-W/2)/k`, `v = cam.v + (y-H/2)/k`. Se comprobaron 27 recorridos punto → pantalla → punto, en tres tamaños y tres zooms, con error menor de 1e-12. Esta fórmula no es una corrección de producto terminada: faltan tolerancia, elección punto/zona, feedback, cancelación y vías equivalentes.

La enseñanza transferible es guardar selección independiente de cámara, separar clic de arrastre y no mover la vista por el mero desplazamiento del puntero. Las flechas físicas son una vía de teclado. Si se ofrece arrastre, también hay que diseñar una alternativa simple de puntero sin arrastrar; el teclado no cubre por sí solo esa necesidad. Eso no obliga a convertir una cruceta en la interacción principal.

## 4. Continuidad temporal y atención

`irA()` interpola cámara y programa fotogramas sólo cuando necesita movimiento. `congelarCamara()` cancela la animación en la posición visible, y se llama al examinar y revelar. Aprendizaje: el destino planificado no debe imponerse después de que otra acción tome control.

`examinar(origen)` distingue botón y escena. Si el botón desaparece, pasa el foco a la nueva acción; si el origen era la escena, lo conserva allí. Al cerrar profundidad, se intenta devolverlo al origen si sigue conectado y visible. El foco es parte del contexto del usuario, no un detalle a añadir después de renderizar.

Hay oportunidades que no copiaría automáticamente: reconstruir paneles en determinados refrescos puede exigir preservar foco interno; un único objetivo codificado mediante CINTURON_IDS no constituye un motor genérico para 88 experiencias. Son límites de la base, no fallos reproducidos en navegador ni razones para rehacer el trabajo corregido.

## 5. Información: existir, exponerse y encontrarse son cosas distintas

La base sí tiene profundidad: imagen de Orión, reconocimiento, fuentes y tabla de las tres estrellas del cinturón. El JSON contiene más datos que esa tabla. Por tanto, «falta toda la información» no se resuelve contestando que existe un archivo de datos. Hay que distinguir disponibilidad en la fuente, contenido editorial preparado, acceso desde la experiencia y comprensión de su ubicación.

Para la ampliación autorizada, el contrato debe separar registro científico, relato breve tras identificar y profundidad navegable, con procedencia y correspondencia de assets. La cantidad de estrellas o imágenes no demuestra que ese contenido sea encontrable. Tampoco se debe anticipar el nombre para arreglar la encontrabilidad.

## 6. Comparación con mi formación actual

Nexo R02, ref `9d88b97252fc5fd9dbc37daebba64893ab2a69c7`, secciones 3–6, ya contenía tarea antes que interfaz, escena como controlador, flechas como equivalencia y artefacto real. Esto es principalmente una brecha de aplicación: mi orden definía el relato pero dejaba sin demostrar la operación principal del puntero.

La formación técnica a consolidar es más concreta: transformaciones e inversas; hit testing coherente con lo visible; arbitraje entre selección y navegación; cancelación de trabajo temporal; persistencia de foco; diseño de información progresiva. Ninguna exige escoger primero un framework.

Prácticas propuestas: explicar una acción de extremo a extremo sin mirar el copy; implementar en ejercicio separado selección independiente de cámara; ejecutar cancelación a mitad de transición; localizar una información desde la experiencia sin conocer el archivo que la contiene. Axioma debe contrastar el alcance del oráculo; Prisma, materializar el gesto; Nexo, especificar y revisar la consecuencia que se espera ver.

## Lecturas primarias aplicadas

Consultadas 2026-10-05. Shneiderman, Direct Manipulation (1983): objetos visibles, acciones incrementales y reversibles; ayuda a examinar la distancia entre señalar y desplazar el mundo. https://www.cs.umd.edu/~ben/papers/Shneiderman1983Direct.pdf

W3C Understanding Pointer Cancellation: estudiar confirmación/cancelación del gesto, no tratar pointercancel como confirmación. https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html

W3C Understanding Dragging Movements: separar alternativa de puntero sin arrastre y acceso por teclado. https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html

W3C APG Developing a Keyboard Interface: persistencia y previsibilidad del foco. https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/

Estas fuentes orientan el aprendizaje; no certifican conformidad ni diversión de la entrega.
