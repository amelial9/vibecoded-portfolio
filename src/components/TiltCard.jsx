import { useRef } from 'react'
import { useIsTouch, useReducedMotion } from '../hooks/useMedia'
import './TiltCard.css'

// 3D tilt + moving glare that follows the pointer.
export default function TiltCard({ children, className = '', max = 10, glare = true, scale = 1.02, style, ...rest }) {
  const ref = useRef(null)
  const touch = useIsTouch()
  const reduced = useReducedMotion()
  const onMove = (e) => {
    if (touch || reduced) return
    const el = ref.current
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const rx = (0.5 - py) * max * 2
    const ry = (px - 0.5) * max * 2
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`
    el.style.setProperty('--gx', `${px * 100}%`)
    el.style.setProperty('--gy', `${py * 100}%`)
  }
  const onLeave = () => { const el = ref.current; if (el) { el.style.transform = ''; } }
  return (
    <div ref={ref} className={`tilt ${className}`} onMouseMove={onMove} onMouseLeave={onLeave} style={style} {...rest}>
      {children}
      {glare && <span className="tilt-glare" aria-hidden="true" />}
    </div>
  )
}
