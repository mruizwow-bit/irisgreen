# Claude Design · encargo autónomo de Construcción

Claude Design, este es un encargo NUEVO: crear un prototipo jugable de construcción para Iris Green. El prototipo anterior lo hizo Prisma y María lo rechazó. Tú no lo has hecho ni necesitas conocerlo, descargarlo o conservar su código. Esta orden contiene lo necesario para empezar.

QUÉ QUEREMOS
Un pequeño juego donde manejas un personaje, recoges materiales, construyes caminos y estructuras, los recorres y creas un lugar propio. La referencia es el tipo de interacción de Dragon Quest Builders, sin copiar sus personajes, arte o interfaz. Pertenece al área Juegos; su finalidad es jugar y construir, no enseñar una rutina ni ofrecer estimulación sensorial.

PRIMERA ESCENA JUGABLE
Un enclave costero con dos orillas separadas por un canal estrecho y una terraza elevada al otro lado. Personaje femenino reconocible y animado. Perspectiva 3D o isométrica con volumen: alturas, agua, madera, piedra y estructuras se distinguen visualmente. No representar el mundo como casillas planas, el personaje como un punto ni los objetos sólo mediante etiquetas.

PARTIDA
1. Pulsar «Jugar» y entrar. Objetivo breve: «Cruza a la otra orilla y construye tu refugio en la terraza».
2. Caminar hasta madera y piedra y recogerlas con una acción. Disponibilidad inicial propuesta para esta prueba: 24 madera y 12 piedra; sin recolección repetitiva obligatoria.
3. Elegir dónde cruzar. Construir un paso que el personaje pueda recorrer físicamente. Debe haber al menos dos soluciones posibles, con diferencias de trazado o materiales; no dibujar la solución antes de jugar.
4. Abrir una caja en la otra orilla: aporta 12 piedra y desbloquea escaleras.
5. Construir una subida utilizable hasta la terraza.
6. Llegar a una parcela de construcción libre, con materiales ilimitados, y crear un refugio: suelo, paredes y entrada transitable. La forma la decide quien juega.
7. Poder seguir modificando y guardar la partida. Duración orientativa del recorrido inicial: 5–10 minutos. Sin cronómetro obligatorio ni pérdida irreversible.

REGLAS PARA IMPLEMENTAR
Estos valores son parámetros iniciales ajustables si impiden completar la escena:
- Plataforma: 1 madera; bloque: 1 piedra; escalera: 2 madera.
- Suelo y paredes libres reutilizan plataformas y bloques.
- Apoyo: un bloque se apoya en terreno u otro bloque; plataforma adyacente a superficie estable, con máximo de dos tramos seguidos sin pilar; escalera apoyada y con llegada accesible.
- Alcance: construir junto al personaje, hasta dos posiciones de distancia; no colocar al otro lado del mapa.
- No construir dentro del personaje ni de una pieza existente. Las superficies sostienen al personaje y las paredes impiden atravesarlas.
- Preview válido/inválido con explicación breve. No consumir materiales al fallar.
- Retirar devuelve materiales; bloquear la retirada que dejaría piezas sin apoyo y explicar cuáles dependen de ella.
- Deshacer revierte la última construcción/retirada y su coste sin duplicar materiales.
- Guardado local de personaje, piezas, inventario y progreso; si falla el almacenamiento, permitir continuar y avisar.
Diseña las dimensiones para que las dos soluciones sean posibles con esos recursos. Documenta cualquier ajuste de costes o apoyo.

CONTROLES Y PRESENTACIÓN
Ratón: elegir pieza en una barra compacta → apuntar al terreno → ver preview → colocar. Giro disponible antes de colocar; Escape cancela. Arrastrar con un control de cámara claramente distinto mueve la vista; nunca coloca accidentalmente.
Teclado: flechas físicas o WASD para caminar; modo Construir para mover el cursor; Enter/Espacio coloca, R gira, Escape cancela y Ctrl+Z deshace. No capturar atajos cuando se escribe en campos.
Touch: tocar una ubicación y confirmar; controles para caminar, girar, colocar y retirar, sin depender de hover o clic derecho.
Inventario compacto y ayuda contextual. Escena protagonista. Cuadrícula sólo al construir y discreta; sin coordenadas ni paneles de depuración. El personaje camina y gira, las piezas tienen volumen y construir cambia realmente el mundo.

CANON DE PÁGINA E INTERFAZ
Sólo NAVY, sin tema claro:
fondo #0B1A2B; panel #15304A; superficie secundaria #1D3D5C; texto #EEF4F8; secundario #C9D5DD; enlaces #9FDCEA; foco/acento #C3B8FF; borde de controles #8494A8; separadores #2A4460; botón principal #DCE8F2 con texto #0B1A2B.
Atkinson Hyperlegible local: cuerpo 16 px, interlineado 1.6; introducción ~19 px/1.58.
Newsreader local: títulos 600/1.2; portada 400, 40–56 px adaptables/1.06.
El mundo usa colores legibles de sus materiales. No necesitas recibir imágenes de Cielo o Peces. Puedes crear geometría original para esta escena; incluye procedencia/licencias de recursos externos. No entregues una captura como mundo interactivo.

ACCESIBILIDAD
320/390/1440, texto al 200 %, controles >=44 px, foco distinto de selección y feedback que no dependa sólo del color. NORMAL/REDUCED/NONE: conservar todas las acciones al reducir/eliminar animaciones. Alternativa textual operable para acciones y estado; forced-colors. Sin sonido obligatorio.

ENTREGA
Implementa ahora el prototipo, no sólo un documento ni un storyboard. ZIP autónomo con index.html, recursos y fuentes locales; doble clic sin servidor, instalación ni red. Si usas una biblioteca, inclúyela localmente con licencia.
Incluye README breve, controles, límites, manifest, SHA256 y grabación de una partida real completa. Si hay lienzo, debe corresponder al mismo ejecutable.
Verifica las dos soluciones, colisiones, apoyo, retirada/dependencias, deshacer, guardado y teclado/touch. Declara lo no probado.
El criterio es que se entienda jugando, permita decisiones propias y apetezca seguir construyendo. La revisión técnica no sustituye la prueba de María.
NO MAIN · NO PUBLIC DEPLOY. No tocar Sabik, Cielo, Vida marina ni las portadas de áreas.
