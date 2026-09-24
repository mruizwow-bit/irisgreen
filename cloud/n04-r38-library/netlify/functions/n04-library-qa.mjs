import { createSabikRetrievalForDeployment } from '../../src/sabik-retrieval-server.mjs';
import { createQAHandler } from '../../src/qa-handler.mjs';
import { LIBRARY_DEPLOY_ID, RETRIEVAL_TIMEOUT_MS } from '../../src/cloud-release.mjs';
import codeProvenance from '../../build/code-provenance.json' with { type: 'json' };

if (codeProvenance.library_deploy_id !== LIBRARY_DEPLOY_ID ||
    codeProvenance.retrieval_timeout_ms !== RETRIEVAL_TIMEOUT_MS ||
    !/^[a-f0-9]{40}$/.test(codeProvenance.source_head ?? '')) throw new Error('Invalid code release provenance');
const retrieval = createSabikRetrievalForDeployment({ libraryDeployId: LIBRARY_DEPLOY_ID });
export default createQAHandler({ retrieval, env: key => Netlify.env.get(key),
  timeoutMs: RETRIEVAL_TIMEOUT_MS, codeProvenance });
export const config = { path: '/internal/n04/library/search' };
