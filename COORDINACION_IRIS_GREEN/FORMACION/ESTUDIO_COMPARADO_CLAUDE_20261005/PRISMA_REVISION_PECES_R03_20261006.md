# PRISMA · REVISIÓN DE DESCUBRIMIENTO PECES R03 · 2026-10-06

## Estado

`PRISMA_MARINE_R03_REVIEW_REWORK_RECOMMENDED`

Revisión de aprendizaje/producto. No modifica el paquete ni `main`. No sustituye a Axioma, Astra ni HUMAN QA.

## Bases exactas recibidas

- `descubrimiento-peces-R03-01-app_1.zip`
  - SHA-256: `8db78a2746d5171331813fb6757d30eacbea0e4cbbe2227f3a17470c0fe5a144`
- `descubrimiento-peces-R03-02-assets_1.zip`
  - SHA-256: `70f8624f441fc4c42cb84fe5382e8f0e7e0866a71f53572ec733c66a941d58cc`
- `descubrimiento-peces-R03_1.mp4`
  - SHA-256: `0e26985a0b82dad2799c18c3da31838223f96599e4b1463aa7a187a2f228dad4`
  - 40,96 s · 1280×800 · H.264

Los dos ZIP se fusionaron según `LEEME_EXTRACCION.md`.
`MANIFEST_SHA256.txt`: 91/91 archivos presentes y hashes correctos.

## Lo que R03 mejora claramente

1. Luz, dibujo y examinabilidad comparten geometría:
   - `geometriaHaz()`;
   - `valorMascara()`;
   - `ondaY()`;
   - `evaluar()`.
2. La mezcla luz/oscuro evita sumar alfa en cuerpos translúcidos.
3. El área de detección excluye muestras fuera del viewport.
4. Tap y drag se separan por umbral.
5. Cámara animada cancelable.
6. La pose se conserva al pausar.
7. NORMAL / REDUCED / NONE están implementados, no son un selector vacío.
8. La lista accesible conserva nodos por id mientras siguen siendo candidatos.
9. Fuentes locales y canon NAVY.
10. Pares públicos luz/oscuro visualmente bien registrados; sus centroides alfa prácticamente coinciden.

---

# BLOQUEADORES REPRODUCIDOS

## R03-P01 · pointercancel confirma la acción

En `conectarEscena()`, `pointerup` y `pointercancel` llaman a la misma función `soltar()`.

Si el gesto no superó el umbral de drag y es breve, `soltar()` llama a:
`motor.apuntar(...)`.

Por tanto un **cancel** puede orientar la luz, cuando debería cancelar el gesto.

### Reproducción propia

Estado inicial del haz:
`{x:0.22,y:0.70}`

Secuencia:
- pointerdown;
- pointercancel en otra coordenada.

Estado resultante:
`{x:0.8993,y:0.2691}`

`changed = true`.

**Prioridad: alta.**

Corrección:
- `pointerup` puede confirmar toque;
- `pointercancel` debe limitarse a liberar captura, quitar clase y borrar el gesto;
- añadir test adverso que exija que cámara/luz/selección no cambien tras cancel.

---

## R03-P02 · cambiar Movimiento teletransporta animales

`posicionMundo()` multiplica el recorrido por `perfil().recorrido`:

- normal = 1
- reducido = 0.30
- ninguno = 0

Cambiar el ajuste recalcula inmediatamente la posición con otra amplitud alrededor del ancla.

Eso significa que una **preferencia de movimiento cambia dónde está el animal**, no sólo cuánto se mueve.

### Reproducción propia, con escena pausada

Tras dejar nadar y pausar:

Cambio NORMAL → REDUCED:
- calamar: salto ≈ **183 px**
- pez linterna: ≈ **88 px**
- pez hacha: ≈ **71 px**

Cambio NORMAL → NONE:
- calamar: ≈ **262 px**
- pez linterna: ≈ **125 px**
- pez hacha: ≈ **101 px**

Esto puede hacer desaparecer una señal ya localizada o cambiar la relación espacial al activar una preferencia de accesibilidad.

Además `NONE` cuantiza la luz a pasos de `1/14`, por lo que el ajuste también cambia la precisión de entrada.

**Prioridad: alta.**

Corrección recomendada:
- el cambio de perfil debe conservar la posición visible actual;
- NONE debería congelar el estado actual, no devolver cada animal al ancla;
- REDUCED debe reducir velocidad/amplitud sin salto de posición;
- la preferencia de movimiento no debe cambiar innecesariamente la precisión de la luz;
- probar equivalencia espacial antes/después del cambio.

