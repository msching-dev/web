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
