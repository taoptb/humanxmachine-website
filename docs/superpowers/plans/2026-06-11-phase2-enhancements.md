# Phase 2 Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship 8 improvements to the HumanxMachine website: logo fix, footer, about page, 404 page, mobile polish, animation polish, SEO/OG images, and Vercel deployment config.

**Architecture:** Next.js 16 App Router with Tailwind v4 (`@theme` in globals.css — no tailwind.config.ts auto-loading). Animations via GSAP (lazy-loaded with `cancelled` flag pattern). All new components follow the existing `loadGSAP().then(({ gsap }) => { if (cancelled) return; ctx = gsap.context(...) })` pattern. Social icons are inline SVG — no icon library installed.

**Tech Stack:** Next.js 16.2.9, React 19, Tailwind CSS v4, GSAP 3.15, Framer Motion 12, TypeScript, `next/og` for OG images.

---

## File Map

**Created:**
- `src/components/layout/Footer.tsx`
- `src/app/about/page.tsx`
- `src/app/not-found.tsx`
- `src/components/ui/Skeleton.tsx`
- `src/app/work/loading.tsx`
- `src/app/insights/loading.tsx`
- `src/app/courses/loading.tsx`
- `src/app/opengraph-image.tsx`
- `src/app/work/[slug]/opengraph-image.tsx`
- `src/app/insights/[slug]/opengraph-image.tsx`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `vercel.json`

**Modified:**
- `src/components/layout/Nav.tsx` — logo filter + About link
- `src/app/layout.tsx` — add Footer
- `src/app/globals.css` — pixel-pulse keyframe + shimmer keyframe
- `src/components/home/Hero.tsx` — add pixel-pulse class after GSAP entrance
- `src/components/home/Manifesto.tsx` — mobile padding
- `src/components/home/HomeCTA.tsx` — mobile padding
- `src/components/home/Stats.tsx` — mobile font clamp
- `src/components/home/Pillars.tsx` — mobile padding
- `src/components/home/Process.tsx` — mobile padding
- `src/components/work/WorkCard.tsx` — hover overlay enhancement
- `src/components/home/FeaturedWork.tsx` — hover overlay enhancement
- `src/app/page.tsx` — OG metadata
- `src/app/work/page.tsx` — metadata
- `src/app/work/[slug]/page.tsx` — generateMetadata
- `src/app/services/page.tsx` — metadata
- `src/app/courses/page.tsx` — metadata
- `src/app/insights/page.tsx` — metadata
- `src/app/insights/[slug]/page.tsx` — generateMetadata
- `src/app/contact/page.tsx` — metadata
- `src/app/about/page.tsx` — metadata (set at creation)
- `.gitignore` — add `.superpowers/`

---

## Task 1: Logo Visibility Fix

**Files:**
- Modify: `src/components/layout/Nav.tsx`

**Context:** The nav `<Image>` renders `logo-symbol.svg`. If the SVG contains dark paths it is invisible on the `#12120f` background. Adding Tailwind's `brightness-0 invert` filter makes any SVG render white.

- [ ] **Step 1: Open `src/components/layout/Nav.tsx` and update the Image tag**

Find this block (around line 35):
```tsx
        <Link href="/" onClick={() => setOpen(false)}>
          <Image
            src="/logo/logo-symbol.svg"
            alt="HumanxMachine"
            width={140}
            height={32}
            priority
            className="h-7 w-auto"
          />
        </Link>
```

Replace with:
```tsx
        <Link href="/" onClick={() => setOpen(false)}>
          <Image
            src="/logo/logo-symbol.svg"
            alt="HumanxMachine"
            width={140}
            height={32}
            priority
            className="h-8 w-auto brightness-0 invert"
          />
        </Link>
```

- [ ] **Step 2: Verify in browser**

