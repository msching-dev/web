import type { ShippingRule } from '@/types'

export function calculateShippingFee(
  subtotal: number,
  shippingMethod: string,
  baseFee: number,
  rules: ShippingRule[]
): { fee: number; appliedRule: string | null } {
  const now = new Date()

  // 過濾有效規則
  const validRules = rules
    .filter(r => r.is_active)
    .filter(r => !r.started_at || new Date(r.started_at) <= now)
    .filter(r => !r.ended_at || new Date(r.ended_at) >= now)
    .filter(r => r.shipping_methods.length === 0 || r.shipping_methods.includes(shippingMethod))
    .filter(r => !r.min_amount || subtotal >= r.min_amount)
    .sort((a, b) => b.priority - a.priority)

  const rule = validRules[0]
  if (!rule) return { fee: baseFee, appliedRule: null }

  switch (rule.rule_type) {
    case 'free':
      return { fee: 0, appliedRule: rule.name }
    case 'discount':
      return { fee: Math.max(0, baseFee - rule.discount_value), appliedRule: rule.name }
    case 'fixed':
      return { fee: rule.discount_value, appliedRule: rule.name }
    default:
      return { fee: baseFee, appliedRule: null }
  }
}
