'use client'

import { useEffect, useRef } from 'react'

const COLS = 30
const ROWS = 22
const SPACING = 2.0   // world units between cube centres
const CUBE_W  = 1.62  // footprint — smaller than spacing creates the gap
const ORANGE_RATIO = 0.055

export function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let animId: number
    let disposed = false

    import('three').then((THREE) => {
      if (disposed || !mount) return

      const W   = mount.clientWidth
      const H   = mount.clientHeight
      const dpr = Math.min(window.devicePixelRatio, 2)

      // ── Renderer ──────────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(dpr)
      renderer.setSize(W, H)
      renderer.setClearColor(0x000000, 0)
      renderer.toneMapping        = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.3
      mount.appendChild(renderer.domElement)

      // ── Scene ─────────────────────────────────────────────────
      const scene = new THREE.Scene()
      // Fog colour matches soft-white background — far cubes dissolve naturally
      scene.fog = new THREE.Fog(0xF7F7F7, 18, 42)

      // ── Camera — perspective, angled from above-front ──────────
      const camera = new THREE.PerspectiveCamera(54, W / H, 0.1, 100)
      camera.position.set(0, 12, 16)
      camera.lookAt(0, 0, -2)

      // ── Lighting ──────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0xffffff, 0.55))

      const sun = new THREE.DirectionalLight(0xffffff, 1.2)
      sun.position.set(7, 14, 8)
      scene.add(sun)

      // Subtle fill from the other side
      const fill = new THREE.DirectionalLight(0xfff0e8, 0.4)
      fill.position.set(-6, 8, 4)
      scene.add(fill)

      // Orange point light that follows the mouse
      const mousePL = new THREE.PointLight(0xff4d00, 4.0, 9)
      mousePL.position.set(0, 4, 0)
      scene.add(mousePL)

      // ── Instanced cube mesh ────────────────────────────────────
      const count = COLS * ROWS
      const geo   = new THREE.BoxGeometry(CUBE_W, 1, CUBE_W)
      const mat   = new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0.18 })
      const mesh  = new THREE.InstancedMesh(geo, mat, count)

      // Per-instance colour buffer
      mesh.instanceColor = new THREE.InstancedBufferAttribute(
        new Float32Array(count * 3), 3
      )
      scene.add(mesh)

      // Stable per-cube metadata
      const isOrange = new Uint8Array(count)
      const phase    = new Float32Array(count)
      const dummy    = new THREE.Object3D()
      const darkCol  = new THREE.Color(0x3a3a36)  // dark enough to read on #F7F7F7
      const orgCol   = new THREE.Color(0xff4d00)

      for (let i = 0; i < count; i++) {
        isOrange[i] = Math.random() < ORANGE_RATIO ? 1 : 0
        phase[i]    = Math.random() * Math.PI * 2

        const c  = i % COLS
        const r  = Math.floor(i / COLS)
        const wx = (c - COLS / 2) * SPACING
        const wz = (r - ROWS / 2) * SPACING

        dummy.position.set(wx, 0.1, wz)
        dummy.scale.setY(0.2)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
        mesh.setColorAt(i, isOrange[i] ? orgCol : darkCol)
      }
      mesh.instanceMatrix.needsUpdate = true
      mesh.instanceColor!.needsUpdate = true

      // ── Mouse → world-space via ray-plane intersection ─────────
      const raycaster  = new THREE.Raycaster()
      const ndcMouse   = new THREE.Vector2(-10, -10)
      const gndPlane   = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
      const mwTarget   = new THREE.Vector3(-999, 0, -999)
      const mwCurrent  = new THREE.Vector3(-999, 0, -999)

      const onMouseMove = (e: MouseEvent) => {
        const rect = mount.getBoundingClientRect()
        ndcMouse.x = ((e.clientX - rect.left) / rect.width)  * 2 - 1
        ndcMouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1
        raycaster.setFromCamera(ndcMouse, camera)
        raycaster.ray.intersectPlane(gndPlane, mwTarget)
      }
      window.addEventListener('mousemove', onMouseMove)

      // ── Resize ─────────────────────────────────────────────────
      const onResize = () => {
        if (disposed) return
        const nW = mount.clientWidth
        const nH = mount.clientHeight
        camera.aspect = nW / nH
        camera.updateProjectionMatrix()
        renderer.setSize(nW, nH)
      }
      window.addEventListener('resize', onResize)

      // ── Animation loop ─────────────────────────────────────────
      const clock    = new THREE.Clock()
      let   camAngle = 0

      const animate = () => {
        animId = requestAnimationFrame(animate)
        const t = clock.getElapsedTime()

        // Smooth mouse world position
        mwCurrent.lerp(mwTarget, 0.07)
        mousePL.position.set(mwCurrent.x, 3.5, mwCurrent.z)

        // Very subtle camera drift (adds life without being distracting)
        camAngle += 0.00018
        camera.position.x = Math.sin(camAngle) * 2.2
        camera.lookAt(0, 0, -2)

        // Update every cube height each frame
        for (let i = 0; i < count; i++) {
          const c  = i % COLS
          const r  = Math.floor(i / COLS)
          const wx = (c - COLS / 2) * SPACING
          const wz = (r - ROWS / 2) * SPACING

          // Slow organic ripple — different frequency per axis for variety
          const ripple =
            (Math.sin(t * 0.5 + c * 0.40 + phase[i]) *
             Math.cos(t * 0.35 + r * 0.33 + phase[i])) * 0.5 + 0.5

          const baseH = isOrange[i]
            ? 0.85 + ripple * 1.1    // orange cubes always taller
            : 0.12 + ripple * 0.75   // dark cubes: near-flat to medium

          // Mouse ripple — squared falloff for a sharp, dramatic peak
          const dx   = wx - mwCurrent.x
          const dz   = wz - mwCurrent.z
          const dist = Math.sqrt(dx * dx + dz * dz)
          const lift = Math.max(0, 1 - dist / 5.5) ** 2 * 5.0

          const h = baseH + lift

          dummy.position.set(wx, h / 2, wz)
          dummy.scale.set(1, h, 1)
          dummy.updateMatrix()
          mesh.setMatrixAt(i, dummy.matrix)
        }
        mesh.instanceMatrix.needsUpdate = true

        renderer.render(scene, camera)
      }
      animate()

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
