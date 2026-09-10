import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { musicTitle, tracks, TONES } from '../data/music'
import { sfx } from '../lib/sound'
import './Boombox.css'

const Eq = ({ on }) => <span className={`bb-eq ${on ? 'on' : ''}`} aria-hidden="true"><i /><i /><i /><i /></span>

export default function Boombox() {
  const [cur, setCur] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [prog, setProg] = useState(0)
  const audioRef = useRef(null)
  const track = cur != null ? tracks[cur] : null
  const glow = track ? TONES[track.tone] : TONES.stone

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    if (track && playing) a.play().catch(() => setPlaying(false))
    else a.pause()
  }, [cur, playing, track])

  const select = (i) => { setCur(i); setPlaying(true); sfx.click() }
  const step = (d) => { if (cur == null) return; setCur((c) => (c + d + tracks.length) % tracks.length); setPlaying(true); sfx.click() }

  return (
    <div className="bb" style={{ '--now': glow }}>
      <div className="bb-title-row">
        <h3 className="display bb-title">{musicTitle}</h3>
        <span className="pixel bb-sub">30s previews · tap a track</span>
      </div>
      <div className="bb-device">
        <div className="bb-handle" />
        <div className="bb-body">
          <div className="bb-screen">
            <div className={`bb-art ${playing ? 'spin' : ''}`}>
              {track ? <img src={track.cover} alt={`${track.title} album art`} /> : <span className="bb-art-empty pixel">NO DISC</span>}
              {track && <i className="bb-art-hole" />}
            </div>
            <div className="bb-main">
              <div className="bb-now">
                <Eq on={playing && !!track} />
                {track ? <span><strong>{track.title}</strong><em>{track.artist}</em></span> : <strong className="bb-idle pixel">— nothing playing —</strong>}
              </div>
              <div className="bb-prog"><motion.i style={{ width: `${prog * 100}%` }} /></div>
              <ul className="bb-list">
                {tracks.map((t, i) => (
                  <li key={t.title}>
                    <button className={`bb-row ${i === cur ? 'is-active' : ''}`} style={{ '--accent': TONES[t.tone] }} onClick={() => select(i)}>
                      <span className="bb-row-icon">{i === cur ? <Eq on={playing} /> : <span className="pixel">{String(i + 1).padStart(2, '0')}</span>}</span>
                      <span className="bb-row-meta"><span className="bb-row-title">{t.title}</span><span className="bb-row-artist">{t.artist}</span></span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bb-panel">
            <span className="bb-speaker" />
            <div className={`bb-controls ${track ? '' : 'is-disabled'}`}>
              <button className="bb-ctrl" onClick={() => step(-1)} disabled={!track} aria-label="Previous"><svg viewBox="0 0 24 24"><path d="M7 5v14M20 5 9 12l11 7z" /></svg></button>
              <button className="bb-ctrl bb-ctrl-main" onClick={() => { setPlaying((p) => !p); sfx.click() }} disabled={!track} aria-label={playing ? 'Pause' : 'Play'}>
                {playing && track ? <svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg> : <svg viewBox="0 0 24 24"><path d="M6 4l14 8L6 20z" /></svg>}
              </button>
              <button className="bb-ctrl" onClick={() => step(1)} disabled={!track} aria-label="Next"><svg viewBox="0 0 24 24"><path d="M17 5v14M4 5l11 7L4 19z" /></svg></button>
            </div>
            <span className="bb-speaker" />
          </div>
        </div>
        {track?.src && <audio ref={audioRef} src={track.src} onEnded={() => step(1)} onTimeUpdate={(e) => setProg(e.target.duration ? e.target.currentTime / e.target.duration : 0)} />}
      </div>
    </div>
  )
}
