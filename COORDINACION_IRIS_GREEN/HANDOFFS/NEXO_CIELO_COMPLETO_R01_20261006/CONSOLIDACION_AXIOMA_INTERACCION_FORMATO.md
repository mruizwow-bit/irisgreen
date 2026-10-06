# Nexo · Incorporación de Axioma · Cielo completo R01
Fecha 2026-10-06.
Estado: AXIOMA_INCORPORADO · CONSOLIDACION_ABIERTA · SIN_CAMBIOS_RUNTIME.

## Fuentes leídas
- Texto de María: Texto pegado(20261006-055314).txt, íntegro.
- Axioma: COORDINACION_IRIS_GREEN/HANDOFFS/AXIOMA_CIELO_COMPLETO_R01_20261006/ANALISIS_MEJORAS_INTERACCION_FORMATO.md, a075fab95ac657e19e1ccde6d805a461b0b29ce1.
- Probe Axioma: mismo directorio / INTERACTION_PROBE.json, 63e682f6bb2c7373d6511d982d37b2b519d2f322.
- Nexo: ESTUDIO_INTERACCION_FORMATO_Y_PROPUESTA_CLAUDE.md y fixtures, conjunto b6523a9641c2cc15dfe5080ec02cbd5ad50cab58.
Mismo ZIP SHA256 eaa15fcc98157f4d7f26c874a74d9d50bc8bc63061ca81067c56b66f01512bd6.

## Acuerdo principal
Conservar datos, assets y base estereográfica. Corregir continuidad y mejorar selección, pistas, entrada de escena y profundidad. La propuesta de Axioma no es PASS final ni autoriza main/deploy.

## Nuevo contraste cuantitativo independiente
Nexo ejecutó motor.js original, 4.000 puntos por campo × 12 campos × 3 tamaños = 144.000 llamadas.
Semilla LCG 20261006; zoom inicial 1.35; cámara inicial del motor; ninguna descubierta; muestreo uniforme sobre rectángulo completo. Horizonte lógico incluido por motor, sin oclusores de botones/panel. Tamaños del modelo de Axioma, no mediciones nuevas del DOM.

| Escena modelada | Axioma: media | Nexo: media |
|---|---:|---:|
| 296×352 (referencia 320) | 87,9 % | 84,28 % |
| 366×523 (referencia 390) | 69,3 % | 61,90 % |
| 1408×558 (referencia 1440) | 11,1 % | 9,58 % |

Se confirma una diferencia marcada entre configuraciones; NO se reproducen exactamente sus porcentajes. El JSON aportado por Axioma no incluye código, tamaño de muestra, semilla y detalle suficiente de distribución de cámara/máscaras para atribuir la diferencia a una causa concreta.

Estos números son tasa de aceptación de alguna constelación, no false-positive rate ni prueba de comprensión. Un punto aleatorio puede caer legítimamente sobre un patrón. Además las escenas difieren en área visible y escala: no aislar todo el efecto al mínimo de 88 px sin barrido controlado.

Acciones para la próxima prueba:
1. Fijar intención/verdad-terreno independiente: patrones ancla y vecindades anotados, incluyendo zonas sin patrón y casos ambiguos.
2. Separar hit target accesible en píxeles de evidencia semántica/angular de reconocimiento. No reducir tolerancia motora para fabricar dificultad.
3. Barrido de radio, zoom, FOV y cámara manteniendo comparables los patrones visibles; desglosar por campo.
4. Matriz patrón pretendido→resultado incluyendo ninguno/ambiguo, sensibilidad/especificidad y casos negativos explícitos.
5. Mapa de aceptación + observación humana, no sólo porcentaje deseado inventado.

Adjuntos: especificidad.cjs, ESPECIFICIDAD_RESULTADOS.json.
Conteo de pistas: 31 con plantilla literal magnitud positiva y una con magnitud negativa (Sirius); 32 comparten el prefijo y la misma semántica de plantilla. No cambia el diagnóstico de repetición. Los siete grupos de duplicados exactos coinciden con el análisis anterior.

## Qué incorporar y qué matizar

