'use client'

import { useEffect, useRef, useMemo, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/stores/cart-store'
import {
  getCartItems,
  upsertCartItem,
  removeCartItem as removeCartItemAction,
  mergeGuestCart,
} from '@/lib/actions/cart'
import type { GuestCartItem } from '@/types/cart'

const STORAGE_KEY = 'msching-cart'
const DEBOUNCE_MS = 300

export function useCartSync() {
  const supabase = useMemo(() => createClient(), [])
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevItemsRef = useRef<string>('')

  const syncToDBDebounced = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      const { items, isLoggedIn } = useCartStore.getState()
      if (!isLoggedIn) return

      // 取得 DB 目前狀態來 diff
      const dbItems = await getCartItems()
      const dbMap = new Map(dbItems.map((i) => [i.productId, i.quantity]))

      // Upsert 有變更的
      for (const item of items) {
        if (dbMap.get(item.productId) !== item.quantity) {
          await upsertCartItem(item.productId, item.quantity)
        }
        dbMap.delete(item.productId)
      }

      // 刪除 DB 有但 store 沒有的
      for (const productId of dbMap.keys()) {
        await removeCartItemAction(productId)
      }
    }, DEBOUNCE_MS)
  }, [])

  // 監聽 store 變化，登入中時 debounce sync
  useEffect(() => {
    const unsub = useCartStore.subscribe((state) => {
      if (!state.isLoggedIn) return

      const curr = JSON.stringify(state.items.map((i) => [i.productId, i.quantity]))
      if (curr === prevItemsRef.current) return
      prevItemsRef.current = curr

      syncToDBDebounced()
    })

    return () => {
      unsub()
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [syncToDBDebounced])

  // 監聽 auth 狀態變更
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN') {
        // 1. 讀取 localStorage 中的 guest cart
        let guestItems: GuestCartItem[] = []
        try {
          const raw = localStorage.getItem(STORAGE_KEY)
          if (raw) {
            const parsed = JSON.parse(raw)
            const items = parsed?.state?.items
            if (Array.isArray(items)) {
              guestItems = items.map((i: { productId: string; quantity: number }) => ({
                productId: i.productId,
                quantity: i.quantity,
              }))
            }
          }
        } catch {
          // localStorage 解析失敗，視為空 cart
        }

        // 2. 清空 localStorage（立即清，避免帳號殘留）
        localStorage.removeItem(STORAGE_KEY)

        // 3. 切換為登入模式
        useCartStore.getState()._setLoggedIn(true)

        // 4. Merge guest cart → DB，取回合併結果
        const merged = await mergeGuestCart(guestItems)
        useCartStore.getState()._setItems(merged)
        prevItemsRef.current = JSON.stringify(
          merged.map((i) => [i.productId, i.quantity])
        )
      }

      if (event === 'SIGNED_OUT') {
        // 1. 清空 store
        useCartStore.getState().clearCart()
        // 2. 清空 localStorage
        localStorage.removeItem(STORAGE_KEY)
        // 3. 切換為訪客模式
        useCartStore.getState()._setLoggedIn(false)

        prevItemsRef.current = ''
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // 初始化：檢查目前 auth 狀態
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        useCartStore.getState()._setLoggedIn(true)
        const items = await getCartItems()
        useCartStore.getState()._setItems(items)
        prevItemsRef.current = JSON.stringify(
          items.map((i) => [i.productId, i.quantity])
        )
        // 登入狀態下清空可能殘留的 localStorage
        localStorage.removeItem(STORAGE_KEY)
      }
    })
  }, [supabase])
}
