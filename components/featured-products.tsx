import Image from 'next/image'
import Link from 'next/link'
import type { ProductInfo } from '@/types'

interface FeaturedProductsProps {
  products: ProductInfo[]
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const featured = products.filter(
    (p) => p.tag === 'hot' || p.tag === 'top_1'
  )

  if (featured.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-sandrift-950">
          招牌推薦
        </h2>
        <p className="text-sm text-sandrift-500 mt-2">
          最多人回購的人氣商品
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((product) => (
          <Link
            key={product.key}
            href={`/products/${product.key}`}
            className="group rounded-2xl overflow-hidden ring-1 ring-sandrift-100/80 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            <div className="aspect-[4/3] bg-sandrift-50/30 relative overflow-hidden">
              <Image
                src={product.banner.src}
                alt={product.banner.altText}
                fill
                className="object-cover"
              />
            </div>
            <div className="px-5 py-4">
              <p className="text-sm font-semibold text-sandrift-900">
                {product.name}
              </p>
              <p className="text-lg font-bold text-sandrift-600 mt-1">
                NT${product.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
