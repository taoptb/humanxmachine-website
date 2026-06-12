'use client'

import { useEffect, useRef } from 'react'
import { loadGSAP, scrollReveal } from '@/lib/animations'
import { Button } from '@/components/ui/Button'

export function HomeCTA() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    let ctx: any
    let cancelled = false

    loadGSAP().then(({ gsap }) => {
      if (cancelled) return
      ctx = gsap.context(() => {
        const els = sectionRef.current!.querySelectorAll('.cta-el')
        scrollReveal(Array.from(els) as Element[], { y: 20, stagger: 0.15, duration: 0.8 })
      })
    })

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="bg-black border-t border-dark-border px-6 md:px-10 py-16 md:py-28 text-center"
    >
      <p className="cta-el font-mono text-[9px] tracking-[3px] text-[#444] uppercase mb-6 opacity-0">
        Start the conversation
      </p>
      <h2
        className="cta-el font-headline font-bold tracking-tightest text-white leading-[1.1] mb-6 opacity-0"
        style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
      >
        Got something worth<br />
        building? <span className="text-orange">Let&apos;s build it.</span>
      </h2>
      <p className="cta-el text-[15px] text-[#555] max-w-md mx-auto mb-12 opacity-0">
        No pitch decks. No big agency overhead. Just two founders and the tools to make your idea real.
      </p>
      <div className="cta-el opacity-0">
        <Button variant="primary" href="/contact">
          Let&apos;s Talk →
        </Button>
      </div>
    </section>
  )
}
