# PRISMA · ESTUDIO COMPARADO DEL CÓDIGO CLAUDE · 2026-10-05

## 0. Propósito, alcance y una limitación metodológica

Este estudio responde al encargo de María de **aprender, no buscar culpables**: entender qué consiguió Claude en Cielo, Peces y creación de webs; comparar esas decisiones con la formación de Prisma; distinguir qué ya sabía pero no aplicó, qué conocimiento debe practicar y qué decisiones de Claude tampoco conviene copiar.

No es un gate de producto ni una auditoría de Claude. No reabre las correcciones aceptadas de Cielo o Peces. No modifica `main`, producción ni Sabik.

### Limitación de independencia

Al localizar la orden de estudio en GitHub, esta sesión abrió también los informes previos de Nexo. Por tanto, no sería correcto presentar este texto como un estudio “ciego” respecto a Nexo.

Para recuperar rigor:
- las conclusiones que siguen se apoyan en **binarios primarios exactos**, código y pruebas ejecutadas por Prisma;
- indico explícitamente la ejecución propia;
- cuando una conclusión coincide con Nexo, no la presento como descubrimiento independiente;
- separo hechos de código, evidencia de autor, ejecución propia e hipótesis de producto.

## 1. Bases exactas estudiadas

| Base | SHA-256 verificado por Prisma | Uso |
|---|---|---|
| `CIELO_ORION_INTERACTIVO_R01(1).zip` | `2e036ce4c3e3984be09d2c0ba630470f2129be49738960ec070bffa756d0026c` | motor + interfaz Cielo |
| `descubrimiento-peces-R02_1_2_1.zip` | `a5a39e5d5de8369cfb0bf392dbeab6d20c66720128c094b5261517466f729717` | motor + interfaz Vida marina |
| `DESCUBRIMIENTO_AREA_NAVEGABLE_R01_1.zip` | `d0ef4877a09e892cf219afdb90089a44cad83b181544b2f70df7972c815b04e3` | web navegable Descubrimiento |
| `CLAUDE_DESIGN_JUEGOS_AREA_VISUAL_R01_3(1).zip` | `6dc3e7e94804357f85daaf538a65a27a1afbc60e0498f92ee492324db6fa2af5` | fuente de diseño / exportación portable |
| `PRISMA_CONSTRUCTION_PLAYABLE_R01.zip` | `e2370c5e6e71177412f66623077e8f66fc47b03b98985a40b6e89fb59b958b2a` | comparación con Construcción de Prisma |

Formación propia leída:
- `FORMACION/A8_PRISMA/APRENDIZAJE_PRISMA_2026-10-03.md`, blob `c33301da53b9937d30750b52dc758801d2e3e33f`.
- `FORMACION/A8_PRISMA/APRENDIZAJE_PRISMA_2026-10-04.md`, blob `266f66da5d3123a14e33e35e210e2212d3c02acd`.

### Ejecución propia realizada

1. SHA-256 de los cinco paquetes: verificados.
2. Cielo: ejecutado el probe geométrico sobre `config.js + datos-cielo.js + motor.js`.
   - 1440×558 / 390×574 / 320×386:
     - las tres estrellas objetivo son visibles al inicio;
     - no son examinables desde la retícula inicial;
     - sí son examinables al centrar cámara;
   - 27 inversiones pantalla→campo verificadas con error < 1e-12.
3. Peces: `pruebas/qa-funciones-node.js` ejecutado sobre la copia exacta.
   - 6/6 PASS: giro completo, 180°, mínimo sólo de dibujo, de-canto, perfiles NORMAL/REDUCED/NONE y onda por perfil.
4. Descubrimiento web: intenté ejecutar `tools/pruebas.py` con Chromium disponible; el harness de esta sesión bloquea por política administrativa tanto `file://` como localhost. No declaro browser PASS propio. La lectura de código sí es directa.
5. Juegos visual Claude: `tools/verificar_entrega.py` ejecutado: 16/16 comprobaciones correctas.
6. Construcción Prisma: código del ZIP exacto leído y contrastado con su `QA_BROWSER.json`.

---

# CAPÍTULO I · CIELO

## 2. Flujo real del código

Mapa:

`datos → aCampo() → construirCampo() → cámara → aPantalla() → dibujar / examinarRegion() → examinar() → revelar() → profundidad → retorno de foco`

### 2.1 Una sola geometría sirve al dibujo y a la decisión

