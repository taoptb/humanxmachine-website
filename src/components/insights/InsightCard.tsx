import Image from 'next/image'
import Link from 'next/link'
import type { Insight } from '@/types'

export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <Link href={`/insights/${insight.slug}`} className="group block bg-dark-surface border border-dark-border rounded overflow-hidden hover:border-orange/30 transition-colors">
      <div className="relative h-44 overflow-hidden">
        {insight.coverUrl ? (
          <Image src={insight.coverUrl} alt={insight.title} fill className="object-cover group-hover:scale-[1.04] transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-dark-border" />
        )}
      </div>
      <div className="p-5">
        <div className="flex gap-2 flex-wrap mb-3">
          {insight.tag.slice(0, 2).map((t) => (
            <span key={t} className="font-mono text-[8px] tracking-[1.5px] uppercase bg-orange/10 text-orange px-2 py-1 rounded-[2px]">{t}</span>
          ))}
        </div>
        <h3 className="font-headline font-bold text-white text-base tracking-tight leading-snug mb-2 group-hover:text-orange transition-colors">
          {insight.title}
        </h3>
        <p className="text-[12px] text-[#555] leading-relaxed line-clamp-2">{insight.excerpt}</p>
        {insight.date && (
          <p className="font-mono text-[9px] tracking-[1px] text-[#333] mt-3">
            {new Date(insight.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        )}
      </div>
    </Link>
  )
}
