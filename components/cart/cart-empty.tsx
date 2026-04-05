import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export default function CartEmpty() {
  return (
    <div className="mx-auto max-w-sm px-4 py-14 md:py-20">
      <div className="rounded-3xl bg-sandrift-50/30 p-8 text-center ring-1 ring-sandrift-100/30">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-sandrift-50/60">
          <ShoppingBag className="h-8 w-8 text-sandrift-300" />
        </div>
        <h2 className="text-lg font-bold tracking-tight text-sandrift-950">
          購物車是空的
        </h2>
        <p className="mt-2 text-[13px] text-sandrift-400">
          快去挑選喜歡的商品吧
        </p>
        <Link
          href="/"
          className="mt-6 inline-block cursor-pointer rounded-xl bg-sandrift-500 px-6 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-sandrift-600"
        >
          去逛逛
        </Link>
      </div>
    </div>
  )
}
