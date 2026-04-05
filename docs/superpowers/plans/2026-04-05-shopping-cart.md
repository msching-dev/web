# 購物車功能 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 實作 client-side 購物車，訪客用 localStorage、登入用戶用 Supabase DB 持久化，帳號間完全隔離。

**Architecture:** Zustand store 搭配自訂 persist 策略（未登入寫 localStorage，已登入只寫 DB）。Server Actions 處理 DB CRUD。`onAuthStateChange` 控制登入合併與登出清空。

**Tech Stack:** Zustand, Next.js Server Actions, Supabase (cart_items table + RLS)

---

## File Structure

```
新增：
  supabase/migrations/20260405000010_create_cart_items.sql  — DB migration
  types/cart.ts                                              — 購物車型別
  stores/cart-store.ts                                       — Zustand store + persist
  hooks/use-cart-sync.ts                                     — auth 狀態監聽 + DB 同步
  lib/actions/cart.ts                                        — Server Actions (CRUD + merge)
  components/cart/cart-badge.tsx                              — Header 購物車 badge
  components/cart/cart-page-content.tsx                       — 購物車頁主體
  components/cart/cart-item-row.tsx                           — 單一商品列
  components/cart/cart-summary.tsx                            — 小計 + 合計
  components/cart/cart-empty.tsx                              — 空購物車狀態

修改：
  app/(store)/cart/page.tsx                                   — 接入 CartPageContent
  components/layout/header.tsx                                — 加入 CartBadge
  components/products/product-detail-content.tsx              — 真實加入購物車
  components/store-cta.tsx                                    — 手機版加入購物車
```

---

## Task 1: 安裝 Zustand + DB Migration

**Files:**
- Modify: `package.json` (pnpm add zustand)
- Create: `supabase/migrations/20260405000010_create_cart_items.sql`

- [ ] **Step 1: 安裝 Zustand**

```bash
cd /Users/jerry/Workspace/yihsuan717.github/msching-web
pnpm add zustand
```

- [ ] **Step 2: 建立 cart_items migration**

```bash
cd /Users/jerry/Workspace/yihsuan717.github/msching-web
supabase migration new create_cart_items
```

這會在 `supabase/migrations/` 產生一個帶時間戳的空檔案。寫入以下內容：

```sql
-- ============================================================
-- 010: Cart Items — 登入用戶購物車持久化
-- ============================================================

CREATE TABLE cart_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(customer_id, product_id)
);

CREATE INDEX idx_cart_items_customer ON cart_items(customer_id);

-- RLS：用戶只能操作自己的購物車
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own cart"
  ON cart_items FOR ALL
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE auth_id = auth.uid()
    )
  );

-- updated_at 自動更新（沿用既有 function）
CREATE TRIGGER trg_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

- [ ] **Step 3: 推送 migration 到遠端**

```bash
supabase db push
```

Expected: migration 成功執行，`cart_items` 表建立完成。

- [ ] **Step 4: 更新 Supabase 型別**

```bash
pnpm db:types
```

Expected: `lib/supabase/types.ts` 更新，包含 `cart_items` 表定義。

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml supabase/migrations/*cart_items* lib/supabase/types.ts
git commit -m "feat: add zustand + cart_items DB migration"
```

---

## Task 2: 購物車型別定義

**Files:**
- Create: `types/cart.ts`

- [ ] **Step 1: 建立 cart 型別檔案**

建立 `types/cart.ts`：

```typescript
export interface CartItem {
  productId: string
  slug: string
  name: string
  price: number
  image: string
  quantity: number
  maxCount: number
  unit: string
  isActive: boolean
}

/** 給 addItem 用的輸入型別（不含 quantity，由呼叫方傳入） */
export interface CartItemInput {
  productId: string
  slug: string
  name: string
  price: number
  image: string
  maxCount: number
  unit: string
}

/** Guest cart 存入 localStorage 的格式（精簡版） */
export interface GuestCartItem {
  productId: string
  quantity: number
}
```

- [ ] **Step 2: Commit**

```bash
git add types/cart.ts
git commit -m "feat: add CartItem type definitions"
```

---

## Task 3: Server Actions — 購物車 DB CRUD

**Files:**
- Create: `lib/actions/cart.ts`

