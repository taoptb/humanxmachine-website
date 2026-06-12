# HumanxMachine — Inner Pages + CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build all inner pages (Work, Courses, Services, Insights, Contact), wire up Notion API as CMS for content and contact form submissions, and add Framer Motion page transitions.

**Architecture:** Notion API via `@notionhq/client` with ISR (`revalidate: 3600`) for read pages. Contact form uses a Next.js API route that writes to a Notion database and optionally sends email via Resend. All Notion credentials stored in `.env.local`.

**Tech Stack:** Next.js 14 App Router, `@notionhq/client`, Resend (optional), Framer Motion

**Prerequisite:** Plan A (`2026-06-10-humanxmachine-foundation-homepage.md`) must be complete.

**Spec:** `docs/superpowers/specs/2026-06-10-humanxmachine-website-design.md`

---

## File Map

```
src/
├── app/
│   ├── work/
│   │   ├── page.tsx               work grid page (ISR)
│   │   └── [slug]/
│   │       └── page.tsx           case study page (ISR)
│   ├── courses/
│   │   └── page.tsx               course catalog (ISR)
│   ├── services/
│   │   └── page.tsx               services (static, hardcoded)
│   ├── insights/
│   │   ├── page.tsx               blog grid (ISR)
│   │   └── [slug]/
│   │       └── page.tsx           article page (ISR)
│   ├── contact/
│   │   └── page.tsx               contact form
│   └── api/
│       └── contact/
│           └── route.ts           POST handler → Notion write
├── lib/
│   └── notion.ts                  typed Notion API client + all fetchers
└── components/
    ├── work/
    │   ├── WorkGrid.tsx            editorial grid with filters
    │   └── WorkCard.tsx            individual project card
    ├── insights/
    │   └── InsightCard.tsx         blog post card
    └── contact/
        └── ContactForm.tsx         client-side form with submission state
```

---

## Notion Database Setup

Before Task 1, create these 4 databases in Notion and note their IDs.

### Work Database
| Property | Type | Notes |
|---|---|---|
| Name | Title | Project title |
| Slug | Text | URL slug e.g. `the-algorithm-of-soul` |
| Category | Text | e.g. "Original IP · Film · AI Production" |
| Pillar | Select | Business Creation / Creative Production / Original IP |
| Featured | Checkbox | Show on homepage |
| Description | Text | Short description |
| Brief | Text | Case study brief |
| Challenge | Text | Case study challenge |
| Output | Text | Case study result |
| Cover | Files & media | Hero image |
| IsVideo | Checkbox | Video project flag |
| Published | Checkbox | Live on site |

### Insights Database
| Property | Type | Notes |
|---|---|---|
| Title | Title | Article title |
| Slug | Text | URL slug |
| Excerpt | Text | Short preview text |
| Tag | Multi-select | Categories |
| Cover | Files & media | Cover image |
| Date | Date | Publish date |
| Published | Checkbox | Live on site |

### Courses Database
| Property | Type | Notes |
|---|---|---|
| Name | Title | Course title |
| Category | Text | e.g. "Business Building" |
| Description | Text | Short description |
| Price | Number | In USD |
| Thumbnail | Files & media | Cover image |
| ExternalURL | URL | Link to external platform |
| Active | Checkbox | Show on site |

### Contacts Database
| Property | Type | Notes |
|---|---|---|
| Name | Title | Submitter name |
| Company | Text | Company name |
| Building | Text | What they're building |
| Budget | Select | Under $5k / $5k–$15k / $15k–$50k / $50k+ |
| Source | Text | How they heard about us |
| SubmittedAt | Date | Auto-set by API route |

---

## Task 1: Notion Client + Environment

**Files:**
- Create: `.env.local`
- Create: `src/lib/notion.ts`

- [ ] **Step 1: Install Notion SDK**

```bash
npm install @notionhq/client
```

- [ ] **Step 2: Create `.env.local` with credentials**

```bash
# .env.local — get values from https://www.notion.so/my-integrations
NOTION_TOKEN=secret_xxxxxxxxxxxx
NOTION_WORK_DB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_INSIGHTS_DB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_COURSES_DB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_CONTACTS_DB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Add `.env.local` to `.gitignore` (it should already be there from create-next-app).

- [ ] **Step 3: Create typed Notion client**

```typescript
// src/lib/notion.ts
import { Client } from '@notionhq/client'
import type { WorkProject, Insight, Course } from '@/types'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

// ─── Helpers ───────────────────────────────────────────────

function getText(prop: any): string {
  if (!prop) return ''
  if (prop.type === 'title') return prop.title?.[0]?.plain_text ?? ''
  if (prop.type === 'rich_text') return prop.rich_text?.[0]?.plain_text ?? ''
  if (prop.type === 'url') return prop.url ?? ''
  if (prop.type === 'select') return prop.select?.name ?? ''
  if (prop.type === 'number') return prop.number ?? 0
  if (prop.type === 'checkbox') return prop.checkbox ?? false
  if (prop.type === 'date') return prop.date?.start ?? ''
  if (prop.type === 'multi_select') return prop.multi_select?.map((s: any) => s.name) ?? []
  return ''
}

