# R39-A5 Â· MEMORY / CONTROL DELTA

- **ID:** DEC-119 / R39-A5 / runtime-cloud.
- **Autoridad viva:** issue #237. El reparto vigente del issue anula el subproyecto histÃ³rico `cloud/n04-r39-retrieval/`; no se creÃ³ ningÃºn loader/bootstrap alternativo.
- **ImplementaciÃ³n A5:** branch `agent5/r39-a5-runtime-20260924`, HEAD `de31ae038f2496e4644356404535105d41b208c2`, tree `47581b6fad769e35187a92cfe38b4cea6edf3a28`.
- **Contrato:** `createR39RuntimeTransport` reutiliza `createSabikRetrievalForDeployment` y fija la biblioteca sellada R38 `6ab4c1a15435b93043ab3f6d`; ningÃºn campo del body puede seleccionar despliegue.
- **Prueba A5:** Node `v22.16.0`, 6/6 unit tests PASS. El gate de runtime da `A5_READY_CODEX_INTEGRATION_PENDING`; en `--strict` falla hasta que Codex monte Function y procedencia de build.
- **Node 24:** Netlify confirma que la Function R38 existente usa `nodejs24.x` en `us-east-2`; no se atribuye esa ejecuciÃ³n al cÃ³digo R39/A5 todavÃ­a.
- **Pendiente de Codex:** wiring de Function/handler, hash de mÃ³dulos R39 en `scripts/build.mjs`, ejecuciÃ³n integrada Node22 y draft Node24.
- **SeparaciÃ³n de evidencias:** SDK/Blobs != HTTP autenticado. C17 continÃºa PENDING.
- **Prohibiciones preservadas:** no deploy A5, no site vars/secrets, no Team Login/DNS, no rama del agente 2, no provider/model/embeddings, no `/api/chat`, no conversaciÃ³n/perfiles.
