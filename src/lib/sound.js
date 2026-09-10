// Tiny WebAudio synth for UI + game sounds. No assets, all procedural.
let ctx = null
let master = null
let enabled = false
const listeners = new Set()

function ensure() {
  if (ctx) return ctx
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0.35
  master.connect(ctx.destination)
  return ctx
}

export function setSoundEnabled(v) {
  enabled = !!v
  try { localStorage.setItem('amelia-sound', enabled ? '1' : '0') } catch {}
  if (enabled) { ensure(); ctx?.resume?.() }
  listeners.forEach((l) => l(enabled))
}
export function isSoundEnabled() { return enabled }
export function onSoundChange(fn) { listeners.add(fn); return () => listeners.delete(fn) }
try { enabled = localStorage.getItem('amelia-sound') === '1' } catch {}

function tone({ freq = 440, type = 'sine', dur = 0.12, vol = 0.5, attack = 0.004, decay = null, slide = 0, delay = 0 }) {
  if (!enabled) return
  const c = ensure(); if (!c) return
  if (c.state === 'suspended') c.resume().catch(() => {})
  const t0 = c.currentTime + delay
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(vol, t0 + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + (decay ?? dur))
  osc.connect(g); g.connect(master)
  osc.start(t0); osc.stop(t0 + (decay ?? dur) + 0.02)
}

function noise({ dur = 0.08, vol = 0.2, delay = 0 }) {
  if (!enabled) return
  const c = ensure(); if (!c) return
  const t0 = c.currentTime + delay
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length)
  const src = c.createBufferSource(); src.buffer = buf
  const g = c.createGain(); g.gain.value = vol
  const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1200
  src.connect(f); f.connect(g); g.connect(master)
  src.start(t0)
}

export const sfx = {
  hover: () => tone({ freq: 880, type: 'sine', dur: 0.05, vol: 0.12 }),
  click: () => { tone({ freq: 520, type: 'triangle', dur: 0.07, vol: 0.3, slide: 200 }); noise({ dur: 0.03, vol: 0.05 }) },
  pop: () => tone({ freq: 300, type: 'sine', dur: 0.1, vol: 0.35, slide: 400 }),
  toggle: (on) => tone({ freq: on ? 660 : 440, type: 'square', dur: 0.08, vol: 0.12, slide: on ? 220 : -120 }),
  boot: () => { tone({ freq: 523, type: 'square', dur: 0.09, vol: 0.14 }); tone({ freq: 1046, type: 'square', dur: 0.32, vol: 0.14, delay: 0.09 }) },
  coin: () => { tone({ freq: 988, type: 'square', dur: 0.08, vol: 0.14 }); tone({ freq: 1319, type: 'square', dur: 0.24, vol: 0.14, delay: 0.08 }) },
  step: () => noise({ dur: 0.03, vol: 0.06 }),
  talk: () => tone({ freq: 700 + Math.random() * 300, type: 'square', dur: 0.03, vol: 0.05 }),
  bump: () => tone({ freq: 160, type: 'triangle', dur: 0.08, vol: 0.2, slide: -60 }),
  win: () => [523, 659, 784, 1046].forEach((f, i) => tone({ freq: f, type: 'square', dur: 0.14, vol: 0.14, delay: i * 0.11 })),
  lose: () => [392, 330, 262].forEach((f, i) => tone({ freq: f, type: 'sawtooth', dur: 0.18, vol: 0.1, delay: i * 0.15 })),
  meow: () => { tone({ freq: 620, type: 'sawtooth', dur: 0.28, vol: 0.12, slide: 260, attack: 0.05 }); tone({ freq: 900, type: 'sine', dur: 0.28, vol: 0.06, slide: -300, delay: 0.05 }) },
  catch: () => tone({ freq: 740, type: 'sine', dur: 0.09, vol: 0.25, slide: 300 }),
  miss: () => tone({ freq: 220, type: 'square', dur: 0.12, vol: 0.12, slide: -100 }),
}
