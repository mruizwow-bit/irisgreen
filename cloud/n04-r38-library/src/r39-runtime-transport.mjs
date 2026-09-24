import { SabikRetrievalError } from './sabik-retrieval.mjs';
import { createSabikRetrievalForDeployment } from './sabik-retrieval-server.mjs';

export const R38_LIBRARY_DEPLOY_ID = '6ab4c1a15435b93043ab3f6d';

const fail = code => { throw new SabikRetrievalError(code); };

function plainDataObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value) ||
      ![Object.prototype, null].includes(Object.getPrototypeOf(value))) return false;
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== 'string') return false;
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor || !('value' in descriptor)) return false;
  }
  return true;
}

function toRetrievalInput(body) {
  if (!plainDataObject(body)) fail('INVALID_RETRIEVAL_QUERY');
  const allowed = new Set(['q', 'limit', 'version']);
  if (Reflect.ownKeys(body).some(key => !allowed.has(key))) fail('INVALID_RETRIEVAL_QUERY');

  const input = { query: body.q };
  if (Object.hasOwn(body, 'limit')) input.limit = body.limit;
  if (Object.hasOwn(body, 'version')) input.libraryVersion = body.version;
  return Object.freeze(input);
}

/**
 * Trusted bridge between the already-authenticated HTTP handler and R39 retrieval.
 * The immutable R38 library deployment is selected by server composition only.
 * No deployment selector is accepted from request data.
 */
export function createR39RuntimeTransport({
  libraryDeployId = R38_LIBRARY_DEPLOY_ID,
  createRetrieval = createSabikRetrievalForDeployment,
} = {}) {
  if (libraryDeployId !== R38_LIBRARY_DEPLOY_ID || typeof createRetrieval !== 'function') {
    fail('LIBRARY_UNAVAILABLE');
  }

  let retrieval;
  try {
    retrieval = createRetrieval({ libraryDeployId });
  } catch {
    fail('LIBRARY_UNAVAILABLE');
  }
  if (!retrieval || typeof retrieval.retrieveForSabik !== 'function') fail('LIBRARY_UNAVAILABLE');

  const retrieve = async body => retrieval.retrieveForSabik(toRetrievalInput(body));
  return Object.freeze({ retrieve });
}
