# NEXO · ORDEN ACTIVA · VIDA MARINA 3D R02 · WORLD-FIRST EXPERIENCE

Fecha: 2026-10-06  
Autoridad de producto: María  
Coordinación: Nexo  
Ejecutor previsto: Claude Design  
Estado: ORDEN ACTIVA  
Decisión previa: `MARIA_MARINE_3D_PRODUCT_DIRECTION_SELECTED`

## 1. Decisión cerrada

María ha probado la comparación 2D ↔ 3D y fija:

> «En 3D se entiende mejor».

La dirección de producto queda elegida.

No volver a comparar 2D vs 3D como condición para avanzar.

R06.1/R06.1a se conserva como donor de:
- lógica de observación;
- selección por intención;
- bloqueo factual/perceptual;
- candidatos múltiples;
- estados de movimiento;
- accesibilidad;
- persistencia;
- pruebas y aprendizajes.

Pero ya no es una alternativa visual/espacial pendiente de elección.

## 2. Base exacta

Piloto:
`vida-marina-3d-R01.zip`

SHA-256:
`5a1d699b9d3ab1215beb63a7ad32284c8168e5359b4fd597193e36c0125d5e35`

KEEP confirmado:
- mundo/cámara/posiciones 3D;
- raycast;
- descarte por alfa;
- luz 3D;
- movimiento orgánico;
- billboards declarados honestamente;
- Three.js local;
- seis PNG reutilizados byte a byte;
- Normal / Reducido / Ninguno;
- 0 salto al cambiar modo;
- calamar bloqueado/no examinable;
- estados reales con dos candidatos;
- teclado izquierda/derecha para elegir candidato;
- haz 10,5°/4,4°;
- sin CDN;
- sin modelos volumétricos nuevos.

No tocar R06.1a.

## 3. Objetivo de R02

Pasar de “interfaz que controla una escena” a:

**EL AGUA ES LA INTERFAZ PRINCIPAL**

Contrato:

`EXPLORE → LOCATE → REVEAL`

La experiencia debe sentirse como:
- mirar;
- orientarse;
- moverse;
- acercar luz;
- localizar;
- elegir;
- observar;
- revelar;
- volver al mismo espacio.

No como:
- leer tarjetas;
- pulsar una lista de animales;
- seguir instrucciones laterales;
- operar un dashboard.

## 4. Mundo primero

La escena debe ocupar el protagonismo visual.

### Obligatorio
- área 3D principal dominante;
- panel secundario plegable/compacto;
- controles alternativos accesibles sin competir con la escena;
- instrucciones breves y contextuales;
- no tres tarjetas de animales visibles permanentemente como interfaz principal.

### Interacción primaria
La persona debe poder completar el flujo principal directamente en el mundo:
1. girar/orientarse;
2. mover luz;
3. detectar animal;
4. seleccionarlo;
5. observar señal;
6. revelar;
7. cerrar y continuar en el mismo contexto.

El panel textual queda como:
- alternativa accesible;
- apoyo;
- estado;
- recuperación;
- no como método principal.

## 5. Profundidad espacial real

Sin rehacer animales.

Añadir señales de profundidad:
- planos cercano/medio/lejos;
- partículas a distintas distancias;
- roca/fondo marino;
- vegetación o estructuras simples first-party;
- oclusiones;
- elementos delante y detrás de animales;
- diferencias de escala por distancia;
- recorridos que cambien relaciones espaciales al girar.

Debe poder ocurrir que:
- un animal esté parcialmente oculto;
- al girar aparezca otro;
- volver a una orientación previa recupere el contexto.

No usar decoración masiva.
No fatigar.

## 6. Billboards · KEEP con límite explícito

Para R02:
- mantener PNG como billboards;
- no producir modelos 3D masivos;
- no deformar/extruir PNG para fingir volumen;
- no inventar anatomía lateral;
- documentar el límite cuando un animal se vea como lámina.

Objetivo de R02:
probar experiencia espacial, no resolver todavía modelado zoológico volumétrico.

Si el billboard muestra un límite evidente:
registrarlo como evidencia para decidir futuros modelos individuales.

## 7. Cámara y movimiento

Cámara:
- orientación clara;
- movimiento suave;
- límites del volumen;
- sin cámara automática;
- sin vuelo rápido;
- sin perder horizonte/orientación;
- sin saltos al cambiar estado;
- sin teletransporte.

Animales:
- rutas orgánicas;
- periodos separados;
- continuidad entre 30/60/120 Hz;
- no frame-dependent;
- no sincronía artificial;
- no desapariciones bruscas;
- no atravesar geometría relevante sin control.

## 8. Luz

KEEP:
- 10,5° contexto;
- 4,4° núcleo;
- proporción preservada.

La luz debe decidir de verdad qué se puede observar.

No dibujar cono falso.

Si vida ambiental = ninguna:
- el haz puede dejar de visualizarse por partículas;
- pero el estado debe seguir siendo comprensible por feedback y efecto sobre el animal.

No reabrir 31°/13° salvo nueva evidencia geométrica.

## 9. Selección por intención

Mantener y reforzar:
- raycast + alfa;
- selección explícita;
- estabilidad de objetivo;
- múltiples candidatos reales;
- izquierda/derecha en teclado;
- no elegir automáticamente por “más cuerpo iluminado”;
- no cambiar selección sin acción de la persona.

Nuevo oracle obligatorio:
`REAL_MULTI_CANDIDATE_SELECTION_STABILITY_ORACLE`

Debe probar caso real, no fixture vacío.

