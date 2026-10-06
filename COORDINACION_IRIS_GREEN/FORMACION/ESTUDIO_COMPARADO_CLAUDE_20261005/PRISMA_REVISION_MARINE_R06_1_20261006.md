# PRISMA · REVISIÓN VIDA MARINA R06.1

Fecha: 2026-10-06

Estado propuesto:
`KEEP_R06_1_CORE__HUMAN_VISIBILITY_AND_QA_ORACLE_PATCH_BEFORE_SCALE`

No modifica producto, main ni producción.

## 1. Bases exactas revisadas

Producto:
`descubrimiento-peces-R06.1(1).zip`
- SHA-256: `8a96259b802176dd6e1aeb30b838586d5c36bd27be5ff83d160786e8a0a2fcc7`
- bytes: `6,407,339`
- `MANIFEST_SHA256.txt`: **34/34 PASS**.

Interno:
`descubrimiento-peces-R06.1-interno(1).zip`
- SHA-256: `07949fbc4d430187654e8791d5b716b6dbe97abc6dcbe110f269f15a368de441`
- bytes: `16,398,992`.

Lámina canónica dentro del ZIP interno:
`observables-R06.1-CANONICA.png`
- SHA-256: `9a060fd825ed6d93f824084339a8c4aba8e73c325d7b6e4f56e1c66a133542f4`.

La imagen suelta del chat es una derivada/reexportación y no coincide byte a byte:
- SHA-256: `ea87c4930521c9a9942295ed9aa248d153e4f9f5a56b1ab3413e9fc08064b7e7`.

`LAMINA.txt` ya declara correctamente que la copia interna es la canónica.

Los seis PNG de producto son **idénticos byte a byte a R06**.

---

# 2. Qué R06.1 cierra de verdad

## Trayectoria / fase
Código confirmado:
- `faseOndaCiclos` separada de `faseRecorridoRad`;
- onda acumulada;
- giro por dt;
- continuidad NORMAL/REDUCED/NONE;
- `vx` incluye reabsorción del desvío.

## Body context operativo
El motor ya consume:
`p.contextoRequerido = a.bodyContext.requiredFraction`.

La duplicación superior desapareció en los tres animales:
- no hay `a.muestras` paralela;
- `bodyContext.muestras` es la fuente.

## Bloqueo
Estados observados:
- hacha: `exigido / examinablePermitido=true`;
- linterna: `exigido / true`;
- calamar: `bloqueado / false`.

En `evaluar()`:
`!p.examinablePermitido → reglaObs=false`.

El calamar no queda “sin requisito”: queda visible pero no examinable.

## Geometría inválida
Una geometría vacía/inválida:
- no se convierte en `fo=1`;
- `cumple=false`.

## Selección
Existe elección explícita por punto:
`elegirSenalando(px,py)`.

Los bloqueados no se vuelven elegibles por proximidad.

## Confirmación
La firma incorpora:
- candidatos;
- objetivo;
- zoom;
- cámara;
- luz;
- descripción espacial.

Sin timeout.

## Guardado futuro
El código distingue schema futuro y evita sobrescribirlo.

---

# 3. Hallazgos nuevos / pendientes

## R06.1-P01 · HUMAN VISIBILITY sigue siendo el gate principal

Los tres siguen:
`humanVisibilityQA = PENDING`.

Esto es correcto y no debe “cerrarse” por geometría.

Los 93 casos son material para revisión, no aprobación automática.

### Hallazgo de tamaño aparente

Entre los casos que el motor considera examinables:

### Pez hacha
Mínimo observable:
- ~92,6×89 px;
- diagonal ~128,4 px.

### Pez linterna
Hay casos examinables con:
- ancho ~53,9 px;
- **alto/grosor ~6,3 px**;
- diagonal ~54,2 px.

Esto es importante:
un único `minimumApparentExtentPx` basado en diagonal puede decir “54 px” aunque el detalle visual sea una hilera de sólo ~6 px de grosor.

### Recomendación
No usar un único escalar universal.

Calibrar por tipo de observable:
- `minWidthPx`;
- `minHeightPx` / grosor;
- o medida perceptual específica.

Para puntos/hileras:
- separación;
- diámetro;
- grosor aparente.

Para contorno:
- extensión vertical/horizontal.

Primero HUMAN QA; luego schema.

---

## R06.1-P02 · la prueba HISTERESIS es vacía

En `r06_1.js`:

```js
ok('HISTERESIS',
   baile.pasos === 0 || baile.cambios / baile.pasos < 0.25)
```

En el resultado:
`0 pasos con dos candidatos; 0 cambios`.

Por tanto el test **PASA sin ejecutar ninguna situación de histéresis**.

Esto contradice la intención de la prueba.

### Corrección
Usar el mismo fixture declarado de múltiples candidatos y exigir:

```
pasos > 0
```

Después medir cambios.

No aceptar `0 pasos` como PASS.

---

## R06.1-P03 · el nombre DOS-CANDIDATOS-REALES es incorrecto

El resultado dice:

`DOS-CANDIDATOS-REALES · PASA`

pero la propia nota confirma:
- se rehabilita el observable bloqueado del calamar;
- es un **FIXTURE**;
- producto real = 0 solapes en 19.208 posiciones.

Renombrar:
`DOS-CANDIDATOS-FIXTURE`.

La evidencia es válida como test de lógica, pero su identificador no debe presentarla como situación real de producto.

---

## R06.1-P04 · BLOQUEADO-COPY no prueba la fila exacta

El test intenta localizar la fila mediante:
`li.dataset.id === id`.

Pero `interfaz.js` no asigna ningún `dataset.id` a esas filas.

Si no encuentra la fila, el test concatena **todo el texto de la lista** y comprueba:

`/identificarlo no está disponible/`.

