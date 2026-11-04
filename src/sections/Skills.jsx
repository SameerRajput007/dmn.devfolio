import { ArrowRight, Code2, Palette, Smartphone } from 'lucide-react'
import { motion } from 'framer-motion'
import SectionHeading from '../components/SectionHeading.jsx'
import formatTechLabel from '../utils/formatTechLabel.js'

function Skills({ skills, filteredSkills, skillFilter, onSkillFilterChange }) {
  const advancedSkills = skills.filter((skill) => skill.level === 'Advanced')
  const growingSkills = skills.filter((skill) => skill.level !== 'Advanced')

  return (
    <section className="skills section-wrap section-space" id="skills">
      <SectionHeading
        eyebrow="{ MY TOOLKIT }"
        title="Skills that keep growing."
        description="Technologies I use and continue to improve through practice."
      />

      <div className="skills-dashboard">
        <motion.article
          className="skills-panel skills-overview"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="skills-panel-heading">
            <span className="skills-panel-icon"><Code2 size={18} /></span>
            <span className="skills-panel-label">Toolkit snapshot</span>
            <span className="skills-live-indicator">IN PROGRESS</span>
          </div>
          <div className="skills-overview-number">{String(skills.length).padStart(2, '0')}</div>
          <p className="skills-overview-caption">skills in my frontend toolkit</p>
          <p className="skills-overview-copy">
            Learning by building practical, responsive experiences and
            strengthening the fundamentals behind them.
          </p>
          <div className="skills-overview-stats">
            <div>
              <strong>{String(advancedSkills.length).padStart(2, '0')}</strong>
              <span>Advanced</span>
            </div>
            <div>
              <strong>{String(growingSkills.length).padStart(2, '0')}</strong>
              <span>Growing</span>
            </div>
          </div>
        </motion.article>

        <motion.article
          className="skills-panel skills-proficiency"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
        >
          <div className="skills-panel-heading">
            <span className="skills-panel-icon"><Palette size={18} /></span>
            <span className="skills-panel-label">Proficiency overview</span>
          </div>
          <div className="skills-proficiency-list">
            {skills.map((skill, index) => (
              <div className="skills-proficiency-row" key={skill.name}>
                <div className="skills-proficiency-meta">
                  <span className="skills-tech-label">{formatTechLabel(skill.name)}</span>
                  <span>{skill.percent}%</span>
                </div>
                <div
                  className="skills-meter"
                  role="progressbar"
                  aria-label={`${skill.name} proficiency`}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={skill.percent}
                >
                  <motion.span
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.75, delay: index * 0.08 }}
                  />
                </div>
              </div>
            ))}
          </div>
          <span className="skills-panel-footnote">Self-assessed learning progress</span>
        </motion.article>

        <motion.article
          className="skills-panel skills-stack"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16 }}
        >
          <div className="skills-panel-heading">
            <span className="skills-panel-icon"><Smartphone size={18} /></span>
            <span className="skills-panel-label">Core technologies</span>
          </div>
          <div className="skills-stack-list">
            {skills.map((skill, index) => (
              <div className="skills-stack-item" key={skill.name}>
                <span className="skills-stack-index">0{index + 1}</span>
                <span className="skills-stack-name skills-tech-label">{formatTechLabel(skill.name)}</span>
                <span className="skills-stack-category">{skill.category}</span>
              </div>
            ))}
          </div>
          <span className="skills-panel-footnote">The building blocks I use most</span>
        </motion.article>

        <motion.article
          className="skills-panel skills-explorer"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
        >
          <div className="skills-explorer-heading">
            <div>
              <span className="skills-panel-label">Explore my skills</span>
              <p>Browse the tools I use and the areas I&apos;m developing.</p>
            </div>
            <div className="skills-filter" role="group" aria-label="Filter skills">
              {[
                ['all', 'All'],
                ['advanced', 'Advanced'],
                ['growing', 'Growing'],
              ].map(([filter, label]) => (
                <button
                  className={skillFilter === filter ? 'is-active' : ''}
                  key={filter}
                  type="button"
                  aria-pressed={skillFilter === filter}
                  onClick={() => onSkillFilterChange(filter)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="skills-explorer-grid">
            {filteredSkills.map((skill) => (
              <div className="skills-explorer-card" key={skill.name}>
                <div className="skills-explorer-card-top">
                  <span className="skills-explorer-category">{skill.category}</span>
                  <span className="skills-explorer-percent">{skill.percent}%</span>
                </div>
                <strong className="skills-tech-label">{formatTechLabel(skill.name)}</strong>
                <span className="skills-explorer-level">{skill.level}</span>
                <div className="skills-meter skills-explorer-meter">
                  <span style={{ width: `${skill.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.article>

        <motion.article
          className="skills-panel skills-focus"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="skills-panel-heading">
            <span className="skills-panel-icon"><ArrowRight size={18} /></span>
            <span className="skills-panel-label">Current growth areas</span>
          </div>
          <p className="skills-focus-intro">
            Keeping momentum with the skills I&apos;m actively building.
          </p>
          <div className="skills-focus-list">
            {growingSkills.map((skill, index) => (
              <div className="skills-focus-item" key={skill.name}>
                <span className="skills-focus-step">0{index + 1}</span>
                <span className="skills-tech-label">{formatTechLabel(skill.name)}</span>
                <span className="skills-focus-level">{skill.level}</span>
              </div>
            ))}
          </div>
        </motion.article>
      </div>
    </section>
  )
}

export default Skills
