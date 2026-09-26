# Addendum normativo · R41 Diseño de producto interactivo · 26/09/2026

Este addendum complementa la normativa vigente. No borra requisitos anteriores de accesibilidad, privacidad, ES/EN, baja estimulación o trazabilidad.

## 1. Funcionalidad no equivale a experiencia aceptada
La presencia de botones, páginas, campos, rutas o checks técnicos no acredita calidad de producto. Una implementación puede cumplir estructura y ser rechazada por HUMAN QA si su arquitectura visual o cognitiva impide trabajar con claridad.

## 2. Workspace-first
En herramientas creativas, juegos, exploradores y superficies audiovisuales:
- el objeto de trabajo activo aparece antes que configuración secundaria;
- no se obliga a desplazarse para encontrar lienzo/editor/stage;
- en desktop habitual (aprox. 1440×900) el workspace debe estar visible en el primer viewport después de una cabecera compacta;
- ayuda, tutoriales, retos y ajustes avanzados se desplazan a paneles, drawers, popovers o disclosures secundarios.

## 3. Jerarquía de acciones
- una acción primaria por contexto;
- acciones relacionadas se agrupan en toolbar/menú;
- no exponer filas largas de botones de igual peso;
- controles nativos sin diseño coherente no son acabado final;
- estado de guardado/proyecto es visible pero no domina el workspace.

## 4. Direct manipulation
Cuando el dominio lo permita, preferir manipulación directa sobre formularios:
- seleccionar/mover/redimensionar;
- dibujar/arrastrar/conectar;
- inspector contextual según selección;
- snapping/handles/preview;
- teclado equivalente.

## 5. Progressive disclosure
- esenciales visibles;
- secundarios bajo menú/inspector/drawer;
- avanzados solo al pedirlos;
- `details` no se usa como arquitectura principal de una aplicación creativa; sí puede usarse en ayuda/ajustes.

## 6. App shell
Taller, Juegos, Intereses y Rincón comparten principios:
- cabecera compacta;
- workspace central;
- tool rail/context toolbar;
- inspector contextual;
- panel auxiliar opcional;
- modo móvil específico (dock/sheet), no simple apilado vertical del escritorio.

## 7. Lenguaje visual
- contemporáneo, sobrio, no infantil;
- respetar tokens Iris/Sabik;
- glass ligero, nunca blur apilado;
- iconografía coherente con labels/tooltips accesibles;
- foco/selected/disabled inequívocos;
- el color orienta, no sustituye texto/semántica.

## 8. Tecnología web moderna · progressive enhancement
Autorizada cuando mejore el producto:
- CSS Container Queries;
- Popover API;
- HTML `dialog`;
- View Transition API con `prefers-reduced-motion`;
- OffscreenCanvas/Web Workers;
- IndexedDB/OPFS;
- File System Access con consentimiento y fallback;
- WebGL2 como base para gráficos avanzados;
- WebGPU solo como mejora opcional porque no tiene disponibilidad universal;
- CSS anchor positioning solo con fallback.

No introducir un framework nuevo únicamente para modernizar apariencia.

## 9. Accesibilidad de producto
- Toolbar según patrón APG, reduciendo tab stops y usando navegación interna apropiada;
- Tabs muestran un panel activo cada vez;
- drawers/dialogs restauran foco;
- keyboard/touch/zoom/reflow/forced-colors/reduced-motion;
- nombres accesibles independientes de iconos;
- alternativas a drag/drop.

## 10. HUMAN QA prevalece en criterios perceptivos
CI puede comprobar estructura, pero no puede declarar PASS final de:
- jerarquía visual;
- fluidez;
- modernidad percibida;
- carga cognitiva;
- ausencia de sensación de “formulario/documento”;
- calidad audiovisual;
- naturalidad de interacción.

Si María rechaza la preview, el módulo vuelve a construcción aunque CI esté verde.

## 11. Fuentes de referencia consultadas
- Figma UI3: https://www.figma.com/blog/behind-our-redesign-ui3/
- Figma UI3 workflow: https://www.figma.com/blog/making-the-move-to-ui3-a-guide-to-figmas-next-chapter/
- tldraw UI: https://tldraw.dev/docs/user-interface
- WAI toolbar: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
- WAI tabs: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- MDN View Transitions: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- MDN Container Queries: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries
- MDN Popover: https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
- MDN OffscreenCanvas: https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
- MDN OPFS: https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system
