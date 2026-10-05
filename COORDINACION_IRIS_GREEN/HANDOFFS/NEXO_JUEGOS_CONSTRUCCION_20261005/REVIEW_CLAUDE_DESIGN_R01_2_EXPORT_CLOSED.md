# Nexo · Claude Design Juegos R01_2 · cierre de patch de exportación
2026-10-05 · #369

## Resultado
NEXO_CLAUDE_DESIGN_GAMES_R01_2_EXPORT_VERIFIED_READY_FOR_AXIOMA

Cierra el patch de exportación anterior en estructura/integridad. No declara PASS global de accesibilidad, producto, runtime o HUMAN QA. No se pide rediseñar el área ni repetir las seis correcciones.

## Artifact recibido
CLAUDE_DESIGN_JUEGOS_AREA_VISUAL_R01_2.zip
SHA256 aa6b3598904b3bcaf38067e4370489145c3092fd18a8ff50b671907946977e12
6758672 bytes · 68 archivos.
Library libfile_2fc7015efba08191ae4be87376d30a31.
Sidecar coincide; ZIP CRC PASS.
HASHES.txt: 67/67 correctos. MANIFEST.json: 66/66 entradas correctas; no incluye su propio hash ni HASHES.txt. Sin defecto por autorreferencia.

## Seis puntos revisados
1. CSS: apertura/cierre style presentes y equilibrados en 18/18 nativos y 18/18 portables.
2. Fuentes: los 18 portables tienen rutas relativas existentes; cero /_blob/ funcionales.
3. support.js: ningún script de dependencia en portable; las dos menciones son texto documental. Canvas mantiene renderer específico, declarado en README.
4. Reproducción: herramienta de exportación, script de render, evidencia fechada y 18 PNG entregados. Nexo ha leído el procedimiento y código; no repitió Chromium en este entorno. Las cifras de cero desbordes son evidencia reportada por Claude, no una nueva medición independiente. El script mide altura, por lo que no acredita por sí solo ausencia de cualquier recorte horizontal/interno.
5. Color: los 18 PNG incluyen iCCP, sRGB, gAMA y cHRM. Verificación binaria independiente.
6. Marca: dependencia de logotipo retirada; Iris Green textual entregado.

Inspección visual de las capturas J01 a 320 y S04 a 1440: coherentes con la dirección NAVY conservada. No se extiende esa inspección a un PASS visual de los 18 ni a reflow interactivo.

## Imagen de Construcción: impedimento resuelto mediante entrega de binarios
El paquete R01_2 remite al artifact anterior 11347511815.
La fuente aprobada correcta es:
- run 37318454037;
- artifact 11348661943;
- ZIP interno PRISMA_CONSTRUCTION_R01_STORYBOARD_R02_PATCH_P06.zip;
- SHA256 f2d4503945e96941b51f953ed8e3fa6decbf6d5dfe6e53acfa71f6c484082853;
- gate AXIOMA_CONSTRUCTION_R01_R02_STORYBOARD_READY_FOR_HUMAN_QA;
- evidencia #369/5995945476, commit 8ab82d7bef0054c46ae365be3ea62494a5970060.

Nexo recuperó el artifact final y verificó 37/37 hashes internos.
El ZIP externo de transporte de Actions tiene otro hash; no confundirlo con el ZIP interno auditado.
Se extrajeron SIN modificación de píxeles los tres F01 OBJETIVO en 1440/390/320. Inspeccionados 1440 y 390.

Entrega para Claude:
CLAUDE_DESIGN_FRAME_CONSTRUCCION_APROBADO.zip
77196 bytes
SHA256 5ff1f43c51f10b547b0348a57978a24b3802b3892a2ec17a3c0880bcf9cb28be
Library libfile_aa514eff11cc8191b07dc5469934fb0a
Incluye 00_INSTRUCCION_CLAUDE.txt, tres PNG, procedencia y hashes. No necesita acceso al repositorio.

## Orden acotada para Claude Design
- Sustituir las reservas en J01/J02/J03/S04 por el F01 existente; 1440 como imagen base y variantes móviles como referencia.
- Mantener geometría, ambas orillas y caja visibles; escalar sin deformar, sin redibujar ni generar arte. No usar un puente ya resuelto.
- Es imagen del prototipo/storyboard con personaje proxy; no arte final ni prueba de juego publicado. Rotular «Vista del prototipo» cuando corresponda.
- Mantener NAVY de la página; el color interno de la imagen no cambia el tema.
- Alt propuesto: «Vista del prototipo de construcción: dos orillas separadas por un canal, materiales en una orilla y una caja cerrada en la otra». Evitar repetición innecesaria si ya se describe al lado.
- Cambiar referencia de fuente al artifact 11348661943.
- Actualizar solo capturas afectadas, documentación y hashes. Revisar altura/encuadre en 320.
- Mantener clasificación Para todos/Plus y condiciones de acceso pendientes; no inventar decisiones comerciales ni activar Jugar por añadir una imagen.
- IG Zero sigue como integración tipográfica posterior, no nuevo bloqueo.

## Próxima revisión
Axioma puede revisar ya el área portable y sus estados. Completar revisión de imagen tras la sustitución.
No convertir estas maquetas en pruebas de teclado/runtime que aún no implementan; diferenciar revisión de especificación visual de comportamiento del futuro sitio.
Siguiente: IMAGEN INCORPORADA → AXIOMA ÁREA → HUMAN QA MARÍA.
El runtime de Construcción de Prisma sigue separado y autorizado por su propia orden. No reactivar el antiguo STOP pre-code de ese juego.
NO MAIN · NO PUBLIC DEPLOY. No merge completo de rama de coordinación.

## Memoria
Nexo aporta binarios cuando el diseñador externo no tiene acceso al repositorio. Los enlaces por sí solos no resuelven un handoff bloqueado. Una referencia a artifact anterior debe reconciliarse con el gate final antes de reutilizar imágenes.
