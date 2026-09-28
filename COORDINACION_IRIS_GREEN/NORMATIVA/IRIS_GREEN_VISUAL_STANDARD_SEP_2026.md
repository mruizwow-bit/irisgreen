# IRIS GREEN · ESTÁNDAR VISUAL MÓVIL · SEPTIEMBRE 2026

**Estado:** `IRIS_GREEN_VISUAL_STANDARD_SEP_2026_ADOPTED_ROLLING`  
**Fecha de adopción:** 28/09/2026  
**Autoridad de producto:** María  
**Dirección / revisión:** Astra

## 1. Alcance

Esta norma se aplica a **todo Iris Green**, no solo a Juegos:

- Home;
- Taller;
- Juegos;
- Intereses;
- Rincón;
- Recursos;
- visualizaciones;
- mundos interactivos;
- tarjetas/escenas ricas;
- starters de herramientas;
- nuevas experiencias futuras.

Una aprobación visual anterior NO exime a una superficie de esta norma.

## 2. Principio central

Iris Green debe verse como un producto digital **premium y contemporáneo de 2026**.

No se exige fotorealismo ni una tecnología concreta.

Sí se exige que una experiencia visual importante tenga, cuando corresponda:

- materialidad;
- iluminación;
- profundidad;
- composición;
- atmósfera;
- microdetalle;
- variedad orgánica;
- sombras/oclusión coherentes;
- movimiento con intención;
- identidad propia;
- acabado de producto, no de prototipo.

Regla:

`PREMIUM_2026_QUALITY_OVER_RENDER_TECHNIQUE`

La técnica se elige para alcanzar el resultado, no al revés.

## 3. Benchmark móvil

Este estándar NO queda congelado para siempre.

La tecnología gráfica y la expectativa visual avanzan rápidamente.

Revisión obligatoria:
- antes de cada gran ola visual nueva;
- antes de escalar un concepto piloto a catálogo;
- y, como máximo, cada 8 semanas mientras haya trabajo visual activo.

Si el mercado/web permite una mejora material razonable sin romper accesibilidad, rendimiento o compatibilidad, el estándar se actualiza.

## 4. Referencia tecnológica de septiembre de 2026

El benchmark técnico externo demuestra que la iluminación, materiales, vegetación, reconstrucción de imagen y render en tiempo real han avanzado sustancialmente.

Iris Green NO intenta replicar un videojuego AAA.

Sí toma de ese nivel estos principios:
- luz que construye volumen;
- materiales diferenciados;
- geometría y superficies con imperfección;
- atmósfera;
- alta estabilidad visual;
- profundidad convincente;
- detalle suficiente para evitar aspecto plano o de maqueta.

En web, WebGPU puede aportar render avanzado, pero no es universal; debe existir fallback.

## 5. Técnicas permitidas

Según la experiencia:

- SVG rico;
- raster original;
- WebP/AVIF;
- Canvas 2D;
- 2.5D;
- WebGL;
- WebGPU cuando aporte y exista fallback;
- composición híbrida vector + raster;
- pre-render first-party;
- shaders propios;
- texturas/procedimientos first-party.

No existe una técnica obligatoria universal.

## 6. Materiales

Una superficie no puede quedar resuelta únicamente con un color plano si pretende representar materia.

Según corresponda:

### Piedra
- grano;
- veta/estrato;
- pequeñas irregularidades;
- desgaste;
- aristas no perfectas;
- respuesta desigual a luz.

### Tierra/sustrato
- granularidad;
- zonas de humedad;
- variación de tono;
- pequeñas partículas/irregularidades;
- transición de capas.

### Madera
- veta;
- variación longitudinal;
- bordes;
- desgaste;
- distinta respuesta especular.

### Metal
- reflexión controlada;
- rugosidad;
- marcas/uso cuando corresponda.

### Cristal
- borde;
- reflejo;
- transparencia;
- ligera distorsión/refracción cuando aporte;
- condensación/humedad solo con causa.

### Agua
- profundidad;
- borde húmedo;
- reflejo;
- transparencia;
- ondulación/caústica sutil cuando corresponda.

### Vegetación
- siluetas variadas;
- escala;
- orientación;
- translucidez;
- variación de hojas;
- nada de clonar la misma forma repetidamente como relleno.

## 7. Iluminación

La luz debe construir la escena.

Exigir, cuando corresponda:
- fuente de luz comprensible;
- sombras de contacto;
- oclusión;
- rebote;
- diferencia de exposición;
- separación de planos;
- volumetría/bruma solo si aporta.

