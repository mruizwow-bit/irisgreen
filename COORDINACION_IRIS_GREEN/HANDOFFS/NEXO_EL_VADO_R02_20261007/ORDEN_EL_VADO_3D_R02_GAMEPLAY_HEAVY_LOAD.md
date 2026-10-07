# NEXO · ORDEN ACTIVA · EL VADO 3D R02 · GAMEPLAY DEPTH + HEAVY LOAD

Fecha: 2026-10-07
Autoridad de producto: María
Coordinación: Nexo
Estado: ORDEN ACTIVA
Base exacta revisada: `EL_VADO_3D_VERA_3.zip`
SHA-256: `6ba147f79e49ee23807b92149b37dc08dc16b1419ea59cef83e7dbc8d0858bd5`
Vídeo revisado: `el-vado-vera_3.mp4`
SHA-256 vídeo: `cf8702bcac04380f8f73f528919666076ff52d14da5e23b3ffd0cddb561a936e`

## 1. Decisión de María

Dos problemas de producto siguen abiertos:

1. **El movimiento de coger algo pesado no sirve.**
2. **El juego sigue siendo demasiado básico.**

La entrega actual conserva valor técnico, pero NO es todavía la experiencia final.

No hacer otro patch mínimo centrado sólo en bugs.
Construir R02 sobre el motor existente.

## 2. KEEP técnico

No reabrir sin evidencia:
- mundo 3D;
- cámara libre;
- construcción por caras/celdas;
- soporte estructural;
- costes;
- retirar;
- deshacer;
- guardado;
- teclado;
- touch;
- NORMAL / REDUCED / NONE;
- Vera integrada;
- radio de recogida 0,75 m;
- correcciones de efectos pendientes;
- foco/teclado ya corregidos;
- transporte objeto→mano y mano→mundo;
- reglas de puente/escalera que ya funcionan.

R02 NO es un rebuild del motor.

## 3. Heavy load · problema actual

Actualmente:
- recoger madera de pie usa `Female_Stand_Pick_Fruit_Basket`;
- recoger del suelo usa `Collect_Object`;
- sólo después de recoger entra `Carry_Heavy_Object_Walk_inplace`.

Eso produce una discontinuidad corporal:
**objeto aparentemente ligero al levantar → objeto pesado al transportar**.

No es suficiente que el prop llegue a la mano.
La animación debe comunicar peso antes, durante y después del levantamiento.

## 4. Heavy load · solución requerida

Crear una secuencia específica de carga pesada.

### Debe tener, como mínimo

1. acercamiento y orientación al objeto;
2. base de apoyo estable;
3. flexión de rodillas/cadera o postura equivalente;
4. ambas manos cuando el volumen/peso lo requiera;
5. contacto antes del despegue;
6. anticipación/esfuerzo antes de levantar;
7. elevación progresiva del objeto;
8. ajuste del centro de gravedad;
9. transición limpia a locomoción con carga;
10. colocación/descarga coherente.

### Prohibido
- reutilizar `Female_Stand_Pick_Fruit_Basket` como si fuera carga pesada;
- teletransportar visualmente el material;
- hacer que el objeto “salte” a la mano para ocultar una mala pose;
- usar un gesto de objeto ligero y sólo después activar carry-heavy;
- inventar peso sólo con ralentizar el clip.

### Si no existe clip adecuado
No forzar uno incorrecto.

Opciones válidas:
- crear/retargetear una animación de heavy lift específica;
- construir una animación procedural sobre el esqueleto si es estable;
- producir un clip nuevo de levantamiento con dos manos.

La prioridad es la lectura corporal, no reciclar un clip porque ya está disponible.

## 5. Peso como sistema de juego

No todos los materiales deben sentirse iguales.

Definir al menos tres estados:
- ligero;
- medio;
- pesado.

El peso debe afectar de forma comprensible:
- animación;
- velocidad;
- capacidad de correr;
- giro;
- capacidad de saltar/subir;
- número de manos;
- tiempo de acción si procede.

No usar barras de stamina si no aportan.

No castigar con lentitud arbitraria.

## 6. Problema de gameplay actual

La estructura actual es demasiado lineal:

`recoger → cruzar → caja → terraza → parcela`

y el último objetivo:
`coloca 3 piezas y retira 1`

es una comprobación técnica, no una experiencia de juego suficientemente rica.

R02 debe convertir El Vado en un pequeño problema de construcción con decisiones reales.

## 7. Nuevo núcleo jugable

La pregunta del juego debe ser:

**¿Cómo cruzo, transporto materiales y construyo una ruta estable usando lo que tengo y el terreno que encuentro?**

No:
“¿qué botón pulso ahora?”

El mundo debe presentar un problema y permitir varias soluciones.

## 8. Estructura R02

Crear una partida corta pero completa con tres fases conectadas.

### Fase A · Llegar
- explorar la primera orilla;
- descubrir recursos;
- distinguir materiales;
- decidir qué recoger primero;
- reconocer al menos dos posibles rutas de cruce.

### Fase B · Resolver el vado
Permitir al menos dos soluciones reales:
- puente de madera;
- paso de piedra / apoyos mixtos;
- solución híbrida válida.

Deben diferir en:
- coste;
- estabilidad;
- cantidad de transporte;
- facilidad de construcción;
- acceso posterior.

No obligar a una única receta.

### Fase C · Llegar y construir arriba
La terraza no puede acabar en “coloca 3 y quita 1”.

