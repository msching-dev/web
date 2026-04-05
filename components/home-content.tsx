'use client'

import { useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProductCard from '@/components/product-card'
import ProductSearch from '@/components/product-search'
import NoProductsFound from '@/components/no-products-found'
import type { ProductInfo, Category } from '@/types'

const categoryTabs = [
  { value: 'all', label: '全部' },
  { value: 'featured', label: '推薦' },
  { value: 'hot' as Category, label: '熱賣中' },
  { value: 'cookie' as Category, label: '餅乾' },
  { value: 'madeleine' as Category, label: '瑪德蓮' },
  { value: 'festival' as Category, label: '節慶禮盒' },
]

interface HomeContentProps {
  products: ProductInfo[]
}

export default function HomeContent({ products }: HomeContentProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryParam = searchParams.get('category') || 'all'

  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = useMemo(() => {
    let result: ProductInfo[]

    if (categoryParam === 'all') {
      result = products
    } else if (categoryParam === 'featured') {
      result = products.filter(
        (p) => p.tag === 'hot' || p.tag === 'top_1'
      )
    } else {
      result = products.filter((p) =>
        p.categories.includes(categoryParam as Category)
      )
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.alias.toLowerCase().includes(query)
      )
    }

    return result
  }, [products, categoryParam, searchQuery])

  const handleCategoryChange = (value: string) => {
    if (value === 'all') {
      router.push('/')
    } else {
      router.push(`/?category=${value}`)
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Section heading */}
      <div className="mb-6 text-center">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-sandrift-950">
          所有商品
        </h2>
      </div>

      {/* Liquid Glass Tabs + Search */}
      <div className="mb-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible scrollbar-none">
        <div className="glass-subtle inline-flex items-center rounded-2xl p-1 ring-1 ring-white/30 flex-nowrap min-w-max">
          {categoryTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleCategoryChange(tab.value)}
              className={`relative cursor-pointer whitespace-nowrap rounded-xl px-3.5 py-1.5 text-[13px] font-medium transition-all duration-300 ease-out ${
                categoryParam === tab.value
                  ? 'bg-white/80 text-sandrift-900 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
                  : 'text-sandrift-400 hover:text-sandrift-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        </div>

        <ProductSearch
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      </div>

      {/* Product grid */}
      {filteredProducts.length === 0 ? (
        <NoProductsFound />
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-5">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.key} product={product} index={index} />
          ))}
        </div>
      )}
    </section>
  )
}
