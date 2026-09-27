# R50 · A2 · HUMAN QA Home + header global · corrección obligatoria

Fecha: 27/09/2026  
Autoridad: **María → Astra**  
Responsable: **A2**  
Base visual afectada: R49 / PR #312 + Home R42 ya integrada  
Aceptación: **HUMAN QA María**

## Motivo

María revisa el candidato visual y detecta regresiones que impiden aceptar la interfaz global:

1. **Música ha desaparecido del header nuevo.**
2. **Accesibilidad/Lectura ha perdido su presencia como utilidad global visible.**
3. La barra superior repite `Condiciones · Situaciones · Vida diaria · Investigación · Recursos`, aunque la Home ya ofrece esas áreas en sus accesos principales.
4. El copy de Home usa expresiones negativas/metalingüísticas como:
   - `Información y herramientas, sin etiquetas`
   - `sin tener que elegir un diagnóstico`
   - `Protección por defecto / Safe by default`
   
   Para decir que Iris Green no etiqueta, el texto introduce precisamente “etiquetas” y “diagnóstico” en primer plano.
5. El copy visible debe revisarse bajo **ISO 24495-1:2023**, **ISO 9241-112:2025** y W3C COGA: contenido claro, directo, relevante, literal y fácil de localizar/entender.

Esta corrección NO elimina child-safe. Cambia su presentación pública; el contrato técnico `SAFE_BY_DEFAULT` permanece interno.

---

# 1. HEAD REAL

PR #244 / rama A2:
`agent2/sabik-iris-r08-20260924`

HEAD observado al emitir:
`ed9960011f08e38217eecb4be61e6273d7dbe8b1`.

**Releer HEAD/tree antes de modificar. No congelar este SHA.**

---

# 2. HEADER GLOBAL · NUEVO CONTRATO

La barra superior deja de ser una segunda portada.

## NO mostrar como navegación primaria visible
- Condiciones / Conditions
- Situaciones / Situations
- Vida diaria / Everyday life
- Investigación / Research
- Recursos / Resources

Estas áreas:
- siguen accesibles desde la Home;
- siguen accesibles mediante búsqueda;
- siguen dentro del menú **Explorar**;
- NO ocupan permanentemente la barra superior.

## Header visible

Orden conceptual:

**Iris Green · Buscar · Música · Accesibilidad · Contenido · idioma · Explorar**

Puede adaptarse responsive, pero esas son las funciones globales.

### Marca
- `Iris Green`;
- enlace a Home;
- no redundancia “Inicio” al lado de la propia marca.

### Buscar / Search
- conserva búsqueda global;
- nombre visible/accesible claro.

### Música / Music
Restaurar como utilidad global.

Implementación:
- botón visible `Música / Music`;
- atributo `data-ig-music` para reutilizar `assets/musica.js`;
- un único `#ig-music-panel`;
- NO segundo reproductor;
- NO autoplay;
- abrir/cerrar panel no debe iniciar música;
- conservar coordinación con panel de accesibilidad;
- teclado, Escape y foco de retorno.

R49 debe asegurar que `/assets/musica.js` se carga en las páginas públicas donde no esté ya presente, una sola vez.

### Accesibilidad / Accessibility
El botón superior visible será:

ES: **Accesibilidad**  
EN: **Accessibility**

No `Lectura` como único nombre superior.

El panel/dialog puede titularse:

ES: **Accesibilidad y lectura**  
EN: **Accessibility and reading**

Debe conservar:
- tamaño;
- tipografía/espaciado;
- ancho de lectura;
- contraste;
- controles;
- guía;
- reduced motion;
- transparencia;
- lectura de página cuando corresponda.

### Contenido
Mantener selector compacto de etapa.

Estado público sin selección:
ES: **General**  
EN: **General**

No mostrar públicamente:
- `Protección por defecto`;
- `Safe by default`.

`SAFE_BY_DEFAULT` permanece como estado técnico interno.

### Explorar
Cambiar botón:
- `Más` → **Explorar**
- `More` → **Explore**

