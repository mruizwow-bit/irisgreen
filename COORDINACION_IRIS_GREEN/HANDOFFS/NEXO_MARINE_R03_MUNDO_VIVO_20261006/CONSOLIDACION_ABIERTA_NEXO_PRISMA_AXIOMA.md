# Vida marina R03 · Consolidación abierta Nexo / Prisma / Axioma

Fecha: 2026-10-06. Estado: RECOPILANDO_REVISIONES · CONTRATO_Y_ORDEN_FINAL_PENDIENTES.

María pide incorporar lo indicado por Prisma y seguir analizando mientras aporta las siguientes conclusiones de Prisma y Axioma. Se registra la información recibida; no se implementa todavía ni se cierran decisiones pendientes de contraste.

## Fuentes y atribución

- Prisma: COORDINACION_IRIS_GREEN/FORMACION/ESTUDIO_COMPARADO_CLAUDE_20261005/PRISMA_REVISION_PECES_R03_20261006.md, leído directamente en commit 59b0d8c97b0d645896bf5331a684f1c861acd38d.
- Ampliación de diseño de Prisma: texto íntegro aportado por María en Texto pegado(20261006-052043).txt, leído. Sus identificadores internos de citas de otro chat no son evidencia recuperada por Nexo; los principios comunes tienen fuentes propias en ANALISIS_Y_PROPUESTA.md y formación Nexo 09/10.
- Nexo: ANALISIS_Y_PROPUESTA.md, analizar.cjs, RESULTADOS_R03.json en este directorio; revisión en commit a52826444c9338d67c2406e8a3c59cc155bff54c.
- Axioma, revisión de R03: COORDINACION_IRIS_GREEN/HANDOFFS/AXIOMA_DESCUBRIMIENTO_PECES_R03_20261006/ANALISIS_MEJORAS.md, leído en 0c9b28602a61f6446208f02b936259eb58b51da8.
- Axioma, investigación 200+: COORDINACION_IRIS_GREEN/FORMACION/ESTUDIO_COMPARADO_CLAUDE_20261005/AXIOMA_MARINE_200_PLUS_WORLD_RESEARCH.md, leído en dcfba89949dbba718de9b42e96d41d273c5a7beb.
- Prisma, estudio ampliado: COORDINACION_IRIS_GREEN/FORMACION/ESTUDIO_COMPARADO_CLAUDE_20261005/PRISMA_ESTUDIO_DESCUBRIMIENTO_MARINO_200_PLUS_20261006.md, leído en ad32eb965c129a02e468f8f19cd16cfa1bd5baa3.
- Marcador de Axioma: AXIOMA_MARINE_R03_KEEP_CORE__TARGETED_REWORK_BEFORE_SCALE. Es recomendación de rework, no PASS final.

Las tres huellas de APP/ASSETS/vídeo coinciden entre Axioma, Prisma y Nexo. Se comparan los mismos binarios. Nexo no vuelve a etiquetar como propios los ensayos de navegador o mediciones de Prisma.

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


## Incorporación de Axioma y ampliación de Prisma · 2026-10-06

Los números A01–A14 siguientes corresponden a las secciones del informe canónico de Axioma; su resumen en chat agrupa algunos apartados. Son referencias de esta consolidación, no nuevos gates.

| Axioma | Relación con matriz previa | Aporte y verificación necesaria |
|---|---|---|
| A01 | P09 | Build producto separada; false no basta si siguen incluidos datos privados, bancos o rutas de equipo |
| A02 | Nuevo | Retirar Subir/Bajar tramo sin destino. Nexo corroboró handlers que sólo avisan; no inventar tramos para conservar botones |
| A03 | P01, N01, matiz NONE | Clic lento, cancelación y precisión: tres pruebas distintas, sin exigir rapidez |
| A04 | Nuevo | Reflow interno a 320/390/1440, texto 200 %, candidatos, identidad, controles, álbum, visor y ajustes; scrollWidth global no basta |
| A05 | P07/P08 | Movimiento de píxeles no prueba natación. Trayectoria, pose, giro y revisión perceptual continua |
| A06 | Nuevo | Copy «tramo validado» contradice HEREDADO. Nexo localizó literal en i18n.js; taxón/talla/zona pendientes no se cierran con un cambio de texto |
| A07 | Amplía accesibilidad | Ayuda guiada explícita y orientación relativa opcional; conservar acceso directo asistido sin exigir búsqueda previa |
| A08 | P06 | Calibrar rasgos y legibilidad por morfología; oscuridad/misterio requieren observación humana |
| A09 | Nuevo | Descripción de visor duplicada entre alt y texto. Revisar aportación visual antes de decidir alt breve o vacío |
| A10 | Nuevo | avisar() evita repetir mensaje idéntico: verificar reanuncio de acciones deliberadas con lector real, sin anunciar cada frame |
| A11 | Nuevo | touch-action:none observado en CSS; probar convivencia entre pan de escena y scroll de página en dispositivo real |
| A12 | P10 | Memoria, recursos, tiempos de frame y móvil real antes de escalar |
| A13 | Amplía assets QA | Barrido perceptual de cada par luz/oscuro; hashes y cajas alfa no prueban continuidad anatómica |
| A14 | P11 | Versiones separadas, compatibilidad y migración explícita |

Axioma enumera entre KEEP «candidatos reconciliados por id y foco conservado». Prisma reproduce pérdida cuando se elimina el candidato enfocado. No son pruebas equivalentes: conservar foco al actualizar un nodo NO garantiza conservarlo al retirarlo. P03 permanece abierto.

Nexo ha corroborado por lectura de fuente los controles de tramo, literal de validación, criterio T10 y touch-action. No convierte esa lectura en prueba propia de lector de pantalla o teléfono físico.

