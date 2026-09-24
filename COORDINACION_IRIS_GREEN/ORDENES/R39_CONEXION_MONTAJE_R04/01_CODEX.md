# R39-CODEX-R04 · Conexión real y entrega para montaje

Fecha: 24/09/2026. Autoridad: María solicita las próximas órdenes tras la consulta de ejecución R03. Estado de emisión: EMITIDA_PENDIENTE_ACUSE. Responsable: Codex, integrador. Esta orden encarga el transporte autorizado que R03 deja pendiente; no reconstruye R03 ni modifica el cierre documental C17.

## Base que se conserva

Leer `../../EVIDENCIAS/R39_CODEX_R03/INFORME.md` y `sabik/RETRIEVAL_INTEGRATION.md` del código R03.
- Código: `codex/n04-retrieval-r39-20260924` @ `3131d55020057c55567a3457900afc888876de5d`, o su avance posterior verificado.
- Borrador Cloud: `6ab504fbf5d403147f6de213`, sitio `sabik-asistente`, ID `47b06e68-ff54-4097-8ad8-336b2d71758a`.
- Biblioteca R38: `6ab4c1a15435b93043ab3f6d`; 4.332 fragmentos/IDs, SHA256 `56f72c4d3959a67d99d3a90f6dce20558498c4cd7604472d9a7c67147404c41e`.

Hecho: lectura de body acotada, adaptador, agrupador A1, puente, panel corregido, cancelación, timeout, build y pruebas R03. NO volver a construirlos. A4/A5 alternativos no se incorporan. Codex conserva la propiedad del panel; A3 ahora comprueba su uso, no escribe una versión competidora.

## Resultado encargado

Una acción en el Sabik existente debe consultar por un transporte realmente autorizado y devolver fuentes verificables mediante la cadena existente: transporte → R39 → R38 → candidates/groups → panel. No basta con copiar el componente ni con inyectar una respuesta de prueba.

## Ejecución

1. Publicar en #237 HEAD actual y archivos mínimos reservados para el transporte y su integración. Leer la última base WEB-A2 del control: ya existe una entrega Recursos R05 posterior al Rincón. No utilizar automáticamente `38815375…` ni `7b3a927…` como base actual.
2. Resolver la acción existente A5-HTTP-ACTION-01 sobre el borrador R03. A5 ya documentó la limitación de sus herramientas: no pedirle otra investigación ni repetir el mismo 401. Coordinar una ejecución por una persona de equipo en su sesión legítima, utilizando la clave existente por su canal local seguro. No pedir claves/cookies en chat o Git. Si falta esa intervención, solicitar una sola acción concreta, con destino e instrucción exactos; mantener el resto del trabajo ejecutable.
3. Implementar únicamente `authorizedTransport`, que falta en R03, usando los mecanismos autorizados de la arquitectura existente. Conservar el contrato inyectado `query(request,{signal})` y la respuesta verificada del puente. No reimplementar búsqueda, grouping, validación de corpus o puntuaciones. El acceso manual de equipo demuestra QA; NO demuestra por sí mismo que exista transporte navegador-Cloud para el producto.
4. Documentar y probar la frontera de autenticación real del transporte. No exponer clave QA, cookie, token de equipo o credencial de servidor en JS, HTML, mapas fuente o storage del navegador. No convertir la ruta interna en API anónima, ni confiar en el cartel de mantenimiento como autenticación. Un proxy por sí solo no resuelve permisos. Cualquier cambio de acceso, nuevo secreto, proxy/endpoint no contemplado por la arquitectura vigente o permiso de plataforma requiere autorización específica: registrar ese único requisito, no aplicarlo implícitamente.
5. Preparar el delta mínimo para A2 sobre el HEAD que este confirme, preservando todas sus subidas. Reutilizar el bundle de puente/A1 y el panel de R03; generar otra versión solo si hay cambios reales. A2 es el único escritor del montaje web. No restaurar el sitio antiguo de la rama Cloud.
6. Reutilizar el despliegue R03 para comprobar lo ya desplegado. Si la corrección real del transporte exige otro artefacto Cloud, solo Codex puede preparar un borrador incremental en sabik-asistente, identificando antes HEAD, cambios y motivo; no otro draft equivalente para intentar salvar el login. El frontend se despliega por A2 dentro de su autorización vigente, nunca desde este carril.

## Cierre comprobable

Separar los estados: IMPLEMENTADO, HTTP_AUTORIZADO_VERIFICADO, TRANSPORTE_REAL_VERIFICADO y MONTADO_VERIFICADO_ES_EN. Sin evidencia de todos ellos no declarar conexión final.

Para HTTP: status, Content-Type JSON, identidad de código/despliegue, biblioteca R38, versión/hash y citas reales. Un HTML de login o Blobs leído desde Node local no cuenta. Para transporte/montaje: petición originada por el control real de Sabik, respuesta de la Function, representación agrupada y cancelación sin resultados antiguos. Usar consultas sintéticas, no datos personales. Conservar fallos de acceso como tales.

Entregar código/parche y lista de archivos, prueba pertinente sobre ese HEAD, evidencia saneada, delta A2 actualizado y un informe breve en `../../EVIDENCIAS/R39_CODEX_R04/`. Actualizar por ID memoria y control en esta misma carpeta. No esperar a voz ni al verificador A7. C17 mantiene el cierre documental acotado ya recibido; no abrir otra auditoría.

## Normativa y español + inglés — parte obligatoria de la orden

Aplicar `../../NORMATIVA/REQUISITOS_OPERATIVOS_ES_EN.md` sin reinterpretar ni ampliar la misión. Construcción sobre Iris existente: conservar Newsreader/Atkinson, cabecera, navegación, footer, Lectura y los cinco estados/masters de Sabik. WCAG 2.2 AA y COGA como referencias del proyecto: semántica, teclado/foco, anuncios, contraste y reflujo; conservar reducción de movimiento y ausencia de audio automático. ISO/IEC 40500, EN 301 549, ISO 9241-171/210/11/112 e ISO 24495-1 según la superficie y edición documentada; no declarar certificación por una prueba automática. Lenguaje claro, errores accionables, sin jerga interna ni infantilización; ajustes de Lectura no equivalen a Lectura Fácil validada (UNE 153101 EX).

Todo texto público afectado se entrega en ES y EN, incluidos errores, estados vacíos, instrucciones, nombres accesibles, alt y ayudas. Preservar rutas/lang y equivalencias. El corpus sellado sigue siendo ES: citas intactas con idioma explícito; no fingir respuesta documental inglesa. Un aviso traducido sobre esa limitación no cierra la cobertura EN del corpus. PDF/UA, braille específico y medios se justifican como no aplicables si no se producen. Sin proveedor/modelo, embeddings, voz, /api/chat, cambios de DNS, main merge ni apertura pública por esta orden. No almacenar consultas ni credenciales. Registrar solo evidencia del alcance realmente ejecutado.
