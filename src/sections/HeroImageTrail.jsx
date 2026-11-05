import { useEffect, useRef } from 'react'

// Original vector stickers: no external assets or licensed component code.
const stickerArt = [
  '<svg viewBox="0 0 150 150"><path fill="#b4f13b" stroke="#17351a" stroke-width="4" d="M20 65Q12 18 62 14Q125 5 135 62Q145 112 91 132Q35 150 20 65Z"/><ellipse cx="57" cy="66" rx="23" ry="33" fill="#fff"/><ellipse cx="104" cy="61" rx="23" ry="33" fill="#fff"/><ellipse cx="66" cy="70" rx="11" ry="19" fill="#20232c"/><ellipse cx="110" cy="66" rx="11" ry="19" fill="#20232c"/><path d="M65 112Q84 128 108 109" fill="none" stroke="#1c3720" stroke-width="7" stroke-linecap="round"/></svg>',
  '<svg viewBox="0 0 150 150"><rect x="14" y="14" width="122" height="122" rx="20" fill="#61d9dd" stroke="#18313b" stroke-width="4"/><path d="M22 47H128M22 92H128" stroke="#17323c" stroke-width="3"/><text x="75" y="48" text-anchor="middle" font-family="Arial" font-size="25" font-weight="900" fill="#15343d">PIXEL</text><text x="75" y="88" text-anchor="middle" font-family="Arial" font-size="33" font-weight="900" fill="#15343d">ART</text><path d="M32 108h18v18H32zm35 0h18v18H67zm35 0h18v18h-18z" fill="#163942"/></svg>',
  '<svg viewBox="0 0 150 150"><path d="M75 5L91 39L124 20L116 57L150 73L116 91L129 128L91 110L75 148L58 110L22 129L34 91L1 74L34 58L21 22L58 39Z" fill="#f45c4f" stroke="#34283c" stroke-width="4"/><circle cx="75" cy="75" r="34" fill="#ffd44e" stroke="#34283c" stroke-width="4"/><text x="75" y="83" text-anchor="middle" font-family="Arial" font-size="20" font-weight="900" fill="#34283c">WOW!</text></svg>',
  '<svg viewBox="0 0 150 150"><g fill="#8a72c6" stroke="#3a2c63" stroke-width="3"><ellipse cx="75" cy="37" rx="21" ry="35"/><ellipse cx="75" cy="113" rx="21" ry="35"/><ellipse cx="37" cy="75" rx="35" ry="21"/><ellipse cx="113" cy="75" rx="35" ry="21"/><ellipse transform="rotate(45 75 75)" cx="75" cy="37" rx="20" ry="33"/><ellipse transform="rotate(45 75 75)" cx="75" cy="113" rx="20" ry="33"/></g><circle cx="75" cy="75" r="18" fill="#fbd75e"/></svg>',
  '<svg viewBox="0 0 150 150"><path fill="#4fe088" stroke="#153e30" stroke-width="5" d="M27 50L45 21L65 35L85 13L103 37L125 28L117 65Q142 100 108 126Q74 149 37 124Q7 100 27 50Z"/><circle cx="54" cy="69" r="12" fill="#183a2b"/><circle cx="100" cy="69" r="12" fill="#183a2b"/><path d="M50 107Q77 126 103 104" fill="none" stroke="#173c2a" stroke-width="7" stroke-linecap="round"/></svg>',
  '<svg viewBox="0 0 150 150"><circle cx="75" cy="75" r="61" fill="#ffcf4c" stroke="#28213c" stroke-width="5"/><circle cx="75" cy="75" r="46" fill="none" stroke="#28213c" stroke-width="3" stroke-dasharray="6 7"/><text x="75" y="83" text-anchor="middle" font-family="Arial" font-size="27" font-weight="900" fill="#28213c">CREATE</text></svg>'
]
const stickers = stickerArt

export default function HeroImageTrail({ intensity = 65, reducedMotion }) {
  const layerRef = useRef(null)
  useEffect(() => {
    const layer = layerRef.current
    if (!layer || intensity === 0) return
    const hero = layer.closest('section')
    if (!hero) return
    const active = new Set()
    let lastX = -1000, lastY = -1000, lastAt = 0, index = 0
    const spacing = Math.max(10, 26 - intensity * .13)
    const interval = Math.max(16, 45 - intensity * .22)
    function move(event) {
      if (event.pointerType === 'touch' || event.pointerType === 'pen') return
      const rect = hero.getBoundingClientRect()
      const x = event.clientX - rect.left, y = event.clientY - rect.top
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return
      const now = performance.now()
      if (now - lastAt < interval || Math.hypot(x-lastX,y-lastY) < spacing) return
      lastX=x;lastY=y;lastAt=now
      if (active.size >= 13) { const old=active.values().next().value;old.remove();active.delete(old) }
      const item=document.createElement('span')
      item.className='hero-sticker-item'
      item.innerHTML=stickers[index % stickers.length]
      item.style.left=x+'px';item.style.top=y+'px'
      item.style.setProperty('--sticker-angle', (((index*59)%100)-50)+'deg')
      item.style.setProperty('--sticker-size', (125+(index%4)*20)+'px')
      index++
      layer.appendChild(item);active.add(item)
      item.addEventListener('animationend',()=>{item.remove();active.delete(item)},{once:true})
    }
    window.addEventListener('pointermove',move,{passive:true})
    return ()=>{window.removeEventListener('pointermove',move);active.forEach(item=>item.remove())}
  },[intensity,reducedMotion])
  return <div className="hero-image-trail" ref={layerRef} aria-hidden="true"/>
}
