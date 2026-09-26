# R40-A4 · Contenido, fuentes y licencias · cierre de preparación R01

Fecha: 26/09/2026  
Responsable: Agente 4  
Issue: #250  
Parent: #247  
Estado: **R40_A4_PROVENANCE_READY_FOR_FREEZE_A2**

## 1. Alcance ejecutado

Se ha preparado la capa editorial/procedencia de R40 sin modificar producto:

- 72 intereses / 11 grupos;
- 25 estudios / 6 áreas del Taller;
- 8 escenas actuales del Rincón;
- revisión dirigida de fuentes/licencias, especialmente las marcadas “a confirmar”;
- reglas de integridad para Intereses ↔ Taller ↔ Cuaderno de Campo;
- identificación de datos/multimedia que todavía no pueden publicarse con procedencia suficiente.

La rama A2 observada para inventario fue `bb1efb8608681b138e5ce8029a6d425eddcaed98`. **No se adopta como freeze de implementación.** R40 sigue esperando el handoff explícito de A2.

## 2. Intereses

Fuente estructural observada:
`editorial/intereses/estructura-20260924.json`

Resultado exacto:

- grupos: **11**
- intereses: **72**
- `READY`: **43**
- `HOLD`: **29**

El documento original contiene 28 entradas con “a confirmar” o formulación equivalente. La revisión estricta deja 29 HOLD porque algunas fuentes aparentemente definidas —por ejemplo GBIF genérico— tampoco bastan para aprobar una reutilización concreta sin fijar dataset/licencia/cita.

### HOLD actuales

1. Exoplanetas
2. Eclipses
3. Lluvias de estrellas y meteoritos
4. Satélites y Estación Espacial
5. Minerales y rocas
6. Océanos y mareas
7. Banderas
8. Aves
9. Insectos y mariposas
10. Plantas y flores
11. Árboles
12. Setas
13. Vida marina y peces
14. Mamíferos
15. Reptiles y anfibios
16. Perros
17. Gatos
18. Caballos
19. Barcos y faros
20. Autobuses y tranvías
21. Ascensores y escaleras mecánicas
22. Señales y semáforos
23. Internet
24. Etimología
25. Lengua de signos, braille y Morse
26. Monedas
27. Sellos
28. Música e instrumentos
29. Química y elementos

### Motivos de HOLD más frecuentes

- licencia definida por dataset/archivo y todavía no seleccionada;
- fuente nombrada sin dataset/versión concreta;
- base pública sin licencia de redistribución demostrada para el uso previsto;
- multimedia que exige licencia por grabación/imagen;
- fuente “a confirmar” sin autoridad congelada;
- mezcla de una fuente READY con assets actuales cuya procedencia aún no ha sido auditada.

`READY` no significa que cualquier imagen o audio del organismo sea libre: el registro conserva notas por fuente para separar datos, software y multimedia.

## 3. Taller

Fuente del catálogo completo:
`COORDINACION_IRIS_GREEN/EVIDENCIAS/WEB_A2_INTERESES_R15/ESTRUCTURA_RECIBIDA_20260924.md`

Resultado:

- áreas: **6**
- estudios: **25**
- definiciones editoriales `READY`: **25**
- estudios existentes en la web observada: **8**
- estudios planificados: **17**

Los 25 quedan READY como definiciones/herramientas originales de Iris Green. Ese estado **no aprueba automáticamente** fuentes reales enlazadas desde Intereses.

Regla:
- herramienta/simulación original → puede avanzar como Taller;
- dato externo → hereda el READY/HOLD de su ficha de Intereses;
- ficción/creación → se presenta como creación;
- simulación → se presenta como simulación;
- fotografía/archivo de la persona → permanece local y no se convierte en dato del sitio.

## 4. Rincón tranquilo

Catálogo actual verificado:

- escenas: **8**
- paisajes sonoros de escena con síntesis local: **8 READY**
- grabaciones históricas registradas bajo `audio/rincon/`: **8 HOLD**
- escena de pulpo actual: **no existe**

