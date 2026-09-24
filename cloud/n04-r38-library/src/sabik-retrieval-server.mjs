import { getDeployStore } from '@netlify/blobs';
import { createCachedReader } from './library.mjs';
import { createSabikRetrievalAdapter, SabikRetrievalError } from './sabik-retrieval.mjs';

// Trusted composition root. Deployment selection never comes from a search request.
// Construct once per server instance; the R38 reader coalesces and caches only the index.
export function createSabikRetrievalForDeployment({ libraryDeployId, storeFactory = getDeployStore } = {}) {
  if (!/^[a-f0-9]{24}$/.test(libraryDeployId ?? '') || typeof storeFactory !== 'function') {
    throw new SabikRetrievalError('LIBRARY_UNAVAILABLE');
  }
  const read = createCachedReader(storeFactory);
  return createSabikRetrievalAdapter({
    readLibrary: ({ version }) => read({ deployId: libraryDeployId, version }),
  });
}
