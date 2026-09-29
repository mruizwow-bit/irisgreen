# R59 · Fósiles piloto R2 · revisión Astra · 29/09/2026

Estado: `R59_ASTRA_FOSSILS_R2_PRODUCT_PASS_QA_PROVENANCE_FIX_REQUIRED`

## Material revisado

- issue #323 y orden activa de construcción incremental;
- `FOSILES_R2_INFORME.md`;
- `FOSILES_PILOTO_R2_PARA_SUBIR.zip`;
- `FOSILES_R2_CAPTURAS.zip`;
- código `index.html`, `fosiles.js`, `datos.json`, tokens y generadores;
- 14 piezas AVIF inspeccionadas directamente;
- capturas 1440/390, ES/EN, LIGHT/DARK NAVY, cubierto/descubierto.

## Producto · PASS

Las ocho correcciones principales están materialmente resueltas:

1. 14 piezas específicas por especie, no cuatro iconos genéricos.
2. Alcance internacional declarado en copy.
3. ES/EN completo en interfaz y ficha visible.
4. contrato `data-ig-theme` y sin selector local de tema.
5. borde superior determinista; `Math.random()` retirado del runtime.
6. sedimento con variación espacial y escala de clastos más natural.
7. detección AVIF por decodificación real.
8. resize preserva excavación y móvil aumenta escala de piezas.

El arte ya no se lee como iconografía plana. Las 14 piezas tienen relieve, fractura/material y familias de forma diferenciadas. Es normal que piezas de la misma familia anatómica mantengan parecido (fémures o vértebras), pero ya no son la misma pieza genérica reutilizada.

## Visual / responsive

PASS de dirección:
- corte geológico reconocible;
- excavación visible;
- pieza descubierta claramente separada del sedimento;
- LIGHT/DARK NAVY coherentes;
- móvil 390 legible;
- controls fuera del stage;
- ficha inferior mantiene jerarquía;
- no estética infantil.

## Código / privacidad / accesibilidad

Verificado en paquete:
- 0 URL externas en HTML/JS/CSS del piloto;
- 0 localStorage/sessionStorage;
- 0 `Math.random()`;
- 0 `innerHTML` con datos;
- 0 `eval`;
- `data-ig-theme` presente y `data-ig-tema` ausente;
- `aria-live` + role=status;
- idioma del documento se actualiza.

## Performance

La transferencia inicial declarada queda por debajo del presupuesto de arte:
- 213,5 kB a 1440;
- 179,1 kB a 390.

No se acepta como hardware/performance PASS: el propio informe declara que no se mide en el contenedor. Esto es correcto y se conserva como pendiente de integración/preview.

## DOS BLOQUEOS DE ENTREGA, NO DE PRODUCTO

### QA-01 · arnés de capturas de hallazgos no selecciona la pieza indicada

En `qa/shots.py` la tabla de hallazgos incluye `(capa, idx, quien)`, pero `idx` nunca se usa.

Consecuencia comprobada:
- `18-hallazgo-trex-diente.png` no muestra T. rex como ficha activa; muestra Iguanodon.
- La imagen contiene varias piezas del estrato, pero el detalle inferior no corresponde al nombre del archivo.
- Por tanto esas cuatro capturas NO acreditan individualmente la asociación pieza ↔ especie que sus nombres afirman.

El producto sí contiene 14 AVIF distintas y Astra las ha inspeccionado directamente. No se ordena rehacer arte.

Corrección: el arnés debe seleccionar explícitamente el fósil/posición objetivo antes de la captura y comprobar nombre/id activo.

### GOV-01 · procedencia/autoridad de rama incompatible con coordinación vigente

El informe declara:
`Rama de trabajo: codex/r59-intereses-fase1`.

Pero la coordinación canónica vigente desde el 28/09 establece:
- `R59_AGENT_ACTIVE_CODEX_HOLD_UNTIL_2026_10_01`;
- ejecutor activo = Agente R59;
- Codex no ejecuta R59 antes del 01/10.

No se invalida el producto por el nombre de una rama, pero el handoff no puede quedar canónico hasta reconciliar quién ejecutó realmente esta R2 y por qué conserva prefijo `codex/`.

Debe quedar una sola procedencia:
- si lo ejecutó Agente R59 sobre una rama histórica llamada codex, documentarlo y renombrar/registrar la autoridad real;
- si lo ejecutó Codex, STOP y reconciliar con María/Astra antes de aceptar.

## Dictamen

Producto Fósiles R2: PASS de Astra en dirección y calidad.

No autorizar Minerales todavía hasta cerrar:
1. arnés de hallazgos;
2. procedencia/autoridad de la rama.

No hace falta otro rework visual general.

Marcador esperado:
`R59_FOSSILS_PILOT_R2_QA_PROVENANCE_FIXED_READY_FOR_ASTRA_MARIA`.

No A2. No main. No producción.
