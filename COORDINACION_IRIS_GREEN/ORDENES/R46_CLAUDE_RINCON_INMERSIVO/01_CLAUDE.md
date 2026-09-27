# CORRECCIÓN DE MARÍA · PAISAJES · YOUTUBE, NO PEXELS

Esta corrección **supersede cualquier interpretación anterior** de R46 que lleve a buscar, descargar o montar paisajes desde Pexels como fuente principal.

María rechaza:
- clips Pexels de cámara en movimiento;
- tomas cortas;
- paisajes construidos como montaje de muchas localizaciones;
- descargar grandes tandas de stock para fabricar una escena;
- repetir clips de pocos minutos como si fueran una experiencia larga.

## Fuente preferida para Paisajes

**YouTube embebido dentro de Iris Green, siguiendo el patrón ya existente de la Videoteca.**

La web actual ya usa:
- `https://www.youtube-nocookie.com/embed/...`;
- iframe creado solo después de pulsar;
- reproducción dentro de Iris Green;
- ningún iframe/tercero cargado antes de la acción.

R46 debe reutilizar/adaptar este patrón, no inventar otro sistema.

### Criterio visual obligatorio por vídeo

Aceptar únicamente vídeos que cumplan TODOS:
- duración larga: preferiblemente 30–60+ min; mejor 1 h o más;
- un único paisaje/entorno coherente;
- cámara fija o prácticamente fija;
- si hay movimiento de cámara, debe ser excepcional, lentísimo y no navegacional;
- sin dron recorriendo el paisaje;
- sin travel montage;
- sin cambio continuo de localización;
- sin timelapse agresivo;
- sin zooms/pans repetidos;
- sin personas hablando;
- sin texto, logos animados u overlays molestos sobre la imagen;
- sin flashes/cambios bruscos de luminancia;
- sin cortes frecuentes;
- sin sucesos repetitivos fácilmente reconocibles.

Ejemplos de familias adecuadas:
- playa en plano estable;
- río/cascada en plano estable;
- lluvia sobre ventana/bosque en plano estable;
- acuario/medusas en plano estable;
- fuego/chimenea si se incorpora posteriormente;
- cielo/noche en plano estable.

## NO descargar YouTube

No descargar, rippear, rehostear ni editar vídeos de YouTube.

Se usan mediante embed autorizado por el propio vídeo/canal.

Si el vídeo deja de permitir embedding:
- marcar unavailable;
- fallback local;
- sustituir tras revisión editorial.

## Privacidad / carga

Aplicar el mismo principio que Videoteca:
- poster/miniatura local o first-party antes de pulsar;
- NO cargar iframe de YouTube al entrar;
- NO preconnect a YouTube por defecto;
- tras acción explícita crear iframe `youtube-nocookie.com`;
- `referrerpolicy="strict-origin-when-cross-origin"`;
- `playsinline=1`;
- `rel=0`;
- mantener controles accesibles;
- tamaño de player suficiente;
- nada de autoplay al cargar la página.

YouTube Privacy Enhanced Mode reduce personalización, pero no significa “sin terceros” después de pulsar.

## Audio

El audio de YouTube NO forma parte de la experiencia del Rincón.

- player de YouTube silenciado;
- audio Iris Green separado;
- usuario elige imagen sola o imagen + audio Iris Green;
- nunca mezclar el audio del vídeo con el audio propio;
- nunca empezar audio automáticamente al entrar.

Si se usa IFrame API:
- `enablejsapi=1`;
- `origin=https://irisgreen.eu` en producción;
- `player.mute()` como estado obligado;
- timer puede pausar/detener, pero no debe iniciar reproducción sin acción de la persona.

## Anuncios / interrupciones · GATE DE PRODUCTO

YouTube puede servir anuncios también en embeds y Privacy Enhanced Mode puede seguir mostrando anuncios no personalizados.

Por tanto, cada candidato debe probarse en embed real:
- sesión limpia;
- no logueada;
- desktop;
- móvil;
- inicio;
- al menos 20–30 min de reproducción.

Si aparecen:
- pre-roll;
- mid-roll;
- anuncios;
- promociones;
- pantallas invasivas;
- interrupciones que rompan la calma;

=> **REJECT_CANDIDATE**.

No existe permiso para ocultar/recubrir publicidad del player ni saltársela mediante ingeniería.

Si ningún vídeo YouTube de una categoría pasa este gate, esa categoría usa:
1. otro vídeo embebible aprobado;
2. otra plataforma embebible compatible;
3. fallback local/GPU;
pero NO vuelve automáticamente a Pexels.

## Child-safe / YouTube

El Rincón sirve también a infancia/adolescencia.

Antes de publicar un embed:
- comprobar que no tiene restricción de edad;
- comprobar título/canal/miniatura/contenido;
- no usar comentarios ni recomendaciones como UI propia;
- `rel=0` limita relacionados al mismo canal, pero no elimina toda UI de YouTube;
- revisar requisitos de YouTube para superficies dirigidas a menores y self-designation cuando aplique;
- Privacy Enhanced Mode obligatorio.

## Gate humano

La pregunta no es “¿es 4K?” sino:
**¿podría dejar esta imagen 20–60 minutos delante de una persona que busca calma sin que la cámara, los cortes o la plataforma le reclamen atención?**

Si la respuesta es no, el vídeo no entra.

