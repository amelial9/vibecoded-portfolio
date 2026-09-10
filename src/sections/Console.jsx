import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createBobaCatch } from '../game/bobaCatch'
import { games } from '../data/fun'
import { sfx } from '../lib/sound'
import './Console.css'

// A Game Boy that takes cartridges. The "Boba Catch" cart is actually playable.
const CARTS = [
  { id: 'boba', title: 'Boba Catch', body: '#9CAF88', playable: true },
  ...games.map((g) => ({ id: g.title, title: g.title, art: g.art, fit: g.fit, iconBg: g.iconBg, body: g.body })),
]

export default function Console() {
  const [cart, setCart] = useState(null)
  const [score, setScore] = useState({ s: 0, hi: 0 })
  const [mode, setMode] = useState('title')
  const canvasRef = useRef(null)
  const gameRef = useRef(null)
  const shellRef = useRef(null)
  const active = cart?.playable

  useEffect(() => {
    if (!active) return
    const g = createBobaCatch(canvasRef.current, { onScore: (s, hi) => setScore({ s, hi }), onState: setMode, sfx })
    gameRef.current = g
    g.start()
    const onKey = (e, v) => {
      if (!shellRef.current?.matches(':focus-within')) return
      if (e.key === 'ArrowLeft' || e.key === 'a') { g.setKey('left', v); e.preventDefault() }
      if (e.key === 'ArrowRight' || e.key === 'd') { g.setKey('right', v); e.preventDefault() }
      if (v && (e.key === ' ' || e.key === 'Enter' || e.key === 'z')) { g.pressA(); e.preventDefault() }
    }
    const kd = (e) => onKey(e, true), ku = (e) => onKey(e, false)
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku)
    const io = new IntersectionObserver(([en]) => (en.isIntersecting ? g.start() : g.stop()))
    io.observe(canvasRef.current)
    return () => { g.stop(); io.disconnect(); window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); gameRef.current = null }
  }, [active])

  const pointerMove = (e) => {
    const g = gameRef.current; if (!g) return
    const r = canvasRef.current.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 160
    g.moveTo(x)
  }
  const hold = (k, v) => () => gameRef.current?.setKey(k, v)
  const insert = (c) => { sfx.click(); setCart((cur) => (cur?.id === c.id ? null : c)) }

  return (
    <div className="console-wrap">
      <div className="console-head">
        <h3 className="display console-title">Games</h3>
        <span className="pixel console-sub">click a cartridge to insert · Boba Catch is playable</span>
      </div>

      <div className="console-grid">
        <div className="gb-shell" ref={shellRef} tabIndex={0} onClick={() => shellRef.current?.focus()} aria-label="Amelia Boy handheld console">
          <div className="gb-top"><span className="pixel">AMELIA BOY</span><span className="gb-led" data-on={!!cart} /></div>
          <div className="gb-bezel">
            <div className="gb-screen" onPointerMove={active ? pointerMove : undefined} onPointerDown={active ? (e) => { pointerMove(e); gameRef.current?.pressA() } : undefined}>
              <AnimatePresence initial={false}>
                {!cart && <motion.div key="empty" className="gb-empty pixel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>INSERT<br />CARTRIDGE</motion.div>}
                {cart && !cart.playable && (
                  <motion.div key={cart.id} className="gb-cartview" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                    <div className="gb-cartart" style={{ background: cart.iconBg || 'transparent' }}><img src={cart.art} alt="" className={`fit-${cart.fit}`} /></div>
                    <div className="pixel gb-carttitle">{cart.title}</div>
                    <div className="pixel gb-cartsub">{'★'.repeat(3)} played a LOT</div>
                  </motion.div>
                )}
                {cart?.playable && <motion.canvas key="game" ref={canvasRef} className="gb-canvas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />}
              </AnimatePresence>
            </div>
          </div>
          <div className="gb-controls">
            <div className="gb-dpad">
              <button aria-label="Left" onPointerDown={hold('left', true)} onPointerUp={hold('left', false)} onPointerLeave={hold('left', false)} className="dp dp-l" />
              <button aria-label="Right" onPointerDown={hold('right', true)} onPointerUp={hold('right', false)} onPointerLeave={hold('right', false)} className="dp dp-r" />
              <span className="dp dp-u" /><span className="dp dp-d" /><span className="dp-c" />
            </div>
            <div className="gb-ab">
              <button className="gb-btn" aria-label="B" onClick={() => setCart(null)}>B</button>
              <button className="gb-btn gb-a" aria-label="A" onClick={() => { if (!cart) { insert(CARTS[0]) } else gameRef.current?.pressA(); sfx.click() }}>A</button>
            </div>
          </div>
          <div className="gb-foot">
            <span className="pixel gb-score">{active ? `SCORE ${String(score.s).padStart(3, '0')} · HI ${String(score.hi).padStart(3, '0')}` : 'A = START · ARROWS MOVE'}</span>
            <span className="gb-speaker"><i /><i /><i /><i /><i /></span>
          </div>
        </div>

        <div className="carts">
          {CARTS.map((c) => (
            <motion.button key={c.id} className={`cart ${cart?.id === c.id ? 'is-in' : ''}`} style={{ '--cart': c.body }} onClick={() => insert(c)} whileHover={{ y: -6, rotate: -2 }} whileTap={{ scale: 0.95 }} data-cursor-label={cart?.id === c.id ? 'eject' : 'insert'}>
              <span className="cart-notch" />
              <span className="cart-label">
                {c.art ? <img src={c.art} alt="" className={`fit-${c.fit}`} style={{ background: c.iconBg || 'transparent' }} /> : <span className="cart-boba">🧋</span>}
                <span className="pixel">{c.title}</span>
              </span>
              {c.playable && <span className="cart-tag pixel">PLAYABLE</span>}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
