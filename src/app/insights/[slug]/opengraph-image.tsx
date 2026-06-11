// src/app/insights/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { getInsight } from '@/lib/notion'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const insight = await getInsight(slug)
  const title = insight?.title ?? 'Insights'
  const excerpt = insight?.excerpt ?? 'HumanxMachine'

  return new ImageResponse(
    (
      <div style={{ background: '#12120f', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '80px', fontFamily: 'sans-serif' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#ff4d00' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '12px', letterSpacing: '4px', textTransform: 'uppercase', color: '#ff4d00', fontFamily: 'monospace' }}>
            INSIGHTS
          </div>
          <div style={{ fontSize: '60px', fontWeight: 800, color: '#fffefd', letterSpacing: '-2px', lineHeight: 1.05, maxWidth: '900px' }}>
            {title}
          </div>
          <div style={{ fontSize: '18px', color: '#555', maxWidth: '700px' }}>{excerpt}</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
