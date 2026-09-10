import { useEffect, useRef, useState } from 'react'
import SplitText, { Reveal } from '../components/SplitText'
import { sfx } from '../lib/sound'
import './AskMily.css'

// Public Hugging Face Space backing Mily. Endpoint /respond takes { message } and streams the answer.
const SPACE = 'amelial9/milybot'
const SUGGESTIONS = ['Who is Amelia?', 'Where did Amelia work at?', 'Any fun facts about Amelia?']

export default function AskMily() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const clientRef = useRef(null)
  const chatRef = useRef(null)

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight }, [messages])

  async function getClient() {
    if (!clientRef.current) {
      const { Client } = await import('@gradio/client')
      clientRef.current = await Client.connect(SPACE)
    }
    return clientRef.current
  }

  const setLast = (text) => setMessages((m) => { const c = [...m]; c[c.length - 1] = { role: 'mily', text }; return c })

  async function send(text) {
    const q = (text ?? input).trim()
    if (!q || busy) return
    setInput(''); sfx.click()
    setMessages((m) => [...m, { role: 'user', text: q }, { role: 'mily', text: '' }])
    setBusy(true)
    try {
      const client = await getClient()
      const submission = client.submit('/respond', { message: q })
      let got = ''
      for await (const ev of submission) {
        if (ev.type === 'data') { const ans = Array.isArray(ev.data) ? ev.data[0] : ev.data; got = String(ans ?? ''); setLast(got) }
      }
      if (!got.trim()) setLast("hmm, i couldn't come up with a reply just then — mind trying again?")
      else sfx.pop()
    } catch {
      setLast("sorry — couldn't reach me just now. i might've been asleep; give it a few seconds and try again.")
    } finally { setBusy(false) }
  }

  return (
    <section className="section mily" id="mily">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Ask Mily · NPC</span>
            <h2 className="display"><SplitText text="Talk to my tiny AI twin." stagger={0.06} /></h2>
          </div>
          <Reveal className="side">Mily knows my work, projects, and what I’m into. She runs on a Hugging Face Space, so the first reply can take a sec to wake up.</Reveal>
        </div>

        <Reveal className="mily-window">
          <div className="mily-bar">
            <span className="mily-dots"><i /><i /><i /></span>
            <span className="pixel mily-bar-title">MILY.EXE</span>
            <span className={`mily-status ${busy ? 'busy' : ''}`}>{busy ? 'thinking…' : 'online'}</span>
          </div>
          <div className="mily-chat" ref={chatRef}>
            {messages.length === 0 && (
              <div className="mily-msg mily-msg-mily"><MilyFace /> <span>👋 hi, i'm Mily. ask me anything about Amelia.</span></div>
            )}
            {messages.map((m, i) => {
              const isLast = i === messages.length - 1
              const typing = m.role === 'mily' && m.text === '' && busy && isLast
              return (
                <div key={i} className={`mily-msg mily-msg-${m.role}`}>
                  {m.role === 'mily' && <MilyFace />}
                  <span>{typing ? <span className="mily-typing"><i /><i /><i /></span> : m.text}</span>
                </div>
              )
            })}
          </div>
          <div className="mily-suggests">
            {SUGGESTIONS.map((s) => <button key={s} className="chip" onClick={() => send(s)} disabled={busy}>{s}</button>)}
          </div>
          <form className="mily-input-row" onSubmit={(e) => { e.preventDefault(); send() }}>
            <input className="mily-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="ask Mily something…" aria-label="Ask Mily something" data-cursor="text" />
            <button className="btn" type="submit" disabled={busy || !input.trim()}>Send</button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

function MilyFace() {
  return (
    <svg className="mily-face" viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="2" y="2" width="2" height="2" /><rect x="12" y="2" width="2" height="2" />
      <rect x="2" y="4" width="12" height="9" />
      <rect x="5" y="7" width="2" height="2" fill="var(--cream)" /><rect x="9" y="7" width="2" height="2" fill="var(--cream)" />
      <rect x="7" y="10" width="2" height="1" fill="var(--cream)" />
    </svg>
  )
}
