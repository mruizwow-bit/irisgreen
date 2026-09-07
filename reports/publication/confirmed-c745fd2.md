# Publicación confirmada en irisgreen.eu

## Estado actual
La versión de `main` `c745fd250819dda04caec1f67b489e958c90a71f` está publicada. Netlify identifica como producción actual el despliegue `6a9e9ae69b9c6f0008b75690`, estado `ready`, publicado el 7 de septiembre de 2026 a las 11:07:50 UTC, sin error.

La ejecución de comprobación externa **34115843181** terminó correctamente. A las **11:17:27 UTC** consultó el dominio público por HTTPS y obtuvo:

- Inicio, Libros y Condiciones: HTTP 200, con los marcadores de la versión corregida. Inicio incluye el mensaje de los libros y el controlador de preferencias, sin el empaquetado anterior.
- Las dos portadas: HTTP 200, `image/webp`, con huellas SHA-256 idénticas a los archivos de main. Luma: 25.256 bytes; Autismo: 22.168 bytes.
- `preferencias-lectura.js`, `musica.js` y una miniatura de YouTube: HTTP 200 y huellas idénticas a main.
- Sitemap: HTTP 200, XML válido.
- `/reports/routes/build.json`: HTTP 404, correctamente fuera de los archivos publicados.

La lectura del estado de Netlify y la respuesta real del dominio son comprobaciones distintas; ambas confirman esta publicación. Ya no es correcto decir que todo continúa únicamente en borrador o que el dominio sigue mostrando la versión anterior.

## Portadas y pruebas de la versión publicada
Las dos imágenes proceden exclusivamente de las cubiertas delanteras de los PDF aportados por la autora. No se publicaron los PDF de imprenta ni se regeneraron las ilustraciones. Luma conserva 512×512 píxeles; Autismo 512×725. En la ejecución 34114414346 pasan seis casos de Libros (escritorio, 390 y 320 píxeles, ES/EN), con imágenes cargadas y sin deformación o desbordamiento. El registro de origen y los resultados están en main, en `reports/books/portadas-origen.json` y `portadas-tests.json`.

Se conserva la implementación que llegó primero a main. La propuesta #4, que aportaba una implementación equivalente, se cerró sin fusionar ni reemplazar las portadas publicadas.

## Bloqueo corregido y límites
El generador `repair_routes.py` rechazaba la tabla `build.environment` después de fijar Python 3.12. La versión publicada reconoce y conserva esas variables y mantiene la comprobación de configuración. La generación vuelve a finalizar correctamente.

Esta confirmación publica las correcciones ya incorporadas y las portadas; no certifica cada interacción, los precios de tiendas, la reproducción de todos los vídeos externos, accesibilidad completa ni la validación documental de todas las fichas. Temas, fondo opaco, guía sin ratón y voz avanzada siguen siendo siguientes ampliaciones.

Evidencia externa: artefacto `portadas-publicacion-confirmada`, ID 10016196257. `published_version_confirmed=true`; `working_report_not_public=true`.
