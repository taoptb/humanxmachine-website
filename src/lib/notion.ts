// src/lib/notion.ts
import { Client } from '@notionhq/client'
import type { WorkProject, Insight, Course } from '@/types'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

// ─── Helpers ────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getText(prop: any): any {
  if (!prop) return ''
  if (prop.type === 'title') return prop.title?.[0]?.plain_text ?? ''
  if (prop.type === 'rich_text') return prop.rich_text?.[0]?.plain_text ?? ''
  if (prop.type === 'url') return prop.url ?? ''
  if (prop.type === 'select') return prop.select?.name ?? ''
  if (prop.type === 'number') return prop.number ?? 0
  if (prop.type === 'checkbox') return prop.checkbox ?? false
  if (prop.type === 'date') return prop.date?.start ?? ''
  if (prop.type === 'multi_select') return prop.multi_select?.map((s: any) => s.name) ?? [] // eslint-disable-line @typescript-eslint/no-explicit-any
  return ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getFileUrl(prop: any): string {
  if (!prop?.files?.[0]) return ''
  const file = prop.files[0]
  return file.type === 'external' ? file.external.url : file.file?.url ?? ''
}

function hasCredentials(): boolean {
  return !!(
    process.env.NOTION_TOKEN &&
    process.env.NOTION_TOKEN !== 'placeholder_not_set'
  )
}

// ─── Work ──────────────────────────────────────────────────

export async function getWorkProjects(): Promise<WorkProject[]> {
  if (!hasCredentials() || !process.env.NOTION_WORK_DB || process.env.NOTION_WORK_DB === 'placeholder_not_set') return []
  try {
    const res = await notion.databases.query({
      database_id: process.env.NOTION_WORK_DB,
      filter: { property: 'Published', checkbox: { equals: true } },
      sorts: [{ property: 'Featured', direction: 'descending' }],
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      featured: Boolean(getText(page.properties.Featured)),
      isVideo: Boolean(getText(page.properties.IsVideo)),
    }))
  } catch {
    return []
  }
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
  if (!hasCredentials() || !process.env.NOTION_INSIGHTS_DB || process.env.NOTION_INSIGHTS_DB === 'placeholder_not_set') return []
  try {
    const res = await notion.databases.query({
      database_id: process.env.NOTION_INSIGHTS_DB,
      filter: { property: 'Published', checkbox: { equals: true } },
      sorts: [{ property: 'Date', direction: 'descending' }],
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return res.results.map((page: any) => ({
      id: page.id,
      slug: getText(page.properties.Slug),
      title: getText(page.properties.Title),
      excerpt: getText(page.properties.Excerpt),
      tag: (getText(page.properties.Tag) as any) ?? [], // eslint-disable-line @typescript-eslint/no-explicit-any
      coverUrl: getFileUrl(page.properties.Cover),
      date: getText(page.properties.Date),
    }))
  } catch {
    return []
  }
}

export async function getInsight(slug: string): Promise<Insight | null> {
  const all = await getInsights()
  return all.find((i) => i.slug === slug) ?? null
}

export async function getInsightPageBlocks(pageId: string): Promise<any[]> { // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!hasCredentials()) return []
  try {
    const res = await notion.blocks.children.list({ block_id: pageId })
    return res.results
  } catch {
    return []
  }
}

// ─── Courses ───────────────────────────────────────────────

export async function getCourses(): Promise<Course[]> {
  if (!hasCredentials() || !process.env.NOTION_COURSES_DB || process.env.NOTION_COURSES_DB === 'placeholder_not_set') return []
  try {
    const res = await notion.databases.query({
      database_id: process.env.NOTION_COURSES_DB,
      filter: { property: 'Active', checkbox: { equals: true } },
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return res.results.map((page: any) => ({
      id: page.id,
      title: getText(page.properties.Name),
      category: getText(page.properties.Category),
      description: getText(page.properties.Description),
      price: Number(getText(page.properties.Price)) || 0,
      thumbnailUrl: getFileUrl(page.properties.Thumbnail),
      externalUrl: getText(page.properties.ExternalURL),
      active: true,
    }))
  } catch {
    return []
  }
}

// ─── Contact (write) ───────────────────────────────────────

export async function createContact(data: {
  name: string
  company: string
  building: string
  budget: string
  source: string
}) {
  if (!hasCredentials() || !process.env.NOTION_CONTACTS_DB || process.env.NOTION_CONTACTS_DB === 'placeholder_not_set') {
    throw new Error('Notion credentials not configured')
  }
  await notion.pages.create({
    parent: { database_id: process.env.NOTION_CONTACTS_DB },
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
