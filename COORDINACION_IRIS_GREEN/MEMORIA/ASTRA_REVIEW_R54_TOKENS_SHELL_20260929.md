# Astra review · R54 tokens + reconciliación shell · 29/09/2026

Fecha: 29/09/2026  
Autoridad de producto: María  
Revisión: Astra  
Issue: #318

## Estado

`R54_ASTRA_SHELL_MEASUREMENT_PASS_A2_RECONCILIATION_REQUIRED`

Esta revisión versiona el gate que hasta ahora solo estaba registrado en el issue.

## 1. R54 launcher · PASS acotado

KEEP:
- arte R54 6/6 ya aprobado;
- launcher sin paleta propia;
- consumo de tokens semánticos globales;
- eliminación de blanco puro como superficie extensa del launcher;
- LIGHT y DARK NAVY como dos temas globales;
- no combatir hardcodes globales con nuevos `!important` locales.

R54 no debe rehacer las seis tarjetas por este bloque.

## 2. Hallazgo de Claude sobre el shell · útil y aceptado como diagnóstico de su baseline

La medición A/B/C es útil:
- el shell legacy `assets/iris-brief-r08.css` fuerza fondos/chrome claros con `!important`;
- quitar solo ese override no basta;
- un sistema de tokens necesita una regla de consumo de página, no solo variables;
- aplicar una corrección global debe hacerse como operación atómica, no fichero por fichero.

La propuesta `PROPUESTA_iris-brief-r08.diff` se acepta como DONOR técnico, NO como patch listo para aplicar sin reconciliación.

## 3. Corrección de precedencia · una sola hoja global

A2 ya contiene:
`assets/ig-global-ui-tokens-2026.css`

Por tanto NO integrar una segunda fuente final llamada:
`assets/ig-tokens.css`.

La regla canónica sigue siendo:
**una sola hoja fuente global de tokens.**

A2 debe reconciliar en `ig-global-ui-tokens-2026.css` lo útil del patch R54:
- tokens/aliases que falten;
- sombras semánticas si se adoptan;
- contrato de página;
- soporte LIGHT/DARK NAVY;
- reglas de fallback necesarias.

Eliminar duplicidad antes de integración.

## 4. Tema inicial

Decisión de producto vigente:
**DARK NAVY es el estado inicial de la nueva Iris Green/Home.**

LIGHT es alternativa global.

No adoptar como default final:
`sin data-ig-theme => prefers-color-scheme`
si eso hace que una sesión nueva arranque LIGHT por preferencia del sistema.

Hasta que exista una decisión distinta:
- sesión nueva → DARK NAVY;
- cambio explícito → LIGHT/DARK NAVY para esa sesión;
- no persistencia nueva entre visitas.

## 5. Fondo de página · propietario global

Correcto incorporar un contrato global equivalente a:

```css
:root { background: var(--ig-bg-page); }
body  { background: var(--ig-bg-page); color: var(--ig-text); }
```

pero en la **única hoja canónica** y comprobando orden/especificidad reales.

No resolver cada sección con su propio fondo.

## 6. Degradado global antiguo · NO conservar como “arte de Sabik” en body

El degradado `--iris-light` aplicado al `body` completo NO se considera stage/arte de Sabik.

Sabik puede conservar arte/luz propios dentro de su componente.

El fondo global de página debe salir de:
`--ig-bg-page`.

Por tanto A2 debe retirar el gradiente global del body durante la migración, no mantenerlo como excepción visual del sitio completo.

Los assets/escenas pueden conservar su propia paleta según §6.

## 7. Propuesta iris-brief-r08.css · correcciones antes de aplicar

KEEP de la propuesta:
- mapear tinta/muted/line/glass a tokens;
- body/header/footer/cards/buttons/focus/borders a tokens;
- quitar `#fff!important` como contrato normal;
- mantener excepciones reales forced-colors/print.

REWORK:
- no conservar el gradiente global de body;
- eliminar el selector imposible/redundante `:root:not([data-ig-theme="dark"]) html ...`;
- usar la semántica de tema canónica de A2;
- no introducir una segunda hoja de tokens;
- probar contra HEAD vivo A2, no solo contra el baseline de Claude.

## 8. Medición A/B/C · no extrapolar al HEAD vivo sin repetir

Las cifras 30 / 22 / 10 son evidencia válida del baseline medido por Claude.

NO son gate actual de A2 porque A2 ha avanzado:
- Home v4 ya tiene reglas propias con tokens;
- existe `ig-global-ui-tokens-2026.css`;
- A2 está modificando shell/theme.

A2 debe repetir el mismo barrido sobre su HEAD vivo después de reparar la Home v4.

## 9. Scope A2

A2 es responsable de cerrar transversalmente:
1. reparar primero la Home v4 rota;
2. consolidar una sola hoja de tokens;
3. migrar `iris-brief-r08.css`;
4. aplicar contrato global de page background;
5. reconciliar Home, Recursos, Intereses, Taller y Rincón;
6. header vigente;
7. taxonomía vigente;
8. LIGHT/DARK NAVY en la misma Deploy Preview;
9. 1440 + 390;
10. ES + EN.

No declarar gate global por screenshots aisladas.

## 10. Gate

R54 launcher/token consumption:
**PASS acotado.**

Propuesta shell de Claude:
**DONOR / MEASURED PASS, NO APPLY DIRECT.**

Gate global:
`IRIS_GREEN_GLOBAL_VISUAL_TOKENS_UNIFIED_GATE`
**ABIERTO.**

Siguiente aceptación requiere Deploy Preview A2 real + Astra + HUMAN QA María.

No main.  
No producción.
