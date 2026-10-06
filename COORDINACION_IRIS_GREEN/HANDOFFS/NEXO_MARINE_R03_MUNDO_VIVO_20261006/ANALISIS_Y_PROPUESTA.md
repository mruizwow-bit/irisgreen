# Nexo · Vida marina R03 · análisis de producto e investigación aplicada

2026-10-06. Encargo de María: estudiar cómo hacer intuitiva y variada la exploración para más de 200 animales, con vida en el entorno, vegetación, arena, rocas, interacción y secuencias distintas; analizar el paquete R03 recibido. Propuesta para definir la siguiente versión, no implementación ni aprobación de distribución.

## 1. Base exacta y evidencia

| Archivo | SHA256 | Bytes |
|---|---|---:|
| descubrimiento-peces-R03-01-app_1(2).zip | 8db78a2746d5171331813fb6757d30eacbea0e4cbbe2227f3a17470c0fe5a144 | 5 154 417 |
| descubrimiento-peces-R03-02-assets_1(2).zip | 70f8624f441fc4c42cb84fe5382e8f0e7e0866a71f53572ec733c66a941d58cc | 28 377 183 |
| descubrimiento-peces-R03_1(2).mp4 | 0e26985a0b82dad2799c18c3da31838223f96599e4b1463aa7a187a2f228dad4 | 1 277 400 |

Extracción conjunta: 92 archivos, 91/91 hashes del manifiesto correctos. Vídeo externo idéntico al interno, 40,96 s, 1280×800, sin pista de audio. Se inspeccionan fotogramas a 5, 12 y 22 segundos; no se afirma haber valorado toda la animación en reproducción continua.

Leídos README, intake, datos, selección, navegación, movimiento, composición y flujo de identificación. Ejecutados listeners originales en fixture Node para los gestos descritos abajo. No se ha ejecutado navegador, lector de pantalla ni teléfono físico; no se reutilizan los PASS del autor como verificación independiente. Assets y aplicación originales intactos.

## 2. Qué es realmente R03

- Catálogo de 16 entradas: 13 pares de profundidad y 3 parejas técnicas adicionales.
- Escena principal `meso-01`: 3 animales. Banco `lote-profundidad-01`: los mismos 13 del catálogo de profundidad, no 13 extra. Banco `parejas-tecnicas-01`: 3. `modoEquipo: true`.
- 32 PNG de animales en assets. No hay un mundo ya poblado con las más de 200 entradas del proyecto. El informe menciona un paquete fuente de 652 visuales; eso no equivale a 652 especies ni a contenido integrado.
- La escena principal conserva asignaciones heredadas sin revalidación factual en este encargo. Los bancos declaran que no prueban convivencia; conservar esa separación.
- `fondo()` dibuja tres colores en un degradado. No contiene suelo, rocas, vegetación, refugios, rutas topológicas o puntos de observación.
- `posicionMundo()` aplica recorridos sinusoidales alrededor de anclas; `dibujarDeformado()` usa una onda por tiras con parámetros por animal. Cambian amplitud y velocidad, pero no hay comportamientos de banco, refugio, sustrato, alimentación o interacción entre animales.
- Todos los encuentros usan luz → fracción de cuerpo iluminada → Examinar → ficha/álbum. `evaluar()` usa una fracción común del 35 %. Los animales necesitan par luz/oscuro incluso en un futuro hábitat que fuese luminoso, porque `cargarEscena()` lo exige sin diferenciar tipo de hábitat.

Dictamen: conservar el núcleo de exploración de profundidad y sus correcciones. La variedad solicitada requiere ampliar el modelo de mundo y encuentros; añadir imágenes sobre el mismo degradado no la produce. La carencia de decoración no es por sí sola un defecto del tramo mesopelágico: una columna de agua puede no mostrar fondo.

## 3. Investigación y transferencia al diseño

Las fuentes S01–S13 se enlazan al final. Son referencias de comportamiento, ecosistemas y diseño; no prueban que esta propuesta vaya a gustar a todas las personas neurodivergentes.

**ABZÛ (S01):** su descripción oficial distingue relaciones entre peces, bancos y entorno. Tomar la idea de un sistema con relaciones; no copiar escenas, arte, peligros ni intentar renderizar miles de animales en móvil.