En `js/motor.js`:
- `aCampo(x,y)` (línea 26) transforma la orientación base.
- `construirCampo(datos)` (línea 28) aplica esa transformación a estrellas y líneas y crea un índice por id.
- `aPantalla(punto,camara,ancho,alto)` (línea 111) convierte el mismo campo a pantalla.
- `examinarRegion(...)` (línea 159) decide si el patrón está dentro de la zona de examen usando esa misma proyección.

**Aprendizaje principal:** el sistema no posee una geometría para pintar y otra geometría “parecida” para acertar. Lo visible y lo seleccionable nacen de la misma transformación.

En Construcción Prisma, en cambio, el estado sí tenía `z`, pero `cellRect(x,y)` sólo proyectaba x/y. El motor podía tener razón sobre alturas y aun así la persona no veía un mundo alto.

### 2.2 La experiencia es una máquina de estados, no una serie de capturas

En `js/interfaz.js`:
- `examinar(origen)` (línea 190) cambia `observando → localizada`.
- `revelar()` (línea 219) cambia a `revelada`.
- el botón de revelar no sólo está oculto antes de tiempo: en `actualizar()` se vacía su `textContent` antes de localizar (línea 236), evitando anticipar la respuesta en el DOM.
- el panel de profundidad recuerda `ultimoFoco` y al cerrar vuelve a él si sigue visible/conectado (líneas 255, 271–273).

Esto materializa una idea que Prisma ya conocía: **estado, foco y semántica deben avanzar juntos**. La diferencia es que aquí están unidos en el código de la experiencia.

### 2.3 Cámara, selección y cancelación

`irA()` y `congelarCamara()` separan una transición planificada del estado visible. Examinar/revelar puede detener la cámara en el punto actual; no deja que una animación antigua siga mandando después de que la persona haya tomado otra decisión.

En puntero se usa captura y se limpia tanto en `pointerup` como `pointercancel` (líneas 592 y 609+).

Esto encaja con el principio de cancelabilidad y continuidad que debo practicar: un movimiento no es sólo “una animación”; tiene propietario, destino, interrupción y estado final.

### 2.4 El defecto histórico de la retícula también enseña

En esta base histórica `examinarRegion()` fija la zona de examen en el centro. Mi ejecución propia demuestra que el objetivo puede estar visible y, sin embargo, no ser examinable hasta mover la cámara al centro.

No lo convierto en defecto actual: María comunica una revisión corregida posterior.

La lección es otra: **una transformación coherente no garantiza una interacción natural**. Cámara y selección estaban demasiado acopladas. Si la intención es “señalar eso que estoy viendo”, desplazar todo el cielo hasta un centro fijo introduce traducción mental.

### Decisión de Claude que adoptaría en Cielo

**Una única cadena de transformación para dato → mundo → pantalla, reutilizada por render e hit testing.** También adoptaría la cancelación explícita de cámara y la conservación del foco según origen.

### Decisión que no copiaría

**Retícula central fija como selección universal.** Puede ser válida en un modo concreto, pero no debe sustituir una selección directa cuando el objeto ya está visible.

---

# CAPÍTULO II · PECES

## 3. Flujo real del código

Mapa:

`datos de animal → mundo mayor que viewport → posición/pose/onda → sprite deformado → haz/máscara → muestras transformadas → evaluador → candidato → examinar → ficha/profundidad`

Con puntero:

`pointerdown → decidir tap o drag → tap mueve luz / drag mueve cámara → pointerup|pointercancel → estado coherente`

### 3.1 Lo que se ve y lo que el motor considera “examinable” comparten geometría

En `app/motor.js`:
- `geometriaHaz()` (línea 30) define el cono/haz.
- `valorMascara()` (línea 43) devuelve cuánto ilumina ese haz un punto.
- `ondaY()` (línea 58) deforma el cuerpo.
- `evaluar()` (línea 356) toma muestras útiles del sprite, las transforma con giro y onda y mide cuántas quedan realmente iluminadas/visibles.

Ésta es una diferencia crítica respecto a mi Construcción: aquí **la regla no está sólo en variables**, sino que se deriva de la misma representación percibida. Si el pez se dobla o gira, el evaluador ve el pez doblado/girado.

### 3.2 Mundo y viewport son entidades distintas

`posicionMundo()` (línea 210) calcula la ruta del animal en un mundo mayor que la vista. La cámara no es “la escena”; es una ventana al mundo.

Eso permite que explorar tenga sentido espacial. Mi Construcción no tenía una cámara ni un mundo navegable: tenía una cuadrícula completa comprimida dentro del canvas. Por eso “moverse” era cambiar una celda, no recorrer un espacio.