Dentro del drawer/dialog:
- Condiciones;
- Situaciones;
- Vida diaria;
- Investigación;
- Datos;
- Ayudas;
- Recursos;
- Vídeos;
- Libros;
- Taller;
- Intereses;
- Rincón.

No volver a mostrar esas áreas permanentemente en la barra.

---

# 3. HOME · COPY FINAL ES

## Eyebrow
**Información clara y herramientas prácticas**

## H1
**Empieza por lo que necesitas.**

## Lead
**Busca información, recursos y herramientas para situaciones del día a día.**

Eliminar:
- `sin etiquetas`;
- `sin tener que elegir un diagnóstico`;
- cualquier frase que defina la experiencia por aquello que NO pide.

## Contenido para…

Mantener:
- Infancia
- Adolescencia
- Adultez
- Cualquier edad

Texto explicativo:

**Elige una etapa si quieres ajustar los ejemplos y el contenido. Si no eliges ninguna, verás la versión general. La elección dura solo esta sesión.**

No mostrar en este bloque:
- diagnóstico;
- fecha de nacimiento;
- identidad;
- cuenta;
- `Protección por defecto`.

La minimización y privacidad siguen siendo reglas internas/documentadas; no necesitan convertirse en el mensaje principal de la Home.

## Búsqueda

Título:
**¿Qué estás buscando?**

Placeholder:
**Por ejemplo: ruido, dormir, transporte o estudiar**

Evitar ejemplos que parezcan atribuir un estado a la persona.

## “Elige por dónde empezar”

Descripciones exactas:

### Condiciones
**Consulta explicaciones claras sobre diferentes condiciones.**

### Situaciones
**Encuentra información a partir de una situación concreta.**

### Vida diaria
**Encuentra ideas y apoyos para estudiar, trabajar, organizarte y cuidarte.**

### Investigación
**Consulta estudios explicados con sus resultados y límites.**

### Datos
**Consulta cifras con su fuente, población y fecha.**

### Ayudas y trámites
**Busca apoyos, derechos y trámites según el lugar donde vives.**

### Recursos y juegos
**Usa rutinas visuales, juegos y herramientas prácticas.**

### Tus intereses
**Explora un tema y profundiza a tu ritmo.**

### El taller
**Crea, prueba y desarrolla tus propios proyectos.**

### Rincón tranquilo
**Elige respiración, paisajes o una experiencia inmersiva.**

## Sabik
Mantener:
**Pregunta a Sabik**

No añadir promesas emocionales ni diagnósticas.

---

# 4. HOME · COPY FINAL EN

## Eyebrow
**Clear information and practical tools**

## H1
**Start with what you need.**

## Lead
**Find information, resources and tools for everyday situations.**

Remove:
- `without labels`;
- `without having to choose a diagnosis`;
- negative framing around identity/diagnosis.

## Content for…

Keep:
- Children
- Teenagers
- Adults
- Any age

Explanatory text:

**Choose a life stage if you want to adjust examples and content. If you do not choose one, you will see the general version. Your choice lasts only for this session.**

Do not show:
- diagnosis;
- date of birth;
- identity;
- account;
- `Safe by default`.

## Search

Title:
**What are you looking for?**

Placeholder:
**For example: noise, sleep, transport or studying**

## Choose where to start

### Conditions
**Read clear explanations about different conditions.**

### Situations
**Find information starting from a specific situation.**

### Everyday life
**Find ideas and support for studying, working, getting organised and looking after yourself.**

### Research
**Read studies explained with their results and limitations.**

### Data
**Check figures with their source, population and date.**

### Support and procedures
**Find support, rights and procedures based on where you live.**

### Resources and games
**Use visual routines, games and practical tools.**

### Your interests
**Explore a topic and go deeper at your own pace.**

### The workshop
**Create, test and develop your own projects.**

### Quiet space
**Choose breathing, landscapes or an immersive experience.**

## Sabik
**Ask Sabik**

---

# 5. SEO / METADATA

