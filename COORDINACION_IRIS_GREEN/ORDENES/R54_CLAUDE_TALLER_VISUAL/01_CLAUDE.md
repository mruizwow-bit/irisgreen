# R54 · CLAUDE · TALLER · REBUILD VISUAL DE HOME + INTERIORES

Fecha: 28/09/2026  
Autoridad de producto: **María**  
Responsable de construcción: **Claude**  
Revisión: **Astra**  
Integración: **A2**  
Aceptación final: **HUMAN QA María**

## PRECEDENCIA

Esta orden corrige visualmente R47 sin rehacer sus motores.

Fuente auditada por Astra:
- `R47_TALLER_DEFINITIVO.patch.gz`
- `COORDINACION_R47.patch.gz`

Hallazgo concreto:
la Home del Taller usa en múltiples tarjetas `igk-art` con **SVG inline extremadamente esquemáticos**:
- Código: bloques rectangulares básicos;
- Estructuras: puente reducido a pocas líneas;
- Ritmo: cuadrícula/pads mínimos;
- otros estudios siguen la misma gramática de “icono ampliado”.

Eso es suficiente como pictograma funcional, **pero NO como dirección visual final de El Taller**.

María fija la regla:

**EL TALLER NO PUEDE ENTRAR POR ICONOS; TIENE QUE ENTRAR POR ESCENAS.**

---

# 1. PROBLEMA DE PRODUCTO

Claude tiende a resolver la parte visual con:
- dos líneas;
- un bloque;
- una figura simple;
- iconografía mínima;
- wireframes;
- SVG utilitario;
- hero vacío con poco contexto.

En El Taller esto produce:
- baja atracción visual;
- poca sensación de creatividad;
- estudios que se distinguen por texto más que por imagen;
- experiencia demasiado técnica;
- especialmente mal resultado cuando la persona ha elegido **Infancia**.

No es un fallo de accesibilidad funcional.
Es un **fallo de producto visual**.

---

# 2. OBJETIVO

La Home y los interiores deben:
- invitar a entrar;
- despertar curiosidad;
- mostrar actividad;
- transmitir creación;
- distinguir claramente cada estudio;
- ser atractivos para infancia;
- seguir funcionando para adolescencia y adultez sin infantilizarlas.

No convertir el Taller en una web infantil.
Sí convertirlo en una **experiencia creativa visualmente rica**.

---

# 3. HOME DE EL TALLER

## 3.1 Tarjetas = mini-escenas

Cada estudio debe tener una mini-ilustración/mini-escena.

NO:
- icono;
- logo;
- pictograma grande;
- dos objetos aislados;
- formas geométricas sin contexto.

SÍ:
- varios elementos relacionados;
- capas;
- profundidad;
- acción/proceso;
- color;
- composición;
- identidad propia.

La imagen debe responder en 1 segundo:
**“¿Qué puedo crear aquí?”**

---

# 4. NIVEL VISUAL MÍNIMO POR ESTUDIO

No obliga a copiar literalmente estos ejemplos.
Marca el nivel de riqueza esperado.

## Dibujo
Mostrar:
- superficie/lienzo;
- trazos visibles;
- lápices/pinceles/color;
- algo en proceso de creación.

NO solo lápiz/icono.

## Pintura
- manchas/capas;
- mezcla de color;
- pinceles;
- superficie pictórica.

## Estructuras
- puente/torre/grúa;
- apoyos;
- piezas;
- cargas o contexto;
- sensación de construcción.

NO puente de cuatro líneas.

## 3D
- objeto reconocible;
- profundidad;
- piezas/modelo;
- perspectiva;
- entorno de edición.

NO cubo aislado.

## Código
- bloques/código;
- resultado visible;
- relación causa→resultado;
- algo que “hace” lo programado.

NO cuatro bloques rectangulares sin escena.

## Robótica
- robot/vehículo;
- ruedas/piezas/sensores;
- recorrido/acción.

## Música / ritmo / secuenciador
- pads/pistas;
- forma de onda o compases;
- elementos musicales;
- sensación de tocar/componer.

NO mera cuadrícula.

## Animación
- secuencia de fotogramas;
- personaje/objeto en varias posiciones;
- movimiento entendible.

## Videojuegos
- pequeña escena jugable;
- personaje;
- obstáculo/objetivo visual;
- escenario.

