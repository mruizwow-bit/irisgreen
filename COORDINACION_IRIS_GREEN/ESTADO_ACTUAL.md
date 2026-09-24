# Estado operativo compartido

Actualización: 24/09/2026, entrega R39 R03 de Codex y corrección del panel reasignada expresamente por María. Evidencia local, navegador, paquete y HTTP separadas; no certificación global.

## Resumen vigente

| Línea | Última evidencia | Estado y límite | Responsable |
|---|---|---|---|
| Web Iris Green | María confirma subidas e integración con agente 2 | Trabajo de María; no sustituir su rama ni desplegar encima | María + agente 2 |
| Rincón tranquilo A2 R01 | HEAD `7b3a92723da442bbef692ae9780961f58ee1049c`; deploy `6ab4fee488beef00088f5b90`; live QA `35988912524` | Verificado dentro del deploy real ES/EN, escritorio/móvil y reduced motion; PASS en su alcance. Fallos globales restantes no pertenecen al Rincón | María + agente 2 |
| Design / recursos | Adaptación dirigida por María | No reasignar; 130 juegos antiguos fuera; recursos públicos ES/EN y marca de composición | María + Design |
| Taller e Intereses (Claude + A2) | Entrega Claude [R01](MEMORIA/WEB_CLAUDE_TALLER_INTERESES_SISTEMA_SOLAR_R01_20260924.md); PR #242, main `117a53a01bf254054f759e7e08eb06ba06f00d00`; [integración A2](MEMORIA/WEB_A2_TALLER_INTERESES_R06_20260924.md) | INTEGRADO_MAIN_PREVIEW_VERIFICADO: Taller, Intereses a fondo, Cielo nocturno y Sistema Solar ES/EN; Taller adaptado al shell Iris Green. Preview #242 comprobada; 3D real y móvil pendientes. Producción sin publicar | Claude entrega; María + agente 2 integran |
| Motion R37 | c23abd9a3ef082a6ed646b03334fe9031b17af15; deploy 6ab4beac4267a5275ff2feb5 | Candidato montado; revisión visual de María y comprobaciones manuales pendientes | Codex / María |
| Biblioteca R38 | ddd12ed4e002812f5c53e24618c029be9faf9e00; deploy 6ab4c1a15435b93043ab3f6d | Biblioteca sellada conservada, consumida por R39 R02 | Codex |
| R39 continuidad R02 | HEAD 66b6b551ad055ea9e367ebdff7246b381f4656d3; tree 759b5c0d82a023a81d4aae48c6ab3ced26638d83; deploy 6ab4d5047d3729fae7f122aa | Integrado y desplegado como borrador. Revisión técnica previa de Astra con observación OBS-R39-BODY-01; no reconstruir | Codex |
| R39 R03 | HEAD `3131d55020057c55567a3457900afc888876de5d`; deploy `6ab504fbf5d403147f6de213`; 227 pruebas por runtime | Body corregido, puente A1/panel integrado, delta A2 comprobado; HTTP y montaje real pendientes | Codex |
| R39 R04 | HEAD `e8a8e9579b64ffbe288e2a85889dbe687210554b`; 256/256 por runtime; delta main A2 `117a53a01bf254054f759e7e08eb06ba06f00d00` | Conexión privada construida localmente y desactivada. Nueva entrada pendiente de autorización específica; HTTP y montaje sin verificar. [Informe](EVIDENCIAS/R39_CODEX_R04/INFORME.md) | Codex; A2 monta |
| HTTP protegido | A5 BLOQUEADO_ACCESO_AUTORIZADO; Team Login conservado | A5-HTTP-ACTION-01 contra candidato R03; lectura cross-deploy con identidad runtime pendiente | Codex + apoyo A5 |
| Retención C17 | A4 R02: política nativa Function logs hasta 7 días contrastada | Acotado a logs nativos de Serverless Function; no prueba de borrado físico ni otros tipos de registro | A4 + revisión Codex |
| Voz | Herramientas de validación/paquete local recibidas | Revisión detecta WAV truncado aceptado; corrección local pendiente. Voz no activada y no bloquea R39 | A6 |

## Entregas del equipo: revisión realizada, no solo recepción

