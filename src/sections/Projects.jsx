import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SplitText, { Reveal } from '../components/SplitText'
import TiltCard from '../components/TiltCard'
import { devProjects, designProjects } from '../data/projects'
import { sfx } from '../lib/sound'
import githubIcon from '../assets/icons/github.svg'
import linkIcon from '../assets/icons/link.svg'
import './Projects.css'

const TABS = [
  { key: 'dev', label: 'Built', items: devProjects },
  { key: 'design', label: 'Designed', items: designProjects },
]

export default function Projects() {
  const [tab, setTab] = useState('dev')
  const [open, setOpen] = useState(null)
  const items = TABS.find((t) => t.key === tab).items

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', onKey)
    window.__lenis?.stop()
    return () => { window.removeEventListener('keydown', onKey); window.__lenis?.start() }
  }, [open])

  return (
    <section className="section projects" id="projects">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Projects · loot</span>
            <h2 className="display"><SplitText text="Things I’ve made." stagger={0.06} /></h2>
          </div>
          <Reveal className="side">Hover for a peek, click for the full story.</Reveal>
        </div>

        <div className="tabs" role="tablist">
          {TABS.map((t) => (
            <button key={t.key} role="tab" aria-selected={tab === t.key} className={`tab ${tab === t.key ? 'is-active' : ''}`} onClick={() => { setTab(t.key); sfx.click() }}>
              {t.label} <span className="tab-count pixel">{t.items.length}</span>
              {tab === t.key && <motion.span layoutId="tab-pill" className="tab-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
            </button>
          ))}
        </div>

        <motion.div className="project-grid" layout>
          <AnimatePresence mode="popLayout">
            {items.map((p, i) => (
              <motion.div key={p.id} layout initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}>
                <TiltCard className="project-card" data-tone={p.tone} onClick={() => { setOpen(p); sfx.pop() }} data-cursor-label="open" role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setOpen(p)}>
                  <div className="project-art"><img src={p.image} alt={p.title} loading="lazy" /></div>
                  <div className="project-body">
                    <div className="project-kicker">{p.kicker}</div>
                    <h3 className="project-title">{p.title}</h3>
                    <p className="project-desc">{p.description}</p>
                    <div className="project-tech">{p.tech.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
                  </div>
                  <span className="project-corner pixel" aria-hidden="true">↗</span>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <motion.div className="modal" data-tone={open.tone} initial={{ y: 60, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0, scale: 0.96 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={open.title}>
              <button className="modal-close" onClick={() => setOpen(null)} aria-label="Close">✕</button>
              <div className="modal-art"><img src={open.image} alt="" /></div>
              <div className="modal-body">
                <div className="project-kicker">{open.kicker}</div>
                <h3 className="display modal-title">{open.title}</h3>
                <p className="modal-desc">{open.description}</p>
                <div className="project-tech">{open.tech.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
                <div className="modal-links">
                  {open.github && <a className="btn ghost" href={open.github} target="_blank" rel="noreferrer"><img className="ico" src={githubIcon} alt="" /> GitHub</a>}
                  {open.link && <a className="btn ghost" href={open.link} target="_blank" rel="noreferrer"><img className="ico" src={linkIcon} alt="" /> Live / Prototype</a>}
                  {open.presentation && <a className="btn ghost" href={open.presentation} target="_blank" rel="noreferrer">▶ Presentation</a>}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
