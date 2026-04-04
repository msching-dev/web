import Image from 'next/image'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAllProducts } from '@/lib/supabase/queries'
import ProductListActions from './product-list-actions'

export default async function AdminProductsPage() {
  const products = await getAllProducts()

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">商品管理</h1>
          <p className="mt-1 text-sm text-gray-500">共 {products.length} 項商品</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-lg bg-sandrift-500 px-4 py-2 text-sm font-medium text-white hover:bg-sandrift-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          新增商品
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">商品</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3 text-right">售價</th>
                <th className="px-4 py-3">分類</th>
                <th className="px-4 py-3">標籤</th>
                <th className="px-4 py-3">狀態</th>
                <th className="px-4 py-3">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const images = (product.images as Array<{ url: string; alt: string }>) || []
                const firstImage = images[0]?.url
                const category = product.categories as { name: string; slug: string } | null
                const tags = (product.tags as string[]) || []

                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-3">
                        {firstImage && (
                          <Image
                            src={firstImage}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        )}
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                        {product.slug}
                      </code>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-gray-900">
                      ${product.price}
                    </td>
                    <td className="px-4 py-3">
                      {category && (
                        <span className="rounded-full bg-sandrift-50 px-2 py-0.5 text-xs text-sandrift-700">
                          {category.name}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          product.is_active
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {product.is_active ? '上架' : '下架'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ProductListActions
                        productId={product.id}
                        productName={product.name}
                        isActive={product.is_active ?? false}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