**Beyond Blue (S02):** exploración, relato y conexión con ciencia marina. Tomar la relación entre lo que acaba de observarse y la explicación que viene después. No convertir cada observación en una ficha enciclopédica obligatoria.

**Endless Ocean (S03):** referencia de exploración y colección extensa. El escaneo repetido no resuelve por sí solo el problema de María. No trasladar señales de rareza, recompensas o criaturas míticas al contenido factual de Iris Green.

**Monterey Bay Aquarium (S04–S07):** bosques de kelp con estratos, refugios entre rocas, animales camuflados en arena y bancos de sardinas. El hábitat puede explicar dónde mirar y cómo vive un animal, además de dar profundidad visual.

**NOAA (S08–S09):** luz y fotosíntesis cambian con la profundidad; el pez trípode ofrece un ejemplo documentado de postura sobre el fondo. No añadir algas iluminadas a todas las escenas profundas ni asignar nado permanente a todos los taxones. La elección exacta requiere comprobar la especie del inventario.

**W3C COGA/WCAG (S10–S13):** controles consistentes, relación clara entre acción y consecuencia, alternativas al arrastre y control del movimiento. COGA es orientación complementaria; estas consultas no certifican conformidad. La variedad debe estar en los encuentros, con pocos gestos que se mantienen.

## 4. Dirección de producto: explorar lugares vivos

Conservar el contrato de Descubrimiento: explorar → notar una señal → actuar → observar una consecuencia → reconocer → identificar → profundizar. Sin quiz, puntuación, obligación de completar un álbum ni función terapéutica asumida. La motivación propuesta es comprender algo que acaba de ocurrir delante de ti.

Organizar el inventario por escenas documentadas que combinen región, profundidad, sustrato, luz y agua dulce/salada. No convertir carpetas de biblioteca en comunidades biológicas. Arrecife tropical, costa templada, mar abierto, fondo profundo y ríos/lagos son destinos diferentes; las transiciones deben comunicar el cambio de lugar, no fingir que todos conviven detrás de una misma roca.

La entrada ofrece lugares reconocibles y un acceso a continuar donde se estaba. El mapa indica posición, puntos de observación y zonas visitadas; no anticipa identidades ocultas. El álbum permite volver a lo descubierto, filtrar por hábitat y consultar información. Las 200+ entradas se distribuyen por ese sistema, sin mostrarlas todas a la vez ni convertir 200 fichas en tareas.

## 5. Seis familias de encuentros, un lenguaje de interacción

Las siguientes son propuestas. Sólo se asignan a animales con conducta documentada y assets adecuados.

| Familia | Señal observable antes del nombre | Acción de la persona | Consecuencia y revelación |
|---|---|---|---|
| Refugio | Parte de un cuerpo visible en una grieta | Pulsar la grieta y elegir «Asomarse»; también navegar al otro punto de vista | Se ve el costado del refugio y más del animal; seleccionar para identificar |
| Camuflaje | Contorno, ojos o cambio de textura sobre arena | Acercar la vista al punto elegido, con alternativa de vista detallada | Se distinguen los rasgos; identificar conserva la escena y explica el camuflaje |
| Banco | Grupo que cambia de dirección junto | Elegir el grupo y observar; «Ver el siguiente momento» permite avanzar sin esperar | Se aprecia coordinación y forma colectiva; seleccionar un ejemplar estable para identificar |
| Vida entre vegetación | Animal parcialmente visible entre frondas | Cambiar entre puntos de observación o acercarse | Otra perspectiva permite localizarlo; la vegetación tiene oclusión real |
| Fondo y postura | Animal apoyado o cerca del sustrato | Seleccionar para observar apoyo, desplazamiento corto o búsqueda de alimento | Una conducta concreta explica su forma corporal; evitar nado constante genérico |
| Columna de agua profunda | Silueta o emisión documentada | Orientar luz hacia un punto y examinar | Conservar aquí el revelado parcial de R03; distinguir emisión propia y luz reflejada |

La diferencia entre encuentros está en la consecuencia observable. No crear seis botones que reproduzcan la misma animación con distinto texto. Añadir tras una identificación una observación opcional relevante —«Mira cómo se oculta» o «Ver cómo se mueve en grupo»— y acceso a fuentes. Ninguna secuencia depende de perseguir un pez o acertar un instante corto.