---

# ORDEN DE MARÍA · CLAUDE · RINCÓN TRANQUILO DEFINITIVO

Fecha: 27/09/2026  
Responsable de construcción: **Claude**  
Puerta de integración: **A2**  
Aceptación final: **HUMAN QA de María**

Esta orden sustituye cualquier interpretación anterior del Rincón que lo trate como una página con tres bloques. El objetivo es una **experiencia de calma inmersiva real**, accesible, adulta, moderna y de baja estimulación.

No se vuelve a R03/R04. No se reconstruye desde una copia antigua. No se pierde trabajo válido ya integrado.

---

# 0. ARRANQUE OBLIGATORIO

Antes de tocar código:

1. leer esta orden completa;
2. leer Control Maestro vigente;
3. leer Memoria Maestra vigente;
4. leer #288;
5. leer PR #300 ya integrado;
6. leer PR #303 y conservar sus dos fixes;
7. leer Design R02 / #301;
8. leer la normativa embebida al final de esta orden;
9. releer HEAD/tree reales de A2;
10. publicar `R46_CLAUDE_RINCON_BASE_READ`;
11. construir en la misma sesión;
12. actualizar Memoria + Control al entregar.

El acuse no es una fase de espera.

---

# 1. BASE REAL

Repositorio:
`mruizwow-bit/irisgreen`

Puerta web:
PR #244 · rama `agent2/sabik-iris-r08-20260924`.

HEAD observado al emitir:
`bf44d6ae7aa362b81fadb16b44bdef358cc31bcc`.

**No congelar este SHA.** Claude debe releer HEAD/tree inmediatamente antes de crear su rama.

Fuente audiovisual válida:
- PR #300: MERGED;
- PR #291: superseded como solución final;
- PR #303: dos fixes obligatorios.

## Fixes #303 que no se pueden perder

1. mutación idempotente de clase mediante `setBodyClass()` para evitar feedback loop de `MutationObserver` en Pantalla limpia;
2. `.r42-rincon .r40-scene-actions [hidden]{display:none!important}` para impedir que `#sceneTouch[hidden]` reaparezca como control vacío.

Si #303 ya está integrado al empezar, construir sobre ello. Si no, portar exactamente esos fixes al nuevo delta.

## Archivos actuales que Claude debe estudiar antes de reconstruir

- `assets/rincon-calma.js`
- `assets/rincon-audio-r42.js`
- `assets/rincon-realmedia-r42.js`
- `assets/rincon-r42.js`
- `assets/rincon-r42.css`
- `assets/rincon-r42-humanqa.css`
- `es/sitio-tranquilo/index.html`
- `en/quiet-space/index.html`
- `docs/r42-a7-humanqa/MEDIA_PROVENANCE.md`

No borrar donantes válidos hasta que la nueva versión haya pasado A2 + HUMAN QA.

---

# 2. DECISIÓN DE PRODUCTO

El Rincón tranquilo tendrá **tres modos principales**:

1. **Respirar / Breathe**
2. **Paisajes / Landscapes**
3. **Inmersivo / Immersive**

La interfaz anterior:
`Vídeos · Sonidos · Bola`

queda sustituida por:
`Respirar · Paisajes · Inmersivo`.

## Audio

**No crear otra biblioteca de audio ni buscar audios externos.**

La web ya dispone de audio propio. Reutilizar:
- `assets/rincon-audio-r42.js`;
- `window.IGSonidos`;
- los ambientes ya aprobados/procedentes de Iris Green.

El audio deja de ser un modo principal. Se integra de forma opcional en Paisajes e Inmersivo.

Nada empieza solo.

---

# 3. REFERENCIA CONCEPTUAL · MUSEO INMERSIVO DE MADRID

Tomar como referencia conceptual el éxito del modelo de **Nomad Museo Inmersivo, Gran Vía 78, Madrid**.

Referencia pública:
https://www.esmadrid.com/informacion-turistica/nomad-museo-inmersivo

La idea útil NO es copiar sus obras ni estética, sino comprender:
- espacio tratado como experiencia completa;
- proyección a gran escala;
- varias superficies/ángulos;
- continuidad visual;
- sensación de entrar "dentro" de la escena;
- interacción suave.

## Adaptación Iris Green

El Rincón NO busca espectáculo.

Debe transformar la idea inmersiva en:
- baja estimulación;
- movimientos lentos;
- profundidad;
- continuidad;
- ausencia de sobresaltos;
- interacción opcional;
- sin exigencias;
- sin gamificación;
- sin tareas;
- sin puntuación;
- sin recompensas.

---

# 4. NUEVA INTERFAZ

## 4.1 Primer viewport

Desktop:
1. cabecera Iris Green compacta;
2. título breve;
3. selector `Respirar | Paisajes | Inmersivo`;
4. stage/workspace grande inmediatamente visible;
5. controles esenciales;
6. secundarios en drawer/popover/sheet.

Prohibido:
- acordeones gigantes;
- listas largas antes del stage;
- 9 tarjetas antes de ver la experiencia;
- tutorial largo;
- grid de opciones que obligue a scroll para encontrar la herramienta.

## 4.2 Stage

Debe dominar la página.

Desktop 1440×900:
- visible en primer viewport;
- ancho cercano al workspace completo;
- altura orientativa 65–76 svh según modo;
- controles fuera del centro visual;
- sin superposición accidental.

