// src/app/about/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — HumanxMachine',
  description: 'Two experienced founders. One belief: this is the era of the solo entrepreneur.',
  openGraph: {
    title: 'About — HumanxMachine',
    description: 'The story behind HumanxMachine.',
    images: [{ url: '/opengraph-image' }],
  },
  twitter: { card: 'summary_large_image' },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
