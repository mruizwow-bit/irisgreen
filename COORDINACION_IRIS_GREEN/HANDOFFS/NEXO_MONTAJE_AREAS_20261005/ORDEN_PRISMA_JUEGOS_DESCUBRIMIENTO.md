# Nexo → Prisma · montaje navegable Juegos y Descubrimiento

Fecha: 2026-10-05 · coordinación #369 (Juegos) y #323 (Descubrimiento).

## Autorización y objetivo de María

María confirma que el juego de Construcción ya existe, que las imágenes de Cielo y Peces están terminadas y pide montar también las hojas web de las dos áreas con sus partes Para todos y Plus.

Entregar una versión navegable para comprobar el recorrido completo. La aprobación de una lámina no sustituye probar la página ni el juego. Se autoriza implementar el montaje de prueba con HTML/CSS/JS a partir de los materiales existentes. La restricción visual-only anterior queda superada sólo para este montaje. No constituye HUMAN QA PASS ni autoriza main o publicación pública.

## Responsable y fuentes

Prisma: montaje de interfaz, rutas, fichas y conexión de los runtimes existentes.
Claude Design: fuente del diseño aprobado de Juegos; apoyo visual si falta una pieza concreta de Descubrimiento, sin rehacer Juegos.
Axioma: comprobación del recorrido integrado y accesibilidad real.
María: prueba de producto en versión navegable.
Vector: integración/release posterior a validaciones y autorización aplicable.
Motor sigue con Sabik; no interrumpir ni cambiar su runtime.

Antes de trabajar, leer el estado vivo de #369/#323 y fetch de main para detectar deriva. Reutilizar la rama de implementación pertinente; no mergear en bloque la rama documental de Nexo ni recuperar runtimes descartados.

## 1. Juegos: página de área, catálogos y juego

Base visual exacta:
- CLAUDE_DESIGN_JUEGOS_AREA_VISUAL_R01_3.zip
- SHA256: 6dc3e7e94804357f85daaf538a65a27a1afbc60e0498f92ee492324db6fa2af5
- Library: libfile_8398f67e6ac481919e0b29806df3e903
- Gate: AXIOMA_GAMES_AREA_VISUAL_R01_3_READY_FOR_HUMAN_QA
- Informe Axioma: commit b29cd2a639ac8c1a72f8375ce0a23bd4633285fd, #369 comentario 5999451551.

Montar portada Juegos, entradas Para todos/Plus, catálogos, ficha de Construcción y navegación de retorno.
Conectar el juego existente de Prisma: no recrearlo ni sustituirlo por F01 o una captura.
Identificar en #369 la última entrega jugable y su hash/gate; la afirmación de María de que está hecho no convierte automáticamente un informe técnico anterior en PASS.
Ruta exigida: Juegos → catálogo → ficha → Jugar → Construcción → volver a ficha/catálogo/Juegos.
En la versión de prueba, Jugar debe abrir el runtime conectado. Retirar «no disponible todavía» de esa ficha cuando la conexión sea real. No anunciar disponibilidad pública.
Conservar el juego y sus soluciones. Resolver sólo defectos vigentes de QA y de integración.

J01_320: Axioma considera no bloqueante que Entrar quede bajo el primer viewport. Probar scroll natural con María; si falla, corregir únicamente esa jerarquía.

## 2. Descubrimiento: su propia página, Para todos y Plus

Montar portada Descubrimiento y las dos entradas Para todos / Plus; catálogos por área temática y fichas que llevan a Cielo y Peces.
La arquitectura de navegación debe ser coherente con Juegos, pero la experiencia conserva el contrato de Descubrimiento:
ACTION → CONSEQUENCE → INFERENCE → REVEAL.
No convertirla en rutinas, preguntas de examen ni una sala sensorial.

Ruta exigida: Descubrimiento → catálogo Para todos/Plus → ficha de experiencia → Explorar → experiencia → volver a ficha/catálogo/Descubrimiento.
El montaje de la portada, catálogos y fichas puede avanzar ya mientras se cierran los prototipos.
Conectar los ZIP definitivos validados, conservando estado cuando corresponda; navegación de retorno visible y accesible.
Ninguna maqueta de canvas paralela sustituye al runtime exacto entregado.

Estado conocido al emitir la orden:
- Cielo: patch SHA 2e036ce4c3e3984be09d2c0ba630470f2129be49738960ec070bffa756d0026c; recepción Nexo lista para Axioma, #323 comentario 5999464286.
- Peces: SHA 4598a1153cbcc2741560d30a7e41c5c0828cba508f767abee512ecdfe5ed2392; dos residuos pendientes (cancelación de cámara y copy de candidatos múltiples), #323 comentario 5999609455.
Leer actualizaciones antes de consumir: no fijar como final un ZIP ya sustituido ni reabrir defectos cerrados.

