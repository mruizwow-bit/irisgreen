# Nexo · Estudio de código de Vida marina · 2026-10-05

## Propósito y evidencia

Aprender de la implementación de Claude y de sus iteraciones. Este documento no emite un gate de producto ni sustituye la valoración de María. Tampoco presupone que todo lo de Claude esté resuelto: interesa entender qué decisiones explican la mejora y qué conocimientos debemos convertir en práctica.

Base leída: `marine-r02-final-review/descubrimiento-peces/`, contrastada byte a byte con los cuatro JS de `upload/descubrimiento-peces-R02_1_2_1.zip`. ZIP SHA-256 `a5a39e5d5de8369cfb0bf392dbeab6d20c66720128c094b5261517466f729717`, 27 807 530 bytes. Su README se denomina R02_1_2: el sufijo del archivo descargado no basta para identificar una revisión.

Comparaciones realizadas con carpetas `marine-r01-review`, `marine-rev1-review`, `marine-r02-review` y `marine-r02-patch-review`; los paths que aparecen a continuación son relativos a `descubrimiento-peces/`. También se leyeron `README.md`, datos, i18n y bancos de pruebas. No se ha supuesto acceso a una corrección posterior que María pueda tener en otro chat.

Prueba ejecutada: `pruebas/qa-funciones-node.js`, en copia temporal con el mismo `app/motor.js`, para no sobrescribir la evidencia entregada. Resultado leído: **6/6 PASA**, giro de +1 a −1 en 94 pasos. No se ejecutó navegador, lector de pantalla ni dispositivo táctil. Los resultados de las suites de navegador dentro del ZIP siguen siendo evidencia del autor, no retest independiente de este estudio.

## 1. Qué consigue y por qué es útil estudiarlo

La experiencia no depende de una ficha que describa cómo explorar. La acción modifica algo visible: recorrer cambia qué parte del mundo se ve; apuntar cambia qué fragmento del animal está iluminado; examinar fija una observación y abre su identificación. La calidad no procede de emplear un framework avanzado: aquí hay JavaScript, canvas 2D, datos locales y DOM convencional. Procede de relacionar intención, control, geometría, percepción y explicación.

El primer R01 no tenía toda esta experiencia. El salto de producto está documentado en R02: se incorpora natación y un entorno mayor que la vista, se separan arrastre y toque, y se reduce la competencia entre controles de cámara y de luz. La implementación también pasó por errores de giro, pausa y foco. Estudiamos el resultado y el proceso de corrección, no una comparación idealizada entre autores.

## 2. Arquitectura real: eventos → estado → geometría → render → DOM

| Capa | Archivo y funciones | Responsabilidad efectiva |
|---|---|---|
| Datos | `app/datos.js`, `window.IG_DATOS` | Catálogo, escenas con slots, medidas físicas, pares luz/oscuro, muestras de cuerpo, fuentes, textos y parámetros de nado. |
| Entrada | `app/interfaz.js`, `conectarEscena()` | Gestos, teclado y botones; decide si la persona quiere desplazar cámara o apuntar. |
| Estado visual | `app/motor.js`, `crearMotor()` | Cámara, haz, reloj, pose, candidato y programación de fotogramas. |
| Geometría | `centroLimitado()`, `recuadro()`, `posicionMundo()`, `ondaY()`, `geometriaHaz()` | Lleva cada cuerpo desde coordenadas de mundo hasta la pantalla y calcula la iluminación. |
| Render | `pintar()`, `dibujarDeformado()`, `dibujarMascara()` | Dibuja fondo, oscuro, luz recortada y lámpara. |
| Interpretación | `evaluar()`, callback `alLatir()` | Calcula candidatos a partir de la porción iluminada y visible; comunica mediciones a la interfaz. |
| Estado semántico | `examinar()`, `refrescarFranja()`, `abrirVisor()`, `pintarAlbum()` | Hace explícitos identificación, profundidad, álbum y avisos accesibles. |

