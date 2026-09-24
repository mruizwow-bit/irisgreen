# Revisión final de entregas de agentes · R39

Fecha: 24/09/2026. Revisor: Astra. Petición de María: revisar todas las entregas terminadas del equipo de apoyo a Codex. Revisión de fuentes y ejecución local; no modificación del producto.

## Resultado ejecutivo

Se revisan A1, A3, A4, A5, A6 y A7. Las 53 pruebas originales reproducidas pasan, pero tres entregas requieren correcciones concretas antes de aceptarlas para su uso previsto: panel A3, validación de WAV A6 y verificador A7. A1 se acepta como módulo. A4/A5 aportan código comprobable, pero no deben sustituir las soluciones que Codex ya integró.

Base de integración de referencia, confirmada en GitHub: `codex/n04-retrieval-r39-20260924` en `66b6b551ad055ea9e367ebdff7246b381f4656d3`. No retroceder a `92f24c8…` para integrar donantes. Se conserva cualquier avance posterior que registre Codex. María/agente 2 mantienen su web; Design y Motion quedan fuera de esta revisión.

| Entrega | Identidad revisada | Pruebas originales reproducidas | Veredicto |
|---|---|---:|---|
| A1 · agrupación | b0a55cb3ab94ad9f44d2ce3e8c1ce4513c9f475d | 8/8 | MÓDULO ACEPTADO; integración de presentación pendiente |
| A3 · panel | f5c7d4fb24c7ae2f2c9eed98d6745bc1d98c3842 | 14/14 | CORRECCIONES ANTES DEL MONTAJE PÚBLICO |
| A4 · ejecución | e58c343e661a713f8dcececae722caec448b6816 | 8/8 | REVISADO; NO SUSTITUIR IMPLEMENTACIÓN CODEX |
| A5 · transporte | de31ae038f2496e4644356404535105d41b208c2 | 6/6 | REVISADO; NO AÑADIR TRANSPORTE DUPLICADO |
| A6 · herramientas WAV | ZIP de código SHA256 36c5da7aecf0d8c9fb23219a7326336608dfedf3f0103afa222b24c750396243 | 9/9 | CORREGIR VALIDACIÓN DE ENTRADA TRUNCADA |
| A7 · verificador | 57ae8bf24e30eebe8a625be2dc8244ededb7e136 | 8/8 | NO ACEPTADO COMO CONTROL DE ENTREGA HASTA CORREGIR |

No se suman estas 53 a las 157 de Codex como si fueran todas pruebas diferentes de un mismo producto. El resultado verde describe los casos cubiertos, no una aprobación global.

## Método y límites

Fuentes: entregas finales de #237, archivos de sus commits y paquetes de A3/A5/A6/A7 recuperados de la Biblioteca de archivos. A1/A4 se copiaron desde el conector y se verificaron sus blobs Git. A7 se reconstruyó desde su parche de entrega y se contrastaron los hashes. Se compararon los cinco cambios Git contra sus bases: A1 2 archivos, A3 2, A4 2, A5 3, A7 3. No se atribuyen a un donante los archivos heredados de Codex.

Entorno de repetición: Node v22.16.0; Python 3.13 para A6. Sin acceso a credenciales ni red en la ejecución. A3 usa los dobles DOM de su autor: no acredita navegador real, lector de pantalla, foco real ni aceptación visual. A4 se ejecutó con el mapeo real de errores R39, no un doble de ese mapeo. A5 conserva la inyección de fábrica de sus pruebas; la importación del SDK se resolvió con un módulo local que lanza error si se usa, sin llamarlo: no es prueba de Blobs ni de runtime desplegado. A7 opera sobre repositorios temporales de prueba. A6 se probó únicamente con señales sintéticas; no se accedió a las grabaciones humanas privadas.

En esta revisión no se ejecutó Node24, no se realizó HTTP autorizado, no se desplegó nada y no se examinó el ZIP portable final de Codex. La revisión técnica previa de R39 y sus límites permanece en `REVISION_TECNICA_R39_R02_37_PRUEBAS.md`.

## A1 · agrupación de fuentes

`groupSources(candidates)` agrupa por cadena URL exacta, conserva primera aparición de fuente, orden interno de citas, fragment_id, versión, texto y puntuaciones. No muta la entrada ni altera el ranking. Es una transformación de presentación de candidatos previamente verificados, no una segunda validación de corpus.

Se acepta el módulo y su prueba. Su salida es `{url, citations[]}` por grupo: todavía no se conecta por sí sola al panel A3. El consumidor debe conservar el array crudo y presentar grupos sin perder citas. No convertir equivalencias de barra final o traducción de URL en normalizaciones silenciosas.

Archivos: `cloud/n04-r38-library/src/source-groups.mjs`, `tests/source-groups.test.mjs`. Blobs comprobados: `899edb2bf7fa06b3636a0ffddf5172886c53a8af`, `29c251b4a563d75904f714df7acb9b0442ddfb14`.

## A3 · panel de resultados: conservar base y corregir

Son útiles la inyección de consulta, el uso de texto en vez de HTML ejecutable, el descarte de respuestas antiguas, la región de anuncios existente y las cadenas de interfaz ES/EN. El cambio no sustituye páginas ni estilos globales.