Móvil 390×844:
- stage primero;
- altura útil 52–64 svh según modo;
- bottom dock;
- ajustes en bottom sheet;
- selector de escenas en carrusel horizontal o sheet.

## 4.3 Selector principal

Un solo modo activo.

Al cambiar:
- parar o pausar el modo anterior;
- liberar recursos innecesarios;
- no arrancar automáticamente el nuevo;
- conservar preferencias globales de volumen/intensidad cuando proceda.

## 4.4 Chrome / Design R02

Usar el sistema material vigente:
- cristal solo en chrome;
- `chrome-dark` en escenas oscuras;
- stage/contenido estable;
- transparencia Normal / Reducida / Opaca;
- forced colors;
- no glass-on-glass;
- reduced motion.

## 4.5 Pantalla limpia

Debe ser una función central.

Al activarse:
- stage ocupa la pantalla disponible;
- desaparece chrome secundario;
- controles vuelven por interacción o foco;
- salida siempre recuperable;
- Escape cuando corresponda;
- conservar los fixes #303;
- ningún freeze;
- ningún control oculto reaparece.

Fullscreen API puede ser mejora opcional tras gesto explícito, pero **Pantalla limpia propia es el baseline**.

---

# 5. RESPIRAR · BOLA DE RELAJACIÓN

## 5.1 Propósito

Una experiencia visual tranquila.

Puede:
- mirarse sin hacer nada;
- servir como guía de respiración si la persona quiere.

No presentar como tratamiento.
No prometer bajar ansiedad.
No obligar a sincronizar respiración.

Copy ES:
`Mira la bola o respira con ella si te resulta cómodo.`

Copy EN:
`Watch the ball, or breathe with it if that feels comfortable.`

## 5.2 Nueva bola

No entregar la bola actual como resultado final si sigue pareciendo una animación CSS decorativa.

Construir una esfera con:
- volumen suave;
- núcleo;
- halo controlado;
- iluminación difusa;
- expansión/contracción predecible;
- profundidad;
- cero flashes;
- cero cambios bruscos;
- fondo oscuro suave, no negro agresivo.

## 5.3 Motor

Tier A: WebGPU/WGSL.  
Tier B: WebGL2.  
Tier C: Canvas 2D / CSS.  
Tier D: estático accesible.

La persona no puede quedar fuera por no tener WebGPU.

## 5.4 Modos

- Solo mirar / Just watch
- 4 s crecer + 6 s encoger / Gentle 4–6
- 6 s + 6 s / Slow 6–6

No retención de respiración por defecto.

Duración:
- libre;
- 1 minuto;
- 3 minutos;
- 5 minutos.

Controles:
- Empezar;
- Pausar;
- Reanudar;
- Parar;
- Pantalla limpia.

Nada empieza al entrar.

## 5.5 Reduced motion

Con `prefers-reduced-motion` o ajuste Iris Green:
- no pulsación continua automática;
- alternativa por estados discretos;
- opción estática;
- la guía sigue siendo comprensible.

## 5.6 Haptics

No incluir vibración/haptics en R46.

---

# 6. PAISAJES · VÍDEOS RELAJANTES LARGOS

## 6.1 Catálogo inicial

Prioridad:
- Playa / Beach
- Río / River
- Lluvia / Rain
- Noche / Night
- Acuario / Aquarium
- Medusas / Jellyfish

Pulpos puede mantenerse como secundario si pasa HUMAN QA.

Tubo de burbujas y Fibra óptica pasan preferentemente al modo Inmersivo.

## 6.2 DURACIÓN · GATE DURO

**No se aceptan paisajes de 1–2 minutos repetidos en loop evidente.**

Objetivo de experiencia por paisaje:
- **20–30 minutos reales de reproducción relajante**;
- presets de 10 / 20 / 30 / 60 minutos;
- opción `Continuo / Continuous`.

La persona debe poder permanecer en un paisaje sin notar que el mismo clip vuelve a empezar cada pocos minutos.

### Forma preferida

Un vídeo largo embebible de YouTube u otra fuente aprobada:
- idealmente 30–60+ minutos;
- preferencia 1 h o más;
- un solo entorno;
- cámara fija o casi fija;
- sin montaje turístico ni cambios de lugar.

Los programas multi-segmento dejan de ser la solución preferida. Solo pueden estudiarse como excepción editorial si reproducen un único entorno de forma verdaderamente continua y María los aprueba expresamente.

Pexels no se usa como fuente principal de Paisajes.

### Gate humano

Si María detecta:
- reinicio evidente;
- patrón que vuelve demasiado pronto;
- salto de luminancia;
- salto de cámara;
- cambio brusco;
- loop perceptible;

=> FAIL y se reconstruye.

## 6.3 Temporizador

La duración seleccionada controla la **sesión**, no obliga a que un único archivo pese 30 minutos.

Al terminar:
- vídeo y audio hacen fade-out suave;
- no aparece alarma;
- no sonido final;
- pantalla queda en estado calmado.

## 6.4 Reproductor

Controles esenciales:
- Ver;
- Ver y escuchar;
- Pausa/Reanudar;
- Silenciar;
- Volumen;
- Parar;
- Pantalla limpia;
- Paisaje;
- Duración.

