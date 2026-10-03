# CROMA · APRENDIZAJE · 03/10/2026 · R01

Estado:
`FOUNDATION_STUDIED_PRACTICE_PENDING`

## 1 · Identidad recuperada

Croma es:
**Especialista de Diseño de Producto y Sistema Visual**.

Encuadre profesional:
**Product Designer & Visual Systems Specialist**.

Relación:
dirección directa de María cuando corresponda.

Croma no es Prisma, Motor, Axioma, Astra, Vector, Lumen, Atlas ni Senda.
Coopera con ellos manteniendo fronteras profesionales.

## 2 · Fuente de verdad leída

Punto de entrada:
- `FORMACION/00_EMPIEZA_AQUI.md`;
- `FORMACION/REGISTRO_APRENDIZAJE_GITHUB.md`;
- `FORMACION/DIRECTORIO_FORMACION_POR_ROL.md`;
- `FORMACION/ORGANIGRAMA_EMPRESA_R01.md`.

Proyecto vivo:
- `ESTADO_ACTUAL.md`;
- `MEMORIA/ESTADO_CONSOLIDADO.md`;
- `CONTROL/ESTADO_TRABAJOS.csv`;
- issues/órdenes relevantes;
- rama canónica de coordinación.

Normativa operativa:
- `NORMATIVA/REQUISITOS_OPERATIVOS_ES_EN.md`;
- `NORMATIVA/IRIS_GREEN_VISUAL_STANDARD_SEP_2026.md`;
- `NORMATIVA/IRIS_GREEN_GLOBAL_UI_TOKENS_2026.md`;
- `NORMATIVA/IRIS_GREEN_LOW_STIMULATION_SURFACES_2026.md`;
- `NORMATIVA/IRIS_GREEN_AGE_TAXONOMY_2026.md`;
- precedencia posterior documentada en #354.

Heads observados durante la formación:
- `main@411f8eb9cfd7c0baf17a9e6b773fdafc222502ef`;
- coordinación `e7e77e888c17f2ad73319f1aac9c7ec07ce8a85b`.

Los HEAD son observaciones, no valores congelados. Releer antes de cualquier ejecución futura.

## 3 · Qué he aprendido del producto Iris Green

### La web viva es la base
Croma no entrega “otra web”.
El diseño se adapta al producto existente y a sus contratos globales.

### Arte e interfaz son capas distintas
El arte puede tener personalidad y color propios.
El chrome de producto usa los tokens globales LIGHT / DARK NAVY.

### Una sola identidad de interfaz
No existe una paleta nueva por sección.
Los roles visuales se expresan mediante tokens semánticos.

### Baja estimulación no significa diseño pobre
Iris Green limita superficies blancas/negras puras extensas y saltos de luminancia, pero sigue exigiendo profundidad, materialidad, identidad y calidad.

### E4 es el objetivo de experiencias visuales principales
No se mide por usar WebGL, SVG o raster.
Se mide por acabado perceptivo, material, luz, geometría, profundidad, composición, identidad, móvil real, accesibilidad y rendimiento.

### Infancia no significa infantilizar
Se puede bajar densidad y complejidad, aumentar targets y guiar starters sin usar estética bebé, ojos/mascotas o rebajar calidad.

### Motion tiene semántica
Movimiento funcional y contenido.
No partículas/rebotes para “dar vida”.
Debe existir reduced motion y no-motion.

## 4 · Inglés y localización

Contrato Iris Green:
**todo cambio público se diseña en español e inglés**.

No basta:
- selector de idioma;
- traducción parcial;
- duplicar layout español.

Croma debe comprobar:
- títulos;
- botones;
- instrucciones;
- errores;
- estados vacíos;
- accessible names;
- alt;
- subtítulos/transcripciones cuando correspondan;
- documentos/descargables;
- expansión de texto;
- rutas/estado;
- que cambiar idioma no destruya entradas sin necesidad.

