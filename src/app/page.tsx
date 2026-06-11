import type { Metadata } from 'next'
import { Hero } from '@/components/home/Hero'
import { Manifesto } from '@/components/home/Manifesto'
import { Pillars } from '@/components/home/Pillars'
import { FeaturedWork } from '@/components/home/FeaturedWork'
import { Process } from '@/components/home/Process'
import { Stats } from '@/components/home/Stats'
import { HomeCTA } from '@/components/home/HomeCTA'
import { getFeaturedWork } from '@/lib/notion'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'HumanxMachine — Creative Studio',
  description: 'A creative studio at the intersection of brand, culture, and emerging technology. Business Creation. Creative Production. All powered by AI.',
  openGraph: {
    title: 'HumanxMachine — Creative Studio',
    description: 'Brand. Culture. Emerging Tech.',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
}

export default async function Home() {
  const featuredWork = await getFeaturedWork()

  return (
    <main>
      <Hero />
      <Manifesto />
      <Pillars />
      <FeaturedWork projects={featuredWork} />
      <Process />
      <Stats />
      <HomeCTA />
    </main>
  )
}