### OBS-A3-01 · metadatos internos publicados

`renderResults` añade párrafos visibles con Tipo de fuente, ID de fragmento, Versión de biblioteca y Conceptos. La reproducción muestra literalmente el ID y `n04-es-20260916-56f72c4d3959` en el texto del panel. Esto contradice la exclusión de lenguaje técnico de la interfaz pública.

Corregir solo presentación: título/enlace, apartado cuando ayude y extracto legible; conservar IDs/versión en el contrato y trazabilidad no visible por defecto. No borrar citas ni inventar una fuente. Ajustar la prueba que hoy espera el rótulo técnico en inglés; una prueba debe comprobar el requisito vigente, no perpetuar la regresión.

### OBS-A3-02 · cancelación del Codex actual

El detector reconoce `RETRIEVAL_CANCELLED`, pero el wrapper integrado de Codex usa `REQUEST_CANCELLED`. Una consulta inyectada que rechaza con este último código acaba en `status: error` y no en `cancelled`. Corregir el mapeo en un único límite de integración o admitir el código canónico. No sustituir el wrapper de Codex para hacer coincidir un consumidor antiguo.

### INT-A1-A3-01 · unión de contratos pendiente

El panel recibe `{library_version,candidates}`. La ruta HTTP existente devuelve `{library_version,...,results}`. Pasar la respuesta HTTP sin adaptación produce error; no es un fallo del contrato de consulta inyectada del panel, sino una unión aún no implementada. Además, el panel recorre candidatos planos y no consume los grupos A1.

Codex debe componer el puente mínimo entre respuesta autorizada, candidatos verificados y agrupación para mostrar una fuente sin tarjetas repetidas. No exponer la clave QA al navegador ni convertir una ruta interna en API pública. No crear otro motor, otra página o una segunda forma de puntuar resultados.

### OBS-A3-03 · idioma real del contenido

Las cadenas de interfaz existen en ES/EN. Al escoger EN, un extracto español sigue en español sin `lang` explícito en el fragmento; no se ha completado una biblioteca inglesa. Conservar la cita original, identificar su idioma desde metadatos fiables y marcar el cambio lingüístico. Toda nueva etiqueta/explicación pública debe ser ES+EN. El corpus inglés requiere su propia fuente/versionado, no una traducción silenciosa del corpus sellado.

Observación de defensa en profundidad: el validador de enlace acepta HTTP/HTTPS ajenos a Iris, incluso con usuario/contraseña. R39 ya restringe las fuentes aguas arriba. Conviene mantener esa misma restricción en el puente confiable; no se afirma una explotación en la web ni que datos hostiles hayan atravesado el backend real.

Aceptación pendiente de pruebas de estos casos y revisión del componente integrado sobre el HEAD web de María/agente 2. No una remaquetación global.

## A4 · ejecución y C17

Se reproducen las 8 pruebas de su contrato: cancelación, timeout, limpieza, consumidores compartidos y sanitización de errores. La entrega informa correctamente de la falta de evidencia C17.

No se integra el módulo A4 sobre el archivo del mismo nombre de Codex: sus códigos son `RETRIEVAL_CANCELLED/RETRIEVAL_TIMEOUT`, mientras Codex usa `REQUEST_CANCELLED/REQUEST_TIMEOUT`; tampoco exporta la clase que importa el handler integrado. Una sustitución directa introduciría incompatibilidad. Conservar la entrega histórica y sus casos útiles, no reabrir la construcción de cancelación.

Pendiente de A4: evidencia aplicable de retención de plataforma, no otro informe general ni una declaración de PASS por ausencia de logs. La observación previa OBS-R39-BODY-01 sigue registrada en Codex, sin nueva evidencia de cierre.

## A5 · transporte y compatibilidad

El módulo fija la biblioteca R38 desde servidor, reutiliza la composición existente e impide que el body seleccione despliegue. Sus 6 pruebas unitarias pasan con fábrica inyectada. Su reporte distingue que A5 no ejecutó Node24: ver Node24 en R38 no equivale a probar esta pieza allí.

El trabajo integrado de Codex ya cubre su objetivo por otra composición. No añadir `r39-runtime-transport` como una segunda capa obligatoria. Su `check-runtime.mjs` busca referencias literales en el build antiguo; no representa el inventario automático posterior de `build-code-provenance.mjs`. No modificar Codex para satisfacer ese verificador histórico.

Se conserva el aporte, pero sus antiguos pendientes de conectar transporte/procedencia quedan superados por R39 R02, no se vuelven a encargar. El HTTP autorizado y la lectura cross-deploy con identidad del runtime siguen pendientes; no hay prueba nueva en las entregas que los cierre.

## A6 · validación y empaquetado local de WAV

Se obtuvo el paquete de código, sin necesitar el paquete de audio privado. Se reproducen 9 pruebas originales: PCM, silencio/saturación según método, copia exacta, idempotencia, entrada inválida y rechazo de DSP no autorizado.

### OBS-A6-01 · WAV truncado aceptado

