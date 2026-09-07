/* Iris Green · imágenes de YouTube. No crea iframes ni inicia reproducción. */
(function () {
  'use strict';
  if (window.IGVideoThumbs) return;
  var VALID = /^[A-Za-z0-9_-]{11}$/;
  function videoId(value) {
    if (typeof value !== 'string') return '';
    if (VALID.test(value)) return value;
    try {
      var url = new URL(value);
      var host = url.hostname.toLowerCase();
      var parts = url.pathname.split('/').filter(Boolean);
      var id = '';
      if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].indexOf(host) >= 0) {
        id = url.searchParams.get('v') || (['embed', 'shorts', 'live'].indexOf(parts[0]) >= 0 ? parts[1] : '');
      } else if (host === 'youtu.be') id = parts[0];
      else if (host === 'i.ytimg.com' && parts[0] === 'vi') id = parts[1];
      return VALID.test(id || '') ? id : '';
    } catch (_) { return ''; }
  }
  function src(value) {
    var id = videoId(value);
    return id ? 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg' : '';
  }
  function unavailableText() {
    var lang = (document.documentElement.lang || 'es').toLowerCase();
    if (lang.indexOf('en') === 0) return 'Thumbnail unavailable';
    if (lang.indexOf('pt') === 0) return 'Miniatura indisponível';
    return 'Miniatura no disponible';
  }
  function Thumbnail(props) {
    var React = window.React;
    var state = React.useState(0), attempt = state[0], setAttempt = state[1];
    var id = props.id;
    if (attempt >= 2) {
      return React.createElement('span', {
        className: 'ig-yt-thumbnail-unavailable', 'data-video-id': id,
        style: { position: 'absolute', bottom: '12px', left: '12px', right: '12px', color: '#17395c', fontSize: '14px', textAlign: 'center' }
      }, unavailableText());
    }
    var source = 'https://i.ytimg.com/vi/' + id + '/' + (attempt ? 'mqdefault.jpg' : 'hqdefault.jpg');
    function next() { setAttempt(function (n) { return Math.min(n + 1, 2); }); }
    return React.createElement('img', {
      key: source, src: source, alt: '', className: 'ig-yt-thumbnail',
      'data-video-id': id, loading: 'lazy', decoding: 'async',
      width: attempt ? 320 : 480, height: attempt ? 180 : 360,
      referrerPolicy: 'no-referrer',
      onError: next,
      onLoad: function (event) {
        // YouTube sometimes returns a small placeholder rather than a usable image.
        if (event.currentTarget.naturalWidth < 320) next();
      },
      style: { position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }
    });
  }
  function image(value) {
    var id = videoId(value);
    return id && window.React ? window.React.createElement(Thumbnail, { id: id, key: id }) : null;
  }
  window.IGVideoThumbs = Object.freeze({ id: videoId, src: src, image: image });
})();
