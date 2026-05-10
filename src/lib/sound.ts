/**
 * Tiny WebAudio sound effects — no asset files.
 * SSR-safe (only touches AudioContext on first call in the browser).
 * Respects a muted preference in localStorage.
 */

let ctx: AudioContext | null = null;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  return ctx;
}

function isMuted() {
  if (typeof window === "undefined") return true;
  return localStorage.getItem("ischool:muted") === "1";
}

export function setMuted(m: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem("ischool:muted", m ? "1" : "0");
  window.dispatchEvent(new CustomEvent("ischool:muted-changed"));
}

export function getMuted() {
  return isMuted();
}

function tone(freq: number, dur = 0.15, type: OscillatorType = "sine", gain = 0.08, when = 0) {
  if (isMuted()) return;
  const a = ac();
  if (!a) return;
  const t = a.currentTime + when;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(a.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const sfx = {
  click: () => tone(620, 0.06, "triangle", 0.05),
  correct: () => {
    tone(660, 0.12, "sine", 0.07, 0);
    tone(880, 0.16, "sine", 0.07, 0.08);
  },
  wrong: () => {
    tone(220, 0.18, "sawtooth", 0.06, 0);
    tone(160, 0.22, "sawtooth", 0.06, 0.08);
  },
  tick: () => tone(1200, 0.04, "square", 0.03),
  win: () => {
    [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.18, "triangle", 0.08, i * 0.1));
  },
  levelUp: () => {
    [440, 554, 660, 880].forEach((f, i) => tone(f, 0.14, "sine", 0.07, i * 0.07));
  },
};
