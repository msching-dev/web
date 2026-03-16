'use client'

import { Search, X } from 'lucide-react'

interface ProductSearchProps {
  value: string
  onChange: (value: string) => void
  onClear: () => void
}

export default function ProductSearch({
  value,
  onChange,
  onClear,
}: ProductSearchProps) {
  return (
    <div className="relative w-full sm:max-w-[240px]">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sandrift-400" strokeWidth={1.5} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="搜尋商品..."
        className="h-9 w-full cursor-text rounded-xl bg-white/70 pl-9 pr-9 text-[13px] text-sandrift-900 ring-1 ring-sandrift-200/40 backdrop-blur-sm placeholder:text-sandrift-300 transition-all duration-200 focus:bg-white focus:ring-sandrift-300/60 focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-sandrift-100/80 text-sandrift-400 transition-colors hover:bg-sandrift-200/80"
          aria-label="清除搜尋"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