Para «detrás de piedras» empezaría por asomarse/cambiar perspectiva, sin mover animales ni desmontar el refugio. Si se propone levantar objetos, deberá definirse después como simulación adecuada a ese hábitat, con retorno y explicación; no es necesario para dar agencia.

## 6. Controles intuitivos y previsibles

- Clic/tap selecciona el lugar o animal visible. En profundidad, el primer clic dirige la luz; cuando existe candidato visible aparece «Examinar». Identidad sólo tras acción explícita.
- Arrastrar desplaza la vista. Hover nunca mueve cámara. Las flechas físicas hacen pan cuando la escena tiene foco. No reintroducir cruceta como interacción principal.
- Ofrecer mapa clicable o «Ir a este punto de observación», además del arrastre. Las flechas del teclado por sí solas no cubren una alternativa de puntero sin arrastrar (S11). La vía existente «Encuadrar e iluminar» se conserva y amplía a lugares, con etiquetas que no anticipan especies.
- Zoom, pausa y volver a mi posición tienen ubicación estable. Una única acción contextual aparece junto a lo seleccionado y tiene equivalente accesible; evitar obligar a bajar por varios paneles para ver cada consecuencia.
- Al seleccionar, estabilizar el encuentro para facilitar examen. Congelar también la cámara y conservar postura, luz, foco y selección al cerrar una ficha. No exigir precisión sobre un objetivo en movimiento.
- NORMAL: conducta y ambiente discretos. REDUCED: menos movimiento, cámara sin transición y sin paralaje. NONE: mismos encuentros mediante estados estáticos y «Ver siguiente momento». Pausa manual visible en todos, sin perder descubrimientos ni hacer desaparecer candidatos.
- El sonido es opcional y no la única pista. No añadir burbujas, música o partículas de forma permanente a todos los hábitats. Más vida significa conductas y relaciones observables, no que todo oscile constantemente.

## 7. Qué necesita el motor para sostenerlo

Separar datos de especie, animal colocado, hábitat y encuentro. El modo de render/luz lo define el hábitat: luz diurna, penumbra o profundidad. El par oscuro/luz es obligatorio donde la mecánica lo necesita; una imagen iluminada puede servir en una escena luminosa sin fabricar pares para todo el catálogo.

Añadir composición por capas: fondo lejano, suelo, obstáculos/refugios, animales y primer plano. Geometría de oclusión compartida entre dibujo, selección, muestras visibles y descripción accesible: un pez detrás de una roca no puede resultar examinable a través de ella. Los objetos interactivos deben ofrecer señales perceptibles y nombres accesibles coherentes; no llenar el fondo de falsas zonas pulsables.

Perfiles de comportamiento por familia con parámetros y fuentes: mantener posición, recorrer, banco, refugio, desplazamiento bentónico, pulsación/deriva cuando proceda. Estados con transiciones: reposo → observar/emerger → desplazarse → volver; no forzar la misma deformación a pez hacha, calamar, raya y sifonóforo. Conservar assets aprobados; cuando una pose nueva requiera material distinto, declararlo como trabajo de arte, no estirar el PNG hasta simularla.

Un encuentro necesita id, especie/taxón, hábitat permitido, señal, acción, consecuencia, condición de identificación, ruta NONE, ayuda opcional y fuente. Una escena necesita referencias visuales de navegación, puntos de observación, presupuesto de animales activos y carga de assets por vecindad. El número de animales simultáneos y rendimiento se decidirán midiendo el prototipo, no asumiendo que admitir 200 registros permite animarlos todos.

Variar posiciones y momentos dentro de límites compatibles, sin cambiar el mapa cada vez ni dejar el descubrimiento al azar. Evitar repetir inmediatamente la misma secuencia. Conservar sesión, lugar y álbum. No imponer desbloqueos artificiales entre hábitats para fabricar duración.

## 8. Dos residuos de interacción reproducidos en esta R03

`conectarEscena()` conecta `pointercancel` a `soltar()`. Con cancelación a 100 ms sin arrastre se ejecuta `motor.apuntar`, igual que al confirmar: cancelar orienta la luz. Separar cancelación de confirmación.