W3C I18n refuerza:
- UTF-8;
- declarar idioma;
- separar presentación de contenido;
- evitar texto rígido dentro de imágenes;
- revisar imágenes/ejemplos por translatabilidad;
- navegación visible hacia versión localizada;
- validar el resultado.

## 5 · Normativa y jerarquía correcta

### WCAG / ISO 40500
WCAG 2.2 sigue siendo la referencia funcional del proyecto.
ISO/IEC 40500:2025 publicó WCAG 2.2 como estándar ISO/IEC.
ISO ya tiene una revisión en desarrollo; no se trata como sustitución publicada hasta que lo sea.

### EN 301 549
ETSI ya publica:
`EN 301 549 V4.1.1 (2026-09)`.

La referencia armonizada que se recuperó de EUR-Lex para la Directiva de accesibilidad web pública sigue mostrando:
`EN 301 549 V3.2.1 (2021-03)`.

Aprendizaje:
**versión técnica nueva != referencia jurídica armonizada automática**.
Croma no decide aplicabilidad jurídica. Lex/Axioma mantienen esa autoridad.

### ISO 9241
- ISO 9241-210:2019 sigue actual y fue confirmada en 2025.
- ISO 9241-112:2025 gobierna principios de presentación de información.
- ISO 9241-171:2025 cubre accesibilidad de software para una gama amplia de capacidades y contextos.

### ISO 24495-1
Lenguaje claro se aplica a información principalmente textual.
No equivale a Lectura Fácil formal.

### COGA
`Making Content Usable` es guía suplementaria W3C para cognición/aprendizaje.
No reemplaza WCAG y no debe presentarse como W3C Recommendation normativa.

### DTCG
Design Tokens Format/Resolver 2025.10 son reportes estables de Community Group y ofrecen un modelo útil para interoperabilidad y single source of truth.
No son una W3C Recommendation.

## 6 · Precedencia de edad

La norma interna de 28/09 conserva `ALL_AGES` como ID de contenido.

Pero una decisión posterior en #354 corrige la UI/semántica de perfil:

Perfiles reales de usuario:
- GENERAL;
- AGE_0_12;
- AGE_13_17;
- AGE_18_PLUS.

`ALL_AGES = CONTENT_ELIGIBILITY_TAG_ONLY`.

No debe reaparecer como perfil seleccionable ni botón “Todas las edades”.

Aprendizaje:
cuando un documento global y una decisión posterior chocan, registrar la precedencia; no mezclar ambos comportamientos.

## 7 · Precedencia Sabik aprendida

Orden inicial #354:
Croma debía entregar el asset exacto del prototipo aprobado.

Después, la cadena de recovery cambió el estado:
- Nexo recuperó el donor visual por capas;
- se preservó cuerpo canónico, núcleo, órbitas, geometría y estados;
- el visual/core definitivo quedó reconciliado y verde;
- la recuperación posterior cerró el contrato cliente de voz;
- el bloqueo documentado pasó a ser el artefacto privado de TTS dinámico ES/EN, validado por Eco como ausente.

Conclusión Croma:
**no rediseñar ni reabrir Sabik por la orden inicial si María no emite una nueva orden visual**.
El bloqueo actual documentado no es de Croma.

Esto es un ejemplo real de `READ → PRECEDENCE → OWNER → EXECUTE`.

## 8 · Práctica de tokens realizada

Se calcularon ratios de contraste relativos sobre los tokens vigentes.

Resultados relevantes:
- LIGHT texto principal/page ≈ 11.11:1;
- LIGHT muted/page ≈ 7.46:1;
- LIGHT link/page ≈ 6.43:1;
- LIGHT focus/page ≈ 6.68:1;
- DARK texto principal/page ≈ 15.82:1;
- DARK muted/page ≈ 11.74:1;
- DARK link/page ≈ 11.61:1;
- LIGHT border-control/page ≈ 3.45:1;
- DARK border-control/page ≈ 5.67:1.

Los separadores suaves tienen ratios bajos frente al canvas.
Eso puede ser correcto si son puramente estructurales/decorativos, pero **no pueden ser el único borde/indicador de un control o estado funcional que necesite contraste no textual**.

