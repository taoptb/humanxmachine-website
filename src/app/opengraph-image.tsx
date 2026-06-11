// src/app/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'HumanxMachine — Creative Studio'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#12120f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#ff4d00' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '13px', letterSpacing: '4px', textTransform: 'uppercase', color: '#ff4d00', fontFamily: 'monospace' }}>
            HUMANXMACHINE
          </div>
          <div style={{ fontSize: '64px', fontWeight: 800, color: '#fffefd', letterSpacing: '-3px', lineHeight: 1.0 }}>
            Brand. Culture.<br />Emerging Tech.
          </div>
          <div style={{ fontSize: '18px', color: '#555', letterSpacing: '-0.5px' }}>
            Creative Studio · Business Creation · AI-Powered Production
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
