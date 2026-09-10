import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import SplitText, { Reveal } from '../components/SplitText'
import { research } from '../data/fun'
import './Research.css'

export default function Research() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const rot = useTransform(scrollYProgress, [0, 1], [-3, 3])

  return (
    <section className="section research" id="research" ref={ref}>
      <div className="container research-grid">
        <div className="research-copy">
          <span className="eyebrow">Research · side quest</span>
          <h2 className="display"><SplitText text="Teaching machines to read a mouse’s mood." stagger={0.05} /></h2>
          {research.text.map((t, i) => <Reveal key={i} as="p" delay={0.1 * i} className="research-p">{t.replace('Golden Lab', '__LAB__').split('__LAB__').map((s, j, arr) => <span key={j}>{s}{j < arr.length - 1 && <a className="link-underline research-lab" href={research.labUrl} target="_blank" rel="noreferrer">Golden Lab</a>}</span>)}</Reveal>)}
          <Reveal delay={0.25} className="research-posters">
            {research.posters.map((p) => (
              <a key={p.year} className="poster" href={p.href} target="_blank" rel="noreferrer" data-cursor-label="open pdf">
                <span className="poster-year pixel">{p.year}</span>
                <span className="poster-label">{p.label}</span>
                <span className="poster-arrow">→</span>
              </a>
            ))}
          </Reveal>
          <Reveal delay={0.3} as="p" className="research-more">More research stuff coming once published :D</Reveal>
        </div>
        <div className="research-visual">
          <motion.div className="research-photo" style={{ y, rotate: rot }}>
            <img src={research.images.desktop} alt="Amelia's cats, the unofficial lab assistants" />
            <span className="research-caption pixel">unofficial lab assistants 🐈</span>
          </motion.div>
          <div className="research-trace" aria-hidden="true">
            <svg viewBox="0 0 400 80" preserveAspectRatio="none">
              <motion.path d="M0 40 L30 40 L40 20 L50 60 L60 40 L120 40 L130 10 L140 70 L150 40 L220 40 L230 25 L240 55 L250 40 L320 40 L330 15 L340 65 L350 40 L400 40" fill="none" stroke="currentColor" strokeWidth="2" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.2, ease: 'easeInOut' }} />
            </svg>
            <span className="pixel">behavior · physiology · time-series</span>
          </div>
        </div>
      </div>
    </section>
  )
}
