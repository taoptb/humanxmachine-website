'use client'

import { useEffect, useRef } from 'react'

const COLS = 55
const ROWS = 30
const SPACING = 1.3
const BAR_W = 0.98
const COUNT = COLS * ROWS

// t=0 (valley) → teal, t=1 (peak) → orange
const PALETTE: [number, number, number][] = [
  [0x00, 0xD4, 0xAA], // #00D4AA teal
  [0x3B, 0x82, 0xF6], // #3B82F6 blue
  [0x8B, 0x5C, 0xF6], // #8B5CF6 violet
  [0xFF, 0x2D, 0x6B], // #FF2D6B magenta
  [0xFF, 0x4D, 0x00], // #FF4D00 orange (brand)
]

export function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let animId: number
    let disposed = false

    import('three').then((THREE) => {
      if (disposed || !mount) return

      const W = mount.clientWidth
      const H = mount.clientHeight
      const dpr = Math.min(window.devicePixelRatio, 2)

      // ── Renderer ──────────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false })
      renderer.setPixelRatio(dpr)
      renderer.setSize(W, H)
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.1
      mount.appendChild(renderer.domElement)

      // ── Scene ─────────────────────────────────────────────────
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x080706)
      scene.fog = new THREE.FogExp2(0x080706, 0.022)

      // ── Camera — angled from above-front ─────────────────────
      const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 180)
      camera.position.set(0, 20, 26)
      camera.lookAt(0, 0, -5)

      // ── Lighting ──────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0xffffff, 0.6))
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.4)
      keyLight.position.set(12, 28, 18)
      scene.add(keyLight)
      const fillLight = new THREE.DirectionalLight(0xff6b35, 0.3)
      fillLight.position.set(-12, 4, -8)
      scene.add(fillLight)

      // ── Bar mesh (single InstancedMesh for all bars) ──────────
      const geo = new THREE.BoxGeometry(BAR_W, 1, BAR_W)
      geo.translate(0, 0.5, 0) // pivot to bottom so scale extends upward

      const mat = new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.2 })

      const mesh = new THREE.InstancedMesh(geo, mat, COUNT)
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      // Pre-allocate color buffer with dynamic usage hint
      mesh.instanceColor = new THREE.InstancedBufferAttribute(
        new Float32Array(COUNT * 3), 3
      )
      mesh.instanceColor.setUsage(THREE.DynamicDrawUsage)
      scene.add(mesh)

      // Precompute flat grid positions
      const totalW = (COLS - 1) * SPACING
      const totalD = (ROWS - 1) * SPACING
      const gx = new Float32Array(COUNT)
      const gz = new Float32Array(COUNT)
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const idx = r * COLS + c
          gx[idx] = c * SPACING - totalW / 2
          gz[idx] = r * SPACING - totalD / 2
        }
      }

      // Reusable objects to avoid per-frame allocation
      const dummy = new THREE.Object3D()
      const col = new THREE.Color()

      // ── Interaction state ─────────────────────────────────────
      let mx = 99999, mz = 99999     // smoothed mouse world pos
      let txm = 99999, tzm = 99999   // target from screen coords

      // Approximate screen → world mapping onto y=0 plane
      const toWorld = (cx: number, cy: number) => {
        const rect = mount.getBoundingClientRect()
        const nx = (cx - rect.left) / rect.width * 2 - 1
        const ny = -((cy - rect.top) / rect.height) * 2 + 1
        txm = nx * (totalW / 2 + 10)
        tzm = ny * -(totalD / 2 + 5) - 3
      }

      const waves: { x: number; z: number; age: number }[] = []

      const onMove = (e: MouseEvent) => toWorld(e.clientX, e.clientY)
      const onClick = (e: MouseEvent) => {
        toWorld(e.clientX, e.clientY)
        waves.push({ x: txm, z: tzm, age: 0 })
      }

      window.addEventListener('mousemove', onMove)
      mount.addEventListener('click', onClick)

      // ── Resize ────────────────────────────────────────────────
      const onResize = () => {
        if (disposed) return
        const nW = mount.clientWidth, nH = mount.clientHeight
        renderer.setSize(nW, nH)
        camera.aspect = nW / nH
        camera.updateProjectionMatrix()
      }
      window.addEventListener('resize', onResize)

      // ── Palette sample (mutates col) ──────────────────────────
      const samplePalette = (t: number) => {
        const c = Math.max(0, Math.min(1, t))
        const s = (PALETTE.length - 1) * c
        const i = Math.min(Math.floor(s), PALETTE.length - 2)
        const f = s - i
        const a = PALETTE[i], b = PALETTE[i + 1]
        col.setRGB(
          (a[0] + (b[0] - a[0]) * f) / 255,
          (a[1] + (b[1] - a[1]) * f) / 255,
          (a[2] + (b[2] - a[2]) * f) / 255
        )
      }

      // ── Animation loop ────────────────────────────────────────
      const t0 = performance.now()
      let sway = 0

      const tick = () => {
        animId = requestAnimationFrame(tick)
        const elapsed = (performance.now() - t0) / 1000

        // Smooth mouse follow
        mx += (txm - mx) * 0.055
        mz += (tzm - mz) * 0.055

        // Gentle camera sway
        sway += 0.00015
        camera.position.x = Math.sin(sway) * 2.8
        camera.lookAt(0, 0, -5)

        // Age and cull shockwaves
        for (let i = waves.length - 1; i >= 0; i--) {
          waves[i].age += 0.016
          if (waves[i].age > 2.8) waves.splice(i, 1)
        }

        // Update every bar
        for (let idx = 0; idx < COUNT; idx++) {
          const x = gx[idx], z = gz[idx]

          // Overlapping sine waves — organic wave field
          let h =
            Math.sin(x * 0.30 + elapsed * 1.0)  * 1.9
            + Math.sin(z * 0.26 - elapsed * 0.78) * 1.6
            + Math.sin((x + z) * 0.20 + elapsed * 0.55) * 1.1
            + Math.sin(x * 0.50 - z * 0.35 + elapsed * 1.3) * 0.7

          // Mouse ripple — proximity-weighted travelling wave
          const ddx = x - mx, ddz = z - mz
          const dist2 = ddx * ddx + ddz * ddz
          if (dist2 < 225) { // within radius 15
            const dist = Math.sqrt(dist2)
            const prox = (1 - dist / 15) ** 2
            h += prox * Math.sin(dist * 0.5 - elapsed * 4.0) * 4.5
          }

          // Click shockwaves — radial ring pulses
          for (const w of waves) {
            const sdx = x - w.x, sdz = z - w.z
            const sdist = Math.sqrt(sdx * sdx + sdz * sdz)
            const fade = Math.max(0, 1 - w.age / 2.5)
            h += Math.sin(sdist * 0.65 - w.age * 6.5) * fade * 5.0
              * Math.max(0, 1 - sdist / 40)
          }

          // Normalize h to [0,1] and map to bar height
          const t = Math.max(0, Math.min(1, (h + 4.3) / 8.6))
          const barH = Math.max(0.06, t * 5.5)

          samplePalette(t)

          dummy.position.set(x, 0, z)
          dummy.scale.set(1, barH, 1)
          dummy.updateMatrix()
          mesh.setMatrixAt(idx, dummy.matrix)
          mesh.setColorAt(idx, col)
        }

        mesh.instanceMatrix.needsUpdate = true
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true

        renderer.render(scene, camera)
      }

      tick()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mount as any).__threeCleanup = () => {
        disposed = true
        cancelAnimationFrame(animId)
        window.removeEventListener('mousemove', onMove)
        mount.removeEventListener('click', onClick)
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
      className="absolute inset-0"
      aria-hidden="true"
    />
  )
}
