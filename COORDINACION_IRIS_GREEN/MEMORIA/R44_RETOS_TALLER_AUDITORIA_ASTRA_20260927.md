# R44 · auditoría Astra · nuevos retos del Taller · 27/09/2026

## Alcance

Por instrucción de María, **NO se audita el Taller R43 ni la corrección posterior de Design**. Esta revisión se limita exclusivamente a la propuesta R44 de nuevos retos.

Estado:
`R44_TALLER_RETOS_PROPOSAL_ASTRA_REVIEWED_PENDING_MARIA`

Fuente:
`R44_COORDINACION.patch`

La propuesta declara:
- 64 retos;
- 48 asociados a estudios;
- 8 proyectos cruzados;
- 8 retos con fecha;
- 5 estudios nuevos: Animación, Instrumentos MIDI, Microcontroladores, Voz y radio, Mapas;
- tres olas: 21 / 16 / 27.

El patch NO incluye el listado de los 64 retos. Remite a un artefacto Claude que requiere login. Por tanto, esta auditoría valida dirección, arquitectura de retos y temas fechados, pero **no puede certificar individualmente los 64 títulos**.

## Hallazgo 1 · La mejor idea son los retos cruzados

Los 8 proyectos que combinan estudios son la dirección más fuerte de R44 porque:
- convierten herramientas separadas en proyectos reales;
- permiten resultados exportables;
- fomentan transferencia entre disciplinas;
- encajan con el gate artifact-first del Taller;
- permiten múltiples caminos y niveles sin asociar competencia a edad.

Recomendación:
**mantener los 8 retos cruzados como columna vertebral de R44**.

Cada proyecto cruzado debe declarar:
- artefacto final;
- estudios usados;
- dependencia mínima;
- alternativa accesible;
- variante por etapa solo si cambia contexto/andamiaje;
- duración orientativa no obligatoria;
- modo sin hardware/permisos cuando aplique.

## Hallazgo 2 · No convertir automáticamente cinco ideas en cinco estudios

### Animación
**Sí merece entidad propia o perfil claramente identificable.**

Razón:
- tiene timeline, fotogramas, onion-skin, easing, exportación GIF/video/SVG animado;
- no es simplemente Pixel Art;
- puede reutilizar activos de Dibujo/Cómic/Diseño.

Decisión propuesta:
`KEEP_AS_STUDY_CANDIDATE`.

### Mapas
**Sí merece entidad propia**, pero sin geolocalización obligatoria.

Puede abarcar:
- mapas narrativos;
- rutas accesibles;
- mapas históricos;
- mapas de mundos;
- capas de datos;
- escalas, leyendas y símbolos.

Reglas:
- ubicación manual por defecto;
- no pedir geolocalización para completar un reto;
- si algún día se usa geolocalización, solo bajo acción explícita y como mejora opcional.

Decisión propuesta:
`KEEP_AS_STUDY_CANDIDATE`.

### Instrumentos MIDI
No lo abriría de entrada como estudio separado.

El Taller ya tiene Ritmo, Composición y Síntesis. MIDI encaja mejor como **capacidad avanzada compartida**:
- teclado MIDI opcional;
- importar/exportar MIDI;
- mapear controles;
- tocar instrumentos virtuales.

Web MIDI sigue siendo de disponibilidad limitada en navegadores, por lo que no puede ser requisito de finalización.

Decisión propuesta:
`MERGE_AS_CAPABILITY_IN_MUSIC_STUDIES`.

### Microcontroladores / Web Serial
Tampoco lo convertiría de inicio en estudio obligatorio.

Encaja mejor como **capa hardware opcional de Programación/Robótica**:
- gemelo digital primero;
- Web Serial como mejora;
- retos completables sin dispositivo físico.

Web Serial sigue siendo de disponibilidad limitada y requiere HTTPS, acción del usuario y permiso.

Decisión propuesta:
`MERGE_AS_OPTIONAL_HARDWARE_LAYER`.

### Voz y radio
La idea creativa es buena, pero no necesita un estudio separado en la primera ola.

Puede vivir entre:
- Síntesis;
- Composición;
- Escritura;
- futuro Animación/Podcast.

Riesgos:
- micrófono;
- privacidad;
- menores;
- grabaciones;
- Permissions-Policy actual bloquea `microphone=()`.

Reglas si se adopta:
- baseline sin micrófono;
- grabar solo tras acción explícita;
- procesamiento local;
- no subir audio;
- indicador claro de grabación;
- borrar/descargar bajo control de la persona;
- alternativa mediante archivo local o voz sintética/sonidos propios.

Decisión propuesta:
`MERGE_AS_AUDIO_PROJECT_PROFILE_FIRST`.

## Hallazgo 3 · Fechas y efemérides

R44 declara 8 retos con fecha, pero el resumen solo enumera **7 temas fechados**. Antes de construir debe existir una matriz 8/8 explícita.

### Eclipse total · 2 agosto 2027
**Excelente.**
NASA confirma eclipse total el 02/08/2027, visible como total en España entre otros países.

Apto para:
- Mapas;
- 3D;
- Simulación;
- Diseño/infografía.

