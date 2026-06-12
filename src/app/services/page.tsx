// src/app/services/page.tsx
import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { PixelIcon } from '@/components/ui/PixelIcon'

export const metadata: Metadata = {
  title: 'Services — HumanxMachine',
  description: 'Business Creation and Creative Production services — from zero to brand, from idea to distribution.',
  openGraph: { title: 'Services — HumanxMachine', description: 'Business Creation & Creative Production powered by AI.', images: [{ url: '/opengraph-image' }] },
  twitter: { card: 'summary_large_image' },
}

const PILLAR_ONE_SERVICES = [
  {
    name: 'Brand Strategy',
    tag: 'Foundation',
    desc: 'We define who you are, who you\'re for, and why you win. Competitive positioning, brand voice, messaging hierarchy, and a strategic framework that informs every decision — from the name you choose to the stories you tell.',
  },
  {
    name: 'Identity Design',
    tag: 'Visual System',
    desc: 'Your visual world from the ground up. Logo system, typography, colour palette, iconography, and living brand guidelines built for digital-first and designed to scale. No generic templates — everything is made for you.',
  },
  {
    name: 'Business Systems',
    tag: 'Operations',
    desc: 'Most founders are drowning in chaos they created. We build Notion-based operating systems, SOPs, client workflows, and automation stacks that turn a founder\'s chaos into a machine. Run less. Ship more.',
  },
  {
    name: 'AI Workflow Design',
    tag: 'Infrastructure',
    desc: 'Custom AI toolchains built around how your team actually works. From prompt systems and AI agents to automated research pipelines and content engines — we build the infrastructure that gives you back 10 hours a week.',
  },
]

const PILLAR_TWO_SERVICES = [
  {
    name: 'Content Strategy',
    tag: 'Direction',
    desc: 'A clear editorial direction across every platform. We define your content pillars, voice by channel, publishing cadence, and the audience psychology that drives each format. Strategy you can actually brief from.',
  },
  {
    name: 'Video Production',
    tag: 'Full-Service',
    desc: 'From concept to final cut. Creative direction, scripting, production coordination, and post-production for brand films, commercials, and social-native formats. Fast-turn or campaign-level — we handle both.',
  },
  {
    name: 'Photo Direction',
    tag: 'Visual Production',
    desc: 'Art direction, casting, and creative production for campaign photography. We also work with AI-assisted generation and compositing for brands that need to move faster than a traditional shoot timeline allows.',
  },
  {
    name: 'Distribution',
    tag: 'Amplification',
    desc: 'Great content dies without distribution strategy. Platform-native publishing, paid amplification, creator partnerships, and performance tracking — closing the loop between what you make and who actually sees it.',
  },
]

const BRAND_IMG = 'https://d8j0ntlcm91z4.cloudfront.net/user_30lCjEHvkkiAR5LQAmCXIgasWyv/hf_20260611_140952_83a73604-0fdf-40dc-b960-4bfbd5076551_min.webp'
const PRODUCTION_IMG = 'https://d8j0ntlcm91z4.cloudfront.net/user_30lCjEHvkkiAR5LQAmCXIgasWyv/hf_20260611_140953_aed64099-8d5c-49ac-bd19-6aa4905a8a83_min.webp'

export default function ServicesPage() {
  return (
    <main className="bg-black min-h-screen pt-16">

      {/* Page Hero */}
      <section className="px-6 md:px-16 pt-20 pb-16 border-b border-dark-border relative overflow-hidden">
        <div className="max-w-4xl">
          <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-6">What We Do</p>
          <h1
            className="font-headline font-bold tracking-tightest text-white leading-none mb-6"
            style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
          >
            Two pillars.<br />
            <span className="text-orange">One studio.</span>
          </h1>
          <p className="text-[15px] text-[#555] leading-relaxed max-w-lg">
            Everything we do falls under Business Creation or Creative Production.
            Most of our clients need both — because a brand without content is invisible,
            and content without strategy is noise.
          </p>
        </div>
        <div className="absolute bottom-8 right-10 opacity-[0.04]">
          <PixelIcon name="face" size={20} />
        </div>
      </section>

      {/* Pillar 01 — Business Creation */}
      <section className="border-b border-dark-border">
        {/* Image banner */}
        <div className="w-full h-[300px] md:h-[420px] overflow-hidden relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BRAND_IMG}
            alt="Business Creation — brand identity and strategy workspace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
          <div className="absolute bottom-8 left-6 md:left-16">
            <span className="font-mono text-[9px] tracking-[3px] text-orange uppercase bg-black/60 px-3 py-1.5 backdrop-blur-sm">
              Pillar 01 · Business Creation
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 md:px-16 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 md:gap-20">
            {/* Left: intro */}
            <div>
              <h2
                className="font-headline font-bold tracking-tightest text-white leading-none mb-6"
                style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}
              >
                Business<br />Creation
              </h2>
              <p className="text-[15px] text-[#555] leading-relaxed mb-8">
                From zero to brand. We build the identity, strategy, and systems founders need
                to launch with confidence — and the infrastructure to scale with clarity.
              </p>
              <Button variant="primary" href="/contact">Start a Project →</Button>
            </div>

            {/* Right: services */}
            <div className="space-y-0">
              {PILLAR_ONE_SERVICES.map((s, i) => (
                <div key={s.name} className={`py-8 ${i < PILLAR_ONE_SERVICES.length - 1 ? 'border-b border-dark-border' : ''}`}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-headline font-bold text-white text-xl tracking-tight">{s.name}</h3>
                    <span className="font-mono text-[8px] tracking-[2px] text-orange uppercase border border-orange/30 px-2 py-1 flex-shrink-0">
                      {s.tag}
                    </span>
                  </div>
                  <p className="text-[14px] text-[#555] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pillar 02 — Creative Production */}
      <section className="bg-white">
        {/* Image banner */}
        <div className="w-full h-[300px] md:h-[420px] overflow-hidden relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PRODUCTION_IMG}
            alt="Creative Production — video and content production studio"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />
          <div className="absolute bottom-8 left-6 md:left-16">
            <span className="font-mono text-[9px] tracking-[3px] text-orange uppercase bg-black/60 px-3 py-1.5 backdrop-blur-sm">
              Pillar 02 · Creative Production
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 md:px-16 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 md:gap-20">
            {/* Left: intro */}
            <div>
              <h2
                className="font-headline font-bold tracking-tightest text-black leading-none mb-6"
                style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}
              >
                Creative<br />Production
              </h2>
              <p className="text-[15px] text-[#666] leading-relaxed mb-8">
                From idea to distribution. We produce the content, campaigns, and creative assets
                that make brands move in culture — at a speed most studios won&apos;t attempt.
              </p>
              <Button variant="primary" href="/contact">Start a Project →</Button>
            </div>

            {/* Right: services */}
            <div className="space-y-0">
              {PILLAR_TWO_SERVICES.map((s, i) => (
                <div key={s.name} className={`py-8 ${i < PILLAR_TWO_SERVICES.length - 1 ? 'border-b border-[#e8e7e3]' : ''}`}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-headline font-bold text-black text-xl tracking-tight">{s.name}</h3>
                    <span className="font-mono text-[8px] tracking-[2px] text-orange uppercase border border-orange/40 px-2 py-1 flex-shrink-0">
                      {s.tag}
                    </span>
                  </div>
                  <p className="text-[14px] text-[#888] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
