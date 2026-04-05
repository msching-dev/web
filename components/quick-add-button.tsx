'use client'

import { useState } from 'react'
import { ShoppingBag, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/stores/cart-store'
import type { ProductInfo } from '@/types'

interface QuickAddButtonProps {
  product: ProductInfo
}

export default function QuickAddButton({ product }: QuickAddButtonProps) {
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const items = useCartStore((s) => s.items)
  const router = useRouter()

  const existingQty = items.find(
    (item) => item.productId === product.id
  )?.quantity ?? 0
  const isMaxed = existingQty >= product.maxCount

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isMaxed) {
      router.push(`/products/${product.key}`)
      return
    }

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
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-sandrift-500 ring-1 ring-sandrift-200/60 backdrop-blur-sm shadow-sm transition-all duration-300 hover:bg-sandrift-500 hover:text-white hover:ring-sandrift-500/30 hover:shadow-md hover:scale-105 active:scale-95"
      aria-label={isMaxed ? '已達上限' : `加入 ${product.name} 到購物車`}
    >
      {added ? (
        <Check className="h-4 w-4" />
      ) : (
        <ShoppingBag className="h-4 w-4" />
      )}
    </button>
  )
}
