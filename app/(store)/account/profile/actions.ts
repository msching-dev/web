'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

/**
 * 取得當前用戶的 customer 資料
 */
export async function getCustomerProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '未登入' }

  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('auth_id', user.id)
    .single()

  return {
    user: {
      id: user.id,
      email: user.email,
      identities: user.identities ?? [],
      user_metadata: user.user_metadata,
    },
    customer,
  }
}

/**
 * 更新 customer 基本資料（名稱、電話、地址）
 */
export async function updateProfile(formData: {
  name: string
  phone: string
  default_address: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '未登入' }

  // 手機號驗證（允許空值，但有填就要合法）
  if (formData.phone && !/^09\d{8}$/.test(formData.phone)) {
    return { error: '手機號碼格式不正確（09 開頭，共 10 碼）' }
  }

  // 先嘗試 UPDATE
  const { data, error: updateError } = await supabase
    .from('customers')
    .update({
      name: formData.name,
      phone: formData.phone,
      default_address: formData.default_address,
    })
    .eq('auth_id', user.id)
    .select('id')

  if (updateError) return { error: '更新失敗，請稍後再試' }

  // UPDATE 匹配 0 列 → 記錄不存在，改用 INSERT
  if (!data || data.length === 0) {
    const { error: insertError } = await supabase
      .from('customers')
      .insert({
        auth_id: user.id,
        email: user.email ?? '',
        name: formData.name,
        phone: formData.phone,
        default_address: formData.default_address,
      })

    if (insertError) return { error: '建立個人資料失敗，請稍後再試' }
  }

  // 同步姓名到 user_metadata，讓 Header 等 client 元件即時取得
  if (formData.name !== (user.user_metadata?.full_name ?? '')) {
    await supabase.auth.updateUser({
      data: { ...user.user_metadata, full_name: formData.name },
    })
  }

  return { success: true }
}

/**
 * 設定或變更密碼
 */
export async function setPassword(newPassword: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '未登入' }

  if (newPassword.length < 6) {
    return { error: '密碼至少需要 6 個字元' }
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) return { error: '設定密碼失敗，請稍後再試' }
  return { success: true }
}

/**
 * 更新 avatar 偏好（存在 user_metadata）
 */
export async function updateAvatar(avatar: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '未登入' }

  const { error } = await supabase.auth.updateUser({
    data: { ...user.user_metadata, preferred_avatar: avatar },
  })

  if (error) return { error: '更新失敗' }
  return { success: true }
}

/**
 * 假 email 用戶設定真實 email（admin API 直接改，繞過 double confirm）
 */
export async function updateEmail(newEmail: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '未登入' }

  // 只有假 email 用戶能用
  if (!user.email?.endsWith('@noreply.msching.com')) {
    return { error: '你已有電子信箱，無法變更' }
  }

  // 基本格式驗證
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    return { error: '電子信箱格式不正確' }
  }

  // admin API 直接改 email（繞過 double_confirm_changes）
  const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    email: newEmail,
    email_confirm: true,
  })

  if (error) {
    if (error.message?.includes('already') || error.message?.includes('unique')) {
      return { error: '此信箱已被其他帳號使用' }
    }
    return { error: '設定信箱失敗，請稍後再試' }
  }

  // 同步更新 customers 表的 email
  await supabase
    .from('customers')
    .update({ email: newEmail })
    .eq('auth_id', user.id)

  return { success: true }
}

/**
 * 解除 LINE 綁定
 */
export async function unlinkLine() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '未登入' }

  // 安全檢查：必須有其他可用的登入方式
  const hasRealEmail = !user.email?.endsWith('@noreply.msching.com')
  const hasPassword = (user.identities ?? []).some((i) => i.provider === 'email')
  const hasGoogle = (user.identities ?? []).some((i) => i.provider === 'google')

  if (!((hasRealEmail && hasPassword) || hasGoogle)) {
    return { error: '請先設定 Email 和密碼，再解除 LINE 綁定' }
  }

  const metadata = { ...user.user_metadata }
  delete metadata.line_user_id
  delete metadata.line_display_name
  // 只移除 LINE 頭像（避免誤刪 Google 頭像）
  if (metadata.avatar_url?.includes('profile.line-scdn.net')) {
    delete metadata.avatar_url
  }

  const { error } = await supabase.auth.updateUser({
    data: metadata,
  })

  if (error) return { error: '解除綁定失敗' }

  // 同步清除 customers 表的 line_user_id
  await supabase
    .from('customers')
    .update({ line_user_id: null })
    .eq('auth_id', user.id)

  return { success: true }
}

/**
 * 解除 Google 綁定
 */
export async function unlinkGoogle() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '未登入' }

  // 安全檢查：必須有其他可用的登入方式
  const hasRealEmail = !user.email?.endsWith('@noreply.msching.com')
  const hasPassword = (user.identities ?? []).some((i) => i.provider === 'email')
  const hasLine = !!user.user_metadata?.line_user_id

  if (!((hasRealEmail && hasPassword) || hasLine)) {
    return { error: '請先設定 Email 和密碼，再解除 Google 綁定' }
  }

  const googleIdentity = (user.identities ?? []).find((i) => i.provider === 'google')
  if (!googleIdentity) {
    return { error: 'Google 帳號未綁定' }
  }

  const { error } = await supabase.auth.unlinkIdentity(googleIdentity)

  if (error) return { error: '解除綁定失敗，請稍後再試' }
  return { success: true }
}
