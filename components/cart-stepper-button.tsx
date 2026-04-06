'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ShoppingBag, Check, Minus, Plus, Trash2 } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { useFlyToCart } from '@/hooks/use-fly-to-cart'
import type { ProductInfo } from '@/types'

type ButtonState = 'idle' | 'added' | 'stepper' | 'has-items'

interface CartStepperButtonProps {
  product: ProductInfo
}

/** 點擊後的液態玻璃 — 淺色漸層 + 高光 + 折射邊框 */
const glass = [
  'bg-gradient-to-br from-sandrift-300/70 via-sandrift-400/65 to-sandrift-500/70',
  'backdrop-blur-2xl backdrop-saturate-150',
  'border border-t-white/50 border-l-white/35 border-r-sandrift-300/20 border-b-sandrift-400/15',
  'shadow-[0_4px_16px_rgba(176,141,98,0.15),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.03)]',
].join(' ')

export default function CartStepperButton({ product }: CartStepperButtonProps) {
  const addItem = useCartStore((s) => s.addItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const items = useCartStore((s) => s.items)

  const existingQty = items.find((item) => item.productId === product.id)?.quantity ?? 0
  const isMaxed = existingQty >= product.maxCount

  const [interactionState, setInteractionState] = useState<'idle' | 'added' | 'stepper'>('idle')
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stepperRef = useRef<HTMLDivElement>(null)
  const { sourceRef, triggerFly } = useFlyToCart()

  const state: ButtonState =
    interactionState === 'added' ? 'added' :
    interactionState === 'stepper' ? 'stepper' :
    existingQty > 0 ? 'has-items' : 'idle'

  const clearTimer = useCallback(() => {
    if (collapseTimer.current) {
      clearTimeout(collapseTimer.current)
      collapseTimer.current = null
    }
  }, [])

  const startCollapseTimer = useCallback(() => {
    clearTimer()
    collapseTimer.current = setTimeout(() => {
      setInteractionState('idle')
    }, 3000)
  }, [clearTimer])

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  // 桌面 hover stepper 時暫停收合計時
  const handleStepperEnter = useCallback(() => clearTimer(), [clearTimer])
  const handleStepperLeave = useCallback(() => startCollapseTimer(), [startCollapseTimer])

  const handleInitialAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isMaxed) return

    addItem(
      {
        productId: product.id,
        slug: product.key,
        name: product.name,
        price: product.price,
        image: product.banner.src,
        maxCount: product.maxCount,
        unit: product.unit,
      },
      1
    )

    triggerFly({ imageSrc: product.banner.src })

    setInteractionState('added')
    setTimeout(() => {
      setInteractionState('stepper')
      startCollapseTimer()
    }, 300)
  }

  const handleExpand = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setInteractionState('stepper')
    startCollapseTimer()
  }

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isMaxed) return
    updateQuantity(product.id, existingQty + 1)
    startCollapseTimer()
  }

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (existingQty <= 1) {
      removeItem(product.id)
      setInteractionState('idle')
      clearTimer()
    } else {
      updateQuantity(product.id, existingQty - 1)
      startCollapseTimer()
    }
  }

  // === idle — 乾淨 icon，大觸控區 ===
  if (state === 'idle') {
    return (
      <button
        ref={sourceRef}
        type="button"
        onClick={handleInitialAdd}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-sandrift-400 transition-all duration-200 lg:hover:bg-sandrift-100 lg:hover:text-sandrift-600 lg:hover:shadow-sm active:scale-95"
        aria-label={`加入 ${product.name} 到購物車`}
      >
        <ShoppingBag className="h-4.5 w-4.5" strokeWidth={1.5} />
      </button>
    )
  }

  // === added — 過渡動畫 ===
  if (state === 'added') {
    return (
      <button
        ref={sourceRef}
        type="button"
        className={`flex h-9 w-9 items-center justify-center rounded-full text-white animate-pop ${glass}`}
        aria-label="已加入購物車"
      >
        <Check className="h-4 w-4" strokeWidth={2} />
      </button>
    )
  }

  // === has-items — 收合圓形，顯示數字 ===
  if (state === 'has-items') {
    return (
      <button
        ref={sourceRef}
        type="button"
        onClick={handleExpand}
        className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-white text-xs font-semibold tabular-nums transition-all duration-200 lg:hover:brightness-110 active:scale-95 ${glass}`}
        aria-label={`購物車有 ${existingQty} 個 ${product.name}，點擊調整`}
      >
        {existingQty}
      </button>
    )
  }

  // === stepper — 展開的數量控制 ===
  const currentQty = existingQty
  const isCurrentMaxed = currentQty >= product.maxCount

  return (
    <div
      ref={stepperRef}
      onMouseEnter={handleStepperEnter}
      onMouseLeave={handleStepperLeave}
      className={`flex h-9 items-center gap-0.5 rounded-full px-1 animate-[stepper-expand_200ms_ease-out] origin-right ${glass}`}
      role="group"
      aria-label={`${product.name} 數量調整`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white/90 transition-all hover:bg-white/15 active:scale-90"
        aria-label={currentQty <= 1 ? '移除商品' : '減少數量'}
      >
        {currentQty <= 1 ? (
          <Trash2 className="h-3.5 w-3.5" />
        ) : (
          <Minus className="h-3.5 w-3.5" strokeWidth={2} />
        )}
      </button>

      <span className="min-w-5 text-center text-xs font-semibold text-white tabular-nums select-none">
        {currentQty}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={isCurrentMaxed}
        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white/90 transition-all hover:bg-white/15 active:scale-90 disabled:cursor-not-allowed disabled:text-white/25"
        aria-label={isCurrentMaxed ? '已達上限' : '增加數量'}
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
    </div>
  )
}
