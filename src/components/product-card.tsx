import Link from 'next/link'
import Image from 'next/image'
import type { ProductInfo } from '@/types'

interface ProductCardProps {
  product: ProductInfo
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.key}`}
      className="group relative block cursor-pointer overflow-hidden rounded-2xl bg-white ring-1 ring-sandrift-100/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(176,141,98,0.08)]"
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
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src="/images/products/common/card_bg.png"
          alt=""
          fill
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
        <h3 className="line-clamp-1 text-[13px] font-semibold text-sandrift-900">
          {product.name}
        </h3>
        <div className="mt-1 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-sandrift-300 line-through">
                ${product.originalPrice}
              </span>
            )}
            <span className="text-[14px] font-bold text-sandrift-600">
              ${product.price}
            </span>
          </div>
          {product.alias && (
            <span className="text-[11px] text-sandrift-400">
              {product.alias}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
