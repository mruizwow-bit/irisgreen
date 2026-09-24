import type { SabikRetrieval } from './sabik-retrieval.mjs';
export declare function createSabikRetrievalForDeployment(options: {
  libraryDeployId: string;
  storeFactory?: (options: { name: string; region: string; deployID: string; consistency: string }) => {
    get(key: string, options: { type: 'arrayBuffer'; consistency: 'strong' }): Promise<ArrayBuffer | Uint8Array | null>;
  };
}): SabikRetrieval;
