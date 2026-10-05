# CLAUDE · DESCUBRIMIENTO · VIDA MARINA Y PECES · PROTOTIPO R01
Fecha: 2026-10-05 · Coordinación Nexo · Issue #323
Estado: orden lista para entregar a Claude; no implica ejecución ni aprobación de producto.
Este documento es autosuficiente y se entrega con los seis PNG aprobados.

## 1. Encargo y resultado esperado
Diseña e implementa una experiencia interactiva de Descubrimiento que María pueda abrir y utilizar. La primera entrega ejecutable es **Bajar al fondo · Tramo mesopelágico** con tres animales, linterna espacial real, observación, identificación y álbum funcional.
No entregar solo pantallas, un vídeo, un carrusel o hotspots que abren fichas sin explorar.
Se permite HTML/CSS/JavaScript del prototipo aislado. No main, producción, integración con Sabik ni cambios de la web pública.
No necesitas detenerte en otro storyboard: usa esta especificación, implementa, prueba y entrega para revisión. Si un asset suministrado no carga, explica el fallo concreto; no generes sustitutos.

María ha separado:
- **Juegos:** construir, resolver y jugar, con decisiones y consecuencias jugables.
- **Descubrimiento:** explorar un mundo, observar evidencias, reconocer algo y entenderlo.
- **Espacio tranquilo / Pecera:** contemplación y descanso; otro encargo de Claude Rincón.
Este trabajo pertenece a Descubrimiento. No contiene puntos, vidas, premios, respiraciones, terapia ni misión cronometrada. Tampoco es un acuario animado.

Pregunta central: **¿Qué vive donde apenas llega la luz y cómo puedes reconocerlo?**
Contrato: ACTION → CONSEQUENCE → INFERENCE → REVEAL.
Aquí: **orientar luz → aparece una parte del cuerpo → reconocer su forma → identificar → profundizar**.
No exigir un test de nombres: identificar significa examinar deliberadamente el animal encontrado, no acertar una pregunta escolar.

## 2. Arquitectura de Vida marina
Dos experiencias con interacciones propias:
| Experiencia | Acción | Consecuencia observable | Descubrimiento |
|---|---|---|---|
| Arrecife | Desplazarse, acercarse y observar entre elementos de una escena | Aparece una silueta, patrón o forma antes oculta por encuadre u oclusión | Reconocer un animal y consultar su identidad |
| Bajar al fondo | Descender por tramos y orientar una linterna | Menos luz ambiental; el haz descubre parcialmente cuerpos y deja de mostrarlos al apartarse | Relacionar forma, luz propia y profundidad |

Compartir el sistema de álbum, ayuda y accesibilidad; mantener hábitats separados. No juntar peces de agua dulce, arrecife y profundidades en una pecera.
La implementación inmediata se limita al tramo mesopelágico, porque hay seis binarios aprobados verificables. Arrecife queda diseñado en apartado 12 para el siguiente bloque, sin producir otra experiencia a la vez.

## 3. Qué se ha auditado y qué se conserva
Fuentes del repositorio irisgreen, main leído en 3c44abc43e10c1adfc9486cb396f35fcd64e373d:
- COORDINACION_IRIS_GREEN/MEMORIA/LUMEN_INTEREST_22_LIGHT_REVEAL_VISUAL_CONTRACT_20261004.md
- COORDINACION_IRIS_GREEN/HANDOFFS/INTEREST_22_LIGHT_REVEAL_20261004/HANDOFF.md
- COORDINACION_IRIS_GREEN/HANDOFFS/MAR_22_MESO_PACKAGING_R01/manifest.json
- assets/data/mar22-descent-contract.json
- assets/ig-mar22-descent.js
- #323 comentarios 5979438739, 5979512722, 5979845439 y 5983158695.

KEEP: iluminación temporal por máscara, haz ancho, ausencia de autoplay, animales naturales, seis PNG exactos, álbum temático, misma información con teclado/touch.
REWORK del código anterior: lista con nombres desde la entrada, botones Iluminado/Oscuro que cambian todo el sprite, haz fijo sin revelar realmente, nieve marina automática en NORMAL, cinco botones de zona que conducen a contenido incompleto.
No importar ese runtime entero. Se pueden reutilizar piezas técnicas tras comprobar que cumplen este contrato. No modificarlo en main.
El antiguo HTML 4-bajar-al-fondo.html consta en un informe histórico, pero Nexo no ha localizado sus bytes en esta revisión. No afirmar que se ha probado.
El índice general de peces contiene categorías y nombres heterogéneos. No es prueba de cohabitación ni de exactitud científica de todos sus registros.

