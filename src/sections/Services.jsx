import { Code2, Palette, Smartphone, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import SectionHeading from '../components/SectionHeading.jsx'
import revealVariants from './revealVariants.js'

const services = [
  {
    icon: Code2,
    title: 'Web Development',
    description:
      'Building responsive websites with clean, maintainable, and reusable code.',
  },
  {
    icon: Palette,
    title: 'UI Implementation',
    description:
      'Turning design ideas into polished interfaces with thoughtful visual details.',
  },
  {
    icon: Smartphone,
    title: 'Responsive Design',
    description:
      'Creating websites that work smoothly on phones, tablets, and desktops.',
  },
]

function Services() {
  return (
    <section className="services section-wrap section-space" id="services">
      <SectionHeading
        eyebrow="{ WHAT I DO }"
        title="Ideas into experiences."
        description="I focus on the details that make websites useful, engaging, and accessible."
      />

      <div className="service-grid">
        {services.map((service, index) => {
          const Icon = service.icon

          return (
            <motion.article
              className="service-card"
              key={service.title}
              variants={revealVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="service-icon"><Icon size={24} /></div>
              <span className="card-number">0{index + 1}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <a href="#contact" aria-label={`Ask about ${service.title}`}>
                <ArrowRight size={18} />
              </a>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}

export default Services
