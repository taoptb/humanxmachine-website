import { Hero } from '@/components/home/Hero'
import { Manifesto } from '@/components/home/Manifesto'
import { Pillars } from '@/components/home/Pillars'
import { FeaturedWork } from '@/components/home/FeaturedWork'
import { Process } from '@/components/home/Process'
import { Stats } from '@/components/home/Stats'
import { HomeCTA } from '@/components/home/HomeCTA'

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Pillars />
      <FeaturedWork />
      <Process />
      <Stats />
      <HomeCTA />
    </main>
  )
}
