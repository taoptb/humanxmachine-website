// src/app/work/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { getWorkProject } from '@/lib/notion'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getWorkProject(slug)
  const title = project?.title ?? 'Work'
  const category = project?.category ?? 'HumanxMachine'

  return new ImageResponse(
    (
      <div style={{ background: '#12120f', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '80px', fontFamily: 'sans-serif' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#ff4d00' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '12px', letterSpacing: '4px', textTransform: 'uppercase', color: '#ff4d00', fontFamily: 'monospace' }}>
            {category}
          </div>
          <div style={{ fontSize: '72px', fontWeight: 800, color: '#fffefd', letterSpacing: '-3px', lineHeight: 1.0, maxWidth: '900px' }}>
            {title}
          </div>
          <div style={{ fontSize: '16px', color: '#555' }}>HumanxMachine</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
