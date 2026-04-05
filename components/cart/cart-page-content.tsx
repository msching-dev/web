'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { socialMediaLinks } from '@/lib/constants'
import CartItemRow from './cart-item-row'
import CartSummary from './cart-summary'
import CartEmpty from './cart-empty'

export default function CartPageContent() {
  const items = useCartStore((s) => s.items)
  const isHydrated = useCartStore((s) => s.isHydrated)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

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
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-lg font-bold text-sandrift-950">
          購物車
          <span className="ml-1.5 text-base font-normal text-sandrift-400">
            ({activeItems.reduce((sum, item) => sum + item.quantity, 0)})
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
          subtotal={activeItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}
          itemCount={activeItems.reduce((sum, item) => sum + item.quantity, 0)}
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
          href={socialMediaLinks.lineOfficial}
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
