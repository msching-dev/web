'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProductCard from '@/components/product-card'
import ProductSearch from '@/components/product-search'
import NoProductsFound from '@/components/no-products-found'
import type { ProductInfo, Category } from '@/types'

const categoryTabs = [
  { value: 'all', label: '全部', heading: '所有商品' },
  { value: 'featured', label: '推薦', heading: '推薦商品' },
  { value: 'hot' as Category, label: '熱賣中', heading: '熱賣商品' },
  { value: 'cookie' as Category, label: '餅乾', heading: '餅乾' },
  { value: 'madeleine' as Category, label: '瑪德蓮', heading: '瑪德蓮' },
  { value: 'festival' as Category, label: '節慶禮盒', heading: '節慶禮盒' },
]

interface HomeContentProps {
  products: ProductInfo[]
}

export default function HomeContent({ products }: HomeContentProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryParam = searchParams.get('category') || 'featured'

  const [searchQuery, setSearchQuery] = useState('')
  const tabsRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  const updateIndicator = useCallback(() => {
    const container = tabsRef.current
    if (!container) return
    const activeBtn = container.querySelector<HTMLButtonElement>('[data-active="true"]')
    if (!activeBtn) return
    setIndicator({
      left: activeBtn.offsetLeft,
      width: activeBtn.offsetWidth,
    })
  }, [])

  useEffect(() => {
    updateIndicator()
  }, [categoryParam, updateIndicator])

  // 跨頁跳轉到 /#products 時自動 scroll
  useEffect(() => {
    if (window.location.hash === '#products') {
      const el = document.getElementById('products')
      if (el) {
        // 等頁面渲染穩定後再 scroll
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'smooth' })
        })
      }
    }
  }, [])

  // Recalculate on font load / resize
  useEffect(() => {
    window.addEventListener('resize', updateIndicator)
    document.fonts?.ready.then(updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [updateIndicator])

  const filteredProducts = useMemo(() => {
    let result: ProductInfo[]

    if (categoryParam === 'all') {
      result = products
    } else if (categoryParam === 'featured') {
      // 推薦 = top 系列 + hot（不含 new、christmas 等非推薦 tag）
      const featuredTags = new Set(['top_1', 'top_2', 'top_3', 'hot'])
      const tagWeight: Record<string, number> = {
        top_1: 1, top_2: 2, top_3: 3, hot: 4,
      }
      result = products
        .filter((p) => featuredTags.has(p.tag))
        .sort((a, b) => (tagWeight[a.tag] ?? 99) - (tagWeight[b.tag] ?? 99))
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
    if (value === 'featured') {
      router.push('/', { scroll: false })
    } else {
      router.push(`/?category=${value}`, { scroll: false })
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {/* Section heading */}
      <div className="mb-6 text-center">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-sandrift-950">
          {categoryTabs.find((t) => t.value === categoryParam)?.heading ?? '所有商品'}
        </h2>
      </div>

      {/* Liquid Glass Tabs + Search */}
      <div className="mb-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <div className="w-full overflow-x-auto scrollbar-none">
        <div ref={tabsRef} className="glass-subtle relative inline-flex items-center gap-0.5 rounded-2xl p-1 ring-1 ring-white/40 flex-nowrap min-w-max">
          {categoryTabs.map((tab) => {
            const isActive = categoryParam === tab.value
            return (
              <button
                key={tab.value}
                type="button"
                data-active={isActive}
                onClick={() => handleCategoryChange(tab.value)}
                className={`relative cursor-pointer whitespace-nowrap rounded-xl px-4 py-2 text-[13px] font-medium transition-colors duration-300 ${
                  isActive
                    ? 'text-sandrift-900'
                    : 'text-sandrift-400 hover:text-sandrift-700'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
          {/* Sliding glow indicator — 細光束：頭尾漸隱 + 柔光暈 */}
          <span
            className="pointer-events-none absolute -bottom-0.5 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.15,1)]"
            style={{
              left: indicator.left + 10,
              width: Math.max(indicator.width - 20, 0),
              height: 6,
            }}
          >
            {/* 光暈層 */}
            <span
              className="absolute inset-x-[10%] top-1/2 -translate-y-1/2 h-1.5 rounded-full opacity-35 blur-xs"
              style={{ background: 'linear-gradient(90deg, transparent, var(--color-sandrift-300), transparent)' }}
            />
            {/* 實體線：中間 2px 粗，頭尾收尖到 0 */}
            <svg viewBox="0 0 200 4" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <ellipse cx="100" cy="2" rx="85" ry="0.5" fill="var(--color-sandrift-400)" opacity="0.65" />
            </svg>
          </span>
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
