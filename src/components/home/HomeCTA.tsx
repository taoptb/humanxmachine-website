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
        Ready to Build?
      </p>
      <h2
        className="cta-el font-headline font-bold tracking-tightest text-white leading-[1.1] mb-12 opacity-0"
        style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
      >
        Let&apos;s build something<br />
        at the <span className="text-orange">edge.</span>
      </h2>
      <div className="cta-el opacity-0">
        <Button variant="primary" href="/contact">
          Start a Project →
        </Button>
      </div>
    </section>
  )
}
