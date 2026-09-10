import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createRoom } from './engine'
import { W, H } from './room'
import { sfx, setSoundEnabled, isSoundEnabled, onSoundChange } from '../lib/sound'
import { useIsTouch } from '../hooks/useMedia'
import './RoomGame.css'

// Full-screen overlay: title card → the playable room. Walk with WASD/arrows, E/Space to interact.
export default function RoomGame({ onExit, night, onToggleNight }) {
  const [phase, setPhase] = useState('title')
  const [prompt, setPrompt] = useState(null)
  const [dlg, setDlg] = useState(null) // { title, lines, action, effect, page, typed }
  const [got, setGot] = useState({ n: 0, of: 7 })
  const [toast, setToast] = useState(null)
  const [sound, setSound] = useState(isSoundEnabled())
  const canvasRef = useRef(null)
  const gameRef = useRef(null)
  const touch = useIsTouch()

  useEffect(() => onSoundChange(setSound), [])
  useEffect(() => { gameRef.current?.setNight(night) }, [night])

  // boot engine when we enter play phase
  useEffect(() => {
    if (phase !== 'play') return
    const g = createRoom(canvasRef.current, {
      night, sfx,
      on: {
        prompt: setPrompt,
        collect: (n, of) => setGot({ n, of }),
        allCollected: () => { setToast('🏆 ACHIEVEMENT: full cup! all 7 pearls found.'); setTimeout(() => setToast(null), 4500) },
      },
    })
    gameRef.current = g
    g.start()
    return () => { g.stop(); gameRef.current = null }
  }, [phase])

  const closeDialog = useCallback(() => { setDlg(null); gameRef.current?.setLocked(false) }, [])
  const advance = useCallback(() => {
    setDlg((d) => {
      if (!d) return d
      if (!d.done) return { ...d, done: true }
      if (d.page < d.lines.length - 1) return { ...d, page: d.page + 1, done: false }
      return d // last page: keep open until action/close
    })
  }, [])
  const interact = useCallback(() => {
    const g = gameRef.current; if (!g) return
    if (dlg) { if (dlg.done && dlg.page === dlg.lines.length - 1) closeDialog(); else advance(); return }
    const res = g.interact()
    if (!res) return
    sfx.talk()
    g.setLocked(true)
    if (res.effect === 'heal') g.heal()
    setDlg({ ...res, page: 0, done: false })
  }, [dlg, advance, closeDialog])

  // keyboard
  useEffect(() => {
    if (phase !== 'play') return
    const map = { ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down', ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right' }
    const kd = (e) => {
      if (e.key === 'Escape') { if (dlg) closeDialog(); else onExit(); return }
      if (map[e.key]) { gameRef.current?.setKey(map[e.key], true); e.preventDefault() }
      if (e.key === 'e' || e.key === 'E' || e.key === ' ' || e.key === 'Enter') { interact(); e.preventDefault() }
      if (e.key === 'n' || e.key === 'N') onToggleNight()
    }
    const ku = (e) => { if (map[e.key]) gameRef.current?.setKey(map[e.key], false) }
    window.addEventListener('keydown', kd); window.addEventListener('keyup', ku)
    return () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku) }
  }, [phase, interact, dlg, closeDialog, onExit, onToggleNight])

  // typewriter for the dialogue box
  const [typed, setTyped] = useState('')
  useEffect(() => {
    if (!dlg) { setTyped(''); return }
    const full = dlg.lines[dlg.page]
    if (dlg.done) { setTyped(full); return }
    setTyped('')
    let i = 0
    const iv = setInterval(() => { i++; setTyped(full.slice(0, i)); if (i % 3 === 0) sfx.talk(); if (i >= full.length) { clearInterval(iv); setDlg((d) => (d ? { ...d, done: true } : d)) } }, 22)
    return () => clearInterval(iv)
  }, [dlg?.page, dlg?.title, dlg?.done === false])

  const runAction = () => {
    const a = dlg?.action; if (!a) return
    sfx.click()
    if (a.effect === 'night') { onToggleNight(); closeDialog(); return }
    if (a.target) onExit(a.target)
  }

  const startGame = () => { sfx.coin(); setPhase('play') }
  const hold = (k) => ({ onPointerDown: (e) => { e.preventDefault(); gameRef.current?.setKey(k, true) }, onPointerUp: () => gameRef.current?.setKey(k, false), onPointerLeave: () => gameRef.current?.setKey(k, false), onPointerCancel: () => gameRef.current?.setKey(k, false) })

  return (
    <motion.div className={`room ${night ? 'is-night' : ''}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-label="Amelia's room game">
      <div className="room-top">
        <div className="pixel room-brand">AMELIA’S ROOM</div>
        <div className="room-hud">
          {phase === 'play' && <span className="pixel room-pearls">🧋 {got.n}/{got.of}</span>}
          <button className="room-btn pixel" onClick={() => { const v = !sound; setSoundEnabled(v); sfx.toggle(v) }} aria-label="toggle sound">{sound ? '♪ ON' : '♪ OFF'}</button>
          <button className="room-btn pixel" onClick={() => { onToggleNight(); sfx.toggle(!night) }} aria-label="toggle night">{night ? '☾' : '☀'}</button>
          <button className="room-btn pixel room-exit" onClick={() => { sfx.click(); onExit() }} aria-label="exit game">✕ EXIT</button>
        </div>
      </div>

      <div className="room-stage">
        <AnimatePresence>
          {phase === 'title' && (
            <motion.div key="title" className="room-title" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 0.5 }}>
              <div className="room-title-card">
                <div className="pixel room-title-kicker">A COZY TOP-DOWN PORTFOLIO</div>
                <h2 className="pixel room-title-h">AMELIA’S<br />ROOM</h2>
                <p className="room-title-p">Walk around my (pixel) room, poke at things, find all 7 boba pearls, and say hi to Mily the cat.</p>
                <div className="room-controls pixel">
                  <span><b>WASD / ARROWS</b> move</span><span><b>E / SPACE</b> interact</span><span><b>N</b> night</span><span><b>ESC</b> exit</span>
                </div>
                <button className="btn matcha room-start" onClick={startGame} autoFocus><span className="pixel">▶ PRESS START</span></button>
                <div className="pixel room-tip">{touch ? 'use the on-screen pad below' : 'tip: things you can poke get a ! bubble'}</div>
              </div>
            </motion.div>
          )}
          {phase === 'play' && (
            <motion.div key="play" className="room-play" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="room-frame">
                <canvas ref={canvasRef} className="room-canvas" style={{ aspectRatio: `${W} / ${H}` }} />
                <AnimatePresence>
                  {prompt && !dlg && (
                    <motion.div className="room-prompt pixel" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <kbd>{touch ? 'A' : 'E'}</kbd> {prompt.label}
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {dlg && (
                    <motion.div className="dlg" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.25 }} onClick={interact}>
                      <div className="dlg-name pixel">{dlg.title}</div>
                      <div className="dlg-text">{typed}{!dlg.done && <span className="caret">▮</span>}</div>
                      <div className="dlg-foot">
                        {dlg.done && dlg.page === dlg.lines.length - 1 && dlg.action && (
                          <button className="dlg-action pixel" onClick={(e) => { e.stopPropagation(); runAction() }}>{dlg.action.label} →</button>
                        )}
                        <span className="dlg-next pixel">{dlg.done ? (dlg.page < dlg.lines.length - 1 ? '▼ next' : '✕ close') : '…'}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {touch && (
                <div className="room-pad">
                  <div className="pad-dpad">
                    <button className="pad-btn pad-u" aria-label="up" {...hold('up')}>▲</button>
                    <button className="pad-btn pad-l" aria-label="left" {...hold('left')}>◀</button>
                    <button className="pad-btn pad-r" aria-label="right" {...hold('right')}>▶</button>
                    <button className="pad-btn pad-d" aria-label="down" {...hold('down')}>▼</button>
                  </div>
                  <button className="pad-a pixel" onPointerDown={(e) => { e.preventDefault(); interact() }} aria-label="interact">A</button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>{toast && <motion.div className="room-toast pixel" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>{toast}</motion.div>}</AnimatePresence>
    </motion.div>
  )
}
