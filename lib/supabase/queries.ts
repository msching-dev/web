import { createClient } from './server'
import { Category } from '@/types'
import type { ProductInfo, ProductDetail, Tag, ImageInfo } from '@/types'

// DB row → ProductInfo (for list pages)
function toProductInfo(row: Record<string, unknown>): ProductInfo {
  const images = (row.images as Array<{ url: string; alt: string; sort_order: number }>) || []
  const firstImage = [...images].sort((a, b) => a.sort_order - b.sort_order)[0]

  const banner: ImageInfo = firstImage
    ? { src: firstImage.url, altText: firstImage.alt || (row.name as string), title: row.name as string }
    : { src: '', altText: row.name as string, title: row.name as string }

  // Build categories array from category slug + tags
  const categories: Category[] = []
  const categorySlug = (row.categories as { slug: string } | null)?.slug
  if (categorySlug && Object.values(Category).includes(categorySlug as Category)) {
    categories.push(categorySlug as Category)
  }
  const tags = (row.tags as string[]) || []
  if (tags.includes('hot') && !categories.includes(Category.Hot)) {
    categories.push(Category.Hot)
  }

  // Pick the first non-'hot' tag as the display tag
  const displayTag = tags.find(t => t !== 'hot') || (tags.includes('hot') ? 'hot' : '')

  return {
    id: row.id as string,
    key: row.slug as string,
    name: row.name as string,
    price: row.price as number,
    originalPrice: (row.compare_price as number) || undefined,
    tag: (displayTag || undefined) as Tag,
    alias: (row.alias as string) || '',
    categories,
    banner,
  }
}

// DB row → ProductDetail (for detail page)
function toProductDetail(row: Record<string, unknown>): ProductDetail {
  const images = (row.images as Array<{ url: string; alt: string; sort_order: number }>) || []
  const sortedImages = images.sort((a, b) => a.sort_order - b.sort_order).map(img => img.url)

  const detail = (row.detail as Record<string, string>) || {}
  const nutrition = (row.nutrition as Record<string, unknown>) || {}
  const specifications = (row.specifications as Array<{ key: string; value: number }>) || []

  return {
    id: 0,
    images: sortedImages,
    productImage: sortedImages[0] || '',
    descriptions: {
      desc: detail.desc || '',
      nonAdditive: detail.nonAdditive || '',
      howToEat: detail.howToEat || '',
      preservationMethod: detail.preservationMethod || '',
      precautions: detail.precautions || '',
      tastePeriod: detail.tastePeriod || '',
    },
    specifications,
    maxCount: (row.max_order_qty as number) || 99,
    portionSize: (row.portion_size as number) || 0,
    includeSize: (row.include_size as string) || '',
    unit: (row.unit as string) || '',
    everyNutrientContent: (nutrition.perServing as Array<{ key: string; value: number }>) || [],
    everyHundredNutrientContent: (nutrition.perHundred as Array<{ key: string; value: number }>) || [],
    giftBoxNutrientContent: (nutrition.giftBox as Array<{ taste: string; content: Array<{ key: string; value: number }> }>) || undefined,
  }
}

/**
 * 取得所有上架商品（前台用）
 */
export async function getProducts(): Promise<ProductInfo[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(slug)')
    .eq('is_active', true)
    .order('sort_order')

  if (error || !data) return []
  return data.map(toProductInfo)
}

/**
 * 取得所有商品（後台用，含下架）
 */
export async function getAllProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .order('sort_order')

  if (error || !data) return []
  return data
}

/**
 * 取得單一商品（前台產品頁）
 */
export async function getProductBySlug(slug: string): Promise<{ product: ProductInfo; detail: ProductDetail } | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(slug)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !data) return null

  return {
    product: toProductInfo(data),
    detail: toProductDetail(data),
  }
}

/**
 * 取得所有分類
 */
export async function getCategories() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (error || !data) return []
  return data
}

/**
 * 取得單一商品 by ID（後台編輯用，含下架商品）
 */
export async function getProductById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data
}
