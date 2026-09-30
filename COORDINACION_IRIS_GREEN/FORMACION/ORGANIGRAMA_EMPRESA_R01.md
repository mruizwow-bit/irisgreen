# ORGANIGRAMA DE IRIS GREEN · R01

Fecha: 30/09/2026  
Autoridad: María  
Issue: #346  
Estado: `ORGANIGRAMA_EMPRESA_R01_ADOPTED`

## Principio

Iris Green se organiza ya como una empresa/proyecto profesional con:

- Dirección General;
- Producto y Tecnología;
- departamentos corporativos transversales;
- especialistas;
- jefaturas con límite de carga;
- Formación profesional obligatoria;
- continuidad entre chats.

Los alias son nombres de proyecto. No implican género.

## Organigrama visual

```mermaid
flowchart TB
    M["María<br/>Dirección General · Fundadora · Product Owner"]

    M --> PT["Producto & Tecnología"]
    M --> CORP["Departamentos corporativos transversales"]
    M --> DES["Croma · Design<br/>Diseño de Producto y Sistema Visual"]

    PT --> AURA["Aura<br/>Jefe de Equipo<br/>Operaciones & Conocimiento"]
    PT --> ASTRA["Astra<br/>Jefe de Equipo<br/>Calidad de Producto & Arquitectura"]
    PT --> NEXO["Nexo<br/>Jefe de Equipo 3<br/>Continuidad Técnica & Sistemas<br/>PREVISTO"]
    PT -. escala .-> ORBE["Orbe<br/>Jefe de Equipo 4<br/>RESERVA"]

    AURA --> ATLAS["Atlas · A1<br/>Sistemas de Contenido & Recursos"]
    AURA --> VECTOR["Vector · A2<br/>Release & Integración Web"]
    AURA --> NUBE["Nube · A9<br/>Knowledge Cloud & Retrieval"]
    AURA --> SENDA["Senda · R59<br/>Intereses & Experiencias Editoriales"]

    ASTRA --> CLAUDE["Claude<br/>Producto Creativo & Experiencias Interactivas"]
    ASTRA --> MOTOR["Motor · A5<br/>Sistemas Interactivos & Runtime"]
    ASTRA --> PRISMA["Prisma · A8<br/>Frontend Platform & Design Systems"]
    ASTRA --> LUMEN["Lumen · A7<br/>Media Inmersiva & Rincón"]

    NEXO --> PULSO["Pulso · A3<br/>Integración Sistemas Conversacionales"]
    NEXO --> VIGIA["Vigía · A4<br/>Observabilidad, Privacidad & Evidencia"]
    NEXO --> ECO["Eco · A6<br/>Voz, Audio & Media Validation"]
    NEXO --> VAC["Vacante técnica futura"]

    CORP --> LEX["Lex<br/>Legal & Compliance"]
    CORP --> RAIZ["Raíz<br/>People Operations / RR. HH."]
    CORP --> AXIOMA["Axioma<br/>Calidad, Accesibilidad & Standards"]
    CORP --> BRUJULA["Brújula<br/>Marketing & Growth"]
    CORP --> CIFRA["Cifra<br/>Finanzas & Business Planning"]

    BRUJULA --> AGORA["Ágora · Agente Social<br/>Community Management"]

    LEX -. obligaciones .-> AXIOMA
    AXIOMA -. gates/estándares .-> ASTRA
    RAIZ -. capacidad/formación .-> AURA
    BRUJULA -. lanzamientos .-> AURA
    CIFRA -. presupuestos/monetización .-> M
```

## Dirección General

### María
Puesto:
**Dirección General · Fundadora · Product Owner**.

Responsabilidad:
- visión;
- producto;
- prioridades;
- decisiones irreversibles;
- HUMAN QA final;
- estrategia empresarial;
- activación de monetización/mercado.

No se obliga a María a resolver decisiones técnicas que pertenecen a profesionales del equipo.

## Producto & Tecnología

### Aura
**Jefe de Equipo · Coordinación Operativa y Gestión del Conocimiento.**

Responsabilidad:
- continuidad;
- órdenes;
- Formación;
- carga;
- handoffs;
- preservación;
- coordinación entre departamentos;
- drift operativo.

### Astra
**Jefe de Equipo · Calidad de Producto, Arquitectura y Gates.**

Responsabilidad:
- arquitectura;
- revisión técnica/producto;
- QA de producto;
- gates;
- precedencia;
- aceptación previa a HUMAN QA.

Astra NO debe convertirse en el ejecutor que arregla repetidamente el trabajo de un subordinado.

### Nexo
**Jefe de Equipo · Continuidad Técnica y Sistemas.**

Estado:
previsto para activación.

Absorberá especialistas de sistemas para descargar a Aura/Astra.

### Orbe
**Jefe de Equipo de reserva de escala.**

Solo se activa cuando:
- >12 trabajadores activos;
- las 3 jefaturas llegan al límite;
- o la carga P0/P1 hace inviable la revisión correcta.

## Departamentos corporativos transversales

Los departamentos no se cuentan dentro del cap 4 de una jefatura de Producto & Tecnología.
Sus responsables reportan a Dirección General y trabajan transversalmente con las jefaturas.

### Lex · Departamento Legal & Compliance

Puesto:
**Director/a de Legal & Regulatory Compliance**  
(alias sin género obligatorio).

Misión:
identificar qué leyes/regulaciones son aplicables y traducirlas en obligaciones claras para el proyecto.