## 3. Biblioteca completa y expansión después de validar prototipos

María informa: imágenes de Cielo y Peces terminadas. Ya no se planifica esperando «40 imágenes pendientes».
Esta declaración registra disponibilidad de producción, no sustituye manifiestos ni aprobación factual/visual de cada archivo.

Inventariar paquetes existentes por ID, versión, hash, alt ES/EN y estado de revisión; reutilizar assets aprobados sin regenerarlos.
Tras validar cada prototipo, ampliar su contenido mediante sus datos/manifiestos. Es la siguiente fase autorizada de integración, no otro ciclo de producción de imágenes.

Cielo:
- Incorporar el conjunto de constelaciones y materiales existentes conforme a los datos y a la interacción validada.
- Mantener orientación y geometría data-backed; nombres y líneas no se revelan antes de la acción semántica.
- La orden de expansión posterior supera la limitación a Orión sólo tras validar el prototipo; no habilita indiscriminadamente otras experiencias astronómicas ni datos inventados.
- Curar vistas y cargar contenido a demanda; no dibujar las 88 láminas juntas como fondo.

Peces:
- Incorporar catálogo completo por taxón, hábitat, zona y escena.
- Conservar pares oscuro/luz registrados y compatibles; no modificar geometría ni asumir que un cambio de bandera basta.
- Reconciliar manifiestos/revisiones existentes de Senda/Astra. Asignación factual pendiente de un animal no bloquea montar las páginas ni incorporar los ya aprobados.
- Compartir catálogo no implica compartir hábitat o profundidad. No introducir todos los animales en el tramo mesopelágico.
- Mantener natación, cámara navegable, luz y acción Examinar según el runtime validado.

## 4. Para todos / Plus

Ambas áreas deben tener las dos partes montadas con rutas reales y retorno, no dos tarjetas decorativas.
Reutilizar la clasificación comercial canónica si está registrada. Si no existe una asignación final, registrar el dato pendiente por experiencia; no inventar precios, acceso, planes ni duplicar el mismo juego para simular dos catálogos.
En la prueba interna María debe poder probar las experiencias conectadas sin efectuar un cobro.
El diseño de las secciones puede completarse aunque una clasificación siga pendiente.
No activar pagos live, cuentas simuladas como reales ni promesas de suscripción. Stripe/Netlify sigue su carril y autorización propios.

## 5. Canon obligatorio

Sólo NAVY. Fondo general #0B1A2B; panel #15304A; secundaria #1D3D5C.
Texto #EEF4F8; secundario #C9D5DD; enlaces #9FDCEA; foco/acento #C3B8FF.
Borde de control #8494A8; separador decorativo #2A4460.
Botón principal #DCE8F2 con texto #0B1A2B.
Atkinson Hyperlegible local: cuerpo 1rem, base 16px, interlineado 1.6.
Newsreader: títulos 600/1.2; portada 400, 40–56px adaptables, interlineado 1.06.
Introducción Atkinson ~19px/1.58. Sin selector de tema.
Marca Iris Green y assets existentes. Reserva Sabik según diseño, sin crear otra voz o núcleo.

## 6. Entregable para probar

- Una entrada navegable única al montaje y rutas reales de ambas áreas.
- Enlace de prueba mediante el entorno de revisión autorizado; no sustituirlo por capturas. Si no existe alojamiento privado autorizado, entregar paquete ejecutable local con entrada única y registrar ese impedimento concreto; no desplegar públicamente por defecto.
- ZIP ejecutable y SHA256, commit/rama, mapa de rutas, hashes de runtimes y assets consumidos.
- Menú abre/cierra, foco retorna, enlaces navegan, Jugar/Explorar abre la experiencia, Volver funciona.
- Separar evidencias del diseño, runtime individual y recorrido integrado; ningún PASS se hereda automáticamente.
- Comprobar 320/390/1440, teclado/touch, texto al 200 %, foco, aria-current, NORMAL/REDUCED/NONE, forced-colors y carga de fuentes/assets. Reportar sólo pruebas ejecutadas.
- Antes de dar a María el montaje, comprobar enlaces sin destinos vacíos, consola, recursos ausentes y posible pérdida de progreso al volver.

No se exige otra ronda de storyboards para Juegos. El resultado esperado es poder entrar, explorar y jugar.

## Secuencia

Montar páginas/catálogos → conectar entregas existentes con versión identificada → Axioma recorrido integrado → HUMAN QA María.
Ampliar contenido de cada experiencia cuando quede validado su prototipo, según esta orden.
Mantener legacy como rollback. NO MAIN · NO PUBLIC DEPLOY hasta la autorización de release correspondiente.
