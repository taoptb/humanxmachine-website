'use client'

import { useEffect, useRef } from 'react'
import { countUp } from '@/lib/animations'

const STATS = [
  { value: 128, label: 'Projects', suffix: '' },
  { value: 23, label: 'Markets', suffix: '' },
  { value: 98, label: 'Impact', suffix: '%' },
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
      className="bg-orange grid grid-cols-3 px-10 py-20"
    >
      {STATS.map((stat) => (
        <div key={stat.label} className="text-center px-5">
          <span
            data-stat={stat.value}
            className="font-headline font-bold text-white leading-none block"
            style={{ fontSize: 'clamp(56px, 8vw, 96px)', letterSpacing: '-4px' }}
          >
            0
          </span>
          <span className="font-mono text-[10px] tracking-[3px] uppercase text-white/50 mt-2 block">
            {stat.suffix}{stat.label}
          </span>
        </div>
      ))}
    </section>
  )
}
