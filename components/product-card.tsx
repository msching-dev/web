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
    <div className="group relative rounded-2xl bg-white ring-1 ring-sandrift-100/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(176,141,98,0.08)]">
      <Link
        href={`/products/${product.key}`}
        className="block overflow-hidden rounded-2xl"
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
                <span className="text-[11px] font-normal text-sandrift-400">
                  /{product.unit}
                </span>
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Cart Stepper Button — 視覺對齊價格行右側 */}
      <div className="absolute bottom-1.5 right-1.5 z-20 sm:bottom-2 sm:right-2">
        <CartStepperButton product={product} />
      </div>
    </div>
  )
}
