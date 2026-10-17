import './components/TodoList.css';

import { useEffect, useState } from 'react'
import TodoList from './components/TodoList'
import {
  ArrowDown,
  ArrowRight,
  Mail,
  Moon,
  Sun,
  Code2,
  Palette,
  Smartphone,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react'
import { motion } from 'framer-motion'
import portraitImage from './assets/portrait.jpg'
import ghostImage from './assets/ghost-project.jpg'
import './App.css'



const projects = [
  {
    title: 'Portfolio Website',
    category: 'Frontend Development',
    description:
      'A personal portfolio to showcase my skills, projects, and experience with a responsive layout.',
    tags: ['React', 'CSS', 'JavaScript'],
    link: 'https://github.com/',
    image: portraitImage,
  },
  {
    title: 'Todo List App',
    category: 'Web Application',
    description:
      'A simple task manager that helps users add tasks, mark them complete, and remove them.',
    tags: ['React', 'Hooks', 'CSS'],
    link: 'https://github.com/',
    image: ghostImage,
  },
  {
    title: 'Creative UI Design',
    category: 'UI Development',
    description:
      'An exploration of modern interfaces, clean typography, and responsive design patterns.',
    tags: ['HTML', 'CSS', 'Responsive'],
    link: 'https://github.com/',
    image: ghostImage,
  },
]

const skills = [
  { name: 'HTML5', level: 'Advanced', percent: 90, category: 'Markup' },
  { name: 'CSS3', level: 'Advanced', percent: 85, category: 'Styling' },
  { name: 'JavaScript', level: 'Intermediate', percent: 70, category: 'Language' },
  { name: 'React.js', level: 'Intermediate', percent: 70, category: 'Framework' },
  { name: 'Responsive Design', level: 'Intermediate', percent: 80, category: 'Design' },
  { name: 'Git & GitHub', level: 'Learning', percent: 60, category: 'Workflow' },
  { name: 'Bootstrap 5', level: 'Learning', percent: 60, category: 'Framework' },
  { name: 'PHP', level: 'Learning', percent: 50, category: 'Language' },
]

const formatTechLabel = (label) => `{${label}}`

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

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
  )
}

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [formStatus, setFormStatus] = useState('')
  const [skillFilter, setSkillFilter] = useState('all')

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'
  }, [darkMode])

  const reveal = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: 'easeOut' },
    },
  }

  function handleContactSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = formData.get('name')
    const email = formData.get('email')
    const message = formData.get('message')

    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`)
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
    )

    window.location.href =
      `mailto:sameerrajput493@gmail.com?subject=${subject}&body=${body}`

    setFormStatus('Your email app should open with your message ready to send.')
    event.currentTarget.reset()
  }

  const navLinks = [
    ['About', '#about'],
    ['Services', '#services'],
    ['Skills', '#skills'],
    ['Projects', '#projects'],
    ['Contact', '#contact'],
  ]
  const advancedSkills = skills.filter((skill) => skill.level === 'Advanced')
  const growingSkills = skills.filter((skill) => skill.level !== 'Advanced')
  const filteredSkills =
    skillFilter === 'all'
      ? skills
      : skills.filter((skill) =>
          skillFilter === 'advanced'
            ? skill.level === 'Advanced'
            : skill.level !== 'Advanced',
        )

  return (
    <div className="portfolio">
      <header className="site-header">
        <a href="#home" className="brand" aria-label="Go to homepage">
          <span className="brand-mark">&#123;$&#125;</span>
          <span className="brand-name">Sameer<span className="brand-dot"></span></span>
        </a>

        <nav className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
          {navLinks.map(([label, href]) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <a className="nav-contact" href="#contact" onClick={() => setMenuOpen(false)}>
            Let&apos;s talk <ArrowRight size={15} />
          </a>
        </nav>

        <div className="header-actions">
          <button
            className="icon-button theme-toggle"
            type="button"
            onClick={() => setDarkMode((current) => !current)}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          <button
            className="icon-button menu-toggle"
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero hero-cinematic" id="home">
          <div className="hero-topline">
            <div className="availability">
              <span className="availability-dot" />
              Available for learning and opportunities
            </div>
            <span className="hero-edition">PORTFOLIO / FRONTEND DEVELOPER</span>
          </div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <h1 className="hero-display-name">SAMEER</h1>
            <div className="hero-portrait">
              <img src={portraitImage} alt="Sameer" className="hero-image" />
            </div>
          </motion.div>

          <div className="hero-bottomline">
            <div className="hero-copy">
              <p className="hero-intro">HELLO, I&apos;M SAMEER</p>
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
                <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub" data-tooltip="GitHub">
                  <Code2 size={19} />
                </a>
                <a href="https://linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn" data-tooltip="LinkedIn">
                  <span className="linkedin-mark" aria-hidden="true">in</span>
                </a>
                <a href="mailto:sameerrajput493@gmail.com" aria-label="Email" data-tooltip="Email">
                  <Mail size={19} />
                </a>
                <span className="social-divider" />
                <span className="social-caption">Let&apos;s create something great</span>
              </div>
            </div>
          </div>

          <a href="#about" className="scroll-cue">
            <span>&#123; SCROLL TO DISCOVER &#125;</span>
            <ArrowDown size={16} />
          </a>
        </section>

        <section className="about section-wrap section-space" id="about">
          <SectionHeading
            eyebrow="{ A LITTLE ABOUT ME }"
            title="Building with purpose."
            description="A little curiosity can turn into something extraordinary."
          />

          <motion.div
            className="about-grid"
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="about-image-wrap">
              <img src={portraitImage} alt="Sameer profile" />
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
                  variants={reveal}
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
                      onClick={() => setSkillFilter(filter)}
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

        <section className="projects section-wrap section-space" id="projects">
          <SectionHeading
            eyebrow="{ SELECTED WORK }"
            title="Projects in progress."
            description="A few examples of what I build and what I am learning along the way."
          />

          <div className="project-grid">
            {projects.map((project, index) => (
              <motion.article
                className="project-card"
                key={project.title}
                initial="hidden"
                whileInView="visible"
                variants={reveal}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                  <span className="project-index">0{index + 1}</span>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="project-open"
                    aria-label={`Open ${project.title}`}
                    title={project.title}
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>

                <div className="project-body">
                  <span className="project-category">{project.category}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map((tag) => <span key={tag}>{formatTechLabel(tag)}</span>)}
                  </div>
                  <a href={project.link} target="_blank" rel="noreferrer" className="text-link">
                    View project <ArrowRight size={16} />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="todo-section section-wrap section-space" id="playground">
          <div className="todo-section-heading">
            <span className="todo-section-badge">
              <span className="todo-section-badge-dot" />
              MY WORKSPACE
            </span>
            <h2>
              A place for the next
              <br />
              <span>small win.</span>
            </h2>
            <p>
              Use this lightweight task list to organize your next steps.
              <br />
              Tasks currently live in memory only.
            </p>
          </div>
          <TodoList />
        </section>

        <section className="resume-banner section-wrap">
          <div className="resume-content">
            <span className="eyebrow">LET&apos;S BUILD SOMETHING</span>
            <h2>Have a project in mind?</h2>
            <p>I&apos;m always open to connecting, learning, and exploring new opportunities.</p>
          </div>
          <a className="button button-primary" href="#contact">
            Contact me <ArrowRight size={17} />
          </a>
        </section>

        <section className="contact section-wrap section-space" id="contact">
          <SectionHeading
            eyebrow="{ GET IN TOUCH }"
            title="Let&apos;s start a conversation."
            description="Have an idea, an opportunity, or just want to say hello? Send a message."
          />

          <div className="contact-grid">
            <div className="contact-copy">
              <h3>Good things start with a hello.</h3>
              <p>
                Tell me a little about what you have in mind. I&apos;ll be happy
                to hear from you.
              </p>

              <a href="mailto:sameerrajput493@gmail.com" className="contact-method">
                <span className="contact-method-icon"><Mail size={20} /></span>
                <span>
                  <small>Email me</small>
                  <strong>sameerrajput493@gmail.com</strong>
                </span>
                <ArrowRight size={17} />
              </a>

              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                className="contact-method"
              >
                <span className="contact-method-icon"><Code2 size={20} /></span>
                <span>
                  <small>Find me on</small>
                  <strong>GitHub</strong>
                </span>
                <ArrowRight size={17} />
              </a>
            </div>

            <form className="contact-form" onSubmit={handleContactSubmit}>
              <label htmlFor="contact-name">Your name</label>
              <div className="contact-field">
                <input
                  id="contact-name"
                  name="name"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <label htmlFor="contact-email">Email address</label>
              <div className="contact-field">
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <label htmlFor="contact-message">Your message</label>
              <div className="contact-field">
                <textarea
                  id="contact-message"
                  name="message"
                  rows="5"
                  placeholder="Tell me about your idea..."
                  required
                />
              </div>

              <button className="button button-primary" type="submit">
                <span className="button-label">Prepare email</span> <ArrowRight size={17} />
              </button>

              {formStatus && <p className="form-status" role="status">{formStatus}</p>}
              <p className="form-note">
                This opens your default email application; it does not send a message directly from the website.
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a href="#home" className="brand">
          <span className="brand-mark">&#123;$&#125;</span>
          <span className="brand-name">Sameer<span className="brand-dot"></span></span>
        </a>

        <p>Designed and built with care.</p>

        <div className="footer-socials">
          <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub" data-tooltip="GitHub">
            <Code2 size={18} />
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn" data-tooltip="LinkedIn">
            <span className="linkedin-mark" aria-hidden="true">in</span>
          </a>
          <a href="mailto:sameerrajput493@gmail.com" aria-label="Email" data-tooltip="Email">
            <Mail size={18} />
          </a>
        </div>

        <span className="copyright">© {new Date().getFullYear()} Sameer</span>
      </footer>
    </div>
  )
}

export default App;
