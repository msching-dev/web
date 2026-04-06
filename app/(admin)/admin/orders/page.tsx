import { Suspense } from 'react'
import { ClipboardList } from 'lucide-react'
import { getOrders } from '@/lib/supabase/queries'
import AdminPageHeader from '@/components/admin/admin-page-header'
import AdminEmpty from '@/components/admin/admin-empty'
import AdminPagination from '@/components/admin/admin-pagination'
import AdminTabs from '@/components/admin/admin-tabs'
import AdminSearch from '@/components/admin/admin-search'
import OrderList from './order-list'

const orderTabs = [
  { key: '', label: '全部' },
  { key: 'pending_payment', label: '待付款' },
  { key: 'paid', label: '已付款' },
  { key: 'preparing', label: '製作中' },
  { key: 'shipped', label: '已寄出' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
]

interface Props {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const params = await searchParams
  const { orders, total } = await getOrders({
    status: params.status || undefined,
    search: params.q || undefined,
    page: Number(params.page ?? '1'),
  })

  return (
    <div className="animate-page-enter">
      <AdminPageHeader title="訂單管理" subtitle={`共 ${total} 筆訂單`} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Suspense>
          <AdminTabs tabs={orderTabs} />
        </Suspense>
        <Suspense>
          <AdminSearch placeholder="搜尋訂單編號或顧客名..." />
        </Suspense>
      </div>

      {orders.length === 0 ? (
        <AdminEmpty icon={ClipboardList} title="沒有符合的訂單" />
      ) : (
        <OrderList orders={orders} />
      )}

      <Suspense>
        <AdminPagination total={total} />
      </Suspense>
    </div>
  )
}
