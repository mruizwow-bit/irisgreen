# PRISMA · ANÁLISIS CONSTRUCCIÓN 3D «EL VADO» · REFERENCIA DRAGON QUEST BUILDERS

Fecha: 2026-10-06  
Base analizada: `iris-green-3d-vado(1).zip`  
SHA-256 ZIP: `308c370ef5b2dfce69fa8e0f7865d957390aa40a290d8f46145eb2a99fc1e59c`  
Bytes: `1,885,597`  
Integridad interna: `SHA256SUMS.txt 30/30 PASS`

Estado de este documento:
`PRISMA_CONSTRUCTION_3D_DQB_STUDY_COMPLETE`

No modifica producto, main ni producción.

---

## 1. Qué es realmente el prototipo actual

Es un **vertical slice técnico de construcción 3D**, no todavía un builder-adventure con la sensación de Dragon Quest Builders.

Ya demuestra:
- mundo 3D real;
- personaje en tercera persona;
- cámara orbital;
- recogida de recursos;
- colocación/retirada/deshacer;
- reglas de apoyo;
- puente físico transitable;
- escaleras reales;
- parcela libre;
- guardado;
- controles ratón/teclado/táctil;
- accesibilidad alternativa;
- 320/390/1440 y 200 %;
- funcionamiento offline.

Eso es una base técnica útil. El problema no es «falta 3D». El problema es que el **lenguaje de juego todavía es el de un prototipo/editor**, mientras la referencia de producto es un **juego de aventura-construcción**.

---

## 2. Arquitectura encontrada

### Módulos
- `config.js`: dimensiones, alturas, recursos, costes, cámara, canon.
- `world.js`: terreno, agua lógica, piezas, superficies y soporte.
- `player.js`: locomoción, colisión, escalones, interacción próxima.
- `build.js`: piezas, validación, soporte, colocar, retirar, deshacer.
- `escena3d.js`: Three.js, terreno, agua, vegetación, Vera, raycast, cámara, preview.
- `game.js`: bucle, input, objetivos, HUD, guardado y orquestación.
- `ui.js`: DOM, HUD, controles alternativos.
- `save.js`: localStorage.

Es una separación mucho mejor que un monolito. `world/player/build` ya forman un pequeño modelo jugable independiente del renderer.

### Mundo
`World` usa:
- `h[x][z]`: altura del terreno;
- `suelo[x][z]`: material superficial;
- `piezas[x,y,z]`: construcción añadida.

Importante:
`terrenoEn(x,y,z) = y < h[x][z]`.

Por tanto el terreno es en realidad **2.5D / heightfield sólido por columnas**. Las piezas sí viven en grid 3D, pero el terreno no es un voxel world completo.

Consecuencia:
- no se puede excavar;
- no se pueden abrir cuevas;
- no hay túneles/voladizos de terreno;
- no se pueden quitar bloques naturales individuales;
- el terreno no puede convertirse en la materia prima principal de construcción como en builders de bloques.

Éste es el mayor límite arquitectónico si el objetivo sigue siendo DQB-like.

### Apoyo
`World.soporte()` es un solver iterativo:
- bloques: necesitan soporte inferior;
- escaleras: soporte inferior o continuidad;
- plataformas: hasta `voladizoMax=2`.

Es un sistema interesante y propio. Debe conservarse como identidad si resulta divertido, pero actualmente es una regla invisible que puede sentirse más «puzzle» que «sandbox».

### Construcción
`Constructor.validar()` centraliza:
- alcance horizontal/vertical;
- ocupación;
- jugador;
- inventario;
- desbloqueo;
- llegada de escalera;
- soporte.

Es una buena base porque preview y acción pueden compartir exactamente el mismo predicado.

### Renderer
Three.js r149 local.

Terreno:
- una `BufferGeometry` combinada;
- sólo se generan tapas y caras laterales expuestas;
- esto ya evita muchas caras interiores.

Piezas:
- todas las piezas se vuelven a fusionar en una única geometría cada vez que `world.version` cambia:
  `Escena3D.sincronizarPiezas()`.

Funciona muy bien para decenas de piezas.
No escalará elegantemente a miles.

