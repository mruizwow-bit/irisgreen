# Registro #324 · Retirar los juegos viejos y el cielo R02, y escribir el hub de Juegos

**Fecha:** 08/10/2026 · **Rama:** `claude/cada-cerebro-3d-r03-20261007` · **Nada subido.**
Decisión de María: «LOS VIEJOS FUERA» y «quita plus y para todos, este área es para todos».

## Lo que estaba mal, y cómo se vio

El hub de `/es/juegos/` publicado **no era el que monta el build**. `reorganize_activity_hubs.py`
lo escribe en el paso 278 y `materialize_interactive_areas.py` lo pisaba en el 289 con
`write_bytes`, sin mirar si existía. Después del 289 sólo quedan dos tests, así que el
materializador era el último que escribía y ganaba siempre. Ningún gate lo vigilaba:
`test_r69_unified_interface.py:89` lee `es/recursos/juegos/index.html`, la ruta vieja.

Resultado en vivo sobre `cd04d373`: `/es/juegos/` servía el hub del paquete editorial, con
**0 de 3** fichas de juego enlazadas.

Y el nuestro tampoco las enlazaba: era un hub de relleno —«Lo que hay ahora» / «Mientras
tanto»— que apuntaba a `/es/recursos/juegos/`. Ganara el que ganara, los tres juegos nuevos
no aparecían.

## Qué se ha hecho

**Hub de Juegos escrito de verdad.** `es/juegos/index.html`: las tres fichas, con la barra
canónica (edad · música · accesibilidad · idioma) y sin lista de áreas a la vista.

**Retirados**, por decisión de María. No se tocan los paquetes, que siguen sellados por
checksum: el materializador deja de extraer estos miembros.

| retirado | redirige a |
|---|---|
| `es/juegos/el-taller-de-las-islas.html` | `/es/juegos/` |
| `es/juegos/para-todos.html` · `plus.html` | `/es/juegos/` |
| `es/juegos/construccion/` | `/es/juegos/` |
| `es/descubrimiento/cielo.html` · `cielo/` | `/es/intereses/cielo-y-espacio/` |
| `es/descubrimiento/para-todos.html` · `plus.html` | `/es/descubrimiento/` |

Los 301 van en `_redirects`, donde ya vivía el alias de Descubrimiento, y **colapsan sin
`:splat`**: «Cielo y Espacio» es una sola página y sus rutas internas son estado, no
direcciones. Con `:splat` serían 301 a 404.

El cielo nuevo cubre lo que cubría el viejo: **88 láminas de constelaciones** contra
**88 fichas**, más Sistema Solar, eclipses, exoplanetas y meteoros.

«Para todos» y «Plus» eran niveles de acceso, no temas ni edades, y el área es para todos.
La propia página lo confesaba con una nota al pie que explicaba sus botones. Además chocaban
con la portada de edad: lo que cada persona ve ya lo decide su banda.

## Las guardas que faltaban

- **El materializador declara lo que no reclama** (`NO_RECLAMADAS`) y **falla si un miembro
  de un paquete cae sobre un archivo que el build ya produjo**. Esa guarda habría cantado
  sola lo del hub, sin que nadie leyera números de paso.
- **Los reemplazos cuentan y fallan.** `sustituir()` y `quitar_seccion()` comprueban que hay
  exactamente las coincidencias esperadas. El que había antes se aplicaba en silencio: si el
  paquete cambiaba el texto de origen, la tarjeta apuntaba a donde no debe con CI en verde.
- **Inventario explícito en vez de suelo.** `assert len(pages) >= 12` deja que un área tape
  la desaparición de otra. Ahora hay una lista de las diez páginas esperadas y el test dice
  cuál falta o cuál sobra.

## Dos fallos míos, encontrados de paso

**La auditoría de privacidad de almacenamiento estaba roja por mi culpa**, y no lo habría
visto el build: corre en su propio workflow, `comprobar-privacidad-almacenamiento.yml`.

1. `iris-green.cielo-3d.r02`, la clave del cuaderno de «Cielo y Espacio», no estaba en el
   inventario, y el auditor no sabe seguir `CFG.CLAVE_GUARDADO`: tres errores de «clave no
   resoluble». Declarada, y la clave escrita literal en `js/producto.js` —mismo valor— igual
   que se hacía con el cielo R02.
2. `ig-movimiento`, la preferencia de movimiento de las páginas nuevas, tampoco estaba:
   otros cuatro errores. Declarada, misma familia que `ig-a11y` y `ig-theme-2026`.

Los avisos públicos de privacidad ES/EN se reescriben: ya no nombran el taller de las islas
ni el cielo R02, y cuentan el cuaderno del cielo nuevo.

## Comprobado

- `build_site.py` completo, **verde**. R69 PASS. 1065 páginas, `dist` 2985 archivos.
- Áreas interactivas: 10 páginas, enlaces y retornos verificados.
- `audit_privacidad_almacenamiento.py --root dist`: **0 errores** (1347 archivos, 76 llamadas).
- `audit_privacidad.py --root dist`: **0 errores**.
- El hub publicado es el nuestro y enlaza las tres fichas.
- Las ocho páginas retiradas no están en `dist`; sus catorce 301 sí.
- `/es/descubrimiento/` ya no tiene la sección «Elige por dónde entrar» y su tarjeta del
  cielo lleva a `/es/intereses/cielo-y-espacio/`.
- «Cielo y Espacio» sigue fuera del sitemap, que es lo coherente con su `noindex`.

## Lo que sigue rojo, y no lo arregla este commit

El contrato de indexación. Medido aquí: **html 1065**, `index,follow` 1034,
`noindex,follow` 7, otros 24, **sitemap 1048**. Congelado en el workflow: 1011 / 990 / 5 /
16 / 1004. **`expected` no se toca**: son 55 páginas de deriva anterior y absorberlas en
este commit sería firmar trabajo ajeno. Hay que reconciliarlo aparte.

Y sigue abierto: `/es/juegos` no tiene banda de edad en `ig-audience.js` ni en
`age-classification-r51-global.json`. Mientras no la tenga, la maquinaria de edad deja el
contenido oculto. Es lo que bloquea publicar los juegos.

**El cartel de mantenimiento sigue puesto. Ni main, ni push, ni reabrir producción.**