function getFileUrl(prop: any): string {
  if (!prop?.files?.[0]) return ''
  const file = prop.files[0]
  return file.type === 'external' ? file.external.url : file.file.url
}

// ─── Work ──────────────────────────────────────────────────

export async function getWorkProjects(): Promise<WorkProject[]> {
  const res = await notion.databases.query({
    database_id: process.env.NOTION_WORK_DB!,
    filter: { property: 'Published', checkbox: { equals: true } },
    sorts: [{ property: 'Featured', direction: 'descending' }],
  })

  return res.results.map((page: any) => ({
    id: page.id,
    slug: getText(page.properties.Slug),
    title: getText(page.properties.Name),
    category: getText(page.properties.Category),
    pillar: getText(page.properties.Pillar) as WorkProject['pillar'],
    description: getText(page.properties.Description),
    brief: getText(page.properties.Brief),
    challenge: getText(page.properties.Challenge),
    output: getText(page.properties.Output),
    coverUrl: getFileUrl(page.properties.Cover),
    featured: getText(page.properties.Featured) as unknown as boolean,
    isVideo: getText(page.properties.IsVideo) as unknown as boolean,
  }))
}

export async function getWorkProject(slug: string): Promise<WorkProject | null> {
  const projects = await getWorkProjects()
  return projects.find((p) => p.slug === slug) ?? null
}

export async function getFeaturedWork(): Promise<WorkProject[]> {
  const all = await getWorkProjects()
  return all.filter((p) => p.featured).slice(0, 3)
}

// ─── Insights ──────────────────────────────────────────────

export async function getInsights(): Promise<Insight[]> {
  const res = await notion.databases.query({
    database_id: process.env.NOTION_INSIGHTS_DB!,
    filter: { property: 'Published', checkbox: { equals: true } },
    sorts: [{ property: 'Date', direction: 'descending' }],
  })

  return res.results.map((page: any) => ({
    id: page.id,
    slug: getText(page.properties.Slug),
    title: getText(page.properties.Title),
    excerpt: getText(page.properties.Excerpt),
    tag: getText(page.properties.Tag) as unknown as string[],
    coverUrl: getFileUrl(page.properties.Cover),
    date: getText(page.properties.Date),
  }))
}

export async function getInsight(slug: string): Promise<Insight | null> {
  const all = await getInsights()
  return all.find((i) => i.slug === slug) ?? null
}

export async function getInsightPageBlocks(pageId: string) {
  const res = await notion.blocks.children.list({ block_id: pageId })
  return res.results
}

// ─── Courses ───────────────────────────────────────────────

export async function getCourses(): Promise<Course[]> {
  const res = await notion.databases.query({
    database_id: process.env.NOTION_COURSES_DB!,
    filter: { property: 'Active', checkbox: { equals: true } },
  })

  return res.results.map((page: any) => ({
    id: page.id,
    title: getText(page.properties.Name),
    category: getText(page.properties.Category),
    description: getText(page.properties.Description),
    price: getText(page.properties.Price) as unknown as number,
    thumbnailUrl: getFileUrl(page.properties.Thumbnail),
    externalUrl: getText(page.properties.ExternalURL),
    active: true,
  }))
}

// ─── Contact (write) ───────────────────────────────────────

export async function createContact(data: {
  name: string
  company: string
  building: string
  budget: string
  source: string
}) {
  await notion.pages.create({
    parent: { database_id: process.env.NOTION_CONTACTS_DB! },
    properties: {
      Name: { title: [{ text: { content: data.name } }] },
      Company: { rich_text: [{ text: { content: data.company } }] },
      Building: { rich_text: [{ text: { content: data.building } }] },
      Budget: { select: { name: data.budget } },
      Source: { rich_text: [{ text: { content: data.source } }] },
      SubmittedAt: { date: { start: new Date().toISOString() } },
    },
  })
}
```

- [ ] **Step 4: Verify Notion connection**

Temporarily add to `src/app/page.tsx` (remove after test):

```typescript
import { getWorkProjects } from '@/lib/notion'

// Inside Home():
const projects = await getWorkProjects()
console.log('Notion projects:', projects.length)
```

Run `npm run dev` and check server terminal. Expected: `Notion projects: N` (where N ≥ 0, no error).

Remove the test lines from `page.tsx` after confirming.

- [ ] **Step 5: Commit**

```bash
git add src/lib/notion.ts package.json package-lock.json
git commit -m "feat: add typed Notion API client for Work, Insights, Courses, Contacts"
```

---

## Task 2: Work Page

**Files:**
- Create: `src/app/work/page.tsx`
- Create: `src/components/work/WorkCard.tsx`
- Create: `src/components/work/WorkGrid.tsx`

- [ ] **Step 1: Create WorkCard component**

```typescript
// src/components/work/WorkCard.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { WorkProject } from '@/types'

