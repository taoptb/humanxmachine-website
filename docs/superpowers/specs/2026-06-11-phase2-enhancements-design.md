# HumanxMachine Phase 2 — Enhancement Design

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Ship 8 improvements to the HumanxMachine website — logo fix, footer, about page, 404, mobile polish, animation polish, SEO/OG images, and Vercel deployment.

**Architecture:** All items are self-contained. Items 1–2 affect global layout (layout.tsx). Items 3–4 are new routes. Items 5–7 are polish passes on existing code. Item 8 is deployment config.

**Tech Stack:** Next.js 16.2.9, Tailwind CSS v4, GSAP 3, Framer Motion 12, `@notionhq/client` v2, `next/og` for OG images.

---

## Item 1 — Logo Visibility Fix

**File:** `src/components/layout/Nav.tsx`

The nav renders `logo-symbol.svg` via `<Image>`. The SVG may be dark-coloured and invisible against the `#12120f` background.

**Fix:** Add `className="invert brightness-0"` (Tailwind) to the `<Image>` tag so the SVG renders white on dark backgrounds. Also increase the displayed size slightly — `h-8 w-auto` instead of `h-7 w-auto`.

---

## Item 2 — Site Footer

**New file:** `src/components/layout/Footer.tsx`
**Modified:** `src/app/layout.tsx` — add `<Footer />` after `</PageTransition>`

### Layout
- Background: `#0e0e0b` (slightly deeper than page black), top border `border-dark-border`
- Max width `1440px`, padded `px-10 py-16`

### Sections (top → bottom)

**Top row:** Logo (`logo-text.svg`, white filtered) left + tagline `"Brand. Culture. Emerging Tech."` right in orange mono text.

**Middle grid:** 3 columns
- Col 1 — *Studio:* About, Services, Work
- Col 2 — *Learn:* Courses, Insights
- Col 3 — *Connect:* Contact, and social icons row (Instagram, LinkedIn, X/Twitter, TikTok) as small SVG icon links

**Bottom row:** Copyright `© 2026 HumanxMachine` left · `"Built with AI. Powered by purpose."` centre · privacy/legal placeholder right — all in `text-[#333] font-mono text-[10px]`.

**Decoration:** One `<PixelIcon name="plus" size={8} opacity={0.04} />` bottom-right corner, absolutely positioned.

---

## Item 3 — About Page

**New file:** `src/app/about/page.tsx`
**Modified:** `src/components/layout/Nav.tsx` — add `{ label: 'About', href: '/about' }` to `NAV_LINKS` between Services and Insights.

### 5 Sections

**Section 01 — Hero**
- Background: `#12120f`, bg grid (same as homepage hero)
- Eyebrow: `"01 — Who We Are"` orange mono
- Headline: `"This is the era of the solo entrepreneur."` — clamp 42–72px, bold, white, tracking-tightest
- Sub: "Two experienced founders who believe the rules have changed. You don't need a big team or large capital to build something meaningful — you need the right tools, the right vision, and the courage to move."
- GSAP load animation: headline slides up, sub fades in

**Section 02 — Founders**
- Dark background `#12120f`, two-column grid (stacks to 1-col mobile)
- Each card: `#1a1a17` bg, orange `"Founder 01"` / `"Founder 02"` label, avatar circle (placeholder initials, swap for photo), name, role tag in mono uppercase, bio paragraph
- Placeholder content (user fills real names/bios/photos directly in the component):
  - F1: Name · Role hint: "Brand · Strategy · Vision" · Bio placeholder
  - F2: Name · Role hint: "Tech · Systems · AI" · Bio placeholder
- ScrollReveal animation on each card

**Section 03 — Philosophy**
- Background: `#12120f`, border-top `#2a2a27`
- Two-column: left = headline `"AI doesn't replace you. It completes you."` (orange accent on "completes you"), right = body + 3 belief bullets:
  1. "The best businesses are built by people who understand leverage — AI is the ultimate lever."
  2. "Speed is a strategy. Moving fast with AI isn't reckless — it's the new competitive advantage."
  3. "From before impossible to infinite possibilities — that's the only direction we move."
- ScrollReveal on headline and belief list (staggered)

**Section 04 — Statement (orange block)**
- Background: `#ff4d00` (orange), full-width
- Single bold statement: `"You don't need a bigger team. You need better tools."` — clamp 32–56px, white, bold, letter-spacing -2px
- ScrollReveal slide-up

**Section 05 — CTA**
- Background: `#12120f`, border-top `#2a2a27`
- Left: headline "Ready to build something at the edge?" + sub "Let's talk about what you're working on."
- Right: `<Button variant="primary" href="/contact">Start a Project →</Button>`

---

## Item 4 — Branded 404 Page

**New file:** `src/app/not-found.tsx`

- Background: `#12120f`, full viewport height, centred flex column
- `<PixelIcon name="x" size={20} />` at top, subtle opacity
- `"404"` in massive type (clamp 96–180px), `#1a1a17` colour (dark, almost invisible — like the page is empty)
- Subheading: `"This page doesn't exist."` white, bold, 32px
- Body: `"The link might be broken, or the page may have moved."` grey
- `<Button variant="primary" href="/">Back to Home</Button>` + `<Button variant="ghost" href="/work">See Our Work</Button>`
- No Nav animation needed — uses default layout with Nav

---

## Item 5 — Mobile Polish Pass

**Files modified:** multiple existing components and pages.

Test viewport: 375px wide.

**Fixes needed:**

