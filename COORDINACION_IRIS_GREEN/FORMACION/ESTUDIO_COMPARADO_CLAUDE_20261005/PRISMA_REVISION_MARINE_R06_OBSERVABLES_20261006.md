# PRISMA · REVISIÓN VIDA MARINA R06 · OBSERVABLES

Fecha: 2026-10-06

Estado propuesto:
`KEEP_R06_CORE_REVIEW_REQUIRED_BEFORE_SCALE`

No modifica producto, main ni producción.

## 1. Bases exactas revisadas

### Producto
`descubrimiento-peces-R06(1).zip`
- SHA-256: `917548b0a710ed2f17a9264e9516a0bd329f86511fe514fc8f5adf52962f6e03`
- bytes: 6,398,805
- `MANIFEST_SHA256.txt`: 34/34 PASS.

### Interno
`descubrimiento-peces-R06-interno(1).zip`
- SHA-256: `3d1cfd216adbde27be5d898f63c8d60f44650f93293eee9d402feaec91358bd2`
- bytes: 4,579,633

### Lámina
La lámina canónica **dentro del ZIP interno**:
- `observables-R06.png`
- SHA-256: `f8e130ea42928fde48852decd7a5e7f2abcdddc9dcf52ce143d70e0c4442b834`
- 1760×2270 RGB.

El PNG subido por separado en el chat:
- SHA-256: `f926fe757b94849ce22adf2b65040d1100e097807958b3392d61c1f25dc42d0e`
- 1587×2048 RGBA.

No son byte a byte el mismo fichero. Para trazabilidad considero canónica la copia interna, que sí coincide con el hash declarado en la entrega.

---

# 2. Qué R06 mejora de verdad

## Fase / movimiento
La corrección de fase es sólida conceptualmente:
- cada animal guarda `p.fase`;
- `avanzarNado(p,dt)` acumula fase;
- cambiar frecuencia afecta al ritmo futuro, no reescribe el pasado;
- amplitud NORMAL↔REDUCED usa easing temporal;
- NONE congela fase, amplitud y giro;
- posición conserva continuidad mediante `desvio` temporal;
- giro ya usa dt con `TAU_GIRO=0.28`.

Esto cierra el defecto de “fase = reloj × frecuencia”.

## Confirmación múltiple
La confirmación ya no es una lista recordada indefinidamente:
- candidate set;
- objetivo elegido;
- invalidación al desaparecer candidatos;
- `event.repeat` no confirma;
- `Otro animal` es una selección deliberada.

Es mucho mejor que R03.

## Contrato de datos
`schemaVersion: 2` separa:
- `bodyContext`;
- `observables[]`;
- `revealFacts[]`;
- `combinacionObservables`.

Y el copy deja claro:
“disponible para observar” ≠ “reconocido”.

## Registro local
R06 deja de usar sólo un IoU global.

Valores presentes en el producto:
- hacha / contorno: 0.9381 con corrección global → `REVISAR`;
- linterna / zona de fotóforos: 0.9779 → `OK`;
- calamar / brazos: 0.8483 → `BLOQUEO_LOCAL`.

No se manipula la región para inflar la métrica.

## QA
La batería nueva cubre:
- fase;
- confirmación;
- repetición;
- pérdida de foco;
- reflow con estados abiertos;
- móvil emulado;
- local registration;
- casos de perceptibilidad sin labels.

Es una mejora sustancial del oráculo.

---

# 3. Hallazgos que deben cerrarse antes de escalar

## R06-P01 · el motor ignora el umbral por animal de bodyContext

El esquema declara:

`bodyContext.requiredFraction`

en cada animal.

Los tres pilotos tienen hoy 0.35, pero el motor NO lee ese valor.

En `motor.js::evaluar()`:
```js
var uFrac = datos.umbrales.BODY_CONTEXT_THRESHOLD
```

y las piezas sólo reciben:
```js
muestras: a.muestras
```

No reciben:
`a.bodyContext.requiredFraction`.

Ahora no cambia el resultado porque los tres valores son iguales.

Pero el esquema promete una capacidad que el runtime no implementa. Al escalar, una especie que necesite otro contexto seguiría usando 0.35 silenciosamente.

### Corrección
Al cargar pieza:
```
bodyRequired: a.bodyContext.requiredFraction
```

En evaluar:
```
frac >= p.bodyRequired
```

Mantener el global sólo como fallback de schema v1.

Añadir QA con dos animales de thresholds distintos.

---

## R06-P02 · calamar no tiene ningún observable activo

`brazos-al-frente`:
- existe;
- se mide;
- `BLOQUEO_LOCAL`;
- `activo:false`.

En el motor:
```js
var reglaObs = activos === 0 ? true : ...
```

