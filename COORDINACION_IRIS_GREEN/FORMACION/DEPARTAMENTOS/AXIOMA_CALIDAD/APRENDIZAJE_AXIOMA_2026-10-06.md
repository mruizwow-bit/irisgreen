# APRENDIZAJE_AXIOMA_2026-10-06

Fecha: 06/10/2026  
Rol: Axioma · Quality, Accessibility & Standards Lead  
Estado: `PRACTICE_ADVANCED__AT_AND_USER_EVIDENCE_PENDING`

## Regla profesional consolidada

`SOURCE → VERSION → STATUS → APPLICABILITY → REQUIREMENT → TEST → EVIDENCE → RESULT → RETEST`

No convertir:
- tests del autor en revisión independiente;
- porcentaje geométrico en perceptibilidad humana;
- asset-derived geometry en anatomía científica;
- fuente zoológica en validación del dibujo;
- guía APG/COGA en obligación WCAG;
- CI verde en conformidad global.

## Cielo R02 · aprendizaje

1. Coverage no equivale a specificity. Un motor puede encontrar las 88 y a la vez ser demasiado permisivo ante clicks ciegos.
2. Separar tolerancia motora CSS-px de evidencia semántica/astronómica.
3. La evidencia debe conservar semántica entre 320/390/1440: `SAME_SKY_EVIDENCE`.
4. Un mínimo fijo en píxeles puede alterar mucho la probabilidad de identificación en móvil.
5. Los tests deben comprobar valores, no sólo monotonía: una apertura angular puede bajar con zoom y seguir calculada incorrectamente.
6. Persistencia en memoria no equivale a persistencia durable: guardar cámara tras movimiento requiere escribir storage, no sólo recordar estado en RAM.
7. Async necesita request-id por operación, no sólo token por cambio de pantalla/campo.
8. Teclado/foco debe probar también transición entre pantallas, resize y destrucción/recreación de nodos.
9. COGA: no presentar simultáneamente cierre del hallazgo anterior y nueva tarea si aumenta carga/competencia atencional.
10. HUMAN QA sigue siendo necesario para jerarquía visual y metáforas de interacción.

## Vida marina R06/R06.1 · aprendizaje

### Separar representación, observación y hecho

Mantener capas distintas:
- `BODY_CONTEXT_THRESHOLD`: cuánto animal está disponible bajo la luz;
- `OBSERVABLE_FEATURE_THRESHOLD`: geometría/rasgo representado que puede observarse;
- `REVEAL_FACT`: hecho posterior que necesita fuente factual propia.

Una máscara o puntos derivados del asset son decisiones de representación. No prueban anatomía ni reconocimiento humano.

### Bloqueos

Un observable `bloqueado` no significa “sin requisito”.
Debe implicar:
- animal visible si el producto lo permite;
- identificación no disponible;
- 0 examinable por esa ruta;
- feedback coherente;
- no convertir ausencia de observable activo en PASS automático.

Estados distintos:
`exigido / bloqueado / configuracion-invalida / sin-requisito-deliberado`.

### Perceptibilidad

El batch perceptual debe:
- incluir frontera inferior/umbral/superior;
- mantener adversariales separados;
- no filtrar casos por el mismo criterio que se intenta evaluar;
- registrar tamaño aparente CSS, zoom, giro, viewport, DPR, iluminación y causa de no examinabilidad;
- conservar `humanVisibilityQA=PENDING` hasta revisión humana;
- no inventar `minimumApparentExtentPx` antes de calibración.

### Registro local

La correspondencia luz/oscuro debe medirse dentro del observable significativo, además del registro global.
Una cifra IoU global no demuestra que el rasgo local esté alineado.
Evitar wrap en traslaciones de imágenes salvo que esté explícitamente justificado.

### Movimiento

No reutilizar una variable de fase con unidades distintas.
Nombrar unidades explícitamente:
- `faseOndaCiclos`;
- `faseRecorridoRad`.

Verificar:
- continuidad instantánea;
- periodo real a 30/60/120 Hz;
- evolución a largo plazo;
- transición entre modos sin salto de posición ni pose.

