# PRISMA · REVISIÓN INDEPENDIENTE · CIELO COMPLETO R02

Fecha: 2026-10-06

Gate Prisma:
`PRISMA_SKY_R02_KEEP_CORE_TARGETED_REWORK_REQUIRED`

No modifica runtime, assets, main ni producción.

---

# 1. Base exacta

ZIP:
`DESCUBRIMIENTO_CIELO_COMPLETO_R02_1.zip`

SHA-256:
`581368ff4b2db0208274f3d8cca65f4973b64a4038e4c15b209a8591cd814cfa`

Bytes:
`10,558,730`

Contenido:
- 329 archivos;
- `SHA256SUMS.txt`: **328/328 PASS**;
- el propio `SHA256SUMS.txt` no se hashea a sí mismo.

La comunicación “320/320” corresponde a la base anterior y está obsoleta para este ZIP R02.

Vídeo:
`CIELO_R02_recorrido_1.mp4`
- SHA-256 `7d475c97631e66683db9adb03a02f4bf9399ebeac0bce4ead405f196cd5bc05a`
- 28,64 s
- 1280×800
- 25 fps
- H.264.

---

# 2. Pruebas del autor repetidas por Prisma

Ejecutadas sobre el ZIP exacto extraído, en Chrome real:

`pruebas/banco-de-pruebas.js`
- 42/42 PASS.

`pruebas/banco-r02.js`
- 23/23 PASS.

Total:
**65/65 PASS**.

Por tanto se confirma de forma independiente:
- objetivo general avanza;
- hallazgo fuera de orden no rompe el objetivo;
- final de campo;
- una sola pista activa;
- cargas de campo obsoletas descartadas;
- cancelación de cámara;
- Fuentes sin navegación;
- cámara por campo en memoria/guardado previsto;
- Restablecer ≠ Borrar;
- multitouch no selecciona al soltar;
- pinch/rueda anclados;
- dos etapas para no-Orión;
- cielo limpio + capa de hallazgos;
- vista general con lista equivalente;
- 88 alcanzables;
- 320/390/1440;
- 200 %;
- teclado, touch emulado y forced-colors Chromium.

Estos PASS no resuelven los hallazgos siguientes porque sus oráculos no preguntan esas propiedades.

---

# 3. KEEP

Conservar:
- 88 datos/figuras/regiones/assets;
- estereográfica;
- clic/tap directo;
- drag separado de tap;
- teclado;
- dos etapas localizar→revelar;
- objetivo recalculado;
- hallazgo fuera de orden;
- cielo limpio;
- figura activa persistente;
- capa Mis hallazgos;
- zoom anclado;
- ayuda voluntaria;
- ficha progressive disclosure;
- cuaderno con retorno al lugar;
- vista general como alternativa single-pointer al drag;
- NAVY;
- carga lazy.

No convertir R02.1 en rebuild ni meter cielo continuo dentro de este patch.

---

# 4. P1 · Una estrella visible puede identificar Orión

Código:
`umbralVisibles(v) = max(1,min(3,v))`.

Si sólo queda un punto visible de un patrón:
- visibles = 1;
- umbral = 1;
- si ese punto está dentro, proporción visible = 1.

Reproducción Prisma con el motor R02 real:

- campo 06;
- W390/H624;
- cámara `u=0.2041327094, v=-0.1558946667, zoom=6`;
- punto `(388,530.4)`.

Resultado:
```
resultado = unico
abbr = Ori
dentro = 1
visibles = 1
total = 3
proporcion_visible = 1
```

Es decir: **1/3 del cinturón visible basta para localizar Orión**.

La interfaz después usa el tipo especial y puede anunciar el patrón de tres estrellas.

## Segundo defecto relacionado: marcadores no usan el mismo filtro

En la misma reproducción:
- estrella 1: dentro + visible;
- estrella 2: dentro del radio pero bajo horizonte;
- estrella 3: fuera.

El motor consideró 1 visible.
La construcción de `estado.localizada.puntos` vuelve a recorrer los puntos sólo por distancia y puede marcar la estrella oculta.

Principio aprendido:
**ocultar evidencia no puede reducir el requisito semántico del patrón**.

### Corrección
- requisitos semánticos por patrón/subpatrón;
- Orión cinturón: las tres;
- figuras extensas: subpatrones documentados, no toda la constelación;
- función única de visibilidad para examen, marcadores, descripción y estrella individual.

No imponer “3 universal” a todas las constelaciones de forma ciega.

---

# 5. P1 · La apertura sigue dependiendo fuertemente del viewport

R02 conserva:
`ZONA = {fraccion:0.19,min_px:88,max_px:150}`.

Y `examinar()` sigue usando ese `radioZona` en píxeles como apertura de evidencia.

Prisma midió el mismo campo 06, mismo zoom 1.35, centro de vista:

| viewport | canvas | radio CSS | apertura devuelta |
|---|---:|---:|---:|
| 320×568 | 296×420 | 88 px | 8,8° |
| 390×844 | 366×625 | 88 px | 6,0° |
| 1440×900 | 1408×648 | 123 px | 3,7° |

