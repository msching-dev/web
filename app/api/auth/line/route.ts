import { NextResponse } from 'next/server'
import { randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'

/**
 * GET /api/auth/line
 * 發起 LINE Login — 手動組授權 URL，繞過 Supabase Custom OIDC（不支援 HS256）
 *
 * Query params:
 *   ?link=true — 已登入用戶綁定 LINE（不建立新帳號，只更新 metadata）
 */
export async function GET(request: Request) {
  const clientId = process.env.LINE_CHANNEL_ID
  if (!clientId) {
    return NextResponse.json({ error: 'LINE_CHANNEL_ID not configured' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const isLink = searchParams.get('link') === 'true'

  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const redirectUri = `${origin}/api/auth/line/callback`
  const state = randomBytes(16).toString('hex')

  // 儲存 state + link mode 到 cookie
  const cookieStore = await cookies()
  cookieStore.set('line_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })
  if (isLink) {
    cookieStore.set('line_oauth_link', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    })
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope: 'openid profile email',
  })

  return NextResponse.redirect(
    `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`
  )
}
