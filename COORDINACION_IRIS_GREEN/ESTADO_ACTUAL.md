# Estado operativo compartido

Actualización R39: 24/09/2026. Fuente: entrega de Codex confirmada por María y comentario https://github.com/mruizwow-bit/irisgreen/issues/237#issuecomment-5810021289. Este registro distingue evidencia recibida, código, despliegue y aceptación; registrar una entrega no equivale a repetir sus pruebas.

| Línea | Última evidencia de partida | Estado y límite | Responsable |
|---|---|---|---|
| Web Iris Green | María confirma que está subiendo e integrando con el agente 2 | Trabajo activo de María; no sustituir su rama ni desplegar encima | María + agente 2 |
| Design / recursos | María dirige adaptación a la web existente | No reasignar; excluir los 130 juegos antiguos; ES/EN y marca en composiciones | María + Design |
| Motion R37 | c23abd9a3ef082a6ed646b03334fe9031b17af15; deploy 6ab4beac4267a5275ff2feb5 | Candidato montado; no equivale a aceptación visual de María | Codex; revisión de María |
| Biblioteca R38 | ddd12ed4e002812f5c53e24618c029be9faf9e00; deploy 6ab4c1a15435b93043ab3f6d | Biblioteca sellada conservada y consumida por R39 R02; preservar corpus | Codex |
| Adaptador R39 · continuidad R02 | HEAD 66b6b551ad055ea9e367ebdff7246b381f4656d3; tree 759b5c0d82a023a81d4aae48c6ab3ced26638d83; deploy 6ab4d5047d3729fae7f122aa | INTEGRADO Y DESPLEGADO COMO BORRADOR según entrega de Codex. Function conectada a R39, timeout 15000 ms y cancelación individual. Sustituye el estado anterior R39_deployed=false | Codex |
| HTTP protegido | R39 R02 conserva Team Login; no repite sonda denegada | Petición HTTP autenticada pendiente. Acceso cross-deploy con credenciales del runtime no demostrado hasta esa ejecución | Codex; apoyo de agente 5 según su alcance |
| Retención C17 | Sin evidencia suficiente de configuración/retención aplicada en plataforma | Pendiente; ausencia de logs propios no demuestra retención máxima de plataforma | Agente 4 |
| Voz | Trabajo local de voz propia de María | No activada; no bloquea R39; ninguna grabación privada en Git | Agente 6 |

## R39 R02: evidencia recibida y límites

Codex declara sobre el mismo SHA: 157/157 pruebas en Node 22.16.0 y 157/157 en Node 24.19.0; recuperación desde Blobs reales ejecutada desde Node local, con cero escrituras; paquete portable sin junction/symlinks y 46 dependencias concordantes con el lock; digest remoto igual al ZIP verificado: `5655a261f20b68b91c7a9dbc344ee675468ca4f848b1c83c9a976596573c5073`.

Esta actualización registra esas evidencias del autor: Astra no ha vuelto a ejecutar esas suites ni ha leído el ZIP de la ruta Windows en esta recepción. No acredita una respuesta de la Function vía HTTP ni aceptación visual. El archivo `SABIK_N04_R39_CONTINUIDAD_R02.zip` sigue identificado por la ruta local de Codex; esta anotación no lo sube automáticamente a GitHub.

## Hecho: no volver a construir

R39 ya incluye adaptador, validación, comprobación de citas, errores, composición de servidor, conexión de Function, cancelación, timeout y empaquetado en `cloud/n04-r38-library/`. No crear otra biblioteca ni repetir esos encargos.

Codex indica que su integración cubre las piezas de ejecución/runtime: no mezclar las implementaciones paralelas A4/A5 encima de las ya integradas. Conservar las ramas externas y sus referencias. A1/A3 son presentación/consumo y quedan fuera de este candidato backend; no se consideran integradas por el despliegue de R39. La voz no bloquea este trabajo.

## Auxiliares y coordinación

Los acuses, reservas y entregas individuales se consultan en https://github.com/mruizwow-bit/irisgreen/issues/237. El reparto inicial no representa por sí solo el estado actual. Agente 7 consolida los avances por ID; no volver a tratar como sin acuse a quienes ya respondieron.

## Límites que continúan

No apertura pública, merge a main, cambio de DNS, activación de `/api/chat`, proveedor, embeddings ni voz. No tocar la web de María/agente 2. Corpus español N04: 4.332 fragmentos e IDs; SHA-256 `56f72c4d3959a67d99d3a90f6dce20558498c4cd7604472d9a7c67147404c41e`. Mantenerlo inmutable; no afirmar que contiene inglés.

La normativa y el requisito ES+EN siguen siendo obligatorios en cada orden y contenido público afectado. Esta recepción no modifica normas, permisos ni obligaciones lingüísticas.

## Cómo actualizar

Actualizar esta misma carpeta. Cada entrega indica orden, base/HEAD, archivos, evidencias, ES/EN afectados, resultado y bloqueo concreto. Codex confirma integración Cloud; María/agente 2 confirman web. No sobrescribir maestros históricos ni sustituir versiones posteriores con V93/V101. La recepción R39 R02 se registra en `MEMORIA/RECEPCION_R39_CONTINUIDAD_R02.md` y en la fila R39 de `CONTROL/ESTADO_TRABAJOS.csv`; no se afirma haber aplicado el delta al Excel V114.
