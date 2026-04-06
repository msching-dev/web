'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { ShippingMethodConfig } from '@/types'

async function requireAdmin() {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.role !== 'admin') {
    throw new Error('Unauthorized')
  }
}

export async function updateShippingMethods(config: Record<string, ShippingMethodConfig>) {
  await requireAdmin()

  const { error } = await supabaseAdmin
    .from('site_settings')
    .upsert({ key: 'shipping_methods_config', value: config })

  if (error) return { error: error.message }
  revalidatePath('/admin/shipping')
  return { success: true }
}

export async function createShippingRule(data: {
  name: string
  rule_type: string
  min_amount: number | null
  discount_value: number
  shipping_methods: string[]
  is_active: boolean
  priority: number
  started_at: string | null
  ended_at: string | null
}) {
  await requireAdmin()

  const { error } = await supabaseAdmin
    .from('shipping_rules')
    .insert(data)

  if (error) return { error: error.message }
  revalidatePath('/admin/shipping')
  return { success: true }
}

export async function updateShippingRule(id: string, data: {
  name?: string
  rule_type?: string
  min_amount?: number | null
  discount_value?: number
  shipping_methods?: string[]
  is_active?: boolean
  priority?: number
  started_at?: string | null
  ended_at?: string | null
}) {
  await requireAdmin()

  const { error } = await supabaseAdmin
    .from('shipping_rules')
    .update(data)
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/shipping')
  return { success: true }
}

export async function deleteShippingRule(id: string) {
  await requireAdmin()

  const { error } = await supabaseAdmin
    .from('shipping_rules')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/shipping')
  return { success: true }
}
