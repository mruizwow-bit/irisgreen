# Nexo · retest acotado de Vida marina R05
Fecha 2026-10-06. Estado: KEEP_R05 · TWO_RUNTIME_RESIDUES_REQUIRE_PATCH.
Se conservan las correcciones cerradas. No reconstruir motor ni redibujar assets.
No Axioma PASS ni HUMAN QA. La evidencia propia es Node/Canvas; no navegador.

## Entradas e integridad
Producto descubrimiento-peces-R05.zip:
SHA256 554b9fd5682cc7222df215efa58f544d13181c6ac62a449b51f7b12753097236
6 387 505 bytes; 35 archivos; 34/34 entradas del manifiesto correctas.
Interno descubrimiento-peces-R05-interno.zip:
SHA256 3cbe3db8c149ab24efc5d2388b2b14da20998791b5ea5ce310155a5e32de8818
982 201 bytes; 31 archivos; sin manifest global equivalente encontrado.
Los seis PNG siguen coincidiendo con hashes declarados.
Producto ahora contiene tres registros y una escena. Catálogo completo separado al interno.

## Método
Leídos diffs de motor/interfaz contra R04, datos, pruebas r05.js, resultados y notas.
Abierta visualmente regiones-de-observacion-R05.png adjunta.
Ejecutadas funciones y listeners originales en fixtures Node y dibujo original con Canvas nativo. Estados construidos explícitamente para aislar casos.
No he ejecutado Playwright ni recorrido el runtime en navegador real. Foco nativo, lectura asistida, reflow y móvil son evidencia del autor o pendientes, no pruebas propias.
Retest reproducible: retest.cjs y RETEST_RESULTS.json. Requiere Node y @napi-rs/canvas; leer ruta del ZIP extraído en script. Producto original intacto.

## Correcciones que quedan cerradas en el alcance comprobado
1. Registro global con pivote/reflexión común. Función de dibujo original, escala nativa, sin onda para aislar registro, alfa >=128:
| Par | giro +1 | giro -1 |
|---|---:|---:|
| Hacha | 0.988837 | 0.988837 |
| Linterna | 0.981799 | 0.981799 |
| Calamar | 0.963940 | 0.963940 |
Ya no aparece el 0.8055 del calamar invertido en R04. Los giros intermedios con onda figuran en evidencia entregada por autor; no atribuirlos a este test independiente.
Este cierre es del error de transformación global, no del residuo anatómico de los assets.
2. Giro usa dt. Tras un segundo con 30/60/120 pasos: -0.9437686805 en los tres. Ya no tiene velocidad por frame.
3. NONE conserva centro y giro del estado construido. No completa ni invierte giro al detener.
4. Al ocultar Otro animal enfocado, la función llama focus sobre Examinar antes de hidden=true. Fixture confirma orden/llamada; el comportamiento DOM real consta como prueba del autor.
5. Dos contactos quietos, soltar segundo y primero: cero llamadas a apuntar. Cierra la secuencia que fallaba R04; no prueba pinch/scroll en teléfono.
6. Primera entrada con varios candidatos anuncia y siguiente Enter identifica. Ya no está mudo.
7. Separación del catálogo: tres registros/una escena en producto.
8. Notas y resultado R05 actuales, pruebas de Tab real y clipping ampliadas en banco del autor; exit code de fallo al terminar.

## Dos residuos de runtime
### R05-N01 · La frecuencia de dibujo cambia al entrar NONE
perfilDibujo conserva ampPose, pero devuelve frecuencia del perfil ninguno: 0.
ondaY calcula fase con t * nado.frecuencia * f.frecuencia. Al pasar de normal a ninguno, desaparece ese término; la forma vuelve a otra fase aunque reloj no cambie.
Fixture con reloj=7, pausa=true, centro/giro intactos, 18 tiras, alto de representación 400 px:
- Hacha: mayor cambio vertical de tira 9.783 px.
- Linterna: 24.411 px.
- Calamar: 19.830 px.
Son desplazamientos calculados de tiras en prueba controlada, NO mediciones de screenshot de navegador.
El test del autor NINGUNO-CONSERVA-POSE mide centro y giro, no onda; por eso no encuentra el fallo.
NORMAL→REDUCED también sigue sustituyendo directamente amplitud/frecuencia; no hay transición de pose implementada.

