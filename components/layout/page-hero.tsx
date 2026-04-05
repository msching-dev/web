import Image from 'next/image'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'

interface BreadcrumbEntry {
  label: string
  href?: string
}

interface PageHeroProps {
  breadcrumbs: BreadcrumbEntry[]
  title: string
  subtitle?: string
  /** 使用哪張浮水印裝飾圖（1-4），不傳則不顯示 */
  watermark?: 1 | 2 | 3 | 4
}

export default function PageHero({
  breadcrumbs,
  title,
  subtitle,
  watermark,
}: PageHeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-sandrift-50/80 via-sandrift-50/30 to-transparent pb-6 pt-5 md:pb-8">
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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 麵包屑 */}
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1
              return (
                <BreadcrumbItem key={crumb.label}>
                  {index > 0 && <BreadcrumbSeparator />}
                  {isLast ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      render={<Link href={crumb.href ?? '/'} />}
                    >
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>

        {/* 標題區 */}
        <div className="mt-4 text-center md:mt-5">
          <h1 className="text-xl font-bold tracking-tight text-sandrift-950 md:text-2xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-[13px] text-sandrift-400">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )
}
