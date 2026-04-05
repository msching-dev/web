'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
} from 'lucide-react'
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
import HighlightedText from '@/components/highlighted-text'
import { useRouter } from 'next/navigation'
import { useSwipe } from '@/hooks/use-swipe'
import { useOrderTemplate } from '@/hooks/use-order-template'
import { useCartStore } from '@/stores/cart-store'
import { socialMediaLinks } from '@/lib/constants'
import type { ProductInfo, ProductDetail } from '@/types'

const descriptionSections = [
  { key: 'desc', label: '商品介紹' },
  { key: 'nonAdditive', label: '無添加' },
  { key: 'howToEat', label: '食用方式' },
  { key: 'preservationMethod', label: '保存方式' },
  { key: 'precautions', label: '注意事項' },
  { key: 'tastePeriod', label: '賞味期限' },
] as const

interface ProductDetailContentProps {
  product: ProductInfo
  detail: ProductDetail
}

export default function ProductDetailContent({
  product,
  detail,
}: ProductDetailContentProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [toastVisible, setToastVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  const { generateTemplate, copyToClipboard } = useOrderTemplate()
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)
  const items = useCartStore((s) => s.items)

  const existingCartQty = items.find(
    (item) => item.productId === product.id
  )?.quantity ?? 0
  const remainingQty = Math.max(0, detail.maxCount - existingCartQty)

  const imageCount = detail.images.length

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

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        slug: product.key,
        name: product.name,
        price: product.price,
        image: product.banner.src,
        maxCount: detail.maxCount,
        unit: detail.unit,
      },
      quantity
    )
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }

  const handleCopy = async () => {
    const template = generateTemplate(product.name, product.price)
    const success = await copyToClipboard(template)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="animate-page-enter">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-5">
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
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-opacity duration-300"
                priority
              />
              {/* Mobile arrow navigation */}
              {detail.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrevImage}
                    className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/70 text-sandrift-700 shadow-sm backdrop-blur-sm transition-opacity hover:bg-white md:hidden"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={goNextImage}
                    className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/70 text-sandrift-700 shadow-sm backdrop-blur-sm transition-opacity hover:bg-white md:hidden"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
              {/* Image counter */}
              {detail.images.length > 1 && (
                <div className="absolute bottom-2.5 right-2.5 rounded-full bg-sandrift-950/40 px-2.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                  {selectedImage + 1} / {detail.images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {detail.images.length > 1 && (
              <div className="mt-2.5 flex gap-1.5 overflow-x-auto md:grid md:grid-cols-5 md:overflow-visible lg:grid-cols-6 scrollbar-none">
                {detail.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square flex-shrink-0 w-16 md:w-auto cursor-pointer overflow-hidden rounded-lg transition-all duration-200 ${
                      selectedImage === idx
                        ? 'ring-2 ring-sandrift-500 ring-offset-1'
                        : 'ring-1 ring-sandrift-100 hover:ring-sandrift-200'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      sizes="64px"
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
              <div className="mt-2 flex items-baseline gap-2.5">
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-sandrift-300 line-through">
                    NT${product.originalPrice}
                  </span>
                )}
                <span className="text-2xl font-bold text-sandrift-700">
                  NT${product.price}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm font-medium text-sandrift-700">數量</span>
              <div className="flex items-center rounded-xl ring-1 ring-sandrift-200/60">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-l-xl text-sandrift-600 transition-colors hover:bg-sandrift-50 disabled:cursor-not-allowed disabled:text-sandrift-200"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-10 w-12 items-center justify-center border-x border-sandrift-200/60 text-sm font-semibold text-sandrift-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.min(remainingQty || 99, q + 1))}
                  disabled={quantity >= (remainingQty || 99)}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-r-xl text-sandrift-600 transition-colors hover:bg-sandrift-50 disabled:cursor-not-allowed disabled:text-sandrift-200"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart CTA */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={existingCartQty >= detail.maxCount}
              className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-sandrift-500 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sandrift-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-sandrift-200 disabled:text-sandrift-400"
            >
              <ShoppingBag className="h-4 w-4" />
              {existingCartQty >= detail.maxCount ? '已達訂購上限' : '加入購物車'}
            </button>

            {/* Cart quantity hint */}
            {existingCartQty > 0 && (
              <p className="mt-2 text-center text-xs text-sandrift-400">
                購物車已有 {existingCartQty} {detail.unit || '件'}
              </p>
            )}

            {/* Secondary Links */}
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-sandrift-500">
              <a
                href={socialMediaLinks.lineOfficial}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 transition-colors hover:text-sandrift-700"
              >
                LINE 下單
              </a>
              <span className="text-sandrift-200">|</span>
              <a
                href={socialMediaLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 transition-colors hover:text-sandrift-700"
              >
                IG 下單
              </a>
              <span className="text-sandrift-200">|</span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex cursor-pointer items-center gap-1 transition-colors hover:text-sandrift-700"
              >
                {copied ? '已複製' : '複製訂購模板'}
              </button>
            </div>

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

      {/* Toast notification */}
      {toastVisible && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 animate-pop">
          <div className="flex items-center gap-3 rounded-xl bg-sandrift-900 px-5 py-3 text-sm text-white shadow-lg">
            <span>已加入購物車 — {product.name}</span>
            <button
              type="button"
              onClick={() => router.push('/cart')}
              className="cursor-pointer whitespace-nowrap text-sandrift-300 underline underline-offset-2 transition-colors hover:text-white"
            >
              查看購物車
            </button>
          </div>
        </div>
      )}
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
