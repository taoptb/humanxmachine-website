# HumanxMachine — Foundation + Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap a Next.js 14 project with full brand design system, sticky navigation, and complete homepage with cinematic scroll-driven animations.

**Architecture:** Next.js 14 App Router with Tailwind CSS for styling. GSAP ScrollTrigger handles all scroll-driven animations server-side-safe via `useEffect` + dynamic import. Design tokens live in `tailwind.config.ts` and CSS custom properties. Pixel icons are inline SVG components.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, GSAP + ScrollTrigger, Framer Motion, Space Grotesk + DM Sans (Google Fonts)

**Spec:** `docs/superpowers/specs/2026-06-10-humanxmachine-website-design.md`

---

## File Map

```
Website/
├── src/
│   ├── app/
│   │   ├── layout.tsx               root layout, fonts, metadata, cursor
│   │   ├── page.tsx                 homepage (composes all home/* sections)
│   │   └── globals.css              Tailwind base + CSS custom properties
│   ├── components/
│   │   ├── ui/
│   │   │   ├── PixelIcon.tsx        pixel SVG symbol system (Face, X, Heart, Plus)
│   │   │   ├── Button.tsx           Primary / Ghost / CTA button variants
│   │   │   └── Tag.tsx              filled / outline-dark / outline-light tag
│   │   ├── layout/
│   │   │   ├── Nav.tsx              sticky navigation bar
│   │   │   └── CustomCursor.tsx     dot cursor with hover expand effect
│   │   └── home/
│   │       ├── Hero.tsx             hero section with GSAP load animations
│   │       ├── Manifesto.tsx        word-by-word scroll reveal
│   │       ├── Pillars.tsx          two-pillar dark/light split
│   │       ├── FeaturedWork.tsx     3-card work preview (static placeholder)
│   │       ├── Process.tsx          4-step process with line-draw animation
│   │       ├── Stats.tsx            count-up stats on orange band
│   │       └── HomeCTA.tsx          closing CTA section
│   ├── lib/
│   │   └── animations.ts            reusable GSAP helpers (scrollReveal, lineReveal)
│   └── types/
│       └── index.ts                 shared TypeScript types
├── public/
│   └── logo/
│       ├── logo-text.svg            LOGO-01 (text only)
│       └── logo-symbol.svg          LOGO-02 (symbol + text)
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## Task 1: Project Initialization

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `tsconfig.json`

- [ ] **Step 1: Scaffold Next.js project**

```bash
cd "/Users/tao.san/Documents/08_HumanXMachine/Website"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
```

When prompted: accept all defaults.

- [ ] **Step 2: Install animation + utility dependencies**

```bash
npm install gsap @gsap/react framer-motion
npm install -D @types/node
```

- [ ] **Step 3: Install Google Fonts via next/font**

No install needed — handled in layout.tsx. Verify `next` version ≥ 14:

```bash
cat package.json | grep '"next"'
```

Expected: `"next": "14.x.x"` or higher.

- [ ] **Step 4: Replace `tailwind.config.ts` with brand design tokens**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        orange: '#ff4d00',
        black: '#12120f',
        white: '#fffefd',
        'dark-surface': '#1a1a17',
        'dark-border': '#2a2a27',
      },
      fontFamily: {
        headline: ['var(--font-space-grotesk)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['monospace'],
      },
      letterSpacing: {
        tightest: '-0.05em',
        tighter: '-0.03em',
      },
      maxWidth: {
        site: '1440px',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 5: Replace `next.config.ts`**

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
    domains: [],
  },
}

export default nextConfig
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Expected: `✓ Ready` at `http://localhost:3000`. No errors.

- [ ] **Step 7: Commit**

```bash
git init
git add package.json package-lock.json next.config.ts tailwind.config.ts tsconfig.json .gitignore .eslintrc.json
git commit -m "feat: initialize Next.js 14 project with brand design tokens"
```

---

## Task 2: Global Styles + Fonts

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `src/types/index.ts`

- [ ] **Step 1: Replace `src/app/globals.css`**

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --orange: #ff4d00;
  --black: #12120f;
  --white: #fffefd;
  --dark-surface: #1a1a17;
  --dark-border: #2a2a27;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  background-color: var(--black);
}

body {
  background-color: var(--black);
  color: var(--white);
  font-family: var(--font-dm-sans), sans-serif;
  overflow-x: hidden;
}

/* Cursor: hide default when JS cursor is active */
body.cursor-active * {
  cursor: none !important;
}

/* Selection color */
::selection {
  background-color: var(--orange);
  color: var(--white);
}

/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--black); }
::-webkit-scrollbar-thumb { background: var(--dark-border); border-radius: 2px; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Create `src/app/layout.tsx` with Google Fonts**

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Space_Grotesk, DM_Sans } from 'next/font/google'
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
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Create shared types**

```typescript
// src/types/index.ts

export interface WorkProject {
  id: string
  slug: string
  title: string
  category: string
  pillar: 'Business Creation' | 'Creative Production' | 'Original IP'
  description: string
  brief?: string
  challenge?: string
  output?: string
  coverUrl: string
  mediaUrls?: string[]
  featured: boolean
  isVideo?: boolean
}

export interface Insight {
  id: string
  slug: string
  title: string
  excerpt: string
  tag: string[]
  coverUrl: string
  date: string
  readTime?: string
}

export interface Course {
  id: string
  title: string
  category: string
  description: string
  price: number
  thumbnailUrl: string
  externalUrl: string
  active: boolean
}

export interface ContactFormData {
  name: string
  company: string
  building: string
  budget: string
  source: string
}
```

