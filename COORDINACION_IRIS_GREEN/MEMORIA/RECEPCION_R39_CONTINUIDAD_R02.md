# Recepción de R39 · continuidad R02

Fecha: 24/09/2026.
Fuente: entrega de Codex aportada por María y registro https://github.com/mruizwow-bit/irisgreen/issues/237#issuecomment-5810021289.

## Estado que sustituye al anterior

R39 está integrado y desplegado como borrador según la entrega del autor; ya no corresponde `R39_deployed=false` de la primera entrega.

- Rama: `codex/n04-retrieval-r39-20260924`.
- HEAD de la entrega: `66b6b551ad055ea9e367ebdff7246b381f4656d3`.
- Tree: `759b5c0d82a023a81d4aae48c6ab3ced26638d83`.
- Sitio Cloud: `sabik-asistente`.
- Deploy: `6ab4d5047d3729fae7f122aa`, declarado ready/deploy-preview/no publicado.
- Biblioteca sellada conservada: deploy R38 `6ab4c1a15435b93043ab3f6d`.
- Function `n04-library-qa` conectada al adaptador R39; timeout de 15000 ms y cancelación individual sin abortar el lector compartido.

Codex reporta 157/157 pruebas en Node 22.16.0 y 157/157 en Node 24.19.0 sobre el mismo SHA, recuperación desde Blobs reales desde Node local con cero escrituras, paquete portable con dependencias del lock y digest de Function remoto concordante con el paquete: `5655a261f20b68b91c7a9dbc344ee675468ca4f848b1c83c9a976596573c5073`.

## Pendientes del incremento backend

1. Petición HTTP desde un contexto legítimo de equipo, con la clave QA existente. Falta demostrar respuesta de aplicación y acceso cross-deploy con credenciales del runtime; las lecturas de Blobs desde un proceso local no lo sustituyen.
2. C17: evidencia aplicable de retención máxima de siete días en plataforma.

No se reabre la construcción del adaptador, Function, cancelación, timeout o empaquetado. Las ramas externas A4/A5 se conservan como evidencia y no se mezclan como implementaciones duplicadas sobre las ya integradas. A1/A3 son consumo/presentación y no están integradas por este despliegue backend. No modificar la web de María/agente 2 ni Motion R37.

## Alcance de esta recepción documental

Astra ha leído el registro de GitHub y actualizado `ESTADO_ACTUAL.md` y `CONTROL/ESTADO_TRABAJOS.csv` de esta misma carpeta. No ha vuelto a ejecutar las suites ni accedido al ZIP en la ruta Windows de María en esta recepción. No acredita cierre de HTTP, C17, frontend o aprobación visual.

Los maestros V106/V114 originales no se sobrescriben; este archivo es un addendum de recepción y el CSV es el control operativo. No se afirma que el delta entregado por Codex esté aplicado al Excel V114 ni que el ZIP local se haya subido a esta carpeta.

No hay cambio de normativa ni nueva autorización de producto. Continúan las obligaciones de normativa aplicable y contenido público completo en español e inglés. El corpus N04 ES permanece sellado, no se declara EN por traducir la interfaz. Sin proveedor/modelo/embeddings, voz, `/api/chat`, inferencia, cambio de DNS, apertura pública o debilitamiento de Team Login.
