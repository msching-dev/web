import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, CartItemInput } from '@/types/cart'

interface CartState {
  items: CartItem[]
  isHydrated: boolean
  isLoggedIn: boolean
}

interface CartActions {
  addItem: (product: CartItemInput, quantity: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getSubtotal: () => number

  // Internal — 由 use-cart-sync 呼叫
  _setItems: (items: CartItem[]) => void
  _setHydrated: (hydrated: boolean) => void
  _setLoggedIn: (loggedIn: boolean) => void
}

const STORAGE_KEY = 'msching-cart'

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      // State
      items: [],
      isHydrated: false,
      isLoggedIn: false,

      // Actions
      addItem: (product, quantity) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.productId === product.productId
          )

          if (existing) {
            const newQty = Math.min(
              existing.quantity + quantity,
              product.maxCount
            )
            return {
              items: state.items.map((item) =>
                item.productId === product.productId
                  ? { ...item, quantity: newQty }
                  : item
              ),
            }
          }

          const newItem: CartItem = {
            ...product,
            quantity: Math.min(quantity, product.maxCount),
            isActive: true,
          }
          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }))
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: Math.max(1, Math.min(quantity, item.maxCount)) }
              : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
      },

      // Internal
      _setItems: (items) => set({ items }),
      _setHydrated: (hydrated) => set({ isHydrated: hydrated }),
      _setLoggedIn: (loggedIn) => set({ isLoggedIn: loggedIn }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => {
        // 自訂 storage：登入時不寫 localStorage
        return {
          getItem: (name: string) => {
            const str = localStorage.getItem(name)
            return str ?? null
          },
          setItem: (name: string, value: string) => {
            // 登入狀態下不寫 localStorage
            const state = useCartStore.getState()
            if (state.isLoggedIn) return
            localStorage.setItem(name, value)
          },
          removeItem: (name: string) => {
            localStorage.removeItem(name)
          },
        }
      }),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?._setHydrated(true)
      },
    }
  )
)
