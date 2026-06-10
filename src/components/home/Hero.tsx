'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { PixelIcon } from '@/components/ui/PixelIcon'
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any

    async function animate() {
      const { gsap } = await loadGSAP()

      ctx = gsap.context(() => {
        const tl = gsap.timeline()

        gsap.fromTo(
          pixelRef.current,
          { opacity: 0, scale: 0.8, rotation: -5 },
          { opacity: 0.12, scale: 1, rotation: 0, duration: 1.2, delay: 0.8, ease: 'power3.out' }
        )

        tl.fromTo(eyebrowRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.3)
          .fromTo(line1Ref.current, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'power3.out' }, 0.4)
          .fromTo(line2Ref.current, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'power3.out' }, 0.55)
          .fromTo(subRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.9)
          .fromTo(actionsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 1.1)
          .fromTo(hintRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power3.out' }, 1.4)
      })
    }

    animate()
    return () => ctx?.revert()
  }, [])

  return (
    <section className="relative min-h-screen bg-black flex flex-col justify-end px-10 pb-20 pt-32 overflow-hidden">

      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,77,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

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
          className="font-mono text-[10px] tracking-[3px] text-orange uppercase mb-6 opacity-0"
        >
          Creative Studio · Brand · Culture · Emerging Tech
        </div>

        <h1 className="font-headline font-bold leading-[0.95] tracking-tightest mb-8" style={{ fontSize: 'clamp(52px, 8vw, 100px)' }}>
          <span className="block overflow-hidden">
            <span ref={line1Ref} className="block" style={{ transform: 'translateY(110%)' }}>
              THE FUTURE
            </span>
          </span>
          <span className="block overflow-hidden">
            <span ref={line2Ref} className="block" style={{ transform: 'translateY(110%)' }}>
              DOESN&apos;T WAIT.{' '}
              <span className="text-orange">NEITHER DO WE.</span>
            </span>
          </span>
        </h1>

        <p
          ref={subRef}
          className="text-base text-[#666] leading-[1.7] max-w-lg mb-10 opacity-0"
        >
          We build brands, produce content, and launch businesses — all powered
          by AI, all moving at a speed most studios won&apos;t attempt.
        </p>

        <div ref={actionsRef} className="flex gap-3 items-center opacity-0">
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
        className="absolute bottom-8 left-10 flex items-center gap-3 opacity-0"
      >
        <div className="w-10 h-px bg-[#333]" />
        <span className="font-mono text-[9px] tracking-[3px] text-[#333] uppercase">
          Scroll to explore
        </span>
      </div>
    </section>
  )
}