Secundarios:
- brillo/intensidad;
- luz cálida si se conserva;
- calidad/ahorro de datos si realmente aporta valor.

## 6.5 Audio

Usar exclusivamente audio Iris Green.

Mapeo:
- playa → mar;
- río → río;
- lluvia → lluvia;
- noche → noche;
- acuario/medusas → ambientes actuales correspondientes.

El audio del vídeo remoto permanece silenciado.

Fade-in inicial suave.
Fade-out al cambiar/parar.

## 6.6 Vídeo técnico

Conservar:
- `preload="none"`;
- carga tras acción explícita;
- `playsInline`;
- vídeo muted;
- pausa en background;
- liberación de recursos al parar.

Mantener/usar `requestVideoFrameCallback()` cuando exista para readiness, con fallback.

Usar `navigator.mediaCapabilities.decodingInfo()` cuando existan variantes para escoger:
- formato soportado;
- reproducción fluida;
- eficiencia energética.

No seleccionar por user-agent string.

## 6.7 Formatos/calidad

Preferir varios encodes por paisaje cuando sea viable:
- H.264/MP4 como fallback amplio;
- VP9/WebM o AV1 si el navegador declara soporte fluido/eficiente.

No exigir AV1.

No descargar 30 minutos completos al entrar.
Usar carga progresiva/range/CDN adecuado.

Si se alojan vídeos localmente:
- documentar tamaño;
- bitrate;
- duración;
- resolución;
- coste de transferencia estimado.

## 6.8 Save-Data / conexiones limitadas

Con Save-Data:
- mostrar poster/local fallback primero;
- no descargar programa largo sin acción explícita;
- ofrecer calidad reducida;
- mantener la experiencia utilizable.

---

# 7. INMERSIVO · SALAS DIGITALES

## 7.1 Definición

Inmersivo NO significa:
- vídeo fullscreen;
- partículas detrás del texto;
- salvapantallas;
- shader genérico;
- un canvas pequeño.

Debe simular un espacio que rodea visualmente a la persona.

Desktop:
- plano central;
- planos laterales en perspectiva;
- suelo/luz inferior;
- continuidad entre superficies;
- profundidad.

Móvil:
- una superficie envolvente simplificada;
- no tres paneles diminutos.

## 7.2 Cinco salas iniciales

### 1. Océano de luz / Ocean of light
- caústicas;
- ondas amplias;
- profundidad azul;
- respuesta lenta al pointer/touch;
- audio de mar opcional.

### 2. Lluvia de cristal / Glass rain
- gotas lentas;
- refracción suave;
- varias capas;
- sin tormenta;
- sin truenos;
- sin relámpagos;
- audio de lluvia opcional.

### 3. Río de luz / River of light
- flujo orgánico;
- cintas de luz;
- pequeñas turbulencias;
- audio de río opcional.

### 4. Aurora lenta / Slow aurora
- velos volumétricos;
- estrellas mínimas;
- movimiento muy lento;
- sin flashes;
- noche o casi silencio.

### 5. Espacio de respiración / Breathing room
- el entorno entero usa el ciclo de la bola;
- paredes/luz se expanden y contraen;
- modo Solo mirar;
- puede funcionar sin audio.

## 7.3 Interacción

Opcional:
- pointer/touch provoca ondas lentas;
- teclado equivalente;
- no interacción necesaria para disfrutar.

Prohibido:
- cámara;
- micrófono;
- reconocimiento;
- geolocalización;
- seguimiento corporal;
- orientación del dispositivo como requisito;
- biometría;
- guardar gestos;
- puntuación;
- recompensa;
- tareas.

---

# 8. MOTOR TECNOLÓGICO

## Tier A · WebGPU

Aplicar WebGPU/WGSL cuando esté disponible para:
- caústicas;
- campos fluidos visuales;
- partículas suaves;
- blend de capas;
- iluminación;
- profundidad;
- efectos compute solo si aportan valor medible.

WebGPU = progressive enhancement.

## Tier B · WebGL2

Fallback visual completo, simplificado.

## Tier C · Canvas 2D

Fallback animado ligero.

## Tier D · estático

Imagen/gradiente finalizado, no placeholder.

## OffscreenCanvas / Worker

Usar cuando:
- soporte estable;
- mejora medible;
- reduce long tasks/main thread.

No introducirlo por moda.

## WebCodecs

No es requisito.
Native `<video>` es el baseline.

WebCodecs solo si existe una necesidad concreta de frame processing y hay fallback.

## WebXR

Investigar solo como mejora futura.
No forma parte del gate R46.
No AR/passthrough.
No permisos nuevos.
No bloquear entrega.

---

# 9. RENDIMIENTO

Objetivos orientativos a medir, no prometer como SLA:

- interacción de controles inmediata;
- evitar long tasks repetidos >50 ms;
- mantener frame pacing estable;
- no tener dos salas GPU vivas simultáneamente;
- detener RAF/worker cuando el modo no está activo;
- pausar en background;
- liberar buffers/texturas/vídeos al cambiar;
- no precargar los seis programas de vídeo.

Entregar:
- memoria aproximada;
- FPS/frame-time representativo;
- long tasks;
- tamaño de assets;
- datos transferidos por sesión 10/20/30 min;
- fallback activado por capacidad.

---

# 10. ACCESIBILIDAD SENSORIAL Y COGNITIVA

