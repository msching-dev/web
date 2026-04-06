'use client'

import { useEffect, useState } from 'react'

export function useCountUp(target: number, duration = 600): number {
  const [value, setValue] = useState(target)

  useEffect(() => {
    if (target === 0) return

    const startTime = performance.now()
    let raf: number

    function step(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))

      if (progress < 1) {
        raf = requestAnimationFrame(step)
      }
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return value
}
