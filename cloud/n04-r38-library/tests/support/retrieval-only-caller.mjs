// Test caller only. There is deliberately no response-generation dependency.
export function createRetrievalOnlyCaller({ retrieval }) {
  return Object.freeze({
    async run(request) {
      const sources = await retrieval.retrieveForSabik(request);
      return Object.freeze({ phase: 'retrieval_only', sources, response: null });
    },
  });
}
