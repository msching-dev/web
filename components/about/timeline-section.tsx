'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

interface TimelineNode {
  label: string
  title: string
  icon: string
  content: React.ReactNode
}

export default function TimelineSection({ nodes }: { nodes: TimelineNode[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const items = container.querySelectorAll<HTMLElement>('[data-timeline-item]')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="relative">
      {/* 縱向時間軸線 */}
      <div className="absolute left-5 md:left-1/2 top-0 bottom-0 -translate-x-1/2">
        {/* 寬散光 */}
        <div className="absolute inset-y-0 left-1/2 w-10 -translate-x-1/2 bg-linear-to-b from-transparent via-sandrift-300/8 to-transparent blur-2xl" />
        {/* 中層暖光 */}
        <div className="absolute inset-y-0 left-1/2 w-5 -translate-x-1/2 bg-linear-to-b from-transparent via-sandrift-300/15 to-transparent blur-lg" />
        {/* 主線 */}
        <div className="relative h-full left-1/2 w-0.5 -translate-x-1/2 bg-linear-to-b from-sandrift-200/0 via-sandrift-300/35 to-sandrift-200/0" />
      </div>

      <div className="space-y-10 md:space-y-16">
        {nodes.map((node, i) => {
          const isEven = i % 2 === 0
          return (
            <div
              key={node.label}
              data-timeline-item
              className="timeline-item relative grid md:grid-cols-2 gap-4 md:gap-14 items-start"
            >
              {/* 節點 icon */}
              <div className="absolute left-5 md:left-1/2 top-0 -translate-x-1/2 z-10">
                <div className="relative flex items-center justify-center">
                  <span className="absolute h-14 w-14 rounded-full bg-sandrift-300/15 blur-xl timeline-glow" />
                  <span className="absolute h-8 w-8 rounded-full bg-sandrift-400/15 blur-sm timeline-glow" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-sandrift-200/50 bg-sandrift-50/60 backdrop-blur-sm shadow-[0_2px_12px_rgba(176,141,98,0.12)]">
                    <Image
                      src={node.icon}
                      alt=""
                      width={28}
                      height={28}
                      className="opacity-65"
                    />
                  </div>
                </div>
              </div>

              {/* 橫向連接線 */}
              {/* Mobile: icon 右側延伸 */}
              <div className="absolute top-5.5 left-11 w-3 h-px md:hidden">
                <div className="h-full w-full bg-linear-to-r from-sandrift-300/40 to-transparent" />
              </div>
              {/* Desktop: 從 icon 延伸到內容側 */}
              <div
                className={`absolute top-5.5 hidden md:block h-px w-10 ${
                  isEven
                    ? 'right-[calc(50%+24px)]'
                    : 'left-[calc(50%+24px)]'
                }`}
              >
                <div
                  className={`h-full w-full ${
                    isEven
                      ? 'bg-linear-to-l from-sandrift-300/40 to-transparent'
                      : 'bg-linear-to-r from-sandrift-300/40 to-transparent'
                  }`}
                />
              </div>

              {/* 內容區塊 */}
              <div
                className={`pl-14 md:pl-0 ${
                  isEven
                    ? 'md:pr-14 md:text-right'
                    : 'md:col-start-2 md:pl-14'
                }`}
              >
                <span className="inline-block text-[10px] font-semibold uppercase tracking-[0.15em] text-sandrift-400/60 mb-1.5">
                  {node.label}
                </span>
                <h3 className="text-[17px] md:text-xl font-bold text-sandrift-900 mb-3">
                  {node.title}
                </h3>
                <div className="text-[13px] leading-[1.8] text-sandrift-600 space-y-2.5">
                  {node.content}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
