'use client'

import { useEffect, useRef } from 'react'
import { loadGSAP, scrollReveal, wordReveal } from '@/lib/animations'

const MANIFESTO =
  "Most agencies are still deciding how to feel about AI. We already used it to build a luxury brand, design a cyborg identity system, and produce a commercial campaign — this week."

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
    <section className="bg-black border-t border-dark-border px-10 py-28">
      <div className="max-w-5xl mx-auto">
        <div
          ref={labelRef}
          className="font-mono text-[9px] tracking-[3px] text-[#444] uppercase mb-10 opacity-0"
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
              style={{ color: '#333' }}
            >
              {word}
            </span>
          ))}
        </div>

        <p
          ref={bodyRef}
          className="max-w-xl mt-10 text-[15px] text-[#555] leading-[1.8] opacity-0"
        >
          HumanxMachine is where strategy meets execution, where creativity meets
          systems, and where founders meet the future they&apos;re trying to build.
        </p>
      </div>
    </section>
  )
}
