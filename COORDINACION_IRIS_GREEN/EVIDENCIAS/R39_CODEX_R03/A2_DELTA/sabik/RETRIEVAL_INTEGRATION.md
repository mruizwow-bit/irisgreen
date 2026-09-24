# R39 R03 · consumo de la biblioteca

Base Cloud: 66b6b551ad055ea9e367ebdff7246b381f4656d3. A1 aceptado: b0a55cb3ab94ad9f44d2ce3e8c1ce4513c9f475d (dos archivos exactos). Panel donante A3: f5c7d4fb24c7ae2f2c9eed98d6745bc1d98c3842. María ha reasignado expresamente su corrección a Codex; se conserva el donante y no se escribe en la rama de A2.

## Frontera única

Un transporte autorizado inyectado devuelve una `Response` con el contrato HTTP R38. El puente `createRetrievalQuery({transport, library})` verifica procedencia, estructura, estado PUBLICABLE y URLs; adapta `results` a los nueve campos `candidates` sin cambiar valores ni orden y llama al A1 canónico. Devuelve `{library_version, candidates, groups, source_language:'es'}`. `groups` es exactamente `[{url,citations:[]}]` de A1. `query(request,{signal})` conserva la solicitud y sólo añade la señal de ese consumidor al transporte.

El panel recibe esa query; valida la proyección recibida, sin implementar otro agrupador. Mantiene `createRetrievalPanel({root,query,announcement,language})` y `run`, `cancel`, `setLanguage`, `getState`. Una tarjeta/enlace por URL exacta; todos los extractos y encabezados permanecen intactos dentro de ella. `run().count` cuenta fuentes/tarjetas, no fragmentos. Los metadatos permanecen en el envelope y atributos `data-*`, nunca en texto público, `title` ni etiquetas ARIA. El elemento de cada cita y el enlace llevan `lang=es`; UI y región de anuncios usan ES/EN. No hay corpus inglés ni traducción implícita.

Cancelar o sustituir una consulta aborta sólo su señal. La protección por número de solicitud ignora respuestas antiguas incluso si el transporte ignora la señal. `REQUEST_CANCELLED` muestra cancelación; timeout y errores muestran un aviso recuperable ES/EN sin causa privada. Se conserva el foco externo; si un nodo del panel desaparece, el foco pasa a su equivalente o al encabezado/aviso. La región de anuncios la aporta el montaje existente; no se añade otra.

## Entrega aditiva a A2

El archivo fuente del puente importa A1 desde `cloud/`, por lo que no debe copiarse solo a un sitio estático. La entrega contiene `sabik/retrieval-bridge.browser.mjs`, compilado con esbuild a ESM de navegador desde ese puente y el A1 canónico. No hay reimplementación del agrupador: el manifiesto registra hashes de ambos inputs, versión de esbuild y hash del bundle. El panel se entrega junto con él. El parche aditivo debe comprobarse contra el HEAD vigente de A2 indicado en DELIVERY.json; no cambiar su rama, navegación, estilos globales, Lectura, Motion ni despliegue desde este carril.

```js
import { createRetrievalQuery } from './retrieval-bridge.browser.mjs';
const query = createRetrievalQuery({ transport: authorizedTransport, library: sealedLibrary });
const panel = SabikRetrievalPanel.createRetrievalPanel({ root, query, announcement, language });
await panel.run({ query: userQuery });
```

`authorizedTransport` es una dependencia, no una credencial ni una URL incluida en este paquete. No se entrega clave QA, endpoint interno, cookie ni almacenamiento de consultas al navegador. En ausencia de transporte autorizado, el montaje puede verificarse con fixtures declarados, pero el consumo real debe figurar PENDIENTE_TRANSPORTE_AUTORIZADO. La QA de fixtures y la composición con handler local no demuestran HTTP remoto, lectura cross-deploy del runtime ni aceptación humana de accesibilidad.
