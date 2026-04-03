import { updateSession } from '@/lib/supabase/middleware'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // 跳過靜態資源和 API routes 以外的所有路由
    '/((?!_next/static|_next/image|favicon.ico|images|json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