Vegetación:
- geometría procedimental combinada y determinista.

Personaje:
- Vera se construye con primitivas Three.js;
- brazos/piernas/coleta pivotan;
- no hay esqueleto/AnimationMixer ni clips de interacción.

### Cámara
Orbital alrededor de Vera.
Smoothing dependiente de dt.
Protección frente a atravesar el suelo elevando pitch.

No existe todavía:
- colisión de cámara con paredes/objetos;
- fade de obstáculos;
- outline del personaje cuando queda oculto;
- vista de construcción cenital;
- primera persona.

### Input
Actualmente hay dos capas:
1. caminar;
2. modo Construir.

En modo Construir, las flechas dejan de mover a Vera y pasan a mover el cursor.

Con ratón:
- drag = cámara;
- clic limpio = colocar;
- Shift+clic = retirar.

Touch:
- toque selecciona;
- confirmación aparte.

Esta arquitectura es accesible y precisa, pero se parece más a **un editor de cuadrícula** que a construir «desde el cuerpo» de un personaje.

---

## 3. Qué enseñan las referencias

### Dragon Quest Builders 2

Nintendo/Square Enix destacan:
- explorar distintas tierras;
- reunir recursos;
- reconstruir asentamientos;
- aprender nuevas recetas;
- utilizar planos;
- habitaciones que provocan actividades de habitantes;
- aldeanos que incluso ayudan a construir;
- agricultura;
- movilidad amplia;
- guantes para mover bloques sin destruirlos;
- herramientas que reducen fricción a medida que aumenta la escala.

La lección no es copiar esas herramientas una a una.

La lección es:
> **la construcción modifica un mundo que luego responde a lo construido.**

El puente no importa sólo porque marque un objetivo; importa porque abre un camino.
Una habitación importa porque alguien la usa.
Un cultivo importa porque produce.
Un edificio importa porque cambia la base.

### LEGO Worlds

Refuerza:
- explorar;
- descubrir;
- construir brick-by-brick o con prefabs;
- terraformar;
- personajes, criaturas y vehículos.

Lección:
> el mundo es simultáneamente lugar de aventura y material editable.

### Animal Crossing

Refuerza:
- personalización persistente;
- puentes, caminos, rampas y terreno;
- instalaciones;
- residentes que llegan y utilizan el entorno;
- progreso a ritmo propio.

Lección:
> una construcción gana significado cuando afecta a la vida del lugar.

### Stardew Valley

Refuerza:
- transformar un terreno deteriorado en un hogar;
- recursos con propósito;
- mundo persistente;
- relación entre progreso material y comunidad.

Lección:
> la actividad repetible funciona mejor cuando alimenta una transformación visible a medio/largo plazo.

---

# 4. Diferencia principal con la referencia

El vado actual tiene este loop:

`objetivo → caminar → recoger montón → entrar en construir → colocar → comprobar objetivo → siguiente objetivo`

El builder-adventure deseado debería tender a:

`explorar → encontrar necesidad/recurso → obtener material → crear/transformar → el mundo responde → se abre una posibilidad nueva → elegir qué hacer después`

El primero demuestra sistemas.
El segundo produce juego.

---

# 5. Qué conservaría sin rehacer

1. Grid 3D de piezas.
2. Raycast directo a la cara apuntada.
3. Preview verde/rojo y motivo textual.
4. Colocar / retirar / devolver material / deshacer.
5. Solver de soporte, si se hace legible.
6. Escaleras transitables como rampas.
7. Personaje físico en el mundo.
8. Cámara orbital.
9. soporte teclado/touch/texto.
10. guardado con fallback.
11. canon NAVY en interfaz.
12. el propio «vado» como primera situación/tutorial.

---

# 6. Qué hace que hoy se sienta prototipo/editor

## UI demasiado visible

Capturas:
- panel de 5 objetivos;
- panel Materiales;
- panel Vista con siete botones;
- cruceta;
- barra de piezas;
- Recoger/Usar;
- Construir;
- Girar;
- Colocar;
- Retirar;
- Deshacer;
- Guardar.

El mundo compite con la interfaz.