### 3.3 Pose, tiempo y pausa

`pintar(ts)` (línea 269):
- usa timestamp de `requestAnimationFrame`;
- limita `dt`;
- conserva la pose cuando el reloj se pausa;
- reduce el pulso hacia DOM a unas pocas actualizaciones por segundo en vez de reconstruir interfaz a 60 fps.

`orientacion()` deriva la orientación de la velocidad del animal. `girarVisible()` aplica un mínimo sólo al dibujo sin corromper el valor interpolado. `deCanto()` evita examinar cuando el animal queda demasiado lateral.

El banco puro ejecutado por Prisma confirma esas invariantes 6/6.

### 3.4 El gesto distingue intención

En `app/interfaz.js`, `conectarEscena()`:
- captura el puntero;
- registra inicio;
- si se supera umbral, el gesto pasa a ser drag de cámara;
- si no se supera, se interpreta como toque/apuntado;
- `pointerup` y `pointercancel` comparten limpieza.

Eso evita que mover la cámara dispare accidentalmente otra acción.

Además existe teclado y botones equivalentes. La alternativa de puntero sin drag no debe confundirse con “hay teclado”: WCAG 2.2, SC 2.5.7, exige una alternativa de puntero simple para funcionalidad basada en arrastre; teclado y puntero se evalúan por separado.

Fuente primaria de referencia:
https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements

### 3.5 Cámara cancelable y foco por identidad

`detenerCamara()` (línea 399) y `irCamara()` (404) hacen explícita la propiedad temporal de la cámara.

Los diálogos guardan el elemento al que devolver foco; la interfaz conserva identidad por id en vez de depender de “el botón que estaba en la posición N”.

Esto importa porque la continuidad no es sólo visual. La persona debe poder pausar, examinar, volver y reconocer dónde estaba.

### Decisión de Claude que adoptaría en Peces

**Unificar representación y evaluación:** misma onda, giro y máscara para dibujar y para decidir si algo puede examinarse; además, separar tap y drag por intención y hacer la cámara cancelable.

### Decisión que no copiaría

No copiaría sin revisar `girar(actual,objetivo,k)` si `k` es un coeficiente fijo por frame. MDN advierte que el progreso por frame debe basarse en tiempo para no acelerarse en pantallas de alta frecuencia. Aquí la posición del mundo sí usa tiempo; la interpolación angular merece convertir esa práctica en delta-tiempo.

Fuente:
https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame

---

# CAPÍTULO III · CREACIÓN DE WEBS

## 4. Descubrimiento navegable: qué está realmente materializado

### 4.1 El canon vive dentro del entregable

`assets/css/app.css` contiene:
- `@font-face` local para Atkinson Hyperlegible y Newsreader (líneas 5–11);
- tokens visuales;
- tipografía con `clamp()` (líneas 129–131);
- grid 1→2→3 columnas con `minmax(0,1fr)` (161–163);
- foco visible;
- forced-colors.

La diferencia con mi runtime Construcción es verificable: `game.css` del ZIP Prisma usa `system-ui` y una paleta funcional propia. Yo había escrito que el arte era provisional, pero luego el producto fue elevado hasta HUMAN QA como si el mundo ya estuviera materializado. Ese salto de categoría fue un error de aplicación/coordinación.

### 4.2 Navegación real y estados honestos

En `assets/js/app.js`:
- el registro se usa para construir tarjetas y rutas;
- lo que no está disponible no se convierte en un enlace fingido;
- el estado vacío tiene salida real;
- el menú móvil usa `inert` + `aria-hidden`, foco inicial, Escape, bucle de foco de respaldo y retorno de foco.

La página de Cielo/Peces puede declarar que la experiencia todavía no está conectada. Eso es mejor que fabricar una acción que parece lista.

### 4.3 El coste: duplicar el registro

El paquete incluye el registro editable y también una copia embebida en JavaScript para garantizar funcionamiento `file://`.

Entiendo el motivo, pero no lo adoptaría como arquitectura permanente sin generación automática: dos fuentes manuales pueden divergir. La lección correcta no es “duplicar para offline”; es **tener una fuente canónica y una exportación reproducible**.

### Limitación de ejecución propia

Intenté ejecutar `tools/pruebas.py` con Chromium disponible. El entorno de esta sesión bloquea por política administrativa tanto navegación `file://` como localhost. No afirmo el browser PASS como ejecución propia. Sí leí el harness y el código exactos.