## 4. Primera pantalla y composición
Título: **Bajar al fondo**.
Subtítulo pequeño: **Tramo mesopelágico · 200–1000 m**.
Instrucción única: **Acerca la luz a una señal y observa qué aparece.**
Una escena grande de agua oscura azul profunda, sin marco de acuario, suelo de arrecife ni decoraciones que compitan con animales.
La escena representa una selección ilustrada, no una localización real ni una observación en directo. Indicar discretamente “Escena ilustrada”.
No inventar coordenadas, fecha, temperatura, presión exacta o profundidad exacta de cada animal.

Inicio: linterna apuntando a una zona vacía, cuerpos fuera del haz discretos, señales luminosas fijas donde el asset oscuro ya las contiene. Sin nombres, contadores de especies ni siluetas completas en el álbum.
La ausencia de movimiento automático no debe dejar una página muerta: toda acción de luz, cámara o zoom debe dar respuesta visible.
No esperar diez segundos ni mantener pulsado para que aparezca algo. La observación no tiene temporizador.

Escena panorámica, con tres encuentros separados:
- una forma de cuerpo alto y comprimido;
- una forma alargada con puntos luminosos;
- una forma translúcida con brazos.
Son pistas visuales descriptivas; los nombres se revelan después.
Composición propuesta para probar, no datos naturales: anclas normalizadas (0.22,0.38), (0.53,0.72), (0.82,0.34), ajustables para impedir solapamientos y facilitar acceso.
Todos deben ser alcanzables por cámara/zoom y por controles equivalentes. No esconder uno bajo la barra inferior.

## 5. Bucle completo de interacción
### A. Explorar
La persona mueve la luz con puntero, un toque para dirigirla, arrastre opcional o cuatro botones. Puede desplazar cámara y acercarse mediante controles separados.
La luz no se activa por hover incidental sobre menús. Al abrir paneles, conservar la última orientación.

### B. Observar
El cono intersecta parte del animal: esa parte aparece iluminada, el resto mantiene su estado oscuro. El borde es gradual.
Al recorrer el cuerpo se ven forma, ojos, aletas o brazos; la consecuencia depende de dónde cae el haz.
La primera iluminación no abre una ficha ni da el nombre.
Cuando hay suficiente cuerpo iluminado, aparece **Examinar este animal**. No salto de pantalla ni cambio de escala automático.

### C. Identificar
Activar Examinar congela solo el objetivo de observación y abre una franja breve:
nombre común + un rasgo visible contrastado con la ilustración + zona.
Ejemplo tras examinar pez hacha: “Pez hacha. Su cuerpo es alto y aplanado.” No convertir el texto en una lección larga.
Los rasgos son copy descriptivo de la ilustración; no añadir funciones biológicas sin fuente.
Después se habilitan **Ver de cerca**, **Añadir al álbum**, **Seguir explorando**.
Registrar en álbum es opcional, inmediato e idempotente. No animación de premio ni duplicados.

### D. Profundizar
Ver de cerca abre un visor con la ilustración completa y controles de zoom, nombre, descripción breve, fuentes y tamaño representado cuando proceda.
El visor es una inspección identificada, no un cambio del estado de iluminación del mundo.
Cerrar devuelve a la misma cámara, luz, zoom y objetivo. No reiniciar la escena.

### E. Volver a explorar
Apartar la luz devuelve el animal al estado oscuro aunque ya esté identificado o registrado.
Conocimiento/álbum y visibilidad son estados distintos. Descubrir no enciende permanentemente al animal.

## 6. Contrato implementable de luz y detección
Renderizar estado oscuro y estado luz con la MISMA transformación y registro.
Máscara espacial M(x,y) en [0,1], con penumbra:
color = oscuro × (1 − M) + luz × M, con composición alfa correcta.
La fórmula describe mezcla visual, no un modelo físico de óptica.
No opacity global por animal, no alternancia binaria y no destello.
Haz ancho inicial propuesto: apertura aproximada 55–65 grados. Ajustarlo en prueba móvil; no exigir precisión.
En ratón el haz apunta desde una referencia visual discreta hacia el punto elegido. En touch un toque dirige el haz y lo deja allí; arrastrar es una alternativa, nunca requisito.
El oscuro es el PNG aprobado: no recortar/regenerar fotóforos ni inventar órganos luminosos.

