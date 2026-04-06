import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAllProducts } from '@/lib/supabase/queries'
import SortableProductTable from './sortable-product-table'
import AdminPageHeader from '@/components/admin/admin-page-header'

export default async function AdminProductsPage() {
  const products = await getAllProducts()

  return (
    <div className="animate-page-enter">
      <AdminPageHeader
        title="商品管理"
        subtitle={`共 ${products.length} 項商品`}
        action={
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 rounded-xl bg-sandrift-500 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-sandrift-600"
          >
            <Plus className="h-4 w-4" />
            新增商品
          </Link>
        }
      />

      <div className="mt-6 rounded-2xl bg-white/60 ring-1 ring-sandrift-100/40 overflow-hidden">
        <SortableProductTable products={products} />
      </div>
    </div>
  )
}
