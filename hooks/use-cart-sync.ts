'use client'

import { useEffect, useRef, useMemo, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCartStore, STORAGE_KEY } from '@/stores/cart-store'
import {
  getCartItems,
  upsertCartItem,
  removeCartItem as removeCartItemAction,
  mergeGuestCart,
} from '@/lib/actions/cart'
import type { CartItem, GuestCartItem } from '@/types/cart'

const DEBOUNCE_MS = 300

/** 從 localStorage 讀取 guest cart items */
function readLocalCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/** 寫入 guest cart items 到 localStorage */
function writeLocalCart(items: CartItem[]) {
  if (items.length === 0) {
    localStorage.removeItem(STORAGE_KEY)
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }
}

/** 從 localStorage 讀取 guest items 作為合併用的精簡格式 */
function readGuestItemsForMerge(): GuestCartItem[] {
  const items = readLocalCart()
  return items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
}

export function useCartSync() {
  const supabase = useMemo(() => createClient(), [])
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevItemsRef = useRef<string>('')
  const isSyncingRef = useRef(false)
  const hasInitializedRef = useRef(false)

  const syncToDBDebounced = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      const { items, isLoggedIn } = useCartStore.getState()
      if (!isLoggedIn || isSyncingRef.current) return

      isSyncingRef.current = true
      try {
        const dbItems = await getCartItems()
        const dbMap = new Map(dbItems.map((i) => [i.productId, i.quantity]))

        for (const item of items) {
          if (dbMap.get(item.productId) !== item.quantity) {
            const result = await upsertCartItem(item.productId, item.quantity)
            if (!result.success) {
              console.warn('[cart-sync] upsertCartItem failed:', item.productId)
            }
          }
          dbMap.delete(item.productId)
        }

        for (const productId of dbMap.keys()) {
          await removeCartItemAction(productId)
        }
      } catch (err) {
        console.warn('[cart-sync] DB sync failed:', err)
      } finally {
        isSyncingRef.current = false
      }
    }, DEBOUNCE_MS)
  }, [])

  // 初始化：根據 auth 狀態從正確的來源載入購物車
  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          // 登入用戶：從 DB 載入
          useCartStore.getState()._setLoggedIn(true)
          const items = await getCartItems()
          useCartStore.getState()._setItems(items)
          prevItemsRef.current = JSON.stringify(
            items.map((i) => [i.productId, i.quantity])
          )
          // 清空可能殘留的 localStorage
          localStorage.removeItem(STORAGE_KEY)
        } else {
          // 訪客：從 localStorage 載入
          const items = readLocalCart()
          if (items.length > 0) {
            useCartStore.getState()._setItems(items)
          }
        }
      } finally {
        // Fix #5: 不管成功或失敗都標記 hydrated，避免永遠卡在骨架屏
        useCartStore.getState()._setHydrated(true)
        hasInitializedRef.current = true
      }
    }

    init()
  }, [supabase])

  // 監聽 store items 變化 → 寫入正確的持久化層
  useEffect(() => {
    const unsub = useCartStore.subscribe((state, prevState) => {
      if (state.items === prevState.items) return
      if (!state.isHydrated) return

      if (state.isLoggedIn) {
        const curr = JSON.stringify(state.items.map((i) => [i.productId, i.quantity]))
        if (curr === prevItemsRef.current) return
        prevItemsRef.current = curr
        syncToDBDebounced()
      } else {
        writeLocalCart(state.items)
      }
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
        // Fix #1: 跳過初始化階段的 INITIAL_SESSION 事件，init() 已經處理了
        if (!hasInitializedRef.current) return

        const guestItems = readGuestItemsForMerge()
        localStorage.removeItem(STORAGE_KEY)

        useCartStore.getState()._setLoggedIn(true)

        try {
          const merged = await mergeGuestCart(guestItems)
          useCartStore.getState()._setItems(merged)
          prevItemsRef.current = JSON.stringify(
            merged.map((i) => [i.productId, i.quantity])
          )
        } catch {
          // merge 失敗時至少從 DB 載入
          try {
            const items = await getCartItems()
            useCartStore.getState()._setItems(items)
          } catch {
            // DB 也失敗，保持空購物車
          }
        }
      }

      if (event === 'SIGNED_OUT') {
        // Fix #11: 先切換為訪客模式，再清 cart，避免 subscribe 觸發 DB sync
        useCartStore.getState()._setLoggedIn(false)
        useCartStore.getState().clearCart()
        localStorage.removeItem(STORAGE_KEY)
        prevItemsRef.current = ''
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])
}
