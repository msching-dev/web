# 商品卡片快速加購重設計 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將浮動的加入購物車按鈕整合進卡片資訊區，加入 stepper 數量控制 + 飛入購物車動畫

**Architecture:** 新建 `CartStepperButton` 元件取代 `QuickAddButton`，內含 idle/added/stepper/has-items/maxed 五狀態機。飛入動畫用 `useFlyToCart` hook（Web Animations API）。`ProductCard` 佈局調整，alias 移到名稱行。

**Tech Stack:** React 19 + Zustand + Web Animations API + Tailwind CSS 4

**Spec:** `docs/superpowers/specs/2026-04-06-cart-stepper-button-design.md`

---

## File Structure

| 操作 | 路徑 | 職責 |
|------|------|------|
| 新增 | `components/cart-stepper-button.tsx` | 加購按鈕狀態機（idle → added → stepper → has-items） |
| 新增 | `hooks/use-fly-to-cart.ts` | 飛入購物車動畫 hook（WAAPI） |
| 修改 | `components/product-card.tsx` | 佈局重構：移除浮動按鈕、alias 移到名稱行、整合新元件 |
| 修改 | `components/cart/cart-badge.tsx` | 新增 `data-cart-badge` attribute + bounce 動畫 |
| 修改 | `app/globals.css` | 新增 stepper 展開 + bounce keyframe 動畫 |
| 刪除 | `components/quick-add-button.tsx` | 被 `CartStepperButton` 取代 |

---

### Task 1: CartBadge 新增定位 attribute + bounce 動畫

**Files:**
- Modify: `components/cart/cart-badge.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: 在 `globals.css` 新增 bounce keyframe**

在 `app/globals.css` 的 `@keyframes page-enter` 區塊後面加入：

```css
@keyframes cart-bounce {
  0% { transform: scale(1); }
  40% { transform: scale(1.25); }
  100% { transform: scale(1); }
}
```

- [ ] **Step 2: CartBadge 加上 `data-cart-badge` attribute 和 bounce 支援**

修改 `components/cart/cart-badge.tsx`：

```tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'

