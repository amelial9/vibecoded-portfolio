import { motion } from 'framer-motion'
import SplitText, { Reveal } from '../components/SplitText'
import TiltCard from '../components/TiltCard'
import Marquee from '../components/Marquee'
import { profile } from '../data/profile'
import { education } from '../data/experiences'
import './About.css'

export default function About() {
  const s = profile.sheet
  return (
    <section className="section about" id="about">
      <Marquee items={['developer', 'CS + INFO @ UW', 'community builder', 'boba + coffee lover', 'Hamilton on loop', 'SQL whisperer', 'mouse-behavior decoder']} speed={38} />

      <div className="container about-grid">
        <div className="about-copy">
          <span className="eyebrow">About · lore</span>
          <h2 className="display about-title">
            <SplitText text="I build thoughtful, user-centered tech (and some wonderfully questionable side projects)." stagger={0.03} />
          </h2>
          <div className="about-paras">
            {profile.intro.map((p, i) => <Reveal key={i} delay={0.1 * i} as="p">{p}</Reveal>)}
            <Reveal delay={0.35} as="p" className="about-motto">{profile.motto}</Reveal>
          </div>
          <Reveal delay={0.4} className="about-edu">
            <div className="about-edu-head">
              <span className="pixel">EDU</span>
              <div>
                <strong>{education.school}</strong>
                <div className="about-edu-deg">{education.degree} · {education.date}</div>
              </div>
            </div>
            <div className="about-courses">
              {education.courses.map((c) => <span className="chip" key={c}>{c}</span>)}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="about-sheet-wrap">
          <TiltCard className="sheet" max={7}>
            <div className="sheet-head">
              <img src={profile.portrait} alt="" className="sheet-avatar" />
              <div>
                <div className="pixel sheet-name">AMELIA</div>
                <div className="sheet-class">{s.class}</div>
                <div className="sheet-lv"><span className="pixel">LV {s.level}</span> · {s.levelLabel} · HP: {s.hp}</div>
              </div>
            </div>
            <div className="sheet-stats">
              {s.stats.map((st, i) => (
                <div className="stat" key={st.key}>
                  <span className="stat-key">{st.key}</span>
                  <span className="stat-bar"><motion.i initial={{ width: 0 }} whileInView={{ width: st.val + '%' }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }} /></span>
                  <span className="stat-val pixel">{st.val}</span>
                </div>
              ))}
            </div>
            <div className="sheet-row">
              <div>
                <div className="sheet-label pixel">INVENTORY</div>
                <ul className="sheet-inv">{s.inventory.map((it) => <li key={it}>{it}</li>)}</ul>
              </div>
              <div>
                <div className="sheet-label pixel">QUESTS</div>
                <ul className="sheet-quests">{s.quests.map((q) => <li key={q.name} data-status={q.status}><i />{q.name}</li>)}</ul>
              </div>
            </div>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  )
}
