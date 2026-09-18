/* The accepted CommonJS machine runs unchanged in its own worker realm. */
(() => {
  "use strict";
  if (typeof document === "undefined") {
    let api, current;
    try {
      self.module = { exports: {} };
      importScripts("sabik-machine.js");
      api = self.module.exports;
      delete self.module;
      for (const name of ["createInitialSabikState", "transitionSabikState", "validateSabikState", "deriveSabikPresentation"]) {
        if (typeof api[name] !== "function") throw new Error("Invalid S0 exports");
      }
      current = api.createInitialSabikState();
      self.postMessage({ id: 0, state: current, presentation: api.deriveSabikPresentation(current) });
      self.onmessage = ({ data }) => {
        try {
          const next = api.transitionSabikState(current, data.event);
          const presentation = api.deriveSabikPresentation(next);
          current = next;
          self.postMessage({ id: data.id, state: current, presentation });
        } catch (error) {
          self.postMessage({ id: data.id, error: error.message });
        }
      };
    } catch (error) {
      delete self.module;
      self.postMessage({ id: 0, error: error.message });
    }
    return;
  }

  const workerUrl = document.currentScript.src;
  window.SabikBrowserAdapter = Object.freeze({
    create() {
      return new Promise((resolve, reject) => {
        const worker = new Worker(workerUrl);
        const pending = new Map();
        let sequence = 0, stopped = false;
        const stop = () => {
          stopped = true;
          worker.terminate();
          for (const request of pending.values()) request.reject(new Error("S0 adapter unavailable"));
          pending.clear();
        };
        worker.onerror = () => { stop(); reject(new Error("S0 adapter could not start")); };
        worker.onmessage = ({ data }) => {
          if (data.id === 0) {
            if (data.error) { stop(); reject(new Error(data.error)); return; }
            resolve(Object.freeze({
              initial: data,
              dispatch(event) {
                if (stopped) return Promise.reject(new Error("S0 adapter unavailable"));
                return new Promise((resolve, reject) => {
                  const id = ++sequence;
                  pending.set(id, { resolve, reject });
                  worker.postMessage({ id, event });
                });
              },
              dispose: stop
            }));
            return;
          }
          const request = pending.get(data.id);
          if (!request) return;
          pending.delete(data.id);
          if (data.error) request.reject(new Error(data.error));
          else request.resolve(data);
        };
      });
    }
  });
})();
