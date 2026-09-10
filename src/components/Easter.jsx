import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useKonami, useMeow } from '../hooks/useKonami'
import { sfx } from '../lib/sound'
import './Easter.css'

// Konami code → it rains cats + boba. Typing "meow" → a meow and a toast.
export default function Easter() {
  const [rain, setRain] = useState(false)
  const [toast, setToast] = useState(null)
  const konami = useCallback(() => { setRain(true); sfx.win(); setToast('🎮 cheat code accepted. it is now raining cats.'); setTimeout(() => setRain(false), 6000); setTimeout(() => setToast(null), 4000) }, [])
  const meow = useCallback(() => { sfx.meow(); setToast('🐱 meow back.'); setTimeout(() => setToast(null), 2500) }, [])
  useKonami(konami)
  useMeow(meow)
  const drops = rain ? Array.from({ length: 60 }, (_, i) => ({ id: i, x: Math.random() * 100, d: 2.5 + Math.random() * 3, delay: Math.random() * 2, e: ['🐱', '🧋', '🐈', '☕', '🐾'][i % 5], s: 1 + Math.random() * 1.4 })) : []
  return (
    <>
      <AnimatePresence>
        {rain && (
          <motion.div className="rain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-hidden="true">
            {drops.map((d) => <span key={d.id} style={{ left: d.x + '%', animationDuration: d.d + 's', animationDelay: d.delay + 's', fontSize: d.s + 'rem' }}>{d.e}</span>)}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {toast && <motion.div className="toast" role="status" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}>{toast}</motion.div>}
      </AnimatePresence>
    </>
  )
}
