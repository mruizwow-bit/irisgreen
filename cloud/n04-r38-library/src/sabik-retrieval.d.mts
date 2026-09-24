export type RetrievalCode = 'LIBRARY_UNAVAILABLE' | 'LIBRARY_VERSION_MISMATCH' | 'LIBRARY_INTEGRITY_ERROR' | 'INVALID_RETRIEVAL_QUERY';
export interface RetrievalFilters {
  source_type?: string;
  editorial_status?: string;
  url?: string;
  concepts?: readonly string[];
}
export interface RetrievalQuery {
  query: string;
  limit?: number;
  filters?: RetrievalFilters;
  libraryVersion?: string;
}
export interface CandidateCitation {
  readonly library_version: string;
  readonly fragment_id: string;
  readonly snippet: string;
  readonly title: string;
  readonly heading: string;
  readonly url: string;
  readonly source_type: string;
  readonly concepts: readonly string[];
  readonly score: number;
}
export interface SabikRetrieval {
  retrieveForSabik(input: RetrievalQuery): Promise<{
    readonly library_version: string;
    readonly candidates: readonly CandidateCitation[];
  }>;
  getFragmentForSabik(input: { fragmentId: string; libraryVersion?: string }): Promise<{
    readonly library_version: string;
    readonly candidate: (Omit<CandidateCitation, 'score'> & { readonly score: null }) | null;
  }>;
}
export declare const RETRIEVAL_CODES: readonly RetrievalCode[];
export declare class SabikRetrievalError extends Error { readonly code: RetrievalCode; constructor(code: RetrievalCode); }
export declare function retrievalFailureCode(error: unknown): RetrievalCode;
export declare function createSabikRetrievalAdapter(options: { readLibrary: (input: { version: string }) => Promise<unknown> }): SabikRetrieval;
