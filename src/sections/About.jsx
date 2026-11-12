import { ArrowRight } from 'lucide-react'
import { m as motion } from 'framer-motion'
import OtisPortrait from '../components/otis/OtisPortrait.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import revealVariants from './revealVariants.js'
import './About.css'

function About() {
  return (
    <section className="about section-wrap section-space" id="about">
      <SectionHeading
        eyebrow="{ A LITTLE ABOUT ME }"
        title="Building with purpose."
        description="A little curiosity can turn into something extraordinary."
      />

      <motion.div
        className="about-grid about-premium-grid"
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <OtisPortrait />

        <div className="about-copy about-premium-copy">
          <span className="small-label">&#123; WHO I AM &#125;</span>
          <span className="about-premium-kicker">DESIGN MINDED / CODE DRIVEN</span>
          <h3>
            Turning ideas into
            <span className="gradient-text"> interactive reality.</span>
          </h3>
          <p>
            I enjoy creating websites that look good, feel intuitive, and
            work across devices. My current focus is strengthening my
            frontend skills and building projects that solve real problems.
          </p>
          <p>
            I believe in learning by building, improving through feedback,
            and keeping the user at the center of every design decision.
          </p>

          <div className="about-facts">
            <div>
              <strong>React</strong>
              <span>Current focus</span>
            </div>
            <div>
              <strong>UI / UX</strong>
              <span>Design mindset</span>
            </div>
            <div>
              <strong>Always</strong>
              <span>Learning</span>
            </div>
          </div>

          <a href="#contact" className="text-link">
            Let&apos;s connect <ArrowRight size={16} />
          </a>
        </div>
      </motion.div>
    </section>
  )
}

export default About