La zona astronómica es más de dos veces más amplia en móvil que en desktop a igual zoom.

Por tanto todavía no se cumple:
`SAME_SKY_POINT + SAME_ZOOM → SAME_EVIDENCE_APERTURE`.

## Probe adverso Prisma

2.000 taps uniformes por campo en la zona de cielo inicial.
No es tasa de error humano ni falsos positivos; mide **cuánto del cielo acepta el oráculo como algún patrón**.

Tasa de coincidencia real `coincide=true`, mediana entre 12 campos:

- 320: **53,15 %**
- 390: **34,10 %**
- 1440: **12,675 %**

Rangos:
- 320: 33,4–68,75 %
- 390: 13,65–55,5 %
- 1440: 0,25–30,95 %

Conclusión:
R02 mejora R01, pero la semántica del tap sigue siendo mucho más permisiva en móvil.

### Corrección
Separar explícitamente:
1. `INPUT_TOLERANCE_PX` para facilidad motora;
2. `EVIDENCE_APERTURE_ANGULAR` para el patrón astronómico.

El hit target puede seguir siendo grande.
La evidencia no tiene que crecer con él.

Añadir un gate:
`SAME_SKY_EVIDENCE_320_390_1440`.

---

# 6. P1 · La fórmula de apertura angular no mide lo que parece decir

En centro:
`r0=0`.

La implementación:
```
(cDe(r0+dR)-cDe(max(0,r0-dR)))/2
```

se convierte en:
`cDe(dR)/2`.

Pero `cDe(dR)` ya es el radio angular desde el centro hasta el borde.

Por eso el valor comunicado queda aproximadamente a la mitad del radio real en el centro.

En el caso 390/H≈624/zoom1.35:
- reportado ≈ 6°;
- radio según la propia inversa estereográfica ≈ 11,9°.

Definir qué se quiere comunicar:
- radio angular;
- diámetro;
- o extensión local.

Después calcular ángulos entre rayos transformados por la inversa, especialmente fuera del centro.

No llamar “apertura angular real” hasta definirlo de forma inequívoca.

---

# 7. P1 de producto · Pistas únicas en datos, no necesariamente observables

R02:
- 88 pistas;
- 63 textos únicos;
- 88/88 únicas dentro de su campo por los valores declarados.

Prisma analizó el JSON:
- **53/88** mencionan magnitud numérica exacta;
- **81/88** contienen alguna cifra;
- niveles: 35×nivel1, 49×nivel2, 2×nivel3, 2×nivel4.

Ejemplos:
- “la más brillante es de magnitud 2.2”;
- “Busca 4 estrellas claras”;
- “grupo tenue de 8 puntos”.

Esto puede ser factual y único, pero una persona sin etiquetas no puede leer “magnitud 2.2” de un punto luminoso.

Además contar estrellas de una figura que aún no está dibujada exige saber de antemano qué puntos pertenecen al grupo.

### Corrección
Pilotar pistas humanas para una muestra representativa:
- forma visible;
- brillo relativo (“una de las más brillantes de esta zona”);
- relación espacial;
- star-hopping desde hallazgo conocido;
- compacidad/arco/cadena/pareja.

Magnitud exacta:
→ profundidad posterior.

No escribir 88 pistas nuevas antes de validar la gramática con personas.

---

# 8. P1 · ficha asíncrona puede reaparecer obsoleta

`abrirFicha()` copia `tokenCarga`, pero:
- no genera request-id propio;
- `cerrarPanel()` no invalida esa solicitud;
- pedir otra ficha en el mismo campo tampoco incrementa el token.

Por tanto una respuesta anterior del mismo campo puede abrirse después de:
- cerrar panel;
- cambiar a otra ficha;
- abrir/cerrar otro panel.

Se necesita:
`fichaRequestId` independiente.

Invalidar en:
- cierre;
- cambio de panel;
- nueva ficha;
- cambio de campo;
- salida de escena.

---

# 9. P1 · estrella individual no usa la misma visibilidad

Al click de puntero:
```
M.estrellaEn(...)
```

busca cercanía, pero no aplica:
- horizonte;
- UI occluders;
- viewport semántico compartido.

Después de descubrir una constelación puede abrir datos de una estrella que la regla de patrón consideraría no observable.

Aprendizaje:
**selección de patrón, estrella, descripción y marcador deben usar una única función de visibilidad.**

---

# 10. P2 · cámara se recuerda en memoria, pero no se persiste al mover

`trasMovimiento()`:
```
recordarCamara();
```

No llama a `guardar()`.

Así:
- salir por portada guarda;
- revelar guarda;
- mover y cerrar/reload directo puede perder el último encuadre.

Persistir al terminar un gesto/transición, con debounce/throttle.
No escribir por frame.

Además el guardado v2 verifica versión, pero no sanea:
- NaN;
- Infinity;
- strings;
- zoom inválido.

