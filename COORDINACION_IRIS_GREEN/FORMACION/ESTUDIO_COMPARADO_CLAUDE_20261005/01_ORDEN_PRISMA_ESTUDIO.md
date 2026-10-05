# Prisma · Orden de estudio independiente del código Claude

Fecha: 2026-10-05. Encargo explícito de María: estudiar a fondo lo conseguido por Claude y compararlo con nuestros conocimientos actuales. Aprendizaje sin buscar culpables. No sustituir estudio por otra lista de gates.

Leer primero 00_BASES_Y_ESTADO.md de esta carpeta cuando esté publicado. Material de estudio: Cielo 2e036ce4…; Peces a5a39e5d…; Descubrimiento web d0ef4877…; Juegos visual 6dc3e7e…; Construcción Prisma e2370c5e…. Los hashes completos y los identificadores de Biblioteca estarán en ese índice. Estudiar el binario exacto, no sólo mensajes ni capturas. Si no se tiene un paquete, declarar qué parte no se pudo estudiar; no inventar lectura. Las correcciones posteriores de Cielo y Peces que María comunica son KEEP: estas bases históricas sirven para aprender, no para reabrir sus defectos como actuales.

Separar tres dominios en el informe: CIELO / PECES / CREACIÓN DE WEBS. Comparar Construcción donde ayude a explicar representación, mecánica e interacción. Construcción fue de Prisma; Claude Juegos es diseño visual de área, no el juego. Claude no es una referencia infalible.

El informe debe ser individual antes de leer las conclusiones de los demás. No hace falta aislarse de las fuentes comunes. Citar archivos, funciones, versión y pruebas realmente ejecutadas. Distinguir hechos de lectura, ejecución propia, evidencia del autor e hipótesis perceptuales. Sin cambios a main, despliegues, Sabik ni runtimes aprobados. Ejercicios únicamente en copia aislada. Este estudio no bloquea la ampliación autorizada de Descubrimientos.

## Comparación con tu formación
Leer tu formación canónica y citar su ref/blob. Ya localizadas: FORMACION/A8_PRISMA/APRENDIZAJE_PRISMA_2026-10-03.md (blob c33301da53b9937d30750b52dc758801d2e3e33f) y 2026-10-04.md (266f66da5d3123a14e33e35e210e2212d3c02acd), bajo COORDINACION_IRIS_GREEN. Incluyen plataforma/tokens, fuente editable y exportación, contratos, fidelidad al diseño y diferencia entre artefacto y runtime. No deducir que desconoces una materia sólo porque una entrega no la aplica.

## Trabajo de lectura
1. Cielo: trazar puntero/teclado → cámara/selección → coordenadas → identificación → profundidad → retorno. Explicar por qué compartir proyección ayuda y por qué una retícula fija puede cumplir el código pero frustrar la intención. Comparar con la revisión corregida si tienes sus bytes.
2. Peces: explicar geometría de sprites, muestras y haz; mundo versus viewport; recorrido y pose; giro continuo versus mínimo de dibujo; cancelación de cámara; foco conservado por id. Estudiar las diferencias R01/R02 y patches: qué cambió por feedback y qué era un defecto técnico.
3. Webs: seguir tokens, fuentes, layout, semántica, registros, enlaces y retorno. Diferenciar frames fijos de web fluida y exportación de navegación. Explicar dónde se adapta al file:// y qué coste de mantenimiento introduce.
4. Construcción propia: seguir validatePlacement, cellRect, drawPiece, drawPlayer, eventos de puntero y undo. Comparar promesa espacial con lo que se ve y se puede hacer. Identificar conocimiento útil que conservar, sin defender ni descartar en bloque todo el código.

## Entrega
Crear en esta carpeta PRISMA_ESTUDIO_INDEPENDIENTE.md con tres capítulos, mapa de flujo por dominio y matriz:
principio conocido + fuente → decisión implementada → consecuencia para la persona → brecha de aplicación / formación nueva / incertidumbre → práctica para demostrar aprendizaje.
Elegir en cada dominio una decisión de Claude que adoptarías y otra que no copiarías, con código como evidencia.

Después del informe, dos ejercicios pequeños en una rama de formación, separados del producto:
- Dos alturas, una pieza y un personaje: altura visible, superficie seleccionable, preview, colocar y recorrer; explicar proyección/picking, orientación y apoyo. No necesitas crear un juego entero.
- Un catálogo fluido desde un frame: canon local, una fuente de datos, enlace real, estado vacío y retorno. Extraer el paquete en limpio y usarlo fuera del editor.
Aportar vídeo corto o secuencia observable y explicación de decisiones. Las pruebas de reglas siguen siendo útiles; no demuestran por sí solas legibilidad o diversión.

No responder únicamente «leído», checklist PASS o propuesta de framework. Explicar lo aprendido y mostrar transferencia.
