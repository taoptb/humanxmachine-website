'use client'

import { useEffect, useRef } from 'react'
import { Tag } from '@/components/ui/Tag'
import { PixelIcon } from '@/components/ui/PixelIcon'
import { loadGSAP, scrollSlideIn } from '@/lib/animations'

const PILLAR_ONE_TAGS = ['Brand Strategy', 'Identity Design', 'Biz Systems', 'AI Workflows']
const PILLAR_TWO_TAGS = ['Content Strategy', 'Video / Photo', 'Distribution', 'AI Production']

export function Pillars() {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!leftRef.current || !rightRef.current) return
    let ctx: any
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
    <div className="grid grid-cols-1 md:grid-cols-2 border-t border-dark-border">

      {/* Pillar 01 — dark */}
      <div
        ref={leftRef}
        className="bg-black border-b md:border-b-0 md:border-r border-dark-border px-6 md:px-12 py-14 md:py-20 relative overflow-hidden opacity-0"
      >
        <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-6">
          Pillar 01
        </p>
        <h2
          className="font-headline font-bold tracking-tighter leading-[1.1] text-white mb-5"
          style={{ fontSize: 'clamp(28px, 3vw, 40px)' }}
        >
          Business<br />Creation
        </h2>
        <p className="text-[15px] text-[#555] leading-[1.75] mb-8 max-w-sm">
          From zero to brand. We build the identity, strategy, and systems
          founders need to launch with confidence and scale with clarity.
        </p>
        <div className="flex flex-wrap gap-2">
          {PILLAR_ONE_TAGS.map((tag, i) => (
            <Tag key={i} variant={i === 0 ? 'filled' : 'outline-dark'}>
              {tag}
            </Tag>
          ))}
        </div>
        {/* Pixel decoration */}
        <div className="absolute bottom-8 right-8 opacity-[0.08]">
          <PixelIcon name="x" size={16} />
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
        <h2
          className="font-headline font-bold tracking-tighter leading-[1.1] text-black mb-5"
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
        {/* Pixel decoration */}
        <div className="absolute bottom-8 right-8 opacity-[0.06]">
          <PixelIcon name="plus" size={16} color="#12120f" />
        </div>
      </div>

    </div>
  )
}
