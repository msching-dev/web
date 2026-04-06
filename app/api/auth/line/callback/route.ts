import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

interface LineTokenResponse {
  access_token: string
  token_type: string
  refresh_token: string
  expires_in: number
  scope: string
  id_token: string
}

interface LineProfile {
  userId: string
  displayName: string
  pictureUrl?: string
  statusMessage?: string
}

/**
 * 從 LINE token 交換並取得 profile + email
 */
async function exchangeAndGetProfile(code: string, redirectUri: string) {
  const clientId = process.env.LINE_CHANNEL_ID!
  const clientSecret = process.env.LINE_CHANNEL_SECRET!

  // 交換 authorization code 換 access token
  const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  if (!tokenRes.ok) {
    const text = await tokenRes.text()
    throw new Error(`LINE token exchange failed: ${text}`)
  }

  const tokenData: LineTokenResponse = await tokenRes.json()

  // 用 access token 取得用戶 profile
  const profileRes = await fetch('https://api.line.me/v2/profile', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  })

  if (!profileRes.ok) {
    const text = await profileRes.text()
    throw new Error(`LINE profile fetch failed: ${text}`)
  }

  const profile: LineProfile = await profileRes.json()

  // 透過 LINE verify endpoint 驗證 id_token 並取得 email
  let email: string | undefined
  if (tokenData.id_token) {
    try {
      const verifyRes = await fetch('https://api.line.me/oauth2/v2.1/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          id_token: tokenData.id_token,
          client_id: process.env.LINE_CHANNEL_ID!,
        }),
      })
      if (verifyRes.ok) {
        const verified = await verifyRes.json()
        email = verified.email
      }
    } catch {
      // email 取不到不阻擋登入
    }
  }

  return { profile, email }
}

/**
 * GET /api/auth/line/callback
 * LINE 授權後的回調
 *
 * 兩種模式：
 * 1. 登入模式（預設）— 交換 token → 查找/建立用戶 → 產生 session
 * 2. 綁定模式（cookie line_oauth_link=true）— 只更新當前用戶的 metadata
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  if (error) {
    return NextResponse.redirect(`${origin}/account?error=line_auth_denied`)
  }

  // 驗證 state 防 CSRF
  const cookieStore = await cookies()
  const savedState = cookieStore.get('line_oauth_state')?.value
  const isLink = cookieStore.get('line_oauth_link')?.value === 'true'
  cookieStore.delete('line_oauth_state')
  cookieStore.delete('line_oauth_link')

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(`${origin}/account?error=invalid_state`)
  }

  const redirectUri = `${origin}/api/auth/line/callback`

  try {
    const { profile, email } = await exchangeAndGetProfile(code, redirectUri)

    // ── 綁定模式：已登入用戶綁定 LINE ──
    if (isLink) {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        return NextResponse.redirect(`${origin}/account?error=not_logged_in`)
      }

      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        user_metadata: {
          ...user.user_metadata,
          line_user_id: profile.userId,
          line_display_name: profile.displayName,
          avatar_url: profile.pictureUrl,
        },
      })

      // 同步 line_user_id 到 customers 表
      await supabaseAdmin
        .from('customers')
        .update({ line_user_id: profile.userId })
        .eq('auth_id', user.id)

      return NextResponse.redirect(`${origin}/account/profile?line_linked=true`)
    }

    // ── 登入模式：查找或建立用戶 ──
    const lineMetadata = {
      line_user_id: profile.userId,
      line_display_name: profile.displayName,
      avatar_url: profile.pictureUrl,
    }

    let userId: string

    // 1. 透過 customers 表查找已綁定 LINE 的帳號（O(1) 查詢，不受用戶量影響）
    const { data: lineCustomer } = await supabaseAdmin
      .from('customers')
      .select('auth_id')
      .eq('line_user_id', profile.userId)
      .maybeSingle()

    if (lineCustomer?.auth_id) {
      // 已綁定 LINE → 更新 auth metadata
      userId = lineCustomer.auth_id
      const { data: existingUser } = await supabaseAdmin.auth.admin.getUserById(userId)
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: { ...existingUser.user?.user_metadata, ...lineMetadata },
      })
    } else if (email) {
      // 2. 有 email → 透過 customers 表查同 email 帳號（自動合併）
      const { data: emailCustomer } = await supabaseAdmin
        .from('customers')
        .select('auth_id')
        .eq('email', email)
        .maybeSingle()

      if (emailCustomer?.auth_id) {
        userId = emailCustomer.auth_id
        const { data: existingUser } = await supabaseAdmin.auth.admin.getUserById(userId)
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: { ...existingUser.user?.user_metadata, ...lineMetadata },
        })
        // 同步 line_user_id 到 customers 表
        await supabaseAdmin
          .from('customers')
          .update({ line_user_id: profile.userId })
          .eq('auth_id', userId)
      } else {
        // 建立新用戶
        const { data: newUser, error: createError } =
          await supabaseAdmin.auth.admin.createUser({
            email,
            email_confirm: true,
            user_metadata: { ...lineMetadata, provider: 'line' },
          })

        if (createError || !newUser.user) {
          console.error('Failed to create user:', createError)
          return NextResponse.redirect(`${origin}/account?error=create_user_failed`)
        }
        userId = newUser.user.id
        // trigger 會自動建 customer 並寫入 line_user_id
      }
    } else {
      // 3. 沒 email → 用 placeholder email（用自有網域避免碰撞）
      const { data: newUser, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email: `line_${profile.userId}@noreply.msching.com`,
          email_confirm: true,
          user_metadata: { ...lineMetadata, provider: 'line' },
        })

      if (createError || !newUser.user) {
        console.error('Failed to create user:', createError)
        return NextResponse.redirect(`${origin}/account?error=create_user_failed`)
      }
      userId = newUser.user.id
      // trigger 會自動建 customer 並寫入 line_user_id
    }

    // 產生 session（magic link → verifyOtp）
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId)
    const { data: sessionData, error: sessionError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: userData.user?.email || '',
      })

    if (sessionError || !sessionData.properties?.hashed_token) {
      console.error('Failed to generate session link:', sessionError)
      return NextResponse.redirect(`${origin}/account?error=session_failed`)
    }

    return NextResponse.redirect(
      `${origin}/auth/callback?token_hash=${sessionData.properties.hashed_token}&type=magiclink`
    )
  } catch (err) {
    console.error('LINE auth error:', err)
    return NextResponse.redirect(`${origin}/account?error=line_auth_error`)
  }
}
