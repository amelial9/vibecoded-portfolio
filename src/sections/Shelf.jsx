import { motion } from 'framer-motion'
import { shows } from '../data/fun'
import { TONES } from '../data/music'
import { sfx } from '../lib/sound'
import './Shelf.css'

export default function Shelf() {
  return (
    <div className="shelf">
      <div className="shelf-head">
        <h3 className="display shelf-title">Shows I’ve spent the most time on</h3>
        <span className="pixel shelf-sub">hover to pull one off the shelf</span>
      </div>
      <div className="shelf-row">
        {shows.map((s, i) => (
          <motion.div key={s.title} className="book" style={{ '--bg': TONES[s.tone], '--ink-on': ['mocha', 'cocoa'].includes(s.tone) ? '#FFF7E3' : '#473C35' }}
            initial={{ opacity: 0, y: 30, rotate: 3 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => sfx.hover()} tabIndex={0} data-cursor-label={s.note}>
            <div className="book-spine"><span>{s.title}</span></div>
            <div className="book-cover"><img src={s.poster} alt={`${s.title} poster`} loading="lazy" /><span className="book-title">{s.title}</span></div>
          </motion.div>
        ))}
      </div>
      <div className="shelf-ledge" />
    </div>
  )
}
