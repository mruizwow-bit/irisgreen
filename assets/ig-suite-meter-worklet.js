/* Iris Green · El taller · medidor de nivel en AudioWorklet.
   Se sirve desde el propio sitio (la política de seguridad no permite módulos desde blob:).
   Calcula pico y valor eficaz de cada canal y los envía unas 20 veces por segundo. */
class IGSMeter extends AudioWorkletProcessor {
  constructor() { super(); this.n = 0; this.peak = [0, 0]; this.sum = [0, 0]; this.count = 0; }
  process(inputs) {
    const input = inputs[0];
    if (input && input.length) {
      for (let c = 0; c < Math.min(2, input.length); c++) {
        const ch = input[c];
        for (let i = 0; i < ch.length; i++) { const v = Math.abs(ch[i]); if (v > this.peak[c]) this.peak[c] = v; this.sum[c] += ch[i] * ch[i]; }
      }
      this.count += input[0].length;
    }
    this.n += 128;
    if (this.n >= sampleRate / 20) {
      const rms = this.sum.map((s) => Math.sqrt(s / Math.max(1, this.count)));
      this.port.postMessage({ peak: this.peak.slice(), rms });
      this.n = 0; this.peak = [0, 0]; this.sum = [0, 0]; this.count = 0;
    }
    return true;
  }
}
registerProcessor('igs-meter', IGSMeter);
