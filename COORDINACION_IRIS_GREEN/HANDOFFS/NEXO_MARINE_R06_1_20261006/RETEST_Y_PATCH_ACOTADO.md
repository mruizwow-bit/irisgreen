# Nexo · retest independiente Peces R06.1
2026-10-06.
Gate: NEXO_MARINE_R06_1_KEEP_CORE_TARGETED_EVIDENCE_AND_SELECTION_PATCH_REQUIRED.
NO MAIN · NO DEPLOY · NO REGENERAR ASSETS.

## Base exacta y método
Producto: 8a96259b802176dd6e1aeb30b838586d5c36bd27be5ff83d160786e8a0a2fcc7, 6.407.339 bytes, 35 archivos, 34/34 manifest PASS.
Interno: 07949fbc4d430187654e8791d5b716b6dbe97abc6dcbe110f269f15a368de441, 16.398.992 bytes, 132 archivos. No se declara manifest interno verificado si no se entrega uno.
Los seis PNG de producto coinciden byte a byte con R06.
Lámina canónica interna: 1760×2630 RGB, SHA256 9a060fd825ed6d93f824084339a8c4aba8e73c325d7b6e4f56e1c66a133542f4.
Adjunto suelto recibido: 1370×2047 RGBA, SHA256 ea87c4930521c9a9942295ed9aa248d153e4f9f5a56b1ab3413e9fc08064b7e7. No son mismos bytes; usar interna como referencia. No se atribuye la transformación a nadie.

Leídos motor, interfaz, datos, generadores, banco R06.1, clave de 93 casos y notas. Inspección visual de la lámina canónica y caso065. Nexo ejecutó motor.js original en Node VM con dibujo no operativo, Image simulado y reloj controlado: funciones y datos reales, no render. Reproducciones adjuntas. NO repetición propia de29 pruebas Chromium, teléfono o lector; esos29 siguen siendo evidencia del autor.

## KEEP confirmado
- Fases independientes: periodos horizontales 31/24/38 segundos en pasos de1/30,1/60,1/120s durante90s; desviaciones sólo numéricas (~1e-11s). Esto verifica independencia del paso de simulación, no rendimiento físico a120fps.
- Transiciones tras40s: salto máximo de posición4,55e-13 unidades de mundo (redondeo), onda0 en el diagnóstico. No confundir con revisión perceptual de natación.
- Calamar no examinable:342 posiciones de luz probadas,0 aprobadas.
- bodyContext.requiredFraction es operativo: fixture de linterna con requisito0,99, cuerpo0,6423 y observable cumplido devuelve no examinable.
- 55 casos de frontera,38 adversos,91 combinaciones no alcanzadas declaradas; separación correcta entre frontera inferior y examinable. Mantener humanVisibilityQA PENDING y mínimo aparente null.
No reabrir fases ni el bloqueo actual del calamar.

## R061-N01 · P1 · El producto sí admite dos candidatos
La afirmación «la escena nunca puede dar dos candidatos» excede el barrido fijo entregado. Contraejemplo del motor con catálogo, slots, umbrales y bloqueo del calamar INTACTOS:
- lienzo CSS1280×520;
- tiempo simulado6s;
- cámara normalizada x0,25 y0,5 zoom1;
- luz x0,30 y0,20;
- giro hacha−1, linterna+1 (coherentes con sus direcciones en ese instante).
Resultado simultáneo:
- hacha: contexto1, observable1, examinable;
- linterna: contexto0,836538, observable0,85, examinable.
La cámara/luz/reloj se prepararon por API/estado: no se presenta como recorrido humano. Reproducir el mismo caso en navegador antes de certificarlo visualmente.
Corregir documentación a «no encontrado en la muestra inicial» y ampliar muestra temporal/cámara. Los fixtures siguen siendo útiles; no sustituyen este caso de producto.

## R061-N02 · P1 · Histéresis sin ensayo y selección parcial
HISTERESIS acepta pasos===0 como PASS. Resultado entregado:0 pasos,0 cambios. Debe ser NO_EJECUTADO o fallar la precondición; nunca demuestra estabilidad.
SENALAR-AL-PEQUENO enfrenta el hacha con el calamar bloqueado, que elegirSenalando excluye antes de competir. Demuestra adquisición del pequeño, no resolución entre dos elegibles.
Código: evaluar() ordena por fraccion corporal y propone examinables[0]; la histéresis también compara fraccion. La prioridad espacial de §H se aplica sólo dentro de elegirSenalando. Cuando no hay hit explícito, continúa faltando propuesta por proximidad, observable y contexto como desempate.
Patch: conservar adquisición directa y selección manual estable; completar propuesta automática según intención. Probar dos elegibles intercambiando coberturas con selección explícita y sin ella, con muestra efectiva >0, y un solapamiento ambiguo. Comprobar confirmación lenta con nado/contexto relevante, no sólo escena parada. No añadir reloj límite ni regenerar animales.

