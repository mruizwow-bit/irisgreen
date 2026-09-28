# Barrido de color de interfaz · §9 de los tokens globales 2026

**Norma:** `IRIS_GREEN_GLOBAL_UI_TOKENS_2026_ADOPTED`
**Herramienta:** `scripts/audit_tokens_hardcode.py`
**Hoja fuente:** `assets/ig-tokens-2026.css` (§10)
**Fecha:** 28/09/2026
**Puerta:** `INFORME`. No declaro
`IRIS_GREEN_GLOBAL_VISUAL_TOKENS_UNIFIED_GATE`, y el motivo está abajo.

---

## Lo que mide

1.123 archivos: CSS y JS de `assets/`, y el HTML de `es/`, `en/` y raíz.

| Clase | Casos |
| --- | --- |
| **hardcode** · color de interfaz escrito a mano, sin excepción | **5.193** |
| **token-literal** · el valor ya *es* el token, pero escrito a mano | 1.975 |
| neutro · blanco, negro, `transparent`, `currentColor` | 1.173 |
| arte · escena e ilustración, permitido por la §6 | 940 |
| sistema · dentro de `forced-colors`, `print`, `prefers-contrast` | 23 |

**891 colores de interfaz distintos** para 25 tokens canónicos.

## Dónde está

| | Casos |
| --- | --- |
| HTML | 4.064 |
| CSS | 771 |
| JS | 358 |

El HTML pesa cuatro veces más que el CSS, y eso cambia qué trabajo es. No es
migrar una hoja de estilos: es que el color vive dentro de las páginas.

| En HTML | Casos |
| --- | --- |
| bloque `<style>` dentro del documento | 2.113 |
| atributo `style=` en el elemento | 1.692 |
| resto | 259 |

De los 4.064, **1.054 están dentro de `<noscript>` / `ig-sin-js`**. Esos
merecen decisión, no migración automática: ver más abajo.

## Los diez peores archivos

| Archivo | Casos |
| --- | --- |
| `es/investigacion/index.html` | 671 |
| `es/vivir-fuera/index.html` | 218 |
| `es/neurodiversidad/temas/autismo/index.html` | 169 |
| `en/interests/exoplanets/index.html` | 165 |
| `es/intereses/exoplanetas/index.html` | 165 |
| `es/cuestionarios/index.html` | 160 |
| `index.html` | 144 |
| `es/videos/index.html` | 141 |
| `assets/navigation-approved.css` | 104 |
| `es/tramites/index.html` | 99 |

---

## Los hallazgos que importan más que el recuento

### 1. El fondo de página ya estaba bien; la superficie no

De los 1.975 literales que ya coinciden con un token, **1.047 son
`--ig-bg-page`**: `#f6f8fb` es exactamente el fondo canónico LIGHT, y ya está
escrito por todas partes. Le falta ser `var()`, no cambiar de valor.

Lo que sí cambia de valor es la superficie. `site-v23.css` define
`--papel: #ffffff`, y la §3 retira el blanco como superficie extensa. Ese es
el cambio visible de la migración en claro: las tarjetas.

### 2. La hoja de alias apenas toca nada

La §10 permite mapear los alias heredados, y lo he hecho. Pero `var(--papel)`
aparece **10 veces** en todo el repositorio y `var(--niebla)` **una**. La web
no estaba usando tokens y perdiéndose los nuevos: no estaba usando tokens.

El alias sirve para no romper esas once reglas. No es la migración.

### 3. El texto secundario tiene cuatro valores, y tres son peores

Medido sobre `#F6F8FB`:

| Valor | Usos | Contraste |
| --- | --- | --- |
| `#435268` · `--ig-text-muted` canónico | — | **7,46:1** |
| `#4d5a6b` | 360 | 6,60:1 |
| `#5a6577` | 100 | 5,54:1 |
| `#5c7391` · `--suave` de `site-v23.css` | — | 4,57:1 |

Los cuatro pasan AA para texto normal. Ninguno de los tres escritos a mano
llega al canónico, y `#5c7391` se queda a 0,07 de no pasar. En un producto de
accesibilidad, unificar aquí no es cosmética.

### 4. `ig-taller-lab.css` es un design system paralelo

Redefine `--tinta`, `--azul`, `--lila`, `--suave` para Taller. No entra en la
lista de arte del barrido, a propósito: la §6 permite color propio en la
escena, no sustituir la paleta de interfaz. Es exactamente lo que prohíbe
la §1, y por eso sale en el recuento y no en la excepción.

### 5. Los separadores no pasan 3:1, y probablemente no deben

`--ig-separator` `#D5E1EC` da **1,25:1** sobre el fondo claro. Los valores a
mano que sustituye —`#dfe5ee` 301 usos, `#dfe6ef`— dan 1,19 y 1,18. Ninguno
llega a 3:1, que es lo que pide el criterio 1.4.11 para elementos de interfaz.

No lo trato como fallo: un separador decorativo está exento si no transmite
información, y para borde funcional la norma ya da `--ig-border-control`
`#7A869D`, que da 3,45:1 y sí cumple. Lo anoto porque la diferencia entre
«separador» y «borde de control» tendrá que decidirse regla a regla durante la
migración, y es el sitio donde es fácil colar un borde de input como si fuera
una línea de adorno.

---

## Por qué no declaro la puerta

La §9 dice que un color de interfaz escrito a mano sin excepción es FAIL. Con
5.193 casos, declarar la puerta verde sería falso.

Tampoco la declaro roja como resultado mío, porque el trabajo no es de un
carril: son las páginas de Investigación, Vivir fuera, Condiciones, Intereses,
Cuestionarios, Vídeos, Trámites, Home, la navegación y Taller. María ya pasó la
regla a los issues activos de A2/Home, R54 Taller, Cloud, Intereses, Juegos y
Rincón; este barrido es la línea base contra la que esos issues pueden medirse.

El script acepta `--max-hardcode N`. Cuando haya umbral acordado, la puerta
pasa a ser ejecutable sin tocar el código.

## Lo que hace falta decidir, y no decido yo

1. **Los 1.054 de `<noscript>`.** Esos bloques existen para renderizar sin
   depender de nada. Migrarlos a `var()` los hace depender de que la hoja de
   tokens cargue. Son candidato claro a excepción documentada de la §9.4, pero
   es decisión de arquitectura de A2/Home, no mía.
2. **El umbral de la puerta**, y si baja por hitos o de golpe.
3. **Qué pasa con `ig-taller-lab.css`**: la §7 dice que el launcher final
   consume tokens globales, pero ese archivo es la página de laboratorio.

## Lo que este barrido no certifica

- No parsea CSS. Es expresión regular sobre líneas, y un color dentro de un
  bloque anidado raro puede clasificarse mal.
- No dice si un color de interfaz es *correcto*, sólo si está escrito a mano.
- No mide contraste salvo donde lo he medido a mano arriba.
- No repara nada. Reescribir color en miles de reglas automáticamente haría
  más daño que el problema.