Por tanto el calamar es examinable únicamente con:
- body context ≥ 0.35;
- no estar de canto.

Eso es transparente en documentación, pero significa que **el nuevo contrato basado en observable no se cumple en ese encuentro**.

No recomiendo volver a activar los brazos.
El registro demuestra que no se debe.

Opciones:
1. bloquear ese encuentro público hasta corregir el par de biblioteca;
2. elegir otro observable visual que esté sostenido por ambos binarios;
3. sustituir el calamar del piloto por otra especie con par estable.

No escalar una excepción como plantilla.

---

## R06-P03 · humanVisibilityQA=PENDING en los dos observables activos

Hacha:
- `activo:true`;
- registro local `REVISAR`;
- `humanVisibilityQA:PENDING`.

Linterna:
- registro local `OK`;
- `humanVisibilityQA:PENDING`.

Así que R06 demuestra:
- coherencia geométrica;
- disponibilidad matemática;
- registro local.

Todavía NO demuestra:
**que una persona pueda distinguir el rasgo cuando el motor dice 50 %.**

La entrega lo declara correctamente.
No convertir `READY_FOR_REVIEW` en producto aprobado.

---

## R06-P04 · falta una condición de tamaño aparente

El motor comprueba:
- porcentaje corporal iluminado;
- porcentaje del observable iluminado;
- dentro/fuera de viewport.

No comprueba:
- tamaño aparente del animal;
- tamaño aparente del rasgo en CSS px.

Por eso un observable puede superar 50 % estando demasiado pequeño para ser perceptible.

Los casos de `casos-umbral/` muestran precisamente encuadres donde la geometría puede cumplir mientras el pez se ve pequeño.

### Propuesta
Después de human visibility QA, introducir si hace falta:
`minimumApparentExtentPx`
o una medida equivalente del bbox proyectado del observable.

No fijar 44 px ni otro número a priori.
Calibrarlo visualmente.

Un mensaje posible:
“Acércate un poco para observar ese detalle.”

Esto separa:
- “está iluminado”;
- “tiene escala suficiente para observarlo”.

---

## R06-P05 · el observable del hacha todavía es demasiado global

Generación:
```
contorno = cuerpo & ~ero(cuerpo, banda)
puntos = muestrear(contorno, 320, seed=1)
```

El 50 % se mide sobre una banda de **todo el contorno**:
- cuerpo profundo;
- aletas;
- cola;
- cabeza.

Eso demuestra “mucho perímetro iluminado”.

No necesariamente demuestra que esté disponible la parte del contorno que comunica:
**la silueta alta / forma de hacha**.

La fuente zoológica sí respalda la forma tipo hacha, pero la métrica debería corresponder al rasgo descrito.

### Propuesta
Revisar si el observable debe limitarse al contorno del tronco principal:
- borde ventral profundo;
- dorso/pecho que configuran la gran altura corporal;
- excluir cola y aletas que no son las que hacen reconocible la silueta.

No cambiarlo automáticamente: usar la revisión humana de los casos de umbral.

---

## R06-P06 · el observable de linterna es prometedor, pero “luminancia” no prueba semántica

El script detecta componentes brillantes del estado oscuro:
`max(RGB) >= 170`.

El resultado visual coincide razonablemente con la hilera ventral y el registro local es muy bueno.

Además Smithsonian documenta que los lanternfish poseen fotóforos a lo largo de la superficie ventral.

Pero el algoritmo sólo sabe:
**“componente brillante”**.

No sabe:
**“fotóforo”**.

Antes de escalar:
- revisar los 24 centros visualmente;
- marcar qué componentes son realmente las luces que el asset pretende representar;
- no asumir que el threshold 170 funcionará con 200 especies.

La extracción automática es herramienta de anotación, no ontología.

---

## R06-P07 · candidato principal sigue ordenándose sólo por contexto corporal

En `evaluar()`:
```js
lista.sort((a,b) => b.fraccion - a.fraccion)
```

`fraccion` = body context.

Así, si dos animales son examinables, el candidato inicial es el que tiene más cuerpo iluminado.

No necesariamente:
- el observable más claramente iluminado;
- el que está más cerca del eje del haz;
- el que la persona acaba de apuntar.

La confirmación múltiple evita identificación accidental, pero no corrige la prioridad perceptiva.

### Propuesta
Definir un `selectionScore` explícito:
- observable activo / margen sobre threshold;
- proximidad al centro del haz o punto de tap;
- body context como desempate.

La selección debe seguir la intención espacial de la persona, no sólo la cantidad de cuerpo iluminado.

---

## R06-P08 · “contexto” de confirmación todavía es incompleto

La confirmación guarda:
- ids de candidatos;
- objetivoId.

