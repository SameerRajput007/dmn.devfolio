import { lazy, Suspense, useEffect, useState } from 'react'
import { ArrowRight, ArrowUp } from 'lucide-react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { projects, roles, skills } from './data/portfolioData.js'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Hero from './sections/Hero.jsx'
import About from './sections/About.jsx'
import Services from './sections/Services.jsx'
import Skills from './sections/Skills.jsx'
import Projects from './sections/Projects.jsx'
import Contact from './sections/Contact.jsx'
import './components/TodoList.css'
import './App.css'

const sectionIds = ['home', 'about', 'services', 'skills', 'projects', 'playground', 'contact']

// Below the fold, so load it after the first paint
const TodoList = lazy(() => import('./components/TodoList'))

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved) return saved === 'dark'
    } catch { /* storage unavailable */ }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  const [formStatus, setFormStatus] = useState('')
  const [skillFilter, setSkillFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('All')
  const [activeSection, setActiveSection] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light'
    try { localStorage.setItem('theme', darkMode ? 'dark' : 'light') } catch { /* ignore */ }
  }, [darkMode])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event) => event.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      setShowTop(window.scrollY > 700)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActiveSection(entry.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), 2600)
    return () => clearInterval(timer)
  }, [])

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

  const filteredProjects =
    projectFilter === 'All'
      ? projects
      : projects.filter((project) => project.tags.includes(projectFilter))
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
      <a href="#main" className="skip-link">Skip to content</a>
      <motion.div
        aria-hidden="true"
        style={{
          scaleX,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'var(--accent)',
          transformOrigin: '0% 50%',
          zIndex: 1000,
        }}
      />
      <Navbar
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((current) => !current)}
        onCloseMenu={() => setMenuOpen(false)}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((current) => !current)}
        activeSection={activeSection}
        scrolled={scrolled}
      />

      <main id="main">
        <Hero role={roles[roleIndex]} />
        <About />

        <Services />
        <Skills
          skills={skills}
          filteredSkills={filteredSkills}
          skillFilter={skillFilter}
          onSkillFilterChange={setSkillFilter}
        />

        <Projects
          filteredProjects={filteredProjects}
          projectFilter={projectFilter}
          onProjectFilterChange={setProjectFilter}
        />

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
              Tasks are saved in your browser, so they survive a refresh.
            </p>
          </div>
          <Suspense fallback={<p className="todo-empty">Loading workspace...</p>}>
            <TodoList />
          </Suspense>
        </section>

        <section className="resume-banner section-wrap">
          <div className="resume-content">
            <span className="eyebrow">LET&apos;S BUILD SOMETHING</span>
            <h2>Hiring or collaborating?</h2>
            <p>I&apos;m looking for my first frontend role. Say hello and I&apos;ll reply quickly.</p>
          </div>
          <a className="button button-primary" href="#contact">
            Contact me <ArrowRight size={17} />
          </a>
        </section>

        <Contact formStatus={formStatus} onSubmit={handleContactSubmit} />
      </main>

      <Footer />

      {showTop && (
        <a href="#home" className="back-to-top" aria-label="Back to top">
          <ArrowUp size={18} />
        </a>
      )}
    </div>
  )
}

export default App;
