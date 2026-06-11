// src/app/layout.tsx
import type { Metadata } from 'next'
import { Space_Grotesk, DM_Sans } from 'next/font/google'
import { Nav } from '@/components/layout/Nav'
import { CustomCursor } from '@/components/layout/CustomCursor'
import { PageTransition } from '@/components/layout/PageTransition'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'HumanxMachine — Creative Studio',
  description:
    'A creative studio at the intersection of brand, culture, and emerging technology. Business Creation. Creative Production. All powered by AI.',
  openGraph: {
    title: 'HumanxMachine',
    description: 'Brand. Culture. Emerging Tech.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
      <body>
        <CustomCursor />
        <Nav />
        <PageTransition>
          {children}
        </PageTransition>
        <Footer />
      </body>
    </html>
  )
}
