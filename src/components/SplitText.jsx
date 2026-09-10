import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

// Word-by-word (or char-by-char) reveal that plays once when the whole phrase scrolls into view.
// The viewport observer sits on the outer element (children are clipped, so they can't observe themselves).
export default function SplitText({ text, by = 'word', delay = 0, stagger = 0.045, className = '', once = true, y = '110%', style }) {
  const parts = by === 'char' ? Array.from(text) : text.split(' ')
  return (
    <motion.span className={className} aria-label={text} style={style} initial="hidden" whileInView="show" viewport={{ once, margin: '-8% 0px' }}>
      {parts.map((p, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.1em', marginBottom: '-0.1em' }} aria-hidden="true">
          <motion.span
            style={{ display: 'inline-block', willChange: 'transform' }}
            variants={{ hidden: { y, rotate: 4, opacity: 0 }, show: { y: 0, rotate: 0, opacity: 1, transition: { duration: 0.9, ease: EASE, delay: delay + i * stagger } } }}
          >
            {p}
          </motion.span>
        </span>
      )).flatMap((el, i) => (by === 'word' && i < parts.length - 1 ? [el, ' '] : [el]))}
    </motion.span>
  )
}

export function Reveal({ children, delay = 0, y = 28, className = '', once = true, as = 'div', ...rest }) {
  const M = motion[as] || motion.div
  return (
    <M className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-8% 0px' }} transition={{ duration: 0.9, ease: EASE, delay }} {...rest}>
      {children}
    </M>
  )
}