Obligatorio:
- WCAG 2.2 AA objetivo técnico;
- W3C COGA;
- HTML semántico;
- teclado;
- foco visible;
- nombres accesibles;
- lector de pantalla;
- 320 px;
- zoom/reflow;
- forced colors;
- reduced motion;
- reduced transparency;
- ES/EN;
- no color único;
- no autoplay;
- no audio inesperado;
- no flashes;
- no movimientos rápidos;
- no parallax agresivo;
- no camera shake;
- no crossfade brusco;
- no control oculto imposible de recuperar.

## Intensidad visual

Incluir control simple:
- Suave / Gentle
- Normal

No "intenso" por defecto.

El modo Suave reduce:
- velocidad;
- densidad de partículas;
- contraste de luces;
- amplitud de interacción.

---

# 11. COPY / LENGUAJE

Muy poco texto.

Entrada ES:
`Elige una forma de estar aquí. Nada empieza hasta que tú lo decidas.`

EN:
`Choose how you want to be here. Nothing starts until you decide.`

No:
- "regula tu sistema nervioso";
- "cura";
- "terapia";
- "reduce la ansiedad garantizado";
- lenguaje diagnóstico;
- lenguaje infantil.

---

# 12. PRIVACIDAD

R46:
- sin cuenta;
- sin telemetría nueva;
- sin analytics de conducta;
- sin cámara;
- sin micrófono;
- sin geolocalización;
- sin almacenamiento de hábitos;
- preferencias solo en el sistema local ya existente si corresponde.

No crear un segundo storage.

---

# 13. FUENTES, LICENCIAS Y VÍDEO

Cada clip externo debe registrar:
- título;
- autor;
- URL de fuente;
- licencia;
- URL de licencia;
- fecha de consulta;
- archivo usado;
- duración;
- resolución;
- hash si se copia/localiza;
- paisaje/programa al que pertenece.

No usar:
- Pexels como fuente principal de paisajes;
- descargas/rips/rehosting de YouTube;
- vídeos con anuncios o interrupciones perceptibles;
- cookies de terceros;
- assets sin licencia clara;
- stock con watermark.

Preferir:
- first-party;
- dominio público;
- CC0;
- CC BY;
- CC BY-SA compatible, con atribución correcta.

Si el programa usa varios clips, mantener manifest de secuencia.

---

# 14. ARQUITECTURA DE CÓDIGO

No rehacer toda la web en React/Vue/Svelte.

Mantener MPA/prerender + progressive enhancement.

Preferir módulos acotados nuevos, por ejemplo:
- `assets/rincon-r46.js`
- `assets/rincon-r46.css`
- `assets/rincon-r46-immersive.js`
- `assets/rincon-r46-landscapes.js`
- `assets/rincon-r46-breath.js`
- `assets/rincon-r46-worker.js` si se justifica.

Claude puede mejorar nombres, pero:
- no duplicar motores;
- no dejar dos runtimes compitiendo;
- mantener adaptadores pequeños;
- eliminar código legacy solo cuando el reemplazo esté cubierto por tests.

---

# 15. QA OBLIGATORIO

## Automático

- ES/EN;
- sintaxis/build;
- rutas;
- no overflow;
- 1440×900;
- 390×844;
- 320×800;
- teclado;
- foco;
- Escape;
- ARIA;
- reduced motion;
- reduced transparency;
- opaque;
- forced colors;
- Save-Data;
- cambio de modos libera recursos;
- background pausa;
- clean mode entra/sale repetidamente;
- #303 no regresa;
- audio no comienza solo;
- vídeo no comienza solo;
- landscape duration/session;
- fallback WebGPU→WebGL2→Canvas→static.

## Paisajes largos

Probar como mínimo:
- 20 minutos playa;
- 20 minutos río;
- 20 minutos lluvia.

Registrar:
- número de segmentos;
- transiciones;
- momento de repetición;
- buffering;
- memoria;
- si hubo salto perceptible.

Un test que solo acelera el tiempo NO sustituye la observación real de transiciones.

## Human QA de Claude antes del handoff

Claude debe mirar de verdad:
- bola;
- al menos 3 paisajes largos;
- las 5 salas;
- desktop;
- móvil.

No cerrar por hashes.

---

# 16. ENTREGA A A2

Entregar:

- branch;
- base HEAD/tree;
- HEAD/tree final;
- PR;
- diff;
- archivos;
- manifest de vídeo/licencias;
- arquitectura de los programas largos;
- tabla de tecnologías y fallbacks;
- tabla WebGPU/WebGL2/Canvas/static;
- QA;
- performance;
- capturas;
- clips/capturas de transición si procede;
- ES/EN;
- memoria/control actualizados;
- pendientes manuales.

Marcadores finales:

`R46_CLAUDE_RINCON_REBUILD_READY_FOR_ASTRA`

Después:
1. Astra revisa;
2. A2 integra;
3. A2 publica una preview;
4. María hace HUMAN QA;
5. si María detecta repetición, sobreestimulación, controles molestos, mala inmersión o calidad baja, vuelve a construcción.

No main.  
No producción.  
No deploy propio.  
No audio externo nuevo.  
No voz Sabik.  
No tocar Home A8 ni Cloud A9.

---

# 17. REFERENCIAS TECNOLÓGICAS A ESTUDIAR