Run: `npm run dev` (if not running). Open `http://localhost:3000`. The logo should now appear white in the top-left of the nav.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Nav.tsx
git commit -m "fix: make nav logo visible on dark background"
```

---

## Task 2: Site Footer

**Files:**
- Create: `src/components/layout/Footer.tsx`
- Modify: `src/app/layout.tsx`

**Context:** The footer uses inline SVG for social icons (no icon library installed). The `logo-text.svg` is the wordmark version. Social platforms: Instagram, LinkedIn, X (Twitter), TikTok.

- [ ] **Step 1: Create `src/components/layout/Footer.tsx`**

```tsx
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
    <footer className="relative bg-[#0e0e0b] border-t border-dark-border overflow-hidden">
      <div className="px-6 md:px-10 py-16" style={{ maxWidth: '1440px', margin: '0 auto' }}>

        {/* Top row — logo + tagline */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-14 pb-10 border-b border-dark-border">
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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-8 border-t border-dark-border">
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
```

- [ ] **Step 2: Add Footer to `src/app/layout.tsx`**

Add the import at the top:
```tsx
import { Footer } from '@/components/layout/Footer'
```

Update the body JSX — add `<Footer />` after `</PageTransition>`:
```tsx
      <body>
        <CustomCursor />
        <Nav />
        <PageTransition>
          {children}
        </PageTransition>
        <Footer />
      </body>
```

- [ ] **Step 3: Verify in browser**

Open `http://localhost:3000`, scroll to the bottom. You should see the footer with logo, 3-column nav grid, social icons, and legal text.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Footer.tsx src/app/layout.tsx
git commit -m "feat: add site footer with nav columns and social links"
```

---

## Task 3: About Page

**Files:**
- Create: `src/app/about/page.tsx`
- Modify: `src/components/layout/Nav.tsx` — add About link

**Context:** 5-section page. Uses `loadGSAP().then(({ gsap }) => { if (cancelled) return; ... })` pattern for all animations (prevents React StrictMode double-invoke bug). Founder names/bios are placeholder — the user fills them in directly in this file.

- [ ] **Step 1: Add About to Nav links**

In `src/components/layout/Nav.tsx`, update `NAV_LINKS`:
```tsx
const NAV_LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'Courses', href: '/courses' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Insights', href: '/insights' },
]
```

- [ ] **Step 2: Create `src/app/about/page.tsx`**

```tsx
// src/app/about/page.tsx
'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { loadGSAP } from '@/lib/animations'
import type { Metadata } from 'next'

// ── FILL IN YOUR DETAILS HERE ──────────────────────────────
const FOUNDER_ONE = {
  initials: 'F1',
  name: 'Founder Name',
  role: 'Brand · Strategy · Vision',
  bio: 'Background in brand building and creative strategy. Spent years in the industry before deciding to build something that moves faster, thinks bigger, and operates at a completely different altitude.',
}

const FOUNDER_TWO = {
  initials: 'F2',
  name: 'Founder Name',
  role: 'Tech · Systems · AI',
  bio: 'Background in technology and systems design. Sees AI not as a trend but as infrastructure — the operating layer for the next generation of businesses and the people who build them.',
}
// ────────────────────────────────────────────────────────────

