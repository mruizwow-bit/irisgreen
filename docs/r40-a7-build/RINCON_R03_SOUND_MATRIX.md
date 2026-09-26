# R40-RINCON-R03 · matriz sonido → función / escena

Todos los sonidos de esta matriz son **síntesis Web Audio first-party/local**. No son grabaciones reales. Las 8 grabaciones históricas HOLD no forman parte del runtime R03.

## Biblioteca general · 12 sonidos

| ID | ES | EN | Identidad / función | Riesgo evitado |
|---|---|---|---|---|
| lluvia | Lluvia | Rain | capas suaves de lluvia continua, sin evento | sin truenos ni picos |
| lluvia-ventana | Lluvia en la ventana | Rain on the window | lluvia + gotas suaves cercanas al cristal | sin ataques agudos |
| olas | Olas del mar | Sea waves | ciclo llegada → espuma → retirada | sin viento dominante |
| rio | Río | Stream | corriente grave + capa de agua + burbujas | sin siseo dominante |
| viento | Viento suave | Gentle wind | brisa ancha, filtro lento y Q bajo | sin silbido |
| pajaros | Pájaros en el bosque | Birds in the forest | llamadas senoidales cortas, muy espaciadas | sin chirridos/agresión |
| grillos | Grillos de noche | Crickets at night | grupos suaves con variación espacial lenta | sin patrón continuo rígido |
| fuego | Chimenea | Fireplace | fondo cálido + crepitar leve | sin chasquidos fuertes |
| ruido-rosa | Ruido rosa | Pink noise | ruido filtrado estable | ganancia contenida |
| ruido-marron | Ruido marrón | Brown noise | ruido profundo filtrado | graves moderados |
| piano | Piano suave | Soft piano | notas pentatónicas espaciadas | sin melodía invasiva |
| cuencos | Cuencos | Singing bowls | tres parciales, ataque blando y caída corta | sin pico metálico |

## Ambientes de escena · 9

| Escena | Builder R03 | Capas | Regla |
|---|---|---|---|
| Mar | escena-mar | oleaje propio | sin viento dominante |
| Lluvia | escena-lluvia | lluvia sobre cristal | sin truenos |
| Río | escena-rio | corriente + aves muy lejanas | aves no protagonistas |
| Noche | escena-noche | grillos + aire nocturno bajo | sin eventos repentinos |
| Acuario | escena-acuario | filtro/agua + burbujas suaves | estable |
| Tubo | escena-burbujas | burbujas graves | sin zumbido agresivo |
| Medusas | escena-medusas | ambiente submarino profundo | sin voz/canto animal |
| Fibra óptica | escena-fibra | dos tonos mínimos | casi silencio; no se presenta como sonido “real” |
| Pulpos | escena-pulpos | agua submarina filtrada + burbujas muy esporádicas | 0 vocalización ficticia |

## Volumen y transiciones
- AudioContext solo se crea desde una acción explícita.
- Los sonidos generales entran con fade; nivel efectivo se limita en el bus R03.
- El volumen de escena parte de 30/100 en la UI R03.
- Cambio de escena: el owner común del Rincón baja el sonido anterior y sube el siguiente; no se usan dos ambientes como cama estable conjunta.
- Silenciar actúa sobre el owner de escena.
- Al cambiar de herramienta superior se detiene la herramienta anterior.

## Procedencia
- `window.IGSonidos.kind = SYNTHETIC_FIRST_PARTY_R40_R03`.
- 0 rutas `/audio/rincon/` en el HTML/controlador público R03.
- 0 fetch de `sonidos.json` en la página R03.
