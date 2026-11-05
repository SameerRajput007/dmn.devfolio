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
const premiumStickerArt = [
  "<svg viewBox=\"0 0 160 160\"><defs><radialGradient id=\"a\" cx=\".3\" cy=\".2\" r=\".9\"><stop stop-color=\"#fff8bf\"/><stop offset=\".5\" stop-color=\"#ffba32\"/><stop offset=\"1\" stop-color=\"#e85b19\"/></radialGradient><filter id=\"s\"><feDropShadow dx=\"0\" dy=\"5\" stdDeviation=\"4\" flood-opacity=\".3\"/></filter></defs><g filter=\"url(#s)\"><path d=\"M80 7 97 44 139 26 121 68 155 89 114 99 124 146 80 121 35 148 46 101 6 86 40 66 24 26 64 44Z\" fill=\"url(#a)\" stroke=\"#fff4dc\" stroke-width=\"7\" stroke-linejoin=\"round\"/><circle cx=\"80\" cy=\"82\" r=\"32\" fill=\"#fff1ad\"/><path d=\"M64 81h1m29 0h1\" stroke=\"#3a2440\" stroke-width=\"9\" stroke-linecap=\"round\"/><path d=\"M65 99q15 15 30 0\" stroke=\"#3a2440\" stroke-width=\"5\" fill=\"none\" stroke-linecap=\"round\"/></g></svg>",
  "<svg viewBox=\"0 0 160 160\"><defs><linearGradient id=\"b\" x2=\".8\" y2=\"1\"><stop stop-color=\"#bffcff\"/><stop offset=\".55\" stop-color=\"#64a9ff\"/><stop offset=\"1\" stop-color=\"#6340db\"/></linearGradient></defs><path d=\"M80 9C35 9 10 42 10 81c0 43 30 70 70 70s70-27 70-70C150 42 125 9 80 9Z\" fill=\"url(#b)\" stroke=\"#eafaff\" stroke-width=\"8\"/><path d=\"M38 70q18-28 36 0m12 0q18-28 36 0\" stroke=\"#192c74\" stroke-width=\"7\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"M50 98q30 36 60 0\" fill=\"#1c2c73\" stroke=\"#1c2c73\" stroke-width=\"6\"/><path d=\"M55 106q25 14 50 0\" stroke=\"#ff8eac\" stroke-width=\"9\" stroke-linecap=\"round\"/><ellipse cx=\"42\" cy=\"92\" rx=\"12\" ry=\"6\" fill=\"#ff9db7\" opacity=\".7\"/><ellipse cx=\"118\" cy=\"92\" rx=\"12\" ry=\"6\" fill=\"#ff9db7\" opacity=\".7\"/></svg>",
  "<svg viewBox=\"0 0 160 160\"><defs><linearGradient id=\"c\" x1=\"0\" x2=\"1\" y2=\"1\"><stop stop-color=\"#ffb8ec\"/><stop offset=\".55\" stop-color=\"#e268cc\"/><stop offset=\"1\" stop-color=\"#6e48d9\"/></linearGradient></defs><path d=\"M80 147C52 124 13 95 13 58 13 21 56 8 80 39c24-31 67-18 67 19 0 37-39 66-67 89Z\" fill=\"url(#c)\" stroke=\"#fff0fb\" stroke-width=\"8\" stroke-linejoin=\"round\"/><path d=\"M42 54q10-18 27-11\" stroke=\"#fff\" stroke-opacity=\".8\" stroke-width=\"9\" fill=\"none\" stroke-linecap=\"round\"/><path d=\"m103 47 4 11 12 4-12 4-4 12-4-12-12-4 12-4Z\" fill=\"#fff8c7\"/></svg>",
  "<svg viewBox=\"0 0 160 160\"><defs><linearGradient id=\"d\" x2=\"1\" y2=\"1\"><stop stop-color=\"#eaffbc\"/><stop offset=\".55\" stop-color=\"#84df7d\"/><stop offset=\"1\" stop-color=\"#11a88d\"/></linearGradient></defs><path d=\"m80 6 17 37 40-18-14 42 32 20-40 12 8 42-43-22-43 22 8-42L5 87l32-20-14-42 40 18Z\" fill=\"url(#d)\" stroke=\"#efffdf\" stroke-width=\"8\" stroke-linejoin=\"round\"/><path d=\"M51 78h20m18 0h20\" stroke=\"#17594e\" stroke-width=\"9\" stroke-linecap=\"round\"/><path d=\"M53 98q27 28 54 0\" fill=\"none\" stroke=\"#17594e\" stroke-width=\"7\" stroke-linecap=\"round\"/><path d=\"M45 51q15-12 27-5\" fill=\"none\" stroke=\"#fff\" stroke-width=\"7\" stroke-linecap=\"round\"/></svg>",
  "<svg viewBox=\"0 0 160 160\"><defs><linearGradient id=\"e\" x2=\".9\" y2=\"1\"><stop stop-color=\"#fff4b1\"/><stop offset=\".55\" stop-color=\"#ff9c59\"/><stop offset=\"1\" stop-color=\"#ec3e80\"/></linearGradient></defs><path d=\"M25 25Q80-5 135 25q25 55 0 110-55 25-110 0Q0 80 25 25Z\" fill=\"url(#e)\" stroke=\"#fff3e7\" stroke-width=\"8\"/><path d=\"M38 47h84v65H38Z\" fill=\"#fff7e6\" rx=\"8\"/><text x=\"80\" y=\"76\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-weight=\"900\" font-size=\"25\" fill=\"#f34c73\">MAKE</text><text x=\"80\" y=\"103\" text-anchor=\"middle\" font-family=\"Arial,sans-serif\" font-weight=\"900\" font-size=\"25\" fill=\"#f34c73\">MAGIC</text></svg>",
  "<svg viewBox=\"0 0 160 160\"><defs><linearGradient id=\"f\" x2=\"1\" y2=\"1\"><stop stop-color=\"#d2c4ff\"/><stop offset=\".5\" stop-color=\"#9b8dff\"/><stop offset=\"1\" stop-color=\"#4c5fe0\"/></linearGradient></defs><g fill=\"url(#f)\" stroke=\"#f4edff\" stroke-width=\"5\"><ellipse cx=\"80\" cy=\"41\" rx=\"26\" ry=\"36\"/><ellipse cx=\"80\" cy=\"119\" rx=\"26\" ry=\"36\"/><ellipse cx=\"41\" cy=\"80\" rx=\"36\" ry=\"26\"/><ellipse cx=\"119\" cy=\"80\" rx=\"36\" ry=\"26\"/></g><circle cx=\"80\" cy=\"80\" r=\"24\" fill=\"#ffdf76\" stroke=\"#fff4ce\" stroke-width=\"6\"/><circle cx=\"73\" cy=\"77\" r=\"3\" fill=\"#493663\"/><circle cx=\"87\" cy=\"77\" r=\"3\" fill=\"#493663\"/><path d=\"M72 88q8 7 16 0\" stroke=\"#493663\" stroke-width=\"3\" fill=\"none\" stroke-linecap=\"round\"/></svg>"
]
const stickers = premiumStickerArt

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