- [ ] **Step 4: Verify fonts load in browser**

```bash
npm run dev
```

Open `http://localhost:3000`, open DevTools → Network → Fonts. Confirm `SpaceGrotesk` and `DMSans` requests appear.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/types/index.ts
git commit -m "feat: add global styles, Google Fonts, and shared types"
```

---

## Task 3: Pixel Icon System

**Files:**
- Create: `src/components/ui/PixelIcon.tsx`

- [ ] **Step 1: Create PixelIcon component**

```typescript
// src/components/ui/PixelIcon.tsx
'use client'

type PixelIconName = 'face' | 'x' | 'heart' | 'plus'

interface PixelIconProps {
  name: PixelIconName
  size?: number        // pixel unit size in px (default 8)
  color?: string       // fill color (default #ff4d00)
  opacity?: number     // 0-1 (default 1)
  className?: string
}

// Each icon is defined as a list of [col, row] pixel coordinates on a 10×10 grid
const PIXEL_MAPS: Record<PixelIconName, [number, number][]> = {
  face: [
    [2,1],[3,1],[4,1],[5,1],[6,1],
    [1,2],[7,2],
    [1,3],[2,3],[5,3],[6,3],[7,3],
    [1,4],[2,4],[5,4],[6,4],[7,4],
    [1,5],[3,5],[4,5],[5,5],[7,5],
    [1,6],[7,6],
    [2,7],[3,7],[4,7],[5,7],[6,7],
    [2,8],[4,8],[6,8],
  ],
  x: [
    [0,0],[3,0],
    [1,1],[2,1],
    [1,2],[2,2],
    [0,3],[3,3],
  ],
  heart: [
    [0,1],[1,1],[3,1],[4,1],
    [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],
    [1,2],[2,2],[3,2],[4,2],
    [2,3],[3,3],
    [3,4],
  ],
  plus: [
    [1,0],
    [0,1],[1,1],[2,1],
    [1,2],
  ],
}

// Grid dimensions per icon
const GRID_SIZES: Record<PixelIconName, [number, number]> = {
  face:  [9, 9],
  x:     [4, 4],
  heart: [6, 5],
  plus:  [3, 3],
}

export function PixelIcon({
  name,
  size = 8,
  color = '#ff4d00',
  opacity = 1,
  className = '',
}: PixelIconProps) {
  const pixels = PIXEL_MAPS[name]
  const [cols, rows] = GRID_SIZES[name]
  const gap = Math.max(1, Math.round(size * 0.15))
  const unitWithGap = size + gap
  const width = cols * unitWithGap - gap
  const height = rows * unitWithGap - gap

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill={color}
      opacity={opacity}
      className={className}
      aria-hidden="true"
    >
      {pixels.map(([col, row], i) => (
        <rect
          key={i}
          x={col * unitWithGap}
          y={row * unitWithGap}
          width={size}
          height={size}
        />
      ))}
    </svg>
  )
}
```

- [ ] **Step 2: Smoke-test PixelIcon renders**

Temporarily add to `src/app/page.tsx`:

```typescript
import { PixelIcon } from '@/components/ui/PixelIcon'

export default function Home() {
  return (
    <div style={{ padding: 40, display: 'flex', gap: 24, background: '#12120f' }}>
      <PixelIcon name="face" size={12} />
      <PixelIcon name="x" size={12} />
      <PixelIcon name="heart" size={12} />
      <PixelIcon name="plus" size={12} />
      <PixelIcon name="face" size={8} opacity={0.15} />
    </div>
  )
}
```

Open `http://localhost:3000`. Confirm 5 pixel icons render correctly with orange pixels.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/PixelIcon.tsx src/app/page.tsx
git commit -m "feat: add pixel icon SVG system (face, x, heart, plus)"
```

---

## Task 4: UI Primitives — Button + Tag

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Tag.tsx`

- [ ] **Step 1: Create Button component**

```typescript
// src/components/ui/Button.tsx
import Link from 'next/link'

type ButtonVariant = 'primary' | 'ghost' | 'cta'

interface ButtonProps {
  variant?: ButtonVariant
  href?: string
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-orange text-white font-body font-bold text-[11px] tracking-[1.5px] uppercase px-7 py-[14px] rounded-[2px] hover:opacity-85 transition-opacity',
  ghost:
    'border border-dark-border text-[#666] font-body text-[11px] tracking-[1.5px] uppercase px-7 py-[14px] rounded-[2px] hover:border-[#555] hover:text-[#aaa] transition-colors',
  cta:
    'bg-orange text-white font-body font-bold text-[11px] tracking-[1.5px] uppercase px-5 py-[10px] rounded-[2px] hover:opacity-85 transition-opacity',
}

export function Button({
  variant = 'primary',
  href,
  onClick,
  children,
  className = '',
}: ButtonProps) {
  const cls = `inline-block ${variants[variant]} ${className}`

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={cls}>
      {children}
    </button>
  )
}
```

- [ ] **Step 2: Create Tag component**

