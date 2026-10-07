/* Continue a downloaded project, in memory only. No browser project storage. */
(function () {
  'use strict';
  const button = document.getElementById('r44-continue');
  if (!button) return;
  const en = document.documentElement.lang === 'en';
  const status = document.getElementById('r44-file-status');
  const say = (es, english) => { status.textContent = en ? english : es; };
  const routes = JSON.parse(document.getElementById('r44-project-routes').textContent);
  button.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.igtaller.json,.json,application/json';
    input.addEventListener('change', async () => {
      const file = input.files[0];
      if (!file) return;
      if (file.size > 8 * 1024 * 1024) { say('El archivo supera 8 MB.', 'The file exceeds 8 MB.'); return; }
      let project;
      try { project = JSON.parse(await file.text()); } catch (_) {
        say('No se ha podido leer ese proyecto.', 'That project could not be read.'); return;
      }
      if (!project || project.formato !== 'iris-green-taller' || !Object.hasOwn(routes, project.estudio) || !project.datos) {
        say('Elige un archivo de proyecto de Creación.', 'Choose a Creation project file.'); return;
      }
      button.disabled = true;
      say('Abriendo tu proyecto…', 'Opening your project…');
      const frame = document.createElement('iframe');
      frame.className = 'r44-project-frame';
      frame.title = en ? 'Your project' : 'Tu proyecto';
      const modeKey=project.estudio + ':' + project.modo;
      frame.src = Object.hasOwn(routes,modeKey) ? routes[modeKey] : routes[project.estudio];
      frame.hidden = true;
      const fail = () => { frame.remove(); button.disabled = false; say('No se ha podido abrir. El archivo original sigue intacto.', 'Could not open. Your original file is unchanged.'); };
      const timeout = setTimeout(fail, 30000);
      frame.addEventListener('load', () => {
        const doc = frame.contentDocument;
        const load = () => {
          const app = doc.getElementById('igt-app'), api = app && app.igCreative;
          if (!api) return;
          clearTimeout(timeout);
          try {
            if (!api.engine.validate(project.datos)) { fail(); return; }
            api.replaceProject(() => api.engine.restore(project.datos), en ? 'Project opened' : 'Proyecto abierto');
            frame.hidden = false;
            document.querySelector('main.igk').hidden = true;
            frame.focus();
          } catch (_) { fail(); }
        };
        doc.addEventListener('igs:ready', load, {once:true}); load();
      }, {once:true});
      document.body.append(frame);
    }, {once:true});
    input.click();
  });
})();
