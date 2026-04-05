import { notFound } from 'next/navigation'
import ProductDetailContent from '@/components/products/product-detail-content'
import { getProductBySlug } from '@/lib/supabase/queries'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { Metadata } from 'next'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const data = await getProductBySlug(slug)

  if (!data) return {}

  const { product, detail } = data
  const description = detail.descriptions.desc
    ? detail.descriptions.desc.slice(0, 160)
    : undefined

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: detail.images[0] ? [detail.images[0]] : undefined,
    },
  }
}

export async function generateStaticParams() {
  // 用 admin client（不依賴 cookies），build 時可正常執行
  const { data } = await supabaseAdmin
    .from('products')
    .select('slug')
    .eq('is_active', true)
  return (data ?? []).map((row) => ({ slug: row.slug }))
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getProductBySlug(slug)

  if (!data) {
    notFound()
  }

  return <ProductDetailContent product={data.product} detail={data.detail} />
}
