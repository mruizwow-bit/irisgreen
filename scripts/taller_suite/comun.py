"""Textos comunes de la suite creativa del Taller (R43). Cada clave existe en los dos idiomas."""

T = {
    'es': {
        'workshop': 'El taller',
        'whatYouMake': 'Qué puedes crear aquí',
        'howTitle': 'Cómo se usa',
        'noJs': 'Este estudio es una herramienta interactiva y necesita JavaScript. Debajo tienes la explicación completa de cómo funciona y qué se aprende.',
        'filesTitle': 'Tu trabajo y tus archivos',
        'filesText': 'Lo que haces se queda en esta pestaña del navegador. No se envía a ningún sitio y el taller no lo guarda en el navegador.\n\nPara conservarlo, abre Archivo y pulsa «Guardar proyecto»: se descarga un archivo a tu dispositivo. Para seguir otro día, abre Archivo, pulsa «Abrir…» y elige ese archivo. Las exportaciones (imágenes, sonido, modelos 3D, juegos) también son archivos que descargas tú.',
        'linksTitle': 'Sigue por aquí',
        'librariesTitle': 'Cómo está hecho',
        'librariesText': 'Las bibliotecas se sirven desde irisgreen.eu, sin servicios externos, y solo se cargan en el estudio que las usa. Licencias: {licences}.',
        'licencesLink': 'lista completa de licencias',
        'canvasRole': 'lienzo',
    },
    'en': {
        'workshop': 'The workshop',
        'whatYouMake': 'What you can make here',
        'howTitle': 'How it works',
        'noJs': 'This studio is an interactive tool and needs JavaScript. Below you will find the full explanation of how it works and what you learn.',
        'filesTitle': 'Your work and your files',
        'filesText': 'What you make stays in this browser tab. It is not sent anywhere and the workshop does not store it in the browser.\n\nTo keep it, open File and press “Save project”: a file downloads to your device. To carry on another day, open File, press “Open…” and choose that file. Exports (images, sound, 3D models, games) are also files that you download yourself.',
        'linksTitle': 'Keep going',
        'librariesTitle': 'How it is made',
        'librariesText': 'Libraries are served from irisgreen.eu, with no outside services, and they only load in the studio that uses them. Licences: {licences}.',
        'licencesLink': 'full list of licences',
        'canvasRole': 'canvas',
    },
}

assert set(T['es']) == set(T['en'])
