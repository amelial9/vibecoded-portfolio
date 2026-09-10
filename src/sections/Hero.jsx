import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import BobaPhysics from './BobaPhysics'
import Magnetic from '../components/MagneticButton'
import { profile } from '../data/profile'
import { useTypewriter } from '../hooks/useTypewriter'
import { sfx } from '../lib/sound'
import linkedin from '../assets/icons/linkedin.svg'
import github from '../assets/icons/github.svg'
import email from '../assets/icons/email.svg'
import './Hero.css'

const NAME = ['Amelia', 'Li']

export default function Hero({ ready, onPlay }) {
  const hostRef = useRef(null)
  const [physics, setPhysics] = useState(false)
  const role = useTypewriter(profile.roles)

  useEffect(() => {
    if (!ready) return
    const t = setTimeout(() => setPhysics(true), 1500) // wait for the name reveal to land
    return () => clearTimeout(t)
  }, [ready])

  // mouse-reactive gradient blobs
  useEffect(() => {
    const el = hostRef.current
    if (!el) return
    let raf = 0, tx = 50, ty = 40, cx = 50, cy = 40
    const onMove = (e) => { const r = el.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width) * 100; ty = ((e.clientY - r.top) / r.height) * 100 }
    const loop = () => { cx += (tx - cx) * 0.05; cy += (ty - cy) * 0.05; el.style.setProperty('--mx', cx + '%'); el.style.setProperty('--my', cy + '%'); raf = requestAnimationFrame(loop) }
    window.addEventListener('mousemove', onMove, { passive: true }); raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  const scrollTo = (sel) => { const el = document.querySelector(sel); if (!el) return; window.__lenis ? window.__lenis.scrollTo(el, { offset: -20 }) : el.scrollIntoView({ behavior: 'smooth' }) }

  let idx = 0
  return (
    <section className="hero" id="top" ref={hostRef}>
      <div className="hero-bg" aria-hidden="true" />
      <BobaPhysics hostRef={hostRef} lettersSelector=".hero-name [data-char]" active={physics} />

      <div className="container hero-grid">
        <div className="hero-copy">
          <motion.p className="eyebrow hero-eyebrow" initial={{ opacity: 0, y: 10 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.8 }}>
            Hi! 👋 I’m
          </motion.p>

          <h1 className="hero-name display" aria-label="Amelia Li">
            {NAME.map((word, wi) => (
              <span className="hero-word" key={word} aria-hidden="true">
                {Array.from(word).map((ch) => {
                  const i = idx++
                  return (
                    <span className="hero-charwrap" key={i}>
                      <motion.span className="hero-char" data-char initial={{ y: '115%', rotate: 6 }} animate={ready ? { y: 0, rotate: 0 } : {}}
                        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.25 + i * 0.05 }}>{ch}</motion.span>
                    </span>
                  )
                })}
                {wi === 1 && <span className="hero-charwrap"><motion.span className="hero-char hero-dot" data-char initial={{ y: '115%' }} animate={ready ? { y: 0 } : {}} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.25 + idx * 0.05 }}>.</motion.span></span>}
              </span>
            ))}
          </h1>

          <motion.p className="hero-role" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 1.1, duration: 0.8 }}>
            a <span className="hero-role-word">{role}<span className="caret">|</span></span>
          </motion.p>

          <motion.p className="hero-sub" initial={{ opacity: 0, y: 12 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.25, duration: 0.8 }}>
            {profile.tagline}. Builder of practical tools and wonderfully questionable side projects.
          </motion.p>

          <motion.div className="hero-cta" initial={{ opacity: 0, y: 12 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.4, duration: 0.8 }}>
            <Magnetic><button className="btn" onClick={() => { sfx.click(); onPlay() }} data-cursor-label="explore my room"><span className="pixel" style={{ fontSize: '0.75rem' }}>▶ PRESS START</span></button></Magnetic>
            <Magnetic><button className="btn ghost" onClick={() => { sfx.click(); scrollTo('#experience') }}>See my work ↓</button></Magnetic>
            <div className="hero-socials">
              <Magnetic><a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><img src={linkedin} alt="" /></a></Magnetic>
              <Magnetic><a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub"><img src={github} alt="" /></a></Magnetic>
              <Magnetic><a href={profile.links.email} aria-label="Email"><img src={email} alt="" /></a></Magnetic>
            </div>
          </motion.div>
        </div>

        <motion.div className="hero-side" initial={{ opacity: 0, scale: 0.8, rotate: -8 }} animate={ready ? { opacity: 1, scale: 1, rotate: 0 } : {}} transition={{ delay: 0.9, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
          <div className="sticker" data-cursor-label="that's me" onClick={() => sfx.meow()}>
            <svg className="sticker-ring" viewBox="0 0 200 200" aria-hidden="true">
              <defs><path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
              <text><textPath href="#circ">CS + INFO @ UW · SEATTLE · BUILDER · BOBA DEV HOURS · </textPath></text>
            </svg>
            <img src={profile.portrait} alt="Amelia notion-style portrait" className="sticker-img" />
          </div>
          <div className="hero-note pixel">
            <span>drag the pearls 🧋</span>
            <button data-no-spawn onClick={() => hostRef.current?.dispatchEvent(new Event('boba:refill'))}>refill</button>
          </div>
        </motion.div>
      </div>

      <div className="hero-scroll" aria-hidden="true"><span /></div>
    </section>
  )
}