Condición funcional inicial de “examinable”: haz suficiente sobre la región corporal útil, excluyendo márgenes transparentes. Propuesta verificable: al menos 35% del área de alfa útil bajo M>=0.5. Umbral ajustable si dificulta acceso, documentado y sin exigir permanencia temporal.
El criterio debe usar la misma máscara que se ve en pantalla, no distancia al centro con revelado instantáneo.
Si hay varios candidatos, elegir explícitamente mediante nombres neutrales (“Animal iluminado a la izquierda”), sin cambiar de objetivo mientras se lee.
Click en agua vacía: mueve luz, no identifica. Examinar sin candidato: mensaje breve “Acerca la luz a una señal”. No consume ni penaliza.

En modo NONE la posición de la luz cambia por pasos, pero la máscara sigue siendo espacial: una parte puede quedar iluminada y otra oscura. Reducir movimiento no significa eliminar la mecánica.

## 7. Assets, tamaño y factualidad
Usar exactamente:
- assets/mesopelagica/pez-hacha-luz.png y pez-hacha-oscuro.png
- assets/mesopelagica/pez-linterna-luz.png y pez-linterna-oscuro.png
- assets/mesopelagica/calamar-cristal-luz.png y calamar-cristal-oscuro.png

1400×1000 RGBA, ICC, hashes en ASSETS_VERIFICADOS.json. Nexo comprobó 6/6 contra manifest Atlas. No alterar los binarios.
Pez hacha y pez linterna son peces; calamar de cristal es un molusco. Usar “animales” en el copy general.

El manifest heredado atribuye Argyropelecus (género), Myctophum punctatum y Teuthowenia pellucida. La nomenclatura y correspondencia anatómica del set no han recibido una nueva auditoría taxonómica en este encargo. No inventar una especie para Argyropelecus ni presentar todas las etiquetas como ciencia revalidada.
Valores de representación heredados: 6, 8 y 20 cm. Son referencias del paquete, no tamaños universales de especies ni mediciones del individuo ilustrado.
Para el prototipo conservar relación 6:8:20, sin falsear alcance científico: no mostrar cifra pública como hecho universal. En fuentes/acerca de: “Tamaños de referencia de esta representación; ilustraciones no a tamaño natural”.
Alinear escala por longitud corporal útil del sprite (no por ancho completo del lienzo transparente). La definición de longitud de calamar debe aclararse antes de publicar comparaciones científicas.
Para observar el pequeño, ampliar la cámara para todos o abrir Ver de cerca; no aumentar solo ese animal mientras se afirma escala real.
La revisión factual final corresponde a Senda/Astra antes de difusión pública. No bloquea la prueba privada de interacción con estas cautelas.

## 8. Accesibilidad, responsive y estados
Dos vías completas y equivalentes:
1. exploración espacial;
2. **Explorar con controles**, lista DOM de señales con posición y pista neutral (“Señal a la izquierda”), botón **Orientar luz aquí**, después **Examinar**.
No revelar nombres en aria-label, alt, tooltips ni lista de señales antes de Examinar. En modo no visual dar primero pista observable equivalente (“cuerpo alto y aplanado”), después identidad. No depender de acertar a ciegas.

Resolver conflicto de teclas del contrato anterior:
- flechas: orientar luz únicamente cuando el área de exploración tiene foco;
- cámara: botones Desplazar vista izquierda/derecha/arriba/abajo; atajos opcionales documentados;
- profundidad futura: botones Subir/Bajar tramo, sin reutilizar flechas de luz;
- Enter/Space: activar control enfocado; Esc: cerrar panel y devolver foco.
No secuestrar teclado en formularios, diálogos ni scroll ordinario. Sin role=application global.
Todos los botones touch >=44×44 CSS px, foco visible separado de selección, texto sobre panel sólido, no solo color.
aria-live polite solo para candidato/cambio confirmado/identidad/registro; no cada píxel del puntero.
El canvas es presentación; DOM contiene acciones y estado semántico.
Forced-colors: mostrar controles, foco y alternativa de observación legible; nunca una escena totalmente negra sin salida operable.

NORMAL: respuesta a gesto, transiciones breves iniciadas por persona, sin autoplay.
REDUCED: sin desplazamiento animado de cámara ni transición decorativa.
NONE: cambios discretos y respuesta inmediata, misma información.
No loops de peces, nieve, burbujas, pulsos luminosos ni música automática en ningún modo.