Patch: separar reloj/fase de animación del perfil de velocidad. NONE conserva fase, amplitud y pose visibles sin animarlas. Cambiar velocidad futura no debe recalcular toda la fase pasada; para REDUCED conservar continuidad y adaptar la evolución. No basta guardar únicamente amplitud.
Retest con reloj detenido en fase no nula: comparar forma renderizada además de centro y giro en NORMAL→NONE, REDUCED→NONE y NORMAL↔REDUCED. Comprobar continuar sin salto.

### R05-N02 · Confirmación múltiple queda obsoleta
ui.avisoVarios se escribe con los IDs ordenados, pero no se limpia al salir de la situación, continuar, cambiar encuadre o sustituirse el candidato.
Secuencia reproducida con listener original:
1. A+B, candidato A, Enter → anuncia dos señales y A.
2. Ningún candidato, Enter → anuncia ninguno.
3. A+B, candidato B, Enter → examina B directamente, sin anuncio previo.
La clave A,B coincide aunque es una nueva situación y el objetivo ya no es el anunciado.
Patch: confirmación pendiente acotada a interacción/objetivo, invalidada al perder candidatos o cambiar contexto; no un recuerdo permanente por conjunto de IDs. Primera activación de una nueva situación informa; la siguiente confirma el objetivo vigente. Una selección explícita con Otro animal puede anunciar el nuevo objetivo y establecer confirmación coherente.
Comprobar también mantener Enter pulsado (event.repeat) para que la repetición de tecla no convierta aviso en confirmación involuntaria.
No cambiar a identificación automática.

## Lámina de regiones: revisión visual, no validación científica
La imagen adjunta sí existe y se ha podido abrir.
- Hacha: caja de todo el cuerpo. Sirve como aproximación de silueta alta, pero el 50 % puede alcanzarse sin ver los ojos. No atribuir a ese criterio observación de ojos. Separar descripción posterior de lo que se afirma haber visto; si los ojos se usan como pista, región específica.
- Linterna: franja inferior incluye vientre, aletas y parte de cola. Es una aproximación útil, no una máscara de las hileras luminosas. Revisar que muestras/tolerancia permitan realmente ver esas hileras; evitar exigir precisión de puntos individuales.
- Calamar: caja frontal incluye cabeza y brazos y es coherente para observar su agrupación. No comprueba por sí sola la transparencia del manto. pistaForma aún dice brazos cortos; la lámina muestra apéndices extendidos: usar descripción observable prudente, por ejemplo brazos agrupados al frente, sin inventar proporción.
No pedir nuevo arte para resolver copy/anotación. Revisión factual pendiente se mantiene.
Residuo del par calamar sigue documentado. No llamar PASS anatómico a IoU>=.96 ni exigir IoU1 como objetivo perceptual universal.

## Pendientes documentales/técnicos sin reabrir los cierres anteriores
- NOTAS vuelve a decir ningún par cambia anatomía y parejas técnicas idénticas al píxel. Sustituir por alcance medido: coincidencia de alfa y residuos locales pendientes; RGBA distintos entre estados.
- r05.js acepta carpeta por argumento, pero sigue fijando ejecutable /opt/pw-browsers/chromium. Usar navegador instalado/configurable.
- Clipping se mide en página inicial y .envoltura; no cubre por sí solo ajustes/álbum/visor/franja abiertos. Mantenerlos como pendientes de QA, no dar toda accesibilidad por cerrada.
- Resultados incluyen inyección de giro y apuntar por debug: válidos como tests de motor, no rutas completas de persona por interfaz.
- Se incluye helper de diagnóstico en producto: no confundir con haber eliminado todo código técnico. No es una vulnerabilidad demostrada ni motivo para rediseñar.
- Versiones runtime/schema/contenido y migración de guardado siguen sin explicitarse; clave r01 persiste. No renombrarla sin conservar álbum.
- avisar todavía suprime mensajes repetidos; revisar acciones deliberadas sin saturación.
- Teléfono físico, lectores reales, Safari/Firefox y juicio perceptual siguen pendientes.

## Siguiente paso
Patch mínimo de fase de nado y confirmación múltiple, ajuste de copy/regiones y notas. Retest dirigido sobre nuevo hash; conservar cierres de registro, dt, foco y catálogo.
Después Axioma verifica runtime real y María observa nado/revelado. Puede preparar inventario y diseño de microescena mientras tanto; no escalar contenido ni publicar.
NO MAIN · NO PUBLIC DEPLOY · NO REGENERAR ASSETS.