## R061-N03 · P1 de evidencia · Una captura no corresponde a su clave
En perceptibilidad.js:
1. se barre y almacena dei con el giro vigente;
2. se fuerza giro0,12 para adverso de canto;
3. se restaura SIEMPRE giro1, en lugar del giro anterior;
4. se capturan otros adversos usando medidas guardadas en dei.
Caso065 del hacha: clave giro−1, cuerpo0,279, observable0,528, no examinable por contexto. La PNG inspeccionada muestra el hacha con la orientación del asset original (giro+1). Esa clave no acredita la imagen.
Patch: guardar/restaurar pose exacta, volver a medir desde motor tras preparar cada captura y guardar esa lectura atómica con la imagen. Recalcular categorías si cambian sus condiciones. Regenerar los casos afectados, no descartar las55 fronteras útiles por defecto.
La revisión humana no puede decidir un umbral sobre una captura cuya clave corresponde a otra pose.

## R061-N04 · P1 antes de plantilla · Validación no reproducible desde entrega
Los datos actuales de los tres animales son coherentes; el calamar no presenta el bypass anterior.
Pero el loader confía en examinablePermitido/geometriaValida ya calculados y no valida la coherencia completa. Fixture explícito: linterna estado exigido, todos sus observables inactivos y examinablePermitido=true → examinable=true con contexto0,93269.
No es un fallo activado por el usuario en la escena actual: es el riesgo de aceptar datos incoherentes al ampliar.
La orden permitía validación en generación, pero el paquete no incluye un validador reproducible que produzca/verifique esos campos. Entregarlo y hacerlo obligatorio antes del build; alternativamente validar al cargar. Casos negativos: exigido sin activos, bloqueado con permiso, geometría vacía/fuera del sistema, umbrales no finitos/fuera de rango. Sólo sin-requisito-deliberado autoriza ausencia de rasgos.
No marcar «se valida en generación» como cerrado sólo por incluir booleanos true.

## R061-N05 · P2 · Scripts aún no portables y alcance del tamaño
observables.py ignora la ruta recibida y busca interno/build/descubrimiento-peces/assets/profundidad. Ejecución propia con ruta del producto: FileNotFoundError.
lamina.py conserva el mismo prefijo interno/build para assets y toma únicamente salida como argumento.
Los bancos JS nuevos sí reciben ruta; corregir la afirmación «todos» y pasar raíz de assets/producto y salida explícitas a Python. No reconstruir carpetas privadas para hacerlos pasar.
extensionAparente devuelve caja de todos los puntos proyectados sin recortar por viewport/luz; animalPx es rectángulo del sprite, no necesariamente cuerpo útil. Son medidas válidas si se nombran así, pero falta tamaño visible efectivo solicitado en §G. Registrar ambas medidas antes de calibrar un mínimo; no sustituir caja total por perceptibilidad.

## Documentación menor, sin reabrir motor
README conserva24 centros y métricas antiguas mientras datos/informe ya tienen23 y0,9766 para linterna. Lámina del calamar conserva «NO se exige para examinar», que puede confundirse con el fallback R06: debe decir claramente visible/no examinable.
La afirmación ojos-arriba sigue pendiente en datos pero refrescarFranja muestra todos los revealFacts sin filtrar estado. Mantener este pendiente factual explícito antes de publicación; no presentar una URL que no sostiene la afirmación como validación.
Las mediciones de tronco (3/595 casos bajo0,5) no deciden perceptibilidad: mantener región provisional y HUMAN QA.

## Siguiente orden acotada
1. Corregir N02 y la validación reproducible de N04, preservando KEEP.
2. Regenerar evidencia afectada N03, completar pruebas con dos elegibles N01/N02 y rutas N05.
3. Entregar patch e interno con hash, trazabilidad, matriz y resultados que distingan PASS/NO_EJECUTADO/PENDING.
4. Retest independiente y precheck Axioma del material perceptual; después HUMAN VISIBILITY QA. No pedir a María revisar93 capturas defectuosas o repetidas: seleccionar matriz representativa correcta.
Inventario y diseño documental de microescena pueden avanzar ya. Implementación/escala de plantilla sigue pendiente; sin main ni despliegue.


## Consolidación con Prisma · 2026-10-06
Fuente leída: PRISMA_REVISION_MARINE_R06_1_20261006.md, commit12f99a55a5eeeb879e04a3342a8cb2b20f5cf354, #323 comentario6013658799.
Esta ampliación se integra en la MISMA orden. Conserva R061-N01–N05 y sus reproducciones; no crea un encargo alternativo ni declara nuevo PASS.