Dragon Quest Builders separa movimiento/cámara de acción y mantiene herramientas/inventario como HUD de juego, no como panel de depuración permanente.

### Cambio

HUD normal:
- arriba izquierda: **un solo objetivo actual**;
- arriba derecha: minimapa/rumbo opcional;
- abajo: hotbar de 6–8 slots;
- junto al foco: prompt contextual `F Recoger`, `E Usar`, etc.;
- mensajes breves.

Mover a pausa/menú:
- guardar;
- ajustes;
- objetivos completos;
- controles;
- botones alternativos de cámara.

Mostrar cruceta sólo en touch o si el usuario la solicita.

---

# 7. Construir debe ser una herramienta, no otro modo de locomoción

Hoy:
`B` cambia a modo Construir y las flechas dejan de mover a Vera.

Eso separa cuerpo y construcción.

Propuesta principal:
- Vera sigue caminando siempre;
- seleccionar una pieza equipa la herramienta de construcción;
- el raycast marca la cara a la que miras;
- click/acción coloca;
- acción secundaria retira;
- R rota;
- rueda / 1–8 cambia slot;
- mover la cámara no cambia la cuadrícula.

Para teclado-only se conserva un **cursor de construcción accesible**, pero deja de ser el paradigma principal.

Esto acerca la experiencia al control de un builder en tercera persona sin perder la alternativa actual.

---

# 8. El vado debe convertirse en capítulo de juego, no banco de QA

Eliminar del producto:
`En la parcela libre: coloca 3 piezas y retira 1`.

Eso es un test, no una motivación jugable.

Propuesta de primer capítulo:

### 1. Llegada
Vera llega a un enclave con el paso roto.

Sin lista de controles.
Sólo:
`Encuentra una forma de cruzar.`

### 2. Exploración
Los materiales no aparecen como tres montones colocados para QA.

Se obtienen de:
- troncos/ramas caídas;
- piedras/bloques del entorno;
- ruinas recuperables.

Primeras acciones enseñan:
`mirar → recoger/extraer → construir`.

### 3. El vado
Dos o más soluciones reales:
- pasarela de madera;
- calzada/pilares de piedra;
- combinación.

El juego valida transitabilidad, no una receta exacta.

### 4. Otra orilla
La caja puede mantenerse, pero pasa a ser un hallazgo:
- nueva herramienta / receta de escalera;
- material especial;
- fragmento de plano.

### 5. Terraza
Construyes el acceso.

### 6. Refugio/taller
La parcela ya no pide «3 y 1».
Hay una ruina o residente que necesita un espacio funcional.

Construir:
- suelo/estructura;
- entrada;
- banco de trabajo o cofre.

Cuando funciona:
**alguien empieza a usarlo**.

Éste sería el primer momento verdaderamente DQB-like:
la construcción ha cambiado la vida del mundo.

---

# 9. Habitaciones y edificios funcionales

Añadir un sistema propio de espacios reconocibles.

No copiar recetas exactas de DQB.

Ejemplo de contrato Iris Green:
- una región caminable;
- delimitación suficiente;
- entrada accesible;
- objeto funcional.

Tipos iniciales:
- refugio;
- taller;
- almacén;
- pequeño huerto.

Consecuencia:
- NPC duerme;
- NPC fabrica;
- materiales se almacenan;
- cultivo produce.

Esto transforma construcción estética en sistema vivo.

---

# 10. NPCs / mundo vivo

No hacen falta veinte.

Piloto:
- Vera;
- 1 residente al otro lado del vado;
- quizá un segundo más tarde.

El residente:
- tiene una necesidad;
- camina por el puente que tú construiste;
- utiliza el refugio/taller;
- reacciona cuando se completa;
- puede ayudar a un proyecto posterior.

La respuesta del mundo debe ser visible.

No convertirlo en juego educativo ni sensorial.
Debe sentirse como un juego normal de aventura/construcción.

---

# 11. Recursos y crafting

Hoy:
madera/piedra → pieza directamente.

Propuesta:
mantenerlo simple, pero añadir un banco de trabajo.

Primer inventario:
- madera;
- piedra;
- fibras/metal sólo cuando hagan falta.

