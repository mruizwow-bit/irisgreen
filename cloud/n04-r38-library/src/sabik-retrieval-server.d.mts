import type { SabikRetrieval } from './sabik-retrieval.mjs';
export declare function createSabikRetrievalForDeployment(options: {
  libraryDeployId: string;
  storeFactory?: (options: { name: string; region: string; deployID: string; consistency: string }) => {
    get(key: string, options: { type: 'arrayBuffer'; consistency: 'strong' }): Promise<ArrayBuffer | Uint8Array | null>;
  };
}): SabikRetrieval & {
  getLibraryInfo(): Promise<Readonly<{ library_version: string; corpus_sha256: string; source_git_blob: string; build_head: string }>>;
};
