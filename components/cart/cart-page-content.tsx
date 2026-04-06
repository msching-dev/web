'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import CartItemRow from './cart-item-row'
import CartEmpty from './cart-empty'

export default function CartPageContent() {
  const items = useCartStore((s) => s.items)
  const isHydrated = useCartStore((s) => s.isHydrated)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  // Hydration 中：骨架屏
  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-5">
        <div className="mb-5 flex items-center justify-between">
          <div className="h-6 w-28 rounded bg-sandrift-100 animate-pulse" />
          <div className="h-4 w-16 rounded bg-sandrift-50 animate-pulse" />
        </div>
        <div className="animate-pulse space-y-3">
          <div className="flex gap-3">
            <div className="h-16 w-16 shrink-0 rounded-lg bg-sandrift-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 rounded bg-sandrift-100" />
              <div className="h-3 w-16 rounded bg-sandrift-50" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="h-16 w-16 shrink-0 rounded-lg bg-sandrift-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 rounded bg-sandrift-100" />
              <div className="h-3 w-16 rounded bg-sandrift-50" />
            </div>
          </div>
        </div>
        <div className="mt-6 animate-pulse rounded-2xl bg-sandrift-50/30 p-5 ring-1 ring-sandrift-100/30">
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="h-4 w-24 rounded bg-sandrift-100" />
              <div className="h-4 w-16 rounded bg-sandrift-100" />
            </div>
            <div className="h-11 rounded-xl bg-sandrift-100" />
          </div>
        </div>
      </div>
    )
  }

  const activeItems = items.filter((item) => item.isActive)
  const inactiveItems = items.filter((item) => !item.isActive)

  if (items.length === 0) {
    return <CartEmpty />
  }

  const subtotal = activeItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = activeItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      {/* Header */}
      <div className="py-5 flex items-center justify-between">
        <h1 className="text-lg font-bold text-sandrift-950">
          購物車
          <span className="ml-1.5 text-base font-normal text-sandrift-400">
            ({itemCount})
          </span>
        </h1>
        <Link
          href="/#products"
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
      <div className="mt-5 rounded-2xl bg-sandrift-50/30 p-5 ring-1 ring-sandrift-100/30">
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between text-sandrift-600">
            <span>商品小計（{itemCount} 件）</span>
            <span className="tabular-nums">NT${subtotal}</span>
          </div>
          <div className="flex justify-between text-sandrift-400">
            <span>運費</span>
            <span>待結算</span>
          </div>
          <div className="border-t border-sandrift-200/40 pt-2.5">
            <div className="flex justify-between font-semibold text-sandrift-900">
              <span>合計</span>
              <span className="text-base tabular-nums">NT${subtotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop 結帳按鈕 */}
      {activeItems.length > 0 && (
        <button
          type="button"
          className="cta-shine mt-4 hidden w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-sandrift-500 py-3 text-sm font-semibold text-white shadow-lg shadow-sandrift-500/20 transition-colors hover:bg-sandrift-600 active:scale-[0.98] lg:flex"
          onClick={() => {
            alert('結帳功能即將推出，請先透過 LINE 下單')
          }}
        >
          前往結帳
        </button>
      )}

      {/* 底部留白給 StoreCta sticky bar（手機版） */}
      <div className="h-16 lg:h-8" />
    </div>
  )
}
