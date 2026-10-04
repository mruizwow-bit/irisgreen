# CIFRA · ANÁLISIS DE ARQUITECTURA Y MONETIZACIÓN WEB R01

Fecha: 04/10/2026  
Base analizada: `main` @ `6b1bf4c753c05f007f9f9ad9e8e7bde4fbf1e86e`  
Estado: **PROPUESTA FINANCIERA / NO PRODUCT CHANGE**

## 1. Principio de monetización

La información esencial de Iris Green debe permanecer gratuita y accesible sin pago.

No se monetiza:
- entender una condición;
- entender una situación;
- información de vida diaria;
- derechos, ayudas y trámites;
- datos e investigación;
- información de seguridad;
- metodología, accesibilidad y privacidad.

Se monetiza el valor añadido de producto:
- herramientas prácticas avanzadas;
- bibliotecas extensas de recursos preparados;
- juegos;
- experiencias interactivas;
- creación y exportación;
- mantenimiento continuo de catálogos y mundos interactivos.

Regla:

`INFORMACIÓN = FREE`

`TOOLS / PLAY / DISCOVERY / CREATION = FREEMIUM + PREMIUM`

## 2. Distribución actual observada en main

### Información pública

El árbol actual contiene, entre otros:
- `es/neurodiversidad/condiciones/` — ~186 rutas indexadas;
- `es/situaciones/` — ~188 rutas indexadas;
- `es/biblioteca/` — ~49 rutas indexadas;
- `es/datos/` — ~50 rutas indexadas;
- `es/investigacion/`;
- `es/tramites/` + directorio de ayudas;
- `es/vivir-fuera/`;
- `es/videos/`;
- `es/cuestionarios/`;
- `es/libros/`;
- `es/metodologia/`;
- `es/lectura-accesible/`;
- `es/privacidad/`;
- `es/sobre-iris-green/`.

Esta capa debe seguir siendo gratuita.

### Recursos

`es/recursos/` agrupa actualmente:
- Juegos;
- Rutinas visuales;
- Rutinas imprimibles;
- Tarjeta Iris;
- Contar y pagar.

Datos internos:
- 297 juegos;
- 109 rutinas imprimibles;
- 13 packs;
- 9 temas de tarjetas;
- 292 pictogramas en 11 categorías para rutinas visuales.

### Taller

`es/taller/` tiene 28 estudios/herramientas publicados, entre ellos:
- dibujo;
- diseño gráfico;
- patrones;
- pixel art;
- color;
- fotografía;
- moda/textil;
- estructuras;
- arquitectura;
- modelado 3D;
- máquinas;
- circuitos;
- papiroflexia;
- simulaciones;
- ritmo;
- composición;
- síntesis de sonido;
- videomapping;
- programación;
- robótica;
- diseño de videojuegos;
- escritura;
- mundos;
- lenguas inventadas;
- juegos de mesa;
- ideas/inventos.

### “Tus intereses”

El nombre actual `Tus intereses` ya no describe bien el producto.

La arquitectura editorial histórica organiza el contenido en 11 macroáreas:
1. cielo y espacio;
2. Tierra;
3. seres vivos;
4. transporte y máquinas;
5. tecnología;
6. números, lógica y sistemas;
7. lenguas y escritura;
8. historia y cultura;
9. arte, música e imagen;
10. mundos, juegos y colecciones;
11. vida diaria.

El producto evolucionado debe denominarse:

**ÁREA DE DESCUBRIMIENTO**

Su propuesta no es “leer sobre un interés”, sino:
`EXPLORE → LOCATE → REVEAL`
mediante mapas, 3D, líneas temporales, simulaciones, clasificación, audio, colecciones y otras experiencias interactivas.

## 3. Arquitectura de navegación propuesta

### Inicio

### Información
Agrupar aquí:
- Condiciones;
- Situaciones;
- Vida diaria;
- Ayudas y trámites;
- Datos;
- Investigación;
- Vivir fuera;
- Vídeos;
- Cuestionarios.

Libros puede mantenerse como sección independiente si existe venta editorial separada.

### Área de Recursos
- Rutinas visuales;
- Rutinas imprimibles;
- Tarjeta Iris;
- herramientas prácticas.

