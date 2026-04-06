'use client'

import { useCallback, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

interface AdminSearchProps {
  placeholder?: string
  paramName?: string
}

export default function AdminSearch({ placeholder = '搜尋...', paramName = 'q' }: AdminSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const [value, setValue] = useState(searchParams.get(paramName) ?? '')

  const handleSearch = useCallback((term: string) => {
    setValue(term)
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (term) {
        params.set(paramName, term)
      } else {
        params.delete(paramName)
      }
      params.delete('page')
      router.push(`?${params.toString()}`)
    })
  }, [router, searchParams, paramName, startTransition])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sandrift-300" />
      <input
        type="text"
        value={value}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-xl bg-white/60 pl-9 pr-4 text-sm text-sandrift-900 ring-1 ring-sandrift-200/30 placeholder:text-sandrift-300 focus:bg-white focus:ring-sandrift-300/50 focus:outline-none transition-all duration-200 sm:w-64"
      />
    </div>
  )
}
