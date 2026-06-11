import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getInsight, getInsights, getInsightPageBlocks } from '@/lib/notion'

export const revalidate = 3600

export async function generateStaticParams() {
  const insights = await getInsights()
  return insights.map((i) => ({ slug: i.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const insight = await getInsight(slug)
  if (!insight) return { title: 'Insights — HumanxMachine' }
  return {
    title: `${insight.title} — HumanxMachine`,
    description: insight.excerpt || 'An insight from HumanxMachine.',
    openGraph: {
      title: insight.title,
      description: insight.excerpt || '',
      images: [{ url: `/insights/${slug}/opengraph-image` }],
    },
    twitter: { card: 'summary_large_image' },
  }
}

function renderBlock(block: any): React.ReactNode { // eslint-disable-line @typescript-eslint/no-explicit-any
  const { type, id } = block
  const value = block[type]

  const richText = (texts: any[]) => // eslint-disable-line @typescript-eslint/no-explicit-any
    texts?.map((t: any, i: number) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      let content: React.ReactNode = t.plain_text
      if (t.annotations?.bold) content = <strong key={i}>{content}</strong>
      if (t.annotations?.italic) content = <em key={i}>{content}</em>
      if (t.annotations?.code) content = <code key={i} className="bg-dark-surface px-1.5 py-0.5 rounded text-orange text-sm font-mono">{content}</code>
      return content
    }) ?? null

  switch (type) {
    case 'paragraph':
      return <p key={id} className="text-[15px] text-[#999] leading-relaxed mb-5">{richText(value.rich_text)}</p>
    case 'heading_1':
      return <h2 key={id} className="font-headline font-bold text-3xl tracking-tight text-white mt-12 mb-4">{richText(value.rich_text)}</h2>
    case 'heading_2':
      return <h3 key={id} className="font-headline font-bold text-2xl tracking-tight text-white mt-10 mb-3">{richText(value.rich_text)}</h3>
    case 'heading_3':
      return <h4 key={id} className="font-headline font-bold text-xl tracking-tight text-white mt-8 mb-2">{richText(value.rich_text)}</h4>
    case 'bulleted_list_item':
      return <li key={id} className="text-[15px] text-[#999] leading-relaxed mb-2 ml-4">{richText(value.rich_text)}</li>
    case 'quote':
      return <blockquote key={id} className="border-l-2 border-orange pl-5 my-6 text-[15px] text-[#777] italic leading-relaxed">{richText(value.rich_text)}</blockquote>
    case 'image': {
      const src = value.type === 'external' ? value.external.url : value.file.url
      return <div key={id} className="my-8 rounded overflow-hidden"><Image src={src} alt="" width={800} height={500} className="w-full object-cover" /></div>
    }
    default:
      return null
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const insight = await getInsight(slug)
  if (!insight) notFound()

  const blocks = await getInsightPageBlocks(insight.id)

  return (
    <main className="bg-black min-h-screen pt-24">
      {insight.coverUrl && (
        <div className="relative overflow-hidden" style={{ height: '50vh', minHeight: '320px' }}>
          <Image src={insight.coverUrl} alt={insight.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
      )}

      <article className="px-6 md:px-10 py-16 max-w-2xl mx-auto">
        <div className="flex gap-2 flex-wrap mb-6">
          {insight.tag.map((t) => (
            <span key={t} className="font-mono text-[8px] tracking-[1.5px] uppercase bg-orange/10 text-orange px-2 py-1 rounded-[2px]">{t}</span>
          ))}
        </div>
        <h1 className="font-headline font-bold tracking-tightest text-white leading-tight mb-4" style={{ fontSize: 'clamp(28px, 4vw, 52px)' }}>
          {insight.title}
        </h1>
        {insight.date && (
          <p className="font-mono text-[10px] tracking-[2px] text-[#444] mb-10">
            {new Date(insight.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
        <div>{blocks.map(renderBlock)}</div>
      </article>
    </main>
  )
}