- WebGPU: https://www.w3.org/TR/webgpu/
- WGSL: https://www.w3.org/TR/WGSL/
- WebXR: https://www.w3.org/TR/webxr/
- Media Capabilities: https://www.w3.org/TR/media-capabilities/
- Media Queries Level 5: https://www.w3.org/TR/mediaqueries-5/
- HTML media/video: https://html.spec.whatwg.org/multipage/media.html

Aplicar solo tecnologías que aporten valor y tengan fallback.

---

# BLOQUE NORMATIVO EMBEBIDO OBLIGATORIO

LEER y dejar memoria actualizada de tu trabajo, con hoja de control https://github.com/mruizwow-bit/irisgreen/tree/coordinacion/iris-green-canonica-20260924/COORDINACION_IRIS_GREEN

La web es bilingüe, así que el inglés tiene que estar perfectamente montado también. La traducción la hacéis vosotros mismos, no se usa otro agente para ello.
Comprobar la configuración de la versión web y de la versión móvil.

MARCO_NORMATIVO_TRANSVERSAL_R01
Fecha: 22/09/2026
Función: referencia transversal derivada de la documentación del proyecto.
Importante: este archivo NO es una nueva orden de producto y NO amplía el alcance de ningún agente.
1. Aclaración de fuente
El archivo histórico llamado NORMATIVA ACTUALIZADA WEB.docx / NORMATIVA ACTUALIZADA WEB(1).docx es en realidad una orden de Astra al Agente n.º 4 sobre Sabik Web que contiene, dentro de esa orden, un marco normativo y de accesibilidad.
Por tanto:
•	sus instrucciones específicas de producto Sabik NO se trasladan automáticamente a Iris, Claude, Design u otros carriles;
•	sus secciones normativas sí se conservan como referencia transversal cuando corresponda;
•	cada agente aplica solo las normas relevantes a su propio alcance;
•	ninguna norma se usa para reabrir un producto o decisión fuera de la orden vigente.
2. Referencias técnicas y de contenido conservadas
Marco mínimo documentado por el proyecto:
•	WCAG 2.2 AA;
•	ISO/IEC 40500:2025 · adopción de WCAG 2.2;
•	EN 301 549 V4.1.1 (2026-09) como objetivo técnico actual;
•	ISO 24495-1:2023 · lenguaje claro;
•	ISO 9241-171:2025 · accesibilidad de software;
•	ISO 9241-210:2019 · diseño centrado en las personas;
•	ISO 9241-11:2018 · usabilidad;
•	ISO 9241-112:2025 · presentación de la información;
•	W3C COGA como capa adicional para discapacidad cognitiva, aprendizaje y neurodiversidad;
•	UNE 153101:2018 EX cuando se produzca Lectura Fácil formal;
•	PDF/UA-2 · ISO 14289-2:2024 para nuevos PDF públicos;
•	Comisión Braille Española para transcripción braille específica.
3. Reglas de contenido y accesibilidad
Aplicar según el recurso:
•	HTML semántico;
•	orden lógico;
•	idioma correcto;
•	nombres accesibles;
•	texto real compatible con tecnologías de apoyo;
•	imágenes clasificadas como decorativas, informativas, funcionales o complejas;
•	alternativa textual apropiada;
•	descripción extensa cuando sea necesaria;
•	datos no solo como imagen;
•	tablas con encabezados reales;
•	transcripción/equivalente textual para audio significativo;
•	subtítulos para vídeo cuando correspondan;
•	audiodescripción cuando corresponda;
•	no usar color como único canal;
•	lenguaje claro sin infantilizar;
•	información principal primero;
•	términos técnicos explicados.
4. Privacidad y minimización
Cuando exista interacción o datos:
•	no pedir datos innecesarios;
•	especial cuidado con salud, discapacidad, diagnóstico, menores, comportamiento y preferencias;
•	no convertir contenidos informativos en mecanismos de recopilación sensible;
•	aplicar RGPD/LOPDGDD cuando corresponda al tratamiento real.
5. Fuentes y trazabilidad
Por cada dato relevante conservar, cuando aplique:
•	fuente;
•	organismo;
•	URL;
•	fecha de publicación;
•	fecha de consulta;
•	jurisdicción;
•	versión;
•	vigencia;
•	última revisión.
Prioridad documental:
1.	legislación y organismos oficiales;
2.	organismos internacionales;
3.	guías oficiales;
4.	universidades;
5.	literatura revisada por pares;
6.	organizaciones profesionales;
7.	asociaciones reconocidas.
Todo trabajo debe quedar:
investigado → documentado → versionado → revisable por Astra.
Ningún gate se aprueba solo con un resumen de chat.
6. Matices jurídicos documentados
La documentación del proyecto registra:
•	EN 301 549 V4.1.1 como objetivo técnico nuevo;
•	a 20/09/2026, pendiente su citación en DOUE como referencia armonizada;
•	V3.2.1 continúa como referencia jurídica armonizada mientras no exista esa citación;
•	Real Decreto 707/2026 sobre accesibilidad cognitiva: preparación normativa, con entrada en vigor indicada por el proyecto para 02/01/2027;
•	el encaje jurídico concreto de cada superficie debe comprobarse, no presumirse.
7. Regla de uso por agentes
Antes de ejecutar:
1.	leer Control Maestro vigente;
2.	leer Memoria Maestra vigente;
3.	leer este marco transversal;
4.	leer la fuente exacta de su carril;
5.	leer su orden actual.
Si una norma o documento parece ampliar el scope fuera de la orden:
STOP y reconciliar con Astra.


