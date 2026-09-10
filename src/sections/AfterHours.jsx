import SplitText, { Reveal } from '../components/SplitText'
import Boombox from './Boombox'
import Shelf from './Shelf'
import Console from './Console'
import './AfterHours.css'

export default function AfterHours() {
  return (
    <section className="section after" id="after-hours">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">After hours · inventory</span>
            <h2 className="display"><SplitText text="What I’m into when the laptop closes." stagger={0.05} /></h2>
          </div>
          <Reveal className="side">A boombox that actually plays, a shelf you can rummage, and a handheld you can beat my high score on.</Reveal>
        </div>
        <div className="after-stack">
          <Reveal><Boombox /></Reveal>
          <Reveal><Shelf /></Reveal>
          <Reveal><Console /></Reveal>
        </div>
      </div>
    </section>
  )
}
