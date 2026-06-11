'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { loadGSAP } from '@/lib/animations'

const FOUNDER_ONE = {
  initials: 'O',
  name: 'Ong Santimakorn',
  role: 'Brand · Strategy · Vision',
  bio: "Ong has spent his career shaping brands that move in culture — from startups to established names across Asia. Co-founding HumanxMachine was a natural next step: building the studio he always wished existed. He leads strategy, brand identity, and the creative vision that ties everything together.",
  imageUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_30lCjEHvkkiAR5LQAmCXIgasWyv/hf_20260611_141648_ae4f2731-6ba1-4f00-b8c6-abc93e5b75f4_min.webp',
}

const FOUNDER_TWO = {
  initials: 'T',
  name: 'Tao Santimakorn',
  role: 'Tech · Systems · AI',
  bio: "Tao sees AI not as a trend but as infrastructure — the operating layer for the next generation of businesses. With a background in technology and systems design, he architects the workflows, tools, and technical foundations that let HumanxMachine move at a pace most studios won't attempt.",
  imageUrl: 'https://d8j0ntlcm91z4.cloudfront.net/user_30lCjEHvkkiAR5LQAmCXIgasWyv/hf_20260611_141650_0a29d0b3-f3b9-406e-b522-ba32f9bf86b5_min.webp',
}