pues lo quiero en español e ingles y no quiero que me digas yo no puedo hacerlo, si puedes, porque lo has hecho anteriormente, otra cosa es que es mejor delegar tu trabajo en otros, y yo no funciono asi, tu das el trabajo terminado, tanto en español como en ingles y el ingles lo traduces, porque tambien construyes paginas en ingles. Adaptado a la normativa de isos tanto de adapatabilidad, como de lectura
BRIEF DESIGN R02 · MUCHOS MÁS JUEGOS + RUTINAS DESCARGABLES + PICTOGRAMAS · TODAS LAS EDADES
24/09/2026

AUTORIDAD
DEC-113
DEC-114
DEC-110 / DEC-109 / DEC-024 / DEC-023

REGLA BASE
La web Iris Green existente es la base canónica.
Design adapta sus recursos a Iris Green.
No se sustituye la web por una página de prototipo.

==================================================
1. CAMBIO DE ALCANCE: NO ES SOLO INFANCIA
==================================================

Los recursos deben servir para distintas etapas de vida.

Etiquetas de etapa:
- INFANCIA
- ADOLESCENCIA
- ADULTEZ
- TRANSVERSAL / CUALQUIER EDAD

No se exige diagnóstico para utilizar un recurso.

Incluir explícitamente:
- adolescentes;
- personas adultas diagnosticadas;
- personas adultas sin diagnóstico o sin identificación formal;
- personas que solo buscan apoyo para organización, secuenciación, transiciones,
  sensibilidad sensorial, memoria de trabajo, planificación, motricidad o comunicación.

NO:
- infantilizar la adultez;
- usar estética infantil por defecto;
- presentar un juego como prueba diagnóstica;
- inferir que una persona es neurodivergente por necesitar un apoyo;
- exigir elegir una condición para acceder a una herramienta.

Filtros públicos preferidos:
- etapa de vida;
- contexto;
- habilidad/necesidad;
- duración;
- tipo de actividad.

==================================================
2. INVENTARIO EXISTENTE QUE NO SE PUEDE PERDER
==================================================

Auditoría existente:
- 130 juegos legacy actuales;
- 42 juegos image-first de rutina en backlog actual;
- 92 rutinas;
- 427 pasos;
- 18 mecánicas definidas;
- 405 mapeos candidatos Mulberry;
- 149 ya en el sistema actual;
- 223 ampliables de la misma colección;
- 33 alternativas aproximadas;
- 22 pasos sin equivalente encontrado.

Los 42 juegos actuales NO son el total.
Los 10 B1 NO son el total.
B1/B0/piloto son lenguaje interno y no deben aparecer en interfaz pública.

==================================================
3. OBJETIVO DE CATÁLOGO DE JUEGOS
==================================================

No cerrar el programa con 42 juegos.

Objetivo operativo de la primera biblioteca completa:
AL MENOS 200 juegos/actividades funcionales ÚNICOS tras deduplicar.

Fuente de expansión:
A. crear juegos NUEVOS derivados de las 92 rutinas;
B. reutilizar las 18 mecánicas como patrones funcionales;
C. partir del backlog image-first útil sin quedar limitado por él;
D. crear actividades nuevas para adolescencia, adultez y uso transversal;
E. crear variaciones por contexto/etapa solo cuando la experiencia cambie de verdad;
F. no contar los 427 pasos como 427 juegos;
G. NO usar los 130 juegos retirados como fuente de rediseño o migración.

Cada juego debe tener:
- ID público limpio;
- nombre;
- etapa(s);
- contexto(s);
- habilidad/necesidad;
- mecánica;
- objetivo observable;
- instrucciones muy breves;
- modo imagen-first siempre que sea viable;
- alternativa textual/accesible;
- teclado;
- reduced motion si hay movimiento;
- estado de completado que no dependa solo de color;
- sin lenguaje diagnóstico.

Tipos útiles:
- ordenar secuencias;
- encontrar qué falta;
- elegir el primer paso;
- antes/después;
- clasificar objetos;
- preparar una mochila/bolso;
- elegir ropa según contexto;
- organizar una compra;
- planificar una salida;
- usar transporte;
- preparar una cita o trámite;
- organizar una jornada de estudio/trabajo;
- priorizar tareas;
- dividir una tarea grande;
- detectar una transición;
- ruta visual;
- checklist visual;
- memoria visual;
- busca y encuentra funcional;
- emparejar objeto ↔ acción;
- microsecuencias de motricidad;
- tablero de opciones;
- decisión entre alternativas válidas;
- simulación simple de contexto cotidiano.

==================================================
4. CONTEXTOS OBLIGATORIOS MÁS ALLÁ DE INFANCIA
==================================================

ADOLESCENCIA
- preparar mochila/material;
- cambiar de aula;
- organizar deberes;
- estudiar para examen;
- preparar presentación;
- usar transporte;
- gestionar horarios;
- higiene/cuidado personal;
- preparar ropa;
- comer fuera de casa;
- compras pequeñas;
- pedir ayuda;
- planificar una quedada;
- cambios de plan;
- empezar/terminar una tarea;
- uso equilibrado de pantallas;
- ordenar habitación/material.

