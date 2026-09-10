import { useEffect, useRef } from 'react'
import { useIsTouch, useReducedMotion } from '../hooks/useMedia'
import cat1 from '../assets/cursor/catcursor1-48.png'
import cat2 from '../assets/cursor/catcursor2-48.png'
import './Cursor.css'

// Custom cursor: the cat face rides exactly on the pointer; a soft ring lags behind
// and morphs when hovering interactive elements. Disabled on touch devices.
export default function Cursor() {
  const touch = useIsTouch()
  const reduced = useReducedMotion()
  const catRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    if (touch) return
    document.body.classList.add('has-custom-cursor')
    const cat = catRef.current, ring = ringRef.current, label = labelRef.current
    let mx = window.innerWidth / 2, my = window.innerHeight / 2
    let rx = mx, ry = my
    let raf = 0, visible = false, hovering = false, down = false

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY
      if (!visible) { visible = true; cat.style.opacity = 1; ring.style.opacity = 1 }
      cat.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%) scale(${down ? 0.85 : 1})`
    }
    const onOver = (e) => {
      const t = e.target.closest?.('a, button, [data-cursor], input, textarea, select, label, summary')
      const cur = t?.dataset?.cursor
      hovering = !!t
      ring.classList.toggle('is-hover', hovering && cur !== 'none')
      ring.classList.toggle('is-text', cur === 'text')
      ring.classList.toggle('is-grab', cur === 'grab')
      cat.src = hovering ? cat2 : cat1
      const txt = t?.dataset?.cursorLabel
      label.textContent = txt || ''
      ring.classList.toggle('has-label', !!txt)
    }
    const onDown = () => { down = true; ring.classList.add('is-down') }
    const onUp = () => { down = false; ring.classList.remove('is-down') }
    const onLeave = () => { visible = false; cat.style.opacity = 0; ring.style.opacity = 0 }
    const loop = () => {
      const k = reduced ? 1 : 0.18
      rx += (mx - rx) * k; ry += (my - ry) * k
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(loop)
    return () => {
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [touch, reduced])

  if (touch) return null
  return (
    <>
      <div className="cursor-ring" ref={ringRef} aria-hidden="true"><span ref={labelRef} className="cursor-label" /></div>
      <img className="cursor-cat" ref={catRef} src={cat1} alt="" aria-hidden="true" draggable="false" />
    </>
  )
}
