# PRISMA · CONSTRUCCIÓN R01 · STORYBOARD CORREGIDO R02

Fecha: 2026-10-05  
Owner: Prisma A8  
Issue: #369  
Rama: `prisma/construction-r01-storyboard-r02-20261005`  
Base: `main@827d17e5efe39280368a0d73a6c88596a1d3b0e9`

Estado:
`PRISMA_CONSTRUCTION_R01_STORYBOARD_READY_FOR_AXIOMA`

## Alcance

Storyboard únicamente.  
`NO CODE`  
`NO MAIN`  
`STOP BEFORE IMPLEMENTATION`

## Contradicciones cerradas con Nexo

### 1 · Colocación secuencial y apoyo

La rejilla se trata como 3D.

- una pieza por celda `(ruta, columna, z)`;
- plataforma = `z1`, recorrible;
- bloque = `z0`, soporte estructural;
- un bloque NO se trepa automáticamente;
- banco/terreno y bloque son apoyos sólidos;
- una plataforma no puede quedar a más de 2 plataformas del apoyo sólido más cercano;
- cursor de construcción: alcance máximo 2 casillas desde la posición recorrible actual;
- el jugador amplía el alcance caminando sobre las plataformas ya confirmadas.

Esto permite completar los dos cruces secuencialmente sin colocación remota.

### 2 · Movimiento vertical

Regla:

`BLOCK != STAIR`

- bloque = soporte, no escalón;
- no hay auto-climb;
- no hay salto;
- solo una escalera conecta dos niveles adyacentes;
- terraza = `z2`;
- la escalera se desbloquea al abrir la caja.

## Materiales

Iniciales alcanzables:
- madera: 24;
- piedra: 12.

Tras cruzar y abrir la caja:
- +12 piedra;
- escalera desbloqueada.

Costes:
- plataforma = 1 madera;
- bloque = 1 piedra;
- escalera = 2 madera.

Retirar:
- devuelve el coste completo.

Colocación inválida:
- no consume materiales.

## Progresión

`RECOGER → ELEGIR → CONSTRUIR → RECORRER → CORREGIR`

Reto 1:
- cruzar el canal;
- abrir caja de herramientas;
- desbloquear escalera.

Reto 2:
- construir acceso vertical;
- alcanzar terraza;
- desbloquear parcela libre;
- materiales ilimitados en construcción libre.

Mismo mundo persistente.
Sin reloj.
Ayuda opcional.
Sin ficha educativa.

## Solución A · R1 · apoyo central

Piezas:
- plataformas: R1-C1-z1, C2-z1, C3-z1, C4-z1, C5-z1;
- bloque: R1-C3-z0.

Coste:
- 5 madera;
- 1 piedra;
- 0 escaleras.

Secuencia:
`P1 → caminar C1 → P2 → caminar C2 → B3 → P3 → caminar C3 → P4 → caminar C4 → P5 → cruzar`

## Solución B · R2 · dos apoyos

Piezas:
- plataformas: R2-C1-z1, C2-z1, C3-z1, C4-z1, C5-z1;
- bloques: R2-C2-z0, C4-z0.

Coste:
- 5 madera;
- 2 piedra;
- 0 escaleras.

Secuencia:
`B2 → P1 → caminar C1 → P2 → caminar C2 → B4 → P3 → caminar C3 → P4 → caminar C4 → P5 → cruzar`

Ambas:
- cumplen apoyo máximo 2;
- cumplen cursor máximo 2;
- no usan escalera antes de caja.

## Controles unificados

### Recorrer
- flechas / WASD = mover;
- Enter / Space = acción contextual.

### Construir
- flechas / WASD = mover cursor;
- toolbar visible = plataforma / bloque / escalera;
- Enter / Space = confirmar;
- R = girar;
- PageUp / PageDown = altura;
- Delete = retirar;
- Ctrl+Z = deshacer;
- Escape = cancelar.

Touch:
- equivalente visible para cada acción;
- no drag obligatorio.

No:
- salto;
- E-only;
- mouse-only placement.

## Responsive

Frames directos:
- 390;
- 1440.

Adaptación prevista:
- 320;
- escena sigue visible;
- targets >=44 px;
- toolbar compacta;
- modo e inventario visibles;
- sin teléfono embebido dentro del frame.

## Player

Objetivo final:
- modelo femenino 3D aportado por María.

Proxy del storyboard:
- `neutro_brin.png`.

No se considera render final del FBX.

## Artefactos producidos

### Plano
- `CONSTRUCTION_R02_PLAN_ESCENARIO_1440.png`

### 6 frames 390
- `CONSTRUCTION_R02_F01_OBJETIVO_390.png`
- `CONSTRUCTION_R02_F02_RECOGIDA_390.png`
- `CONSTRUCTION_R02_F03_PREVIEW_390.png`
- `CONSTRUCTION_R02_F04_PROBLEMA_390.png`
- `CONSTRUCTION_R02_F05_CORRECCION_CRUCE_390.png`
- `CONSTRUCTION_R02_F06_ESCALERAS_TERRAZA_LIBRE_390.png`

### 6 frames 1440
Mismos IDs con sufijo `_1440.png`.

### Dos soluciones
- `CONSTRUCTION_R02_SOLUTION_A_390.png`
- `CONSTRUCTION_R02_SOLUTION_A_1440.png`
- `CONSTRUCTION_R02_SOLUTION_B_390.png`
- `CONSTRUCTION_R02_SOLUTION_B_1440.png`

### QA visual
- `CONTACT_SHEET_CONSTRUCTION_R02_390.png`
- `CONTACT_SHEET_CONSTRUCTION_R02_1440.png`

### Documentación
- `README_R02.md`
- `ASSET_INVENTORY.md`
- `manifest.json`

ZIP de entrega:
`PRISMA_CONSTRUCTION_R01_STORYBOARD_R02.zip`

SHA-256 ZIP:
`2526a0c4e3523b1a3d470882759978ec64b19c1dac725e0d326529e570359032`

## Asset inventory

Reutilizable:
- personaje femenino 3D FBX + texturas + animaciones;
- dirección visual de las nueve láminas R01.

Necesario posteriormente:
- terrain/islands/water;
- workshop/toolbox;
- wood/stone piles;
- extra stone cache;
- platform/block/stair;
- terrace/free parcel;
- animaciones player;
- cursor/focus/valid-invalid;
- iconos de controles.

Provisional:
- tablero vectorial del storyboard;
- proxy 2D del personaje;
- iconografía/grilla.

## Siguiente gate

`AXIOMA REVIEW → HUMAN QA MARÍA`

No código antes de ambos.
