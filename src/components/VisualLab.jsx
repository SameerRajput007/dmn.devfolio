import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Layers, RotateCcw, Sparkles } from 'lucide-react'
import portrait from '../assets/portrait.jpg'
import './VisualLab.css'

const effects = [
  ['particles', '01', 'Particles', 'A portrait rebuilt from thousands of points. Move across it to scatter the image.'],
  ['dither', '02', '1-bit', 'A two-color portrait with an ordered dithering pattern.'],
  ['crt', '03', 'CRT', 'A little analog nostalgia: phosphor color, curved edges, and scanlines.'],
  ['datamosh', '04', 'Datamosh', 'An art-directed glitch study with displaced image bands.'],
  ['flashlight', '05', 'Flashlight', 'Move over the portrait to reveal its color through a pool of light.'],
]

function PortraitCanvas({ effect, running }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const context = canvas.getContext('2d')
    if (!context) return
    const image = new Image()
    let frame = 0
    let observer
    let visible = false
    let ready = false
    let disposed = false
    let points = []
    const pointer = { x: -1000, y: -1000 }
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const width = 400
    const height = 480
    canvas.width = width
    canvas.height = height
    const matrix = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
    function draw() {
      frame = 0
      if (!ready || disposed) return
      context.fillStyle = '#101110'
      context.fillRect(0, 0, width, height)
      const animate = running && !motion.matches && visible
      for (const point of points) {
        const dx = point.x - pointer.x
        const dy = point.y - pointer.y
        const distance = Math.hypot(dx, dy)
        const force = animate ? Math.max(0, 1 - distance / 90) * 28 : 0
        context.fillStyle = effect === 'dither' ? point.mono : point.color
        context.fillRect(point.x + dx / (distance || 1) * force, point.y + dy / (distance || 1) * force, effect === 'dither' ? 4 : 3, effect === 'dither' ? 4 : 3)
      }
      // Render on interaction rather than running an idle animation loop.
    }
    function redraw() {
      cancelAnimationFrame(frame)
      draw()
    }
    function move(event) {
      const bounds = canvas.getBoundingClientRect()
      pointer.x = (event.clientX - bounds.left) * width / bounds.width
      pointer.y = (event.clientY - bounds.top) * height / bounds.height
      if (!frame) frame = requestAnimationFrame(draw)
    }
    function leave() { pointer.x = pointer.y = -1000; redraw() }
    observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; redraw() })
    observer.observe(canvas)
    image.onload = () => {
      if (disposed) return
      const scale = Math.max(width / image.width, height / image.height)
      context.drawImage(image, (width - image.width * scale) / 2, (height - image.height * scale) / 2, image.width * scale, image.height * scale)
      const { data } = context.getImageData(0, 0, width, height)
      for (let y = 0; y < height; y += 4) {
        for (let x = 0; x < width; x += 4) {
          const offset = (y * width + x) * 4
          const [r, g, b] = data.slice(offset, offset + 3)
          const light = .299 * r + .587 * g + .114 * b
          points.push({ x, y, color: `rgb(${r},${g},${b})`, mono: light > matrix[(y / 4 % 4) * 4 + x / 4 % 4] * 16 ? '#f3ead7' : '#141612' })
        }
      }
      ready = true
      redraw()
    }
    image.src = portrait
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerleave', leave)
    motion.addEventListener('change', redraw)
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerleave', leave)
      motion.removeEventListener('change', redraw)
      points = []
    }
  }, [effect, running])
  return <canvas ref={ref} className="lab-canvas" role="img" aria-label={`Sameer’s portrait rendered as ${effect === 'dither' ? 'a two-color dither' : 'interactive particles'}`} />
}