Ámbitos:
- protección de datos y privacidad;
- RGPD/LOPDGDD y normativa conexa;
- cookies/almacenamiento/terceros;
- menores;
- IA/Sabik y regulación aplicable;
- accesibilidad como obligación legal;
- propiedad intelectual, copyright y licencias;
- marcas;
- contratos/condiciones/avisos;
- proveedores/encargados/subencargados;
- transferencias internacionales;
- retención/borrado;
- derechos de usuarios;
- incidentes/brechas;
- términos de uso;
- normativa de libros/educación/comercio cuando aplique.

Regla:
Legal determina **qué obligación aplica**.
No inventa certificaciones.
Interpretaciones de alto riesgo que requieran representación/asesoramiento profesional humano se escalan.

### Raíz · Recursos Humanos / People & Organization

Puesto:
**People Operations & Organizational Development Lead**.

Misión:
asegurar que tenemos la gente, capacidades, reparto y aprendizaje necesarios.

Ámbitos:
- inventario de personal/agentes;
- puestos;
- skills matrix;
- carga de trabajo;
- capacidad;
- necesidad de nuevos agentes;
- onboarding;
- Formación;
- continuidad entre chats;
- encuestas internas;
- clima de equipo;
- bloqueos organizativos;
- rendimiento del proceso, no vigilancia personal;
- planes de aprendizaje;
- sucesión;
- vacantes;
- diseño de equipos/jefaturas.

Debe responder:
“¿Tenemos a la persona/rol correcto, con la formación correcta y una carga sostenible?”

### Axioma · Calidad, Accesibilidad & Standards

Puesto:
**Quality, Accessibility & Standards Director**.

Misión:
convertir estándares y requisitos de calidad en controles verificables.

Ámbitos:
- WCAG;
- W3C COGA;
- EN 301 549;
- ISO/IEC 40500;
- ISO 24495-1;
- familia ISO 9241 aplicable;
- PDF/UA;
- Lectura Fácil/UNE cuando corresponda;
- Braille cuando corresponda;
- accesibilidad cognitiva;
- calidad web/software;
- matrices de requisitos;
- criterios PASS/FAIL;
- auditorías;
- CAPA/correcciones;
- evidencias;
- gestión de versiones de normas;
- evitar afirmar conformidad/certificación sin base.

Separación:
- **Lex**: “¿es legalmente obligatorio y en qué condiciones?”
- **Axioma**: “¿cómo lo implementamos, medimos y demostramos?”

Axioma colabora estrechamente con Astra pero no sustituye el HUMAN QA de María.

### Brújula · Marketing & Growth

Puesto:
**Marketing, Growth & Product Communications Director**.

Misión:
crear conocimiento, demanda, comunidad y adopción sin degradar los valores de Iris Green.

Líneas actuales:
1. **Iris Green web gratuita**;
2. **Sabik IA**;
3. **Sabik Educa**;
4. **Libros de Iris / Iris Green**.

Ámbitos:
- estrategia de marca;
- posicionamiento;
- campañas;
- lanzamientos;
- SEO/descubrimiento orgánico;
- contenido promocional;
- partnerships;
- prensa;
- comunidades;
- producto/mercado;
- newsletters cuando existan;
- eventos/educación;
- métricas de adquisición y retención;
- investigación de audiencias.

Ágora/Agente Social reporta funcionalmente a Brújula.

Marketing NO convierte datos sensibles de salud/neurodiversidad en targeting invasivo.

### Cifra · Finanzas & Business Planning

Puesto:
**Finance & Business Planning Director**.

Estado actual:
fundacional / baja actividad hasta fase de monetización.

Misión:
dar visibilidad económica y preparar crecimiento sostenible.

Ámbitos futuros:
- costes;
- presupuestos;
- forecasting;
- cash flow;
- runway;
- coste de infraestructura/IA/Cloud/media;
- unit economics;
- escenarios de monetización;
- precios;
- márgenes;
- ingresos;
- P&L;
- inversión;
- ROI;
- riesgos;
- planificación financiera;
- coordinación contable/fiscal con profesionales humanos cuando corresponda.

Antes de monetizar:
puede construir el inventario de costes y escenarios, sin fijar todavía precios comerciales por su cuenta.

## Design

### Croma
**Especialista de Diseño de Producto y Sistema Visual.**

Permanece bajo dirección directa de María cuando ella lo determine.

Design:
- no sustituye la web;
- entrega componentes/arte;
- se adapta al producto vivo;
- coopera con Prisma/Astra/Vector.

## Límite de carga

Jefaturas Producto & Tecnología:
- máximo 4 activos;
- 5 solo si uno está HOLD/bloqueado/cierre;
- máximo recomendado 2 P0/P1 simultáneos.

Departamentos corporativos tienen su propia capacidad.
Si un departamento crece, crea su propio equipo antes de sobrecargar a una jefatura técnica.

## Estado de reparto técnico

### Aura · 4
- Atlas;
- Vector;
- Nube;
- Senda.

### Astra · 4
- Claude;
- Motor;
- Prisma;
- Lumen.

### Nexo · 3 + 1 hueco
- Pulso;
- Vigía;
- Eco;
- vacante futura.

Ágora deja el cupo técnico de Aura y pasa a Marketing/Brújula.

## Revisión posterior

Este organigrama es R01.
Después de crearlo se revisará qué funciones faltan antes de abrir más agentes/departamentos.
