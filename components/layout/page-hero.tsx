import Image from 'next/image'

interface PageHeroProps {
  title: string
  subtitle?: string
  /** 使用哪張浮水印裝飾圖（1-4），不傳則不顯示 */
  watermark?: 1 | 2 | 3 | 4
}

export default function PageHero({
  title,
  subtitle,
  watermark,
}: PageHeroProps) {
  return (
    <div className="relative overflow-hidden bg-linear-to-b from-sandrift-50/80 via-sandrift-50/30 to-transparent py-6 md:py-8">
      {/* 浮水印裝飾 */}
      {watermark && (
        <div className="pointer-events-none absolute -right-6 -top-6 h-44 w-44 opacity-[0.035] md:h-56 md:w-56">
          <Image
            src={`/images/watermark_${watermark}.png`}
            alt=""
            fill
            className="object-contain"
          />
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-xl font-bold tracking-tight text-sandrift-950 md:text-2xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-[13px] text-sandrift-400">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
