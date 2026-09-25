# Análisis R02 · Taller, Intereses, Recursos/Juegos y Rincón tranquilo

Fecha: 25/09/2026.  
Estado: **ANALIZADO · SIN CAMBIOS DE PRODUCTO**.  
Base observada: PR #244 @ `82106c874f5e4b612cdb68292b3c3115e040fea6`.

## Dirección de María

- Todo este bloque debe ser intuitivo, rápido y fácil de usar.
- Taller debe evolucionar a una herramienta creativa mucho más avanzada, conservando los juegos existentes en su carril.
- Intereses debe desplegar el catálogo previsto de 72 intereses / 11 grupos sin convertirse en una pared de opciones.
- Recursos y Juegos deben facilitar encontrar qué usar según la necesidad.
- Rincón tranquilo: cada escena debe tener un paisaje sonoro coherente con lo que se ve. El sonido no empieza al cargar la página; la acción explícita de iniciar la escena puede iniciar visual + sonido, con control inmediato de volumen/silencio.
- Sistema visual común Sabik: degradados, cristal, foco y controles compartidos.

## Estado actual observado

### Taller
La portada actual contiene 8 estudios funcionales:
Dibujo, Diseño gráfico, Estructuras y puentes, Máquinas, Circuitos, Programación, Robótica, Ideas e inventos.

El problema principal no es falta de contenido sino arquitectura: los estudios aparecen como una cuadrícula plana. El catálogo objetivo define 25 estudios en 6 áreas.

### Intereses
La portada actual solo expone un grupo, “El cielo y el espacio”, con Cielo nocturno, Sistema Solar, Exoplanetas y Eclipses. El objetivo documental es 72 intereses / 11 grupos.

### Recursos
La portada actual mezcla como tarjetas primarias:
Juegos, Rutinas visuales, Rutinas imprimibles, Tarjeta Iris, Taller, Tus intereses y Rincón tranquilo.

Recomendación: Recursos debe concentrarse en herramientas prácticas. Taller, Intereses y Rincón pertenecen al grupo global “Explorar”; pueden mantenerse como enlaces secundarios, no como recursos del mismo nivel.

### Juegos
Hay 252 juegos. El catálogo ya incluye:
- búsqueda;
- 9 contextos + Todos;
- etapas Infancia / Adolescencia / Adultez / Cualquier edad;
- 5 tipos de juego: ordenar, elegir, clasificar, planificar, memoria;
- ES/EN;
- sin puntuación, sin prisa y sin autoplay.

La funcionalidad es buena; el problema de UX es mostrar demasiadas decisiones a la vez.

### Rincón tranquilo
Escenas actuales:
`sea`, `rain`, `river`, `night`, `aquarium`, `bubbles`, `jellies`, `fibre`.

La implementación ya posee síntesis específica por escena:
- aquarium → `escena-acuario`
- bubbles → `escena-burbujas`
- jellies → `escena-medusas`
- fibre → `escena-fibra`
- sea → `escena-mar`
- rain → `escena-lluvia`
- river → `escena-rio`
- night → `escena-noche`

Actualmente el paisaje sonoro exige activar aparte “Con sonido suave”. Esto añade una decisión extra y hace que una escena iniciada pueda sentirse incompleta.

## Arquitectura UX propuesta

### Entrada común “Explorar”
Tres destinos de alto nivel:
1. Tus intereses — aprender/explorar/coleccionar.
2. El Taller — crear/construir/programar.
3. Rincón tranquilo — mirar/escuchar/pausar.

Recursos queda separado como “usar una herramienta práctica”.

### Taller avanzado

No mostrar 25 estudios planos. Portada por 6 áreas:
- Imagen y diseño
- Construir e inventar
- Programar y robótica
- Música y sonido
- Palabras y mundos
- Ideas

Dentro de cada área aparecen sus estudios.

Cada estudio usa la misma estructura:
1. herramienta;
2. “Crear libremente”;
3. “Elegir un reto”;
4. niveles/restricciones opcionales;
5. proyecto local: guardar/abrir/exportar;
6. conexiones con Intereses.

Sin puntuación/ranking. Niveles son complejidad, no evaluación.

Los 8 estudios actuales se conservan y se profundizan; no se sustituyen para “hacer sitio” a los 17 restantes.

### Intereses

