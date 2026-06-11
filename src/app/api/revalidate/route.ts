import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  revalidatePath('/', 'page')
  revalidatePath('/work', 'page')
  revalidatePath('/work/[slug]', 'page')
  revalidatePath('/insights', 'page')
  revalidatePath('/insights/[slug]', 'page')
  revalidatePath('/courses', 'page')

  return NextResponse.json({ revalidated: true, timestamp: new Date().toISOString() })
}
