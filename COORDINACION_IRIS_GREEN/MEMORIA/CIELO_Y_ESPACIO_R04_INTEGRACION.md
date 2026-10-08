# R04.5 · Lo que hay que hacer para montarlo, con las cuentas ya sacadas

Esto va para quien monte el paquete en el repo. Lo monta Codex, en `main`, no
este paquete: aquí no se sube nada ni se toca ninguna rama.

La vuelta anterior este documento decía «el paquete no tiene el repo delante» y
dejaba cinco puntos sin comprobar. **Eso ya no vale**: el repo
(`mruizwow-bit/irisgreen`) sí se ha podido mirar. Lo que sigue son datos
medidos, no suposiciones, con la fecha en que se miraron: **08/10/2026**, rama
`nexo/new-games-area-r01-20261004`, commit `73073de`. Si el repo se mueve, hay
que volver a mirarlo.

## 0 · Lo que el paquete ya cumple

- **Nada de CDN.** Ni una petición fuera de `file:`, `data:` o `blob:`; lo
  comprueba el banco de navegador en cada pasada. Vale con `script-src 'self'`
  y `connect-src 'self'`.
- **Tipografías propias**, en `assets/fonts/`, no desde Google Fonts.
- **`<meta name="robots" content="noindex,nofollow">`** en `index.html`.
- **Tema del sitio**: ya lee `data-ig-theme`. Ver §3.
- **Rastro de error**: ya existe `__IG_SCENE_ERROR__`. Ver §4, y leer el aviso.

## 1 · Dónde se publica · decidido

**Se publica una vez y se enlaza desde las rutas. No se copia.** El producto es
uno con tres experiencias y **un cuaderno común**: copiarlo partiría en varios
lo que la persona lleva guardado, y quien entrara por «eclipses» no encontraría
lo que había encontrado por «cielo». Ese fallo no lo vería ninguna prueba y
sería el peor de todos.

Decisión de María, 07/10/2026. El paquete no la toma; la recoge.

**Y son ocho rutas, no cuatro.** La orden nombraba las cuatro españolas. El
repo tiene las cuatro inglesas al lado, y el producto está en los dos idiomas:

| español | inglés |
|---|---|
| `es/intereses/cielo/` | `en/interests/night-sky/` |
| `es/intereses/sistema-solar/` | `en/interests/solar-system/` |
| `es/intereses/eclipses/` | `en/interests/eclipses/` |
| `es/intereses/exoplanetas/` | `en/interests/exoplanets/` |

Dejar fuera las inglesas daría un producto bilingüe al que sólo se llega en
español.

## 2 · Contrato de indexación · los números

Está en `.github/workflows/comprobar-publicacion.yml`, y hoy dice:

```
expected={'html':1011,'index,follow':990,'noindex,follow':5,'otro_o_ninguno':16,'sitemap_urls':1004}
```

El paquete es **una sola página**: `index.html`, y nada más (los 412 archivos
restantes son datos, scripts, estilos, tipografías e imágenes). Su etiqueta es
`noindex,nofollow`, y el contador del workflow sólo tiene cubos para
`index,follow` y `noindex,follow`: **`noindex,nofollow` cae en
`otro_o_ninguno`**. Así que publicándolo una vez:

```
expected={'html':1012,'index,follow':990,'noindex,follow':5,'otro_o_ninguno':17,'sitemap_urls':1004}
```

`sitemap_urls` no se mueve mientras la página no entre en el sitemap, que es lo
coherente con `noindex`. **Esto va en el mismo commit que el paquete** o CI se
pone en rojo. Si al montar se decide que la página sí debe indexarse, los
números son otros y hay que rehacer la cuenta, no empujar estos.

## 3 · Tema claro y oscuro · hecho, con una diferencia que hay que decidir

El sitio pone `data-ig-theme="dark"|"light"` en `<html>` desde
`assets/ig-theme.js`. El paquete ya lo sigue:

- **el marco cambia**: portada, fichas, cuaderno y mandos;
- **el cielo no**: se queda oscuro siempre, porque es el tema del cielo y no
  una preferencia de interfaz;
- **lo que flota sobre el cielo tampoco**: la tira de mandos conserva los
  colores oscuros. La primera versión se olvidó de esto y el rótulo «Orientar y
  acercar» salía gris oscuro sobre casi negro. Ahora lo guarda `G4`.

