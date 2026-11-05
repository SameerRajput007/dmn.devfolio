import { useEffect, useRef, useState } from 'react'
import { portfolioKnowledge as info } from '../data/portfolioKnowledge.js'
import './AvatarAssistant.css'

function answerQuestion(input) {
  const q = input.toLowerCase().trim()
  if (!q) return 'Ask me about Sameer, his skills, projects or current work.'
  if (/^(hi|hey|hello|good morning|good evening)[!. ]*$/.test(q)) return "Hey there! I'm Sameer's portfolio guide. What would you like to know?"
  if (/contact|hire|email|reach|collaborat/.test(q)) return info.contact
  if (/project|built|portfolio|task manager|ui experiment/.test(q)) return info.projects.map(p => p.name + ': ' + p.description).join(' ')
  if (/skill|stack|technolog|language|react|javascript|css|html/.test(q)) return 'Sameer works with ' + info.skills.join(', ') + '.'
  if (/currently|working on|current work|building now/.test(q)) return info.currentWork
  if (/who|about|yourself|sameer|background|experience|resume/.test(q)) return info.name + ' is a ' + info.role + '. ' + info.bio
  return "I focus on Sameer's portfolio, projects, skills and work. Try asking me about one of those!"
}

export default function AvatarAssistant() {
  const [open, setOpen] = useState(false)
  const [sound, setSound] = useState(false)
  const [listening, setListening] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState("Hey! Ask me about Sameer's work.")
  const recognition = useRef(null)
  const soundRef = useRef(false)
  const speak = message => {
    if (!soundRef.current || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(message)
    utterance.rate = 0.97
    window.speechSynthesis.speak(utterance)
  }
  const respond = value => {
    if (!value.trim()) return
    const response = answerQuestion(value)
    setAnswer(response)
    setQuestion('')
    setOpen(true)
    speak(response)
  }
  const startListening = () => {
    if (listening) { recognition.current?.stop(); return }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) { setAnswer('Voice input is unavailable in this browser. Please type your question.'); setOpen(true); return }
    const instance = new SpeechRecognition()
    recognition.current = instance
    instance.lang = 'en-IN'
    instance.onresult = event => respond(event.results[0][0].transcript)
    instance.onend = () => setListening(false)
    instance.onerror = () => { setListening(false); setAnswer('I could not hear that. Please try again or type your question.') }
    try { instance.start(); setListening(true) } catch { setListening(false) }
  }
  useEffect(() => () => { recognition.current?.stop(); window.speechSynthesis?.cancel() }, [])
  return (
    <div className="avatar-assistant-panel">
      <button className="avatar-guide-trigger" type="button" onClick={() => {
        const response = "Hey, that tickles! Want to know about Sameer's projects?"
        setAnswer(response); setOpen(true); speak(response)
      }} aria-label="Tap the avatar to ask about Sameer">👋 <span>Tap to meet your guide</span></button>
      <button className="avatar-guide-open" type="button" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        {open ? 'Close guide' : 'Ask the avatar'}
      </button>
      {open && <div className="avatar-guide-chat">
        <p role="status" aria-live="polite">{answer}</p>
        <form onSubmit={event => { event.preventDefault(); respond(question) }}>
          <label className="avatar-guide-label" htmlFor="avatar-guide-question">Ask about Sameer's portfolio</label>
          <div className="avatar-guide-input"><input id="avatar-guide-question" maxLength={250} value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask about projects, skills, work…" /><button type="submit">Ask</button></div>
        </form>
        <div className="avatar-guide-controls">
          <button type="button" aria-pressed={sound} onClick={() => { if (sound) window.speechSynthesis?.cancel(); soundRef.current = !sound; setSound(!sound) }}>{sound ? 'Sound on' : 'Sound off'}</button>
          <button type="button" aria-pressed={listening} onClick={startListening}>{listening ? 'Stop listening' : 'Ask by voice'}</button>
        </div>
        <small>Portfolio-only demo with browser voice features. Voice recognition requires microphone permission. This is not yet a live AI or 3D model.</small>
      </div>}
    </div>
  )
}
