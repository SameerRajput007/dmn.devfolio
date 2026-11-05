import { useEffect, useRef } from 'react'

export default function HeroImageTrail({ images, intensity = 45, reducedMotion }) {
  const layerRef = useRef(null)
  const stateRef = useRef({ lastX: 0, lastY: 0, lastAt: 0, index: 0 })
  const imageList = images.join('|')

  useEffect(() => {
    const layer = layerRef.current
    if (!layer || reducedMotion || intensity === 0) return
    const hero = layer.closest('section')
    const active = new Set()
    const timers = new Set()
    const state = stateRef.current
    const interval = Math.max(35, 135 - intensity)
    const spacing = Math.max(24, 95 - intensity * 0.6)

    function move(event) {
      if (event.pointerType === 'touch' || event.pointerType === 'pen') return
      const rect = hero.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const now = performance.now()
      if (now - state.lastAt < interval || Math.hypot(x - state.lastX, y - state.lastY) < spacing) return
      state.lastX = x
      state.lastY = y
      state.lastAt = now
      const img = document.createElement('img')
      img.src = images[state.index++ % images.length]
      img.alt = ''
      img.draggable = false
      img.className = 'hero-trail-image'
      img.style.left = x + 'px'
      img.style.top = y + 'px'
      img.style.setProperty('--trail-rotation', ((state.index % 5) - 2) * 9 + 'deg')
      layer.appendChild(img)
      active.add(img)
      img.addEventListener('animationend', () => { img.remove(); active.delete(img) }, { once: true })
      const timeout = setTimeout(() => { img.remove(); active.delete(img); timers.delete(timeout) }, 1500)
      timers.add(timeout)
    }
    hero.addEventListener('pointermove', move, { passive: true })
    return () => {
      hero.removeEventListener('pointermove', move)
      timers.forEach(clearTimeout)
      active.forEach(el => el.remove())
    }
  }, [imageList, intensity, reducedMotion])

  return <div className="hero-image-trail" ref={layerRef} aria-hidden="true" />
}
