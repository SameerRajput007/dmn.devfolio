import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import portraitSide from '../assets/portrait-side.png'
import portraitThreeQuarter from '../assets/portrait-three-quarter.png'
import portraitFront from '../assets/portrait-front.png'
import './CinematicPortrait.css'

const sources = [portraitSide, portraitThreeQuarter, portraitFront]
const chapters = ['ARRIVAL', 'PERSPECTIVE', 'CONNECTION', 'BEYOND']
const clamp = value => Math.max(0, Math.min(1, value))
const journeyLayout = section => {
  const stage = section.querySelector('.cinematic-sticky')
  return {
    top: parseFloat(getComputedStyle(stage).top) || 0,
    distance: Math.max(1, section.offsetHeight - stage.offsetHeight),
  }
}

export default function CinematicPortrait() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const progressRef = useRef(0)
  const [ready, setReady] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const [paused, setPaused] = useState(false)
  const [chapter, setChapter] = useState(0)
  const reduceMotion = useReducedMotion()

  useLayoutEffect(() => {
    const section = sectionRef.current
    const header = document.querySelector('.site-header')
    if (!section || !header) return
    const measure = () => {
      const rect = header.getBoundingClientRect()
      const stickyTop = parseFloat(getComputedStyle(header).top) || 0
      section.style.setProperty('--hero-header-height', `${Math.ceil(rect.height + Math.max(0, stickyTop))}px`)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(header)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas || reduceMotion) return
    let scene
    let disposed = false
    let frame = 0
    let visible = true
    let current = progressRef.current
    let target = current
    const pointer = { x: 0, y: 0 }
    const render = () => {
      frame = 0
      if (disposed || !visible || document.hidden) return
      current += (target-current)*.14
      if (Math.abs(target-current)<.0002) current = target
      progressRef.current = current
      section.style.setProperty('--journey',current)
      section.style.setProperty('--portrait-fade',clamp((current-.01)/.15)*(1-clamp((current-.78)/.17)))
      section.style.setProperty('--exit',clamp((current-.82)/.18))
      section.style.setProperty('--intro',1-clamp((current-.12)/.14))
      scene?.draw(current,pointer)
      if (Math.abs(target-current)>.0002) frame = requestAnimationFrame(render)
    }
    const requestRender = () => { if (!frame && !disposed) frame = requestAnimationFrame(render) }
    const update = () => {
      if (paused) return
      const rect = section.getBoundingClientRect()
      const layout = journeyLayout(section)
      target = clamp((layout.top-rect.top)/layout.distance)
      setChapter(Math.min(3,Math.floor(target*4)))
      requestRender()
    }
    const resize = () => {
      scene?.resize(canvas.clientWidth,canvas.clientHeight)
      update()
      requestRender()
    }
    const move = event => {
      if (paused || event.pointerType==='touch') return
      const rect = canvas.getBoundingClientRect()
      pointer.x = ((event.clientX-rect.left)/rect.width-.5)*2
      pointer.y = -((event.clientY-rect.top)/rect.height-.5)*2
      requestRender()
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) { update(); requestRender() }
      else { cancelAnimationFrame(frame); frame = 0 }
    })
    observer.observe(section)
    import('./portrait/createPortraitScene.js').then(({ createPortraitScene }) => {
      if (disposed) return
      try {
        scene = createPortraitScene(canvas,sources,() => {
          if (!disposed) { setReady(true); requestRender() }
        },() => { if (!disposed) { setReady(false); setUnavailable(true) } })
        resize()
      } catch { setReady(false); setUnavailable(true) }
    }).catch(() => { if (!disposed) { setReady(false); setUnavailable(true) } })
    const sizeObserver = new ResizeObserver(resize)
    sizeObserver.observe(canvas)
    window.addEventListener('scroll',update,{passive:true})
    window.addEventListener('resize',resize)
    document.addEventListener('visibilitychange',requestRender)
    section.addEventListener('pointermove',move)
    update()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      sizeObserver.disconnect()
      window.removeEventListener('scroll',update)
      window.removeEventListener('resize',resize)
      document.removeEventListener('visibilitychange',requestRender)
      section.removeEventListener('pointermove',move)
      scene?.dispose()
    }
  },[reduceMotion,paused])

  const jumpTo = index => {
    const section = sectionRef.current
    if (!section) return
    setPaused(false)
    const start = window.scrollY+section.getBoundingClientRect().top
    const layout = journeyLayout(section)
    window.scrollTo({top:start-layout.top+layout.distance*(index/3),behavior:'auto'})
  }

  return (
    <section ref={sectionRef} id="home" className={`cinematic-portrait-section ${reduceMotion || unavailable ? 'journey-reduced' : ''}`} aria-label="Sameer Singh Rajput — cinematic introduction" data-chapter={chapter}>
      <div className="cinematic-sticky">
        <div className="journey-haze" aria-hidden="true" />
        <img className={`journey-fallback ${ready && !reduceMotion ? 'is-hidden' : ''}`} src={portraitFront} alt="" aria-hidden="true" fetchPriority="high" />
        <canvas className="journey-canvas" ref={canvasRef} aria-hidden="true" />
        <div className="journey-vignette" aria-hidden="true" />
        <div className="journey-top" aria-hidden="true"><span>DMN.DEV / 2026</span><span>AN EXPLORATION IN PERSPECTIVE</span><span className="journey-live">● INTERACTIVE SCENE</span></div>
        <div className="journey-orbit-label" aria-hidden="true">{String(chapter+1).padStart(2,'0')} / {chapters[chapter]}</div>
        <div className="cinematic-text">
          <p className="cinematic-eyebrow">SAMEER SINGH RAJPUT</p>
          <h1>BEYOND<br /><span>THE ORDINARY.</span></h1>
          <p className="cinematic-description">A developer’s perspective.<br />An instinct to create.</p>
          <a className="journey-cta" href="#projects">EXPLORE MY WORK <span aria-hidden="true">↗</span></a>
        </div>
        <div className="journey-intro" aria-hidden="true"><span>ENTER A NEW</span><strong>PERSPECTIVE.</strong></div>
        <div className="journey-outro" aria-hidden="true"><span>IDEAS BECOME</span><strong>EXPERIENCES.</strong></div>
        <div className="journey-bottom">
          <div className="journey-caption"><span className="journey-scroll-mark" aria-hidden="true">↓</span><span>SCROLL TO ADVANCE<br /><small>REVERSE TO REVISIT</small></span></div>
          <div className="journey-chapters" role="group" aria-label="Scene chapters">
            {chapters.map((label,index)=><button key={label} type="button" onClick={()=>jumpTo(index)} aria-label={`Go to ${label.toLowerCase()} chapter`} aria-pressed={chapter===index}><span>{String(index+1).padStart(2,'0')}</span><i aria-hidden="true" /><span className="journey-chapter-name">{label}</span></button>)}
          </div>
          <div className="journey-controls">
            {!reduceMotion && !unavailable && <button type="button" onClick={()=>setPaused(value=>!value)} aria-pressed={paused}>{paused ? 'RESUME MOTION' : 'PAUSE MOTION'}</button>}
            <a href="#about">SKIP INTRO ↘</a>
          </div>
        </div>
      </div>
    </section>
  )
}
