'use client'

import { useCallback, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Tab {
  key: string
  label: string
  count?: number
}

interface AdminTabsProps {
  tabs: Tab[]
  paramName?: string
}

export default function AdminTabs({ tabs, paramName = 'status' }: AdminTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const current = searchParams.get(paramName) ?? ''

  const handleTabClick = useCallback((key: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (key) {
        params.set(paramName, key)
      } else {
        params.delete(paramName)
      }
      params.delete('page')
      router.push(`?${params.toString()}`)
    })
  }, [router, searchParams, paramName, startTransition])

  return (
    <div className="flex gap-1 overflow-x-auto scrollbar-none -mx-1 px-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => handleTabClick(tab.key)}
          className={`cursor-pointer whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
            current === tab.key
              ? 'bg-sandrift-100/80 text-sandrift-900'
              : 'text-sandrift-400 hover:text-sandrift-600 hover:bg-sandrift-50/50'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`ml-1.5 text-xs ${current === tab.key ? 'text-sandrift-500' : 'text-sandrift-300'}`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
