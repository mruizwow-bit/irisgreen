# AXIOMA · ÁREA JUEGOS VISUAL R01_3 · REVIEW

Fecha: 05/10/2026

Gate:
`AXIOMA_GAMES_AREA_VISUAL_R01_3_READY_FOR_HUMAN_QA`

## Evidencia auditada

Paquete:
`CLAUDE_DESIGN_JUEGOS_AREA_VISUAL_R01_3.zip`

SHA-256:
`6dc3e7e94804357f85daaf538a65a27a1afbc60e0498f92ee492324db6fa2af5`

Verificación Axioma:
- ZIP real leído;
- sidecar SHA coincide;
- 75 archivos totales;
- 74/74 entradas de `HASHES.txt` verificadas;
- 73/73 hashes de `MANIFEST.json` verificados;
- `tools/verificar_entrega.py` → **16/16 PASS**;
- 18 PNG de revisión con ICC/sRGB según verificador.

Fuente integrada:
- F01 Construcción estado inicial;
- sin cruce resuelto;
- sin F05/F06;
- imagen completa;
- `width:100%; height:auto`;
- no se convierte en control.

Alt integrado:
`Vista del prototipo de construcción: dos orillas separadas por un canal, materiales en una orilla y una caja cerrada en la otra`.

## 1 · Jerarquía y orientación

**PASS**

J01 mantiene una lectura clara:
1. Iris Green / navegación;
2. breadcrumb;
3. H1 `Juegos`;
4. entradilla;
5. frame de prototipo;
6. `Elige por dónde entrar`;
7. accesos Para todos / Plus;
8. reserva Sabik;
9. pie.

En 1440:
- el contenido principal y los dos accesos quedan comprendidos en el primer viewport;
- la imagen aprobada está completa;
- la portada no compite con el CTA.

En 390:
- el primer CTA `Entrar` queda visible en el borde inferior del primer viewport;
- continuidad de scroll clara.

## 2 · 320 · CTA bajo el primer viewport

**PASS con observación para HUMAN QA**

En 320×568:
- `Elige por dónde entrar` sí aparece antes del fold;
- también aparece la parte superior de la primera tarjeta y su icono;
- el CTA textual `Entrar` queda por debajo del primer viewport.

Esto **no constituye por sí mismo un fallo de accesibilidad**:
- no existe requisito de que el CTA principal esté en el primer viewport;
- el contenido que continúa debajo queda señalado visualmente;
- la tarjeta completa está modelada como un enlace, no solo el rectángulo `Entrar`;
- el nombre accesible de ese enlace incluye:
  `Juegos para todos · Juegos completos disponibles para todo el mundo · Entrar`.

No ordeno rediseño.

### Punto de HUMAN QA María

Comprobar de forma natural:
- si al abrir 320 entiendes que debes seguir desplazándote;
- si encuentras `Entrar` sin buscarlo deliberadamente;
- si la imagen del prototipo roba demasiada atención frente a la acción de entrar.

Si María duda o no encuentra el acceso con facilidad, entonces sí se reabre únicamente la jerarquía vertical de J01_320.

Marcador:
`GAMES_J01_320_CTA_DISCOVERABILITY_HUMAN_CHECK`

## 3 · Targets / foco / estados

**PASS de especificación visual**

La hoja de componentes define:
- controles de 48 px;
- objetivo de proyecto >=44×44;
- separación mínima 8 px;
- foco de 3 px + separación;
- foco independiente de selected;
- no disponible con símbolo + texto;
- current page con texto/forma además del color.

S02 muestra:
- normal;
- hover;
- focus;
- selected;
- current + focus;
- unavailable;
- forced-colors.

Condición para implementación:
el estado visual de página actual debe acompañarse de `aria-current="page"`; el diseño ya lo especifica aunque la copia portable no debe tomarse como runtime final.

## 4 · Contraste

**PASS de diseño/tokens**

Pares documentados:
- texto principal / NAVY: 15.9:1;
- texto secundario / NAVY: 11.8:1;
- texto secundario / tarjeta: 9.0:1;
- enlaces / NAVY: 11.6:1;
- acento/foco / NAVY: 9.7:1;
- botón principal: 14.1:1;
- borde de control / botón: 5.7:1;
- borde sobre superficie secundaria: 3.6:1.

El separador `#2A4460` 1.8:1 está declarado como decorativo y no es único indicador.

No se infiere conformidad global a partir de esta tabla; estos pares de diseño no presentan blocker.

## 5 · Forced-colors

**PASS de especificación**

Definidos:
- Canvas / CanvasText;
- ButtonFace / ButtonText;
- LinkText;
- Highlight para foco;
- selected conserva borde + marca + palabra;
- unavailable conserva símbolo + texto.

No depende solo de color.

## 6 · NORMAL / REDUCED / NONE

**PASS de especificación**

Matriz entregada:
- menú NORMAL: fundido 150 ms;
- REDUCED: fundido sin desplazamiento;
- NONE: instantáneo;
- foco: instantáneo en todos;
- imagen del juego: fija;
- sin carrusel/video/audio;
- Sabik reservado estático.

Nada esencial depende del movimiento.

## 7 · Menú móvil

**PASS de diseño**

S01:
- botón Cerrar visible;
- página actual `Juegos · Estás aquí`;
- orden visual de las siete secciones;
- foco previsto entra en Cerrar;
- cierre devuelve foco a Menú;
- salida visible sin scroll.

## 8 · Imagen de Construcción

**PASS**

- estado F01 inicial;
- no comunica que el juego esté resuelto;
- no se presenta como botón;
- alt suficiente para el propósito de portada;
- copy `Vista del prototipo` evita presentar la imagen como experiencia ya disponible;
- la ficha mantiene `Jugar · no disponible todavía`.

El runtime jugable de Prisma sigue siendo otra línea de validación y no se mezcla con este gate.

## 9 · Reserva Sabik

**PASS de composición**

En 320/390/1440:
- queda después del contenido principal;
- no solapa CTAs;
- anotación magenta es evidencia de diseño, no copy de producto;
- no se rediseña núcleo/voz en esta entrega.

## 10 · Fuera del gate Axioma

Permanece fuera de esta revisión:
- decisión de negocio/acceso Para todos vs Plus;
- pagos/cuenta;
- condiciones legales;
- clasificación final del juego;
- implementación real de rutas;
- runtime del área Juegos;
- Sabik productivo.

## Resultado

No hay blocker de Axioma para presentar el diseño a María.

Gate:
`AXIOMA_GAMES_AREA_VISUAL_R01_3_READY_FOR_HUMAN_QA`

Siguiente:
`HUMAN QA MARÍA · especialmente J01 320 CTA discoverability`

No autoriza:
- merge a main;
- deploy;
- implementación automática.

`NO MAIN · NO PUBLIC DEPLOY`.
