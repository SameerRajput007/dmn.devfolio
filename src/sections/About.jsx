import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import portraitImage from '../assets/portrait.jpg'
import SectionHeading from '../components/SectionHeading.jsx'
import revealVariants from './revealVariants.js'

function About() {
  return (
    <section className="about section-wrap section-space" id="about">
      <SectionHeading
        eyebrow="{ A LITTLE ABOUT ME }"
        title="Building with purpose."
        description="A little curiosity can turn into something extraordinary."
      />

      <motion.div
        className="about-grid"
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="about-image-wrap">
          <img src={portraitImage} alt="Sameer profile" loading="lazy" decoding="async" />
          <div className="image-caption">
            <span className="caption-line" />
            <span>Developer in progress</span>
          </div>
        </div>

        <div className="about-copy">
          <span className="small-label">&#123; WHO I AM &#125;</span>
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
