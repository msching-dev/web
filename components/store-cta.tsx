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

  // 產品頁：購物車有商品時顯示「查看購物車(N)」，沒有時隱藏 CTA（主按鈕已在���面上）
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
