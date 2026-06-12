// src/components/layout/Footer.tsx
import Link from 'next/link'
import Image from 'next/image'
import { PixelIcon } from '@/components/ui/PixelIcon'

const STUDIO_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
]

const LEARN_LINKS = [
  { label: 'Courses', href: '/courses' },
  { label: 'Insights', href: '/insights' },
]

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/humanxmachine',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/humanxmachine',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: 'X',
    href: 'https://x.com/humanxmachine',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@humanxmachine',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.53V6.78a4.85 4.85 0 01-1.01-.09z"/>
      </svg>
    ),
  },
]

export function Footer() {
  return (
    <footer className="relative bg-[#0e0e0b] border-t border-[#2a2a27] overflow-hidden">
      <div className="px-6 md:px-10 py-16" style={{ maxWidth: '1440px', margin: '0 auto' }}>

        {/* Top row — logo + tagline */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-14 pb-10 border-b border-[#2a2a27]">
          <Link href="/">
            <Image
              src="/logo/logo-text.svg"
              alt="HumanxMachine"
              width={180}
              height={28}
              className="h-6 w-auto brightness-0 invert opacity-70 hover:opacity-100 transition-opacity"
            />
          </Link>
          <p className="font-mono text-[10px] tracking-[3px] text-orange uppercase">
            Brand · Culture · Emerging Tech
          </p>
        </div>

        {/* Middle grid — nav columns + social */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">

          <div>
            <p className="font-mono text-[9px] tracking-[2px] text-[#444] uppercase mb-5">Studio</p>
            <ul className="flex flex-col gap-3">
              {STUDIO_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-[#555] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[9px] tracking-[2px] text-[#444] uppercase mb-5">Learn</p>
            <ul className="flex flex-col gap-3">
              {LEARN_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-[#555] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[9px] tracking-[2px] text-[#444] uppercase mb-5">Connect</p>
            <Link
              href="/contact"
              className="text-[13px] text-[#555] hover:text-white transition-colors block mb-6"
            >
              Contact
            </Link>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-[#444] hover:text-white transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom row — legal */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-8 border-t border-[#2a2a27]">
          <p className="font-mono text-[10px] text-[#333]">
            © 2026 HumanxMachine. All rights reserved.
          </p>
          <p className="font-mono text-[10px] text-[#333]">
            Built with AI. Powered by purpose.
          </p>
          <p className="font-mono text-[10px] text-[#333]">
            Privacy · Terms
          </p>
        </div>

      </div>

      {/* Pixel decoration */}
      <div className="absolute bottom-8 right-10 pointer-events-none">
        <PixelIcon name="plus" size={8} opacity={0.04} />
      </div>
    </footer>
  )
}