```typescript
// src/components/ui/Tag.tsx
type TagVariant = 'filled' | 'outline-dark' | 'outline-light'

interface TagProps {
  variant?: TagVariant
  children: React.ReactNode
  className?: string
}

const variants: Record<TagVariant, string> = {
  filled:
    'bg-orange text-white',
  'outline-dark':
    'border border-dark-border text-[#555]',
  'outline-light':
    'border border-[#ccc] text-[#aaa]',
}

export function Tag({
  variant = 'filled',
  children,
  className = '',
}: TagProps) {
  return (
    <span
      className={`font-mono text-[9px] tracking-[1.5px] uppercase px-[10px] py-[5px] rounded-[2px] ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Button.tsx src/components/ui/Tag.tsx
git commit -m "feat: add Button and Tag UI primitives"
```

---

## Task 5: Navigation

**Files:**
- Create: `src/components/layout/Nav.tsx`
- Modify: `src/app/layout.tsx`
- Copy: `01_Logo/LOGO-02/SVG/HMxMC-LOGO-01.svg` → `public/logo/logo-symbol.svg`
- Copy: `01_Logo/LOGO-01/SVG/HMxMC-TEXT-01.svg` → `public/logo/logo-text.svg`

- [ ] **Step 1: Copy logo SVG files**

```bash
mkdir -p "/Users/tao.san/Documents/08_HumanXMachine/Website/public/logo"
cp "/Users/tao.san/Documents/08_HumanXMachine/Website/01_Logo/LOGO-02/SVG/HMxMC-LOGO-01.svg" \
   "/Users/tao.san/Documents/08_HumanXMachine/Website/public/logo/logo-symbol.svg"
cp "/Users/tao.san/Documents/08_HumanXMachine/Website/01_Logo/LOGO-01/SVG/HMxMC-TEXT-01.svg" \
   "/Users/tao.san/Documents/08_HumanXMachine/Website/public/logo/logo-text.svg"
ls public/logo/
```

Expected: `logo-symbol.svg  logo-text.svg`

- [ ] **Step 2: Create Nav component**

```typescript
// src/components/layout/Nav.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'

const NAV_LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'Courses', href: '/courses' },
  { label: 'Services', href: '/services' },
  { label: 'Insights', href: '/insights' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-10 transition-all duration-300 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-md border-b border-dark-border'
          : 'bg-transparent'
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src="/logo/logo-symbol.svg"
          alt="HumanxMachine"
          width={140}
          height={32}
          priority
          className="h-7 w-auto"
        />
      </Link>

      {/* Center links */}
      <div className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-mono text-[11px] tracking-[2px] uppercase text-[#666] hover:text-white transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* CTA */}
      <Button variant="cta" href="/contact">
        Contact
      </Button>
    </nav>
  )
}
```

- [ ] **Step 3: Add Nav to root layout**

```typescript
// src/app/layout.tsx  — replace body content
import { Nav } from '@/components/layout/Nav'

// inside <body>:
<body>
  <Nav />
  {children}
</body>
```

- [ ] **Step 4: Verify Nav renders and becomes opaque on scroll**

```bash
npm run dev
```

Open `http://localhost:3000`. Confirm: logo shows, links show, Contact button shows. Scroll down — nav background appears.

- [ ] **Step 5: Commit**

```bash
git add public/logo/ src/components/layout/Nav.tsx src/app/layout.tsx
git commit -m "feat: add sticky navigation with logo and scroll blur effect"
```

---

## Task 6: Animation Utilities

**Files:**
- Create: `src/lib/animations.ts`

- [ ] **Step 1: Create GSAP animation helpers**

```typescript
// src/lib/animations.ts
// All functions must be called inside useEffect (client-side only)
// Import gsap and ScrollTrigger lazily to avoid SSR issues

export async function loadGSAP() {
  const { default: gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)
  return { gsap, ScrollTrigger }
}

/** Fade + translateY reveal on scroll enter */
export async function scrollReveal(
  targets: string | Element | Element[],
  options: {
    y?: number
    delay?: number
    stagger?: number
    duration?: number
  } = {}
) {
  const { gsap, ScrollTrigger } = await loadGSAP()
  const { y = 40, delay = 0, stagger = 0, duration = 0.8 } = options

  gsap.fromTo(
    targets,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: typeof targets === 'string' ? targets : (targets as Element),
        start: 'top 85%',
        once: true,
      },
    }
  )
}

/** Slide in from X on scroll enter */
export async function scrollSlideIn(
  target: string | Element,
  direction: 'left' | 'right',
  options: { duration?: number; delay?: number } = {}
) {
  const { gsap, ScrollTrigger } = await loadGSAP()
  const { duration = 0.9, delay = 0 } = options
  const x = direction === 'left' ? -60 : 60

  gsap.fromTo(
    target,
    { opacity: 0, x },
    {
      opacity: 1,
      x: 0,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: target as Element,
        start: 'top 85%',
        once: true,
      },
    }
  )
}

/** Word-by-word color reveal */
export async function wordReveal(containerEl: Element) {
  const { gsap, ScrollTrigger } = await loadGSAP()
  const words = containerEl.querySelectorAll<HTMLElement>('[data-word]')

  gsap.fromTo(
    words,
    { color: '#333' },
    {
      color: '#fffefd',
      stagger: 0.06,
      duration: 0.4,
      ease: 'none',
      scrollTrigger: {
        trigger: containerEl,
        start: 'top 70%',
        once: true,
      },
    }
  )
}

/** Number count-up animation */
export async function countUp(
  el: HTMLElement,
  target: number,
  duration = 1.6
) {
  const { gsap } = await loadGSAP()
  const obj = { val: 0 }
  gsap.to(obj, {
    val: target,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = Math.floor(obj.val).toString()
    },
    onComplete: () => {
      el.textContent = target.toString()
    },
  })
}

/** Animate a line drawing left-to-right (scaleX 0→1) */
export async function drawLine(
  el: Element,
  options: { delay?: number; duration?: number } = {}
) {
  const { gsap, ScrollTrigger } = await loadGSAP()
  const { delay = 0, duration = 0.8 } = options

  gsap.fromTo(
    el,
    { scaleX: 0, transformOrigin: 'left center' },
    {
      scaleX: 1,
      duration,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el as Element,
        start: 'top 85%',
        once: true,
      },
    }
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/animations.ts
git commit -m "feat: add GSAP animation utilities (scrollReveal, wordReveal, countUp, drawLine)"
```

