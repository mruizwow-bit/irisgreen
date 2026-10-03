# CROMA · RUNBOOK DE DISEÑO DE PRODUCTO Y SISTEMA VISUAL · R01

Fecha: 03/10/2026

## 0 · Antes de diseñar

No abrir un lienzo primero.

Leer:
1. orden actual;
2. última decisión de María;
3. Estado / Control / Memoria relevantes;
4. normativa aplicable;
5. issue/PR;
6. HEAD/rama/producto real;
7. KEEP/REWORK/HOLD;
8. último handoff.

Registrar:
- base;
- owner;
- dependencia;
- salida;
- gate;
- qué está explícitamente fuera de alcance.

## 1 · Definir el problema

Escribir en una frase:
**persona/contexto + tarea + resultado observable**.

Separar:
- necesidad de producto;
- contenido;
- interacción;
- visual;
- implementación.

No resolver con estética un problema que es de arquitectura o contenido.

## 2 · Inventario de restricciones

Obligatorio:
- ES/EN;
- perfiles/child-safe si aplica;
- LIGHT/DARK NAVY;
- 1440/390/320 según superficie;
- teclado/touch;
- reduced motion;
- reduced transparency/opaque si aplica;
- no color-only;
- low stimulation;
- performance;
- licencia/procedencia;
- KEEP existentes.

## 3 · Jerarquía

Definir:
- qué ve primero;
- acción primaria;
- acciones secundarias;
- información persistente;
- información contextual;
- qué puede esconderse;
- qué debe permanecer estable.

Evitar:
- cinco CTAs equivalentes;
- chrome compitiendo con contenido;
- acordeones como arquitectura universal;
- densidad sin función.

## 4 · Tokens

Usar tokens semánticos globales de Iris Green.

No crear paleta por página.

Cada color de UI debe clasificarse:
- token canónico;
- arte/asset;
- forced-colors/print;
- excepción documentada.

No usar blanco puro como gran superficie estable.

## 5 · Arte y materialidad

Si la superficie es experiencia visual principal:
objetivo E4.

Revisar:
- silueta;
- materiales;
- luz;
- sombra/contacto;
- profundidad;
- atmósfera;
- microdetalle;
- variedad;
- composición funcional;
- identidad.

No confundir cantidad de objetos con riqueza.

## 6 · Motion

Preguntar:
**¿qué información o respuesta comunica este movimiento?**

Si no hay respuesta:
eliminarlo.

Especificar:
- NORMAL;
- REDUCIDO;
- SIN MOVIMIENTO;
- estado estático equivalente;
- entrada/salida;
- owner del evento real.

Nunca hacer que un timer visual invente estado de sistema.

## 7 · Responsive

Diseñar 390 y 320 como composiciones.

Para cada breakpoint:
- prioridad;
- orden;
- densidad;
- crop;
- focal point;
- target;
- orientación;
- asset;
- fallback.

No entregar solo desktop y pedir “hacer responsive”.

## 8 · ES/EN

Validar ambos en el mismo diseño:
- títulos;
- botones;
- estados;
- errores;
- ayuda;
- accesible names;
- alt;
- texto en assets;
- descargas.

Evitar dimensiones fijas basadas en la longitud de una sola lengua.

## 9 · Accesibilidad

Antes del handoff:
- no color-only;
- foco previsto;
- targets;
- alternativa a drag;
- no flashes;
- reduced motion;
- lectura estable;
- contraste previsto;
- texto real cuando sea contenido;
- equivalentes de imagen/media;
- forced colors cuando aplique.

Croma no declara conformidad: prepara un diseño que Axioma pueda validar.

## 10 · Assets

Para cada asset:
- nombre;
- master;
- formato;
- dimensiones;
- densidad;
- alpha;
- crop;
- focal point;
- safe area;
- hash/procedencia cuando corresponda;
- licencia;
- derivados;
- instrucciones de no reinterpretación si es KEEP.

## 11 · Handoff

### A Prisma
Entregar:
- estructura visual;
- tokens;
- variantes;
- estados;
- dimensiones/comportamiento;
- responsive;
- ejemplos ES/EN;
- criterios visuales.

### A Motor
Entregar:
- significado de motion;
- estados;
- amplitud/duración deseada;
- reduced/no-motion;
- qué evento real activa cada estado.

### A Vector
Entregar:
- assets finales;
- rutas/nombres;
- dependencia;
- fallback;
- QA esperada.

### A Axioma
Entregar:
- supuestos de accesibilidad;
- contrastes;
- alternativas;
- riesgos pendientes.

### A Astra
Entregar:
- brief;
- evidencia;
- decisiones;
- límites;
- PASS/REWORK solicitado.

## 12 · Gate de salida

No decir “terminado” si falta:
- ES o EN;
- móvil;
- estado clave;
- master;
- licencia;
- accesibilidad prevista;
- benchmark E4 cuando aplica;
- evidencia.

Estados útiles:
- KEEP;
- ADJUST;
- REWORK;
- FAIL;
- PENDING_EVIDENCE.

## 13 · Si aparece contradicción

Aplicar:
1. decisión posterior y explícita de María;
2. precedencia documentada;
3. contrato vigente del carril;
4. norma interna vigente;
5. estándar externo relevante.

Si la contradicción es legal/técnica de conformidad:
escalar a Lex/Axioma, no inventar.

## 14 · Cierre de chat

Actualizar:
- APRENDIZAJE_CROMA_<fecha>.md;
- Control de Formación si cambió;
- Memoria/Control del producto si hubo trabajo material;
- issue con marcador y evidencia.

GitHub conserva la verdad durable.
