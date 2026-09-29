# R40-A7 · inventario audiovisual real del Rincón

Inventario hecho contra el HEAD A2 **observado** `bb1efb8608681b138e5ce8029a6d425eddcaed98`. Es referencia, no freeze.

## 1. Escenas actuales

| ID | Nombre ES / EN | Motor actual | Movimiento | Fallback visual actual | Miniatura |
|---|---|---|---|---|---|
| `sea` | Mar / Sea | WebGL `rincon-escenas-3d.js` | continuo tras clic | texto de incompatibilidad si no hay WebGL | `img/rincon-tranquilo/escenas/mar.webp` |
| `rain` | Lluvia en la ventana / Rain on the window | WebGL | continuo tras clic | texto de incompatibilidad | `lluvia-ventana.webp` |
| `river` | Río en el bosque / Stream in the forest | WebGL | continuo tras clic | texto de incompatibilidad | `rio-bosque.webp` |
| `night` | Cielo nocturno / Night sky | WebGL | continuo tras clic | texto de incompatibilidad | `cielo-nocturno.webp` |
| `aquarium` | Acuario / Aquarium | WebGL preferente + Canvas2D propio | continuo tras clic | Canvas2D `IGAquarium` | `acuario.webp` |
| `bubbles` | Tubo de burbujas / Bubble tube | WebGL preferente + Canvas2D | continuo tras clic | Canvas2D | `tubo-burbujas.webp` |
| `jellies` | Medusas / Jellyfish | WebGL | continuo tras clic | texto de incompatibilidad | `medusas.webp` |
| `fibre` | Fibra óptica / Fibre optics | WebGL | continuo tras clic | texto de incompatibilidad | `fibra-optica.webp` |

No hay vídeo de escena como dependencia actual. Las escenas son renderizadas por la propia web. Las ocho WebP son capturas/miniaturas de esas escenas, no sustitutos dinámicos.

## 2. Miniaturas reales inventariadas

| Archivo | Git blob | Tamaño |
|---|---:|---:|
| `acuario.webp` | `fd08c3b19db7b440c93fbb3ee9c9e6a8ddc9c076` | 14,928 B |
| `cielo-nocturno.webp` | `2b41864aaa436badbebff731a4f57f91c814b14a` | 1,998 B |
| `fibra-optica.webp` | `b9ab001bfc5ba12509eca0ce58cab106bd87df0a` | 11,624 B |
| `lluvia-ventana.webp` | `c70f9a2595edff9b25b6ea372e763aab51c37f44` | 4,354 B |
| `mar.webp` | `463920c9f748588e165fdb0f3f17d7098bf6b96d` | 4,732 B |
| `medusas.webp` | `6a0d363b04d92992186af4d433b59a58101dc65d` | 4,390 B |
| `rio-bosque.webp` | `07be861d80a8faec509021bf845399b01f064cb7` | 12,712 B |
| `tubo-burbujas.webp` | `1d4bd4372669ee08e0bb0c5e55aaf880bc761844` | 3,724 B |

Estado A7: **EXISTENTE_INTERNO / PROVENANCE_A4_PENDING**. A7 no las promueve a READY por licencia/procedencia; A4 decide el estado editorial/publicable.

## 3. Sonidos grabados presentes en `audio/rincon/`

| Archivo | Atribución visible actual | Git blob | Estado A7 |
|---|---|---|---|
| `lluvia-en-tienda.mp3` | enternalrainsounds · Pixabay | `313176f3bcc7977d3b85f96bfce87db7a1c21acc` | HOLD_A4_LICENSE |
| `lluvia-en-ventana.mp3` | Eryliaa · Pixabay | `d9362ca0c7f7c969d986580b03d00859353456c7` | HOLD_A4_LICENSE |
| `lluvia-habitacion.m4a` | CeleronBeats · Pixabay | `24adf4c42329ae8ba321230d144be1ca6970991d` | HOLD_A4_LICENSE |
| `rio-lento.mp3` | Nils_Vega · Pixabay | `f75882d40eab0d21b4bc2871de316393ef76d904` | HOLD_A4_LICENSE |
| `olas-suaves.mp3` | SoundsForYou · Pixabay | `48d26d34cec934768264663f96f4fa9fadb47fa6` | HOLD_A4_LICENSE |
| `bosque-y-viento.mp3` | freesound_community · Pixabay | `d167a6f62c502cf19654649a949e5277e02d5ad0` | HOLD_A4_LICENSE |
| `ambiente-largo.m4a` | Lachm · Pixabay | `8bdf58813af0b392485a07a58fd6914f03fe2362` | HOLD_A4_LICENSE |
| `meditacion-suave.m4a` | Verclub_Music · Pixabay | `6ec702e1467c090e12815a2cf3a48614442a04d6` | HOLD_A4_LICENSE |

El repositorio contiene nombre de autor/plataforma, pero A7 no encontró en el alcance revisado una matriz A4 final con URL de fuente, términos/licencia y fecha de verificación. Por eso **no se aprueban nuevos usos R40 todavía**.

## 4. Sonidos generados en la web

`assets/rincon-sonidos.js` genera audio con WebAudio. No son grabaciones.

Catálogo de escena actual:
- `escena-acuario`: zumbido/agua/burbujas sintéticos.
- `escena-burbujas`: burbujas sintéticas.
- `escena-medusas`: ambiente sintético + pads.
- `escena-fibra`: pads mínimos.
- `escena-mar`: olas sintetizadas.
- `escena-lluvia`: lluvia sintetizada sobre cristal.
- `escena-rio`: corriente sintética + pájaros/viento sintéticos.
- `escena-noche`: grillos/viento/pads sintéticos.

Regla R40: si se usan, el copy debe decir **sonido generado / creado en Iris Green**, nunca “grabación real”, “sonido real del lugar” ni equivalentes. Para paisajes realistas, priorizar grabación READY de A4 cuando exista; si no existe, mantener imagen sola o etiquetar inequívocamente el sonido generado.

## 5. Pulpos

No existe una escena `octopus`/pulpo en el inventario actual. Si se incorpora:
- paisaje submarino creíble;
- movimiento lento sin acercamientos súbitos;
- sonido = agua/ambiente submarino documentado o generado y etiquetado;
- **prohibido “canto de pulpo” o cualquier vocalización ficticia presentada como real**;
- asset visual/sonoro nuevo requiere A4 READY antes de integración.

## 6. Dependencias técnicas observadas
- `assets/rincon-calma.js`: activación, fallbacks, volumen, temporizadores, focus mode.
- `assets/rincon-acuario.js`: acuario Canvas2D first-party.
- `assets/rincon-escenas-3d.js`: motor WebGL de escenas.
- `assets/rincon-sonidos.js`: audio generado.
- `assets/rincon-calma.css`: miniaturas, controles, full screen, warm/brightness.
- `audio/rincon/sonidos.json`: índice de archivos grabados.

Ninguna de estas piezas se modifica en R40-A7 antes del freeze A2.