Ejemplo trazado: un `pointerdown` almacena posición, identificador y hora; un `pointermove` que supera 7 px activa arrastre y llama a `arrastrarCamara()`. El delta de píxeles se convierte usando escala y dimensiones del mundo. `programar()` solicita dibujo; `recuadro()` calcula nuevas posiciones. `evaluar()` descarta las muestras fuera de pantalla. `alLatir()` refresca las descripciones y candidatos sin reconstruir los controles existentes.

Un toque que termina dentro de 420 ms y no supera el umbral llama a `apuntar()`, no a `examinar()`. Apuntar revela forma; examinar es la acción semántica que identifica. Esta separación evita que un mero gesto de navegación resuelva el descubrimiento.

Las flechas físicas sólo se capturan con la escena enfocada; desplazan la vista. Mayús+flechas mueve la luz. No se aplica captura global de teclado ni `role="application"`. El paquete estudiado mantiene botones de cámara y una vía alternativa de señales. La aceptación posterior de María de este manejo no autoriza a extrapolarlo a Cielo ni a sustituir allí la selección directa por retícula.

## 3. Mundo, cámara y tamaño de los animales

`datos.js` contiene 13 registros y dos escenas: `meso-01` tiene mundo de 3000×1500 y tres slots; `lote-profundidad-01`, 2478×2201 y trece slots. El catálogo responde a qué contenido existe; los slots responden a qué aparece y dónde. Añadir al catálogo no añade automáticamente un encuentro.

`escala()` usa `max(W/mundoW, H/mundoH) * zoom`. `centroLimitado()` mantiene la vista dentro del mundo cuando éste es mayor. `recuadro()` combina ancla de mundo, recorrido y centro útil del cuerpo. El ancho de sprite procede de `longitud.valor * escalaPxPorCm / cajaCuerpo[2]`: compensa los márgenes transparentes, en vez de confundir el tamaño del lienzo PNG con el tamaño del animal.

Una corrección importante de producto es `encuadrarParaExaminar()`: ajusta zoom y centro según tamaño corporal y asienta el animal de perfil. No basta con apuntar la luz a un cuerpo que, por escala, no puede caber en el haz. El botón fue renombrado «Encuadrar e iluminar» porque su acción realmente cambia cámara, zoom, pausa y luz. Aprendizaje: cuando una vía accesible realiza una acción compuesta, debe ser alcanzable, predecible y estar bien nombrada.

## 4. Natación: implementación y límites

`posicionMundo()` genera un recorrido sinusoidal por animal, con radios, periodo y fase propios. `ondaY()` genera una onda viajera longitudinal cuya amplitud crece hacia la cola mediante una envolvente suave. `dibujarDeformado()` divide el sprite entre 8 y 30 tiras, desplaza cada una en Y y solapa ligeramente sus bordes para evitar costuras.

Esta técnica es una aproximación gráfica de movimiento, no una simulación anatómica. Que un calamar, un pez comprimido y uno alargado compartan el mecanismo no demuestra que todos naden de forma convincente. Los valores por animal reducen esa uniformidad: el pez hacha usa amplitud 0,0288 y el pez linterna 0,0545. La observación perceptual decide si la deformación se lee como nado; una diferencia de píxeles sólo demuestra cambio.

El avance del reloj utiliza el tiempo entre fotogramas, limitado a 0,05 s. Sin embargo, `orientacion()` aplica `girar(..., 0.055)` por llamada de dibujo. El giro no es aún independiente de la tasa de render: 94 pasos equivalen aproximadamente a 1,57 s a 60 llamadas/s y 3,13 s a 30 llamadas/s. Esta es una oportunidad de formación, no un nuevo juicio sobre la preferencia visual de María.

En R02, el suelo ±0,08 se escribía sobre la interpolación y la atrapaba antes de cruzar cero. El patch separa `girar()` —estado continuo— de `girarVisible()` —mínimo sólo para dibujo—. `deCanto()` impide examinar una pose demasiado estrecha. Lección transferible: una corrección visual no debe alterar la dinámica del estado que intenta representar.

