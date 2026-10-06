# ORDEN CONSOLIDADA A CLAUDE · PECES R06.1
Fecha: 2026-10-06.
Estado: ORDEN_DE_PATCH_ACOTADO.
Objetivo: conservar R06 y corregir regresión temporal, contrato de observables y preparación de HUMAN VISIBILITY QA.
NO MAIN · NO PUBLIC DEPLOY · NO ESCALADO A 200+.

## Fuentes y base exacta
Producto R06 SHA256:
917548b0a710ed2f17a9264e9516a0bd329f86511fe514fc8f5adf52962f6e03.
Interno R06 SHA256:
3d1cfd216adbde27be5d898f63c8d60f44650f93293eee9d402feaec91358bd2.
Axioma: commit 32774056dae8bb62d5eba2b51a1d6674cda21c49,
COORDINACION_IRIS_GREEN/HANDOFFS/AXIOMA_DESCUBRIMIENTO_PECES_R06_20261006/REVIEW_R06.md.
Nexo: carpeta COORDINACION_IRIS_GREEN/HANDOFFS/NEXO_MARINE_R06_20261006/,
RETEST_R06_Y_PATCH_ACOTADO.md, retest.cjs y RETEST_RESULTS.json, commit de evidencia c046c7919dcfcb3eed56ddc0717341cce6efd3bf.

Prisma: commit 47cc3f5906d320c06343b550790b6548f4a20b9e,
COORDINACION_IRIS_GREEN/FORMACION/ESTUDIO_COMPARADO_CLAUDE_20261005/PRISMA_REVISION_MARINE_R06_OBSERVABLES_20261006.md.

Esta orden reconcilia los tres informes. El KEEP de fase de Axioma se refiere a continuidad de pose. NO cierra la nueva regresión de trayectoria reproducida por Nexo sobre el mismo hash. No repetir R05 ni rehacer el motor.

## KEEP
Máscara/composición alfa, registro global aplicado, cámara, gestos directos, cancelación, precisión de puntero, confirmación contextual, event.repeat, foco, reanuncio, separación Movimiento/Vida ambiental y ajustes de reflow.
Mantener esquema v2 y separación cuerpo/observable/dato posterior. NAVY, tipografías, ES/EN y seis PNG fuente intactos.
No simplificar a cuestionario ni exigir que la persona nombre un rasgo.

## A · Separar fases y corregir trayectoria
avanzarNado incrementa p.fase; posicionMundo y reanclarPorMovimiento leen la misma variable como offset de ruta. La primera usa ciclos y la segunda radianes.
Resultado NORMAL reproducido:
- Hacha: periodo horizontal declarado 31 s, efectivo 4,9465 s.
- Linterna: 24 s, efectivo 5,7628 s.
- Calamar: 38 s, efectivo 12,1839 s.
Crear estados independientes: faseOndaCiclos acumulada y faseRecorridoRad del slot, u otra separación equivalente documentada.
Conservar posición y pose al cambiar perfil; NONE congela la pose actual, no devuelve al ancla.
Revisar vx para que represente la trayectoria ejecutada, incluida la contribución del desvío cuando corresponda.
Pruebas: instante de transición + evolución posterior durante al menos un periodo. Comparar 30/60/120 Hz con iguales tiempos; NORMAL/REDUCED/NONE, pausa y reanudación. Informar unidades de mundo separadas de píxeles de pantalla.
No exigir una arquitectura física nueva ni ajustar visualmente parámetros para ocultar el error.

## B · Política de observables bloqueados
Calamar: activo:false y BLOQUEO_LOCAL no significan NO_OBSERVABLE_REQUIRED.
Para R06.1, conservarlo visible, pero NO examinable mientras no tenga al menos un observable válido habilitado conforme a su regla. La vía guiada puede encuadrarlo, pero no saltar la restricción ni anunciar que está listo para examinar.
Copy de usuario breve: se puede observar, la identificación no está disponible todavía. Motivo técnico completo sólo en informe.
Conservar ids y álbum previo; no borrar descubrimientos antiguos por el bloqueo de esta revisión.
Vías de cierre posterior: pareja corregida por Biblioteca con evidencia exacta, o nuevo observable realmente sustentado y revisado. Claude no debe regenerar los PNG como parte de este patch.
Separar conceptualmente estado bloqueado, configuración inválida y caso deliberado sin requisito observable; no hacerlos equivalentes porque la lista activa esté vacía.