export default function AboutPage() {
  const heroHeadlineRef = useRef<HTMLHeadingElement>(null)
  const heroSubRef = useRef<HTMLParagraphElement>(null)
  const foundersRef = useRef<HTMLDivElement>(null)
  const philRef = useRef<HTMLDivElement>(null)
  const statementRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    let ctx: any // eslint-disable-line @typescript-eslint/no-explicit-any
    let cancelled = false

    loadGSAP().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return
      ctx = gsap.context(() => {
        // Hero entrance
        gsap.fromTo(heroHeadlineRef.current,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, ease: 'power3.out', delay: 0.2 }
        )
        gsap.fromTo(heroSubRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.6 }
        )

        // Founders scroll reveal
        const cards = foundersRef.current?.querySelectorAll('.founder-card')
        if (cards) {
          gsap.fromTo(Array.from(cards),
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15,
              scrollTrigger: { trigger: foundersRef.current, start: 'top 80%', once: true } }
          )
        }

        // Philosophy scroll reveal
        if (philRef.current) {
          const els = philRef.current.querySelectorAll('.phil-el')
          gsap.fromTo(Array.from(els),
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.12,
              scrollTrigger: { trigger: philRef.current, start: 'top 80%', once: true } }
          )
        }

        // Statement scroll reveal
        if (statementRef.current) {
          gsap.fromTo(statementRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
              scrollTrigger: { trigger: statementRef.current, start: 'top 85%', once: true } }
          )
        }
      })
    })

    return () => { cancelled = true; ctx?.revert() }
  }, [])

  return (
    <main>

      {/* ── Section 01: Hero ── */}
      <section className="relative min-h-[70vh] bg-black flex flex-col justify-end px-6 md:px-10 pb-20 pt-32 overflow-hidden">
        {/* bg grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(255,77,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />

        <div className="relative z-10" style={{ maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
          <p className="font-mono text-[10px] tracking-[3px] text-orange uppercase mb-6">
            01 — Who We Are
          </p>
          <h1
            className="font-headline font-bold leading-[0.95] tracking-tightest text-white mb-8 overflow-hidden"
            style={{ fontSize: 'clamp(36px, 5.5vw, 72px)' }}
          >
            <span ref={heroHeadlineRef} className="block">
              This is the era of<br />
              the <span className="text-orange">solo entrepreneur.</span>
            </span>
          </h1>
          <p
            ref={heroSubRef}
            className="text-[15px] text-[#666] leading-[1.7] max-w-lg opacity-0"
          >
            Two experienced founders who believe the rules have changed.
            You don&apos;t need a big team or large capital to build something
            meaningful — you need the right tools, the right vision, and the
            courage to move.
          </p>
        </div>
      </section>

      {/* ── Section 02: Founders ── */}
      <section ref={foundersRef} className="border-t border-dark-border">
        <div className="grid grid-cols-1 md:grid-cols-2">

          <div className="founder-card bg-black border-b md:border-b-0 md:border-r border-dark-border px-6 md:px-12 py-16 opacity-0">
            <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-8">
              Founder 01
            </p>
            <div className="w-14 h-14 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center font-headline font-bold text-orange text-xl mb-6">
              {FOUNDER_ONE.initials}
            </div>
            <h2 className="font-headline font-bold text-white text-2xl tracking-tight mb-1">
              {FOUNDER_ONE.name}
            </h2>
            <p className="font-mono text-[9px] tracking-[2px] text-[#444] uppercase mb-6">
              {FOUNDER_ONE.role}
            </p>
            <p className="text-[14px] text-[#555] leading-[1.75]">
              {FOUNDER_ONE.bio}
            </p>
          </div>

          <div className="founder-card bg-black px-6 md:px-12 py-16 opacity-0">
            <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-8">
              Founder 02
            </p>
            <div className="w-14 h-14 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center font-headline font-bold text-orange text-xl mb-6">
              {FOUNDER_TWO.initials}
            </div>
            <h2 className="font-headline font-bold text-white text-2xl tracking-tight mb-1">
              {FOUNDER_TWO.name}
            </h2>
            <p className="font-mono text-[9px] tracking-[2px] text-[#444] uppercase mb-6">
              {FOUNDER_TWO.role}
            </p>
            <p className="text-[14px] text-[#555] leading-[1.75]">
              {FOUNDER_TWO.bio}
            </p>
          </div>

        </div>
      </section>

      {/* ── Section 03: Philosophy ── */}
      <section ref={philRef} className="bg-black border-t border-dark-border px-6 md:px-10 py-20 md:py-28">
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <p className="phil-el font-mono text-[9px] tracking-[3px] text-[#444] uppercase mb-12 opacity-0">
            02 — Our Belief
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            <h2
              className="phil-el font-headline font-bold tracking-tighter text-white leading-[1.05] opacity-0"
              style={{ fontSize: 'clamp(28px, 3.5vw, 48px)' }}
            >
              AI doesn&apos;t replace you.<br />
              It <span className="text-orange">completes you.</span>
            </h2>
            <div>
              <p className="phil-el text-[14px] text-[#555] leading-[1.8] mb-8 opacity-0">
                Every founder has gaps — skills they don&apos;t have, capacity they
                can&apos;t afford to hire. AI fills those gaps. It&apos;s a creative director,
                a copywriter, a developer, a researcher, and a strategist —
                available the moment you need it.
              </p>
              <ul className="flex flex-col gap-5">
                {[
                  'The best businesses are built by people who understand leverage — AI is the ultimate lever.',
                  'Speed is a strategy. Moving fast with AI isn\'t reckless — it\'s the new competitive advantage.',
                  'From before impossible to infinite possibilities — that\'s the only direction we move.',
                ].map((belief, i) => (
                  <li key={i} className="phil-el flex gap-4 items-start opacity-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange mt-2 flex-shrink-0" />
                    <p className="text-[13px] text-[#555] leading-[1.7]">{belief}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 04: Statement ── */}
      <section className="bg-orange px-6 md:px-10 py-20 md:py-28">
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <p
            ref={statementRef}
            className="font-headline font-bold text-white leading-[1.05] tracking-tighter opacity-0"
            style={{ fontSize: 'clamp(28px, 4.5vw, 56px)' }}
          >
            You don&apos;t need a bigger team.<br />
            You need better tools.
          </p>
        </div>
      </section>

      {/* ── Section 05: CTA ── */}
      <section className="bg-black border-t border-dark-border px-6 md:px-10 py-20">
        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          style={{ maxWidth: '1440px', margin: '0 auto' }}
        >
          <div>
            <h2
              className="font-headline font-bold text-white tracking-tighter mb-3"
              style={{ fontSize: 'clamp(24px, 3vw, 40px)' }}
            >
              Ready to build something<br />at the edge?
            </h2>
            <p className="text-[14px] text-[#555]">
              Let&apos;s talk about what you&apos;re working on.
            </p>
          </div>
          <Button variant="primary" href="/contact">
            Start a Project →
          </Button>
        </div>
      </section>

    </main>
  )
}
```

- [ ] **Step 3: Verify in browser**

Open `http://localhost:3000/about`. You should see:
- Hero with "This is the era of the solo entrepreneur." with orange accent
- Two founder cards (placeholder names — edit `FOUNDER_ONE` / `FOUNDER_TWO` at the top of the file)
- Philosophy section with belief bullets
- Orange statement block
- CTA section
- "About" link in the nav

- [ ] **Step 4: Commit**

```bash
git add src/app/about/page.tsx src/components/layout/Nav.tsx
git commit -m "feat: add About page and nav link"
```

---

## Task 4: Branded 404 Page

**Files:**
- Create: `src/app/not-found.tsx`

**Context:** Next.js App Router automatically renders `app/not-found.tsx` for any unmatched route. It receives the default layout (Nav + Footer).

- [ ] **Step 1: Create `src/app/not-found.tsx`**

```tsx
// src/app/not-found.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { PixelIcon } from '@/components/ui/PixelIcon'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">

      <div className="opacity-20 mb-10">
        <PixelIcon name="x" size={16} />
      </div>

      <p className="font-mono text-[9px] tracking-[4px] text-orange uppercase mb-6">
        404 — Not Found
      </p>

      <h1
        className="font-headline font-bold text-white leading-none tracking-tightest mb-6"
        style={{
          fontSize: 'clamp(80px, 18vw, 200px)',
          color: '#1a1a17',
          WebkitTextStroke: '1px #2a2a27',
        }}
      >
        404
      </h1>

      <h2 className="font-headline font-bold text-white text-2xl tracking-tight mb-4">
        This page doesn&apos;t exist.
      </h2>
      <p className="text-[14px] text-[#444] mb-10 max-w-sm">
        The link might be broken, or the page may have moved.
      </p>

      <div className="flex gap-3 flex-wrap justify-center">
        <Button variant="primary" href="/">
          Back to Home
        </Button>
        <Button variant="ghost" href="/work">
          See Our Work
        </Button>
      </div>

    </main>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:3000/this-does-not-exist`. You should see the branded 404 page with the large outlined "404", pixel X icon, and two buttons.

- [ ] **Step 3: Commit**

```bash
git add src/app/not-found.tsx
git commit -m "feat: add branded 404 page"
```

---

## Task 5: Mobile Polish Pass

**Files:**
- Modify: `src/components/home/Hero.tsx`
- Modify: `src/components/home/Manifesto.tsx`
- Modify: `src/components/home/Pillars.tsx`
- Modify: `src/components/home/Process.tsx`
- Modify: `src/components/home/HomeCTA.tsx`
- Modify: `src/components/home/Stats.tsx`

**Context:** Test at 375px. Tailwind v4 responsive prefixes (`md:`, `lg:`) work the same as v3. The existing `px-10` on most sections is ~40px which is too tight on a 375px screen. Replace with `px-6 md:px-10`.

- [ ] **Step 1: Fix Hero.tsx padding**

In `src/components/home/Hero.tsx`, find the `<section>` opening tag:
```tsx
    <section className="relative min-h-screen bg-black flex flex-col justify-end px-10 pb-20 pt-32 overflow-hidden">
```
Replace with:
```tsx
    <section className="relative min-h-screen bg-black flex flex-col justify-end px-6 md:px-10 pb-16 md:pb-20 pt-28 md:pt-32 overflow-hidden">
```

- [ ] **Step 2: Fix Manifesto.tsx padding**

In `src/components/home/Manifesto.tsx`, find the `<section>` opening tag:
```tsx
    <section className="bg-black border-t border-dark-border px-10 py-28">
```
Replace with:
```tsx
    <section className="bg-black border-t border-dark-border px-6 md:px-10 py-16 md:py-28">
```

- [ ] **Step 3: Fix Pillars.tsx padding**

In `src/components/home/Pillars.tsx`, find the dark pillar div (the one with `ref={leftRef}`):
```tsx
      <div
        ref={leftRef}
        className="bg-black border-r border-dark-border px-12 py-20 relative overflow-hidden opacity-0"
      >
```
Replace with:
```tsx
      <div
        ref={leftRef}
        className="bg-black border-b md:border-b-0 md:border-r border-dark-border px-6 md:px-12 py-14 md:py-20 relative overflow-hidden opacity-0"
      >
```

Also find the light pillar div:
```tsx
      <div className="bg-[#f5f5f2] px-12 py-20 relative overflow-hidden">
```
Replace with:
```tsx
      <div className="bg-[#f5f5f2] px-6 md:px-12 py-14 md:py-20 relative overflow-hidden">
```

- [ ] **Step 4: Fix Process.tsx padding**

In `src/components/home/Process.tsx`, find the `<section>` opening tag:
```tsx
    <section ref={sectionRef} className="bg-black border-t border-dark-border px-10 py-24">
```
Replace with:
```tsx
    <section ref={sectionRef} className="bg-black border-t border-dark-border px-6 md:px-10 py-16 md:py-24">
```

Also find the steps grid:
```tsx
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
```
Replace with:
```tsx
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
```

- [ ] **Step 5: Fix HomeCTA.tsx padding**

In `src/components/home/HomeCTA.tsx`, find the `<section>` opening tag:
```tsx
      className="bg-black border-t border-dark-border px-10 py-28 text-center"
```
Replace with:
```tsx
      className="bg-black border-t border-dark-border px-6 md:px-10 py-16 md:py-28 text-center"
```

- [ ] **Step 6: Fix Stats.tsx font clamp**

In `src/components/home/Stats.tsx`, find the stat number span:
```tsx
            style={{ fontSize: 'clamp(56px, 8vw, 96px)', letterSpacing: '-4px' }}
```
Replace with:
```tsx
            style={{ fontSize: 'clamp(40px, 8vw, 96px)', letterSpacing: '-3px' }}
```

- [ ] **Step 7: Verify on mobile viewport**

In browser DevTools, set viewport to 375×812. Check homepage scrolling through all sections — text should be readable with comfortable padding on all sections.

- [ ] **Step 8: Commit**

```bash
git add src/components/home/Hero.tsx src/components/home/Manifesto.tsx src/components/home/Pillars.tsx src/components/home/Process.tsx src/components/home/HomeCTA.tsx src/components/home/Stats.tsx
git commit -m "fix: mobile padding and font-size polish across home sections"
```

---

## Task 6: Animation & Polish

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/home/Hero.tsx`
- Modify: `src/components/work/WorkCard.tsx`
- Modify: `src/components/home/FeaturedWork.tsx`
- Create: `src/components/ui/Skeleton.tsx`
- Create: `src/app/work/loading.tsx`
- Create: `src/app/insights/loading.tsx`
- Create: `src/app/courses/loading.tsx`

- [ ] **Step 1: Add keyframes to `src/app/globals.css`**

Append to `src/app/globals.css`:
```css
/* Pixel icon pulse — applied after GSAP entrance completes */
@keyframes pixel-pulse {
  0%, 100% { opacity: 0.12; transform: scale(1); }
  50% { opacity: 0.18; transform: scale(1.04); }
}
.pixel-pulse {
  animation: pixel-pulse 4s ease-in-out infinite;
}

/* Skeleton shimmer */
@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.skeleton {
  background: linear-gradient(90deg, #1a1a17 25%, #2a2a27 50%, #1a1a17 75%);
  background-size: 800px 100%;
  animation: shimmer 1.6s infinite linear;
  border-radius: 4px;
}
```

- [ ] **Step 2: Add pixel-pulse to Hero after GSAP entrance**

In `src/components/home/Hero.tsx`, inside the `loadGSAP().then` block, after the timeline's last `.fromTo`, add a callback to apply the CSS class:

Find the animation for `hintRef` (the last animation):
```tsx
          .fromTo(hintRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power3.out' }, 1.4)
```

Add after the closing `})` of `ctx = gsap.context(() => {`:
```tsx
      // Add pulse CSS class after entrance animation completes (at ~2.4s)
      setTimeout(() => {
        if (!cancelled && pixelRef.current) {
          pixelRef.current.classList.add('pixel-pulse')
        }
      }, 2400)
```

The full `loadGSAP().then` block should look like:
```tsx
    loadGSAP().then(({ gsap }) => {
      if (cancelled) return

      ctx = gsap.context(() => {
        const tl = gsap.timeline()

        gsap.fromTo(
          pixelRef.current,
          { opacity: 0, scale: 0.8, rotation: -5 },
          { opacity: 0.12, scale: 1, rotation: 0, duration: 1.2, delay: 0.8, ease: 'power3.out' }
        )

        tl.fromTo(eyebrowRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.3)
          .fromTo(line1Ref.current, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'power3.out' }, 0.4)
          .fromTo(line2Ref.current, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'power3.out' }, 0.55)
          .fromTo(subRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.9)
          .fromTo(actionsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 1.1)
          .fromTo(hintRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power3.out' }, 1.4)
      })

      // Add pulse CSS class after entrance animation completes
      setTimeout(() => {
        if (!cancelled && pixelRef.current) {
          pixelRef.current.classList.add('pixel-pulse')
        }
      }, 2400)
    })
```

- [ ] **Step 3: Enhance WorkCard hover overlay**

`WorkCard.tsx` already has a good hover state. Add a centered "View Project" text overlay. In `src/components/work/WorkCard.tsx`, inside the `<div className="relative overflow-hidden">` block, add this after the existing gradient overlay div:

Find:
```tsx
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />
        <div className="absolute top-4 right-4 w-8 h-8 bg-orange rounded-[2px] flex items-center justify-center text-white text-sm font-bold opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300">
          ↗
        </div>
```

Replace with:
```tsx
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />
        {/* Center "View Project" label on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="font-mono text-[10px] tracking-[2px] text-white uppercase bg-black/50 px-4 py-2 rounded-[2px] backdrop-blur-sm">
            View Project →
          </span>
        </div>
        <div className="absolute top-4 right-4 w-8 h-8 bg-orange rounded-[2px] flex items-center justify-center text-white text-sm font-bold opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300">
          ↗
        </div>
```

- [ ] **Step 4: Create `src/components/ui/Skeleton.tsx`**

```tsx
// src/components/ui/Skeleton.tsx
interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />
}
```

- [ ] **Step 5: Create `src/app/work/loading.tsx`**

```tsx
// src/app/work/loading.tsx
import { Skeleton } from '@/components/ui/Skeleton'

export default function WorkLoading() {
  return (
    <main className="bg-black min-h-screen pt-24 px-6 md:px-10 pb-20">
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <Skeleton className="h-3 w-24 mb-4" />
        <Skeleton className="h-14 w-48 mb-3" />
        <Skeleton className="h-4 w-64 mb-12" />
        {/* Filter bar skeleton */}
        <div className="flex gap-3 mb-10 flex-wrap">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-28" />
          ))}
        </div>
        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 w-full" />
          ))}
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 6: Create `src/app/insights/loading.tsx`**