export default function CartBadge() {
  const count = useCartStore((s) =>
    s.isHydrated ? s.items.reduce((sum, item) => sum + item.quantity, 0) : 0
  )
  const [bouncing, setBouncing] = useState(false)
  const prevCount = usePrevious(count)

  // 數量增加時觸發 bounce
  useEffect(() => {
    if (prevCount !== undefined && count > prevCount) {
      setBouncing(true)
      const timer = setTimeout(() => setBouncing(false), 300)
      return () => clearTimeout(timer)
    }
  }, [count, prevCount])

  return (
    <Link
      href="/cart"
      data-cart-badge
      className={`relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-sandrift-50/50 text-sandrift-500 transition-all duration-200 hover:bg-sandrift-100/70 hover:text-sandrift-800 ${bouncing ? 'animate-[cart-bounce_300ms_ease-out]' : ''}`}
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

/** 追蹤前一個值 */
function usePrevious<T>(value: T): T | undefined {
  const [prev, setPrev] = useState<T | undefined>(undefined)
  const [current, setCurrent] = useState(value)

  if (value !== current) {
    setPrev(current)
    setCurrent(value)
  }

  return prev
}
```

- [ ] **Step 3: 手動驗證**

開發伺服器已執行的情況下，在產品詳情頁點「加入購物車」，觀察 header 的購物車 badge 是否出現 bounce 效果。

- [ ] **Step 4: Commit**

```bash
git add components/cart/cart-badge.tsx app/globals.css
git commit -m "feat: CartBadge 新增 data-cart-badge 定位 + bounce 動畫"
```

---

### Task 2: 飛入購物車動畫 hook

**Files:**
- Create: `hooks/use-fly-to-cart.ts`

- [ ] **Step 1: 建立 `useFlyToCart` hook**

建立 `hooks/use-fly-to-cart.ts`：

```ts
'use client'

import { useCallback, useRef } from 'react'

interface FlyToCartOptions {
  /** 飛行元素的圖片 src（用於 clone） */
  imageSrc?: string
}

/**
 * 飛入購物車動畫 hook — 使用 Web Animations API
 *
 * 用法：
 * const { sourceRef, triggerFly } = useFlyToCart()
 * <button ref={sourceRef} onClick={() => { addItem(...); triggerFly() }}>
 */
export function useFlyToCart() {
  const sourceRef = useRef<HTMLButtonElement>(null)
  const isAnimating = useRef(false)

  const triggerFly = useCallback((options?: FlyToCartOptions) => {
    if (isAnimating.current) return
    if (!sourceRef.current) return

    const badge = document.querySelector('[data-cart-badge]')
    if (!badge) return

    const sourceRect = sourceRef.current.getBoundingClientRect()
    const targetRect = badge.getBoundingClientRect()

    // badge 不在 viewport 內時跳過飛入動畫
    const inViewport =
      targetRect.top >= 0 &&
      targetRect.bottom <= window.innerHeight
    if (!inViewport) return

    // 來源中心點
    const startX = sourceRect.left + sourceRect.width / 2
    const startY = sourceRect.top + sourceRect.height / 2

    // 目標中心點
    const endX = targetRect.left + targetRect.width / 2
    const endY = targetRect.top + targetRect.height / 2

    // 建立飛行元素
    const flyEl = document.createElement('div')
    flyEl.style.cssText = `
      position: fixed;
      z-index: 99999;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      pointer-events: none;
      background: var(--color-sandrift-500, #b08d62);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(176, 141, 98, 0.3);
      left: ${startX - 14}px;
      top: ${startY - 14}px;
    `

    // 如果有圖片，用縮圖；否則用購物袋 icon
    if (options?.imageSrc) {
      const img = document.createElement('img')
      img.src = options.imageSrc
      img.style.cssText = 'width: 20px; height: 20px; object-fit: cover; border-radius: 50%;'
      flyEl.appendChild(img)
    }

    document.body.appendChild(flyEl)
    isAnimating.current = true

    // 拋物線中間點（往上偏移製造弧線）
    const midX = (startX + endX) / 2
    const midY = Math.min(startY, endY) - 80

    const animation = flyEl.animate(
      [
        {
          left: `${startX - 14}px`,
          top: `${startY - 14}px`,
          transform: 'scale(1)',
          opacity: '1',
        },
        {
          left: `${midX - 14}px`,
          top: `${midY - 14}px`,
          transform: 'scale(0.7)',
          opacity: '0.8',
          offset: 0.4,
        },
        {
          left: `${endX - 14}px`,
          top: `${endY - 14}px`,
          transform: 'scale(0.2)',
          opacity: '0',
        },
      ],
      {
        duration: 500,
        easing: 'ease-in',
        fill: 'forwards',
      }
    )

    animation.onfinish = () => {
      flyEl.remove()
      isAnimating.current = false
    }
  }, [])

  return { sourceRef, triggerFly }
}
```

- [ ] **Step 2: 手動驗證**

此 hook 將在 Task 3 中被 `CartStepperButton` 使用，屆時一起驗證。

- [ ] **Step 3: Commit**

```bash
git add hooks/use-fly-to-cart.ts
git commit -m "feat: useFlyToCart hook — WAAPI 飛入購物車動畫"
```

---

### Task 3: CartStepperButton 元件

**Files:**
- Create: `components/cart-stepper-button.tsx`

- [ ] **Step 1: 建立 `CartStepperButton` 元件**

建立 `components/cart-stepper-button.tsx`：

```tsx
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ShoppingBag, Check, Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { useFlyToCart } from '@/hooks/use-fly-to-cart'
import type { ProductInfo } from '@/types'

type ButtonState = 'idle' | 'added' | 'stepper' | 'has-items' | 'maxed'

interface CartStepperButtonProps {
  product: ProductInfo
}

export default function CartStepperButton({ product }: CartStepperButtonProps) {
  const addItem = useCartStore((s) => s.addItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const items = useCartStore((s) => s.items)

  const existingQty = items.find((item) => item.productId === product.id)?.quantity ?? 0
  const isMaxed = existingQty >= product.maxCount

  const [state, setState] = useState<ButtonState>('idle')
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { sourceRef, triggerFly } = useFlyToCart()

  // 根據購物車數量同步初始狀態
  useEffect(() => {
    if (state === 'added' || state === 'stepper') return // 操作中不打斷
    setState(existingQty > 0 ? 'has-items' : 'idle')
  }, [existingQty, state])

  const resetCollapseTimer = useCallback(() => {
    if (collapseTimer.current) clearTimeout(collapseTimer.current)
    collapseTimer.current = setTimeout(() => {
      setState(existingQty > 0 ? 'has-items' : 'idle')
    }, 3000)
  }, [existingQty])

  // 清理 timer
  useEffect(() => {
    return () => {
      if (collapseTimer.current) clearTimeout(collapseTimer.current)
    }
  }, [])

  const handleInitialAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isMaxed) return

    addItem(
      {
        productId: product.id,
        slug: product.key,
        name: product.name,
        price: product.price,
        image: product.banner.src,
        maxCount: product.maxCount,
        unit: product.unit,
      },
      1
    )

    // 飛入動畫
    triggerFly({ imageSrc: product.banner.src })

    // added → stepper
    setState('added')
    setTimeout(() => {
      setState('stepper')
      resetCollapseTimer()
    }, 300)
  }

  const handleExpand = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setState('stepper')
    resetCollapseTimer()
  }

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (existingQty >= product.maxCount) return
    updateQuantity(product.id, existingQty + 1)
    resetCollapseTimer()
  }

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (existingQty <= 1) {
      removeItem(product.id)
      setState('idle')
      if (collapseTimer.current) clearTimeout(collapseTimer.current)
    } else {
      updateQuantity(product.id, existingQty - 1)
      resetCollapseTimer()
    }
  }

  // === idle 狀態 ===
  if (state === 'idle') {
    return (
      <button
        ref={sourceRef}
        type="button"
        onClick={handleInitialAdd}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-sandrift-100 text-sandrift-600 transition-all duration-200 hover:bg-sandrift-200 active:scale-95"
        aria-label={`加入 ${product.name} 到購物車`}
      >
        <ShoppingBag className="h-4 w-4" />
      </button>
    )
  }

  // === added 狀態（過渡） ===
  if (state === 'added') {
    return (
      <button
        ref={sourceRef}
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-sandrift-500 text-white animate-[pop_300ms_ease-out]"
        aria-label="已加入購物車"
      >
        <Check className="h-4 w-4" />
      </button>
    )
  }

  // === has-items 狀態（收合，顯示數字） ===
  if (state === 'has-items') {
    return (
      <button
        ref={sourceRef}
        type="button"
        onClick={handleExpand}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-sandrift-500 text-white text-xs font-semibold tabular-nums transition-all duration-200 hover:bg-sandrift-600 active:scale-95"
        aria-label={`購物車有 ${existingQty} 個 ${product.name}，點擊調整`}
      >
        {existingQty}
      </button>
    )
  }

  // === stepper 狀態（展開） ===
  const currentQty = existingQty
  const isCurrentMaxed = currentQty >= product.maxCount

  return (
    <div
      className="flex h-8 items-center gap-0.5 rounded-full bg-sandrift-500 px-1 shadow-md animate-[stepper-expand_200ms_ease-out] origin-right"
      role="group"
      aria-label={`${product.name} 數量調整`}
    >
      {/* 減少 / 刪除 */}
      <button
        type="button"
        onClick={handleDecrement}
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/20 active:scale-95"
        aria-label={currentQty <= 1 ? '移除商品' : '減少數量'}
      >
        {currentQty <= 1 ? (
          <Trash2 className="h-3.5 w-3.5" />
        ) : (
          <Minus className="h-3.5 w-3.5" />
        )}
      </button>

      {/* 數量 */}
      <span className="min-w-5 text-center text-xs font-semibold text-white tabular-nums">
        {currentQty}
      </span>

      {/* 增加 */}
      <button
        type="button"
        onClick={handleIncrement}
        disabled={isCurrentMaxed}
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/20 active:scale-95 disabled:cursor-not-allowed disabled:text-white/30"
        aria-label={isCurrentMaxed ? '已達上限' : '增加數量'}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
```

- [ ] **Step 2: 在 `globals.css` 新增 stepper-expand keyframe**

在 `app/globals.css` 的 `@keyframes cart-bounce` 後面加入：

```css
@keyframes stepper-expand {
  from {
    width: 32px;
    opacity: 0.8;
  }
  to {
    width: auto;
    opacity: 1;
  }
}
```

- [ ] **Step 3: 手動驗證**

元件將在 Task 4 整合進 ProductCard 後一起驗證。

- [ ] **Step 4: Commit**

```bash
git add components/cart-stepper-button.tsx app/globals.css
git commit -m "feat: CartStepperButton 狀態機元件 — idle/added/stepper/has-items"
```

---

### Task 4: ProductCard 佈局重構

**Files:**
- Modify: `components/product-card.tsx`
- Delete: `components/quick-add-button.tsx`

- [ ] **Step 1: 重寫 ProductCard**

將 `components/product-card.tsx` 完整替換為：

```tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import CartStepperButton from '@/components/cart-stepper-button'
import type { ProductInfo } from '@/types'

const cardBgs = [
  '/images/products/common/card_bg.png',
  '/images/products/common/card_bg1.png',
  '/images/products/common/card_bg2.png',
]

interface ProductCardProps {
  product: ProductInfo
  index?: number
}

export default function ProductCard({ product, index }: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-sandrift-100/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(176,141,98,0.08)]">
      <Link
        href={`/products/${product.key}`}
        className="block"
      >
        {/* Tag Badge */}
        {product.tag && (
          <div className="absolute right-1.5 top-1.5 z-10">
            <Image
              src={`/images/products/tags/${product.tag}.png`}
              alt={product.tag}
              width={60}
              height={36}
              className="h-auto w-10 drop-shadow-sm"
            />
          </div>
        )}

        {/* Product Image */}
        <div className="relative aspect-4/5 overflow-hidden">
          <Image
            src={cardBgs[(index ?? 0) % 3]}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
          <Image
            src={product.banner.src}
            alt={product.banner.altText || product.name}
            title={product.banner.title || product.name}
            width={300}
            height={300}
            className="absolute inset-0 m-auto h-auto w-4/5 object-contain transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </div>

        {/* Product Info */}
        <div className="px-3 py-2.5 sm:px-3.5 sm:py-3">
          {/* 名稱 + alias */}
          <div className="flex items-baseline gap-1.5">
            <h3 className="line-clamp-1 text-[13px] font-semibold text-sandrift-900">
              {product.name}
            </h3>
            {product.alias && (
              <span className="shrink-0 text-[10px] text-sandrift-400">
                {product.alias}
              </span>
            )}
          </div>

          {/* 價格 + 加購按鈕 */}
          <div className="mt-1 flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[11px] text-sandrift-300 line-through">
                  ${product.originalPrice}
                </span>
              )}
              <span className="text-[14px] font-bold text-sandrift-600">
                ${product.price}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Cart Stepper Button — 位於價格行右側 */}
      <div className="absolute bottom-2.5 right-3 z-10 sm:bottom-3 sm:right-3.5">
        <CartStepperButton product={product} />
      </div>
    </div>
  )
}
```

**佈局變更重點：**
- 移除舊的浮動 `QuickAddButton` div（`absolute bottom-14 right-2`）
- `alias` 從價格行移到名稱行右側，用 `text-[10px]` 小字
- 價格行的 `justify-between` 保留，右側空間讓給 `CartStepperButton`
- `CartStepperButton` 用 `absolute bottom-2.5 right-3` 定位在資訊區右下角（跟價格同行）
- 價格行改用 `items-center`（從 `items-baseline`），讓按鈕垂直置中對齊

- [ ] **Step 2: 刪除 `quick-add-button.tsx`**

刪除 `components/quick-add-button.tsx`，確認沒有其他檔案引用它（Task 1 的 grep 確認只有 `product-card.tsx` 使用）。

```bash
rm components/quick-add-button.tsx
```

- [ ] **Step 3: 確認 build 通過**

```bash
pnpm build
```

預期：build 成功，沒有 import 錯誤。

- [ ] **Step 4: 手動驗證完整流程**

在開發伺服器上驗證以下場景：

1. 首頁產品 grid：按鈕在每張卡片的價格行右側，sandrift-100 底色
2. 點擊按鈕：pulse + check → 展開 stepper → 飛入動畫 → CartBadge bounce
3. stepper +/- 調整數量正常
4. 數量 = 1 時按 − 顯示 Trash2 icon，點擊後移除回到 idle
5. 達到 maxCount 時 + disabled
6. 3 秒無操作自動收合，顯示數字（has-items）
7. 重新載入頁面，已加過的商品顯示 has-items 狀態
8. 手機版（DevTools responsive）：按鈕可觸控，觸控區夠大

- [ ] **Step 5: Commit**

```bash
git add components/product-card.tsx
git rm components/quick-add-button.tsx
git commit -m "feat: ProductCard 佈局重構 — 整合 CartStepperButton + 移除 QuickAddButton"
```

---

### Task 5: 最終整合驗證與清理

**Files:**
- 檢查所有相關檔案

- [ ] **Step 1: 全站搜尋殘留引用**

確認 `quick-add-button` 和 `QuickAddButton` 不再出現在任何檔案中：

```bash
grep -r "quick-add-button\|QuickAddButton" --include="*.tsx" --include="*.ts" .
```

預期：無結果。

- [ ] **Step 2: 完整 lint 檢查**

```bash
pnpm lint
```

預期：無錯誤（warning 可接受）。

- [ ] **Step 3: 完整 build**

```bash
pnpm build
```

預期：build 成功。

- [ ] **Step 4: 端到端手動驗證清單**

| 場景 | 預期結果 |
|------|----------|
| 首頁載入 — 全部商品未加過 | 每張卡片右下角顯示 sandrift-100 圓形購物袋 icon |
| 首次點擊加購 | pulse check → stepper 展開 + 飛入動畫 + CartBadge bounce |
| stepper 內 + 多次 | 數量增加，不超過 maxCount |
| stepper 內 − 到 1 | − icon 變成 Trash2 |
| stepper 內 Trash2 點擊 | 商品移除，按鈕回到 idle |
| 3 秒不操作 | stepper 收合，顯示數字圓形（has-items） |
| has-items 再次點擊 | 重新展開 stepper |
| 頁面跳轉後返回首頁 | 已加過的商品保持 has-items 狀態 |
| CartBadge 不在視窗（捲到底部） | 加購仍然正常，飛入動畫跳過（badge 不在 viewport） |
| 手機版觸控 | 所有按鈕可正常觸控，無 hover 殘留 |
| 產品詳情頁的加入購物車 | 不受影響，功能正常 |

- [ ] **Step 5: Final commit（如有修正）**

```bash
git add -A
git commit -m "fix: cart stepper button 整合修正"
```