320/390: una columna; cabecera breve; escena primero; controles debajo, con opción ampliar escena. Objetivo de diseño: escena >=65% del primer viewport útil con controles compactos, sin sacrificar tamaño de targets. Detalles largos bajan o abren panel. No dos columnas.
1440: escena predominante, controles discretos; panel factual lateral al identificar, sin tapar al objetivo.
A 200% de texto el contenido debe poder fluir; permitir scroll vertical sin recorte ni controles flotantes superpuestos. Priorizar reflow sobre porcentaje de escena.
LIGHT/NAVY afectan interfaz; no eliminar la oscuridad de la experiencia.
No crear otro age gate. Si el prototipo no recibe perfil global, usar ALL_AGES. Si lo recibe: AGE_0_12 una criatura accesible por campo, AGE_13_17 dos/tres, AGE_18_PLUS y ALL_AGES las tres disponibles; mismas herramientas y hechos. No pedir fecha de nacimiento ni guardar edad.

## 9. Álbum y estados técnicos
Álbum temático por hábitat y profundidad, no inventario de premios.
En esta versión mostrar los animales registrados en “Mesopelágica”. Sin casillas que anticipen nombres no descubiertos; sin porcentaje global de todas las especies del planeta.
Mundo futuro: cinco zonas; no mostrar cuatro botones operativos hacia pantallas vacías ni peces inventados para rellenarlas.
No llamar al primer tramo “océano completo”.

Estado mínimo:
camera {x,y,zoom}; beam {x,y}; candidateId; examinedIds; albumIds; panel; locale; motion.
Cambio de luz no borra examinedIds/albumIds. Cerrar visor no cambia cámara. Volver al inicio de sesión solo tras acción explícita.
Memoria de sesión suficiente. Guardado local opcional y explícito “Guardar mis hallazgos en este dispositivo”, si se implementa; manejar denegación sin romper la experiencia. Sin cuenta, backend o telemetría.
Contenido disponible ES/EN, mismas acciones y cantidad de información. Datos no verificados omitidos en ambos idiomas.

## 10. Copy base ES/EN
| ES | EN |
|---|---|
| Bajar al fondo | Into the deep |
| Tramo mesopelágico · 200–1000 m | Mesopelagic section · 200–1,000 m |
| Acerca la luz a una señal y observa qué aparece. | Move the light towards a signal and see what appears. |
| Explorar con controles | Explore with controls |
| Orientar luz aquí | Aim the light here |
| Examinar este animal | Examine this animal |
| Ver de cerca | Take a closer look |
| Añadir al álbum | Add to album |
| Ya está en tu álbum | Already in your album |
| Seguir explorando | Keep exploring |
| Escena ilustrada | Illustrated scene |
| Pez hacha / Pez linterna / Calamar de cristal | Hatchetfish / Lanternfish / Glass squid |
| Fuentes y representación | Sources and representation |

No “¡Correcto!”, no medallas y no diagnosticar estados emocionales.

## 11. QA del prototipo y entrega
Entregar ZIP autosuficiente con **descubrimiento-peces.html**, JS/CSS locales si hacen falta, assets intactos, README, manifest SHA-256 y nota de pruebas/limitaciones.
Debe funcionar al extraer y abrir en navegador sin servidor ni instalación. Evitar fetch local de JSON y dependencias CDN; incluir datos en JS y resolver imágenes por rutas relativas.
Puede añadir un enlace de preview privado si dispone de él. No afirmar deploy sin URL comprobable.
No necesita conexión con GitHub desde Claude para trabajar: si no tiene acceso, entregar archivos a María para que Nexo registre.

Casos mínimos:
T01 entrar no muestra identidad visual ni accesible antes de acción.
T02 mover luz produce revelado parcial en cabeza/cola y salida del haz devuelve oscuridad.
T03 no hacer nada 30 s: no autoplay de ambiente/animales.
T04 observar y Examinar revelan identidad en ese orden, sin quiz obligatorio.
T05 espacio vacío no revela ninguna identidad.
T06 completar tres encuentros con touch sin arrastre y con teclado sin ratón.
T07 abrir/cerrar visor conserva cámara, zoom, luz y objetivo.
T08 añadir dos veces no duplica; apartar luz no borra álbum ni deja cuerpo encendido.
T09 tres modos de movimiento conservan todas las funciones.
T10 320/390/1440 y texto 200% sin clipping de controles/copy.
T11 forced-colors y lector de pantalla: señales → pista → identidad operables.
T12 archivos locales sin 404, errores JS ni solicitudes de terceros; sin sustitución de assets.
T13 escala relativa y pares registrados; mezcla no salta de pose.
T14 asset ausente genera mensaje y recuperación, no animal de fantasía.

