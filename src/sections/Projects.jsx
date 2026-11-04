import { ArrowRight, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import SectionHeading from '../components/SectionHeading.jsx'
import formatTechLabel from '../utils/formatTechLabel.js'
import revealVariants from './revealVariants.js'

const projectFilters = ['All', 'React', 'CSS', 'HTML']

function Projects({ filteredProjects, projectFilter, onProjectFilterChange }) {
  return (
    <section className="projects section-wrap section-space" id="projects">
      <SectionHeading
        eyebrow="{ SELECTED WORK }"
        title="Projects in progress."
        description="A few examples of what I build and what I am learning along the way."
      />

      <div className="skills-filter project-filter" role="group" aria-label="Filter projects">
        {projectFilters.map((filter) => (
          <button
            className={projectFilter === filter ? 'is-active' : ''}
            key={filter}
            type="button"
            aria-pressed={projectFilter === filter}
            onClick={() => onProjectFilterChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="project-grid">
        {filteredProjects.map((project, index) => (
          <motion.article
            className="project-card"
            key={project.title}
            initial="hidden"
            whileInView="visible"
            variants={revealVariants}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: index * 0.08 }}
          >
            <div className="project-image">
              <img src={project.image} alt={project.title} loading="lazy" decoding="async" />
              <span className="project-index">0{index + 1}</span>
              {project.link && (
                <a
                  href={project.link}
                  {...(project.link.startsWith('http') && { target: '_blank', rel: 'noreferrer' })}
                  className="project-open"
                  aria-label={`Open ${project.title}`}
                  title={project.title}
                >
                  <ExternalLink size={18} />
                </a>
              )}
            </div>

            <div className="project-body">
              <span className="project-category">{project.category}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag) => <span key={tag}>{formatTechLabel(tag)}</span>)}
              </div>
              {project.link ? (
                <a
                  href={project.link}
                  {...(project.link.startsWith('http') && { target: '_blank', rel: 'noreferrer' })}
                  className="text-link"
                >
                  {project.link.startsWith('#') ? 'Try it below' : 'View project'} <ArrowRight size={16} />
                </a>
              ) : (
                <span className="project-soon">Case study coming soon</span>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export default Projects
