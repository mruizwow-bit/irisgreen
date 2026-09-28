# R60 · CLAUDE · MÚSICA ORIGINAL IRIS GREEN · REEMPLAZAR BIBLIOTECA EXTERNA

Fecha: 28/09/2026  
Autoridad de producto: **María**  
Dirección / revisión: **Astra**  
Creación y render de audio: **Claude**  
Integración web: **A2**  
Aceptación final: **HUMAN QA María**

## ESTADO

`R60_CLAUDE_IRIS_MUSIC_ORIGINAL_ORDERED`

---

# 1. DECISIÓN DE PRODUCTO

La música global de Iris Green deja de depender de pistas externas.

El reproductor actual se conserva como base funcional:
- botón global Música / Music;
- panel único;
- 0 autoplay;
- audio solo tras acción explícita;
- volumen;
- anterior/siguiente;
- selector de pista;
- teclado/Escape/foco.

Pero la biblioteca actual NO es final.

Estado observado en `assets/musica.js`:
- 24 pistas actuales;
- autores externos;
- crédito visible: “Música de Pixabay / Music from Pixabay”.

Objetivo R60:

**reemplazar esa biblioteca por música original, first-party y local de Iris Green.**

No streaming.
No embeds.
No proveedores externos en runtime.
No cookies de terceros.
No anuncios.

---

# 2. SEPARACIÓN DE PRODUCTOS

R60 = **música global de la web**.

NO mezclar con:
- ambientes naturales del Rincón;
- paisajes sonoros del Rincón;
- sonido de Juegos;
- sonido de Taller;
- voz de Sabik;
- Videoteca.

El Rincón puede tener:
- agua;
- lluvia;
- mar;
- burbujas;
- noche;
- otros ambientes.

La música global debe seguir siendo **música**, no duplicar la biblioteca de ambientes.

Los vídeos fuera de Videoteca se retirarán por carril separado.
R60 NO reintroduce vídeos externos.

---

# 3. IDENTIDAD MUSICAL

Objetivo:

**música tranquila, contemporánea, cálida, limpia y reconocible como Iris Green.**

Debe poder acompañar:
- lectura;
- exploración;
- Taller;
- navegación;
- concentración ligera;
sin exigir atención.

## NO

- melodías demasiado protagonistas;
- percusión marcada;
- crescendos grandes;
- cambios bruscos;
- golpes;
- campanas/agudos punzantes;
- subgrave dominante;
- suspense;
- tristeza dramática;
- música infantil;
- “música de spa” genérica;
- voz;
- letras;
- susurros;
- ASMR vocal;
- binaural beats;
- afirmaciones;
- frecuencias “curativas”;
- 432 Hz / “healing frequency” como claim;
- imitación de artistas/compositores reconocibles;
- motivos musicales protegidos;
- samples comerciales/stock por defecto.

## SÍ

- piano/felt piano muy contenido;
- texturas armónicas suaves;
- pads discretos;
- síntesis original;
- instrumentos/render first-party;
- silencios y espacio;
- armonía estable;
- movimiento lento;
- variación suficiente para no fatigar.

---

# 4. ESTRATEGIA · PILOTOS PRIMERO

No producir 20–24 piezas.

Secuencia obligatoria:

`PIPELINE TÉCNICO → 4 PILOTOS → HUMAN LISTENING → 4 PIEZAS LARGAS → BIBLIOTECA FINAL`

No escalar antes de aprobación humana.

---

# 5. FASE P0 · PRUEBA TÉCNICA

Antes de componer la biblioteca:

Claude debe demostrar que puede generar/renderizar audio original reproducible.

Entregar 1 prueba de 60–90 s:
- original;
- sin samples de terceros;
- sin melodía copiada;
- WAV master;
- formato web;
- sin click al inicio/fin;
- sin clipping;
- metadatos y hashes;
- proyecto/script de generación reproducible.

Marcador:

