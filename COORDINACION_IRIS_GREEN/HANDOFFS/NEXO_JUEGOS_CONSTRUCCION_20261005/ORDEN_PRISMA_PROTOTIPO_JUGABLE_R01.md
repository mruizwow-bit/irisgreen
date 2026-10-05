# NEXO → PRISMA / AXIOMA · CONSTRUCCIÓN · PROTOTIPO JUGABLE R01
Fecha: 2026-10-05 · Issue #369

## Decisión de María y cambio de secuencia
María indica: “pero teneis montarlo, esto no esta montado, asi como lo voy a ahcer, esto no es un juego, son imagenes sueltas en un png”.
Se autoriza implementar el prototipo jugable aislado para poder hacer HUMAN QA jugando. Queda sustituido el STOP NO CODE / NO RUNTIME de las órdenes anteriores **solo para este prototipo**. No registrar HUMAN QA visual ni diversión como PASS: María no lo ha emitido.
Se mantiene NO MAIN / NO PRODUCCIÓN. No interrumpir Motor/Sabik.

Responsables: Prisma implementa el prototipo; Axioma prueba runtime real; Nexo coordina; María juega y decide. Claude Design continúa con el diseño del área de Juegos y Claude Rincón con Pecera.

## Base exacta
Storyboard aprobado por Axioma, 8/8 PASS:
- Gate AXIOMA_CONSTRUCTION_R01_R02_STORYBOARD_READY_FOR_HUMAN_QA.
- Informe commit 8ab82d7bef0054c46ae365be3ea62494a5970060:
  COORDINACION_IRIS_GREEN/HANDOFFS/AXIOMA_CONSTRUCTION_R01_R02_20261005/RETEST_VISUAL_FINAL_P06_HUMAN_QA_READY.md
- Artifact https://github.com/mruizwow-bit/irisgreen/actions/runs/37318454037/artifacts/11348661943
- ZIP SHA-256 f2d4503945e96941b51f953ed8e3fa6decbf6d5dfe6e53acfa71f6c484082853.
- Rama existente prisma/construction-r01-storyboard-r02-20261005.
- Estado de reglas: COORDINACION_IRIS_GREEN/HANDOFFS/PRISMA_CONSTRUCTION_R01_STORYBOARD_R02_20261005/STATE.json.
- Brief de producto: COORDINACION_IRIS_GREEN/HANDOFFS/NEXO_JUEGOS_CONSTRUCCION_20261005/00_REGISTRO_CANONICO.md, rama nexo/new-games-area-r01-20261004. Las reglas reconciliadas R02 prevalecen sobre propuestas iniciales de geometría/alcance.

Leer HEAD vivo, instrucciones del repositorio y main para detectar drift. Trabajar en la rama existente sin mergear main ni arrastrar el antiguo runtime descartado de Juegos. Conservar storyboard aprobado.

## Entrega inmediata
Una página de prueba de Juegos con entrada a Construcción y partida controlable. Proporcionar ZIP autónomo con juegos.html y assets locales, que funcione al extraer y abrir sin instalar herramientas ni servidor. Si existe una página de prueba vigente y accesible, integrar allí sin sustituir trabajos ajenos; si falta, crear el contenedor mínimo dentro del paquete.
Entregar enlace de prueba si hay entorno aislado disponible, sin cambiar la web pública ni solicitar aprobación adicional para preparar el ZIP.
No presentar capturas, carrusel o secuencia de pantallas como juego terminado. No falsear acciones con un botón Siguiente.

## Experiencia implementada completa dentro del alcance
1. Nueva partida: personaje controlable, puentes sin resolver, caja y terraza inaccesibles.
2. Recoger materiales visibles; escoger piezas; orientar/elevar cursor; mostrar preview válida o inválida con causa.
3. Colocar piezas altera realmente el mundo y descuenta inventario; recorrer permite pisar la construcción.
4. Cruzar por cualquiera de las dos soluciones válidas, abrir caja mediante interacción cercana y desbloquear escaleras.
5. Llegar a terraza usando escaleras; abrir parcela libre con materiales ilimitados y mismas reglas espaciales.
6. Retirar con devolución completa; bloquear retirada con dependencias; deshacer restaura mundo e inventario de forma coherente.
7. Guardado local, continuar y nueva partida con confirmación. Si no se puede guardar, avisar y permitir seguir jugando.

Objetivo inicial: “La caja de herramientas está al otro lado. Construye un camino para llegar.”
Tras caja: “Ya puedes fabricar escaleras. Llega a la terraza para abrir tu parcela.”
Ayuda voluntaria; sin tutorial obligatorio, daño, salto, temporizador, fichas educativas ni segundo juego.

