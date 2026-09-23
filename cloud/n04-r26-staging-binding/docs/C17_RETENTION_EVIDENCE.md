# C17 staging retention

Accepted technical target:
- application logs: maximum 7 days;
- no conversation/prompt/response payloads;
- no raw IP application log;
- no private profiles;
- no Educa/minor data.

Candidate logging allowlist:
- timestamp;
- request_id;
- route;
- status;
- latency_ms;
- outcome;
- corpus_version;
- corpus_hash;
- citation_count.

Platform enforcement status:
`PENDING_STAGING_PLATFORM_BINDING`.

R26 prepares the evidence requirement but does not claim Netlify enforcement that has not been observed.
