import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export default function CartEmpty() {
  return (
    <div className="mx-auto max-w-sm px-4 py-12 md:py-16">
      <div className="relative overflow-hidden rounded-3xl bg-white/70 p-8 text-center ring-1 ring-sandrift-100/40 backdrop-blur-sm">
        {/* 浮水印裝飾 */}
        <div className="pointer-events-none absolute -right-6 -bottom-6 h-36 w-36 opacity-[0.035]">
          <Image src="/images/watermark_1.png" alt="" fill className="object-contain" />
        </div>

        {/* 動畫圖示 */}
        <div className="mx-auto mb-5 flex h-18 w-18 animate-float items-center justify-center rounded-2xl bg-linear-to-br from-sandrift-50 to-sandrift-100/60">
          <ShoppingBag className="h-9 w-9 text-sandrift-400" strokeWidth={1.5} />
        </div>

        <h2 className="text-lg font-bold tracking-tight text-sandrift-950">
          購物車是空的
        </h2>
        <p className="mt-2 text-[13px] leading-relaxed text-sandrift-400">
          逛逛我們的手作甜點，找到你喜歡的吧
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-sandrift-500 px-7 py-2.5 text-[13px] font-medium text-white shadow-sm transition-all hover:bg-sandrift-600 active:scale-[0.98]"
        >
          探索商品
        </Link>
      </div>
    </div>
  )
}
