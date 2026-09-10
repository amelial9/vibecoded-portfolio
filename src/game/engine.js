import { AMELIA, CAT, MOUSE, raster } from './sprites'
import { T, W, H, OBJECTS, PEARLS, NPCS, drawBackdrop, C_PAL as C } from './room'

// Top-down room engine. Renders at native 352x224 into a canvas that CSS scales up.
export function createRoom(canvas, { night = false, sfx, on = {} } = {}) {
  const ctx = canvas.getContext('2d')
  canvas.width = W; canvas.height = H
  ctx.imageSmoothingEnabled = false

  const back = document.createElement('canvas'); back.width = W; back.height = H
  const light = document.createElement('canvas'); light.width = W; light.height = H
  let backNight = null
  const paintBack = () => { drawBackdrop(back.getContext('2d'), S.night); backNight = S.night }

  const S = {
    t: 0, night, music: false,
    player: { x: T * 9 + 8, y: T * 11, dir: 'down', moving: false, frame: 0, ft: 0, w: 10, h: 6 }, // feet box
    cat: { x: T * 5, y: T * 10 + 4, dir: 'right', mode: 'sleep', frame: 0, ft: 0, wt: 3, vx: 0, vy: 0 },
    mouse: { x: T * 12, y: T * 12, dir: 'right', frame: 0, ft: 0, wt: 1, vx: 20, vy: 0 },
    pearls: PEARLS.map(([x, y], i) => ({ x, y, got: false, i })),
    got: 0, near: null, locked: false, particles: [], hearts: [],
  }
  const keys = { up: 0, down: 0, left: 0, right: 0 }
  let raf = 0, last = 0, running = false
  paintBack()

  const solids = OBJECTS.filter((o) => o.solid !== false).map((o) => ({ x: o.x, y: o.y + Math.max(0, o.h - 14), w: o.w, h: Math.min(o.h, 14), o }))
  // furniture blocks only its lower band so the player can walk "behind" tall things.
  solids.push({ x: 0, y: 0, w: W, h: T * 2 + 6 }) // wall

  const hit = (x, y, w, h, list) => list.find((s) => x < s.x + s.w && x + w > s.x && y < s.y + s.h && y + h > s.y)
  const bounds = (x, y, w, h) => x < 2 || y < T * 2 + 6 || x + w > W - 2 || y + h > H - 2

  function movePlayer(dt) {
    const p = S.player
    if (S.locked) { p.moving = false; return }
    let dx = (keys.right - keys.left), dy = (keys.down - keys.up)
    p.moving = !!(dx || dy)
    if (!p.moving) { p.frame = 0; return }
    if (dx && dy) { dx *= 0.707; dy *= 0.707 }
    if (Math.abs(dx) > Math.abs(dy)) p.dir = dx > 0 ? 'right' : 'left'; else p.dir = dy > 0 ? 'down' : 'up'
    const sp = 62 * dt
    const nx = p.x + dx * sp, ny = p.y + dy * sp
    // feet box: 10x6 at (x-5, y-6)
    if (!hit(nx - 5, p.y - 6, 10, 6, solids) && !bounds(nx - 5, p.y - 6, 10, 6)) p.x = nx
    if (!hit(p.x - 5, ny - 6, 10, 6, solids) && !bounds(p.x - 5, ny - 6, 10, 6)) p.y = ny
    p.ft += dt
    if (p.ft > 0.13) { p.ft = 0; p.frame = (p.frame + 1) % 4; if (p.frame % 2 === 1) sfx?.step?.() }
    // pearls
    for (const pr of S.pearls) {
      if (!pr.got && Math.abs(pr.x - p.x) < 9 && Math.abs(pr.y - p.y) < 9) {
        pr.got = true; S.got++; sfx?.coin?.(); on.collect?.(S.got, S.pearls.length)
        for (let i = 0; i < 10; i++) S.particles.push({ x: pr.x, y: pr.y, vx: (Math.random() - 0.5) * 60, vy: -Math.random() * 60 - 20, life: 0.6, c: i % 2 ? C.matcha : C.boba })
        if (S.got === S.pearls.length) { on.allCollected?.(); sfx?.win?.(); for (let i = 0; i < 80; i++) S.particles.push({ x: Math.random() * W, y: -4, vx: (Math.random() - 0.5) * 20, vy: 30 + Math.random() * 50, life: 3 + Math.random() * 2, c: [C.matcha, C.peach, C.sand, C.red, C.yellow][i % 5] }) }
      }
    }
  }

  function probe() {
    const p = S.player
    const d = { up: [0, -12], down: [0, 8], left: [-11, -3], right: [11, -3] }[p.dir]
    const px = p.x + d[0], py = p.y - 3 + d[1]
    const near = (o, pad = 7) => px >= o.x - pad && px <= o.x + o.w + pad && py >= o.y - pad && py <= o.y + o.h + pad
    for (const o of OBJECTS) if (near(o)) return { kind: 'object', id: o.id, label: o.label }
    if (Math.abs(S.cat.x + 8 - p.x) < 16 && Math.abs(S.cat.y + 12 - p.y) < 16) return { kind: 'npc', id: 'cat', label: 'Mily' }
    if (Math.abs(S.mouse.x + 8 - p.x) < 14 && Math.abs(S.mouse.y + 12 - p.y) < 14) return { kind: 'npc', id: 'mouse', label: 'Mouse' }
    return null
  }

  function moveNPC(n, dt, speed, area, sleeper) {
    n.wt -= dt
    if (n.wt <= 0) {
      n.wt = 1 + Math.random() * 3
      if (sleeper && Math.random() < 0.35) { n.mode = 'sleep'; n.vx = n.vy = 0; n.wt = 4 + Math.random() * 4 }
      else { n.mode = 'walk'; const a = Math.random() * Math.PI * 2; n.vx = Math.cos(a) * speed; n.vy = Math.sin(a) * speed; if (Math.random() < 0.3) { n.vx = n.vy = 0 } }
    }
    if (n.mode === 'sleep') return
    const nx = n.x + n.vx * dt, ny = n.y + n.vy * dt
    const fx = nx + 4, fy = ny + 11
    if (fx < area.x || fx + 8 > area.x + area.w || hit(fx, fy, 8, 4, solids)) n.vx *= -1; else n.x = nx
    if (fy < area.y || fy + 4 > area.y + area.h || hit(n.x + 4, fy, 8, 4, solids)) n.vy *= -1; else n.y = ny
    if (n.vx) n.dir = n.vx > 0 ? 'right' : 'left'
    if (n.vx || n.vy) { n.ft += dt; if (n.ft > 0.18) { n.ft = 0; n.frame ^= 1 } }
  }

  function update(dt) {
    S.t += dt
    movePlayer(dt)
    moveNPC(S.cat, dt, 22, { x: T * 1, y: T * 6, w: T * 14, h: T * 7 }, true)
    moveNPC(S.mouse, dt, 55, { x: T * 1, y: T * 4, w: T * 16, h: T * 9 }, false)
    // player-NPC soft push
    for (const n of [S.cat, S.mouse]) { const dx = (n.x + 8) - S.player.x, dy = (n.y + 12) - S.player.y; const d = Math.hypot(dx, dy); if (d < 10 && d > 0) { n.x += dx / d * 30 * dt; n.y += dy / d * 30 * dt } }
    const nr = S.locked ? null : probe()
    if ((nr?.id || null) !== (S.near?.id || null)) { S.near = nr; on.prompt?.(nr) }
    S.particles = S.particles.filter((p) => (p.life -= dt) > 0); for (const p of S.particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 80 * dt }
    S.hearts = S.hearts.filter((h) => (h.life -= dt) > 0); for (const h of S.hearts) h.y -= 18 * dt
    if (backNight !== S.night) paintBack()
  }

  function drawSprite(rows, x, y, flip) { ctx.drawImage(raster(rows, { flip }), Math.round(x), Math.round(y)) }
  function drawShadow(x, y, w) { ctx.fillStyle = 'rgba(46,33,27,0.18)'; ctx.fillRect(Math.round(x - w / 2), Math.round(y - 2), w, 3) }

  function draw() {
    ctx.drawImage(back, 0, 0)
    // pearls (under everything on floor)
    for (const p of S.pearls) if (!p.got) { const bob = Math.round(Math.sin(S.t * 4 + p.i) * 1.5); ctx.fillStyle = 'rgba(46,33,27,0.15)'; ctx.fillRect(p.x - 3, p.y + 2, 6, 2); ctx.fillStyle = C.boba; ctx.fillRect(p.x - 3, p.y - 3 + bob, 6, 6); ctx.fillStyle = '#fff'; ctx.fillRect(p.x - 1, p.y - 2 + bob, 1, 1) }
    // depth-sorted drawables
    const items = []
    for (const o of OBJECTS) if (o.draw) items.push({ y: o.y + o.h, fn: () => o.draw(ctx, o, S) })
    const p = S.player
    items.push({ y: p.y, fn: () => { drawShadow(p.x, p.y, 10); const bob = p.moving && p.frame % 2 === 1 ? -1 : 0; drawSprite(AMELIA[p.dir][p.frame], p.x - 8, p.y - 16 + bob, p.dir === 'left') } })
    const c = S.cat
    items.push({ y: c.y + 15, fn: () => { drawShadow(c.x + 8, c.y + 15, 12); if (c.mode === 'sleep') { drawSprite(CAT.sleep[0], c.x, c.y, false); if (Math.floor(S.t * 1.5) % 2) { ctx.fillStyle = C.ink; ctx.font = '6px Silkscreen, monospace'; ctx.fillText('z', Math.round(c.x + 12), Math.round(c.y + 4 - (S.t % 1) * 4)) } } else drawSprite(CAT.right[c.frame], c.x, c.y, c.dir === 'left') } })
    const m = S.mouse
    items.push({ y: m.y + 15, fn: () => drawSprite(MOUSE.right[m.frame], m.x, m.y, m.dir === 'left') })
    items.sort((a, b) => a.y - b.y).forEach((i) => i.fn())
    // prompt marker over player
    if (S.near && !S.locked) { const yy = p.y - 24 + Math.round(Math.sin(S.t * 6)); ctx.fillStyle = C.cream; ctx.fillRect(p.x - 3, yy - 2, 7, 9); ctx.fillStyle = C.ink; ctx.fillRect(p.x, yy, 1, 4); ctx.fillRect(p.x, yy + 5, 1, 1) }
    // particles / hearts
    for (const q of S.particles) { ctx.fillStyle = q.c; ctx.fillRect(Math.round(q.x), Math.round(q.y), 2, 2) }
    for (const h of S.hearts) { ctx.fillStyle = C.red; ctx.fillRect(Math.round(h.x), Math.round(h.y), 2, 2); ctx.fillRect(Math.round(h.x + 3), Math.round(h.y), 2, 2); ctx.fillRect(Math.round(h.x), Math.round(h.y + 2), 5, 2); ctx.fillRect(Math.round(h.x + 1), Math.round(h.y + 4), 3, 1) }
    // night lighting
    if (S.night) {
      const lc = light.getContext('2d')
      lc.globalCompositeOperation = 'source-over'; lc.fillStyle = 'rgba(20,24,50,0.62)'; lc.fillRect(0, 0, W, H)
      lc.globalCompositeOperation = 'destination-out'
      const lamps = [[T * 17 + 1, T * 9 + 6, 48], [T * 2 + 20, T * 3 + 2, 30], [T * 3 + 8, T * 1 + 4, 26], [p.x, p.y - 8, 22]]
      for (const [lx, ly, rr] of lamps) { const g = lc.createRadialGradient(lx, ly, 2, lx, ly, rr); g.addColorStop(0, 'rgba(0,0,0,0.95)'); g.addColorStop(1, 'rgba(0,0,0,0)'); lc.fillStyle = g; lc.fillRect(lx - rr, ly - rr, rr * 2, rr * 2) }
      ctx.drawImage(light, 0, 0)
      ctx.fillStyle = 'rgba(255,220,150,0.10)'; ctx.fillRect(T * 16, T * 8, 40, 40)
    }
  }

  function loop(now) {
    if (!running) return
    const dt = Math.min(0.05, (now - last) / 1000 || 0); last = now
    update(dt); draw(); raf = requestAnimationFrame(loop)
  }

  return {
    start() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop) },
    stop() { running = false; cancelAnimationFrame(raf) },
    setKey(k, v) { keys[k] = v ? 1 : 0 },
    setLocked(v) { S.locked = v; if (v) { keys.up = keys.down = keys.left = keys.right = 0 } },
    setNight(v) { S.night = v },
    setMusic(v) { S.music = v },
    heal() { for (let i = 0; i < 6; i++) S.hearts.push({ x: S.player.x - 8 + Math.random() * 16, y: S.player.y - 20 - Math.random() * 6, life: 1 + Math.random() }) },
    interact() {
      const n = S.near; if (!n) return null
      if (n.kind === 'object') { const o = OBJECTS.find((x) => x.id === n.id); return { title: o.label, lines: o.lines, action: o.action, effect: o.effect } }
      const d = NPCS[n.id]; return { title: n.label, lines: d.lines, action: d.action }
    },
    get state() { return S },
  }
}
