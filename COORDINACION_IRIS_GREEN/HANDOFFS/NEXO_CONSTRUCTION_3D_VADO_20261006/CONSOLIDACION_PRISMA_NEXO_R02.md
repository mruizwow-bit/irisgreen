# Nexo · Consolidación Prisma/Nexo · Propuesta El Vado R02
Fecha: 2026-10-06.
Estado: EL_VADO_R02_SCOPE_PROPOSED. No FEEL PASS emitido. No nueva implementación ni prueba del ZIP.
NO MAIN · NO PUBLIC DEPLOY.

## Fuentes
Mismo ZIP en ambos estudios: SHA256 308c370ef5b2dfce69fa8e0f7865d957390aa40a290d8f46145eb2a99fc1e59c.
Prisma: a0c1263d59253f42c3660bd3f1fd5f00f4fb9fc1,
COORDINACION_IRIS_GREEN/FORMACION/ESTUDIO_COMPARADO_CLAUDE_20261005/PRISMA_ANALISIS_CONSTRUCCION_3D_DQB_20261006.md.
Nexo: 18207efd9b07ddab68ac626a5624a7e346196bed,
COORDINACION_IRIS_GREEN/HANDOFFS/NEXO_CONSTRUCTION_3D_VADO_20261006/ANALISIS_CODIGO_PRODUCTO_Y_PROPUESTA.md.
Leídos los dos registros y el texto aportado por María. Se preserva procedencia de evidencias; consenso no sustituye retest.

## Decisiones incorporadas
1. Construcción desde Vera. Equipar material/herramienta conserva locomoción en la interacción principal. Se rectifica la ambigüedad de «Modo Construir» del informe Nexo: no debe secuestrar las flechas/WASD para mover un cursor por defecto.
2. Cursor preciso como opción explícita para cualquier persona, no impuesto por dispositivo ni por diagnóstico. Puede permitir alternar mover personaje/mover cursor mediante controles simples; indicador inequívoco y salida predecible. No exigir ratón y teclado simultáneos para completar el juego.
3. Construcción útil y base persistente. Reemplazar el contador de tres colocaciones/una retirada por un refugio o taller utilizable y personalizable.
4. Recursos integrados en el entorno: objetos recuperables y pequeña ruina, con selección directa, alcance coherente y sin repetición obligatoria de golpes.
5. Herramientas futuras que reducen repetición: mover, sustituir, filas y planos. No implementar todas en el primer corte.
6. HUD compacto y personaje que responde al recoger/colocar/usar. Sonido opcional y feedback compatible con REDUCED/NONE.

## Ajustes al roadmap de Prisma
- Un NPC funcional entra en R02: cruzar por la obra y utilizar el refugio demuestra la consecuencia jugable que estamos intentando validar. No posponer esa evidencia a LIVING WORLD.
- El modelo h[x][z] limita el terreno natural editable; no convierte el render o las construcciones en falso 3D. Excavar capas superiores podría implementarse con alturas; túneles/cavidades/voladizos generales requieren otra representación, por ejemplo voxels dispersos o chunks. No presentar chunks como único diseño posible ni como requisito de toda construcción 3D.
- Mantener el terreno actual en el primer corte. La excavación general tendrá un piloto técnico propio cuando entre expresamente en alcance. Medir edición y guardado antes de fijar tamaño de chunk.
- La vegetación YA está agrupada en una malla. Instancing no reduce automáticamente sus draw calls frente a esa solución; usarlo si mejora el caso medido de objetos repetidos y actualizables.
- No imponer GLB/esqueleto, primera persona, salto, mapa grande ni migración de Three para validar el siguiente ciclo. Animaciones cortas con la jerarquía actual pueden bastar.
- No adoptar sin verificación la afirmación de versión «actual» de Three del informe. La versión del ZIP sí está verificada: r149. Una migración futura requiere consulta vigente, compatibilidad y comparación, sin crear ahora una rama adicional.
- Evitar conflicto rueda=zoom y rueda=hotbar: por defecto rueda conserva zoom; slots con números/selección directa. Cualquier variante se configura y se explica.
- «Vera sigue caminando» aplica al control del mundo, no a mantener movimiento mientras se interactúa con ajustes/formularios.

## Alcance cerrado propuesto para R02
A. Correcciones previas: teclado por contexto, impacto vs casilla de colocación en retirada, deshacer seguro, carga atómica, alcance vertical y recorte móvil. Mismas reproducciones del informe Nexo.
B. Mismo enclave pequeño; dos soluciones válidas al paso. Previa comprensible, materiales suficientes y devolución.
C. Herramienta equipada + locomoción principal; cursor preciso opcional. Un router de acciones común a ratón, teclado, táctil y panel de texto.
D. Un refugio/taller funcional, con forma elegida por la persona y plano opcional; un NPC que puede entrar y usarlo. Validar acceso y puntos de uso, no sólo contar bloques. Aceptar dos soluciones geométricas distintas.
E. HUD reducido, cámara que gestione paredes/ocultación, feedback breve de Vera y correcciones visuales concretas ya documentadas. Canon NAVY y fuentes; ES/EN; costes legibles.
F. Guardado de la base y una siguiente elección: ampliar, mirador o atajo. No incorporar simultáneamente huerto, almacén, horarios y múltiples residentes.

## Prueba de resultado
Entregar candidato jugable offline con hash exacto y recorrido grabado por interfaz pública, sin cursorA/debug para colocar.
Gate de entrega: EL_VADO_R02_READY_FOR_REVIEW.
Retest técnico independiente → HUMAN QA María.
Sólo después puede hablarse de FEEL_PASS: María entiende qué quiere hacer, actúa sin luchar con cámara/controles, reconoce el efecto de su obra y tiene una elección que le interesa continuar.
No acreditar sensación de juego mediante hashes, número de botones o contador de piezas.

Pendientes explícitos: navegador/GPU real para el análisis Nexo, móvil físico, lector de pantalla y valoración perceptual. Las afirmaciones generales 320/390/1440 y 200 % del informe Prisma no anulan el recorte visible en la captura ni los conflictos de teclado reproducidos.

Esta consolidación fija una propuesta de siguiente entrega; no afirma haber enviado instrucciones a Claude ni sustituye su ejecución.
