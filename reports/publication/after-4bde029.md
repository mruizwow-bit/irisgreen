# Incorporación a main y comprobación del alojamiento

La propuesta #2 se incorporó a `main` en el commit `4bde029bc84f2da2db27547d8d681d75e97b7a6b`, el 7 de septiembre de 2026 a las 10:16:16 UTC. La usuaria autorizó publicar las tandas probadas para comprobarlas en la web vinculada.

La versión anterior se conserva en `respaldo/antes-publicacion-2026-09-07`, commit `12fcdcd74ab4e0fcc6164ca75253bf9dab41f1db`.

La comprobación previa 34110220577 terminó correctamente: generación de dist, exclusión de archivos de trabajo, filtros/listados, preferencias y miniaturas. El único cambio de configuración posterior fue fijar Python 3.12 para la generación en Netlify. Los temas, fondo opaco, guía nueva, vista centrada y voz avanzada no forman parte de esta publicación.

## Verificación pública posterior
La ejecución 34110808277 consultó irisgreen.eu desde GitHub Actions cuatro veces entre 10:19:17 y 10:20:18 UTC. No modificó el alojamiento. El resultado HTTP más reciente fue:

- Inicio: 200; todavía contiene el empaquetado antiguo, sin `ig-books-message` ni referencia a `preferencias-lectura.js`.
- Condiciones: 200; no contiene el marcador del catálogo compartido de la versión incorporada.
- Lectura accesible: 200; no contiene la explicación nueva de tipografía y anchura.
- `/assets/preferencias-lectura.js`: 404.
- `/assets/musica.js`: 200, pero su huella no coincide con el archivo incorporado a main.
- `/assets/video-thumbnails/74KDFWp1jK8.jpg`: 404.
- Sitemap: 200, XML interpretable.
- `/reports/routes/build.json`: 404; no se está exponiendo este informe de trabajo.

Por tanto, está confirmada la incorporación a main, pero NO la publicación de esa versión en el dominio durante este intervalo. No se ha determinado si hay un despliegue pendiente, detenido, fallido o una configuración de conexión diferente. El siguiente diagnóstico corresponde al estado y registro de despliegue de Netlify; no procede seguir reescribiendo los controles para resolver una publicación no confirmada.

Evidencia: artefacto `comprobacion-web-publicada`, ID 10014290500, ejecución 34110808277. La conexión de Netlify se ha ofrecido para poder consultar el alojamiento sin pedir claves o tokens en el chat.