這是登入用戶購物車的 DB 操作層。所有 action 內部透過 `createClient()` 取得 auth context，RLS 自動保護資料隔離。

- [ ] **Step 1: 建立 `lib/actions/cart.ts`**

先建立 `lib/actions/` 目錄，再建立檔案：

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import type { CartItem, GuestCartItem } from '@/types/cart'

/**
 * 取得目前用戶的 customer_id
 * 透過 auth.uid() → customers.auth_id 關聯
 */
async function getCustomerId(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('customers')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  return data?.id ?? null
}

/**
 * 讀取用戶購物車（join products 取最新資料）
 */
export async function getCartItems(): Promise<CartItem[]> {
  const supabase = await createClient()
  const customerId = await getCustomerId()
  if (!customerId) return []

  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      product_id,
      quantity,
      products (
        slug,
        name,
        price,
        images,
        max_order_qty,
        unit,
        is_active
      )
    `)
    .eq('customer_id', customerId)

  if (error || !data) return []

  return data
    .filter((row) => row.products !== null)
    .map((row) => {
      const p = row.products as Record<string, unknown>
      const images = (p.images as Array<{ url: string; sort_order: number }>) || []
      const firstImage = [...images].sort((a, b) => a.sort_order - b.sort_order)[0]

      return {
        productId: row.product_id,
        slug: p.slug as string,
        name: p.name as string,
        price: p.price as number,
        image: firstImage?.url ?? '',
        quantity: row.quantity,
        maxCount: (p.max_order_qty as number) ?? 99,
        unit: (p.unit as string) ?? '',
        isActive: p.is_active as boolean,
      }
    })
}

/**
 * 新增或更新購物車商品（upsert）
 */
export async function upsertCartItem(
  productId: string,
  quantity: number
): Promise<{ success: boolean }> {
  const supabase = await createClient()
  const customerId = await getCustomerId()
  if (!customerId) return { success: false }

  const { error } = await supabase
    .from('cart_items')
    .upsert(
      { customer_id: customerId, product_id: productId, quantity },
      { onConflict: 'customer_id,product_id' }
    )

  return { success: !error }
}

/**
 * 刪除單一商品
 */
export async function removeCartItem(
  productId: string
): Promise<{ success: boolean }> {
  const supabase = await createClient()
  const customerId = await getCustomerId()
  if (!customerId) return { success: false }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('customer_id', customerId)
    .eq('product_id', productId)

  return { success: !error }
}

/**
 * 清空購物車
 */
export async function clearCart(): Promise<{ success: boolean }> {
  const supabase = await createClient()
  const customerId = await getCustomerId()
  if (!customerId) return { success: false }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('customer_id', customerId)

  return { success: !error }
}

/**
 * 登入合併：guest localStorage → DB
 *
 * 合併規則：同商品取 max(guest.quantity, db.quantity)
 * guestItems 為空陣列時，等同於單純從 DB 載入。
 */
export async function mergeGuestCart(
  guestItems: GuestCartItem[]
): Promise<CartItem[]> {
  const supabase = await createClient()
  const customerId = await getCustomerId()
  if (!customerId) return []

  if (guestItems.length > 0) {
    // 讀取目前 DB 購物車
    const { data: dbItems } = await supabase
      .from('cart_items')
      .select('product_id, quantity')
      .eq('customer_id', customerId)

    const dbMap = new Map(
      (dbItems ?? []).map((item) => [item.product_id, item.quantity])
    )

    // 合併：取 max quantity
    const upserts = guestItems.map((guest) => ({
      customer_id: customerId,
      product_id: guest.productId,
      quantity: Math.max(guest.quantity, dbMap.get(guest.productId) ?? 0),
    }))

    await supabase
      .from('cart_items')
      .upsert(upserts, { onConflict: 'customer_id,product_id' })
  }

  // 回傳合併後完整購物車
  return getCartItems()
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/actions/cart.ts
git commit -m "feat: cart Server Actions — CRUD + guest merge"
```

---

## Task 4: Zustand Store + 持久化策略

**Files:**
- Create: `stores/cart-store.ts`

核心設計：
- 未登入 → persist middleware 自動寫 localStorage
- 已登入 → persist middleware skip storage（isLoggedIn flag 控制）
- 外部（use-cart-sync hook）控制 DB 同步與 auth 狀態切換

- [ ] **Step 1: 建立 `stores/cart-store.ts`**

```typescript
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

/**
 * 自訂 storage：登入時不寫 localStorage，只有訪客時才寫。
 * 讀取永遠允許（hydration 需要）。
 */
function createCartStorage() {
  const storage = createJSONStorage(() => localStorage)

  return {
    getItem: storage.getItem,
    setItem: (name: string, value: unknown) => {
      // 登入狀態下不寫 localStorage
      const state = useCartStore.getState()
      if (state.isLoggedIn) return
      storage.setItem(name, value)
    },
    removeItem: storage.removeItem,
  }
}

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
      storage: createCartStorage(),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?._setHydrated(true)
      },
    }
  )
)
```

- [ ] **Step 2: 驗證 store 可正確 import**

```bash
cd /Users/jerry/Workspace/yihsuan717.github/msching-web
pnpm build 2>&1 | head -30
```

如果有 import 錯誤，修正路徑。（此時還沒有 consumer，build 不會主動引入 store，主要確認無語法錯誤。）

- [ ] **Step 3: Commit**

```bash
git add stores/cart-store.ts
git commit -m "feat: Zustand cart store with conditional localStorage persist"
```

---

## Task 5: Auth 狀態同步 Hook

**Files:**
- Create: `hooks/use-cart-sync.ts`

這個 hook 負責：
1. 監聽 `onAuthStateChange`
2. SIGNED_IN → 讀 localStorage → merge 到 DB → 清 localStorage → 切換 DB 模式
3. SIGNED_OUT → 清 store + 清 localStorage → 切換 localStorage 模式
4. 登入中每次 mutation → debounce sync 到 DB

- [ ] **Step 1: 建立 `hooks/use-cart-sync.ts`**

```typescript
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
    const unsub = useCartStore.subscribe((state, prevState) => {
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
```

- [ ] **Step 2: Commit**

```bash
git add hooks/use-cart-sync.ts
git commit -m "feat: useCartSync hook — auth state listener + DB sync"
```

---

## Task 6: CartBadge 元件 + Header 整合

**Files:**
- Create: `components/cart/cart-badge.tsx`
- Modify: `components/layout/header.tsx`

- [ ] **Step 1: 建立 `components/cart/cart-badge.tsx`**

```typescript
'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'

export default function CartBadge() {
  const isHydrated = useCartStore((s) => s.isHydrated)
  const getItemCount = useCartStore((s) => s.getItemCount)

  const count = isHydrated ? getItemCount() : 0

  return (
    <Link
      href="/cart"
      className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sandrift-500 transition-colors hover:text-sandrift-800"
      aria-label="購物車"
    >
      <ShoppingBag className="h-4.5 w-4.5" strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}
```

- [ ] **Step 2: 修改 `components/layout/header.tsx`**

在 header.tsx 中把兩處 cart Link 替換為 `<CartBadge />`。

**Import 區新增：**
在 `import { menuItems } from '@/lib/menus'` 下方加入：

```typescript
import CartBadge from '@/components/cart/cart-badge'
```

**移除不再需要的 import：**
從 lucide-react import 中移除 `ShoppingBag`（UserButton 不用）。修改後：

```typescript
import { Menu, User, LogOut, Settings } from 'lucide-react'
```

**Mobile cart（約第 167 行）— 替換整個 Link：**

原始：
```typescript
          <Link href="/cart" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sandrift-500 transition-colors hover:text-sandrift-800" aria-label="購物車">
            <ShoppingBag className="h-4.5 w-4.5" strokeWidth={1.5} />
          </Link>
```

替換為：
```typescript
          <CartBadge />
```

**Desktop cart（約第 193 行）— 同樣替換：**

原始：
```typescript
          <Link href="/cart" className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sandrift-500 transition-colors hover:text-sandrift-800" aria-label="購物車">
            <ShoppingBag className="h-4.5 w-4.5" strokeWidth={1.5} />
          </Link>
```

替換為：
```typescript
          <CartBadge />
```

- [ ] **Step 3: 在 ClientLayout 初始化 useCartSync**

讀取 `components/layout/client-layout.tsx`，在裡面加入 `useCartSync()` 呼叫。這確保所有前台頁面都會初始化 cart sync。

在 import 區加入：
```typescript
import { useCartSync } from '@/hooks/use-cart-sync'
```

在 component body 最上方加入：
```typescript
useCartSync()
```

- [ ] **Step 4: 驗證 build**

```bash
pnpm build 2>&1 | tail -20
```

Expected: 無 TypeScript 或 build 錯誤。

- [ ] **Step 5: Commit**

```bash
git add components/cart/cart-badge.tsx components/layout/header.tsx components/layout/client-layout.tsx
git commit -m "feat: CartBadge component + header integration + cart sync init"
```

---

## Task 7: 產品詳情頁 — 真實加入購物車

**Files:**
- Modify: `components/products/product-detail-content.tsx`

- [ ] **Step 1: 修改 import 區**

新增 import：
```typescript
import { useCartStore } from '@/stores/cart-store'
```

新增 import `Link`... 已有。新增 `useRouter`：
```typescript
import { useRouter } from 'next/navigation'
```

（注意：`Link` 和 `useRouter` 如果已經 import 就不用重複。檢查檔案頂部確認。目前已有 `Link` import，需新增 `useRouter`。）

- [ ] **Step 2: 修改 component 內部**

在 `const { generateTemplate, copyToClipboard } = useOrderTemplate()` 下方加入：

```typescript
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)
  const items = useCartStore((s) => s.items)

  const existingCartQty = items.find(
    (item) => item.slug === product.key
  )?.quantity ?? 0
```

- [ ] **Step 3: 改寫 handleAddToCart**

替換現有的 `handleAddToCart`：

```typescript
  const handleAddToCart = () => {
    // 從 product 頁資訊組出 product.key = slug, detail 是 DB 的 id
    // productId 需要是 UUID，由 Step 6 加入 ProductInfo.id 解決
    addItem(
      {
        productId: product.id, // Step 6 會加入 ProductInfo.id
        slug: product.key,
        name: product.name,
        price: product.price,
        image: product.banner.src,
        maxCount: detail.maxCount,
        unit: detail.unit,
      },
      quantity
    )

    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }
```

- [ ] **Step 4: 修改 toast 內容**

替換現有的 toast div（約第 338-344 行）：

原始：
```typescript
      {/* Toast notification */}
      {toastVisible && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 animate-pop">
          <div className="rounded-xl bg-sandrift-900 px-5 py-3 text-sm text-white shadow-lg">
            購物車功能即將推出，請透過 LINE 下單
          </div>
        </div>
      )}
```

替換為：
```typescript
      {/* Toast notification */}
      {toastVisible && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 animate-pop">
          <div className="flex items-center gap-3 rounded-xl bg-sandrift-900 px-5 py-3 text-sm text-white shadow-lg">
            <span>已加入購物車 — {product.name}</span>
            <button
              type="button"
              onClick={() => router.push('/cart')}
              className="cursor-pointer whitespace-nowrap text-sandrift-300 underline underline-offset-2 transition-colors hover:text-white"
            >
              查看購物車
            </button>
          </div>
        </div>
      )}
```

- [ ] **Step 5: 加入已在購物車提示 + 上限 disabled**

在「加入購物車」按鈕下方（Secondary Links 上方）加入提示：

```typescript
            {/* Cart quantity hint */}
            {existingCartQty > 0 && (
              <p className="mt-2 text-center text-xs text-sandrift-400">
                購物車已有 {existingCartQty} {detail.unit || '件'}
              </p>
            )}
```

修改「加入購物車」按鈕，當 `existingCartQty + quantity > maxCount` 時 disabled：

原始按鈕：
```typescript
            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-sandrift-500 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sandrift-600 active:scale-[0.98]"
            >
              <ShoppingBag className="h-4 w-4" />
              加入購物車
            </button>
```

替換為：
```typescript
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={existingCartQty >= detail.maxCount}
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-sandrift-500 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sandrift-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-sandrift-200 disabled:text-sandrift-400"
            >
              <ShoppingBag className="h-4 w-4" />
              {existingCartQty >= detail.maxCount ? '已達訂購上限' : '加入購物車'}
            </button>
```

- [ ] **Step 6: 解決 productId UUID 問題**

目前 `ProductInfo` 沒有 UUID id 欄位。需要：

1. 在 `types/index.ts` 的 `ProductInfo` 介面加入 `id` 欄位：

```typescript
export interface ProductInfo {
  id: string           // 新增：product UUID
  key: string
  // ...其餘不變
}
```

2. 在 `lib/supabase/queries.ts` 的 `toProductInfo` function 中加入 id mapping：

在 return 的第一行加入：
```typescript
    id: row.id as string,
```

3. 回到 `product-detail-content.tsx`，修改 `handleAddToCart` 中的 `productId`：

```typescript
        productId: product.id,
```

- [ ] **Step 7: Commit**

```bash
git add components/products/product-detail-content.tsx types/index.ts lib/supabase/queries.ts
git commit -m "feat: wire add-to-cart button to Zustand store + product UUID"
```

---

## Task 8: StoreCta — 手機版加入購物車

**Files:**
- Modify: `components/store-cta.tsx`

手機版底部 CTA 在產品頁時，需要觸發加入購物車。但 StoreCta 不知道目前的商品資訊和數量。

策略：產品頁的 StoreCta 按鈕改為滾動到頁面頂部（引導用戶用主按鈕加入），或直接連結到購物車。更務實的做法是：產品頁的 mobile CTA 改為「查看購物車」（因為主頁面已有完整的數量選擇 + 加入按鈕）。

- [ ] **Step 1: 修改 `components/store-cta.tsx`**

將整個檔案替換為：

```typescript
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'

const HIDE_ON = ['/cart', '/account', '/coming-soon', '/admin']

export default function StoreCta() {
  const pathname = usePathname()
  const getItemCount = useCartStore((s) => s.getItemCount)
  const isHydrated = useCartStore((s) => s.isHydrated)

  if (HIDE_ON.some((p) => pathname.startsWith(p))) return null

  const isProductPage = pathname.startsWith('/products/')
  const cartCount = isHydrated ? getItemCount() : 0

  // 產品頁：購物車有商品時顯示「查看購物車(N)」，沒有時隱藏 CTA（主按鈕已在頁面上）
  if (isProductPage) {
    if (cartCount === 0) return null
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-sandrift-100/40 bg-white/90 p-3 backdrop-blur-xl lg:hidden">
        <Link
          href="/cart"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-sandrift-500 py-3 text-sm font-semibold text-white shadow-lg shadow-sandrift-500/20 transition-colors hover:bg-sandrift-600 active:scale-[0.98]"
        >
          <ShoppingBag className="h-4 w-4" />
          查看購物車 ({cartCount})
        </Link>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-sandrift-100/40 bg-white/90 p-3 backdrop-blur-xl lg:hidden">
      <Link
        href="/#products"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-sandrift-500 py-3 text-sm font-semibold text-white shadow-lg shadow-sandrift-500/20 transition-colors hover:bg-sandrift-600 active:scale-[0.98]"
      >
        <ShoppingBag className="h-4 w-4" />
        立即選購
      </Link>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/store-cta.tsx
git commit -m "feat: StoreCta shows cart count on product pages"
```

---

## Task 9: 購物車頁 — 元件建構

**Files:**
- Create: `components/cart/cart-empty.tsx`
- Create: `components/cart/cart-item-row.tsx`
- Create: `components/cart/cart-summary.tsx`
- Create: `components/cart/cart-page-content.tsx`

- [ ] **Step 1: 建立 `components/cart/cart-empty.tsx`**

```typescript
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export default function CartEmpty() {
  return (
    <div className="mx-auto max-w-sm px-4 py-14 md:py-20">
      <div className="rounded-3xl bg-sandrift-50/30 p-8 text-center ring-1 ring-sandrift-100/30">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-sandrift-50/60">
          <ShoppingBag className="h-8 w-8 text-sandrift-300" />
        </div>
        <h2 className="text-lg font-bold tracking-tight text-sandrift-950">
          購物車是空的
        </h2>
        <p className="mt-2 text-[13px] text-sandrift-400">
          快去挑選喜歡的商品吧
        </p>
        <Link
          href="/"
          className="mt-6 inline-block cursor-pointer rounded-xl bg-sandrift-500 px-6 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-sandrift-600"
        >
          去逛逛
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 建立 `components/cart/cart-item-row.tsx`**

```typescript
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, X } from 'lucide-react'
import type { CartItem } from '@/types/cart'

