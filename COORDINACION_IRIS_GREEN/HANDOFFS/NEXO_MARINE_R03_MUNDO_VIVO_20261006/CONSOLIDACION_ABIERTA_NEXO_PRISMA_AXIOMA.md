# Vida marina R03 · Consolidación abierta Nexo / Prisma / Axioma

Fecha: 2026-10-06. Estado: RECOPILANDO_REVISIONES · CONTRATO_Y_ORDEN_FINAL_PENDIENTES.

María pide incorporar lo indicado por Prisma y seguir analizando mientras aporta las siguientes conclusiones de Prisma y Axioma. Se registra la información recibida; no se implementa todavía ni se cierran decisiones pendientes de contraste.

## Fuentes y atribución

- Prisma: COORDINACION_IRIS_GREEN/FORMACION/ESTUDIO_COMPARADO_CLAUDE_20261005/PRISMA_REVISION_PECES_R03_20261006.md, leído directamente en commit 59b0d8c97b0d645896bf5331a684f1c861acd38d.
- Ampliación de diseño de Prisma: texto íntegro aportado por María en Texto pegado(20261006-052043).txt, leído. Sus identificadores internos de citas de otro chat no son evidencia recuperada por Nexo; los principios comunes tienen fuentes propias en ANALISIS_Y_PROPUESTA.md y formación Nexo 09/10.
- Nexo: ANALISIS_Y_PROPUESTA.md, analizar.cjs, RESULTADOS_R03.json en este directorio; revisión en commit a52826444c9338d67c2406e8a3c59cc155bff54c.
- Axioma: pendiente de la aportación de María. No se atribuye acuerdo, ejecución o gate a Axioma.

Las tres huellas de APP/ASSETS/vídeo coinciden entre Prisma y Nexo. Se comparan los mismos binarios. Nexo no vuelve a etiquetar como propios los ensayos de navegador o mediciones de Prisma.

## Matriz provisional de incorporación

| ID Prisma | Hallazgo | Evidencia disponible | Incorporación prevista |
|---|---|---|---|
| P01 | Cancelar confirma luz | Reproducción de Prisma y fixture independiente de Nexo | Separar cancel de confirmación; cancel no dispara acción adicional |
| P02 | Salto al cambiar movimiento | Medición de Prisma; fórmula y setter corroborados por Nexo | Conservar posición, postura y encuentro durante cambio de perfil; NONE detiene desde el estado visible |
| P03 | Eliminar candidato enfocado pierde foco | Navegador reportado por Prisma; retirada DOM corroborada por Nexo | Conservar temporalmente nodo o transferir foco antes de retirarlo; nunca BODY por desaparición |
| P04 | Enter/Espacio calla con varios candidatos | Reproducción de Prisma; rama incompleta corroborada por Nexo | Mensaje con número de señales y acción para elegir; sin elección automática |
| P05 | CTA lejos de la escena | Mediciones de Prisma, coherentes con fotogramas e inspección de Nexo | Acción contextual próxima; ayuda extensa secundaria; preservar cielo/agua visible y controles a 200 % |
| P06 | 35 % de alfa no expresa rasgo observado | Lectura concordante de ambos | Regiones significativas a contrastar; no examen de precisión ni prueba de comprensión humana |
| P07 | Locomoción universal | Código concordante de ambos | Familias de conducta y movimiento según taxón y fuente |
| P08 | Giro por fotograma | Código identificado por Prisma, corroborado | Interpolación dependiente de dt, continuidad a 30/60/120 Hz |
| P09 | Mezcla build equipo/producto | modoEquipo true observado por ambos | Salidas separadas y verificación de contenido público; sin publicar escenas de prueba |
| P10 | Coste de imágenes | Cálculo de Prisma y recálculo dimensional Nexo | Resoluciones de runtime, carga por escena/vecindad y liberación; medir memoria real |
| P11 | Versiones ambiguas | Informe Prisma y datos R03 | Separar runtime/schema/content; conservar clave si compatible, migrar explícitamente si cambia schema |
| Nexo N01 | Clic de 500 ms se descarta | Fixture independiente | Selección sin requisito de rapidez; mantener distinción respecto a arrastre |
| Nexo N02 | README conserva crucetas/REDUCED antiguos | Lectura directa | Reconciliar documentación con versión entregada |

