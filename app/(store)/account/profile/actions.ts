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

  const { data: customer } = await supabaseAdmin
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

  const { error } = await supabaseAdmin
    .from('customers')
    .update({
      name: formData.name,
      phone: formData.phone,
      default_address: formData.default_address,
      updated_at: new Date().toISOString(),
    })
    .eq('auth_id', user.id)

  if (error) return { error: '更新失敗，請稍後再試' }
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

  const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    password: newPassword,
  })

  if (error) return { error: '設定密碼失敗，請稍後再試' }
  return { success: true }
}

/**
 * 解除 LINE 綁定
 */
export async function unlinkLine() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '未登入' }

  const metadata = { ...user.user_metadata }
  delete metadata.line_user_id
  delete metadata.line_display_name
  // 只移除 LINE 頭像（避免誤刪 Google 頭像）
  if (metadata.avatar_url?.includes('profile.line-scdn.net')) {
    delete metadata.avatar_url
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    user_metadata: metadata,
  })

  if (error) return { error: '解除綁定失敗' }

  // 同步清除 customers 表的 line_user_id
  await supabaseAdmin
    .from('customers')
    .update({ line_user_id: null })
    .eq('auth_id', user.id)

  return { success: true }
}
