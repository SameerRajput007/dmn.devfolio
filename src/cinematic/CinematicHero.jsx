import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import './cinematic.css'

const Scene = lazy(() => import('./Scene'))


const FAQ = [
  ['What do you work with?', 'I build responsive web experiences using React, JavaScript, HTML, CSS, and Git.'],
  ['Show me your projects', 'Explore the Projects section below to see my portfolio, task manager, and interface experiments.'],
  ['Are you available for work?', 'I am open to junior frontend opportunities and collaborations.'],
  ['How can I contact you?', 'Use the Contact section below to reach me directly.'],
]

export default function CinematicHero({ embedded = false }) {
  const [ready, setReady] = useState(false)
  const [start, setStart] = useState(false)
  const [skip, setSkip] = useState(false)
  const [stage, setStage] = useState('wait')
  const [attention, setAttention] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [answer, setAnswer] = useState('Hey! I’m Sameer’s portfolio assistant. What would you like to know?')
  const [muted, setMuted] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    if (!ready) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const id = window.setTimeout(() => {
      if (reduced) setSkip(true)
      setStart(true)
    }, 450)
    return () => window.clearTimeout(id)
  }, [ready])

  const greet = useCallback(() => {
    if (stage !== 'seated') return
    setAttention(true)
    setChatOpen(true)
  }, [stage])

  const hover = useCallback((over) => {
    if (timer.current) clearTimeout(timer.current)
    if (over && stage === 'seated' && !muted) timer.current = setTimeout(greet, 1000)
  }, [stage, muted, greet])

  useEffect(() => () => clearTimeout(timer.current), [])

  const Container = embedded ? 'div' : 'section'

  return (
    <Container className={`dmn-cinematic${embedded ? ' dmn-cinematic--embedded' : ''}`} id={embedded ? undefined : 'cinematic'} aria-label="Interactive 3D developer studio">
      <div className="dmn-cinematic__canvas" aria-hidden="true">
        <Suspense fallback={<div className="dmn-cinematic__loading">Preparing the studio…</div>}>
          <Scene start={start} skip={skip} attention={attention} talking={false}
            onReady={() => setReady(true)} onStage={setStage}
            onAvatarClick={greet} onAvatarHover={hover} />
        </Suspense>
      </div>
      <div className="dmn-cinematic__shade" aria-hidden="true" />
      {!embedded && <div className="dmn-cinematic__intro">
        <span className="dmn-cinematic__eyebrow"><span /> THE INTERACTIVE STUDIO · 2026</span>
        <h2>Where ideas<br /><em>come to life.</em></h2>
        <p>Step inside my workspace. Watch me build, then say hello.</p>
        <div className="dmn-cinematic__links">
          <a href="#projects">Explore projects <span aria-hidden="true">↗</span></a>
          <a href="#contact">Let’s talk <span aria-hidden="true">↗</span></a>
        </div>
      </div>}
      <div className="dmn-cinematic__controls">
        {start && stage !== 'seated' && <button onClick={() => setSkip(true)}>Skip introduction</button>}
        <button onClick={() => setMuted(v => !v)} aria-label={muted ? 'Enable hover greeting' : 'Disable hover greeting'}>{muted ? 'Enable greeting' : 'Quiet mode'}</button>
        {stage === 'seated' && <button className="dmn-cinematic__greet" onClick={greet}>Say hello ↗</button>}
        <span className="dmn-cinematic__status"><span /> {stage === 'seated' ? 'WORKSPACE ONLINE' : 'ENTERING THE STUDIO'}</span>
      </div>
      {chatOpen && <aside className="dmn-cinematic__chat" aria-label="Portfolio assistant">
        <div className="dmn-cinematic__chathead"><strong>ASK ABOUT MY WORK</strong><button onClick={() => { setChatOpen(false); setAttention(false) }} aria-label="Close assistant">×</button></div>
        <p aria-live="polite">{answer}</p>
        <div className="dmn-cinematic__questions">{FAQ.map(([question, response]) => <button key={question} onClick={() => setAnswer(response)}>{question}</button>)}</div>
        <small>This preview answers common portfolio questions. Live AI chat is not enabled.</small>
      </aside>}
    </Container>
  )
}