---

## 5. Claude Design Juegos: fuente editable, portable y verificador

Este paquete no es un runtime de juego; es un artefacto de diseño/exportación. Su valor está en la frontera de entrega.

### 5.1 Exportación explícita

`tools/exportar_portable.py`:
- parte del canvas editable;
- extrae HTML/CSS;
- sustituye ids `/_blob/...` de fuentes e imágenes por recursos locales;
- elimina dependencias del renderer/editor;
- aborta si queda una referencia `/_blob/` sin resolver.

Esto es una práctica que Prisma debe adoptar: **un archivo que se ve dentro del editor no es aún un entregable portable**. La exportación debe convertir dependencias implícitas en dependencias declaradas y verificables.

### 5.2 Verificador con alcance acotado

Ejecuté `tools/verificar_entrega.py`: 16/16 PASS.

Comprueba, entre otras cosas:
- imagen aprobada exacta;
- no activar funcionalidad comercial;
- no usar estado resuelto incorrecto;
- CSS de imagen `width:100%; height:auto`;
- canon NAVY;
- presencia de alt;
- ausencia de red/`/_blob/`;
- perfiles de color;
- hashes del manifest.

Pero varias aserciones son estructurales o leen evidencia ya producida. Por ejemplo, “hay alt” no demuestra que el alt sea bueno; una tabla de evidencia no equivale a re-render actual. El propio paquete no debe interpretarse como una web fluida sólo porque sea HTML.

### Decisión de Claude que adoptaría en Webs

**Contrato fuente editable → exportación portable → verificación de dependencias y hashes**, con fuentes/assets locales y error duro si queda una dependencia del editor.

### Decisión que no copiaría

No convertiría un frame 1440/390/320 de diseño en prueba de reflow/runtime. Tampoco mantendría dos registros de datos manuales sin un generador que garantice equivalencia.

---

# CAPÍTULO IV · CONSTRUCCIÓN DE PRISMA: QUÉ SABÍA, QUÉ HICE Y POR QUÉ NO BASTÓ

## 6. El código sí tiene lógica útil

En el ZIP exacto:
- `validatePlacement()` (línea 219) comprueba alcance, ocupación, recursos, apoyo y desbloqueos.
- `removeAtCursor()` (338) prueba el mundo sin la pieza, impide dejar dependencias inválidas y devuelve coste.
- `undo()` (302) restaura snapshot e inventario y evita dejar al personaje sin suelo.
- `movePlayer()` (404) impone tránsito.
- guardado local tiene fallback.
- controles DOM, teclado/touch y live region quedaron técnicamente cuidados.

No debo tirar estas capacidades por el rechazo de producto.

## 7. La altura existía en datos pero no en percepción

`cellRect(x,y)` (línea 648) transforma x/y. No proyecta z.

`drawPiece()` (769) ordena por z, pero pinta las piezas sobre la misma celda 2D. Las escaleras explicaban la altura con símbolos/texto. `drawPlayer()` (801) dibuja figura geométrica sin orientación corporal ni locomoción.

Resultado: yo validaba un mundo 3D lógico, pero la persona veía un tablero 2D.

**Lección:** una variable `z` no es altura percibida. Una regla de apoyo correcta no es una superficie visible. Un estado final correcto no demuestra que el recorrido sea comprensible.

## 8. El espacio de decisión era demasiado estrecho

`routeAt()` fija dos filas y C1–C5. `stairChallengeSlot()` fija dos slots. Incluso el “modo libre” se apoya en una parcela y reglas de fila.

Eso produce un solver de puzzle válido, pero no el pequeño mundo de construcción que María esperaba.

## 9. El puntero movía un cursor lógico, no una pieza del mundo

El listener `canvas.click` (línea 855) convierte píxel→celda y mueve cursor. Colocar sigue siendo una acción separada.

Eso puede ser accesible y correcto, pero no crea manipulación directa, preview bajo intención de puntero ni selección de una superficie visible. El coste cognitivo es traducir “quiero poner esto ahí” a “selecciono modo → desplazo cursor abstracto → ajusto z → confirmo”.

---

# CAPÍTULO V · COMPARACIÓN CON MI FORMACIÓN

## 10. No todo es formación nueva: hay brechas de aplicación

Mi formación del 03/10 ya decía:
- tokens y canon;
- fuente editable/exportación;
- contratos de assets;
- paridad ES/EN.

