# Nexo · Orden consolidada a Claude · Vida marina R05
Fecha: 2026-10-06
Estado: KEEP_CORE · TARGETED_RUNTIME_AND_OBSERVABLES_PATCH_REQUIRED
Destino: siguiente revisión aislada de R05. NO MAIN · NO PUBLIC DEPLOY · NO REGENERAR ASSETS.
Esta orden complementa el retest Nexo; no elimina sus dos residuos de runtime.

## 1. Base exacta y evidencia
Producto SHA256: 554b9fd5682cc7222df215efa58f544d13181c6ac62a449b51f7b12753097236.
Interno SHA256: 3cbe3db8c149ab24efc5d2388b2b14da20998791b5ea5ce310155a5e32de8818.
Axioma: commit 012d36793155db332be4cac49f80c72a667b291b,
COORDINACION_IRIS_GREEN/HANDOFFS/AXIOMA_DESCUBRIMIENTO_PECES_R05_20261006/REVIEW_REGIONES_OBSERVACION.md.
Nexo: COORDINACION_IRIS_GREEN/HANDOFFS/NEXO_MARINE_R05_20261006/RETEST_R05_Y_PATCH_ACOTADO.md;
retest.cjs y RETEST_RESULTS.json en la misma carpeta (commit cd9d8c2fd30a56ea9e8b5fa0f14c0db0a3922927).

Lectura y consolidación de informes, no nuevo retest del ZIP. Evidencia independiente de Nexo: fixtures Node/Canvas, no navegador. El informe de Axioma y los bancos del autor mantienen su propia procedencia.

## 2. KEEP y alcance
Mantener motor, dirección visual, escena de tres animales, cámara, gesto directo, separación tap/drag, cancelación, precisión de puntero, registro global corregido, giro con dt, controles de foco ya corregidos y separación del catálogo.
No reabrir esos cierres salvo regresión demostrada.
No incorporar 200 especies ni implementar ahora un sistema de comportamientos completo.
Se permite modificar las funciones necesarias para los dos bugs y el evaluador de observables. Mantener motor no significa congelar sus defectos.

## 3. Dos correcciones de runtime pendientes
A. Fase/pose:
NONE conserva centro, giro, fase y deformación visible completa. No recalcular la fase histórica multiplicando el reloj por una frecuencia nueva. Al entrar NONE, detener sin salto; al continuar, reanudar sin salto. NORMAL↔REDUCED mantiene continuidad y adapta la evolución futura.
Prueba en fase no nula: comparar geometría/imagen además de centro y giro, también REDUCED→NONE y reanudación.

B. Confirmación múltiple:
La confirmación pendiente pertenece al objetivo y al contexto actuales, no a una lista de IDs recordada indefinidamente.
Invalidarla al perder candidatos o cambiar objetivo/contexto. Una elección deliberada mediante Otro animal puede anunciar y establecer el nuevo objetivo.
Reproducir: A+B, anunciar A → ningún candidato → A+B con B elegido → primera activación informa, no identifica B usando el aviso antiguo.
Comprobar event.repeat: mantener Enter no confirma involuntariamente.
Conservar foco estable y equivalencia entre puntero y teclado.

## 4. Contrato de observación
Separar:
- BODY_CONTEXT_THRESHOLD: contexto corporal suficiente.
- OBSERVABLE_FEATURE_THRESHOLD: disponibilidad visual del rasgo específico.
- REVEAL_FACT: información posterior; no necesita ser condición visual.

El umbral indica que el rasgo está disponible para observar. No demuestra reconocimiento, comprensión ni identificación por parte de la persona.
No añadir cuestionario, obligación de nombrar el rasgo ni examen para desbloquear.
35 % y 50 % son parámetros heredados provisionales; no estándares científicos ni objetivos universales.

| Animal | Rasgo interactivo de esta revisión | Acción |
|---|---|---|
| Pez hacha | Silueta alta y aplanada | Anotar el contorno/contexto que permite apreciar esa forma. No presentar la caja corporal repetida como una segunda prueba independiente. Ojos hacia arriba queda como dato posterior sujeto a validación factual. |
| Pez linterna | Hileras luminosas ventrales | Sustituir la franja genérica por polígono, máscara o conjunto curado de puntos de las hileras. Tolerancia suficiente para ratón, touch y ayuda de teclado: no exigir acertar fotóforos individuales. |
| Calamar de cristal | Brazos agrupados al frente | Separar translucidez del manto como dato posterior. Retirar «cortos» si no está respaldado. Revisar específicamente el registro local de los brazos antes de usar esa región como condición. |