## 5. Iluminación y criterio de examinable

El motor dibuja el estado oscuro y superpone el estado iluminado recortado con `destination-in`. No aplica una opacidad global al animal: la luz depende del punto de pantalla. Esto permite reconocer una parte antes de conocer la identidad.

`geometriaHaz()` define origen, dirección, alcance y penumbra. `valorMascara()` evalúa intensidad por ángulo y radio. `evaluar()` transforma las muestras de cuerpo con la misma onda y giro que emplea el dibujo; cuenta las que están **dentro de la pantalla** y tienen máscara ≥0,5. La fracción mínima actual es 0,35 y la pose no puede estar de canto. Los márgenes transparentes no forman parte del cuerpo muestreado.

Precisión importante: compartir parámetros y transformación no significa identidad matemática exacta con todos los píxeles. `dibujarMascara()` aproxima la penumbra angular con 14 cuñas y `evaluar()` usa una función continua. El render usa la onda en el centro de cada tira; el muestreo la evalúa en cada punto. Para ampliar a cuerpos extremos conviene medir el margen de error cerca del umbral y evitar parpadeo de examinable. No se debe convertir el comentario «MISMA función» en una prueba de igualdad raster.

R01 podía contar iluminación fuera del viewport; rev1 añade el recorte en `evaluar()`. Esta corrección enseña que el contrato perceptual incluye visibilidad real, no sólo pertenencia a un cono matemático.

## 6. Pausa: tres responsabilidades distintas

El código actual distingue `anima()` (avanza tiempo), `hayPose()` (se dibuja deformación) y `animCam` (transición de cámara). Pausar conserva reloj, onda y orientación, en vez de sustituir el animal por su PNG rígido.

`detenerCamara()` cancela el pan/zoom en vuelo. `pausar(true)` lo llama **antes** de su retorno temprano: repetir pausa tiene que cancelar una transición aunque el booleano ya sea verdadero. `congelar(true)` también cancela cámara. `seguirExplorando()` conserva encuadre y luz, y sólo reanuda natación si `ui.pausaManual` no estaba activada. Es la diferencia entre intención persistente del usuario y pausa temporal requerida por la interfaz.

NORMAL usa amplitud/recorrido/frecuencia 1/1/1. REDUCIDO usa 0,45/0,30/0,60 y sigue nadando; NINGUNO los anula. La cámara animada sólo se permite en NORMAL. La documentación contiene aún una frase antigua que atribuye quietud también a REDUCED; el código y el banco actual contradicen esa frase. Aprendizaje: cambiar un contrato requiere actualizar copy, comportamiento y pruebas juntos.

## 7. DOM estable y foco

R01 reconstruía la lista de señales durante los refrescos. Rev1 introduce `construirSenales()` una vez por escena y `actualizarSenales()` sobre los mismos nodos. Los controles que temporalmente no permiten examinar usan `aria-disabled`, y `examinar()` valida de nuevo la condición antes de actuar. Esto preserva el lugar de la persona sin habilitar una acción inválida.

En los candidatos múltiples, el patch anterior conservaba una firma de IDs y omitía actualizaciones si no cambiaba. Así quedaban idioma y posición obsoletos aunque la identidad fuese la misma. La versión final reconcilia nodos por ID, pero vuelve a calcular texto y nombre accesible en cada actualización. La identidad de un nodo y su contenido son dos cosas distintas.

`alLatir()` limita el refresco habitual del DOM a intervalos superiores a 120 ms aunque el canvas anime más rápido. Se evitan escrituras cuando el valor no cambia. Esta separación entre frecuencia visual y semántica favorece estabilidad, pero no sustituye una prueba con lector de pantalla: los avisos live también deben resultar tolerables cuando cambian los candidatos.

## 8. Datos, ampliación y precauciones que debemos aprender

