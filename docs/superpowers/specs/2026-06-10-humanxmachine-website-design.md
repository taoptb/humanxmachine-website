# HumanxMachine Website — Design Spec
**Date:** 2026-06-10  
**Version:** 1.0  
**Approach:** Narrative Scroll Journey

---

## 1. Business Context

**HumanxMachine** is a creative studio at the intersection of brand, culture, and emerging technology. Two specializations:

- **Pillar 01 — Business Creation:** Brand strategy, identity design, AI workflows, business systems — from zero to launch.
- **Pillar 02 — Creative Production:** Content strategy, video/photo, entertainment production, distribution — all AI-driven.

**Website goals:** Lead generation + portfolio showcase (equal weight)  
**Primary audience:** English-first, global + Thai founders and teams  
**Tone of voice:** Bold & Experimental — direct, declarative, specific. Never vague, never hype-y.

---

## 2. Brand CI

| Token | Value |
|---|---|
| Primary Orange | `#ff4d00` |
| Near-Black | `#12120f` |
| Soft White | `#fffefd` |
| Headline Font | Space Grotesk (Google Fonts, variable weight 300–700, free) |
| Body Font | DM Sans (Google Fonts, variable, free) |
| Symbol System | Custom pixel/8-bit SVG icons — all symbols rendered as pixel-art SVG grids (no raster), consistent 8×8 or 10×10 pixel unit grid, color: `#ff4d00` on dark / `#12120f` on light |

**Logo files:** `/01_Logo/LOGO-01/` (text only) and `/01_Logo/LOGO-02/` (symbol + text) — use SVG for web  
**Color mode:** Mixed — dark hero sections alternate with light content sections  
**Visual style:** Editorial Tech · Modular · Sharp · Bold Minimalism · Human Warmth + Digital Precision

---

## 3. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SEO (ISR/SSG), React ecosystem, Vercel-native |
| Styling | Tailwind CSS | Utility-first, fast iteration |
| Animation | GSAP + ScrollTrigger, Framer Motion | Cinematic scroll-driven animations (hero required) |
| CMS | Notion API (`@notionhq/client`) | Work, Insights, Courses, Contact submissions |
| Deployment | Vercel | Seamless Next.js deploy, edge network |
| Email (optional) | Resend | Contact form notifications |

---

## 4. Site Architecture

```
/                     → Home           (narrative scroll)
/work                 → Work           (full portfolio grid)
/work/[slug]          → Case Study     (per-project page)
/courses              → Courses        (catalog, link-out)
/services             → Services       (two pillars)
/insights             → Insights       (blog)
/insights/[slug]      → Article        (per-post page)
/contact              → Contact        (intake form)
```

### Notion Databases Required

| Database | Type | Usage |
|---|---|---|
| Work | Read | Portfolio projects + case studies |
| Insights | Read | Blog articles |
| Courses | Read | Course catalog + external URLs |
| Contacts | Write | Contact form submissions |

---

## 5. Navigation

**Sticky top bar** — dark background `#12120f`, `backdrop-filter: blur(12px)`, 64px height  
- Left: HUMANX×MACHINE logo (SVG, LOGO-02 on desktop, LOGO-01 on mobile)  
- Center: WORK · COURSES · SERVICES · INSIGHTS  
- Right: CONTACT (orange CTA button `#ff4d00`)

---

## 6. Homepage — Section-by-Section

### 6.1 Hero (dark)
- **Headline:** "THE FUTURE DOESN'T WAIT. NEITHER DO WE."
- **Sub:** "We build brands, produce content, and launch businesses — all powered by AI, all moving at a speed most studios won't attempt."
- **CTAs:** "Start a Project" (orange) + "View Work" (ghost)
- **Background:** Near-black + subtle 60px grid lines (3% orange opacity)
- **Pixel symbol:** LOGO-02 symbol SVG, top-right, 12% opacity, fades in on load
- **Animations on load:**
  - Eyebrow: fade + translateY(20px) → 0, delay 0.3s
  - Headline line 1: clip/slideUp, delay 0.4s
  - Headline line 2: clip/slideUp, delay 0.55s
  - Sub: fade + translateY, delay 0.9s
  - CTAs: fade + translateY, delay 1.1s
  - Scroll hint: fade, delay 1.4s

