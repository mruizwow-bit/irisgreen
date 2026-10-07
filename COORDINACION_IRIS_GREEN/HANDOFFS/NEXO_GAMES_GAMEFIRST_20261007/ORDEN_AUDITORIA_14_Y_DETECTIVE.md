# NEXO · ORDEN ACTIVA · JUEGOS · AUDITORÍA GAME_FIRST 14/14 + DETECTIVE VERTICAL SLICE

Fecha: 2026-10-07
Autoridad: María
Coordinación: Nexo
Norma: R41 §2 workspace-first + §6 mobile-specific
Precedencia de color:
`GLOBAL_UI_TOKENS_FOR_CHROME · DOMAIN_COLOR_INSIDE_THE_WORKSPACE`

## 1. Inventario 14/14

Base consolidada:
13 juegos interactivos históricos:
1. Cada cerebro, su camino
2. ¿Dónde se fue la energía?
3. El archivo de capacidades
4. El aula al revés
5. El detective de los sentidos
6. El mapa del tesoro de casa
7. El traductor de casa
8. El traductor de instrucciones
9. La cena de los planes
10. La consulta
11. La máquina de empezar
12. Las cinco cosas
13. Palabra misteriosa

+ 14. Contar y pagar, reclasificado como GAME en la arquitectura vigente.

No incluir la colección de 130 fichas como “juegos interactivos” para esta auditoría.

## 2. Auditoría obligatoria por juego

Medir sobre el runtime real, en desktop y móvil:

- primera acción útil;
- Y/scroll desde entrada hasta primera acción;
- fracción de viewport hasta esa acción;
- workspace visible en primer viewport: sí/no;
- texto/documentación antes de empezar;
- controles interactivos visibles en primer viewport;
- móvil: composición específica o apilado del desktop;
- overflow;
- acción → consecuencia visible;
- decisión real: sí/no;
- si la solución está prescrita por instrucciones;
- estado: KEEP / REWORK / REBUILD.

No declarar números no medidos.

## 3. Criterios R41

### Workspace-first
Al entrar:
- la actividad debe estar disponible sin atravesar hero/manual largo;
- ayuda/tutorial/ajustes secundarios van a panel/drawer/popover;
- no scroll obligatorio para encontrar el juego.

### Mobile-specific
No aceptar:
- columnas desktop simplemente apiladas;
- página interminable;
- controles separados del objeto de juego.

Usar cuando proceda:
- bottom dock;
- sheet;
- toolbar contextual;
- viewport del juego dominante.

## 4. Detective · primer vertical slice

Estado inicial:
`REBUILD`

Motivo:
- peor caso ya señalado por medición previa;
- el HTML actual presenta título + explicación + instrucciones + cestas antes de que la persona entre en el flujo;
- la experiencia sigue leyendo como clasificador guiado, no como situación lúdica.

No conservar la composición actual como base final.

## 5. Nuevo contrato de Detective

`VER → PROBAR → CAMBIAR → OBSERVAR CONSECUENCIA → RESOLVER`

Entrada:
- situación visual inmediatamente jugable;
- una primera carta/objeto claramente manipulable;
- tres destinos comprensibles por escena y texto breve;
- sin manual previo.

No revelar “cómo jugar” en un párrafo largo.

La persona:
1. ve una situación;
2. prueba dónde poner algo;
3. observa cómo cambia la escena/colección;
4. puede moverlo de nuevo;
5. empieza a construir su propia clasificación.

No hay respuesta correcta universal.

La categoría “Depende” no se convierte en respuesta obligatoria ni moraleja prescrita.

## 6. Causalidad visible

Al mover una carta:
- cambia físicamente de zona;
- la zona responde visualmente;
- el objeto conserva identidad;
- se puede deshacer/mover;
- la consecuencia es comprensible sin leer un mensaje largo.

No usar “bien/mal”.

## 7. UI

Siempre visible:
- juego;
- deshacer si aplica;
- reiniciar;
- ayuda secundaria.

Bajo demanda:
- explicación;
- accesibilidad;
- teoría/contexto;
- links relacionados.

No panel enorme.

## 8. Tokens

Chrome/UI:
- tokens globales LIGHT / DARK NAVY;
- no #FFFFFF extenso;
- no paleta ciruela propia.

Dentro del workspace:
- las tres zonas pueden tener color semántico propio;
- cada estado además necesita nombre/forma/borde/patrón u otra señal;
- color nunca único canal.

## 9. Accesibilidad

- teclado;
- touch;
- alternativa a drag;
- foco visible;
- >=44 px policy;
- 320/390/1440;
- 200%;
- forced-colors;
- reduced motion;
- NONE si existe motion;
- ES/EN;
- mismo estado del juego para interacción visual y accesible.

## 10. Entrega

Primero:
A. informe 14/14 completo;
B. Detective vertical slice.

No tocar los otros 13 todavía.

Gate informe:
`GAMES_14_GAME_FIRST_AUDIT_COMPLETE`

Gate Detective:
`DETECTIVE_GAME_FIRST_VERTICAL_SLICE_READY_FOR_NEXO`

NO MAIN · NO PUBLIC DEPLOY · NO REBUILD 14 EN BLOQUE.
