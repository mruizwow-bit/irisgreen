# Aplicación del estudio aportado · primera tanda

La ejecución 34095116826 terminó correctamente. La implementación y los resultados están guardados en fd694fd5e1460c4072324639350fe518271ef4d4, rama `ajustes/auditoria-web`. La propuesta #2 sigue en borrador: esta tanda no se ha publicado.

## Análisis del estudio
Se han leído sus ocho apartados y cuarenta actuaciones. El tratamiento de cada punto está en `PLAN.md`. Se distingue lo observado por el informe en la web pública de las correcciones de la rama actual. No se toman sus propuestas de desarrollo, colaboración o financiación como órdenes automáticas.

## Aplicado
- Dos fichas desarrolladas: Autismo y Trastorno del desarrollo del lenguaje (TDL), en español e inglés. Ya no se limita el cuerpo a repetir la promesa de la tarjeta.
- Corregida la referencia incompleta de Zeidan; identificados documento, publicación y DOI, y diferenciadas sus estimaciones de las del estudio GBD.
- Sustituida «Habla menos y peor de lo esperado» por una descripción del TDL centrada en las dificultades de comprensión/uso del lenguaje y su impacto. La valoración y los apoyos se explican con su contexto lingüístico.
- Delimitada la afirmación sobre medicación del autismo: no confundir las características nucleares con condiciones coexistentes u otras indicaciones específicas.
- Registro interno de 12 afirmaciones por idioma relacionadas con 11 fuentes. Los identificadores, el alcance y las fuentes coinciden entre ES/EN. Se especifica cuándo se consultó una página completa, un resumen del estudio o extractos oficiales recuperados en búsqueda.
- Sincronizados los resúmenes de estas dos fichas en listados, metadatos e índice común. Se mantienen los 372 registros del buscador y sus demás campos.
- Campo total del listado de vídeos corregido de 53 a 52, la longitud real de su lista. No se elimina ni incorpora ningún vídeo.
- Las referencias públicas permanecen en texto, sin enlaces externos nuevos, grados clínicos o fechas de revisión atribuidas a profesionales. Los estados anteriores de las dos entradas se conservan internamente; no se cambian robots ni se despublican fichas.

## Comprobaciones
- 16/16 escenarios de las cuatro páginas: español/inglés, 1440/320 píxeles, con y sin JavaScript. Contenido legible sin JavaScript y sin desbordamiento en las pruebas; Música continúa fuera del flujo y no desplaza la página.
- 24/24 escenarios de la regresión de controles: seis catálogos, dieciséis secciones y dos recuperaciones tras fallo de red. El selector de vídeo de esta prueba se adaptó al nombre accesible introducido en la tanda de miniaturas; se mantienen los recuentos y se comprueba también el proveedor.
- Las otras 740 páginas de fichas comparadas permanecen idénticas. Esto es una prueba de integridad, no una validación de su contenido.
- Generación repetible y ausencia de `editorial`, `reports` y `scripts` en el directorio público.
- Revisadas las capturas de las dos fichas, incluida Autismo a 320 píxeles.

## Qué no significa esta tanda
La correspondencia documental está limitada a esas dos fichas. Es una revisión asistida por IA, no una revisión clínica especializada ni una prueba de comprensión con usuarios. El inventario mecánico encuentra seis páginas más con marcadores explícitos de referencias pendientes: no implica que solo queden seis referencias por contrastar. Las demás afirmaciones de la web siguen fuera de esta revisión.

Tampoco se han verificado aquí todos los artículos o plataformas citados por el estudio estratégico. Las propuestas de pasaporte, recorridos, participación remunerada y pilotos quedan clasificadas para decidir y desarrollar, no anunciadas como existentes o validadas. No se reactiva PT-BR, no se cambia el dominio ni se añaden cuentas, analítica o funciones comerciales.

## Evidencia
`PLAN.md`, `first-application.json`, `tests.json`, `regression-controls.json`, `reference-followup.json`, `legacy-two-entries.json` y `editorial/reviews/2026-09-07-autismo-tdl.json`. Capturas y textos en el artefacto `estudio-editorial-resultados`, ejecución 34095116826.
