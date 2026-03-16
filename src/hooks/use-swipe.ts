'use client'

import { useRef, useCallback } from 'react'

interface UseSwipeOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
}

export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 50 }: UseSwipeOptions) {
  const startX = useRef(0)
  const startY = useRef(0)
  const isDragging = useRef(false)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
    isDragging.current = true
  }, [])

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return
    isDragging.current = false

    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const diffX = endX - startX.current
    const diffY = endY - startY.current

    // Only trigger if horizontal swipe is dominant
    if (Math.abs(diffX) < threshold || Math.abs(diffY) > Math.abs(diffX)) return

    if (diffX < 0) {
      onSwipeLeft?.()
    } else {
      onSwipeRight?.()
    }
  }, [onSwipeLeft, onSwipeRight, threshold])

  return { onTouchStart, onTouchEnd }
}
