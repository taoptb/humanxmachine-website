'use client'

import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    document.body.classList.add('cursor-active')
    const dot = dotRef.current
    if (!dot) return

    let mouseX = 0
    let mouseY = 0
    let dotX = 0
    let dotY = 0
    let raf: number

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onEnterLink = () => dot.classList.add('expanded')
    const onLeaveLink = () => dot.classList.remove('expanded')

    function attachToInteractables() {
      document.querySelectorAll('a, button').forEach((el) => {
        el.addEventListener('mouseenter', onEnterLink)
        el.addEventListener('mouseleave', onLeaveLink)
      })
    }

    function loop() {
      dotX += (mouseX - dotX) * 0.15
      dotY += (mouseY - dotY) * 0.15
      dot!.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    attachToInteractables()
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      document.body.classList.remove('cursor-active')
    }
  }, [])

  return (
    <div
      ref={dotRef}
      id="custom-cursor"
      className="fixed top-0 left-0 z-[9999] pointer-events-none w-2 h-2 rounded-full bg-orange"
      style={{ willChange: 'transform' }}
    />
  )
}
