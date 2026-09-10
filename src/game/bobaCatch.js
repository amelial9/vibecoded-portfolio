// "Boba Catch" — a tiny Game Boy style mini game rendered on a 160x144 canvas.
// Catch pearls with the cup, dodge ice cubes. 4-shade green palette, integer pixels.
const W = 160, H = 144
const P = ['#0f380f', '#306230', '#8bac0f', '#9bbc0f'] // darkest → lightest

export function createBobaCatch(canvas, { onScore, onState, sfx } = {}) {
  const ctx = canvas.getContext('2d')
  canvas.width = W; canvas.height = H
  ctx.imageSmoothingEnabled = false
  let hi = 0
  try { hi = Number(localStorage.getItem('boba-catch-hi') || 0) } catch {}

  const S = { mode: 'title', score: 0, lives: 3, t: 0, cupX: 70, cupTarget: 70, items: [], spawnT: 0, speed: 1, msgT: 0, msg: '', shake: 0 }
  const keys = {}
  let raf = 0, last = 0, running = false

  const rect = (x, y, w, h, c) => { ctx.fillStyle = P[c]; ctx.fillRect(Math.round(x), Math.round(y), w, h) }
  const text = (s, x, y, c = 0, size = 8) => { ctx.fillStyle = P[c]; ctx.font = `${size}px Silkscreen, monospace`; ctx.textBaseline = 'top'; ctx.fillText(s, Math.round(x), Math.round(y)) }
  const centerText = (s, y, c = 0, size = 8) => { ctx.font = `${size}px Silkscreen, monospace`; const w = ctx.measureText(s).width; text(s, (W - w) / 2, y, c, size) }

  function reset() { S.score = 0; S.lives = 3; S.items = []; S.spawnT = 0; S.speed = 1; S.t = 0; S.cupX = 70; S.cupTarget = 70; S.msg = ''; onScore?.(0, hi) }
  function start() { reset(); S.mode = 'play'; onState?.('play'); sfx?.coin?.() }
  function gameOver() { S.mode = 'over'; if (S.score > hi) { hi = S.score; try { localStorage.setItem('boba-catch-hi', String(hi)) } catch {} } onState?.('over'); onScore?.(S.score, hi); sfx?.lose?.() }

  function update(dt) {
    S.t += dt
    if (S.mode !== 'play') return
    // movement
    const spd = 110 * dt
    if (keys.left) S.cupTarget -= spd
    if (keys.right) S.cupTarget += spd
    S.cupTarget = Math.max(12, Math.min(W - 12, S.cupTarget))
    S.cupX += (S.cupTarget - S.cupX) * Math.min(1, dt * 18)
    // spawn
    S.spawnT -= dt
    if (S.spawnT <= 0) {
      const ice = Math.random() < Math.min(0.35, 0.12 + S.score * 0.01)
      S.items.push({ x: 10 + Math.random() * (W - 20), y: -6, vy: 38 + Math.random() * 20 + S.score * 1.6, ice, r: ice ? 5 : 4, wob: Math.random() * 6 })
      S.spawnT = Math.max(0.32, 0.9 - S.score * 0.02)
    }
    for (const it of S.items) { it.y += it.vy * dt; it.x += Math.sin(S.t * 3 + it.wob) * 6 * dt }
    // collisions with cup (cup spans cupX±11, top at y=118)
    const keep = []
    for (const it of S.items) {
      const inCup = it.y + it.r >= 116 && it.y < 128 && Math.abs(it.x - S.cupX) < 12
      if (inCup) {
        if (it.ice) { S.lives--; S.shake = 0.25; S.msg = 'ICE!'; S.msgT = 0.6; sfx?.miss?.(); if (S.lives <= 0) { gameOver(); return } }
        else { S.score++; S.msg = ['nice', 'yum', 'slurp', '+1', 'boba!'][S.score % 5]; S.msgT = 0.5; sfx?.catch?.(); onScore?.(S.score, hi) }
        continue
      }
      if (it.y > H + 8) { if (!it.ice) { S.lives--; S.shake = 0.2; S.msg = 'missed'; S.msgT = 0.6; sfx?.miss?.(); if (S.lives <= 0) { gameOver(); return } } continue }
      keep.push(it)
    }
    S.items = keep
    if (S.msgT > 0) S.msgT -= dt
    if (S.shake > 0) S.shake -= dt
  }

  function drawCup(x) {
    // cup body (trapezoid-ish), tea, lid, straw
    rect(x - 11, 118, 22, 2, 0)
    rect(x - 11, 120, 22, 14, 3); rect(x - 11, 120, 1, 14, 0); rect(x + 10, 120, 1, 14, 0); rect(x - 10, 133, 20, 1, 0)
    rect(x - 9, 126, 18, 7, 1) // tea
    for (let i = -7; i <= 6; i += 4) rect(x + i, 130, 2, 2, 0) // pearls in cup
    rect(x + 3, 108, 3, 12, 0); rect(x + 4, 109, 1, 10, 2) // straw
  }
  function drawItem(it) {
    if (it.ice) { rect(it.x - 5, it.y - 5, 10, 10, 3); rect(it.x - 5, it.y - 5, 10, 10, 0); rect(it.x - 4, it.y - 4, 8, 8, 3); rect(it.x - 3, it.y - 3, 2, 2, 2); rect(it.x - 1, it.y - 1, 4, 4, 2) }
    else { rect(it.x - 4, it.y - 3, 8, 6, 0); rect(it.x - 3, it.y - 4, 6, 8, 0); rect(it.x - 2, it.y - 2, 2, 2, 2) }
  }
  function draw() {
    ctx.save()
    if (S.shake > 0) ctx.translate(Math.round((Math.random() - 0.5) * 4), Math.round((Math.random() - 0.5) * 4))
    rect(0, 0, W, H, 3)
    // background: shelves / dots
    for (let y = 8; y < H; y += 24) for (let x = 6; x < W; x += 24) rect(x, y, 1, 1, 2)
    rect(0, 134, W, 10, 1); rect(0, 134, W, 1, 0)
    if (S.mode === 'title') {
      centerText('BOBA CATCH', 30, 0, 16)
      centerText('catch pearls', 58, 1); centerText('dodge ice', 68, 1)
      if (Math.floor(S.t * 2) % 2 === 0) centerText('PRESS A', 96, 0)
      centerText('HI ' + String(hi).padStart(3, '0'), 118, 1)
      drawCup(80)
    } else {
      for (const it of S.items) drawItem(it)
      drawCup(S.cupX)
      text(String(S.score).padStart(3, '0'), 4, 3, 0)
      for (let i = 0; i < 3; i++) rect(W - 8 - i * 9, 4, 6, 6, i < S.lives ? 0 : 2)
      if (S.msgT > 0 && S.mode === 'play') centerText(S.msg, 40, 0)
      if (S.mode === 'over') {
        rect(20, 44, 120, 56, 3); rect(20, 44, 120, 56, 0); rect(22, 46, 116, 52, 3)
        centerText('GAME OVER', 52, 0, 12); centerText('SCORE ' + S.score, 70, 1); centerText(S.score >= hi && S.score > 0 ? 'NEW HI!' : 'HI ' + hi, 80, 1)
        if (Math.floor(S.t * 2) % 2 === 0) centerText('A = AGAIN', 90, 0)
      }
    }
    ctx.restore()
  }

  function loop(now) {
    if (!running) return
    const dt = Math.min(0.05, (now - last) / 1000 || 0); last = now
    update(dt); draw()
    raf = requestAnimationFrame(loop)
  }

  const api = {
    start() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop) },
    stop() { running = false; cancelAnimationFrame(raf) },
    pressA() { if (S.mode === 'title' || S.mode === 'over') start() },
    setKey(k, v) { keys[k] = v },
    moveTo(px) { if (S.mode === 'play') S.cupTarget = Math.max(12, Math.min(W - 12, px)) }, // px in canvas coords
    get mode() { return S.mode },
    get hi() { return hi },
  }
  draw()
  return api
}
