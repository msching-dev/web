import { createClient } from './server'
import { Category } from '@/types'
import type {
  ProductInfo, ProductDetail, Tag, ImageInfo,
  DashboardStats, OrderListItem, OrderDetail, OrderStatus,
  CustomerListItem, CustomerDetail,
  ShippingRule, ShippingMethodConfig,
} from '@/types'

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
    maxCount: (row.max_order_qty as number) || 99,
    unit: (row.unit as string) || '件',
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
    .or('available_from.is.null,available_from.lte.' + new Date().toISOString())
    .or('available_until.is.null,available_until.gte.' + new Date().toISOString())
    .order('sort_order')

  if (error || !data) return []
  return data.map(toProductInfo)
}

/**
 * 取得所有商品（後台用，含下架）
 */
export async function getAllProducts() {
  const { supabaseAdmin } = await import('@/lib/supabase/admin')
  const supabase = supabaseAdmin
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
    .or('available_from.is.null,available_from.lte.' + new Date().toISOString())
    .or('available_until.is.null,available_until.gte.' + new Date().toISOString())
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

/* ─── Dashboard ─── */

export async function getDashboardStats(): Promise<DashboardStats> {
  const { supabaseAdmin } = await import('@/lib/supabase/admin')
  const { data, error } = await supabaseAdmin.rpc('get_dashboard_stats')
  if (error || !data) return { active_products: 0, pending_orders: 0, monthly_revenue: 0, total_customers: 0 }
  return data as DashboardStats
}

export async function getRecentOrders(limit = 5) {
  const { supabaseAdmin } = await import('@/lib/supabase/admin')
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*, customers(name, email)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) return []
  return data
}

/* ─── 訂單 ─── */

export async function getOrders(options: {
  status?: string
  search?: string
  page?: number
  pageSize?: number
} = {}): Promise<{ orders: OrderListItem[]; total: number }> {
  const { supabaseAdmin } = await import('@/lib/supabase/admin')
  const { status, search, page = 1, pageSize = 20 } = options
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabaseAdmin
    .from('orders')
    .select('*, customers(name, email), order_items(id)', { count: 'exact' })

  if (status) query = query.eq('status', status)
  if (search) {
    query = query.or(`order_number.ilike.%${search}%,customers.name.ilike.%${search}%`)
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error || !data) return { orders: [], total: 0 }

  const orders: OrderListItem[] = data.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    order_number: row.order_number as string,
    customer_name: (row.customers as Record<string, unknown>)?.name as string | null,
    customer_email: (row.customers as Record<string, unknown>)?.email as string | null,
    item_count: Array.isArray(row.order_items) ? row.order_items.length : 0,
    total_amount: row.total_amount as number,
    shipping_fee: (row.shipping_fee as number) ?? 0,
    status: row.status as OrderStatus,
    created_at: row.created_at as string,
  }))

  return { orders, total: count ?? 0 }
}

export async function getOrderById(id: string): Promise<OrderDetail | null> {
  const { supabaseAdmin } = await import('@/lib/supabase/admin')

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*, customers(name, email, phone), order_items(*)')
    .eq('id', id)
    .single()

  if (error || !data) return null

  const customer = data.customers as Record<string, unknown> | null
  const items = (data.order_items as Record<string, unknown>[]) ?? []

  return {
    id: data.id,
    order_number: data.order_number,
    customer_name: customer?.name as string | null,
    customer_email: customer?.email as string | null,
    customer_phone: customer?.phone as string | null,
    item_count: items.length,
    total_amount: data.total_amount,
    shipping_fee: data.shipping_fee ?? 0,
    subtotal: data.subtotal,
    status: data.status as OrderStatus,
    shipping_method: data.shipping_method,
    shipping_name: data.shipping_name,
    shipping_phone: data.shipping_phone,
    shipping_address: data.shipping_address,
    admin_note: data.admin_note,
    tracking_number: data.tracking_number,
    customer_note: data.customer_note,
    paid_at: data.paid_at,
    shipped_at: data.shipped_at,
    created_at: data.created_at,
    items: items.map((item) => ({
      id: item.id as string,
      product_name: item.product_name as string,
      product_price: item.product_price as number,
      quantity: item.quantity as number,
      subtotal: item.subtotal as number,
    })),
  }
}

/* ─── 會員 ─── */

export async function getCustomers(options: {
  search?: string
  page?: number
  pageSize?: number
} = {}): Promise<{ customers: CustomerListItem[]; total: number }> {
  const { supabaseAdmin } = await import('@/lib/supabase/admin')
  const { search, page = 1, pageSize = 20 } = options
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabaseAdmin
    .from('customers')
    .select('*', { count: 'exact' })

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`)
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error || !data) return { customers: [], total: 0 }

  // 取得每位顧客的訂單統計
  const customerIds = data.map((c: Record<string, unknown>) => c.id as string)

  const { data: orderStats } = await supabaseAdmin
    .from('orders')
    .select('customer_id, total_amount')
    .in('customer_id', customerIds)
    .in('status', ['paid', 'preparing', 'shipped', 'completed'])

  const statsMap = new Map<string, { count: number; total: number }>()
  if (orderStats) {
    for (const row of orderStats) {
      const existing = statsMap.get(row.customer_id) ?? { count: 0, total: 0 }
      existing.count++
      existing.total += row.total_amount ?? 0
      statsMap.set(row.customer_id, existing)
    }
  }

  const customers: CustomerListItem[] = data.map((row: Record<string, unknown>) => {
    const stats = statsMap.get(row.id as string) ?? { count: 0, total: 0 }
    return {
      id: row.id as string,
      name: row.name as string | null,
      email: row.email as string | null,
      phone: row.phone as string | null,
      order_count: stats.count,
      total_spent: stats.total,
      created_at: row.created_at as string,
    }
  })

  return { customers, total: count ?? 0 }
}

export async function getCustomerById(id: string): Promise<CustomerDetail | null> {
  const { supabaseAdmin } = await import('@/lib/supabase/admin')

  const { data, error } = await supabaseAdmin
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    auth_id: data.auth_id,
    default_address: data.default_address,
    default_shipping_method: data.default_shipping_method,
    note: data.note,
    line_user_id: data.line_user_id,
    order_count: 0,
    total_spent: 0,
    created_at: data.created_at,
  }
}

/* ─── 運費 ─── */

export async function getShippingRules(): Promise<ShippingRule[]> {
  const { supabaseAdmin } = await import('@/lib/supabase/admin')

  const { data, error } = await supabaseAdmin
    .from('shipping_rules')
    .select('*')
    .order('priority', { ascending: false })

  if (error || !data) return []
  return data as ShippingRule[]
}

export async function getShippingMethodsConfig(): Promise<Record<string, ShippingMethodConfig>> {
  const { supabaseAdmin } = await import('@/lib/supabase/admin')

  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('value')
    .eq('key', 'shipping_methods_config')
    .single()

  if (error || !data) {
    return {
      cvs: { enabled: true, label: '全家店到店', fee: 60 },
      home: { enabled: false, label: '宅配到府', fee: 150 },
    }
  }

  return data.value as Record<string, ShippingMethodConfig>
}
