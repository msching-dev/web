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

export async function updateCustomerNote(customerId: string, note: string) {
  await requireAdmin()

  const { error } = await supabaseAdmin
    .from('customers')
    .update({ note })
    .eq('id', customerId)

  if (error) return { error: error.message }

  revalidatePath('/admin/customers')
  return { success: true }
}