### Selección por intención

La selección no debe ordenar continuamente por “cantidad iluminada” si contradice una señal deliberada de la persona.
Conservar:
- señalamiento explícito;
- distancia a geometría visible;
- histéresis documentada;
- estabilidad mientras el objetivo siga elegible;
- confirmación ligada al contexto, no a cuenta atrás arbitraria.

Si el producto real no puede producir dos candidatos simultáneos, el fixture de selección múltiple debe declararse como fixture y no presentarse como flujo real.

### Feedback accesible y estados

1. No usar `aria-disabled=true` para un botón que deliberadamente sigue siendo operable para explicar por qué aún no se puede completar la acción. WAI-ARIA define ese estado como deshabilitado/no operable.
2. Si un animal está bloqueado, “Encuadrar e iluminar” debe anunciar “identificación no disponible”, no “acerca la luz” cuando la luz ya está correctamente colocada.
3. Forward-compatible storage: si un guardado de versión futura se abre en solo lectura, la interfaz no puede anunciar “guardado” ni dejar el control en estado activado si no escribió.
4. Repetir una acción deliberada importante debe poder reanunciarse aunque el texto coincida con el anterior.
5. Native `<dialog>` + retorno de foco es buena dirección, pero AT real sigue pendiente.

### Fuentes por afirmación

Regla:
`CLAIM → TAXON_SCOPE → SOURCE → WHAT_SOURCE_SUPPORTS → WHAT_IT_DOES_NOT_SUPPORT → STATUS`.

Para Pez hacha, el catálogo identifica `Argyropelecus` a nivel género.
La afirmación sobre ojos tubulares orientados dorsalmente puede sostenerse a alcance de género con:
Biagioni, Hunt & Collin (2016), Frontiers in Ecology and Evolution, DOI 10.3389/fevo.2016.00025.
La fuente estudia Argyropelecus spp. y describe ojos tubulares dorsales.
Esto no valida que el asset dibuje anatómicamente bien los ojos.

## Reproducibilidad

Un paquete interno debe poder reproducirse desde sus propios bytes e instrucciones.

No afirmar “todos los scripts reciben la ruta real” cuando un script depende de una jerarquía externa/hardcoded.
Si necesita staging, declararlo o añadir argumento explícito.

Conservar:
`ARTIFACT_HASH → MANIFEST → COMMAND → EXPECTED_OUTPUT_HASH → RESULT`.

## Estado de práctica Axioma

Prácticas ejercitadas materialmente:
- clasificación estándar/guía/política;
- revisión manual de interacción;
- teclado/foco por código y evidencia;
- COGA separada de WCAG;
- regression gates;
- calidad funcional;
- validación de evidencia;
- provenance por claim;
- retest independiente parcial;
- revisión de outputs visuales y batches perceptuales.

Pendiente antes de `AXIOMA_FOUNDATION_PASS_INTERNAL`:
- NVDA real;
- VoiceOver real;
- TalkBack real;
- pruebas con personas;
- braille cuando aplique;
- examen interno completo;
- consolidación de matrices de estándares sobre una release final.

## Regla de continuidad

En Intereses:
`KEEP CORE → PATCH ACOTADO → RETEST INDEPENDIENTE → AXIOMA PRECHECK → HUMAN QA → ESCALA`.

No regenerar assets aprobados para corregir lógica, semántica o evidencia cuando el defecto no está en el asset.


## Addendum · R06.1 · retest browser real en IrisGreen

Entorno:
- dispositivo autorizado IrisGreen;
- Chrome real mediante Chrome DevTools Protocol;
- artifact público SHA-256 `8a96259b802176dd6e1aeb30b838586d5c36bd27be5ff83d160786e8a0a2fcc7`;
- artifact interno SHA-256 `07949fbc4d430187654e8791d5b716b6dbe97abc6dcbe110f269f15a368de441`.

### Regla nueva · oráculos no vacíos

`0 CASOS OBSERVADOS != IMPOSIBLE`.

