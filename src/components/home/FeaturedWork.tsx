'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { scrollReveal } from '@/lib/animations'

const FEATURED_PROJECTS = [
  {
    slug: 'the-algorithm-of-soul',
    title: 'The Algorithm of Soul',
    category: 'Original IP · Film · AI Production',
    description: 'An original HumanxMachine film — AI-designed characters, world, and visual identity built from the ground up.',
    coverUrl: '/work/algo/hero.png',
    isVideo: false,
  },
  {
    slug: 'luxora',
    title: 'Luxora',
    category: 'K-POP · AI Character · Music',
    description: 'A K-POP girl group built entirely with AI — characters, visuals, campaign, and music production from scratch.',
    coverUrl: '/work/luxora/hero.png',
    isVideo: false,
  },
  {
    slug: 'commercial-production',
    title: 'Commercial Production',
    category: 'Commercial Ads · Video · Athlete',
    description: 'Cinematic athlete content — performance films produced end-to-end for a global sportswear brand.',
    coverUrl: null,
    isVideo: true,
  },
]

export function FeaturedWork() {
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!headerRef.current || !gridRef.current) return
    let ctx: any

    async function animate() {
      const { gsap } = await import('gsap')
      ctx = gsap.context(() => {
        scrollReveal(headerRef.current!, { y: 20, duration: 0.7 })
        const cards = gridRef.current!.querySelectorAll('.work-card')
        scrollReveal(Array.from(cards) as Element[], { y: 30, stagger: 0.12, duration: 0.8 })
      })
    }

    animate()
    return () => ctx?.revert()
  }, [])

  return (
    <section className="bg-white px-10 py-20">
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>

        <div ref={headerRef} className="flex justify-between items-end mb-12 opacity-0">
          <h2 className="font-headline font-bold text-[32px] tracking-tighter text-black">
            Featured Work
          </h2>
          <Link
            href="/work"
            className="font-mono text-[10px] tracking-[2px] uppercase text-orange hover:underline"
          >
            View All →
          </Link>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURED_PROJECTS.map((project) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="work-card group relative rounded overflow-hidden opacity-0 block bg-[#f0efe9]"
            >
              {/* Thumbnail */}
              <div className="relative h-56 overflow-hidden">
                {project.isVideo ? (
                  <div className="w-full h-full bg-dark-surface flex flex-col items-center justify-center gap-2">
                    <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/30 text-lg group-hover:border-orange group-hover:text-orange transition-colors">
                      ▶
                    </div>
                    <span className="font-mono text-[8px] tracking-[3px] text-[#333] uppercase">
                      Video · Motion
                    </span>
                  </div>
                ) : (
                  <Image
                    src={project.coverUrl!}
                    alt={project.title}
                    fill
                    className="object-cover object-top group-hover:scale-[1.04] transition-transform duration-700"
                  />
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              </div>

              {/* Info */}
              <div className="p-5">
                <p className="font-mono text-[9px] tracking-[2px] text-orange uppercase mb-2">
                  {project.category}
                </p>
                <h3 className="font-headline font-bold text-base tracking-tight text-black">
                  {project.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