Debe seguir siendo útil después del evento: modo “reconstruye el eclipse”, no solo cuenta atrás.

### Beethoven · 200 años de su muerte · 2027
**Excelente.**
Beethoven-Haus confirma el bicentenario de su muerte el 26/03/2027.

Apto para:
- Composición;
- Ritmo;
- visualización musical;
- Animación.

Usar partituras/obras en dominio público, pero no grabaciones modernas protegidas salvo licencia.

### Manuel de Falla · 150 años
**Válido, pero es 2026**, no un hito futuro de 2027.
BOE y Fundación Falla confirman 1876–2026.

Si R44 se construye después de 2026, convertirlo en reto evergreen:
“Reinterpreta una idea musical de Falla / diseña un cartel del sesquicentenario”, no en evento próximo.

Falla murió en 1946; la regla española de 80 años para autores fallecidos antes de 1987 implica entrada de sus obras en dominio público desde 2027, sujeto a derechos de otras aportaciones/ediciones/interpretaciones.

### Gaudí · centenario
**Válido, pero el centenario es 2026**.
No tratarlo como futuro 2027.

Mejor reconvertirlo en:
- arquitectura accesible;
- geometría;
- estructura;
- mosaico/generative art;
- ciudad y espacio público.

### Generación del 27 · centenario 2027
**Muy fuerte**, con cautela de propiedad intelectual.

Ministerio de Cultura confirma programa oficial del centenario en 2027.

Recomendación:
- creación propia “a la manera de una vanguardia” sin imitar texto protegido;
- dominio público solo cuando esté confirmado autor/obra;
- incorporar creadoras del 27;
- conectar Escritura + Cómic + Diseño + Audio.

### ESA PLATO · lanzamiento previsto 2027
**Muy buen reto científico**, pero la fecha puede cambiar.
ESA actualmente declara lanzamiento previsto 2027.

Por tanto:
- el reto no debe romperse si se retrasa;
- usar “Diseña una misión para encontrar exoplanetas / planifica cómo observaría PLATO”;
- la fecha es contexto, no dependencia.

### Año Internacional de los Pastizales y los Pastores · 2026
**Buen tema, pero es 2026.**
FAO confirma IYRP 2026.

Convertirlo en proyecto permanente:
- mapa;
- biodiversidad;
- simulación de recursos;
- visualización de datos;
- narrativa;
- diseño de información.

Evitar exotización de comunidades pastoriles; trabajar con fuentes FAO y diversidad regional.

## Hallazgo 4 · Tres olas

La idea de tres olas es correcta, pero **no aprobar las cifras 21/16/27 hasta tener la lista concreta**.

Criterio recomendado:

### Ola A · retos sin nuevas APIs ni hardware
Solo retos que:
- usan capacidades ya disponibles;
- no requieren camera/microphone/geolocation/Web MIDI/Web Serial;
- exportan artefacto;
- tienen alternativa accesible;
- no requieren nueva persistencia.

Esta debe ser la primera ola real.

### Ola B · retos con capacidad nueva pero universal/fallback
Ejemplos:
- intercambio entre estudios;
- import/export de artefactos;
- nuevas plantillas;
- timeline/animación si ya existe motor base.

### Ola C · hardware/permisos/experimental
- Web MIDI;
- Web Serial;
- micrófono;
- geolocalización;
- hardware externo.

Nunca pueden ser la única forma de completar un reto.

## Hallazgo 5 · Matriz obligatoria antes de construir

Para cada uno de los 64 retos, Design/Claude debe entregar una fila con:

- ID;
- título ES/EN;
- estudio principal;
- estudios secundarios;
- etapa(s);
- tipo: permanente / cruzado / fechado;
- artefacto final;
- qué aprende/hace;
- motor/API requerida;
- permisos;
- hardware;
- fallback;
- accesibilidad 2.5.7;
- teclado/puntero;
- dependencia temporal;
- propiedad intelectual;
- ola;
- criterio de PASS humano.

Sin esa matriz no hay trazabilidad suficiente para aprobar 64 retos como lote.

## Conclusión Astra

Dirección general: **buena y coherente con Iris Green**.

Aprobar conceptualmente:
- retos cruzados;
- retos que terminan en artefacto;
- Animación;
- Mapas;
- eclipse 2027;
- Beethoven 2027;
- Generación del 27;
- PLATO como contexto no dependiente de fecha;
- Pastizales como reto evergreen.

Reformular:
- Falla y Gaudí: ya son efemérides 2026;
- MIDI: capacidad de Música antes que estudio independiente;
- Microcontroladores: capa opcional de Programación/Robótica;
- Voz/radio: proyecto de audio antes que estudio independiente y sin cambiar Permissions-Policy por defecto.

No aprobar todavía:
- construcción de los 64 como lote;
- 21/16/27 como distribución cerrada;
- permisos camera/microphone;
- intercambio por URL;
- geolocalización obligatoria;
- hardware como requisito.

Siguiente gate:
María decide dirección → Claude/Design entrega la matriz completa de 64 retos → Astra hace revisión individual → se autoriza una primera ola estrictamente sin nuevos permisos/hardware.

No se modifica ni reabre el Taller R43 en esta auditoría.
