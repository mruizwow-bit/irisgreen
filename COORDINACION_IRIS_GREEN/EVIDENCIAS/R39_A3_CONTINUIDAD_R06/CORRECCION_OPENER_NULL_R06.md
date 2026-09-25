# R39-A3-CONTINUIDAD-R06 · corrección opener-null · estado 25/09/2026

Estado: `CORREGIDO_CODE_CI_PASS · DEPLOY_PRIVADO_R06_PENDIENTE_ACCION_LOCAL`

## Defecto reproducido con sesión humana real

María reprodujo dos veces desde el origen autorizado de PR #244:

- página Cloud privada cargada;
- `N04_WEB_ALLOWED_ORIGIN` correcto;
- scripts presentes;
- `window.opener === null`;
- la conexión permanece en «Conectando con Iris Green…».

El segundo intento se hizo después de cerrar únicamente la ventana Cloud y volver a enviar desde la web ya autenticada. `opener` siguió siendo `NULL`. Se clasifica como defecto persistente del transporte R04.

## Corrección R06

Rama Cloud:
`agent3/r39-r06-opener-fix-20260925`

Base exacta:
`16f1134e56292ca2ee600e77e69012c494f39aaf`

HEAD limpio final:
`8690e26140f6d513c3592df62bc82b167cbb1d0e`

Tree:
`d257910de08519359d805b1f0b53599595174bdb`

PR draft:
#246

Diff contra base: únicamente cinco rutas:
- `cloud/n04-r38-library/src/cloud-connection.mjs`
- `cloud/n04-r38-library/src/team-transport-handler.mjs`
- `sabik/AUTHORIZED_TRANSPORT_R04.md`
- `sabik/authorized-transport.mjs`
- `tools/test-sabik-authorized-transport.mjs`

El workflow temporal usado para QA fue restaurado al blob original `2cbc04a70dba5f056ce782b11d45c89fd642a190`; no forma parte del diff final.

### Cambio funcional
- web: popup/opener → iframe oculto + MessageChannel;
- Cloud: `window.parent` como peer cuando `opener` es nulo;
- `/sabik-connect`: sin X-Frame-Options DENY, pero CSP `frame-ancestors` limitado al origen exacto ya validado;
- Team Login, endpoints, secreto QA server-side, R38, corpus, ranking, bridge, panel y Motion permanecen intactos.

## QA Cloud exacta

Run GitHub Actions:
`36100865590`

Matriz:
- Node 22.16.0: SUCCESS
- Node 24.19.0: SUCCESS

En ambos:
- regresión opener-null: SUCCESS;
- suite Cloud: SUCCESS;
- `npm test`: 177/177, 0 FAIL;
- build Cloud: SUCCESS;
- syntax checks: SUCCESS.

Build Node24:
- source dirty: false;
- biblioteca sellada: `6ab4c1a15435b93043ab3f6d`;
- corpus SHA-256: `56f72c4d3959a67d99d3a90f6dce20558498c4cd7604472d9a7c67147404c41e`;
- library writes: 0.

## Delta web A2

Rama:
`agent3/r39-r06-web-delta-20260925`

Base exacta A2:
`82106c874f5e4b612cdb68292b3c3115e040fea6`

HEAD:
`0b96baec83e96c34f39200993260d366d496a0a3`

PR draft:
#245

Diff: solo `sabik/authorized-transport.mjs`.

Workflow A2:
`Iris Green y Sabik R08` run `36100265218` → SUCCESS.

Artifact:
- ID `10849206868`
- SHA-256 `9b2515e7a31e2eb6d20167c5ffabf353bc18b555f9acecae4338a3ca9e1a6056`

No merge.

## Intento de deploy R06 desde Actions

Se preparó un runner temporal aislado para desplegar el HEAD exacto `8690e261...` mediante Netlify CLI, sin `--prod`.

Run:
`36101218660`

El primer paso exige que exista `NETLIFY_AUTH_TOKEN` antes de cualquier acción Netlify.

Resultado:
`FAIL antes de checkout/deploy` porque el secreto no está disponible en GitHub Actions.

Por tanto:
- deploys creados: 0;
- variables modificadas: 0;
- Team Login modificado: 0;
- producción: 0.

El workflow temporal se restauró al blob original.

## Única acción externa pendiente

Usar la sesión local de Netlify CLI ya autorizada para `sabik-asistente` y desplegar **exactamente** el HEAD R06 `8690e26140f6d513c3592df62bc82b167cbb1d0e` como draft/no producción, desde `cloud/n04-r38-library`, sin cambiar variables, secretos ni Team Login.

Comandos:

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

**No usar `--prod`.**

Devolver únicamente el nuevo deploy ID/origin. A3 verificará el deploy/digests y preparará entonces el delta final A2 de:
1. `sabik/authorized-transport.mjs`;
2. `sabik/mount-config.mjs` con el nuevo Cloud origin.

Después se repiten únicamente los cinco casos reales pendientes.

No `MONTADO_CONECTADO_REAL` todavía.
