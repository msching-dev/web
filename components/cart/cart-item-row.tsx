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
      className={`flex gap-3 py-3 ${isDisabled ? 'opacity-50' : ''}`}
    >
      {/* Product image — 64px */}
      <Link
        href={isDisabled ? '#' : `/products/${item.slug}`}
        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-sandrift-50/50"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between gap-1">
        {/* Row 1: name + remove */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={isDisabled ? '#' : `/products/${item.slug}`}
              className="text-sm font-semibold text-sandrift-900 transition-colors hover:text-sandrift-700"
            >
              {item.name}
            </Link>
            {isDisabled && (
              <p className="mt-0.5 text-xs text-red-400">商品已下架</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.productId)}
            className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-sandrift-300 transition-colors hover:bg-sandrift-50 hover:text-sandrift-600"
            aria-label={`移除 ${item.name}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Row 2: price + stepper */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-sandrift-400">
            NT${item.price}
          </span>

          {/* Quantity selector */}
          <div className="flex items-center rounded-lg ring-1 ring-sandrift-200/60">
            <button
              type="button"
              onClick={() =>
                onUpdateQuantity(item.productId, item.quantity - 1)
              }
              disabled={isDisabled || item.quantity <= 1}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-l-lg text-sandrift-500 transition-colors hover:bg-sandrift-50 disabled:cursor-not-allowed disabled:text-sandrift-200"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="flex h-7 w-7 items-center justify-center border-x border-sandrift-200/60 text-xs font-semibold tabular-nums text-sandrift-800">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                onUpdateQuantity(item.productId, item.quantity + 1)
              }
              disabled={isDisabled || item.quantity >= item.maxCount}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-r-lg text-sandrift-500 transition-colors hover:bg-sandrift-50 disabled:cursor-not-allowed disabled:text-sandrift-200"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
