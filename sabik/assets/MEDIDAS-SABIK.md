# Sabik · medidas del render canónico (13 sept) y montaje en tres capas

Fuente medida: `sabik-hologram-approved.png` (1254 × 1254, RGB, fondo blanco).

Este render **sí** tiene aros discretos. No es el caso de dos capas raster del render del 15: el residuo
radial no separa nada útil porque los aros salen fuera de la esfera y el fondo es opaco. El montaje
correcto es el de tres capas que Codex ya tiene en `index.html`.

## Esfera

| | |
|---|---|
| Centro | x = 624.4, y = 609.4 |
| Radio del filo | 357.5 px |
| Emblema | dentro de r ≈ 215 |
| Lienzo | 1254 × 1254 (la esfera no está centrada; las tres capas conservan el lienzo entero) |

## Aros (12)

Ajuste RANSAC sobre los trazos exteriores, refinado con centro libre: los doce quedan a < 1 px del
centro de la esfera. θ es exactamente el `rotate(θ cx cy)` del SVG.

| aro | rx | ry | θ | grosor | color | opacidad medida | tramo delante |
|---|---|---|---|---|---|---|---|
| 1 | 542.4 | 449.9 | 8.3 | 3.0 | #c5d4fd | 0.16 → 0.25 |
| 2 | 512.2 | 389.2 | 97.6 | 3.5 | #8cbbfc | 0.00 → 0.52 |
| 3 | 527.7 | 370.9 | 141.6 | 3.0 | #bcbffd | 0.00 → 0.46 |
| 4 | 444.9 | 433.4 | 78.8 | 2.5 | #daeafd | 0.13 → 0.31 |
| 5 | 470.8 | 300.4 | 34.1 | 3.0 | #669bfc | 0.02 → 0.73 |
| 6 | 573.8 | 336.3 | 8.5 | 3.0 | #aab2fc | 0.00 → 0.48 |
| 7 | 453.0 | 333.1 | 91.7 | 3.0 | #9ab5fd | 0.00 → 0.75 |
| 8 | 578.1 | 328.2 | 166.1 | 3.0 | #b1a1fc | 0.02 → 0.36 |
| 9 | 529.2 | 232.2 | 168.3 | 3.5 | #ac83fc | 0.03 → 0.79 | delante 55–140°
| 10 | 481.6 | 342.8 | 141.0 | 3.0 | #c4d0fd | 0.00 → 0.58 |
| 11 | 492.5 | 230.5 | 9.2 | 3.0 | #abcbfd | 0.11 → 0.57 |
| 12 | 515.2 | 242.6 | 153.1 | 3.0 | #b491fc | 0.00 → 0.72 | delante -12–70°

La opacidad no es uniforme: cada aro se desvanece a lo largo del recorrido. En el SVG va como
`linearGradient` en `userSpaceOnUse` con dos `stop-opacity` (valores de la tabla × 1.35). Para
controlarlo por estado basta con sobrescribir `stroke-opacity` en la elipse, que multiplica al degradado.

**Delante o detrás.** Diez aros pasan por detrás de la esfera (no hay traza dentro a menos de 12 px de
su elipse). Dos pasan por delante en un tramo: el 9 en su arco inferior izquierdo y el 12 en su arco
derecho (ángulos polares desde el centro, sentido horario, 0° a la derecha). Los demás arcos finos
que se ven dentro de la esfera no son continuación de ningún aro exterior: son decoración propia y se
quedan en la base.

## Puntos (38)

32 fuera de la esfera → `#dots-back`. 6 dentro → `#dots-front`. 16 están sobre un aro y llevan
`data-ring="ring-N"`; el resto `data-ring="none"`. Cada punto es un `<circle id="dot-N">` con degradado
radial propio (brillo arriba-izquierda) derivado de su color medido. Posiciones, radios y RGB en
`sabik-geometry.json`.

## Base