La del 04/10 ya decía:
- artefacto ≠ runtime;
- fidelidad al diseño;
- no fingir recuperación de un runtime desde imágenes;
- corregir fuente/generador canónico.

Por tanto sería incorrecto concluir “Prisma no sabía que artefacto y producto son distintos”. Lo sabía documentalmente.

La brecha demostrada fue: **no convertí ese conocimiento en un criterio de parada cuando mi propio runtime seguía siendo visualmente un prototipo técnico**.

## 11. Formación/práctica que sí falta demostrar

### A. Representación espacial y proyección
Debo poder construir explícitamente:
`world(x,y,z) → view/camera → screen(x,y)`
y su inversa/picking.

No basta con almacenar z. La altura debe cambiar posición aparente, oclusión, superficie seleccionable y locomoción.

### B. Hit testing coherente con representación
Lo que el usuario señala debe ser exactamente lo que el motor evalúa. Cielo y Peces muestran este patrón de forma clara.

### C. Tiempo, pose y propiedad de animaciones
- usar delta-tiempo;
- distinguir pose de reloj;
- definir qué pausa, qué continúa y qué se cancela;
- una cámara vieja no puede sobrescribir una decisión nueva.

### D. Arbitraje de gestos
Click/tap, drag, teclado y touch no son “eventos equivalentes” por defecto; representan intenciones distintas.

WCAG 2.2 2.5.7 recuerda además que una acción basada en drag necesita alternativa de puntero simple, no únicamente teclado:
https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements

### E. Diseño de oráculos de producto
Antes de escribir una aserción debo escribir la pregunta:
- “¿se entiende dónde apoyar?”
- “¿la altura se ve?”
- “¿el personaje parece recorrer el mundo?”
- “¿el primer gesto que intento funciona?”
- “¿construir abre decisiones nuevas?”

Después elijo evidencia que pueda falsar esa afirmación.

### F. Canon dentro del runtime
Fuentes, tokens, ritmo, escala y jerarquía no son decoración posterior. Si el runtime se presenta para HUMAN QA, debe materializar el lenguaje visual suficiente para juzgar el producto pretendido.

### G. Frontera diseño → exportación → runtime
Necesito definir para cada entregable si es:
- fuente editable;
- frame;
- portable;
- prototipo navegable;
- runtime;
- integración.

No volver a usar el éxito de una capa como prueba de otra.

---

# 12. Matriz pedida

| Principio conocido + fuente | Decisión implementada estudiada | Consecuencia para la persona | Brecha / formación / incertidumbre | Práctica |
|---|---|---|---|---|
| Artefacto ≠ runtime · Prisma 04/10 | Claude separa canvas editable y portable | el paquete puede salir del editor sin ids internos | brecha de aplicación Prisma | exportar un ejercicio desde fuente y abrirlo limpio |
| Tokens/canon · Prisma 03/10 | Descubrimiento carga fuentes locales y tokens | la experiencia conserva identidad visual | brecha de aplicación | usar canon real dentro del runtime, no sólo shell |
| Estado explícito | Cielo: observar→localizar→revelar | cada acción produce una etapa comprensible | conocido, mejor materialización | modelar estados junto a consecuencia visible |
| Misma geometría para ver/decidir | Cielo `aPantalla` + `examinarRegion`; Peces onda/máscara + `evaluar` | lo seleccionable coincide con lo visible | práctica nueva prioritaria | ejercicio de proyección + picking |
| Cancelación | Cielo/Peces cancelan cámara | una acción nueva no es anulada por animación vieja | práctica insuficiente | test de interrupción a mitad de transición |
| Foco como continuidad | Cielo/Peces/Desc web devuelven foco | volver no obliga a reorientarse | conocido | preservar foco por identidad en componentes recreados |
| Drag no único | Peces separa drag/tap + ofrece controles | explorar no exige una destreza única | conocido normativamente, práctica | diseñar tap directo + drag + botones + teclado |
| Tiempo | Peces usa timestamp/dt para mundo | ritmo más estable y pausa coherente | nueva práctica a consolidar | migrar interpolación angular a dt |
| Invariantes de reglas | Prisma `validatePlacement/remove/undo` | sistema consistente | fortaleza a conservar | desacoplar invariantes del renderer |
| z lógica | Prisma guarda z sin proyectarla | altura no se percibe | fallo de representación | dos alturas visibles + picking + recorrido |
| QA técnico | Prisma browser tests de rutas | demuestra que rutas terminan | oráculo demasiado estrecho para producto | añadir tareas perceptuales observables |
| Verificador estructural | Claude Juegos 16/16 | entrega reproducible | no equivale a producto | etiquetar alcance exacto de cada assertion |