`cargarEscena()` carga sólo los slots de la escena y recoge excluidos con motivo. Comprueba entrada existente, enabled, fixture, hábitat, pertenencia a zona y assets. La comprobación de zona compara `zs[z].zona === e.zona`; **no interpreta `estado` como un gate aprobado**. Las tres entradas mesopelágicas están marcadas `HEREDADO` y llevan nota de falta de revalidación. La estructura es mejor que el antiguo booleano global `zonaValidada`, pero no equivale a validación factual automática.

La generalización requiere contrato explícito para estados y fuentes, sin meter todas las especies en un único tramo. Hay que comprobar que cada incorporación cumple por separado datos, correspondencia de imágenes, alcance de interacción y calidad perceptual.

Otros temas para practicar antes de escalar, identificados por lectura y no reproducidos en navegador aquí:

- `cargarEscena()` resuelve `Promise.all()` sobre variables compartidas sin token de generación. Dos cambios rápidos de escena pueden terminar fuera de orden. Enseña a diseñar propiedad y cancelación del trabajo asíncrono.
- `cambiarEscena()` reinicia `nodosCand = {}` sin vaciar explícitamente `cajaCand`; la limpieza debe incluir mapa y DOM. No afirmar que el problema se manifiesta en el flujo normal sin reproducirlo.
- `pointercancel` usa el mismo `soltar()` que `pointerup`; un gesto breve cancelado puede entrar en la rama que apunta. Cancelar debe probarse como resultado distinto de confirmar.
- `arrastrarCamara()` no llama a `detenerCamara()`: estudiar transferencia de control si empieza un arrastre durante un zoom animado.
- `guardarSiProcede()` guarda examinados, álbum e idioma, no cámara, escena y luz. Una futura promesa de «volver al mismo lugar tras cerrar» exige ampliar el contrato, no asumir que el guardado actual la cumple.

## 9. Qué sabemos ya y qué falta demostrar

Esta matriz es provisional: la comparación exacta con la formación canónica de Nexo/Prisma/Axioma corresponde al informe principal. No se deduce una falta de estudios a partir de un defecto de código.

| Conocimiento | Evidencia de aplicación en este caso | Aprendizaje que falta consolidar |
|---|---|---|
| Separar datos, motor e interfaz | Cuatro JS con responsabilidades reconocibles | Mantener contratos compartidos al evolucionar, no sólo separar archivos. |
| Accesibilidad de teclado y foco | Reconciliación estable y acción validada con `aria-disabled` | Diseñar desde el inicio la secuencia de uso real y probar su persistencia. |
| Estados de movimiento | NORMAL/REDUCIDO/NINGUNO están modelados | Distinguir tiempo, pose, cámara y voluntad de pausa; comprobar todos los estados temporales. |
| Transformaciones de canvas | Oscuro, luz y muestras comparten espacio | Cuantificar aproximaciones y casos extremos; no aceptar comentarios como evidencia. |
| QA automatizada | Banco puro reproduce giro y perfiles | Bancos portables que fallen de verdad, y pruebas perceptuales separadas. |
| Diseño de descubrimiento | Navegar/iluminar precede a identificar | Definir qué acción aporta exploración y reconocer cuándo el prototipo no la ofrece. |

Los bancos `qa-funciones-node.js` y `qa-camara-y-candidatos.js` imprimen fallo sin asignar necesariamente un exit code no cero. El segundo además depende de `/opt/pw-browsers/chromium`. Por eso «el proceso termina con 0» no prueba que todo pase. En este estudio se leyeron las seis aserciones y su resultado. Ni siquiera seis aserciones correctas demuestran que nade de forma natural o que apetezca explorar.

## 10. Prácticas de formación con entrega y aceptación

