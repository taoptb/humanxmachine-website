'use client'

import { useEffect, useRef } from 'react'

const TRAIL_LEN       = 7
const MAGNETIC_RADIUS = 90
const MAGNETIC_PULL   = 0.38
const LERP_SPEED      = 0.14

export function CustomCursor() {
  const dotRef   = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    document.body.classList.add('cursor-active')

    let rawX = 0, rawY = 0   // actual mouse
    let magX = 0, magY = 0   // magnetic-adjusted target
    let curX = 0, curY = 0   // smoothed cursor position
    let expanded = false
    let raf: number

    // Trail: ring buffer of recent cursor positions
    const trail = Array.from({ length: TRAIL_LEN }, () => ({ x: 0, y: 0 }))
    let trailHead = 0

    const getInteractables = () => Array.from(document.querySelectorAll<HTMLElement>('a, button'))

    const onMouseMove = (e: MouseEvent) => {
      rawX = e.clientX
      rawY = e.clientY

      // Compute magnetic attraction toward nearest interactable
      let mx = rawX, my = rawY
      let minDist = Infinity

      getInteractables().forEach((el) => {
        const r  = el.getBoundingClientRect()
        const cx = r.left + r.width  / 2
        const cy = r.top  + r.height / 2
        const d  = Math.hypot(rawX - cx, rawY - cy)

        if (d < MAGNETIC_RADIUS && d < minDist) {
          minDist = d
          const pull = (1 - d / MAGNETIC_RADIUS) * MAGNETIC_PULL
          mx = rawX + (cx - rawX) * pull
          my = rawY + (cy - rawY) * pull
        }
      })

      magX = mx
      magY = my
      expanded = minDist < MAGNETIC_RADIUS
    }

    const loop = () => {
      curX += (magX - curX) * LERP_SPEED
      curY += (magY - curY) * LERP_SPEED

      const dot = dotRef.current
      if (dot) {
        const s = expanded ? 2.8 : 1
        dot.style.transform = `translate(${curX - 4}px, ${curY - 4}px) scale(${s})`
        dot.style.opacity   = expanded ? '0.45' : '1'
      }

      // Push current position into trail ring buffer
      trail[trailHead] = { x: curX, y: curY }
      trailHead = (trailHead + 1) % TRAIL_LEN

      trailRef.current.forEach((el, i) => {
        if (!el) return
        // Read positions backwards from current head
        const idx = (trailHead - 1 - i + TRAIL_LEN) % TRAIL_LEN
        const pos = trail[idx]
        const age = (i + 1) / TRAIL_LEN          // 0 = newest, 1 = oldest
        const size = Math.max(1.5, 4 * (1 - age))
        el.style.transform = `translate(${pos.x - size / 2}px, ${pos.y - size / 2}px)`
        el.style.width     = `${size}px`
        el.style.height    = `${size}px`
        el.style.opacity   = String((1 - age) * 0.35)
      })

      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMouseMove)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(raf)
      document.body.classList.remove('cursor-active')
    }
  }, [])

  return (
    <>
      {/* Main cursor dot — square to match pixel aesthetic */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-2 h-2 bg-orange"
        style={{ willChange: 'transform', transition: 'opacity 0.2s ease, transform 0.08s ease' }}
      />
      {/* Pixel trail */}
      {Array.from({ length: TRAIL_LEN }, (_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) trailRef.current[i] = el }}
          className="fixed top-0 left-0 z-[9998] pointer-events-none bg-orange"
          style={{ willChange: 'transform', width: '4px', height: '4px' }}
        />
      ))}
    </>
  )
}
