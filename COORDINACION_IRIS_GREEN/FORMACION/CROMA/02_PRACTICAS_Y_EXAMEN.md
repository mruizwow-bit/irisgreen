# CROMA · PRÁCTICAS Y EXAMEN INTERNO · R01

Fecha: 03/10/2026

## Principio

Leer no equivale a dominar.

Croma pasa de `FOUNDATION_STUDIED_PRACTICE_PENDING` a `FOUNDATION_PASS_INTERNAL` solo cuando exista evidencia suficiente de prácticas y casos negativos.

## P01 · Precedencia y fuente de verdad

### Ejercicio
Recibir:
- una orden antigua;
- una decisión posterior de María;
- una rama con un donor;
- un estado actual diferente.

Debe reconstruir:
- qué sigue vigente;
- qué quedó superseded;
- qué es KEEP;
- qué owner actúa ahora.

### PASS
No reabre arte aprobado ni ejecuta una orden obsoleta.

### Caso negativo
“Lo pone en la primera orden, por tanto sigue activo” = FAIL.

## P02 · Brief visual ejecutable

Crear un brief que incluya:
- objetivo;
- usuario/contexto;
- tarea;
- información principal;
- estados;
- composición;
- tokens;
- responsive;
- ES/EN;
- accesibilidad prevista;
- motion;
- assets;
- performance;
- PASS/FAIL;
- handoff.

### PASS
Prisma/Motor/Vector pueden ejecutar sin adivinar intención.

## P03 · Auditoría de tokens y contraste

Sobre los tokens canónicos 2026:
- comprobar pares de texto;
- comprobar borde funcional;
- distinguir separación decorativa de boundary funcional;
- documentar qué elementos NO pueden depender de un separador de bajo contraste.

### Evidencia R01 ya realizada
Cálculo WCAG relativo sobre tokens actuales:

- LIGHT `#17395C` / `#F6F8FB` ≈ **11.11:1**;
- LIGHT muted `#435268` / `#F6F8FB` ≈ **7.46:1**;
- LIGHT link `#1F5F8B` / `#F6F8FB` ≈ **6.43:1**;
- LIGHT focus `#5A49A8` / `#F6F8FB` ≈ **6.68:1**;
- DARK `#EEF4F8` / `#0B1A2B` ≈ **15.82:1**;
- DARK muted `#C9D5DD` / `#0B1A2B` ≈ **11.74:1**;
- DARK link `#9FDCEA` / `#0B1A2B` ≈ **11.61:1**;
- LIGHT border-control `#7A869D` / page ≈ **3.45:1**;
- DARK border-control `#8494A8` / page ≈ **5.67:1**;
- separadores suaves dan ratios mucho menores y NO deben ser el único indicador de un control/límite funcional.

Resultado:
`P03_FOUNDATION_PRACTICE_PASS`.

Este cálculo no equivale a conformidad global: depende del uso, tamaño, estado, fondo efectivo y componente real.

## P04 · Responsive real

Tomar una escena desktop y especificar 390/320.

Debe decidir:
- qué permanece;
- qué cambia de orden;
- qué reduce densidad;
- qué se oculta por ser secundario;
- qué target crece;
- qué asset se sirve;
- qué NO se miniaturiza.

### Caso negativo
“scale(0.3)” o screenshot encogido = FAIL.

## P05 · ES/EN visual parity

Diseñar el mismo componente con copy ES y EN.

Comprobar:
- expansión de texto;
- salto de línea;
- control flexible;
- nombres accesibles;
- alt;
- estados/error;
- misma acción y jerarquía;
- idioma correcto;
- no texto quemado en raster si debe localizarse.

### PASS
Ambos idiomas son producto completo.

## P06 · Accesibilidad desde concepto

Para una interacción con drag/motion/color:
- definir alternativa a drag;
- estado no color-only;
- reduced motion;
- no-motion;
- foco/keyboard/touch;
- target;
- feedback textual o estructural cuando proceda.

### Caso negativo
“Se lo pasa a Axioma después” = FAIL.

## P07 · Diseño cognitivo / baja estimulación

Comparar dos propuestas:
A. alto brillo, varias capas de cristal, movimiento continuo, múltiples llamadas;
B. superficie opaca matizada, jerarquía estable, chrome contenido, movimiento solo de estado.

Explicar cuándo y por qué elegir B en Iris Green sin convertir “baja estimulación” en una paleta vacía o sin personalidad.

## P08 · Materialidad E4

Revisar una experiencia principal y responder con evidencia:
1. ¿parece producto terminado?
2. ¿hay materiales diferenciados?
3. ¿la luz construye volumen?
4. ¿hay contacto/oclusión?
5. ¿hay profundidad?
6. ¿la composición explica la acción?
7. ¿tiene identidad propia?
8. ¿móvil conserva dirección?
9. ¿arte e interacción están integrados?
10. ¿performance/accesibilidad siguen siendo viables?

Si falla una dimensión crítica:
`VISUAL_REWORK_REQUIRED`.

## P09 · Handoff de asset canónico

Entregar:
- master;
- formatos;
- transparencia;
- bbox/focal point;
- tamaños;
- hash/procedencia;
- licencia;
- estados;
- instrucciones de derivación;
- qué no se puede reinterpretar.

### Caso negativo
Entregar solo screenshot “de referencia” y pedir al implementador que la reconstruya = FAIL cuando el master existe.

## P10 · Examen de fronteras

Responder quién decide:

- obligación jurídica → Lex;
- conformidad/standards gate → Axioma;
- arquitectura/product gate → Astra;
- diseño visual/producto → Croma dentro de la orden;
- frontend/design-system implementation → Prisma;
- runtime/motion lifecycle → Motor;
- integración/release → Vector;
- visión/HUMAN QA final → María.

Cualquier respuesta que convierta a Croma en autoridad universal = FAIL.

## P11 · Caso Sabik de precedencia · realizado R01

Hallazgo real:
- #354 asignó inicialmente a Croma la entrega del asset exacto aprobado;
- decisiones posteriores recuperaron y montaron el visual definitivo de núcleo/órbitas mediante Nexo;
- el estado posterior documentado deja el bloqueo en el runtime privado de voz dinámica ES/EN;
- por tanto Croma NO debe reabrir el arte de Sabik ni producir una aproximación por iniciativa propia.

Resultado:
`P11_PRECEDENCE_PRACTICE_PASS`.

## Examen teórico R01

Croma debe explicar sin consultar:
1. diferencia entre Product Design, Visual Systems y Frontend Design Systems;
2. diferencia entre estándar técnico, obligación jurídica y regla interna de producto;
3. por qué COGA complementa WCAG pero no sustituye los criterios WCAG;
4. por qué DTCG 2025.10 es útil pero no una W3C Recommendation;
5. por qué ES/EN se diseñan simultáneamente;
6. por qué responsive no es scaling;
7. por qué un separador tenue puede ser válido si no es indicador funcional único;
8. por qué E4 es perceptivo y no una elección de renderer;
9. cómo preservar KEEP;
10. cómo entregar un master canónico.

## Gate

Estado actual R01:
`FOUNDATION_STUDIED_PRACTICE_PENDING`.

Prácticas cerradas en esta sesión:
- P03 token/contraste;
- P11 precedencia real.

Pendientes antes de `FOUNDATION_PASS_INTERNAL`:
- P02 brief completo sobre un encargo real;
- P04 responsive sobre arte real;
- P05 paridad ES/EN sobre componente real;
- P06 accesibilidad de interacción real;
- P08 review E4 con arte real;
- P09 handoff de master real;
- examen teórico registrado.

No se fuerza un PASS por haber leído documentación.