---

## Task 7: Hero Section

**Files:**
- Create: `src/components/home/Hero.tsx`

- [ ] **Step 1: Create Hero component**

```typescript
// src/components/home/Hero.tsx
'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { PixelIcon } from '@/components/ui/PixelIcon'
import { loadGSAP } from '@/lib/animations'

export function Hero() {
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const pixelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx: any

    async function animate() {
      const { gsap } = await loadGSAP()

      ctx = gsap.context(() => {
        const tl = gsap.timeline()

        // Pixel symbol fade in
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
    }

    animate()
    return () => ctx?.revert()
  }, [])

  return (
    <section className="relative min-h-screen bg-black flex flex-col justify-end px-10 pb-20 pt-32 overflow-hidden">

      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,77,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.03) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      {/* Pixel symbol decoration */}
      <div ref={pixelRef} className="absolute top-24 right-14 opacity-0">
        <PixelIcon name="face" size={20} />
      </div>

      {/* Floating X mark */}
      <div className="absolute top-48 left-14 opacity-0" style={{ animation: 'pixelFadeIn 1s 1.2s forwards' }}>
        <PixelIcon name="x" size={10} opacity={0.06} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl">
        <div
          ref={eyebrowRef}
          className="font-mono text-[10px] tracking-[3px] text-orange uppercase mb-6 opacity-0"
        >
          Creative Studio · Brand · Culture · Emerging Tech
        </div>

        <h1 className="font-headline font-bold leading-[0.95] tracking-tightest mb-8 text-[clamp(52px,8vw,100px)]">
          <span className="block overflow-hidden">
            <span ref={line1Ref} className="block translate-y-full">
              THE FUTURE
            </span>
          </span>
          <span className="block overflow-hidden">
            <span ref={line2Ref} className="block translate-y-full">
              DOESN&apos;T WAIT.{' '}
              <span className="text-orange">NEITHER DO WE.</span>
            </span>
          </span>
        </h1>

        <p
          ref={subRef}
          className="text-base text-[#666] leading-[1.7] max-w-lg mb-10 opacity-0"
        >
          We build brands, produce content, and launch businesses — all powered
          by AI, all moving at a speed most studios won&apos;t attempt.
        </p>

        <div ref={actionsRef} className="flex gap-3 items-center opacity-0">
          <Button variant="primary" href="/contact">
            Start a Project
          </Button>
          <Button variant="ghost" href="/work">
            View Work
          </Button>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        ref={hintRef}
        className="absolute bottom-8 left-10 flex items-center gap-3 opacity-0"
      >
        <div className="w-10 h-px bg-[#333]" />
        <span className="font-mono text-[9px] tracking-[3px] text-[#333] uppercase">
          Scroll to explore
        </span>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Wire Hero into homepage**

```typescript
// src/app/page.tsx
import { Hero } from '@/components/home/Hero'

export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  )
}
```

- [ ] **Step 3: Verify animations play on load**

```bash
npm run dev
```

Open `http://localhost:3000`. Confirm: eyebrow fades in, headline lines slide up sequentially, sub and buttons appear, pixel icon fades in top-right.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/Hero.tsx src/app/page.tsx
git commit -m "feat: add Hero section with GSAP load animations"
```

---

## Task 8: Manifesto Section

**Files:**
- Create: `src/components/home/Manifesto.tsx`

- [ ] **Step 1: Create Manifesto component**

```typescript
// src/components/home/Manifesto.tsx
'use client'

import { useEffect, useRef } from 'react'
import { wordReveal, scrollReveal } from '@/lib/animations'

const MANIFESTO =
  "Most agencies are still deciding how to feel about AI. We already used it to build a luxury brand, design a cyborg identity system, and produce a commercial campaign — this week."

const ACCENT_WORDS = ['luxury', 'brand,', 'cyborg', 'identity', 'system,', 'commercial', 'campaign', 'week.']

