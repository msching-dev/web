import { notFound } from 'next/navigation'
import ProductDetailContent from '@/components/products/product-detail-content'
import { getProductBySlug } from '@/lib/supabase/queries'
import type { Metadata } from 'next'

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
      images: detail.images[0] ? [detail.images[0]] : undefined,
    },
  }
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