---

## R03-P03 · la rejilla dinámica puede perder el foco

`pintarCandidatos()` elimina del DOM los botones de candidatos que dejan de ser examinables.

Si uno de esos botones tiene el foco, al eliminarlo el navegador deja:
`document.activeElement = BODY`.

### Reproducción propia

Se obtuvo una posición con dos examinables:
- `prof-pez-linterna`
- `prof-calamar-cristal`

Se enfocó el primer botón de candidato.
Después se movió la luz para que la rejilla desapareciera.

Resultado:
- antes: botón `Examinar el animal iluminado...`
- después: `BODY`
- botones candidatos: 0

**Prioridad: alta de accesibilidad/continuidad.**

Opciones:
- no retirar un candidato enfocado hasta transferir foco;
- o mover foco de forma explícita al botón principal `Examinar` / escena;
- o mantener el botón en estado no disponible hasta que el usuario abandone el conjunto.

Añadir test en el que **el candidato enfocado deja de ser candidato**; el test actual sólo verifica que el foco se conserva cuando el mismo nodo sigue existiendo.

---

## R03-P04 · Enter/Espacio no responde cuando hay varios candidatos

El `keydown` de `zona-exploracion` sólo cubre:
- exactamente 1 examinable → examina;
- 0 examinables → avisa.

Si hay 2 o más, no hace nada.

### Reproducción propia

Estado con 2 candidatos simultáneos.
Foco en `#zona-exploracion`.
Pulsar Enter.

Resultado:
- la rejilla tiene 2 botones;
- el mensaje live no cambia;
- el foco sigue en la escena;
- no se explica que hay que elegir uno.

**Prioridad: media-alta.**

No recomiendo elegir automáticamente.
Mejor:
- anunciar “Hay dos señales iluminadas. Usa Tab para elegir cuál examinar”;
- opcionalmente mover foco al primer selector sólo tras una acción explícita.

---

# MEJORAS DE PRODUCTO

## R03-P05 · la acción siguiente queda fuera del primer viewport

Medición propia del runtime con la misma composición:

### 320×800
- escena: y 351 → 735
- `Examinar este animal`: y ≈ **892**

### 390×844
- escena: y 301 → 778
- `Examinar este animal`: y ≈ **912**

### 1440×900
- escena: y 259 → 948
- `Examinar este animal`: y ≈ **1038**

En los tres tamaños la escena domina el primer viewport, pero **el siguiente paso explícito no está visible** cuando se ilumina algo.

Entre escena y CTA además aparece el texto largo de instrucciones.

Esto puede romper el ritmo:
`ilumino → veo animal → ¿y ahora?`

Recomendación:
- colocar la acción contextual inmediatamente debajo de la escena, antes de la ayuda extensa;
- o mostrar una barra contextual compacta asociada a la escena al aparecer candidato;
- mover “cómo moverse” a Ayuda/details;
- reducir peso inicial de “Fuentes y representación”, que hoy compite con la tarea principal.

No convertirlo en un overlay que tape al animal.

---

## R03-P06 · el criterio 35 % de alfa sigue siendo genérico

`datos.umbrales.fraccionExaminable = 0.35`.

`evaluar()` decide por fracción de muestras de alfa útil iluminadas.
Es mejor que un bbox o centro genérico, pero aún no comprueba **qué rasgo significativo** se ha visto.

Se puede llegar al 35 % iluminando una parte que no corresponda al rasgo usado en la pista.

Es el mismo tipo de aprendizaje que apareció en Fósiles:
una condición mecánica de finalización no demuestra reconocimiento perceptual.

Recomendación:
- definir 1–3 regiones observables por animal;
- vincularlas con `pistaForma`;
- permitir examen parcial útil, pero reservar identificación a evidencia visual coherente;
- ajustar los umbrales con observación real, no sólo alcanzabilidad.

No hace falta convertirlo en examen.

---

## R03-P07 · la natación sigue siendo demasiado genérica por especie

Todo el catálogo comparte:
- trayectoria sinusoidal alrededor de un ancla;
- la misma `ondaY()` de cabeza a cola;
- el mismo sistema de giro horizontal.

Sólo cambian amplitud/frecuencia/longitud de onda.

Esto es una base muy buena de motor, pero no todas las formas se desplazan igual.
Especialmente el calamar no debería depender sólo de la misma onda lateral de un pez.

La documentación ya admite que “parece nadar” sigue pendiente de juicio humano.

