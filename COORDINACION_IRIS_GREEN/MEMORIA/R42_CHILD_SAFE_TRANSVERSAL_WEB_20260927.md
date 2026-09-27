# R42 · CHILD SAFETY TRANSVERSAL WEB · decisión de María · 27/09/2026

Estado: `R42_CHILD_SAFE_TRANSVERSAL_WEB_REQUIRED`

## Decisión
María amplía el alcance vigente de protección infantil: Child Safety deja de limitarse a la adaptación de contenido/Design y pasa a ser una capa transversal de toda la web Iris Green.

La implementación se hará por fases sobre el nuevo baseline R42, sin reactivar ni cherry-pickear parches del baseline antiguo.

## Modelo obligatorio
Metadatos:
- audience: INFANCIA | ADOLESCENCIA | ADULTEZ | TRANSVERSAL
- sensitivity: S0_GENERAL | S1_SENSITIVE | S2_HIGH_SENSITIVITY
- discovery: NORMAL | INTENTIONAL_ONLY | SAFE_VARIANT_REQUIRED

Reglas duras:
- DEFAULT, INFANCIA y ADOLESCENCIA no reciben el cuerpo S2 completo en HTML/payload inicial.
- Sin preload/prefetch/SSR del full S2 en rutas seguras.
- Buscador, autocomplete, related, navegación, tarjetas y recomendaciones filtran antes del render.
- INFANCIA: acceso intencional a S2 -> variante segura; nunca full S2.
- ADOLESCENCIA: sin recomendaciones algorítmicas S2; acceso intencional -> variante segura/ampliada; nunca full S2 precargado.
- ADULTEZ: full S2 solo tras acción explícita.
- Cambio ADULTEZ -> INFANCIA/ADOLESCENCIA elimina full S2 de DOM, estado navegable y memoria de UI.
- Sin fecha de nacimiento, identidad, cuenta, diagnóstico ni inferencia diagnóstica como requisito del selector.

## Alcance transversal
Aplicar a:
1. app shell, navegación global y enlaces de retorno;
2. home, portadas y catálogos;
3. búsqueda global, autocomplete, related y recomendaciones;
4. Situaciones / Condiciones y contenido editorial;
5. Investigación y recursos jurídicos cuando su descubrimiento pueda exponer S2;
6. Recursos, Juegos y Rutinas: metadatos, enlaces, related y salidas;
7. Intereses y Cuaderno: enlaces, sugerencias y superficies compartidas;
8. Taller: portada, estudios, ayudas y vínculos;
9. Rincón: ayudas, panel contextual, recomendaciones y deep links;
10. ES/EN, escritorio/móvil y tecnologías de apoyo.

## Arquitectura
- shell/índice seguro separado del full S2;
- safeVariant obligatoria para S2 accesible desde modos no adultos;
- full S2 en recurso separado cargado únicamente por intención adulta explícita;
- índices separados de discovery seguro/default, intencional-seguro y catálogo adulto;
- política compartida reutilizable; no lógica divergente por módulo.

## QA transversal
Como mínimo:
- DEFAULT no expone S2 incidental;
- INFANCIA búsqueda/direct link -> safeVariant y cero full S2 en DOM/red;
- ADOLESCENCIA igual, sin recomendación algorítmica S2;
- ADULTEZ requiere acción explícita para full;
- ADULTEZ -> INFANCIA/ADOLESCENCIA purga DOM/estado/navegación;
- lector de pantalla no accede prematuramente a full S2;
- cero prefetch/preload full S2;
- equivalencia ES/EN;
- desktop + móvil;
- no identidad/DOB/cuenta/diagnóstico.

## Secuencia de integración
A. terminar Interfaz R02 y fijar baseline;
B. contrato/política compartida Child Safety + índices + tests;
C. shell/buscador/discovery global;
D. contenido + Investigación;
E. conectores y enlaces de Recursos/Juegos/Rutinas/Intereses/Taller/Rincón;
F. QA red/DOM/a11y ES/EN desktop/móvil;
G. Deploy Preview;
H. HUMAN QA María.

No main. No producción antes de HUMAN QA.
