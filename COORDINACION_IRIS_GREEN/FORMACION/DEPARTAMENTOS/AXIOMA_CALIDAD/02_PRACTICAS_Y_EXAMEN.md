# AXIOMA · PRÁCTICAS Y EXAMEN R01

Fecha: 30/09/2026
Estado:
`FOUNDATION_STUDIED_PRACTICE_PENDING`

Leer no equivale a dominar.

## Prácticas

1. **Clasificación normativa**  
   Clasificar ley, norma, Recommendation, Group Note, ACT Rule, Working Draft, Candidate Recommendation y política interna.  
   PASS: 100 % correcto y límites explícitos.

2. **Auditoría WCAG-EM**  
   Registrar alcance, WCAG/version/nivel, funcionalidades, tecnologías, muestra, pruebas, findings y límites.  
   PASS: otro evaluador puede repetir el proceso.

3. **Caso negativo de automatización**  
   Demostrar por qué cero incidencias axe no basta para declarar conformidad.  
   Incluir comprensión, alt contextual, interacción real, AT, cognitiva, muestra y contenido dinámico.

4. **Teclado y foco**  
   Recorrido, traps, retorno de foco, orden, visible/no oculto, widgets y teclas esperadas.

5. **Tecnologías de apoyo**  
   Matriz futura: NVDA + navegador compatible; VoiceOver + Safari; TalkBack + Chrome Android.  
   Registrar versión, plataforma y limitaciones.

6. **COGA**  
   Evaluar lenguaje, previsibilidad, memoria, ayuda, densidad, recuperación, consistencia y continuidad.  
   Separar hallazgos COGA de criterios WCAG.

7. **PDF/UA**  
   Versión PDF, estructura, tags, orden, idioma, tablas, imágenes, navegación y AT.  
   No confundir validación estructural con comprensión.

8. **EPUB**  
   EPUBCheck, navegación, estructura, idioma, imágenes, landmarks, metadata de accesibilidad, WCAG y conformance reporting.

9. **EN 301 549**  
   Construir `requisito → superficie → método → evidencia → estado`.  
   Separar V3.2.1 legal reference según fuente vigente de V4.1.1 technical target; Lex decide legal.

10. **Calidad de producto**  
    Construir criterios de calidad funcional, interacción/usabilidad, accesibilidad, fiabilidad y testabilidad.

11. **Braille**  
    Con AT/especialista adecuados, comprobar salida real de nombres, estructura y estados.  
    No introducir atributos especializados sin necesidad documentada.

12. **Regression gate**  
    `FAIL → FIX → RETEST → PASS`, conservando commit/artefacto, entorno, evidencia y criterio.

## Examen

1. ¿Qué diferencia hay entre ley, estándar, guía y borrador?
2. ¿Por qué cero errores automáticos no significa conformidad?
3. ¿Qué añade WCAG-EM y qué NO añade?
4. ¿Qué valor tienen ACT Rules?
5. ¿Cuándo usar ARIA y cuándo preferir HTML nativo?
6. ¿Qué necesidades cognitivas pueden quedar fuera de WCAG?
7. ¿Qué es WCAG2ICT y qué estatus tiene?
8. ¿Qué diferencia hay hoy entre EN 301 549 V4.1.1 y la referencia legal indicada por AccessibleEU?
9. ¿Qué decide Lex y qué decide Axioma?
10. ¿Qué prueba PDF/UA y qué no?
11. ¿Qué versión de EPUB Accessibility es Recommendation y cuál está en transición?
12. ¿Qué debe contener un PASS reproducible?
13. ¿Cómo se prueba teclado/foco?
14. ¿Qué debe declarar una prueba con lector de pantalla?
15. ¿Por qué braille no se resuelve añadiendo una “vista braille”?
16. ¿Cómo se evita que un estándar nuevo invalide incorrectamente un producto?
17. ¿Cómo se documenta un NA?
18. ¿Cómo se retesta una corrección?
19. ¿Qué evidencia necesita un claim público?
20. ¿Cuándo debe Axioma consultar a Lex, Astra o al especialista de implementación?

## Gate interno futuro

`AXIOMA_FOUNDATION_PASS_INTERNAL`

Solo usar cuando:
- foundation estudiada;
- prácticas realizadas;
- evidencia conservada;
- examen respondido;
- límites declarados.

No equivale a certificación externa.

## Prácticas añadidas · 06/10/2026

13. **Diseño de oráculos y contraejemplos**  
    Elegir cuatro tests existentes. Para cada uno: promesa, assertion real, punto ciego y contraejemplo que pase el test violando la promesa.  
    PASS: al menos dos oráculos mejorados detectan el defecto.

14. **Reflow interno**  
    Crear fixture con document.scrollWidth correcto pero clipping interno vertical/horizontal.  
    PASS: `REFLOW_INTERNAL_CLIP_ORACLE` falla el fixture defectuoso y pasa el corregido.

15. **Representación espacial**  
    Crear fixture con z lógico correcto pero sin cue visual de altura.  
    PASS: `SPATIAL_Z_VISIBILITY_ORACLE` distingue renderer plano/proyectado.

16. **Invariantes de interacción**  
    Definir y probar: target visible, target semántico, mensaje consistente, control con efecto y paridad modo/copy.  
    PASS: `TEST_INVARIANTS_BEFORE_SUCCESS_PATHS`.

17. **QA temporal/perceptual**  
    Comparar una animación que cambia muchos píxeles pero no se desplaza coherentemente con otra que sí mantiene trayectoria/pose.  
    PASS: explicar por qué el primer oráculo no prueba la promesa perceptual.

18. **Observables científicos**  
    Para tres assets: separar body context, observable feature y reveal fact; validar región/landmarks, registro local y perceptibilidad humana pendiente.  
    PASS: ninguna anotación se deriva automáticamente de una caja genérica.

19. **Primera tarea experta**  
    Ejecutar una superficie sin manual y registrar: intención, primera acción, consecuencia, confusión, recuperación y salida.  
    PASS: los blockers obvios se corrigen antes de HUMAN QA.

20. **Clasificación de evidencia/entregable**  
    Clasificar ejemplos como VISUAL_SPEC, STATIC_REVIEW, NAVIGABLE_PROTOTYPE, INTERACTIVE_RUNTIME o INTEGRATED_PRODUCT.  
    PASS: no promover evidencia de una clase a otra sin prueba.

## Preguntas añadidas al examen

21. ¿Qué es el oracle problem y por qué importa en QA de producto?
22. ¿Cómo puede un test real con input real usar un oráculo equivocado?
23. ¿Qué diferencia hay entre coverage y specificity?
24. ¿Qué diferencia hay entre estado lógico y representación perceptible?
25. ¿Qué debe probarse en una transición de cámara/animación además del estado final?
26. ¿Por qué un IoU global alto puede ocultar un fallo local importante?
27. ¿Qué diferencia hay entre body context, observable feature y reveal fact?
28. ¿Por qué un asset aprobado no valida automáticamente una anotación?
29. ¿Qué debe ocurrir antes de enviar una primera tarea a HUMAN QA?
30. ¿Qué diferencia existe entre un frame responsive y evidencia real de reflow runtime?
31. ¿Cómo se prueba que un control visible tiene un efecto real?
32. ¿Qué información debe preservar un overlay además de su apariencia?
33. ¿Qué riesgos aparecen al escalar una mecánica idéntica a 200+ objetos?
34. ¿Por qué una sola sesión de usuario no equivale a conformidad ni representatividad poblacional?
