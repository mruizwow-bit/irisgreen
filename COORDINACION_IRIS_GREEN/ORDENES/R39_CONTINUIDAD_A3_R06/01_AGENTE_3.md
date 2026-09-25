# R39-A3-CONTINUIDAD-R06 · Agente 3 asume los pendientes de Codex

Fecha: 25/09/2026. Responsable operativo: **Agente 3**. Autoridad: orden directa de María en el chat de A2: «Codex esta inoperativo ahora, ponlo todo para agente 3».

Estado al emitir: **REASIGNADA_POR_MARIA_PENDIENTE_ACUSE_A3**. Publicar esta orden no acredita que A3 la haya leído, iniciado o terminado. La indisponibilidad de Codex es comunicada por María; no se ha investigado una incidencia del proveedor.

## Reparto que sustituye

El agente 3 asume conjuntamente sus comprobaciones pendientes y **toda la continuidad técnica pendiente que estaba asignada a Codex en Sabik/Cloud**: correlación HTTP real, reproducción y corrección de defectos, composición/integración común, pruebas y entrega verificable. No esperar a Codex ni devolverle estos trabajos para poder continuar.

Esta reasignación sustituye, para ese alcance, las menciones previas a «Codex único integrador», «A3 solo comprueba», «A3 no modifica el panel de Codex» y los handoffs pendientes a Codex en #237 y PR #244. A3 puede corregir el código existente que resulte necesario, incluido el panel, sin reconstruir ni rediseñar el producto. El trabajo entregado por Codex se conserva como base, no se descarta por su indisponibilidad.

María/A2 conservan la rama y publicación de la web, sus subidas y WEB-CONTENIDO-R02. Design y el trabajo local de voz no se reasignan. La dependencia puntual de regeneración de Investigación que WEB-CONTENIDO-R02 dirigía a Codex pasa a A3 cuando A2 documente que es necesaria; esto no transfiere a A3 la revisión editorial completa ni autoriza tocar contenido ajeno. No reabrir entregas auxiliares ya cerradas. El retorno de Codex no revierte automáticamente este reparto: cualquier cambio posterior se registra para evitar dos integradores simultáneos.

## Identidad de partida verificada al emitir

- Repositorio: `mruizwow-bit/irisgreen`.
- PR web: **#244**, abierto y borrador.
- Rama web: `agent2/sabik-iris-r08-20260924`.
- HEAD web: **`82106c874f5e4b612cdb68292b3c3115e040fea6`**.
- Preview de conexión registrado: **`6ab5fd0246e4910008d918a2`**.
- Único origen web autorizado: **https://deploy-preview-244--irisgreen-home.netlify.app**.
- ES: https://deploy-preview-244--irisgreen-home.netlify.app/ .
- EN: https://deploy-preview-244--irisgreen-home.netlify.app/?lang=en .
- Cloud autorizado existente: **https://6ab56a1ba2f6d83e6fb7b408--sabik-asistente.netlify.app**.
- HEAD Cloud según entrega R04: `16f1134e56292ca2ee600e77e69012c494f39aaf`; consultar `../../EVIDENCIAS/R39_CODEX_R04_ACTIVACION/INFORME.md` y confirmar identidad antes de escribir.
- Coordinación base de esta reasignación: `03609fbdd0ccc7571ff5b777204beadc055cc857`.

Antes de escribir o probar, confirmar HEAD/deploy actuales y cambios concurrentes. Si han avanzado, conservarlos; no restaurar d525843, main u otra base antigua. Leer `../../MEMORIA/WEB_A2_R23_CONEXION_R05_20260925.md` y la entrega #237, comentario `5826899869`.

## Trabajo ya hecho: no repetir ni volver a encargar

A2 ya aplicó el parche exacto de activación y máximo/ayuda de 300 caracteres ES/EN en tres archivos. El build y el montaje pasaron en run `36095903893`, job `107948008609`; artefacto `10847097560`, SHA-256 `fd7aa1a177ba86c3078956829f31c3a69c52715b21b255b9fbe2a02ecae35dd5`. Hay 36 casos de montaje, 12 de Recursos y cuatro de formulario entre los anteriores. Esto es evidencia registrada del montaje, no una ejecución nueva de A3.

R23 corrigió las pruebas antiguas sin cambiar el producto. El montaje, los masters, la cabecera, Lectura y los accesos existentes se conservan. No repetir auditoría global ni teclado/Lectura/móvil completos; repetir solo una regresión de la superficie que A3 cambie.

No está acreditada todavía una consulta real: `query_submitted=false` y `http_retrieval_verified=false` en la entrega A2. READY y enabled=true no prueban respuesta HTTP.

## Ejecutar hasta resolver o documentar un bloqueo concreto

1. Registrar acuse en #237, HEAD real y archivos reservados. Recuperar las piezas de Codex ya entregadas, distinguiendo código fuente, paquete, despliegue y pruebas. No crear otro motor, loader, bootstrap, biblioteca, agrupador o transporte paralelo.
2. Comprobar desde el origen web autorizado los cinco casos pendientes, en ES y EN según corresponda:
   - Consulta real con resultados y fuentes: títulos/enlaces, extractos, fragment IDs y versión conservados; sin convertir búsqueda documental en respuesta de IA ni diagnóstico.
   - Consulta real sin resultados: estado vacío claro y recuperación posible.
   - Cancelación y sustitución: cancelar una petición, iniciar otra y demostrar que las respuestas anteriores no reaparecen ni sustituyen la nueva.
   - Error y timeout recuperables: provocar de forma controlada y autorizada el fallo pertinente y comprobar recuperación. Separar pruebas de fallos inducidos, pruebas unitarias y tráfico real; una respuesta fabricada no acredita conexión.
   - UI inglesa con citas originales españolas: `lang=es` en los elementos pertinentes, sin traducción silenciosa de las citas ni afirmación de corpus inglés.