Un test de histéresis, conflicto, error o ambigüedad no puede dar PASS porque la precondición no apareció.
Debe demostrar primero:
`PRECONDITION_REACHED > 0`
y después evaluar el comportamiento.

Separar siempre:
- estado alcanzable con datos reales de producto;
- fixture sintético declarado;
- ausencia de casos en una muestra;
- imposibilidad demostrada.

R06.1 contenía un PASS vacuo de histéresis con `pasos === 0 || ratio < 0.25`.
Nexo halló después un solape real. Axioma lo reprodujo en Chrome:
- hacha + linterna examinables simultáneamente;
- muestra independiente posterior: 537 posiciones con dos candidatos;
- 60 cambios de candidato;
- ratio 11,17 %.

Conclusión:
- el mecanismo de histéresis conserva buena dirección en esta sonda;
- el test original no demuestra nada y debe exigir `pasos > 0`;
- la afirmación “el producto no puede tener dos candidatos” queda retirada.

### Confirmación con conflicto real

En el solape real:
1. primer Enter informa que hay dos señales y cuál está elegida;
2. no revela identidad;
3. seis segundos después, segundo Enter sigue siendo válido;
4. identifica el elegido;
5. el foco pasa a `Ver de cerca`.

La confirmación contextual sin timeout arbitrario queda KEEP por evidencia de navegador real.
Los fixtures siguen siendo útiles para bordes sintéticos, pero no deben sustituir un caso real alcanzable cuando existe.

### Browser targeted PASS confirmado

Axioma reprodujo independientemente:
- periodos horizontales 31 / 24 / 38 s a 30, 60 y 120 Hz;
- transición de modo sin salto perceptible de posición/pose;
- calamar visible pero 0 examinable;
- selección explícita del hacha aunque otro cuerpo visible sea mucho mayor;
- storage de versión futura no sobrescribe bytes;
- texto 200 % sin overflow horizontal en 320/390/1440;
- controles visibles >=44 px en esa sonda;
- 0 excepciones Runtime y 0 errores de Log;
- diálogo nativo: foco inicial dentro y retorno al trigger.

Esto es un retest dirigido de Axioma, no una repetición del `29/29` del autor ni un PASS de AT.

### Findings reproducidos en browser

1. Calamar bloqueado:
   tras `Encuadrar e iluminar`, el estado anuncia genéricamente `Acerca la luz a una señal` aunque la acción acaba de centrar e iluminar.
   Debe explicar la causa real: identificación no disponible.

2. `aria-disabled=true`:
   `Examinar este animal` sigue ejecutando una acción/feedback mientras expone estado deshabilitado.
   Semántica y comportamiento deben coincidir.

3. Storage futuro:
   el checkbox puede quedar marcado en modo read-only;
   los bytes no se sobrescriben correctamente;
   pero la UI anuncia `Hallazgos guardados en este dispositivo`.
   Nunca anunciar éxito de escritura si no hubo escritura.

### Perceptibilidad humana

El umbral geométrico 50 % no se convierte en umbral perceptual.
En revisión visual preliminar, casos justo por debajo y justo por encima de 50 % pueden seguir mostrando el rasgo.
Para rasgos finos importa ancho/alto efectivo, no sólo diagonal.

Mantener:
`humanVisibilityQA=PENDING`
`minimumApparentExtentPx=null`

La HUMAN VISIBILITY QA debe estar separada de nombre/copy, incluir casos frontera/adversariales y no calibrarse sobre una clave/captura inconsistente.

### Escala

Antes de convertir R06.1 en plantilla de 200+:
- corregir los oráculos vacíos;
- usar selector estable por animal en QA;
- nombrar explícitamente periodo horizontal/vertical;
- conectar claims/sourceTrait/claimId;
- documentar que el hit-test por muestras es aproximación, no containment geométrico exacto;
- corregir la inconsistencia de clave/captura 065;
- cerrar feedback/ARIA/storage;
- ejecutar HUMAN VISIBILITY QA.

Regla:
`KEEP CORE → R06.1a PATCH → RETEST TÉCNICO → AXIOMA PRECHECK → HUMAN VISIBILITY QA → UMBRALES → MICROESCENA`.
