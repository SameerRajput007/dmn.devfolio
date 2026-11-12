import { useRef } from 'react'
import { ArrowDown, ArrowRight, Code2, Mail } from 'lucide-react'
import { m as motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import portraitImage from '../assets/portrait.jpg'
import './CinematicHero.css'

export default function Hero({ role }) {
  const heroRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const rotateY = useTransform(scrollYProgress, [0, 0.8], [-24, 0])
  const shiftX = useTransform(scrollYProgress, [0, 0.8], [45, 0])
  const portraitScale = useTransform(scrollYProgress, [0, 0.8], [1.08, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0.65])

  return (
    <section ref={heroRef} className="hero hero-cinematic hero-red-upgrade" id="home">
      <div className="hero-red-glow" aria-hidden="true" />
      <div className="hero-topline">
        <div className="availability">
          <span className="availability-dot" />
          Open to junior frontend roles and internships
        </div>
        <span className="hero-edition">PORTFOLIO / FRONTEND DEVELOPER</span>
      </div>
      <div className="hero-visual">
        <h1 className="hero-display-name">SAMEER</h1>
        <motion.div
          className="hero-portrait hero-red-portrait"
          style={reduceMotion ? undefined : {
            rotateY, x: shiftX, scale: portraitScale, opacity,
          }}
        >
          <img src={portraitImage} alt="Portrait of Sameer" className="hero-image" fetchPriority="high" decoding="async" />
        </motion.div>
      </div>
      <div className="hero-bottomline">
        <div className="hero-copy">
          <p className="hero-intro">HELLO, I&apos;M SAMEER</p>
          <p className="hero-role"><span key={role} className="hero-role-text">{role}</span></p>
          <p className="hero-description">
            I&apos;m a frontend developer passionate about building modern,
            responsive, and user-friendly web experiences with React.
          </p>
        </div>
        <div className="hero-cta">
          <div className="hero-actions">
            <a href="#projects" className="button button-primary">Explore my work <ArrowRight size={17} /></a>
            <a href="#contact" className="button button-secondary">Get in touch <Mail size={17} /></a>
          </div>
          <div className="social-links">
            <a href="https://github.com/SameerRajput007" target="_blank" rel="noreferrer" aria-label="GitHub" data-tooltip="GitHub"><Code2 size={19} /></a>
            <a href="mailto:sameerrajput493@gmail.com" aria-label="Email" data-tooltip="Email"><Mail size={19} /></a>
            <span className="social-divider" />
            <a href="#visual-lab" className="social-caption lab-hero-link">Try the new visual lab ↗</a>
            <span className="social-caption hero-original-caption">Let&apos;s create something great</span>
          </div>
        </div>
      </div>
      <a href="#about" className="scroll-cue"><span>&#123; SCROLL TO DISCOVER &#125;</span><ArrowDown size={16} /></a>
    </section>
  )
}
