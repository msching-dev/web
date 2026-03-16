import type { Metadata } from 'next'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: '購物車',
}

export default function CartPage() {
  return (
    <div className="animate-page-enter">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>首頁</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>購物車</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mx-auto max-w-sm px-4 sm:px-6 py-14 md:py-20">
        <div className="glass rounded-3xl p-8 text-center ring-1 ring-white/20">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-sandrift-50/60">
            <ShoppingBag className="h-8 w-8 text-sandrift-300" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-sandrift-950">
            購物車
          </h1>
          <p className="mt-2 text-[13px] text-sandrift-500">購物車功能即將推出</p>
          <p className="mt-1 text-[12px] text-sandrift-300">
            目前請透過 LINE 或 IG 私訊下單訂購
          </p>
          <Link
            href="/"
            className="mt-6 inline-block cursor-pointer rounded-xl bg-sandrift-500 px-6 py-2.5 text-[13px] font-medium text-white hover:bg-sandrift-600 transition-colors"
          >
            返回首頁
          </Link>
        </div>
      </div>
    </div>
  )
}
