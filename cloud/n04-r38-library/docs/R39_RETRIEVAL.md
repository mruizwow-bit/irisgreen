# R39 · adaptador de recuperación de Sabik

Base aceptada: R38, HEAD `ddd12ed4e002812f5c53e24618c029be9faf9e00`, biblioteca Cloud del deploy `6ab4c1a15435b93043ab3f6d`. R39 añade una dependencia de servidor importable por el futuro pipeline de respuesta. No conecta el navegador, no genera respuestas ni abre una ruta de chat.

## Contrato de servidor

```js
import { createSabikRetrievalForDeployment } from './src/sabik-retrieval-server.mjs';

// Crear una vez por instancia, con configuración de despliegue de confianza.
const retrieval = createSabikRetrievalForDeployment({
  libraryDeployId: '6ab4c1a15435b93043ab3f6d',
});

// Inyectar `retrieval` en el futuro pipeline; R39 termina en estos candidatos.
const sources = await retrieval.retrieveForSabik({
  query: 'sobrecarga sensorial',
  limit: 5,
  filters: { editorial_status: 'PUBLICABLE' },
  libraryVersion: 'n04-es-20260916-56f72c4d3959',
});
```

Devuelve `{ library_version, candidates }`. Cada candidato contiene exactamente `library_version`, `fragment_id`, `snippet`, `title`, `heading`, `url`, `source_type`, `concepts`, `score`. El excerpt es el prefijo exacto de hasta 480 caracteres del fragmento original. Antes de entregar resultados se comprueban IDs, versión, URL y metadatos contra el lookup del corpus verificado; un resultado alterado invalida la operación completa. No se descartan silenciosamente citas defectuosas ni se inventan fuentes.

`getFragmentForSabik({fragmentId, libraryVersion})` devuelve `{library_version, candidate}`. Un ID inexistente devuelve `candidate: null`; los IDs se comparan exactamente. En lookup el score es `null`, porque no existe puntuación de ranking para esa operación. La búsqueda sin coincidencias devuelve `candidates: []`, manteniendo la versión. Los resultados están congelados y no incluyen consulta, perfil, sesión ni contexto de almacenamiento.

El constructor puro `createSabikRetrievalAdapter({readLibrary})` permite inyectar el lector en pruebas u otros servidores. El constructor Netlify reutiliza el lector R38 y su caché por despliegue/versión. El ID de despliegue procede de configuración de servidor, nunca de la consulta. Las declaraciones `.d.mts` describen los contratos para consumidores TypeScript.

## Consultas y filtros

Sólo se admiten `query`, `limit`, `filters`, `libraryVersion`. Sin perfil ni historial. Se rechazan propiedades desconocidas, getters y estructuras que no sean objetos de datos.

- Query: string de hasta 300 unidades UTF-16 antes y después de normalizar; NFKD, eliminación de marcas, minúsculas, trim y espacios consecutivos convertidos en uno. Debe contener al menos un término; máximo 32 términos únicos, como R38.
- Limit: entero 1–20; por defecto 5.
- Versión: por defecto la congelada de R38; otra versión no se resuelve por fallback.
- Filtros exactos existentes: `source_type`, `editorial_status`, `url` (strings no vacíos de hasta 2.048 unidades) y `concepts` (0–10 strings no vacíos de hasta 256 unidades, deben coincidir todos). Se conserva el valor exacto de los metadatos; no se normalizan ni inventan filtros.
- Consulta y filtros se copian/validan antes de esperar almacenamiento; el llamador no puede cambiar el resultado modificando sus objetos durante esa espera.

El motor, pesos, índice, orden y desempate R38 permanecen intactos. R39 no añade ranking semántico ni embeddings. Los 18 fixtures dorados proceden del motor R38 aceptado y sus IDs/URLs se contrastan con la fuente exacta.

## Errores

Se rechaza la promesa con `SabikRetrievalError`. `code` y `message` contienen únicamente uno de estos códigos. La excepción original no se adjunta mediante `cause`; no se copia su mensaje, stack ni respuesta. El futuro límite HTTP debe traducir estos códigos y nunca serializar un Error completo.

| Código | Casos |
| --- | --- |
| `INVALID_RETRIEVAL_QUERY` | Entrada malformada, vacía, excesiva, límite inválido, filtro no soportado o campo privado/adicional. |
| `LIBRARY_VERSION_MISMATCH` | Versión solicitada no admitida o `wrong_version` explícito del motor. |
| `LIBRARY_INTEGRITY_ERROR` | Hash, formato, manifiesto, count, IDs, procedencia o citas inconsistentes. El error genérico R38 `manifest_identity_mismatch` permanece aquí, sin adivinar qué campo falló. |
| `LIBRARY_UNAVAILABLE` | Biblioteca/blob ausente, almacenamiento inaccesible, configuración de servidor incorrecta o fallo desconocido. |

Un fallo no devuelve resultados parciales, respuestas inventadas ni fallback a una versión distinta. `retrievalFailureCode(error)` permite obtener el código seguro para una capa de respuesta futura.

## Integración y pruebas

`tests/support/retrieval-only-caller.mjs` es un llamador de prueba sin generador de respuestas. Recibe la dependencia `retrieval`, consume los candidatos y devuelve `response: null`; propaga los errores cerrados. No está conectado a la Function existente.

`npm test` ejecuta las pruebas R38 sin modificarlas y las nuevas R39. `npm run test:retrieval` ejecuta el contrato del adaptador. Casos: términos simples/múltiples, acentos, filtros, límites, lookup, no resultados, repetición, referencias completas, mutaciones durante espera, aislamiento de errores y fallos reales del loader. Se comprueba ausencia de logging, escrituras, proveedores y rutas nuevas.

`npm run probe:retrieval` es una operación de QA **de sólo lectura** sobre el deploy R38 aceptado. Requiere `NETLIFY_AUTH_TOKEN` en el entorno del proceso y verifica 18 fixtures, sus repeticiones y un lookup, usando sólo dos lecturas de blobs. El informe usa IDs de fixtures y citas públicas; no registra consultas de usuario ni secretos. Esto demuestra el adaptador de servidor con datos de la nube, **no** ejecución HTTP detrás de Team Login.

La composición de servidor usa las credenciales de Blobs del contexto de ejecución. Un consumidor futuro en otro sitio debe proporcionar acceso de servidor autorizado a esta biblioteca; no debe mover tokens al navegador ni confundir el ID de Iris Green con el de sabik-asistente.

## Estado de activación y privacidad

No hay escritura de corpus ni persistencia de consultas, perfiles, historial, IP o voz. El adaptador no registra logs; por tanto no requiere recolectar siquiera los campos operacionales permitidos. Sólo se cachea el índice inmutable R38. El token operacional del probe se proporciona en memoria y no se incluye en las entregas.

No se modifica la ruta QA protegida R38 ni Team Login. HTTP autenticado sigue siendo una puerta operacional separada. C17 sigue **PENDING** hasta disponer de evidencia de retención de plataforma. No se presupone que ausencia de logs propios acredite retención de Netlify.

Proveedor/modelo = ninguno. `SABIK_AI_ENABLED` permanece falso/ausente. NO_API_ACTIVATION. Esta entrega termina antes de conectar inferencia conversacional; no requiere otro despliegue ni alterar el borrador R38 para demostrar el contrato.
