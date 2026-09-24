(function (global) {
  'use strict';

  const UI = Object.freeze({
    es: Object.freeze({
      heading: 'Resultados en Iris Green',
      empty: 'No hay resultados de Iris Green para esta consulta.',
      error: 'No se pudieron cargar los resultados de Iris Green. Puedes volver a intentarlo.',
      cancelled: 'La consulta se canceló. No se mostrarán resultados antiguos.',
      retry: 'Reintentar',
      resultsAnnouncement: count => count === 1 ? '1 resultado disponible.' : `${count} resultados disponibles.`,
      emptyAnnouncement: 'No hay resultados disponibles.',
      errorAnnouncement: 'No se pudieron cargar los resultados. Puedes volver a intentarlo.',
      cancelledAnnouncement: 'Consulta cancelada.'
    }),
    en: Object.freeze({
      heading: 'Results from Iris Green',
      empty: 'There are no Iris Green results for this query.',
      error: 'The Iris Green results could not be loaded. You can try again.',
      cancelled: 'The query was cancelled. Older results will not be shown.',
      retry: 'Try again',
      resultsAnnouncement: count => count === 1 ? '1 result available.' : `${count} results available.`,
      emptyAnnouncement: 'No results are available.',
      errorAnnouncement: 'The results could not be loaded. You can try again.',
      cancelledAnnouncement: 'Query cancelled.'
    })
  });

  const VIEW_STATES = Object.freeze(['idle', 'results', 'empty', 'error', 'cancelled']);

  function validLanguage(value) {
    return value === 'en' ? 'en' : 'es';
  }

  function dataObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function nonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  function safeHttpUrl(value) {
    if (!nonEmptyString(value) || /[\u0000-\u0020\u007f]/u.test(value)) return null;
    try {
      const parsed = new URL(value);
      return parsed.origin === 'https://irisgreen.eu' && !parsed.username && !parsed.password ? value : null;
    } catch (_) {
      return null;
    }
  }

  function normalizeEnvelope(value) {
    if (!dataObject(value) || !nonEmptyString(value.library_version) || !Array.isArray(value.candidates) ||
        !Array.isArray(value.groups) || value.source_language !== 'es') {
      throw new TypeError('Invalid retrieval result');
    }

    const version = value.library_version;
    const candidates = value.candidates.map(candidate => {
      if (!dataObject(candidate)) throw new TypeError('Invalid retrieval result');
      if (!nonEmptyString(candidate.fragment_id)) throw new TypeError('Invalid retrieval result');
      if (candidate.library_version !== version) throw new TypeError('Invalid retrieval result');
      if (typeof candidate.snippet !== 'string' || typeof candidate.title !== 'string' ||
          typeof candidate.heading !== 'string' || typeof candidate.source_type !== 'string') {
        throw new TypeError('Invalid retrieval result');
      }
      if (!Array.isArray(candidate.concepts) || candidate.concepts.some(item => typeof item !== 'string')) {
        throw new TypeError('Invalid retrieval result');
      }
      if (!Number.isSafeInteger(candidate.score) || candidate.score < 1) {
        throw new TypeError('Invalid retrieval result');
      }
      const url = safeHttpUrl(candidate.url);
      if (!url) throw new TypeError('Invalid retrieval result');

      return Object.freeze({
        library_version: candidate.library_version,
        fragment_id: candidate.fragment_id,
        snippet: candidate.snippet,
        url,
        title: candidate.title,
        heading: candidate.heading,
        source_type: candidate.source_type,
        concepts: Object.freeze(candidate.concepts.slice()),
        score: candidate.score
      });
    });

    // Validate the supplied A1 projection without regrouping or reranking it.
    const byId = new Map(candidates.map((candidate, index) => [candidate.fragment_id, { candidate, index }]));
    if (byId.size !== candidates.length) throw new TypeError('Invalid retrieval result');
    const usedIds = new Set();
    const usedUrls = new Set();
    let previousFirst = -1;
    const groups = value.groups.map(group => {
      if (!dataObject(group) || !safeHttpUrl(group.url) || usedUrls.has(group.url) ||
          !Array.isArray(group.citations) || !group.citations.length) throw new TypeError('Invalid retrieval result');
      usedUrls.add(group.url);
      let previousIndex = -1;
      const citations = group.citations.map((citation, offset) => {
        const entry = byId.get(citation?.fragment_id);
        if (!entry || usedIds.has(citation.fragment_id) || citation.url !== group.url ||
            entry.index <= previousIndex || (offset === 0 && entry.index <= previousFirst) ||
            Object.keys(entry.candidate).some(key => JSON.stringify(citation[key]) !== JSON.stringify(entry.candidate[key]))) {
          throw new TypeError('Invalid retrieval result');
        }
        if (offset === 0) previousFirst = entry.index;
        previousIndex = entry.index;
        usedIds.add(citation.fragment_id);
        return entry.candidate;
      });
      return Object.freeze({ url: group.url, citations: Object.freeze(citations) });
    });
    if (usedIds.size !== candidates.length) throw new TypeError('Invalid retrieval result');
    return Object.freeze({ library_version: version, candidates: Object.freeze(candidates),
      groups: Object.freeze(groups), source_language: value.source_language });
  }

  function setText(node, value) {
    node.textContent = String(value);
    return node;
  }

  function createRetrievalPanel({ root, query, announcement = null, language = 'es' } = {}) {
    if (!root || typeof root.replaceChildren !== 'function' || !root.ownerDocument) {
      throw new TypeError('A DOM root is required');
    }
    if (typeof query !== 'function') throw new TypeError('A query function is required');

    const document = root.ownerDocument;
    let lang = validLanguage(language);
    let serial = 0;
    let pending = false;
    let viewState = 'idle';
    let lastRequest = null;
    let lastEnvelope = null;
    let controller = null;

    root.setAttribute('data-retrieval-state', viewState);
    root.setAttribute('aria-busy', 'false');
    root.setAttribute('lang', lang);

    function strings() {
      return UI[lang];
    }

    function announce(message) {
      if (!announcement || typeof announcement.replaceChildren !== 'function' || !message) return;
      announcement.setAttribute('lang', lang);
      announcement.replaceChildren(document.createTextNode(message));
    }

    function replaceView(node) {
      const active = document.activeElement;
      const restore = active && root.contains(active);
      const href = restore ? active.getAttribute('href') : null;
      root.replaceChildren(node);
      if (!restore) return;
      const walk = parent => Array.from(parent.children || []).flatMap(child => [child, ...walk(child)]);
      const children = walk(root);
      const equivalent = href ? children.find(child => child.getAttribute?.('href') === href) :
        children.find(child => child.className === active.className && child.tagName === active.tagName);
      const target = equivalent || children.find(child => child.tagName === 'H4' || child.tagName === 'P');
      if (target) {
        if (!equivalent) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    }

    function setState(next) {
      if (!VIEW_STATES.includes(next)) throw new TypeError('Invalid view state');
      viewState = next;
      root.setAttribute('data-retrieval-state', next);
    }

    function retryButton() {
      if (lastRequest === null) return null;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'sabik-button sabik-retrieval-retry';
      setText(button, strings().retry);
      button.addEventListener('click', () => { void run(lastRequest); });
      return button;
    }

    function renderStatus(kind, message, announcementText) {
      const box = document.createElement('div');
      box.className = `sabik-retrieval-state sabik-retrieval-${kind}`;
      const paragraph = document.createElement('p');
      paragraph.className = 'sabik-notice';
      setText(paragraph, message);
      box.appendChild(paragraph);
      if (kind === 'error' || kind === 'cancelled') {
        const retry = retryButton();
        if (retry) box.appendChild(retry);
      }
      replaceView(box);
      setState(kind);
      announce(announcementText);
    }

    function renderResults(envelope) {
      if (envelope.candidates.length === 0) {
        renderStatus('empty', strings().empty, strings().emptyAnnouncement);
        return Object.freeze({ status: 'empty', count: 0, library_version: envelope.library_version });
      }

      const section = document.createElement('section');
      section.className = 'sabik-retrieval-results';
      const heading = document.createElement('h4');
      heading.className = 'sabik-source-title';
      setText(heading, strings().heading);
      section.appendChild(heading);

      const list = document.createElement('ol');
      list.className = 'sabik-source-list sabik-retrieval-list';

      envelope.groups.forEach(group => {
        const candidate = group.citations[0];
        const item = document.createElement('li');
        item.className = 'sabik-retrieval-result';

        const link = document.createElement('a');
        link.setAttribute('href', group.url);
        link.setAttribute('lang', envelope.source_language);
        link.className = 'sabik-retrieval-link';
        const linkText = candidate.title.trim() || candidate.heading.trim() || candidate.url;
        setText(link, linkText);
        item.appendChild(link);

        group.citations.forEach(citation => {
          const fragment = document.createElement('div');
          fragment.className = 'sabik-retrieval-citation';
          fragment.setAttribute('lang', envelope.source_language);
          fragment.setAttribute('data-fragment-id', citation.fragment_id);
          fragment.setAttribute('data-library-version', citation.library_version);
          fragment.setAttribute('data-source-type', citation.source_type);
          fragment.setAttribute('data-score', String(citation.score));
          if (citation.title && citation.title !== linkText) {
            const citationTitle = document.createElement('p');
            citationTitle.className = 'sabik-retrieval-heading';
            setText(citationTitle, citation.title);
            fragment.appendChild(citationTitle);
          }
          if (citation.heading && citation.heading !== linkText) {
            const sourceHeading = document.createElement('p');
            sourceHeading.className = 'sabik-retrieval-heading';
            setText(sourceHeading, citation.heading);
            fragment.appendChild(sourceHeading);
          }
          const snippet = document.createElement('p');
          snippet.className = 'sabik-retrieval-snippet';
          setText(snippet, citation.snippet);
          fragment.appendChild(snippet);
          item.appendChild(fragment);
        });
        list.appendChild(item);
      });

      section.appendChild(list);
      replaceView(section);
      setState('results');
      announce(strings().resultsAnnouncement(envelope.groups.length));
      return Object.freeze({
        status: 'results',
        count: envelope.groups.length,
        library_version: envelope.library_version
      });
    }

    function cancelledError(error) {
      return Boolean(error && (error.name === 'AbortError' || error.code === 'ABORT_ERR' || error.code === 'REQUEST_CANCELLED'));
    }

    async function run(request) {
      const token = ++serial;
      controller?.abort();
      controller = new AbortController();
      const signal = controller.signal;
      pending = true;
      lastRequest = request;
      root.setAttribute('aria-busy', 'true');

      try {
        const raw = await query(request, { signal });
        if (token !== serial) return Object.freeze({ status: 'stale' });
        const envelope = normalizeEnvelope(raw);
        lastEnvelope = envelope;
        return renderResults(envelope);
      } catch (error) {
        if (token !== serial) return Object.freeze({ status: 'stale' });
        lastEnvelope = null;
        if (cancelledError(error)) {
          renderStatus('cancelled', strings().cancelled, strings().cancelledAnnouncement);
          return Object.freeze({ status: 'cancelled' });
        }
        renderStatus('error', strings().error, strings().errorAnnouncement);
        return Object.freeze({ status: 'error' });
      } finally {
        if (token === serial) {
          pending = false;
          controller = null;
          root.setAttribute('aria-busy', 'false');
        }
      }
    }

    function cancel() {
      if (!pending) return Object.freeze({ status: viewState, cancelled: false });
      serial += 1;
      controller?.abort();
      controller = null;
      pending = false;
      lastEnvelope = null;
      root.setAttribute('aria-busy', 'false');
      renderStatus('cancelled', strings().cancelled, strings().cancelledAnnouncement);
      return Object.freeze({ status: 'cancelled', cancelled: true });
    }

    function setLanguage(nextLanguage) {
      lang = validLanguage(nextLanguage);
      root.setAttribute('lang', lang);
      if (viewState === 'results' && lastEnvelope) renderResults(lastEnvelope);
      else if (viewState === 'empty') renderStatus('empty', strings().empty, strings().emptyAnnouncement);
      else if (viewState === 'error') renderStatus('error', strings().error, strings().errorAnnouncement);
      else if (viewState === 'cancelled') renderStatus('cancelled', strings().cancelled, strings().cancelledAnnouncement);
      return lang;
    }

    function getState() {
      return Object.freeze({ state: viewState, pending, language: lang });
    }

    return Object.freeze({ run, cancel, setLanguage, getState });
  }

  const api = Object.freeze({ createRetrievalPanel });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (global && typeof global === 'object') global.SabikRetrievalPanel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
