import { useRef } from 'react'
import { sfx } from '../lib/sound'
import { useIsTouch } from '../hooks/useMedia'

// Wraps any element; it drifts toward the cursor while hovered and snaps back on leave.
export default function Magnetic({ children, strength = 0.35, radius = 90, as: Tag = 'span', className = '', sound = true, ...rest }) {
  const ref = useRef(null)
  const touch = useIsTouch()
  const onMove = (e) => {
    if (touch) return
    const el = ref.current
    const r = el.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    const d = Math.hypot(dx, dy)
    if (d > radius + Math.max(r.width, r.height) / 2) { el.style.transform = ''; return }
    el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`
  }
  const onLeave = () => { if (ref.current) ref.current.style.transform = '' }
  const onEnter = () => { if (sound) sfx.hover() }
  return (
    <Tag ref={ref} className={`magnetic ${className}`} onMouseMove={onMove} onMouseLeave={onLeave} onMouseEnter={onEnter}
      style={{ display: 'inline-block', transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)', willChange: 'transform' }} {...rest}>
      {children}
    </Tag>
  )
}
