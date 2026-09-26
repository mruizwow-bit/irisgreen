# R40-A4 · Integridad de conexiones Intereses ↔ Taller ↔ Cuaderno de Campo

Fecha: 26/09/2026  
Estado: preparación editorial/procedencia; **sin cambios de producto**.

## Regla principal

Una conexión entre superficies **no cambia la naturaleza del contenido**.

- `REAL_DATA`: dato procedente de una fuente trazable y con licencia/condiciones compatibles.
- `SIMULATION`: resultado calculado o simulado; debe presentarse como simulación, no como observación real.
- `USER_CREATED`: contenido creado por la persona en el Taller o Cuaderno; no es un dato externo verificado.
- `FICTIONAL`: mundo, criatura, lengua o historia inventada; puede existir en el producto, pero debe quedar claramente presentada como creación.

Un enlace desde un estudio READY hacia un interés HOLD **no convierte el interés en READY**. Se puede conservar la relación editorial, pero cualquier panel de datos reales, multimedia o descarga dependiente de esa fuente permanece bloqueado hasta cerrar la procedencia.

## Gates de conexión

| Conexión | Parte que puede avanzar | Parte que no puede presentarse como real todavía |
|---|---|---|
| Trenes → Estructuras y puentes | El estudio de estructuras y sus cálculos/simulaciones son creación propia. Renfe + OSM tienen base reutilizable documentada. | No llamar “posición real” a un horario publicado ni a una simulación. Todo dato temporal debe mostrar fuente y fecha/hora. |
| Aves → Dibujo | Dibujar aves o usar una silueta creada por Iris Green. | Avistamientos GBIF y cantos de Xeno-canto quedan HOLD hasta seleccionar dataset/grabación con licencia y cita concreta. |
| Aves → Síntesis y paisajes sonoros | Sonido genérico sintetizado, identificado como generado. | No etiquetar una síntesis como canto de una especie real. Una grabación real exige ID, autor y licencia por archivo. |
| Cielo nocturno → Dibujo / patrones | El catálogo Cielo nocturno con sus fuentes congeladas puede alimentar referencias visuales. | No extender automáticamente ese READY a eclipses, efemérides no identificadas o CelesTrak, que tienen su gate separado. |
| Eclipses → simulación | El motor puede existir como simulador. | Fechas/visibilidad “desde tu ciudad” siguen HOLD hasta fijar fuente/versionado de las efemérides usadas por el cálculo. |
| Satélites/ISS → planetario | La representación técnica puede prepararse. | Órbitas actuales quedan HOLD mientras CelesTrak no tenga una base de redistribución congelada para este uso. |
| Minerales → Dibujo / 3D | El render y la herramienta 3D pueden ser creación propia. | Ficha mineral real y catálogo “>6.000” quedan HOLD hasta fijar fuente IMA/RRUFF reutilizable y auditar los cromos actuales. |
| Electrónica → Circuitos | Leyes, esquemas y cálculo propio del simulador. | No introducir diagramas/fotos de terceros sin fuente/licencia separada. |
| Arquitectura → Estructuras | Modelo y simulación creados por Iris Green. | Un edificio concreto, plano histórico o fotografía conserva la licencia de su fuente; no hereda la licencia del Taller. |
| Videojuegos → Diseño de videojuegos | Reglas, personajes, niveles y assets originales. | No reutilizar personajes, logos, capturas o mapas de franquicias para completar ejemplos. |
| Mundos de ficción → Mundos / Lenguas inventadas | Todo el material inventado por la persona o por Iris Green. | No presentarlo como geografía, especie, lengua o historia real. |
| Música → Ritmo / Composición / Síntesis | Herramientas y sonidos sintetizados propios. | “Instrumentos que suenan” con audio real queda HOLD hasta disponer de audio con licencia; MusicBrainz solo resuelve metadatos según dataset. |

## Cuaderno de Campo

El Cuaderno de Campo pertenece a **Tus intereses** y puede combinar juego tranquilo con datos reales, pero necesita una frontera muy clara entre observación, simulación y colección.

### Registro mínimo para un hallazgo real

Cada ficha que derive de un registro externo debe conservar, cuando aplique:

1. fuente/dataset exacto;
2. identificador del registro (`occurrenceID` u otro ID estable);
3. taxón/objeto;
4. fecha del registro original;
5. lugar y precisión geográfica permitida;
6. licencia del dataset/registro;
7. autor/proveedor cuando la licencia lo requiera;
8. fecha de consulta/descarga;
9. versión o DOI de descarga si existe;
10. enlace a la fuente.

### Reglas de realidad temporal

- Un registro histórico de presencia **no significa** “esta especie está aquí ahora”.
- Para un dato histórico, usar formulaciones como “registrada en esta zona” y mostrar fecha.
- “Hoy”, “ahora”, “en este momento” o una posición actual requieren una fuente temporal válida y una marca de tiempo.
- Una simulación de calendario/horario debe etiquetarse como simulación cuando no provenga de observaciones actuales.
- Un contador tipo “47 de los peces de esta costa” solo es válido si el denominador, ámbito, fuente y fecha están definidos.
- Datos sensibles de biodiversidad deben respetar la precisión que publique el dataset; no reconstruir localizaciones ocultadas.

### Estado del Cuaderno por familias de contenido

- **Aves / insectos / plantas / peces / mamíferos / reptiles:** `HOLD_REAL_DATA` con la definición actual, porque “GBIF” por sí solo no fija dataset ni licencia. Se desbloquea seleccionando datasets compatibles y conservando citas/licencias.
- **Cantos de aves:** `HOLD_AUDIO` hasta seleccionar cada grabación con ID, autor y licencia. Una síntesis genérica puede usarse como ambiente si se identifica como generada, nunca como identificación de especie.
- **Fósiles:** puede apoyarse en un dataset PBDB exacto con licencia/cita congeladas.
- **Minerales:** `HOLD_REAL_DATA` hasta cerrar fuente reutilizable; no usar GBIF como sustituto.
- **Objetos inventados/coleccionables ficticios:** pueden existir como `FICTIONAL`, siempre separados del museo de especies/objetos reales.

## Taller: 25 estudios

Los 25 estudios están READY como **definiciones editoriales y herramientas originales**. Esto no significa que sus conexiones externas estén aprobadas:

- 8 estudios existen ya en la web observada; 17 están planificados.
- datos, imágenes, audio y multimedia externos heredan el gate de la ficha correspondiente;
- las fotografías de la persona permanecen locales y no se convierten en dataset del sitio;
- exportar un proyecto conserva la autoría de su contenido, pero no concede derechos sobre un asset externo que se hubiese incorporado.

## Rincón

Para R40, los ocho paisajes sonoros de escena pueden construirse con la síntesis local documentada en `assets/rincon-sonidos.js`.

- La síntesis debe identificarse como generada cuando pueda confundirse con una grabación real.
- En río, las llamadas de aves son genéricas: no identificar una especie.
- Medusas y un eventual pulpo no reciben voz/canto inventado.
- Lluvia: sin truenos.
- Noche: sin eventos repentinos.
- Nada empieza solo.

Las ocho grabaciones históricas registradas en `audio/rincon/sonidos.json` siguen `HOLD` para una nueva composición porque el registro actual contiene autor/archivo pero no licencia verificable por archivo.

## Cierre de integridad

Una conexión es publicable cuando:

`contenido base READY` + `fuente real READY` + `licencia/atribución registrada` + `fecha/versión adecuada`

Si cualquiera de esos elementos falta, la relación puede mantenerse como planificación, pero **el dato o multimedia dependiente permanece HOLD**.