Recetas iniciales:
- plataforma/tablero;
- bloque;
- escalera;
- pared;
- puerta;
- banco;
- cofre.

No empezar con 100 recetas.

A medida que crece la obra, desbloquear herramientas que reducen fricción:
- mover una pieza sin romperla;
- reemplazar material;
- línea/fila;
- plano fantasma;
- copiar un módulo propio.

Principio tomado de DQB2:
**el juego da herramientas mejores cuando la escala de construcción aumenta**.

---

# 12. Movimiento y cámara

## Personaje

Vera necesita:
- carrera;
- salto pequeño;
- animación de recoger;
- animación de colocar;
- animación de retirar/golpear;
- abrir cofre;
- usar banco de trabajo;
- reacción breve a completar proyecto.

No hacen falta cinemáticas largas.

La geometría actual puede seguir durante un sprint, pero el destino debería ser:
- GLB local low-poly;
- skeleton;
- AnimationMixer;
- clips cortos.

## Cámara

Conservar orbit.

Añadir:
- colisión con paredes/piezas, no sólo con suelo;
- fade/outline de Vera al quedar tapada;
- zoom adaptativo;
- botón/vista «Construcción» ligeramente más alta;
- opcional primera persona para espacios cerrados.

La referencia DQB2 usa tercera persona y ofrece otros modos/vistas para resolver problemas de orientación.

---

# 13. Mundo visual

La escena actual ya tiene:
- agua;
- hierba;
- arena;
- roca;
- flores/cantos;
- niebla;
- sombras.

Pero los materiales son colores planos.

Mejora de alto retorno:
- atlas de texturas local estilizado;
- top/side diferenciados;
- pequeñas variaciones por bloque;
- ambient/contact shading;
- borde de agua/espuma;
- vegetación con leve viento sólo en NORMAL;
- props funcionales: árboles, ruinas, cajas, farol, banco.

No buscar realismo.
Buscar **mundo legible, cálido y con identidad**.

---

# 14. Feedback que falta para «sentirse juego»

Cada acción necesita respuesta multisistema:

## Recoger
- animación de mano/herramienta;
- pequeño movimiento del recurso;
- contador que vuela/entra al inventario;
- sonido opcional.

## Colocar
- golpe/encaje;
- dust/chip muy corto;
- pieza aparece con pequeño ease;
- sonido material específico.

## Error
- preview rojo + motivo;
- no modal.

## Objetivo/proyecto
- mundo cambia;
- NPC reacciona;
- receta/área se abre.

El feedback debe ser breve y desactivable/reducible; no convertirse en estimulación ornamental.

---

# 15. Arquitectura necesaria para crecer

## A. Terrain: pasar de heightfield a voxel/chunks

Este cambio es necesario si queremos:
- extraer bloques naturales;
- terraformar;
- cuevas;
- túneles;
- desniveles editables;
- terreno como recurso.

Modelo:
`VoxelWorld → chunks/cells → geometry por chunk`.

Three.js recomienda precisamente dividir mundos voxel grandes en celdas y generar sólo caras expuestas.

Tamaño inicial razonable a estudiar:
`16×16×16` o `32×32×32`.

No decidirlo por estética: medir.

## B. Dirty chunks

Al colocar/quitar:
- no reconstruir todas las piezas;
- marcar chunk modificado y vecinos de borde;
- regenerar sólo esos meshes.

## C. Instancing

Para:
- hierba;
- piedras;
- flores;
- árboles repetidos;
- props iguales.

`THREE.InstancedMesh` reduce draw calls cuando geometría/material se repiten.

## D. Construcciones

Dos opciones:
1. chunk mesh de todos los bloques construidos;
2. InstancedMesh por material/tipo cuando convenga.

No mantener `sincronizarPiezas()` reconstruyendo el mundo construido entero en cada acción cuando haya miles de bloques.

## E. Support graph incremental

El solver actual recorre piezas hasta 64 pasadas.

Para escala grande:
- guardar dependencias;
- invalidar sólo vecindad afectada;
- propagar cambios localmente.

## F. Quest/data-driven

Los cinco objetivos están hardcoded en `game.js`.

