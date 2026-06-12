'use client'

import { useEffect, useRef } from 'react'

const CELL = 20        // px between pixel centers
const PX   = 7         // rendered pixel square size
const ORANGE_RATIO = 0.055  // fraction that start orange

const vertexShader = /* glsl */`
  attribute float aRandom;
  attribute float aOrange;

  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uRadius;
  uniform float uSize;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);

    // Distance from this pixel to mouse in world space
    float dist = distance(world.xy, uMouse);
    float proximity = 1.0 - smoothstep(0.0, uRadius, dist);

    // Per-pixel idle pulse (different phase per pixel)
    float pulse = sin(uTime * 0.7 + aRandom * 6.2831) * 0.5 + 0.5;

    // Base alpha — orange pixels visible, dark pixels very subtle
    float baseAlpha = aOrange > 0.5
      ? 0.5 + pulse * 0.35
      : 0.055 + pulse * 0.045;

    // Near mouse: everything brightens toward orange
    vAlpha = clamp(baseAlpha + proximity * (0.9 - baseAlpha), 0.0, 1.0);

    // Base colour: orange or dark (#2a2a27)
    vec3 darkCol   = vec3(0.165, 0.165, 0.153);
    vec3 orangeCol = vec3(1.0, 0.302, 0.0);
    vec3 baseCol   = aOrange > 0.5 ? orangeCol : darkCol;
    vColor = mix(baseCol, orangeCol, proximity * 0.9);

    gl_Position  = projectionMatrix * viewMatrix * world;
    gl_PointSize = uSize;
  }
`

const fragmentShader = /* glsl */`
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    // Square pixels: discard a small border to create the gap between cells
    vec2 uv = gl_PointCoord;
    float b = 0.08;
    if (uv.x < b || uv.x > 1.0 - b || uv.y < b || uv.y > 1.0 - b) discard;
    gl_FragColor = vec4(vColor, vAlpha);
  }
`

export function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let animId: number
    let disposed = false

    // Lazy-load Three.js so it doesn't bloat SSR bundle
    import('three').then((THREE) => {
      if (disposed || !mount) return

      const W = mount.clientWidth
      const H = mount.clientHeight
      const dpr = Math.min(window.devicePixelRatio, 2)

      // ── Renderer ─────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
      renderer.setPixelRatio(dpr)
      renderer.setSize(W, H)
      renderer.setClearColor(0x000000, 0)
      mount.appendChild(renderer.domElement)

      // ── Scene + orthographic camera ───────────────────────
      const scene = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 0.1, 100)
      camera.position.z = 10

      // ── Build pixel grid ──────────────────────────────────
      const cols  = Math.ceil(W / CELL) + 1
      const rows  = Math.ceil(H / CELL) + 1
      const count = cols * rows

      const positions = new Float32Array(count * 3)
      const randoms   = new Float32Array(count)
      const oranges   = new Float32Array(count)

      for (let i = 0; i < count; i++) {
        const col = i % cols
        const row = Math.floor(i / cols)
        positions[i * 3 + 0] = col * CELL - W / 2
        positions[i * 3 + 1] = H / 2 - row * CELL
        positions[i * 3 + 2] = 0
        randoms[i] = Math.random()
        oranges[i] = Math.random() < ORANGE_RATIO ? 1 : 0
      }

      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geo.setAttribute('aRandom',  new THREE.BufferAttribute(randoms, 1))
      geo.setAttribute('aOrange',  new THREE.BufferAttribute(oranges, 1))

      const mat = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime:   { value: 0 },
          uMouse:  { value: new THREE.Vector2(-99999, -99999) },
          uRadius: { value: 130 },
          uSize:   { value: PX * dpr },
        },
      })

      const points = new THREE.Points(geo, mat)
      scene.add(points)

      // ── Mouse tracking ────────────────────────────────────
      const target = new THREE.Vector2(-99999, -99999)
      const current = new THREE.Vector2(-99999, -99999)

      const onMouseMove = (e: MouseEvent) => {
        const rect = mount.getBoundingClientRect()
        target.set(
          e.clientX - rect.left - W / 2,
          -(e.clientY - rect.top  - H / 2)
        )
      }
      window.addEventListener('mousemove', onMouseMove)

      // ── Resize ────────────────────────────────────────────
      const onResize = () => {
        if (disposed) return
        const nW = mount.clientWidth
        const nH = mount.clientHeight
        renderer.setSize(nW, nH)
        camera.left   = -nW / 2
        camera.right  =  nW / 2
        camera.top    =  nH / 2
        camera.bottom = -nH / 2
        camera.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)

      // ── Animation loop ────────────────────────────────────
      let t0 = performance.now()
      const animate = () => {
        animId = requestAnimationFrame(animate)
        const elapsed = (performance.now() - t0) / 1000
        mat.uniforms.uTime.value = elapsed
        // Smooth mouse follow
        current.lerp(target, 0.06)
        mat.uniforms.uMouse.value.copy(current)
        renderer.render(scene, camera)
      }
      animate()

      // Store cleanup
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mount as any).__threeCleanup = () => {
        disposed = true
        cancelAnimationFrame(animId)
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('resize', onResize)
        geo.dispose()
        mat.dispose()
        renderer.dispose()
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      }
    })

    return () => {
      disposed = true
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mount as any).__threeCleanup?.()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  )
}
