'use client'

import { useEffect, useRef } from 'react'
import { Tag } from '@/components/ui/Tag'
import { loadGSAP, scrollSlideIn } from '@/lib/animations'

const PILLAR_ONE_TAGS = ['Brand Strategy', 'Identity Design', 'Biz Systems', 'AI Workflows']
const PILLAR_TWO_TAGS = ['Content Strategy', 'Video / Photo', 'Distribution', 'AI Production']

function BusinessIcon() {
  return (
    <div className="w-14 h-14 bg-white border border-[#e0dfd9] flex items-center justify-center rounded-sm">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="18" width="6" height="7" fill="#12120f" />
        <rect x="11" y="13" width="6" height="12" fill="#12120f" />
        <rect x="19" y="7" width="6" height="18" fill="#ff4d00" />
        <rect x="19" y="3" width="6" height="2" fill="#ff4d00" opacity="0.4" />
      </svg>
    </div>
  )
}

function ProductionIcon() {
  return (
    <div className="w-14 h-14 bg-white border border-[#d0cfc9] flex items-center justify-center rounded-sm">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="7" width="18" height="14" rx="1.5" stroke="#12120f" strokeWidth="1.5" />
        <path d="M20 12L26 9V19L20 16V12Z" fill="#ff4d00" />
        <circle cx="11" cy="14" r="3.5" stroke="#12120f" strokeWidth="1.5" />
        <circle cx="11" cy="14" r="1.2" fill="#ff4d00" />
      </svg>
    </div>
  )
}

export function Pillars() {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!leftRef.current || !rightRef.current) return
    let ctx: any // eslint-disable-line @typescript-eslint/no-explicit-any
    let cancelled = false

    loadGSAP().then(({ gsap }) => {
      if (cancelled) return
      ctx = gsap.context(() => {
        scrollSlideIn(leftRef.current!, 'left')
        scrollSlideIn(rightRef.current!, 'right')
      })
    })

    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 border-t border-[#E2E2DF]">

      {/* Pillar 01 — light */}
      <div
        ref={leftRef}
        className="bg-[#F7F7F7] border-b md:border-b-0 md:border-r border-[#E2E2DF] px-6 md:px-12 py-14 md:py-20 relative overflow-hidden opacity-0"
      >
        <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-6">
          Pillar 01
        </p>
        <BusinessIcon />
        <h2
          className="font-headline font-bold tracking-tighter leading-[1.1] text-[#12120f] mt-6 mb-5"
          style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}
        >
          Business<br />Creation
        </h2>
        <p className="text-[15px] text-[#777] leading-[1.75] mb-8 max-w-sm">
          From zero to brand. We build the identity, strategy, and systems
          founders need to launch with confidence and scale with clarity.
        </p>
        <div className="flex flex-wrap gap-2">
          {PILLAR_ONE_TAGS.map((tag, i) => (
            <Tag key={i} variant={i === 0 ? 'filled' : 'outline-light'}>
              {tag}
            </Tag>
          ))}
        </div>
      </div>

      {/* Pillar 02 — light */}
      <div
        ref={rightRef}
        className="bg-white px-6 md:px-12 py-14 md:py-20 relative overflow-hidden opacity-0"
      >
        <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-6">
          Pillar 02
        </p>
        <ProductionIcon />
        <h2
          className="font-headline font-bold tracking-tighter leading-[1.1] text-black mt-6 mb-5"
          style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}
        >
          Creative<br />Production
        </h2>
        <p className="text-[15px] text-[#666] leading-[1.75] mb-8 max-w-sm">
          From idea to distribution. We produce the content, campaigns, and
          creative assets that make brands move in culture.
        </p>
        <div className="flex flex-wrap gap-2">
          {PILLAR_TWO_TAGS.map((tag, i) => (
            <Tag key={i} variant={i === 0 ? 'filled' : 'outline-light'}>
              {tag}
            </Tag>
          ))}
        </div>
      </div>

    </div>
  )
}
