'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'

/** 不顯示 CTA 的頁面 */
const HIDE_ON = ['/account', '/coming-soon', '/admin']

export default function StoreCta() {
  const pathname = usePathname()
  const isHydrated = useCartStore((s) => s.isHydrated)
  const items = useCartStore((s) => s.items)
  const cartCount = isHydrated
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0

  if (HIDE_ON.some((p) => pathname.startsWith(p))) return null

  const isCartPage = pathname === '/cart'
  const isProductPage = pathname.startsWith('/products/')
  const isHomePage = pathname === '/'
  const hasItems = cartCount > 0

  // 購物車頁：空車隱藏（CartEmpty 自己有按鈕），有商品顯示結帳 CTA（桌面也顯示）
  if (isCartPage) {
    if (!hasItems) return null
    return (
      <CtaWrapper>
        <button
          type="button"
          className="cta-shine flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-sandrift-500 py-3 text-sm font-semibold text-white shadow-lg shadow-sandrift-500/20 transition-colors hover:bg-sandrift-600 active:scale-[0.98]"
          onClick={() => {
            alert('結帳功能即將推出，請先透過 LINE 下單')
          }}
        >
          前往結帳
        </button>
      </CtaWrapper>
    )
  }

  // 產品頁：空車隱藏
  if (isProductPage && !hasItems) return null

  // 有商品 → 查看購物車；沒商品 → 立即選購
  if (hasItems) {
    return (
      <CtaWrapper>
        <Link
          href="/cart"
          className="cta-shine flex w-full items-center justify-center gap-2 rounded-xl bg-sandrift-500 py-3 text-sm font-semibold text-white shadow-lg shadow-sandrift-500/20 transition-colors hover:bg-sandrift-600 active:scale-[0.98]"
        >
          <ShoppingBag className="h-4 w-4" />
          查看購物車 ({cartCount})
        </Link>
      </CtaWrapper>
    )
  }

  return (
    <CtaWrapper>
      <Link
        href={isHomePage ? '#products' : '/#products'}
        className="cta-shine flex w-full items-center justify-center gap-2 rounded-xl bg-sandrift-500 py-3 text-sm font-semibold text-white shadow-lg shadow-sandrift-500/20 transition-colors hover:bg-sandrift-600 active:scale-[0.98]"
      >
        <ShoppingBag className="h-4 w-4" />
        立即選購
      </Link>
    </CtaWrapper>
  )
}

/** 液態玻璃底部容器 */
function CtaWrapper({
  children,
  showOnDesktop = false,
}: {
  children: React.ReactNode
  showOnDesktop?: boolean
}) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 border-t border-sandrift-200/15 bg-white/40 p-3 backdrop-blur-2xl backdrop-saturate-[1.8] shadow-[inset_0_1px_0_rgba(176,141,98,0.08),0_-4px_16px_rgba(176,141,98,0.06)] ${
        showOnDesktop ? '' : 'lg:hidden'
      }`}
    >
      <div className={showOnDesktop ? 'mx-auto max-w-3xl' : ''}>
        {children}
      </div>
    </div>
  )
}
