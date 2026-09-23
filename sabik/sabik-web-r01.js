/* B3 is a presentation of explicit operations, never a cognitive classifier. */
(() => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const states = {
    PRESENTE: ['presente', 'PRESENTE', 'PRESENT'],
    ORIENTAR: ['orientar', 'ORIENTAR', 'GUIDE'],
    TRANSICION: ['transicion', 'TRANSICIÓN', 'TRANSITION'],
    PAUSA: ['pausa', 'PAUSA', 'PAUSED'],
    CONFIRMAR: ['confirmar', 'CONFIRMAR', 'CONFIRM']
  };
  let current = { interaction: 'espera', protection: 'normal', lowIntensity: false };
  let revision = 0;
  const masters = new Map();
  function readyMaster(asset) {
    if (!masters.has(asset)) {
      const image = new Image(544, 544);
      image.alt = '';
      image.id = 'sabik-web-master';
      image.decoding = 'async';
      image.src = '/sabik/assets/web-r01/web_' + states[asset][0] + '.png';
      masters.set(asset, image.decode().then(() => image).catch(() => null));
    }
    return masters.get(asset);
  }
  function render(next) {
    if (next) current = next;
    const visual = document.querySelector('#sabik-hologram');
    const master = document.querySelector('#sabik-web-master');
    if (!visual || !master) return;
    // Protection stabilises the presence; it does not diagnose overload.
    const state = current.interaction === 'pausa' ? 'PAUSA'
      : current.protection === 'riesgo' ? 'PRESENTE'
      : current.interaction === 'procesando' ? 'TRANSICION'
      : current.interaction === 'confirmacion' ? 'CONFIRMAR'
      : ['respuesta', 'correccion'].includes(current.interaction) ? 'ORIENTAR' : 'PRESENTE';
    const still = media.matches || document.documentElement.dataset.igMotion === 'off' || current.lowIntensity;
    const asset = still ? 'PRESENTE' : state;
    const src = '/sabik/assets/web-r01/web_' + states[asset][0] + '.png';
    const thisRevision = ++revision;
    if (master.getAttribute('src') !== src) {
      // Keep the complete current master visible until its replacement is decoded.
      // A stale request must not overwrite a newer pause/reduced-motion state.
      readyMaster(asset).then(image => {
        if (!image || thisRevision !== revision) return;
        document.querySelector('#sabik-web-master')?.replaceWith(image);
        visual.dataset.webAsset = asset;
      });
    } else visual.dataset.webAsset = asset;
    // B3 is decorative. Functional status and the existing live region carry meaning.
    // Technical state names remain metadata, never user-facing labels or announcements.
    visual.dataset.webState = state;
  }
  window.SabikWebPresentation = { render };
  for (const asset of Object.keys(states)) readyMaster(asset);
  media.addEventListener('change', () => render());
  new MutationObserver(() => render()).observe(document.documentElement, {
    attributes: true, attributeFilter: ['lang', 'data-ig-motion']
  });
})();
