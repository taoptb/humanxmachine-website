'use client'

import { useEffect, useRef } from 'react'
import { loadGSAP, scrollReveal } from '@/lib/animations'

const DECLARATIONS = [
  {
    statement: 'We start at the end.',
    detail: 'Most engagements begin with discovery. Ours begin with the outcome you need — then we reverse-engineer how to get there. No 6-week onboarding. No strategy decks that sit on a shelf.',
  },
  {
    statement: 'Days, not decks.',
    detail: "We don't disappear into a creative black box. You see real work in days. We build, you react, we improve. The feedback loop is fast by design — because iteration is cheaper than perfection.",
  },
  {
    statement: 'AI does the heavy lifting.',
    detail: 'Every project runs an AI engine underneath — research, ideation, production, QC. This is how we move at a pace that shouldn\'t be possible for a two-person studio. It is, and it\'s the point.',
  },
  {
    statement: 'We stop when it\'s right.',
    detail: "Not when the retainer runs out. Not when the deck looks polished. When the work is actually good and you're actually proud of it — that's when we're done.",
  },
]

export function Process() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    let ctx: any // eslint-disable-line @typescript-eslint/no-explicit-any
    let cancelled = false

    loadGSAP().then(({ gsap }) => {
      if (cancelled) return
      ctx = gsap.context(() => {
        scrollReveal(labelRef.current!, { y: 15 })
        scrollReveal(headlineRef.current!, { y: 20, delay: 0.1 })

        const items = sectionRef.current!.querySelectorAll('.declaration-item')
        items.forEach((item, i) => {
          scrollReveal(item as Element, { y: 24, delay: i * 0.08 })
        })
      })
    })

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="bg-white border-t border-[#E2E2DF] px-6 md:px-10 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <div ref={labelRef} className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-12 opacity-0">
          05 — How We Work
        </div>
        <h2
          ref={headlineRef}
          className="font-headline font-bold tracking-tightest text-[#12120f] mb-16 opacity-0"
          style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
        >
          We don&apos;t do<br />
          <span className="text-orange">waterfall.</span>
        </h2>

        <div className="flex flex-col divide-y divide-[#E2E2DF]">
          {DECLARATIONS.map((d, i) => (
            <div key={i} className="declaration-item opacity-0 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-16 py-10">
              <h3
                className="font-headline font-bold text-[#12120f] leading-tight"
                style={{ fontSize: 'clamp(20px, 2vw, 26px)' }}
              >
                {d.statement}
              </h3>
              <p className="text-[14px] text-[#888] leading-[1.8] self-center">
                {d.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
