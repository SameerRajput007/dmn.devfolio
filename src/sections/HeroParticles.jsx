import { useEffect, useRef } from 'react'

const smooth = value => {
  const t = Math.max(0, Math.min(1, value))
  return t * t * (3 - 2 * t)
}

// Sample the actual hero image so the particles reconstruct its wings and light.
export default function HeroParticles({ image, darkMode, intensity, reducedMotion }) {
  const canvasRef = useRef(null)
  const intensityRef = useRef(intensity)
  useEffect(() => { intensityRef.current = intensity }, [intensity])

  useEffect(() => {
    const canvas = canvasRef.current
    const hero = canvas.closest('section')
    const context = canvas.getContext('2d')
    if (!context) return
    const source = new Image()
    const sample = document.createElement('canvas')
    const sampleContext = sample.getContext('2d', { willReadFrequently: true })
    if (!sampleContext) return
    let particles = []
    let width = 0
    let height = 0
    let frame
    let visible = true
    let disposed = false
    let elapsed = 0
    let previous = 0
    const pointer = { x: -1000, y: -1000 }

    function prepare() {
      if (!source.naturalWidth || disposed) return
      width = hero.clientWidth
      height = hero.clientHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * ratio
      canvas.height = height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      // Match the image's cover crop and inset, including its mobile position.
      const imageWidth = width * 1.08
      const imageHeight = height * 1.08
      const scale = Math.max(imageWidth / source.width, imageHeight / source.height)
      const left = -width * .04 + (imageWidth - source.width * scale) * (width <= 700 ? .62 : .65)
      const top = -height * .04 + (imageHeight - source.height * scale) * .48
      const spacing = width <= 700 ? 6 : Math.max(6, Math.sqrt(width * height / 28000))
      sample.width = Math.ceil(width / spacing)
      sample.height = Math.ceil(height / spacing)
      sampleContext.drawImage(source, left / spacing, top / spacing, source.width * scale / spacing, source.height * scale / spacing)
      const pixels = sampleContext.getImageData(0, 0, sample.width, sample.height).data
      particles = []
      for (let y = 0; y < sample.height; y++) {
        for (let x = 0; x < sample.width; x++) {
          const index = (y * sample.width + x) * 4
          const r = pixels[index]
          const g = pixels[index + 1]
          const b = pixels[index + 2]
          const light = Math.min(r, g, b) / 255
          const luminous = light > (darkMode ? .46 : .8)
          // Dense points describe the wings; sparse dim points trace the sky.
          if (!luminous && (x * 3 + y * 5) % 11 !== 0) continue
          const next = Math.min(index + 4, pixels.length - 4)
          const edge = Math.abs(r - pixels[next]) / 255
          const alpha = luminous ? .48 + light * .42 : .12 + light * .12
          const color = darkMode
            ? `rgb(${Math.round(80 + light * 150)},${Math.round(165 + light * 85)},255)`
            : `rgb(${Math.round(22 + light * 24)},${Math.round(100 + light * 50)},${Math.round(155 + light * 60)})`
          particles.push({ x: x * spacing, y: y * spacing,
            color, alpha, seed: Math.random() * Math.PI * 2,
            spreadX: (Math.random() - .5) * width * 1.5,
            spreadY: (Math.random() - .5) * height * 1.3,
            size: luminous ? .7 + light * .55 + edge : .5 })
        }
      }
      // The accessible HTML heading remains in place beneath this introduction.
      sample.width = Math.ceil(width)
      sample.height = Math.ceil(height)
      const heading = hero.querySelector('h1')
      const bounds = heading.getBoundingClientRect()
      const heroBounds = hero.getBoundingClientRect()
      const font = getComputedStyle(heading)
      sampleContext.font = `${font.fontWeight} ${font.fontSize} ${font.fontFamily}`
      sampleContext.letterSpacing = font.letterSpacing
      sampleContext.textBaseline = 'top'
      sampleContext.fillText('SAMEER', bounds.left - heroBounds.left, bounds.top - heroBounds.top)
      const letters = sampleContext.getImageData(0, 0, sample.width, sample.height).data
      for (let y = 0; y < height; y += 5) {
        for (let x = 0; x < width; x += 5) {
          if (letters[(y * sample.width + x) * 4 + 3] < 100) continue
          particles.push({ x, y, color: darkMode ? '#e0eeff' : '#153e58', seed: Math.random() * 6.28, spreadX: (Math.random() - .5) * width, spreadY: (Math.random() - .5) * height, size: 1, name: true })
        }
      }
    }

    function draw(now) {
      if (disposed) return
      const delta = previous ? Math.min(now - previous, 50) : 0
      previous = now
      if (visible && !document.hidden) {
        const strength = reducedMotion ? 0 : intensityRef.current / 100
        const staticScene = strength === 0
        if (!staticScene) elapsed += delta * (.65 + strength)
        const time = elapsed / 1000
        const cycle = time % 18
        // Keep the artwork as a point cloud throughout the transformation.
        const assembly = staticScene ? 1 : cycle < 3 ? smooth(cycle / 3) : cycle < 12 ? 1 : cycle < 15 ? 1 - .6 * smooth((cycle - 12) / 3) : .4 + .6 * smooth((cycle - 15) / 3)
        hero.style.setProperty('--particle-name', staticScene ? '1' : smooth((time - 1.5) / 1.5).toFixed(3))
        context.clearRect(0, 0, width, height)
        for (const particle of particles) {
          const formed = particle.name ? (staticScene ? 1 : smooth(time / 2.8)) : assembly
          const fade = particle.name ? (staticScene ? 0 : 1 - smooth((time - 2.5) / 1)) : particle.alpha
          if (fade < .01) continue
          let px = particle.x + particle.spreadX * (1 - formed)
          let py = particle.y + particle.spreadY * (1 - formed)
          const dx = px - pointer.x
          const dy = py - pointer.y
          const distance = Math.hypot(dx, dy)
          if (distance > 0 && distance < 140) {
            const force = (1 - distance / 140) * 65 * strength
            px += dx / distance * force
            py += dy / distance * force
          }
          px += Math.sin(time + particle.seed) * 4 * strength
          py += Math.cos(time * .6 + particle.seed) * 4 * strength
          context.globalAlpha = fade * (.65 + .35 * Math.sin(time + particle.seed) ** 2)
          context.fillStyle = particle.color
          context.beginPath()
          context.arc(px, py, particle.size, 0, Math.PI * 2)
          context.fill()
          // Sparse larger halos echo the reference's glowing bokeh.
          if (!particle.name && particle.seed < .08) {
            context.globalAlpha *= .09
            context.beginPath()
            context.arc(px, py, particle.size * 8, 0, Math.PI * 2)
            context.fill()
          }
        }
        context.globalAlpha = 1
      }
      frame = requestAnimationFrame(draw)
    }
    function move(event) {
      if (event.pointerType === 'touch') return
      const bounds = hero.getBoundingClientRect()
      pointer.x = event.clientX - bounds.left
      pointer.y = event.clientY - bounds.top
    }
    function leave() { pointer.x = -1000; pointer.y = -1000 }
    source.onload = () => {
      prepare()
      hero.classList.add('has-particles')
      frame = requestAnimationFrame(draw)
    }
    source.src = image
    const resize = new ResizeObserver(prepare)
    resize.observe(hero)
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    observer.observe(hero)
    hero.addEventListener('pointermove', move)
    hero.addEventListener('pointerleave', leave)
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      resize.disconnect()
      observer.disconnect()
      hero.removeEventListener('pointermove', move)
      hero.removeEventListener('pointerleave', leave)
      hero.classList.remove('has-particles')
      hero.style.removeProperty('--particle-name')
    }
  }, [image, darkMode, reducedMotion])

  return <canvas ref={canvasRef} className="hero-particles" aria-hidden="true" />
}