1. **Explicar un recorrido completo sin cambiar código.** Entregar diagrama y trazas de arrastrar → apuntar → examinar → continuar. Aceptación: identificar qué variables cambian y cuáles deben conservarse, incluyendo intención de pausa y foco.
2. **Reloj y pose.** En ejercicio aislado, reproducir un giro a 30/60/120 Hz y después hacerlo dependiente de tiempo. Aceptación: duración coherente entre tasas, cruce de cero y pausa sin cambio de pose.
3. **Geometría perceptual.** Mostrar superpuestas muestras de cuerpo, recuadro visible y máscara para tres cuerpos de proporciones distintas. Aceptación: ninguna muestra fuera de pantalla contribuye y el criterio se corresponde visualmente con lo iluminado, con tolerancia documentada.
4. **Foco como estado de usuario.** Mantener Tab/Enter durante cambio de idioma, variación de candidatos y desaparición del seleccionado. Aceptación: los nodos que sobreviven conservan identidad; al desaparecer el activo hay destino de foco predecible y anunciado.
5. **Cancelación y concurrencia.** Simular pan, pausa a mitad, arrastre, pointercancel y dos cargas lentas de escena. Aceptación: ninguna intención vieja recupera control; último cambio de escena gana; cancelación no confirma selección.
6. **Incorporación completa.** Añadir un animal al catálogo y sólo a su escena compatible, con cuerpo muy grande o pequeño. Aceptación: fuente y estado explícitos, examinable alcanzable por ratón y teclado, par de imágenes alineado, exclusión de otros tramos e informe preciso.
7. **Comparación perceptual.** Grabar los mismos tres animales con dos parametrizaciones, sin cambiar encuadre ni escala. Aceptación: justificar con observaciones concretas si se ve natación o deformación; no usar número de píxeles como respuesta a esa pregunta.
8. **Banco que detecta su propio fallo.** Introducir temporalmente un giro roto en una copia y ejecutar pruebas. Aceptación: resultado FALLA, exit no cero y ruta portable. Restaurar antes de entregar.

## Fuentes primarias de estudio

Consultadas el 2026-10-05. Son material técnico de aprendizaje; no se presenta APG como una certificación ni se emite conformidad normativa.

- W3C WAI, *Developing a Keyboard Interface*: persistencia y previsibilidad del foco, y decisiones sobre controles deshabilitados. https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
- W3C WAI, *Toolbar Example*: ejemplo de `aria-disabled` para conservar descubribilidad de controles, con responsabilidad de gestionar la acción. https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/examples/toolbar/
- W3C, *Pointer Events*, semántica de terminación/cancelación de secuencias de puntero. https://www.w3.org/TR/pointerevents/
- MDN, *Window.requestAnimationFrame()*: timestamp y frecuencias de refresco distintas; estudiar animación por tiempo en lugar de por número de llamadas. https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame

## Identificación de los archivos estudiados

| Archivo | SHA-256 |
|---|---|
| `app/motor.js` | `b3a5c80f9d00717f0495a9a5f806218c24e13a4f564ba2e3c2bbeadde063ad81` |
| `app/interfaz.js` | `d6b4a4333ff39100dc106332c3320fa8c0f494a26df62fad211df788ac1a8011` |
| `app/datos.js` | `64494ca1f352f0b651891c2b58354c9904bdd4b84c3b04b1c55e59688dd34071` |
| `app/i18n.js` | `e55db5b54f39bc4e5e9da801edb5a73f18d67f2a836215b091bd6b05829752b5` |

No se modificó ningún runtime, dato de animales, asset aprobado ni informe de pruebas del paquete.

## Contraste posterior con la formación de Nexo

Nexo R02, ref 9d88b97252fc5fd9dbc37daebba64893ab2a69c7, ya documentaba descubrimiento causal, continuidad del modelo mental en los perfiles de movimiento y evaluación perceptual. La brecha de aplicación es no haber traducido esos principios a invariantes de cámara/pose/foco y a una prueba de interacción representativa. La formación técnica a consolidar es transformación común de dibujo/detección, aproximaciones de máscara, tiempo independiente de refresco, reconciliación por identidad y cancelación de trabajo asíncrono. Esta comparación es de Nexo; Prisma y Axioma deben hacer la suya sin que se les atribuyan conocimientos no comprobados.
