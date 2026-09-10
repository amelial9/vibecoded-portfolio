import { useEffect, useRef } from 'react'
import Matter from 'matter-js'
import { sfx } from '../lib/sound'
import { useReducedMotion } from '../hooks/useMedia'

// Boba pearls that rain into the hero, pile up on the big name, and can be
// pushed around / flung with the pointer. Canvas ignores pointer events so
// everything underneath stays clickable; input is read from window listeners.
export default function BobaPhysics({ hostRef, lettersSelector, active = true, count = 42 }) {
  const canvasRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!active || reduced) return
    const host = hostRef.current
    const canvas = canvasRef.current
    if (!host || !canvas) return
    const ctx = canvas.getContext('2d')
    const { Engine, Bodies, Body, Composite, Events, Runner, Vector } = Matter

    const engine = Engine.create({ enableSleeping: true })
    engine.gravity.y = 1.05
    const world = engine.world
    let W = 0, H = 0, dpr = 1
    let statics = []
    let pearls = []
    const pointer = Bodies.circle(-500, -500, 26, { isStatic: true, isSensor: false, restitution: 0.4, friction: 0.05, label: 'pointer', render: { visible: false } })
    Composite.add(world, pointer)

    const rand = (a, b) => a + Math.random() * (b - a)
    const PALETTE = ['#2E211B', '#2E211B', '#3B2A22', '#241914', '#4B3A30', '#F0DEBA']

    function makePearl(x, y, r) {
      const b = Bodies.circle(x, y, r, { restitution: 0.42, friction: 0.15, frictionAir: 0.008, density: 0.0018, label: 'pearl' })
      b.plugin = { color: PALETTE[Math.floor(Math.random() * PALETTE.length)], r, hl: rand(-0.5, -0.2) }
      return b
    }

    function buildStatics() {
      statics.forEach((s) => Composite.remove(world, s))
      statics = []
      const t = 60
      const hostRect = host.getBoundingClientRect()
      const floor = Bodies.rectangle(W / 2, H + t / 2 - 2, W + 200, t, { isStatic: true, label: 'floor', friction: 0.6 })
      const left = Bodies.rectangle(-t / 2, H / 2, t, H * 4, { isStatic: true })
      const right = Bodies.rectangle(W + t / 2, H / 2, t, H * 4, { isStatic: true })
      statics.push(floor, left, right)
      const letters = host.querySelectorAll(lettersSelector)
      letters.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.width < 4) return
        const pad = Math.min(r.height * 0.12, 10)
        const w = r.width - pad, h = r.height * 0.72
        const cx = r.left - hostRect.left + r.width / 2
        const cy = r.top - hostRect.top + r.height / 2 + r.height * 0.06
        statics.push(Bodies.rectangle(cx, cy, w, h, { isStatic: true, label: 'letter', friction: 0.5, chamfer: { radius: Math.min(10, w / 3) } }))
      })
      Composite.add(world, statics)
    }

    function resize() {
      const r = host.getBoundingClientRect()
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height))
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = W * dpr; canvas.height = H * dpr
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildStatics()
      pearls.forEach((p) => { if (p.position.x > W - 10) Body.setPosition(p, { x: W - 20, y: p.position.y }) })
    }

    function spawn(n, x, y, burst = false) {
      const mobile = W < 600
      for (let i = 0; i < n; i++) {
        if (pearls.length > 140) { const old = pearls.shift(); Composite.remove(world, old) }
        const r = mobile ? rand(7, 11) : rand(9, 15)
        const px = x ?? rand(W * 0.1, W * 0.9)
        const py = y ?? rand(-H * 0.6, -20)
        const b = makePearl(px + rand(-8, 8), py, r)
        if (burst) Body.setVelocity(b, { x: rand(-6, 6), y: rand(-9, -3) })
        pearls.push(b)
        Composite.add(world, b)
      }
    }

    resize()
    spawn(count)

    // pointer interaction
    let mx = -500, my = -500, lastX = -500, lastY = -500, inside = false
    let grabbed = null
    const toLocal = (e) => { const r = host.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } }
    const onMove = (e) => {
      const p = toLocal(e); mx = p.x; my = p.y
      inside = mx >= 0 && my >= 0 && mx <= W && my <= H
      if (grabbed) { Body.setPosition(grabbed, { x: mx, y: my }); Body.setVelocity(grabbed, { x: (mx - lastX) * 0.8, y: (my - lastY) * 0.8 }) }
      lastX = mx; lastY = my
    }
    const onDown = (e) => {
      if (e.button !== 0) return
      const p = toLocal(e)
      if (p.x < 0 || p.y < 0 || p.x > W || p.y > H) return
      const hit = Matter.Query.point(pearls, p)[0]
      if (hit) { grabbed = hit; Body.setStatic(hit, false); hit.isSleeping = false; hit.plugin.held = true; return }
      if (e.target.closest('a, button, input, [data-no-spawn]')) return
      spawn(4, p.x, p.y, true); sfx.pop()
    }
    const onUp = () => { if (grabbed) { grabbed.plugin.held = false; grabbed = null } }
    const onTouch = (e) => { const t = e.touches[0]; if (!t) return; onMove(t) }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onTouch, { passive: true })

    Events.on(engine, 'beforeUpdate', () => {
      Body.setPosition(pointer, inside && !grabbed ? { x: mx, y: my } : { x: -500, y: -500 })
    })

    // render loop
    let raf = 0, last = performance.now(), running = true
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      for (const p of pearls) {
        const { x, y } = p.position
        const r = p.plugin.r
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fillStyle = p.plugin.color; ctx.fill()
        // glossy highlight
        ctx.beginPath(); ctx.arc(x + r * 0.35, y - r * 0.35, r * 0.28, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fill()
        if (p.plugin.held) { ctx.beginPath(); ctx.arc(x, y, r + 4, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(156,175,136,0.9)'; ctx.lineWidth = 2; ctx.stroke() }
      }
    }
    const loop = (now) => {
      if (!running) return
      const dt = Math.min(32, now - last); last = now
      Engine.update(engine, dt)
      draw()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // pause when hero is off-screen
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop) }
      else if (!en.isIntersecting) { running = false; cancelAnimationFrame(raf) }
    }, { threshold: 0 })
    io.observe(host)

    const ro = new ResizeObserver(() => resize())
    ro.observe(host)
    const refill = () => { pearls.forEach((p) => Composite.remove(world, p)); pearls = []; spawn(count); sfx.pop() }
    host.addEventListener('boba:refill', refill)
    const onTheme = () => buildStatics()
    window.addEventListener('boba:rebuild', onTheme)

    return () => {
      running = false; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect()
      window.removeEventListener('mousemove', onMove); window.removeEventListener('mousedown', onDown); window.removeEventListener('mouseup', onUp); window.removeEventListener('touchmove', onTouch)
      host.removeEventListener('boba:refill', refill); window.removeEventListener('boba:rebuild', onTheme)
      Composite.clear(world, false); Engine.clear(engine)
    }
  }, [active, reduced, hostRef, lettersSelector, count])

  return <canvas ref={canvasRef} className="boba-canvas" aria-hidden="true" />
}
