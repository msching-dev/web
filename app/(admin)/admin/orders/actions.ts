'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.role !== 'admin') {
    throw new Error('Unauthorized')
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin()

  const updateData: Record<string, unknown> = { status }

  if (status === 'shipped') updateData.shipped_at = new Date().toISOString()
  if (status === 'paid') updateData.paid_at = new Date().toISOString()

  const { error } = await supabaseAdmin
    .from('orders')
    .update(updateData)
    .eq('id', orderId)

  if (error) return { error: error.message }

  revalidatePath('/admin/orders')
  revalidatePath('/admin')
  return { success: true }
}

export async function updateOrderAdmin(orderId: string, data: {
  admin_note?: string
  tracking_number?: string
}) {
  await requireAdmin()

  const { error } = await supabaseAdmin
    .from('orders')
    .update(data)
    .eq('id', orderId)

  if (error) return { error: error.message }

  revalidatePath('/admin/orders')
  return { success: true }
}