### 6.2 Manifesto (dark)
- **Section label:** "02 — Philosophy"
- **Text:** "Most agencies are still deciding how to feel about AI. We already used it to build a luxury brand, design a cyborg identity system, and produce a commercial campaign — this week."
- **Body:** "HumanxMachine is where strategy meets execution, where creativity meets systems, and where founders meet the future they're trying to build."
- **Animation:** Word-by-word light-up reveal on scroll (Intersection Observer → GSAP stagger)

### 6.3 Two Pillars (dark + light split)
- Side-by-side 50/50 grid, no gap between
- **Left (dark):** Pillar 01 Business Creation — tags: Brand Strategy, Identity Design, Biz Systems, AI Workflows
- **Right (light `#fffefd`):** Pillar 02 Creative Production — tags: Content Strategy, Video/Photo, Distribution, AI Production
- **Animation:** Left slides in from left, right slides in from right on scroll

### 6.4 Featured Work (light `#fffefd`)
- Section title "Featured Work" + "View All →" link
- 3 featured project cards pulled from Notion (featured: true)
- Card hover: translateY(-8px) lift + orange border + overlay
- Cards link to `/work/[slug]`

### 6.5 Process (dark)
- **Headline:** "From Idea to Impact"
- 4 steps: Discover → Define → Create → Scale
- Each step: large number, orange underline animates in, name, short description
- **Animation:** Steps stagger in on scroll, orange line draws left-to-right

### 6.6 Stats (orange `#ff4d00`)
- Full-width orange band
- 3 stats: 128 Projects · 23 Markets · 98% Impact
- **Animation:** Numbers count up on scroll-enter

### 6.7 CTA (dark)
- **Headline:** "Let's build something at the edge."
- Single CTA: "Start a Project →" → `/contact`

---

## 7. Inner Pages

### /work
- Filter tabs: All · Original IP · Creative Production · Business Creation · Video
- **Editorial masonry grid** (12-col):
  - Large hero card (7 col) for featured project
  - Tall side card (5 col)
  - Wide video card (7 col)
  - Supporting cards fill remaining rows
- "Next Project — In production" placeholder card
- Cards pulled from Notion Work database

### /work/[slug] — Case Study
- **Hero:** Full-bleed project image, title + category overlay
- **Sections:** Brief → Challenge → Output/Result → Media gallery
- **Navigation:** ← Previous / Next → project links at bottom

### /courses
- Section header + subtitle
- Card grid (3 columns on desktop, 2 on tablet, 1 on mobile)
- Each card: thumbnail, course name, category tag, short description, price, "Enroll →" (external link)
- Data from Notion Courses database

### /services
- Two full-page dark/light sections — no scroll snapping, normal scroll flow
- **Pillar 01 (dark):** Business Creation — service list with descriptions + CTA
- **Pillar 02 (light):** Creative Production — service list with descriptions + CTA
- Content hardcoded (low-change frequency)

### /insights
- Grid layout, 3 columns
- Each card: cover image, tag, title, date, read time
- Filter by tag (pulled from Notion)
- Data from Notion Insights database

### /insights/[slug]
- Article page: hero image, title, date, body content (rendered from Notion blocks)
- Related articles at bottom

### /contact
- Clean centered form on dark background
- **Fields:**
  1. Name (text)
  2. Company (text)
  3. What are you building? (textarea)
  4. Budget range (select: Under $5k · $5k–$15k · $15k–$50k · $50k+)
  5. How did you hear about us? (text)
- Submit → POST to Next.js API route → Notion database write → (optional) Resend email notification
- Success state: inline confirmation, no page redirect

