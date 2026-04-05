import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageHero from '@/components/layout/page-hero'

export const metadata: Metadata = {
  title: '訂單確認',
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <div className="animate-page-enter">
      <PageHero
        title="訂單確認"
      />

      <div className="mx-auto max-w-md px-4 sm:px-6 py-10 md:py-16">
        <div className="glass rounded-3xl p-6 md:p-8 text-center ring-1 ring-white/20">
          {/* Success icon */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50/80">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>

          <h1 className="text-xl font-bold tracking-tight text-sandrift-950">
            訂單已確認
          </h1>
          <p className="mt-1.5 text-[13px] text-sandrift-500">感謝您的訂購！</p>

          {/* Order details */}
          <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-sandrift-100/40">
            <div className="px-4 py-2.5 bg-sandrift-50/40">
              <h2 className="text-[13px] font-semibold text-sandrift-800">
                訂單資訊
              </h2>
            </div>
            <div className="divide-y divide-sandrift-100/40">
              {[
                { label: '訂單編號', value: slug },
                { label: '訂單金額', value: 'NT$123' },
                { label: '取貨方式', value: '全家超商取貨' },
                { label: '取貨門市', value: '龍騰門市' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between px-4 py-3 text-[13px]">
                  <span className="text-sandrift-400">{item.label}</span>
                  <span className="font-medium text-sandrift-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Button
              variant="outline"
              className="cursor-pointer rounded-xl border-sandrift-100 bg-white/60 text-[13px] text-sandrift-600 hover:bg-white"
              render={<Link href={`/order/${slug}`} />}
            >
              訂單查詢
            </Button>
            <Button
              className="cursor-pointer rounded-xl bg-sandrift-500 text-[13px] text-white hover:bg-sandrift-600 transition-colors"
              render={<Link href="/" />}
            >
              繼續購物
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