## C · Hacer operativo el esquema
El motor debe consumir bodyContext.requiredFraction y bodyContext.muestras; normalizar campos legacy sólo para compatibilidad declarada. No mantener dos fuentes que puedan divergir.
Validar geometría activa: puntos vacíos, inválidos o fuera del sistema declarado no equivalen a 100% observado.
Validar coherencia de activo/localRegistrationQA/estado provisional. No convertir los cortes IoU provisionales en ley científica.
Conservar lectura de guardados anteriores; declarar tratamiento seguro de versión desconocida sin sobrescribirla como si fuera válida.

## D · Regenerar material perceptual
Nexo ha inspeccionado las capturas entregadas 15,16,17: hacha se representa prácticamente de canto. Axioma identifica correctamente que esos casos no sirven como evidencia principal del rasgo 'silueta alta y aplanada'.
Separar dos grupos internos:
1. Casos de frontera válidos para el rasgo: cuerpo >= umbral corporal, pose no de canto, geometría válida, objetivo visible, resto de reglas satisfechas. Variar sólo la cobertura del observable alrededor de su umbral.
2. Adversos: de canto, contexto insuficiente, rasgo fuera de viewport o fuera de luz, bloqueo local, etc.
PRECISIÓN: un caso justo por debajo del umbral de observable será correctamente NO examinable por esa única condición. No filtrar todos por examinable=true, porque se eliminaría precisamente la mitad inferior de la frontera. Guardar motivo esperado de no examinabilidad.
Capturas sin copy, nombres o respuesta. Clave técnica separada con id, pose/giro, viewport, zoom, luz, contexto, fracción observable, examinable real y razón.
Usar la lógica real del motor, sin cambiar umbrales para forzar el resultado. Si hay fixtures, declararlos.
Matriz explícita animal × encuadre × nivel: actualmente 18 linterna, 5 hacha sólo en B, cero calamar. Cubrir el hacha en más de un tamaño/encuadre; declarar combinaciones no alcanzables y motivo. No inventar cobertura del calamar mientras está bloqueado.
humanVisibilityQA sigue PENDING hasta revisión humana. La pregunta permite señalar/describir sin términos técnicos ni tiempo. No trasladar esta prueba al flujo público como examen.

## E · Revisión de los observables existentes
Hacha: mantener el contorno como representación propuesta; revisar visualmente el par en esa región. Hasta cierre, estado explícito PROVISIONAL_ACTIVE_FOR_PROTOTYPE. No escalarlo como patrón aprobado por justificar el IoU con grosor de línea.
Linterna: revisión visual de los 24 centros sobre ambos assets para excluir ojos/reflejos/brillos ajenos a las hileras pretendidas. Clasificar como ASSET_DERIVED_REPRESENTATION. Detección por luminancia no valida anatomía.
Mantener procedencia factual heredada/sin revalidar hasta completar la revisión por afirmación de §I. La revisión visual del dibujo tampoco verifica taxón, talla o hábitat.

## F · Evidencia portable y entrega
Hacer que scripts reciban rutas reales del paquete extraído. Quitar dependencia obligatoria de /opt/pw-browsers/chromium; admitir navegador Playwright instalado y override opcional.
Registro local: comparar bajo un ROI fijo, transformando la máscara completa antes de recortar; no comparar búsquedas que recortan y desplazan en orden distinto. Evitar wrap al desplazar. Conservar la medición anterior para trazabilidad.
Distinguir pruebas puras, estado inyectado, híbridas y recorridos completos por interfaz. Sonda con mutadores no se etiqueta 'sólo lectura'.
Lámina canónica: copia incluida en ZIP interno; nombre/version/hash inequívocos. Imagen suelta derivada no se declara idéntica en bytes.
Entregar producto e interno R06.1, hashes, manifest, resultados y matriz de pendientes. Capturas deben corresponder al runtime corregido, no a R06.
Gate de entrega: CLAUDE_MARINE_R06_1_PATCH_READY_FOR_REVIEW.
Secuencia: RETEST TÉCNICO (incluida trayectoria) → AXIOMA PRECHECK PERCEPTUAL → HUMAN VISIBILITY QA → DECIDIR UMBRALES → IMPLEMENTAR MICROESCENA.
Puede avanzar el inventario y diseño de microescena en paralelo como documentación; no multiplicar todavía esta plantilla a 200+ especies.
STOP antes de main o despliegue.

