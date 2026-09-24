# Escenas 3D del Rincón tranquilo

Código fuente de `assets/rincon-escenas-3d.js` (acuario, tubo de burbujas y pausa guiada).
Usa three.js 0.186.0 (licencia MIT, incluida al final del archivo generado).

Para regenerar el archivo:

    npm install three@0.186.0 esbuild
    npx esbuild tools/escenas-3d/src/index.js --bundle --minify --format=iife --target=es2019 --legal-comments=eof --outfile=assets/rincon-escenas-3d.js