Actualizar coherentemente:
- meta description ES/EN;
- Open Graph description si existe;
- cualquier JSON-LD description generado desde Home.

No dejar el copy antiguo en metadata aunque ya no sea visible.

Meta propuesta ES:
**Información clara, recursos prácticos y herramientas para situaciones del día a día.**

Meta propuesta EN:
**Clear information, practical resources and tools for everyday situations.**

---

# 6. REGLA ISO / COGA PARA FUTURO COPY HOME

Antes de añadir una frase visible a Home, comprobar:

1. ¿Dice directamente qué puede hacer la persona?
2. ¿Usa palabras comunes?
3. ¿Evita explicar el producto mediante negaciones?
4. ¿Evita introducir conceptos sensibles que la persona no ha mencionado?
5. ¿Es literal y concreta?
6. ¿Se puede entender sin conocer terminología interna del proyecto?
7. ¿La acción o destino se reconoce rápidamente?

No usar como copy público:
- SAFE_BY_DEFAULT;
- S0/S1/S2;
- discovery;
- “sin etiquetas”;
- “sin diagnóstico”;
- lenguaje de QA o implementación.

Fuentes de referencia:
- ISO 24495-1:2023 · https://www.iso.org/standard/78907.html
- ISO 9241-112:2025 · https://www.iso.org/standard/87518.html
- W3C COGA · https://www.w3.org/TR/coga-usable/

---

# 7. IMPLEMENTACIÓN R49

Corregir `assets/ig-r49-transversal.js`:

- eliminar `routeData().slice(0,5)` como primary nav visible;
- no construir `.ig-r49-primary` con categorías en desktop;
- añadir botón Música con `data-ig-music`;
- cambiar `settings:'Lectura'` por `settings:'Accesibilidad'`;
- cambiar `more:'Más'` por `more:'Explorar'`;
- EN equivalente;
- default stage label público = `General`;
- mantener `IGAudience` y safety state internos.

Corregir transform R49:
- garantizar `musica.js` una sola vez;
- no duplicar assets;
- idempotencia sigue PASS.

Corregir `scripts/apply_home_r42.py` con el copy exacto R50.

---

# 8. QA DURO

## Header
En Home + muestra CONTENT/BROWSE/WORKSPACE:
- Música visible;
- Accesibilidad visible;
- Buscar visible/recuperable;
- Contenido visible/recuperable;
- idioma;
- Explorar;
- **0 Condiciones/Situaciones/Vida diaria/Investigación/Recursos como primary nav permanente**.

## Música
- botón abre reproductor existente;
- 0 autoplay;
- no duplicado;
- Escape;
- foco vuelve al trigger;
- compatible con panel Accesibilidad.

## Accesibilidad
- panel abre;
- opciones vigentes funcionan;
- visible en desktop/móvil;
- keyboard/focus/AT.

## Home copy
Test textual que falle si reaparecen en hero/selector:
- `sin etiquetas`
- `without labels`
- `sin tener que elegir un diagnóstico`
- `without having to choose a diagnosis`
- `Protección por defecto`
- `Safe by default`

No prohibir la palabra diagnóstico en el contenido editorial de toda la web; este gate es de **copy Home/header**.

## Capturas
- 1440×900;
- 1920×1080;
- 390×844;
- 320×800;
- ES/EN.

Comparar con los screenshots de HUMAN QA de María.

---

# 9. PRECEDENCIA / ENTREGA

R49 sigue siendo la base transversal.

Este issue es una corrección de HUMAN QA sobre R49/Home y tiene precedencia sobre el copy/header de #311/#312.

A2 puede consumir PR #312, pero **no publicar la preview final para María hasta aplicar R50**.

Marcador esperado:

`R50_A2_HOME_GLOBAL_HEADER_ISO_COPY_READY_FOR_ASTRA`

Después:
Astra revisa → una única Deploy Preview → María HUMAN QA.

No main.  
No producción.  
No reabrir A8.  
No tocar Cloud A9.  
No reabrir voz/modelos Sabik.