import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export default function CartEmpty() {
  return (
    <div className="mx-auto max-w-sm px-4 py-14 md:py-20">
      <div className="relative">
        {/* 卡片外圍光暈 */}
        <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-linear-to-br from-sandrift-200/15 via-transparent to-sandrift-100/10 blur-2xl" />

        {/* 漸變邊框 */}
        <div className="relative rounded-[1.75rem] bg-linear-to-br from-sandrift-300/25 via-white/50 to-sandrift-200/15 p-px shadow-[0_8px_40px_rgba(176,141,98,0.08),0_2px_8px_rgba(0,0,0,0.03)]">
          <div className="relative overflow-hidden rounded-[calc(1.75rem-1px)] bg-white/75 backdrop-blur-2xl backdrop-saturate-150">
            {/* 頂部漸變裝飾帶 */}
            <div className="h-0.5 bg-linear-to-r from-sandrift-200/0 via-sandrift-400/40 to-sandrift-200/0" />

            {/* 幾何光影 */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-linear-to-br from-sandrift-100/25 to-transparent blur-2xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-linear-to-tr from-sandrift-50/30 to-transparent blur-2xl" />

            {/* 浮水印 */}
            <div className="pointer-events-none absolute -right-6 -bottom-6 h-36 w-36 opacity-[0.03]">
              <Image src="/images/watermark_1.png" alt="" fill className="object-contain" />
            </div>

            <div className="relative p-8 text-center sm:p-10">
              {/* 動畫圖示 */}
              <div className="mx-auto mb-5 flex h-16 w-16 animate-float items-center justify-center rounded-2xl bg-linear-to-br from-sandrift-50 to-sandrift-100/50">
                <ShoppingBag className="h-8 w-8 text-sandrift-400" strokeWidth={1.5} />
              </div>

              <h2 className="text-lg font-bold tracking-tight text-sandrift-950">
                購物車是空的
              </h2>
              <p className="mt-1.5 text-[13px] text-sandrift-400">
                逛逛我們的手作甜點，找到你喜歡的吧
              </p>

              {/* 漸層按鈕 + hover shine */}
              <Link
                href="/"
                className="group relative mt-7 inline-flex cursor-pointer items-center overflow-hidden rounded-xl bg-linear-to-r from-sandrift-500 to-sandrift-600 px-8 py-3 text-[13px] font-semibold text-white shadow-[0_2px_10px_rgba(176,141,98,0.25)] transition-all hover:from-sandrift-600 hover:to-sandrift-700 hover:shadow-[0_4px_16px_rgba(176,141,98,0.3)] active:scale-[0.98]"
              >
                <span className="relative z-10">探索商品</span>
                <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