---

# 13. Decisiones de Claude que adopto / evito

## Cielo
**Adopto:** una transformación común para datos, render e identificación; foco y cámara con continuidad explícita.  
**Evito copiar:** selección universal mediante retícula central fija.

## Peces
**Adopto:** misma deformación/iluminación para dibujo y evaluación; tap/drag diferenciados; cámara cancelable.  
**Evito copiar:** interpolación angular dependiente de incremento fijo por frame; la convertiría a tiempo.

## Webs
**Adopto:** fuente editable → exportación portable con dependencias locales y verificador que falla si quedan ids del editor.  
**Evito copiar:** duplicación manual de registro y tratar frames fijos como prueba de una web fluida.

---

# 14. Criterio nuevo de salida de Prisma antes de HUMAN QA

No sustituye a Axioma ni a María. Es un filtro propio para no trasladarles carencias evidentes.

Antes de decir “listo para que María pruebe”, Prisma debe poder responder con evidencia directa:

1. **Promesa:** ¿qué experiencia dije que estaba construyendo?
2. **Primer minuto:** ¿qué entiende una persona sin leer mis notas?
3. **Mundo:** ¿la estructura espacial prometida existe perceptualmente, no sólo en estado?
4. **Acción:** ¿el gesto principal actúa directamente sobre aquello que la persona ve?
5. **Consecuencia:** ¿cada acción cambia algo visible y abre/cierra una decisión?
6. **Personaje/cámara:** si son parte de la promesa, ¿se comportan como parte del mundo y no como marcadores?
7. **Canon:** ¿el runtime materializa la identidad mínima necesaria?
8. **Accesibilidad:** ¿las alternativas mantienen la misma intención, no sólo la misma variable?
9. **Prueba técnica:** ¿mis asserts detectan el defecto que dicen detectar?
10. **Prueba de producto:** ¿he recorrido el ejecutable exacto como usuario antes de enviarlo?

Un PASS técnico se conserva como PASS técnico. Nunca vuelve a expandirse semánticamente hasta “buen producto” sin evidencia.

---

# 15. Referencias externas de estudio

- W3C WAI · Developing a Keyboard Interface:
  https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
- W3C WCAG 2.2 · Understanding Dragging Movements:
  https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements
- W3C WCAG 2.2 · Understanding Pointer Cancellation:
  https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html
- MDN · requestAnimationFrame:
  https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame

Estas referencias apoyan la práctica técnica; no convierten este estudio en certificación de conformidad.

---

# 16. Resultado del estudio

Mi conclusión no es “Claude sabe y Prisma no”. Tampoco es “nos faltaba un framework”.

La diferencia más importante es esta:

> **Claude, en los mejores ejemplos estudiados, hace que la regla, la geometría, la señal visual y la acción de la persona compartan el mismo modelo. Prisma demostró reglas sólidas, pero en Construcción dejó que el modelo lógico y el mundo percibido fueran dos cosas distintas.**

Parte del conocimiento ya estaba en mi formación. El fallo fue no usarlo como criterio de diseño y de parada.

Lo que debía demostrar no era que podía repetir esta frase, sino transferirla. Los dos ejercicios ya están ejecutados y documentados en `EJERCICIOS_PRISMA/RESULTADOS.md`.

### Transferencia demostrada

1. **Dos alturas + pieza + personaje + picking directo**
   - proyección e inversa: 3/3 muestras, error máximo 0;
   - picking usa los mismos polígonos proyectados que el dibujo;
   - preview de rampa con orientación/apoyo;
   - colocación;
   - recorrido bajo → rampa → alto;
   - personaje final en `{x:4,y:0,z:1}`.

2. **Catálogo fluido desde frame**
   - una única fuente de datos;
   - canon/fuentes locales;
   - rutas reales y retorno;
   - estado vacío recuperable;
   - 320/390/1440 + texto 200 % sin overflow;
   - primer intento falló a 320/200 %, se diagnosticó min-content/flex y se corrigió;
   - exportación portable desde fuente;
   - ZIP extraído por `file://`, fuentes locales cargadas y 0 errores.

Gate de aprendizaje:
`PRISMA_CLAUDE_STUDY_TRANSFER_EXERCISES_PASS`

Estado:
`PRISMA_STUDY_AND_TRANSFER_COMPLETE`

`NO MAIN · NO PRODUCCIÓN · NO SABIK`
