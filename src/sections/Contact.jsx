import { ArrowRight, Code2, Mail } from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'

function Contact({ formStatus, onSubmit }) {
  return (
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

        <form className="contact-form" onSubmit={onSubmit}>
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
  )
}

export default Contact
