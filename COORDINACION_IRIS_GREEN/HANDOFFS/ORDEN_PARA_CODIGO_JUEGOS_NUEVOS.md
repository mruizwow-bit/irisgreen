# ORDEN PARA CLAUDE CODE · SUBIR LOS DOS JUEGOS NUEVOS A LA SUPERFICIE DE REVISIÓN

**Fecha:** 07/10/2026
**Repo:** `mruizwow-bit/irisgreen` (local: `C:\Users\mruiz\Documents\NEAlabs-GitHub-Limpio\projects\irisgreen`)
**Estado:** el trabajo está hecho y commiteado en local. Falta empujar, abrir el PR y fusionar.
**Destino:** superficie de revisión `main-review`. **Producción no se toca.**

---

## 0. Qué hay hecho ya

Rama **`claude/cada-cerebro-3d-r03-20261007`**, dos commits:

| commit | qué trae |
|---|---|
| `8e1cf8c8` | monta el juego en `es/juegos/cada-cerebro-su-camino/`, cambia el destino de los dos redirects de la ruta retirada y hace idempotente la inyección de `materialize_interactive_areas.py` |
| `b52353f3` | sustituye la entrega por la **R04_5** y añade la pasada de lenguaje y la paleta a `COORDINACION_IRIS_GREEN/MEMORIA/` |
| `7469f427` | monta **«La máquina de empezar» R01_1** en `es/juegos/la-maquina-de-empezar/` y repunta sus dos redirects retirados |

Ficheros tocados, y ninguno más:

```
es/juegos/cada-cerebro-su-camino/index.html
es/juegos/la-maquina-de-empezar/index.html
es/juegos/cada-cerebro-su-camino/pruebas/apertura.mjs
es/juegos/cada-cerebro-su-camino/pruebas/resultado-apertura.json
es/juegos/cada-cerebro-su-camino/pruebas/salida-apertura.txt
netlify.toml
scripts/materialize_interactive_areas.py
COORDINACION_IRIS_GREEN/MEMORIA/CADA_CEREBRO_R04_5_LENGUAJE.txt
COORDINACION_IRIS_GREEN/MEMORIA/CADA_CEREBRO_R04_5_PALETA_14.txt
```

**Atención:** el árbol de trabajo tiene además cambios SIN commitear de otra tarea
(la web nueva: `index.html`, `es/recursos/`, `es/informacion/`, `es/juegos/`,
`es/descubrimiento/`, `es/espacio-tranquilo/`, `es/creacion/`, `assets/ig-web/`,
`scripts/prepare_video_thumbnails.py`, `scripts/fix_home_support_english.py`).
**No los metas en este PR.** No hagas `git add -A`.

---

## 1. Lo que tienes que hacer

```bash
git push -u origin claude/cada-cerebro-3d-r03-20261007
gh pr create --base main --title "Montar los dos juegos nuevos en /es/juegos/ para revisión" --body-file <la descripción de abajo>
```

Cuando CI esté verde, fusiona. **El despliegue a main-review se dispara solo**: el workflow
`publicar-main-review-netlify.yml` escucha los push a `main`. No hace falta lanzarlo a mano y
**no se ejecuta `publicar-produccion-netlify.yml`** (`MAINTENANCE_ACTIVE.txt`: `REOPEN =
MARIA_EXPLICIT_AUTHORIZATION_ONLY`; un CI verde no es autorización).

URL para María:
`https://main-review--irisgreen-home.netlify.app/es/juegos/cada-cerebro-su-camino/`
`https://main-review--irisgreen-home.netlify.app/es/juegos/la-maquina-de-empezar/`

---

## 2. Lo que CI te va a poner en rojo, y por qué no es de este PR

`comprobar-publicacion.yml` lleva congelado:

```python
expected={'html':1011,'index,follow':990,'noindex,follow':5,'otro_o_ninguno':16,'sitemap_urls':1004}
```

Medido con build local:

| | html | index,follow | noindex,follow | otro_o_ninguno | sitemap_urls |
|---|---|---|---|---|---|
| congelado | 1011 | 990 | 5 | 16 | 1004 |
| main sola | 1066 | 1030 | 7 | 29 | 1044 |
| main + los dos juegos | 1068 | 1030 | 7 | 31 | 1044 |

Los dos juegos aportan **+2 `html` y +2 `otro_o_ninguno`**, nada al sitemap (su `robots` es
`noindex,nofollow`). **Main ya está 55 páginas por encima del contrato antes de este cambio**:
+40 `index,follow` y +40 urls de sitemap de otro trabajo ya fusionado.

**No copies el `got` entero en `expected` dentro de este PR**: absorbería esa deriva ajena, que
es justo lo que prohíbe el comentario del propio workflow. Reconcilia esos 55 en un commit
aparte, con quien publicó esas páginas, y deja este PR con un solo delta declarado.

---

## 3. Comprobaciones ya ejecutadas en local (no hace falta repetirlas, pero aquí están)

- `python3 scripts/build_site.py`: completo, sin error. `{"r69_unified_interface": "PASS", "html_pages": 1066, ...}`
- `dist/es/juegos/cada-cerebro-su-camino/index.html` y `dist/es/juegos/la-maquina-de-empezar/index.html` existen; `three.js`, tokens y las tres fuentes están en `dist`.
- En las dos: una sola inyección de canonical, `ig-fonts.css` e `ig-r69-unified-ui.css`; `nav.ig-experience-return` intacto; fuera del sitemap.
- `node es/juegos/cada-cerebro-su-camino/pruebas/apertura.mjs` → código 0, `pass: true`, 10 rutas y 6 personas.
- `python3 scripts/audit_sin_js.py --root dist` → `{"html_revisados": 1068, "todas_declaradas": true}`
- `python3 scripts/test_resources_current.py --static-only` → 16 rutas retiradas intactas, hreflang recíproco.
- Escena 3D comprobada en navegador en los dos juegos: canvas dibujado (831x467 y 2132x1198), sin errores de consola.

**No comprobado aquí:** `audit_axe_wcag.py` y la mitad de navegador de `test_resources_current.py`
(necesitan Playwright, que no está en esa máquina). Corren en CI.

---

## 4. Lo que NO se hace

- No tocar `scripts/retired_game_routes.json` ni quitar redirects (sus destinos ya están cambiados).
- No meter nada en `/es/recursos/juegos/`.
- No añadir la tarjeta del juego al hub `/es/juegos/`: esa página se genera desde el ZIP editorial.
- No meter la página en el sitemap.
- No desplegar a producción.
- No cargar nada desde un CDN.
- No commitear los cambios de la web nueva que hay en el árbol.

---

## 5. Pendiente antes de que esto sea público (no es de este PR)

`/es/juegos` no está en `SAFE_UNCLASSIFIED_PREFIXES` de `assets/ig-audience.js` ni aparece en
`assets/safety/age-classification-r51-global.json` (0 coincidencias). Para una página `noindex`
en la superficie de revisión no bloquea; **para publicar hace falta su banda de edad**, y eso lo
deciden María y Axioma.
