# AXIOMA · CONSTRUCCIÓN R01 · R02 · RETEST PATCH P01–P08

Fecha: 05/10/2026

Estado:
`AXIOMA_CONSTRUCTION_R01_R02_PATCH_REWORK_REQUIRED`

## Evidencia auditada

Rama:
`prisma/construction-r01-storyboard-r02-20261005`

Commit de patch:
`e54acc4f44c030daa7fd2c3706fededb134763ca`

HEAD de estado:
`760b7137034516c4cd1bde995dbbcb0a853f0d98`

Run:
`37305550352 · SUCCESS`

Artifact:
`PRISMA_CONSTRUCTION_R01_STORYBOARD_R02_PATCH_P01_P08`

Artifact ID:
`11343313636`

Digest artifact:
`sha256:4c370aa1192d6b72be1d560b3a2b3bcfe3b5b075446c86245e70752cc2c06c61`

ZIP interno:
`PRISMA_CONSTRUCTION_R01_STORYBOARD_R02_PATCH_P01_P08.zip`

SHA-256 verificado:
`7fbca66968681a463d3035de30b5c9c80a839318f7b79f5e8f58e830e2f9bad7`

Archivos:
- 36/36 presentes;
- 35/35 entradas de manifest verificadas contra bytes reales;
- 30 PNG;
- 30/30 con ICC embebido;
- 30/30 RGBA;
- ZIP hash exacto PASS.

## Resultado P01–P08

### P01 · clipping inferior 1440
**PASS**

F03/F04/F06 1440 ya reservan área completa de feedback.

Verificado visualmente:
- `Posición válida · R1-C1-z1` íntegro;
- `Falta apoyo · R1-C3` íntegro;
- `Terraza alcanzada · construcción libre` íntegro.

No hay corte inferior.

### P02 · 320
**PASS de entrega**

Existen F01–F06 en 320×720 y tienen ICC sRGB.

La presencia del viewport 320 queda cerrada.

Nota: el finding P06 descrito abajo afecta contenido dentro de 320, pero no invalida que P02 como requisito de entrega esté resuelto.

### P03 · controles touch reales
**PASS**

F03/F04/F06 320/390 muestran controles discretos, no una leyenda:
- D-pad ← ↑ ↓ →;
- colocar;
- girar;
- Z+;
- Z−;
- retirar;
- deshacer;
- cancelar.

No se exige drag.

### P04 · targets >=44
**PASS**

Verificado en el generador:
- botones touch 320 = 44×48 o mayores;
- botones touch 390 = 48×48;
- `Recorrer/Construir` = 48 px de alto.

Se cierra el defecto previo de 38 px.

### P05 · focus vs selected
**PASS de storyboard**

F03 demuestra simultáneamente:
- `Plataforma` = selected persistente mediante ✓ + borde;
- `Bloque` = focus independiente mediante outline + marcador FOCO.

La especificación conserva foco tras:
- colocar;
- error;
- deshacer.

Feedback no recibe foco.

### P06 · contraste + labels de escena
**FAIL / REWORK REQUIRED**

La intención de contraste es correcta, pero la implementación del patch no está cerrada.

#### P06-A · solapamiento Madera / Piedra en 320 y 390

El generador dibuja:

`Madera: [w·0.18−4, w·0.18+64]`
`Piedra: [w·0.26−4, w·0.26+62]`

Resultado:

**320**
- Madera: x ≈ 53.6…121.6
- Piedra: x ≈ 79.2…141.2
- solapamiento ≈ **42.4 px**

**390**
- Madera: x ≈ 66.2…134.2
- Piedra: x ≈ 97.4…163.4
- solapamiento ≈ **36.8 px**

Evidencia visual:
la badge de Piedra tapa parte de Madera.

#### P06-B · Parcela bloqueada queda fuera de viewport en 320/390

El patch usa:

`fx = w·0.87`
`badge = [fx−72, fx+82]`

Resultado:

**320**
- x2 ≈ **360.4**
- overflow ≈ **40.4 px**

**390**
- x2 ≈ **421.3**
- overflow ≈ **31.3 px**

En los PNG reales la badge queda cortada por el borde derecho.

A 1440 sí cabe.

#### P06-C · +12 piedra sigue con contraste insuficiente

El patch corrige varias labels con badges, pero conserva desde el storyboard base:

`+12 piedra`

dibujado directamente con texto claro:
`TEXT = (245,249,253)`

sobre:
`SAND = (228,200,147)`.

Contraste calculado:
≈ **1.53:1**

No alcanza 4.5:1.

Aparece en F05/F06.

Además, `CONTRAST_MEASUREMENTS.json` no incluye este par, por lo que el QA automático no cubre todo el texto esencial sobre escena.

#### Corrección P06 exacta

No cambiar arte ni concepto.

1. Recolocar Madera/Piedra sin overlap en 320/390.
2. Clamp de `Parcela bloqueada/libre` al viewport/escena.
3. Convertir `+12 piedra` a badge contrastante o texto oscuro sobre superficie clara.
4. Añadir esos tres casos a QA:
   - `material_badges_overlap == 0`;
   - `parcel_badge_inside_bounds == true`;
   - contraste `+12 piedra >= 4.5:1`.
5. Retestar 320/390/1440.

### P07 · retirar / dependencias / deshacer
**PASS**

Microsecuencia 320/390/1440 presente y coherente:

1. retirar B3 dependiente → BLOQUEADO;
2. no muta piezas/inventario;
3. acción válida P1;
4. deshacer;
5. inventario y estado restaurados;
6. foco vuelve a R2-C1.

No hay contradicción con reglas previas.

### P08 · NORMAL / REDUCED / NONE + forced-colors
**PASS de especificación pre-code**

La matriz cubre:
- Recorrer;
- Construir;
- preview válido/inválido;
- selected;
- focus;
- R1/R2;
- colocar;
- retirada bloqueada;
- deshacer;
- modo Recorrer/Construir.

Regla explícita:
ninguna información, regla, éxito, error o acción depende solo de animación o color.

## Estado global

P01 = PASS
P02 = PASS
P03 = PASS
P04 = PASS
P05 = PASS
P06 = **FAIL**
P07 = PASS
P08 = PASS

No se reabre:
- concepto;
- soluciones A/B;
- costes;
- apoyo/alcance;
- player proxy;
- motion matrix;
- touch model.

Único rework restante:
`P06_LABEL_LAYOUT_AND_CONTRAST_PATCH`

## Secuencia

`PATCH P06 → AXIOMA RETEST P06 → HUMAN QA MARÍA`

Todavía NO emitir:
`AXIOMA_CONSTRUCTION_R01_R02_STORYBOARD_READY_FOR_HUMAN_QA`

`NO CODE · NO RUNTIME · NO MAIN`.
