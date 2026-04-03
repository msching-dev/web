import { Package, ClipboardList, DollarSign, Users } from 'lucide-react'

const stats = [
  {
    label: '上架商品',
    value: '—',
    icon: Package,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    label: '待處理訂單',
    value: '—',
    icon: ClipboardList,
    color: 'text-amber-600 bg-amber-50',
  },
  {
    label: '本月營收',
    value: '—',
    icon: DollarSign,
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    label: '顧客數',
    value: '—',
    icon: Users,
    color: 'text-purple-600 bg-purple-50',
  },
]

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">總覽</h1>
      <p className="mt-1 text-sm text-gray-500">
        接上 Supabase 後顯示即時數據
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2.5 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