export function Manifesto() {
  const containerRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !labelRef.current || !bodyRef.current) return
    let ctx: any

    async function animate() {
      const { gsap } = await import('gsap')
      ctx = gsap.context(async () => {
        await scrollReveal(labelRef.current!, { y: 20, duration: 0.7 })
        await wordReveal(containerRef.current!)
        await scrollReveal(bodyRef.current!, { y: 20, delay: 0.3, duration: 0.8 })
      })
    }

    animate()
    return () => ctx?.revert()
  }, [])

  const words = MANIFESTO.split(' ')

  return (
    <section className="bg-black border-t border-dark-border px-10 py-28">
      <div className="max-w-5xl mx-auto">
        <div
          ref={labelRef}
          className="font-mono text-[9px] tracking-[3px] text-[#444] uppercase mb-10 opacity-0"
        >
          02 — Philosophy
        </div>

        <div ref={containerRef} className="font-headline font-semibold leading-[1.3] tracking-tighter text-[clamp(24px,3.5vw,42px)]">
          {words.map((word, i) => (
            <span
              key={i}
              data-word
              className={`inline-block mr-[0.25em] ${
                ACCENT_WORDS.includes(word.toLowerCase().replace(/[^a-z,]/g, '') + (word.includes(',') ? ',' : ''))
                  ? 'text-orange'
                  : ''
              }`}
              style={{ color: ACCENT_WORDS.some(a => word.includes(a.replace(',',''))) ? '#ff4d00' : '#333' }}
            >
              {word}
            </span>
          ))}
        </div>

        <p
          ref={bodyRef}
          className="max-w-xl mt-10 text-[15px] text-[#555] leading-[1.8] opacity-0"
        >
          HumanxMachine is where strategy meets execution, where creativity meets
          systems, and where founders meet the future they&apos;re trying to build.
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to homepage**

```typescript
// src/app/page.tsx
import { Hero } from '@/components/home/Hero'
import { Manifesto } from '@/components/home/Manifesto'

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
    </main>
  )
}
```

- [ ] **Step 3: Verify word reveal works on scroll**

Open `http://localhost:3000`, scroll to manifesto section. Words should light up from dark gray to white as section enters viewport.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/Manifesto.tsx src/app/page.tsx
git commit -m "feat: add Manifesto section with word-by-word scroll reveal"
```

---

## Task 9: Pillars Section

**Files:**
- Create: `src/components/home/Pillars.tsx`

- [ ] **Step 1: Create Pillars component**

```typescript
// src/components/home/Pillars.tsx
'use client'

import { useEffect, useRef } from 'react'
import { Tag } from '@/components/ui/Tag'
import { PixelIcon } from '@/components/ui/PixelIcon'
import { scrollSlideIn } from '@/lib/animations'

const PILLAR_ONE_TAGS = ['Brand Strategy', 'Identity Design', 'Biz Systems', 'AI Workflows']
const PILLAR_TWO_TAGS = ['Content Strategy', 'Video / Photo', 'Distribution', 'AI Production']

export function Pillars() {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!leftRef.current || !rightRef.current) return
    let ctx: any

    async function animate() {
      const { gsap } = await import('gsap')
      ctx = gsap.context(async () => {
        await scrollSlideIn(leftRef.current!, 'left')
        await scrollSlideIn(rightRef.current!, 'right')
      })
    }

    animate()
    return () => ctx?.revert()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 border-t border-dark-border">

      {/* Pillar 01 — dark */}
      <div
        ref={leftRef}
        className="bg-black border-r border-dark-border px-12 py-20 relative overflow-hidden opacity-0"
      >
        <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-6">
          Pillar 01
        </p>
        <h2 className="font-headline font-bold text-[clamp(28px,3vw,40px)] tracking-tighter leading-[1.1] text-white mb-5">
          Business<br />Creation
        </h2>
        <p className="text-[15px] text-[#555] leading-[1.75] mb-8 max-w-sm">
          From zero to brand. We build the identity, strategy, and systems
          founders need to launch with confidence and scale with clarity.
        </p>
        <div className="flex flex-wrap gap-2">
          {PILLAR_ONE_TAGS.map((tag, i) => (
            <Tag key={i} variant={i === 0 ? 'filled' : 'outline-dark'}>
              {tag}
            </Tag>
          ))}
        </div>
        {/* Pixel decoration */}
        <div className="absolute bottom-8 right-8 opacity-[0.08]">
          <PixelIcon name="x" size={16} />
        </div>
      </div>

      {/* Pillar 02 — light */}
      <div
        ref={rightRef}
        className="bg-white px-12 py-20 relative overflow-hidden opacity-0"
      >
        <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-6">
          Pillar 02
        </p>
        <h2 className="font-headline font-bold text-[clamp(28px,3vw,40px)] tracking-tighter leading-[1.1] text-black mb-5">
          Creative<br />Production
        </h2>
        <p className="text-[15px] text-[#666] leading-[1.75] mb-8 max-w-sm">
          From idea to distribution. We produce the content, campaigns, and
          creative assets that make brands move in culture.
        </p>
        <div className="flex flex-wrap gap-2">
          {PILLAR_TWO_TAGS.map((tag, i) => (
            <Tag key={i} variant={i === 0 ? 'filled' : 'outline-light'}>
              {tag}
            </Tag>
          ))}
        </div>
        {/* Pixel decoration */}
        <div className="absolute bottom-8 right-8 opacity-[0.06]">
          <PixelIcon name="plus" size={16} color="#12120f" />
        </div>
      </div>

    </div>
  )
}
```

- [ ] **Step 2: Add to homepage**

```typescript
// src/app/page.tsx — add Pillars import and usage
import { Pillars } from '@/components/home/Pillars'
// in JSX after <Manifesto />:
<Pillars />
```

- [ ] **Step 3: Verify slide-in animation**

Scroll to pillars section. Left pillar should slide in from left, right pillar from right. Right side background should be `#fffefd`.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/Pillars.tsx src/app/page.tsx
git commit -m "feat: add Pillars section with slide-in animations"
```

---

## Task 10: Featured Work Section (Static)

**Files:**
- Create: `src/components/home/FeaturedWork.tsx`
- Copy project images to `public/`

- [ ] **Step 1: Copy project images to public**

```bash
mkdir -p "/Users/tao.san/Documents/08_HumanXMachine/Website/public/work/algo"
mkdir -p "/Users/tao.san/Documents/08_HumanXMachine/Website/public/work/luxora"

