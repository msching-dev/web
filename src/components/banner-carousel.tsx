'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { socialMediaLinks } from '@/lib/constants'
import { useSwipe } from '@/hooks/use-swipe'

interface Slide {
  mobileSrc: string
  desktopSrc: string
  link: string
  alt: string
}

const slides: Slide[] = [
  {
    mobileSrc: '/images/banner/shopee.png',
    desktopSrc: '/images/banner/shopee_desktop.png',
    link: 'https://shopee.tw/msching_2022',
    alt: 'Shopee 蝦皮商城',
  },
  {
    mobileSrc: '/images/banner/ig.png',
    desktopSrc: '/images/banner/ig_desktop.png',
    link: socialMediaLinks.instagram,
    alt: 'Instagram',
  },
  {
    mobileSrc: '/images/banner/line.png',
    desktopSrc: '/images/banner/line_desktop.png',
    link: socialMediaLinks.lineOfficial,
    alt: 'LINE 官方帳號',
  },
]

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0)

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [])

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(goNext, 5000)
    return () => clearInterval(timer)
  }, [goNext])

  const { onTouchStart, onTouchEnd } = useSwipe({
    onSwipeLeft: goNext,
    onSwipeRight: goPrev,
  })

  const handleClick = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="w-full lg:px-8">
      <div
        className="relative w-full overflow-hidden rounded-none lg:rounded-2xl"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={slide.alt}
              className="w-full flex-shrink-0 cursor-pointer"
              onClick={() => handleClick(slide.link)}
            >
              {/* Mobile */}
              <div className="block md:hidden">
                <Image
                  src={slide.mobileSrc}
                  alt={slide.alt}
                  width={768}
                  height={400}
                  className="h-auto w-full"
                  priority={i === 0}
                />
              </div>
              {/* Desktop */}
              <div className="hidden md:block">
                <Image
                  src={slide.desktopSrc}
                  alt={slide.alt}
                  width={1920}
                  height={600}
                  className="h-auto w-full"
                  priority={i === 0}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 pt-3">
        {slides.map((slide, index) => (
          <button
            key={slide.alt}
            type="button"
            onClick={() => setCurrent(index)}
            className={`h-1.5 cursor-pointer rounded-full transition-all duration-400 ${
              index === current
                ? 'w-5 bg-sandrift-400'
                : 'w-1.5 bg-sandrift-200 hover:bg-sandrift-300'
            }`}
            aria-label={`前往第 ${index + 1} 張投影片`}
          />
        ))}
      </div>
    </div>
  )
}
