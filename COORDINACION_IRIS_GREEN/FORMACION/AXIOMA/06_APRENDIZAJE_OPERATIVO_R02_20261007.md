# AXIOMA · APRENDIZAJE OPERATIVO R02

Fecha: 07/10/2026
Estado: AXIOMA_R02_RUNTIME_THEME_LANGUAGE_LEARNING_PERSISTED

## 1 · No asumir qué renderer expone el three.js vendorizado

Hallazgo real en `Cada cerebro, su camino`:
el bundle vendorizado de Iris Green expone `THREE.WebGPURenderer` y no `THREE.WebGLRenderer`.

Consecuencia:
una escena podía parecer correctamente escrita y caer siempre al fallback.

Regla:
- antes de usar un renderer, comprobar el bundle real del repo;
- no asumir que un nombre de API existe por conocimiento general de three.js;
- el patrón first-party del proyecto manda sobre ejemplos externos.

Patrón aprendido:
`new THREE.WebGPURenderer({ antialias:true, forceWebGL:true })`.

## 2 · WebGPURenderer requiere inicialización asíncrona

Hallazgo:
crear el renderer y llamar a `.render()` antes de `await renderer.init()` produce fallo de backend no inicializado.

Regla:
`CREATE → await init() → resize → first render`.

No declarar escena arrancada si el primer frame no se ha dibujado.

## 3 · Un catch silencioso puede ocultar un fallo estructural

Hallazgo:
un `catch` que sólo mostraba fallback ocultaba la causa real.

Regla:
el fallback puede seguir siendo amable para la persona, pero el error técnico debe quedar disponible para depuración.

Patrón:
`window.__IG_SCENE_ERROR__ = (e && e.stack) || String(e)`.

No enseñar stack al usuario final.

## 4 · El tema debe leer la misma señal que la interfaz

Hallazgo:
la página usaba `html[data-ig-theme]`, mientras la escena usaba `prefers-color-scheme`.

Resultado:
página oscura + mundo claro, o viceversa.

Regla:
WORLD_THEME_SOURCE == UI_THEME_SOURCE.

En Iris Green:
1. leer `document.documentElement.dataset.igTheme`;
2. sólo si no existe, usar `prefers-color-scheme` como fallback;
3. observar cambios del atributo cuando proceda.

## 5 · Producción y artefacto descargable son superficies distintas

Una ruta correcta en producción puede fallar al abrir un HTML descargado.

Regla:
probar por separado:
- ruta first-party en producción/preview;
- artefacto entregado a HUMAN QA.

No introducir URLs absolutas externas para “hacer que funcione” un archivo local si eso rompe CSP o la política self-only del proyecto.

## 6 · CSP y dependencias

Iris Green usa dependencias first-party.

Regla:
- cero CDN en entregables de producto;
- cero dependencia absoluta de otro origen cuando la CSP exige `self`;
- priorizar rutas locales compatibles con repo/preview.

## 7 · Paleta visual como contrato

La corrección R04 confirmó que color no es decoración.

Reglas:
- roles de color centralizados;
- suelo, calzada y acera deben tener valores distintos;
- sombra = desplazamiento cromático coherente, no “multiplicar por gris”;
- el acento se reserva para estados/ruta seleccionada;
- una paleta nombrada facilita QA y evita deriva.

## 8 · La niebla no puede borrar el contenido

La niebla sirve para cerrar el borde perceptivo, no para deshacer la ciudad.

Regla:
FOG_SUPPORTS_DEPTH, NOT CONTENT_ERASURE.

Si edificios o destino dejan de leerse, la niebla falla aunque técnicamente exista.

## 9 · Lenguaje claro: pasada completa, no parche local

Hallazgo:
corregir una sola frase como “Le pesa el ruido intenso” no basta si el resto del sistema conserva metáforas equivalentes.

Regla ISO 24495-1 aplicada:
- revisar todas las frases de la superficie;
- sujeto explícito;
- verbo concreto;
- objeto concreto;
- evitar metáforas vagas;
- evitar fragmentos que sólo cobran sentido al incrustarse en otra oración;
- evitar instrucciones espaciales frágiles.

Ejemplos:
- “Le pesa el ruido intenso.” → “Prefiere evitar el ruido intenso.”
- “Elige el siguiente tramo con los botones de abajo.” → “Elige por dónde seguir.”
- motivos de parada deben redactarse como frases comprensibles, no como nombres sueltos de variables.

## 10 · Bilingüismo: claridad equivalente, no traducción literal

Una metáfora mala en español puede reaparecer como metáfora mala en inglés.

Regla:
ES y EN pasan revisión de claridad por separado.

No traducir literalmente una expresión defectuosa para conservar “equivalencia”.

## 11 · Aprendizaje transversal para otras escenas 3D

Antes de cerrar Cielo/Espacio, Vida marina, El Vado, Faro u otra escena:
- comprobar renderer real exportado;
- comprobar init asíncrona;
- comprobar señal de tema;
- comprobar CSP/dependencias;
- comprobar que errores no se silencian sin rastro;
- comprobar lenguaje claro completo en el DOM paralelo.

## 12 · Evidencia

No declarar PASS visual sin abrir la página y ver la ciudad.

Sí se puede declarar:
- sintaxis PASS;
- apertura matemática PASS;
- integridad de datos PASS;
si eso se ejecutó realmente.

Estado:
AXIOMA_R02_RUNTIME_THEME_LANGUAGE_LEARNING_PERSISTED
