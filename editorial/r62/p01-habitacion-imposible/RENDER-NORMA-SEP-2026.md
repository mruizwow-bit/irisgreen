# P01 · re-render bajo `IRIS_GREEN_VISUAL_STANDARD_SEP_2026`

**Fecha:** 28/09/2026
**Mecánica:** sin cambios. El §16 sólo reabre la calidad visual, y la geometría
es la misma que aprobó Astra en la R2.
**Entregable:** `gameplay-compuesta.svg` (raster + vector, autocontenida),
`render-gameplay.png` / `.webp`, generador `scripts/r62_p01_render.py`.

---

## Lo que cambió, y por qué es un cambio de técnica y no de mano

En P01 R2 y en P02 dije dos veces que el SVG vectorial tocaba techo: sin
materia, sin microdetalle, sin atmósfera. El §2 de la norma zanja la duda —«la
técnica se elige para alcanzar el resultado, no al revés»— y el §5 autoriza
pre-render y procedimientos first-party. Así que P01 ya no se dibuja: **se
renderiza**.

`scripts/r62_p01_render.py` es un rasterizador diferido en numpy:

| | |
| --- | --- |
| Geometría | Cada cara es un paralelogramo en pantalla, porque la proyección axonométrica de un rectángulo alineado lo es. Invirtiendo un sistema 2×2 sale la posición exacta en el mundo de cada píxel, y de ahí albedo, normal, profundidad y material sin aproximar |
| Texturas | fBm procedural propio, muestreado por coordenadas de mundo con proyección triplanar: el grano cruza las aristas en vez de cortarse. Dos escalas: variación de tono y grano fino |
| Piedra | Estratos por función del eje vertical deformada por el ruido, desgaste de canto, y bisel que inclina la normal cerca de la arista: la piedra deja de tener cantos matemáticos |
| Luz | Direccional con Lambert y especular Blinn-Phong según la rugosidad de cada material, más ambiente hemisférico: cielo frío arriba, rebote cálido del suelo abajo |
| Sombras | Marcha de rayo en espacio de pantalla contra el búfer de profundidad. Sombra de contacto y autosombra reales, no elipses dibujadas |
| Oclusión | Horizonte sobre el mismo búfer, doce direcciones |
| Acabado | Niebla por profundidad, bloom contenido, tonemap, gamma, grano y viñeta |

Determinista: semilla fija, sin reloj. El render sale idéntico cada vez.

**La capa de texto e interfaz sigue siendo vectorial**, encima del raster, como
permite el §5. El raster lleva la materia y la luz; el vector, los rótulos, el
recorrido, la cota y el selector. Así el texto queda nítido a cualquier tamaño
y es legible por lector de pantalla, en vez de quedar quemado en píxeles.

---

## Gate visual del §15 · mis respuestas

No me auto-apruebo: el §15 dice que un PASS visual exige revisión humana. Esto
es lo que yo veo, para que lo contrastes.

| # | Pregunta | |
| --- | --- | --- |
| 1 | ¿Parece terminado? | **A medias.** Los muros siguen siendo planos grandes con poca historia |
| 2 | ¿Materia real o formas planas? | **Sí**, por primera vez. Grano, estratos, desgaste de canto, bisel |
| 3 | ¿La luz construye volumen? | **Sí.** Clave direccional, ambiente hemisférico, AO y sombras proyectadas reales |
| 4 | ¿Hay profundidad? | **Sí**, aunque suave: la niebla es discreta a propósito para no lavar la escena |
| 5 | ¿La composición cuenta la acción? | **Sí.** Entrada, recorrido de latón que toca los dos vanos, cota del salto de 2,4 y selector de suelo |
| 6 | ¿Se siente propio de Iris Green? | **A medias.** La paleta y el silencio sí; falta un rasgo de identidad más allá del latón |
| 7 | ¿Al nivel de producto premium actual? | **No del todo.** Ver abajo |
| 8 | ¿Mantiene el nivel en móvil? | **Sí**, verificado a 390 px |
| 9 | ¿Respeta accesibilidad y rendimiento? | **Sí.** WebP de 32 KB, texto en vector y no rasterizado, mecánica intacta |
| 10 | ¿Comparado con el benchmark externo vigente? | **No.** No lo he hecho |

### Sobre la 7, que es la que importa

Lo que falta ya no es técnica, es contenido geométrico. El render hace bien su
trabajo, pero la escena es **seis cajas y dos muros**: no hay molduras, ni
juntas de sillería, ni rotura de silueta, ni variedad de perfil. Ninguna
cantidad de sombreado arregla que todo sea prismas rectos.

Lo bueno: eso ahora **sí se puede arreglar**, y antes no. Añadir zócalo,
despiece de sillar, arista rota y un par de perfiles no rectos es trabajo
dentro de este renderizador, no otro cambio de herramienta.

### Sobre la 10

No he comparado contra referencias externas: no tengo acceso a un benchmark
vigente ni encargo para fijarlo. El §3 lo pide antes de cada ola visual, así
que conviene que alguien fije cuál es la referencia contra la que medimos,
porque «premium 2026» sin referencia concreta es difícil de cerrar y fácil de
discutir eternamente.

---

## Mi lectura

Bajo el §15 esto sigue siendo `VISUAL_REWORK_REQUIRED` por la pregunta 7 —y
no voy a decir lo contrario para cerrar antes—. Pero el techo que bloqueaba las
dos entregas anteriores ya no está: hay materia, luz y sombra de verdad, y lo
que queda es enriquecer la geometría.

Lo que propongo, en este orden:

1. Fijar el benchmark externo (pregunta 10), porque sin él no se puede cerrar
   la 7 con criterio.
2. Enriquecer la geometría de P01 dentro de este renderizador.
3. Sólo entonces llevar el mismo renderizador a P02, que es el caso duro
   —vegetación, tierra, agua, cristal— y donde más se va a notar.
