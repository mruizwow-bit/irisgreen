import { getDeployStore } from '@netlify/blobs';
import { createCachedCloudReader } from '../../src/cloud-library-v2.mjs';
import { createCloudLibraryQAHandler } from '../../src/cloud-library-qa-handler.mjs';
import { RETRIEVAL_TIMEOUT_MS } from '../../src/cloud-release.mjs';
import release from '../../build/library-v2/release.json' with { type: 'json' };
import codeProvenance from '../../build/code-provenance.json' with { type: 'json' };

if (!/^[a-f0-9]{40}$/.test(codeProvenance.source_head || '') ||
    codeProvenance.retrieval_timeout_ms !== RETRIEVAL_TIMEOUT_MS) {
  throw new Error('Invalid code release provenance');
}
const readLibrary = createCachedCloudReader(getDeployStore, release);
export default createCloudLibraryQAHandler({
  readLibrary,
  release,
  env: key => Netlify.env.get(key),
  timeoutMs: RETRIEVAL_TIMEOUT_MS,
  codeProvenance
});
export const config = { path: '/internal/n04/cloud-library/search' };