cp "/Users/tao.san/Documents/08_HumanXMachine/Website/Media Asset/Algo/ChatGPT Image Jun 5, 2026, 12_52_09 PM copy.png" \
   "/Users/tao.san/Documents/08_HumanXMachine/Website/public/work/algo/hero.png"
cp "/Users/tao.san/Documents/08_HumanXMachine/Website/Media Asset/Luxora/ChatGPT Image May 27, 2026, 02_20_18 PM (1) copy.png" \
   "/Users/tao.san/Documents/08_HumanXMachine/Website/public/work/luxora/hero.png"
cp "/Users/tao.san/Documents/08_HumanXMachine/Website/Media Asset/Luxora/ChatGPT Image May 28, 2026, 01_41_20 PM (10) copy.png" \
   "/Users/tao.san/Documents/08_HumanXMachine/Website/public/work/luxora/performance.png"
echo "done"
```

- [ ] **Step 2: Create FeaturedWork component**

```typescript
// src/components/home/FeaturedWork.tsx
'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { scrollReveal } from '@/lib/animations'

const FEATURED_PROJECTS = [
  {
    slug: 'the-algorithm-of-soul',
    title: 'The Algorithm of Soul',
    category: 'Original IP · Film · AI Production',
    description: 'An original HumanxMachine film — AI-designed characters, world, and visual identity built from the ground up.',
    coverUrl: '/work/algo/hero.png',
    isVideo: false,
  },
  {
    slug: 'luxora',
    title: 'Luxora',
    category: 'K-POP · AI Character · Music',
    description: 'A K-POP girl group built entirely with AI — characters, visuals, campaign, and music production from scratch.',
    coverUrl: '/work/luxora/hero.png',
    isVideo: false,
  },
  {
    slug: 'commercial-production',
    title: 'Commercial Production',
    category: 'Commercial Ads · Video · Athlete',
    description: 'Cinematic athlete content — performance films produced end-to-end for a global sportswear brand.',
    coverUrl: null,
    isVideo: true,
  },
]

