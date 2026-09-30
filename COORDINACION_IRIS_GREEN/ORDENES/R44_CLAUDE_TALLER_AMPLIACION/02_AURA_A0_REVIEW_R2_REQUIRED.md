# R44 · CLAUDE · A0 R2 ACOTADA

Fecha: 30/09/2026
Issue: #319
Estado de entrada:
`R44_A0_FRAMEWORK_TECH_PASS_PILOTS_PRODUCT_REWORK_REQUIRED`

## Objetivo

Conservar el framework técnico A0 y corregir únicamente los bloqueos detectados por Aura antes del gate humano.

## KEEP

- namespace propio R44;
- los ocho IDs E01/E06/E17/E22/E28/E34/E38/E44;
- montaje después del workspace;
- sin almacenamiento oculto;
- estados aria-live;
- no scoring;
- no duplicar `taller-retos.json`;
- E22 corregido.

## 1 · ES/EN obligatorio

Para cada uno de los 8:
- `en.alternativa` no puede estar vacío;
- `artefacto` debe tener ES y EN y renderizar según idioma;
- revisar que título, entradilla, pasos, criterio, CTA, estado, alternativa y artefacto sean equivalentes.

## 2 · Piloto visual real

Cada reto A0 necesita:
- mini-escena o preview propia;
- mostrar la acción/proceso, no un icono;
- mostrar o anticipar el artefacto final;
- E4 compatible con R54/R65;
- LIGHT/DARK;
- 390/320;
- no depender solo del color.

Puede reutilizar motores/activos first-party existentes.
No crear 8 contextos WebGL en el listado.

## 3 · CTA conectado al workspace

`Empezar el reto` no puede ser solo un contador de estado.

Debe:
- llevar foco al workspace;
- activar un modo/contexto/starter del reto;
- o cargar una configuración inicial no destructiva;
- conservar alternativa de teclado.

No añadir puntuación ni autoevaluación.
`Marcar como terminado` puede seguir siendo una declaración de la persona.

## 4 · Edad

NO tocar `assets/ig-audience.js` desde A0.

El A2 vivo ya implementa AGE_* y ALL_AGES.

Datos R44:
- `audience: ALL_AGES`;
- `recommended_stage: ALL_AGES`;
- `starter_stage: ALL_AGES` salvo que exista starter por edad realmente implementado.

No emitir TRANSVERSAL nuevo.

## 5 · Patch aislado

Entregar:
- patch o bundle con solo el delta A0/R44 respecto del padre inmediato;
- no 41 commits históricos;
- base/HEAD/tree declarados;
- hash SHA-256.

No reinyectar R43/R54/R65.

## 6 · Evidencia

Adjuntar logs brutos:
- axe;
- reflow 320/390;
- teclado/foco;
- reduced motion;
- LIGHT/DARK;
- ES/EN;
- age lens.

Capturas:
- 1440;
- 390;
- 320;
- representativas de los 8 pilotos.

Si el shell global externo colisiona, documentar:
`R67_GLOBAL_SHELL_BLOCKER`
y no modificarlo desde R44.

## Salida

`R44_A0_FRAMEWORK_8_PILOTS_R2_READY_FOR_ASTRA_AURA_MARIA`

Después STOP.

No 55.
No main.
No producción.
