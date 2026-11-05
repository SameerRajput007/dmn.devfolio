import { useEffect, useRef } from 'react'

const motifs = ['✨', '🪐', '💫', '⚡', '🌙', '✦', '🎨', '🚀']

export default function HeroImageTrail({ images, intensity = 45, reducedMotion }) {
  const layerRef = useRef(null)
  const stateRef = useRef({ lastX: -1000, lastY: -1000, lastAt: 0, index: 0 })
  const imageList = images.join('|')

  useEffect(() => {
    const layer = layerRef.current
    if (!layer || reducedMotion || intensity === 0) return
    const hero = layer.closest('section')
    const active = new Set()
    const timers = new Set()
    const state = stateRef.current
    const interval = Math.max(12, 65 - intensity * 0.4)
    const spacing = Math.max(12, 42 - intensity * 0.3)
    const maxItems = 8

    function removeItem(item) {
      item.remove()
      active.delete(item)
    }

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
      if (active.size >= maxItems) removeItem(active.values().next().value)

      const index = state.index++
      const item = document.createElement('span')
      item.className = 'hero-trail-item'
      item.style.left = x + 'px'
      item.style.top = y + 'px'
      item.style.setProperty('--trail-rotation', ((index % 7) - 3) * 7 + 'deg')
      if (index % 3 === 0 && images.length) {
        const img = document.createElement('img')
        img.src = images[index % images.length]
        img.alt = ''
        img.draggable = false
        img.className = 'hero-trail-photo'
        item.appendChild(img)
      } else {
        item.textContent = motifs[index % motifs.length]
        item.classList.add('hero-trail-emoji')
      }
      layer.appendChild(item)
      active.add(item)
      item.addEventListener('animationend', () => removeItem(item), { once: true })
      const timeout = setTimeout(() => { removeItem(item); timers.delete(timeout) }, 1500)
      timers.add(timeout)
    }

    function reset() {
      state.lastX = -1000
      state.lastY = -1000
      state.lastAt = 0
    }

    hero.addEventListener('pointermove', move, { passive: true })
    hero.addEventListener('pointerleave', reset)
    return () => {
      hero.removeEventListener('pointermove', move)
      hero.removeEventListener('pointerleave', reset)
      timers.forEach(clearTimeout)
      active.forEach(removeItem)
    }
  }, [imageList, intensity, reducedMotion, images])

  return <div className="hero-image-trail" ref={layerRef} aria-hidden="true" />
}
