'use client'

import { useEffect, useRef } from 'react'
import { loadGSAP, scrollReveal, wordReveal } from '@/lib/animations'

const MANIFESTO =
  "We didn't set out to build an agency. We set out to prove that two people with the right tools can outthink a team of twenty."

export function Manifesto() {
  const containerRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !labelRef.current || !bodyRef.current) return
    let cancelled = false

    loadGSAP().then(({ gsap }) => {
      if (cancelled) return
      const ctx = gsap.context(() => {
        scrollReveal(labelRef.current!, { y: 20, duration: 0.7 })
        wordReveal(containerRef.current!)
        scrollReveal(bodyRef.current!, { y: 20, delay: 0.3, duration: 0.8 })
      })
      return () => ctx.revert()
    })

    return () => { cancelled = true }
  }, [])

  const words = MANIFESTO.split(' ')

  return (
    <section className="bg-[#f0ede6] px-6 md:px-10 py-16 md:py-28">
      <div className="max-w-5xl mx-auto">
        <div
          ref={labelRef}
          className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-10 opacity-0"
        >
          02 — Philosophy
        </div>

        <div
          ref={containerRef}
          className="font-headline font-semibold leading-[1.3] tracking-tighter"
          style={{ fontSize: 'clamp(24px, 3.5vw, 42px)' }}
        >
          {words.map((word, i) => (
            <span
              key={i}
              data-word
              className="inline-block mr-[0.25em]"
              style={{ color: '#999' }}
            >
              {word}
            </span>
          ))}
        </div>

        <p
          ref={bodyRef}
          className="max-w-xl mt-10 text-[15px] text-[#777] leading-[1.8] opacity-0"
        >
          We bring real experience — from building brands that last to shipping campaigns
          that move culture — and we pair it with AI that makes every hour count for three.
          We&apos;re not here to impress you with our process. We&apos;re here to build your thing.
        </p>
      </div>
    </section>
  )
}
