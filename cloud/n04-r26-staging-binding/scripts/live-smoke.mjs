const origin = process.env.N04_STAGING_ORIGIN;
const token = process.env.N04_SMOKE_TOKEN;
if (!origin || !token) throw new Error("N04_STAGING_ORIGIN and N04_SMOKE_TOKEN are required");
const url = new URL("/.netlify/functions/n04-storage-readback", origin);
url.searchParams.set("q", "sobrecarga sensorial");
const response = await fetch(url, { headers: { "x-n04-smoke-token": token } });
const body = await response.json().catch(() => ({}));
const expected = {
  mapping_proof: "PASS",
  version: "n04-es-20260916-56f72c4d3959",
  sha256: "56f72c4d3959a67d99d3a90f6dce20558498c4cd7604472d9a7c67147404c41e",
  fragments: 4332,
  unique_ids: 4332,
  api_activation: "NO_API_ACTIVATION"
};
for (const [key, value] of Object.entries(expected)) {
  if (body[key] !== value) throw new Error(`live smoke mismatch ${key}: ${JSON.stringify(body[key])}`);
}
if (!Array.isArray(body.citations) || body.citations.length === 0 || !body.citations[0].fragment_id || !body.citations[0].url) {
  throw new Error("citation proof missing");
}
console.log(JSON.stringify({ status: "PASS", ...expected, citation: body.citations[0] }, null, 2));
