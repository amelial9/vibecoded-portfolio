import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitText from '../components/SplitText'
import { experiences } from '../data/experiences'
import { useIsDesktop, useReducedMotion } from '../hooks/useMedia'
import './Experience.css'

gsap.registerPlugin(ScrollTrigger)

// Pinned section: vertical scroll drives a horizontal timeline of cards.
// Falls back to a normal vertical stack on small screens / reduced motion.
export default function Experience() {
  const wrap = useRef(null)
  const track = useRef(null)
  const cupRef = useRef(null)
  const desktop = useIsDesktop()
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    if (!desktop || reduced) return
    const ctx = gsap.context(() => {
      const t = track.current
      const getDist = () => t.scrollWidth - window.innerWidth
      const tween = gsap.to(t, {
        x: () => -getDist(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: () => '+=' + (getDist() + window.innerHeight * 0.4),
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => { if (cupRef.current) cupRef.current.style.setProperty('--fill', (self.progress * 100).toFixed(1) + '%') },
        },
      })
      gsap.utils.toArray('.xp-card').forEach((card) => {
        gsap.fromTo(card, { y: 40, rotate: 2 }, { y: 0, rotate: 0, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 90%', end: 'left 55%', scrub: true } })
      })
    }, wrap)
    const onRefresh = () => ScrollTrigger.refresh()
    window.addEventListener('lenis:ready', onRefresh)
    setTimeout(onRefresh, 400)
    return () => { ctx.revert(); window.removeEventListener('lenis:ready', onRefresh) }
  }, [desktop, reduced])

  return (
    <section className={`xp ${desktop && !reduced ? 'is-pinned' : ''}`} id="experience" ref={wrap}>
      <div className="xp-track" ref={track}>
        <div className="xp-intro">
          <span className="eyebrow">Experience · quest log</span>
          <h2 className="display"><SplitText text="Places I’ve shipped, taught & researched." stagger={0.05} /></h2>
          <p className="xp-hint">{desktop && !reduced ? 'keep scrolling →' : 'a scroll-through of the last couple years'}</p>
          <div className="xp-cup" ref={cupRef} aria-hidden="true">
            <div className="cup"><div className="tea" /><div className="pearls"><i /><i /><i /><i /><i /><i /></div></div>
            <div className="straw" />
          </div>
        </div>

        {experiences.map((x, i) => (
          <article className="xp-card" key={x.title + x.org} data-tone={x.tone} style={{ '--i': i }}>
            <header className="xp-card-head">
              <span className="xp-index pixel">0{i + 1}</span>
              <img src={x.logo} alt={x.org + ' logo'} className="xp-logo" />
            </header>
            <div className="xp-date">{x.date}</div>
            <h3 className="xp-title">{x.title}</h3>
            <div className="xp-org">{x.org}</div>
            <p className="xp-blurb">{x.blurb}</p>
            <p className="xp-detail">{x.detail}</p>
            <div className="xp-skills">{x.skills.map((s) => <span className="chip" key={s}>{s}</span>)}</div>
            <span className="xp-stamp pixel" aria-hidden="true">{i === 0 || i === 2 ? 'ACTIVE' : 'CLEARED'}</span>
          </article>
        ))}

        <div className="xp-end">
          <div className="pixel xp-end-txt">TO BE CONTINUED…</div>
          <p>Summer ’27: open to software engineering internships.</p>
          <a className="btn" href="mailto:amelial9@uw.edu">Say hi ✉</a>
        </div>
      </div>
    </section>
  )
}
