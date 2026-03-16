'use client'

import { Suspense, useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import BannerCarousel from '@/components/banner-carousel'
import ProductCard from '@/components/product-card'
import ProductSearch from '@/components/product-search'
import NoProductsFound from '@/components/no-products-found'
import ProductListSkeleton from '@/components/products/product-list-skeleton'
import { useProducts } from '@/hooks/use-products'
import { Category } from '@/types'

const categoryTabs = [
  { value: 'all', label: '全部' },
  { value: Category.Hot, label: '熱賣中' },
  { value: Category.Cookie, label: '餅乾' },
  { value: Category.Madeleine, label: '瑪德蓮' },
  { value: Category.Festival, label: '節慶禮盒' },
]

function HomeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryParam = searchParams.get('category') || 'all'

  const [searchQuery, setSearchQuery] = useState('')
  const { products, loading, filterByCategory } = useProducts()

  const filteredProducts = useMemo(() => {
    let result = categoryParam === 'all'
      ? products
      : filterByCategory(categoryParam as Category)

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.alias.toLowerCase().includes(query)
      )
    }

    return result
  }, [products, categoryParam, searchQuery, filterByCategory])

  const handleCategoryChange = (value: string) => {
    if (value === 'all') {
      router.push('/')
    } else {
      router.push(`/?category=${value}`)
    }
  }

  return (
    <div className="animate-page-enter">
      <BannerCarousel />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Section heading */}
        <div className="mb-6 text-center">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-sandrift-950">
            產品分類
          </h2>
        </div>

        {/* Liquid Glass Tabs + Search */}
        <div className="mb-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div className="glass-subtle inline-flex items-center rounded-2xl p-1 ring-1 ring-white/30">
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

          <ProductSearch
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
        </div>

        {/* Product grid */}
        {loading ? (
          <ProductListSkeleton />
        ) : filteredProducts.length === 0 ? (
          <NoProductsFound />
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.key} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <ProductListSkeleton />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  )
}
