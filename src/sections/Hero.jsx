import {
  ArrowDown,
  ArrowRight,
  Code2,
  Mail,
} from 'lucide-react'
import { m as motion } from 'framer-motion'
import './Hero.css'

function Hero({ role, darkMode }) {
  return (
    <section className="hero hero-cinematic hero-avatar-ready" id="home">
      <div className="hero-topline">
        <div className="availability">
          <span className="availability-dot" />
          Open to junior frontend roles and internships
        </div>
        <span className="hero-edition">PORTFOLIO / FRONTEND DEVELOPER</span>
      </div>

      <motion.div
        className="hero-visual"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
      >
        <h1 className="hero-display-name">SAMEER</h1>

      </motion.div>

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
