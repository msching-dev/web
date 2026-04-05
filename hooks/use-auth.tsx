'use client'

import { useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/auth-store'

/**
 * 初始化 auth 狀態同步（只在 ClientLayout 呼叫一次）。
 * 類似 useCartSync 的角色 — 負責 Supabase → Zustand 同步。
 */
export function useAuthSync() {
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const { _setUser, _setLoading } = useAuthStore.getState()

    supabase.auth.getUser().then(({ data: { user } }) => {
      _setUser(user)
      _setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      _setUser(session?.user ?? null)
      _setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])
}

/**
 * 讀取 auth 狀態（任何元件都能用，不需 Provider）。
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const isAdmin = user?.app_metadata?.role === 'admin'

  return { user, loading, isAdmin }
}

/**
 * 從 Supabase server 取得最新 user data，寫入 Zustand store。
 * 用於 admin API 更新 user_metadata 後同步 client 端顯示。
 *
 * 為什麼用 getUser() 而不是 refreshSession()：
 *   - getUser()：GET /auth/v1/user — 查詢最新用戶資料，語意正確
 *   - refreshSession()：POST /auth/v1/token — 延長 session 壽命，語意不對
 *
 * getUser() 不會觸發 onAuthStateChange，所以需要手動更新 Zustand store。
 */
export async function refreshAuthUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  useAuthStore.getState()._setUser(user)
}