export function FeaturedWork() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!headerRef.current || !gridRef.current) return
    let ctx: any

    async function animate() {
      const { gsap } = await import('gsap')
      ctx = gsap.context(async () => {
        await scrollReveal(headerRef.current!, { y: 20, duration: 0.7 })
        await scrollReveal(gridRef.current!.querySelectorAll('.work-card'), {
          y: 30,
          stagger: 0.12,
          duration: 0.8,
        })
      })
    }

    animate()
    return () => ctx?.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-white px-10 py-20">
      <div className="max-w-site mx-auto">

        <div ref={headerRef} className="flex justify-between items-end mb-12 opacity-0">
          <h2 className="font-headline font-bold text-[32px] tracking-tighter text-black">
            Featured Work
          </h2>
          <Link
            href="/work"
            className="font-mono text-[10px] tracking-[2px] uppercase text-orange hover:underline"
          >
            View All →
          </Link>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURED_PROJECTS.map((project) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="work-card group relative bg-[#f0efe9] rounded overflow-hidden opacity-0 block"
            >
              {/* Thumbnail */}
              <div className="relative h-56 overflow-hidden">
                {project.isVideo ? (
                  <div className="w-full h-full bg-[#1a1a17] flex flex-col items-center justify-center gap-2">
                    <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/30 text-lg group-hover:border-orange group-hover:text-orange transition-colors">
                      ▶
                    </div>
                    <span className="font-mono text-[8px] tracking-[3px] text-[#333] uppercase">
                      Video · Motion
                    </span>
                  </div>
                ) : (
                  <Image
                    src={project.coverUrl!}
                    alt={project.title}
                    fill
                    className="object-cover object-top group-hover:scale-[1.04] transition-transform duration-700"
                  />
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              </div>

              {/* Info */}
              <div className="p-5">
                <p className="font-mono text-[9px] tracking-[2px] text-orange uppercase mb-2">
                  {project.category}
                </p>
                <h3 className="font-headline font-bold text-base tracking-tight text-black">
                  {project.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
```

- [ ] **Step 3: Add to homepage**

```typescript
// src/app/page.tsx — add after <Pillars />
import { FeaturedWork } from '@/components/home/FeaturedWork'
// in JSX: <FeaturedWork />
```

- [ ] **Step 4: Add image domains to next.config.ts if needed**

If images don't load, they're local — confirm paths under `public/` are correct:

```bash
ls public/work/algo/
ls public/work/luxora/
```

Expected: `hero.png` in each.

- [ ] **Step 5: Commit**

```bash
git add public/work/ src/components/home/FeaturedWork.tsx src/app/page.tsx
git commit -m "feat: add Featured Work section with project images"
```

---

## Task 11: Process + Stats + CTA Sections

**Files:**
- Create: `src/components/home/Process.tsx`
- Create: `src/components/home/Stats.tsx`
- Create: `src/components/home/HomeCTA.tsx`

- [ ] **Step 1: Create Process component**

```typescript
// src/components/home/Process.tsx
'use client'

import { useEffect, useRef } from 'react'
import { scrollReveal, drawLine } from '@/lib/animations'

const STEPS = [
  { num: '01', name: 'Discover', desc: 'Deep dive into your vision, market, and the gaps that need filling.' },
  { num: '02', name: 'Define', desc: 'Strategy, identity, and systems blueprint tailored to your ambition.' },
  { num: '03', name: 'Create', desc: 'Production — design, content, campaigns — executed at pace.' },
  { num: '04', name: 'Scale', desc: 'Distribution, iteration, and growth systems built to compound.' },
]

export function Process() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    let ctx: any

    async function animate() {
      const { gsap } = await import('gsap')
      ctx = gsap.context(async () => {
        await scrollReveal(labelRef.current!, { y: 15 })
        await scrollReveal(headlineRef.current!, { y: 20, delay: 0.1 })

        const steps = sectionRef.current!.querySelectorAll('.process-step')
        steps.forEach((step, i) => {
          scrollReveal(step, { y: 30, delay: i * 0.1 })
          drawLine(step.querySelector('.step-line')!, { delay: i * 0.1 + 0.3 })
        })
      })
    }

    animate()
    return () => ctx?.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-black border-t border-dark-border px-10 py-24">
      <div className="max-w-5xl mx-auto">
        <div ref={labelRef} className="font-mono text-[9px] tracking-[3px] text-[#444] uppercase mb-12 opacity-0">
          05 — How We Work
        </div>
        <h2 ref={headlineRef} className="font-headline font-bold text-[clamp(32px,4vw,52px)] tracking-tightest text-white mb-16 opacity-0">
          From Idea<br />to Impact
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STEPS.map((step) => (
            <div key={step.num} className="process-step opacity-0">
              <div className="font-headline font-bold text-[48px] tracking-tightest text-[#1f1f1c] leading-none mb-4 transition-colors duration-500">
                {step.num}
              </div>
              <div className="step-line w-full h-px bg-[#222] mb-4 origin-left" />
              <h3 className="font-headline font-bold text-[15px] text-white mb-2">
                {step.name}
              </h3>
              <p className="text-[13px] text-[#444] leading-[1.6]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create Stats component**

```typescript
// src/components/home/Stats.tsx
'use client'

import { useEffect, useRef } from 'react'
import { countUp, loadGSAP } from '@/lib/animations'

const STATS = [
  { value: 128, label: 'Projects', suffix: '' },
  { value: 23, label: 'Markets', suffix: '' },
  { value: 98, label: 'Impact', suffix: '%' },
]

export function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const triggered = useRef(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !triggered.current) {
          triggered.current = true
          section.querySelectorAll<HTMLElement>('[data-stat]').forEach((el) => {
            const target = parseInt(el.dataset.stat!)
            countUp(el, target)
          })
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="bg-orange grid grid-cols-3 px-10 py-20"
    >
      {STATS.map((stat) => (
        <div key={stat.label} className="text-center px-5">
          <span
            data-stat={stat.value}
            className="font-headline font-bold text-white leading-none block"
            style={{ fontSize: 'clamp(56px, 8vw, 96px)', letterSpacing: '-4px' }}
          >
            0
          </span>
          <span className="font-mono text-[10px] tracking-[3px] uppercase text-white/50 mt-2 block">
            {stat.suffix}{stat.label}
          </span>
        </div>
      ))}
    </section>
  )
}
```

- [ ] **Step 3: Create HomeCTA component**

```typescript
// src/components/home/HomeCTA.tsx
'use client'

import { useEffect, useRef } from 'react'
import { scrollReveal } from '@/lib/animations'
import { Button } from '@/components/ui/Button'

export function HomeCTA() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    let ctx: any

    async function animate() {
      const { gsap } = await import('gsap')
      ctx = gsap.context(() => {
        scrollReveal(sectionRef.current!.querySelectorAll('.cta-el'), {
          y: 20, stagger: 0.15, duration: 0.8,
        })
      })
    }

    animate()
    return () => ctx?.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="bg-black border-t border-dark-border px-10 py-28 text-center"
    >
      <p className="cta-el font-mono text-[9px] tracking-[3px] text-[#444] uppercase mb-6 opacity-0">
        Ready to Build?
      </p>
      <h2
        className="cta-el font-headline font-bold tracking-tightest text-white leading-[1.1] mb-12 opacity-0"
        style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
      >
        Let&apos;s build something<br />
        at the <span className="text-orange">edge.</span>
      </h2>
      <div className="cta-el opacity-0">
        <Button variant="primary" href="/contact">
          Start a Project →
        </Button>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Assemble complete homepage**

```typescript
// src/app/page.tsx — final version
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
```

- [ ] **Step 5: Scroll entire homepage and verify all sections animate**

Open `http://localhost:3000`. Scroll from top to bottom. Verify:
- Hero: lines slide up on load
- Manifesto: words light up
- Pillars: slide from left/right
- FeaturedWork: cards stagger in
- Process: lines draw, steps fade
- Stats: numbers count up (128, 23, 98)
- CTA: fades in

- [ ] **Step 6: Commit**

```bash
git add src/components/home/Process.tsx src/components/home/Stats.tsx src/components/home/HomeCTA.tsx src/app/page.tsx
git commit -m "feat: complete homepage with all sections and scroll animations"
```

---

## Task 12: Custom Cursor

**Files:**
- Create: `src/components/layout/CustomCursor.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create CustomCursor**

```typescript
// src/components/layout/CustomCursor.tsx
'use client'

import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    document.body.classList.add('cursor-active')
    const dot = dotRef.current
    if (!dot) return

    let mouseX = 0
    let mouseY = 0
    let dotX = 0
    let dotY = 0
    let raf: number

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onEnterLink = () => dot.classList.add('expanded')
    const onLeaveLink = () => dot.classList.remove('expanded')

    function loop() {
      dotX += (mouseX - dotX) * 0.15
      dotY += (mouseY - dotY) * 0.15
      dot!.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    document.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('mouseenter', onEnterLink)
      el.addEventListener('mouseleave', onLeaveLink)
    })

    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      document.body.classList.remove('cursor-active')
    }
  }, [])

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none w-2 h-2 rounded-full bg-orange transition-[width,height,margin] duration-200 expanded:w-8 expanded:h-8 expanded:-mt-3 expanded:-ml-3"
      style={{ willChange: 'transform' }}
    />
  )
}
```

- [ ] **Step 2: Add expanded state via CSS**

Append to `src/app/globals.css`:

```css
/* Custom cursor expanded state */
.expanded {
  width: 32px !important;
  height: 32px !important;
  margin-top: -12px !important;
  margin-left: -12px !important;
  background-color: rgba(255, 77, 0, 0.3) !important;
  border: 1px solid #ff4d00 !important;
}
```

- [ ] **Step 3: Add to root layout**

```typescript
// src/app/layout.tsx — import and add CustomCursor inside <body>
import { CustomCursor } from '@/components/layout/CustomCursor'

