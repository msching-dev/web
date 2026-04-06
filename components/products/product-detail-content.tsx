'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Image from 'next/image'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Check,
  MessageCircle,
  Instagram,
  ClipboardCopy,
} from 'lucide-react'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible'
import HighlightedText from '@/components/highlighted-text'
import { useRouter } from 'next/navigation'
import { useSwipe } from '@/hooks/use-swipe'
import { useFlyToCart } from '@/hooks/use-fly-to-cart'
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
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(
    null
  )
  const [quantity, setQuantity] = useState(1)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastExiting, setToastExiting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [ctaSuccess, setCtaSuccess] = useState(false)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout>>(null)

  const { generateTemplate, copyToClipboard } = useOrderTemplate()
  const { sourceRef: ctaRef, triggerFly } = useFlyToCart()
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)
  const items = useCartStore((s) => s.items)

  const existingCartQty =
    items.find((item) => item.productId === product.id)?.quantity ?? 0
  const remainingQty = Math.max(0, detail.maxCount - existingCartQty)

  const imageCount = detail.images.length

  const goNextImage = useCallback(() => {
    if (imageCount <= 1) return
    setSlideDirection('left')
    setSelectedImage((prev) => (prev + 1) % imageCount)
  }, [imageCount])

  const goPrevImage = useCallback(() => {
    if (imageCount <= 1) return
    setSlideDirection('right')
    setSelectedImage((prev) => (prev - 1 + imageCount) % imageCount)
  }, [imageCount])

  const { onTouchStart, onTouchEnd } = useSwipe({
    onSwipeLeft: goNextImage,
    onSwipeRight: goPrevImage,
  })

  // Reset slide direction after animation
  useEffect(() => {
    if (slideDirection) {
      const timer = setTimeout(() => setSlideDirection(null), 300)
      return () => clearTimeout(timer)
    }
  }, [slideDirection, selectedImage])

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

    // Fly-to-cart animation
    triggerFly({ imageSrc: product.banner.src })

    // CTA success animation
    setCtaSuccess(true)
    setTimeout(() => setCtaSuccess(false), 1600)

    // Toast with auto-dismiss
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToastExiting(false)
    setToastVisible(true)
    toastTimerRef.current = setTimeout(() => {
      setToastExiting(true)
      setTimeout(() => {
        setToastVisible(false)
        setToastExiting(false)
      }, 250)
    }, 2500)
  }

  const handleCopy = async () => {
    const template = generateTemplate(product.name, product.price)
    const success = await copyToClipboard(template)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const isMaxed = existingCartQty >= detail.maxCount

  return (
    <div className="animate-page-enter">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 md:py-8">
        {/* Asymmetric grid: image wider on desktop */}
        <div className="grid gap-6 md:gap-10 md:grid-cols-[1.15fr_1fr] lg:grid-cols-[1.2fr_1fr]">
          {/* Image Gallery — sticky on desktop */}
          <div className="md:sticky md:top-20 md:self-start">
            {/* Main image — swipeable with directional animation */}
            <div
              className="relative aspect-square overflow-hidden rounded-2xl bg-sandrift-50/50"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <Image
                key={selectedImage}
                src={detail.images[selectedImage] || detail.productImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 55vw"
                className={`object-cover ${
                  slideDirection === 'left'
                    ? 'animate-slide-left'
                    : slideDirection === 'right'
                      ? 'animate-slide-right'
                      : ''
                }`}
                priority
              />
              {/* Arrow navigation — gradient fade edges */}
              {detail.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrevImage}
                    className="absolute inset-y-0 left-0 z-10 flex w-14 cursor-pointer items-center justify-start pl-2 bg-linear-to-r from-black/15 to-transparent text-white/80 transition-opacity hover:from-black/25 hover:text-white active:text-white/60 md:w-16 md:pl-3"
                  >
                    <ChevronLeft className="h-5 w-5 drop-shadow-md" />
                  </button>
                  <button
                    type="button"
                    onClick={goNextImage}
                    className="absolute inset-y-0 right-0 z-10 flex w-14 cursor-pointer items-center justify-end pr-2 bg-linear-to-l from-black/15 to-transparent text-white/80 transition-opacity hover:from-black/25 hover:text-white active:text-white/60 md:w-16 md:pr-3"
                  >
                    <ChevronRight className="h-5 w-5 drop-shadow-md" />
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

            {/* Thumbnails — glass-decorated */}
            {detail.images.length > 1 && (
              <div className="mt-3 flex gap-2 px-1 py-1">
                {detail.images.map((img, idx) => {
                  const isActive = selectedImage === idx
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSlideDirection(
                          idx > selectedImage ? 'left' : 'right'
                        )
                        setSelectedImage(idx)
                      }}
                      className={`group relative aspect-square flex-1 min-w-0 max-w-20 cursor-pointer overflow-hidden rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'ring-2 ring-sandrift-500/80 ring-offset-2 shadow-md'
                          : 'opacity-55 hover:opacity-85'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        fill
                        sizes="76px"
                        className="object-cover"
                      />
                      {/* Glass overlay on inactive */}
                      {!isActive && (
                        <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px] transition-opacity duration-200 group-hover:opacity-0" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            {/* Name */}
            <h1 className="text-2xl md:text-[28px] font-bold tracking-tight text-sandrift-950 leading-tight">
              {product.name}
            </h1>

            {/* Price — stronger hierarchy */}
            <div className="flex items-baseline gap-3">
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="text-base text-sandrift-400 line-through decoration-sandrift-300">
                    NT${product.originalPrice}
                  </span>
                )}
              <span className="text-3xl font-bold text-sandrift-700 tracking-tight">
                NT${product.price}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-sandrift-100/80" />

            {/* Quantity Selector — 44px touch targets, active feedback */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-sandrift-700 tracking-wide">
                數量
              </span>
              <div className="flex items-center rounded-xl bg-sandrift-50/60 ring-1 ring-sandrift-200/80">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-l-xl text-sandrift-600 transition-all hover:bg-sandrift-100/80 active:scale-90 active:bg-sandrift-200/60 disabled:cursor-not-allowed disabled:text-sandrift-200 disabled:active:scale-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-11 w-12 items-center justify-center border-x border-sandrift-200/60 text-sm font-bold tabular-nums text-sandrift-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(remainingQty || 99, q + 1))
                  }
                  disabled={quantity >= (remainingQty || 99)}
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-r-xl text-sandrift-600 transition-all hover:bg-sandrift-100/80 active:scale-90 active:bg-sandrift-200/60 disabled:cursor-not-allowed disabled:text-sandrift-200 disabled:active:scale-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart CTA — gradient, shadow, fly animation */}
            <button
              ref={ctaRef}
              type="button"
              onClick={handleAddToCart}
              disabled={isMaxed}
              className={`cta-shine flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl py-4 text-[15px] font-bold text-white shadow-lg transition-all duration-200 disabled:cursor-not-allowed disabled:bg-sandrift-200 disabled:text-sandrift-400 disabled:shadow-none ${
                ctaSuccess
                  ? 'bg-sandrift-600 shadow-sandrift-400/30'
                  : 'bg-gradient-to-b from-sandrift-400 to-sandrift-500 shadow-sandrift-400/25 hover:from-sandrift-500 hover:to-sandrift-600 hover:shadow-xl hover:shadow-sandrift-400/30 active:scale-[0.97] active:shadow-md'
              }`}
              style={
                ctaSuccess ? { animation: 'cta-success 0.5s ease-out' } : {}
              }
            >
              {ctaSuccess ? (
                <>
                  <Check className="h-5 w-5" />
                  已加入購物車
                </>
              ) : isMaxed ? (
                '已達上限'
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5" />
                  加入購物車
                </>
              )}
            </button>

            {/* Secondary Links — with icons */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <a
                href={socialMediaLinks.lineOfficial}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-sandrift-500 transition-all hover:bg-sandrift-50 hover:text-sandrift-700"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                LINE 下單
              </a>
              <span className="text-sandrift-200">|</span>
              <a
                href={socialMediaLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-sandrift-500 transition-all hover:bg-sandrift-50 hover:text-sandrift-700"
              >
                <Instagram className="h-3.5 w-3.5" />
                IG 下單
              </a>
              <span className="text-sandrift-200">|</span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-sandrift-500 transition-all hover:bg-sandrift-50 hover:text-sandrift-700"
              >
                <ClipboardCopy className="h-3.5 w-3.5" />
                {copied ? '已複製' : '複製訂購模板'}
              </button>
            </div>

            {/* Divider before descriptions */}
            <div className="border-t border-sandrift-100/80" />

            {/* Descriptions — collapsible, first one open */}
            <div className="space-y-2">
              {descriptionSections.map(({ key, label }, sectionIdx) => {
                const content = detail.descriptions[key]
                if (!content) return null
                // Find the actual first section with content for default-open
                const firstContentIdx = descriptionSections.findIndex(
                  (s) => detail.descriptions[s.key]
                )
                const isFirst = sectionIdx === firstContentIdx
                return (
                  <Collapsible key={key} defaultOpen={isFirst}>
                    <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-sandrift-800 transition-colors hover:bg-sandrift-50/60">
                      <span>{label}</span>
                      <ChevronDown className="h-4 w-4 text-sandrift-300 transition-transform duration-300 in-data-open:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-3 text-[13px] leading-relaxed text-sandrift-500">
                        <HighlightedText text={content} />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
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
                          className={
                            idx % 2 === 0 ? 'bg-white/60' : 'bg-transparent'
                          }
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

      {/* Toast notification — animated enter/exit */}
      {toastVisible && (
        <div
          className={`fixed bottom-20 left-1/2 z-50 ${
            toastExiting ? 'animate-toast-exit' : 'animate-toast-enter'
          }`}
        >
          <button
            type="button"
            onClick={() => router.push('/cart')}
            className="glass-dark flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-sm text-white transition-opacity hover:opacity-90"
          >
            <Check className="h-3.5 w-3.5 text-green-400 shrink-0" />
            已加入 · 查看購物車
          </button>
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
      <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-[13px] font-semibold text-sandrift-700 transition-colors hover:bg-sandrift-50/60">
        <span>{title}</span>
        <ChevronDown className="h-3.5 w-3.5 text-sandrift-300 transition-transform duration-300 in-data-open:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mb-3 overflow-hidden rounded-xl ring-1 ring-sandrift-100/40">
          <table className="w-full text-[13px]">
            <tbody>
              {items.map((item, idx) => (
                <tr
                  key={item.key}
                  className={
                    idx % 2 === 0 ? 'bg-white/60' : 'bg-sandrift-50/30'
                  }
                >
                  <td className="px-3 py-2 font-medium text-sandrift-700">
                    {item.key}
                  </td>
                  <td className="px-3 py-2 text-sandrift-500">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