Reproducción con PCM16 mono sintético, 16000 Hz, cabecera con 1600 frames. Al retirar 20 bytes del final sin cambiar la cabecera, `validate_wav` devuelve `status=valid`, `frame_count=1600`, `sample_count=1590`; `package_audio` crea el paquete. No se comprueba que la carga leída corresponda al número de frames declarado.

Retirar un solo byte provoca `struct.error` no convertido a `AudioValidationError`. El usuario no recibe el error controlado previsto por la herramienta.

Corrección: validar longitud real y alineación de frames según canales/ancho de muestra, rechazar truncamiento y convertir errores del decodificador a error de entrada controlado. El empaquetador no debe crear una entrega válida a partir de esa entrada. Añadir ambos negativos, incluida la ausencia de paquete publicado. Conservar originales byte a byte; sin normalizar, cambiar voz ni subir audio humano.

Identidad de código: validate_audio.py SHA256 `63f7886e2711e82cc41168f76b74726625cbc9f042998e469a1deb552b7e75f6`; package_audio.py `791e4db76d9e60dde4df85506cacb4c7d944e20c1c54ee91f0c02b95cb2c5e30`.

## A7 · verificador: no usar todavía como puerta de aceptación

Se reproducen 8 pruebas originales. Son útiles los controles de base/HEAD/tree, archivos y reservas. Sin embargo, el parche de entrega no se valida por contenido.

### OBS-A7-01 · falso VALID del parche

En un repositorio temporal válido, el verificador devuelve VALID tanto con `CHANGES.patch` vacío como con un parche alterado que conserva la ruta pero cambia el contenido propuesto. Los hashes comprobados son los archivos del HEAD, no el resultado de aplicar ese parche. Comparar solo las rutas no demuestra que el parche reproduzca el HEAD.

Corregir: rechazar parche vacío/ininterpretable cuando hay cambios y verificar que el parche aplicado sobre su base produce el contenido/tree esperado, en un índice o entorno temporal aislado y sin cambiar la rama de nadie. Los commits fuente siguen siendo evidencia válida: este fallo no invalida todo el código de los demás.

### OBS-A7-02 · comandos encadenados

La cadena de manifiesto `git status --short && git reset --hard` se considera VALID porque solo se clasifica el primer comando Git. Se usó únicamente como texto de prueba: no se ejecutó ningún reset. Validar todos los segmentos o exigir una representación no ambigua; no declarar seguro un comando no analizado.

Límite de integración adicional: un único `realBase` no sirve para validar indiscriminadamente donantes de `92f24c8…` y de `66b6b551…`. Validar base de origen por entrega y compatibilidad de aplicación contra el destino actual son comprobaciones distintas. No reescribir hashes históricos para eliminar esa diferencia.

PR #238 conserva su papel de candidato; no aprobarlo como control fiable ni fusionarlo automáticamente hasta cerrar estos negativos.

## Devolución acotada y continuidad

- A1: conservar módulo aceptado; Codex compone su consumo junto con A3 cuando este esté corregido.
- A3: corregir etiquetas técnicas, código de cancelación e idioma de extractos; entregar solo sus archivos y pruebas. El puente de contratos compartidos corresponde a Codex.
- A4/A5: no construir ni integrar duplicados. Concentrar ayuda restante en evidencia C17 y HTTP autorizado respectivamente, dentro de permisos existentes.
- A6: corregir truncamiento/errores de entrada local; no bloquea biblioteca ni presentación.
- A7: corregir verificación real del parche/comandos y actualizar su índice al R39 ya desplegado, no a «ZIP en preparación».

Esta devolución no amplía el producto ni autoriza deploy, main merge, inferencia, voz o cambios de acceso. Emitirla no acredita acuse ni ejecución de las correcciones. R39 integrado se conserva y no espera a la herramienta de voz.

## Normativa y ES+EN en las correcciones

Aplicar `NORMATIVA/REQUISITOS_OPERATIVOS_ES_EN.md` de esta misma carpeta: construcción sobre Iris existente, HTML/controles semánticos, teclado/foco y Lectura conservados, escritura clara sin jerga interna y sin infantilizar. Todo contenido público afectado, incluidas ayudas, errores y nombres accesibles, completo en español e inglés; los módulos internos justifican si no generan texto público. No afirmar conformidad global, Lectura Fácil validada o cobertura documental inglesa a partir de estas pruebas. No es una actualización de normas, sino aplicación de las reglas existentes.

## Registro y evidencia

Los logs originales y las reproducciones A3/A6/A7 están conservados en la entrega de revisión. El resumen estructurado se registra en `CONTROL/EVIDENCIA_REVISION_AGENTES_R39_2026-09-24.json`. Las filas se actualizan por ID en el control operativo; no se declara aplicado el delta al Excel V114 ni se sobrescribe la Memoria V106 original.

Fuentes de entrega: https://github.com/mruizwow-bit/irisgreen/issues/237 (comentarios 5809905303, 5809980732, 5809937339, 5810148028, 5809880597, 5810021461, 5810021289). Código en los commits exactos de la tabla. No se ha tocado producto, web, despliegue, credenciales o grabaciones privadas durante esta revisión.
