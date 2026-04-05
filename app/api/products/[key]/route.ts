import { NextResponse } from 'next/server'
import { getProductBySlug } from '@/lib/supabase/queries'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params

  try {
    const data = await getProductBySlug(key)
    if (!data) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json(data.detail, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }
}
