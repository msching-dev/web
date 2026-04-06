import { ClipboardList } from 'lucide-react'
import { getDashboardStats, getRecentOrders } from '@/lib/supabase/queries'
import AdminPageHeader from '@/components/admin/admin-page-header'
import AdminEmpty from '@/components/admin/admin-empty'
import StatusBadge from '@/components/admin/status-badge'
import DashboardStatCard from './dashboard-stat-card'

export default async function AdminDashboardPage() {
  const [stats, recentOrders] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(5),
  ])

  const cards = [
    { label: '上架商品', value: stats.active_products, iconKey: 'Package' as const, color: 'text-blue-500 bg-blue-50' },
    { label: '待處理訂單', value: stats.pending_orders, iconKey: 'ClipboardList' as const, color: 'text-amber-500 bg-amber-50' },
    { label: '本月營收', value: stats.monthly_revenue, iconKey: 'DollarSign' as const, color: 'text-green-500 bg-green-50', prefix: 'NT$' },
    { label: '顧客數', value: stats.total_customers, iconKey: 'Users' as const, color: 'text-purple-500 bg-purple-50' },
  ]

  return (
    <div className="animate-page-enter">
      <AdminPageHeader title="總覽" />

      {/* 統計卡片 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {cards.map((card, i) => (
          <DashboardStatCard key={card.label} {...card} index={i} />
        ))}
      </div>

      {/* 近期訂單 */}
      <div className="mt-8">
        <h2 className="mb-4 text-base font-bold text-sandrift-950">近期訂單</h2>
        {recentOrders.length === 0 ? (
          <AdminEmpty
            icon={ClipboardList}
            title="尚無訂單"
            description="訂單建立後會顯示在這裡"
          />
        ) : (
          <div className="rounded-2xl bg-white/60 ring-1 ring-sandrift-100/40 overflow-hidden">
            <table className="hidden w-full sm:table">
              <thead>
                <tr className="border-b border-sandrift-100/40 text-left text-xs text-sandrift-400">
                  <th className="px-4 py-3 font-medium">訂單編號</th>
                  <th className="px-4 py-3 font-medium">顧客</th>
                  <th className="px-4 py-3 font-medium">金額</th>
                  <th className="px-4 py-3 font-medium">狀態</th>
                  <th className="px-4 py-3 font-medium">時間</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandrift-100/30">
                {recentOrders.map((order: Record<string, unknown>, i: number) => {
                  const customer = order.customers as Record<string, unknown> | null
                  return (
                    <tr
                      key={order.id as string}
                      className="animate-stagger-in hover:bg-sandrift-50/30 transition-colors"
                      style={{ '--stagger-index': i } as React.CSSProperties}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-sandrift-900">
                        {order.order_number as string}
                      </td>
                      <td className="px-4 py-3 text-sm text-sandrift-600">
                        {(customer?.name as string) ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-sm tabular-nums text-sandrift-900">
                        NT${(order.total_amount as number)?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status as string} />
                      </td>
                      <td className="px-4 py-3 text-sm text-sandrift-400">
                        {new Date(order.created_at as string).toLocaleDateString('zh-TW')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Mobile 卡片佈局 */}
            <div className="divide-y divide-sandrift-100/30 sm:hidden">
              {recentOrders.map((order: Record<string, unknown>, i: number) => {
                const customer = order.customers as Record<string, unknown> | null
                return (
                  <div
                    key={order.id as string}
                    className="animate-stagger-in px-4 py-3 hover:bg-sandrift-50/30 transition-colors"
                    style={{ '--stagger-index': i } as React.CSSProperties}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-sandrift-900">{order.order_number as string}</span>
                      <StatusBadge status={order.status as string} />
                    </div>
                    <div className="mt-1 flex items-center justify-between text-sm">
                      <span className="text-sandrift-500">{(customer?.name as string) ?? '—'}</span>
                      <span className="tabular-nums text-sandrift-900">NT${(order.total_amount as number)?.toLocaleString()}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
