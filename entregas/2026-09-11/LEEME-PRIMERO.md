# Para subir a GitHub · 11 de septiembre de 2026

**Esto no se copia de golpe.** Son trece tandas, cada una con su `LEEME.md` y su carpeta `repo/`, que va **encima del repositorio respetando las rutas**. Se sube una, se construye, se comprueba, y solo entonces la siguiente.

La razón de no juntarlas: tres tandas tocan `scripts/build_site.py` o la hoja de estilos, y si se copian a la vez no se sabe cuál rompió qué. Con una por rama y una construcción entre medias, siempre se sabe.

## Antes de cada tanda

```bash
git switch main && git pull
git branch backup/$(date +%Y%m%d-%H%M)-antes-<nombre>
git switch -c integracion/$(date +%Y%m%d)-<nombre>
# copiar el contenido de repo/ de esa tanda encima
rm -rf dist && python3 scripts/build_site.py
```

Y al terminar, lo que diga su `LEEME.md`. Nunca se retira el modo mantenimiento porque un guion acabe sin errores.

## El orden, y por qué

| # | Carpeta | Qué hace | Por qué va aquí |
| ---: | --- | --- | --- |
| 1 | `1-sin-js` | Investigación, Vídeos, Juegos, Cuestionarios y Sobre se leen sin JavaScript | Hoy esas páginas no llegan: no llegan incompletas, llega nada. Y no toca ningún texto |
| 2 | `2-comprobaciones` | La comprobación previa pasa a `main`; dos auditorías nuevas en el build | Con esto deja de crecer el problema: lo que no pase, no se publica |
| 3 | `3-estados-y-420` | Tres partes: fuera los estados públicos · las 420 descripciones · las 185 Condiciones | Es la entrega editorial. Lee su `LEEME.md` entero antes de empezar |
| 4 | `4-limpio` | La auditoría vigente y la auditoría que impide publicar estados | Cierra lo anterior: la web no dice si un texto está verificado |
| 5 | `5-enlaces` | «Puede estar relacionado con» pasa a ser enlace | Hoy son pastillas que no llevan a ningún sitio |
| 6 | `6-accesibilidad` | Nombre accesible en los buscadores · `main` y `h1` en la hoja de impresión · pruebas de zoom, teclado y foco | Fallos concretos, ya localizados |
| 7 | `7-norma-lectura` | La norma de anchura, letra y espaciado para Vida diaria y Datos | Presentación. Ejecuta antes el guardián de la tanda 9 |
| 8 | `8-estructura` | La norma de estructura escrita, y su auditoría | Da el número de fichas que no la siguen, para el trabajo editorial |
| 9 | `9-guardian` | Demuestra que un cambio de presentación no cambió ninguna palabra | Se usa **antes y después** de las tandas 7 y 10 |
| 10 | `10-tecnico` | Tipografías propias · cabeceras de seguridad | La política de contenido entra en modo aviso, no activa |
| 11 | `11-portugues` | Portugués fuera de todos los sitios | Primero congela las 375 correspondencias, después borra la carpeta. Ese orden importa: si no, el build falla |
| 12 | `12-metodologia` | El marco de Investigación a Metodología y la cabecera de la página | Cambia textos ya publicados: ejecuta primero su `--check` y lee la lista |
| 13 | `13-auditorias` | La auditoría de las 420, ya hecha, y el guion de enlaces de Situaciones | No hay nada que subir salvo el guion: lo demás es para leer |

## La prueba final, después de la tanda 3

La correspondencia de las 187 Situaciones está cerrada y **no se recalcula**: 73 por título, 17 por texto o manifiesto y 97 por confirmación expresa de la autora. Antes de la parte 2, un solo cambio en `mapa-420.json`:

```
"situaciones_por_posicion": false  →  true
```

Nada más: ni una correspondencia se toca, y la comprobación de seguridad del integrador se queda puesta.

Después de integrar las 187 Situaciones, las 185 Condiciones y las 48 de Vida diaria, se construye desde cero y **se audita el `dist`, no `main`**:

```bash
rm -rf dist && python3 scripts/build_site.py
python3 scripts/validar_dist_420.py --root dist
```

Devuelve, en `reports/publicacion/validacion-dist.md`: cuántas Situaciones están en el dist con su descripción ES y EN correctas, si los títulos se conservan, cuántas Condiciones llevan su letra final, si queda alguna `A/B`, `B/C`, `D` o «sin grado», las 48 de Vida diaria, si el buscador y los JSON están sincronizados, si la `meta description` coincide con la descripción visible, y **la lista exacta de cada diferencia sin corregir ninguna**.

No corrige nada por inferencia, y eso es a propósito: corregir una diferencia adivinando es lo que produjo la mezcla de versiones que veníamos arrastrando.

**Terminar el build sin errores no es validación.** Primero se lee este informe. La web no se reabre hasta entonces.

## Tres avisos

**La tanda 3 manda sobre las demás en contenido.** Si algo de otra tanda se pisa con ella, gana la 3.

**Las tandas 7 y 10 llevan guardián.** Antes: `audit_textos_intactos.py --guardar`. Después: `--comparar`. Si sale una sola palabra cambiada, se revierte y se mira.

**Las 97 correspondencias de Situaciones están confirmadas por escrito** en `3-estados-y-420/repo/editorial/integration/2026-09-10/CONFIRMACION-97-SITUACIONES-2026-09-11.md`. El paso previo de la parte 2 es poner `"situaciones_por_posicion": true` en `mapa-420.json`, y nada más: las correspondencias no se recalculan y los títulos actuales no se sustituyen.

## Lo que no va en este zip

Los prototipos —la Tarjeta Iris y la ficha con resumen y ampliar— y las auditorías de lectura. No son web: son para decidir. Y la portada recuperada, que está en el proyecto para poder probarla.
