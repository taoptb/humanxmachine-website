import { ContactForm } from '@/components/contact/ContactForm'
import { PixelIcon } from '@/components/ui/PixelIcon'

export default function ContactPage() {
  return (
    <main className="bg-black min-h-screen pt-24 px-6 md:px-10 pb-20 relative overflow-hidden">
      <div className="absolute top-32 right-10 opacity-[0.06]">
        <PixelIcon name="face" size={16} />
      </div>

      <div className="max-w-2xl mx-auto">
        <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-4">Get in touch</p>
        <h1 className="font-headline font-bold tracking-tightest text-white leading-none mb-4" style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}>
          Start a<br />Project
        </h1>
        <p className="text-[15px] text-[#555] leading-relaxed mb-16 max-w-md">
          Tell us what you&apos;re building. We read every submission and reply within 24 hours.
        </p>

        <ContactForm />
      </div>
    </main>
  )
}
