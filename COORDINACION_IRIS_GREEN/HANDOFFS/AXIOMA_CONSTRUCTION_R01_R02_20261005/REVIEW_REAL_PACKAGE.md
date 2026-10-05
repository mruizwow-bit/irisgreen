# AXIOMA · CONSTRUCCIÓN R01 · STORYBOARD R02 · REVIEW REAL

Fecha: 05/10/2026

Estado:
`AXIOMA_CONSTRUCTION_R01_R02_REWORK_REQUIRED`

## Evidencia auditada

Rama:
`prisma/construction-r01-storyboard-r02-20261005`

Artifact:
`PRISMA_CONSTRUCTION_R01_STORYBOARD_R02`

Artifact ID:
`11342176274`

Run:
`37302920832 · SUCCESS`

Digest GitHub artifact:
`sha256:b469c8df6e389b60698987947943dd92d8d4d60de4ec28e5ee5d4e7eb8788526`

ZIP interno:
`PRISMA_CONSTRUCTION_R01_STORYBOARD_R02.zip`

SHA-256 verificado:
`5aa0705b2a186681f223ab50d019ae1c1d167b2f66464001c1d8b2b08c282c1e`

`sha256sum -c`:
**PASS**

Archivos internos:
**22/22 presentes**.

Inventario comprobado:
- plano 1440;
- F01–F06 × 390;
- F01–F06 × 1440;
- Solución A × 390/1440;
- Solución B × 390/1440;
- contact sheets × 390/1440;
- manifest;
- inventory;
- README.

## 1 · Lógica espacial / producto

### Estado inicial
PASS.

F01/F02 muestran:
- dos cruces incompletos;
- caja cerrada;
- terraza no accesible;
- parcela bloqueada;
- materiales iniciales antes de construir.

No aparece ningún puente ni terraza resueltos de antemano.

### Reto 1 · soporte y alcance
PASS.

F03:
- preview válido en R1-C1-z1;
- preview no consume;
- pieza seleccionada = plataforma.

F04:
- muestra dos plataformas ya colocadas;
- C3 queda inválida por falta de apoyo;
- se explicita:
  `Máx. 2 plataformas desde banco. Bloque z0.`

El error no depende solo del rojo:
también existe copy `Falta apoyo · R1-C3`.

F05:
- cinco plataformas C1–C5;
- bloque z0 bajo C3;
- personaje sobre ruta;
- caja abierta;
- +12 piedra;
- escalera desbloqueada.

### Soluciones A/B
PASS factual/espacial del storyboard.

A · R1:
- C1–C5 a z1;
- bloque C3 z0;
- coste 5 madera + 1 piedra.

B · R2:
- C1–C5 a z1;
- bloques C2/C4 z0;
- coste 5 madera + 2 piedra.

Las secuencias dibujadas/documentadas respetan:
- apoyo <=2;
- cursor <=2;
- bloques no recorribles;
- sin escalera antes de caja.

### Reto 2 · verticalidad
PASS parcial.

F06 demuestra correctamente:
- escalera disponible después de abrir la caja;
- cambio de nivel por escalera;
- personaje en terraza;
- parcela libre;
- coste declarado `2 escaleras = 4 madera`.

No se detecta contradicción con el contrato de Nexo.

## 2 · BLOCKER · clipping real en 1440

REWORK_REQUIRED.

Los frames 1440:
- `F03_PREVIEW_1440`;
- `F04_PROBLEMA_1440`;
- `F06_ESCALERAS_TERRAZA_LIBRE_1440`;

cortan el panel de estado inferior.

Ejemplos:
- `Posición válida · R1-C1-z1` queda parcialmente fuera de imagen;
- `Falta apoyo · R1-C3` queda parcialmente fuera;
- `Terraza alcanzada · construcción libre` queda parcialmente fuera.

Esto impide aprobar reflow/layout incluso antes de código.

Corrección:
- reservar altura real para feedback;
- ningún texto ni borde puede cruzar el límite inferior;
- verificar F01–F06 completos a 1440.

## 3 · BLOCKER · falta 320

El generador R02 produce únicamente:
- 390×844;
- 1440×900.

No existe evidencia 320.

Estado:
`CONSTRUCTION_R02_320_PENDING`

Corrección:
- producir F01–F06 a 320;
- sin clipping horizontal;
- sin pérdida de controles;
- feedback completo;
- no reducir targets por debajo de 44 CSS px.

## 4 · BLOCKER · mobile no tiene controles touch reales

En 390 se dibuja una leyenda:

`← ↑ ↓ → ✓ colocar ↻ girar ± altura ⌫ retirar ↶ deshacer ✕ cancelar`

pero son caracteres dentro de una caja informativa, no controles dibujados/definidos como targets táctiles.

Por tanto todavía no existe equivalente touch demostrable para:
- mover cursor;
- confirmar;
- girar;
- subir/bajar altura;
- retirar;
- deshacer;
- cancelar.

Corrección pre-code:
mostrar al menos un frame de construcción 320/390 con controles touch reales y su jerarquía.

