# Estado operativo compartido

Actualización: 24/09/2026, tras revisar las seis entregas finales de agentes. Estado operativo, no certificación global. Las correcciones solicitadas no constan como ejecutadas hasta nueva entrega.

## Resumen vigente

| Línea | Última evidencia | Estado y límite | Responsable |
|---|---|---|---|
| Web Iris Green | María confirma subidas e integración con agente 2 | Trabajo de María; no sustituir su rama ni desplegar encima | María + agente 2 |
| Design / recursos | Adaptación dirigida por María | No reasignar; 130 juegos antiguos fuera; recursos públicos ES/EN y marca de composición | María + Design |
| Motion R37 | c23abd9a3ef082a6ed646b03334fe9031b17af15; deploy 6ab4beac4267a5275ff2feb5 | Candidato montado; revisión visual de María y comprobaciones manuales pendientes | Codex / María |
| Biblioteca R38 | ddd12ed4e002812f5c53e24618c029be9faf9e00; deploy 6ab4c1a15435b93043ab3f6d | Biblioteca sellada conservada, consumida por R39 R02 | Codex |
| R39 continuidad R02 | HEAD 66b6b551ad055ea9e367ebdff7246b381f4656d3; tree 759b5c0d82a023a81d4aae48c6ab3ced26638d83; deploy 6ab4d5047d3729fae7f122aa | Integrado y desplegado como borrador. Revisión técnica previa de Astra con observación OBS-R39-BODY-01; no reconstruir | Codex |
| HTTP protegido | Team Login conservado; ninguna nueva prueba autorizada en estas entregas | Petición HTTP y lectura cross-deploy con identidad real del runtime pendientes | Codex + apoyo A5 |
| Retención C17 | A4 identifica exactamente la evidencia que falta | Pendiente de retención aplicada en plataforma, no acreditada por ausencia de logs propios | A4 |
| Voz | Herramientas de validación/paquete local recibidas | Revisión detecta WAV truncado aceptado; corrección local pendiente. Voz no activada y no bloquea R39 | A6 |

## Entregas del equipo: revisión realizada, no solo recepción

Informe completo: [Revisión final de los seis agentes](MEMORIA/REVISION_FINAL_AGENTES_R39_2026-09-24.md).
Evidencia estructurada: [Pruebas y reproducciones](CONTROL/EVIDENCIA_REVISION_AGENTES_R39_2026-09-24.json).

Astra reprodujo **53/53 pruebas originales**: A1 8, A3 14, A4 8, A5 6, A6 9, A7 8. Node22.16.0 y Python3.13.5 según módulo. Son casos unitarios/locales; no Node24, HTTP, navegador real, lector de pantalla o validación perceptiva de voz. Las pruebas negativas adicionales identifican fallos que esos casos no cubrían.

| Agente | Veredicto | Acción restante |
|---|---|---|
| A1 | Módulo de agrupación aceptado, no integrado | Codex une su salida al panel corregido conservando todos los fragmentos/citas |
| A3 | Correcciones antes del montaje público | Retirar etiquetas internas visibles; mapear REQUEST_CANCELLED; marcar idioma real de extractos. Codex compone respuesta HTTP/results, contrato candidates y agrupación A1 |
| A4 | Código revisado, solución alternativa ya cubierta por Codex | No sustituir execution-policy integrado. Ayuda restante: evidencia C17 |
| A5 | Código revisado, transporte alternativo ya cubierto por Codex | No añadir otra capa ni satisfacer gate de build histórico. Ayuda restante: HTTP autorizado |
| A6 | Corrección de entrada incompleta necesaria | Rechazar WAV truncado y controlar error de decodificación; no crear paquete válido ni modificar originales |
| A7 | No usar todavía como puerta de aceptación | Verificar contenido real del parche: vacío o alterado no puede ser VALID. Revisar comandos completos y actualizar índice sin confundir bases donantes/destino |

No mezclar implementaciones A4/A5 sobre las ya integradas ni dar por aprobado el verificador A7 por sus ocho casos positivos/negativos originales. Estas correcciones son acotadas; no justifican rehacer el producto ni detener módulos independientes.

## Evidencia R39 R02 conservada

Codex reporta sobre el mismo SHA 157/157 pruebas en Node22.16.0 y 157/157 en Node24.19.0; lecturas reales de Blobs desde Node local sin escrituras; paquete portable y digest remoto `5655a261f20b68b91c7a9dbc344ee675468ca4f848b1c83c9a976596573c5073`.

La revisión técnica anterior de Astra consultó código/diff y deploy Netlify y ejecutó 25 pruebas del motor más 12 adicionales en Node22. Se documenta en [Revisión técnica R39](MEMORIA/REVISION_TECNICA_R39_R02_37_PRUEBAS.md). El ZIP final solo se había recibido como ruta Windows: no se atribuye aquí una verificación independiente de ese archivo. Las 53 de agentes son otro alcance, no una suma de cobertura global.

OBS-R39-BODY-01 sigue abierta: el plazo del retrieval empieza después de leer el body. Acotar también esa lectura o documentar/verificar el límite externo si se ofrece timeout total. No se afirma vulnerabilidad Netlify ni cierre de HTTP.

## Límites y forma de continuar

Codex conserva composición común e integración Cloud. María/agente 2 reciben únicamente deltas frontend sobre su HEAD vigente. No nuevas páginas, shell, barra, tipografía o Lectura de prototipo. No abrir mantenimiento, fusionar main, cambiar DNS, Team Login, credenciales, proveedor, embeddings, `/api/chat` o voz por esta revisión.

Corpus N04 ES: 4.332 fragmentos/IDs, SHA256 `56f72c4d3959a67d99d3a90f6dce20558498c4cd7604472d9a7c67147404c41e`. Se conserva sellado. No se declara bilingüe por traducir los botones. Aplicar [normativa y ES/EN](NORMATIVA/REQUISITOS_OPERATIVOS_ES_EN.md) a todas las correcciones públicas.

## Registro único

Actualizar esta misma carpeta por ID y evidencia. Entregas y comunicaciones: https://github.com/mruizwow-bit/irisgreen/issues/237. Se distinguen recibido, revisado, corregido, integrado y verificado en uso. No declarar acuse por emitir la devolución ni volver a registrar como sin acuse a quienes ya entregaron.

Los resultados están en `CONTROL/ESTADO_TRABAJOS.csv` y los addenda de `MEMORIA/`. Esta actualización no sobrescribe la Memoria V106 original ni acredita aplicar el delta al Excel V114. No se altera normativa, se aplican los requisitos ya establecidos.
