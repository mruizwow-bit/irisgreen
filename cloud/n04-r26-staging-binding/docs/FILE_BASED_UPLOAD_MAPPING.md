# R26 · file-based upload ↔ named deploy store mapping

## What Netlify documents

Netlify file-based uploads:
- are generated under `.netlify/blobs/deploy`;
- must be created **during the build**, because Netlify clears that directory before each build;
- become deploy-specific blobs;
- preserve directory structure as blob keys.

The accepted N04 addendum explicitly forbids assuming that the first path segment is automatically equivalent to a named `getDeployStore(name)` namespace.

## Candidate mapping under test

Build output:

```
.netlify/blobs/deploy/
└── sabik-n04-corpus/
    ├── manifest.json
    └── versions/
        └── n04-es-20260916-56f72c4d3959/
            └── corpus.json
```

Documented file-upload blob keys:
- `sabik-n04-corpus/manifest.json`
- `sabik-n04-corpus/versions/n04-es-20260916-56f72c4d3959/corpus.json`

Runtime expectation to be proven live:
- named deploy store: `getDeployStore("sabik-n04-corpus")`
- manifest key: `manifest.json`
- corpus key: `versions/n04-es-20260916-56f72c4d3959/corpus.json`

## Fail-closed proof

The live diagnostic Function reads **only** the named store + unprefixed keys above.
It has no fallback to `sabik-n04-corpus/manifest.json` in another namespace.

Therefore:
- if Netlify maps the file-based upload exactly to the named store/keyspace, smoke = PASS;
- if not, smoke = 503 with `manifest_missing_in_named_store`;
- R26/R27 must then change the upload mechanism under an explicit follow-up, never silently adapt at runtime.

No live proof is claimed before an authorized deploy.
