# Registro para #323 · montaje de «Cielo y Espacio» R04 en el repo

**Entrega:** `CIELO_Y_ESPACIO_R04.zip` · SHA256 comprobado en destino:
`9412a246137b40d75f8c456e37a0e0a049e75ed623459b50ba12a29856745e46` · 417 archivos.

**Montado por:** Claude Design, 08/10/2026, en el clon local de María.
**No se ha subido nada. El push lo hace Codex o María.**

## Qué se ha montado, y qué no

Se publica **una vez**, como decidió María: `es/intereses/cielo-y-espacio/`,
**247 archivos, 4,8 MB** — `index.html`, `assets/`, `css/`, `datos/`, `js/` y
`licencias/`.

**No** entran en la web las otras tres carpetas del ZIP: `capturas/` (12 MB),
`video/` (7,3 MB) y `pruebas/` (528 KB). Son evidencia de QA, no producto, y
publicarlas serían 20 MB en `dist` que nadie pide. La documentación sí queda,
en `COORDINACION_IRIS_GREEN/MEMORIA/`, fuera de lo publicado.

## Enlazado desde las ocho rutas

| español | inglés |
|---|---|
| `es/intereses/cielo/` | `en/interests/night-sky/` |
| `es/intereses/sistema-solar/` | `en/interests/solar-system/` |
| `es/intereses/eclipses/` | `en/interests/eclipses/` |
| `es/intereses/exoplanetas/` | `en/interests/exoplanets/` |

Un enlace en cada una, justo después del `<h1>`, a la única publicación. Las
ocho comprobadas en `dist`.

## Lo que el build le hace a la página, y que el paquete no esperaba

El paquete se declara autónomo y abrible con `file://`. Al vivir bajo `es/`,
los adaptadores del sitio le inyectan su envoltorio: `ig-fonts.css`,
`ig-r69-unified-ui.css`, `data-ig-r49="1"`, `ig-audience.js` y el aviso sin
JavaScript de la edad. **Comprobado que no lo rompe**: el cielo se dibuja,
`__IG_SCENE_ERROR__` sigue en `null` y no hay errores de consola.

Y tiene un efecto que conviene decir en voz alta: **así la página queda dentro
de la maquinaria de edad del sitio**, que es justo lo que hace falta para que
una experiencia no sea una puerta por detrás de la portada de edad.

## Cuentas de indexación · medidas, no copiadas

El documento del paquete calcula sobre el contrato congelado
(`html 1011 → 1012`). Medido sobre el repo de verdad, main ya está muy por
encima de ese congelado, así que esos números no se pueden empujar tal cual.

| | html | index,follow | noindex,follow | otro_o_ninguno | sitemap_urls |
|---|---|---|---|---|---|
| congelado en el workflow | 1011 | 990 | 5 | 16 | 1004 |
| main sola | 1066 | 1030 | 7 | 29 | 1044 |
| main + juegos + cielo | 1073 | 1033 | 7 | 33 | 1048 |

El cielo aporta **+1 `html` y +1 `otro_o_ninguno`** (su `robots` es
`noindex,nofollow`), y **nada al sitemap**: comprobado, no aparece en él.
El resto del delta son las tres fichas de juego y sus tres experiencias.

**No se ha tocado `expected`**, por lo mismo de siempre: main arrastra 55
páginas de deriva anterior y meterlas en este commit sería absorber trabajo
ajeno. Hay que reconciliarlo aparte.

## Lo que queda abierto, del propio paquete

- **Assets obsoletos.** `ig-sistema-solar-3d.js` (597 KB) e
  `ig-exoplanetas-3d.js` (566 KB) siguen cargándose desde las rutas vieja y su
  intermediario. **No se han retirado**: retirarlos cambia esas cuatro páginas y
  esa decisión no es de este montaje.
- **Colisión de nombres.** `--ig-text`, `--ig-link` y `--ig-focus` se llaman
  igual en el paquete y en el sitio. Hoy coinciden en valor; quién gana depende
  del orden de carga.
- **Botón primario.** El del paquete da 14,09:1 contra el fondo oscuro; el token
  del sitio daría 2,29:1, por debajo del 3:1 de WCAG 1.4.11. No se ha cambiado.
- **`__IG_SCENE_ERROR__`** es convención del paquete, no contrato del sitio:
  comprobado, ese nombre no aparece en el repo fuera del paquete.
- `UNRESOLVED_FIRST_RUN_FAILURE.md` sigue abierto. Sin GPU real, sin teléfono
  físico y sin lector de pantalla real.

## Comprobado aquí

- `python3 scripts/build_site.py` completo, con la puerta R69 en **PASS** y
  1071 páginas; `dist` pasa de 3.038 a 3.285 archivos.
- Los 247 archivos del producto llegan a `dist`.
- Las ocho rutas enlazan la publicación.
- La página se dibuja con el envoltorio del sitio encima, sin errores.

**Ningún gate emitido. NO PUBLIC DEPLOY desde aquí.**
