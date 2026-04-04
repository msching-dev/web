import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as 'magiclink' | 'email' | undefined
  // 防止 open redirect：只允許相對路徑，不允許 // 開頭
  const rawNext = searchParams.get('next') ?? '/'
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/'

  const supabase = await createClient()

  // LINE Login 回調（透過 magic link token）
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    })
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Google / Email 回調（標準 PKCE code exchange）
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // 認證失敗 → 導回登入頁
  return NextResponse.redirect(`${origin}/account?error=auth_failed`)
}
