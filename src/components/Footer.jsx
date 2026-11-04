import { Code2, Mail } from 'lucide-react'

function Footer() {
  return (
    <footer className="site-footer">
      <a href="#home" className="brand">
        <span className="brand-mark">&#123;$&#125;</span>
        <span className="brand-name">Sameer<span className="brand-dot"></span></span>
      </a>

      <p>Designed and built by self.</p>

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
  )
}

export default Footer