// inside <body>:
<body>
  <CustomCursor />
  <Nav />
  {children}
</body>
```

- [ ] **Step 4: Verify cursor behavior**

Open `http://localhost:3000` on a desktop (non-touch) browser. Confirm:
- Default system cursor is hidden
- Small orange dot follows mouse with lag
- Dot expands when hovering over links/buttons

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/CustomCursor.tsx src/app/globals.css src/app/layout.tsx
git commit -m "feat: add custom dot cursor with hover expand effect"
```

---

## Task 13: Responsive Polish + Reduced Motion

**Files:**
- Modify: `src/components/home/Hero.tsx`
- Modify: `src/components/layout/Nav.tsx`

- [ ] **Step 1: Add mobile hamburger menu to Nav**

```typescript
// src/components/layout/Nav.tsx — add mobile menu state
// Replace the component with this version:
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'

const NAV_LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'Courses', href: '/courses' },
  { label: 'Services', href: '/services' },
  { label: 'Insights', href: '/insights' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-10 transition-all duration-300 ${
          scrolled || open
            ? 'bg-black/95 backdrop-blur-md border-b border-dark-border'
            : 'bg-transparent'
        }`}
      >
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

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] tracking-[2px] uppercase text-[#666] hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Button variant="cta" href="/contact">Contact</Button>
          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-px bg-white transition-transform duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-px bg-white transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-px bg-white transition-transform duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center gap-8 pt-16">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-headline font-bold text-3xl tracking-tighter text-white hover:text-orange transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 2: Verify mobile nav**

Open `http://localhost:3000`, resize browser to < 768px. Confirm hamburger menu appears and opens a full-screen nav overlay.

- [ ] **Step 3: Verify reduced-motion: CSS rule in globals.css disables all animations**

In browser DevTools → Rendering tab → Emulate CSS media: `prefers-reduced-motion: reduce`. Confirm page renders without animations (elements visible, no motion).

- [ ] **Step 4: Final homepage review**

Check all viewport sizes: 375px (iPhone), 768px (iPad), 1280px (desktop), 1920px (wide). No horizontal overflow, text readable at all sizes.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Nav.tsx
git commit -m "feat: add responsive mobile nav with full-screen overlay"
```

---

## Self-Review Checklist

- [x] Spec §2 Brand CI → tailwind.config.ts tokens, fonts in layout.tsx
- [x] Spec §3 Tech Stack → GSAP in animations.ts, Framer Motion installed
- [x] Spec §5 Navigation → Nav.tsx sticky with blur, mobile hamburger
- [x] Spec §6.1 Hero → Hero.tsx all animations match spec
- [x] Spec §6.2 Manifesto → word-by-word reveal
- [x] Spec §6.3 Pillars → slide-in from left/right, dark/light split
- [x] Spec §6.4 Featured Work → 3 cards with real images
- [x] Spec §6.5 Process → 4 steps, line draw
- [x] Spec §6.6 Stats → count-up on scroll
- [x] Spec §6.7 CTA → dark section, single CTA
- [x] Spec §8 Animation → cursor, reduced-motion
- [x] Pixel symbol system → PixelIcon.tsx with 4 symbols
- [x] Space Grotesk + DM Sans → Google Fonts via next/font

**Gap:** Framer Motion page transitions (spec §8) — deferred to Plan B (added at route level after inner pages exist).