Recomendación:
crear familias pequeñas de locomoción:
- pez de cuerpo flexible;
- pez rígido/maniobra lenta;
- calamar: pulsación/manto + deriva;
- organismos técnicos futuros: drift/contracción cuando corresponda.

No crear física compleja; basta con que la cinemática respete mejor la forma.

---

## R03-P08 · el giro depende de frecuencia de refresco

`orientacion()` usa:
`girar(p.giro, objetivo, 0.055)`
por fotograma.

La prueba documenta ~1,6 s a 60 fps, pero:
- a 120 Hz girará aproximadamente el doble de rápido;
- a 30 Hz, aproximadamente la mitad.

La posición del animal sí usa delta-tiempo; el giro debería hacer lo mismo.

**Prioridad: media técnica.**

---

## R03-P09 · separar build de producto y build de equipo

El paquete recibido lleva:
`modoEquipo:true`.

Por ello aparecen:
- selector de escenas;
- lote privado de 13;
- banco técnico;
- informe de incorporación.

Está bien para revisión interna, pero no confiaría la publicación a “acordarse de cambiar una bandera”.

Recomendación:
- build/entrypoint de equipo;
- build/entrypoint público;
- el público no debe contener ni poder activar escenas privadas por UI;
- CI que falle si el build público contiene `modoEquipo:true`, fixtures o selector técnico.

---

## R03-P10 · coste de memoria en escena de 13

Los 26 PNG de `assets/profundidad`:
- disco ≈ **21,7 MB**
- decodificados RGBA ≈ **156 MB**

Los 3 pares de la escena pública:
- disco ≈ **5,9 MB**
- decodificados RGBA ≈ **36 MB**

La carga es perezosa por escena, lo cual está bien.
Pero el lote de 13 puede ser pesado en móviles reales, justo una limitación ya reconocida por el propio paquete.

El paquete fuente dispone de AVIF/WebP.

Recomendación:
- usar AVIF/WebP en runtime con fallback PNG;
- descargar/liberar recursos al cambiar de escena si el navegador mantiene imágenes;
- medir memoria/tiempo en móvil real antes de ampliar;
- no usar el banco de 13 como referencia de rendimiento de producto.

---

## R03-P11 · trazabilidad de versión

El paquete se presenta como R03, pero:
- `IG_DATOS.version = "R02"`;
- varios comentarios siguen R02/R02_1;
- localStorage usa `ig-descubrimiento-peces-r01`.

No es un defecto de experiencia por sí solo, pero sí puede crear confusión de migración/evidencia.

Recomendación:
- separar `schemaVersion`, `runtimeVersion` y `contentVersion`;
- migración explícita del storage si se desea continuidad;
- no reutilizar una clave histórica sin declarar compatibilidad.

---

# PUNTOS QUE CONSERVARÍA

No recomiendo rehacer R03.

Conservar:
- motor separado de interfaz;
- mezcla alfa complementaria;
- máscara común entre render y detección;
- exclusión de muestras fuera de viewport;
- cámara cancelable;
- pose congelada al pausar;
- selección directa por toque/clic;
- drag sólo para cámara;
- lista accesible por id;
- foco de diálogos;
- sources/provenance;
- carga perezosa por escena;
- assets luz/oscuro sin redibujar;
- NORMAL / REDUCED / NONE como contrato de producto.

---

# Orden sugerido

## Antes de retest Axioma / HUMAN QA
1. P01 pointercancel.
2. P02 continuidad al cambiar movimiento.
3. P03 foco cuando desaparece candidato.
4. P04 feedback con varios candidatos.
5. P05 CTA/contexto inmediato bajo escena.

## Antes de escalar contenido
6. P06 criterios por rasgos observables.
7. P07 locomoción por familias.
8. P08 giro con delta-tiempo.
9. P10 rendimiento/memoria móvil.

## Antes de publicación
10. P09 separar build equipo/producto.
11. P11 versionado/migración.
12. Cerrar matriz factual/taxonómica ya declarada pendiente por Senda/Astra.

## Veredicto

R03 demuestra un salto real respecto a R02 y tiene un núcleo técnico reutilizable.
No lo considero “rehacer”.

Mi estado sería:

`KEEP_CORE_REWORK_INTERACTION_AND_PRODUCT_POLISH`

Los cuatro primeros hallazgos son reproducibles y no dependen de gusto visual.
P05–P08 son mejoras de experiencia necesarias para que el descubrimiento se sienta más continuo y menos mecánico.

`NO MAIN · NO PRODUCCIÓN`