export default function VisualLab() {
  const [effect, setEffect] = useState('particles')
  const [view, setView] = useState('portrait')
  const [depth, setDepth] = useState(45)
  const [angle, setAngle] = useState(0)
  const [running, setRunning] = useState(true)
  const stage = useRef(null)
  const selected = effects.find(([id]) => id === effect)
  function moveLight(event) {
    const bounds = event.currentTarget.getBoundingClientRect()
    stage.current.style.setProperty('--light-x', `${(event.clientX - bounds.left) / bounds.width * 100}%`)
    stage.current.style.setProperty('--light-y', `${(event.clientY - bounds.top) / bounds.height * 100}%`)
  }
  function reset() { setEffect('particles'); setView('portrait'); setDepth(45); setAngle(0); setRunning(true) }
  return (
    <section className="visual-lab section-wrap section-space" id="visual-lab" aria-labelledby="lab-title">
      <div className="lab-heading">
        <div><span className="eyebrow">{'{ THE EXPERIMENTAL SIDE }'}</span><h2 id="lab-title">A little less ordinary<span>.</span></h2></div>
        <p>Same portrait. Different possibilities.<br />A hands-on collection of visual experiments.</p>
      </div>
      <div className="lab-shell">
        <div className="lab-toolbar"><span><Sparkles size={16} /> INTERACTION LAB / 001</span><button type="button" onClick={reset}><RotateCcw size={14} /> Reset</button></div>
        <div className="lab-grid">
          <div className="lab-controls">
            <span className="lab-label">CHOOSE A TREATMENT</span>
            <div className="lab-effects" role="group" aria-label="Portrait treatment">
              {effects.map(([id, number, label]) => <button key={id} type="button" onClick={() => setEffect(id)} aria-pressed={effect === id}><span>{number}</span>{label}<ArrowUpRight size={16} /></button>)}
            </div>
            <p className="lab-description" aria-live="polite">{selected[3]}</p>
            <button className="lab-motion" type="button" aria-pressed={!running} onClick={() => setRunning(!running)}>{running ? 'Pause effects' : 'Resume effects'}</button>
            <span className="lab-footnote">Built with Canvas, CSS & curiosity.<br />Your reduced-motion preference is respected.</span>
          </div>
          <div ref={stage} className={`lab-stage effect-${effect} view-${view} ${running ? '' : 'lab-paused'}`} onPointerMove={moveLight} onPointerLeave={() => { stage.current.style.setProperty('--light-x', '50%'); stage.current.style.setProperty('--light-y', '50%') }} style={{ '--depth': `${depth}px`, '--angle': `${angle}deg` }}>
            <div className="lab-stage-meta"><span>SR—PORTRAIT STUDY</span><span>EST. 2026</span></div>
            <div className="lab-object">
              <div className="lab-layer layer-grid"><span>01 / STRUCTURE</span></div>
              <div className="lab-layer layer-image">
                {(effect === 'particles' || effect === 'dither') ? <PortraitCanvas effect={effect} running={running} /> : <img src={portrait} alt="Sameer, frontend developer" loading="lazy" width="400" height="480" />}
                {effect === 'flashlight' && <img className="lab-light-image" src={portrait} alt="" aria-hidden="true" width="400" height="480" />}
                {effect === 'datamosh' && <div className="lab-glitch" aria-hidden="true" style={{ backgroundImage: `url(${portrait})` }} />}
              </div>
              <div className="lab-layer layer-details"><span>02 / EXPRESSION</span><i /><span>03 / INTERACTION</span></div>
            </div>
            <div className="lab-stage-caption"><span>{view === 'portrait' ? 'MOVE TO EXPLORE' : view.toUpperCase() + ' / CSS STUDY'}</span><span>← FORM MEETS FEELING →</span></div>
          </div>
        </div>
        <div className="lab-inspector">
          <div><Layers size={17} /><span className="lab-label">LOOK CLOSER</span></div>
          <div className="lab-views" role="group" aria-label="Portrait view">
            {['portrait', 'anatomy', 'exploded', 'blueprint', 'x-ray', 'cutaway', '360°'].map(mode => <button key={mode} type="button" aria-pressed={view === mode} onClick={() => setView(mode)}>{mode}</button>)}
          </div>
          {(view === 'exploded' || view === '360°') && <label className="lab-slider">{view === '360°' ? 'Rotation' : 'Layer depth'}<input type="range" min="0" max={view === '360°' ? '360' : '85'} value={view === '360°' ? angle : depth} onChange={event => view === '360°' ? setAngle(Number(event.target.value)) : setDepth(Number(event.target.value))} /><output>{view === '360°' ? `${angle}°` : depth}</output></label>}
        </div>
      </div>
      <p className="lab-note">A 2D portrait explored in 3D space. Layer and rotation views are interface experiments, not a reconstructed 3D scan.</p>
    </section>
  )
}