Portada: no 72 tarjetas.

- Buscador visible: “¿Qué te interesa?”
- 11 tarjetas de grupo.
- “Mi colección” si está activada.
- Cuaderno de Campo como experiencia propia.
- Dentro de un grupo: lista/cards del grupo + búsqueda local.
- Dentro de cada interés:
  - Explorar
  - Catálogo completo
  - Ver/escuchar/simular
  - Mi colección
  - Crear en el Taller
  - Fuentes y licencias

Experiencias pesadas 3D/datos se cargan solo al entrar al interés, no en la portada.

### Recursos

Portada práctica con 4 destinos principales:
- Juegos
- Rutinas visuales
- Rutinas imprimibles
- Tarjeta Iris / comunicación

Si se amplía Descargas visuales, puede convertirse en quinto destino.

Taller / Intereses / Rincón pasan a “También puedes explorar” o desaparecen de Recursos porque ya tienen acceso global.

### Juegos

No eliminar ninguno de los 252.

Vista inicial:
1. búsqueda grande;
2. “¿Para qué lo necesitas?” → 9 contextos con contador;
3. resultados.

“Más opciones” despliega etapa y tipo de juego. No presentar etapa + contexto + tipo simultáneamente al abrir.

Añadir:
- contador de resultados;
- quitar filtros;
- botón volver a todos;
- descripción breve y 2-3 pictogramas en cada resultado;
- mantener reducción de opciones ya prevista;
- no crear categorías clínicas.

### Rincón y sonido

Una escena debe sentirse como una unidad audiovisual cuando la persona decide iniciarla.

Flujo recomendado:
- botón claro “Ver y escuchar” / “Watch and listen”;
- esa acción explícita inicia escena + paisaje sonoro correspondiente a volumen bajo;
- controles visibles: sonido sí/no y volumen;
- alternativa “Solo imagen”;
- cambiar escena hace crossfade de 1–2 s entre paisajes;
- parar escena hace fade de imagen/sonido;
- temporizador sigue siendo opt-in.

Diseño de paisajes:
- Mar: ambiente marino/submarino suave; si la escena está en superficie, olas lentas. No mezclar sonidos que no correspondan a la perspectiva.
- Acuario: agua filtrada + burbuja suave; reducir el carácter mecánico del filtro.
- Tubo de burbujas: burbujas suaves, sin agudos bruscos.
- Medusas: ambiente submarino profundo + pad muy discreto; las medusas no reciben un sonido animal inventado.
- Fibra óptica: pad muy tenue, casi silencioso.
- Lluvia: lluvia en cristal sin truenos.
- Río: agua + aves lejanas + brisa, sin eventos repentinos.
- Noche: grillos + viento muy suave; evitar llamadas súbitas.
- Si se añade una escena de pulpos: usar paisaje submarino coherente, no inventar una vocalización de pulpo.

Mantener una sola fuente de audio activa y el generador local Web Audio existente; evita licencias y red.

## Sistema visual

Aplicar el sistema Sabik común:
- primario: degradado navy → azul → violeta;
- cristal claro con reflejo azul/violeta/turquesa;
- rosa solo para acentos/avisos;
- alto contraste elimina degradado/transparencia;
- no `backdrop-filter` masivo en grids largos.

## Rendimiento

- Portadas: solo imágenes estáticas optimizadas y metadatos.
- 3D, motores físicos, audio avanzado y datasets se importan al entrar en una experiencia.
- no cargar 72 experiencias/25 estudios al abrir portada;
- thumbnails con tamaños intrínsecos;
- no lazy-load del recurso LCP;
- lazy-load del resto;
- medir LCP/INP/CLS en preview.

## Orden recomendado de construcción

1. Capa UX común: navegación de Explorar, tokens Sabik, patrón de tarjetas/búsqueda/filtros.
2. Reorganizar Recursos/Juegos sin alterar datos.
3. Rincón audiovisual y pruebas humanas de sonido.
4. Taller: nueva portada 6 áreas y profundización de los 8 existentes.
5. Intereses: portada 11 grupos, búsqueda y arquitectura de interés.
6. Fase 0 del catálogo (colección/proyecto/componentes comunes).
7. Completar 25 estudios y 72 intereses por las fases del plan.

No lanzar 72/25 antes de tener la capa UX común.
