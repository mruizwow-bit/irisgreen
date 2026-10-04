export function mountSabikVisual(root, initialState="idle") {
  const allowed = new Set(["idle","listening","processing","speaking","degraded"]);
  function setState(next) {
    if (!allowed.has(next)) throw new Error(`Unknown Sabik state: ${next}`);
    root.dataset.state = next;
    root.dispatchEvent(new CustomEvent("sabik:visual-state",{detail:{state:next}}));
  }
  setState(initialState);
  return {setState};
}