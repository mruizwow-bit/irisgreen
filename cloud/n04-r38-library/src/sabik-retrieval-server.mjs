import { getDeployStore } from '@netlify/blobs';
import { createCachedReader, RELEASE } from './library.mjs';
import { createSabikRetrievalAdapter, SabikRetrievalError, retrievalFailureCode } from './sabik-retrieval.mjs';

// Trusted composition root. Deployment selection never comes from a search request.
// Construct once per server instance; the R38 reader coalesces and caches only the index.
export function createSabikRetrievalForDeployment({ libraryDeployId, storeFactory = getDeployStore } = {}) {
  if (!/^[a-f0-9]{24}$/.test(libraryDeployId ?? '') || typeof storeFactory !== 'function') {
    throw new SabikRetrievalError('LIBRARY_UNAVAILABLE');
  }
  const read = createCachedReader(storeFactory);
  const readLibrary = ({ version }) => read({ deployId: libraryDeployId, version });
  const adapter = createSabikRetrievalAdapter({ readLibrary });
  return Object.freeze({ ...adapter,
    // Internal QA provenance only. Shares the already verified/cached index.
    async getLibraryInfo() {
      try {
        const { manifest } = await readLibrary({ version: RELEASE.version });
        return Object.freeze({ library_version: manifest.version, corpus_sha256: manifest.corpus_sha256,
          source_git_blob: manifest.source_git_blob, build_head: manifest.provenance.build_head });
      } catch (error) { throw new SabikRetrievalError(retrievalFailureCode(error)); }
    },
  });
}
