import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react'

const navLinks = [
  ['About', '#about'],
  ['Services', '#services'],
  ['Skills', '#skills'],
  ['Projects', '#projects'],
  ['Contact', '#contact'],
]

function Navbar({
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  darkMode,
  onToggleTheme,
  activeSection,
  scrolled,
}) {
  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <a href="#home" className="brand" aria-label="Go to homepage">
        <span className="brand-mark">&#123;$&#125;</span>
        <span className="brand-name">Sameer<span className="brand-dot"></span></span>
      </a>

      <nav className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
        {navLinks.map(([label, href]) => (
          <a
            key={label}
            href={href}
            className={activeSection === href.slice(1) ? 'is-active' : ''}
            aria-current={activeSection === href.slice(1) ? 'true' : undefined}
            onClick={onCloseMenu}
          >
            {label}
          </a>
        ))}
        <a className="nav-contact" href="#contact" onClick={onCloseMenu}>
          Let&apos;s talk <ArrowRight size={15} />
        </a>
      </nav>

      <div className="header-actions">
        <button
          className="icon-button theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <button
          className="icon-button menu-toggle"
          type="button"
          onClick={onToggleMenu}
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
    </header>
  )
}

export default Navbar
