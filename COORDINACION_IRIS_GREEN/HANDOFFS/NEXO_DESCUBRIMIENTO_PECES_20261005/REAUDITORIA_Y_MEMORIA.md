# NEXO · Reauditoría de producto · Vida marina y peces
2026-10-05 · #323

## Conclusión
REWORK del producto anterior; KEEP de los seis assets mesopelágicos y del gesto MOVE_LIGHT → REVEAL → DARKNESS_RETURNS. Se especifica prototipo interactivo para Claude; no se ha implementado ni se ha obtenido HUMAN QA.

## Evidencia actual
Main inspeccionado: 3c44abc43e10c1adfc9486cb396f35fcd64e373d.
Lectura del contrato Lumen y handoff INTEREST_22_LIGHT_REVEAL_20261004: haz ancho, máscara parcial, no autoplay, bioluminiscencia fija, álbum por zonas y reutilización.
Lectura directa de assets/ig-mar22-descent.js:
- build() presenta nombres de los tres animales antes de observación.
- setAssetMode()/loadSelected() sustituyen el sprite entero luz/oscuro.
- setFlashlight() dibuja un haz ambiental fijo; no dirige una máscara sobre el cuerpo.
- drawEnvironment()/startCanvas() animan partículas continuamente en NORMAL.
- contrato de datos conserva real_length_cm=null.
Estas son observaciones estáticas del código, no un test de navegador.
La ausencia de los seis paths PNG en el árbol main leído confirma que la entrada de manifest no garantiza existencia del binario en GitHub.
El HTML histórico 4-bajar-al-fondo.html no se resolvió en una búsqueda exacta; no se inspeccionó ni se afirma inexistente.

## Material disponible
Se materializaron los seis PNG de la ruta canónica Atlas, sin modificación:
6/6 hashes coinciden, 1400×1000 RGBA e ICC presente.
Inspección visual directa: tres estados luz y pez hacha oscuro. No se efectuó nueva auditoría morfológica/taxonómica.
manifest Atlas conserva taxones a distinto nivel (Argyropelecus es género), por lo que no se debe inventar especie.
Valores heredados 6/8/20 cm quedan como referencias internas representadas, no como tamaños universales revalidados.
INDICE.csv /Iris Green/Interés 22 · Vida marina y peces/ leído en filas iniciales/arrecife. Su agrupación no prueba cohabitación. No se auditó cada especie del catálogo.

## Diseño decidido para el encargo
Vida marina contiene Arrecife y Bajar al fondo.
Primera entrega implementable: un tramo mesopelágico de tres animales; luz → observación → examen deliberado → identidad → álbum.
Arrecife: diseño espacial/oclusión/zoom descrito, implementación posterior con subset compatible y evidencia factual.
Separar visibilidad reversible y conocimiento persistente en sesión.
Eliminar conflicto de flechas entre haz y profundidad.
Alternativa no visual con señales y pistas descriptivas antes del nombre.
Sin contrato que exija nueva revisión de PNG antes de probar interacción: Claude entrega HTML funcional aislado; Axioma runtime y María uso real.
No se interpreta esto como autorización de integrar o publicar el producto.

## Aprendizaje
Una biblioteca rica y un runtime que carga imágenes no acreditan Descubrimiento. La acción debe revelar evidencia perceptible antes de dar explicación.
El gate de packaging protege los binarios, no valida automáticamente taxonomía, hábitat, escala científica o diversión.
La orden de entrega debe incluir archivos reales accesibles para un agente externo: GitHub/Library IDs solos no bastan para Claude.

## Actualización posterior de María
María informa de más animales en producción y de 40 pendientes por terminar. No se ha inferido el total ni auditado los nuevos binarios. Autoriza comenzar ya: motor, interfaz, álbum, estructura de Arrecife/descenso y catálogo por manifest; seis PNG incluidos como muestra de prueba, sin límite de tres en el motor. Ingesta incremental por hábitat validado sin esperar a acabar toda la producción.

## Plan
1 Nexo: orden, estado y paquete de seis assets exactos.
2 María entrega el paquete a Claude; su activación no se presume.
3 Claude implementa y entrega HTML/ZIP ejecutable con pruebas.
4 Nexo revisión; Axioma QA runtime.
5 HUMAN QA María.
6 Solo con decisión posterior, ampliar zonas o integrar en main.

Fuentes internas:
- #323: 5979438739, 5979512722, 5979845439, 5983158695.
- Contrato Lumen 20261004 y MAR_22_MESO_PACKAGING_R01.
Fuentes externas de contexto, consultadas 2026-10-05:
NOAA Layers of Ocean; WHOI Twilight Zone; Smithsonian Deep Sea / Bioluminescence.
URLs en la orden. Sin usar material externo como ilustración ni copiar experiencias.
