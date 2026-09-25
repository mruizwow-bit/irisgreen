# R39-A3-CONTINUIDAD-R06 · ejecución parcial verificable · 25/09/2026

Estado: `EN_EJECUCION · BLOQUEO_PUNTUAL_SESION_HTTP_AUTENTICADA`

## Identidad actual confirmada

### Web
- PR #244
- branch: `agent2/sabik-iris-r08-20260924`
- HEAD: `82106c874f5e4b612cdb68292b3c3115e040fea6`
- deploy: `6ab5fd0246e4910008d918a2`
- alias autorizado: `https://deploy-preview-244--irisgreen-home.netlify.app`
- ES: `/`
- EN: `/?lang=en`
- montaje: `connectionConfig.enabled=true`
- Cloud origin configurado: `https://6ab56a1ba2f6d83e6fb7b408--sabik-asistente.netlify.app`
- límite UI: 300 caracteres ES/EN

### Cloud
- deploy: `6ab56a1ba2f6d83e6fb7b408`
- source HEAD: `16f1134e56292ca2ee600e77e69012c494f39aaf`
- biblioteca sellada fijada: `6ab4c1a15435b93043ab3f6d`
- Function `n04-library-qa`: Node24, digest `abbc2f3a8eac8478aa2d33530b5615c3e7cbdc944498dc57079bdb2774507724`
- Function `n04-team-transport`: Node24, digest `130cb0fd60e6e73a098652d40660555b98e017a0ebdf03dc3cbcaa9fa4f774b3`
- rutas: `/internal/n04/library/search`, `/sabik-connect`, `/internal/n04/team/search`
- Edge Functions: 0

Los dos digests observados hoy en Netlify coinciden exactamente con `PACKAGE_AUDIT.json` de la activación R04.

## Correlación de código comprobada

`n04-team-transport` reutiliza `n04-library-qa`; no contiene otro motor.  
`n04-library-qa` crea `createSabikRetrievalForDeployment({libraryDeployId: LIBRARY_DEPLOY_ID})`.  
`LIBRARY_DEPLOY_ID` sigue fijado a `6ab4c1a15435b93043ab3f6d`.

El build genera `dist/sabik-connect.mjs` copiando `src/cloud-connection.mjs`; por tanto la referencia HTML `/sabik-connect.mjs` no es un asset perdido.

La Function valida `context.deploy.context === 'deploy-preview'` y `context.deploy.published === false`; ambas propiedades pertenecen al contrato actual de Context de Netlify Functions. No se ha modificado ese control.

## Frontend comprobado

- transporte autorizado exacto, sin credenciales en cliente;
- bridge valida procedencia del cuerpo, biblioteca, corpus, source blob, URLs y IDs;
- agrupación A1 preservada;
- panel conserva fragmentos/versión internamente;
- metadatos técnicos no se imprimen como texto público;
- citas y enlace fuente llevan `lang=es`;
- `REQUEST_CANCELLED` y `REQUEST_TIMEOUT` están diferenciados en la frontera;
- UI ES/EN y límite 300 alineados.

No se ha reproducido un defecto que justifique reservar o editar archivos de producto.

## Lo que NO puede acreditar este entorno

A3 no dispone de la sesión Team Login del navegador de María y las herramientas disponibles no exponen una acción para invocar la Function ni leer sus logs. El navegador de consulta y el contenedor tampoco pueden abrir/resolver directamente los previews. Repetir un cliente anónimo equivaldría a la sonda 401 ya prohibida por R06.

Por ello permanecen pendientes **solo en ejecución real autenticada**:

1. resultados + fuentes;
2. cero resultados;
3. cancelación + sustitución sin stale result;
4. error/timeout recuperable;
5. UI EN con citas ES `lang=es`;
6. correlación HTTP real: status JSON, `X-Sabik-Code-Head`, `X-Sabik-Library-Deploy`.

## Única acción externa necesaria

Una persona ya autenticada con Team Login debe ejecutar la matriz R06 desde el alias web autorizado y devolver únicamente evidencia saneada. No exportar cookies, Authorization ni ninguna clave.

Para la correlación, en la ventana privada Cloud abierta por Sabik, tras una consulta sintética, se puede leer **solo**:

```js
({
  status: document.documentElement.dataset.n04Status || null,
  contentType: document.documentElement.dataset.n04ContentType || null,
  codeHead: document.documentElement.dataset.n04CodeHead || null,
  libraryDeploy: document.documentElement.dataset.n04LibraryDeploy || null
})
```

El marcador fue diseñado precisamente para QA privada y no contiene consulta, cuerpo ni credenciales.

## Cambios

- producto: 0
- web A2: 0
- Cloud: 0
- deploys: 0
- secretos/permisos/Team Login: 0

No PASS global. No `MONTADO_CONECTADO_REAL` hasta recibir la evidencia autenticada.
