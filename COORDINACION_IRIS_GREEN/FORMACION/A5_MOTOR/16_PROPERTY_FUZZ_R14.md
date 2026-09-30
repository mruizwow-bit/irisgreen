# MOTOR · A5 · ESTUDIO PROFUNDO R14 · PROPERTY-BASED TESTING, FUZZING E INVARIANTES

Fecha: 30/09/2026
Amplía: R01–R13
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Ejemplos no bastan

Un test de ejemplo pregunta:
> “¿funciona este caso?”

Un test basado en propiedades pregunta:
> “¿qué debe ser siempre verdad para toda una familia de casos?”

En runtime, las invariantes son especialmente valiosas:
- estados válidos;
- no overwrite stale;
- revisiones monótonas;
- imports no peligrosos;
- transiciones sin valores no finitos;
- cleanup idempotente.

## 2 · State-space testing

Para una máquina pequeña:
recorrer exhaustivamente.

Sabik Motion tiene:
- 5 estados;
- 3 niveles.

Transiciones exhaustivas:
`5 × 5 × 3 = 75`.

No hay razón para probar solo dos.

## 3 · Fuzzing determinista

Un fuzz útil para CI debe ser reproducible.

Usar:
- seed fija;
- registrar seed del fallo;
- reducir/minimizar caso si es posible.

No depender de `Math.random()` opaco si luego no se puede reproducir el fallo.

## 4 · Práctica real ejecutada

Módulos exactos del repositorio:

### Sabik Motion
`sabik/sabik-motion-r37.js`

Blob:
`292742308a9181215767e05ebccd2cb9c71b0e63`.

### Taller Local Data
`assets/ig-taller-local-data.js`

Blob:
`41ac87d565d58e21772a5bc362340e1c439e502f`.

Se cargaron directamente como CommonJS en un entorno JavaScript aislado.
No se modificó el producto.

## 5 · Resultado

```text
TOTAL CHECKS: 10094
FAILURES: 0
RESULT: PASS
```

**10.094 / 10.094 PASS.**

## 6 · Invariantes Sabik probadas

### Exhaustive transition matrix
Para toda combinación:
- from ∈ STATES;
- to ∈ STATES;
- level ∈ LEVELS.

Comprobado:
- from/to/level conservados;
- keyframes existen;
- duration finita;
- duration >= 0;
- same-state → duration 0;
- SIN_MOVIMIENTO → duration 0.

## 7 · effectiveLevel

Casos de precedencia:
- NORMAL;
- system reduced;
- explicit REDUCIDO;
- global off;
- low intensity;
- SIN_MOVIMIENTO.

Invariante:
off/low/no-motion prevalecen sobre motion expresivo.

PASS.

## 8 · project fuzz

Se generaron **10.000 combinaciones** deterministas de:
- interaction;
- operation;
- protection;
- safety.

Valores incluyen:
- conocidos;
- desconocidos;
- null;
- undefined.

Invariante:
`project(input)` siempre devuelve un estado miembro de `STATES`.

**10.000/10.000 PASS.**

## 9 · Invalid transition inputs

Probados:
- empty;
- bad;
- null;
- undefined;
- number.

Invariante:
estado inválido no se acepta silenciosamente.

PASS.

## 10 · Taller project round-trip

MemoryBackend real del módulo.

Flujo:
```text
save v1
→ save expected revision 1
→ revision becomes 2
→ export
→ validate import
→ payload preserved
```

PASS.

## 11 · Revision conflict

Se intentó guardar una versión stale con expectedRevision antigua.

Esperado:
`PROJECT_REVISION_CONFLICT`.

Obtenido:
PASS.

Invariante:
una revisión antigua no sobrescribe la más nueva.

## 12 · Invalid imports

Probados:
- contract version incorrecta;
- schema inválido;
- estudio incorrecto.

Todos rechazados.

PASS.

## 13 · Prototype pollution input

Se construyó JSON real con:
`"__proto__"`

dentro de payload.

Esperado:
`IMPORT_DANGEROUS_KEY`.

Obtenido:
PASS.

Esto prueba el guard del parser real, no la semántica especial de un object literal JS.

## 14 · Por qué 10.094 no significa “sin bugs”

Fuzzing cubrió estas propiedades concretas.

NO demuestra:
- DOM;
- focus;
- screen reader;
- memory leak;
- timing real;
- Worker concurrency;
- WebGL;
- mobile;
- integration.

Regla:
**número grande de tests no amplía mágicamente el alcance de lo probado.**

## 15 · Fuzz dimensions futuras

### State machines
- event sequences;
- repeated cancel;
- force refresh;
- concurrent calls.

### Project import
- depth boundary 31/32/33;
- node count boundary;
- string size;
- byte size;
- Unicode;
- duplicate fields;
- numeric extremes.

### Pointer
- down/move/cancel;
- multiple pointer IDs;
- lost capture.

### Resize
- zero dimensions;
- rapid oscillation;
- huge DPR.

### Timers
- delayed callbacks;
- negative/huge deltas.

## 16 · Sequence fuzzing

El siguiente nivel no genera solo inputs independientes.

Genera secuencias:
```text
START
→ INPUT
→ CANCEL
→ RESIZE
→ INPUT
→ HIDE
→ SHOW
→ DESTROY
```

y verifica invariantes después de cada paso.

Esto se acerca a model-based testing.

## 17 · Model-based testing

Mantener:
- modelo simple de referencia;
- implementación real.

Aplicar el mismo comando a ambos.

Comparar:
- estado;
- observable output;
- errors.

Especialmente útil para:
- undo/redo;
- project revisions;
- game state;
- dialogs;
- state machines.

## 18 · Metamorphic testing

Cuando no conocemos output exacto, sí conocemos relaciones.

Ejemplos:

### Resize
resize ida/vuelta no altera domain state.

### Reduced motion
cambia presentación, no resultado funcional.

### Render rate
60 vs 120 Hz → mismo state tras mismo simulation time.

### Export/import
round-trip conserva payload canónico.

## 19 · Boundary testing

Los límites merecen tests explícitos:
- 0;
- 1;
- max-1;
- max;
- max+1.

Más valioso que muchos valores medios.

## 20 · Mutation mindset

Preguntar:
“si elimino este guard, ¿qué test falla?”

Si ningún test falla:
el guard quizá no está demostrado.

Ejemplos:
- eliminar dangerous-key reject;
- eliminar revision comparison;
- eliminar motion state validation.

Las suites deberían detectarlo.

## 21 · Fuzz safety

Fuzzing puede consumir:
- CPU;
- memoria;
- tiempo.

En CI:
- seed;
- max cases;
- timeout;
- artifact del caso mínimo.

No hacer un fuzz infinito.

## 22 · Evidence

Registrar:
- module SHA;
- seed;
- number cases;
- properties;
- failure count;
- minimized reproducer.

En esta práctica:
- 2 blobs exactos;
- 10.094 checks;
- 0 failures.

## 23 · Estado R14

Práctica real:
**10.094/10.094 PASS.**

Marcador:
`MOTOR_PROPERTY_FUZZ_INVARIANT_TESTING_STUDIED_R14`

No:
- cambio de tests de producto;
- build;
- merge;
- deploy;
- main/production.
