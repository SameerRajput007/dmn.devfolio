import * as THREE from 'three'

const vertex = `
  varying vec2 vUv;
  uniform float progress;
  uniform float aspect;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`
const fragment = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D side;
  uniform sampler2D middle;
  uniform sampler2D front;
  uniform float progress;
  uniform float aspect;
  uniform vec2 pointer;
  uniform vec3 imageAspects;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  vec2 portraitUv(vec2 uv, float imageAspect, float center, float width) {
    // Contain the full photograph inside a frame with headroom. The former
    // cover mapping cropped the top of the image on wide screens.
    float frameHeight = 1.0;
    float frameAspect = aspect * width / frameHeight;
    vec2 q = vec2((uv.x-center)/width, (uv.y-0.38)/frameHeight);
    if (frameAspect > imageAspect) q.x *= frameAspect/imageAspect;
    else q.y *= imageAspect/frameAspect;
    return q + 0.5;
  }
  vec4 portraitSample(sampler2D photograph, vec2 q, vec2 displacement) {
    q += displacement;
    float bounds = step(0.,q.x)*step(q.x,1.)*step(0.,q.y)*step(q.y,1.);
    float edges = smoothstep(0.0,0.12,q.x)*(1.-smoothstep(0.90,1.,q.x));
    return vec4(texture2D(photograph,q).rgb, bounds*edges);
  }
  void main() {
    float p = progress;
    vec2 uv = vUv;
    float width = aspect < 0.85 ? 1.0 : 0.66;
    float center = aspect < 0.85 ? 0.5 : mix(0.72, 0.63, smoothstep(0.2,0.8,p));
    vec2 qa = portraitUv(uv,imageAspects.x,center,width);
    vec2 qb = portraitUv(uv,imageAspects.y,center,width);
    vec2 qc = portraitUv(uv,imageAspects.z,center,width);
    float n = hash(floor(uv*vec2(190.,125.)));
    float assemble = smoothstep(0.01,0.22,p);
    float dissolve = smoothstep(0.77,0.96,p);
    float fragmentAmount = (1.0-assemble)+dissolve;
    vec2 displacement = pointer * 0.006 + vec2(sin(uv.y*80.0+n*6.28),cos(uv.x*60.0+n*6.28))*fragmentAmount*0.12;
    vec4 a = portraitSample(side,qa,displacement);
    vec4 b = portraitSample(middle,qb,displacement);
    vec4 c = portraitSample(front,qc,displacement);
    vec4 photograph = mix(a,b,smoothstep(0.28,0.39,p));
    photograph = mix(photograph,c,smoothstep(0.51,0.63,p));
    float leftFade = aspect < .85 ? 1. : smoothstep(0.26,0.55,uv.x);
    float reveal = smoothstep(n-0.10,n+0.1,assemble)*(1.-smoothstep(n-0.10,n+0.1,dissolve));
    float vertical = smoothstep(0.,.13,uv.y);
    float alpha = photograph.a*leftFade*reveal*vertical;
    gl_FragColor = vec4(photograph.rgb*vec3(1.08,.88,.88),alpha);
  }
`

/** Original scroll-controlled WebGL scene. Returns a disposable imperative renderer. */
export function createPortraitScene(canvas, sources, onReady, onError) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setClearColor(0x030406, 0)
  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x030406, 0.025)
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100)
  camera.position.z = 8
  let disposed = false
  const textures = []
  const uniforms = {
    imageAspects: { value: new THREE.Vector3(1,1,1) },
    side: { value: null }, middle: { value: null }, front: { value: null },
    progress: { value: 0 }, aspect: { value: 1 }, pointer: { value: new THREE.Vector2() },
  }
  const planeGeometry = new THREE.PlaneGeometry(2,2)
  const portraitMaterial = new THREE.ShaderMaterial({ uniforms, vertexShader: vertex, fragmentShader: fragment, transparent: true, depthTest: false, depthWrite: false })
  const portrait = new THREE.Mesh(planeGeometry, portraitMaterial)
  portrait.frustumCulled = false
  portrait.renderOrder = 2
  scene.add(portrait)

  // Deterministic seeds keep the same universe across remounts and screen sizes.
  let seed = 71
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed-1)/2147483646 }
  const count = window.innerWidth < 720 ? 1100 : 2400
  const positions = new Float32Array(count*3)
  const colors = new Float32Array(count*3)
  for (let i=0;i<count;i++) {
    const angle = random()*Math.PI*2
    const radius = 2.8+random()*15
    positions[i*3] = Math.cos(angle)*radius
    positions[i*3+1] = Math.sin(angle)*radius
    positions[i*3+2] = -random()*72
    const red = random() > .72
    colors.set(red ? [1,.13,.07] : [.35,.47,.57], i*3)
  }
  const starGeometry = new THREE.BufferGeometry()
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions,3))
  starGeometry.setAttribute('color', new THREE.BufferAttribute(colors,3))
  const starMaterial = new THREE.PointsMaterial({ size: .025, vertexColors: true, transparent: true, opacity: .85, blending: THREE.AdditiveBlending, depthWrite: false })
  const stars = new THREE.Points(starGeometry,starMaterial)
  scene.add(stars)
  const rings = new THREE.Group()
  const ringGeometry = new THREE.TorusGeometry(3.4,.008,4,120)
  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xff4528, transparent: true, opacity: .3 })
  for (let i=0;i<9;i++) {
    const ring = new THREE.Mesh(ringGeometry,ringMaterial)
    ring.position.set(Math.sin(i*.8)*1.2, Math.cos(i*.9)*.5,-i*8)
    ring.rotation.set(i*.025,i*.04,i*.2)
    rings.add(ring)
  }
  scene.add(rings)

  const loader = new THREE.TextureLoader()
  Promise.all(sources.map(src => loader.loadAsync(src))).then(loaded => {
    if (disposed) { loaded.forEach(t=>t.dispose()); return }
    textures.push(...loaded)
    uniforms.imageAspects.value.set(...loaded.map(texture => texture.image.width / texture.image.height))
    // Shader samples display-encoded colors and writes them directly to the canvas.
    uniforms.side.value = loaded[0]
    uniforms.middle.value = loaded[1]
    uniforms.front.value = loaded[2]
    onReady()
  }).catch(error => { if (!disposed) onError(error) })

  return {
    resize(width,height) {
      renderer.setSize(width,height,false)
      camera.aspect = width/height
      camera.updateProjectionMatrix()
      uniforms.aspect.value = width/height
    },
    draw(progress, pointer = { x: 0, y: 0 }) {
      uniforms.progress.value = progress
      uniforms.pointer.value.set(pointer.x,pointer.y)
      camera.position.set(pointer.x*.12,pointer.y*.08,8-progress*50)
      camera.lookAt(0,0,camera.position.z-20)
      stars.rotation.z = progress*.22
      rings.rotation.z = -progress*.35
      ringMaterial.opacity = .18 + Math.pow(Math.abs(progress-.5)*2,2)*.32
      renderer.render(scene,camera)
    },
    dispose() {
      disposed = true
      textures.forEach(t=>t.dispose())
      planeGeometry.dispose(); portraitMaterial.dispose()
      starGeometry.dispose(); starMaterial.dispose()
      ringGeometry.dispose(); ringMaterial.dispose()
      renderer.dispose()
    },
  }
}
