# R40-A1 · Matriz de aceptación R01

**Estado:** `QA_CONTRACT_READY_BASELINE_PENDING_A2_HANDOFF`  
**Autoridad:** #247 / #248 · 26/09/2026  
**Producto modificado por A1:** 0 archivos.  
**Baseline R40 de producto:** **NO FIJADO** hasta handoff/freeze explícito de A2.

## Regla de veredicto

Una fase R40 solo puede quedar **PASS** si todos sus gates aplicables —automáticos y humanos— pasan sobre el **mismo HEAD/tree exacto**. Un `PENDING_MANUAL`, `BLOCKED` o `FAIL` impide PASS. No se heredan PASS de R22/R23/R39 ni de otro SHA.

Este contrato es un criterio de aceptación del proyecto; **no certifica WCAG, EN 301 549, ISO, PDF/UA ni Lectura Fácil**.

## Matriz transversal

| Gate | Qué se comprueba | Automatizable | Revisión humana |
|---|---|---:|---:|
| G01 | Base/HEAD/tree/changed files y recheck final | Sí | No |
| G02 | ES/EN equivalentes; sin ES en EN | Parcial | Sí |
| G03 | Reflow 320 CSS px sin pérdida/solape | Sí | Sí |
| G04 | Zoom nativo 200% y 400% | No | **Sí** |
| G05 | Espaciado de texto: 1.5 / 2em / .12em / .16em | Sí | Sí |
| G06 | Teclado completo, sin trampas | Sí | Sí |
| G07 | Foco visible, no oculto, retorno correcto | Parcial | **Sí** |
| G08 | Colores forzados | Parcial | **Sí** |
| G09 | Reduced motion sin pérdida funcional | Sí | Sí |
| G10 | Controles R40 >=44×44 CSS px | **Sí** | Muestreo |
| G11 | Divulgación progresiva/carga cognitiva | Parcial | **Sí** |
| G12 | Loading/vacío/error recuperable | Sí | Sí |
| G13 | Navegación predecible/volver/cerrar | Parcial | **Sí** |
| G14 | Nada inicia solo | **Sí** | Sí |
| G15 | Audio: mute/volumen/solo imagen; transición calmada | Parcial | **Sí** |
| G16 | Colección/proyectos locales; borrado; no envío | Sí | Sí |
| G17 | Fuente/licencia/procedencia READY | No | **Sí** |
| G18 | Sin puntos/ranking/temporizador/presión | Sí | Sí |
| G19 | axe sin nuevas critical/serious del delta | Sí | No; suplementario |

## Casos mínimos por superficie

Cada fase debe ejecutar, como mínimo:

- ES · escritorio 1440 CSS px.
- EN · escritorio 1440 CSS px.
- ES · móvil mínimo 320 CSS px.
- EN · móvil mínimo 320 CSS px.
- Preferencias: default, `prefers-reduced-motion: reduce`, `forced-colors: active`.
- Teclado y puntero.
- Zoom nativo humano a 200% y 400% en una superficie representativa de cada patrón afectado.
- Espaciado de texto contractual en cada patrón afectado.

390/430/768 son recomendados como regresión adicional, no sustituyen 320.

## R40-P0 · Base común

PASS exige, además de G01–G19 aplicables:

1. Ficha común sin reemplazar cabecera/footer/panel Lectura de Iris.
2. Lista/tabla completa ordenable accesible.
3. Buscador accesible.
4. Filtros progresivos: opciones avanzadas no dominan la vista inicial.
5. Mi colección opcional.
6. Guardar/abrir proyecto conforme al contrato local de A5.
7. Visor con estados loading/vacío/error.
8. ES/EN equivalentes.
9. Ninguna segunda arquitectura paralela.

**Dependencias:** #249 arquitectura + #251 privacidad.

## R40-P1 · Recursos + Juegos

1. Recursos prioriza herramientas prácticas.
2. Taller/Intereses/Rincón aparecen con menor jerarquía como exploración.
3. Catálogo de Juegos vigente permanece accesible; no se elimina contenido silenciosamente.
4. Entrada: pregunta simple + buscador + **9 contextos primarios**.
5. Edad y tipo quedan en “Más opciones”/equivalente EN.
6. No puntos, ranking, límite de tiempo ni presión.

Conteo automatizable: 9 contextos primarios. El juicio de jerarquía/progresividad es humano.

## R40-P2 · Rincón audiovisual

1. Cero autoplay.
2. Activación audiovisual explícita en ES/EN.
3. Escena + audio aprobado comienzan solo tras esa acción.
4. Volumen inicial coincide con el token documentado por A7; A1 **no inventa un valor numérico**.
5. Controles visibles y operables: silenciar, volumen, solo imagen.
6. Cambio de escena sin sobresalto conforme a especificación A7.
7. Reduced motion no rompe controles ni oculta estado.
8. Cada escena tiene procedencia/licencia y alternativa textual.
9. No se presenta sonido ficticio como real.

**Dependencias:** #250 + #252.

## R40-P3 · Taller

1. Portada = **6 áreas** aprobadas, no 25 estudios simultáneos.
2. Estudios existentes siguen alcanzables.
3. Patrón por estudio: Crear libremente / Elegir reto · herramienta real · nivel opcional/reversible · ayuda · guardar/abrir · exportar · conexión a Intereses cuando corresponda.
4. “Más avanzado” = herramientas mejores; evitar proliferación de controles.
5. Sin puntuación/competición.

Conteo automatizable: 6 áreas. Carga cognitiva y claridad: revisión humana.

## R40-P4 · Tus intereses

1. Portada con buscador + **11 grupos** aprobados, no 72 tarjetas simultáneas.
2. Estructura por interés: Explorar · Catálogo completo · Ver/escuchar/simular · Mi colección opcional · Crear en Taller · Fuentes.
3. Cuaderno de Campo permanece dentro de Tus intereses.
4. Datos multimedia/factuales solo si A4 los marca READY.
5. ES/EN equivalentes.

Conteo automatizable: 11 grupos.

## R40-P5 · Conexiones

1. Enlaces explícitos Intereses↔Taller↔Cuaderno conservan contexto.
2. Hay retorno predecible.
3. Trenes/Aves/Astronomía y otras conexiones solo apuntan a contenido existente o READY; no se inventan hechos.
4. Navegación conserva idioma.
5. Colección/proyecto no se envía a Sabik/terceros al seguir una conexión.

## Evidencia de cierre de cada fase

Obligatorio:

- base SHA, HEAD, tree;
- archivos cambiados;
- comandos y resultados;
- capturas ES/EN a 1440 y 320;
- resultado G01–G19 aplicable;
- resultado de gates de la fase;
- fuentes/licencias afectadas;
- pendientes manuales con estado real;
- recheck final de HEAD/tree;
- aceptación de María antes de avanzar silenciosamente a la siguiente fase.

## Qué NO vale como PASS

- axe solo;
- mockup o fixture en lugar de navegador real cuando el gate exige navegador;
- page-scale en lugar de zoom nativo humano;
- captura aislada en lugar de teclado/foco;
- PASS histórico de otro HEAD;
- traducción incompleta;
- “funciona en desktop” para sustituir 320;
- transcripción de requisitos sin ejecutar QA;
- certificación global por pasar esta matriz.
