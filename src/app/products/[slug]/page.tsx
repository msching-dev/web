'use client'

import { useState, useCallback, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'
import OrderTooltip from '@/components/products/order-tooltip'
import ProductDetailSkeleton from '@/components/products/product-detail-skeleton'
import HighlightedText from '@/components/highlighted-text'
import { useProductDetail } from '@/hooks/use-products'
import { useSwipe } from '@/hooks/use-swipe'

const descriptionSections = [
  { key: 'desc', label: '商品介紹' },
  { key: 'nonAdditive', label: '無添加' },
  { key: 'howToEat', label: '食用方式' },
  { key: 'preservationMethod', label: '保存方式' },
  { key: 'precautions', label: '注意事項' },
  { key: 'tastePeriod', label: '賞味期限' },
] as const

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const { detail, product, loading } = useProductDetail(slug)
  const [selectedImage, setSelectedImage] = useState(0)

  const imageCount = detail?.images.length ?? 0

  const goNextImage = useCallback(() => {
    if (imageCount <= 1) return
    setSelectedImage((prev) => (prev + 1) % imageCount)
  }, [imageCount])

  const goPrevImage = useCallback(() => {
    if (imageCount <= 1) return
    setSelectedImage((prev) => (prev - 1 + imageCount) % imageCount)
  }, [imageCount])

  const { onTouchStart, onTouchEnd } = useSwipe({
    onSwipeLeft: goNextImage,
    onSwipeRight: goPrevImage,
  })

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <ProductDetailSkeleton />
      </div>
    )
  }

  if (!detail || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="mx-auto max-w-sm rounded-2xl bg-white/70 p-8 ring-1 ring-sandrift-100/40 backdrop-blur-sm">
          <p className="text-[15px] font-medium text-sandrift-600">找不到該商品</p>
          <Link
            href="/"
            className="mt-4 inline-block cursor-pointer rounded-xl bg-sandrift-500 px-6 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-sandrift-600"
          >
            返回首頁
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-page-enter">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>首頁</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 md:py-8">
        <div className="grid gap-5 md:gap-8 md:grid-cols-2">
          {/* Image Gallery */}
          <div>
            {/* Main image — swipeable */}
            <div
              className="relative aspect-square overflow-hidden rounded-2xl bg-sandrift-50/50"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <Image
                src={detail.images[selectedImage] || detail.productImage}
                alt={product.name}
                fill
                className="object-cover transition-opacity duration-300"
                priority
              />
              {/* Image counter */}
              {detail.images.length > 1 && (
                <div className="absolute bottom-2.5 right-2.5 rounded-full bg-sandrift-950/40 px-2.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                  {selectedImage + 1} / {detail.images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {detail.images.length > 1 && (
              <div className="mt-2.5 grid grid-cols-5 gap-1.5 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-6">
                {detail.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square cursor-pointer overflow-hidden rounded-lg transition-all duration-200 ${
                      selectedImage === idx
                        ? 'ring-2 ring-sandrift-500 ring-offset-1'
                        : 'ring-1 ring-sandrift-100 hover:ring-sandrift-200'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            {/* Name & Price */}
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-sandrift-950">
                {product.name}
              </h1>
              <div className="mt-1.5 flex items-baseline gap-2">
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-[14px] text-sandrift-300 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                <span className="text-lg font-bold text-sandrift-600">
                  ${product.price}
                </span>
              </div>
            </div>

            {/* Order section */}
            <OrderTooltip productName={product.name} price={product.price} />

            {/* Descriptions */}
            <div className="space-y-3">
              {descriptionSections.map(({ key, label }) => {
                const content = detail.descriptions[key]
                if (!content) return null
                return (
                  <div
                    key={key}
                    className="border-b border-sandrift-100/60 pb-3 last:border-b-0 last:pb-0"
                  >
                    <h3 className="mb-1 text-[13px] font-semibold text-sandrift-800">
                      {label}
                    </h3>
                    <div className="text-[13px] leading-relaxed text-sandrift-500">
                      <HighlightedText text={content} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Specifications */}
            {detail.specifications.length > 0 && (
              <div className="rounded-2xl bg-sandrift-50/40 p-4 ring-1 ring-sandrift-100/40">
                <h3 className="mb-2 text-[13px] font-semibold text-sandrift-800">
                  商品規格
                </h3>
                <div className="overflow-hidden rounded-xl">
                  <table className="w-full text-[13px]">
                    <tbody>
                      {detail.specifications.map((spec, idx) => (
                        <tr
                          key={spec.key}
                          className={idx % 2 === 0 ? 'bg-white/60' : 'bg-transparent'}
                        >
                          <td className="px-3 py-2 font-medium text-sandrift-700">
                            {spec.key}
                          </td>
                          <td className="px-3 py-2 text-sandrift-500">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Nutritional Info */}
            <div className="space-y-2">
              {detail.everyNutrientContent.length > 0 && (
                <NutrientCollapsible
                  title={`每份營養標示（每份 ${detail.portionSize}${detail.unit}）`}
                  items={detail.everyNutrientContent}
                />
              )}

              {detail.everyHundredNutrientContent.length > 0 && (
                <NutrientCollapsible
                  title={`每100${detail.unit}營養標示`}
                  items={detail.everyHundredNutrientContent}
                />
              )}

              {detail.giftBoxNutrientContent?.map((giftBox) => (
                <NutrientCollapsible
                  key={giftBox.taste}
                  title={`${giftBox.taste} 營養標示`}
                  items={giftBox.content}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NutrientCollapsible({
  title,
  items,
}: {
  title: string
  items: { key: string; value: number }[]
}) {
  return (
    <Collapsible>
      <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-sandrift-50/50 px-4 py-2.5 text-[13px] font-semibold text-sandrift-700 ring-1 ring-sandrift-100/30 transition-colors hover:bg-sandrift-50">
        <span>{title}</span>
        <ChevronDown className="h-3.5 w-3.5 text-sandrift-300 transition-transform duration-300 [[data-open]_&]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-1.5 overflow-hidden rounded-xl ring-1 ring-sandrift-100/40">
          <table className="w-full text-[13px]">
            <tbody>
              {items.map((item, idx) => (
                <tr
                  key={item.key}
                  className={idx % 2 === 0 ? 'bg-white/60' : 'bg-sandrift-50/30'}
                >
                  <td className="px-3 py-2 font-medium text-sandrift-700">
                    {item.key}
                  </td>
                  <td className="px-3 py-2 text-sandrift-500">
                    {item.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