## Reglas R02 que debe cumplir el runtime
- Disponibles al inicio: 24 madera + 12 piedra; +12 piedra al otro lado.
- Plataforma cuesta 1 madera; bloque 1 piedra; escalera 2 madera.
- Colocación inválida no consume; retirada válida devuelve todo.
- Alcance cursor: 2 casillas desde posición transitable actual. Para extender el puente hay que caminar por lo construido.
- Plataforma: máximo 2 pasos horizontales de plataformas desde apoyo sólido.
- Bloques de apoyo z0 y plataforma transitable z1 según plano R02; una pieza por celda 3D.
- Sin autoescalada de bloques. Escaleras necesarias para tránsito vertical; agua bloquea sin daño.
- A / R1: plataformas C1–C5; bloque C3; coste 5 madera + 1 piedra.
  Secuencia: P1, caminar C1, P2, caminar C2, B3, P3, caminar C3, P4, caminar C4, P5, cruzar.
- B / R2: plataformas C1–C5; bloques C2 y C4; coste 5 madera + 2 piedra.
  Secuencia: B2, P1, caminar C1, P2, caminar C2, B4, P3, caminar C3, P4, caminar C4, P5, cruzar.
- Escalera posterior a caja; conservar alturas y geometría del plano R02 aprobado. No volver a las rutas antiguas 4/6 casillas o a la autoescalada.
- Para retirada y undo, validar dependencias y posición del personaje: nunca dejarlo en agua/vacío ni duplicar recursos; definir y documentar la recuperación coherente.
- No añadir reglas nuevas silenciosamente para facilitar el solver. Si una ambigüedad concreta impide ejecutar ambas soluciones, documentarla y resolverla con Nexo antes de cambiar la mecánica.

## Interfaz y acceso
Escena predominante y personaje visible; Recorrer/Construir; inventario; objetivo; pieza/coste/orientación/altura; colocar/retirar/deshacer/cancelar; ayuda/pausa.
Preservar dirección visual R02, personaje femenino y recursos aprobados disponibles. No bloquear la prueba por pulido final de assets; identificar cualquier placeholder funcional.
Teclado y botones touch reales, no leyendas: flechas/WASD, interacción contextual Enter/Space, giro, altura y controles visibles equivalentes. Documentar atajos y evitar que operen mientras se escribe o se usa un diálogo.
320/390/1440; targets >=44 px; foco independiente de selected; texto legible; forced-colors; aria-live polite para resultados, no cada paso.
NORMAL/REDUCED/NONE conservan consecuencias jugables. Silencio funcional. Sin movimiento decorativo obligatorio.
Texto/DOM accesible para casilla seleccionada, altura, contenido, validez y acciones; no depender solo del canvas.

## Verificación antes de pasarlo a María
Prisma comprueba que el ZIP extraído arranca y funciona sin recursos faltantes. Registrar pruebas sobre build exacta.
Axioma juega las dos soluciones desde partida limpia, prueba errores de apoyo/alcance/ocupación/materiales, retirada dependiente, undo, caja, escaleras, terraza y libre.
Revisar teclado/touch, foco, 320/390/1440, NORMAL/REDUCED/NONE, forced-colors, guardado/recarga y consola/recursos. Separar defectos bloqueantes y limitaciones conocidas.
No repetir auditoría del storyboard salvo regresión real. El gate visual no sustituye pruebas de funcionamiento.

## Entrega y siguiente gate
Publicar en #369:
- enlace accesible al ZIP jugable y, si disponible, a página de prueba;
- archivo de entrada y pasos exactos para abrir;
- commit/build, SHA-256 del ZIP, lista de archivos;
- controles y limitaciones reales;
- evidencia A/B y pruebas ejecutadas; pendientes expresos.
No basta indicar el nombre del ZIP ni publicar PNG.

Gate de entrega propuesto: PRISMA_CONSTRUCTION_PLAYABLE_R01_READY_FOR_AXIOMA.
Tras QA runtime: AXIOMA_CONSTRUCTION_PLAYABLE_R01_READY_FOR_HUMAN_QA, solo si hay evidencia.
Después HUMAN QA MARÍA JUGANDO: ¿construir resulta agradable, hay decisiones, se entiende el efecto y apetece seguir?
Publicar una orden no significa que Prisma esté ejecutándola. Estado actual: orden registrada, runtime pendiente.

## Aprendizaje de coordinación
Nexo pidió HUMAN QA de juego cuando solo había imágenes. Corregido: storyboard revisa diseño; prototipo permite probar interacción; HUMAN QA de diversión exige jugar. No prolongar el ciclo de imágenes cuando el siguiente dato necesario depende del runtime.
