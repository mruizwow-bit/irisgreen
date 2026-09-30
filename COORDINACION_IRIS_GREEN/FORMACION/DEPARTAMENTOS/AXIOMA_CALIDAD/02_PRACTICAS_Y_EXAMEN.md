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