### Nuevos criterios que incorpora el patch
1. **Tamaño del detalle, no sólo diagonal.** Prisma registra linterna examinable con observable de53,9×6,3px. Una diagonal~54px oculta que la hilera mide sólo~6px de alto. Añadir a la clave ancho/alto visibles y, según el observable, diámetro/separación de puntos o extensión del contorno. No confundir el alto de la caja con el grosor real de cada fotóforo. Mantener mínimos PENDING/null hasta prueba humana, sin inventar un escalar universal.
2. **BLOQUEADO-COPY por fila.** Añadir identificador estable de animal a la fila de señales y comprobar exactamente la del calamar. Fallar si falta la fila o el identificador; no concatenar toda la lista como fallback. Cubrir ES/EN y activación de la ayuda guiada, no sólo presencia de una frase.
3. **Nombres honestos de pruebas.** Renombrar DOS-CANDIDATOS-REALES a DOS-CANDIDATOS-FIXTURE cuando rehabilita al calamar. Añadir un caso separado con hacha+linterna sin modificar datos, basado en R061-N01. HISTERESIS requiere muestra efectiva y casos que crucen/no crucen el margen; pasos>0 por sí solo tampoco demuestra la propiedad.
4. **Contrato temporal preciso.**31/24/38s describen la componente horizontal; la vertical usa0,73 veces ese periodo. No es una nueva regresión ni exige rediseñar la ruta. Documentar ambas componentes en segundos y hacer el nombre inequívoco; si se renombra a periodoHorizontal, mantener lectura compatible del campo antiguo y actualizar consumidores/pruebas. No prometer retorno de la trayectoria2D completa tras un periodo horizontal.
5. **Fuente enlazada al dato operativo.** Cada sourceTrait factual y revealFact necesita claimId estable, estado y alcance; el registro de afirmaciones debe resolverlo. Incluir hacha/silueta, linterna/hileras y cuerpo-alargado; no basta sidecar con URLs. Para afirmación sin fuente, usar registro PENDING explícito y tratamiento editorial coherente; no promoverla a validada. Verificador de integridad: IDs ausentes/duplicados/referencias rotas y contradicción de estados entre datos/sidecar. No exigir corroboración zoológica a una decisión puramente visual que esté declarada como representación.
6. **Límite del hit-test.** d<=2px respecto a muestras no significa interior exacto de silueta. Corregir documentación y añadir casos de bordes, zonas transparentes, apéndices y dos elegibles a varias escalas. No cambiar todo el motor de selección preventivamente: conservar aproximación si satisface casos pertinentes; adoptar máscara u otra geometría si se demuestra fallo. No usar puntos ocultos como evidencia de intención.

### Reconciliación de las diferencias
- «0 solapes en19.208 posiciones» se conserva como resultado de ESE barrido del autor, no ley del producto. R061-N01 ya aporta contraejemplo lógico independiente a6s con los dos peces. Está pendiente reproducción browser; no borrarlo por repetir el texto anterior.
- El KEEP de selección se limita a la incorporación de elección explícita. No cierra fallback espacial pendiente ni prueba de histéresis vacía.
- El KEEP de validación cubre datos actuales y rechazo de geometría marcada inválida. No cierra el fixture incoherente ni ausencia del validador entregable de N04.
- La nueva revisión humana debe usar capturas/clave sincronizadas según N03. No usar caso065 actual para calibrar.

### HUMAN VISIBILITY y microescena
Preparar una selección breve y representativa de hacha/linterna: tamaños grande/medio/pequeño, ambos lados del umbral y adversos relevantes, sin nombres/copy sugerente. Pregunta abierta que permita señalar o describir; sin cronómetro ni terminología obligatoria. La valoración de María es evidencia de esta prueba, no estudio universal de todas las personas.
Conservar la posibilidad de revisar ejemplos frontera correctos mientras se arregla el paquete, pero no emitir HUMAN_VISIBILITY_PASS global con material inconsistente.
Inventario/diseño de microescena pueden avanzar AHORA como documentación. El banco actual conserva los tres animales; no confundirlo con la futura microescena variada de hábitat ni limitar permanentemente el producto a esos tres. Los nuevos encuentros requieren assets/datos compatibles y variantes de descubrimiento sustentadas. No colocar peces profundos en arrecife somero para reutilizarlos.
Secuencia vigente: patch técnico y de evidencia → retest/precheck Axioma → HUMAN VISIBILITY hacha/linterna → calibración si procede → microescena viva. NO MAIN · NO DEPLOY · NO ESCALA200+.
