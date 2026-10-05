# Axioma · Orden de estudio independiente del código y de la evidencia

Fecha: 2026-10-05. Encargo explícito de María: estudiar a fondo lo conseguido por Claude y compararlo con nuestros conocimientos actuales. Aprendizaje sin buscar culpables. No sustituir estudio por otra lista de gates.

Leer primero 00_BASES_Y_ESTADO.md de esta carpeta cuando esté publicado. Material de estudio: Cielo 2e036ce4…; Peces a5a39e5d…; Descubrimiento web d0ef4877…; Juegos visual 6dc3e7e…; Construcción Prisma e2370c5e…. Los hashes completos y los identificadores de Biblioteca estarán en ese índice. Estudiar el binario exacto, no sólo mensajes ni capturas. Si no se tiene un paquete, declarar qué parte no se pudo estudiar; no inventar lectura. Las correcciones posteriores de Cielo y Peces que María comunica son KEEP: estas bases históricas sirven para aprender, no para reabrir sus defectos como actuales.

Separar tres dominios en el informe: CIELO / PECES / CREACIÓN DE WEBS. Comparar Construcción donde ayude a explicar representación, mecánica e interacción. Construcción fue de Prisma; Claude Juegos es diseño visual de área, no el juego. Claude no es una referencia infalible.

El informe debe ser individual antes de leer las conclusiones de los demás. No hace falta aislarse de las fuentes comunes. Citar archivos, funciones, versión y pruebas realmente ejecutadas. Distinguir hechos de lectura, ejecución propia, evidencia del autor e hipótesis perceptuales. Sin cambios a main, despliegues, Sabik ni runtimes aprobados. Ejercicios únicamente en copia aislada. Este estudio no bloquea la ampliación autorizada de Descubrimientos.

## Comparación con tu formación
Localiza y lee tu formación canónica y tus informes originales; cita rutas y refs. Nexo no ha localizado tu currículo en FORMACION de main y NO concluye por ello que no exista. La comparación debe usar lo que de verdad tenías documentado, no una atribución de desconocimiento.

## Trabajo de lectura
1. Cielo: seguir motor/interfaz/banco. Distinguir reconocimiento matemático correcto, gesto utilizable y descubrimiento comprensible. Examinar qué verifican las pulsaciones reales y qué no demuestran sobre selección con ratón, información encontrable y continuidad de atención.
2. Peces: seguir giro, reloj/pose/cámara, muestras dentro de viewport, reconciliación por id y criterio de examinable. Leer código de pruebas, no sólo resultados. Comparar una aproximación gráfica con una afirmación perceptual: «hay movimiento» no responde «parece nadar».
3. Webs: distinguir render de frame, reflow de documento, navegación completa y conexión real de experiencias. Inspeccionar límites de overflow, texto al 200 %, alt, foco/selected, menús al cambiar de breakpoint, fuentes y exportación.
4. Construcción: releer QA_BROWSER.json y código. Precisar qué demostraba cada prueba de rutas, inventario, altura y guardado. Estudiar cómo comprobar representación y decisión jugable antes de entregar a María, sin afirmar que un test automatizado puede decidir diversión universal.

## Entrega
AXIOMA_ESTUDIO_INDEPENDIENTE.md, tres capítulos y comparación con formación propia. Para cada conclusión: pregunta → evidencia necesaria → aserción existente → alcance real → punto ciego → técnica de comprobación adecuada.

Ejercicio aislado obligatorio: escoger al menos cuatro pruebas y construir un contraejemplo que pase la aserción pero viole su promesa amplia (p.ej. scrollWidth sin clipping vertical; alt presente pero inútil; z lógico sin altura visible; animación con giro dependiente del refresco). Elegir dos y mejorar el oráculo; demostrar que detectan el defecto y que el banco devuelve fallo. No inyectar defectos en entregas de producto.

Diseñar observación de primera tarea: qué intención, qué acción espontánea, qué consecuencia visible, qué confusión se registra y qué no permite concluir esa muestra. Usar revisión experta previa para que María no tenga que volver a descubrir carencias básicas. Su criterio de producto sigue siendo necesario; no sustituirlo por una puntuación inventada.

Entregar también una práctica que ya dominabas, una que no se aplicó y una formación nueva necesaria, con evidencias. No reducir la respuesta a «TECHNICAL_PASS != PRODUCT_PASS»: eso ya estaba escrito.
