import { ArrowDown, ArrowRight, Code2, Mail, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import './Hero.css'

const narration = "Hey there! I'm Sameer Singh Rajput, a web developer passionate about turning creative ideas into interactive digital experiences. Welcome to my portfolio! This is where I build, experiment, and bring ideas to life. Come on, let me show you around."

function Hero({ role }) {
  const [soundOn, setSoundOn] = useState(false)
  const [speechAvailable, setSpeechAvailable] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const soundRef = useRef(false)
  useEffect(() => {
    setSpeechAvailable(typeof window !== 'undefined' && 'speechSynthesis' in window)
    return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel() }
  }, [])
  const toggleSound = () => {
    if (!speechAvailable) return
    window.speechSynthesis.cancel()
    if (soundRef.current) { soundRef.current = false; setSoundOn(false); setSpeaking(false); return }
    soundRef.current = true; setSoundOn(true)
    const utterance = new SpeechSynthesisUtterance(narration)
    utterance.lang = 'en-US'; utterance.rate = 0.94; utterance.pitch = 0.96
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(v => /en[-_]US/i.test(v.lang) && /male|david|guy|daniel/i.test(v.name)) || voices.find(v => /^en/i.test(v.lang))
    if (preferred) utterance.voice = preferred
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = utterance.onerror = () => { setSpeaking(false); soundRef.current = false; setSoundOn(false) }
    window.speechSynthesis.speak(utterance)
  }
  return (
    <section className="hero hero-contained" id="home">
      <div className="hero-topline">
        <div className="availability"><span className="availability-dot" />Open to junior frontend roles and internships</div>
        <span className="hero-edition">PORTFOLIO / FRONTEND DEVELOPER</span>
      </div>
      <div className="hero-avatar-stage hero-scene" role="img" aria-label="Stylized animated developer avatar walks in from the left beside a desk, laptop, coding monitor, coffee and lamp">
        <div className="scene-glow" />
        <div className="scene-floor" />
        <div className="scene-character">
          <div className="character-shadow" />
          <div className="character-head"><div className="character-hair" /><div className="character-eyes"><i /><i /></div><div className={speaking ? 'character-mouth talking' : 'character-mouth'} /></div>
          <div className="character-neck" /><div className="character-body"><span className="shirt-mark">S.</span></div>
          <div className="character-arm arm-left" /><div className="character-arm arm-right" />
          <div className="character-leg leg-left" /><div className="character-leg leg-right" />
        </div>
        <div className="scene-workspace">
          <div className="scene-lamp"><span /></div>
          <div className="scene-monitor"><div className="monitor-code"><span>&lt;Sameer /&gt;</span><span>const passion = 'build';</span><span>return &lt;Ideas /&gt;;</span></div></div>
          <div className="scene-monitor-neck" />
          <div className="scene-laptop"><span>DEV</span></div>
          <div className="scene-cup" />
          <div className="scene-desk" />
          <div className="scene-desk-leg left" /><div className="scene-desk-leg right" />
          <div className="scene-chair" />
        </div>
        <div className="scene-caption"><span>MEET YOUR DEVELOPER</span><strong>Ideas into interfaces.</strong></div>
        {speechAvailable && <button type="button" className="hero-sound-toggle" onClick={toggleSound} aria-label={soundOn ? 'Turn narration off' : 'Turn narration on'} aria-pressed={soundOn}>
          {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}{soundOn ? 'Sound on' : 'Hear introduction'}
        </button>}
      </div>
      <div className="hero-bottomline">
        <div className="hero-copy"><p className="hero-intro">HELLO, I'M SAMEER</p><p className="hero-role"><span key={role} className="hero-role-text">{role}</span></p><p className="hero-description">I'm a frontend developer passionate about building modern, responsive, and user-friendly web experiences with React.</p></div>
        <div className="hero-cta"><div className="hero-actions"><a href="#projects" className="button button-primary">Explore my work <ArrowRight size={17}/></a><a href="#contact" className="button button-secondary">Get in touch <Mail size={17}/></a></div><div className="social-links"><a href="https://github.com/SameerRajput007" target="_blank" rel="noreferrer" aria-label="GitHub"><Code2 size={19}/></a><a href="mailto:sameerrajput493@gmail.com" aria-label="Email"><Mail size={19}/></a></div></div>
      </div>
      <a href="#about" className="scroll-cue"><span>{'{ SCROLL TO DISCOVER }'}</span><ArrowDown size={16}/></a>
    </section>
  )
}
export default Hero
