(function (global) {
  'use strict';

  const UI = Object.freeze({
    es: Object.freeze({
      heading: 'Resultados en Iris Green',
      empty: 'No hay resultados de Iris Green para esta consulta.',
      error: 'No se pudieron cargar los resultados de Iris Green. Puedes volver a intentarlo.',
      cancelled: 'La consulta se canceló. No se mostrarán resultados antiguos.',
      retry: 'Reintentar',
      headingLabel: 'Apartado',
      sourceTypeLabel: 'Tipo de fuente',
      fragmentLabel: 'ID de fragmento',
      versionLabel: 'Versión de biblioteca',
      conceptsLabel: 'Conceptos',
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
      headingLabel: 'Section',
      sourceTypeLabel: 'Source type',
      fragmentLabel: 'Fragment ID',
      versionLabel: 'Library version',
      conceptsLabel: 'Concepts',
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
    if (!nonEmptyString(value)) return null;
    try {
      const parsed = new URL(value);
      return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : null;
    } catch (_) {
      return null;
    }
  }

  function normalizeEnvelope(value) {
    if (!dataObject(value) || !nonEmptyString(value.library_version) || !Array.isArray(value.candidates)) {
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
      if (typeof candidate.score !== 'number' || !Number.isFinite(candidate.score)) {
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

    return Object.freeze({ library_version: version, candidates: Object.freeze(candidates) });
  }

  function setText(node, value) {
    node.textContent = String(value);
    return node;
  }

  function appendLabelValue(document, parent, label, value) {
    const line = document.createElement('p');
    line.className = 'sabik-memory-note sabik-retrieval-meta';
    const strong = document.createElement('strong');
    setText(strong, `${label}: `);
    line.appendChild(strong);
    line.appendChild(document.createTextNode(String(value)));
    parent.appendChild(line);
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

    root.setAttribute('data-retrieval-state', viewState);
    root.setAttribute('aria-busy', 'false');

    function strings() {
      return UI[lang];
    }

    function announce(message) {
      if (!announcement || typeof announcement.replaceChildren !== 'function' || !message) return;
      announcement.replaceChildren(document.createTextNode(message));
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
      root.replaceChildren(box);
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

      envelope.candidates.forEach(candidate => {
        const item = document.createElement('li');
        item.className = 'sabik-retrieval-result';
        item.setAttribute('data-fragment-id', candidate.fragment_id);
        item.setAttribute('data-library-version', candidate.library_version);
        item.setAttribute('data-source-type', candidate.source_type);
        item.setAttribute('data-score', String(candidate.score));

        const link = document.createElement('a');
        link.setAttribute('href', candidate.url);
        link.className = 'sabik-retrieval-link';
        const linkText = candidate.title.trim() || candidate.heading.trim() || candidate.url;
        setText(link, linkText);
        item.appendChild(link);

        if (candidate.heading && candidate.heading !== linkText) {
          appendLabelValue(document, item, strings().headingLabel, candidate.heading);
        }

        const snippet = document.createElement('p');
        snippet.className = 'sabik-retrieval-snippet';
        setText(snippet, candidate.snippet);
        item.appendChild(snippet);

        appendLabelValue(document, item, strings().sourceTypeLabel, candidate.source_type);
        appendLabelValue(document, item, strings().fragmentLabel, candidate.fragment_id);
        appendLabelValue(document, item, strings().versionLabel, candidate.library_version);
        if (candidate.concepts.length) {
          appendLabelValue(document, item, strings().conceptsLabel, candidate.concepts.join(' · '));
        }
        list.appendChild(item);
      });

      section.appendChild(list);
      root.replaceChildren(section);
      setState('results');
      announce(strings().resultsAnnouncement(envelope.candidates.length));
      return Object.freeze({
        status: 'results',
        count: envelope.candidates.length,
        library_version: envelope.library_version
      });
    }

    function cancelledError(error) {
      return Boolean(error && (error.name === 'AbortError' || error.code === 'ABORT_ERR' || error.code === 'RETRIEVAL_CANCELLED'));
    }

    async function run(request) {
      const token = ++serial;
      pending = true;
      lastRequest = request;
      root.setAttribute('aria-busy', 'true');

      try {
        const raw = await query(request);
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
          root.setAttribute('aria-busy', 'false');
        }
      }
    }

    function cancel() {
      if (!pending) return Object.freeze({ status: viewState, cancelled: false });
      serial += 1;
      pending = false;
      lastEnvelope = null;
      root.setAttribute('aria-busy', 'false');
      renderStatus('cancelled', strings().cancelled, strings().cancelledAnnouncement);
      return Object.freeze({ status: 'cancelled', cancelled: true });
    }

    function setLanguage(nextLanguage) {
      lang = validLanguage(nextLanguage);
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
