'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

const HIDE_ON = ['/cart', '/account', '/coming-soon', '/admin']

export default function StoreCta() {
  const pathname = usePathname()

  if (HIDE_ON.some((p) => pathname.startsWith(p))) return null

  const isProductPage = pathname.startsWith('/products/')
  const label = isProductPage ? '加入購物車' : '立即選購'
  const href = isProductPage ? undefined : '/#products'

  if (isProductPage) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-sandrift-100/40 bg-white/90 p-3 backdrop-blur-xl lg:hidden">
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-sandrift-500 py-3 text-sm font-semibold text-white shadow-lg shadow-sandrift-500/20 transition-colors hover:bg-sandrift-600 active:scale-[0.98]"
        >
          <ShoppingBag className="h-4 w-4" />
          {label}
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-sandrift-100/40 bg-white/90 p-3 backdrop-blur-xl lg:hidden">
      <Link
        href={href!}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-sandrift-500 py-3 text-sm font-semibold text-white shadow-lg shadow-sandrift-500/20 transition-colors hover:bg-sandrift-600 active:scale-[0.98]"
      >
        <ShoppingBag className="h-4 w-4" />
        {label}
      </Link>
    </div>
  )
}
