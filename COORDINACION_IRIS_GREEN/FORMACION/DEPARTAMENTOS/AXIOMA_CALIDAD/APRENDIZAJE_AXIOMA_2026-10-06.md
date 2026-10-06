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
