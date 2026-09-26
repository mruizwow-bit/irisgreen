# ADDENDUM R42 · Protección de menores en Situaciones y Condiciones · 26/09/2026

Estado: `R42_CHILD_SAFE_CONTENT_ARCHITECTURE_REQUIRED`

## 1. Motivo
Iris Green contiene contenidos adecuados para edades y contextos muy distintos. La separación por etapa adoptada en R42 debe aplicarse también a Situaciones, Condiciones, buscadores y enlaces cruzados para reducir la exposición accidental de menores a contenido de alta sensibilidad.

## 2. Dos dimensiones obligatorias

La edad/etapa y la sensibilidad NO son la misma cosa.

### Etapa
- INFANCIA
- ADOLESCENCIA
- ADULTEZ
- TRANSVERSAL / CUALQUIER EDAD

### Sensibilidad
- `S0_GENERAL`
- `S1_SENSITIVE`
- `S2_HIGH_SENSITIVITY`

### Discovery
- `NORMAL`
- `INTENTIONAL_ONLY`
- `SAFE_VARIANT_REQUIRED`

## 3. Safe-by-default
Cuando no exista preferencia de etapa, la navegación incidental aplica protección equivalente a CUALQUIER EDAD:
- no recomendar S2;
- no introducir S2 en carruseles, relacionados, sugerencias, aleatorios o enlaces desde juegos;
- permitir encontrar ayuda mediante búsqueda intencional;
- no convertir la seguridad en invisibilidad de recursos de ayuda.

## 4. Infancia
- S0 y S1 aprobados pueden aparecer normalmente.
- S2 no aparece incidentalmente.
- Cuando el tema sea necesario para seguridad o pedir ayuda, existe una versión infantil segura: lenguaje claro, breve, no gráfico, sin métodos, centrado en seguridad, apoyo y adulto de confianza.
- Acceso directo a contenido S2 no muestra de golpe la versión completa.

## 5. Adolescencia
- S0/S1 disponibles con adaptación.
- S2 requiere intención clara y presentación segura.
- No recomendaciones en cadena/rabbit holes.
- No métodos, detalles gráficos, instrucciones, glamour o normalización de conductas de daño.

## 6. Adultez
Catálogo completo, conservando normas de comunicación segura para autolesión/suicidio y otros temas de alta sensibilidad.

## 7. Temas sensibles que NO deben ocultarse por defecto a menores
Abuso, acoso, consentimiento, seguridad, pedir ayuda y salud mental pueden ser necesarios para proteger a un menor. Se adaptan; no se convierten automáticamente en “solo adultos”.

## 8. Privacidad y etapa
La interfaz puede preguntar “¿Para quién buscas?” / “Contenido para…”.
No debe requerir:
- fecha de nacimiento;
- identidad;
- cuenta;
- perfil remoto.

La preferencia puede ser temporal/local tras acción explícita. No se usa para marketing, perfilado ni envío de red.

## 9. Búsqueda, navegación y enlaces
`buscador.json`, catálogos, relacionados y enlaces cruzados deben consultar audience/sensitivity/discovery.

Ningún juego INFANCIA puede enlazar incidentalmente a S2.
Taller, Intereses y Rincón deben respetar la lente de etapa cuando sugieran contenido.

## 10. No-JS
La protección esencial no puede depender solo de JavaScript. La salida estática y la navegación base deben ser seguras por defecto.

## 11. HUMAN QA
CI verifica metadatos y rutas, pero la aceptación final requiere revisar en la web:
- qué ve una persona en Infancia;
- qué descubre por accidente;
- qué ocurre al buscar expresamente ayuda;
- lenguaje y tono de las variantes seguras;
- desktop y móvil;
- ES/EN.

## 12. Referencias de diseño y seguridad consultadas
Estas referencias informan diseño; no implican por sí solas que todas sus obligaciones jurídicas apliquen a Iris Green.

- ICO Children’s Code: best interests, age-appropriate application, data minimisation y high privacy/default.
  https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/
- ICO age appropriate application: etapas de desarrollo y enfoque basado en riesgo.
  https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/3-age-appropriate-application/
- AEPD: la protección del menor no exige conocer identidad o edad exacta cuando no sea necesario; proporcionalidad y minimización.
  https://www.aepd.es/preguntas-frecuentes/10-menores-y-educacion/1-sistemas-de-verificacion-edad/FAQ-1019-que-supone-la-verificacion-de-edad
- Comisión Europea: directrices de protección de menores bajo DSA, safety/privacy by design y mitigación de exposición a contenido nocivo.
  https://digital-strategy.ec.europa.eu/es/library/commission-publishes-guidelines-protection-minors
- Samaritans: especial cuidado con jóvenes y exposición a contenido de autolesión/suicidio; reducir acceso a contenido dañino manteniendo vías de ayuda.
  https://www.samaritans.org/about-samaritans/media-guidelines/guidance-covering-youth-suicides-clusters-and-self-harm/
  https://www.samaritans.org/about-samaritans/research-policy/internet-suicide/guidelines-tech-industry/reducing-access-harmful-content/

## 13. Ejecución
- A4 #294 clasifica 372 fichas.
- A3 #295 implementa lente/búsqueda/rutas seguras.
- A1 #296 corrige enlaces desde Recursos/Juegos.
- A2 #297 integra y publica preview para HUMAN QA.
- Parent #293.
