# R39-A5-HTTP-R02 · Demostrar la petición HTTP autorizada
Fecha: 24/09/2026. Responsable: Agente 5, coordinado con Codex. Autoridad: María, siguientes órdenes tras revisión final. Estado: EMITIDA_PENDIENTE_ACUSE.

## Base y objetivo único
R39 ya está integrado y desplegado: referencia `66b6b551ad055ea9e367ebdff7246b381f4656d3`, borrador `6ab4d5047d3729fae7f122aa` de `sabik-asistente` (sitio `47b06e68-ff54-4097-8ad8-336b2d71758a`). Biblioteca R38 conservada: `6ab4c1a15435b93043ab3f6d`.
Confirmar con Codex el candidato vigente antes de probar; no retroceder si hay una corrección posterior. Fuente: [revisión final](../../MEMORIA/REVISION_FINAL_AGENTES_R39_2026-09-24.md), A5.
NO construir otro transport/bootstrap, no imponer `r39-runtime-transport`, no modificar el build actual para pasar el comprobador histórico. Node24 observado en R38 no acredita una ejecución nueva de R39.

## Ejecutar
1. Comprobar una vía legítima de acceso de equipo a la ruta protegida `POST /internal/n04/library/search`, conservando Team Login y la clave QA existente. Utilizar solo identidad/permisos ya autorizados. No exportar cookies, copiar sesiones ajenas, pedir secretos en mensajes ni eludir controles.
2. Ejecutar una petición con una consulta sintética no personal, mediante el contrato HTTP REAL que expone el handler vigente. No reutilizar nombres de campos de otro contrato por memoria. Registrar status, Content-Type, cuerpo saneado, hora y asociación al deploy/Function. Un 200 de página de login no es respuesta de aplicación.
3. Comprobar en la respuesta de aplicación la biblioteca esperada, versión, fragmentos y URL reales. La prueba debe ejecutar la Function remota y su lectura cross-deploy con identidad de runtime; una llamada SDK desde Node local no la sustituye. No introducir una ruta pública o un proveedor para hacer la prueba.
4. Si Team Login impide esa vía, detener esa sonda. Entregar una sola acción precisa para la persona autorizada, ligada al candidato existente, sin otra cadena de drafts o reintentos idénticos. El resto del equipo continúa. Si hay un fallo real de aplicación, enviar a Codex reproducción y delta sugerido; no editar su composición en paralelo.

## Entrega
`COORDINACION_IRIS_GREEN/EVIDENCIAS/R39_A5_HTTP_R02/`: petición sintética saneada, respuesta, identificación del deploy, resultado y límite. Nunca Authorization, cookies, claves QA ni consultas personales. Estado HTTP_VERIFICADO solo con respuesta correlacionada de aplicación; si falta acceso, BLOQUEADO_ACCESO_AUTORIZADO con una única acción faltante. C17 no se cierra por esta prueba.
Registrar por ID en el control y #237. No deploy por A5, no variables, permisos, DNS, nuevo borrador, main merge ni cambios a `irisgreen-home`.

## Normativa obligatoria y ES+EN
Aplicar [REQUISITOS_OPERATIVOS_ES_EN](../../NORMATIVA/REQUISITOS_OPERATIVOS_ES_EN.md). **Iris Green es bilingüe, español e inglés.** Esta prueba interna no publica textos; justificarlo. Si se entrega ayuda para usuarios o cambia un mensaje público, proporcionar ES+EN, incluido el anuncio accesible. No traducir identificadores ni el corpus ES sellado; no declarar biblioteca inglesa por probar etiquetas inglesas.
Construcción sobre la web existente: sin sustituir shell, tipografía, navegación o Lectura. Marco por alcance: WCAG 2.2 AA/COGA, ISO/IEC 40500, EN 301 549, lenguaje claro ISO 24495-1 y familia ISO 9241-171/210/11/112. No declarar conformidad con una prueba HTTP ni aplicar todo el marco a una Function sin justificarlo. UNE 153101 EX, PDF/UA y braille solo para superficies pertinentes. Documentación clara sin jerga en contenido público, sin infantilización. Protección de datos y seguridad: no persistir secretos/payloads personales, no debilitar autenticación. Mantener proveedor, voz, embeddings y `/api/chat` desactivados. Esta orden no cambia normativa ni autoriza abrir mantenimiento.
