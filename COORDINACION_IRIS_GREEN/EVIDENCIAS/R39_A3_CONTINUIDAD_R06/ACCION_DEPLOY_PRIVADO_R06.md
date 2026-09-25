# R39-A3-R06 · acción externa única de despliegue privado

## Objetivo
Crear un único draft privado nuevo de `sabik-asistente` desde el HEAD probado:

`8690e26140f6d513c3592df62bc82b167cbb1d0e`

## Condiciones
- usar la sesión local Netlify CLI ya autorizada;
- mismo site `47b06e68-ff54-4097-8ad8-336b2d71758a`;
- **sin `--prod`**;
- no cambiar Team Login;
- no crear/rotar secretos;
- no cambiar variables;
- no DNS;
- no publicar.

## Comandos
```bash
git fetch origin
git checkout 8690e26140f6d513c3592df62bc82b167cbb1d0e
cd cloud/n04-r38-library
npm ci --ignore-scripts
node --test ../../tools/test-sabik-authorized-transport.mjs
npm test
npm run build
./node_modules/.bin/netlify deploy --no-build --dir dist --site 47b06e68-ff54-4097-8ad8-336b2d71758a --message "R39 R06 opener-null fix 8690e261" --json
```

## Devolver a A3
Solo:
- deploy ID;
- deploy HTTPS URL/origin;
- confirmación `draft / no production`.

No enviar tokens, cookies, Authorization, variables ni la clave QA.
