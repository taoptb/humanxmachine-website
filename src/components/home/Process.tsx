'use client'

import { useEffect, useRef } from 'react'
import { scrollReveal, drawLine } from '@/lib/animations'

const STEPS = [
  { num: '01', name: 'Discover', desc: 'Deep dive into your vision, market, and the gaps that need filling.' },
  { num: '02', name: 'Define', desc: 'Strategy, identity, and systems blueprint tailored to your ambition.' },
  { num: '03', name: 'Create', desc: 'Production — design, content, campaigns — executed at pace.' },
  { num: '04', name: 'Scale', desc: 'Distribution, iteration, and growth systems built to compound.' },
]

export function Process() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    let ctx: any

    async function animate() {
      const { gsap } = await import('gsap')
      ctx = gsap.context(() => {
        scrollReveal(labelRef.current!, { y: 15 })
        scrollReveal(headlineRef.current!, { y: 20, delay: 0.1 })

        const steps = sectionRef.current!.querySelectorAll('.process-step')
        steps.forEach((step, i) => {
          scrollReveal(step as Element, { y: 30, delay: i * 0.1 })
          const line = step.querySelector('.step-line')
          if (line) drawLine(line, { delay: i * 0.1 + 0.3 })
        })
      })
    }

    animate()
    return () => ctx?.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-black border-t border-dark-border px-10 py-24">
      <div className="max-w-5xl mx-auto">
        <div ref={labelRef} className="font-mono text-[9px] tracking-[3px] text-[#444] uppercase mb-12 opacity-0">
          05 — How We Work
        </div>
        <h2
          ref={headlineRef}
          className="font-headline font-bold tracking-tightest text-white mb-16 opacity-0"
          style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
        >
          From Idea<br />to Impact
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STEPS.map((step) => (
            <div key={step.num} className="process-step opacity-0">
              <div className="font-headline font-bold text-[48px] tracking-tightest text-[#1f1f1c] leading-none mb-4">
                {step.num}
              </div>
              <div className="step-line w-full h-px bg-[#222] mb-4" style={{ transformOrigin: 'left center' }} />
              <h3 className="font-headline font-bold text-[15px] text-white mb-2">
                {step.name}
              </h3>
              <p className="text-[13px] text-[#444] leading-[1.6]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
