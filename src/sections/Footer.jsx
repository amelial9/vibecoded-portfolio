import Magnetic from '../components/MagneticButton'
import SplitText from '../components/SplitText'
import Marquee from '../components/Marquee'
import { profile } from '../data/profile'
import { sfx } from '../lib/sound'
import './Footer.css'

export default function Footer({ onPlay }) {
  const year = new Date().getFullYear()
  return (
    <footer className="footer" id="contact">
      <Marquee items={['let’s build something', 'open to summer ’27 internships', 'boba on me', 'say hi']} speed={30} reverse />
      <div className="container footer-grid">
        <div>
          <span className="eyebrow">Contact · save point</span>
          <h2 className="display footer-title"><SplitText text="Let’s make something wonderfully questionable." stagger={0.04} /></h2>
          <div className="footer-cta">
            <Magnetic><a className="btn" href={profile.links.email} onClick={() => sfx.click()}>amelial9@uw.edu</a></Magnetic>
            <Magnetic><a className="btn ghost" href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a></Magnetic>
            <Magnetic><a className="btn ghost" href={profile.links.github} target="_blank" rel="noreferrer">GitHub ↗</a></Magnetic>
          </div>
        </div>
        <ul className="footer-links">
          <li><a className="link-underline" href={profile.links.notes} target="_blank" rel="noreferrer">Notes ↗</a></li>
          <li><a className="link-underline" href={profile.links.linktree} target="_blank" rel="noreferrer">Linktree ↗</a></li>
          <li><button className="link-underline" onClick={onPlay}>▶ Play the room</button></li>
          <li><a className="link-underline" href="#top">Back to top ↑</a></li>
        </ul>
      </div>
      <div className="container footer-bottom">
        <span>© {year} Amelia Li · made with 🧋 and too many tabs open</span>
        <span className="pixel footer-hint">psst: try the konami code · or type “meow”</span>
      </div>
    </footer>
  )
}