Debe pedir un resultado funcional.

Ejemplos válidos:
- levantar un pequeño refugio;
- construir una plataforma estable para alcanzar algo;
- habilitar un paso elevado;
- reparar una estructura;
- transportar un objeto pesado hasta un punto de uso.

Debe haber condición estructural real, no contador artificial.

## 9. Decisiones y consecuencias

Añadir decisiones que tengan efecto visible.

Como mínimo:
- gastar madera aquí implica tener menos para otra solución;
- usar piedra puede dar más estabilidad pero exigir más transporte;
- una mala estructura no debe colapsar de forma punitiva, pero sí mostrar por qué no sirve;
- retirar una pieza puede afectar apoyos;
- una solución bien apoyada debe sentirse distinta de una improvisada.

El juego debe permitir corregir sin perder toda la partida.

## 10. Mundo más vivo

Sin convertirlo en mundo abierto.

Añadir:
- rutas alternativas legibles;
- recursos situados con intención;
- pequeñas señales ambientales;
- diferencia visual entre zonas;
- puntos de interés;
- consecuencias visibles de lo construido.

Evitar llenar de objetos decorativos sin función.

## 11. Objetivos menos tutorializados

No mostrar los cinco objetivos como checklist dominante desde el inicio.

La interfaz debe sugerir el propósito general y revelar ayuda contextual sólo cuando haga falta.

Mantener accesibilidad:
- lista textual alternativa disponible;
- progreso comprensible;
- no depender de memoria;
- no penalizar respuestas lentas.

Pero el juego visual no debe sentirse como seguir instrucciones numeradas.

## 12. Vera como parte del juego

Vera no es un cursor con piernas.

Integrar:
- mirar hacia aquello con lo que interactúa;
- levantar según peso;
- transportar según peso;
- colocar según altura/material;
- reacción corporal consistente al subir, bajar y construir.

No añadir expresiones teatrales innecesarias.

## 13. Construcción

KEEP:
- preview ✓/✕;
- motivo en texto;
- soporte;
- coste;
- devolución al retirar;
- deshacer.

Añadir:
- diferencias funcionales claras entre plataforma, bloque y escalera;
- al menos una situación donde cada una sea la mejor opción;
- combinaciones útiles;
- feedback visual de estabilidad/apoyo.

No añadir 20 piezas.

Profundidad por reglas, no por catálogo.

## 14. Accesibilidad

Mantener:
- teclado;
- touch;
- alternativa a drag;
- 44 px;
- foco visible;
- 320/390/1440;
- 200%;
- forced-colors;
- NORMAL / REDUCED / NONE;
- texto alternativo operativo.

Para heavy load en NONE:
- el cambio lógico se aplica;
- no debe quedarse un estado pendiente;
- el feedback debe explicar la acción aunque no haya animación.

## 15. QA específico heavy load

Entregar pruebas que no se limiten a distancia mano→objeto.

Medir:
- manos en contacto antes del despegue;
- objeto no asciende antes del contacto;
- pelvis/centro de masa cambia coherentemente;
- ambas manos cuando corresponde;
- transición lift→carry sin salto;
- carry→place sin salto;
- objeto no atraviesa cuerpo;
- no se separa de las manos más allá del umbral declarado.

Además:
- vídeo lateral;
- vídeo frontal/3/4;
- fotogramas clave.

## 16. QA de gameplay

Probar al menos:
- dos soluciones distintas al vado;
- ambas completables desde partida nueva;
- coste diferente;
- una solución híbrida;
- retirada que no rompe estado;
- undo;
- guardado/carga;
- teclado;
- touch;
- NORMAL/REDUCED/NONE;
- 320/390/1440.

No declarar profundidad jugable sólo porque ambas rutas existen en código.

## 17. HUMAN QA

Entregar un recorrido real sin posiciones de cursor inyectadas para la parte central del juego.

María debe poder juzgar:
- si levantar peso convence;
- si entiende qué hacer sin checklist;
- si hay decisiones;
- si dos partidas pueden resolverse distinto;
- si construir resulta satisfactorio;
- si Vera parece estar trabajando con objetos, no ejecutando clips sueltos.

## 18. Entrega

Entregar:
- `EL_VADO_3D_R02_GAMEPLAY.zip`;
- SHA256;
- manifest;
- vídeo completo;
- vídeo específico heavy lift;
- pruebas;
- lista KEEP/CHANGE;
- mapa de soluciones;
- costes;
- pendientes.

Gate esperado:
`EL_VADO_3D_R02_GAMEPLAY_AND_HEAVY_LOAD_READY_FOR_NEXO`

## 19. Límites

NO:
- tocar main;
- deploy público;
- rehacer Vera;
- rehacer pesos de falda dentro de esta orden;
- añadir catálogo enorme de piezas;
- convertirlo en sandbox sin objetivo;
- esconder la falta de profundidad con más UI;
- aceptar un clip de carga ligera como heavy lift.

## 20. Criterio de éxito

R02 pasa si:
- el levantamiento comunica peso de forma creíble;
- el transporte mantiene esa lectura;
- el juego ofrece al menos dos estrategias realmente distintas;
- el objetivo final es funcional, no un contador;
- la persona juega con el mundo, no con una checklist.

Dirección:
`KEEP_ENGINE · REWORK_GAMEPLAY_DEPTH · NEW_HEAVY_LIFT`