| Component | Issue | Fix |
|---|---|---|
| `Hero.tsx` | `px-10` too wide at 375px, headline overflows | `px-6 md:px-10`, headline clamp already good |
| `Manifesto.tsx` | `px-10 py-28` too much padding | `px-6 md:px-10 py-16 md:py-28` |
| `Stats.tsx` | 3-col grid cramped at 375px | `grid-cols-3` stays but reduce font size clamp minimum to 40px |
| `Pillars.tsx` | Already `grid-cols-1 md:grid-cols-2` — verify tag wrapping | Ensure tags wrap correctly |
| `Process.tsx` | Steps grid may overlap | Verify `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` |
| `HomeCTA.tsx` | `px-10` padding | `px-6 md:px-10` |
| `Footer.tsx` | 3-col grid collapses | `grid-cols-1 md:grid-cols-3` |
| Work page | Filter tags overflow horizontally | Add `flex-wrap` to filter bar |
| Contact page | Form fields stack correctly | Verify `grid-cols-1 md:grid-cols-2` |
| Nav `px-6` | Already responsive | Verify hamburger shows below `md:` |

---

## Item 6 — Animation & Polish

**Files modified:** `src/components/home/FeaturedWork.tsx`, `src/components/work/WorkCard.tsx`, `src/app/globals.css`

### Work card hover
In `WorkCard.tsx` and the cards inside `FeaturedWork.tsx`:
- `group` class on the card container
- Overlay div: absolute inset, `bg-black/60`, opacity 0 → 1 on group-hover, with `"View Project →"` text centred
- Cover image: `scale-100 group-hover:scale-105 transition-transform duration-500`

### Pixel icon pulse
In `Hero.tsx`, the `pixelRef` pixel face icon gets a CSS keyframe `@keyframes pixel-pulse` — subtle scale 1 → 1.05 → 1, 3s ease-in-out infinite, starting after GSAP entrance completes.

Add to `globals.css`:
```css
@keyframes pixel-pulse {
  0%, 100% { transform: scale(1); opacity: 0.12; }
  50% { transform: scale(1.05); opacity: 0.16; }
}
.pixel-pulse {
  animation: pixel-pulse 3s ease-in-out infinite;
}
```

### Loading skeletons
New component `src/components/ui/Skeleton.tsx` — animated shimmer `div` using CSS `@keyframes shimmer` (gradient sweep left-to-right on a `#1a1a17` → `#2a2a27` gradient).

New route-level loading files (Next.js App Router pattern — shown automatically while the async Server Component fetches from Notion):
- `src/app/work/loading.tsx` — skeleton grid of 6 cards (2×3), matching WorkCard dimensions
- `src/app/insights/loading.tsx` — skeleton grid of 3 article cards
- `src/app/courses/loading.tsx` — skeleton grid of 3 course cards

---

## Item 7 — SEO + OG Images

### Per-page metadata

Each page gets `export async function generateMetadata()` (or `export const metadata`) returning title, description, og:title, og:description, og:image.

**Pages to update:**
- `src/app/page.tsx` — already has basic metadata, add og:image pointer
- `src/app/about/page.tsx` — "About — HumanxMachine"
- `src/app/work/page.tsx` — "Work — HumanxMachine"
- `src/app/work/[slug]/page.tsx` — dynamic: project title + description
- `src/app/services/page.tsx` — "Services — HumanxMachine"
- `src/app/courses/page.tsx` — "Courses — HumanxMachine"
- `src/app/insights/page.tsx` — "Insights — HumanxMachine"
- `src/app/insights/[slug]/page.tsx` — dynamic: article title + excerpt
- `src/app/contact/page.tsx` — "Start a Project — HumanxMachine"

### Root OG Image
**New file:** `src/app/opengraph-image.tsx`

Uses `ImageResponse` from `next/og`. Design: black background, orange `HumanxMachine` logotype text, tagline `"Brand. Culture. Emerging Tech."`, orange pixel decoration. Size 1200×630.

### Dynamic OG for work + insights
`src/app/work/[slug]/opengraph-image.tsx` — fetches project, renders title + category.
`src/app/insights/[slug]/opengraph-image.tsx` — fetches article, renders title + tag.

### Sitemap
**New file:** `src/app/sitemap.ts` — returns static routes + dynamic slugs from Notion (falls back to static-only if no credentials).

### Robots
**New file:** `src/app/robots.ts` — allow all, point to sitemap.

---

## Item 8 — Vercel Deployment

**New file:** `vercel.json`
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

**`.gitignore` additions:**
```
.superpowers/
.env.local
```

**Steps (not code, just config):**
1. `git init && git add . && git commit -m "initial: humanxmachine website"` (if not already)
2. Push to GitHub repo
3. In Vercel: Import project → set env vars: `NOTION_TOKEN`, `NOTION_WORK_DB`, `NOTION_INSIGHTS_DB`, `NOTION_COURSES_DB`, `NOTION_CONTACTS_DB`
4. Deploy → get live URL

---

## Build Order Summary

| # | Item | Effort | Files |
|---|---|---|---|
| 1 | Logo fix | 15 min | Nav.tsx |
| 2 | Footer | 45 min | Footer.tsx, layout.tsx |
| 3 | About page | 2 hrs | about/page.tsx, Nav.tsx |
| 4 | 404 page | 20 min | not-found.tsx |
| 5 | Mobile polish | 1 hr | 8 existing components |
| 6 | Animation polish | 1.5 hrs | FeaturedWork.tsx, Hero.tsx, globals.css, Skeleton.tsx |
| 7 | SEO + OG | 1 hr | 9 pages + 3 new files |
| 8 | Deploy | 30 min | vercel.json, .gitignore |
