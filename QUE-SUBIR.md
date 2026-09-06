# Qué subir · paquete de esta tanda

Todo lo de esta carpeta va **encima de lo que ya hay**, respetando las rutas. No borra nada: sustituye archivos y añade los nuevos.

## Cómo subirlo

Copia el contenido de `para-irisgreen/` sobre la carpeta de tu repositorio, y en GitHub Desktop: **Commit to main** → **Push origin**.

## Qué sustituye

**Publicación**
`robots.txt` · `netlify.toml` · `sitemap.xml` (410 URLs, sin las 374 fichas en noindex)

**Rincón tranquilo** — 6 escenas de Mirar con su canal, 8 sonidos en 4 familias, esfera nueva
`es/sitio-tranquilo/` · `en/quiet-space/`

**Tus intereses** — ahora colección de cromos: 12 constelaciones y 12 minerales, en los dos idiomas
`es/intereses/` · `en/interests/` · `es/intereses/imprimir/` (hoja de impresión, nueva)

**Música** — 24 piezas
`assets/musica.js` · `assets/site-v23.css` · `audio/` (21 archivos)

**Juegos** — colección 13 del sueño, 130 juegos, 13 pestañas
`es/recursos/juegos/**` · `juegos-120.json`

**Taller** — 72 retos
`es/taller/`

**PT-BR fuera y textos corregidos**
`es/libros/` · `es/cuestionarios/` · `es/investigacion/` · `es/sobre-iris-green/` · `es/vivir-fuera/` · `es/videos/` · `es/metodologia/` · `es/tramites/`

**Imágenes nuevas**
`img/intereses/constelaciones/` (12) · `img/intereses/minerales/` (12) · `img/juegos-coleccion/` (7 del sueño)

**Directorio de ayudas** — `country` y `pais` en las 2.425 fichas, 197 países
`es/tramites/tramites-datos.json` y su copia en `es/tramites/directorio/`

## Qué comprobar en la web publicada

1. `/es/intereses/` enseña Constelaciones y Minerales, con «van 12 de 88» y «van 12 de 22».
2. Las 24 ilustraciones cargan.
3. Un cromo → «Descargar este cromo» abre la hoja de impresión y la vista previa sale bien. **Mira Orión**, que es el de más texto.
4. `/en/interests/` enseña los mismos 24 en inglés.
5. `/es/sitio-tranquilo/`: los 6 vídeos se reproducen al pulsar y los 8 sonidos suenan.
6. La música abre abajo a la derecha y suenan las 24.
7. `/es/recursos/juegos/coleccion/sueno/` sale con sus 10 juegos y 13 pestañas.
8. En ninguna página aparece PT-BR.

## Lo que no va en este paquete

Los 46 vídeos archivados de «Tus intereses» siguen en `catalogo.json` y `catalogue.json` por si van a la videoteca, pero ninguna página los lee.
