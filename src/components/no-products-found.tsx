import { Search } from 'lucide-react'

export default function NoProductsFound() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-white/50 py-16 backdrop-blur-sm ring-1 ring-sandrift-100/40">
      <Search className="mb-4 h-12 w-12 text-sandrift-200" />
      <p className="text-[15px] font-medium text-sandrift-600">找不到符合的商品</p>
      <p className="mt-1 text-[13px] text-sandrift-300">試試其他關鍵字</p>
    </div>
  )
}