## 10. Observables

Conservar separación:
- BODY_CONTEXT;
- OBSERVABLE;
- REVEAL_FACT.

No revelar por presencia del animal.

Pez hacha:
- sólo observables validados/provisionales declarados.

Pez linterna:
- fotóforos sólo si región revisada permanece válida.

Calamar:
- visible;
- contexto permitido;
- si sigue bloqueado, no examinable;
- explicar causa real;
- no pedir “acerca la luz” si el problema no es la luz.

## 11. Reproducibilidad · cerrar pendiente Axioma

Antes de entregar R02:
- fijar artifact exacto de `datos.js` R06.1a;
- registrar SHA-256;
- declarar procedencia;
- generar `datos3d.js` desde esa fuente;
- añadir oracle:

`DATOS3D_REGENERATION_ORACLE`

Debe regenerar byte a byte el resultado esperado.

No mantener `datos3d.js` manualmente.

## 12. Pairing formal · corregir sin bloquear producto

Preparar de nuevo comparación perceptual A/B:
- mismo canvas;
- mismo tamaño final;
- mismo animal;
- mismo rasgo;
- misma pose equivalente;
- tamaño aparente equiparado;
- fracción iluminada equiparada;
- sin otro animal en el crop;
- fondo normalizado o explícitamente controlado;
- clave separada.

Separar preguntas:
A. perceptibilidad del rasgo;
B. comprensión espacial.

No usar este pairing para volver a decidir 2D/3D.

## 13. Accesibilidad

Obligatorio:
- teclado completo;
- touch/pointer;
- alternativa a drag;
- foco visible;
- >=44 px;
- 320 / 390 / 1440;
- 200 % texto;
- forced-colors;
- ES/EN;
- live regions sobrias;
- retorno de foco;
- controles alternativos equivalentes.

### Botones “Examinar”
No usar apariencia que parezca deshabilitada si el control sigue siendo accionable para explicar qué falta.

Si es operable:
- sin `aria-disabled=true`;
- estilo visual de “no listo” sin parecer muerto;
- descripción clara del estado.

## 14. Movimiento

Estados:
- NORMAL;
- REDUCED;
- NONE.

NONE:
- sin animación temporal;
- sin bloquear interacción;
- efectos lógicos inmediatos;
- contexto visible.

Cambiar entre modos:
- 0 m de salto;
- 0 teletransporte;
- selección preservada si sigue válida.

## 15. Seguridad sensorial

No:
- flashes;
- sacudidas;
- cámara involuntaria;
- aceleraciones repentinas;
- partículas densas;
- sonidos sorpresa;
- timeouts;
- presión;
- zoom automático fuerte.

## 16. Rendimiento

Medir en GPU real si disponible:
- FPS;
- frame time;
- input latency;
- memoria;
- arranque;
- resize;
- 320/390/1440;
- Intel UHD / hardware real cuando sea posible.

No usar SwiftShader como benchmark de producto.

Declarar hardware y backend.

Objetivo:
>=30 fps en hardware objetivo para este piloto.

No declarar benchmark universal desde una sola máquina.

## 17. QA de autor

Obligatorio:
- manifest/hashes;
- datos3d regeneration;
- alpha raycast;
- transparency corner null;
- real multi-candidate;
- selection stability;
- movement mode no jump;
- 30/60/120 Hz continuity;
- blocked squid;
- focus/resize;
- 320/390/1440;
- 200%;
- ES/EN;
- NORMAL/REDUCED/NONE;
- storage;
- no runtime errors.

Separar:
- AUTHOR_TEST;
- INDEPENDENT_BROWSER;
- AT_REAL;
- HUMAN_QA.

No mezclar.

## 18. Recorrido humano obligatorio

Entregar vídeo/recorrido de 30–60 s que muestre:

1. entrar;
2. mirar el agua;
3. girar;
4. descubrir animal parcialmente oculto;
5. orientar luz;
6. elegir entre dos si procede;
7. observar;
8. revelar;
9. cerrar;
10. volver a reconocer el espacio.

La escena debe demostrar la ventaja espacial elegida por María.

## 19. Entrega

Entregar:
- `VIDA_MARINA_3D_R02_WORLD_FIRST.zip`;
- SHA-256;
- manifest;
- hashes;
- fuente exacta;
- datos3d reproducible;
- vídeo real;
- capturas 1440/390/320;
- métricas;
- QA;
- pairing formal limpio;
- lista KEEP/CHANGE;
- límites;
- pendientes.

Gate esperado:
`CLAUDE_MARINE_3D_R02_WORLD_FIRST_READY_FOR_NEXO`

Secuencia:
Nexo retest → Axioma precheck → HUMAN QA María.

## 20. Límites

NO:
- volver a comparar 2D vs 3D;
- modelos 3D masivos;
- catálogo 200+;
- regenerar PNG;
- tocar R06.1a;
- main;
- deploy público;
- declarar QA científico completo;
- convertir la escena en videojuego de reflejos;
- hacer del panel el protagonista.

## 21. Criterio de éxito

R02 tiene éxito si, al abrirla, la persona entiende que debe explorar el agua y puede completar el flujo principal sin depender del panel lateral.

La escena debe responder por sí sola a:
- dónde estoy;
- qué puedo hacer;
- qué animal tengo delante;
- qué cambia cuando muevo la luz;
- qué pasa cuando selecciono;
- cómo sigo explorando.

Dirección:
`WORLD_FIRST · SCENE_AS_PRIMARY_INTERFACE`