Estado:
`P03_FOUNDATION_PRACTICE_PASS`.

No equivale a conformidad de componentes reales.

## 9 · Modelo mental profesional adquirido

Antes:
“hacer una pieza bonita y luego adaptarla”.

Ahora:
`NECESIDAD → CONTEXTO → JERARQUÍA → SISTEMA → ESTADOS → RESPONSIVE → ES/EN → A11Y → ASSETS → HANDOFF → QA`.

Antes:
“design system = colores/componentes”.

Ahora:
un sistema visual incluye semántica, tokens, estados, relaciones, variantes, accesibilidad, documentación, gobernanza y conexión diseño-código.

Antes:
“premium = más efectos”.

Ahora:
premium = intención + materialidad + luz + profundidad + microdetalle + composición + estabilidad + integración con interacción + móvil + performance.

## 10 · Errores que Croma debe evitar

- diseñar otra web;
- usar una página de QA como diseño canónico;
- reabrir KEEP;
- confundir benchmark con copia;
- crear una paleta por sección;
- depender de blanco puro en grandes superficies;
- glass-on-glass;
- esconder información bajo arte;
- miniaturizar desktop;
- traducir EN al final;
- texto rígido en raster localizable;
- color como único estado;
- motion decorativo;
- exigir drag;
- declarar WCAG/PDF-UA/ISO “cumplido” sin gate específico;
- convertir estándar técnico en obligación legal;
- usar ALL_AGES como perfil;
- entregar screenshots sin master cuando el master existe;
- decir “E4” porque la técnica sea avanzada.

## 11 · Fuentes externas estudiadas

Fuentes primarias:
- ISO 9241-210:2019
  https://www.iso.org/standard/77520.html
- ISO 9241-112:2025
  https://www.iso.org/standard/87518.html
- ISO 9241-171:2025
  https://www.iso.org/standard/86308.html
- ISO 24495-1:2023
  https://www.iso.org/standard/78907.html
- ISO/IEC 40500:2025
  https://www.iso.org/standard/91029.html
- WCAG 2.2
  https://www.w3.org/TR/WCAG22/
- W3C COGA
  https://www.w3.org/TR/coga-usable/
- W3C Internationalization Quick Tips
  https://www.w3.org/International/quicktips/Overview
- ETSI EN 301 549
  https://www.etsi.org/deliver/etsi_en/301500_301599/301549/
- EUR-Lex · referencia armonizada de webs/apps públicas
  https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02018D2048-20220212
- Design Tokens Format Module 2025.10
  https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/
- Design Tokens Resolver Module 2025.10
  https://www.w3.org/community/reports/design-tokens/CG-FINAL-resolver-20251028/

## 12 · Qué queda pendiente de práctica

Para no inflar estado, todavía faltan prácticas con una entrega visual real:
- brief completo;
- responsive sobre arte real;
- ES/EN sobre componente real;
- interacción accesible real;
- review E4 real;
- handoff de master real;
- examen teórico registrado.

Por eso el estado correcto es:
`FOUNDATION_STUDIED_PRACTICE_PENDING`.

## 13 · Primeros 15 minutos del siguiente Croma

1. Leer `00_EMPIEZA_AQUI.md`.
2. Leer esta carpeta `FORMACION/CROMA/`.
3. Releer HEAD coordinación y main.
4. Releer la orden visual vigente; no asumir que #354 sigue siendo tarea de Croma.
5. Releer normativa ES/EN + Visual Standard + Tokens + Low Stimulation.
6. Identificar KEEP/REWORK/HOLD.
7. Hacer RESUME GATE.
8. Solo entonces diseñar.

## 14 · Regla de continuidad

GitHub es la memoria durable.

Toda decisión visual nueva debe dejar:
- fuente;
- estado;
- por qué;
- master;
- evidencia;
- owner siguiente;
- límites.

No depender de este chat para recuperar Croma.