ADULTEZ
- salir de casa;
- transporte público;
- orientarse con mapas;
- preparar bolso/mochila de trabajo;
- llegar a una cita;
- hacer una llamada;
- responder un correo;
- preparar una reunión;
- dividir una tarea laboral;
- hacer una compra;
- cocinar;
- limpiar;
- lavar ropa;
- organizar facturas/documentos;
- hacer un trámite;
- preparar una visita o viaje;
- comer fuera;
- planificar descanso;
- volver a casa después de un día exigente;
- cambio inesperado de plan;
- priorizar cuando hay demasiadas tareas;
- preparar ropa y objetos la noche anterior.

ADULTEZ SIN DIAGNÓSTICO
La web no debe etiquetar a la persona.
Los recursos se presentan por necesidad práctica:
"Si esto te cuesta, aquí tienes una forma visual de dividirlo."

==================================================
5. BIBLIOTECA DESCARGABLE DE RUTINAS
==================================================

Las 92 rutinas deben tener una salida pública descargable progresiva.

Formatos por rutina, cuando aplique:
1. A4 completa;
2. tira vertical/horizontal para nevera o pared;
3. tarjetas de pasos;
4. primero → después;
5. checklist visual;
6. versión pantalla;
7. PDF impresión;
8. PNG/JPG de hoja completa;
9. ES;
10. EN cuando la traducción esté aprobada.

No todas las rutinas necesitan todos los formatos, pero cada rutina debe tener
al menos un descargable útil.

La página pública debe mostrar:
- preview;
- pasos;
- descarga;
- fuente/licencia del pictograma;
- etapa/contexto sugerido;
- texto alternativo.

==================================================
6. PICTOGRAMAS
==================================================

Usar primero la auditoría ya hecha.
NO repetir la investigación desde cero.

Fuente principal actual:
Mulberry Symbols.

Prioridad:
1. MATCH_CURRENT_SYSTEM
2. MATCH_CURRENT_SYSTEM_AMPLIABLE
3. POSSIBLE_ALTERNATIVE solo con revisión humana
4. NOT_FOUND → buscar/producir alternativa compatible

No usar ARASAAC en esta línea mientras siga descartado por licencia del proyecto.

Para cada pictograma conservar:
- proveedor;
- ID/nombre;
- enlace fuente;
- enlace preview;
- licencia;
- atribución;
- estado editorial;
- relación con rutina/paso.

==================================================
7. MARCA DE AGUA IRIS GREEN · OBLIGATORIA
==================================================

TODO descargable producido por Iris Green debe llevar marca de agua.

Texto:
IRIS GREEN · irisgreen.eu

No usar la flor antigua.

Aplicar en:
- PDFs;
- hojas A4;
- tiras;
- tarjetas;
- first/then;
- checklists;
- imágenes exportadas;
- composiciones de pictogramas;
- fichas de juego imprimibles.

Ubicación preferida:
- esquina inferior derecha o pie;
- visible al imprimir;
- discreta;
- no cubre información;
- no tapa pictogramas;
- contraste suficiente sin dominar.

En documentos multipágina:
marca en TODAS las páginas.

Para assets de terceros:
la marca de agua identifica la composición/edición Iris Green,
NO sustituye la atribución del autor del pictograma
y NO debe sugerir que Iris Green posee el pictograma original.

Pie de licencia/atribución separado y legible.

==================================================
8. NO PERDER ATRIBUCIÓN
==================================================

Para Mulberry mantener atribución compatible con el expediente del proyecto:
Mulberry Symbols © Garry Paxton 2008-2017, © Steve Lee 2018-2026.
CC BY-SA. mulberrysymbols.org

Hasta cerrar definitivamente la discrepancia de versión de licencia:
- no borrar referencias de licencia;
- mantener source URL por asset;
- mantener trazabilidad en manifest;
- marcar el paquete como pendiente de pin exacto de licencia si procede.

==================================================
9. ARQUITECTURA PÚBLICA
==================================================

La página no debe mostrar inventario técnico.

Eliminar:
- "42 juegos";
- "10 piloto B1";
- "Banco funcional";
- "427/427";
- "mapeo";
- "referencia interna";
- "reconciliación";
- IDs de QA.

La persona debe ver:
- qué quiere hacer;
- para qué sirve;
- cómo empezar;
- descargar si quiere.

==================================================
10. ENTREGA DESIGN
==================================================

Primera entrega R03:
- arquitectura de biblioteca de juegos;
- arquitectura de biblioteca de rutinas descargables;
- sistema de filtros por etapa/contexto/habilidad;
- plantilla de juego Iris Green;
- plantilla de rutina descargable;
- watermark aplicada;
- 20 juegos representativos que demuestren infancia/adolescencia/adultez/transversal;
- 12 rutinas descargables completas como muestra de sistema;
- manifest de pictogramas usados;
- no full-page shell replacement.

Después del visto bueno:
escalar al catálogo completo (>=200 juegos NUEVOS/útiles únicos + 92 rutinas),
sin incorporar ni rediseñar los 130 juegos retirados.
LEER y dejar memoria actualizada de tu trabajo, con hoja de control https://github.com/mruizwow-bit/irisgreen/tree/coordinacion/iris-green-canonica-20260924/COORDINACION_IRIS_GREEN

