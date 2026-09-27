# R42 · A8 · Home nueva + child-safe real · 27/09/2026

**Estado:** `R42_A8_HOME_CHILD_SAFE_READY_FOR_A2`

## Autoridad y lectura

A8 ejecutó issue #305 tras leer #283, #289, #293, #301, #302 y los canónicos vigentes de Estado, Memoria, Control y requisitos operativos ES/EN. El marcador obligatorio `R42_NORMATIVA_EMBEBIDA_LEIDA` quedó publicado en #305 antes de construir.

Los antiguos #294–#297 permanecen históricos/pausados. No se reutilizaron como parches.

## Identidad del trabajo

- puerta A2: PR #244 · rama `agent2/sabik-iris-r08-20260924`
- base exacta A2: `bf44d6ae7aa362b81fadb16b44bdef358cc31bcc`
- base tree: `b143682a9309ad87574bd4909b5ca28b2da0d26e`
- rama A8: `agent8/r42-home-child-safe-20260927`
- HEAD final A8: `4769e223dc5e10f2bdd82a508310a929e94a6bb5`
- tree final A8: `7e3db0f4dc4f4c7943f7ce1be266109ca97510c2`
- PR A8 → A2: #310
- diff: 14 archivos · +638 / −265 · 24 commits
- A2 seguía exactamente en la base al abrir #310.

A8 no desplegó, no tocó main y no publicó producción.

## Home R42 / Design R02

Se construyó una Home nueva ES/EN sobre el producto actual y el Design R02 ya integrado por A2. R02 no se reaplicó.

Incluye:
- cabecera compacta;
- portal de acceso, no formulario/acordeones;
- búsqueda principal;
- launchers a áreas reales;
- acceso al Sabik existente sin tocar voz ni Cloud/retrieval;
- desktop y móvil propios;
- `Contenido para… / Content for…` con Infancia/Children, Adolescencia/Teenagers, Adultez/Adults y Cualquier edad/Any age;
- sin selección = `SAFE_BY_DEFAULT`;
- etapa guardada solo en `sessionStorage` después de una selección explícita;
- sin DOB, identidad, diagnóstico ni cuenta;
- estados R02 de transparencia normal/reducida/opaca;
- móvil opaco para evitar blur innecesario;
- forced colors y reduced motion.

## Child-safe estructural

La seguridad se aplica antes de construir el contenido público:

- autocomplete/catálogos normales cargan `search-safe-default.json`;
- búsqueda intencional safe añade `search-intentional-safe.json`;
- Adultez usa metadata de `search-adult-full-catalog.json`;
- los cuerpos S2 completos se extraen del HTML inicial y viven en chunks separados `/assets/safety/full/*`;
- ningún chunk full S2 se prefetch/preload;
- deep link S2 en default/Infancia/Adolescencia recibe una variante segura;
- Adultez ve un botón explícito `Ver información completa / View full information`; solo ese clic solicita el chunk full;
- enlaces incidentales S2 se eliminan del artefacto público, incluidas rutas relativas del catálogo;
- Vida diaria carga metadata S2 de catálogo solo después de seleccionar Adultez;
- Investigación #5/#36/#37/#45/#46/#71 usa safe variant + chunk full separado;
- los cuatro `INTENTIONAL_ONLY` auditados (#35/#42/#43/#89) no aparecen en listado incidental y requieren búsqueda o deep link.

## Baseline real frente a #302

El A2 vigente no contiene todavía todo R01:
- 185 Condiciones por idioma;
- 187 Situaciones por idioma;
- 48 Vida diaria por idioma;
- 120 estudios de Investigación.

Por ello, en este baseline existen:
- 7 S2 buscables de Condiciones;
- 2 S2 de Vida diaria;
- 6 S2 de Investigación.

`global-395` (TEPT complejo) es alta nueva de R01 y no existe aún en A2. Investigación 121–132 y sus correcciones ES/EN pertenecen igualmente al contenido R01 nuevo. A8 no creó rutas fantasma ni copió el shell R01. El paquete #302 permanece como autoridad para el gate editorial posterior.

## QA final

Workflow final A8:
- run `36330769828`
- resultado: **SUCCESS**
- job `108652120704`
- artefacto `r42-a8-home-child-safe-qa`
- artifact ID `10935572919`

Resultados del mismo flujo:
- `s2_pages=18` (9 parejas ES/EN actuales);
- `research_s2=6`;
- `links_removed=18`;
- `search_safe=365`;
- `search_intentional=7`;
- `search_adult=372`;
- Home ES/EN PASS;
- forced colors PASS;
- reduced motion PASS;
- reduced transparency PASS;
- 0 full-S2 requests en búsqueda/autocomplete/deep link protegido;
- 1 full-S2 request solo después del clic adulto explícito;
- matriz navegador S0 + S1 auditado + cinco S2;
- teclado/foco y reflow PASS;
- capturas ES/EN a 1440×900, 390×844 y 320×800;
- capturas normal/reduced/opaque, reduced motion y forced colors.

Se inspeccionaron las capturas principales ES/EN desktop y móvil. Esto sigue sin equivaler a HUMAN QA de María ni a certificación normativa.

## Siguiente puerta

A2 integra PR #310 sobre su rama, ejecuta build/CI del HEAD integrado y publica una única Deploy Preview. Después María realiza HUMAN QA. No main ni producción antes de esa puerta.
