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
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-sandrift-500 text-white shadow-md transition-all duration-200 hover:bg-sandrift-600 hover:scale-110 active:scale-95"
      aria-label={isMaxed ? '已達上限' : `加入 ${product.name} 到購物車`}
    >
      {added ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <ShoppingBag className="h-3.5 w-3.5" />
      )}
    </button>
  )
}