Los Juegos dejan de estar subordinados a Recursos.

### Área de Juegos
Catálogo de 297 juegos + futuras incorporaciones.

### Área de Descubrimiento
Sustituye completamente el nombre “Tus intereses”.

### Área de Creación
Sustituye como navegación principal a “El taller”.
Dentro pueden mantenerse “estudios” y “taller” como lenguaje de experiencia.

### Espacio tranquilo
Mantener gratuito, sin paywall dentro de la experiencia.

### Sabik
Acceso persistente, no mezclarlo como categoría editorial.

### Footer
- Sobre Iris Green;
- Metodología;
- Accesibilidad;
- Privacidad;
- contacto.

## 4. Qué debe ser gratis

### Información
**100 % gratuita. Sin paywall. Sin necesidad de cuenta para leer.**

### Área de Recursos · FREE
Mantener gratis:
- Tarjeta Iris completa;
- constructor básico de rutina visual;
- acceso suficiente a pictogramas para crear una rutina funcional;
- selección de rutinas imprimibles esenciales;
- herramientas básicas de autonomía con función de apoyo.

No recomendar bloquear una necesidad básica de comunicación o regulación detrás de pago.

### Área de Juegos · FREE
- 30 juegos permanentes, repartidos por edades y categorías;
- `Contar y pagar` como herramienta práctica gratuita;
- sin temporizador artificial de “solo hoy”.

### Área de Descubrimiento · FREE
- portada y navegación completa;
- información factual y fichas;
- fuentes;
- galerías estáticas;
- una muestra interactiva útil en cada tema.

La persona nunca debe pagar para conocer un dato factual que Iris Green publica como conocimiento.

### Área de Creación · FREE
Mantener una muestra real de creación:
- Dibujo;
- Color;
- Ideas;
- Escritura;
- un quinto estudio básico rotatorio o representativo.

### Espacio tranquilo
**100 % gratuito.**
Sin upsell dentro de la experiencia.

## 5. Qué debe ser premium

### Recursos Plus
- biblioteca completa de 109 rutinas imprimibles;
- 13 packs completos;
- plantillas avanzadas;
- organización/guardado;
- formatos adicionales de exportación;
- nuevas colecciones.

### Juegos Plus
- catálogo completo de 297 juegos;
- futuras tandas;
- filtros y colecciones completas;
- favoritos/progreso si se implementan.

### Descubrimiento Plus
- experiencias interactivas completas;
- navegación profunda;
- mapas interactivos;
- 3D;
- líneas temporales;
- simulaciones;
- filtros;
- capas;
- colecciones;
- experiencias `EXPLORE → LOCATE → REVEAL`;
- futuras áreas completas.

La capa factual sigue gratuita.

### Creación Plus
- acceso a los 28 estudios;
- herramientas avanzadas;
- exportaciones avanzadas;
- proyectos;
- nuevas herramientas y ampliaciones.

## 6. Precios recomendados de lanzamiento

Los precios siguientes son PVP orientativos de consumidor. Lex/asesoría debe confirmar IVA, términos de renovación y tratamiento jurídico antes de producción.

| Producto | Mensual | Anual | Gratis |
|---|---:|---:|---|
| Información Iris Green | 0 € | 0 € | Todo |
| Recursos Plus | 2,99 € | 24,99 € | Core práctico |
| Juegos Plus | 3,99 € | 29,99 € | 30 juegos + Contar y pagar |
| Descubrimiento Plus | 4,99 € | 39,99 € | Información + muestra interactiva |
| Creación Plus | 4,99 € | 39,99 € | 5 estudios |
| **Iris Green Completo** | **7,99 €** | **59,99 €** | Incluye todo el free tier |

El pase completo debe ser el producto principal.

No recomendar vender cada juego, ficha, rutina o interacción por separado.

## 7. Por qué 7,99 €/mes y 59,99 €/año

Benchmarks revisados 04/10/2026:

- Twinkl España muestra acceso a un catálogo de más de 1.000.000 recursos y una oferta visible de 5,99 €/mes; su información de membresía también habla de planes mensuales desde 8,50 €/mes.
  https://www.twinkl.es/premium/choose

