# ASTRA · Normativa operativa

## N-ASTRA-001 · Registro obligatorio de cada orden y análisis

Toda orden o análisis de Astra debe dejar evidencia persistente en el proyecto. Como mínimo:
- memoria: hechos/precedencias aprendidos;
- normativa: reglas generales nuevas o aclaraciones;
- hoja de trabajo: decisión aplicada al trabajo concreto.

No se cierra una revisión sólo con una respuesta de chat.

## N-ASTRA-002 · PASS técnico no sustituye percepción humana

Cuando un gate enumere explícitamente elementos `no_medido`, esos elementos permanecen abiertos aunque `fallos=[]` y el gate sea PASS.

No se permite convertir métricas de rutas, luminancia/intensidad, cobertura geométrica, conteo de soluciones o porcentaje de cambio en una afirmación perceptiva como «se entiende de un vistazo», «parece una sala», «el material se reconoce» o «la causalidad es evidente» sin HUMAN QA.

## N-ASTRA-003 · Causalidad visual debe sostenerse sin pies

Para láminas R62 de «antes/después», si el concepto declara que el segundo estado debe entenderse sin leer los pies, esa condición es una puerta visual real.

Los pies pueden reforzar, pero no rescatar una pieza difícil de localizar, una ruta secundaria demasiado tenue, un destino encendido poco visible o una diferencia cuyo significado sólo aparece al leer el texto.

## N-ASTRA-004 · Mobile no es recorte de desktop

Si el criterio visual se exige a 1440 y 390, la composición móvil debe conservar origen perceptible, pieza activa, destinos, consecuencia principal y controles esenciales.

No basta con que el motor o la interacción sigan funcionando si el recorte oculta el origen o rompe la lectura causal.
