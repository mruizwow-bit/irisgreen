# Procedencia · Cielo y Espacio R03

2026-10-07. De dónde sale cada cosa. **No se ha generado ninguna estrella,
ninguna figura, ningún master y ningún dato nuevo**: lo único que este paquete
añade son MEDIDAS y CÁLCULOS sobre material que ya existía, y cada uno dice su
regla.

## 1. Intake, con hashes comprobados

| Paquete | SHA256 | Estado |
|---|---|---|
| `CIELO_3D_R02_1.zip` | `1f7e6ac7aab0b56d88b880375049a621bb85d9e0bc74105366f1d71073423ba8` | **Coincide** con el declarado en la orden. Es la base LOCKED |
| `cielo.json` (CIELO_NOCTURNO_BIBLIOTECA_COMPLETA_R01) | `1bd47fa403d69c82111dbbaf616258144e1c00bc4c2e393987497d07e14f8a72` | Catálogo de origen |
| Conjunto canónico de eclipses V2 | cada SVG comprobado contra el manifiesto aprobado | 8 de 8 coinciden |

## 2. El cielo

| Pieza | Origen | Tratamiento |
|---|---|---|
| 3.246 estrellas hasta magnitud 5,6 | `cielo.json`, HYG Database v4.1 | Mismo catálogo y misma magnitud límite que el paquete 2D y que R02.1. Sin duplicados |
| 88 figuras (767 vértices, 743 aristas) | líneas de d3-celestial | Convertidas a puntos con índice de estrella y aristas explícitas; ningún trazo añadido |
| Fronteras oficiales | IAU (Delporte, 1930), vía el catálogo | Usadas para calcular en qué constelación cae cada radiante y qué figuras cruza la eclíptica |
| Vía Láctea (9.672 puntos de densidad) | `cielo.json` | Nube dibujada muy tenue, sin decimar |
| 88 fichas | `DESCUBRIMIENTO_CIELO_COMPLETO_R02` | Copiadas tal cual |
| 88 masters SVG | `CIELO_NOCTURNO_BIBLIOTECA_COMPLETA_R01` | Copiados byte a byte |

**Lo que R03 calcula y declara**: rasgos observables de cada figura, ancla,
grafo de vecindad con separaciones y direcciones, frases de pista, mínimo
semántico, trozo que cabe en la apertura, puntos no observables, rutas, mes de
culminación cuando el catálogo no lo trae y qué figuras cruza la eclíptica.
Todo con su regla escrita en `datos/cielo88.js`.

## 3. El Sistema Solar

| Pieza | Origen | Tratamiento |
|---|---|---|
| 14 cuerpos con sus datos físicos | hojas de datos de NASA · NSSDCA, vía `sistema-solar.json` publicado | Copiados; la fuente de cada campo viaja en los datos |
| Elementos orbitales | NASA/JPL (keplerianos) y MPC (enanos) | Se resuelven para la fecha que se mire |
| Modelo de rotación | IAU, vía el mismo paquete | Da la cara que cada cuerpo enseña hoy |
| 70 lunas | mismo paquete | Datos completos; 21 con textura |
| Texturas de superficie | Solar System Scope, NASA/JHUAPL, NASA/JPL-Caltech, USGS, Stellarium | Las que ya publica irisgreen.eu, con su autoría y licencia en `assets/solar/CREDITOS.txt`. Tres son recreaciones declaradas |

Las texturas van además **embebidas** en `datos/solar-texturas.js`: abriendo el
paquete con `file://`, una imagen cargada desde disco contamina el lienzo y el
navegador prohíbe leerlo píxel a píxel, que es lo que hace falta para rasterizar
una esfera de verdad. Mismos bytes, misma autoría.

## 4. Meteoros

Lista de trabajo de la **International Meteor Organization**, compilada en «List
of meteor showers» de Wikipedia, consultada el 2026-10-07. **Limitación
declarada**: el PDF del calendario de la IMO no se pudo descargar porque su web
estaba en reconstrucción ese día, así que los valores vienen de la compilación y
no del documento original.