`R60_CLAUDE_MUSIC_PIPELINE_PROOF_READY_FOR_ASTRA`

Si el pipeline no permite calidad suficiente:
STOP y reportar antes de producir más.

No “resolver” comprando/descargando música externa.

---

# 6. FASE P1 · 4 PILOTOS MUSICALES

Después de P0, crear cuatro direcciones distintas.

Cada piloto:
- 90–120 s;
- no loop obvio;
- volumen comparable;
- identidad propia;
- sin terceros.

## M01 · Luz tranquila

Dirección:
- piano/felt piano mínimo;
- acordes abiertos;
- textura cálida;
- muy poco movimiento;
- clara, no melancólica.

Uso:
lectura / navegación general.

## M02 · Concentración suave

Dirección:
- casi sin melodía;
- pulso muy tenue o movimiento armónico estable;
- baja distracción;
- sin percusión marcada.

Uso:
Taller / trabajo / estudio.

## M03 · Flotar

Dirección:
- ambient armónico;
- sin piano protagonista;
- capas largas;
- sensación amplia y ligera;
- evolución muy lenta.

Uso:
explorar / intereses / lectura prolongada.

## M04 · Noche clara

Dirección:
- algo más profunda;
- cálida;
- lenta;
- no oscura;
- no triste;
- sin tensión cinematográfica.

Uso:
lectura tranquila / final del día.

Marcador:

`R60_CLAUDE_MUSIC_4_PILOTS_READY_FOR_ASTRA`

STOP.

Astra escucha.
María HUMAN QA decide:
- KEEP;
- ADJUST;
- REJECT
por piloto.

---

# 7. FASE P2 · PIEZAS LARGAS

Solo tras:

`R60_MUSIC_4_PILOTS_APPROVED_FOR_LONG_RENDER`

extender las direcciones aprobadas.

Duración:
**10–12 minutos por pieza** como primera biblioteca larga.

No copiar/pegar un loop de 20–30 s durante 10 minutos.

La pieza debe tener:
- evolución;
- microvariaciones;
- respiración;
- transiciones suaves;
- retorno natural;
- 0 eventos sorpresivos.

Puede ser:
- forma continua;
- secciones A/B/A’ muy suaves;
- loop largo realmente seamless.

---

# 8. TÉCNICA DE AUDIO

## Master

Por pieza:
- WAV;
- 48 kHz;
- 24 bit si el pipeline lo permite;
- estéreo.

## Web

Entregar al menos:
- Opus/Ogg o WebM Opus;
- MP3 fallback de alta calidad.

No depender de AAC/M4A como único formato.

## Loudness orientativo

Medir, no solo “a oído”:
- integrado objetivo aprox. **-20 LUFS ±2**;
- true peak <= **-1 dBTP**;
- ninguna pieza claramente más fuerte que otra.

No aplastar dinámica.

## Espectro

Evitar:
- agudos duros persistentes;
- subgrave excesivo;
- resonancias estrechas;
- siseo/hiss innecesario;
- DC offset.

## Inicio/fin

- fade natural o comienzo limpio;
- 0 click;
- 0 pop;
- final controlado;
- si loop: unión inaudible.

---

# 9. ORIGINALIDAD Y TRAZABILIDAD

Por cada pieza:

- id;
- título ES;
- título EN;
- autor = Iris Green;
- fecha;
- duración;
- BPM si aplica;
- tonalidad/modo si aplica;
- técnica/instrumentación;
- proyecto/script fuente;
- software y versión;
- seed si hay generación algorítmica;
- master WAV hash;
- web asset hashes;
- loudness;
- true peak;
- licencia;
- notas de QA.

## Regla de samples

Default:
**0 samples de terceros.**

Si excepcionalmente se necesita un sample:
- STOP;
- pedir aprobación;
- licencia por archivo;
- procedencia;
- compatibilidad;
- manifest.

No usar packs “royalty free” como atajo.

---

# 10. PLAYER GLOBAL