No se normalizan aún todas las severidades a P0. Se conservan los IDs de Prisma y se ordenan por impacto en continuidad, operabilidad y escalado; el cierre y retest quedan pendientes.

## Matices que deben formar parte de la orden final

1. **Memoria:** los seis PNG principales suman 37 740 384 bytes como RGBA8 (37,74 MB / 35,99 MiB); los 26 del banco, 163 542 144 (163,54 MB / 155,97 MiB). Son estimaciones de un buffer por imagen mediante ancho×alto×4, no medición del proceso/GPU ni total de canvases y copias. Las cifras aproximadas de Prisma corresponden a MiB. WebP/AVIF no garantizan reducir RAM decodificada con las mismas dimensiones y formato de salida. Además de comprimir, controlar resolución, carga, caché y recursos, comprobando máscara/alfa tras cualquier derivado. Documentación primaria consultada: https://developers.google.com/speed/webp/docs/api
2. **Target size:** mantener el canon Iris Green de controles ≥44 px. El mínimo AA de WCAG 2.5.8 es 24×24 CSS px con excepciones; no usarlo para rebajar el canon. Fuente: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
3. **NONE:** no cambiar ni desplazar innecesariamente lo observado. En R03 `apuntar()` cuantiza la coordenada en NONE; esto afecta a entradas posteriores, no demuestra por sí solo salto de la luz al cambiar el selector. Medir posición y geometría en cada transición.
4. **Cancelación tras arrastrar:** la prueba debe exigir que cancelar no añada una nueva acción. No asumir rollback al punto inicial de un pan ya realizado si el producto no lo define.
5. **Rasgos:** vincular visibilidad a pistas relevantes es mejor que superficie genérica, pero no certifica reconocimiento mental ni debe exigir iluminar un punto exacto. Ayuda opcional y examen parcial útil; identificación por acción explícita.
6. **Versión de guardado:** cambiar sólo el nombre de una clave puede borrar continuidad. Declarar compatibilidad y migración, sin renombrar por estética de R03.

## Integración de propuestas de mundo vivo

Coincidencia fuerte: conservar núcleo, dar función al hábitat, variar señales/consecuencias y mantener controles sencillos. Se incorporan a la comparativa las ocho familias propuestas por Prisma (luz, vegetación, arena, refugio, observación, seguimiento, respuesta provocada y camuflaje), junto a banco y postura sobre sustrato desarrollados por Nexo. No se convierten automáticamente en ocho requisitos definitivos.

- Asomarse a refugios, cambiar perspectiva y observar camuflaje pasan a candidatos principales de prototipo.
- Apartar vegetación puede explorarse como interacción reversible y accionable por clic/teclado, con significado y geometría definidos; no exigir drag.
- Remover arena, alimentar, tocar rocas, vibraciones o atraer animales necesitan justificación por especie y propósito. El hábitat por sí solo no demuestra esa respuesta. No generalizarlo a 200 animales.
- Esperar debe ser voluntario: opción equivalente «Ver siguiente momento», sin tiempos obligatorios ni pérdida de descubrimiento en NONE.
- Destellos, burbujas y rastros necesitan procedencia y función. Bioluminiscencia, reflexión y camuflaje son fenómenos distintos; no intercambiarlos como decorado.
- Los cinco biomas son una hipótesis de organización, no cobertura validada del inventario. Falta cruzar costa, mar abierto, agua dulce, región y especies disponibles.
- Separar profundidad física de posición dentro del hábitat: superficie/media agua/fondo no reemplazan rango de metros; el fondo puede estar a distintas profundidades. Tampoco `bioluminiscencia` es una forma de ocultación equivalente a una grieta.
- Mantener el contrato canónico ACTION → CONSEQUENCE → INFERENCE → REVEAL: detectar o iniciar una animación no autoriza identificación automática.

## Siguiente consolidación

Al recibir nuevos informes: anotar referencia/artefacto/autor, incorporar hallazgos no duplicados, registrar divergencias y distinguir demostraciones de propuestas. Después cerrar una orden con correcciones de base, primer prototipo de encuentros y criterios de retest/HUMAN QA. No construir aún la ampliación ni cambiar los assets aprobados.

Estado actual: KEEP_CORE · REVISIONES_EN_CURSO · SIN_PASS_FINAL · NO_MAIN · NO_PUBLIC_DEPLOY.