Patrón aceptable:
- D-pad de 4 botones;
- acción primaria confirmar/colocar;
- controles secundarios de girar/altura/retirar/deshacer/cancelar;
- cada target >=44×44;
- no exigir gesto fino o drag.

## 5 · BLOCKER · target principal móvil <44 px

El propio generador define para 390:

- header = 56 px;
- botón `Recorrer/Construir`: y=9…47.

Altura dibujada:
**38 px**.

No alcanza el objetivo mínimo de 44 px.

Corrección:
`Recorrer/Construir >=44×44 CSS px`.

## 6 · REWORK · focus y selected no están separados

La pieza `Plataforma` muestra selected mediante borde azul.

No existe en el storyboard:
- estado de foco independiente;
- diferencia visual inequívoca entre `selected` y `keyboard focus`;
- definición de retorno/conservación de foco tras colocar/error/deshacer.

Requisito:
- selected = estado persistente;
- focus = outline adicional independiente;
- el foco permanece en el control/elemento lógico tras error o colocación;
- no secuestrar foco por feedback.

## 7 · REWORK · contraste de labels sobre escena

Hay labels esenciales con contraste insuficiente.

Muestreo directo del PNG 390:
- R1 naranja sobre agua local ≈ **1.2:1**;
- R2 rosa sobre agua local ≈ **1.0:1**.

Además el generador usa texto claro sobre arena para:
- `Madera`;
- `Piedra`;
- `Parcela bloqueada/libre`.

Con los colores declarados del generador, blanco/claro sobre `SAND=(228,200,147)` queda alrededor de **1.5–1.6:1**.

No alcanza 4.5:1 para texto normal.

Corrección:
- badge/fondo sólido contrastante;
- o texto oscuro compatible;
- no usar color como único identificador de R1/R2;
- mantener nombre textual R1/R2.

## 8 · PENDING · retirada con dependencias + deshacer

Las reglas y leyenda mencionan:
- retirar;
- devolver coste;
- deshacer.

Pero no hay estado visual que defina:
- qué ocurre al intentar retirar un soporte con piezas dependientes;
- cómo se comunica el bloqueo;
- qué restaura exactamente `deshacer`;
- dónde permanece el foco/cursor.

Antes de código, añadir una microsecuencia o especificación inequívoca:
1. intento de retirar soporte dependiente;
2. acción bloqueada + motivo textual;
3. undo de una acción válida;
4. inventario/estado restaurado.

No hace falta rehacer F01–F06.

## 9 · PENDING · NORMAL / REDUCED / NONE

El paquete es estático y no contiene contrato de transición.

Añadir matriz breve:

### NORMAL
Puede existir:
- desplazamiento de personaje;
- preview;
- transición de colocación.

### REDUCED
- sin cámara flotante;
- sin grandes desplazamientos interpolados;
- transición breve/no espacial;
- feedback permanece textual.

### NONE
- cambio instantáneo;
- cero movimiento continuo;
- ninguna información depende de animación.

## 10 · PENDING · forced-colors

GOOD:
- válido/inválido ya tienen copy además de verde/rojo;
- pieza bloqueada usa `Bloq.` además de gris.

Pendiente:
- selected/focus;
- rutas R1/R2;
- preview;
- modo Recorrer/Construir.

Definir equivalentes con:
- borde/outline del sistema;
- texto/estado;
- no depender de azul/verde/rojo/púrpura.

## 11 · Calidad de packaging

PASS:
- artifact accesible;
- ZIP SHA verificado;
- 22 archivos presentes.

Mejora no bloqueante:
- `manifest.json` debería enumerar también plano, solutions por filename, contact sheets, inventory y README;
- idealmente hashes por archivo.

Los PNG son RGB pero no llevan ICC sRGB embebido.
Para storyboard no bloquea el concepto, pero conviene etiquetar sRGB si estos PNG serán usados como evidencia visual canónica.

## 12 · Player

El proxy 2D actual se acepta exclusivamente como placeholder de storyboard.

No se considera que el FBX femenino final esté integrado.

Estado:
`PLAYER_R01_FEMALE_3D_PENDING_IMPLEMENTATION`

## Corrección mínima requerida

NO rehacer concepto.
NO rehacer soluciones A/B.
NO código.
NO runtime.
NO main.

Patch R02:
1. arreglar clipping 1440 F03/F04/F06;
2. añadir 320;
3. mostrar controles touch reales;
4. aumentar Recorrer/Construir a >=44;
5. definir focus vs selected;
6. corregir contraste de labels;
7. añadir microestado retirada/dependencia/undo;
8. añadir matriz NORMAL/REDUCED/NONE + forced-colors.

Después Axioma retesta solo esos puntos.

Gate esperado:
`AXIOMA_CONSTRUCTION_R01_R02_STORYBOARD_READY_FOR_HUMAN_QA`

Hasta entonces:
`NO VISUAL PASS · NO CODE AUTHORIZATION`.
