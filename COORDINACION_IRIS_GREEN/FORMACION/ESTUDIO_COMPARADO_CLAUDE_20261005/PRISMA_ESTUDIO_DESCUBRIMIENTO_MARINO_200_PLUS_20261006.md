# PRISMA · ESTUDIO DE DISEÑO · DESCUBRIMIENTO MARINO 200+ ESPECIES

Fecha: 2026-10-06  
Estado: `PRISMA_MARINE_200_PLUS_DESIGN_STUDY_COMPLETE`

## 1. Pregunta

¿Cómo hacer que Descubrimiento de Vida marina siga siendo:
- intuitivo;
- curioso;
- accesible;
- variado;
- escalable a 200+ animales;

sin construir 200 minijuegos independientes ni repetir siempre:
`linterna → iluminar → examinar`?

## 2. Fuentes externas estudiadas

### Curiosidad y exploración
- GDC · `Sparking Curiosity-Driven Exploration Through Narrative in Outer Wilds`.
  Principio relevante: progresión motivada por curiosidad y exploración autodeterminada en vez de misiones explícitas.
- GDC · `What Happened Here? Environmental Storytelling`.
  Principio relevante: el entorno puede hacer que la persona infiera información mediante composición, props, iluminación y reacción del sistema.
- GDC · `Designing for Non-Linear Story Discovery in Tacoma`.
  Principio relevante: descubrimiento no lineal ligado a la forma del espacio.

### UX
- Nielsen Norman Group · Progressive Disclosure.
  Principio: mostrar primero pocas acciones primarias; profundidad sólo cuando se solicita.
- Nielsen Norman Group · Onboarding Tutorials vs. Contextual Help.
  Principio: los tutoriales interrumpen y se olvidan; la ayuda contextual cerca de la tarea suele ser mejor.

### Aprendizaje y autonomía
- CAST UDL Guidelines 3.0:
  - choice/autonomy;
  - relevance/authenticity;
  - joy/play;
  - action-oriented feedback.
  Principio: no existe una sola forma de engagement óptima; ofrecer elecciones alineadas con la meta y permitir agencia.

### Accesibilidad de juego
- Game Accessibility Guidelines: permitir recordar controles durante el juego.
- W3C WCAG 2.2 / APG:
  - pointer cancellation;
  - alternativa a drag;
  - foco predecible;
  - interacción por teclado equivalente.

### Hábitats y comportamiento
- NOAA:
  - bosque de kelp: canopia / media agua / fondo;
  - arrecife rocoso: grietas, refugios, algas e invertebrados;
  - fondo arenoso: organismos que excavan o se desplazan sobre sustrato.
- Monterey Bay Aquarium:
  - camuflaje profundo;
  - transparencia;
  - superficies plateadas/negras;
  - bioluminiscencia;
  - cromatóforos y cambios de patrón en cefalópodos.

---

# 3. Decisión principal de producto

No diseñar “200 peces”.

Diseñar un **lenguaje de descubrimiento** compuesto por:

`BIOMA × ESCONDITE × PISTA × CONDUCTA × FAMILIA DE INTERACCIÓN × RASGO OBSERVABLE`

Cada animal consume esa gramática.

La variedad viene de combinaciones coherentes, no de 200 motores distintos.

Macrocontrato permanente:

`EXPLORAR → DETECTAR → REVELAR → OBSERVAR → PROFUNDIZAR / CONTINUAR`

Lo que cambia es **cómo se detecta y revela**.

---

# 4. Mundo marino como interfaz

El fondo deja de ser decoración.

## Biomas iniciales

### B01 · Bosque de kelp
Lectura natural:
- frondas;
- claros;
- canopia;
- media agua;
- base rocosa.

Acciones sugeridas por el propio espacio:
- mirar entre frondas;
- apartar vegetación;
- seguir una sombra;
- esperar que algo salga del refugio.

### B02 · Fondo arenoso
Elementos:
- arena;
- ondulaciones;
- pequeñas marcas;
- restos;
- nubes de sedimento.

Acciones:
- seguir un rastro;
- detectar silueta;
- remover zona;
- observar emergencia.

### B03 · Arrecife rocoso
Elementos:
- grietas;
- cornisas;
- cuevas pequeñas;
- algas/invertebrados.

Acciones:
- asomarse;
- iluminar hueco;
- esperar;
- rodear obstáculo.

### B04 · Pradera marina
Elementos:
- cobertura baja;
- claros;
- pequeños cardúmenes;
- juveniles.

Acciones:
- detectar movimiento en hierba;
- seguir separación de hojas;
- aproximarse lentamente.

