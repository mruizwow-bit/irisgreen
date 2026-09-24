# Órdenes vigentes del equipo · apoyo a Codex

Este documento conserva el reparto de apoyo a R39 sobre código ya entregado. No afirma que los agentes hayan recibido o iniciado las órdenes. Antes de escribir, declarar HEAD real, archivos reservados y avance ya existente; entregar solo el incremento pendiente. Codex es el único integrador de archivos compartidos. Las rutas nuevas propuestas no acreditan que sus archivos existan.

## Agente 1 · agrupación de fuentes

Construir el incremento `source-groups.mjs` y su prueba bajo `cloud/n04-r38-library/`, si no existe ya. Agrupar resultados por URL exacta conservando orden de primera aparición, todos los fragment IDs, extractos, versiones y puntuaciones. No cambiar ranking, filtros, corpus, límites ni crear otro validador o motor de citas. Entregar a Codex módulo, prueba y parche pequeño.

**Normativa y ES/EN dentro de esta orden:** aplicar el anexo normativo común según alcance. No introducir copy público sin sus versiones española e inglesa; nombres internos de campos no se traducen. Mantener trazabilidad de fuentes y no inferir diagnóstico. Objetos seguros, sin HTML ejecutable ni pérdida de metadatos necesarios para alternativas accesibles. Las pruebas incluyen consumo equivalente ES/EN; no confundir un corpus español con cobertura documental inglesa. No modificar la web de A2.

## Agente 3 · resultados en el Sabik existente

Construir un componente acotado de resultados compatible con Sabik, recibiendo una función de consulta inyectada. Resultados, vacío, error y cancelación; texto seguro y fuentes reales. No crear otra página, barra, footer, panel de Lectura ni estados B3. Sin credenciales Cloud en navegador. No activar llamada pública por montar el componente. Entregar delta a Codex; A2 conserva el montaje frontend sobre su HEAD vigente.

**Normativa y ES/EN dentro de esta orden:** WCAG 2.2 AA y COGA según la superficie; HTML semántico, teclado, foco visible, nombres accesibles, orden de lectura, contraste, reflujo y anuncios no repetitivos. Respetar tipografía y Lectura existentes. Todos los textos, enlaces descriptivos, ARIA, estados vacíos/errores e instrucciones en ES y EN; idioma correcto y equivalencia de comportamiento. Lenguaje claro, segunda persona, no infantilizante ni diagnóstico. No depender de movimiento o color.

## Agente 4 · cancelación, timeout y evidencia de privacidad

Construir incremento `execution-policy.mjs` y pruebas. Diferenciar cancelación y timeout por solicitante; duración configurada explícitamente; limpiar listeners y temporizadores, ignorar resultados tardíos. No cancelar la carga compartida del índice por la cancelación de un usuario. No afirmar abortar I/O del SDK si solo se descarta el resultado. Conservar contrato R39 y documentar ampliaciones internas necesarias con Codex. Para C17, aportar configuración/retención verificable o dato/permiso exacto faltante; no otra auditoría general.

**Normativa y ES/EN dentro de esta orden:** minimización, ninguna consulta/IP/stack sensible en registros o respuestas. Mensajes públicos de espera, cancelación y error seguros, claros y equivalentes ES/EN. No añadir estados B3 ni spinner para representar esperas. El consumidor debe anunciar cambios de forma accesible y mantener foco. Aplicar requisitos pertinentes del anexo; no declarar retención de plataforma por ausencia de console.log.

## Agente 5 · Function real y runtime

Reutilizar `createSabikRetrievalForDeployment`; conectar el adaptador R39 a la Function interna existente mediante el incremento mínimo acordado con Codex. Preparar empaquetado/provenance de los módulos realmente incluidos y verificar los runtimes pertinentes frente a Node 22.16.0 local y Node 24 declarado en la entrega. No crear otro bootstrap/loader. Preparar un solo candidato Cloud integrado; desplegar exclusivamente el HEAD autorizado por Codex en `sabik-asistente`, nunca en `irisgreen-home`.

