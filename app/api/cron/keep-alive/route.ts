import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { count } = await supabaseAdmin
    .from('products')
    .select('*', { count: 'exact', head: true })

  return Response.json({ ok: true, products: count, timestamp: new Date().toISOString() })
}