3. Asumir también la comprobación antes reservada a Codex: correlacionar la acción del formulario con la petición/respuesta de la aplicación real, identidad de código/runtime y biblioteca. Registrar estado HTTP y metadatos no sensibles del contrato, no solo el estado READY ni un 200 de una página de login. Distinguir navegador, transporte autorizado, Function y lectura cross-deploy del corpus sellado.
4. Ante un defecto reproducible, corregir el incremento mínimo sobre la implementación vigente y añadir una prueba que falle antes y pase después. A3 asume la integración común y los cambios mínimos necesarios de entrypoint/package/lock/configuración antes reservados a Codex. No cambiar ranking, corpus, proveedor, modelo ni arquitectura por iniciativa propia.
5. Correcciones frontend: entregar a A2 un delta mínimo con base, HEAD, archivos, hashes y pruebas sobre el HEAD web vigente. A2 conserva la integración/publicación en su rama; A3 no empuja encima ni restaura la web. Esto no impide que A3 prepare y pruebe la corrección en una rama propia.
6. Correcciones Cloud: reutilizar el candidato existente y las autorizaciones privadas de R04. Solo si existe un defecto corregido que requiera despliegue, preparar un único candidato privado justificado del código corregido, conservando los anteriores y la biblioteca sellada. A3 asume la responsabilidad técnica antes atribuida a Codex; no crear otro proyecto, una cadena de drafts equivalentes ni un mecanismo de autenticación alternativo. Si cambia el origen Cloud, documentar el delta mínimo para A2 antes de afirmar que la web consume la corrección.
7. Verificar el incremento y devolver una entrega final con evidencia, no solo un informe de fallos ni una petición de que Codex termine la integración. Si falta acceso o un artefacto concreto no recuperable, identificar una sola acción o dato externo necesario y continuar las partes independientes; no convertir la indisponibilidad de Codex en un bloqueo general.

## Acceso y privacidad

María ya confirmó que su acceso funciona. No pedir una nueva autorización genérica ni investigar otra vez login. Usar solo herramientas y sesiones expresamente autorizadas; no leer/exportar cookies, tokens o credenciales ni automatizar una vía rechazada. No repetir sondas idénticas que ya devolvieron 401. La ausencia de una sesión legítima en las herramientas de A3 se documenta como límite del entorno, no como prueba de que el acceso de María falla.

Conservar Team Login, secretos del servidor, contratos de cuerpo, límites, cancelación y limpieza de recursos. No registrar consultas privadas, datos personales, stacks sensibles o biometría. No afirmar retención/borrado más allá de las evidencias existentes de C17 ni reabrirlo como auditoría general.

## Requisitos incorporados: ES/EN y superficie accesible

Aplicar `../../NORMATIVA/REQUISITOS_OPERATIVOS_ES_EN.md`. Todo texto público modificado, incluidos labels/ARIA, estados, errores, ayudas y alternativas, debe estar completo en español e inglés con comportamiento equivalente. Corpus N04 y citas españolas intactos; no inventar cobertura inglesa.

Preservar la web Iris Green, Newsreader/Atkinson, cabecera, navegación y panel Lectura. En la superficie afectada: HTML semántico, controles nativos, teclado, foco visible/no oculto, nombres accesibles, orden de lectura, reflujo y ampliación; anuncios claros sin repetición innecesaria. Respetar reduced motion, los cinco estados B3 y masters vigentes. No nuevos estados, anillos, spinner insistente, reproducción automática, micrófono o activación de voz. Lenguaje claro, no infantilizante y sin diagnósticos.

La reasignación cambia responsabilidad operativa, no los requisitos normativos ni su aplicabilidad. No hay nueva certificación WCAG/ISO/EN ni autorización de producción. No editar normativa histórica para reflejar un simple cambio de responsable.

## Entrega y cierre

Publicar en #237 y enlazar desde PR #244: orden/acuse, base y HEAD reales, archivos cambiados, pruebas ejecutadas y resultados, identidad del deploy utilizado, origen web/Cloud, matriz de los cinco casos y correlación HTTP. Registrar Memoria y Control por ID sobre la versión vigente, sin sustituir originales históricos. Una corrección que llegue a A2 lleva parche aplicable y prueba; no solo instrucciones vagas.

Estados separados: reasignado, recibido, en ejecución, corregido, integrado, verificado o bloqueo concreto. No marcar recepción por emitir una orden. Declarar **MONTADO_CONECTADO_REAL** únicamente cuando la evidencia conjunta lo permita; hasta entonces conservar los pendientes que falten. Los gates generales de almacenamiento/CSP/publicación, ayudas técnicas y aceptación humana no se cierran por este trabajo.

## Exclusiones que permanecen

Sin merge main, producción, DNS, apertura pública, cambios de Team Login/secretos, nueva biblioteca, alteración de corpus/ranking, `/api/chat`, proveedor/embeddings, voz ni rediseño de Motion. No absorber toda la auditoría editorial WEB-CONTENIDO-R02 ni el trabajo de Design. Esta orden reúne los pendientes de A3 y Codex para evitar esperas y duplicaciones, no rehace el proyecto.
