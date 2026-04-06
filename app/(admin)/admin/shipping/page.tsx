import { getShippingMethodsConfig, getShippingRules } from '@/lib/supabase/queries'
import AdminPageHeader from '@/components/admin/admin-page-header'
import ShippingMethodsSection from './shipping-methods-section'
import ShippingRulesSection from './shipping-rules-section'

export default async function AdminShippingPage() {
  const [methodsConfig, rules] = await Promise.all([
    getShippingMethodsConfig(),
    getShippingRules(),
  ])

  return (
    <div className="animate-page-enter">
      <AdminPageHeader title="運費設定" subtitle="管理物流方式與運費減免規則" />

      <div className="space-y-6">
        <ShippingMethodsSection config={methodsConfig} />
        <ShippingRulesSection rules={rules} />
      </div>
    </div>
  )
}