### B05 · Mar profundo
Elementos:
- oscuridad;
- partículas;
- siluetas;
- reflectancia;
- bioluminiscencia.

Acciones:
- luz;
- destello;
- seguir pulso;
- observar silueta/camuflaje.

No todas las especies deben aparecer en todos los biomas. El bioma es parte de la identidad de la experiencia.

---

# 5. Ocho familias de interacción reutilizables

## I01 · Luz
`buscar señal → apuntar → iluminar rasgo → examinar`

Uso:
- mar profundo;
- transparentes;
- plateados;
- bioluminiscentes.

## I02 · Apartar cobertura
`ver movimiento → seleccionar fronda → apartar → animal aparece`

Cobertura:
- kelp;
- algas;
- pradera.

Accesibilidad:
- drag opcional;
- clic “Apartar”;
- teclado/botón equivalente.

## I03 · Arena
`rastro/silueta → seleccionar zona → remover suavemente → revelar`

No convertir en “frotar hasta llenar barra”.
La pista espacial debe corresponder al punto afectado.

## I04 · Grieta/refugio
`señal en hueco → acercarse/asomarse → esperar o iluminar → salida`

## I05 · Esperar/observar
`anomalía → quedarse quieto → conducta aparece → identificar`

Rompe la expectativa de que toda solución requiere “hacer más clics”.

## I06 · Seguir pista
`destello / burbuja / sombra / rastro → seguir 2–3 señales → encuentro`

Sin flechas explícitas de misión si el entorno ya comunica la dirección.

## I07 · Camuflaje
`algo no encaja → señalar anomalía → cambio/respiración/movimiento confirma → revelar`

Especialmente útil para:
- cefalópodos;
- peces bentónicos;
- especies crípticas.

## I08 · Grupo/comportamiento
`cardumen / interacción → observar patrón → un individuo se separa / revela rasgo`

Introduce vida sin convertir toda fauna de fondo en objetivos.

---

# 6. Familias de movimiento

No reutilizar una única onda para todos.

Mínimo:

- M01 pez flexible;
- M02 pez rígido / planeo;
- M03 fondo / posado;
- M04 salida-refugio;
- M05 cardumen;
- M06 cefalópodo: pulsación + deriva;
- M07 organismo gelatinoso;
- M08 drift casi pasivo.

No se pretende simulación física.
Se pretende que la cinemática respete la lectura básica de la forma.

---

# 7. Motor de variedad para 200+

Cada ficha de especie añade metadatos, no código nuevo:

```text
id
habitat[]
depthBand
concealment
interactionFamilies[]
motionFamily
cue[]
observableRegions[]
signatureTrait
behaviorTags[]
rarityOfEncounter
accessibilityAlternatives[]
contentDepth
```

Un director de encuentros aplica reglas de variedad:

- no repetir la misma familia de interacción > 2 encuentros seguidos;
- alternar activo / observacional;
- alternar abierto / oculto;
- alternar rápido / lento;
- variar escala aparente;
- variar profundidad;
- variar pista;
- evitar repetir el mismo bioma demasiadas veces salvo que la persona elija permanecer allí.

El director **no aleatoriza datos científicos**.
Sólo escoge entre encuentros compatibles ya definidos.

---

# 8. Curiosidad en vez de lista de misiones

Aplicación del estudio GDC:

No:
- “Encuentra pez 17”;
- checklist permanente;
- flecha al objetivo;
- marcador brillante sobre cada hallazgo.

Sí:
- una sombra tras el kelp;
- arena que se mueve;
- reflejo;
- un hueco oscuro;
- cardumen que cambia dirección;
- destello bioluminiscente;
- sonido opcional y no necesario;
- una silueta que no coincide con el fondo.

El entorno hace una pregunta implícita:
**“¿Qué hay ahí?”**

La recompensa principal es entender qué estaba ocurriendo.

---

# 9. Onboarding sin tutorial pesado

NN/g: tutoriales largos se interrumpen y olvidan; ayuda contextual.

Propuesta:

### Encuentro 1
Una sola acción:
`mover luz`

Copy contextual breve:
“Prueba a iluminar la silueta.”

### Encuentro 2
Introduce:
`explorar cámara`

Sólo cuando sea necesario:
“Arrastra para mirar alrededor.”
Alternativa visible sin drag.

### Encuentro 3
Introduce:
`otra familia` (algas/arena).

Después:
no tutorial fijo.

Ayuda siempre disponible:
- qué puedo hacer aquí;
- controles;
- último mecanismo aprendido.

---

# 10. Progressive disclosure

Primer viewport:
- escena;
- objetivo/contexto de una línea;
- acción contextual;
- estado;
- Ayuda secundaria.

