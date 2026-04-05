import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/supabase/queries'

export async function GET() {
  try {
    const products = await getProducts()
    return NextResponse.json(products, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 })
  }
}