### Decisiones de diseño que todavía necesitan precisión

1. **Movimiento y densidad independientes.** Axioma separa Motion/Presence; Prisma reduce también densidad en REDUCED. Propuesta Nexo: dos preferencias independientes. Densidad regula sólo ambiente prescindible; no elimina animales descubribles, refugios ni pistas necesarias. Movimiento regula también animación de vegetación/partículas. NONE no conserva una excepción vaga «animación si la acción lo necesita»: usar estados discretos y avance voluntario, sin desplazamientos automáticos.
2. **Gramática condicionada, no producto cartesiano.** Bioma × escondite × pista × conducta × interacción × rasgo describe dimensiones, no combinaciones libremente intercambiables. Sólo encuentros expresamente compatibles, sustentados por especie y localidad. La regla de variedad cede ante coherencia ecológica y elección de permanecer/repetir.
3. **Encuentros no son especies únicas.** 8×5×5–7 son 200–280 plazas/encuentros. Una misma especie puede ocupar varias. Matriz de cobertura separada por taxón único, assets disponibles, fuente, escena pública y descubrimiento alcanzable. Cinco u ocho hábitats son candidatos, no inventario cerrado.
4. **Una ayuda no es una penalización.** Orientación relativa y ayuda guiada deben ser elecciones equivalentes, nunca pasos obligatorios añadidos a personas que usan teclado/lector. Sin nombres antes de identificar, salvo contenido ya descubierto.
5. **Ratón directo y acción contextual.** En R03 clic orienta luz; en propuesta futura puede seleccionar indicio. No superponer ambos efectos de modo ambiguo. Definir por estado qué significa el clic y qué consecuencia visible produce. Arrastrar no confirma; flechas físicas mueven vista. Alternativa de puntero simple al drag, además del teclado.
6. **Asomarse exige geometría real.** Desplazar lateralmente una escena 2D no permite por sí solo mirar detrás de una roca. Definir vistas discretas u oclusión/capas coherentes; render, selección, máscara y descripción deben compartir visibilidad. No llamar «rodear» a esconder una capa sin consecuencia espacial.
7. **Primer dato ligado al encuentro.** Si se observó refugio, explicar refugio; si se observó cardumen, explicar agrupación. No atribuir al ejemplar una conducta sólo porque esté en los metadatos. Identificación sigue siendo explícita.
8. **No forzar espera ni persecución.** Observar puede ser voluntario; alternativa «Ver siguiente momento» con el mismo contenido. Director no roba un objetivo seleccionado, no mueve cámara y no penaliza tardanza.
9. **La ciencia guía, pero no certifica UX.** La ficha consultada de Tang/Kirman describe encuesta de 482 participantes y múltiples dimensiones de curiosidad. No establece regla universal de «máximo dos repeticiones», ni garantía para usuarios neurodivergentes. Es hipótesis de diseño a observar. CAST también indica diferencias individuales en cantidad y tipo de elecciones preferidas.
10. **Ocho familias de movimiento son una hipótesis de organización.** Agrupan dimensiones distintas (cinemática, conducta, agrupación). Separar locomoción individual, actividad/refugio y comportamiento colectivo permite un pez flexible que además forme cardumen sin motores duplicados.

### Piloto propuesto por Nexo: dos preguntas sucesivas

**Paso A — comprobar calidad completa.** Una localidad documentada con roca y borde de arena, si los assets/taxones disponibles la permiten. Objetivo orientativo de 8–10 animales y hasta seis tipos de encuentro; reducir el número si falta respaldo. Debe ser experiencia ejecutable completa: entrada, indicio, acción, consecuencia, identificación, explicación contextual, retorno y ayudas. Sin inventar convivencia para alcanzar la cuota.

**Paso B — comprobar transferencia.** Ampliar hasta doce encuentros de evaluación repartidos en tres contextos ecológicos distintos. Reutilizar componentes del paso A; no exige doce adicionales. Validar qué lógica se reutiliza y qué cambia en luz, vegetación y refugio. «Roca/profundidad» no sirve como bioma único: sustrato y profundidad son ejes diferentes.

Primero probar si una escena se entiende y resulta interesante; después si la gramática funciona fuera de ella. Así se aprovecha el piloto concentrado de Axioma y la variedad de Prisma sin levantar tres mundos a medias.

### Orden de trabajo futura, todavía no emitida

1. Patch de integridad de interacción y continuidad (cancel, clic lento, precisión, perfiles, foco, Enter múltiple, dt).
2. Entrega de producto y presentación honesta (sin controles muertos, datos HEREDADO, CTA próximo, ayuda y canon NAVY).
3. Revisión independiente del artefacto exacto: estados dinámicos, reflow interno, pareja luz/oscuro, natación perceptual y dispositivos reales.
4. Piloto A, observación María, piloto B; sólo después cobertura del inventario y ampliación.

Son secuencias propuestas; no representan implementación, HUMAN QA PASS ni autorización para publicar.

### Fuentes externas contrastadas por Nexo en esta incorporación

- https://eprints.whiterose.ac.uk/id/eprint/210197/ — ficha y resumen del estudio de curiosidad, no lectura del artículo completo ni prueba del umbral antirrepetición.
- https://udlguidelines.cast.org/engagement/interests-identities/choice-autonomy/ — elección significativa y diferencias individuales.
- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html — animación por interacción y posibilidad de desactivarla; NONE estricto es decisión de producto, no cita literal de WCAG.

Estado: TRES_APORTACIONES_INCORPORADAS · CONSOLIDACION_ABIERTA · KEEP_CORE · TARGETED_REWORK_BEFORE_SCALE · SIN_PASS_FINAL.
