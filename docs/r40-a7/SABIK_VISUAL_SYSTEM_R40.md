# R40-A7 · sistema visual R40 · Sabik Glass, Taller e Intereses

## 1. Sabik Glass

Referencia actual:
- `sabik/iris-mount.css`: panel Sabik `rgba(255,255,255,.66)`, borde `#c8d8e5`, sombra contenida.
- `assets/site-v23.css`: gradiente estático lila→azul y blur de cabecera de 10 px.
- R37: masters exactos sin filtro, recolor ni deformación.

### Regla R40
**Glass es una superficie, no un efecto.**
- Fondo: `rgba(255,255,255,.70–.82)` sobre fondos claros/medios.
- Borde: `#c8d8e5` o token equivalente con contraste visible.
- Sombra: suave; no glow continuo.
- `backdrop-filter`: máximo recomendado **10–12 px** en una sola capa.
- No apilar glass sobre glass con blur.
- En paneles de lectura largos: preferir fondo sólido/semisólido sin blur.
- `prefers-reduced-transparency` cuando esté disponible, forced-colors o modo alto contraste: **blur 0** y superficie opaca.
- Gradiente de sitio: estático, sin animación, manteniendo familia lila/azul existente; el rosa queda para avisos.
- El texto nunca depende del fondo de escena para alcanzar contraste.

### Masters Sabik
- Reutilizar los cinco masters R37 exactos.
- 0 filtro, 0 hue-rotate, 0 mix-blend, 0 redraw.
- PRESENTE estático; ORIENTAR/TRANSICIÓN/PAUSA/CONFIRMAR según R37.
- Sin nuevos estados visuales para R40.
- Glass no toca los píxeles del master.

## 2. Rincón sobre escena clara/oscura
Controles de escena dentro de una **barra/superficie propia**, no texto suelto sobre vídeo/canvas.
- fondo de controles: claro opaco >=92% o oscuro opaco >=88%;
- texto normal >=4.5:1;
- iconos/bordes/foco >=3:1 respecto a colores adyacentes;
- foco 3 px visible, separado 2–3 px;
- botones >=44×44 px;
- “Silenciar”, “Solo imagen” y “Parar” siempre son texto, no icono sin nombre.

## 3. Taller · seis áreas, no 25 tarjetas

Portada:
- 6 `AreaTile` grandes en 2×3 escritorio / 1 columna móvil.
- Cada tile: título, una frase de objetivo, 1 ilustración/forma simple opcional, “Abrir área”.
- Ninguna tile contiene una lista de estudios completa.

Dentro de un área:
1. encabezado del área;
2. “Crear libremente” y “Elegir un reto” como dos acciones principales;
3. hasta **3 estudios destacados**;
4. “Ver todos los estudios del área” abre lista progresiva/tabla compacta;
5. buscador dentro del área, no 25 tarjetas simultáneas.

Componente `StudyRow` para lista completa:
- nombre;
- qué permite hacer;
- formato/medio;
- estado disponible;
- acción “Abrir”.
No glass por fila; superficie sólida sencilla.

## 4. Intereses · once grupos, no 72 tarjetas

Portada:
- pregunta “¿Qué te interesa?” / “What are you interested in?”;
- buscador;
- 11 `InterestGroupTile` grandes.
- Grupo abierto muestra 3–4 intereses destacados + “Ver todos”.

Lista completa del grupo:
- filas compactas, ordenables si A3 lo autoriza;
- filtros en “Más opciones”;
- no mosaico de 72 cards;
- cada interés mantiene: Explorar · Catálogo · Ver/Escuchar/Simular · Mi colección opcional · Crear en Taller · Fuentes.

## 5. Densidad y carga cognitiva
- máximo orientativo portada: 6 tiles Taller / 11 grupos Intereses;
- dentro de una vista: una acción primaria; acciones secundarias agrupadas;
- texto de apoyo corto, una idea principal por bloque;
- no badges decorativos múltiples;
- estados vacíos explican qué puede hacerse después;
- sin puntuaciones, rachas, rankings ni presión temporal.

## 6. Responsive
- >=1024: grid 2–3 columnas según superficie.
- 600–1023: 2 columnas cuando el ancho real lo permita.
- <600 / 320 CSS px: 1 columna.
- 200% texto / 400% zoom: sin superposición y sin pérdida de acciones.
- El número de opciones simultáneas baja con el ancho; nunca aumenta por compactación.
