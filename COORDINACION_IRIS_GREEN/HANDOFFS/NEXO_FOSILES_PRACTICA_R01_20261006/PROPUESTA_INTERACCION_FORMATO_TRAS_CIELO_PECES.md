# Nexo · Fósiles R01 · interacción y formato después de Cielo y Peces
Fecha: 2026-10-06. Estado: PROPUESTA_DE_REWORK; R01 intacto; no implementación ni PASS.
Autor: Nexo, revisión de su propia práctica. No sustituye las revisiones independientes de Prisma y Axioma.

## Evidencia
Artifact NEXO_FOSILES_PRACTICA_R01.zip, SHA256 21a6663524368ad2322f06e405d6af1417e42b21925d4a2123c9c29934ae668c, reconfirmado.
Leídos app.js, model.js, index.html, style.css, README y datos de procedencia. Reejecutado reproduce.cjs de la autorevisión: se reproducen R00–R06. Inspeccionadas escena-inicial.png y escena-hallazgo.png: son imágenes del Canvas del fixture, no capturas del layout en navegador.
No navegador real, touch físico, lector ni HUMAN QA en esta revisión.

## Diagnóstico
KEEP técnico parcial; REWORK de descubrimiento. El bucle actual se parece a rascar para habilitar una ficha. El 48 % y dos de tres regiones no demuestran observación significativa. Las regiones fueron generadas geométricamente y sus nombres anatómicos no están validados. Preservar un asset no valida las anotaciones añadidas.

Fallos reproducidos:
- R00: todas las muestras despejadas, solo una región visible; Paso anuncia listo y Examinar lo rechaza.
- R01: identifica trilobite cuyo borde derecho está a -295,32 px de la escena.
- R02: herramienta de teclado retira 80 celdas en punto (1565,622), escena 850×560.
- R03: mensaje listo sobrescrito al terminar el clic.
- R04: cambio a EN anuncia instrucciones de explorar estando en despejar.
- R05: Despejar esta zona actúa a 295,81 unidades del punto elegido.
- R06: selector de movimiento sin diferencias de comportamiento.
Los seis primeros son reproducciones de lógica; R06 es inspección. Foco nativo y percepción requieren pruebas aparte.

## Qué conservar
14 ilustraciones originales; cámara y cobertura separadas; acción directa; cámara quieta ante hover; estado por sector en la sesión; identidad tras acción; colección opcional; fuentes locales y NAVY.
No modificar los bytes de ilustraciones para ocultar errores de regiones.

## Contrato propuesto
EXPLORAR → NOTAR INDICIO → HACER VISIBLE UN RASGO → OBSERVAR → REVELAR CONTEXTO → PROFUNDIZAR.
La cobertura ayuda a observar; no es trabajo obligatorio para desbloquear contenido.
Examinar puede mostrar una observación parcial sin identificar prematuramente. No quiz ni obligación de adivinar taxón.
Distinguir: rasgo visible, explicación documentada, atribución de la representación. Una forma dibujada no basta para identificar científicamente la especie.
Si el detalle necesario no está representado con claridad, declarar ese límite y cambiar el encuentro; no inventar geometría anatómica ni exigir clic sobre un detalle ilegible.

## Interacción
- Entrada con un indicio perceptible y una frase breve.
- Click/tap selecciona directamente. Arrastrar en Explorar desplaza la roca.
- Despejar es una herramienta explícita, con estado visible; nunca cambiar de modo ocultamente.
- Alternativa: elegir zona y activar acción local. Si existe avance asistido, llamarlo Mostrar siguiente detalle y señalar previamente su destino; no llamarlo esta zona.
- Flechas físicas para teclado; alternativa de navegación con selección de destino, sin imponer cruceta al ratón.
- No acción ni identificación sobre objetivos fuera del área visible. Ayuda para reencuadrar explícita.
- Cancelar gesto no confirma selección. Probar multitouch, scroll móvil y separación pan/despejar.
- Una sola evaluación de disponibilidad compartida por dibujo, mensajes, botones y examen.
- Mantener posición, escala aparente y foco al cerrar ficha. Persistencia de sesión actual no equivale a guardar entre visitas: proponer guardado local versionado, degradación si falla y reinicio confirmado.

