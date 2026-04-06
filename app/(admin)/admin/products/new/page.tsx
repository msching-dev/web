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
    <div className="animate-page-enter">
      <div className="mb-6 flex items-center gap-2 text-sm">
        <Link
          href="/admin/products"
          className="flex items-center gap-1 text-sandrift-400 hover:text-sandrift-600 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          商品管理
        </Link>
        <span className="text-sandrift-200">/</span>
        <h1 className="text-xl font-bold text-sandrift-950">新增商品</h1>
      </div>

      <ProductForm
        categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
        onSubmit={createProduct}
        submitLabel="建立商品"
      />
    </div>
  )
}
