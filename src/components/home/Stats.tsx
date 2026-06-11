'use client'

import { useEffect, useRef } from 'react'
import { countUp } from '@/lib/animations'

const STATS = [
  { value: 300, label: 'Creators Enrolled', suffix: '+' },
  { value: 60, label: 'Brands Launched', suffix: '+' },
  { value: 14, label: 'Days to First Delivery', suffix: '' },
]

export function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const triggered = useRef(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !triggered.current) {
          triggered.current = true
          section.querySelectorAll<HTMLElement>('[data-stat]').forEach((el) => {
            const target = parseInt(el.dataset.stat!)
            countUp(el, target)
          })
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="bg-orange grid grid-cols-3 px-6 md:px-10 py-16 md:py-20"
    >
      {STATS.map((stat) => (
        <div key={stat.label} className="text-center px-5">
          <div className="inline-flex items-baseline leading-none">
            <span
              data-stat={stat.value}
              className="font-headline font-bold text-white"
              style={{ fontSize: 'clamp(40px, 8vw, 96px)', letterSpacing: '-3px' }}
            >
              0
            </span>
            <span
              className="font-headline font-bold text-white/70 ml-1"
              style={{ fontSize: 'clamp(24px, 4vw, 48px)' }}
            >
              {stat.suffix}
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-[3px] uppercase text-white/50 mt-2 block">
            {stat.label}
          </span>
        </div>
      ))}
    </section>
  )
}
