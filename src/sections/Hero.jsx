import {
  ArrowDown,
  ArrowRight,
  Code2,
  Mail,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { useRef, useState } from 'react'
import './Hero.css'

function Hero({ role, darkMode }) {
  const videoRef = useRef(null)
  const [soundOn, setSoundOn] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const toggleSound = () => {
    const video = videoRef.current
    if (!video || !videoReady) return
    const next = !soundOn
    video.muted = !next
    setSoundOn(next)
    if (video.paused) video.play().catch(() => {})
  }
  return (
    <section className="hero hero-contained" id="home">
      <div className="hero-topline">
        <div className="availability">
          <span className="availability-dot" />
          Open to junior frontend roles and internships
        </div>
        <span className="hero-edition">PORTFOLIO / FRONTEND DEVELOPER</span>
      </div>

      <div className="hero-avatar-stage" aria-label="Animated avatar introduction">
        <video
          ref={videoRef}
          className="hero-avatar-video"
          autoPlay
          muted
          playsInline
          loop
          preload="metadata"
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
          aria-label="Animated developer avatar introduction"
        >
          <source src="/avatar-intro.mp4" type="video/mp4" />
        </video>
        {!videoReady && (
          <div className="hero-avatar-pending" role="status">
            <span>3D AVATAR INTRODUCTION</span>
            <strong>Animation in production</strong>
            <p>Your animated character will walk in from the left toward the developer workspace on the right.</p>
          </div>
        )}
        {videoReady && (
          <button type="button" className="hero-sound-toggle" onClick={toggleSound}
            aria-label={soundOn ? 'Mute avatar narration' : 'Enable avatar narration'}
            aria-pressed={soundOn}>
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            {soundOn ? 'Sound on' : 'Sound off'}
          </button>
        )}
      </div>

      <div className="hero-bottomline">
        <div className="hero-copy">
          <p className="hero-intro">HELLO, I&apos;M SAMEER</p>
          <p className="hero-role">
            <span key={role} className="hero-role-text">{role}</span>
          </p>
          <p className="hero-description">
            I&apos;m a frontend developer passionate about building modern,
            responsive, and user-friendly web experiences with React.
          </p>
        </div>

        <div className="hero-cta">
          <div className="hero-actions">
            <a href="#projects" className="button button-primary">
              Explore my work <ArrowRight size={17} />
            </a>
            <a href="#contact" className="button button-secondary">
              Get in touch <Mail size={17} />
            </a>
          </div>

          <div className="social-links">
            <a href="https://github.com/SameerRajput007" target="_blank" rel="noreferrer" aria-label="GitHub" data-tooltip="GitHub">
              <Code2 size={19} />
            </a>
            <a href="mailto:sameerrajput493@gmail.com" aria-label="Email" data-tooltip="Email">
              <Mail size={19} />
            </a>

          </div>
        </div>
      </div>

      <a href="#about" className="scroll-cue">
        <span>&#123; SCROLL TO DISCOVER &#125;</span>
        <ArrowDown size={16} />
      </a>
    </section>
  )
}

export default Hero
