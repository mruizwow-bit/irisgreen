# R61 · CLAUDE · RINCÓN · PILOTO PECERA AUDIOVISUAL FIRST-PARTY · 10 MIN

Fecha: 28/09/2026  
Autoridad de producto: **María**  
Dirección / revisión: **Astra**  
Ejecución: **Claude**  
Integración: **A2**  
Aceptación final: **HUMAN QA María**

## ESTADO

`R61_CLAUDE_RINCON_AQUARIUM_AV_PILOT_ORDERED`

---

# 1. DONOR APROBADO

María aprueba como base visual del piloto el archivo:

`pecera_acuario.mp4`

Características observadas del donor:
- escena propia Iris Green;
- acuario reconocible;
- cámara fija;
- peces en distintas capas;
- vegetación;
- burbujas;
- movimiento lento;
- bajo estímulo;
- sin eventos bruscos;
- sin audio integrado en el donor actual.

**No reconstruir la estética desde cero.**
**No sustituirla por un shader abstracto ni por otra pecera distinta.**

Si Claude no dispone del binario exacto del donor:
**STOP y pedir el archivo exacto.**
No recrearlo de memoria ni desde una captura.

---

# 2. OBJETIVO DEL PILOTO

Convertir esa pecera en una **escena audiovisual first-party de aproximadamente 10 minutos**, estable, agradable y suficientemente variada para uso real en el Rincón.

Este piloto define el método para escenas posteriores como:
- Medusas;
- Mar;
- Río;
- Bosque;
- y otras que María apruebe después.

**No construir esas otras escenas todavía.**

---

# 3. REGLA DE AUDIO · SONIDO PROPIO POR ESCENA

Decisión de María:

**cada escena tendrá su propio paisaje sonoro integrado y exclusivo.**

No usar una misma pista genérica para:
- Pecera;
- Medusas;
- Mar;
- Río;
- Bosque.

No superponer una biblioteca sonora común como identidad de todas.

## Pecera · sonido propio

Crear un paisaje sonoro original con:
- agua filtrada;
- pequeñas burbujas;
- movimiento amortiguado de agua;
- leves variaciones espaciales;
- dinámica suave.

NO:
- viento;
- piano;
- pad “mágico”;
- música;
- bomba mecánica fuerte;
- sonidos inventados de peces;
- agudos o golpes inesperados.

El audio debe pertenecer perceptivamente a **esta pecera**.

---

# 4. AUDIO INTEGRADO EN LA PIEZA

Preferencia de producto para este piloto:

**vídeo + audio propio en el mismo asset audiovisual**, con formatos web compatibles.

Entregar como mínimo:
- MP4 H.264 + audio compatible;
- WebM/VP9 + Opus si el pipeline lo permite y aporta fallback útil.

El master de audio puede conservarse también separado para edición/QA, pero en runtime la escena debe poder funcionar como una sola pieza audiovisual.

---

# 5. CONTROLES

Nada empieza solo.

## Al entrar
- escena detenida/poster;
- 0 audio;
- 0 autoplay.

## Acción principal
**Ver y escuchar / Watch and listen**

Al pulsar:
- comienza la escena;
- comienza su audio propio;
- volumen inicial bajo.

Volumen inicial orientativo:
**25–30 %**.

## Controles visibles
- **Silenciar / Mute**
- al silenciar cambia a **Activar sonido / Sound on**
- **Volumen / Volume**
- **Parar / Stop**
- **Pantalla completa / Full screen**

Puede mantenerse **Solo imagen / Image only** si ayuda a la compatibilidad con el Rincón actual, pero no debe complicar la interfaz.

Silenciar NO detiene el vídeo.
Parar detiene imagen y audio.

---

# 6. DURACIÓN Y REPETICIÓN

Objetivo:
**10 minutos reales de experiencia.**

NO:
- repetir un clip de 16 s;
- loop corto evidente;
- copiar/pegar ciclos idénticos;
- reiniciar peces exactamente igual;
- burbujas con patrón periódico obvio.

Debe haber:
- variación lenta;
- trayectorias diferentes;
- entradas/salidas de peces;
- pequeñas variaciones en cardumen;
- burbujas no periódicas;
- cambios muy suaves en iluminación/caústicas;
- vegetación con movimiento mínimo y orgánico.

Si se usa loop:
- debe ser un loop largo;
- unión imperceptible;
- HUMAN QA debe no detectar el reinicio.