Puede pasar aunque el mensaje correcto pertenezca a otra fila.

### Corrección
Añadir identificador estable:
```
li.dataset.animalId = s.id
```

y comprobar exactamente:
`[data-animal-id="prof-calamar-cristal"]`.

Este es un ejemplo de PASS con oráculo demasiado amplio.

---

## R06.1-P05 · “periodo” significa sólo periodo horizontal

`trayectoria.js` declara explícitamente:
“¿El **periodo horizontal** que se declara es el que se ejecuta?”

La medición usa sólo:
`pos[i][0]`.

En el motor:
- x: `periodo`;
- y: `periodo * 0.73`.

Por tanto el movimiento 2D completo **no vuelve a la misma posición en 31/24/38 s**.

No necesariamente es un bug de movimiento.
Sí es una ambigüedad de contrato/nombre.

### Opciones
- renombrar dato a `periodoHorizontal`;
- o hacer que ambas componentes compartan periodo si se pretende un periodo de trayectoria completa.

No documentar “periodo de trayectoria exacto” cuando la prueba sólo mide x.

---

## R06.1-P06 · fuentes por afirmación no están aún conectadas al schema operativo

`FUENTES_POR_AFIRMACION.md` tiene:
- `claim-hacha-ojos-arriba`;
- `claim-linterna-fotoforos-ventrales`;
- `claim-calamar-manto-translucido`.

Pero en los datos de producto:

### Hacha
Observable `silueta-alta`:
- `sourceTrait: "Su cuerpo es alto y aplanado"`;
- `factualStatus: heredado-sin-revalidar`;
- sin `claimId`.

Reveal fact:
- ojos arriba → sí tiene claimId, pendiente.

### Linterna
Observable:
- sourceTrait de hileras luminosas;
- `factualStatus: heredado-sin-revalidar`;
- sin claimId.

Reveal fact `cuerpo-alargado`:
- `claimId:null`.

Aunque el sidecar documenta Smithsonian para fotóforos, el producto no enlaza esa afirmación con el registro.

### Calamar
Reveal fact sí enlaza `claim-calamar-manto-translucido`.
Observable bloqueado no.

### Corrección
Cada texto factual debe llevar referencia estable:
- `claimId`;
- `factualStatus`.

También los `sourceTrait` de observables, no sólo `revealFacts`.

El sidecar debe ser verificable contra datos para evitar drift.

---

## R06.1-P07 · “dentro” en selección no es containment real

Comentario de código:
“si el punto cae dentro de un cuerpo, ese gana”.

Implementación:
- se toman muestras corporales cada 3 puntos;
- se calcula distancia mínima;
- `dentro = d <= 2`.

Eso significa “a ≤2 px de una muestra”, no “dentro de la silueta”.

Para estos tres assets puede ser suficiente.

Al escalar a:
- formas huecas;
- tentáculos;
- peces muy finos;
- apéndices largos;

puede divergir de la percepción.

### Antes de 200+
Probar:
- alpha mask hit test;
- signed/distance field;
- o puntos densos con tolerancia derivada de escala.

No cambiarlo todavía sin necesidad; registrarlo como límite del prototipo.

---

# 4. Sobre hacha y linterna

## Hacha
El diagnóstico adicional es útil:
- 595 posiciones aprobadas;
- sólo 3 con tronco <50 %;
- peor 0,447.

Esto justifica **no recortar automáticamente** el contorno.

Aun así:
`PROVISIONAL_ACTIVE_FOR_PROTOTYPE`
es el estado correcto hasta HUMAN QA.

## Linterna
La revisión de 24→23 centros es una mejora honesta:
- se excluye el fotóforo opercular;
- no aumenta la cobertura;
- registro local sigue fuerte.

Pero:
“punto luminoso del dibujo”
≠
“fotóforo anatómicamente validado”.

Mantener:
`ASSET_DERIVED_REPRESENTATION`.

---

# 5. Calamar

R06.1 corrige el problema más importante:
**bloqueado = no examinable**.

Eso debe conservarse.

No lo usaría en la microescena como encuentro de identificación hasta:
- asset corregido;
- observable alternativo válido;
- registro local aceptable;
- humanVisibilityQA.

Puede existir como vida ambiental / animal no identificable si el producto lo explica sin frustración.

---

# 6. Microescena

Sí se puede preparar **documentación/inventario** de microescena.

No multiplicaría aún la plantilla a más especies.

La microescena debería usar sólo:
- pez hacha, provisional;
- pez linterna;
- calamar como caso bloqueado/no identificable sólo si sirve para probar ese estado.

Antes de convertirla en patrón para 200+:
1. HUMAN VISIBILITY hacha/linterna;
2. arreglar HISTERESIS test;
3. arreglar BLOQUEADO-COPY oracle;
4. renombrar fixture;
5. cerrar source/claim binding;
6. decidir métrica perceptual de tamaño aparente.

---

# 7. Veredicto

R06.1 corrige de verdad:
- regresión de fase/recorrido;
- bloqueo del calamar;
- bodyContext operativo;
- confirmación contextual;
- selección intencional;
- reanuncio deliberado;
- registro local y material perceptual.

No volvería atrás.

Pero “29/29” contiene al menos un PASS vacuo:
`HISTERESIS`.

Y todavía no existe el gate decisivo:
`HUMAN_VISIBILITY_PASS`.

Gate Prisma:

`R06_1_KEEP_CORE__PATCH_QA_ORACLES_AND_HUMAN_VISIBILITY_BEFORE_SCALE`

Siguiente:

`QA ORACLE PATCH → HUMAN VISIBILITY → INVENTARIO/MICROSCENE R01 → AXIOMA/HUMAN REVIEW`

`NO MAIN · NO PRODUCCIÓN`
