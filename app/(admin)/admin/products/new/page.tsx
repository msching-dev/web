import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getCategories } from '@/lib/supabase/queries'
import ProductForm from '@/components/admin/product-form'
import { createProduct } from '../actions'

export const metadata = {
  title: '新增商品 | MS. CHING 後台',
}

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/products"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          商品管理
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-lg font-semibold text-gray-900">新增商品</h1>
      </div>

      <ProductForm
        categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
        onSubmit={createProduct}
        submitLabel="建立商品"
      />
    </div>
  )
}
