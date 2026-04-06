'use client'

import { useCallback, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface AdminPaginationProps {
  total: number
  pageSize?: number
}

export default function AdminPagination({ total, pageSize = 20 }: AdminPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const currentPage = Number(searchParams.get('page') ?? '1')
  const totalPages = Math.ceil(total / pageSize)

  const goToPage = useCallback((page: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (page > 1) {
        params.set('page', String(page))
      } else {
        params.delete('page')
      }
      router.push(`?${params.toString()}`)
    })
  }, [router, searchParams, startTransition])

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-sandrift-400">
        共 {total} 筆，第 {currentPage} / {totalPages} 頁
      </p>
      <div className="flex gap-1">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-sandrift-400 transition-all duration-200 hover:bg-sandrift-50 hover:text-sandrift-600 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-sandrift-400 transition-all duration-200 hover:bg-sandrift-50 hover:text-sandrift-600 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
