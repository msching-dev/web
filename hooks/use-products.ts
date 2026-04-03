'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ProductInfo, ProductDetail, Category } from '@/types'

const hideProductKeys = [
  'matchaMadeleine',
  'cranBerryMadeleine',
  'thaiAndChocolateMadeleine',
  'earlGreyTeaAndHoneyLemonMadeleine',
  'quartetMadeleine',
]

export function useProducts() {
  const [products, setProducts] = useState<ProductInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data: ProductInfo[]) => {
        const visible = data.filter((p) => !hideProductKeys.includes(p.key))
        setProducts(visible)
      })
      .finally(() => setLoading(false))
  }, [])

  const filterByCategory = useCallback(
    (category: Category | null) => {
      if (!category) return products
      return products.filter((p) => p.categories.includes(category))
    },
    [products]
  )

  const searchProducts = useCallback(
    (query: string) => {
      if (!query.trim()) return products
      const q = query.toLowerCase()
      return products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.alias.toLowerCase().includes(q)
      )
    },
    [products]
  )

  return { products, loading, filterByCategory, searchProducts }
}

export function useProductDetail(key: string) {
  const [detail, setDetail] = useState<ProductDetail | null>(null)
  const [product, setProduct] = useState<ProductInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!key) return

    Promise.all([
      fetch(`/api/products/${key}`).then((res) => res.json()),
      fetch('/api/products').then((res) => res.json()),
    ])
      .then(([detailData, allProducts]) => {
        setDetail(detailData)
        const found = (allProducts as ProductInfo[]).find((p) => p.key === key)
        setProduct(found || null)
      })
      .finally(() => setLoading(false))
  }, [key])

  return { detail, product, loading }
}