interface WorkCardProps {
  project: WorkProject
  index: number
  className?: string
  imageHeight?: number
}

export function WorkCard({ project, index, className = '', imageHeight = 300 }: WorkCardProps) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={`group relative bg-dark-surface rounded overflow-hidden block ${className}`}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ height: imageHeight }}>
        {project.isVideo ? (
          <div className="w-full h-full bg-[#1a1a17] flex flex-col items-center justify-center gap-2">
            <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white/30 text-lg group-hover:border-orange group-hover:text-orange transition-colors duration-300">
              ▶
            </div>
            <span className="font-mono text-[8px] tracking-[3px] text-[#333] uppercase">
              Video · Motion
            </span>
          </div>
        ) : project.coverUrl ? (
          <Image
            src={project.coverUrl}
            alt={project.title}
            fill
            className="object-cover object-top group-hover:scale-[1.04] transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-dark-border" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />
        {/* Arrow */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-orange rounded-[2px] flex items-center justify-center text-white text-sm font-bold opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300">
          ↗
        </div>
      </div>

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <p className="font-mono text-[8px] tracking-[2.5px] text-orange uppercase mb-2">
          {project.category}
        </p>
        <h3 className="font-headline font-bold text-white tracking-tight leading-tight"
            style={{ fontSize: 'clamp(15px, 1.5vw, 20px)' }}>
          {project.title}
        </h3>
        {project.description && (
          <p className="text-[12px] text-[#888] leading-[1.55] mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {project.description}
          </p>
        )}
      </div>

      {/* Index */}
      <div className="absolute top-4 left-4 font-mono text-[9px] text-white/25 z-10">
        {String(index + 1).padStart(2, '0')}
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Create WorkGrid component**

```typescript
// src/components/work/WorkGrid.tsx
'use client'

import { useState } from 'react'
import { WorkCard } from './WorkCard'
import type { WorkProject } from '@/types'

const FILTERS = ['All', 'Original IP', 'Creative Production', 'Business Creation', 'Video']

interface WorkGridProps {
  projects: WorkProject[]
}

export function WorkGrid({ projects }: WorkGridProps) {
  const [active, setActive] = useState('All')

  const filtered = active === 'All'
    ? projects
    : active === 'Video'
    ? projects.filter((p) => p.isVideo)
    : projects.filter((p) => p.pillar === active || p.category.includes(active))

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-10">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`font-mono text-[9px] tracking-[2px] uppercase px-[14px] py-[7px] rounded-[2px] transition-colors ${
              active === f
                ? 'bg-orange text-white'
                : 'border border-dark-border text-[#555] hover:border-[#555] hover:text-[#aaa]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Editorial grid: 12-col */}
      <div className="grid grid-cols-12 gap-3">
        {filtered.map((project, i) => {
          // First project: hero (7 cols)
          if (i === 0) return (
            <WorkCard key={project.id} project={project} index={i}
              className="col-span-12 md:col-span-7" imageHeight={520} />
          )
          // Second project: tall (5 cols)
          if (i === 1) return (
            <WorkCard key={project.id} project={project} index={i}
              className="col-span-12 md:col-span-5" imageHeight={520} />
          )
          // Third project: wide (7 cols)
          if (i === 2) return (
            <WorkCard key={project.id} project={project} index={i}
              className="col-span-12 md:col-span-7" imageHeight={280} />
          )
          // Fourth project (5 cols)
          if (i === 3) return (
            <WorkCard key={project.id} project={project} index={i}
              className="col-span-12 md:col-span-5" imageHeight={280} />
          )
          // Remaining: 4 cols each
          return (
            <WorkCard key={project.id} project={project} index={i}
              className="col-span-12 md:col-span-4" imageHeight={240} />
          )
        })}

        {/* Coming soon card */}
        <div className="col-span-12 md:col-span-4 bg-[#111110] border border-[#1f1f1c] rounded flex flex-col items-center justify-center gap-3 min-h-[240px]">
          <div className="opacity-10 text-orange font-mono text-4xl">×</div>
          <span className="font-mono text-[9px] tracking-[3px] text-[#333] uppercase">Next Project</span>
          <span className="font-mono text-[8px] tracking-[1px] text-[#222] uppercase">In production</span>
        </div>
      </div>

      <p className="mt-6 font-mono text-[10px] tracking-[2px] text-[#444]">
        Showing {filtered.length} project{filtered.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
```

- [ ] **Step 3: Create Work page**

```typescript
// src/app/work/page.tsx
import { getWorkProjects } from '@/lib/notion'
import { WorkGrid } from '@/components/work/WorkGrid'

export const revalidate = 3600

export default async function WorkPage() {
  const projects = await getWorkProjects()

  return (
    <main className="bg-black min-h-screen pt-24 px-6 md:px-10 pb-20">
      <div className="max-w-site mx-auto">
        <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-4">
          Selected Work
        </p>
        <h1 className="font-headline font-bold text-[clamp(36px,5vw,72px)] tracking-tightest text-white mb-3 leading-none">
          Work
        </h1>
        <p className="text-[14px] text-[#444] mb-12">
          Business Creation · Creative Production · All powered by AI
        </p>
        <WorkGrid projects={projects} />
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Verify work page loads**

```bash
npm run dev
```

Open `http://localhost:3000/work`. Confirm: editorial grid renders, filter tabs work, cards show project images.

- [ ] **Step 5: Commit**

```bash
git add src/app/work/page.tsx src/components/work/WorkCard.tsx src/components/work/WorkGrid.tsx
git commit -m "feat: add Work page with editorial grid and filter tabs"
```

---

## Task 3: Case Study Page

**Files:**
- Create: `src/app/work/[slug]/page.tsx`

- [ ] **Step 1: Create case study page**

```typescript
// src/app/work/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getWorkProject, getWorkProjects } from '@/lib/notion'

export const revalidate = 3600

export async function generateStaticParams() {
  const projects = await getWorkProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export default async function CaseStudyPage({
  params,
}: {
  params: { slug: string }
}) {
  const project = await getWorkProject(params.slug)
  if (!project) notFound()

  const allProjects = await getWorkProjects()
  const currentIndex = allProjects.findIndex((p) => p.slug === params.slug)
  const prev = allProjects[currentIndex - 1] ?? null
  const next = allProjects[currentIndex + 1] ?? null

  return (
    <main className="bg-black min-h-screen">

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
        {project.isVideo ? (
          <div className="w-full h-full bg-[#1a1a17] flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border border-orange/30 flex items-center justify-center text-orange/60 text-3xl">▶</div>
          </div>
        ) : project.coverUrl ? (
          <Image src={project.coverUrl} alt={project.title} fill className="object-cover object-top" priority />
        ) : (
          <div className="w-full h-full bg-dark-surface" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-10">
          <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-3">
            {project.category}
          </p>
          <h1 className="font-headline font-bold text-[clamp(32px,5vw,72px)] tracking-tightest text-white leading-none">
            {project.title}
          </h1>
        </div>
      </section>

      {/* Body */}
      <section className="px-6 md:px-10 py-20 max-w-3xl mx-auto">
        {project.description && (
          <p className="text-lg text-[#888] leading-relaxed mb-16">{project.description}</p>
        )}

        {project.brief && (
          <div className="mb-12">
            <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-4">Brief</p>
            <p className="text-base text-[#aaa] leading-relaxed">{project.brief}</p>
          </div>
        )}
        {project.challenge && (
          <div className="mb-12">
            <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-4">Challenge</p>
            <p className="text-base text-[#aaa] leading-relaxed">{project.challenge}</p>
          </div>
        )}
        {project.output && (
          <div className="mb-12">
            <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-4">Output</p>
            <p className="text-base text-[#aaa] leading-relaxed">{project.output}</p>
          </div>
        )}

        {/* Media gallery */}
        {project.mediaUrls && project.mediaUrls.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-16">
            {project.mediaUrls.map((url, i) => (
              <div key={i} className="relative aspect-square rounded overflow-hidden">
                <Image src={url} alt={`${project.title} ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Prev / Next */}
      <div className="border-t border-dark-border grid grid-cols-2">
        {prev ? (
          <Link href={`/work/${prev.slug}`} className="px-10 py-8 border-r border-dark-border hover:bg-dark-surface transition-colors group">
            <p className="font-mono text-[9px] tracking-[2px] text-[#444] uppercase mb-2">← Previous</p>
            <p className="font-headline font-bold text-white text-lg tracking-tight group-hover:text-orange transition-colors">{prev.title}</p>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`/work/${next.slug}`} className="px-10 py-8 text-right hover:bg-dark-surface transition-colors group">
            <p className="font-mono text-[9px] tracking-[2px] text-[#444] uppercase mb-2">Next →</p>
            <p className="font-headline font-bold text-white text-lg tracking-tight group-hover:text-orange transition-colors">{next.title}</p>
          </Link>
        ) : <div />}
      </div>

    </main>
  )
}
```

- [ ] **Step 2: Test case study navigation**

Navigate to `/work`, click a project. Confirm: hero image fills viewport, body sections appear, prev/next links work.

- [ ] **Step 3: Commit**

```bash
git add src/app/work/[slug]/page.tsx
git commit -m "feat: add case study page with hero, body sections, and prev/next nav"
```

---

## Task 4: Courses Page

**Files:**
- Create: `src/app/courses/page.tsx`

- [ ] **Step 1: Create Courses page**

```typescript
// src/app/courses/page.tsx
import Image from 'next/image'
import { getCourses } from '@/lib/notion'
import type { Course } from '@/types'

export const revalidate = 3600

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="bg-dark-surface border border-dark-border rounded overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        {course.thumbnailUrl ? (
          <Image src={course.thumbnailUrl} alt={course.title} fill className="object-cover group-hover:scale-[1.04] transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-dark-border flex items-center justify-center">
            <span className="font-mono text-[9px] tracking-[2px] text-[#333] uppercase">Course</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <p className="font-mono text-[9px] tracking-[2px] text-orange uppercase mb-2">{course.category}</p>
        <h3 className="font-headline font-bold text-white text-lg tracking-tight mb-3">{course.title}</h3>
        <p className="text-[13px] text-[#555] leading-relaxed mb-5">{course.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-headline font-bold text-white text-lg">
            {course.price === 0 ? 'Free' : `$${course.price}`}
          </span>
          <a
            href={course.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange text-white font-mono text-[10px] tracking-[1.5px] uppercase px-5 py-2.5 rounded-[2px] hover:opacity-85 transition-opacity"
          >
            Enroll →
          </a>
        </div>
      </div>
    </div>
  )
}

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <main className="bg-black min-h-screen pt-24 px-6 md:px-10 pb-20">
      <div className="max-w-site mx-auto">
        <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-4">Learn</p>
        <h1 className="font-headline font-bold text-[clamp(36px,5vw,72px)] tracking-tightest text-white mb-3 leading-none">
          Courses
        </h1>
        <p className="text-[14px] text-[#444] mb-12 max-w-xl">
          Build brands, produce content, and launch businesses — learn the systems we use every day.
        </p>

        {courses.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-mono text-[9px] tracking-[3px] text-[#333] uppercase">Coming Soon</p>
            <p className="text-[#555] mt-3 text-sm">Our first courses are in production.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Verify page at `/courses`**

If no Notion courses exist yet, expect "Coming Soon" state. If courses exist, confirm grid renders with external Enroll links.

- [ ] **Step 3: Commit**

```bash
git add src/app/courses/page.tsx
git commit -m "feat: add Courses catalog page with Notion CMS and external enroll links"
```

---

## Task 5: Services Page

**Files:**
- Create: `src/app/services/page.tsx`

- [ ] **Step 1: Create Services page (hardcoded)**

```typescript
// src/app/services/page.tsx
import { Tag } from '@/components/ui/Tag'
import { Button } from '@/components/ui/Button'
import { PixelIcon } from '@/components/ui/PixelIcon'

const PILLAR_ONE_SERVICES = [
  { name: 'Brand Strategy', desc: 'Positioning, messaging framework, and competitive differentiation.' },
  { name: 'Identity Design', desc: 'Logo, visual system, typography, color, and brand guidelines.' },
  { name: 'Business Systems', desc: 'Notion-based ops, SOPs, client workflows, and growth infrastructure.' },
  { name: 'AI Workflow Design', desc: 'Custom AI toolchains to accelerate your team\'s output.' },
]

const PILLAR_TWO_SERVICES = [
  { name: 'Content Strategy', desc: 'Editorial calendar, platform strategy, and content pillars.' },
  { name: 'Video Production', desc: 'Concept to delivery — commercial, editorial, or social formats.' },
  { name: 'Photo Direction', desc: 'Campaign art direction, AI-assisted photo generation and editing.' },
  { name: 'Distribution', desc: 'Platform-native publishing, paid amplification, and performance tracking.' },
]

export default function ServicesPage() {
  return (
    <main className="bg-black min-h-screen pt-16">

      {/* Pillar 01 — dark */}
      <section className="px-6 md:px-16 py-24 border-b border-dark-border relative overflow-hidden">
        <div className="max-w-2xl">
          <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-6">Pillar 01</p>
          <h1 className="font-headline font-bold text-[clamp(36px,5vw,72px)] tracking-tightest text-white leading-none mb-6">
            Business<br />Creation
          </h1>
          <p className="text-[15px] text-[#555] leading-relaxed mb-12 max-w-lg">
            From zero to brand. We build the identity, strategy, and systems founders need to launch with confidence and scale with clarity.
          </p>

          <div className="space-y-6 mb-14">
            {PILLAR_ONE_SERVICES.map((s) => (
              <div key={s.name} className="border-t border-dark-border pt-5">
                <h3 className="font-headline font-bold text-white text-lg tracking-tight mb-1">{s.name}</h3>
                <p className="text-[13px] text-[#555] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <Button variant="primary" href="/contact">Start a Project →</Button>
        </div>
        <div className="absolute bottom-10 right-10 opacity-[0.05]">
          <PixelIcon name="x" size={24} />
        </div>
      </section>

      {/* Pillar 02 — light */}
      <section className="bg-white px-6 md:px-16 py-24 relative overflow-hidden">
        <div className="max-w-2xl">
          <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-6">Pillar 02</p>
          <h2 className="font-headline font-bold text-[clamp(36px,5vw,72px)] tracking-tightest text-black leading-none mb-6">
            Creative<br />Production
          </h2>
          <p className="text-[15px] text-[#666] leading-relaxed mb-12 max-w-lg">
            From idea to distribution. We produce the content, campaigns, and creative assets that make brands move in culture.
          </p>

          <div className="space-y-6 mb-14">
            {PILLAR_TWO_SERVICES.map((s) => (
              <div key={s.name} className="border-t border-[#e8e7e3] pt-5">
                <h3 className="font-headline font-bold text-black text-lg tracking-tight mb-1">{s.name}</h3>
                <p className="text-[13px] text-[#888] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <Button variant="primary" href="/contact">Start a Project →</Button>
        </div>
        <div className="absolute bottom-10 right-10 opacity-[0.05]">
          <PixelIcon name="plus" size={24} color="#12120f" />
        </div>
      </section>

    </main>
  )
}
```

- [ ] **Step 2: Verify `/services`**

Confirm two full-width sections render — dark (Pillar 01) and light (Pillar 02) — with service lists and CTAs.

- [ ] **Step 3: Commit**

```bash
git add src/app/services/page.tsx
git commit -m "feat: add Services page with two hardcoded pillar sections"
```

---

## Task 6: Insights Page + Article

**Files:**
- Create: `src/components/insights/InsightCard.tsx`
- Create: `src/app/insights/page.tsx`
- Create: `src/app/insights/[slug]/page.tsx`

- [ ] **Step 1: Create InsightCard**

```typescript
// src/components/insights/InsightCard.tsx
import Image from 'next/image'
import Link from 'next/link'
import type { Insight } from '@/types'

export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <Link href={`/insights/${insight.slug}`} className="group block bg-dark-surface border border-dark-border rounded overflow-hidden hover:border-orange/30 transition-colors">
      <div className="relative h-44 overflow-hidden">
        {insight.coverUrl ? (
          <Image src={insight.coverUrl} alt={insight.title} fill className="object-cover group-hover:scale-[1.04] transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-dark-border" />
        )}
      </div>
      <div className="p-5">
        <div className="flex gap-2 flex-wrap mb-3">
          {insight.tag.slice(0, 2).map((t) => (
            <span key={t} className="font-mono text-[8px] tracking-[1.5px] uppercase bg-orange/10 text-orange px-2 py-1 rounded-[2px]">{t}</span>
          ))}
        </div>
        <h3 className="font-headline font-bold text-white text-base tracking-tight leading-snug mb-2 group-hover:text-orange transition-colors">
          {insight.title}
        </h3>
        <p className="text-[12px] text-[#555] leading-relaxed line-clamp-2">{insight.excerpt}</p>
        {insight.date && (
          <p className="font-mono text-[9px] tracking-[1px] text-[#333] mt-3">
            {new Date(insight.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        )}
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Create Insights page**

```typescript
// src/app/insights/page.tsx
import { getInsights } from '@/lib/notion'
import { InsightCard } from '@/components/insights/InsightCard'

export const revalidate = 3600

export default async function InsightsPage() {
  const insights = await getInsights()

  return (
    <main className="bg-black min-h-screen pt-24 px-6 md:px-10 pb-20">
      <div className="max-w-site mx-auto">
        <p className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-4">Perspectives</p>
        <h1 className="font-headline font-bold text-[clamp(36px,5vw,72px)] tracking-tightest text-white mb-12 leading-none">
          Insights
        </h1>

        {insights.length === 0 ? (
          <div className="text-center py-32">
            <p className="font-mono text-[9px] tracking-[3px] text-[#333] uppercase">Coming Soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Create Article page**

```typescript
// src/app/insights/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getInsight, getInsights, getInsightPageBlocks } from '@/lib/notion'

export const revalidate = 3600

export async function generateStaticParams() {
  const insights = await getInsights()
  return insights.map((i) => ({ slug: i.slug }))
}

// Minimal Notion block renderer
function renderBlock(block: any): React.ReactNode {
  const { type, id } = block
  const value = block[type]

  const richText = (texts: any[]) =>
    texts?.map((t: any, i: number) => {
      let content: React.ReactNode = t.plain_text
      if (t.annotations?.bold) content = <strong key={i}>{content}</strong>
      if (t.annotations?.italic) content = <em key={i}>{content}</em>
      if (t.annotations?.code) content = <code key={i} className="bg-dark-surface px-1.5 py-0.5 rounded text-orange text-sm font-mono">{content}</code>
      return content
    })

  switch (type) {
    case 'paragraph':
      return <p key={id} className="text-[15px] text-[#999] leading-relaxed mb-5">{richText(value.rich_text)}</p>
    case 'heading_1':
      return <h2 key={id} className="font-headline font-bold text-3xl tracking-tight text-white mt-12 mb-4">{richText(value.rich_text)}</h2>
    case 'heading_2':
      return <h3 key={id} className="font-headline font-bold text-2xl tracking-tight text-white mt-10 mb-3">{richText(value.rich_text)}</h3>
    case 'heading_3':
      return <h4 key={id} className="font-headline font-bold text-xl tracking-tight text-white mt-8 mb-2">{richText(value.rich_text)}</h4>
    case 'bulleted_list_item':
      return <li key={id} className="text-[15px] text-[#999] leading-relaxed mb-2 ml-4">{richText(value.rich_text)}</li>
    case 'quote':
      return <blockquote key={id} className="border-l-2 border-orange pl-5 my-6 text-[15px] text-[#777] italic leading-relaxed">{richText(value.rich_text)}</blockquote>
    case 'image':
      const src = value.type === 'external' ? value.external.url : value.file.url
      return <div key={id} className="my-8 rounded overflow-hidden"><Image src={src} alt="" width={800} height={500} className="w-full object-cover" /></div>
    default:
      return null
  }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const insight = await getInsight(params.slug)
  if (!insight) notFound()

  const blocks = await getInsightPageBlocks(insight.id)

  return (
    <main className="bg-black min-h-screen pt-24">
      {/* Hero */}
      {insight.coverUrl && (
        <div className="relative h-[50vh] min-h-[320px] overflow-hidden">
          <Image src={insight.coverUrl} alt={insight.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
      )}

      <article className="px-6 md:px-10 py-16 max-w-2xl mx-auto">
        <div className="flex gap-2 flex-wrap mb-6">
          {insight.tag.map((t) => (
            <span key={t} className="font-mono text-[8px] tracking-[1.5px] uppercase bg-orange/10 text-orange px-2 py-1 rounded-[2px]">{t}</span>
          ))}
        </div>
        <h1 className="font-headline font-bold text-[clamp(28px,4vw,52px)] tracking-tightest text-white leading-tight mb-4">
          {insight.title}
        </h1>
        {insight.date && (
          <p className="font-mono text-[10px] tracking-[2px] text-[#444] mb-10">
            {new Date(insight.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
        <div>{blocks.map(renderBlock)}</div>
      </article>
    </main>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/insights/InsightCard.tsx src/app/insights/page.tsx src/app/insights/[slug]/page.tsx
git commit -m "feat: add Insights blog page and article page with Notion block renderer"
```

---

## Task 7: Contact Page + API Route

**Files:**
- Create: `src/components/contact/ContactForm.tsx`
- Create: `src/app/contact/page.tsx`
- Create: `src/app/api/contact/route.ts`

- [ ] **Step 1: Create ContactForm client component**

```typescript
// src/components/contact/ContactForm.tsx
'use client'

import { useState } from 'react'
import type { ContactFormData } from '@/types'

type Status = 'idle' | 'loading' | 'success' | 'error'

const BUDGET_OPTIONS = ['Under $5k', '$5k–$15k', '$15k–$50k', '$50k+']

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState<ContactFormData>({
    name: '', company: '', building: '', budget: '', source: '',
  })

  const set = (field: keyof ContactFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-16">
        <div className="font-mono text-[9px] tracking-[3px] text-orange uppercase mb-4">Message received</div>
        <h2 className="font-headline font-bold text-3xl tracking-tight text-white mb-3">We'll be in touch.</h2>
        <p className="text-[#555] text-sm">Usually within 24 hours.</p>
      </div>
    )
  }

  const inputCls = 'w-full bg-dark-surface border border-dark-border text-white font-body text-[14px] px-4 py-3.5 rounded-[2px] focus:outline-none focus:border-orange transition-colors placeholder:text-[#333]'
  const labelCls = 'font-mono text-[9px] tracking-[2px] text-[#444] uppercase mb-2 block'

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Name *</label>
          <input required value={form.name} onChange={set('name')} placeholder="Your name" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Company</label>
          <input value={form.company} onChange={set('company')} placeholder="Company or project" className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>What are you building? *</label>
        <textarea required value={form.building} onChange={set('building')} placeholder="Tell us about your idea, project, or challenge..." rows={5} className={`${inputCls} resize-none`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Budget Range</label>
          <select value={form.budget} onChange={set('budget')} className={inputCls}>
            <option value="">Select budget</option>
            {BUDGET_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>How did you hear about us?</label>
          <input value={form.source} onChange={set('source')} placeholder="Referral, social, search..." className={inputCls} />
        </div>
      </div>

      {status === 'error' && (
        <p className="text-[13px] text-red-400">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-orange text-white font-mono font-bold text-[11px] tracking-[2px] uppercase px-8 py-4 rounded-[2px] hover:opacity-85 transition-opacity disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message →'}
      </button>
    </form>
  )
}
```

- [ ] **Step 2: Create Contact page**

```typescript
// src/app/contact/page.tsx
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
        <h1 className="font-headline font-bold text-[clamp(36px,5vw,72px)] tracking-tightest text-white leading-none mb-4">
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
```

- [ ] **Step 3: Create API route**

```typescript
// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createContact } from '@/lib/notion'
import type { ContactFormData } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body: ContactFormData = await req.json()

    if (!body.name?.trim() || !body.building?.trim()) {
      return NextResponse.json({ error: 'Name and building are required' }, { status: 400 })
    }

    await createContact({
      name: body.name.trim(),
      company: body.company?.trim() ?? '',
      building: body.building.trim(),
      budget: body.budget ?? '',
      source: body.source?.trim() ?? '',
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 4: Test contact form**

```bash
npm run dev
```

Open `http://localhost:3000/contact`. Fill in Name and "What are you building?". Submit. Confirm: loading state, then success message. Check Notion Contacts database — new entry should appear.

- [ ] **Step 5: Commit**

```bash
git add src/components/contact/ContactForm.tsx src/app/contact/page.tsx src/app/api/contact/route.ts
git commit -m "feat: add Contact page with form, API route, and Notion write integration"
```

---

## Task 8: Framer Motion Page Transitions

**Files:**
- Create: `src/components/layout/PageTransition.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create PageTransition wrapper**

```typescript
// src/components/layout/PageTransition.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Wrap children in layout**

```typescript
// src/app/layout.tsx — wrap {children}
import { PageTransition } from '@/components/layout/PageTransition'

// inside <body>:
<body>
  <CustomCursor />
  <Nav />
  <PageTransition>
    {children}
  </PageTransition>
</body>
```

- [ ] **Step 3: Verify transitions**

Navigate between pages. Each route change should fade + translate the new page in. Should feel smooth, not jarring.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/PageTransition.tsx src/app/layout.tsx
git commit -m "feat: add Framer Motion page transitions"
```

---

## Task 9: Wire Homepage Featured Work to Notion

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/home/FeaturedWork.tsx`

- [ ] **Step 1: Make FeaturedWork accept props**

```typescript
// src/components/home/FeaturedWork.tsx
// Change signature to accept projects prop:
interface FeaturedWorkProps {
  projects: Pick<WorkProject, 'slug' | 'title' | 'category' | 'description' | 'coverUrl' | 'isVideo'>[]
}

export function FeaturedWork({ projects }: FeaturedWorkProps) {
  // Remove FEATURED_PROJECTS constant
  // Use projects prop instead
  // Rest of component unchanged
}
```

- [ ] **Step 2: Fetch from Notion in homepage**

```typescript
// src/app/page.tsx
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
```

- [ ] **Step 3: Verify homepage still loads with Notion data**

Open `http://localhost:3000`. Featured Work section should now show projects from Notion (or static fallback if none are featured).

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/components/home/FeaturedWork.tsx
git commit -m "feat: wire homepage Featured Work to Notion CMS"
```

---

## Task 10: Final Polish + Vercel Deploy

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Add Notion image domains to next.config.ts**

Notion file URLs use `prod-files-secure.s3.us-west-2.amazonaws.com`. Add to image domains:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
    ],
  },
}
```

- [ ] **Step 2: Build and check for errors**

```bash
npm run build
```

Expected: `✓ Compiled successfully`. Fix any TypeScript or build errors before deploying.

- [ ] **Step 3: Deploy to Vercel**

```bash
npx vercel --prod
```

When prompted: link to existing project or create new. Set environment variables in Vercel dashboard:
- `NOTION_TOKEN`
- `NOTION_WORK_DB`
- `NOTION_INSIGHTS_DB`
- `NOTION_COURSES_DB`
- `NOTION_CONTACTS_DB`

- [ ] **Step 4: Smoke-test production URL**

Open the Vercel URL. Verify:
- Homepage loads with animations
- `/work` grid renders
- `/contact` form submits successfully (check Notion)
- No console errors

- [ ] **Step 5: Final commit**

```bash
git add next.config.ts
git commit -m "feat: configure Notion image domains for production"
```

---

## Self-Review Checklist

- [x] Spec §4 Site Architecture → all 8 routes created
- [x] Spec §4 Notion databases → 4 databases (Work read, Insights read, Courses read, Contacts write)
- [x] Spec §7 /work → WorkGrid with editorial layout + filters
- [x] Spec §7 /work/[slug] → case study with hero + sections + prev/next
- [x] Spec §7 /courses → catalog with external enroll links
- [x] Spec §7 /services → two pillar sections hardcoded
- [x] Spec §7 /insights → blog grid from Notion
- [x] Spec §7 /insights/[slug] → article with Notion block renderer
- [x] Spec §7 /contact → form with 5 fields → API route → Notion write
- [x] Spec §8 Framer Motion → page transitions
- [x] ISR revalidate: 3600 on all data-fetching pages
- [x] Plan A gap: Framer Motion page transitions added in Task 8
