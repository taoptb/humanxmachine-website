import { Hero } from '@/components/home/Hero'
import { Manifesto } from '@/components/home/Manifesto'
import { Pillars } from '@/components/home/Pillars'
import { FeaturedWork } from '@/components/home/FeaturedWork'
import { Process } from '@/components/home/Process'
import { Stats } from '@/components/home/Stats'
import { HomeCTA } from '@/components/home/HomeCTA'
import { getFeaturedWork } from '@/lib/notion'

export const revalidate = 3600

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
