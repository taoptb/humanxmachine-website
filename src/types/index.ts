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