---

# 7. VISUAL · KEEP / REFINE

## KEEP

Conservar la identidad actual:
- composición general;
- estilo ilustrado/volumétrico;
- peces existentes como lenguaje visual;
- vegetación;
- piedras;
- fondo azul;
- columna de burbujas;
- luz desde arriba;
- cámara fija.

No perseguir fotorealismo.

## REFINE

Solo mejorar donde aporte:
- un poco más de profundidad entre capas;
- trayectorias menos repetitivas;
- movimiento muy leve de plantas;
- caústicas/reflejos de agua más naturales;
- sombras suaves;
- leves diferencias de escala/velocidad entre peces.

No recargar la escena.

---

# 8. CALIDAD SENSORIAL

La escena debe poder estar 10 minutos sin fatigar.

Prohibido:
- flashes;
- cambios bruscos de luminosidad;
- cámara en movimiento;
- zooms;
- parallax agresivo;
- peces que aceleren de repente;
- audio con picos;
- eventos sorpresa;
- colores que cambien rápido.

Movimiento:
**lento, continuo, predecible y orgánico.**

---

# 9. REDUCED MOTION / MODO SUAVE

Si reduced motion está activo:
- no eliminar necesariamente toda la escena;
- reducir velocidad/densidad;
- simplificar cardumen/burbujas si hace falta;
- permitir imagen estática o movimiento mínimo.

La persona debe seguir pudiendo escuchar el sonido si decide activarlo.

Reduced motion y mute son controles independientes.

---

# 10. TÉCNICA / PESO

El donor corto actual NO define el bitrate final.

No exportar 10 minutos manteniendo ciegamente un bitrate que convierta cada escena en cientos de MB.

Claude debe medir y entregar:
- duración;
- resolución;
- codec;
- bitrate vídeo;
- bitrate audio;
- tamaño final;
- tiempo de inicio;
- memoria;
- CPU/GPU durante reproducción;
- comportamiento móvil.

Objetivo:
calidad visual buena sin convertir Rincón en una descarga masiva.

Se permite evaluar:
- vídeo renderizado largo;
- vídeo optimizado;
- escena generativa local si resulta más eficiente y estable.

Pero para este piloto el resultado final debe sentirse como **una única pieza audiovisual continua**.

---

# 11. FIRST-PARTY / PROPIEDAD

Todo el piloto:
- visual first-party;
- audio first-party;
- local;
- sin YouTube;
- sin Pixabay;
- sin stock;
- sin samples no trazados;
- sin escenas protegidas copiadas.

Si aparece cualquier asset de tercero:
STOP y declararlo antes de usarlo.

---

# 12. QA OBLIGATORIO

## Escucha / visionado real

No cerrar por hashes ni checks.

Ver y escuchar:
- minuto 0;
- minuto 2;
- minuto 5;
- minuto 8;
- minuto 10.

Comprobar:
- repetición perceptible;
- estabilidad;
- fatiga;
- clicks/pops;
- picos;
- saltos;
- desincronización;
- caída de FPS;
- buffering;
- artefactos de compresión.

## Controles
- play;
- mute/unmute;
- volumen;
- stop;
- fullscreen;
- teclado;
- touch;
- foco;
- Escape si aplica.

## Viewports
- 1440×900;
- 390×844;
- 320×800.

---

# 13. ENTREGA

Claude entrega:

- donor exacto usado;
- master audiovisual 10 min;
- master audio separado;
- formatos web;
- script/proyecto de generación;
- hashes;
- duración;
- codecs;
- bitrate;
- tamaño;
- capturas;
- pequeño clip de QA si procede;
- ES/EN del control UI;
- resultado de escucha/visionado 10 min;
- pendientes.

Marcador:

`R61_CLAUDE_RINCON_AQUARIUM_10MIN_PILOT_READY_FOR_ASTRA`

Después:
1. Astra revisa;
2. María hace HUMAN QA;
3. si se aprueba, se fija el método;
4. solo entonces se emiten órdenes para Medusas, Mar, Río, Bosque, etc.

---

# 14. LÍMITES

No:
- Medusas todavía;
- Mar todavía;
- Río todavía;
- Bosque todavía;
- biblioteca masiva;
- main;
- producción;
- deploy propio;
- música global R60;
- voz Sabik;
- Videoteca.

Este issue es **solo el piloto Pecera audiovisual de 10 minutos**.