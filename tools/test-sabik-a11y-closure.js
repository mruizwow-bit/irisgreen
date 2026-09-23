const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const css = fs.readFileSync(path.join(root, "sabik", "sabik-page.css"), "utf8");
const html = fs.readFileSync(path.join(root, "es", "nea", "index.html"), "utf8");

function ratio(hex1, hex2) {
  const rgb = hex => hex.match(/[a-f\d]{2}/gi).map(v => parseInt(v, 16) / 255);
  const lum = hex => rgb(hex).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)
    .reduce((s, v, i) => s + v * [.2126,.7152,.0722][i], 0);
  const [a,b] = [lum(hex1), lum(hex2)].sort((x,y)=>y-x);
  return (a + .05) / (b + .05);
}

assert.ok(ratio("#6E7E93", "#F8F6FF") >= 3, "functional border contrast must be >= 3:1");
assert.doesNotMatch(css, /#8492a5/i, "legacy low-contrast functional token must be absent");
assert.match(css, /\.sabik-search-row\s*\{[\s\S]*?border:\s*1px solid #6E7E93;/);
assert.match(css, /\.sabik-search input,\s*\.sabik-widget textarea\s*\{[\s\S]*?border:\s*1px solid #6E7E93;/);
assert.match(css, /\.sabik-button:not\(\.primary\)\s*\{[\s\S]*?border-color:\s*#6E7E93;/);
assert.match(css, /\.sabik-button\.danger\s*\{[\s\S]*?border-color:\s*#6E7E93;/);
assert.match(css, /\.sabik-badge\s*\{[\s\S]*?border:\s*1px solid #6E7E93;/);
assert.match(css, /\.sabik-state-dot\[data-state="minimal"\]\s*\{[\s\S]*?background:\s*#6E7E93;/);
assert.match(css, /\.sabik-icon-button\s*\{[\s\S]*?border:\s*2px solid #6E7E93;/);
assert.match(css, /\.sabik-source-list\s*\{[\s\S]*?gap:\s*12px;/);
assert.match(css, /\.sabik-source-list a\s*\{[\s\S]*?padding-block:\s*10px;/);
assert.match(css, /:focus-visible/);
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);

// WCAG 2.5.8: examples already exceed 24 CSS px, so no 44px inflation is required.
assert.match(css, /\.sabik-examples a\s*\{[\s\S]*?min-height:\s*34px;/);
assert.match(css, /\.sabik-examples\s*\{[\s\S]*?gap:\s*10px;/);

// S1 control identities remain in the integrated markup.
for (const id of ["sabik-toggle","sabik-input","sabik-submit","sabik-low","sabik-shorter","sabik-clear","sabik-resume","sabik-reset-session","sabik-not-this","sabik-other-way"]) {
  assert.ok(html.includes('id="' + id + '"'), "missing S1 control " + id);
}

console.log("A11Y_CLOSURE_PASS");