## Variedad con las 14 piezas
Asignaciones provisionales según descripciones heredadas; no son validación científica ni comprobación visual de todos los detalles.
| Familia | Piezas actuales | Observación candidata |
|---|---|---|
| Segmentación | Trilobites | Comparar zona central y segmentos laterales visibles |
| Superficie repetida | Mamut | Ampliar las láminas representadas del molar |
| Hilera y base | Antecessor, Pelecanimimus, Eoraptor | Observar dientes y soporte; evitar deducir especie solo de la silueta |
| Prolongación y base | Dimetrodon, Concavenator | Seguir visualmente continuidad; revisar anclajes manualmente |
| Contorno | T. rex, Iguanodon, Dunkleosteus | Diferenciar contorno, punta o borde presentes, sin inventar reverso |
| Hueso largo | Turiasaurus, Plateosaurus | Observar extremos y eje; no comparar tamaños físicos sin escala documentada |
| Impresión fina | Archaeopteryx, Meganeura | Ampliar detalles representados; separar impresión y soporte |
No catorce minijuegos. Mismo lenguaje de interacción, preguntas visuales distintas. Comparación opcional después del hallazgo, no examen escolar.
No giro 3D de imágenes planas ni iluminación que fabrique relieve: faltan geometría/datos para eso.

## Formato
El CSS actual reparte escritorio entre navegación de 175 px, escena y ficha de 260 px; móvil antepone introducción/selector y deja una escena de 55svh con mínimo 360 px. Es evidencia de estructura, no medición de viewport ni reflow.
Propuesta: cabecera compacta de experiencia; cambiar época y cuaderno secundarios; escena dominante; acción contextual pegada a la escena; primera explicación breve junto al rasgo.
Ficha completa bajo escena en móvil y panel lateral sin tapar objeto en escritorio. Fuentes y explicación de representación accesibles a demanda.
Conservar canon NAVY #0B1A2B, paneles #15304A, texto #EEF4F8, Atkinson 16px/1.6, títulos Newsreader. No reducir tipografía/targets para hacer caber todo.
Retirar selector local de movimiento sin efecto. Respetar preferencia global; solo ofrecer diferencias si existen.
No convertir sectores didácticos en un yacimiento continuo ficticio. No presentar tamaños dibujados como escala real.

## Investigación y alcance
Smithsonian separa hallazgo, preparación e interpretación; FossiLab describe trabajo diverso y dependiente de matriz y espécimen. NPS muestra un caso donde preparar revela antenas antes ocultas. Mi inferencia de diseño: hacer visible un detalle significativo es mejor objetivo que acumular superficie borrada; esas fuentes no validan el diseño ni nuestros 14 registros.
- https://naturalhistory.si.edu/education/teaching-resources/paleontology/fossil-preparation-field-museum
- https://naturalhistory.si.edu/exhibits/david-h-koch-hall-fossils-deep-time/fossilab
- https://www.nps.gov/flfo/planyourvisit/upload/No9_paleo_program_bulletin_508_2023-0626.pdf
W3C distingue alternativa de puntero sin arrastre y teclado:
- https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
Fuentes consultadas hoy; no se han visto todos los vídeos enlazados ni revalidado la paleontología del catálogo.

## Siguiente iteración propuesta, pendiente de contraste del equipo
1. Cerrar R00–R06 y verificar contrato de objetivo visible.
2. Auditar manualmente anotaciones/soporte/rasgos de las 14 piezas con fuentes por afirmación.
3. Pilotar tres geometrías: trilobite, vértebra Dimetrodon e impresión Meganeura. No editar assets aprobados.
4. Completar una ruta real por piloto: notar, actuar, observar, entender, volver; alternativa sin arrastre y teclado.
5. HUMAN QA María: primera acción comprensible, consecuencia local evidente, detalle interesante y retorno sin pérdida. No reemplazarla por un contador de píxeles.
6. Extender patrón aprobado a las 14, verificando todas; no declarar cobertura porque el bucle alcanza una ficha.
Mantener R01 como referencia y esperar comparación con Prisma/Axioma antes de implementar R02. No main, no deploy.
