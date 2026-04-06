import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { getProductById, getCategories } from '@/lib/supabase/queries'
import ProductForm from '@/components/admin/product-form'
import { type ProductFormData } from '@/lib/validations/product'
import { updateProduct } from '../../actions'

export const metadata = {
  title: '編輯商品 | MS. CHING 後台',
}

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const [product, categories] = await Promise.all([getProductById(id), getCategories()])

  if (!product) {
    notFound()
  }

  const images = (product.images as Array<{ url: string; alt: string; sort_order: number }>) || []
  const detail = (product.detail as Record<string, string>) || {}
  const nutrition = (product.nutrition as {
    perServing: Array<{ key: string; value: number }>
    perHundred: Array<{ key: string; value: number }>
    giftBox: Array<{ taste: string; content: Array<{ key: string; value: number }> }>
  }) || { perServing: [], perHundred: [], giftBox: [] }
  const specifications = (product.specifications as Array<{ key: string; value: number }>) || []

  const initialData: ProductFormData = {
    name: product.name,
    slug: product.slug,
    alias: product.alias ?? '',
    price: product.price,
    compare_price: product.compare_price ?? null,
    category_id: product.category_id ?? null,
    tags: (product.tags as string[]) ?? [],
    is_active: product.is_active ?? true,
    is_featured: product.is_featured ?? false,
    description: product.description ?? '',
    stock_quantity: product.stock_quantity ?? null,
    max_order_qty: product.max_order_qty ?? null,
    min_order_qty: product.min_order_qty ?? null,
    portion_size: product.portion_size ?? null,
    include_size: product.include_size ?? '',
    unit: product.unit ?? '',
    shelf_life: product.shelf_life ?? '',
    storage_instructions: product.storage_instructions ?? '',
    allergens: product.allergens ?? '',
    detail: {
      desc: detail.desc ?? '',
      nonAdditive: detail.nonAdditive ?? '',
      howToEat: detail.howToEat ?? '',
      preservationMethod: detail.preservationMethod ?? '',
      precautions: detail.precautions ?? '',
      tastePeriod: detail.tastePeriod ?? '',
    },
    specifications,
    nutrition: {
      perServing: nutrition.perServing ?? [],
      perHundred: nutrition.perHundred ?? [],
      giftBox: nutrition.giftBox ?? [],
    },
    images,
    sort_order: product.sort_order ?? null,
  }

  const handleUpdate = async (data: ProductFormData) => {
    'use server'
    return updateProduct(id, data)
  }

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
        <h1 className="text-xl font-bold text-sandrift-950">編輯商品：{product.name}</h1>
      </div>

      <ProductForm
        initialData={initialData}
        categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
        onSubmit={handleUpdate}
        submitLabel="儲存變更"
      />
    </div>
  )
}