No:
- iluminación uniforme de infografía;
- objetos "pegados" al fondo;
- sombras decorativas incoherentes.

## 8. Profundidad y composición

Una escena rica debe demostrar:
- primer plano;
- plano medio;
- fondo;
- solapamiento;
- escala;
- perspectiva;
- jerarquía;
- foco visual.

No llenar una escena con objetos para fingir riqueza.

La composición debe explicar qué se hace o qué ocurre.

## 9. Movimiento

Movimiento solo si tiene función.

Permitido:
- respuesta física suave;
- transición de estado;
- pequeñas variaciones ambientales;
- animación material.

No:
- partículas de relleno;
- rebotes;
- flashes;
- movimiento continuo innecesario;
- estímulo para "dar vida" sin función.

`prefers-reduced-motion` y preferencias Iris siguen siendo obligatorias.

## 10. Identidad entre productos

Todos los productos deben compartir **calidad**, no plantilla.

Ejemplo:
- Taller puede parecer banco de trabajo/estudio;
- Habitación imposible, arquitectura/puzle espacial;
- Terrario vivo, mundo orgánico húmedo;
- Rincón, espacio sensorial/museístico;
- Intereses, mundos temáticos.

No convertir Iris Green en un único renderer con skins.

## 11. Infancia

Infancia NO significa:
- cute;
- mascota;
- ojos;
- paleta bebé;
- cartoon por defecto.

Puede significar:
- menos densidad;
- menos decisiones simultáneas;
- objetos mayores;
- acciones más evidentes;
- menos abstracción;
- starter más guiado.

**Misma calidad visual.**

## 12. Responsive

La calidad no desaparece a 320–390 px.

Se permite:
- simplificar composición;
- ocultar detalle secundario;
- reducir densidad;
- cambiar disposición;
- servir assets más ligeros.

No se permite:
- convertir la escena en iconos;
- comprimir una composición desktop ilegible;
- sustituir arte por texto porque la pantalla es pequeña.

## 13. Accesibilidad

La calidad gráfica nunca puede romper:
- teclado;
- touch;
- drag no único;
- no color-only;
- forced-colors cuando aplique;
- reduced motion;
- targets adecuados;
- foco;
- zoom/reflow;
- lectura clara;
- no flashes.

## 14. Rendimiento

Premium NO significa pesado sin control.

Obligatorio según técnica:
- formatos modernos;
- srcset/densidad;
- lazy loading donde corresponda;
- LOD o simplificación;
- presupuestos de peso;
- no cargar escenas ocultas innecesariamente;
- fallback;
- profiling real.

WebGPU/WebGL no eximen de una ruta funcional para entornos donde no estén disponibles.

## 15. Gate visual

Los tests estructurales no aprueban arte.

Un PASS visual requiere revisión humana.

Preguntas mínimas:
1. ¿Parece terminado?
2. ¿Tiene materia real o formas planas?
3. ¿La luz construye volumen?
4. ¿Hay profundidad?
5. ¿La composición cuenta la acción?
6. ¿Se siente propio de Iris Green?
7. ¿Está al nivel de producto premium actual?
8. ¿Mantiene ese nivel en móvil?
9. ¿Respeta accesibilidad y rendimiento?
10. ¿Se ha comparado con el benchmark externo vigente?

Si alguna respuesta crítica es NO:
`VISUAL_REWORK_REQUIRED`

## 16. Implicaciones inmediatas

### Taller R54
El PASS visual 6/6 anterior se conserva como trabajo útil, pero **ya no es el techo definitivo**.

Antes de escalar 21 + 9:
- rebenchmarkear los 6 pilotos contra esta norma;
- subir los que queden por debajo;
- solo entonces congelar nuevo estándar y escalar.

La regla:
`THE_CARD_SHOWS_THE_WORKBENCH_NOT_THE_FINISHED_PRODUCT`
se mantiene.

### Juegos R62
P01 y P02 conservan sus mecánicas.

Se reabre únicamente la calidad visual:
- P01 Habitación imposible: mejorar materialidad, luz, microdetalle, atmósfera y acabado.
- P02 Terrario vivo: mejorar vegetación, tierra, agua, cristal, luz, profundidad y materialidad.

No P03 hasta fijar una referencia visual que pase esta norma.

## 17. Estado global

`IRIS_GREEN_VISUAL_STANDARD_SEP_2026_ADOPTED_ROLLING`

La norma se hereda en toda orden visual posterior.