export default function AboutPage() {
  const heroHeadlineRef = useRef<HTMLSpanElement>(null)
  const heroSubRef = useRef<HTMLParagraphElement>(null)
  const foundersRef = useRef<HTMLDivElement>(null)
  const philRef = useRef<HTMLDivElement>(null)
  const statementRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any
    let cancelled = false

    loadGSAP().then(({ gsap }) => {
      if (cancelled) return
      ctx = gsap.context(() => {
        // Hero entrance
        if (heroHeadlineRef.current) {
          gsap.fromTo(heroHeadlineRef.current,
            { yPercent: 110 },
            { yPercent: 0, duration: 0.9, ease: 'power3.out', delay: 0.2 }
          )
        }
        if (heroSubRef.current) {
          gsap.fromTo(heroSubRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.6 }
          )
        }

        // Founders scroll reveal
        if (foundersRef.current) {
          const cards = foundersRef.current.querySelectorAll('.founder-card')
          if (cards.length) {
            gsap.fromTo(Array.from(cards),
              { opacity: 0, y: 30 },
              {
                opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15,
                scrollTrigger: { trigger: foundersRef.current, start: 'top 80%', once: true },
              }
            )
          }
        }

        // Philosophy scroll reveal
        if (philRef.current) {
          const els = philRef.current.querySelectorAll('.phil-el')
          if (els.length) {
            gsap.fromTo(Array.from(els),
              { opacity: 0, y: 24 },
              {
                opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12,
                scrollTrigger: { trigger: philRef.current, start: 'top 80%', once: true },
              }
            )
          }
        }

        // Statement scroll reveal
        if (statementRef.current) {
          gsap.fromTo(statementRef.current,
            { opacity: 0, y: 20 },
            {
              opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
              scrollTrigger: { trigger: statementRef.current, start: 'top 85%', once: true },
            }
          )
        }
      })
    })

    return () => { cancelled = true; ctx?.revert() }
  }, [])

  return (
    <main>

      {/* Section 01: Hero */}
      <section className="relative min-h-[70vh] bg-black flex flex-col justify-end px-6 md:px-10 pb-20 pt-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(255,77,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />

        <div className="relative z-10" style={{ maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
          <p className="font-mono text-[10px] tracking-[3px] text-orange uppercase mb-6">
            01 — Who We Are
          </p>
          <h1
            className="font-headline font-bold leading-[0.95] tracking-tightest text-white mb-8 overflow-hidden"
            style={{ fontSize: 'clamp(36px, 5.5vw, 72px)' }}
          >
            <span ref={heroHeadlineRef} className="block">
              This is the era of<br />
              the <span className="text-orange">solo entrepreneur.</span>
            </span>
          </h1>
          <p
            ref={heroSubRef}
            className="text-[15px] text-[#666] leading-[1.7] max-w-lg opacity-0"
          >
            Two experienced founders who believe the rules have changed.
            You don&apos;t need a big team or large capital to build something
            meaningful — you need the right tools, the right vision, and the
            courage to move.
          </p>
        </div>
      </section>

      {/* Section 02: Founders */}
      <section ref={foundersRef} className="border-t border-dark-border">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {[
            { label: 'Founder 01', data: FOUNDER_ONE, borderClass: 'border-b md:border-b-0 md:border-r border-dark-border' },
            { label: 'Founder 02', data: FOUNDER_TWO, borderClass: '' },
          ].map(({ label, data, borderClass }) => (
            <div key={label} className={`founder-card bg-dark-surface ${borderClass} px-6 md:px-12 py-16 opacity-0`}>
              <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-8">{label}</p>
              <div className="mb-6">
                {data.imageUrl ? (
                  <img
                    src={data.imageUrl}
                    alt={data.name}
                    className="w-24 h-24 object-cover rounded-sm border border-dark-border"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-sm bg-dark-surface border border-dark-border flex items-center justify-center font-headline font-bold text-orange text-2xl">
                    {data.initials}
                  </div>
                )}
              </div>
              <h2 className="font-headline font-bold text-white text-2xl tracking-tight mb-1">{data.name}</h2>
              <p className="font-mono text-[9px] tracking-[2px] text-[#444] uppercase mb-6">{data.role}</p>
              <p className="text-[14px] text-[#555] leading-[1.75]">{data.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 03: Philosophy */}
      <section ref={philRef} className="bg-black border-t border-dark-border px-6 md:px-10 py-20 md:py-28">
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <p className="phil-el font-mono text-[9px] tracking-[3px] text-[#444] uppercase mb-12 opacity-0">
            02 — Our Belief
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            <h2
              className="phil-el font-headline font-bold tracking-tighter text-white leading-[1.05] opacity-0"
              style={{ fontSize: 'clamp(28px, 3.5vw, 48px)' }}
            >
              AI doesn&apos;t replace you.<br />
              It <span className="text-orange">completes you.</span>
            </h2>
            <div>
              <p className="phil-el text-[14px] text-[#555] leading-[1.8] mb-8 opacity-0">
                Every founder has gaps — skills they don&apos;t have, capacity they
                can&apos;t afford to hire. AI fills those gaps. It&apos;s a creative director,
                a copywriter, a developer, a researcher, and a strategist —
                available the moment you need it.
              </p>
              <ul className="flex flex-col gap-5">
                {[
                  "The best businesses are built by people who understand leverage — AI is the ultimate lever.",
                  "Speed is a strategy. Moving fast with AI isn't reckless — it's the new competitive advantage.",
                  "From before impossible to infinite possibilities — that's the only direction we move.",
                ].map((belief, i) => (
                  <li key={i} className="phil-el flex gap-4 items-start opacity-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange mt-2 flex-shrink-0" />
                    <p className="text-[13px] text-[#555] leading-[1.7]">{belief}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 04: Orange statement block */}
      <section className="bg-orange px-6 md:px-10 py-20 md:py-28">
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <p
            ref={statementRef}
            className="font-headline font-bold text-white leading-[1.05] tracking-tighter opacity-0"
            style={{ fontSize: 'clamp(28px, 4.5vw, 56px)' }}
          >
            You don&apos;t need a bigger team.<br />
            You need better tools.
          </p>
        </div>
      </section>

      {/* Section 05: CTA */}
      <section className="bg-black border-t border-dark-border px-6 md:px-10 py-20">
        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          style={{ maxWidth: '1440px', margin: '0 auto' }}
        >
          <div>
            <h2
              className="font-headline font-bold text-white tracking-tighter mb-3"
              style={{ fontSize: 'clamp(24px, 3vw, 40px)' }}
            >
              Ready to build something<br />at the edge?
            </h2>
            <p className="text-[14px] text-[#555]">Let&apos;s talk about what you&apos;re working on.</p>
          </div>
          <Button variant="primary" href="/contact">Start a Project →</Button>
        </div>
      </section>

    </main>
  )
}