Informe completo: [Revisión final de los seis agentes](MEMORIA/REVISION_FINAL_AGENTES_R39_2026-09-24.md).
Evidencia estructurada: [Pruebas y reproducciones](CONTROL/EVIDENCIA_REVISION_AGENTES_R39_2026-09-24.json).

Astra reprodujo **53/53 pruebas originales**: A1 8, A3 14, A4 8, A5 6, A6 9, A7 8. Node22.16.0 y Python3.13.5 según módulo. Son casos unitarios/locales; no Node24, HTTP, navegador real, lector de pantalla o validación perceptiva de voz. Las pruebas negativas adicionales identifican fallos que esos casos no cubrían.

| Agente | Veredicto | Acción restante |
|---|---|---|
| A1 | Módulo aceptado integrado en R03 | Montaje A2 y transporte autorizado pendientes |
| A3 | Correcciones asumidas por Codex con autorización de María y verificadas en R03 | Montaje A2 y aceptación humana pendientes; donante original conservado |
| A4 | Código revisado, solución alternativa ya cubierta por Codex | No sustituir execution-policy integrado. Evidencia C17 nativa recibida; ver límites de alcance |
| A5 | Código revisado, transporte alternativo ya cubierto por Codex | No añadir otra capa ni satisfacer gate de build histórico. Ayuda restante: HTTP autorizado |
| A6 | Corrección de entrada incompleta necesaria | Rechazar WAV truncado y controlar error de decodificación; no crear paquete válido ni modificar originales |
| A7 | No usar todavía como puerta de aceptación | Verificar contenido real del parche: vacío o alterado no puede ser VALID. Revisar comandos completos y actualizar índice sin confundir bases donantes/destino |

No mezclar implementaciones A4/A5 sobre las ya integradas ni dar por aprobado el verificador A7 por sus ocho casos positivos/negativos originales. Estas correcciones son acotadas; no justifican rehacer el producto ni detener módulos independientes.

## Evidencia R39 R02 conservada

Codex reporta sobre el mismo SHA 157/157 pruebas en Node22.16.0 y 157/157 en Node24.19.0; lecturas reales de Blobs desde Node local sin escrituras; paquete portable y digest remoto `5655a261f20b68b91c7a9dbc344ee675468ca4f848b1c83c9a976596573c5073`.

La revisión técnica anterior de Astra consultó código/diff y deploy Netlify y ejecutó 25 pruebas del motor más 12 adicionales en Node22. Se documenta en [Revisión técnica R39](MEMORIA/REVISION_TECNICA_R39_R02_37_PRUEBAS.md). El ZIP final solo se había recibido como ruta Windows: no se atribuye aquí una verificación independiente de ese archivo. Las 53 de agentes son otro alcance, no una suma de cobertura global.

OBS-R39-BODY-01 corregida en R03 y probada localmente y en paquete: el plazo incluye lectura de body. No se afirma vulnerabilidad Netlify ni cierre de HTTP. Véase [entrega y límites R03](EVIDENCIAS/R39_CODEX_R03/INFORME.md).

## Límites y forma de continuar

Codex conserva composición común e integración Cloud. María/agente 2 reciben únicamente deltas frontend sobre su HEAD vigente. No nuevas páginas, shell, barra, tipografía o Lectura de prototipo. No abrir mantenimiento, fusionar main, cambiar DNS, Team Login, credenciales, proveedor, embeddings, `/api/chat` o voz por esta revisión.

Corpus N04 ES: 4.332 fragmentos/IDs, SHA256 `56f72c4d3959a67d99d3a90f6dce20558498c4cd7604472d9a7c67147404c41e`. Se conserva sellado. No se declara bilingüe por traducir los botones. Aplicar [normativa y ES/EN](NORMATIVA/REQUISITOS_OPERATIVOS_ES_EN.md) a todas las correcciones públicas.

## Registro único

Actualizar esta misma carpeta por ID y evidencia. Entregas y comunicaciones: https://github.com/mruizwow-bit/irisgreen/issues/237. Se distinguen recibido, revisado, corregido, integrado y verificado en uso. No declarar acuse por emitir la devolución ni volver a registrar como sin acuse a quienes ya entregaron.

