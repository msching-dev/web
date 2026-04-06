export type ProductKey =
  | 'almondCookie'
  | 'earlGreyTeaMadeleine'
  | 'chocolateMadeleine'
  | 'matchaMadeleine'
  | 'cranBerryMadeleine'
  | 'honeyLemonMadeleine'
  | 'thaiTeaMadeleine'
  | 'poloCookie'
  | 'thaiAndChocolateMadeleine'
  | 'earlGreyTeaAndHoneyLemonMadeleine'
  | 'quartetMadeleine'
  | 'pineappleCake_6'
  | 'pineappleCake_12'

export type Tag = 'hot' | 'new' | 'top_1' | 'top_2' | 'top_3' | 'christmas'

export enum Category {
  Hot = 'hot',
  Cookie = 'cookie',
  Madeleine = 'madeleine',
  Festival = 'festival',
}

export interface ProductInfo {
  id: string
  key: string
  name: string
  price: number
  originalPrice?: number
  tag: Tag
  alias: string
  categories: Category[]
  banner: ImageInfo
  hidden?: boolean
  maxCount: number
  unit: string
}

export interface ProductDetail {
  id: number
  images: string[]
  productImage: string
  descriptions: Descriptions
  specifications: Content[]
  maxCount: number
  portionSize: number
  includeSize: string
  unit: string
  everyNutrientContent: Content[]
  everyHundredNutrientContent: Content[]
  giftBoxNutrientContent?: GiftBoxContent[]
}

export interface Descriptions {
  desc: string
  nonAdditive: string
  howToEat: string
  preservationMethod: string
  precautions: string
  tastePeriod: string
}

export interface GiftBoxContent {
  taste: string
  content: Content[]
}

export interface Content {
  key: string
  value: number
}

export interface ImageInfo {
  src: string
  altText: string
  title: string
}

export interface MenuItem {
  name: string
  path?: string
  icon?: string
  hidden?: boolean
  children?: MenuItem[]
}

export interface ActivityItem {
  id: number
  type: 'newItem' | 'discount' | 'festival'
  title: string
  description: string
  image: string
  startTime: number
  endTime: number
}

/* ─── 訂單 ─── */

export type OrderStatus = 'pending_payment' | 'paid' | 'preparing' | 'shipped' | 'completed' | 'cancelled'

export interface OrderListItem {
  id: string
  order_number: string
  customer_name: string | null
  customer_email: string | null
  item_count: number
  total_amount: number
  shipping_fee: number
  status: OrderStatus
  created_at: string
}

export interface OrderDetail extends OrderListItem {
  customer_phone: string | null
  shipping_method: string | null
  shipping_name: string | null
  shipping_phone: string | null
  shipping_address: string | null
  subtotal: number
  admin_note: string | null
  tracking_number: string | null
  customer_note: string | null
  paid_at: string | null
  shipped_at: string | null
  items: OrderItemInfo[]
}

export interface OrderItemInfo {
  id: string
  product_name: string
  product_price: number
  quantity: number
  subtotal: number
}

/* ─── 會員 ─── */

export interface CustomerListItem {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  order_count: number
  total_spent: number
  created_at: string
}

export interface CustomerDetail extends CustomerListItem {
  auth_id: string | null
  default_address: string | null
  default_shipping_method: string | null
  note: string | null
  line_user_id: string | null
}

/* ─── 運費 ─── */

export interface ShippingRule {
  id: string
  name: string
  rule_type: 'free' | 'discount' | 'fixed'
  min_amount: number | null
  discount_value: number
  shipping_methods: string[]
  is_active: boolean
  priority: number
  started_at: string | null
  ended_at: string | null
}

export interface ShippingMethodConfig {
  enabled: boolean
  label: string
  fee: number
}

/* ─── Dashboard ─── */

export interface DashboardStats {
  active_products: number
  pending_orders: number
  monthly_revenue: number
  total_customers: number
}