Claude declara qué comprobó realmente y qué sigue pendiente; no autoproclamar conformidad total.
Entrega: CLAUDE_MARINE_MESO_INTERACTIVE_R01_READY_FOR_REVIEW.
Nexo revisa → Axioma comprueba interacción/accesibilidad → María usa el prototipo.
HUMAN QA: ¿entiende que ella revela el animal?, ¿nota oscuridad al apartar luz?, ¿observa antes de leer?, ¿quiere seguir explorando?
Sin HUMAN QA no ampliar cinco zonas ni aplicar este patrón al resto de Descubrimiento.

## 12. Diseño de Arrecife para el siguiente bloque (NO implementar ahora)
Entrada directamente a una escena amplia de arrecife con roca/coral como referencias, no a treinta tarjetas.
Mover encuadre y zoom permite mirar entre formas; un animal visible parcialmente mantiene ubicación al acercarse.
Gesto: **desplazar → advertir patrón/silueta → acercarse → examinar → identificar → registrar**.
La causa es cambio de punto de observación/encuadre y oclusión, no una linterna abisal aplicada a agua soleada.
Rasgos a buscar salen de la ilustración: bandas, cuerpo aplanado, hocico alargado. No “Busca al pez X” con nombre-respuesta antes de hallarlo.
No disparar fotos para ganar puntos ni capturar/alimentar animales. El álbum guarda observaciones.
No nadado autónomo ni parallax infinito. Las transformaciones siguen la acción del usuario.
Primera muestra futura: 3–5 especies compatibles dentro de una escena curada. Debe existir mapa factual de región/microhábitat y assets inspeccionados antes de seleccionarlas.
El INDICE.csv mezcla “Arrecife tropical” e “Indo-Pacífico y Asia”; esas categorías no prueban que todas las especies compartan arrecife. No asumir convivencia por carpeta o color.
Fondo sin fauna horneada que el usuario intente seleccionar sin respuesta. Corales existentes se reutilizan si su procedencia/uso es válido; si falta ambiente, registrar el asset necesario, no generar todo el catálogo.
Álbum separado por hábitat, interoperable con profundidad; no asignar una especie de arrecife a abisal/hadal para llenar huecos.

## 13. Extensión futura del descenso
Arquitectura de cinco zonas: epipelágica 0–200 m, mesopelágica 200–1000 m, batipelágica 1000–4000 m, abisopelágica 4000–6000 m, hadal desde 6000 m en fosas.
Son rangos convencionales orientativos; hádal no es el suelo universal de todos los mares.
La luz solar se atenúa con profundidad; mesopelágica es penumbra, no ausencia absoluta de luz. El diseño de la máscara es representación.
Temperatura no es una función universal exacta de profundidad; no inventar termómetro ni presión sin un modelo explicado.
Escalas de profundidad y cuerpo no comparten escala espacial literal en pantalla; no mostrar descenso como metros medidos si es cambio de tramo.
Nuevas zonas solo tras lista factual de especies, tamaño con definición, iluminación/bioluminiscencia, fuentes y assets adecuados. No producir “las doce restantes” sin lista.

Fuentes externas consultadas 2026-10-05:
- https://www.noaa.gov/jetstream/ocean/layers-of-ocean
- https://www.whoi.edu/ocean-learning-hub/ocean-topics/how-the-ocean-works/ocean-zones/twilight-zone/
- https://ocean.si.edu/ecosystems/deep-sea/deep-sea
- https://ocean.si.edu/ocean-life/fish/bioluminescence
Apoyan contexto general de profundidad/luz. No validan por sí solas las tres ilustraciones o sus tamaños particulares.

## 14. Límites de este encargo
No rehacer Orión, Construcción, Pecera ni portada global. No sustituir el encargo de Claude Design del área de Juegos: este es un bloque separado para Claude.
No main/deploy público; Motor mantiene su trabajo actual.
El paquete presente contiene especificación + fuentes + seis assets. **No contiene todavía el prototipo ejecutable que Claude debe construir.**