Los ocho sonidos previstos para R40 pueden producirse mediante `assets/rincon-sonidos.js`, sin incorporar una grabación externa:

1. Mar — oleaje lento.
2. Acuario — agua filtrada + burbujas suaves.
3. Tubo — burbujas suaves.
4. Medusas — ambiente submarino estable; **sin sonido animal inventado**.
5. Fibra óptica — tono mínimo/casi silencio.
6. Lluvia — lluvia en cristal; **sin truenos**.
7. Río — corriente + brisa + llamadas lejanas genéricas sintetizadas.
8. Noche — grillos sintetizados + viento suave; **sin eventos repentinos**.

Las grabaciones históricas tienen autor y archivo, pero el registro actual no contiene licencia/URL verificable por archivo. No se aprueban para nueva composición R40 hasta cerrar esa procedencia.

## 5. Cuaderno de Campo y conexiones

Se ha fijado una frontera obligatoria entre:

- `REAL_DATA`
- `SIMULATION`
- `USER_CREATED`
- `FICTIONAL`

Puntos críticos:

- una ocurrencia histórica no significa presencia “ahora”;
- “hoy/ahora/aquí” requiere fuente temporal y marca de tiempo;
- GBIF necesita dataset/licencia/cita concretos;
- Xeno-canto necesita grabación, autor e ID/licencia por archivo;
- sonido sintetizado genérico no puede presentarse como canto de una especie;
- fósiles y minerales no se sustituyen por un dataset de biodiversidad;
- un contador de colección requiere denominador, ámbito, fecha y fuente;
- Taller no convierte una simulación en medición real;
- mundos/criaturas/lenguas inventadas pueden existir, pero se etiquetan como creación.

## 6. Registro de fuentes/licencias

Se han normalizado **43 cadenas de fuente distintas** del catálogo de Intereses.

El registro conserva:
- autoridad;
- estado READY/HOLD;
- resumen de licencia/condición;
- URL de evidencia;
- notas de uso;
- fecha de comprobación.

Las condiciones por fuente deben volver a verificarse al fijar una descarga/dataset/asset concreto si la licencia funciona por ítem o versión.

## 7. Artefactos entregados

1. `SOURCE_LICENSE_REGISTER.json`
   - 43 fuentes/cadenas normalizadas y su gate.
   - Git blob actual: `ffea84f0aa54eec060824a5c810dcfb3e2c31680`

2. `INTERESES_72_READY_HOLD.json`
   - 72/72 fichas, ES/EN, objetivo, experiencia, datos requeridos, fuente, licencia, fecha y estado.
   - Git blob: `0e0285bd43a293e22a209d523e8995c081d438bc`

3. `TALLER_25_READY_HOLD.json`
   - 25/25 estudios, 6 áreas, ES/EN, experiencia, datos requeridos, procedencia y estado.
   - Git blob: `a87db14a917083b865a8e36f172774b238725888`

4. `RINCON_ESCENAS_SONIDOS_LICENCIAS.json`
   - 8 escenas + 8 grabaciones históricas HOLD + restricciones y alternativas textuales ES/EN.
   - Git blob: `efa80098013da0bab35084b227420a8b4da55c67`

5. `CONEXIONES_INTERESES_TALLER_CUADERNO.md`
   - reglas de integridad y gates de conexión.
   - Git blob: `7d7ba051a1de42adefa461d2e89b1eca491fbd65`

## 8. Handoff

A3 puede usar los IDs/fichas para la capa de datos tras freeze de A2.  
A7 puede usar la matriz de Rincón para activos y QA audiovisual tras freeze de A2.

Ninguna implementación debe convertir un `HOLD` en contenido real visible por el simple hecho de que la UI o la simulación ya exista.

## 9. Scope preservado

- HTML/CSS/JS de producto: **0 cambios**
- rama A2: **0 cambios**
- publicación/deploy: **0**
- descarga masiva de assets: **0**
- voz/TTS: **0**
- assets con licencia dudosa incorporados: **0**
- merge a main: **0**

Cierre: **inventario READY/HOLD y matriz de procedencia listos para consumo después del freeze de A2**.