- ABCmouse:
  - 14,99 USD/mes;
  - 45 USD/año en su oferta web actual;
  - más de 13.000 actividades.
  https://www.abcmouse.com/learn/how-much-does-abcmouse-cost-subscription-plan-overview

- Lingokids Plus:
  - 13,49 USD/mes según help center;
  - campañas anuales han mostrado 5,99 USD/mes equivalente;
  - miles de actividades.
  https://help.lingokids.com/hc/es/articles/115005120505--En-qu%C3%A9-moneda-se-har%C3%A1-el-cobro

- Brilliant:
  - free tier limitado;
  - premium mensual y anual;
  - precio anual equivalente visible de 20 USD/mes en su página de suscripción.
  https://brilliant.org/subscribe/

Conclusión:
7,99 €/mes sitúa Iris Green por debajo de muchas plataformas interactivas de aprendizaje y suficientemente por encima del micropago como para sostener mantenimiento.

59,99 €/año equivale a ~5 €/mes y ofrece un descuento significativo frente a mensual.

## 8. Comisión de pago

Stripe España publica para tarjeta estándar del EEE:
`1,5 % + 0,25 €` por transacción.

Fuente:
https://stripe.com/es/pricing

Consecuencia:
evitar micropagos de 0,99–1,99 €, porque la parte fija de 0,25 € consume demasiado margen antes incluso de impuestos, soporte y costes operativos.

## 9. Precio fundador opcional

Solo si María quiere acelerar adopción inicial:

**Fundador completo: 49,99 €/año durante el primer año de alta.**

No convertirlo en precio permanente si la biblioteca sigue aumentando.

Precio estándar:
**59,99 €/año.**

## 10. Lo que NO recomiendo

- cobrar por artículos de condiciones;
- cobrar por ayudas/trámites;
- cobrar por información sobre derechos;
- cobrar por datos o fuentes;
- publicidad dirigida a niños;
- “vidas”, monedas virtuales o energía;
- compras impulsivas dentro de juegos;
- paywall a mitad de una actividad;
- 297 compras individuales;
- precio distinto por cada tema de Descubrimiento al lanzamiento;
- multiplicar planes hasta que nadie entienda qué compra.

## 11. Compra y child-safe UX

La persona menor debe poder usar las áreas sin presión comercial.

El paywall debe:
- aparecer en zona adulta;
- explicar claramente FREE vs PLUS;
- mostrar precio total y renovación;
- no usar cuenta atrás falsa;
- no amenazar con perder trabajo;
- no interrumpir una actividad ya iniciada;
- permitir volver a lo gratuito sin fricción.

Revisión previa a producción:
- Lex: consumidor, menores, privacidad, suscripción, renovación, desistimiento/digital content, impuestos junto a asesoría;
- Axioma: accesibilidad del pricing, checkout, paywall y estados bloqueados;
- Cifra: margen, costes, conversión, churn y cohortes;
- Brújula: comunicación y posicionamiento;
- Producto: free/premium boundaries.

## 12. Métricas para validar precio

Después del lanzamiento medir:
- free → paid conversion;
- monthly vs annual mix;
- churn mensual/anual;
- uso por área;
- coste de soporte;
- coste de infraestructura/IA;
- gross margin;
- refund rate;
- activation;
- qué área provoca la compra;
- qué área provoca cancelación;
- uso real del catálogo premium.

No cambiar precio por intuición antes de tener cohortes.

## 13. Veredicto de Cifra

La monetización puede hacerse sin convertir Iris Green en una web cerrada.

La frontera correcta es:

**CONOCIMIENTO, DERECHOS, SEGURIDAD Y APOYO BÁSICO = GRATIS**

**CATÁLOGOS EXTENSOS, JUEGO, HERRAMIENTAS AVANZADAS, CREACIÓN Y EXPERIENCIAS INTERACTIVAS = PREMIUM**

Nombre recomendado:
- `Tus intereses` → **Área de Descubrimiento**
- `Jugar` → **Área de Juegos**
- `Recursos` → **Área de Recursos**
- `El taller` → **Área de Creación**
- `Rincón tranquilo` → **Espacio tranquilo** (gratis)

Producto premium principal:
**Iris Green Completo · 7,99 €/mes o 59,99 €/año.**
