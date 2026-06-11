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
  { name: 'Brand Strategy', desc: 'Positioning, messaging framework, and competitive differentiation.' },
  { name: 'Identity Design', desc: 'Logo, visual system, typography, color, and brand guidelines.' },
  { name: 'Business Systems', desc: 'Notion-based ops, SOPs, client workflows, and growth infrastructure.' },
  { name: 'AI Workflow Design', desc: "Custom AI toolchains to accelerate your team's output." },
]

const PILLAR_TWO_SERVICES = [
  { name: 'Content Strategy', desc: 'Editorial calendar, platform strategy, and content pillars.' },
  { name: 'Video Production', desc: 'Concept to delivery — commercial, editorial, or social formats.' },
  { name: 'Photo Direction', desc: 'Campaign art direction, AI-assisted photo generation and editing.' },
  { name: 'Distribution', desc: 'Platform-native publishing, paid amplification, and performance tracking.' },
]

export default function ServicesPage() {
  return (
    <main className="bg-black min-h-screen pt-16">

      {/* Pillar 01 — dark */}
      <section className="px-6 md:px-16 py-24 border-b border-dark-border relative overflow-hidden">
        <div className="max-w-2xl">
          <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-6">Pillar 01</p>
          <h1 className="font-headline font-bold tracking-tightest text-white leading-none mb-6" style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}>
            Business<br />Creation
          </h1>
          <p className="text-[15px] text-[#555] leading-relaxed mb-12 max-w-lg">
            From zero to brand. We build the identity, strategy, and systems founders need to launch with confidence and scale with clarity.
          </p>

          <div className="space-y-6 mb-14">
            {PILLAR_ONE_SERVICES.map((s) => (
              <div key={s.name} className="border-t border-dark-border pt-5">
                <h3 className="font-headline font-bold text-white text-lg tracking-tight mb-1">{s.name}</h3>
                <p className="text-[13px] text-[#555] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <Button variant="primary" href="/contact">Start a Project →</Button>
        </div>
        <div className="absolute bottom-10 right-10 opacity-[0.05]">
          <PixelIcon name="x" size={24} />
        </div>
      </section>

      {/* Pillar 02 — light */}
      <section className="bg-white px-6 md:px-16 py-24 relative overflow-hidden">
        <div className="max-w-2xl">
          <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-6">Pillar 02</p>
          <h2 className="font-headline font-bold tracking-tightest text-black leading-none mb-6" style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}>
            Creative<br />Production
          </h2>
          <p className="text-[15px] text-[#666] leading-relaxed mb-12 max-w-lg">
            From idea to distribution. We produce the content, campaigns, and creative assets that make brands move in culture.
          </p>

          <div className="space-y-6 mb-14">
            {PILLAR_TWO_SERVICES.map((s) => (
              <div key={s.name} className="border-t border-[#e8e7e3] pt-5">
                <h3 className="font-headline font-bold text-black text-lg tracking-tight mb-1">{s.name}</h3>
                <p className="text-[13px] text-[#888] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <Button variant="primary" href="/contact">Start a Project →</Button>
        </div>
        <div className="absolute bottom-10 right-10 opacity-[0.05]">
          <PixelIcon name="plus" size={24} color="#12120f" />
        </div>
      </section>

    </main>
  )
}