Validar forma y finitud antes de mutar estado.

---

# 11. P1 touch · pinch → un dedo necesita rebase

Tras una pinza, el puntero restante conserva un `inicio` anterior al gesto multi.

Cuando vuelve a drag de un dedo y `movementX/Y` no está disponible, el fallback usa ese origen antiguo.

Nexo reprodujo:
1 px físico → 21 px de desplazamiento.

La inspección del handler confirma la causa.

Corrección:
al pasar de 2→1 dedos:
- rebasar `inicio` y última posición del dedo restante;
- mantener `gestoMulti` hasta que termine el gesto para no seleccionar.

Probar en teléfono físico.

---

# 12. Formato

## Portada
Mucho mejor que R01.
KEEP:
- hero simple;
- acciones primarias claras;
- ajustes abajo.

### Orión en portada
El storyboard original prohibía “Orión” antes de localizar el cinturón.

La propuesta consolidada §4 introdujo explícitamente:
`Empezar por Orión`.

Claude obedeció esa orden.

Por tanto es un **error de coordinación**, no de Claude.

Resolución recomendada:
primera visita:
`Empezar a explorar`.

Después de descubrir Orión:
sí puede existir:
`Volver a Orión`.

## Escena desktop
La escena domina, pero el panel de pista/ficha sigue siendo overlay absoluto sobre la parte derecha del cielo.

La captura del vídeo demuestra que puede cubrir estrellas/patrones.

No basta con estar “debajo de la fila del objetivo”.

Mejor:
- reservar espacio lateral en desktop;
- o bottom/docked sheet que reduzca área útil explícitamente;
- conservar cámara/FOV y referencia espacial al abrir/cerrar.

## 320
La mejora es real, pero:
- el cielo comienza después de cabecera + pista;
- el canvas mide 420 px;
- 420/568 = 73,9 % como **altura del componente**;
- en first paint no todos esos 420 px están simultáneamente visibles porque el canvas empieza más abajo.

Nombrar métricas con precisión:
- component height ratio;
- visible intersection ratio.

No usar un número favorable como sinónimo de “cielo visible”.

---

# 13. Alcance de los tests

Los 65 tests son útiles y han sido repetidos por Prisma.

Pero:
- C18 mueve cámara por código hasta encontrar éxito → demuestra reachability;
- R17 busca estados/encuadres útiles para la matriz → no es un oracle de falsos/accidentales;
- touch emulado ≠ teléfono;
- no lector real;
- no Safari/Firefox.

Añadir suites separadas:

## Reachability
¿puedo encontrar las 88?

## Specificity
¿qué pasa con taps negativos/congelados?

## Viewport equivalence
¿misma evidencia angular produce mismo resultado?

## Perception
¿una persona entiende la pista y señala el patrón?

No llamar a una suite por el resultado de otra.

---

# 14. Cielo continuo

No lo considero defecto de R02.

La propuesta consolidada lo dejó como trabajo arquitectónico posterior entre dos campos.

Mantener los 12 fields visibles por ahora es más honesto que fingir una costura inexistente.

Siguiente prototipo posterior:
- dos campos;
- coordenadas esféricas comunes;
- reproyección;
- IDs deduplicados;
- FOV/dirección conservados;
- transición sin salto;
- carga/cancelación.

No meterlo en R02.1.

---

# 15. Orden de patch recomendado

## P1
1. requisito semántico por patrón/subpatrón;
2. visibilidad compartida por examen/marcadores/estrella/descripcion;
3. separar input px / evidencia angular;
4. corregir apertura angular;
5. request-id de ficha;
6. rebase pinch→un dedo.

## Pistas
7. piloto humano de pistas perceptuales, no 88 textos técnicos;
8. quitar magnitud exacta del prompt primario;
9. probar Orión→vecina mediante relación/star-hopping.

## P2
10. persistencia de cámara al terminar movimiento;
11. sanitización de save;
12. panel que no tape cielo;
13. métrica de visible intersection.

## Trazabilidad
14. corregir comunicación de hashes: este ZIP contiene 329 archivos y 328 entradas en `SHA256SUMS`, no 320.

---

# 16. Veredicto

R02 es una mejora grande y debe conservarse.

Cierra de verdad:
- objetivo clavado;
- pista global de Orión;
- parte de cargas;
- gestos;
- dos etapas;
- cielo limpio;
- ficha;
- formato;
- vista general.

Pero el reconocimiento todavía mezcla:
- comodidad táctil;
- evidencia astronómica;
- visibilidad parcial.

Y esa mezcla sigue haciendo que móvil y escritorio tengan reglas perceptualmente diferentes.

Gate Prisma:
`PRISMA_SKY_R02_KEEP_CORE_TARGETED_REWORK_REQUIRED`

No HUMAN QA todavía.

Siguiente:
`R02.1 TARGETED PATCH → RETEST INDEPENDIENTE → AXIOMA → HUMAN QA MARÍA`.

`NO MAIN · NO PUBLIC DEPLOY · NO ASSET REWORK`