Lo mide `pruebas/r04_integracion.js` sobre el color pintado, no sobre la hoja
de estilo.

**Los valores están copiados de `assets/ig-global-ui-tokens-2026.css`**, no
leídos de allí, porque el paquete tiene que funcionar también abierto solo con
`file://`. Comparados uno a uno, **diez de once coinciden exactamente** en los
dos temas. El que no:

| | paquete | sitio (`--ig-button-primary-*`) |
|---|---|---|
| botón primario, oscuro | fondo `#DCE8F2`, texto `#0B1A2B` | fondo `#315774`, texto `#EEF4F8` |
| contraste del texto | **14,09:1** | 6,89:1 |
| contraste del botón contra la página `#0B1A2B` | **14,09:1** | 2,29:1 |

En claro los dos coinciden (`#17395C` / `#EEF4F8`).

**No se ha cambiado**, y la decisión no es del paquete. Si se adopta el token
del sitio, el texto del botón sigue cumpliendo AA (6,89:1) pero **el borde del
botón contra el fondo oscuro baja a 2,29:1**, por debajo del 3:1 que pide WCAG
1.4.11 para elementos no textuales, salvo que el borde `--ig-border-control`
lo sostenga. Quien monte decide; el dato está medido.

## 4 · Rastro de error · hecho, con un aviso

`__IG_SCENE_ERROR__` ya existe, en `js/config.js`, definido antes que nada.
Vale `null` mientras todo va bien; si algo falla queda
`{ codigo, mensaje, cuando, detalle }`, con `codigo` entre `SIN_WEBGL2`,
`CONTEXTO_PERDIDO`, `SIN_CANVAS_2D` y `RECURSO`. El segundo fallo no pisa al
primero: se apila en `despues`. Se lanza además el evento `ig:scene-error`.

**El aviso, y es importante:** este nombre **no aparece hoy en el repo**. Se ha
buscado en todo el árbol y sale cero veces. En la vuelta anterior escribí que
«el contrato del sitio lo espera», y **eso no era cierto**: salió del texto de
la orden, no del repo. Así que esto es una **convención que propone el
paquete**, no un contrato que ya exista. Si el sitio prefiere otro nombre u
otra forma, se cambia en `js/config.js` y en ningún sitio más.

## 5 · Assets que quedan obsoletos · la cadena completa

| asset | tamaño | lo carga | y a ése lo cargan |
|---|---|---|---|
| `assets/ig-sistema-solar-3d.js` | 597 KB | `assets/ig-sistema-solar.js` | `es/intereses/sistema-solar/index.html`, `en/interests/solar-system/index.html` |
| `assets/ig-exoplanetas-3d.js` | 566 KB | `assets/ig-exoplanetas.js` | `es/intereses/exoplanetas/index.html`, `en/interests/exoplanets/index.html` |

Nadie más los carga: la cadena es exactamente ésa, comprobada en todo el árbol.

Los sustituye este paquete: el Sistema Solar lo dibujan `js/cuerpos3d.js` y
`js/solar.js`, y los exoplanetas son una capa de la misma esfera del cielo, en
`datos/exoplanetas.js` y `js/producto.js`. **No deben quedar los dos caminos
vivos a la vez.** Retirarlos es retirar también los dos intermediarios, o
dejarlos sin su dependencia.

## 6 · Colisión de nombres de variable · mirar al montar

El paquete define sus tokens en `:root` de `css/iris-green-navy.css`. Tres
tienen **el mismo nombre** que los del sitio: `--ig-text`, `--ig-link` y
`--ig-focus`. Hoy los valores coinciden en los dos temas, así que no se nota,
pero **quién gana depende del orden de carga de las hojas**. Si el sitio cambia
alguno de los tres, el paquete puede quedarse con el suyo y desentonar sin que
salte ninguna prueba. Al montar: o se cargan las hojas en un orden decidido a
propósito, o se renombran los tres en el paquete.

## 7 · Lo que sigue abierto, y no lo cierra este paquete

- `UNRESOLVED_FIRST_RUN_FAILURE.md` sigue abierto.
- No hay GPU real, ni teléfono físico, ni lector de pantalla real: NVDA, JAWS y
  VoiceOver siguen siendo HUMAN/AT QA.
- Ningún gate emitido. Esto no es PASS independiente, ni científico, ni
  HUMAN QA.

**NO MAIN · NO PUBLIC DEPLOY desde aquí.** El montaje lo hace Codex.