No:
- bloque largo de instrucciones;
- fuentes;
- representación técnica;
- selector de banco;
- colección;
- información extensa;
todo compitiendo antes del descubrimiento.

Tras identificar:
1. nombre;
2. rasgo que acaba de observar;
3. una frase de contexto.

Después, bajo demanda:
- detalles;
- comportamiento;
- hábitat;
- conservación;
- fuentes.

---

# 11. Vida ambiental

Tres capas:

## Capa A · estructural
Afecta descubrimiento:
- kelp;
- roca;
- arena;
- grietas;
- cobertura.

## Capa B · pistas
Afecta lectura:
- partículas desplazadas;
- burbuja;
- sombra;
- pequeñas ondulaciones;
- destellos;
- hojas que se apartan.

## Capa C · ambiente
Da vida pero no es objetivo:
- microfauna;
- peces secundarios;
- invertebrados;
- movimiento de frondas;
- partículas.

Regla:
la Capa C nunca debe parecer objetivo si no lo es.
Debe existir jerarquía visual clara.

---

# 12. Agencia y elección

CAST recomienda elección auténtica alineada con objetivo.

Después del primer onboarding:
- “¿Quieres seguir por las rocas o bajar a la arena?”
- “¿Seguir esta pista o explorar el bosque de kelp?”
- “¿Examinar ahora o seguir observando?”

No:
una única ruta lineal de 200 peces.

La persona puede:
- permanecer en un bioma;
- volver;
- seguir pista;
- abrir colección;
- ignorar una señal.

---

# 13. Accesibilidad y neurodiversidad

El mundo puede ser vivo sin convertirse en sobrecarga.

Perfiles:

## NORMAL
- fauna ambiente;
- partículas moderadas;
- vegetación continua;
- transiciones.

## REDUCED
- menos densidad ambiental;
- oscilaciones reducidas;
- sin viajes largos;
- mismas pistas y oportunidades.

## NONE
- mundo estable;
- animación sólo cuando la acción la necesita;
- señales estáticas equivalentes;
- misma posición/estado, sin teletransporte por cambiar preferencia.

Opciones adicionales útiles:
- reducir fauna ambiente;
- aumentar contraste de pistas;
- pista explícita opcional;
- mantener recordatorio de controles;
- no tiempo límite;
- no penalización por tardar.

---

# 14. Qué debe probarse

Antes de preguntar “¿te gusta?”:

## Intuición
- ¿qué intenta hacer primero una persona sin explicación?
- ¿coincide con la acción prevista?
- ¿encuentra el siguiente paso sin buscar UI?

## Curiosidad
- ¿la señal hace que quiera mirar?
- ¿descubre antes de leer el nombre?

## Correspondencia
- ¿la acción sucede exactamente en el lugar señalado?
- ¿lo que ve es lo que el motor evalúa?

## Variedad
Después de 5 encuentros:
- ¿puede describir diferencias entre ellos?
- ¿siente que repite el mismo puzzle?

## Agencia
- ¿puede elegir otro camino sin romper progreso?

## Accesibilidad
- alternativa simple a drag;
- pointercancel no confirma;
- foco no desaparece;
- controles recordables;
- perfiles de movimiento preservan estado espacial.

---

# 15. Propuesta de piloto antes de 200+

No ampliar aún a 200.

Crear **12 encuentros piloto**:

- 3 biomas:
  - kelp;
  - arena;
  - roca/profundidad.
- 6 familias de interacción.
- 6 familias de movimiento.
- al menos:
  - 2 encuentros observacionales;
  - 2 con cobertura;
  - 2 de luz;
  - 2 de camuflaje;
  - 2 de refugio;
  - 2 de pista.

Medir:
- primer gesto;
- tiempo hasta descubrir;
- acción incorrecta;
- necesidad de ayuda;
- monotonía percibida;
- comprensión de rasgo;
- carga visual.

Sólo entonces escalar el sistema de metadatos al catálogo completo.

---

# 16. Conclusión

La mejora no es “más algas y piedras”.

Es:

> **convertir el ecosistema en la interfaz del descubrimiento.**

La persona aprende a mirar el entorno:
- kelp implica cobertura;
- arena implica rastro/enterramiento;
- roca implica refugio;
- oscuridad implica luz/señal;
- comportamiento implica esperar/seguir.

La experiencia conserva una gramática estable, pero cada especie combina esa gramática de forma distinta.

Resultado propuesto:

`MARINE_DISCOVERY_GRAMMAR_R01`

Antes de escalar:
`12_ENCOUNTER_PILOT → PRODUCT_OBSERVATION → TAXONOMIC_MAPPING_200_PLUS`

`NO MAIN · NO PRODUCCIÓN`