| Propuesta Axioma | Posición Nexo |
|---|---|
| Ocultar Campo 01…12 como entrada principal | Incorporar en formato. Entrada explorar/pista/cuaderno; zonas secundarias comprensibles |
| Cielo continuo y campos como chunks | Dirección a estudiar como trabajo de arquitectura separado; no fingirlo ocultando selector |
| Radio angular / firma | Incorporar investigación y pruebas, no asumir que cambiar unidades por sí solo resuelve intención |
| LOCATE y REVEAL para todas | Unificar modelo de estado y feedback; probar confirmación deliberada sin agregar un botón vacío repetido 88 veces |
| Cielo limpio | Mostrar figura activa y capa opcional de hallazgos; no ocultar lo observado por temporizador |
| Pistas/rutas con referencias | Incorporar como rutas opcionales; preservar exploración libre y cualquier hallazgo válido |
| Densidad de estrellas | Candidata posterior, subordinada a visibilidad/detección coherentes y contenido alcanzable |
| Ficha progresiva y panel sin oclusión | Acuerdo; respetar retorno de foco/cámara y escala aparente |
| Cuaderno cartográfico | Complementar con lista/búsqueda accesibles; no sustituirlas exclusivamente por mapa |

## El cielo continuo no es un patch visual
Axioma sí advierte en su informe canónico que cada campo tiene centro de proyección propio. Nexo confirma campos con centro ra_horas/dec_grados y estrellas en coordenadas proyectadas locales.
No pegar u/v de campos vecinos. Necesitará fuente esférica RA/Dec o vectores, conversión y reproyección, identidad estable de estrellas compartidas, vecindad, límites/dibujo consistentes, carga cancelable y preservación de dirección/FOV.

Primero prueba de costura entre DOS campos: sin estrellas duplicadas/perdidas, saltos, selecciones que cambien al cargar vecino ni geometría IAU desalineada. Sólo después generalizar.
HEALPix es una referencia de investigación de Axioma, no dependencia aprobada ni obligación para 88 constelaciones.
Hasta existir continuidad verdadera, presentar zonas preparadas con navegación explícita. No quitar todo acceso a las restantes mientras sólo queda el campo inicial.

## Secuencia semántica propuesta
Observar → señalar → mostrar qué estrellas/patrón se ha tomado → revelar identidad/figura → profundizar.
No revelar nombres antes de acción semántica. Resaltar anclas después de seleccionar; no regalar la solución al entrar.
La consistencia está en que la persona entienda qué señaló y qué se revela, no en exigir el mismo número de clics para todos los encuentros.
Si hay ambigüedad, ofrecer descripción neutra o pedir concretar, no una lotería entre candidatos.

Conservar Orión/cinturón. Probar un caso extenso, uno débil y uno concurrido además de Orión antes de migrar las 88.
No sustituir las correcciones Nexo C01–C09 por esta ampliación: objetivos, cargas, visibilidad, multitouch y retorno siguen abiertos.

## Densidad y contenido
Densidad de estrellas es distinta de Movimiento. Propuesta de nombres iniciales: «Estrellas principales» / «Más estrellas», con explicación de representación. «Cielo urbano/oscuro» puede estudiarse didácticamente sin prometer simulación calibrada de contaminación lumínica.
Si una estrella se oculta, no cuenta silenciosamente como observada; descripción y detección deben coincidir. Ningún objeto queda imposible sin una vía explícita para cambiar representación.
No eliminar estrellas ancla ni Vía Láctea de manera que contradiga una pista activa. Guardar selección/cámara al cambiar preferencia.

## Rutas y formato
Una ruta inicial, no cinco a la vez: cinturón de Orión → figura → referencia vecina documentada → consulta/retorno.
La ruta Orión/Sirius/Procyon/Triángulo de Invierno es candidata de Axioma; antes de fijarla, comprobar inventario, alcance entre campos y fuentes por paso. Distinguir estrella, asterismo y constelación; no identificar automáticamente Can Mayor al pulsar Sirius sin explicitar esa relación.
Títulos estacionales con hemisferio/contexto, o neutros. Sin fecha/localización ficticias.
Canon NAVY y tipografías intactos; escena primero, pista única opcional, resumen breve, profundidad por secciones.
Cielo limpio significa control de capas por la persona, no desaparición automática de información.

## Próxima orden consolidada
1. Patch de continuidad/visibilidad/gestos y prueba de selección intencional.
2. Layout, pistas y estados de hallazgo con una ruta completa.
3. Prototipo de continuidad entre dos campos, separado del patch.
4. Después densidad, cuaderno cartográfico y ampliación editorial.

La petición actual aporta una revisión: se registra y contrasta, no se implementa el rediseño. Mantener abierta consolidación para siguientes conclusiones de Prisma/María.