## Mundos
- mapa;
- lugares;
- criaturas/cultura;
- símbolos;
- sensación de universo propio.

## Escritura / historias / cómic
- viñetas;
- personajes;
- bocadillos;
- páginas/cuaderno;
- estructura narrativa.

## Papiroflexia
- hojas finas;
- pliegues;
- varias figuras;
- profundidad/sombra.

## Fotografía
- encuadre;
- cámara/visor;
- sujeto/escena;
- luz.

Aplicar la misma lógica a los 27 estudios.

---

# 5. DIFERENCIACIÓN REAL 27/27

No usar una única plantilla:
`fondo pastel + icono central + dos elementos`.

Cada estudio debe tener:
- silueta/composición propia;
- elementos propios;
- ritmo visual propio;
- paleta compatible pero diferenciada;
- escena reconocible sin leer el título.

Gate:
**si ocultamos el texto, una persona debe poder distinguir la mayoría de estudios por su visual.**

---

# 6. INFANCIA · CAMBIO REAL DE DIRECCIÓN

Cuando `Contenido para… = Infancia`:

La experiencia visual debe ser:
- más inmediata;
- más cálida;
- más colorida;
- más narrativa;
- más fácil de interpretar;
- con objetos grandes y claros;
- con menos abstracción técnica.

No usar estética “bebé”.
No caricaturas diagnósticas.
No infantilizar lenguaje.

## Variantes

Claude puede:
- usar visual base rico para todos;
- añadir variante `child` en los estudios donde el visual adulto sea demasiado abstracto.

No es obligatorio generar 4 ilustraciones por estudio.

Sí es obligatorio que **la selección Infancia no termine viendo una colección de iconos técnicos**.

---

# 7. ADOLESCENCIA Y ADULTEZ

Pueden ser:
- más sobrias;
- más técnicas;
- menos coloridas;

pero no:
- vacías;
- frías;
- iconográficas;
- genéricas.

“Adulto” no significa “dos líneas”.

---

# 8. HOME · COMPOSICIÓN

La Home del Taller debe sentirse como un **portal creativo**.

Primer viewport:
- título;
- frase breve;
- selector de etapa;
- estudios destacados visualmente;
- búsqueda/filtro si aporta.

No convertir en:
- tabla;
- menú administrativo;
- grid uniforme de fichas idénticas.

## Destacados

Los “Buenos lugares para empezar” deben tener las escenas más fuertes.

En Infancia:
- seleccionar starters adecuados;
- mayor tamaño visual;
- menos texto secundario;
- CTA claro.

---

# 9. INTERIORES 27/27

La corrección NO termina en la Home.

Claude debe revisar los interiores porque el mismo patrón de minimalismo aparece dentro.

Cada estudio debe tener, como mínimo:

### A
un **hero/escena de entrada visualmente rico**, o

### B
un **starter/example inicial visualmente atractivo** que ocupe protagonismo real.

Idealmente ambos cuando el motor lo permita.

---

# 10. PRIMERA PANTALLA DEL ESTUDIO

Debe mostrar rápidamente:
- qué puedes hacer;
- una muestra visual;
- dónde empezar.

No debe mostrar primero:
- documentación técnica;
- controles densos;
- paneles vacíos;
- texto largo.

Workspace-first se conserva.

Pero:
**workspace-first != visually-empty-first.**

---

# 11. STARTERS

Los starters por etapa tienen que verse distintos cuando la actividad lo requiera.

Ejemplo:
Estructuras:
- Infancia: puente de colores/piezas grandes;
- Adolescencia: puente para vehículo/río;
- Adultez: pasarela/estructura más realista.

La diferencia NO puede existir solo en el nombre del starter.
Debe verse en el lienzo/escena.

---

# 12. NO DECORACIÓN VACÍA

Esta orden NO autoriza:
- fondos con confeti;
- stickers por rellenar;
- gradientes arbitrarios;
- ilustraciones bonitas sin relación con la actividad.

Toda riqueza visual debe responder:
**qué se hace aquí / qué puedo crear.**

---

# 13. FORMATO DE LOS VISUALES

Puede usar:
- SVG rico;
- ilustración vectorial;
- canvas;
- WebGL/Three donde ya sea natural al estudio;
- composiciones first-party.

No exigir PNG si SVG funciona.

Pero un SVG con cuatro formas simples sigue siendo FAIL.

## Imágenes generadas