En qué constelación cae cada radiante **no se copia de ninguna lista**: se
calcula con las fronteras oficiales de la IAU.

## 5. Exoplanetas

NASA Exoplanet Archive, vía el paquete publicado: 6.366 planetas y 4.775
estrellas. En la esfera sólo están las 68 anfitrionas a simple vista cuya
estrella este paquete dibuja de verdad.

La clase de cada planeta (rocoso, supertierra, del tamaño de Neptuno, gigante
gaseoso) **se calcula de su radio y su masa medidos**:
`ASSIGN_BY_PHYSICS_NOT_AESTHETIC_SIMILARITY`. Ninguno afirma qué aspecto tiene.

## 6. Eclipses

Conjunto canónico V2, aprobado en #370 (comentario 5966236303, owner Atlas A1).
Seis tipos y dos secuencias, copiados byte a byte: los ocho hashes coinciden con
el manifiesto aprobado. Los títulos y los textos alternativos de los seis tipos
son los del conjunto; **los de las dos secuencias los escribe R03**, porque el
conjunto no los traía y una imagen sin alternativa textual es una barrera. Queda
declarado en `datos/eclipses.js`, campo `origen_del_texto`.

## 7. Lo que NO se ha tocado

- No se ha redibujado ninguna figura ni ningún eclipse.
- No se ha inventado ninguna estrella ni se ha subido la magnitud límite.
- No se ha modificado ningún master.
- No se ha regenerado ninguna textura.
- No se ha tocado el paquete `CIELO_3D_R02_1`: R03 es una copia aparte.

## 8. Lo técnico que R04.5 ha sacado de la pantalla

ISO 24495-1 pide que el texto visible le sirva a quien lee. Tres frases de la
pantalla eran notas de procedencia escritas para quien audita, no para quien
mira el cielo. No se borran: se guardan aquí, y en pantalla queda la frase
corta. Es la misma regla que ya se aplicó en R04 a la orientación de la cámara.

**Convención de ejes de la esfera del cielo.** Texto íntegro, tal y como viene
en `datos/cielo88.js`, campo `convencion_ejes`:

> ecuatorial diestra: x hacia AR 0 h en el ecuador, y hacia AR 6 h, z hacia el
> polo norte celeste. El observador mira desde DENTRO de la esfera, así que la
> ascensión recta crece hacia la izquierda.

En pantalla queda: «Miras la esfera desde dentro, como se mira el cielo de
verdad. Las coordenadas del catálogo avanzan hacia la izquierda.»

**Representación direccional.** Texto íntegro, campo `nota`:

> Representación direccional: todas las estrellas se dibujan sobre una misma
> esfera. El radio gráfico es común y no significa que estén a la misma
> distancia física. Sin fecha, hora ni lugar no hay horizonte coherente, así que
> no se dibuja ninguno.

En pantalla queda la misma idea sin «representación direccional» ni «radio
gráfico», y con el mismo contenido: una esfera, un radio común que no dice
distancias, y ningún horizonte.

**Cómo se construye la descripción «cómo reconocerlo».** Texto íntegro, campo
`como_reconocerlo.derivacion` de las 88 fichas, idéntico en todas:

> rasgos que se pueden ver sin líneas ni instrumento: cuántas estrellas claras
> hay, si una destaca sobre las demás, cómo se reparten, cuánto ocupan y si la
> más clara manda en su rincón. Ninguna cláusula cita una magnitud numérica: la
> magnitud exacta está en la profundidad de la ficha. Se añaden cláusulas hasta
> que la descripción distingue de los demás miembros del campo.

En pantalla queda: «Esta descripción sale de lo que se puede ver sin líneas ni
instrumentos.» El dato sigue en el paquete, en cada ficha, sin tocar.

**Lo que esto no cambia.** Ningún dato se ha borrado de `datos/`. Lo único que
ha cambiado es qué se pinta.