No excluir puntas defectuosas únicamente para subir una métrica. Si el rasgo no es usable con los assets existentes, declarar bloqueo local y pedir corrección a Biblioteca; no retocar ni regenerar originales.

## 5. Esquema mínimo extensible
Migrar los tres registros a observables[] con:
id, label, type, geometry (sistema de coordenadas explícito), requiredFraction, sourceTrait,
representationStatus, factualStatus, localRegistrationQA, humanVisibilityQA.
Separar bodyContext y revealFacts.
Declarar cómo se combinan varios observables: todos, cualquiera o grupos explícitos. No dejar esa lógica implícita.

Implementar únicamente los tipos necesarios para estos tres animales. Comportamiento puede quedar previsto como tipo futuro, sin inventar un evaluador basado en cobertura para él.
Geometría curada contra cada asset real y transformada igual que dibujo/registro/deformación.
Estados factual/representación/perceptual separados; no convertir una decisión de diseño en dato científico.
Declarar schemaVersion y conservar álbum/guardados existentes; documentar migración si cambia el formato persistido.

## 6. Dos oráculos complementarios
FEATURE_REGION_LOCAL_REGISTRATION:
Comparar luz/oscuro dentro de cada región útil, con la misma transformación, en ambos sentidos y poses representativas. Entregar superposición y residuos locales además de métrica global.
Para el calamar, inspección específica de brazos/puntas. Un IoU global de ~0.964 no resuelve ese defecto local.
No fijar un IoU universal ni declarar equivalencia anatómica porque las máscaras coinciden.

FEATURE_PERCEPTIBILITY_AT_THRESHOLD_ORACLE:
Preparar varios casos justo por debajo, en y por encima del umbral, variando dirección del haz y encuadre. Incluir casos adversos: mucha superficie sin rasgo, poco contexto, rasgo fuera de viewport.
Presentar capturas o secuencia sin nombre/copy revelador para revisión humana. La persona puede describir o señalar el detalle: no exigir terminología, habla ni taxonomía.
Esto es un procedimiento de QA del equipo, no una tarea obligatoria dentro del producto.
Si aún no se ha realizado, humanVisibilityQA = PENDING. No sustituirlo por porcentajes ni convertirlo en PASS automático.
Conservar una vía asistida que permita observar el rasgo sin precisión motora ni tiempo límite.

## 7. QA y pequeños ajustes
Reanunciar feedback importante de acciones deliberadas repetidas, sin anunciar cada frame ni saturar aria-live.
Mantener comprobación de clipping interno al 200 % en 320/390/1440; cubrir también visor, álbum, ajustes, identidad y candidatos abiertos. Las pruebas iniciales de página no cierran todos estos estados.
Conservar cancelación, foco, precisión, teclado y máscara fuera de viewport como regresiones dirigidas.
Separar pruebas con estado inyectado de recorridos reales de interfaz; documentar pendientes de lector de pantalla, teléfono y navegadores.
Corregir afirmaciones «idénticos al píxel» o «sin cambios anatómicos» si sólo se midió alfa/IoU.

## 8. Canon y entrega
NAVY: fondo #0B1A2B; panel #15304A; superficie #1D3D5C; texto #EEF4F8; secundario #C9D5DD; enlaces #9FDCEA; foco #C3B8FF; bordes #8494A8; separadores #2A4460; botón #DCE8F2 con texto #0B1A2B.
Atkinson Hyperlegible 1rem/1.6; títulos Newsreader 600/1.2. Targets >=44 px; foco distinto de selected; NORMAL/REDUCED/NONE y forced-colors. No tema claro.

Entregar:
- ZIP de producto ejecutable offline y SHA256/manifest verificados tras extracción.
- Paquete interno separado con pruebas, resultados y comparación antes/después.
- Lámina actualizada de los tres observables con geometría y copy correspondiente.
- Evidencia de registro local y casos perceptuales al umbral.
- Pendientes explícitos, sin PASS humano inventado.

Gate de entrega: CLAUDE_MARINE_R05_OBSERVABLES_PATCH_READY_FOR_REVIEW.
Después: retest independiente de Axioma sobre el nuevo hash → HUMAN QA María de nado y descubrimiento.
Puede avanzar en inventario/diseño de microescena; no escalar la plantilla a 200+ ni publicar antes de resolver estos puntos.
