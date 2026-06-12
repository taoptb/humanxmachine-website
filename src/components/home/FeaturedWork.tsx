'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { loadGSAP, scrollReveal } from '@/lib/animations'

interface FeaturedWorkProps {
  projects: {
    slug: string
    title: string
    category: string
    description: string
    coverUrl: string | null
    isVideo?: boolean
  }[]
}

export function FeaturedWork({ projects }: FeaturedWorkProps) {
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!headerRef.current || !gridRef.current) return
    let ctx: any // eslint-disable-line @typescript-eslint/no-explicit-any
    let cancelled = false

    loadGSAP().then(({ gsap }) => {
      if (cancelled) return
      ctx = gsap.context(() => {
        scrollReveal(headerRef.current!, { y: 20, duration: 0.7 })
        const cards = gridRef.current!.querySelectorAll('.work-card')
        scrollReveal(Array.from(cards) as Element[], { y: 30, stagger: 0.12, duration: 0.8 })

        // 3D tilt on hover
        cards.forEach((card) => {
          const el = card as HTMLElement
          const MAX_TILT = 8

          const onEnter = () => {
            gsap.to(el, { transformPerspective: 800, duration: 0.3, ease: 'power2.out' })
          }
          const onMove = (e: Event) => {
            const me = e as MouseEvent
            const rect = el.getBoundingClientRect()
            const x = (me.clientX - rect.left) / rect.width  - 0.5
            const y = (me.clientY - rect.top)  / rect.height - 0.5
            gsap.to(el, {
              rotateY:  x * MAX_TILT * 2,
              rotateX: -y * MAX_TILT * 2,
              duration: 0.4,
              ease: 'power2.out',
            })
          }
          const onLeave = () => {
            gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' })
          }

          el.addEventListener('mouseenter', onEnter)
          el.addEventListener('mousemove',  onMove)
          el.addEventListener('mouseleave', onLeave)
        })
      })
    })

    return () => {
      cancelled = true
      ctx?.revert()
    }
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
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="work-card group relative rounded overflow-hidden opacity-0 block bg-[#f0efe9]"
              style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
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