Mover a datos:
```
quest
  trigger
  condition
  optional hints
  world response
  reward/unlock
```

Lo mismo para:
- recetas;
- piezas;
- rooms;
- NPC needs.

---

# 16. Three.js

El paquete usa r149.

En 2026, Three.js está en r186 estable y r187 en desarrollo.

No considero que actualizar sea la prioridad del producto.

Pero antes de construir el mundo grande debe abrirse un carril técnico:
- migrar en una rama;
- revisar cambios de color management;
- WebGL2 requerido en versiones modernas;
- benchmark antes/después;
- sólo después decidir.

No mezclar migración de renderer con rediseño del gameplay.

---

# 17. Accesibilidad: conservar lo bueno sin llenar el HUD

Conservar:
- targets;
- forced-colors;
- reduced/none;
- alternativa textual;
- mensajes;
- controles equivalentes.

Pero:
la accesibilidad no exige que todos los controles alternativos estén abiertos permanentemente.

Propuesta:
- HUD principal limpio;
- drawer `Controles accesibles`;
- D-pad visible sólo en touch/opción;
- cámara alternativa en menú accesible;
- foco y live regions continúan.

---

# 18. Pruebas nuevas

El banco actual demuestra una ruta dorada.

Añadir:

### Libertad
- puente de madera;
- piedra;
- híbrido;
- cruzar por dos posiciones diferentes.

### Construcción
- colocar contra cara superior/lateral;
- construir mientras Vera se mueve;
- retirar;
- deshacer cadena;
- guardar/cargar construcción arbitraria.

### Cámara
- pared entre cámara y Vera;
- interior pequeño;
- terraza;
- zoom extremo.

### Escala
- 100;
- 1.000;
- 5.000 bloques;
- medir draw calls, vertices, ms/frame y tiempo de edición.

### Mundo
- chunk edit;
- borde entre chunks;
- save/load;
- room recognition;
- NPC pathfinding sobre estructura construida.

### Producto
- ¿se entiende la primera acción sin leer portada?
- ¿la persona construye directamente sin pensar en “modo cursor”?
- ¿su construcción produce una consecuencia visible?

---

# 19. Roadmap recomendado

## Fase 1 · FEEL PASS sobre El Vado
Sin mundo grande todavía.

- HUD reducido;
- hotbar;
- construir sin secuestrar movimiento;
- cámara mejor;
- animaciones de Vera;
- recoger del entorno;
- feedback colocar/romper;
- reemplazar objetivo QA de parcela por refugio/taller funcional.

**Objetivo:** que la misma escena deje de sentirse como prototipo.

## Fase 2 · BUILDER FOUNDATION
- voxel terrain/chunks;
- romper/recoger terreno;
- 8–12 piezas;
- crafting;
- room system;
- save v2;
- stress test.

## Fase 3 · LIVING WORLD
- 1–3 residentes;
- uso de habitaciones;
- pequeñas rutinas;
- proyectos/blueprints;
- nuevas recetas;
- materiales en zonas de exploración.

## Fase 4 · ENCLAVE
- mapa mayor;
- varias zonas;
- secretos;
- dos o más problemas de construcción;
- parcela/base persistente;
- libre construcción después de la introducción.

---

# 20. Veredicto

El prototipo actual ha resuelto el problema que el storyboard anterior no resolvía:
**ahora existe un mundo 3D real, Vera está dentro y lo construido se recorre físicamente.**

No lo rehacería desde cero.

Pero todavía no es la referencia Dragon Quest Builders que María describió.

Su cuello de botella ya no es el 3D.

Es:
1. **loop de juego**;
2. **construcción desde el personaje, no desde un editor**;
3. **mundo transformable**;
4. **consecuencias vivas de construir**;
5. **progresión y libertad**;
6. **arquitectura escalable a mundo voxel editable**.

Gate de estudio:
`KEEP_3D_CORE_REWORK_GAME_LOOP_INPUT_WORLD_RESPONSE_AND_SCALE`

Siguiente prototipo recomendado:
`EL_VADO_R02_FEEL_PASS`

No ampliar el mapa antes de que esta misma escena se sienta como un juego.

`NO MAIN · NO PRODUCCIÓN`
