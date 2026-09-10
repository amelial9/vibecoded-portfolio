import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { sfx } from '../lib/sound'
import './Preloader.css'

// Gameboy-style boot screen. Shows once per session.
export default function Preloader({ onDone }) {
  const [show, setShow] = useState(() => { try { return !sessionStorage.getItem('amelia-booted') } catch { return true } })
  const [pct, setPct] = useState(0)

  useEffect(() => {
    if (!show) { onDone?.(); return }
    document.documentElement.style.overflow = 'hidden'
    let p = 0
    const iv = setInterval(() => {
      p += Math.random() * 18 + 6
      if (p >= 100) { p = 100; clearInterval(iv) }
      setPct(Math.round(p))
    }, 110)
    const t = setTimeout(() => {
      sfx.boot()
      try { sessionStorage.setItem('amelia-booted', '1') } catch {}
      setShow(false)
      document.documentElement.style.overflow = ''
      onDone?.()
    }, 1900)
    return () => { clearInterval(iv); clearTimeout(t); document.documentElement.style.overflow = '' }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="boot" initial={{ opacity: 1 }} exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}>
          <div className="boot-screen">
            <motion.div className="boot-logo pixel" initial={{ y: -140, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}>
              <svg className="boot-cat" viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
                <path fill="currentColor" d="M2 2h2v2H2zM12 2h2v2h-2zM2 4h12v9H2zM4 13h8v1H4z" />
                <path fill="#C9D6B6" d="M5 7h2v2H5zM9 7h2v2H9zM7 10h2v1H7z" />
              </svg>
              AMELIA<span className="tm">™</span>
            </motion.div>
            <div className="boot-bar"><span style={{ width: `${pct}%` }} /></div>
            <div className="boot-hint pixel">loading room… {pct}%</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
