import { getDeployStore } from '@netlify/blobs';
import { createCachedReader } from '../../src/library.mjs';
import { createQAHandler } from '../../src/qa-handler.mjs';

const readLibrary = createCachedReader(getDeployStore);
export default createQAHandler({ readLibrary, env: key => Netlify.env.get(key) });
export const config = { path: '/internal/n04/library/search' };
