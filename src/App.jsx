import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Cursor from './components/Cursor'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import Hero from './sections/Hero'
import About from './sections/About'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Research from './sections/Research'
import AfterHours from './sections/AfterHours'
import AskMily from './sections/AskMily'
import Footer from './sections/Footer'
import Easter from './components/Easter'
import ErrorBoundary from './components/ErrorBoundary'
import { useTheme } from './hooks/useTheme'
import { useReducedMotion } from './hooks/useMedia'

const RoomGame = lazy(() => import('./game/RoomGame'))

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const { theme, toggle, isNight } = useTheme()
  const reduced = useReducedMotion()

  // smooth scroll (Lenis) wired into GSAP's ticker so ScrollTrigger stays in sync
  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    window.dispatchEvent(new Event('lenis:ready'))
    return () => { gsap.ticker.remove(tick); lenis.destroy(); window.__lenis = null }
  }, [reduced])

  useEffect(() => { window.dispatchEvent(new Event('boba:rebuild')) }, [theme])

  const openGame = useCallback(() => { setPlaying(true); window.__lenis?.stop() }, [])
  const closeGame = useCallback((target) => {
    setPlaying(false); window.__lenis?.start()
    if (target) setTimeout(() => { const el = document.querySelector(target); if (el) (window.__lenis ? window.__lenis.scrollTo(el, { offset: -20 }) : el.scrollIntoView({ behavior: 'smooth' })) }, 350)
  }, [])

  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <Cursor />
      <Nav onPlay={openGame} theme={theme} onToggleTheme={toggle} />
      <main>
        <ErrorBoundary><Hero ready={ready} onPlay={openGame} /></ErrorBoundary>
        <About />
        <Experience />
        <Projects />
        <Research />
        <ErrorBoundary><AfterHours /></ErrorBoundary>
        <ErrorBoundary><AskMily /></ErrorBoundary>
      </main>
      <Footer onPlay={openGame} />
      <Easter />
      {playing && (
        <ErrorBoundary fallback={<div className="game-loading pixel" onClick={() => closeGame()}>the room crashed 🙈 — click to close</div>}>
          <Suspense fallback={<div className="game-loading pixel">loading room…</div>}>
            <RoomGame onExit={closeGame} night={isNight} onToggleNight={toggle} />
          </Suspense>
        </ErrorBoundary>
      )}
      <svg className="grain" aria-hidden="true"><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#grain)" opacity="0.18" /></svg>
    </>
  )
}
