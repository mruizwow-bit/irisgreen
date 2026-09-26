# Addendum normativo operativo · R40 Rincón R03 · audio y UX
Fecha: 26/09/2026

Este addendum complementa `REQUISITOS_OPERATIVOS_ES_EN.md`. No sustituye ni reescribe el histórico. Se aplica al Rincón tranquilo y a cualquier superficie futura que reutilice su patrón audiovisual.

## 1. Principio de baja estimulación sonora

Un sonido no se considera apto solo porque técnicamente reproduzca audio o porque su nombre coincida con una categoría. Debe evaluarse también su adecuación perceptiva para una experiencia de calma.

Requisitos:
- volumen inicial bajo y control visible;
- ausencia de autoplay;
- sin picos repentinos, sobresaltos, ataques metálicos o cambios bruscos;
- evitar hiss áspero, silbidos dominantes, graves fatigosos y repetición irritante;
- identidad sonora propia por ambiente; no usar una cama genérica de viento/ruido/pad para simular ambientes distintos;
- escucha prolongada razonablemente estable;
- no afirmar que un sonido sintetizado es una grabación real;
- no inventar vocalizaciones animales o fenómenos inexistentes.

La aceptación requiere escucha humana en la preview web. Un test estático no acredita calidad perceptiva.

## 2. Procedencia y publicación de audio

Todo audio o sample:
- será first-party/local, o tendrá licencia demostrada por archivo;
- conservará autoría/atribución cuando proceda;
- indicará si es grabación, síntesis o ambiente creado;
- no se publicará si su procedencia/licencia está en HOLD.

La síntesis Web Audio first-party es válida si su representación no induce a error sobre la naturaleza del sonido.

## 3. Arquitectura cognitiva del Rincón

La herramienta principal debe ser accesible al comienzo de la página. No se considera adecuada una interfaz que, al abrir opciones, vaya acumulando secciones y obligue a desplazarse hasta el final.

Patrón obligatorio:
- selector superior único para Vídeos / Sonidos / Bola de relajación;
- una sola región principal activa;
- cambiar de opción reemplaza el contenido en esa región;
- la ayuda, fuentes y explicación secundaria quedan después;
- mismo modelo mental en escritorio y móvil;
- en móvil se permite un selector desplegable accesible si reduce carga;
- estado seleccionado comunicado por texto/semántica, no solo color;
- foco y navegación por teclado previsibles.

## 4. Medios y movimiento

- nada empieza solo;
- Ver y escuchar requiere acción explícita;
- Silenciar, Volumen, Solo imagen y Parar permanecen disponibles;
- cambios de escena con transición suave;
- reduced motion elimina o reduce movimiento no esencial;
- sin flashes;
- fallback sin WebGL debe mantener información y control, no sustituir silenciosamente la escena por otra;
- el contenido principal debe seguir siendo utilizable a 320 px, zoom/reflow y con forced-colors.

## 5. Calidad visual

Las escenas deben evitar una estética arcaica, infantil o de salvapantallas cuando el objetivo sea una experiencia realista. Se exigen, cuando sean pertinentes:
- profundidad y escala coherentes;
- iluminación y reflejos consistentes;
- transparencia/refracción plausibles;
- movimiento orgánico o físico creíble;
- versión ligera para equipos modestos sin perder estructura ni accesibilidad.

## 6. Bilingüismo

Toda etiqueta, ayuda, estado, error, nombre accesible y control público del Rincón existe en ES y EN con comportamiento equivalente.

## 7. Evidencia y aceptación

El flujo de aceptación es:
construcción A7 → integración/subida A2 → prueba en preview web → corrección → reintegración A2 → revalidación.

Pruebas locales y CI sirven para detectar fallos, pero no sustituyen:
- escucha humana;
- revisión visual humana;
- móvil físico cuando aplique;
- lector de pantalla real cuando aplique;
- valoración de ausencia de sobresalto/fatiga.

No declarar PASS perceptivo sin esa evidencia.
