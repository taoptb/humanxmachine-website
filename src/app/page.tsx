import { Hero } from '@/components/home/Hero'
import { Manifesto } from '@/components/home/Manifesto'
import { Pillars } from '@/components/home/Pillars'
import { FeaturedWork } from '@/components/home/FeaturedWork'

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Pillars />
      <FeaturedWork />
    </main>
  )
}