A2 conserva `assets/musica.js` como base, pero R60 exige:

- reemplazar listado hardcoded externo por manifest first-party;
- autor visible: Iris Green;
- quitar crédito Pixabay cuando ya no exista ninguna pista Pixabay;
- preload none;
- abrir panel NO inicia audio;
- seleccionar/Play sí puede iniciar por acción explícita;
- volumen inicial recomendado: **35–40 %**, no 60 %;
- fade corto al pausar/parar para evitar click;
- transición suave entre pistas;
- detener en pagehide;
- no cargar todas las pistas al entrar.

Si se implementa crossfade:
- 1.5–3 s;
- no superponer a volumen alto;
- reduced motion NO afecta al audio, pero “reduced sensory” futuro podrá reducir volumen/actividad si se define.

---

# 11. ACCESIBILIDAD / CONTROL SENSORIAL

Obligatorio:

- 0 autoplay;
- Play/Pausa claro;
- Parar;
- Volumen;
- teclado;
- foco;
- Escape;
- nombre de pista;
- no depender de icono solo;
- no sonidos repentinos;
- no cambio de pista automático si repeat está desactivado;
- opción de repetir lista;
- música completamente opcional.

No presentar la música como:
- terapia;
- tratamiento;
- regulación garantizada;
- herramienta médica.

Copy:
**Música / Music**.

---

# 12. BIBLIOTECA FINAL

Después de aprobar las 4 piezas largas, decidir si hacen falta más.

No objetivo numérico de 24.

Preferencia:
**4–8 piezas excelentes** antes que 24 genéricas.

Si se amplía:
- nueva dirección primero;
- mini-piloto;
- revisión;
- render largo.

---

# 13. RETIRADA DE LA BIBLIOTECA ACTUAL

Solo después de integrar y aceptar la biblioteca original:

A2 debe retirar del runtime público:
- referencias a las 24 pistas actuales de terceros;
- crédito Pixabay;
- assets externos antiguos que ya no sean usados.

No es necesario borrar historia Git.

Sí:
- 0 fetch de pistas antiguas;
- 0 UI con autores externos;
- 0 créditos obsoletos.

Gate:
**la música pública de Iris Green es 100 % first-party.**

---

# 14. QA HUMANO OBLIGATORIO

Los checks automáticos NO aprueban música.

Por cada piloto/pieza larga:
- escuchar con auriculares;
- escuchar en altavoces normales;
- inicio;
- minuto 2;
- minuto 5;
- minuto 9–10;
- cambio de pista;
- volumen bajo;
- repeat;
- pausa/reanudar.

Rechazar si:
- fatiga;
- hiss;
- agudos molestos;
- grave invasivo;
- melodía distrae;
- repetición evidente;
- click;
- salto;
- emoción demasiado intensa;
- recuerda demasiado a una obra/artista concreto.

---

# 15. ENTREGA

Claude entrega:
- branch/patch;
- proyecto/script de generación;
- WAV masters;
- web assets;
- manifest;
- hashes;
- mediciones;
- 4 pilotos;
- después 4 largos solo tras gate;
- notas de escucha;
- no deploy propio.

A2:
- integra;
- actualiza player/manifest;
- publica preview;
- María escucha.

Marcadores:

`R60_CLAUDE_MUSIC_PIPELINE_PROOF_READY_FOR_ASTRA`

`R60_CLAUDE_MUSIC_4_PILOTS_READY_FOR_ASTRA`

`R60_MUSIC_4_PILOTS_APPROVED_FOR_LONG_RENDER`

`R60_CLAUDE_MUSIC_4_LONG_TRACKS_READY_FOR_ASTRA`

`R60_IRIS_MUSIC_LIBRARY_READY_FOR_A2`

`R60_IRIS_MUSIC_FIRST_PARTY_HUMAN_ACCEPTED`

No main.
No producción.
No música externa nueva.
No vídeos externos nuevos.
No tocar Videoteca.
No tocar voz Sabik.