'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { PixelIcon } from '@/components/ui/PixelIcon'
import { HeroCanvas } from '@/components/home/HeroCanvas'
import { loadGSAP } from '@/lib/animations'

export function Hero() {
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const pixelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Pixel decoration only — purely decorative, safe to fail
    let ctx: any // eslint-disable-line @typescript-eslint/no-explicit-any
    let cancelled = false

    loadGSAP().then(({ gsap }) => {
      if (cancelled || !pixelRef.current) return
      ctx = gsap.context(() => {
        gsap.fromTo(pixelRef.current,
          { opacity: 0, scale: 0.8, rotation: -5 },
          { opacity: 0.12, scale: 1, rotation: 0, duration: 1.4, delay: 1.2, ease: 'power3.out' }
        )
      })
      setTimeout(() => {
        if (!cancelled) pixelRef.current?.classList.add('pixel-pulse')
      }, 2800)
    })

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [])

  return (
    <section className="hero-section relative min-h-screen bg-black flex flex-col justify-end px-6 md:px-10 pb-16 md:pb-20 pt-28 md:pt-32 overflow-hidden">

      {/* WebGL pixel grid background */}
      <HeroCanvas />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      {/* Pixel symbol decoration — top right */}
      <div ref={pixelRef} className="absolute top-24 right-14 opacity-0">
        <PixelIcon name="face" size={20} />
      </div>

      {/* Floating X mark — top left */}
      <div className="absolute top-48 left-14">
        <PixelIcon name="x" size={10} opacity={0.06} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl">
        <div
          ref={eyebrowRef}
          className="hero-eyebrow font-mono text-[10px] tracking-[3px] text-orange uppercase mb-6"
        >
          Creative Studio · Brand · Culture · Emerging Tech
        </div>

        <h1 className="font-headline font-bold leading-[0.95] tracking-tightest mb-8" style={{ fontSize: 'clamp(52px, 8vw, 100px)' }}>
          <span ref={line1Ref} className="hero-line-1 block">
            Launch faster.
          </span>
          <span ref={line2Ref} className="hero-line-2 block">
            Create smarter.{' '}
            <span className="text-orange">Operate leaner.</span>
          </span>
        </h1>

        <p
          ref={subRef}
          className="hero-sub text-base text-[#666] leading-[1.7] max-w-lg mb-10"
        >
          HumanXMachine is an AI-native studio helping founders and brands build
          launch-ready identities, content systems, and business workflows.
        </p>

        <div ref={actionsRef} className="hero-actions flex gap-3 items-center">
          <Button variant="primary" href="/contact">
            Start a Project
          </Button>
          <Button variant="ghost" href="/work">
            View Work
          </Button>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        ref={hintRef}
        className="hero-hint absolute bottom-8 left-10 flex items-center gap-3"
      >
        <div className="w-10 h-px bg-[#333]" />
        <span className="font-mono text-[9px] tracking-[3px] text-[#333] uppercase">
          Scroll to explore
        </span>
      </div>
    </section>
  )
}
