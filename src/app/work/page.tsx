import type { Metadata } from 'next'
import { getWorkProjects } from '@/lib/notion'
import { WorkGrid } from '@/components/work/WorkGrid'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Work — HumanxMachine',
  description: 'Selected work: business creation, creative production, and original IP — all powered by AI.',
  openGraph: { title: 'Work — HumanxMachine', description: 'Selected work powered by AI.', images: [{ url: '/opengraph-image' }] },
  twitter: { card: 'summary_large_image' },
}

export default async function WorkPage() {
  const projects = await getWorkProjects()

  return (
    <main className="bg-[#F7F7F7] min-h-screen pt-24 px-6 md:px-10 pb-20">
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-4">Selected Work</p>
        <h1 className="font-headline font-bold tracking-tightest text-[#12120f] mb-3 leading-none" style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}>
          Work
        </h1>
        <p className="text-[14px] text-[#888] mb-12">
          Business Creation · Creative Production · All powered by AI
        </p>
        <WorkGrid projects={projects} />
      </div>
    </main>
  )
}
