'use client'

import { useCallback, useRef } from 'react'

interface FlyToCartOptions {
  /** 飛行元素的圖片 src（用於 clone） */
  imageSrc?: string
}

/**
 * 飛入購物車動畫 hook — 使用 Web Animations API
 * 絲滑拋物線 + 落點彈跳 + CartBadge 連動
 */
export function useFlyToCart() {
  const sourceRef = useRef<HTMLButtonElement>(null)
  const isAnimating = useRef(false)

  const triggerFly = useCallback((options?: FlyToCartOptions) => {
    if (isAnimating.current) return
    if (!sourceRef.current) return

    const badge = document.querySelector('[data-cart-badge]')
    if (!badge) return

    const sourceRect = sourceRef.current.getBoundingClientRect()
    const targetRect = badge.getBoundingClientRect()

    // badge 不在 viewport 內時跳過
    if (targetRect.top < 0 || targetRect.bottom > window.innerHeight) return

    const startX = sourceRect.left + sourceRect.width / 2
    const startY = sourceRect.top + sourceRect.height / 2
    const endX = targetRect.left + targetRect.width / 2
    const endY = targetRect.top + targetRect.height / 2
    const dx = endX - startX
    const dy = endY - startY

    // 飛行元素
    const size = 26
    const flyEl = document.createElement('div')
    flyEl.style.cssText = `
      position: fixed;
      z-index: 99999;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      pointer-events: none;
      background: linear-gradient(135deg, rgba(196, 168, 132, 0.85), rgba(176, 141, 98, 0.9));
      backdrop-filter: blur(12px) saturate(1.4);
      -webkit-backdrop-filter: blur(12px) saturate(1.4);
      border: 1px solid rgba(255, 255, 255, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 2px 8px rgba(176, 141, 98, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.25);
      left: ${startX - size / 2}px;
      top: ${startY - size / 2}px;
      will-change: transform, opacity;
    `

    if (options?.imageSrc) {
      const img = document.createElement('img')
      img.src = options.imageSrc
      img.style.cssText = `
        width: 18px; height: 18px;
        object-fit: cover;
        border-radius: 50%;
        opacity: 0.9;
      `
      flyEl.appendChild(img)
    }

    document.body.appendChild(flyEl)
    isAnimating.current = true

    // 拋物線弧度 — 起飛先往上揚再落下
    const arcHeight = Math.abs(dy) * 0.35 + 40
    const midX1 = dx * 0.25
    const midY1 = -arcHeight
    const midX2 = dx * 0.6
    const midY2 = dy * 0.3 - arcHeight * 0.4

    flyEl.animate(
      [
        {
          transform: 'translate(0, 0) scale(1)',
          opacity: 1,
        },
        {
          // 起飛微揚 — 留在原地附近讓眼睛跟上
          transform: `translate(${midX1 * 0.3}px, ${midY1 * 0.5}px) scale(0.9)`,
          opacity: 1,
          offset: 0.2,
        },
        {
          // 起飛上揚
          transform: `translate(${midX1}px, ${midY1}px) scale(0.7)`,
          opacity: 0.9,
          offset: 0.4,
        },
        {
          // 弧線轉落
          transform: `translate(${midX2}px, ${midY2}px) scale(0.5)`,
          opacity: 0.75,
          offset: 0.6,
        },
        {
          // 接近目標
          transform: `translate(${dx * 0.9}px, ${dy * 0.85}px) scale(0.3)`,
          opacity: 0.5,
          offset: 0.8,
        },
        {
          // 落點收縮
          transform: `translate(${dx}px, ${dy}px) scale(0)`,
          opacity: 0,
        },
      ],
      {
        duration: 900,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards',
      }
    ).onfinish = () => {
      flyEl.remove()
      isAnimating.current = false
    }
  }, [])

  return { sourceRef, triggerFly }
}
