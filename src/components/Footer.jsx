import './Footer.css'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer" id="contact">
      <div className="site-footer__inner">
        <div className="site-footer__intro">
          <a className="site-footer__brand" href="#home">
            Sameer Singh Rajput<span aria-hidden="true">.</span>
          </a>
          <p>Junior Web Developer</p>
        </div>

        <a className="site-footer__back-to-top" href="#home">
          Back to top <span aria-hidden="true">↑</span>
        </a>

        <div className="site-footer__bottom">
          <p>© {year} Sameer Singh Rajput. All rights reserved.</p>
          <p>Made with care and React.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer