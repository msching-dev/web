'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useSwipe } from '@/hooks/use-swipe'

const slides = [
  {
    image: '/images/products/almond_cookie.png',
    alt: '手作杏仁瓦片',
    subtitle: '堅持天然食材、新鮮現做，每一口都是用心的味道',
  },
  {
    image: '/images/products/earlGaryTea_madeleine.png',
    alt: '伯爵茶瑪德蓮',
    subtitle: '經典茶香與奶油的完美邂逅，療癒你的午後時光',
  },
  {
    image: '/images/products/polo_cookie.png',
    alt: '菠蘿餅乾',
    subtitle: '酥脆外皮包裹濃郁奶香，一口就愛上的幸福滋味',
  },
  {
    image: '/images/products/quartet_madeleine.png',
    alt: '四重奏瑪德蓮禮盒',
    subtitle: '四種口味一次滿足，送禮自用兩相宜',
  },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goTo = useCallback((index: number) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrent(index)
      setIsTransitioning(false)
    }, 300)
  }, [])

  const goNext = useCallback(() => {
    goTo((current + 1) % slides.length)
  }, [current, goTo])

  const goPrev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length)
  }, [current, goTo])

  useEffect(() => {
    const timer = setInterval(goNext, 4500)
    return () => clearInterval(timer)
  }, [goNext])

  const { onTouchStart, onTouchEnd } = useSwipe({
    onSwipeLeft: goNext,
    onSwipeRight: goPrev,
  })

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-4 md:pt-14 md:pb-6">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left — copy */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-sandrift-950">
            手作烘焙的溫度
          </h1>
          <p
            className={`text-base md:text-lg text-sandrift-500 mt-4 transition-opacity duration-300 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {slides[current].subtitle}
          </p>
          <div className="flex items-center gap-4 mt-8">
            <a
              href="#products"
              className="inline-flex items-center gap-2 bg-sandrift-500 text-white rounded-xl px-8 py-3.5 text-sm font-semibold hover:bg-sandrift-600 transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              探索商品
            </a>
            <Link
              href="/about"
              className="text-sm font-medium text-sandrift-600 hover:text-sandrift-800 transition-colors"
            >
              了解我們
            </Link>
          </div>

          {/* Dot indicators */}
          <div className="flex gap-2 mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goTo(index)}
                className={`h-1.5 cursor-pointer rounded-full transition-all duration-400 ${
                  index === current
                    ? 'w-5 bg-sandrift-400'
                    : 'w-1.5 bg-sandrift-200 hover:bg-sandrift-300'
                }`}
                aria-label={`切換至第 ${index + 1} 張`}
              />
            ))}
          </div>
        </div>

        {/* Right — product image carousel */}
        <div
          className="rounded-3xl bg-sandrift-50/50 p-8 aspect-square flex items-center justify-center"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <Image
            src={slides[current].image}
            alt={slides[current].alt}
            width={600}
            height={600}
            className={`max-w-[80%] object-contain transition-all duration-300 ${
              isTransitioning
                ? 'opacity-0 scale-95'
                : 'opacity-100 scale-100'
            }`}
            priority={current === 0}
          />
        </div>
      </div>
    </section>
  )
}
