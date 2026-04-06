import { Suspense } from 'react'
import { Users } from 'lucide-react'
import { getCustomers } from '@/lib/supabase/queries'
import AdminPageHeader from '@/components/admin/admin-page-header'
import AdminEmpty from '@/components/admin/admin-empty'
import AdminPagination from '@/components/admin/admin-pagination'
import AdminSearch from '@/components/admin/admin-search'
import CustomerList from './customer-list'

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function AdminCustomersPage({ searchParams }: Props) {
  const params = await searchParams
  const { customers, total } = await getCustomers({
    search: params.q || undefined,
    page: Number(params.page ?? '1'),
  })

  return (
    <div className="animate-page-enter">
      <AdminPageHeader title="會員管理" subtitle={`共 ${total} 位會員`} />

      <div className="mb-4">
        <Suspense>
          <AdminSearch placeholder="搜尋姓名或 Email..." />
        </Suspense>
      </div>

      {customers.length === 0 ? (
        <AdminEmpty icon={Users} title="沒有符合的會員" />
      ) : (
        <CustomerList customers={customers} />
      )}

      <Suspense>
        <AdminPagination total={total} />
      </Suspense>
    </div>
  )
}
