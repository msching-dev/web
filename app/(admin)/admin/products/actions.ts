'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { productSchema, type ProductFormData } from '@/lib/validations/product'
import type { Json } from '@/lib/supabase/types'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return user
}

function revalidateProducts() {
  revalidatePath('/admin/products')
  revalidatePath('/')
  revalidatePath('/products', 'layout')
}

export async function createProduct(data: ProductFormData) {
  await requireAdmin()

  const parsed = productSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { images, ...rest } = parsed.data

  const { error } = await supabaseAdmin
    .from('products')
    .insert({
      ...rest,
      images: images as unknown as Json,
      detail: rest.detail as unknown as Json,
      nutrition: rest.nutrition as unknown as Json,
      specifications: rest.specifications as unknown as Json,
    })

  if (error) {
    if (error.code === '23505') {
      return { error: { slug: ['此 Slug 已被使用'] } }
    }
    return { error: { _form: ['建立失敗：' + error.message] } }
  }

  revalidateProducts()
  return { success: true }
}

export async function updateProduct(id: string, data: ProductFormData) {
  await requireAdmin()

  const parsed = productSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  const { images, ...rest } = parsed.data

  const { error } = await supabaseAdmin
    .from('products')
    .update({
      ...rest,
      images: images as unknown as Json,
      detail: rest.detail as unknown as Json,
      nutrition: rest.nutrition as unknown as Json,
      specifications: rest.specifications as unknown as Json,
    })
    .eq('id', id)

  if (error) {
    if (error.code === '23505') {
      return { error: { slug: ['此 Slug 已被使用'] } }
    }
    return { error: { _form: ['更新失敗：' + error.message] } }
  }

  revalidateProducts()
  return { success: true }
}

export async function toggleProductActive(id: string) {
  await requireAdmin()

  // 原子操作：單一 SQL 翻轉 is_active，避免 TOCTOU race condition
  const { data, error } = await supabaseAdmin.rpc('toggle_product_active', { product_id: id })

  // Fallback：如果 RPC 不存在，用兩步方式（向下相容）
  if (error?.code === '42883') {
    const { data: product } = await supabaseAdmin
      .from('products')
      .select('is_active')
      .eq('id', id)
      .single()

    if (!product) return { error: '商品不存在' }

    const { error: updateError } = await supabaseAdmin
      .from('products')
      .update({ is_active: !product.is_active })
      .eq('id', id)

    if (updateError) return { error: '操作失敗：' + updateError.message }

    revalidateProducts()
    return { success: true, is_active: !product.is_active }
  }

  if (error) return { error: '操作失敗：' + error.message }

  revalidateProducts()
  return { success: true, is_active: data }
}

export async function deleteProduct(id: string) {
  await requireAdmin()

  const { data: product } = await supabaseAdmin
    .from('products')
    .select('slug, images')
    .eq('id', id)
    .single()

  if (!product) {
    return { error: '商品不存在' }
  }

  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: '刪除失敗：' + error.message }
  }

  // Clean up Storage images (best effort)
  if (product.slug) {
    const { data: files } = await supabaseAdmin.storage
      .from('product-images')
      .list(product.slug)

    if (files && files.length > 0) {
      const paths = files.map((f) => `${product.slug}/${f.name}`)
      await supabaseAdmin.storage.from('product-images').remove(paths)
    }
  }

  revalidateProducts()
  return { success: true }
}