interface CartItemRowProps {
  item: CartItem
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

export default function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const isDisabled = !item.isActive

  return (
    <div
      className={`flex gap-3 py-4 ${isDisabled ? 'opacity-50' : ''}`}
    >
      {/* Product image */}
      <Link
        href={isDisabled ? '#' : `/products/${item.slug}`}
        className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-sandrift-50/50"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={isDisabled ? '#' : `/products/${item.slug}`}
              className="text-sm font-semibold text-sandrift-900 hover:text-sandrift-700 transition-colors"
            >
              {item.name}
            </Link>
            {isDisabled && (
              <p className="mt-0.5 text-xs text-red-400">商品已下架</p>
            )}
            <p className="mt-0.5 text-xs text-sandrift-400">
              NT${item.price}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.productId)}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-sandrift-300 transition-colors hover:bg-sandrift-50 hover:text-sandrift-600"
            aria-label={`移除 ${item.name}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity selector */}
          <div className="flex items-center rounded-lg ring-1 ring-sandrift-200/60">
            <button
              type="button"
              onClick={() =>
                onUpdateQuantity(item.productId, item.quantity - 1)
              }
              disabled={isDisabled || item.quantity <= 1}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-l-lg text-sandrift-500 transition-colors hover:bg-sandrift-50 disabled:cursor-not-allowed disabled:text-sandrift-200"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="flex h-8 w-8 items-center justify-center border-x border-sandrift-200/60 text-xs font-semibold text-sandrift-800">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                onUpdateQuantity(item.productId, item.quantity + 1)
              }
              disabled={isDisabled || item.quantity >= item.maxCount}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-r-lg text-sandrift-500 transition-colors hover:bg-sandrift-50 disabled:cursor-not-allowed disabled:text-sandrift-200"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Subtotal */}
          <span className="text-sm font-semibold text-sandrift-700">
            NT${item.price * item.quantity}
          </span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 建立 `components/cart/cart-summary.tsx`**

```typescript
'use client'

interface CartSummaryProps {
  subtotal: number
  itemCount: number
}

export default function CartSummary({ subtotal, itemCount }: CartSummaryProps) {
  return (
    <div className="rounded-2xl bg-sandrift-50/30 p-5 ring-1 ring-sandrift-100/30">
      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between text-sandrift-600">
          <span>商品小計（{itemCount} 件）</span>
          <span>NT${subtotal}</span>
        </div>
        <div className="flex justify-between text-sandrift-400">
          <span>運費</span>
          <span>待結算</span>
        </div>
        <div className="border-t border-sandrift-200/40 pt-2.5">
          <div className="flex justify-between font-semibold text-sandrift-900">
            <span>合計</span>
            <span>NT${subtotal}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 建立 `components/cart/cart-page-content.tsx`**

```typescript
'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import CartItemRow from './cart-item-row'
import CartSummary from './cart-summary'
import CartEmpty from './cart-empty'

export default function CartPageContent() {
  const items = useCartStore((s) => s.items)
  const isHydrated = useCartStore((s) => s.isHydrated)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const getItemCount = useCartStore((s) => s.getItemCount)
  const getSubtotal = useCartStore((s) => s.getSubtotal)

  // Hydration 中：顯示骨架屏避免閃爍
  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded bg-sandrift-100" />
          <div className="h-24 rounded-xl bg-sandrift-50" />
          <div className="h-24 rounded-xl bg-sandrift-50" />
        </div>
      </div>
    )
  }

  const activeItems = items.filter((item) => item.isActive)
  const inactiveItems = items.filter((item) => !item.isActive)

  if (items.length === 0) {
    return <CartEmpty />
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-5 md:py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold text-sandrift-950">
          購物車
          <span className="ml-1.5 text-base font-normal text-sandrift-400">
            ({getItemCount()})
          </span>
        </h1>
        <Link
          href="/"
          className="flex items-center gap-1 text-xs text-sandrift-500 transition-colors hover:text-sandrift-700"
        >
          繼續選購
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Inactive items warning */}
      {inactiveItems.length > 0 && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs text-red-600">
          有 {inactiveItems.length} 件商品已下架，結帳時將自動排除。
        </div>
      )}

      {/* Cart items */}
      <div className="divide-y divide-sandrift-100/60">
        {items.map((item) => (
          <CartItemRow
            key={item.productId}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6">
        <CartSummary
          subtotal={getSubtotal()}
          itemCount={getItemCount()}
        />
      </div>

      {/* Checkout button */}
      <div className="mt-5">
        <button
          type="button"
          disabled={activeItems.length === 0}
          className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-sandrift-500 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sandrift-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-sandrift-200 disabled:text-sandrift-400"
          onClick={() => {
            // Phase 1: toast 提示
            alert('結帳功能即將推出，請先透過 LINE 下單')
          }}
        >
          前往結帳
        </button>
      </div>

      {/* LINE fallback */}
      <p className="mt-4 text-center text-xs text-sandrift-400">
        有問題？
        <a
          href="https://lin.ee/msching"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-1 text-sandrift-500 underline underline-offset-2 transition-colors hover:text-sandrift-700"
        >
          透過 LINE 聯繫我們
        </a>
      </p>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/cart/
git commit -m "feat: cart page components — empty, item row, summary, page content"
```

---

## Task 10: 購物車頁 — 接入 CartPageContent

**Files:**
- Modify: `app/(store)/cart/page.tsx`

- [ ] **Step 1: 改寫 `app/(store)/cart/page.tsx`**

將整個檔案替換為：

```typescript
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import CartPageContent from '@/components/cart/cart-page-content'

export const metadata: Metadata = {
  title: '購物車',
}

export default function CartPage() {
  return (
    <div className="animate-page-enter">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>首頁</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>購物車</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <CartPageContent />
    </div>
  )
}
```

- [ ] **Step 2: 驗證 build**

```bash
pnpm build 2>&1 | tail -20
```

Expected: 無錯誤。

- [ ] **Step 3: Commit**

```bash
git add app/\(store\)/cart/page.tsx
git commit -m "feat: cart page wired to CartPageContent"
```

---

## Task 11: 整合測試 + 修正

**Files:** 視 build/lint 結果而定

- [ ] **Step 1: Lint 檢查**

```bash
pnpm lint 2>&1 | tail -30
```

修正所有 lint 錯誤。

- [ ] **Step 2: Build 驗證**

```bash
pnpm build 2>&1 | tail -30
```

修正所有 build 錯誤。

- [ ] **Step 3: 手動驗證情境清單**

啟動 dev server 後逐一驗證：

```bash
pnpm dev
```

驗證清單：
1. 訪客：產品頁 → 加入購物車 → badge 顯示數字
2. 訪客：購物車頁 → 增減數量 → 小計正確
3. 訪客：刪除商品 → badge 更新
4. 訪客：重整頁面 → localStorage 恢復購物車
5. 訪客：同商品重複加入 → quantity 累加不超過 maxCount
6. 已登入：加入購物車 → DB 有記錄（Supabase Dashboard 查看）
7. 已登入：localStorage 無購物車資料
8. 訪客 [A×2] → 登入甲（DB 有 [A×1]）→ 合併結果 A×2
9. 甲登出 → store 空、localStorage 空
10. 訪客加 [Z×1] → 登入乙 → 乙只有自己的 + Z×1，無甲的殘留

- [ ] **Step 4: 修正發現的問題**

根據手動測試結果修正。

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "fix: cart integration fixes from manual testing"
```

（只在有修正時才 commit。）

---

## Task 12: LINE fallback URL 修正

購物車頁的 LINE 連結目前是硬編碼的 `https://lin.ee/msching`。需要改用 `lib/constants.ts` 中的 `socialMediaLinks.lineOfficial`。

**Files:**
- Modify: `components/cart/cart-page-content.tsx`

- [ ] **Step 1: 修改 LINE 連結**

在 import 區加入：
```typescript
import { socialMediaLinks } from '@/lib/constants'
```

替換 LINE 連結的 `href`：

原始：
```typescript
          href="https://lin.ee/msching"
```

替換為：
```typescript
          href={socialMediaLinks.lineOfficial}
```

- [ ] **Step 2: Commit**

```bash
git add components/cart/cart-page-content.tsx
git commit -m "fix: use socialMediaLinks constant for LINE URL in cart"
```