## G · Tamaño aparente y región significativa (incorporación de Prisma)
La fracción iluminada no basta para demostrar perceptibilidad. Añadir a la evidencia tamaño proyectado del observable en píxeles CSS, zoom, viewport y DPR, distinguiéndolo del tamaño del animal y de píxeles del bitmap.
Preparar tamaños grande/medio/pequeño y casos límite a 320/390/1440. Registrar también el tamaño visible efectivo: una caja extensa no garantiza que sus puntos o trazos sean distinguibles.
minimumApparentExtentPx es un parámetro candidato a calibrar, no un número aprobado. Antes de HUMAN VISIBILITY QA permanecerá pendiente, sin introducir un bloqueo arbitrario de 40/60/80 px. Registrar cómo se mide para cada familia de rasgo; no imponer un único tamaño global.
Si la revisión humana justifica un mínimo, implementarlo y retestarlo después, con ayuda contextual como «Acércate un poco para observar este detalle» y vía equivalente de zoom/encuadre.
Hacha: incluir adversos con cola/aletas iluminadas y tronco insuficiente. Evaluar si el contorno completo permite aprobar sin percibir la forma pretendida. Si ocurre, limitar la geometría al tronco que define el rasgo y repetir registro local y pruebas. No recortar para mejorar IoU ni cambiar la silueta por mera preferencia.
Linterna: comparar varios tamaños y revisar manualmente los 24 centros; no sugerir la respuesta en la pregunta humana.
No declarar PASS automático por porcentaje, extensión en pantalla o fuente zoológica.

## H · Selección por intención y contexto estable
Separar elegibilidad, elección del objetivo y confirmación. Un score nunca hace elegible a un animal bloqueado.
La intención explícita prevalece: click/tap sobre cuerpo o indicio seleccionable → ese objetivo; elección deliberada mediante «Otro animal» o vía accesible → conservar ese id mientras siga siendo válido. No revelar el nombre antes de identificarlo.
Si el gesto no identifica inequívocamente un objetivo, proponer por proximidad espacial al punto señalado, después calidad observable y contexto corporal como desempate. Comparar distancias contra geometría visible; evitar que el centroide de un animal grande desvíe una pulsación hecha sobre otro.
Este orden es una propuesta de interacción que debe probarse, no una ponderación científica ya validada. En solapamientos ambiguos, permitir elegir sin examen automático.
No reordenar la selección en cada fotograma por cambios pequeños de fracción. Señalar claramente cuál está seleccionado sin depender sólo del color; mantener foco y equivalencia de teclado.
Pruebas: señalar el animal pequeño junto al grande más iluminado; solapamiento; dos candidatos que intercambian fracciones mientras nadan; elección con «Otro animal»; desaparición del elegido; cancelación; teclado sin puntero.
Confirmación: invalidar ante cambio deliberado de objetivo o cambio relevante de contexto que haga equívoca la señal (pérdida de elegibilidad, nuevo encuadre/luz, descripción espacial ya incorrecta). Conservar la protección de event.repeat.
NO introducir por defecto una cuenta atrás ni caducidad de pocos segundos: penalizaría a quien necesita más tiempo. El simple nado no debe provocar un ciclo infinito de reanuncios. Estabilizar la escena al elegir, o mantener seguimiento visual inequívoco; documentar y probar la opción sin romper la pausa manual.
Probar una confirmación lenta sin cambios relevantes, y otra después de un cambio real de contexto. Distinguir resultado esperado de evidencia efectivamente ejecutada.

## I · Fuentes por afirmación, con alcance explícito
Asociar cada revealFact y rasgo factual a claimId, texto ES/EN, taxón/alcance, URL, fecha de consulta y estado de revisión. Mantener separada la decisión de representación del dato zoológico.
Fuentes contrastadas el 2026-10-06:
- https://www.mbari.org/animal/glass-squid/ — Cranchiidae; transparencia/camuflaje a nivel de familia. No valida la anatomía del PNG ni el registro de brazos.
- https://ocean.si.edu/ocean-life/fish/lanternfish — ejemplo Diaphus sp. con fotóforos ventrales. No valida automáticamente los 24 puntos ni características de cualquier especie de la familia.
- https://www.montereybayaquarium.org/animals-the-ocean/animals-a-to-z/hatchetfish — página de Sternoptyx obscura, con órganos luminosos ventrales. No usarla por sí sola para dar por documentada la frase «pequeña hacha» o la orientación de ojos: localizar la fuente que respalde esa afirmación.
No copiar talla, profundidad o distribución de una especie de referencia a un asset identificado sólo por nombre común. Resolver el taxón o mantener la afirmación pendiente y expresada al alcance que la fuente sostenga.
El registro visual, la validación factual y HUMAN VISIBILITY QA son estados independientes.
Estas incorporaciones amplían la misma orden R06.1; no crean un encargo paralelo ni reabren el diseño general. Sigue vigente la secuencia y el STOP de §F.
