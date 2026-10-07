# NEXO · ORDEN PATCH CIELO 3D R02.1 · TWO P1 DATA INTEGRITY FIXES

Fecha: 2026-10-07
Autoridad de producto: María
Coordinación: Nexo
Base: CIELO_3D_R02.zip
SHA-256: e64780f272fb21ed880e020bc2ac74364e456e1e533476a70d72401cc8d79bba

Gate Axioma de entrada:
`AXIOMA_SKY_3D_R02_KEEP_EXPANSION__TWO_P1_DATA_INTEGRITY_FIXES_BEFORE_HUMAN_QA`

## Regla

KEEP completo de R02.

NO reabrir:
- esfera continua;
- 12 constelaciones;
- recorrido/pistas data-driven;
- hallazgo fuera de orden;
- cuaderno;
- LOCATE→REVEAL;
- gestos;
- foco;
- panel;
- rendimiento;
- assets;
- diseño visual.

Hacer sólo los dos P1 siguientes y retest dirigido.

## P1-01 · Perseo / evidencia visible

Problema reproducido por Axioma:

Perseo contiene un punto de figura:
- RA 2,9944 h
- Dec +41,03°
- estrella=null

El renderer dibuja sólo estrellas de catálogo, pero el motor de reconocimiento cuenta todos los puntos de figura.

Caso reproducido:
- cámara RA 2,58 h
- Dec +38,2°
- FOV 45°
- pulsación centro
- resultado: `unico → Per`
- mínimo: 3
- puntos: [15,16,17]
- asociaciones: [105,556,null]

Sin el punto null quedan 2/3 y Perseo no cumple mínimo.

### Corrección requerida

Elegir una de estas dos vías, según evidencia real:
1. asociar correctamente ese punto a una estrella válida del catálogo; o
2. excluirlo de toda evidencia semántica/observable.

Después:
- recalcular geometría observable;
- overlay, hit-test y reveal deben compartir exactamente el mismo conjunto observable;
- ningún marcador de evidencia puede corresponder a un punto no renderizado.

Añadir oracle:
`VISIBLE_RENDERED_POINTS_ONLY_ORACLE`

Debe fallar si:
- un punto con `estrella=null` cuenta;
- un punto no renderizado contribuye al mínimo;
- overlay muestra evidencia que el cielo no dibuja.

## P1-02 · storage versión futura

Problema reproducido:

`{"v":99,"descubiertas":["Ori"],"future":"KEEP"}`

Carga:
- no contamina estado actual: KEEP.

Pero tras primera interacción:
- se sobrescribe por storage v1 vacío.

### Corrección requerida

Si `stored.v > supported.v`:
- entrar en modo temporal / sólo lectura para esa clave;
- no sobrescribir jamás el valor existente;
- no anunciar guardado exitoso sobre esa clave;
- permitir uso de la sesión sin persistir encima;
- mantener los bytes originales intactos.

Añadir oracle:
`FUTURE_STORAGE_PRESERVED_BYTES_ORACLE`

Debe comprobar:
- bytes before === bytes after tras mover cámara;
- bytes before === bytes after tras descubrir;
- bytes before === bytes after tras abrir/cerrar ficha;
- bytes before === bytes after tras cambiar idioma;
- no falso mensaje de guardado.

## P2 · no blocker de R02.1

`camaraInicial()` contiene `porAbbr('Ori')`.

No bloquear HUMAN QA por esto.

Registrar como trabajo de escalado:
- sustituir por `orden_saltos[0]` o equivalente data-driven antes de 88/88.

No tocar ahora salvo que la corrección sea trivial y no altere comportamiento.

## HUMAN QA · punto a observar

Después del patch, María debe probar especialmente el salto desde una pista tipo:
`Desde Rigel…`

Pregunta:
¿el nombre aprendido en la ficha queda suficientemente conectado con su posición real en el cielo para iniciar el salto sin ayuda extra?

No resolver esta duda añadiendo etiquetas permanentes antes de HUMAN QA.

## Retest mínimo

- 15/15 unitarias existentes;
- oracle Perseo;
- oracle storage futuro;
- caso Axioma exacto de Perseo;
- storage v99 exacto;
- 320/390/1440;
- no regresión de foco/pinch/panel.

Gate esperado:
`CLAUDE_SKY_3D_R02_1_DATA_INTEGRITY_PATCH_READY_FOR_NEXO`

Secuencia:
Nexo retest corto → Axioma precheck corto → HUMAN QA María.

NO MAIN · NO PUBLIC DEPLOY · NO ASSET REWORK · NO SCALE 88/88.
