import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Magnetic from './MagneticButton'
import { profile } from '../data/profile'
import { sfx, setSoundEnabled, isSoundEnabled, onSoundChange } from '../lib/sound'
import './Nav.css'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'After hours', href: '#after-hours' },
  { label: 'Ask Mily', href: '#mily' },
]

export default function Nav({ onPlay, theme, onToggleTheme }) {
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [sound, setSound] = useState(isSoundEnabled())
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => onSoundChange(setSound), [])
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      if (open) { setHidden(false); return }
      if (y < 60) setHidden(false)
      else if (y > last + 4) setHidden(true)
      else if (y < last - 4) setHidden(false)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

  useEffect(() => { document.documentElement.classList.toggle('menu-open', open) }, [open])

  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    sfx.click()
    const el = document.querySelector(href)
    if (!el) return
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -20, duration: 1.4 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleSound = () => { const v = !sound; setSoundEnabled(v); sfx.toggle(v) }

  return (
    <>
      <motion.header className={`nav ${scrolled ? 'is-scrolled' : ''}`} animate={{ y: hidden && !open ? -110 : 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
        <div className="nav-inner">
          <a href="#top" className="nav-brand" onClick={(e) => go(e, '#top')} data-cursor="hover">
            <img src={profile.portrait} alt="" className="nav-avatar" />
            <span className="nav-name">Amelia Li</span>
            <span className="nav-status"><i /> open to summer ’27</span>
          </a>

          <nav className="nav-links" aria-label="Primary">
            {LINKS.map((l) => (
              <Magnetic key={l.href} strength={0.25} radius={40}>
                <a href={l.href} className="nav-link link-underline" onClick={(e) => go(e, l.href)}>{l.label}</a>
              </Magnetic>
            ))}
          </nav>

          <div className="nav-actions">
            <button className="icon-btn" onClick={toggleSound} aria-label={sound ? 'Mute sounds' : 'Enable sounds'} title={sound ? 'sound: on' : 'sound: off'} data-cursor="hover">
              <span className={`eq ${sound ? 'on' : ''}`}><i /><i /><i /><i /></span>
            </button>
            <button className="icon-btn" onClick={() => { onToggleTheme(); sfx.toggle(theme !== 'night') }} aria-label="Toggle day / night" data-cursor="hover">
              <span className="sun-moon" data-theme={theme}><i className="sun" /><i className="moon" /></span>
            </button>
            <Magnetic strength={0.3}>
              <button className="btn matcha nav-play" onClick={() => { sfx.click(); onPlay() }} data-cursor-label="press start">
                <span className="pixel">▶ PLAY</span>
              </button>
            </Magnetic>
            <button className={`burger ${open ? 'is-open' : ''}`} onClick={() => { setOpen((o) => !o); sfx.click() }} aria-label="Menu" aria-expanded={open}>
              <i /><i /><i />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div className="menu" initial={{ clipPath: 'circle(0% at 100% 0%)' }} animate={{ clipPath: 'circle(150% at 100% 0%)' }} exit={{ clipPath: 'circle(0% at 100% 0%)' }} transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}>
            <ul className="menu-list">
              {LINKS.map((l, i) => (
                <motion.li key={l.href} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                  <a href={l.href} className="menu-link display" onClick={(e) => go(e, l.href)}>{l.label}</a>
                </motion.li>
              ))}
              <motion.li initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 + LINKS.length * 0.06, duration: 0.6 }}>
                <button className="menu-link display play" onClick={() => { setOpen(false); onPlay() }}>▶ Play the room</button>
              </motion.li>
            </ul>
            <div className="menu-foot">
              <a href={profile.links.notes} target="_blank" rel="noreferrer">Notes ↗</a>
              <a href={profile.links.linktree} target="_blank" rel="noreferrer">Linktree ↗</a>
              <a href={profile.links.github} target="_blank" rel="noreferrer">GitHub ↗</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
