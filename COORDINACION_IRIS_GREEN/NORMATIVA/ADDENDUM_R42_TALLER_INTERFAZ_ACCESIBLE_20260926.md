# ADDENDUM R42 · Taller · interfaz creativa accesible

Fecha: 26/09/2026  
Ámbito: Taller R42  
Naturaleza: criterio operativo de producto/accesibilidad derivado de investigación y código real.

## 1. Shell estable

Los 25 estudios comparten una arquitectura espacial estable:
- orientación/título/estado arriba;
- estructura contextual a la izquierda cuando aporte;
- workspace principal dominante;
- inspector contextual a la derecha en escritorio;
- zona contextual inferior;
- adaptación tablet/móvil con docks/sheets.

Esto no significa que compartan un motor o una interacción genérica.

## 2. Inspector contextual

Los formularios, selects, tablas y campos válidos no se eliminan. Se convierten en propiedades secundarias del objeto/herramienta seleccionada cuando ese sea su papel.

El inspector debe estar ligado a la selección real. No se acepta un panel de propiedades vacío mientras los controles principales permanecen desconectados en otra zona.

## 3. Manipulación directa + alternativa

Cuando una función use drag:
- manipulación directa puede ser el canal principal;
- debe existir alternativa de **puntero único sin arrastrar**;
- debe existir operación por teclado cuando corresponda;
- el estado/objeto debe tener equivalente semántico.

El teclado por sí solo no se usa como justificación de WCAG 2.5.7.

## 4. Modelo semántico

Canvas/2D/3D no son la fuente semántica única.

Crear un modelo Iris de proyecto/escena del que deriven:
- renderer;
- estructura/capas/objetos;
- inspector;
- undo/redo;
- export;
- accesibilidad/Mirror DOM;
- tests.

La selección visual y el foco semántico deben sincronizarse.

## 5. Cinco perfiles de banco de trabajo

Se adoptan como propuesta de arquitectura, pendiente de HUMAN QA/decisión final:
- Lienzo/composición visual.
- Construir ↔ probar/espacial.
- Línea de tiempo.
- Bloques ↔ código ↔ ejecutar.
- Documento/sistema de conocimiento.

El perfil no restringe herramientas por edad.

## 6. Etapas

Conservar etiquetas canónicas:
`Infancia · Adolescencia · Adultez · Cualquier edad`.

La etapa:
- no es identidad;
- no se persiste;
- no se infiere;
- no limita funciones;
- cambia ejemplos, contexto y copy.

Un futuro “nivel de ayuda” debe ser independiente de etapa.

## 7. Actions / command palette

Una paleta de comandos puede dar acceso rápido a funciones y mejorar teclado/power use, pero:
- debe existir botón visible;
- no sustituye navegación visible;
- atajos no son el único canal;
- el shortcut se decidirá evitando conflictos.

## 8. Audio/timeline

Estudios musicales/temporales no deben depender de `setTimeout` como reloj musical principal. Usar scheduling basado en AudioContext/Tone Transport.

AudioWorklet se servirá same-origin y solo se anunciará como activo tras inicialización correcta.

## 9. Renderers

- 2D: Pixi/WebGL es candidato, bajo CSP estricta probada.
- 3D: Three WebGLRenderer como baseline candidato; WebGPU es mejora opcional.
- WebGPU detection no se presenta como uso real.
- ninguna librería obliga a relajar CSP sin decisión A2/Astra.

## 10. Física

Aplicar addendum separado:
`ADDENDUM_R42_TALLER_FISICA_CSP_20260926.md`.

Motor visual de física no equivale a cálculo de ingeniería.

## 11. Export

Cada estudio debe producir un artefacto útil acorde a su naturaleza. Un dump JSON interno no basta como único resultado público.

## 12. Artifact-first gate

Un estudio no se declara terminado por presencia de funciones o tests estáticos. Debe demostrar creación propia, interacción entendible, accesibilidad, export útil, rendimiento y HUMAN QA.

## 13. Almacenamiento

Se abre:
`OBS-R42-TALLER-STORAGE-01`

Hasta reconciliación:
- no nueva persistencia oculta;
- no backup OPFS automático;
- stage efímero;
- import/export manual válido;
- no alterar todavía la política de Mi colección.

## Estado

`R42_TALLER_INTERFACE_RESEARCH_COMPLETE_IMPLEMENTATION_HOLD`