No guarda:
- tiempo;
- posición espacial del candidato;
- cámara;
- posición de la luz.

Mientras los mismos candidatos sigan examinables y el mismo `candidatoId` permanezca, una confirmación puede seguir vigente aunque los animales hayan nadado y la señal descrita haya cambiado de lugar.

### Corrección posible
Invalidar si:
- pasa un intervalo razonable;
- el centro del elegido se mueve más de un umbral de pantalla;
- cambia de sector descriptivo izquierda/centro/derecha o alto/medio/bajo;
- cambia luz/cámara significativamente.

No hace falta volverlo frágil; sólo impedir que “confirmé esa señal” sobreviva a una escena perceptivamente distinta.

---

## R06-P09 · cobertura de perceptibilidad desigual

`casos-umbral` contiene 23 casos.

Linterna:
- encuadre A;
- encuadre B;
- encuadre C;
- adversos.

Hacha:
- sólo encuadre B en la clave final.

Calamar:
- ninguno, porque el observable está inactivo.

Para human visibility QA del hacha faltan al menos variaciones de tamaño/encuadre comparables a las de linterna.

No llenar números por completar una matriz.
Buscar específicamente:
- umbral a tamaño grande;
- umbral a tamaño pequeño;
- zona parcial;
- cola/aletas iluminadas sin tronco;
- cuerpo amplio con parte diagnóstica insuficiente.

---

## R06-P10 · factualidad sigue demasiado agregada

La separación `revealFacts` es buena, pero:
- `factualStatus` sigue siendo `heredado-sin-revalidar` en los tres;
- las fuentes del animal son fuentes generales de profundidad.

Antes de escalar conviene que cada `revealFact` tenga:
- sourceId;
- claim;
- consultedAt;
- factualStatus.

Fuentes específicas localizadas en esta revisión:
- Smithsonian Ocean · Lanternfish: fotóforos en la superficie ventral.
- MBARI · Glass squid: transparencia del cuerpo en Cranchiidae.
- Monterey Bay Aquarium / deep-sea educational material: hatchetfish y sus adaptaciones visuales.

No mezclar una verdad del asset con una verdad zoológica.

---

# 4. Verificación externa rápida de los tres contenidos

## Pez linterna
Smithsonian Ocean:
los lanternfish presentan fotóforos productores de luz en la superficie ventral.

Esto respalda el **tipo de observable** “hileras ventrales”, no los 24 puntos concretos del dibujo.

## Glass squid
MBARI:
Cranchiidae vive en midwater y utiliza transparencia como camuflaje; describe además fotóforos que ayudan a ocultar órganos opacos.

Esto respalda usar transparencia como dato factual si se referencia correctamente.

No valida que el actual par luz/oscuro sea consistente en los brazos.

## Pez hacha
Monterey Bay Aquarium:
hatchetfish es un pez de profundidad, con morfología característica y fotóforos ventrales.
Material educativo del Aquarium describe la forma “like the head of a tiny hatchet” y ojos tubulares orientados hacia arriba.

Eso apoya la idea de **silueta** como pista.
La condición informática debe demostrar esa silueta, no sólo iluminar cualquier 50 % del perímetro.

---

# 5. Orden recomendado

## Antes de cualquier microescena
1. HUMAN VISIBILITY QA real de hacha y linterna.
2. Resolver `REVISAR` de hacha.
3. Decidir calamar: corregir asset / cambiar observable / retirar del piloto.
4. Corregir uso de `bodyContext.requiredFraction`.
5. Mejorar candidate scoring.
6. Caducar confirmación por contexto perceptivo.

## Después
7. Diseñar microescena sólo con observables aprobados.
8. No escalar a más animales todavía.
9. Usar la microescena para probar:
   - señales ambientales;
   - variedad de secuencia;
   - mundo vivo;
   - CTA contextual próximo;
   - si la persona entiende qué mirar sin copy técnico.

---

# 6. Veredicto

R06 es una mejora real y técnicamente más honesta que R03/R05.

Especialmente valioso:
- fase continua;
- observables separados del contexto corporal;
- registro local;
- bloqueo explícito del calamar;
- humanVisibilityQA pendiente en vez de PASS inventado;
- casos de umbral sin spoilers.

Pero todavía hay una diferencia entre:
`GEOMETRÍA DISPONIBLE`
y
`RASGO PERCEPTIBLE`.

Y el propio R06 ya admite esa diferencia.

Mi gate sería:

`R06_OBSERVABLE_MODEL_KEEP_HUMAN_VISIBILITY_AND_CALAMAR_BLOCK_BEFORE_SCALE`

No diseñaría la microescena como plantilla todavía.
Primero cerraría **qué rasgos una persona realmente distingue**.

`NO MAIN · NO PRODUCCIÓN`