---

## 8. Animation System

| Element | Library | Behavior |
|---|---|---|
| Hero text reveal | GSAP | Line-by-line clip animation on load |
| Scroll reveals | GSAP ScrollTrigger | fade + translateY(40px) → 0 per section |
| Pillar slide-in | GSAP ScrollTrigger | translateX(±60px) → 0 |
| Manifesto word reveal | GSAP stagger | Color transition per word on scroll |
| Stats count-up | GSAP | 0 → target over 1.6s, cubic ease-out |
| Process line draw | GSAP ScrollTrigger | scaleX 0 → 1 per step |
| Work card hover | CSS transition | translateY(-8px) + box-shadow |
| Page transitions | Framer Motion | Opacity fade between routes |
| Cursor | Custom JS | Small dot cursor that expands on hover — included in v1 |

**Performance note:** All GSAP animations wrapped in `useEffect` with cleanup. `will-change: transform` only applied during active animation. Respect `prefers-reduced-motion`.

---

## 8b. Pixel Symbol System

All decorative symbols are built as inline SVG using a strict pixel grid — no icon fonts, no raster images.

| Symbol | Usage | Grid |
|---|---|---|
| Face/Skull | Hero decoration, section breaks | 10×10 units |
| X mark | CTA accents, bullet points | 4×4 units |
| Heart | Brand warmth moments | 4×4 units |
| Plus/Cross | Tag decoration, dividers | 3×3 units |

**Rules:**
- Each pixel unit = one `<rect>` element in SVG
- Pixel unit size scales with context (8px decorative → 24px featured)
- Colors: `#ff4d00` (primary), `#fffefd` (on dark), `#12120f` (on light)
- Opacity variants: 100% (feature) / 12–15% (background decoration)
- Animation: flicker or fade-in only — no rotation, no distortion

---

## 9. Assets

| Asset | Location | Format for web |
|---|---|---|
| Logo (text) | `/01_Logo/LOGO-01/SVG/` | SVG inline or `<Image>` |
| Logo (symbol+text) | `/01_Logo/LOGO-02/SVG/` | SVG inline |
| Project: The Algorithm of Soul | `/Media Asset/Algo/` | WebP (converted from PNG) |
| Project: Luxora | `/Media Asset/Luxora/` | WebP (converted from PNG) |
| Project: Commercial Production | `/Media Asset/Nike/` | MP4 (video, autoplay muted loop) |

---

## 10. Projects Reference

| # | Project Name | Type | Pillar | Media |
|---|---|---|---|---|
| 01 | The Algorithm of Soul | Original IP · Film | Creative Production | 12 AI character PNG images |
| 02 | Luxora | K-POP · AI Group | Creative Production | 12 AI images (portraits + performances) |
| 03 | Commercial Production | Commercial Ads · Video | Creative Production | 12 MP4 video files (athlete content) |

---

## 11. Content Tone of Voice

**Write:**
- Direct and declarative: "We build." not "We help you build."
- Specific over vague: name actual capabilities, markets, outputs
- Confident, not arrogant: let the work prove the claims

**Avoid:**
- Vague agency benefits: "compelling narratives," "seamless experiences," "drive growth"
- AI hype words: "leverage AI," "AI-powered solutions," "next-gen"
- Passive voice

---

## 12. Responsive Breakpoints

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | < 768px | Single column, hamburger nav, no parallax |
| Tablet | 768–1024px | 2-col work grid, reduced animation |
| Desktop | > 1024px | Full layout as designed |
| Wide | > 1440px | Max-width 1440px, auto margin |

`prefers-reduced-motion: reduce` → disable all GSAP animations, keep CSS transitions at 0.2s max.

---

## 13. Out of Scope (v1)

- Multi-language (Thai/English toggle) — future phase
- E-commerce / direct course selling — courses link out to external platform
- Client portal / login
- Dark/light mode toggle — mixed mode is fixed
