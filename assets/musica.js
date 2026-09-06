/* Iris Green · reproductor de música
   Suena desde audio/ en el propio dominio. Sin servicios externos, sin cookies,
   sin cuentas. Nada empieza solo: siempre hace falta pulsar.
   Piezas de Pixabay, bajo su licencia de contenido. Autor citado en la lista. */
(function () {
  "use strict";

  var PIEZAS = [
    { f: "un-momento-de-calma.m4a", t: "Un momento de calma", a: "MickeysCat", s: 152 },
    { f: "calma-por-dentro.m4a",    t: "Calma por dentro",    a: "The_Mountain", s: 144 },
    { f: "piano-tranquilo.m4a",     t: "Piano tranquilo",     a: "leberch",     s: 146 },
    { f: "piano-suave.m4a",         t: "Piano suave",         a: "leberch",     s: 172 },
    { f: "piano-minimo.m4a",        t: "Piano mínimo",        a: "leberch",     s: 182 },
    { f: "bajo-el-agua.m4a",        t: "Bajo el agua",        a: "leberch",     s: 192 },
    { f: "piano-fondo.m4a",         t: "Piano de fondo",      a: "andriih",     s: 134 },
    { f: "piano-flores.m4a",        t: "Piano y flores",      a: "andriih",     s: 137 },
    { f: "entre-estrellas.m4a",     t: "Entre estrellas",     a: "The_Mountain", s: 90 },
  ];

  var STR = {
    es: { titulo: "Música", lede: "Suena desde esta web. No se conecta a ninguna otra.",
          play: "Escuchar", pausa: "Pausa", sig: "Siguiente", ant: "Anterior",
          vol: "Volumen", bucle: "Repetir la lista", creditos: "Música de Pixabay. Autor de cada pieza en la lista." },
    en: { titulo: "Music", lede: "It plays from this site. It connects to nothing else.",
          play: "Play", pausa: "Pause", sig: "Next", ant: "Previous",
          vol: "Volume", bucle: "Repeat the list", creditos: "Music from Pixabay. Each piece credits its author." },
    pt: { titulo: "Música", lede: "Toca a partir deste site. Não se conecta a nenhum outro.",
          play: "Ouvir", pausa: "Pausa", sig: "Seguinte", ant: "Anterior",
          vol: "Volume", bucle: "Repetir a lista", creditos: "Música do Pixabay. O autor de cada peça está na lista." }
  };

  function base() {
    var s = document.currentScript;
    if (!s) {
      var todos = document.getElementsByTagName("script");
      for (var i = todos.length - 1; i >= 0; i--) {
        if (/musica\.js/.test(todos[i].src)) { s = todos[i]; break; }
      }
    }
    return s ? s.src.replace(/assets\/musica\.js.*$/, "") : "/";
  }

  function idioma() {
    var l = (document.documentElement.lang || "es").toLowerCase();
    if (l.indexOf("en") === 0) return "en";
    if (l.indexOf("pt") === 0) return "pt";
    return "es";
  }

  function reloj(seg) {
    var m = Math.floor(seg / 60), s = Math.round(seg % 60);
    if (s === 60) { m += 1; s = 0; }
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function arranca() {
    var panel = document.getElementById("pl");
    if (!panel || panel.dataset.igMusica === "on") return;
    panel.dataset.igMusica = "on";

    var T = STR[idioma()], RAIZ = base() + "audio/";
    var audio = new Audio();
    audio.preload = "none";
    audio.volume = 0.6;
    var actual = -1, bucle = true;

    panel.innerHTML = "";

    var css = document.createElement("style");
    css.textContent =
      ".ig-mus{font-size:15px}" +
      ".ig-mus p.lede{margin:0 0 10px;font-size:14.5px;color:#5a6675}" +
      ".ig-mus ol{list-style:none;margin:0 0 12px;padding:0;max-height:min(46vh,320px);overflow-y:auto}" +
      ".ig-mus li{margin:0}" +
      ".ig-mus .pieza{display:flex;gap:10px;align-items:baseline;width:100%;text-align:left;background:none;border:0;border-radius:10px;padding:8px 10px;cursor:pointer;font:inherit;color:inherit}" +
      ".ig-mus .pieza:hover{background:rgba(23,57,92,.06)}" +
      '.ig-mus .pieza[aria-current="true"]{background:rgba(31,95,139,.12);font-weight:600}' +
      ".ig-mus .aut{color:#5a6675;font-size:13.5px}" +
      ".ig-mus .dur{margin-left:auto;color:#5a6675;font-size:13px;font-variant-numeric:tabular-nums}" +
      ".ig-mus .mandos{display:flex;gap:8px;align-items:center;flex-wrap:wrap;border-top:1px solid rgba(23,57,92,.12);padding-top:10px}" +
      ".ig-mus .mandos button{background:#fff;border:1px solid rgba(23,57,92,.18);border-radius:999px;min-height:40px;padding:8px 14px;cursor:pointer;font:inherit;color:#17395c}" +
      ".ig-mus .mandos button:hover{background:rgba(23,57,92,.06)}" +
      ".ig-mus .vol{display:flex;gap:7px;align-items:center;margin-left:auto;font-size:13.5px;color:#5a6675}" +
      ".ig-mus .vol input{width:110px}" +
      ".ig-mus .cred{margin:10px 0 0;font-size:13px;color:#5a6675}";
    panel.appendChild(css);

    var caja = document.createElement("div");
    caja.className = "ig-mus";
    caja.innerHTML = "<h2>" + T.titulo + "</h2><p class='lede'>" + T.lede + "</p>";

    var lista = document.createElement("ol");
    PIEZAS.forEach(function (p, n) {
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pieza";
      b.setAttribute("aria-current", "false");
      b.innerHTML = "<span>" + p.t + "</span><span class='aut'>" + p.a +
                    "</span><span class='dur'>" + reloj(p.s) + "</span>";
      b.addEventListener("click", function () { pon(n); });
      li.appendChild(b);
      lista.appendChild(li);
    });
    caja.appendChild(lista);

    var mandos = document.createElement("div");
    mandos.className = "mandos";
    var bAnt = boton(T.ant), bPlay = boton(T.play), bSig = boton(T.sig), bBucle = boton(T.bucle);
    bBucle.setAttribute("aria-pressed", "true");
    mandos.appendChild(bAnt); mandos.appendChild(bPlay); mandos.appendChild(bSig); mandos.appendChild(bBucle);

    var vol = document.createElement("label");
    vol.className = "vol";
    vol.innerHTML = "<span>" + T.vol + "</span>";
    var slider = document.createElement("input");
    slider.type = "range"; slider.min = "0"; slider.max = "100"; slider.value = "60";
    slider.setAttribute("aria-label", T.vol);
    slider.addEventListener("input", function () { audio.volume = slider.value / 100; });
    vol.appendChild(slider);
    mandos.appendChild(vol);
    caja.appendChild(mandos);

    var cred = document.createElement("p");
    cred.className = "cred";
    cred.textContent = T.creditos;
    caja.appendChild(cred);

    panel.appendChild(caja);

    function boton(txt) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = txt;
      return b;
    }

    function marca() {
      var bs = lista.querySelectorAll(".pieza");
      for (var i = 0; i < bs.length; i++) {
        bs[i].setAttribute("aria-current", i === actual ? "true" : "false");
      }
      bPlay.textContent = (!audio.paused && actual >= 0) ? T.pausa : T.play;
    }

    function pon(n) {
      if (n < 0) n = PIEZAS.length - 1;
      if (n >= PIEZAS.length) { if (!bucle) { audio.pause(); marca(); return; } n = 0; }
      actual = n;
      audio.src = RAIZ + PIEZAS[n].f;
      audio.play().catch(function () {});
      marca();
    }

    bPlay.addEventListener("click", function () {
      if (actual < 0) { pon(0); return; }
      if (audio.paused) { audio.play().catch(function () {}); } else { audio.pause(); }
      marca();
    });
    bSig.addEventListener("click", function () { pon(actual + 1); });
    bAnt.addEventListener("click", function () { pon(actual - 1); });
    bBucle.addEventListener("click", function () {
      bucle = !bucle;
      bBucle.setAttribute("aria-pressed", bucle ? "true" : "false");
      bBucle.style.background = bucle ? "#1f5f8b" : "#fff";
      bBucle.style.color = bucle ? "#fff" : "#17395c";
    });
    bBucle.style.background = "#1f5f8b";
    bBucle.style.color = "#fff";

    audio.addEventListener("ended", function () { pon(actual + 1); });
    audio.addEventListener("play", marca);
    audio.addEventListener("pause", marca);
    marca();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", arranca);
  } else {
    arranca();
  }
})();
