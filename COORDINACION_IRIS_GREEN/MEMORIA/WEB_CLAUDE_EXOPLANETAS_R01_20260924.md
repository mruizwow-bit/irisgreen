# WEB-CLAUDE · Tus intereses · Exoplanetas · R01

Fecha: 24/09/2026
Responsable: Claude (Cowork), por encargo directo de María («siguiente»: el siguiente interés del grupo 1, El cielo y el espacio, del plan de Taller e Intereses).
Carril: Tus intereses ES/EN. No toca Rincón, Juegos, Rutinas, Taller, Sabik, Cloud ni Design.

## Base y HEAD

- Base real: `main` `117a53a01bf254054f759e7e08eb06ba06f00d00` (#242, que ya integra la entrega R01 de Taller, Intereses, Cielo nocturno y Sistema solar).
- Commit local de la entrega, sin subir: `ba9b725646faba16d7392149e55275c5a35e2d97`, tree `79b4b2e583bbe18d676a4151e90b986c80e4dab1`.
- ZIP para subir: `IRIS_INTERESES_EXOPLANETAS_ES_EN_PARA_SUBIR.zip`, 11 archivos. SHA-256 en `EVIDENCIAS/WEB_CLAUDE_EXOPLANETAS_R01/MANIFEST_SHA256.txt`.
- Solo cambian dos archivos existentes, `es/intereses/index.html` y `en/interests/index.html`: se les añade la tarjeta «Exoplanetas» en «Intereses a fondo». Por lo demás, son idénticos a los de main.

## Qué contiene

- `/es/intereses/exoplanetas/` y `/en/interests/exoplanets/`:
  - **Mapa en 3D** con las 4.775 estrellas que tienen planetas confirmados, en su dirección y distancia reales. El Sol está en el centro, y cada estrella lleva el color que corresponde a su temperatura.
  - Círculos de 10 a 10.000 años luz en el plano de la Vía Láctea y una línea hacia su centro.
  - Vista con distancia comprimida y vista con distancia real.
  - Buscador y filtros: por método, descubiertos desde España o con nombre propio.
  - «Descubiertas hasta el año…» y la reproducción año a año, que solo empieza si la persona la pone en marcha.
  - Teclado, botones para girar y acercar, «Guardar imagen» con marca de agua y pantalla completa.
  - **Qué estás viendo**: datos de la estrella, dibujo del sistema con las órbitas a escala y la zona templada aproximada, y tabla de planetas.
  - **Secciones**: cómo se descubren (11 métodos, con dibujos), año a año (gráfico y tabla), récords, parecidos a la Tierra, 15 sistemas que hay que conocer, descubiertos desde España (70 planetas), 164 nombres propios IAU (con Cervantes, Rosalíadecastro, Gar y Filetdor), estrellas con planetas visibles a simple vista (107) y el buscador de los 6.366 planetas.
  - **Mi colección** (localStorage, con borrado con confirmación y archivo con marca de agua) y **fuentes**.
- `/es/intereses/exoplanetas/lista/` y `/en/interests/exoplanets/list/`: la lista completa en HTML, que se lee sin JavaScript.
- `exoplanetas.json`: descargable con marca IRIS GREEN · irisgreen.eu.
- `/assets/ig-exoplanetas-3d.js`: three.js 0.186.0 (MIT) autoalojado.
- `/assets/ig-exoplanetas.js` y `/assets/ig-exoplanetas.css`.

## Datos

- **NASA Exoplanet Archive**, tabla PSCompPars, consultada el 24/09/2026 (6.366 planetas y 4.775 estrellas). Uso libre con el reconocimiento que pide el archivo, que se cita en la página.
  - El entorno en la nube no llega a ese servidor. La tabla se consultó con el navegador del ordenador de María, con su permiso, y se guardó como `pscomppars_2026-09-24.tsv`. No se usó ningún servicio intermedio.
- **Nombres propios**: tabla de Wikipedia (CC BY-SA 4.0), comprobada con la lista oficial de estrellas de la IAU.
  - 162 de 164 estrellas coinciden tal cual. En las otras 2 solo cambiaba un acento, y se usa la grafía de la IAU.
  - Hay 161 planetas enlazados con la tabla de la NASA. 42 Draconis b, 55 Cancri h y Fomalhaut b no están en la lista actual de confirmados, y así se indica en la página.
- **Constelaciones**: límites oficiales de la IAU, con el mismo algoritmo que Cielo nocturno.
- **Textos**: redacción propia en español y traducción propia al inglés. Cada cifra de los textos se comprobó con la tabla, por ejemplo la luz que recibe Próxima b o los años luz a los que están TRAPPIST-1, Teegarden y Barnard. Se corrigieron cinco frases que no cuadraban con los datos.

## Normativa aplicada (sin afirmar conformidad legal)

- WCAG 2.2 AA / ISO/IEC 40500 como objetivo técnico.
- EN 301 549 V4.1.1 como objetivo técnico; V3.2.1 sigue siendo la referencia jurídica.
- ISO 24495-1, COGA y RGPD: Mi colección no envía datos.
- Los dibujos de los métodos son esquemas decorativos que acompañan a un texto equivalente.
- Los gráficos tienen título y una tabla alternativa.
- No hay imágenes inventadas de exoplanetas: los sistemas se dibujan con sus datos.

## Pruebas (sobre main 117a53a0 + esta entrega)

- **Build y datos**:
  - `scripts/build_site.py` correcto (2.165 archivos públicos).
  - `prepare_initial_data.py --check` correcto.
- **Accesibilidad (axe)**:
  - Exoplanetas ES/EN en 1440, 390 y 320 px: 0 incidencias.
  - Lista completa ES: 0 incidencias.
  - Tus intereses ES/EN: 0 incidencias.
- **Presentación**:
  - Sin desplazamiento horizontal a 320 px.
  - Espaciado de texto sin recortes.
  - Lectura con texto ampliado y más contraste, en 1440 y 320 px.
  - Colores forzados y movimiento reducido.
- **Sin JavaScript**: se leen 20 tablas, 15 fichas y la lista completa (6.366 filas).
- **Funciones**:
  - Buscador del mapa: «Riosar» lleva a Rosalíadecastro.
  - Filtros: España muestra 58 estrellas y «hasta 2000» muestra 39.
  - La reproducción año a año funciona y se puede parar.
  - «Guardar imagen» descarga la imagen.
  - Buscador de la tabla.
  - Mi colección se mantiene tras recargar y se borra.
- **Inglés**: revisión sin español en la página inglesa, salvo nombres propios.
- **Capturas**: escritorio y móvil, ES y EN.

## Estado y límites

- ENTREGADA_CON_CODIGO. Falta que María lo suba y se revise en un dispositivo con WebGL real.
- Sin merge, deploy ni publicación por parte de Claude. La sesión no tiene escritura en GitHub.
- WebGL por software en las pruebas.
- La lista completa pesa 1,2 MB (unos 170 kB comprimida).
- Queda en Descargas de María una carpeta vacía, `iris-exoplanetas`, de un intento de descarga que el navegador integrado no completó. No se ha borrado porque la sesión no tiene permiso de borrado.
