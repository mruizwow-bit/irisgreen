# Portada y ficha aprobadas · Iris Green

La autora aprobó esta portada y la ficha de instrucciones el 9 de septiembre de 2026.
No es la propuesta verde anterior. Conserva los colores rosa/lila/azul, las fuentes
Newsreader y Atkinson Hyperlegible y el símbolo original de Iris Green.

## Fuentes de presentación

- `home-es.html`: portada con las doce secciones y buscador.
- `instructions-es.html`, `instructions-en.html`: la misma ficha, en ambos idiomas.
- `assets/navigation-approved.css` y `assets/navigation-approved.js`: estilos y
  comportamiento compartidos. Las adaptaciones aprobadas y el original de la ficha
  se conservan en el módulo; no se ha añadido una revisión clínica.

`build_site.py` ejecuta `build_approved_navigation.py` DESPUÉS de preparar `dist`.
Sustituye solo `index.html` y las dos rutas indicadas en `manifest.json`. Las
plantillas anteriores del repositorio siguen disponibles para los transformadores
históricos de Ayudas, miniaturas y rutas. Para editar la nueva portada se cambian
estas fuentes de presentación, no la antigua plantilla x-dc de `index.html`.

## Contratos que hay que conservar

El buscador carga `/buscador.json` mediante el motor común, no una copia del índice.
Los mensajes y búsquedas permanecen solo en memoria; no se envían ni se guardan.
Los borradores ES y EN no se traducen ni sobrescriben al cambiar de idioma.
Los ajustes utilizan el módulo existente y su clave `ig-a11y`. El reproductor es
el existente, con audio local y sin reproducción automática.

Las huellas de `manifest.json` protegen el TEXTO original de la ficha (no su
cabecera ni su formato). Si cambia, hay que revisar esta adaptación antes de
actualizar la huella. No se debe desactivar la comprobación para forzar un build.
Las fechas y las referencias pendientes de la fuente no son una validación nueva.

## Publicación y vuelta atrás

Construir con `python3 scripts/build_site.py` y comprobar con
`python3 scripts/build_approved_navigation.py --check`.
Las pruebas de navegador están en `scripts/test_approved_navigation.py`.
Para volver a la presentación anterior, revertir el commit de esta integración;
no hay que restaurar el catálogo, las traducciones ni los archivos multimedia.