Si se generan ilustraciones:
- first-party;
- sin stock genérico;
- sin watermark de terceros;
- trazabilidad;
- optimizadas para web;
- alternativa textual cuando sean informativas.

---

# 14. R42/R02

Conservar:
- R42/R02;
- R49;
- header R50 cuando se integre;
- superficies estables opacas;
- crystal solo chrome.

Las escenas visuales son **contenido**, no chrome.

No aplicar cristal sobre las ilustraciones/lienzos.

---

# 15. CHILD-SAFE

No tocar la clasificación R47 ya construida.

La riqueza visual tampoco puede introducir:
- violencia gráfica;
- sexualización;
- contenido sensible incidental;
- texto externo no auditado;
- imágenes de terceros fuera del contrato.

Visuales para infancia deben pasar child-safe igual que el copy.

---

# 16. ACCESIBILIDAD

Los visuales no sustituyen texto.

Mantener:
- nombre del estudio;
- descripción breve;
- teclado;
- foco;
- navegación;
- alt/aria cuando proceda;
- reduced motion;
- forced colors;
- 320 px;
- zoom/reflow.

Si la mini-escena es decorativa y el texto ya transmite todo:
`aria-hidden=true`.

Si comunica información no presente:
alternativa accesible real.

---

# 17. PERFORMANCE

No convertir Home en 27 renders pesados simultáneos.

Home:
- SVG/imagen optimizada;
- lazy para secundarios cuando proceda;
- sin 27 WebGL contexts.

Interiores:
- motor propio según estudio.

Medir:
- peso Home;
- LCP;
- CLS;
- memoria;
- móvil.

---

# 18. QA HOME

Revisar 27/27 tarjetas.

Por tarjeta:
- `ICON_ONLY = false`;
- lectura del estudio sin texto;
- atractivo;
- actividad;
- diferenciación;
- etapa.

Entregar matriz:
- study_id;
- visual_before;
- visual_after;
- elements;
- why_it_represents_the_studio;
- child_variant;
- status.

---

# 19. QA INTERIORES

Revisar 27/27.

Por interior:
- hero/starter;
- primera acción;
- imagen/escena;
- infancia;
- adolescencia;
- adultez;
- móvil.

No basta con demostrar que el motor funciona.

---

# 20. CAPTURAS OBLIGATORIAS

## Home
ES/EN:
- 1440×900;
- 1920×1080;
- 390×844;
- 320×800.

Además:
- Infancia seleccionada;
- Adolescencia;
- Adultez;
- General.

## Interiores

Mínimo evidencia visual explícita de:
- Dibujo;
- Estructuras;
- Código;
- Música/Ritmo;
- Robótica;
- 3D;
- Mundos;
- Papiroflexia;
- un estudio de historia/escritura.

Y coverage matrix 27/27.

---

# 21. GATE ASTRA / HUMAN QA

FAIL si María/Astra detectan:
- “dos líneas y ya”;
- icono ampliado;
- placeholder;
- tarjetas técnicamente distintas pero visualmente iguales;
- infancia con estética técnica;
- interiores vacíos;
- atractivo solo en la Home y legacy/minimalismo dentro.

PASS exige:
- Home atractiva;
- interiores coherentes;
- diferencia real por estudio;
- infancia atendida visualmente;
- funcionalidad R47 intacta.

---

# 22. KEEP / REBUILD

## KEEP
- motores R47;
- 27 estudios;
- engines;
- storage/privacidad;
- child-safe;
- R02;
- ES/EN;
- workspace architecture;
- exportaciones;
- tests funcionales válidos.

## REBUILD
- arte Home;
- hero/starter visual interior;
- composiciones demasiado esquemáticas;
- variantes visuales de infancia cuando hagan falta.

No reescribir motores por esta orden.

---

# 23. ENTREGA

Claude entrega:
- branch;
- base HEAD/tree;
- final HEAD/tree;
- diff;
- 27/27 visual matrix;
- Home before/after;
- interiors before/after;
- assets nuevos;
- peso/performance;
- child-safe visual audit;
- ES/EN;
- desktop/móvil;
- Memoria/Control.

Marcador:

`R54_CLAUDE_TALLER_HOME_INTERIORS_VISUAL_READY_FOR_ASTRA`

Después:
Claude → Astra → A2 → preview → María HUMAN QA.

No main.
No producción.
No deploy propio.
No reescribir motores R47.
