'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { HeroCanvas } from '@/components/home/HeroCanvas'
import { loadGSAP } from '@/lib/animations'

export function Hero() {
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx: any // eslint-disable-line @typescript-eslint/no-explicit-any
    let cancelled = false

    loadGSAP().then(({ gsap }) => {
      if (cancelled || !lineRef.current) return
      ctx = gsap.context(() => {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0, opacity: 0 },
          { scaleY: 1, opacity: 1, duration: 1.4, delay: 1.2, ease: 'power3.out', transformOrigin: 'top' }
        )
      })
    })

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [])

  return (
    <section className="hero-section relative min-h-screen bg-[#F7F7F7] flex flex-col justify-center px-6 md:px-14 overflow-hidden">

      {/* 3D cube grid — fills the right side of the hero */}
      <HeroCanvas />

      {/* Left-side gradient so text stays readable over the 3D scene */}
      <div
        className="absolute inset-y-0 left-0 pointer-events-none"
        style={{ width: '68%', background: 'linear-gradient(to right, rgba(247,247,247,0.97) 42%, transparent)' }}
      />

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F7F7F7] to-transparent pointer-events-none" />

      {/* Top fade (under nav) */}
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#F7F7F7] to-transparent pointer-events-none" />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-[640px] pt-24 pb-16">

        {/* Eyebrow */}
        <div className="hero-eyebrow flex items-center gap-3 mb-8">
          <div className="w-6 h-px bg-orange flex-shrink-0" />
          <span className="font-mono text-[10px] tracking-[3px] text-orange uppercase">
            AI-Native Creative Studio
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-headline font-bold leading-[0.95] tracking-tightest mb-8"
          style={{ fontSize: 'clamp(42px, 6.5vw, 88px)' }}
        >
          <span className="hero-line-1 block text-[#12120f]">Launch faster.</span>
          <span className="hero-line-2 block text-[#12120f]">Create smarter.</span>
          <span className="hero-line-2 block text-orange">Operate leaner.</span>
        </h1>

        {/* Subheadline */}
        <p className="hero-sub text-[15px] text-[#666] leading-[1.8] max-w-[480px] mb-10">
          HumanXMachine is an AI-native studio helping founders and brands build
          launch-ready identities, content systems, and business workflows.
        </p>

        {/* CTAs */}
        <div className="hero-actions flex flex-wrap gap-3 items-center">
          <Button variant="primary" href="/contact">Start a Project</Button>
          <Button variant="ghost" href="/work">View Work</Button>
        </div>

        {/* Stat strip */}
        <div className="hero-hint flex gap-8 mt-12 pt-8 border-t border-[#E2E2DF]">
          {[
            { n: '2×', label: 'Founders' },
            { n: 'AI', label: 'Powered' },
            { n: '∞', label: 'Output' },
          ].map(({ n, label }) => (
            <div key={label}>
              <p className="font-headline font-bold text-[#12120f] text-lg tracking-tighter">{n}</p>
              <p className="font-mono text-[8px] tracking-[2px] text-[#999] uppercase mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 right-12 flex flex-col items-center gap-2">
        <div
          ref={lineRef}
          className="w-px h-14 bg-gradient-to-b from-orange to-transparent opacity-0"
          style={{ transformOrigin: 'top' }}
        />
        <span
          className="font-mono text-[8px] tracking-[3px] text-[#bbb] uppercase"
          style={{ writingMode: 'vertical-rl' }}
        >
          Scroll
        </span>
      </div>
    </section>
  )
}
