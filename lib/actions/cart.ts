'use server'

import { createClient } from '@/lib/supabase/server'
import type { CartItem, GuestCartItem } from '@/types/cart'

/**
 * 取得目前用戶的 customer_id
 * 透過 auth.uid() → customers.auth_id 關聯
 */
async function getCustomerId(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('customers')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  return data?.id ?? null
}

/**
 * 讀取用戶購物車（join products 取最新資料）
 */
export async function getCartItems(): Promise<CartItem[]> {
  const supabase = await createClient()
  const customerId = await getCustomerId()
  if (!customerId) return []

  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      product_id,
      quantity,
      products (
        slug,
        name,
        price,
        images,
        max_order_qty,
        unit,
        is_active
      )
    `)
    .eq('customer_id', customerId)

  if (error || !data) return []

  return data
    .filter((row) => row.products !== null)
    .map((row) => {
      const p = row.products as Record<string, unknown>
      const images = (p.images as Array<{ url: string; sort_order: number }>) || []
      const firstImage = [...images].sort((a, b) => a.sort_order - b.sort_order)[0]

      return {
        productId: row.product_id,
        slug: p.slug as string,
        name: p.name as string,
        price: p.price as number,
        image: firstImage?.url ?? '',
        quantity: row.quantity,
        maxCount: (p.max_order_qty as number) ?? 99,
        unit: (p.unit as string) ?? '',
        isActive: p.is_active as boolean,
      }
    })
}

/**
 * 新增或更新購物車商品（upsert）
 */
export async function upsertCartItem(
  productId: string,
  quantity: number
): Promise<{ success: boolean }> {
  const supabase = await createClient()
  const customerId = await getCustomerId()
  if (!customerId) return { success: false }

  const { error } = await supabase
    .from('cart_items')
    .upsert(
      { customer_id: customerId, product_id: productId, quantity },
      { onConflict: 'customer_id,product_id' }
    )

  return { success: !error }
}

/**
 * 刪除單一商品
 */
export async function removeCartItem(
  productId: string
): Promise<{ success: boolean }> {
  const supabase = await createClient()
  const customerId = await getCustomerId()
  if (!customerId) return { success: false }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('customer_id', customerId)
    .eq('product_id', productId)

  return { success: !error }
}

/**
 * 清空購物車
 */
export async function clearCart(): Promise<{ success: boolean }> {
  const supabase = await createClient()
  const customerId = await getCustomerId()
  if (!customerId) return { success: false }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('customer_id', customerId)

  return { success: !error }
}

/**
 * 登入合併：guest localStorage → DB
 *
 * 合併規則：同商品取 max(guest.quantity, db.quantity)
 * guestItems 為空陣列時，等同於單純從 DB 載入。
 */
export async function mergeGuestCart(
  guestItems: GuestCartItem[]
): Promise<CartItem[]> {
  const supabase = await createClient()
  const customerId = await getCustomerId()
  if (!customerId) return []

  if (guestItems.length > 0) {
    // 讀取目前 DB 購物車
    const { data: dbItems } = await supabase
      .from('cart_items')
      .select('product_id, quantity')
      .eq('customer_id', customerId)

    const dbMap = new Map(
      (dbItems ?? []).map((item) => [item.product_id, item.quantity])
    )

    // 合併：取 max quantity
    const upserts = guestItems.map((guest) => ({
      customer_id: customerId,
      product_id: guest.productId,
      quantity: Math.max(guest.quantity, dbMap.get(guest.productId) ?? 0),
    }))

    await supabase
      .from('cart_items')
      .upsert(upserts, { onConflict: 'customer_id,product_id' })
  }

  // 回傳合併後完整購物車
  return getCartItems()
}
