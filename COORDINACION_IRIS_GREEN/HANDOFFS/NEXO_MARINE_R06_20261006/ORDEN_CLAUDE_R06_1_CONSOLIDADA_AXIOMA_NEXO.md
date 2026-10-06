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

Esta orden reconcilia ambos informes. El KEEP de fase de Axioma se refiere a continuidad de pose. NO cierra la nueva regresión de trayectoria reproducida por Nexo sobre el mismo hash. No repetir R05 ni rehacer el motor.

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
Mantener procedencia factual heredada/sin revalidar. La revisión visual del dibujo tampoco verifica taxón, talla o hábitat.

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