Los resultados están en `CONTROL/ESTADO_TRABAJOS.csv` y los addenda de `MEMORIA/`. Esta actualización no sobrescribe la Memoria V106 original ni acredita aplicar el delta al Excel V114. No se altera normativa, se aplican los requisitos ya establecidos.

## Taller F1 · actualización A2 R10

| Línea | Última evidencia | Estado y límite | Responsable |
|---|---|---|---|
| Taller F1, sustitución completa | PR244 HEAD 697a0e2c815f6dd966e221e564c4e1f6e98df7bc; 31/31 Node; build 2047 archivos; [informe](EVIDENCIAS/WEB_A2_TALLER_F1_R10/INFORME.md) | Integrado en candidato ES/EN; QA navegador y preview READY y verificada ES/EN; sin producción | María + agente 2 |

## Taller F1 · continuación A2 R11

Sustitución de portada completa: retirados los 72 retos anteriores. Código f93346772f6e005ecafa2b2b03ff467a105d210a; preview READY y verificada ES/EN. [Registro y límites](MEMORIA/WEB_A2_TALLER_F1_R11_20260924.md).

## Intereses · Exoplanetas A2 R12

Exoplanetas ES/EN integrado en PR244, HEAD 5b0940fa3ab2a91dfd378993042160bd2accbe02; deploy 6ab54084dcb6f500075d3bc3 READY. Búsqueda, filtro y navegación inglesa verificados; fallback sin WebGL comprobado. Sistema Solar ya coincidía con el paquete. Taller F1 preservado. [Evidencia y límites](MEMORIA/WEB_A2_EXOPLANETAS_R12_20260924.md). Sin producción ni main.

## Taller visual · A2 R13

María pide retirar la portada antigua y mostrar imágenes de cada estudio. Implementado ES/EN en PR244, HEAD 9bc3125b3961144e681b074c024a3ab2b89cf2bb. Preview SUCCESS; portada ES revisada visualmente, cinco tarjetas con capturas del paquete F1. [Registro](MEMORIA/WEB_A2_TALLER_VISUAL_R13_20260924.md). Sin producción.

## Rincón tranquilo · integración A2 R14

Actualización R02/R02b del paquete irisgreen-r02-r03-listo_2.zip integrada solo en Rincón ES/EN. HEAD 01df4edd96d7486a72732ff61b4341de1da0c7c8, deploy 6ab5449baa35420008a0dc38 SUCCESS. Ocho escenas propias, trece sonidos generados y retirada de YouTube. Assets versionados tras detectar caché antigua. [Evidencia y límites](MEMORIA/WEB_A2_RINCON_R14_20260924.md). Recursos R03 del ZIP no integrados en esta solicitud.

## Intereses · agrupación R15

Retirado catálogo antiguo del índice ES/EN según capturas de María. Cielo nocturno, Sistema Solar y Exoplanetas bajo El cielo y el espacio. Estructura de once grupos registrada para entregas futuras, sin grupos vacíos públicos. HEAD d0c49fa9a7f51e6cd363e3281818f082132abcb8; deploy 6ab545c25a9e420008fcfec3 SUCCESS. [Registro](MEMORIA/WEB_A2_INTERESES_ESTRUCTURA_R15_20260924.md).

## Videoteca · A2 R16

R04 integrado en PR244: 118 vídeos, 17 temas. Dan Wilkins permanece primero por petición expresa de María; prioridad registrada y comprobada por generador. HEAD b91c4bc7047d8e7793f095c8333ee76ef0c20217. Build correcto; deploy SUCCESS. Navegador confirma 118 vídeos, Dan primero ES/EN y filtro Ceguera con los cuatro nuevos vídeos. [Registro](MEMORIA/WEB_A2_VIDEOTECA_R16_20260924.md).

## Juegos y recursos · A2 R17

Paquete R06 integrado: 252 juegos, 109 rutinas, catálogo A4 y biblioteca visual compartida. HEAD 38cff835a3446ac1539d79fe2a87aedc358ae9c8 en PR244; build correcto, deploy y QA pendientes. Tres juegos nuevos, ningún slug retirado frente al HEAD anterior. [Registro y límites de duplicación](MEMORIA/WEB_A2_RECURSOS_R17_20260924.md).
