import { useState } from 'react'
import './Navbar.css'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <a className="navbar__brand" href="#home" onClick={closeMenu}>
          <span className="navbar__brand-mark" aria-hidden="true">S</span>
          <span>Sam<span className="navbar__brand-dot">.</span></span>
        </a>

        <button
          className="navbar__toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="navbar-links"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <div
          className={`navbar__content${menuOpen ? ' navbar__content--open' : ''}`}
          id="navbar-links"
        >
          <ul className="navbar__links">
            {links.map(({ label, href }) => (
              <li key={label}>
                <a href={href} onClick={closeMenu}>{label}</a>
              </li>
            ))}
          </ul>
          <a className="navbar__cta" href="#contact" onClick={closeMenu}>
            Let&apos;s talk <span aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>
    </header>
  )
}

export default Navbar;