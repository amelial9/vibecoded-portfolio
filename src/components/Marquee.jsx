import './Marquee.css'

export default function Marquee({ items, speed = 40, className = '', reverse = false }) {
  const list = [...items, ...items]
  return (
    <div className={`marquee ${className}`} style={{ '--dur': `${speed}s` }} aria-hidden="true">
      <div className={`marquee-track ${reverse ? 'reverse' : ''}`}>
        {list.map((it, i) => (
          <span className="marquee-item" key={i}>{it}<i className="marquee-dot" /></span>
        ))}
      </div>
    </div>
  )
}