```tsx
// src/app/insights/loading.tsx
import { Skeleton } from '@/components/ui/Skeleton'

export default function InsightsLoading() {
  return (
    <main className="bg-black min-h-screen pt-24 px-6 md:px-10 pb-20">
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <Skeleton className="h-3 w-24 mb-4" />
        <Skeleton className="h-14 w-40 mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 7: Create `src/app/courses/loading.tsx`**

```tsx
// src/app/courses/loading.tsx
import { Skeleton } from '@/components/ui/Skeleton'

export default function CoursesLoading() {
  return (
    <main className="bg-black min-h-screen pt-24 px-6 md:px-10 pb-20">
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <Skeleton className="h-3 w-16 mb-4" />
        <Skeleton className="h-14 w-44 mb-3" />
        <Skeleton className="h-4 w-80 mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-dark-border rounded overflow-hidden">
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="p-6 flex flex-col gap-3">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 8: Verify**

Open `http://localhost:3000/work` — hover over a work card, should show "View Project →" overlay. Visit `http://localhost:3000` and wait ~2.4s — the pixel face icon on the hero should subtly pulse.

- [ ] **Step 9: Commit**

```bash
git add src/app/globals.css src/components/home/Hero.tsx src/components/work/WorkCard.tsx src/components/ui/Skeleton.tsx src/app/work/loading.tsx src/app/insights/loading.tsx src/app/courses/loading.tsx
git commit -m "feat: add pixel pulse animation, work card hover overlay, and loading skeletons"
```

---

## Task 7: SEO + OG Images

**Files:**
- Modify: `src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/work/page.tsx`, `src/app/work/[slug]/page.tsx`, `src/app/services/page.tsx`, `src/app/courses/page.tsx`, `src/app/insights/page.tsx`, `src/app/insights/[slug]/page.tsx`, `src/app/contact/page.tsx`
- Create: `src/app/opengraph-image.tsx`, `src/app/work/[slug]/opengraph-image.tsx`, `src/app/insights/[slug]/opengraph-image.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`

**Context:** Next.js 16 App Router uses `next/og`'s `ImageResponse` for OG images. Static pages use `export const metadata`. Dynamic pages use `export async function generateMetadata()`. The `about/page.tsx` is a `'use client'` component — its metadata must be defined separately in a parent layout or a sibling `metadata.ts` file. Since about is a client component, add a `src/app/about/metadata.ts` file instead.

- [ ] **Step 1: Add metadata to static pages**

**`src/app/page.tsx`** — update existing metadata export:
```tsx
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
```

**`src/app/work/page.tsx`** — add at top (after imports):
```tsx
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Work — HumanxMachine',
  description: 'Selected work: business creation, creative production, and original IP — all powered by AI.',
  openGraph: { title: 'Work — HumanxMachine', description: 'Selected work powered by AI.', images: [{ url: '/opengraph-image' }] },
  twitter: { card: 'summary_large_image' },
}
```

**`src/app/services/page.tsx`** — add at top:
```tsx
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Services — HumanxMachine',
  description: 'Business Creation and Creative Production services — from zero to brand, from idea to distribution.',
  openGraph: { title: 'Services — HumanxMachine', description: 'Business Creation & Creative Production powered by AI.', images: [{ url: '/opengraph-image' }] },
  twitter: { card: 'summary_large_image' },
}
```

**`src/app/courses/page.tsx`** — add at top:
```tsx
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Courses — HumanxMachine',
  description: 'Learn the systems we use every day — brand building, content production, and AI workflows.',
  openGraph: { title: 'Courses — HumanxMachine', description: 'Learn brand, content, and AI systems.', images: [{ url: '/opengraph-image' }] },
  twitter: { card: 'summary_large_image' },
}
```

**`src/app/insights/page.tsx`** — add at top:
```tsx
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Insights — HumanxMachine',
  description: 'Perspectives on brand, culture, AI, and the future of creative business.',
  openGraph: { title: 'Insights — HumanxMachine', description: 'Perspectives on brand, culture, and AI.', images: [{ url: '/opengraph-image' }] },
  twitter: { card: 'summary_large_image' },
}
```

**`src/app/contact/page.tsx`** — add at top:
```tsx
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Start a Project — HumanxMachine',
  description: 'Tell us what you\'re building. We read every submission and reply within 24 hours.',
  openGraph: { title: 'Start a Project — HumanxMachine', description: 'Let\'s build something at the edge.', images: [{ url: '/opengraph-image' }] },
  twitter: { card: 'summary_large_image' },
}
```

- [ ] **Step 2: Create `src/app/about/metadata.ts`**

Since `about/page.tsx` is `'use client'`, export metadata separately:
```ts
// src/app/about/metadata.ts
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'About — HumanxMachine',
  description: 'Two experienced founders. One belief: this is the era of the solo entrepreneur.',
  openGraph: { title: 'About — HumanxMachine', description: 'The story behind HumanxMachine.', images: [{ url: '/opengraph-image' }] },
  twitter: { card: 'summary_large_image' },
}
```

Then create `src/app/about/layout.tsx` to export it:
```tsx
// src/app/about/layout.tsx
export { metadata } from './metadata'
export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 3: Add `generateMetadata` to dynamic routes**

**`src/app/work/[slug]/page.tsx`** — add after imports:
```tsx
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = await getWorkProject(slug)
  if (!project) return { title: 'Work — HumanxMachine' }
  return {
    title: `${project.title} — HumanxMachine`,
    description: project.description || `${project.category} project by HumanxMachine.`,
    openGraph: {
      title: project.title,
      description: project.description || '',
      images: [{ url: `/work/${slug}/opengraph-image` }],
    },
    twitter: { card: 'summary_large_image' },
  }
}
```

**`src/app/insights/[slug]/page.tsx`** — add after imports:
```tsx
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const insight = await getInsight(slug)
  if (!insight) return { title: 'Insights — HumanxMachine' }
  return {
    title: `${insight.title} — HumanxMachine`,
    description: insight.excerpt || 'An insight from HumanxMachine.',
    openGraph: {
      title: insight.title,
      description: insight.excerpt || '',
      images: [{ url: `/insights/${slug}/opengraph-image` }],
    },
    twitter: { card: 'summary_large_image' },
  }
}
```

- [ ] **Step 4: Create root OG image `src/app/opengraph-image.tsx`**

```tsx
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
        {/* Orange accent bar */}
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
```

- [ ] **Step 5: Create dynamic OG for work slugs `src/app/work/[slug]/opengraph-image.tsx`**

```tsx
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
```

- [ ] **Step 6: Create dynamic OG for insights slugs `src/app/insights/[slug]/opengraph-image.tsx`**

```tsx
// src/app/insights/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'
import { getInsight } from '@/lib/notion'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const insight = await getInsight(slug)
  const title = insight?.title ?? 'Insights'
  const excerpt = insight?.excerpt ?? 'HumanxMachine'

  return new ImageResponse(
    (
      <div style={{ background: '#12120f', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '80px', fontFamily: 'sans-serif' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: '#ff4d00' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '12px', letterSpacing: '4px', textTransform: 'uppercase', color: '#ff4d00', fontFamily: 'monospace' }}>
            INSIGHTS
          </div>
          <div style={{ fontSize: '60px', fontWeight: 800, color: '#fffefd', letterSpacing: '-2px', lineHeight: 1.05, maxWidth: '900px' }}>
            {title}
          </div>
          <div style={{ fontSize: '18px', color: '#555', maxWidth: '700px' }}>{excerpt}</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
```

- [ ] **Step 7: Create `src/app/sitemap.ts`**

```ts
// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { getWorkProjects, getInsights } from '@/lib/notion'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://humanxmachine.com'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/work`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/courses`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/insights`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  try {
    const [projects, insights] = await Promise.all([getWorkProjects(), getInsights()])
    const workRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
      url: `${baseUrl}/work/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))
    const insightRoutes: MetadataRoute.Sitemap = insights.map((i) => ({
      url: `${baseUrl}/insights/${i.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
    return [...staticRoutes, ...workRoutes, ...insightRoutes]
  } catch {
    return staticRoutes
  }
}
```

- [ ] **Step 8: Create `src/app/robots.ts`**

```ts
// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://humanxmachine.com'
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

- [ ] **Step 9: Add `NEXT_PUBLIC_SITE_URL` to `.env.local`**

Open `.env.local` and add:
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
(Change to your real domain before deploying.)

- [ ] **Step 10: Verify build**

```bash
npm run build
```

Expected: Build completes with no errors. OG image routes appear in the build output.

- [ ] **Step 11: Commit**

```bash
git add src/app/opengraph-image.tsx src/app/work/[slug]/opengraph-image.tsx src/app/insights/[slug]/opengraph-image.tsx src/app/sitemap.ts src/app/robots.ts src/app/about/metadata.ts src/app/about/layout.tsx src/app/page.tsx src/app/work/page.tsx src/app/services/page.tsx src/app/courses/page.tsx src/app/insights/page.tsx src/app/contact/page.tsx src/app/work/[slug]/page.tsx src/app/insights/[slug]/page.tsx .env.local
git commit -m "feat: add per-page SEO metadata, OG images, sitemap, and robots.txt"
```

---

## Task 8: Vercel Deployment Config

**Files:**
- Create: `vercel.json`
- Modify: `.gitignore`

- [ ] **Step 1: Create `vercel.json`**

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

- [ ] **Step 2: Update `.gitignore`**

Add at the end of `.gitignore`:
```
# Visual companion brainstorm sessions
.superpowers/
```

(`.env.local` should already be in `.gitignore` from the Next.js scaffold — verify it's there.)

- [ ] **Step 3: Final commit**

```bash
git add vercel.json .gitignore
git commit -m "chore: add Vercel config and gitignore update"
```

- [ ] **Step 4: Push to GitHub**

```bash
# If you don't have a remote yet:
git remote add origin https://github.com/YOUR_USERNAME/humanxmachine-website.git
git branch -M main
git push -u origin main
```

- [ ] **Step 5: Deploy on Vercel**

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repo
3. Framework: Next.js (auto-detected)
4. Under **Environment Variables**, add all 5:
   ```
   NOTION_TOKEN          = secret_xxxx
   NOTION_WORK_DB        = your-db-id
   NOTION_INSIGHTS_DB    = your-db-id
   NOTION_COURSES_DB     = your-db-id
   NOTION_CONTACTS_DB    = your-db-id
   NEXT_PUBLIC_SITE_URL  = https://your-domain.vercel.app
   ```
5. Click **Deploy**
6. Once live, update `NEXT_PUBLIC_SITE_URL` to your final domain

---

## Self-Review Checklist

- [x] **Spec coverage:** All 8 spec items have tasks. Logo fix ✓, Footer ✓, About ✓, 404 ✓, Mobile ✓, Animations ✓, SEO/OG ✓, Deploy ✓
- [x] **Placeholder scan:** No TBD/TODO in implementation steps. Founder names are intentionally user-editable constants at top of `about/page.tsx`
- [x] **Type consistency:** `getWorkProject(slug)` and `getInsight(slug)` used consistently — matches `src/lib/notion.ts` exports. `WorkProject` and `Insight` types referenced correctly
- [x] **Client component metadata:** `about/page.tsx` is `'use client'` — metadata extracted to `about/layout.tsx` + `about/metadata.ts` pattern
- [x] **GSAP pattern:** All new GSAP uses `loadGSAP().then(({ gsap }) => { if (cancelled) return; ctx = gsap.context(...) })` — matches the fixed pattern
