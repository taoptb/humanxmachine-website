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

function toYouTubeEmbed(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

function toVimeoEmbed(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match ? `https://player.vimeo.com/video/${match[1]}` : null
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
      if (t.href) content = <a key={i} href={t.href} target="_blank" rel="noopener noreferrer" className="text-orange underline underline-offset-2 hover:text-orange/70 transition-colors">{content}</a>
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
      return <li key={id} className="text-[15px] text-[#999] leading-relaxed mb-2 ml-4 list-disc">{richText(value.rich_text)}</li>
    case 'numbered_list_item':
      return <li key={id} className="text-[15px] text-[#999] leading-relaxed mb-2 ml-4 list-decimal">{richText(value.rich_text)}</li>
    case 'quote':
      return <blockquote key={id} className="border-l-2 border-orange pl-5 my-6 text-[15px] text-[#777] italic leading-relaxed">{richText(value.rich_text)}</blockquote>
    case 'divider':
      return <hr key={id} className="border-dark-border my-10" />
    case 'code':
      return (
        <pre key={id} className="bg-dark-surface border border-dark-border rounded p-5 my-6 overflow-x-auto">
          <code className="text-[13px] text-orange font-mono leading-relaxed">{value.rich_text?.[0]?.plain_text ?? ''}</code>
        </pre>
      )
    case 'image': {
      const src = value.type === 'external' ? value.external.url : value.file.url
      const caption = value.caption?.[0]?.plain_text
      return (
        <figure key={id} className="my-8">
          <div className="rounded overflow-hidden">
            <Image src={src} alt={caption ?? ''} width={800} height={500} className="w-full object-cover" />
          </div>
          {caption && <figcaption className="text-center text-[12px] text-[#555] mt-3 font-mono tracking-wide">{caption}</figcaption>}
        </figure>
      )
    }
    case 'video': {
      const url = value.type === 'external' ? value.external.url : value.file?.url ?? ''
      const youtubeEmbed = toYouTubeEmbed(url)
      const vimeoEmbed = toVimeoEmbed(url)
      const embedSrc = youtubeEmbed ?? vimeoEmbed
      if (embedSrc) {
        return (
          <div key={id} className="my-8 aspect-video rounded overflow-hidden">
            <iframe src={embedSrc} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        )
      }
      return <video key={id} src={url} controls className="w-full rounded my-8" />
    }
    case 'embed': {
      const url = value.url ?? ''
      const youtubeEmbed = toYouTubeEmbed(url)
      const vimeoEmbed = toVimeoEmbed(url)
      const embedSrc = youtubeEmbed ?? vimeoEmbed
      if (embedSrc) {
        return (
          <div key={id} className="my-8 aspect-video rounded overflow-hidden">
            <iframe src={embedSrc} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        )
      }
      return (
        <div key={id} className="my-6 border border-dark-border rounded p-4 text-[13px] text-[#555]">
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-orange underline break-all">{url}</a>
        </div>
      )
    }
    case 'bookmark': {
      const url = value.url ?? ''
      const caption = value.caption?.[0]?.plain_text
      return (
        <a
          key={id}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 border border-dark-border rounded p-4 my-6 hover:border-orange/40 transition-colors group"
        >
          <div className="min-w-0 flex-1">
            <p className="text-[13px] text-white font-medium truncate group-hover:text-orange transition-colors">
              {caption || url}
            </p>
            <p className="text-[11px] text-[#555] truncate mt-0.5">{url}</p>
          </div>
          <span className="text-[#555] text-lg flex-shrink-0">→</span>
        </a>
      )
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