`toqueMaxMs: 420` descarta un clic de 500 ms aunque no se mueva el puntero. No exigir rapidez a una selección normal; discriminar arrastre por distancia y cancelación explícita. El script `analizar.cjs` usa los listeners originales y registra ambos casos en `RESULTADOS_R03.json`. No equivale a reproducción táctil nativa ni a un dictamen WCAG completo.

README mantiene párrafos antiguos que aún hablan de crucetas y de REDUCED sin fotogramas, en contradicción con su cabecera y con el comportamiento descrito después. Actualizar documentación para que las próximas órdenes no restauren decisiones retiradas.

## 9. Primer prototipo de la ampliación

Propuesta de corte vertical: una localidad costera documentada, tres microhábitats conectados —rocas, arena y vegetación si corresponde— y entre 8 y 12 especies elegidas del inventario real. Es un tamaño de prueba propuesto, no el recuento validado del catálogo. Mantener R03 profunda como experiencia separada.

Primera visita: entrar viendo agua, suelo y una señal legible; tocarla y obtener consecuencia inmediata; descubrir un animal; encontrar un segundo mediante otra acción; asomarse a un refugio; volver al lugar inicial conservando hallazgos. Secuencias iniciales diseñadas, luego exploración libre. Ayuda contextual opcional; no tutorial largo ni detección secreta de habilidad.

Aceptación con María: sabe qué puede tocar sin instrucciones orales; entiende cómo moverse y volver; experimenta al menos tres consecuencias distintas; distingue un animal parcialmente oculto sin buscar píxeles; puede detener movimiento y completar lo mismo en NONE; cerrar información la devuelve a lo que estaba mirando. Estos criterios se ensayan, no se marcan PASS por existir controles.

Después se amplía por lotes de encuentros: matriz especie → hábitat → conducta → secuencia → assets → fuentes → estado. La cobertura final debe demostrar experiencias y continuidad, no sólo cantidad de imágenes o manifest correcto. No asigno todavía especies concretas a escenas nuevas sin cruzar el inventario completo vigente.

## 10. Fuentes consultadas

Todas consultadas el 2026-10-06. Las propuestas de escenas, controles y secuencias son síntesis de Nexo, no conclusiones experimentales de estas fuentes.

- S01 Nintendo/distribuidor, ABZÛ: https://www.nintendo.com/es-es/Juegos/Programas-descargables-Nintendo-Switch/ABZU-1467719.html
- S02 E-Line, Beyond Blue: https://www.beyondbluegame.com/beyond-blue
- S03 Nintendo, Endless Ocean: https://www.nintendo.com/us/whatsnew/dive-into-some-tips-for-endless-ocean-luminous/
- S04 Monterey Bay Aquarium, kelp: https://www.montereybayaquarium.org/animals-the-ocean/ecosystems/kelp-forest
- S05 Monterey Bay Aquarium, fondo arenoso: https://www.montereybayaquarium.org/animals-the-ocean/ecosystems/sandy-seafloor
- S06 Monterey Bay Aquarium, morena de California: https://www.montereybayaquarium.org/animals-the-ocean/animals-a-to-z/california-moray
- S07 Monterey Bay Aquarium, sardina: https://www.montereybayaquarium.org/animals-the-ocean/animals-a-to-z/pacific-sardine
- S08 NOAA, luz y profundidad: https://oceanservice.noaa.gov/facts/light_travel.html
- S09 NOAA, Bathypterois grallator: https://oceanexplorer.noaa.gov/multimedia/okeanos-explorations-ex1903-dailyupdates-june29-media-tripod-fish-2/
- S10 W3C COGA, controles comprensibles: https://www.w3.org/WAI/WCAG2/supplemental/objectives/o1-understandable/
- S11 W3C, alternativa al arrastre: https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
- S12 W3C, pausa: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- S13 W3C, cancelación: https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html

## 11. Formación Nexo

Aprendizajes aplicables a futuras órdenes: definir encuentros y no sólo assets; distinguir hábitat y decoración; variar consecuencias conservando controles; diseñar el modo sin movimiento junto al normal; repartir el inventario por ecosistemas y no por carpetas; exigir sólo los assets que necesita cada representación; demostrar continuidad además de integridad técnica. No confundir cantidad de fauna con mundo vivo ni movimiento genérico con conducta documentada.
