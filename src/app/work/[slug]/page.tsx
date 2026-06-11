import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getWorkProject, getWorkProjects } from '@/lib/notion'

export const revalidate = 3600

export async function generateStaticParams() {
  const projects = await getWorkProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = await getWorkProject(slug)
  if (!project) return { title: 'Work — HumanxMachine' }
  return {
    title: `${project.title} — HumanxMachine`,
    description: project.description || `${project.category} project by HumanxMachine.`,
    openGraph: {
      title: project.title,
      description: project.description || '',
      images: [{ url: `/work/${slug}/opengraph-image` }],
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getWorkProject(slug)
  if (!project) notFound()

  const allProjects = await getWorkProjects()
  const currentIndex = allProjects.findIndex((p) => p.slug === slug)
  const prev = allProjects[currentIndex - 1] ?? null
  const next = allProjects[currentIndex + 1] ?? null

  return (
    <main className="bg-black min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ height: '70vh', minHeight: '480px' }}>
        {project.isVideo ? (
          <div className="w-full h-full bg-[#1a1a17] flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border border-orange/30 flex items-center justify-center text-orange/60 text-3xl">▶</div>
          </div>
        ) : project.coverUrl ? (
          <Image src={project.coverUrl} alt={project.title} fill className="object-cover object-top" priority />
        ) : (
          <div className="w-full h-full bg-dark-surface" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-10">
          <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-3">{project.category}</p>
          <h1 className="font-headline font-bold tracking-tightest text-white leading-none" style={{ fontSize: 'clamp(32px, 5vw, 72px)' }}>
            {project.title}
          </h1>
        </div>
      </section>

      {/* Body */}
      <section className="px-6 md:px-10 py-20 max-w-3xl mx-auto">
        {project.description && (
          <p className="text-lg text-[#888] leading-relaxed mb-16">{project.description}</p>
        )}
        {project.brief && (
          <div className="mb-12">
            <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-4">Brief</p>
            <p className="text-base text-[#aaa] leading-relaxed">{project.brief}</p>
          </div>
        )}
        {project.challenge && (
          <div className="mb-12">
            <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-4">Challenge</p>
            <p className="text-base text-[#aaa] leading-relaxed">{project.challenge}</p>
          </div>
        )}
        {project.output && (
          <div className="mb-12">
            <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-4">Output</p>
            <p className="text-base text-[#aaa] leading-relaxed">{project.output}</p>
          </div>
        )}
        {project.mediaUrls && project.mediaUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-16">
            {project.mediaUrls.map((url, i) => (
              <div key={i} className="relative aspect-square rounded overflow-hidden">
                <Image src={url} alt={`${project.title} ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Prev / Next */}
      <div className="border-t border-dark-border grid grid-cols-2">
        {prev ? (
          <Link href={`/work/${prev.slug}`} className="px-10 py-8 border-r border-dark-border hover:bg-dark-surface transition-colors group">
            <p className="font-mono text-[9px] tracking-[2px] text-[#444] uppercase mb-2">← Previous</p>
            <p className="font-headline font-bold text-white text-lg tracking-tight group-hover:text-orange transition-colors">{prev.title}</p>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`/work/${next.slug}`} className="px-10 py-8 text-right hover:bg-dark-surface transition-colors group">
            <p className="font-mono text-[9px] tracking-[2px] text-[#444] uppercase mb-2">Next →</p>
            <p className="font-headline font-bold text-white text-lg tracking-tight group-hover:text-orange transition-colors">{next.title}</p>
          </Link>
        ) : <div />}
      </div>
    </main>
  )
}
