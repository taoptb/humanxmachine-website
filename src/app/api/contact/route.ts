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