Cuerpo de la esfera, emblema, anillo interior, arcos internos y estrellas: píxeles originales sin tocar.
Fuera del disco: aros y puntos rellenados y halo suavizado (σ = 9 a partir de r = R + 8). Alfa: 1 dentro
de R + 6; fuera, estimado desde el blanco (1 − min(RGB)/255) para conservar el halo como transparencia.

## Verificación

Composición `back.svg + base.png + front.svg` sobre blanco frente al original:
- filo de la esfera coincide píxel a píxel (fila 609: x = 271 / 979 en ambos);
- diferencia media 2.9 / 255;
- el mapa de diferencias solo muestra el redibujado de aros y puntos.

Lo que queda por afinar es estético, no geométrico: la intensidad de algunos aros (subir `stop-opacity`
si se ven pálidos) y el brillo de los puntos.

## Archivos

| Archivo | KB |
|---|---|
| `sabik-base-640.webp` | 115 |
| `sabik-base.png` | 1304 |
| `sabik-base.webp` | 237 |
| `sabik-geometry.json` | 13 |
| `sabik-orbits-back.svg` | 14 |
| `sabik-orbits-front.svg` | 4 |
| `sabik-original-ref.webp` | 142 |

En producción a 640 px: base 115 KB + SVG 18 KB.

## Montaje

```html
<div class="sabik" data-state="NucleoBase">
  <!-- contenido de sabik-orbits-back.svg, inline -->
  <svg class="sabik-back" viewBox="0 0 1254 1254">…</svg>
  <img class="sabik-base" src="sabik/assets/sabik-base-640.webp" alt="">
  <!-- contenido de sabik-orbits-front.svg, inline -->
  <svg class="sabik-front" viewBox="0 0 1254 1254">…</svg>
</div>
```

```css
.sabik { position:relative; aspect-ratio:1 }
.sabik > * { position:absolute; inset:0; width:100%; height:100% }
.sabik-back  { z-index:1 }
.sabik-base  { z-index:2 }
.sabik-front { z-index:3 }
#rings-back, #rings-front, #dots-back { transform-origin:624.4px 609.4px }
```

Los SVG van inline para que `#ring-N` y `#dot-N` sean alcanzables desde CSS/JS. La base opaca tapa
sola la mitad trasera de los aros; la delantera ya lleva su `clipPath` circular.

## Estados: qué mueve cada uno

Todo son moduladores sobre los mismos elementos. Nada cambia `src` ni redibuja.

| estado | aros | puntos |
|---|---|---|
| NucleoBase | precesión lenta del grupo (240 s), opacidad medida | quietos |
| Espera | precesión 360 s, opacidad × 0.9 | quietos |
| Procesando | precesión 90 s | siguen a su aro |
| Hiperfoco | θ de todos los aros converge al del aro 9 (tween 1.2 s), opacidad × 1.1 | quietos |
| Creatividad | grupo escala 1.06, precesión 120 s inversa | siguen a su aro |
| Vínculo | opacidad × 1.0, precesión 200 s | quietos |
| VozInterior | opacidad × 0.7, precesión 300 s | ocultos los de fuera |
| Sobrecarga | aros pares a opacidad 0 (transición 800 ms), resto × 0.6, precesión 300 s | ocultos |
| Corrección | precesión invierte sentido 2 s y vuelve | quietos |
| low_intensity | opacidad × 0.35, sin precesión | ocultos |
| Riesgo | opacidad × 0.5, sin precesión, sin cambios bruscos | quietos |
| Pausa / Parar | `animation-play-state: paused` en el grupo | quietos |

Nada parpadea, vibra ni usa rojo. Con `prefers-reduced-motion: reduce` no hay precesión: los estados
solo cambian opacidad y escala con transición.

## Fase 7.1

La onda de voz es una cuarta capa (`z-index:4`) dentro del mismo contenedor. No toca base, aros ni Core.
