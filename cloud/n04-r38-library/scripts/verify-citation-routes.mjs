import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const release = JSON.parse(await readFile(new URL('../build/library-v2/release.json', import.meta.url), 'utf8'));
const corpusPath = new URL('../build/library-v2/' + release.corpus_key.replace(/^cloud-library\//, ''), import.meta.url);
const corpus = JSON.parse(await readFile(corpusPath, 'utf8'));

function repoPathFromCitation(raw) {
  const url = new URL(raw);
  if (url.origin !== 'https://irisgreen.eu') throw new Error('Unexpected citation origin: ' + raw);
  let path = decodeURIComponent(url.pathname).replace(/^\/+/, '');
  if (!path || path.endsWith('/')) path += 'index.html';
  return path;
}
function existsAtPinnedCommit(path) {
  try {
    execFileSync('git', ['cat-file', '-e', release.source_commit + ':' + path], { cwd: root, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const urls = [...new Set(corpus.fragments.map(f => f.url))].sort();
const broken = [];
for (const url of urls) {
  const path = repoPathFromCitation(url);
  if (!existsAtPinnedCommit(path)) broken.push({ url, path });
}
const duplicateTitleUrls = corpus.fragments
  .filter(f => f.locale === 'en' && f.source_type === 'data' && f.title === 'Employment and autism')
  .map(f => f.url).sort();
const expectedDuplicateTitleUrls = [
  'https://irisgreen.eu/en/data/employment-and-autism-australia/',
  'https://irisgreen.eu/en/data/employment-and-autism-united-kingdom/'
];
if (JSON.stringify(duplicateTitleUrls) !== JSON.stringify(expectedDuplicateTitleUrls)) {
  broken.push({ kind: 'duplicate_title_canonical_route_mismatch', actual: duplicateTitleUrls });
}
const report = {
  schema: 'R39_A9_CITATION_ROUTE_AUDIT/1.0',
  source_commit: release.source_commit,
  library_version: release.version,
  checked_citation_records: corpus.fragments.length,
  checked_unique_urls: urls.length,
  broken_count: broken.length,
  duplicate_title_urls: duplicateTitleUrls,
  broken
};
console.log(JSON.stringify(report, null, 2));
if (broken.length) process.exitCode = 1;