**Normativa y ES/EN dentro de esta orden:** conservar Team Login, secreto de Function, validación de entrada y respuesta sanitizada; sin claves en cliente/Git ni debilitación de acceso. Registrar separadamente HTTP real, Blobs remoto y pruebas locales. C17 sigue pendiente sin evidencia. El contrato no debe introducir texto público monolingüe; los mensajes que llegue a mostrar la web necesitan ES/EN. Corpus español inmutable; no atribuirle traducción o cobertura inglesa. Aplicar anexo de construcción y privacidad, sin abrir `/api/chat`, proveedor, embeddings, voz o DNS.

## Agente 6 · voz local fuera de la ruta crítica

Continuar la preparación local ya encomendada sobre las muestras propias de María. Entregar a Codex la herramienta/contrato de validación y empaquetado, conservando originales y decisiones aprobadas. No duplicar diagnóstico local ya realizado, elegir otra voz/ganadora ni subir audio privado a Git. Si falta validación con muestras reales, declararlo. Esta entrega no bloquea biblioteca.

**Normativa y ES/EN dentro de esta orden:** privacidad de voz y consentimiento para usos concretos; sin activación de micrófono, TTS remoto, reproducción automática o sincronía con Motion. Cualquier control, ayuda o error público futuro debe estar en ES y EN y ser accesible por teclado/tecnologías de apoyo. El idioma del audio debe etiquetarse correctamente: voz española no equivale a voz inglesa terminada. La validación sintética no acredita calidad de la voz real. Aplicar el anexo según alcance, sin generar nueva interfaz.

## Agente 7 · una recepción y un registro

Mantener propietarios, acuses y entregas en una cola única. Reutilizar SOURCE/CHANGES/manifiestos existentes y herramienta de verificación si está disponible. Comprobar base/HEAD, archivos permitidos, hashes y colisiones; entregar a Codex parches compatibles. No crear otro sistema documental ni repetir auditorías generales. Codex confirma integración; María/A2 confirman frontend. Actualizar esta carpeta con estado y evidencia sin sobrescribir originales ni aceptar trabajo por silencio.

**Normativa y ES/EN dentro de esta orden:** cada orden emitida debe copiar su bloque aplicable de construcción, accesibilidad, escritura/lectura y ES/EN, no solo enlazar una norma. Rechazar la etiqueta COMPLETO si falta texto inglés público afectado o si se confunden pruebas locales con funcionamiento desplegado. Conservar autoría/licencias y no publicar datos privados. Normas con fuente/edición/aplicabilidad; pendientes explícitos. No modificar producto, desplegar ni dirigir Design.

## Agente 2 y Design · reserva de trabajo

Permanecen con María. Esta centralización no reasigna sus tareas ni autoriza a otros a tocar su rama o sitio. Las entregas a frontend son incrementos sobre la base vigente y cumplen ES/EN y el marco común; ningún candidato antiguo puede sustituir la web actual.

## Anexo común y entrega de todos los agentes

`../NORMATIVA/REQUISITOS_OPERATIVOS_ES_EN.md` completa estas cláusulas: construcción, WCAG/COGA, ISO/EN/UNE según alcance, escritura y lectura clara, medios/descargables, privacidad y atribución. No representa una certificación ni permite ampliar tareas.

Cada entrega: orden y responsable, base/HEAD/tree, archivos, código/prueba/parche, contenido ES/EN afectado, resultados reales, restricciones y evidencia. Estados: RECIBIDA → EN_CONSTRUCCION → ENTREGADA_CON_CODIGO → INTEGRADA → VERIFICADA_EN_SU_ALCANCE; cada transición exige evidencia. Build/READY no significan aceptación humana. No apertura pública, cambio de mantenimiento o activación de conversación/voz.
